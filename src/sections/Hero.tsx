import { forwardRef } from 'react';
import { Button } from '../ui/Button';
import { links, config, isConfigured } from '../config';

export const Hero = forwardRef<HTMLElement>(function Hero(_, ref) {
  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="h-hero">
      {import.meta.env.DEV && !isConfigured() && (
        <div className="cfg" role="note">
          DEV ONLY — VITE_CONTACT_EMAIL is not set. Copy .env.example to .env.local. Production builds refuse to ship without it, so visitors never see this.
        </div>
      )}
      <div className="label reveal">Supplier data / independent verification</div>
      <h1 id="h-hero" className="reveal" style={{ marginTop: 22 }}>AI can find suppliers.<br />Can you prove they’re real?</h1>
      <p className="lede reveal">I audit AI-generated supplier data against public evidence — so your team can reduce false positives, expose unsupported claims, and ship results it can defend.</p>
      <div className="ctas reveal">
        <Button href={links.start()}>Start a {config.pilot.price} pilot</Button>
        <Button href={links.sample()} variant="ghost">Inspect a sample audit</Button>
      </div>
      <dl className="terms reveal">
        <div><dt className="label">Records</dt><dd className="n">{config.pilot.records}</dd></div>
        <div><dt className="label">Turnaround</dt><dd className="n">{config.pilot.hours} hours</dd></div>
        <div><dt className="label">Deliverable</dt><dd className="n" style={{ fontSize: 17 }}>Spreadsheet + executive PDF</dd></div>
        <div><dt className="label">Price</dt><dd className="n">{config.pilot.price} fixed</dd></div>
      </dl>
    </section>
  );
});
