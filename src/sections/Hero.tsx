import { forwardRef, lazy, Suspense } from 'react';
import { Button } from '../ui/Button';
import { links, isConfigured } from '../config';
import { Fallback } from '../scene/Fallback';

const HeroMatrix = lazy(() => import('../scene/HeroMatrix'));

export const Hero = forwardRef<HTMLElement, { live: boolean }>(function Hero({ live }, ref) {
  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="h-hero">
      <div className="wrap center">
        {import.meta.env.DEV && !isConfigured() && (
          <div className="cfg" role="note">DEV ONLY: VITE_CONTACT_EMAIL is not set. Copy .env.example to .env.local. Production builds refuse to ship without it, so visitors never see this.</div>
        )}
        <div className="label reveal">Supplier discovery · chemicals and raw materials</div>
        <h1 id="h-hero" className="reveal">Know who actually<br />makes it.</h1>
        <p className="lede reveal">Selqentra finds the companies that can supply your raw material and tells you which ones make it, which only resell it, and what the evidence says. You negotiate with the source, qualify a second supplier and stop paying for a margin you can't see.</p>
        <div className="ctas reveal">
          <Button href={links.demo()}>Book a free pilot</Button>
          <Button href={links.sample()} variant="ghost">See a sample landscape</Button>
        </div>
        <p className="proof reveal"><span><b>Savings</b></span><span><b>Second sources</b></span><span><b>Manufacturer / distributor / trader</b></span><span>Plant-level evidence</span></p>
      </div>
      <div className="wrap">
        <div className="module reveal" aria-label="Thirty supplier records resolving into a verified matrix">
          <div className="mh"><span>Supplier records → verified matrix</span><b>30 records</b></div>
          <div className="matrix">
            {live ? <Suspense fallback={<Fallback />}><HeroMatrix /></Suspense> : <Fallback />}
          </div>
        </div>
      </div>
    </section>
  );
});
