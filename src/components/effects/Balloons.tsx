import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useExperience } from '@/context/ExperienceContext';

// Luxury balloon colourways: [body top, body bottom, highlight]
const COLORS: Array<[string, string, string]> = [
  ['#f6d6c4', '#b76e79', '#ffffff'],
  ['#e9cfa8', '#d9b382', '#fff7ea'],
  ['#c9a7d8', '#6d4b7a', '#f3e6fb'],
  ['#f3e4cf', '#e6a4b4', '#ffffff'],
  ['#f7c8d4', '#b76e79', '#fff0f4'],
];

interface Balloon {
  id: number;
  left: number; // horizontal position (%)
  size: number;
  delay: number;
  duration: number;
  sway: number; // gentle horizontal drift while rising
  colors: [string, string, string];
}

function BalloonShape({ b }: { b: Balloon }) {
  const [top, bottom, hi] = b.colors;
  const w = b.size;
  const h = b.size * 1.22;
  return (
    <div style={{ width: w }} className="flex flex-col items-center">
      <div
        className="relative rounded-[50%]"
        style={{
          width: w,
          height: h,
          background: `radial-gradient(38% 32% at 34% 28%, ${hi} 0%, ${top} 40%, ${bottom} 100%)`,
          boxShadow: `inset -4px -6px 12px rgba(0,0,0,0.18), 0 6px 18px -6px ${bottom}`,
        }}
      >
        {/* knot */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: -5,
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: `7px solid ${bottom}`,
          }}
        />
      </div>
      {/* string */}
      <svg width="20" height={h * 0.9} viewBox={`0 0 20 ${h * 0.9}`} className="-mt-0.5">
        <path
          d={`M10 0 Q2 ${h * 0.3} 10 ${h * 0.5} Q18 ${h * 0.7} 10 ${h * 0.9}`}
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

/**
 * A gentle release of balloons that float slowly from the bottom of the
 * screen up and out of the top (~11s), the moment she enters — swaying
 * softly as they rise. Pure CSS/SVG, reduced-motion friendly.
 */
export function Balloons() {
  const { balloonBurst } = useExperience();
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  useEffect(() => {
    if (balloonBurst === 0) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = reduced ? 7 : 14;
    const batch: Balloon[] = Array.from({ length: count }, (_, i) => ({
      id: balloonBurst * 1000 + i,
      left: 5 + (i / (count - 1)) * 90 + (Math.random() - 0.5) * 6,
      size: 36 + Math.random() * 26,
      delay: Math.random() * 1.4,
      duration: 10 + Math.random() * 4, // very slow rise
      sway: (Math.random() - 0.5) * 70,
      colors: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    setBalloons(batch);
    const t = setTimeout(() => setBalloons([]), 17000);
    return () => clearTimeout(t);
  }, [balloonBurst]);

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[110] overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        {balloons.map((b) => (
          <motion.div
            key={b.id}
            className="absolute bottom-0"
            style={{ left: `${b.left}%` }}
            initial={{ y: '22vh', opacity: 0 }}
            animate={{
              y: '-125vh',
              x: [0, b.sway, -b.sway * 0.6, b.sway * 0.4, 0],
              opacity: [0, 1, 1, 1, 0.85],
              rotate: [0, b.sway > 0 ? 5 : -5, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: b.duration,
              delay: b.delay,
              ease: 'linear',
              opacity: { duration: b.duration, times: [0, 0.08, 0.5, 0.85, 1] },
              rotate: { duration: b.duration, repeat: Infinity, repeatType: 'mirror' },
            }}
          >
            <BalloonShape b={b} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
