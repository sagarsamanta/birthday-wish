import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur';

const build = (dir: Direction, reduced: boolean | null): Variants => {
  if (reduced) {
    return { hidden: { opacity: 0 }, show: { opacity: 1 } };
  }
  const offset = 44;
  const from: Record<Direction, Record<string, number>> = {
    up: { y: offset },
    down: { y: -offset },
    left: { x: offset },
    right: { x: -offset },
    scale: { scale: 0.9 },
    blur: {},
  };
  return {
    hidden: { opacity: 0, filter: 'blur(10px)', ...from[dir] },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
    },
  };
};

/**
 * Scroll-reveal wrapper. Animates its children in the first time they enter
 * the viewport, using a silky spring-eased transition. Reduced-motion safe.
 */
export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.9,
  className,
  once = true,
  amount = 0.35,
  as = 'div',
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
  as?: 'div' | 'section' | 'li' | 'span';
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      variants={build(direction, reduced)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}
