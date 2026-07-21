import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useExperience } from '@/context/ExperienceContext';

const FLOWERS = ['🌸', '🌹', '🌺', '💐', '🌷', '❀'];

interface Petal {
  id: number;
  left: number;
  delay: number;
  duration: number;
  drift: number;
  size: number;
  rotate: number;
  glyph: string;
}

/**
 * Rains a shower of flowers from the top of the screen. Fires whenever the
 * experience's `flowerBurst` counter changes — which happens on a phone
 * shake (see ShakeListener). Reduced-motion users get a gentle, brief fall.
 */
export function FlowerFall() {
  const { flowerBurst } = useExperience();
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    if (flowerBurst === 0) return;
    const count = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 10 : 26;
    const batch: Petal[] = Array.from({ length: count }, (_, i) => ({
      id: flowerBurst * 1000 + i,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 3 + Math.random() * 2.5,
      drift: (Math.random() - 0.5) * 120,
      size: 20 + Math.random() * 22,
      rotate: (Math.random() - 0.5) * 320,
      glyph: FLOWERS[Math.floor(Math.random() * FLOWERS.length)],
    }));
    setPetals(batch);
    const t = setTimeout(() => setPetals([]), 6500);
    return () => clearTimeout(t);
  }, [flowerBurst]);

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[85] overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        {petals.map((p) => (
          <motion.span
            key={p.id}
            className="absolute top-[-10%] select-none"
            style={{ left: `${p.left}%`, fontSize: p.size }}
            initial={{ y: '-10vh', opacity: 0, rotate: 0 }}
            animate={{ y: '110vh', x: p.drift, opacity: [0, 1, 1, 0], rotate: p.rotate }}
            exit={{ opacity: 0 }}
            transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          >
            {p.glyph}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
