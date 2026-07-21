import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * Initialises Lenis smooth scrolling for the whole document and keeps a
 * ref to the instance so other parts of the app can lock/unlock scroll
 * (e.g. while the loading screen or a lightbox is open).
 *
 * Respects prefers-reduced-motion by disabling smoothing entirely.
 */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReduced,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;
    // Expose for imperative scrolls (e.g. the "replay" control).
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return lenisRef;
}
