import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sceneStore, type StageKey } from '../scene/store';

gsap.registerPlugin(ScrollTrigger);

/** Drive one named scene stage 0→1 as the referenced element passes through the viewport. */
export function useStage(key: StageKey, ref: RefObject<HTMLElement>, start = 'top 75%', end = 'bottom 55%', active = true) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const st = ScrollTrigger.create({ trigger: ref.current, start, end, scrub: true, onUpdate: (self) => sceneStore.set(key, self.progress) });
    return () => st.kill();
  }, [key, ref, start, end, active]);
}

/** Whole-page progress for the camera rig. */
export function usePageProgress(active = true) {
  useEffect(() => {
    if (!active) return;
    const st = ScrollTrigger.create({ trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: (s) => sceneStore.set('page', s.progress) });
    return () => st.kill();
  }, [active]);
}

/** Reveal-on-enter for .reveal children (adds .in once). */
export function useReveal(root: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = root.current; if (!el) return;
    const items = el.querySelectorAll<HTMLElement>('.reveal');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { items.forEach((i) => i.classList.add('in')); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15 });
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, [root]);
}
