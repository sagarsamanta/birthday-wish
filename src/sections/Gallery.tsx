import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useConfig, useT } from '@/i18n/hooks';
import { SmartImage } from '@/components/ui/SmartImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Lightbox } from '@/components/Lightbox';
import { haptic } from '@/utils/haptics';

// gentle, deterministic tilt per card so the wall feels hand-arranged
const TILTS = [-3, 2.4, -1.6, 3, -2.2, 1.8, -2.8, 2];

/**
 * A hand-arranged wall of polaroid memories in a masonry layout. Each card
 * tilts slightly, lifts on hover, and opens a fullscreen swipeable lightbox
 * on tap. Real photos drop into /public/gallery; until then, elegant
 * gradient placeholders stand in.
 */
export function Gallery() {
  const reduced = useReducedMotion();
  const config = useConfig();
  const t = useT();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = config.gallery.items;

  return (
    <section id="gallery" aria-label={config.gallery.title} className="section relative py-24">
      <SectionHeading
        eyebrow={t('eyebrowMemories')}
        title={config.gallery.title}
        intro={config.gallery.intro}
        className="mb-14"
      />

      <div className="mx-auto max-w-3xl columns-2 gap-3 sm:columns-3 sm:gap-4 [column-fill:balance]">
        {items.map((item, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => {
              haptic(12);
              setOpenIndex(i);
            }}
            aria-label={`Open memory: ${item.title}`}
            initial={{ opacity: 0, y: 40, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: reduced ? 0 : TILTS[i % TILTS.length] }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduced ? undefined : { rotate: 0, scale: 1.04, zIndex: 5 }}
            whileTap={{ scale: 0.97 }}
            className="group mb-3 block w-full break-inside-avoid rounded-[10px] bg-gradient-to-b from-[#fbf6ef] to-[#efe6da] p-2.5 pb-9 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)] sm:mb-4"
          >
            <SmartImage
              src={item.src}
              alt={item.title}
              seed={i}
              variant="thumb"
              className="aspect-[3/4] w-full rounded-[4px]"
            />
            <span className="mt-2.5 block px-1 text-center font-script text-lg leading-none text-[#4a3b39]">
              {item.title}
            </span>
          </motion.button>
        ))}
      </div>

      <Lightbox
        items={items}
        openIndex={openIndex}
        onClose={() => setOpenIndex(null)}
      />
    </section>
  );
}
