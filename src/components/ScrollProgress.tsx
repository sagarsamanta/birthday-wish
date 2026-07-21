import { motion, useScroll, useSpring } from 'motion/react';
import { useExperience } from '@/context/ExperienceContext';

/** A slim rose-gold progress line pinned to the top of the viewport. */
export function ScrollProgress() {
  const { started } = useExperience();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  if (!started) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-blush via-rose to-gold"
    />
  );
}
