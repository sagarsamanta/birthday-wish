import { motion, useReducedMotion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { config } from '@/data/config';
import { Reveal } from '@/components/ui/Reveal';
import { haptic } from '@/utils/haptics';

/**
 * The final page of the story — a quiet, elegant sign-off after the finale.
 * No spoilers, no lists; just a signature and a way to relive it all.
 */
export function Closing() {
  const reduced = useReducedMotion();

  const replay = () => {
    haptic(12);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 2.4 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section aria-label="With love" className="section relative flex min-h-[70svh] flex-col items-center justify-center py-24 text-center">
      {/* ornament */}
      <Reveal direction="scale">
        <div className="mb-10 flex items-center gap-4 text-gold-soft/70">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-soft/60" />
          <motion.span
            className="text-xl"
            animate={reduced ? undefined : { scale: [1, 1.15, 1] }}
            transition={reduced ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            ❤
          </motion.span>
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-soft/60" />
        </div>
      </Reveal>

      <Reveal direction="up" delay={0.1}>
        <p className="font-serif-el text-2xl italic leading-relaxed text-warmwhite/75 text-pretty">
          This little page will always end here.
          <br />
          <span className="text-warmwhite/90">We never will.</span>
        </p>
      </Reveal>

      <Reveal direction="up" delay={0.2}>
        <p className="mt-12 font-script text-4xl text-rose-gradient">
          Made with love, only for {config.wifeName}.
        </p>
      </Reveal>

      <Reveal direction="up" delay={0.3}>
        <p className="mt-3 text-sm tracking-[0.25em] text-warmwhite/40 uppercase">— {config.yourName}</p>
      </Reveal>

      <Reveal direction="up" delay={0.42}>
        <motion.button
          type="button"
          onClick={replay}
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.03 }}
          className="glass mt-14 inline-flex min-h-12 items-center gap-2.5 rounded-full px-7 py-3.5 text-sm text-warmwhite/85"
        >
          <RotateCcw className="h-4 w-4" />
          Relive it from the start
        </motion.button>
      </Reveal>
    </section>
  );
}
