import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { Moon } from 'lucide-react';
import { config } from '@/data/config';
import { HeartCanvas, type HeartCanvasHandle } from '@/components/effects/HeartCanvas';
import { haptic } from '@/utils/haptics';

/**
 * The unforgettable ending: a night sky whose stars gather into a glowing
 * heart with "I Love You" at its centre, followed by fireworks and the final
 * birthday message. Tapping the moon scatters the stars; tapping the heart
 * launches a firework.
 */
export function Finale() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const heart = useRef<HeartCanvasHandle>(null);
  const inView = useInView(sectionRef, { amount: 0.5, once: true });
  const [showText, setShowText] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setShowText(true), reduced ? 200 : 2400);
    const t2 = setTimeout(() => {
      setShowMessage(true);
      if (!reduced) {
        heart.current?.firework(0.3, 0.2);
        heart.current?.firework(0.7, 0.18);
      }
    }, reduced ? 400 : 3400);

    let interval: number | undefined;
    if (!reduced) {
      interval = window.setInterval(() => {
        heart.current?.firework();
      }, 2600);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (interval) clearInterval(interval);
    };
  }, [inView, reduced]);

  return (
    <section
      ref={sectionRef}
      id="finale"
      aria-label="Finale"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_30%,#141026_0%,#08060f_60%,#040309_100%)]" />
      <HeartCanvas ref={heart} active={inView} />

      {/* Moon — tap to scatter stars */}
      <button
        type="button"
        aria-label="Tap the moon"
        onClick={() => {
          haptic(12);
          heart.current?.nudgeStars();
          heart.current?.firework(0.85, 0.14);
        }}
        className="absolute right-6 top-[max(1.5rem,env(safe-area-inset-top))] z-10 h-16 w-16 rounded-full transition-transform active:scale-90"
      >
        <span className="absolute inset-0 rounded-full bg-champagne/25 blur-2xl" />
        <span className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-champagne to-gold-soft text-ink shadow-[0_0_40px_rgba(233,207,168,0.5)]">
          <Moon className="h-7 w-7" fill="currentColor" strokeWidth={1} />
        </span>
      </button>

      {/* "I Love You" at heart centre */}
      <button
        type="button"
        aria-label="A heart for you"
        onClick={() => {
          haptic(14);
          heart.current?.firework(0.5, 0.3);
        }}
        className="absolute left-1/2 top-[46%] z-10 -translate-x-1/2 -translate-y-1/2 px-6"
      >
        <AnimatePresence>
          {showText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ type: 'spring', stiffness: 180, damping: 16 }}
              className="block font-script text-4xl text-warmwhite drop-shadow-[0_2px_20px_rgba(230,164,180,0.8)] sm:text-5xl"
            >
              {config.finale.heartText}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Final message */}
      <div className="absolute inset-x-0 bottom-[max(3rem,env(safe-area-inset-bottom))] z-10 flex flex-col items-center px-6 text-center">
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <p className="eyebrow mb-3">{config.finale.line}</p>
              <h2 className="font-display text-[clamp(2.5rem,13vw,5rem)] font-medium leading-none">
                <span className="text-gold-gradient animate-sheen">{config.wifeName}</span>
              </h2>
              <p className="mt-6 text-2xl">🎂 ❤ ✨</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
