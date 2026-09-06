import { useEffect, type RefObject } from 'react';

/** Adds .in to .reveal / .card / .product elements once they enter the viewport. */
export function useReveal(root: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = root.current; if (!el) return;
    const items = el.querySelectorAll<HTMLElement>('.reveal, .card, .product');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { items.forEach((i) => i.classList.add('in')); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.18 });
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, [root]);
}
