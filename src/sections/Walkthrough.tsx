import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { briefs, COUNTRIES, CHIPS, CLASS_NAME, type Cls } from '../content/briefs';
import { stages } from '../content/copy';

gsap.registerPlugin(ScrollTrigger);

const W = 960, H = 520;
const px = (lon: number) => 40 + ((lon + 170) / 330) * 880;
const py = (lat: number) => 30 + ((72 - lat) / 112) * 440;
const LANE_Y: Record<Cls, number> = { M: 96, D: 196, T: 296 };
const ORDER: Cls[] = ['M', 'D', 'T'];
const MONO = "'Plex Mono', ui-monospace, monospace";

export function Walkthrough({ active }: { active: boolean }) {
  const [briefId, setBriefId] = useState(briefs[0].id);
  const [stage, setStage] = useState(0);
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.innerWidth < 900);
  useEffect(() => { const f = () => setNarrow(window.innerWidth < 900); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
  const brief = useMemo(() => briefs.find((b) => b.id === briefId)!, [briefId]);
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const dom = useRef<HTMLDivElement>(null);

  // producer nodes: id, class, country, ring position, lane position
  const nodes = useMemo(() => {
    const out: { id: string; c: Cls; cc: string; rx: number; ry: number; lx: number; ly: number }[] = [];
    const perClass: Record<Cls, number> = { M: 0, D: 0, T: 0 };
    brief.producers.forEach((p) => p.classes.forEach((c) => perClass[c]++));
    const laneIdx: Record<Cls, number> = { M: 0, D: 0, T: 0 };
    brief.producers.forEach((p) => {
      const c0 = COUNTRIES[p.cc]; const cx = px(c0.lon), cy = py(c0.lat); const n = p.classes.length;
      p.classes.forEach((c, k) => {
        const a = (k / n) * Math.PI * 2 - Math.PI / 2; const r = 30 + (k % 2) * 14;
        const cnt = perClass[c]; const i = laneIdx[c]++;
        const lx = 230 + (cnt === 1 ? 300 : (i / (cnt - 1)) * 640);
        out.push({ id: `${p.cc}${k}`, c, cc: p.cc, rx: cx + Math.cos(a) * r, ry: cy + Math.sin(a) * r * 0.75, lx, ly: LANE_Y[c] });
      });
    });
    return out;
  }, [brief]);
  const counts = useMemo(() => nodes.reduce((m, n) => { m[n.c]++; return m; }, { M: 0, D: 0, T: 0 } as Record<Cls, number>), [nodes]);

  useEffect(() => {
    const s = svg.current, d = dom.current; if (!s || !d) return;
    const q = gsap.utils.selector(s), qd = gsap.utils.selector(d);
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' }, onUpdate: () => setStage(Math.min(4, Math.floor(tl.time()))) });
    const setStageAt = (_i: number, _t: number) => tl;

    // ---- 01 brief
    setStageAt(0, 0);
    tl.fromTo(qd('.bf b'), { color: '#9C968E' }, { color: '#F3F0E9', duration: 0.3, stagger: 0.07 }, 0.05);
    tl.to(q('.grat'), { opacity: 0.35, duration: 0.8 }, 0.2);
    tl.to(q('.dest'), { opacity: 1, duration: 0.4 }, 0.6);
    // ---- 02 trade flows
    setStageAt(1, 1);
    tl.to(qd('.briefcard'), { opacity: 0, y: -8, duration: 0.35 }, 1);
    tl.to(q('.grat'), { opacity: 1, duration: 0.5 }, 1);
    brief.exporters.forEach((e, i) => {
      tl.fromTo(q(`#c-${e.cc}`), { attr: { r: 0 }, opacity: 0 }, { attr: { r: 5 + e.share * 26 }, opacity: 1, duration: 0.6 }, 1.05 + i * 0.08);
      tl.fromTo(q(`#a-${e.cc}`), { strokeDashoffset: 1200, opacity: 0 }, { strokeDashoffset: 0, opacity: 0.35 + e.share * 0.6, duration: 0.9 }, 1.15 + i * 0.08);
      tl.fromTo(q(`#t-${e.cc}`), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.4 + i * 0.08);
    });
    tl.to(q('#flowlabel'), { opacity: 1, duration: 0.3 }, 1.7);
    // ---- 03 producers
    setStageAt(2, 2);
    tl.to(q('.arc'), { opacity: 0.08, duration: 0.5 }, 2);
    tl.to(q('.exp-minor'), { opacity: 0.25, duration: 0.5 }, 2);
    tl.to(q('#flowlabel'), { opacity: 0, duration: 0.3 }, 2);
    nodes.forEach((n, i) => tl.fromTo(q(`#n-${n.id}`), { attr: { cx: px(COUNTRIES[n.cc].lon), cy: py(COUNTRIES[n.cc].lat), r: 0 }, opacity: 0 }, { attr: { cx: n.rx, cy: n.ry, r: 4.2 }, opacity: 1, duration: 0.6 }, 2.05 + i * 0.045));
    brief.producers.forEach((p, i) => tl.fromTo(q(`#cnt-${p.cc}`), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 2.5 + i * 0.1));
    // ---- 04 classification
    setStageAt(3, 3);
    tl.to(q('.grat, .country, .cnt, .arc, .dest'), { opacity: 0, duration: 0.5 }, 3);
    tl.to(q('.lane'), { opacity: 1, duration: 0.5 }, 3.1);
    nodes.forEach((n, i) => tl.to(q(`#n-${n.id}`), { attr: { cx: n.lx, cy: n.ly, r: 5.2 }, fill: n.c === 'M' ? '#FF5900' : n.c === 'D' ? '#F3F0E9' : '#9C968E', duration: 0.8 }, 3.15 + i * 0.03));
    ORDER.forEach((c, i) => tl.fromTo(q(`.chip-${c}`), { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.08 }, 3.6 + i * 0.12));
    // ---- 05 source map
    setStageAt(4, 4);
    tl.to(q('.evchip'), { opacity: 0, duration: 0.3 }, 4);
    tl.to(q('.lane-line'), { attr: { x2: 560 }, duration: 0.6 }, 4);
    nodes.forEach((n) => tl.to(q(`#n-${n.id}`), { attr: { cx: 230 + ((n.lx - 230) / 640) * 320 }, duration: 0.7 }, 4.05));
    tl.fromTo(qd('.result'), { opacity: 0, x: 14 }, { opacity: 1, x: 0, duration: 0.6 }, 4.3);
    tl.to({}, { duration: 0.5 });

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!active || reduced || !root.current) { tl.progress(1); setStage(4); return () => { tl.kill(); }; }
    const st = ScrollTrigger.create({ trigger: root.current, start: 'top top+=70', end: 'bottom bottom', scrub: 0.4, animation: tl });
    return () => { st.kill(); tl.kill(); };
  }, [brief, nodes, active]);

  // parallax on pointer (fine pointers only)
  useEffect(() => {
    const s = svg.current; if (!s || !window.matchMedia('(pointer:fine)').matches) return;
    const lay = s.querySelectorAll<SVGGElement>('.plx');
    const onMove = (e: PointerEvent) => { const r = s.getBoundingClientRect(); const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5; lay.forEach((g) => { const k = Number(g.dataset.k || 1); gsap.to(g, { x: nx * 10 * k, y: ny * 6 * k, duration: 0.8, ease: 'power2.out', overwrite: 'auto' }); }); };
    const parent = s.parentElement!; parent.addEventListener('pointermove', onMove, { passive: true });
    return () => parent.removeEventListener('pointermove', onMove);
  }, []);

  const dest = COUNTRIES[brief.destination]; const dx = px(dest.lon), dy = py(dest.lat);
  const topCC = new Set(brief.producers.map((p) => p.cc));

  return (
    <div className="walk" ref={root}>
      <div className="walk-sticky">
        <div className="module deep" aria-label="Walkthrough: from product brief to verified source map">
          <div className="mh">
            <span>Walkthrough · <b>{stages[stage].n} {stages[stage].t}</b></span>
            <div className="briefs" role="tablist" aria-label="Sample product briefs">
              {briefs.map((b) => <button key={b.id} role="tab" aria-selected={briefId === b.id} className="chipbtn" onClick={() => setBriefId(b.id)}>{b.label}</button>)}
            </div>
          </div>
          <div className="stagewrap">
            <svg ref={svg} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio={narrow ? 'xMidYMid slice' : 'xMidYMid meet'} aria-hidden="true">
              <defs>
                <radialGradient id="ember" cx="50%" cy="50%" r="60%"><stop offset="0" stopColor="#351309" stopOpacity=".9" /><stop offset="1" stopColor="#070706" stopOpacity="0" /></radialGradient>
                <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope=".06" /></feComponentTransfer></filter>
              </defs>
              <rect width={W} height={H} fill="#070706" />
              <ellipse cx={W * 0.62} cy={H * 0.45} rx={W * 0.5} ry={H * 0.55} fill="url(#ember)" />
              <rect width={W} height={H} filter="url(#grain)" opacity=".5" />
              {/* graticule */}
              <g className="grat plx" data-k="0.4" opacity="0.12">
                {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lon) => <line key={lon} x1={px(lon)} x2={px(lon)} y1={30} y2={470} stroke="#9C968E" strokeOpacity=".28" />)}
                {[60, 30, 0, -30].map((lat) => <line key={lat} x1={40} x2={920} y1={py(lat)} y2={py(lat)} stroke="#9C968E" strokeOpacity=".28" />)}
                {Object.entries(COUNTRIES).map(([cc, c]) => <g key={cc}><circle cx={px(c.lon)} cy={py(c.lat)} r="1.6" fill="#9C968E" opacity=".6" /><text x={px(c.lon) + 5} y={py(c.lat) - 4} fill="#9C968E" opacity=".45" fontFamily={MONO} fontSize="7.5" letterSpacing="1">{cc}</text></g>)}
              </g>
              {/* arcs */}
              <g className="plx" data-k="0.7">
                {brief.exporters.map((e) => { const c = COUNTRIES[e.cc]; const x1 = px(c.lon), y1 = py(c.lat); const mx = (x1 + dx) / 2, my = Math.min(y1, dy) - Math.abs(x1 - dx) * 0.22 - 20; return <path key={e.cc} id={`a-${e.cc}`} className="arc" d={`M ${x1} ${y1} Q ${mx} ${my} ${dx} ${dy}`} fill="none" stroke="#FF5900" strokeWidth="1.1" strokeDasharray="1200" strokeDashoffset="1200" opacity="0" />; })}
              </g>
              {/* countries */}
              <g className="plx" data-k="1">
                {brief.exporters.map((e) => { const c = COUNTRIES[e.cc]; const minor = !topCC.has(e.cc); return (
                  <g key={e.cc} className={`country ${minor ? 'exp-minor' : ''}`}>
                    <circle id={`c-${e.cc}`} cx={px(c.lon)} cy={py(c.lat)} r="0" fill="#FF5900" fillOpacity=".16" stroke="#FF5900" strokeWidth="1" opacity="0" />
                    <text id={`t-${e.cc}`} x={px(c.lon) > 700 ? px(c.lon) - 8 - e.share * 26 : px(c.lon) + 8 + e.share * 26} y={py(c.lat) + 4} textAnchor={px(c.lon) > 700 ? 'end' : 'start'} fill="#F3F0E9" fontFamily={MONO} fontSize="10.5" letterSpacing="1" opacity="0">{c.name.toUpperCase()} <tspan fill="#FF5900">{Math.round(e.share * 100)}%</tspan></text>
                  </g>); })}
                <g className="dest" opacity="0">
                  <rect x={dx - 6} y={dy - 6} width="12" height="12" fill="#070706" stroke="#F3F0E9" strokeWidth="1.2" transform={`rotate(45 ${dx} ${dy})`} />
                  <text x={dx + 12} y={dy - 10} fill="#9C968E" fontFamily={MONO} fontSize="9.5" letterSpacing="1.2">DELIVERY · {dest.name.toUpperCase()}</text>
                </g>
                <text id="flowlabel" x="40" y={H - 18} fill="#9C968E" fontFamily={MONO} fontSize="9.5" letterSpacing="1.4" opacity="0">EXPORT SHARE BY COUNTRY · ILLUSTRATIVE FLOWS, NOT LIVE TRADE DATA</text>
                {brief.producers.map((p) => { const c = COUNTRIES[p.cc]; return <text key={p.cc} id={`cnt-${p.cc}`} className="cnt" x={px(c.lon) - 50} y={py(c.lat) + 56} fill="#9C968E" fontFamily={MONO} fontSize="9.5" letterSpacing="1.2" opacity="0">{p.classes.length} CANDIDATES</text>; })}
              </g>
              {/* lanes */}
              <g className="lane" opacity="0">
                {ORDER.map((c) => (
                  <g key={c}>
                    <line className="lane-line" x1="200" x2="900" y1={LANE_Y[c]} y2={LANE_Y[c]} stroke="#9C968E" strokeOpacity=".25" />
                    <text x="40" y={LANE_Y[c] + 4} fill={c === 'M' ? '#FF5900' : c === 'D' ? '#F3F0E9' : '#9C968E'} fontFamily={MONO} fontSize="10.5" letterSpacing="1.4">{CLASS_NAME[c].toUpperCase()}</text>
                    {CHIPS[c].map((ch, k) => <text key={ch} className={`evchip chip-${c}`} x="200" y={LANE_Y[c] - 46 + k * 13} fill="#9C968E" fontFamily={MONO} fontSize="9" letterSpacing="1" opacity="0">· {ch.toUpperCase()}</text>)}
                  </g>
                ))}
              </g>
              {/* producer nodes */}
              <g className="plx" data-k="1.2">
                {nodes.map((n) => <circle key={n.id} id={`n-${n.id}`} cx={n.rx} cy={n.ry} r="0" fill="#F3F0E9" opacity="0" />)}
              </g>
            </svg>

            <div ref={dom} className="overlays">
              <div className="briefcard">
                <div className="label on">Product brief</div>
                {brief.fields.map(([k, v]) => <div className="bf" key={k}><span>{k}</span><b>{v}</b></div>)}
              </div>
              <div className="result" aria-live="polite">
                <div className="label on">Verified Source Map · illustrative</div>
                <div className="rt">{brief.fields[0][1]}</div>
                <div className="rc"><b>{nodes.length}</b><span>sources identified</span></div>
                <div className="rrow"><i className="m" /><span>{counts.M} manufacturers</span></div>
                <div className="rrow"><i className="d" /><span>{counts.D} distributors</span></div>
                <div className="rrow"><i className="t" /><span>{counts.T} traders</span></div>
                <p>Approach the {counts.M} manufacturers first — {brief.producers[0] && COUNTRIES[brief.producers[0].cc].name} and {brief.producers[1] && COUNTRIES[brief.producers[1].cc].name} hold the plant-level evidence. Keep the distributors as a channel for trial volumes.</p>
              </div>
              <div className="stagecard" key={stage}>
                <div className="label">{stages[stage].n} · {stages[stage].t}</div>
                <h3>{stages[stage].q}</h3>
                <p>{stages[stage].d}</p>
              </div>
            </div>
          </div>
        </div>
        <ol className="stagerail" aria-label="Stages">
          {stages.map((s, i) => <li key={s.n} className={i === stage ? 'on' : i < stage ? 'done' : ''}><span className="mono">{s.n}</span> {s.t}</li>)}
        </ol>
      </div>
    </div>
  );
}
