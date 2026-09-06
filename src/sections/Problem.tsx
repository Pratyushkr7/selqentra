import { forwardRef } from 'react';
import { failures } from '../content/copy';

export const Problem = forwardRef<HTMLElement>(function Problem(_, ref) {
  return (
    <>
      <section className="statement" aria-label="Statement">
        <div className="wrap center">
          <h2 className="h-xl reveal">A supplier name is <em>not</em> supplier evidence.</h2>
        </div>
      </section>
      <section id="problem" ref={ref} aria-labelledby="h-problem">
        <div className="wrap">
          <div className="label reveal">01 — The problem</div>
          <h2 id="h-problem" className="h-l reveal">The same eight failures, in almost every machine-built list.</h2>
          <p className="lede reveal" style={{ marginTop: 22 }}>None of them is visible from the record itself. All of them are visible from the evidence. Each card shows what the record claimed, and what checking it found.</p>
          <div className="cards" role="list">
            {failures.map((f, i) => (
              <div className="card" role="listitem" key={i} style={{ transitionDelay: `${(i % 4) * 60}ms` }}>
                <span className="k">Claimed</span>
                <span className="claim">{f.claimed}</span>
                <p className="found"><b>Found</b>{f.found}</p>
              </div>
            ))}
          </div>
          <p className="pull reveal">A list that cannot distinguish a producer from a trader is not a shortlist. It is a phone book.</p>
        </div>
      </section>
    </>
  );
});
