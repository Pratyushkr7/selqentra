import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { Nav } from './sections/Nav';
import { Hero } from './sections/Hero';
import { Problem } from './sections/Problem';
import { System } from './sections/System';
import { Sample } from './sections/Sample';
import { Receive } from './sections/Receive';
import { Pilot } from './sections/Pilot';
import { Fit, Method, Close } from './sections/Rest';
import { Fallback } from './scene/Fallback';
import { useLenis } from './hooks/useLenis';
import { usePageProgress, useReveal, useStage } from './hooks/useStage';
import { useReducedMotion } from './hooks/useReducedMotion';
import { sceneStore, RESOLVED } from './scene/store';
import { links, config } from './config';
import type { Caps } from './scene/SceneCanvas';

const SceneCanvas = lazy(() => import('./scene/SceneCanvas'));

function detectWebGL(): boolean {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

export default function App() {
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [narrow, setNarrow] = useState(() => window.innerWidth < 1100);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => { setWebgl(detectWebGL()); }, []);
  useEffect(() => { const f = () => setNarrow(window.innerWidth < 1100); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);

  // lazy-load the 3D experience after first paint / idle
  useEffect(() => {
    if (reduced || webgl === false) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number; cancelIdleCallback?: (id: number) => void };
    let idle: number | undefined; let timer: number | undefined;
    if (w.requestIdleCallback) idle = w.requestIdleCallback(() => setReady(true)); else timer = window.setTimeout(() => setReady(true), 250);
    return () => { if (idle !== undefined && w.cancelIdleCallback) w.cancelIdleCallback(idle); if (timer !== undefined) window.clearTimeout(timer); };
  }, [reduced, webgl]);

  const live = !reduced && webgl !== false;
  useEffect(() => { if (!live) sceneStore.setAll(RESOLVED); }, [live]);

  const caps = useMemo<Caps>(() => {
    const mobile = window.innerWidth < 700;
    const lowPower = (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined && (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 4;
    const cores = navigator.hardwareConcurrency || 4;
    return { count: mobile ? 90 : 150, bloom: !mobile && !lowPower && cores >= 4, maxDpr: mobile ? 1 : 1.5 };
  }, []);

  useLenis(live);
  usePageProgress(live);

  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  const hero = useRef<HTMLElement>(null), problem = useRef<HTMLElement>(null), system = useRef<HTMLElement>(null), sample = useRef<HTMLElement>(null), receive = useRef<HTMLElement>(null), pilot = useRef<HTMLElement>(null), fitR = useRef<HTMLElement>(null), methodR = useRef<HTMLElement>(null), closeR = useRef<HTMLElement>(null);
  useStage('tint', problem, 'top 70%', 'bottom 70%', live);
  useStage('focus', sample, 'top 80%', 'top 20%', live);
  useStage('lattice', receive, 'top 85%', 'center center', live);
  useStage('lock', pilot, 'top 80%', 'center center', live);
  useStage('trace', methodR, 'top 80%', 'bottom 60%', live);

  // sticky CTA on small screens once hero has scrolled past
  useEffect(() => {
    const el = hero.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting), { threshold: 0.1 });
    io.observe(el); return () => io.disconnect();
  }, []);

  return (
    <div className="shell" ref={root}>
      <aside className="panel" aria-label="Visual model of the audit: an unverified dataset resolving into a verified matrix">
        {live && ready ? (
          <Suspense fallback={<Fallback label="Loading the audit model" />}><SceneCanvas caps={caps} /></Suspense>
        ) : (
          <Fallback />
        )}
        {!live && <div className="state" aria-hidden="true">Resolved · audit matrix</div>}
      </aside>

      <main className="content" id="main">
        <Nav />
        <Hero ref={hero} />
        <Problem ref={problem} />
        <System ref={system} active={live} />
        <Sample ref={sample} />
        <Receive ref={receive} />
        <Pilot ref={pilot} />
        <Fit ref={fitR} />
        <Method ref={methodR} />
        <Close ref={closeR} />
      </main>

      {narrow && (
        <div className={`sticky-cta ${showSticky ? 'show' : ''}`} aria-hidden={!showSticky}>
          <a className="btn primary sm" href={links.start()}>Start a {config.pilot.price} pilot</a>
          <a className="btn ghost sm" href={links.sample()}>Sample</a>
        </div>
      )}
    </div>
  );
}
