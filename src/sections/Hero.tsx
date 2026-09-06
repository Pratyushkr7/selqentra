import { forwardRef, lazy, Suspense } from 'react';
import { Button } from '../ui/Button';
import { links, config, isConfigured } from '../config';
import { Fallback } from '../scene/Fallback';

const HeroMatrix = lazy(() => import('../scene/HeroMatrix'));

export const Hero = forwardRef<HTMLElement, { live: boolean }>(function Hero({ live }, ref) {
  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="h-hero">
      <div className="wrap center">
        {import.meta.env.DEV && !isConfigured() && (
          <div className="cfg" role="note">DEV ONLY — VITE_CONTACT_EMAIL is not set. Copy .env.example to .env.local. Production builds refuse to ship without it, so visitors never see this.</div>
        )}
        <div className="label reveal">Supplier data / independent verification</div>
        <h1 id="h-hero" className="reveal">AI can build the list.<br /><span className="s">Selqentra shows what survives scrutiny.</span></h1>
        <p className="lede reveal">Independent evidence review for teams shipping AI-generated supplier data.</p>
        <div className="ctas reveal">
          <Button href={links.start()}>Start a {config.pilot.price} pilot</Button>
          <Button href={links.sample()} variant="ghost">Inspect a sample audit</Button>
        </div>
        <p className="proof reveal"><span><b>{config.pilot.records} records</b></span><span><b>{config.pilot.hours} hours</b></span><span><b>{config.pilot.price} fixed</b></span><span>Public-evidence review</span></p>
      </div>
      <div className="wrap">
        <div className="module reveal" aria-label="Thirty supplier records resolving into a verified matrix">
          <div className="mh"><span>Records → verified matrix</span><b>{config.pilot.records} records</b></div>
          <div className="matrix">
            {live ? <Suspense fallback={<Fallback />}><HeroMatrix /></Suspense> : <Fallback />}
          </div>
        </div>
      </div>
    </section>
  );
});
