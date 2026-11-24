import { forwardRef } from 'react';
import { why, record } from '../content/copy';

export const Why = forwardRef<HTMLElement>(function Why(_, ref) {
  return (
    <section id="why" ref={ref} aria-labelledby="h-why">
      <div className="wrap">
        <div className="label reveal">Why look again</div>
        <h2 id="h-why" className="h-l reveal">The suppliers you buy from today are not the whole market.</h2>
        <p className="lede reveal" style={{ marginTop: 22 }}>Buyers go back to the market for four reasons. Finding, checking and qualifying new producers is slow work full of searches and cold emails, so it is usually the first thing to slip behind the daily job. That part is what we take off your desk.</p>
        <div className="why" role="list">
          {why.map((w, i) => (
            <div className="whyi reveal" role="listitem" key={w.t} style={{ transitionDelay: `${i * 70}ms` }}>
              <h3>{w.t}</h3>
              <p>{w.d}</p>
            </div>
          ))}
        </div>
        <div className="record reveal" aria-label="Track record">
          {record.stats.map(([n, l]) => (<div key={l}><b>{n}</b><span>{l}</span></div>))}
        </div>
        <p className="record-note reveal">{record.note}</p>
      </div>
    </section>
  );
});
