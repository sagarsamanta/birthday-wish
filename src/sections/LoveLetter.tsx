import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Heart } from 'lucide-react';
import { useConfig, useT } from '@/i18n/hooks';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useTypewriter } from '@/hooks/useTypewriter';

/**
 * A handwritten letter that unfolds like aged paper as it enters view. The
 * salutation types itself in; the body then reveals line by line in a warm
 * serif, finished with a wax seal.
 */
export function LoveLetter() {
  const reduced = useReducedMotion();
  const config = useConfig();
  const t = useT();
  const letter = config.loveLetter;
  const [opened, setOpened] = useState(false);
  const startedRef = useRef(false);

  const { displayed, done } = useTypewriter({
    lines: [letter.salutation],
    speed: 70,
    startDelay: 400,
    enabled: opened,
  });

  return (
    <section
      id="letter"
      aria-label={letter.title}
      className="section relative flex flex-col items-center py-24"
      style={{ perspective: 1200 }}
    >
      <SectionHeading eyebrow={t('eyebrowLetter')} title={letter.title} className="mb-14" />

      <motion.article
        initial={{ opacity: 0, rotateX: reduced ? 0 : -75, y: 40 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        onViewportEnter={() => {
          if (!startedRef.current) {
            startedRef.current = true;
            setOpened(true);
          }
        }}
        style={{ transformOrigin: 'top center' }}
        className="relative w-full max-w-xl overflow-hidden rounded-[6px] px-7 py-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] sm:px-12 sm:py-14"
      >
        {/* paper */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#f7efe1] to-[#efe2ce]" />
        <div className="absolute inset-0 -z-10 opacity-[0.5] mix-blend-multiply bg-[radial-gradient(120%_80%_at_50%_0%,transparent_60%,rgba(120,90,60,0.18))]" />
        {/* left margin line */}
        <div className="absolute inset-y-6 left-8 w-px bg-rose-deep/25 sm:left-10" aria-hidden="true" />

        <p className="min-h-[2.5rem] font-script text-3xl text-[#7a3b46]">
          {displayed[0]}
          {opened && !done && (
            <span className="ml-0.5 inline-block h-6 w-px animate-pulse bg-[#7a3b46] align-middle" />
          )}
        </p>

        <div className="mt-6 space-y-4">
          {letter.body.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={done ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.25 + i * 0.5, ease: 'easeOut' }}
              className="font-serif-el text-[1.15rem] leading-relaxed text-[#4a3a30]"
            >
              {para}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={done ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 + letter.body.length * 0.5, duration: 0.8 }}
          className="mt-8 flex items-center justify-between"
        >
          <p className="font-script text-2xl text-[#7a3b46]">
            {letter.signature},
            <br />
            <span className="text-3xl">{config.yourName}</span>
          </p>
          {/* wax seal */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose to-rose-deep text-warmwhite shadow-lg">
            <Heart className="h-6 w-6" fill="currentColor" />
          </div>
        </motion.div>
      </motion.article>
    </section>
  );
}
