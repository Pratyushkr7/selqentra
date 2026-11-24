import { forwardRef } from 'react';
import { failures, classes } from '../content/copy';

export const Problem = forwardRef<HTMLElement>(function Problem(_, ref) {
  return (
    <>
      <section className="statement" aria-label="Statement">
        <div className="wrap center">
          <h2 className="h-xl reveal">Most supplier lists are phone books. <em>Ours tells you who is on the other end.</em></h2>
        </div>
      </section>
      <section id="classes" ref={ref} aria-labelledby="h-classes">
        <div className="wrap">
          <div className="label reveal">01 · Who you are really buying from</div>
          <h2 id="h-classes" className="h-l reveal">Manufacturer, distributor, trader. Each is a different conversation.</h2>
          <p className="lede reveal" style={{ marginTop: 22 }}>On a website, all three look the same. In the evidence, they never do. Every company we find is placed in one of these columns, with the reasons why.</p>
          <div className="roles">
            {classes.map((c, i) => (
              <div className={`role r${i} reveal`} key={c.t} style={{ transitionDelay: `${i * 90}ms` }}>
                <div className="rh"><span className="rk" /><h3>{c.t}</h3></div>
                <p>{c.d}</p>
                <ul>{c.s.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
            ))}
          </div>
          <h3 className="h-m reveal" style={{ marginTop: 72 }}>Why most supplier lists mislead</h3>
          <p className="lede reveal" style={{ marginTop: 12, fontSize: 17 }}>What a supplier list said, and what checking it found.</p>
          <div className="cards" role="list">
            {failures.map((f, i) => (
              <div className="card" role="listitem" key={i} style={{ transitionDelay: `${(i % 4) * 60}ms` }}>
                <span className="k">Claimed</span>
                <span className="claim">{f.claimed}</span>
                <p className="found"><b>Found</b>{f.found}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
});
