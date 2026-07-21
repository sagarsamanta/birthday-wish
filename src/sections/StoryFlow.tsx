import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { config } from '@/data/config';
import type { StoryChapter } from '@/data/types';

// A distinct accent per chapter so the sequence never feels like a loop.
const ACCENTS = ['from-blush', 'from-rose', 'from-gold', 'from-plum-soft', 'from-champagne'];

function Chapter({ chapter, index }: { chapter: StoryChapter; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Scroll-linked reveal: fade + rise + blur, peaking as the chapter centres.
  const opacity = useTransform(scrollYProgress, [0, 0.32, 0.68, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.4, 1], [70, 0, -70]);
  const blur = useTransform(scrollYProgress, [0, 0.32, 0.68, 1], [12, 0, 0, 12]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.96, 1]);

  // Numeral drifts at a different rate for depth (parallax).
  const numY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const numOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 0.09, 0.09, 0]);

  const style = reduced ? undefined : { opacity, y, filter, scale };

  return (
    <div
      ref={ref}
      className="section relative flex min-h-[85svh] flex-col items-center justify-center overflow-hidden text-center"
    >
      {/* giant ghosted chapter numeral */}
      {!reduced && (
        <motion.span
          aria-hidden="true"
          style={{ y: numY, opacity: numOpacity }}
          className="pointer-events-none absolute select-none font-display text-[42vw] font-semibold leading-none text-warmwhite sm:text-[26rem]"
        >
          {index + 1}
        </motion.span>
      )}

      <motion.div style={style} className="relative mx-auto max-w-xl">
        <div className="mb-6 flex flex-col items-center gap-3">
          <span className={`h-px w-14 bg-gradient-to-r ${ACCENTS[index % ACCENTS.length]} to-transparent`} />
          <p className="eyebrow">{chapter.eyebrow}</p>
        </div>
        <h2 className="font-display text-[clamp(2rem,8vw,3.75rem)] font-medium leading-[1.08] text-balance text-warmwhite">
          {chapter.line}
        </h2>
        {chapter.sub && (
          <p className="mx-auto mt-6 max-w-md font-serif-el text-lg italic text-warmwhite/60 text-pretty">
            {chapter.sub}
          </p>
        )}
      </motion.div>

      {/* connecting line to next chapter */}
      {index < config.story.length - 1 && (
        <div className="absolute bottom-0 left-1/2 h-16 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold-soft/40 to-transparent" />
      )}
    </div>
  );
}

/**
 * The emotional heart of the journey: a sequence of chapters that fade,
 * rise and sharpen as they scroll through the centre of the screen — each
 * with its own drifting numeral and accent so it reads as a designed
 * sequence, never a repeat.
 */
export function StoryFlow() {
  return (
    <section aria-label="Our story" className="relative py-10">
      {config.story.map((chapter, i) => (
        <Chapter key={i} chapter={chapter} index={i} />
      ))}
    </section>
  );
}
