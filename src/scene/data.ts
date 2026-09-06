/** Deterministic procedural dataset: 150 records → 30 survivors. */
export const N = 150;
export const SURVIVORS = 30;          // 18 manufacturers, 8 traders/distributors, 4 unclear
export const N_UNSUPPORTED = 45;
export const N_DUP = 20;
export const N_SOURCES = 8;
export const N_PRODUCTS = 4;

export const KIND = { MFG: 0, TRADE: 1, UNCLEAR: 2, UNSUPPORTED: 3, DUP: 4, OFFLIST: 5 } as const;

function mulberry(seed: number) {
  let t = seed >>> 0;
  return () => { t += 0x6d2b79f5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; };
}

export interface RecordData {
  kind: Float32Array; conf: Float32Array; seed: Float32Array; stale: Float32Array;
  cloud: Float32Array; plane: Float32Array; lattice: Float32Array; mergeTo: Int16Array;
  survivorIndex: Int16Array; // -1 if not a survivor, else 0..29
}

export function buildRecords(count = N): RecordData {
  const rnd = mulberry(20260906);
  const kind = new Float32Array(count), conf = new Float32Array(count), seed = new Float32Array(count), stale = new Float32Array(count);
  const cloud = new Float32Array(count * 3), plane = new Float32Array(count * 3), lattice = new Float32Array(count * 3);
  const mergeTo = new Int16Array(count).fill(-1);
  const survivorIndex = new Int16Array(count).fill(-1);

  // scale populations for reduced counts on mobile
  const scale = count / N;
  const nSurv = SURVIVORS, nUns = Math.round(N_UNSUPPORTED * scale * 0.9), nDup = Math.round(N_DUP * scale);
  const nMfg = Math.round(nSurv * 0.6), nTrade = Math.round(nSurv * 0.27);

  const order: number[] = [];
  for (let i = 0; i < count; i++) order.push(i);
  for (let i = count - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }

  let c = 0; const survivors: number[] = [];
  for (let k = 0; k < nSurv; k++) { const i = order[c++]; kind[i] = k < nMfg ? KIND.MFG : k < nMfg + nTrade ? KIND.TRADE : KIND.UNCLEAR; survivors.push(i); }
  for (let k = 0; k < nUns; k++) kind[order[c++]] = KIND.UNSUPPORTED;
  for (let k = 0; k < nDup; k++) { const i = order[c++]; kind[i] = KIND.DUP; mergeTo[i] = survivors[Math.floor(rnd() * survivors.length)]; }
  while (c < count) kind[order[c++]] = KIND.OFFLIST;

  // lattice: cols x rows facing camera
  const cols = 6, rows = Math.ceil(nSurv / cols), sp = 0.62;
  survivors.forEach((i, k) => {
    survivorIndex[i] = k;
    const col = k % cols, row = Math.floor(k / cols);
    lattice[i * 3] = (col - (cols - 1) / 2) * sp;
    lattice[i * 3 + 1] = ((rows - 1) / 2 - row) * sp;
    lattice[i * 3 + 2] = 0;
  });

  for (let i = 0; i < count; i++) {
    seed[i] = rnd();
    const k = kind[i];
    conf[i] = k === KIND.MFG ? 0.82 + rnd() * 0.16 : k === KIND.TRADE ? 0.74 + rnd() * 0.2 : k === KIND.UNCLEAR ? 0.4 + rnd() * 0.22 : k === KIND.UNSUPPORTED ? 0.05 + rnd() * 0.2 : 0.3 + rnd() * 0.4;
    stale[i] = rnd() < 0.22 ? 1 : 0;

    // dispersed cloud: gaussian-ish blob, slightly flattened
    const u = rnd(), v = rnd(), w = rnd();
    const r = 2.3 * Math.cbrt(u), th = v * Math.PI * 2, ph = Math.acos(2 * w - 1);
    cloud[i * 3] = r * Math.sin(ph) * Math.cos(th) * 1.25;
    cloud[i * 3 + 1] = r * Math.cos(ph) * 0.8;
    cloud[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) * 0.9;

    // sorted state
    const jx = (rnd() - 0.5) * 3.4, jz = (rnd() - 0.5) * 2.2;
    if (k === KIND.MFG) { plane[i * 3] = jx; plane[i * 3 + 1] = 0.95 + (rnd() - 0.5) * 0.12; plane[i * 3 + 2] = jz; }
    else if (k === KIND.TRADE || k === KIND.OFFLIST) { plane[i * 3] = jx; plane[i * 3 + 1] = -0.95 + (rnd() - 0.5) * 0.12; plane[i * 3 + 2] = jz; }
    else if (k === KIND.UNCLEAR) { plane[i * 3] = jx * 0.7; plane[i * 3 + 1] = (rnd() - 0.5) * 0.5; plane[i * 3 + 2] = jz * 0.7; }
    else if (k === KIND.UNSUPPORTED) { // drift outward from cloud position
      const x = cloud[i * 3], y = cloud[i * 3 + 1], z = cloud[i * 3 + 2]; const len = Math.hypot(x, y, z) || 1;
      plane[i * 3] = x + (x / len) * 2.6; plane[i * 3 + 1] = y + (y / len) * 1.6; plane[i * 3 + 2] = z + (z / len) * 2.0;
    } else { // DUP: near its primary's plane spot, slightly offset
      const t = mergeTo[i]; plane[i * 3] = cloud[i * 3]; plane[i * 3 + 1] = cloud[i * 3 + 1]; plane[i * 3 + 2] = cloud[i * 3 + 2];
      // duplicates start close to their primary in the cloud as well
      cloud[i * 3] = cloud[t * 3] + (rnd() - 0.5) * 0.28; cloud[i * 3 + 1] = cloud[t * 3 + 1] + (rnd() - 0.5) * 0.28; cloud[i * 3 + 2] = cloud[t * 3 + 2] + (rnd() - 0.5) * 0.28;
      plane[i * 3] = cloud[i * 3]; plane[i * 3 + 1] = cloud[i * 3 + 1]; plane[i * 3 + 2] = cloud[i * 3 + 2];
    }
  }
  return { kind, conf, seed, stale, cloud, plane, lattice, mergeTo, survivorIndex };
}

/** Source nodes on a perimeter ring; product nodes in a small arc above. */
export function buildNodes() {
  const sources = new Float32Array(N_SOURCES * 3);
  for (let i = 0; i < N_SOURCES; i++) { const a = (i / N_SOURCES) * Math.PI * 2 + 0.3; sources[i * 3] = Math.cos(a) * 3.3; sources[i * 3 + 1] = Math.sin(a) * 1.9; sources[i * 3 + 2] = Math.sin(a * 2) * 0.6; }
  const products = new Float32Array(N_PRODUCTS * 3);
  for (let i = 0; i < N_PRODUCTS; i++) { const t = (i / (N_PRODUCTS - 1)) - 0.5; products[i * 3] = t * 2.4; products[i * 3 + 1] = 2.0; products[i * 3 + 2] = -0.4; }
  return { sources, products };
}
