import { forwardRef } from 'react';
import { Button } from '../ui/Button';
import { links } from '../config';
import { sides, record } from '../content/copy';

export const Sides = forwardRef<HTMLElement>(function Sides(_, ref) {
  return (
    <section id="sides" ref={ref} aria-labelledby="h-sides">
      <div className="wrap">
        <div className="label reveal">Two sides of one market</div>
        <h2 id="h-sides" className="h-l reveal">The same map pays off whether you buy the material or sell it.</h2>
        <p className="lede reveal" style={{ marginTop: 22 }}>Every raw material market has producers, resellers and the manufacturers who use the material. Once that map is built on evidence, a buyer can see where the margin and the risk sit, and a producer can see where the demand is.</p>
        <div className="roles sides">
          {sides.map((s, i) => (
            <div className={`role r${i} reveal`} key={s.t} style={{ transitionDelay: `${i * 90}ms` }}>
              <div className="rh"><span className="rk" /><h3>{s.t}</h3></div>
              <p className="sh">{s.h}</p>
              <p>{s.d}</p>
              <ul>{s.s.map((x) => <li key={x}>{x}</li>)}</ul>
              <div className="sides-cta"><Button href={links.demo()} variant={i === 0 ? undefined : 'ghost'}>{s.cta}</Button></div>
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
