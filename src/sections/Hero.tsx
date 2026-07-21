import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { config } from '@/data/config';
import { useTypewriter } from '@/hooks/useTypewriter';
import { SmartImage } from '@/components/ui/SmartImage';

/**
 * Full-screen opening. Types out a couple of lines to build emotion, then
 * reveals the birthday greeting and her name in luxurious display type,
 * with floating decorative sparkles and a gentle scroll cue.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const { displayed, done } = useTypewriter({
    lines: config.hero.typewriter,
    speed: 42,
    startDelay: 500,
  });

  return (
    <section
      className="section relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden"
      aria-label="Welcome"
    >
      {/* Cinematic background portrait */}
      {config.hero.backgroundImage && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="h-full w-full"
            initial={{ scale: reduced ? 1 : 1.18 }}
            animate={{ scale: 1 }}
            transition={{ duration: 14, ease: 'easeOut' }}
          >
            <SmartImage
              src={config.hero.backgroundImage}
              alt={config.wifeName}
              loading="eager"
              fetchPriority="high"
              seed={3}
              className="h-full w-full"
              imgClassName="!object-cover"
            />
          </motion.div>
          {/* legibility veils */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/50 to-ink" />
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_25%,rgba(10,7,16,0.55))]" />
        </div>
      )}

      {/* Floating decorative orbs */}
      {!reduced &&
        [0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute rounded-full bg-gold-soft/30 blur-md"
            style={{
              width: 6 + i * 3,
              height: 6 + i * 3,
              left: `${15 + i * 22}%`,
              top: `${25 + (i % 2) * 40}%`,
            }}
            animate={{ y: [0, -22, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
          />
        ))}

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        {/* Typewriter intro */}
        <div className="mb-8 min-h-[4.5rem] space-y-1">
          {displayed.map((line, i) => (
            <p
              key={i}
              className="font-serif-el text-xl italic leading-relaxed text-warmwhite/75 sm:text-2xl"
            >
              {line}
              {!done && i === displayed.findIndex((l, idx) => l.length < config.hero.typewriter[idx].length) && (
                <span className="ml-0.5 inline-block h-5 w-px animate-pulse bg-gold-soft align-middle" />
              )}
            </p>
          ))}
        </div>

        {/* The reveal */}
        <AnimatePresence>
          {done && (
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.p
                className="eyebrow mb-5"
                initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                {config.hero.greeting}
              </motion.p>

              <motion.h1
                className="font-display text-[clamp(3rem,17vw,7rem)] font-medium leading-[0.95]"
                initial={{ opacity: 0, y: 30, filter: 'blur(16px)', scale: 0.94 }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="text-rose-gradient">{config.wifeName}</span>
              </motion.h1>

              <motion.p
                className="mt-7 max-w-md font-serif-el text-lg italic text-warmwhite/70 text-pretty"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
              >
                {config.hero.subgreeting}
              </motion.p>

              <motion.div
                className="mt-6 flex items-center gap-2 text-rose"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 1.2 }}
              >
                <span className="text-2xl">❤</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll cue */}
      <AnimatePresence>
        {done && (
          <motion.div
            className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 text-warmwhite/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
          >
            <span className="text-[10px] uppercase tracking-[0.3em]">scroll</span>
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
