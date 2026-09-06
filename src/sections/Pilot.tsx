import { forwardRef } from 'react';
import { pilot } from '../content/copy';
import { Button } from '../ui/Button';
import { links, config } from '../config';

export const Pilot = forwardRef<HTMLElement>(function Pilot(_, ref) {
  return (
    <section id="pilot" ref={ref} aria-labelledby="h-pilot">
      <div className="label reveal">05 — The founding pilot</div>
      <h2 id="h-pilot" className="big reveal">{config.pilot.records} records.<br />{config.pilot.hours} hours.<br />{config.pilot.price}.</h2>
      <p className="lede reveal" style={{ marginTop: 30 }}>One fixed price, one engagement, no subscription. Small enough to approve on a card. Large enough to tell you whether your dataset can be trusted.</p>
      <div className="cols3 reveal">
        <div className="col"><h4>You provide</h4><ul>{pilot.provide.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div className="col in"><h4 className="on">I deliver</h4><ul>{pilot.deliver.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div className="col ex"><h4>Not included</h4><ul>{pilot.exclude.map((x) => <li key={x}>{x}</li>)}</ul></div>
      </div>
      <div className="ctas reveal" style={{ marginTop: 44 }}>
        <Button href={links.start()}>Start the paid pilot</Button>
        <Button href={links.scope()} variant="ghost">Ask a scope question</Button>
      </div>
    </section>
  );
});
