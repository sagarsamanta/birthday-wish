import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, CalendarDays } from 'lucide-react';
import { useConfig, useT } from '@/i18n/hooks';
import { useExperience } from '@/context/ExperienceContext';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { haptic } from '@/utils/haptics';

/**
 * A framed keepsake video (the registry recording). Sits right after the
 * timeline's "We Made It Official" milestone. Playing it gently pauses the
 * background music, then resumes it when the clip ends — so the two never
 * talk over each other.
 */
export function VideoMoment() {
  const config = useConfig();
  const t = useT();
  const { isPlaying, toggleMusic } = useExperience();
  const video = config.videoMoment;
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const resumeMusic = useRef(false);

  if (!video.src) return null;

  const play = () => {
    haptic(12);
    setStarted(true);
    // duck the music while the clip plays
    if (isPlaying) {
      resumeMusic.current = true;
      toggleMusic();
    }
    // let the element mount its controls, then start
    requestAnimationFrame(() => ref.current?.play().catch(() => {}));
  };

  const onEnded = () => {
    if (resumeMusic.current) {
      resumeMusic.current = false;
      toggleMusic();
    }
  };

  return (
    <section id="moment" aria-label={video.title} className="section relative py-24">
      <SectionHeading eyebrow={t('eyebrowMoment')} title={video.title} intro={video.intro} className="mb-12" />

      <Reveal direction="scale" className="mx-auto w-full max-w-2xl">
        <div className="shimmer-border glow-rose glass relative overflow-hidden rounded-[2rem] p-1.5">
          <div className="relative overflow-hidden rounded-[1.6rem] bg-ink">
            <video
              ref={ref}
              src={video.src}
              poster={video.poster}
              controls={started}
              playsInline
              preload="metadata"
              onEnded={onEnded}
              onPause={onEnded}
              className="block max-h-[70vh] w-full"
            />

            {/* Poster overlay + play button (before first play) */}
            <AnimatePresence>
              {!started && (
                <motion.button
                  type="button"
                  onClick={play}
                  aria-label={t('playVideo')}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/30"
                >
                  <motion.span
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose to-rose-deep text-warmwhite shadow-2xl"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Play className="h-8 w-8 translate-x-0.5" fill="currentColor" />
                  </motion.span>
                  <span className="glass rounded-full px-5 py-2 text-sm tracking-wide text-warmwhite">
                    {t('playVideo')}
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-5 flex items-center justify-center gap-2 text-center text-sm text-warmwhite/50">
          <CalendarDays className="h-4 w-4" />
          {video.caption}
        </p>
      </Reveal>
    </section>
  );
}
