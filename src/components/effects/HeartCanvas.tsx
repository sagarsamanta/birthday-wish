import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface HeartCanvasHandle {
  /** launch a firework at a normalized position (0..1) */
  firework: (nx?: number, ny?: number) => void;
  /** nudge the starfield (moon tap easter egg) */
  nudgeStars: () => void;
}

interface Star {
  x: number;
  y: number;
  r: number;
  base: number;
  tw: number;
  twSpeed: number;
  vx: number;
  vy: number;
}

interface HeartP {
  x: number;
  y: number;
  sx: number; // start
  sy: number;
  tx: number; // target
  ty: number;
  color: string;
  size: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const HEART_COLORS = ['#ffd9e2', '#e6a4b4', '#f6d6c4', '#ffffff', '#d9b382'];
const FW_COLORS = ['#e6a4b4', '#d9b382', '#f3e4cf', '#9a76ad', '#ffd9e2'];

/**
 * The finale's living canvas: a twinkling starfield, then thousands of
 * particles that gather into a softly pulsing, glowing heart, plus
 * on-demand fireworks. Exposes an imperative handle for easter eggs.
 */
export const HeartCanvas = forwardRef<HeartCanvasHandle, { active: boolean }>(
  function HeartCanvas({ active }, ref) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const activeRef = useRef(active);
    const startRef = useRef<number | null>(null);
    const sparksRef = useRef<Spark[]>([]);
    const starsRef = useRef<Star[]>([]);
    const heartRef = useRef<HeartP[]>([]);
    const dimsRef = useRef({ w: 0, h: 0, cx: 0, cy: 0, scale: 1 });

    useImperativeHandle(ref, () => ({
      firework: (nx = Math.random() * 0.8 + 0.1, ny = Math.random() * 0.4 + 0.1) => {
        const { w, h } = dimsRef.current;
        spawnFirework(sparksRef.current, nx * w, ny * h);
      },
      nudgeStars: () => {
        for (const s of starsRef.current) {
          s.vx += (Math.random() - 0.5) * 1.4;
          s.vy += (Math.random() - 0.5) * 1.4;
        }
      },
    }));

    useEffect(() => {
      activeRef.current = active;
      if (active && startRef.current === null) startRef.current = performance.now();
    }, [active]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let raf = 0;
      let dpr = 1;

      const inHeart = (X: number, Y: number) => {
        const a = X * X + Y * Y - 1;
        return a * a * a - X * X * Y * Y * Y < 0;
      };

      const build = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const cx = w / 2;
        const cy = h * 0.46;
        const scale = Math.min(w, h) * 0.032;
        dimsRef.current = { w, h, cx, cy, scale };

        // stars
        const starCount = Math.max(60, Math.min(220, Math.round((w * h) / 9000)));
        starsRef.current = Array.from({ length: starCount }, () => {
          const r = Math.random() * 1.4 + 0.3;
          return {
            x: Math.random() * w,
            y: Math.random() * h,
            r,
            base: r,
            tw: Math.random() * Math.PI * 2,
            twSpeed: 0.01 + Math.random() * 0.03,
            vx: 0,
            vy: 0,
          };
        });

        // heart particles (fill via rejection sampling)
        const target = Math.max(160, Math.min(420, Math.round((w * h) / 5200)));
        const pts: HeartP[] = [];
        let guard = 0;
        while (pts.length < target && guard < target * 60) {
          guard++;
          const X = (Math.random() * 2 - 1) * 1.3;
          const Y = (Math.random() * 2 - 1) * 1.3;
          if (!inHeart(X, Y)) continue;
          const tx = cx + X * scale;
          const ty = cy - Y * scale;
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.max(w, h);
          pts.push({
            x: cx + Math.cos(angle) * dist,
            y: cy + Math.sin(angle) * dist,
            sx: cx + Math.cos(angle) * dist,
            sy: cy + Math.sin(angle) * dist,
            tx,
            ty,
            color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
            size: 1 + Math.random() * 2,
          });
        }
        heartRef.current = pts;
      };

      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

      const draw = (now: number) => {
        const { w, h, cx, cy, scale } = dimsRef.current;
        ctx.clearRect(0, 0, w, h);

        // stars
        for (const s of starsRef.current) {
          s.tw += s.twSpeed;
          s.x += s.vx;
          s.y += s.vy;
          s.vx *= 0.94;
          s.vy *= 0.94;
          if (s.x < 0) s.x = w;
          if (s.x > w) s.x = 0;
          if (s.y < 0) s.y = h;
          if (s.y > h) s.y = 0;
          const a = 0.35 + 0.45 * Math.sin(s.tw);
          ctx.beginPath();
          ctx.fillStyle = `rgba(255,248,240,${a})`;
          ctx.arc(s.x, s.y, s.base, 0, Math.PI * 2);
          ctx.fill();
        }

        // heart formation
        const started = activeRef.current && startRef.current !== null;
        const elapsed = started ? now - (startRef.current as number) : 0;
        const formDur = 2600;
        const p = started ? Math.min(1, elapsed / formDur) : 0;
        const eased = reduced ? (started ? 1 : 0) : easeOut(p);
        const pulse = 1 + (p >= 1 && !reduced ? Math.sin(now / 700) * 0.03 : 0);

        if (started) {
          ctx.globalCompositeOperation = 'lighter';
          for (const hp of heartRef.current) {
            // lerp from start to target, with a gentle pulse once formed
            const px = cx + (hp.tx - cx) * pulse;
            const py = cy + (hp.ty - cy) * pulse;
            hp.x = hp.sx + (px - hp.sx) * eased;
            hp.y = hp.sy + (py - hp.sy) * eased;

            const glow = hp.size * (2.6 + (p >= 1 ? 0.6 * Math.sin(now / 500 + hp.x) : 0));
            const g = ctx.createRadialGradient(hp.x, hp.y, 0, hp.x, hp.y, glow);
            g.addColorStop(0, hp.color);
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(hp.x, hp.y, glow, 0, Math.PI * 2);
            ctx.fill();
          }

          // soft heart halo once formed
          if (p >= 1) {
            const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 2.4);
            halo.addColorStop(0, 'rgba(230,164,180,0.12)');
            halo.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(cx, cy, scale * 2.4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalCompositeOperation = 'source-over';
        }

        // fireworks
        ctx.globalCompositeOperation = 'lighter';
        const sparks = sparksRef.current;
        for (const sp of sparks) {
          sp.vy += 0.03;
          sp.vx *= 0.985;
          sp.vy *= 0.985;
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.life -= 0.012;
          if (sp.life <= 0) continue;
          ctx.globalAlpha = Math.max(0, sp.life);
          ctx.fillStyle = sp.color;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        sparksRef.current = sparks.filter((s) => s.life > 0);

        raf = requestAnimationFrame(draw);
      };

      build();
      raf = requestAnimationFrame(draw);

      const onResize = () => build();
      window.addEventListener('resize', onResize);
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
      };
    }, []);

    return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
  },
);

function spawnFirework(arr: Spark[], x: number, y: number) {
  const color = FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)];
  const n = 60;
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n;
    const speed = 2 + Math.random() * 4;
    arr.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.8 + Math.random() * 0.4,
      color,
    });
  }
}
