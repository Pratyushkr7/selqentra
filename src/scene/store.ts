/** Named scene stages, each 0..1, each driven by its own ScrollTrigger on a DOM section. */
export type StageKey =
  | 'tint' | 'dim' | 'sort' | 'product' | 'evidence' | 'recency'
  | 'merge' | 'focus' | 'lattice' | 'lock' | 'trace' | 'page';

export type Stages = Record<StageKey, number>;

const stages: Stages = {
  tint: 0, dim: 0, sort: 0, product: 0, evidence: 0, recency: 0,
  merge: 0, focus: 0, lattice: 0, lock: 0, trace: 0, page: 0,
};

type Listener = (s: Stages) => void;
const listeners = new Set<Listener>();

export const sceneStore = {
  get: () => stages,
  set(key: StageKey, v: number) {
    const c = v < 0 ? 0 : v > 1 ? 1 : v;
    if (stages[key] === c) return;
    stages[key] = c;
    listeners.forEach((l) => l(stages));
  },
  setAll(v: Partial<Stages>) {
    Object.assign(stages, v);
    listeners.forEach((l) => l(stages));
  },
  subscribe(l: Listener) { listeners.add(l); return () => { listeners.delete(l); }; },
};

/** Fully resolved state — used by the static fallback and reduced-motion. */
export const RESOLVED: Stages = {
  tint: 1, dim: 1, sort: 1, product: 1, evidence: 1, recency: 1,
  merge: 1, focus: 1, lattice: 1, lock: 1, trace: 1, page: 1,
};
