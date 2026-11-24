import { forwardRef } from 'react';
import { Button } from '../ui/Button';
import { links, isConfigured } from '../config';

export const Hero = forwardRef<HTMLElement>(function Hero(_, ref) {
  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="h-hero">
      <div className="wrap center">
        {import.meta.env.DEV && !isConfigured() && (
          <div className="cfg" role="note">DEV ONLY: VITE_CONTACT_EMAIL is not set. Copy .env.example to .env.local. Production builds refuse to ship without it, so visitors never see this.</div>
        )}
        <div className="label reveal">Raw material market intelligence · for buyers and suppliers</div>
        <h1 id="h-hero" className="reveal">Know who makes it.<br />Know who buys it.</h1>
        <p className="lede reveal">Selqentra maps raw material markets on evidence. Buyers see who actually makes what they buy, who sits in between and where the savings are. Producers see which manufacturers use their material and who supplies them today.</p>
        <div className="ctas reveal">
          <Button href={links.demo()}>Book a free pilot</Button>
          <Button href="#sides" variant="ghost">For buyers and suppliers</Button>
        </div>
        <p className="proof reveal"><span><b>Savings and second sources</b></span><span><b>Qualified buyers</b></span><span><b>Manufacturer / distributor / trader</b></span><span>Plant-level evidence</span></p>
      </div>
    </section>
  );
});
