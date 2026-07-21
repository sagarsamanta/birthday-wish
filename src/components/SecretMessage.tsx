import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, KeyRound } from 'lucide-react';
import { useConfig } from '@/i18n/hooks';
import { useExperience } from '@/context/ExperienceContext';

/**
 * The hidden letter, revealed only by a 5-second press-and-hold. Presented
 * as an intimate, full-screen note that fades up from the dark.
 */
export function SecretMessage() {
  const { secretOpen, closeSecret } = useExperience();
  const config = useConfig();
  const secret = config.secret;

  useEffect(() => {
    if (!secretOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeSecret();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [secretOpen, closeSecret]);

  return createPortal(
    <AnimatePresence>
      {secretOpen && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center overflow-y-auto bg-ink/97 px-6 py-16 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          role="dialog"
          aria-modal="true"
          aria-label="A secret message"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={closeSecret}
            className="glass fixed right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 flex h-11 w-11 items-center justify-center rounded-full text-warmwhite"
          >
            <X className="h-5 w-5" />
          </button>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-lg text-center"
          >
            <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full glass glow-rose">
              <KeyRound className="h-6 w-6 text-gold-soft" />
            </div>

            <h2 className="font-display text-4xl text-gold-gradient">{secret.title}</h2>

            <div className="mt-8 space-y-5">
              {secret.body.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.4, duration: 0.9 }}
                  className="font-serif-el text-xl italic leading-relaxed text-warmwhite/85 text-pretty"
                >
                  {para}
                </motion.p>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + secret.body.length * 0.4, duration: 1 }}
              className="mt-10 font-script text-3xl text-rose"
            >
              {secret.signature}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
