import { forwardRef, useEffect, useRef, useState } from 'react';
import { failures } from '../content/copy';

export const Problem = forwardRef<HTMLElement>(function Problem(_, ref) {
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const [hot, setHot] = useState<number>(-1);
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setHot(Number((e.target as HTMLElement).dataset.i)); });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);
  return (
    <section id="problem" ref={ref} aria-labelledby="h-problem">
      <div className="label reveal">01 — The problem</div>
      <h2 id="h-problem" className="h-l reveal">A supplier name is not supplier evidence.</h2>
      <p className="lede reveal" style={{ marginTop: 22 }}>The same eight failures recur in almost every machine-built supplier dataset. None of them is visible from the record itself. All of them are visible from the evidence.</p>
      <div className="ledger reveal" role="table" aria-label="What was claimed versus what the evidence showed">
        <div className="hd" role="row"><span className="label" role="columnheader">Claimed in the record</span><span className="label" role="columnheader">What the evidence showed</span></div>
        {failures.map((f, i) => (
          <div key={i} className={`row ${hot === i ? 'hot' : ''}`} role="row" data-i={i} ref={(el) => { rows.current[i] = el; }}>
            <span className="c" role="cell">{f.claimed}</span>
            <span className="e" role="cell">{f.found}</span>
          </div>
        ))}
      </div>
      <p className="pull reveal">A list that cannot distinguish a producer from a trader is not a shortlist. It is a phone book.</p>
    </section>
  );
});
