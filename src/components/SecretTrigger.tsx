import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useExperience } from '@/context/ExperienceContext';

const HOLD_MS = 5000;
const VISIBLE_AFTER = 0.16; // show ring once 16% held

/**
 * Listens for a 5-second press-and-hold anywhere on the page and opens the
 * secret letter. A delicate progress ring appears at the touch point so the
 * discovery feels intentional, not accidental. Any movement (i.e. scrolling)
 * cancels it, so normal browsing is never interrupted.
 */
export function SecretTrigger() {
  const { started, openSecret, secretOpen } = useExperience();
  const [progress, setProgress] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const state = useRef({ raf: 0, timer: 0, start: 0, origin: null as null | { x: number; y: number } });

  useEffect(() => {
    if (!started) return;

    const cancel = () => {
      window.clearTimeout(state.current.timer);
      cancelAnimationFrame(state.current.raf);
      state.current.origin = null;
      setProgress(0);
    };

    const begin = (x: number, y: number) => {
      if (secretOpen) return;
      state.current.origin = { x, y };
      state.current.start = performance.now();
      setPos({ x, y });

      const tick = () => {
        const p = Math.min(1, (performance.now() - state.current.start) / HOLD_MS);
        setProgress(p);
        if (p < 1) state.current.raf = requestAnimationFrame(tick);
      };
      state.current.raf = requestAnimationFrame(tick);
      state.current.timer = window.setTimeout(() => {
        openSecret();
        cancel();
      }, HOLD_MS);
    };

    const move = (x: number, y: number) => {
      const o = state.current.origin;
      if (!o) return;
      if (Math.hypot(x - o.x, y - o.y) > 18) cancel();
    };

    const onTouchStart = (e: TouchEvent) => begin(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => move(e.touches[0].clientX, e.touches[0].clientY);
    const onMouseDown = (e: MouseEvent) => begin(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => move(e.clientX, e.clientY);

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', cancel);
    document.addEventListener('touchcancel', cancel);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', cancel);

    return () => {
      cancel();
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', cancel);
      document.removeEventListener('touchcancel', cancel);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', cancel);
    };
  }, [started, openSecret, secretOpen]);

  const r = 26;
  const circ = 2 * Math.PI * r;

  return (
    <AnimatePresence>
      {progress > VISIBLE_AFTER && (
        <motion.div
          className="pointer-events-none fixed z-[92]"
          style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
        >
          <svg width="72" height="72" viewBox="0 0 72 72" className="drop-shadow-[0_0_12px_rgba(230,164,180,0.6)]">
            <circle cx="36" cy="36" r={r} fill="rgba(10,7,16,0.5)" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
            <circle
              cx="36"
              cy="36"
              r={r}
              fill="none"
              stroke="var(--color-rose)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - progress)}
              transform="rotate(-90 36 36)"
            />
            <text x="36" y="41" textAnchor="middle" className="fill-warmwhite" fontSize="16">
              ♥
            </text>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
