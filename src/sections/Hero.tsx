import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useConfig, useT } from '@/i18n/hooks';
import { useTypewriter } from '@/hooks/useTypewriter';
import { SmartImage } from '@/components/ui/SmartImage';
import { ParticleField } from '@/components/background/ParticleField';

/**
 * Full-screen opening. A short typewriter intro builds emotion, then the
 * reveal fans open into a two-part composition: her portrait framed on one
 * side, the birthday greeting and her name on the other — so the photo reads
 * beautifully and the words stay crisp. Stacks elegantly on mobile.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const config = useConfig();
  const t = useT();
  const { displayed, done } = useTypewriter({
    lines: config.hero.typewriter,
    speed: 42,
    startDelay: 500,
  });

  const typingIndex = displayed.findIndex(
    (l, idx) => l.length < config.hero.typewriter[idx].length,
  );

  return (
    <section
      className="section stage-dark-text relative flex min-h-[100svh] flex-col items-center justify-center gap-8 overflow-hidden py-24"
      aria-label="Welcome"
    >
      {/* Always-dark cinematic stage (both themes) */}
      <div className="stage-dark absolute inset-0" aria-hidden="true" />
      <ParticleField className="absolute inset-0 h-full w-full" />

      {/* Typewriter intro */}
      <div className="relative z-10 min-h-[4.5rem] max-w-2xl space-y-1 text-center">
        {displayed.map((line, i) => (
          <p
            key={i}
            className="font-serif-el text-xl italic leading-relaxed text-warmwhite/75 sm:text-2xl"
          >
            {line}
            {!done && i === typingIndex && (
              <span className="ml-0.5 inline-block h-5 w-px animate-pulse bg-gold-soft align-middle" />
            )}
          </p>
        ))}
      </div>

      {/* The reveal — portrait on one side, words on the other */}
      <AnimatePresence>
        {done && (
          <motion.div
            className="relative z-10 grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Portrait */}
            {config.hero.backgroundImage && (
              <motion.div
                className="order-1 mx-auto w-full max-w-[16rem] sm:max-w-[20rem] lg:order-2 lg:ml-auto"
                initial={{ opacity: 0, scale: 0.92, x: reduced ? 0 : 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="shimmer-border glow-rose glass relative overflow-hidden rounded-[2rem] p-1.5">
                  <div className="overflow-hidden rounded-[1.6rem]">
                    <motion.div
                      initial={{ scale: reduced ? 1 : 1.16 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 16, ease: 'easeOut' }}
                    >
                      <SmartImage
                        src={config.hero.backgroundImage}
                        alt={config.wifeName}
                        loading="eager"
                        fetchPriority="high"
                        seed={3}
                        className="aspect-[4/5] w-full"
                        imgClassName="!object-cover object-[center_22%]"
                      />
                    </motion.div>
                  </div>
                  {/* gentle inner vignette */}
                  <div className="pointer-events-none absolute inset-1.5 rounded-[1.6rem] shadow-[inset_0_0_60px_rgba(10,7,16,0.5)]" />
                </div>
              </motion.div>
            )}

            {/* Words */}
            <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
              <motion.p
                className="eyebrow mb-4"
                initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                {config.hero.greeting}
              </motion.p>

              <div className="relative">
                {/* glow halo */}
                <motion.div
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 h-[70%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose/25 blur-3xl"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.6, delay: 0.2 }}
                />
                <motion.h1
                  aria-label={config.wifeName}
                  className="relative font-script text-[clamp(4.5rem,22vw,9rem)] leading-[0.82]"
                  initial={{ opacity: 0, y: 24, filter: 'blur(18px)', scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                  transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span
                    className="text-gold-gradient animate-sheen"
                    style={{
                      WebkitTextStroke: '0.4px rgba(233,207,168,0.25)',
                      filter: 'drop-shadow(0 8px 34px rgba(230,164,180,0.55))',
                    }}
                  >
                    {config.wifeName}
                  </span>
                  {!reduced &&
                    [
                      { t: '-6%', l: '-5%', d: 0 },
                      { t: '4%', l: '99%', d: 0.7 },
                      { t: '80%', l: '92%', d: 1.3 },
                    ].map((s, i) => (
                      <motion.span
                        key={i}
                        className="absolute text-gold-soft"
                        style={{ top: s.t, left: s.l, fontSize: 'clamp(0.9rem,3vw,1.4rem)' }}
                        animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4], rotate: [0, 90, 0] }}
                        transition={{ duration: 2.6, delay: 1 + s.d, repeat: Infinity, repeatDelay: 1.6 }}
                      >
                        ✦
                      </motion.span>
                    ))}
                </motion.h1>
              </div>

              <motion.div
                className="mt-3 flex items-center gap-3 text-gold-soft/70"
                initial={{ opacity: 0, scaleX: 0.4 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-soft/70 sm:w-14" />
                <span className="text-rose">❤</span>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-soft/70 sm:w-14" />
              </motion.div>

              <motion.p
                className="mt-6 max-w-sm font-serif-el text-lg italic text-warmwhite/70 text-pretty"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
              >
                {config.hero.subgreeting}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll cue */}
      <AnimatePresence>
        {done && (
          <motion.div
            className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 text-warmwhite/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
          >
            <span className="text-[10px] uppercase tracking-[0.3em]">{t('scroll')}</span>
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
