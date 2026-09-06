import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * One contained diagram, six states, scrubbed by the steps beside it.
 * Twelve records: two duplicate pairs merge, two unsupported records drop away, the rest
 * classify into manufacturer and trader lanes, evidence links draw to public sources,
 * one link goes stale, and confidence rings fill. Nothing here is decoration.
 */
const O = '#FF5900', G = '#9C968E', G2 = '#6E6963', P = '#F3F0E9';
const W = 640, H = 360;
const LANE_M = 118, LANE_T = 250;
const SRC = [{ x: 486, y: 84, l: 'Product page' }, { x: 486, y: 172, l: 'Plant / registration' }, { x: 486, y: 260, l: 'Registry' }];

// initial scattered layout (deterministic)
const INIT = [
  [72, 150], [128, 232], [176, 116], [232, 190], [244, 202], [300, 128],
  [340, 246], [392, 152], [438, 214], [450, 226], [486, 118], [110, 92],
];
const MFG = [0, 3, 5, 7, 11]; // final manufacturer lane
const TRD = [2, 6, 8];         // final trader lane
const DUP: [number, number][] = [[4, 3], [9, 8]]; // secondary → primary
const UNS = [1, 10];
const CONF: Record<number, number> = { 0: 0.92, 3: 0.88, 5: 0.9, 7: 0.55, 11: 0.86 };
const CIRC = 2 * Math.PI * 12;

export function EvidenceDiagram({ stepsRef, active, onStep }: { stepsRef: React.RefObject<HTMLElement>; active: boolean; onStep: (i: number) => void }) {
  const svg = useRef<SVGSVGElement>(null);
  const state = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = svg.current; if (!root) return;
    const q = gsap.utils.selector(root);
    const laneX = (arr: number[]) => arr.map((_, k) => 96 + k * ((400 - 96) / Math.max(1, arr.length - 1)));
    const mx = laneX(MFG), tx = laneX(TRD);
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
    const labels = ['Identity', 'Role', 'Product', 'Production', 'Recency', 'Confidence'];
    const mark = (i: number) => () => { if (state.current) state.current.textContent = `0${i + 1} · ${labels[i]}`; onStep(i); };

    // 01 identity — duplicates merge, unsupported drop away
    tl.call(mark(0));
    DUP.forEach(([s, p]) => tl.to(q(`#r${s}`), { attr: { cx: INIT[p][0], cy: INIT[p][1] }, opacity: 0, duration: 1 }, 0));
    UNS.forEach((u) => tl.to(q(`#r${u}`), { attr: { cy: INIT[u][1] + 78 }, opacity: 0.22, duration: 1 }, 0));
    tl.to(q('#lbl-uns'), { opacity: 1, duration: 0.6 }, 0.4);
    // 02 role — sort into lanes
    tl.call(mark(1), undefined, 1.2);
    MFG.forEach((i, k) => tl.to(q(`#r${i}`), { attr: { cx: mx[k], cy: LANE_M }, duration: 1 }, 1.2));
    TRD.forEach((i, k) => tl.to(q(`#r${i}`), { attr: { cx: tx[k], cy: LANE_T }, fill: G, duration: 1 }, 1.2));
    tl.to(q('.lane'), { opacity: 1, duration: 0.6 }, 1.5);
    // 03 product — links from manufacturers to the product source
    tl.call(mark(2), undefined, 2.5);
    tl.to(q('.src'), { opacity: 1, duration: 0.5 }, 2.5);
    MFG.forEach((i, k) => tl.fromTo(q(`#l${i}a`), { attr: { x1: mx[k], y1: LANE_M, x2: mx[k], y2: LANE_M }, opacity: 1 }, { attr: { x2: SRC[0].x - 9, y2: SRC[0].y }, duration: 0.8 }, 2.6 + k * 0.08));
    // 04 production — links to plant/registration; traders link only to the registry, in grey
    tl.call(mark(3), undefined, 3.8);
    MFG.forEach((i, k) => tl.fromTo(q(`#l${i}b`), { attr: { x1: mx[k], y1: LANE_M, x2: mx[k], y2: LANE_M }, opacity: 1 }, { attr: { x2: SRC[1].x - 9, y2: SRC[1].y }, duration: 0.8 }, 3.9 + k * 0.08));
    TRD.forEach((i, k) => tl.fromTo(q(`#l${i}c`), { attr: { x1: tx[k], y1: LANE_T, x2: tx[k], y2: LANE_T }, opacity: 0.7 }, { attr: { x2: SRC[2].x - 9, y2: SRC[2].y }, duration: 0.8 }, 4.0 + k * 0.08));
    // 05 recency — one manufacturer's product link goes stale
    tl.call(mark(4), undefined, 5.1);
    tl.to(q('#l7a'), { stroke: G2, attr: { 'stroke-dasharray': '3 4' }, duration: 0.6 }, 5.1);
    tl.to(q('#lbl-stale'), { opacity: 1, duration: 0.5 }, 5.3);
    // 06 confidence — rings fill
    tl.call(mark(5), undefined, 6.2);
    MFG.forEach((i, k) => tl.fromTo(q(`#g${i}`), { attr: { cx: mx[k], cy: LANE_M }, opacity: 1, strokeDashoffset: CIRC }, { strokeDashoffset: CIRC * (1 - CONF[i]), duration: 0.9 }, 6.2 + k * 0.06));
    tl.to(q('#lbl-conf'), { opacity: 1, duration: 0.5 }, 6.6);
    tl.to({}, { duration: 0.4 });

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!active || reduced || !stepsRef.current) { tl.progress(1); return () => { tl.kill(); }; }
    const st = ScrollTrigger.create({ trigger: stepsRef.current, start: 'top 62%', end: 'bottom 62%', scrub: 0.4, animation: tl });
    return () => { st.kill(); tl.kill(); };
  }, [active, stepsRef, onStep]);

  return (
    <div className="diagram" aria-label="Evidence diagram: twelve records merging, classifying, linking to public sources and gaining confidence">
      <div className="dh"><span>Evidence test · 12 records</span><b ref={state as never}>01 · Identity</b></div>
      <svg ref={svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-hidden="true">
        <rect width={W} height={H} fill="#070706" />
        {/* lanes */}
        <g className="lane" opacity="0">
          <line x1="52" x2="430" y1={LANE_M} y2={LANE_M} stroke={G} strokeOpacity=".22" />
          <line x1="52" x2="430" y1={LANE_T} y2={LANE_T} stroke={G} strokeOpacity=".22" />
          <text x="52" y={LANE_M - 14} fill={O} fontFamily="'Plex Mono', ui-monospace, monospace" fontSize="9" letterSpacing="1.4">MANUFACTURER</text>
          <text x="52" y={LANE_T - 14} fill={G} fontFamily="'Plex Mono', ui-monospace, monospace" fontSize="9" letterSpacing="1.4">TRADER / DISTRIBUTOR</text>
        </g>
        {/* sources */}
        {SRC.map((s, i) => (
          <g key={i} className="src" opacity="0">
            <rect x={s.x - 6} y={s.y - 6} width="12" height="12" fill="#070706" stroke={P} strokeWidth="1.2" transform={`rotate(45 ${s.x} ${s.y})`} />
            <text x={s.x + 14} y={s.y + 3.5} fill={G} fontFamily="'Plex Mono', ui-monospace, monospace" fontSize="8.5" letterSpacing="1">{s.l.toUpperCase()}</text>
          </g>
        ))}
        {/* evidence links */}
        {MFG.map((i) => (<g key={i}><line id={`l${i}a`} x1={INIT[i][0]} y1={INIT[i][1]} x2={INIT[i][0]} y2={INIT[i][1]} stroke={O} strokeWidth="1" opacity="0" /><line id={`l${i}b`} x1={INIT[i][0]} y1={INIT[i][1]} x2={INIT[i][0]} y2={INIT[i][1]} stroke={O} strokeWidth="1" opacity="0" /></g>))}
        {TRD.map((i) => <line key={i} id={`l${i}c`} x1={INIT[i][0]} y1={INIT[i][1]} x2={INIT[i][0]} y2={INIT[i][1]} stroke={G} strokeWidth="1" opacity="0" />)}
        {/* confidence rings */}
        {MFG.map((i) => <circle key={i} id={`g${i}`} cx={INIT[i][0]} cy={INIT[i][1]} r="12" fill="none" stroke={i === 7 ? P : O} strokeWidth="1.4" strokeDasharray={CIRC} strokeDashoffset={CIRC} opacity="0" transform-origin="center" style={{ transformBox: 'fill-box', transform: 'rotate(-90deg)' }} />)}
        {/* records */}
        {INIT.map(([x, y], i) => <circle key={i} id={`r${i}`} cx={x} cy={y} r="5.4" fill={UNS.includes(i) ? G : i === 7 ? P : O} opacity={DUP.some(([s]) => s === i) ? 0.85 : 1} />)}
        {/* annotations */}
        <text id="lbl-uns" x="52" y={H - 22} fill={G} opacity="0" fontFamily="'Plex Mono', ui-monospace, monospace" fontSize="9" letterSpacing="1.2">2 UNSUPPORTED · 2 DUPLICATES MERGED</text>
        <text id="lbl-stale" x="300" y={H - 22} fill={G2} opacity="0" fontFamily="'Plex Mono', ui-monospace, monospace" fontSize="9" letterSpacing="1.2">1 STALE SOURCE</text>
        <text id="lbl-conf" x="448" y={H - 22} fill={O} opacity="0" fontFamily="'Plex Mono', ui-monospace, monospace" fontSize="9" letterSpacing="1.2">5 SCORED · 1 UNRESOLVED</text>
      </svg>
    </div>
  );
}
