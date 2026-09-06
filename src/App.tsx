import { useEffect, useRef, useState } from 'react';
import { Nav } from './sections/Nav';
import { Hero } from './sections/Hero';
import { Problem } from './sections/Problem';
import { System } from './sections/System';
import { Sample } from './sections/Sample';
import { Receive } from './sections/Receive';
import { Pilot } from './sections/Pilot';
import { Fit, Method, Close } from './sections/Rest';
import { useLenis } from './hooks/useLenis';
import { useReveal } from './hooks/useReveal';
import { useReducedMotion } from './hooks/useReducedMotion';
import { links, config } from './config';

function detectWebGL(): boolean {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

export default function App() {
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean>(true);
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => { setWebgl(detectWebGL()); }, []);
  const live = !reduced && webgl;

  useLenis(!reduced);
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  const hero = useRef<HTMLElement>(null), problem = useRef<HTMLElement>(null), system = useRef<HTMLElement>(null), sample = useRef<HTMLElement>(null), receive = useRef<HTMLElement>(null), pilot = useRef<HTMLElement>(null), fitR = useRef<HTMLElement>(null), methodR = useRef<HTMLElement>(null), closeR = useRef<HTMLElement>(null);

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
        <Problem ref={problem} />
        <System ref={system} active={!reduced} />
        <Sample ref={sample} />
        <Receive ref={receive} />
        <Pilot ref={pilot} />
        <Fit ref={fitR} />
        <Method ref={methodR} />
        <Close ref={closeR} />
      </main>
      <div className={`sticky-cta ${showSticky ? 'show' : ''}`} aria-hidden={!showSticky}>
        <a className="btn primary sm" href={links.start()}>Start a {config.pilot.price} pilot</a>
        <a className="btn ghost sm" href={links.sample()}>Sample</a>
      </div>
    </div>
  );
}
