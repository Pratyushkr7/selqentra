import { forwardRef } from 'react';
import { Button } from '../ui/Button';
import { links } from '../config';

export const Pilot = forwardRef<HTMLElement>(function Pilot(_, ref) {
  return (
    <section id="pilot" ref={ref} aria-labelledby="h-pilot">
      <div className="wrap">
        <div className="label reveal">05 — The free pilot</div>
        <h2 id="h-pilot" className="h-l reveal">Test the precision on a product you actually buy.</h2>
        <p className="lede reveal" style={{ marginTop: 22 }}>One product, fully worked, at no cost. You judge the landscape against what you already know. If it tells you something you didn't, we talk about the rest.</p>
        <div className="commercial reveal">
          <div className="top three">
            <div><span className="label">You bring</span><div className="bigt">One product you buy today</div><p>Name, CAS, grade or form, application, volume, destination. The SDS or TDS if you have it.</p></div>
            <div><span className="label on">You receive</span><div className="bigt">Its verified source landscape</div><p>Manufacturers, distributors and traders — classified on evidence, with the trade flows behind them and a recommendation.</p></div>
            <div><span className="label">Then</span><div className="bigt">A short call</div><p>We walk the map together. Further products are scoped and priced individually — every landscape is different.</p></div>
          </div>
          <div className="foot">
            <div className="ctas">
              <Button href={links.demo()}>Book a free pilot</Button>
              <Button href={links.question()} variant="ghost">Ask a question first</Button>
            </div>
            <p className="note">No outreach to suppliers on your behalf. No contact lists. Where public evidence does not support a call, the record says so.</p>
          </div>
        </div>
      </div>
    </section>
  );
});
