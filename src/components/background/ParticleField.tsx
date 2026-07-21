import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  hue: number;
  alpha: number;
  twinkle: number;
  twSpeed: number;
}

const PALETTE = [
  [246, 214, 196], // blush
  [230, 164, 180], // rose
  [217, 179, 130], // gold
  [243, 228, 207], // champagne
  [154, 118, 173], // plum-soft
];

/**
 * A GPU-friendly canvas of drifting bokeh particles / fireflies that sits
 * behind everything. Soft, slow, ~60fps. Pauses when the tab is hidden and
 * renders a single static frame when the user prefers reduced motion.
 */
export function ParticleField({ density = 1, className }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;

    const make = (): Particle => {
      const hue = Math.floor(Math.random() * PALETTE.length);
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 2.6,
        vy: -(0.05 + Math.random() * 0.25),
        vx: (Math.random() - 0.5) * 0.15,
        hue,
        alpha: 0.15 + Math.random() * 0.5,
        twinkle: Math.random() * Math.PI * 2,
        twSpeed: 0.008 + Math.random() * 0.02,
      };
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round((w * h) / 26000 * density);
      const count = Math.max(24, Math.min(120, target));
      particles = Array.from({ length: count }, make);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of particles) {
        p.twinkle += p.twSpeed;
        const a = p.alpha * (0.55 + 0.45 * Math.sin(p.twinkle));
        const [cr, cg, cb] = PALETTE[p.hue];
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(${cr},${cg},${cb},${a})`);
        g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();

        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -10) {
            p.y = h + 10;
            p.x = Math.random() * w;
          }
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const loop = () => {
      if (!running) return;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running && !reduced) {
        raf = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    resize();
    if (reduced) {
      draw();
    } else {
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [density]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
