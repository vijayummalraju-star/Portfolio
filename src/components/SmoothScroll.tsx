import { useEffect } from 'react';
import Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

/**
 * Buttery cinematic smooth-scroll (Lenis) + silky anchor navigation.
 * - One shared ease curve, ~1.15s glide, GPU-friendly raf loop
 * - Intercepts in-page anchors and glides via lenis.scrollTo with navbar offset
 * - Respects prefers-reduced-motion (falls back to native scrolling)
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    window.__lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const raw = a.getAttribute('href');
      if (!raw || raw === '#') return;
      // Support both "#work" and "/#work" style links used across the nav
      const hashIndex = raw.indexOf('#');
      if (hashIndex === -1) return;
      const hash = raw.slice(hashIndex);
      if (hash.length < 2) return;
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      try {
        window.history.replaceState(null, '', hash);
      } catch {
        /* ignore */
      }
      lenis.scrollTo(el, { offset: -72, duration: 1.4 });
    };
    document.addEventListener('click', onClick);

    // Deep-link on load (e.g. /#work) glides instead of jumping
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1));
      if (el) setTimeout(() => lenis.scrollTo(el, { offset: -72, duration: 1.4, immediate: false }), 350);
    }

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onClick);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return <>{children}</>;
}
