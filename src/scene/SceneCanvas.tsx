import { useEffect, useRef, useState } from 'react';
import { Engine, type Readout } from './Engine';
import { Fallback } from './Fallback';

export interface Caps { count: number; bloom: boolean; maxDpr: number }

export function SceneCanvas({ caps }: { caps: Caps }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ro, setRo] = useState<Readout>({ records: caps.count, surviving: 0, unresolved: 0, state: 'UNVERIFIED DATASET' });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    let engine: Engine;
    try { engine = new Engine(canvas, { ...caps, onReadout: setRo }); } catch { setFailed(true); return; }
    engine.start();
    const onLost = (e: Event) => { e.preventDefault(); engine.stop(); setFailed(true); };
    canvas.addEventListener('webglcontextlost', onLost);

    const onVis = () => (document.hidden ? engine.stop() : engine.start());
    document.addEventListener('visibilitychange', onVis);
    const resize = new ResizeObserver(() => engine.resize()); resize.observe(canvas);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? engine.start() : engine.stop()), { threshold: 0 });
    io.observe(canvas);
    const onMove = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); engine.setPointer(((e.clientX - r.left) / r.width - 0.5) * 2, -((e.clientY - r.top) / r.height - 0.5) * 2); };
    const fine = window.matchMedia('(pointer:fine)').matches;
    if (fine) window.addEventListener('pointermove', onMove, { passive: true });

    return () => { canvas.removeEventListener('webglcontextlost', onLost); document.removeEventListener('visibilitychange', onVis); resize.disconnect(); io.disconnect(); if (fine) window.removeEventListener('pointermove', onMove); engine.dispose(); };
  }, [caps]);

  if (failed) return <><Fallback /><div className="state" aria-hidden="true">Resolved · audit matrix</div></>;
  return (
    <>
      <canvas ref={ref} aria-hidden="true" />
      <div className="state" aria-hidden="true">{ro.state}</div>
      <div className="readout" aria-live="off" aria-hidden="true">
        <div className="row"><span className="k">Records</span><span className="v">{ro.records}</span></div>
        <div className="row"><span className="k">Surviving</span><span className={`v ${ro.surviving && ro.records <= ro.surviving + 2 ? 'on' : ''}`}>{ro.surviving}</span></div>
        <div className="row"><span className="k">Unresolved</span><span className="v">{ro.unresolved}</span></div>
      </div>
    </>
  );
}
export default SceneCanvas;
