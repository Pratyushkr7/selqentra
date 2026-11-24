import { useEffect, useRef, useState } from 'react';
import { Nav } from './sections/Nav';
import { Hero } from './sections/Hero';
import { Walkthrough } from './sections/Walkthrough';
import { Problem } from './sections/Problem';
import { Why } from './sections/Why';
import { System } from './sections/System';
import { Sample } from './sections/Sample';
import { Receive } from './sections/Receive';
import { Pilot } from './sections/Pilot';
import { Fit, Close } from './sections/Rest';
import { useLenis } from './hooks/useLenis';
import { useReveal } from './hooks/useReveal';
import { useReducedMotion } from './hooks/useReducedMotion';
import { links } from './config';

function detectWebGL(): boolean {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

export default function App() {
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean>(true);
  useEffect(() => { setWebgl(detectWebGL()); }, []);
  const live = !reduced && webgl;
  const [showSticky, setShowSticky] = useState(false);
  useLenis(!reduced);
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  const hero = useRef<HTMLElement>(null), problem = useRef<HTMLElement>(null), sample = useRef<HTMLElement>(null), receive = useRef<HTMLElement>(null), pilot = useRef<HTMLElement>(null), fitR = useRef<HTMLElement>(null), closeR = useRef<HTMLElement>(null), whyR = useRef<HTMLElement>(null), systemR = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = hero.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting), { threshold: 0.05 });
    io.observe(el); return () => io.disconnect();
  }, []);

  return (
    <div ref={root}>
      <Nav />
      <main id="main">
        <Hero ref={hero} live={live} />
        <Why ref={whyR} />
        <section className="walksec" aria-labelledby="h-walk">
          <div className="wrap center">
            <div className="label reveal">How a landscape is built</div>
            <h2 id="h-walk" className="h-l reveal">From the material you buy to the people who make it.</h2>
            <p className="lede reveal" style={{ marginTop: 18 }}>Scroll through one real case end to end: a refined avocado oil brief, where independent research was checked against live supplier quotes. Volumes and shares are illustrative.</p>
          </div>
          <div className="wrap"><Walkthrough active={!reduced} /></div>
        </section>
        <Problem ref={problem} />
        <System ref={systemR} active={!reduced} />
        <Sample ref={sample} />
        <Receive ref={receive} />
        <Pilot ref={pilot} />
        <Fit ref={fitR} />
        <Close ref={closeR} />
      </main>
      <div className={`sticky-cta ${showSticky ? 'show' : ''}`} aria-hidden={!showSticky}>
        <a className="btn primary sm" href={links.demo()}>Book a free pilot</a>
        <a className="btn ghost sm" href={links.sample()}>Sample</a>
      </div>
    </div>
  );
}
