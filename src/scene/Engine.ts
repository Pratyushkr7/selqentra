import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { buildRecords, buildNodes, KIND, N_SOURCES, N_PRODUCTS } from './data';
import { sceneStore, type Stages } from './store';
import { pointVert, pointFrag, lineVert, lineFrag, planeVert, planeFrag, nodeVert, nodeFrag } from './shaders';

export interface EngineOptions { count: number; bloom: boolean; maxDpr: number; onReadout?: (r: Readout) => void }
export interface Readout { records: number; surviving: number; unresolved: number; state: string }

const C = {
  ground: new THREE.Color('#070A12'), steel: new THREE.Color('#8792A3'), text: new THREE.Color('#EEF1F6'),
  cobalt: new THREE.Color('#5577FF'), uv: new THREE.Color('#9277FF'), cyan: new THREE.Color('#62D9E8'), warn: new THREE.Color('#C4515A'),
};
const sm = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export class Engine {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private composer?: EffectComposer;
  private clock = new THREE.Clock();
  private raf = 0;
  private running = false;
  private stages: Stages = sceneStore.get();
  private unsub: () => void;
  private pointer = new THREE.Vector2();
  private pointerTarget = new THREE.Vector2();
  private readoutState = '';

  // records
  private rec = buildRecords(0);
  private count: number;
  private pos!: Float32Array; private col!: Float32Array; private alpha!: Float32Array; private ring!: Float32Array; private size!: Float32Array;
  private points!: THREE.Points;
  private pGeo!: THREE.BufferGeometry;

  // lines
  private lineGeo!: THREE.BufferGeometry;
  private linePos!: Float32Array; private lineDraw!: Float32Array; private lineAlpha!: Float32Array;
  private lineRecord!: Int16Array; private lineNode!: Int16Array; private lineIsProduct!: Uint8Array;
  private lineMat!: THREE.ShaderMaterial;
  private nLines = 0;

  // trace
  private traceGeo!: THREE.BufferGeometry; private traceDraw!: Float32Array; private traceOrder: number[] = [];

  // nodes & planes
  private nodes = buildNodes();
  private srcAlpha!: Float32Array; private prodAlpha!: Float32Array;
  private srcPts!: THREE.Points; private prodPts!: THREE.Points;
  private planeMat!: THREE.ShaderMaterial; private planeUp!: THREE.Mesh; private planeDown!: THREE.Mesh;

  private opts: EngineOptions;
  private scratch = new THREE.Vector3();

  constructor(canvas: HTMLCanvasElement, opts: EngineOptions) {
    this.opts = opts;
    this.count = opts.count;
    this.rec = buildRecords(opts.count);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: !opts.bloom, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setClearColor(C.ground, 1);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.maxDpr));
    this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
    this.camera.position.set(0, 0.6, 7.6);
    this.scene.fog = new THREE.Fog(C.ground, 8, 18);

    this.buildPoints();
    this.buildLines();
    this.buildNodesAndPlanes();
    this.buildTrace();

    if (opts.bloom) {
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.28, 0.45, 0.7);
      this.composer.addPass(bloom);
    }

    this.unsub = sceneStore.subscribe((s) => { this.stages = s; });
    this.resize();
  }

  // ---------- build ----------
  private buildPoints() {
    const n = this.count;
    this.pos = new Float32Array(n * 3); this.col = new Float32Array(n * 3); this.alpha = new Float32Array(n); this.ring = new Float32Array(n); this.size = new Float32Array(n);
    this.pGeo = new THREE.BufferGeometry();
    this.pGeo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    this.pGeo.setAttribute('aColor', new THREE.BufferAttribute(this.col, 3));
    this.pGeo.setAttribute('aAlpha', new THREE.BufferAttribute(this.alpha, 1));
    this.pGeo.setAttribute('aRing', new THREE.BufferAttribute(this.ring, 1));
    this.pGeo.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1));
    const mat = new THREE.ShaderMaterial({
      vertexShader: pointVert, fragmentShader: pointFrag, transparent: true, depthWrite: false, blending: THREE.NormalBlending,
      uniforms: { uPixelRatio: { value: this.renderer.getPixelRatio() } },
    });
    this.points = new THREE.Points(this.pGeo, mat);
    this.points.frustumCulled = false;
    this.scene.add(this.points);
  }

  private buildLines() {
    // survivors: 1 source line each (+ second for some), product lines for survivors and a handful of off-list traders (which fade)
    const rec = this.rec; const recs: number[] = []; const nodes: number[] = []; const isProd: number[] = [];
    let seedIdx = 0;
    for (let i = 0; i < this.count; i++) {
      const k = rec.kind[i];
      if (k === KIND.MFG || k === KIND.TRADE || k === KIND.UNCLEAR) {
        recs.push(i); nodes.push(Math.floor(rec.seed[i] * N_SOURCES)); isProd.push(0);
        recs.push(i); nodes.push(Math.floor(rec.seed[i] * N_PRODUCTS)); isProd.push(1);
      } else if (k === KIND.OFFLIST && (seedIdx++ % 9 === 0)) {
        recs.push(i); nodes.push(Math.floor(rec.seed[i] * N_PRODUCTS)); isProd.push(1); // mismatch lines that fade
      }
    }
    this.nLines = recs.length;
    this.lineRecord = Int16Array.from(recs); this.lineNode = Int16Array.from(nodes); this.lineIsProduct = Uint8Array.from(isProd);
    this.linePos = new Float32Array(this.nLines * 6);
    this.lineDraw = new Float32Array(this.nLines * 2); this.lineAlpha = new Float32Array(this.nLines * 2);
    const aT = new Float32Array(this.nLines * 2); const aStale = new Float32Array(this.nLines * 2);
    for (let l = 0; l < this.nLines; l++) { aT[l * 2] = 0; aT[l * 2 + 1] = 1; const s = rec.stale[recs[l]]; aStale[l * 2] = s; aStale[l * 2 + 1] = s; }
    this.lineGeo = new THREE.BufferGeometry();
    this.lineGeo.setAttribute('position', new THREE.BufferAttribute(this.linePos, 3));
    this.lineGeo.setAttribute('aT', new THREE.BufferAttribute(aT, 1));
    this.lineGeo.setAttribute('aStale', new THREE.BufferAttribute(aStale, 1));
    this.lineGeo.setAttribute('aDraw', new THREE.BufferAttribute(this.lineDraw, 1));
    this.lineGeo.setAttribute('aAlpha', new THREE.BufferAttribute(this.lineAlpha, 1));
    this.lineMat = new THREE.ShaderMaterial({
      vertexShader: lineVert, fragmentShader: lineFrag, transparent: true, depthWrite: false,
      uniforms: { uCobalt: { value: C.cobalt }, uSteel: { value: C.steel }, uCyan: { value: C.cyan }, uRecency: { value: 0 } },
    });
    const lines = new THREE.LineSegments(this.lineGeo, this.lineMat); lines.frustumCulled = false; this.scene.add(lines);
  }

  private buildNodesAndPlanes() {
    const mk = (arr: Float32Array, color: THREE.Color) => {
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
      const a = new Float32Array(arr.length / 3); g.setAttribute('aAlpha', new THREE.BufferAttribute(a, 1));
      const m = new THREE.ShaderMaterial({ vertexShader: nodeVert, fragmentShader: nodeFrag, transparent: true, depthWrite: false, uniforms: { uColor: { value: color }, uPixelRatio: { value: this.renderer.getPixelRatio() } } });
      const p = new THREE.Points(g, m); p.frustumCulled = false; this.scene.add(p); return { p, a };
    };
    const s = mk(this.nodes.sources, C.cyan); this.srcPts = s.p; this.srcAlpha = s.a;
    const p = mk(this.nodes.products, C.uv); this.prodPts = p.p; this.prodAlpha = p.a;

    this.planeMat = new THREE.ShaderMaterial({ vertexShader: planeVert, fragmentShader: planeFrag, transparent: true, depthWrite: false, side: THREE.DoubleSide, uniforms: { uOpacity: { value: 0 }, uColor: { value: C.steel } } });
    const geo = new THREE.PlaneGeometry(4.2, 2.6);
    this.planeUp = new THREE.Mesh(geo, this.planeMat); this.planeUp.rotation.x = -Math.PI / 2; this.planeUp.position.y = 0.95;
    this.planeDown = new THREE.Mesh(geo, this.planeMat); this.planeDown.rotation.x = -Math.PI / 2; this.planeDown.position.y = -0.95;
    this.scene.add(this.planeUp, this.planeDown);
  }

  private buildTrace() {
    // reading-order path through the lattice survivors
    const idx: number[] = [];
    for (let i = 0; i < this.count; i++) if (this.rec.survivorIndex[i] >= 0) idx.push(i);
    idx.sort((a, b) => this.rec.survivorIndex[a] - this.rec.survivorIndex[b]);
    this.traceOrder = idx;
    const segs = Math.max(0, idx.length - 1);
    const pos = new Float32Array(segs * 6); this.traceDraw = new Float32Array(segs * 2);
    const aT = new Float32Array(segs * 2), aStale = new Float32Array(segs * 2), aAlpha = new Float32Array(segs * 2).fill(1);
    for (let l = 0; l < segs; l++) { aT[l * 2] = 0; aT[l * 2 + 1] = 1; }
    this.traceGeo = new THREE.BufferGeometry();
    this.traceGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.traceGeo.setAttribute('aT', new THREE.BufferAttribute(aT, 1));
    this.traceGeo.setAttribute('aStale', new THREE.BufferAttribute(aStale, 1));
    this.traceGeo.setAttribute('aDraw', new THREE.BufferAttribute(this.traceDraw, 1));
    this.traceGeo.setAttribute('aAlpha', new THREE.BufferAttribute(aAlpha, 1));
    const m = this.lineMat.clone(); m.uniforms.uRecency.value = 0;
    const t = new THREE.LineSegments(this.traceGeo, m); t.frustumCulled = false; this.scene.add(t);
  }

  // ---------- per frame ----------
  private update(t: number) {
    const S = this.stages; const rec = this.rec; const n = this.count;
    const jitter = 1 - S.sort;
    const lattice = S.lattice;
    const focus = S.focus;

    let surviving = 0, unresolved = 0, records = 0;
    for (let i = 0; i < n; i++) {
      const k = rec.kind[i]; const i3 = i * 3; const sd = rec.seed[i];
      // base: cloud with gentle jitter
      const jx = Math.sin(t * 0.7 + sd * 37.0) * 0.09 * jitter, jy = Math.cos(t * 0.6 + sd * 51.0) * 0.07 * jitter, jz = Math.sin(t * 0.5 + sd * 23.0) * 0.08 * jitter;
      let x = rec.cloud[i3] + jx, y = rec.cloud[i3 + 1] + jy, z = rec.cloud[i3 + 2] + jz;
      let a = 0.85, ringV = 0, sz = 10.5;
      let cr = lerp(C.steel.r, C.text.r, 0.3), cg = lerp(C.steel.g, C.text.g, 0.3), cb = lerp(C.steel.b, C.text.b, 0.3);

      if (k === KIND.UNSUPPORTED) {
        const d = S.dim;
        x = lerp(x, rec.plane[i3], d); y = lerp(y, rec.plane[i3 + 1], d); z = lerp(z, rec.plane[i3 + 2], d);
        a = lerp(0.8, 0.14, d) * (1 - focus * 0.9);
        // tint stage: some unsupported flash the warn colour
        const tint = S.tint * (sd > 0.5 ? 1 : 0) * (1 - d);
        cr = lerp(cr, C.warn.r, tint); cg = lerp(cg, C.warn.g, tint); cb = lerp(cb, C.warn.b, tint);
        sz = 9.0;
      } else if (k === KIND.DUP) {
        const tgt = rec.mergeTo[i];
        // follow own cloud pos until merge, then collapse onto the primary's current position (approximate with primary's plane/lattice)
        const m = S.merge;
        const px = lerp(rec.plane[tgt * 3], rec.lattice[tgt * 3], lattice), py = lerp(rec.plane[tgt * 3 + 1], rec.lattice[tgt * 3 + 1], lattice), pz = lerp(rec.plane[tgt * 3 + 2], rec.lattice[tgt * 3 + 2], lattice);
        const sx = lerp(x, rec.plane[i3], S.sort) + (1 - m) * 0.22, sy = lerp(y, rec.plane[i3 + 1], S.sort), sz2 = lerp(z, rec.plane[i3 + 2], S.sort);
        x = lerp(sx, px, m); y = lerp(sy, py, m); z = lerp(sz2, pz, m);
        const flick = 0.75 + 0.25 * Math.sin(t * 3.2 + sd * 40.0) * jitter;
        a = flick * (1 - m) * (1 - S.dim * 0.15);
        const tint = S.tint * (sd < 0.5 ? 1 : 0) * (1 - m);
        cr = lerp(cr, C.uv.r, tint); cg = lerp(cg, C.uv.g, tint); cb = lerp(cb, C.uv.b, tint);
        sz = 9.4;
      } else if (k === KIND.OFFLIST) {
        x = lerp(x, rec.plane[i3], S.sort); y = lerp(y, rec.plane[i3 + 1], S.sort); z = lerp(z, rec.plane[i3 + 2], S.sort);
        a = 0.7 * (1 - focus * 0.88);
        sz = 9.4;
      } else { // survivors
        x = lerp(x, rec.plane[i3], S.sort); y = lerp(y, rec.plane[i3 + 1], S.sort); z = lerp(z, rec.plane[i3 + 2], S.sort);
        x = lerp(x, rec.lattice[i3], lattice); y = lerp(y, rec.lattice[i3 + 1], lattice); z = lerp(z, rec.lattice[i3 + 2], lattice);
        const ev = S.evidence, rg = S.merge; // rings appear with merge/confidence stage
        const target = k === KIND.UNCLEAR ? C.uv : C.cobalt;
        const mix = Math.max(ev, focus);
        cr = lerp(cr, target.r, mix); cg = lerp(cg, target.g, mix); cb = lerp(cb, target.b, mix);
        ringV = rg * rec.conf[i];
        a = 0.9 + focus * 0.1;
        sz = 11.5 + focus * 3.0 + lattice * 1.5;
        // lock: breathing
        const br = 1 + Math.sin(t * 1.4 + sd * 6.0) * 0.06 * S.lock;
        sz *= br;
        surviving++; if (k === KIND.UNCLEAR) unresolved++;
      }
      this.pos[i3] = x; this.pos[i3 + 1] = y; this.pos[i3 + 2] = z;
      this.col[i3] = cr; this.col[i3 + 1] = cg; this.col[i3 + 2] = cb;
      this.alpha[i] = a; this.ring[i] = ringV; this.size[i] = sz;
      if (a > 0.3) records++;
    }
    (this.pGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.pGeo.attributes.aColor as THREE.BufferAttribute).needsUpdate = true;
    (this.pGeo.attributes.aAlpha as THREE.BufferAttribute).needsUpdate = true;
    (this.pGeo.attributes.aRing as THREE.BufferAttribute).needsUpdate = true;
    (this.pGeo.attributes.aSize as THREE.BufferAttribute).needsUpdate = true;

    // lines
    const srcAlpha = S.evidence * (1 - focus * 0.75) * (1 - lattice);
    const prodAlpha = S.product * (1 - S.evidence * 0.7) * (1 - focus);
    for (let l = 0; l < this.nLines; l++) {
      const r = this.lineRecord[l], nd = this.lineNode[l], isP = this.lineIsProduct[l] === 1;
      const src = isP ? this.nodes.products : this.nodes.sources;
      const l6 = l * 6;
      this.linePos[l6] = this.pos[r * 3]; this.linePos[l6 + 1] = this.pos[r * 3 + 1]; this.linePos[l6 + 2] = this.pos[r * 3 + 2];
      this.linePos[l6 + 3] = src[nd * 3]; this.linePos[l6 + 4] = src[nd * 3 + 1]; this.linePos[l6 + 5] = src[nd * 3 + 2];
      const stagger = this.rec.seed[r] * 0.35;
      const draw = isP ? sm(stagger, stagger + 0.65, S.product) : sm(stagger, stagger + 0.65, S.evidence);
      let al = isP ? prodAlpha : srcAlpha;
      if (isP && this.rec.kind[r] === KIND.OFFLIST) al *= (1 - sm(0.5, 1, S.product)); // mismatch lines draw then fade
      this.lineDraw[l * 2] = draw; this.lineDraw[l * 2 + 1] = draw; this.lineAlpha[l * 2] = al; this.lineAlpha[l * 2 + 1] = al;
    }
    (this.lineGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.lineGeo.attributes.aDraw as THREE.BufferAttribute).needsUpdate = true;
    (this.lineGeo.attributes.aAlpha as THREE.BufferAttribute).needsUpdate = true;
    this.lineMat.uniforms.uRecency.value = S.recency;

    // nodes & planes
    for (let i = 0; i < N_SOURCES; i++) this.srcAlpha[i] = sm(i / N_SOURCES * 0.5, i / N_SOURCES * 0.5 + 0.5, S.evidence) * (1 - focus);
    for (let i = 0; i < N_PRODUCTS; i++) this.prodAlpha[i] = S.product * (1 - S.evidence * 0.5) * (1 - focus);
    (this.srcPts.geometry.attributes.aAlpha as THREE.BufferAttribute).needsUpdate = true;
    (this.prodPts.geometry.attributes.aAlpha as THREE.BufferAttribute).needsUpdate = true;
    this.planeMat.uniforms.uOpacity.value = S.sort * (1 - focus) * 0.55;

    // trace
    const segs = this.traceOrder.length - 1;
    const tp = this.traceGeo.attributes.position as THREE.BufferAttribute;
    for (let l = 0; l < segs; l++) {
      const a = this.traceOrder[l], b = this.traceOrder[l + 1];
      tp.setXYZ(l * 2, this.pos[a * 3], this.pos[a * 3 + 1], this.pos[a * 3 + 2]);
      tp.setXYZ(l * 2 + 1, this.pos[b * 3], this.pos[b * 3 + 1], this.pos[b * 3 + 2]);
      const wraps = this.rec.survivorIndex[b] % 6 === 0; // don't draw the diagonal back to the next row
      const d = wraps ? 0 : sm(l / segs, (l + 1) / segs, S.trace) * lattice;
      this.traceDraw[l * 2] = d; this.traceDraw[l * 2 + 1] = d;
    }
    tp.needsUpdate = true; (this.traceGeo.attributes.aDraw as THREE.BufferAttribute).needsUpdate = true;

    // camera
    this.updateCamera(t);

    // readout
    const shown = Math.round(lerp(n, surviving, Math.max(S.dim * 0.35, focus)));
    const state = S.lock > 0.5 ? 'RESOLVED · AUDIT MATRIX' : lattice > 0.2 ? 'ALIGNING' : focus > 0.2 ? 'SHORTLIST' : S.merge > 0.2 ? 'CONFIDENCE' : S.evidence > 0.2 ? 'EVIDENCE' : S.product > 0.2 ? 'PRODUCT MATCH' : S.sort > 0.2 ? 'CLASSIFYING' : S.dim > 0.2 ? 'IDENTITY' : 'UNVERIFIED DATASET';
    if (this.opts.onReadout && (state !== this.readoutState || (Math.floor(t * 10) % 3 === 0))) {
      this.readoutState = state;
      this.opts.onReadout({ records: shown, surviving, unresolved: Math.round(unresolved * Math.max(S.merge, lattice)), state });
    }
  }

  private updateCamera(t: number) {
    const S = this.stages; const p = S.page;
    // keyframes on page progress
    const kf = [
      { p: 0.0, pos: [0.0, 0.5, 9.2], look: [0, 0.1, 0] },
      { p: 0.25, pos: [2.6, 1.9, 8.6], look: [0, 0.0, 0] },
      { p: 0.5, pos: [-2.2, 1.5, 8.9], look: [0, 0.0, 0] },
      { p: 0.7, pos: [0.0, 0.6, 10.2], look: [0, 0.0, 0] },
      { p: 0.85, pos: [0.0, 0.0, 7.0], look: [0, 0.0, 0] },
      { p: 1.0, pos: [0.0, 0.0, 6.8], look: [0, 0.0, 0] },
    ];
    let a = kf[0], b = kf[kf.length - 1];
    for (let i = 0; i < kf.length - 1; i++) if (p >= kf[i].p && p <= kf[i + 1].p) { a = kf[i]; b = kf[i + 1]; break; }
    const tt = sm(a.p, b.p, p);
    const orbit = (1 - S.sort) * 0.16 * Math.sin(t * 0.18);
    const px = lerp(a.pos[0], b.pos[0], tt) + orbit * 3 + this.pointer.x * 0.35;
    const py = lerp(a.pos[1], b.pos[1], tt) + this.pointer.y * 0.22;
    const pz = lerp(a.pos[2], b.pos[2], tt);
    this.camera.position.set(px, py, pz);
    this.scratch.set(lerp(a.look[0], b.look[0], tt), lerp(a.look[1], b.look[1], tt), lerp(a.look[2], b.look[2], tt));
    this.camera.lookAt(this.scratch);
  }

  // ---------- loop / io ----------
  private tick = () => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.tick);
    const t = this.clock.getElapsedTime();
    this.pointer.lerp(this.pointerTarget, 0.06);
    this.update(t);
    if (this.composer) this.composer.render(); else this.renderer.render(this.scene, this.camera);
  };

  start() { if (this.running) return; this.running = true; this.clock.start(); this.tick(); }
  stop() { this.running = false; cancelAnimationFrame(this.raf); }
  renderOnce() { this.update(this.clock.getElapsedTime()); if (this.composer) this.composer.render(); else this.renderer.render(this.scene, this.camera); }

  setPointer(nx: number, ny: number) { this.pointerTarget.set(nx, ny); }

  resize() {
    const c = this.renderer.domElement; const w = c.clientWidth || 1, h = c.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.composer?.setSize(w, h);
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    const pr = this.renderer.getPixelRatio();
    (this.points.material as THREE.ShaderMaterial).uniforms.uPixelRatio.value = pr;
    (this.srcPts.material as THREE.ShaderMaterial).uniforms.uPixelRatio.value = pr;
    (this.prodPts.material as THREE.ShaderMaterial).uniforms.uPixelRatio.value = pr;
  }

  dispose() {
    this.stop(); this.unsub();
    this.scene.traverse((o) => { const m = o as THREE.Mesh; m.geometry?.dispose(); const mat = m.material as THREE.Material | undefined; mat?.dispose(); });
    this.composer?.dispose(); this.renderer.dispose();
  }
}
