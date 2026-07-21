import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Gift, Sparkles } from 'lucide-react';
import { config } from '@/data/config';
import { Confetti } from '@/components/effects/Confetti';
import { haptic } from '@/utils/haptics';

/**
 * The intentional surprise: a wrapped 3D gift box. On tap the lid lifts and
 * tumbles away, confetti erupts, and the message blooms out of the box.
 */
export function Surprise() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [fire, setFire] = useState(0);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    setFire((n) => n + 1);
    haptic([16, 40, 16, 40, 24]);
  };

  return (
    <section
      id="surprise"
      aria-label="A surprise for you"
      className="section relative flex min-h-[90svh] flex-col items-center justify-center py-20"
    >
      <Confetti fire={fire} origin={{ x: 0.5, y: 0.42 }} />

      <div className="relative flex flex-col items-center" style={{ perspective: 900 }}>
        {/* glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose/25 blur-3xl"
          animate={{ opacity: open ? 0.9 : 0.4, scale: open ? 1.5 : 1 }}
          transition={{ duration: 1 }}
        />

        {!open && (
          <motion.button
            type="button"
            onClick={handleOpen}
            aria-label={config.surprise.prompt}
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileTap={{ scale: 0.94 }}
            animate={reduced ? undefined : { y: [0, -10, 0] }}
            transition={reduced ? undefined : { y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
          >
            {/* box */}
            <div className="relative h-40 w-40">
              {/* lid */}
              <div className="absolute -top-3 left-1/2 z-10 h-10 w-44 -translate-x-1/2 rounded-lg bg-gradient-to-b from-rose to-rose-deep shadow-lg" />
              <div className="absolute -top-3 left-1/2 z-20 h-10 w-6 -translate-x-1/2 bg-gold-soft/80" />
              {/* body */}
              <div className="absolute bottom-0 h-32 w-40 rounded-b-lg rounded-t-sm bg-gradient-to-b from-[#4a2f3d] to-[#33212e] shadow-2xl" />
              <div className="absolute bottom-0 left-1/2 h-32 w-6 -translate-x-1/2 bg-gold-soft/70" />
              {/* bow */}
              <Gift className="absolute -top-2 left-1/2 z-30 h-8 w-8 -translate-x-1/2 text-gold-soft" strokeWidth={1.4} />
            </div>
            <span className="glass mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-warmwhite">
              <Sparkles className="h-4 w-4 text-gold-soft" />
              {config.surprise.prompt}
            </span>
          </motion.button>
        )}

        <AnimatePresence>
          {open && (
            <>
              {/* lid flying off */}
              {!reduced && (
                <motion.div
                  className="absolute left-1/2 top-0 h-10 w-44 -translate-x-1/2 rounded-lg bg-gradient-to-b from-rose to-rose-deep shadow-lg"
                  initial={{ y: 0, rotate: 0, opacity: 1 }}
                  animate={{ y: -260, rotate: -40, opacity: 0 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                />
              )}

              <motion.div
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, scale: 0.6, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.25 }}
              >
                <h2 className="font-display text-[clamp(2rem,9vw,3.5rem)] font-medium leading-tight">
                  <span className="text-rose-gradient">{config.surprise.reveal}</span>
                </h2>
                <p className="mt-4 max-w-sm font-serif-el text-lg italic text-warmwhite/70 text-pretty">
                  {config.surprise.sub}
                </p>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
