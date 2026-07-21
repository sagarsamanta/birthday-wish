import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Heart } from 'lucide-react';
import { config } from '@/data/config';
import { ParticleField } from './background/ParticleField';
import { requestMotionPermission } from '@/hooks/useShake';

/**
 * A cinematic pre-roll: glowing particles, the couple's initials appearing
 * with a soft heartbeat, then a whispered promise, then an elegant "enter"
 * affordance. The tap that dismisses it is also what unlocks audio + motion
 * sensors, so autoplay policies are always respected.
 */
export function LoadingScreen({
  onEnter,
  onDone,
}: {
  /** fired synchronously on tap — unlocks audio + motion within the gesture */
  onEnter: () => void;
  /** fired after the exit animation completes — safe to unmount */
  onDone: () => void;
}) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0); // 0 initials, 1 whisper, 2 button
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), reduced ? 200 : 2200);
    const t2 = setTimeout(() => setPhase(2), reduced ? 500 : 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduced]);

  const handleEnter = () => {
    // Run inside the user gesture so audio autoplay policy is satisfied.
    onEnter();
    void requestMotionPermission();
    setLeaving(true);
    setTimeout(onDone, 900);
  };

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(12px)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,#1a1230_0%,#0a0710_60%,#050308_100%)]" />
          <ParticleField className="absolute inset-0 h-full w-full" density={1.4} />

          <div className="relative flex flex-col items-center gap-10 px-6 text-center">
            {/* Heart + initials */}
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute h-40 w-40 rounded-full bg-rose/20 blur-3xl" />
              <Heart
                className="animate-heartbeat h-16 w-16 text-rose"
                fill="currentColor"
                strokeWidth={1}
              />
            </motion.div>

            <motion.h1
              className="font-display text-2xl tracking-[0.3em] text-warmwhite/90"
              initial={{ opacity: 0, letterSpacing: '0.6em' }}
              animate={{ opacity: 1, letterSpacing: '0.3em' }}
              transition={{ duration: 1.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {config.initials}
            </motion.h1>

            {/* Whisper */}
            <div className="h-8">
              <AnimatePresence>
                {phase >= 1 && (
                  <motion.p
                    className="font-serif-el text-lg italic text-warmwhite/60"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  >
                    {config.loading.whisper}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Enter button */}
            <div className="h-16">
              <AnimatePresence>
                {phase >= 2 && (
                  <motion.button
                    type="button"
                    onClick={handleEnter}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    whileTap={{ scale: 0.94 }}
                    className="shimmer-border glass group relative inline-flex min-h-12 items-center gap-3 rounded-full px-9 py-4"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-soft opacity-70" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-soft" />
                    </span>
                    <span className="font-sans text-sm font-medium tracking-[0.15em] text-warmwhite">
                      Open your surprise
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.p
            className="absolute bottom-8 text-center text-xs tracking-widest text-warmwhite/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0 }}
            transition={{ duration: 1 }}
          >
            best experienced with sound on
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
