import { forwardRef } from 'react';
import { Button } from '../ui/Button';
import { links } from '../config';

export const Pilot = forwardRef<HTMLElement>(function Pilot(_, ref) {
  return (
    <section id="pilot" ref={ref} aria-labelledby="h-pilot">
      <div className="wrap">
        <div className="label reveal">04 · Free pilot</div>
        <h2 id="h-pilot" className="h-l reveal">Test it on a material you actually buy.</h2>
        <p className="lede reveal" style={{ marginTop: 22 }}>One material, fully worked, at no cost. You judge the map against what you already know. If it shows you a saving or a second source you didn't have, we talk about the rest.</p>
        <div className="commercial reveal">
          <div className="top three">
            <div><span className="label">You bring</span><div className="bigt">One material you buy today</div><p>Name, CAS, grade or form, application, volume and destination. The SDS or TDS if you have it.</p></div>
            <div><span className="label on">You receive</span><div className="bigt">Its verified source landscape</div><p>Producers, distributors and traders, classified on evidence, with the trade flows behind them and a recommendation on where the savings are.</p></div>
            <div><span className="label">Then</span><div className="bigt">A short call</div><p>We walk the map together. Further work is scoped individually, because every market is different.</p></div>
          </div>
          <div className="foot">
            <div className="ctas">
              <Button href={links.demo()}>Book a free pilot</Button>
              <Button href={links.question()} variant="ghost">Ask a question first</Button>
            </div>
            <p className="note">Your request stays confidential. Nothing goes to any supplier until you decide.</p>
          </div>
        </div>
      </div>
    </section>
  );
});
