import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { haptic } from '@/utils/haptics';

/**
 * A premium glass button with an animated gold shimmer border, soft glow,
 * and a springy tap response. Large touch target for one-handed mobile use.
 */
export function GlowButton({
  children,
  onClick,
  className,
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      onClick={() => {
        haptic(14);
        onClick?.();
      }}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={cn(
        'shimmer-border glass glow-rose relative inline-flex min-h-12 items-center justify-center gap-2',
        'rounded-full px-8 py-3.5 font-sans text-sm font-medium tracking-wide text-warmwhite',
        'transition-colors duration-300',
        className,
      )}
    >
      {children}
    </motion.button>
  );
}
