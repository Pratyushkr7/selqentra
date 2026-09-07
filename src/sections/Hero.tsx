import { forwardRef } from 'react';
import { Button } from '../ui/Button';
import { links, isConfigured } from '../config';

export const Hero = forwardRef<HTMLElement>(function Hero(_, ref) {
  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="h-hero">
      <div className="wrap center">
        {import.meta.env.DEV && !isConfigured() && (
          <div className="cfg" role="note">DEV ONLY — VITE_CONTACT_EMAIL is not set. Copy .env.example to .env.local. Production builds refuse to ship without it, so visitors never see this.</div>
        )}
        <div className="label reveal">Supplier landscape intelligence · chemicals and raw materials</div>
        <h1 id="h-hero" className="reveal">Know who actually<br />makes it.</h1>
        <p className="lede reveal">Selqentra maps the real sources of supply for your chemical — and tells you which are manufacturers, which are distributors, and which are traders. Evidenced. Precise. Nothing else.</p>
        <div className="ctas reveal">
          <Button href={links.demo()}>Book a free pilot</Button>
          <Button href={links.sample()} variant="ghost">See a sample landscape</Button>
        </div>
        <p className="proof reveal"><span><b>Global trade flows</b></span><span><b>Producers by country</b></span><span><b>Manufacturer / distributor / trader</b></span><span>Plant-level evidence</span></p>
      </div>
    </section>
  );
});
