import { useEffect, useRef, useState } from 'react';
import { Nav } from './sections/Nav';
import { Hero } from './sections/Hero';
import { Walkthrough } from './sections/Walkthrough';
import { Problem } from './sections/Problem';
import { Sample } from './sections/Sample';
import { Receive } from './sections/Receive';
import { Pilot } from './sections/Pilot';
import { Fit, Method, Close } from './sections/Rest';
import { useLenis } from './hooks/useLenis';
import { useReveal } from './hooks/useReveal';
import { useReducedMotion } from './hooks/useReducedMotion';
import { links } from './config';

export default function App() {
  const reduced = useReducedMotion();
  const [showSticky, setShowSticky] = useState(false);
  useLenis(!reduced);
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  const hero = useRef<HTMLElement>(null), problem = useRef<HTMLElement>(null), sample = useRef<HTMLElement>(null), receive = useRef<HTMLElement>(null), pilot = useRef<HTMLElement>(null), fitR = useRef<HTMLElement>(null), methodR = useRef<HTMLElement>(null), closeR = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = hero.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting), { threshold: 0.05 });
    io.observe(el); return () => io.disconnect();
  }, []);

  return (
    <div ref={root}>
      <Nav />
      <main id="main">
        <Hero ref={hero} />
        <section className="walksec" aria-labelledby="h-walk">
          <div className="wrap center">
            <div className="label reveal">How a landscape is built</div>
            <h2 id="h-walk" className="h-l reveal">From the product you buy to the people who make it.</h2>
            <p className="lede reveal" style={{ marginTop: 18 }}>Scroll through one landscape end to end. Switch the sample product to see how the shape of the market changes.</p>
          </div>
          <div className="wrap"><Walkthrough active={!reduced} /></div>
        </section>
        <Problem ref={problem} />
        <Sample ref={sample} />
        <Receive ref={receive} />
        <Pilot ref={pilot} />
        <Fit ref={fitR} />
        <Method ref={methodR} />
        <Close ref={closeR} />
      </main>
      <div className={`sticky-cta ${showSticky ? 'show' : ''}`} aria-hidden={!showSticky}>
        <a className="btn primary sm" href={links.demo()}>Book a free pilot</a>
        <a className="btn ghost sm" href={links.sample()}>Sample</a>
      </div>
    </div>
  );
}
