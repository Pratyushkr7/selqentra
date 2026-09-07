import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Lenis smooth scroll wired to GSAP's ticker and ScrollTrigger, per the documented pattern. */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) { ScrollTrigger.refresh(); return; }
    const lenis = new Lenis({ smoothWheel: true, lerp: 0.1, wheelMultiplier: 0.95 });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    // anchor links
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return; const id = a.getAttribute('href')!; if (id.length < 2) return;
      const el = document.querySelector(id); if (!el) return;
      e.preventDefault(); lenis.scrollTo(el as HTMLElement, { offset: -20 });
    };
    document.addEventListener('click', onClick);
    ScrollTrigger.refresh();
    return () => { document.removeEventListener('click', onClick); gsap.ticker.remove(raf); lenis.destroy(); };
  }, [enabled]);
}
