import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { pointVert, pointFrag } from './shaders';
import { Fallback } from './Fallback';

/**
 * Thirty records, scattered, resolving into a 6×5 verified matrix. Plays once when the module
 * scrolls into view, then holds with a barely-perceptible breath. One mechanism, one module.
 */
const N = 30, COLS = 6, ROWS = 5;
const ORANGE = new THREE.Color('#FF5900'), GREY = new THREE.Color('#9C968E'), PORC = new THREE.Color('#F3F0E9'), BLACK = new THREE.Color('#070706');
const sm = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function seeded(seed: number) { let t = seed >>> 0; return () => { t += 0x6d2b79f5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }

class Matrix {
  private renderer: THREE.WebGLRenderer; private scene = new THREE.Scene(); private camera: THREE.PerspectiveCamera;
  private geo = new THREE.BufferGeometry(); private pos = new Float32Array(N * 3); private col = new Float32Array(N * 3);
  private alpha = new Float32Array(N); private ring = new Float32Array(N); private size = new Float32Array(N);
  private start = new Float32Array(N * 3); private end = new Float32Array(N * 3); private conf = new Float32Array(N); private seed = new Float32Array(N); private unclear = new Uint8Array(N);
  private lines: THREE.LineSegments; private linePos: Float32Array;
  private raf = 0; private running = false; private t0 = 0; private progress = 0; private pointer = new THREE.Vector2(); private target = new THREE.Vector2();
  private clock = new THREE.Clock(); private mat: THREE.ShaderMaterial;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
    this.renderer.setClearColor(BLACK, 1);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1 : 1.5));
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50); this.camera.position.set(0, 0, 5.7);
    const rnd = seeded(20260906);
    const sp = 0.8;
    for (let i = 0; i < N; i++) {
      const c = i % COLS, r = Math.floor(i / COLS);
      this.end[i * 3] = (c - (COLS - 1) / 2) * sp * 1.3; this.end[i * 3 + 1] = ((ROWS - 1) / 2 - r) * sp * 0.82; this.end[i * 3 + 2] = 0;
      this.start[i * 3] = (rnd() - 0.5) * 7.2; this.start[i * 3 + 1] = (rnd() - 0.5) * 3.4; this.start[i * 3 + 2] = (rnd() - 0.5) * 2.5;
      this.seed[i] = rnd(); this.unclear[i] = rnd() < 0.14 ? 1 : 0; this.conf[i] = this.unclear[i] ? 0.42 + rnd() * 0.2 : 0.78 + rnd() * 0.2;
    }
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    this.geo.setAttribute('aColor', new THREE.BufferAttribute(this.col, 3));
    this.geo.setAttribute('aAlpha', new THREE.BufferAttribute(this.alpha, 1));
    this.geo.setAttribute('aRing', new THREE.BufferAttribute(this.ring, 1));
    this.geo.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1));
    this.mat = new THREE.ShaderMaterial({ vertexShader: pointVert, fragmentShader: pointFrag, transparent: true, depthWrite: false, uniforms: { uPixelRatio: { value: this.renderer.getPixelRatio() } } });
    const pts = new THREE.Points(this.geo, this.mat); pts.frustumCulled = false; this.scene.add(pts);
    // grid lines of the resolved matrix: rows only, drawn as the records settle
    const segs = ROWS; this.linePos = new Float32Array(segs * 6);
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(this.linePos, 3));
    this.lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: GREY, transparent: true, opacity: 0 })); this.scene.add(this.lines);
    this.resize();
  }
  play() { this.t0 = this.clock.getElapsedTime(); }
  private update() {
    const t = this.clock.getElapsedTime(); const el = t - this.t0;
    this.progress = sm(0.4, 3.6, el);
    this.pointer.lerp(this.target, 0.05);
    for (let i = 0; i < N; i++) {
      const d = this.seed[i] * 0.45; const p = sm(d, d + 0.55, this.progress); const i3 = i * 3;
      const jit = (1 - p) * 0.06; const s = this.seed[i];
      this.pos[i3] = lerp(this.start[i3], this.end[i3], p) + Math.sin(t * 0.8 + s * 40) * jit;
      this.pos[i3 + 1] = lerp(this.start[i3 + 1], this.end[i3 + 1], p) + Math.cos(t * 0.7 + s * 30) * jit;
      this.pos[i3 + 2] = lerp(this.start[i3 + 2], this.end[i3 + 2], p);
      const c = this.unclear[i] ? GREY : ORANGE; const mix = sm(0.6, 1, p);
      this.col[i3] = lerp(GREY.r, c.r, mix); this.col[i3 + 1] = lerp(GREY.g, c.g, mix); this.col[i3 + 2] = lerp(GREY.b, c.b, mix);
      if (this.unclear[i]) { this.col[i3] = lerp(GREY.r, PORC.r, mix * 0.5); this.col[i3 + 1] = lerp(GREY.g, PORC.g, mix * 0.5); this.col[i3 + 2] = lerp(GREY.b, PORC.b, mix * 0.5); }
      this.alpha[i] = 0.75 + 0.25 * p; this.ring[i] = sm(0.75, 1, p) * this.conf[i];
      this.size[i] = (10.5 + 3.5 * p) * (1 + Math.sin(t * 1.3 + s * 6) * 0.04 * p);
    }
    for (const k of ['position', 'aColor', 'aAlpha', 'aRing', 'aSize']) (this.geo.attributes[k] as THREE.BufferAttribute).needsUpdate = true;
    const sp = 0.8; const half = ((COLS - 1) / 2) * sp * 1.3 + 0.5;
    for (let r = 0; r < ROWS; r++) { const y = ((ROWS - 1) / 2 - r) * sp * 0.82; this.linePos.set([-half, y, -0.01, half, y, -0.01], r * 6); }
    (this.lines.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.lines.material as THREE.LineBasicMaterial).opacity = sm(0.85, 1, this.progress) * 0.22;
    this.camera.position.x = this.pointer.x * 0.25; this.camera.position.y = this.pointer.y * 0.15; this.camera.lookAt(0, 0, 0);
    this.renderer.render(this.scene, this.camera);
  }
  private tick = () => { if (!this.running) return; this.raf = requestAnimationFrame(this.tick); this.update(); };
  startLoop() { if (this.running) return; this.running = true; this.tick(); }
  stopLoop() { this.running = false; cancelAnimationFrame(this.raf); }
  setPointer(x: number, y: number) { this.target.set(x, y); }
  resize() { const c = this.renderer.domElement, w = c.clientWidth || 1, h = c.clientHeight || 1; this.renderer.setSize(w, h, false); this.camera.aspect = w / h; const halfW = ((COLS - 1) / 2) * 0.8 * 1.3 + 0.9; this.camera.position.z = Math.max(5.7, halfW / (Math.tan((30 / 2) * Math.PI / 180) * this.camera.aspect)); this.camera.updateProjectionMatrix(); this.mat.uniforms.uPixelRatio.value = this.renderer.getPixelRatio(); }
  dispose() { this.stopLoop(); this.geo.dispose(); this.mat.dispose(); this.lines.geometry.dispose(); (this.lines.material as THREE.Material).dispose(); this.renderer.dispose(); }
}

export default function HeroMatrix() {
  const ref = useRef<HTMLCanvasElement>(null); const [failed, setFailed] = useState(false); const [label, setLabel] = useState('Unverified records');
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return; let m: Matrix;
    try { m = new Matrix(canvas); } catch { setFailed(true); return; }
    let played = false;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { if (!played) { played = true; m.play(); setTimeout(() => setLabel('Verified matrix'), 3200); } m.startLoop(); } else m.stopLoop(); }, { threshold: 0.25 });
    io.observe(canvas);
    const onVis = () => (document.hidden ? m.stopLoop() : m.startLoop()); document.addEventListener('visibilitychange', onVis);
    const ro = new ResizeObserver(() => m.resize()); ro.observe(canvas);
    const fine = window.matchMedia('(pointer:fine)').matches;
    const onMove = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); m.setPointer(((e.clientX - r.left) / r.width - 0.5) * 2, -((e.clientY - r.top) / r.height - 0.5) * 2); };
    if (fine) canvas.addEventListener('pointermove', onMove, { passive: true });
    const onLost = (e: Event) => { e.preventDefault(); setFailed(true); }; canvas.addEventListener('webglcontextlost', onLost);
    return () => { io.disconnect(); ro.disconnect(); document.removeEventListener('visibilitychange', onVis); if (fine) canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('webglcontextlost', onLost); m.dispose(); };
  }, []);
  if (failed) return <Fallback />;
  return (<><canvas ref={ref} aria-hidden="true" /><div className="cap" aria-hidden="true"><b>{N}</b> · {label}</div></>);
}
