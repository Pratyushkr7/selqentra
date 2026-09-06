import { forwardRef } from 'react';
import { pilot } from '../content/copy';
import { Button } from '../ui/Button';
import { links, config } from '../config';

export const Pilot = forwardRef<HTMLElement>(function Pilot(_, ref) {
  return (
    <section id="pilot" ref={ref} aria-labelledby="h-pilot">
      <div className="wrap">
        <div className="label reveal">05 — The founding pilot</div>
        <h2 id="h-pilot" className="h-l reveal">One fixed price. One engagement. No subscription.</h2>
        <p className="lede reveal" style={{ marginTop: 22 }}>Small enough to approve on a card. Large enough to tell you whether your dataset can be trusted.</p>
        <div className="commercial reveal">
          <div className="top">
            <div><span className="label">Records</span><div className="big">{config.pilot.records}</div></div>
            <div><span className="label">Hours</span><div className="big">{config.pilot.hours}</div></div>
            <div><span className="label">Fixed price</span><div className="big o">{config.pilot.price}</div></div>
          </div>
          <div className="cols3">
            <div className="col"><h4>You provide</h4><ul>{pilot.provide.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div className="col in"><h4 className="on">You receive</h4><ul>{pilot.deliver.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div className="col ex"><h4>Not included</h4><ul>{pilot.exclude.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
          <div className="foot">
            <div className="ctas">
              <Button href={links.start()}>Start the paid pilot</Button>
              <Button href={links.scope()} variant="ghost">Ask a scope question</Button>
            </div>
            <p className="note">Scope confirmed within one working day. The {config.pilot.hours}-hour clock starts when payment and records have both arrived.</p>
          </div>
        </div>
      </div>
    </section>
  );
});
