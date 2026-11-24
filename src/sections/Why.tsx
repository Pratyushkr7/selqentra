import { forwardRef } from 'react';
import { why, hard, record } from '../content/copy';

export const Why = forwardRef<HTMLElement>(function Why(_, ref) {
  return (
    <section id="why" ref={ref} aria-labelledby="h-why">
      <div className="wrap">
        <div className="label reveal">Why look again</div>
        <h2 id="h-why" className="h-l reveal">Every good purchase starts with knowing who else can supply it.</h2>
        <p className="lede reveal" style={{ marginTop: 22 }}>Shifting demand and a riskier world mean supply bases get rebuilt more often than they used to. Buyers go back to the market for four reasons.</p>
        <div className="why" role="list">
          {why.map((w, i) => (
            <div className="whyi reveal" role="listitem" key={w.t} style={{ transitionDelay: `${i * 70}ms` }}>
              <h3>{w.t}</h3>
              <p>{w.d}</p>
            </div>
          ))}
        </div>
        <h3 className="h-m reveal" style={{ marginTop: 64 }}>Why it rarely gets done properly</h3>
        <div className="hard reveal">
          {hard.map((h) => (<div key={h.t}><b>{h.t}</b><p>{h.d}</p></div>))}
        </div>
        <p className="lede reveal" style={{ marginTop: 22 }}>So it slips behind the daily work, and that leaves money on the table and risk in the supply chain. Searching, checking and qualifying is the part we take off your desk.</p>
        <div className="record reveal" aria-label="Track record">
          {record.stats.map(([n, l]) => (<div key={l}><b>{n}</b><span>{l}</span></div>))}
        </div>
        <p className="record-note reveal">{record.note}</p>
      </div>
    </section>
  );
});
