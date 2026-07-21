import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useConfig, useT } from '@/i18n/hooks';
import { haptic } from '@/utils/haptics';
import { useExperience } from '@/context/ExperienceContext';

/**
 * Pull down while already at the very top of the page to uncover a hidden
 * whisper — a little reward for the curious. Auto-dismisses after a moment.
 */
export function PullReveal() {
  const { started } = useExperience();
  const config = useConfig();
  const t = useT();
  const [pull, setPull] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!started) return;
    let startY = 0;
    let tracking = false;

    const atTop = () => window.scrollY <= 2 && document.documentElement.scrollTop <= 2;

    const onStart = (e: TouchEvent) => {
      if (!atTop() || revealed) return;
      startY = e.touches[0].clientY;
      tracking = true;
    };
    const onMove = (e: TouchEvent) => {
      if (!tracking) return;
      const dy = e.touches[0].clientY - startY;
      if (dy > 0 && atTop()) {
        const p = Math.min(1, dy / 130);
        setPull(p);
        if (p >= 1 && !revealed) {
          setRevealed(true);
          haptic([10, 30, 10]);
          tracking = false;
        }
      } else {
        setPull(0);
      }
    };
    const onEnd = () => {
      tracking = false;
      if (!revealed) setPull(0);
    };

    document.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onEnd);
    return () => {
      document.removeEventListener('touchstart', onStart);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    };
  }, [started, revealed]);

  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => {
      setRevealed(false);
      setPull(0);
    }, 5000);
    return () => clearTimeout(t);
  }, [revealed]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex justify-center" aria-hidden={!revealed}>
      <AnimatePresence>
        {(pull > 0.05 || revealed) && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: revealed ? 1 : pull, y: revealed ? 16 : -30 + pull * 44 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="glass-dark mt-[max(0.75rem,env(safe-area-inset-top))] flex max-w-xs items-center gap-3 rounded-full px-5 py-3 shadow-xl"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-gold-soft" />
            <p className="font-serif-el text-sm italic text-warmwhite/85">
              {revealed
                ? t('pullReveal').replace('{name}', config.wifeName)
                : t('keepPulling')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
