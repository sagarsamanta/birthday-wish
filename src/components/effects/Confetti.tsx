import { useEffect, useRef } from 'react';

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  color: string;
  life: number;
}

const COLORS = ['#e6a4b4', '#d9b382', '#f3e4cf', '#b76e79', '#9a76ad', '#f6d6c4'];

/**
 * A full-screen confetti burst. Increment the `fire` prop to trigger a new
 * burst from the given origin (defaults to screen centre). Auto-stops when
 * all pieces settle, so it costs nothing at rest. Reduced-motion safe.
 */
export function Confetti({
  fire,
  origin = { x: 0.5, y: 0.45 },
  count = 160,
}: {
  fire: number;
  origin?: { x: number; y: number };
  count?: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const piecesRef = useRef<Piece[]>([]);
  const rafRef = useRef(0);

  useEffect(() => {
    if (fire === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const ox = origin.x * w;
    const oy = origin.y * h;

    const burst: Piece[] = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 9;
      return {
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1,
      };
    });
    piecesRef.current = burst;

    const gravity = 0.16;
    const drag = 0.99;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      let alive = 0;
      for (const p of piecesRef.current) {
        if (p.life <= 0) continue;
        p.vx *= drag;
        p.vy = p.vy * drag + gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= 0.006;
        if (p.y > h + 40) p.life = 0;
        if (p.life <= 0) continue;
        alive++;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (alive > 0) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(rafRef.current);
  }, [fire, count, origin.x, origin.y]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[80] h-full w-full"
    />
  );
}
