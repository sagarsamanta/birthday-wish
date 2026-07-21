import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useConfig, useT } from '@/i18n/hooks';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/utils/icons';

/**
 * A vertical, scroll-driven timeline. A glowing connective line fills as you
 * scroll; each milestone's node pulses in and its card slides alongside.
 * Single-column and thumb-friendly on mobile.
 */
export function Timeline() {
  const config = useConfig();
  const t = useT();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.72', 'end 0.85'],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });

  return (
    <section id="timeline" aria-label={config.timeline.title} className="section relative py-24">
      <SectionHeading
        eyebrow={t('eyebrowJourney')}
        title={config.timeline.title}
        intro={config.timeline.intro}
        className="mb-16"
      />

      <div ref={ref} className="relative mx-auto max-w-xl pl-4">
        {/* track */}
        <div className="absolute bottom-2 left-[1.35rem] top-2 w-0.5 -translate-x-1/2 rounded-full bg-white/10" />
        {/* animated fill */}
        <motion.div
          style={{ scaleY }}
          className="absolute bottom-2 left-[1.35rem] top-2 w-0.5 origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-blush via-rose to-plum-soft shadow-[0_0_14px_rgba(230,164,180,0.7)]"
        />

        <ul className="space-y-10">
          {config.timeline.events.map((ev, i) => (
            <li key={i} className="relative flex items-start gap-5">
              {/* node */}
              <Reveal direction="scale" amount={0.6} duration={0.6}>
                <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full glass-dark shadow-lg">
                  <span className="absolute inset-0 rounded-full bg-rose/20 blur-md" />
                  <Icon name={ev.icon} className="relative h-5 w-5 text-rose" strokeWidth={1.6} />
                </div>
              </Reveal>

              {/* card */}
              <Reveal direction="left" amount={0.4} className="flex-1 pt-0.5">
                <div className="glass rounded-2xl p-4">
                  <p className="eyebrow mb-1.5 !text-[0.6rem]">{ev.date}</p>
                  <h3 className="font-display text-xl text-warmwhite">{ev.title}</h3>
                  <p className="mt-1.5 font-serif-el text-base italic leading-snug text-warmwhite/65 text-pretty">
                    {ev.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
