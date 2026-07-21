import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Zoom } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import { X, MapPin, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/zoom';
import type { GalleryItem } from '@/data/types';
import { SmartImage } from './ui/SmartImage';
import { useT } from '@/i18n/hooks';
import { haptic } from '@/utils/haptics';

/**
 * A fullscreen, premium image viewer. Open any photo to see it complete;
 * move through the whole set one by one with the on-screen prev/next
 * buttons, a swipe, or the arrow keys. Pinch to zoom, tap ✕ to close.
 */
export function Lightbox({
  items,
  openIndex,
  onClose,
}: {
  items: GalleryItem[];
  openIndex: number | null;
  onClose: () => void;
}) {
  const open = openIndex !== null;
  const t = useT();
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [active, setActive] = useState(openIndex ?? 0);

  useEffect(() => {
    if (openIndex !== null) setActive(openIndex);
  }, [openIndex]);

  // Lock body scroll while open + close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const go = (dir: -1 | 1) => {
    haptic(10);
    if (dir === 1) swiper?.slideNext();
    else swiper?.slidePrev();
  };

  const NavButton = ({ dir }: { dir: -1 | 1 }) => (
    <button
      type="button"
      aria-label={dir === 1 ? t('next') : t('prev')}
      onClick={() => go(dir)}
      className="glass pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full text-warmwhite shadow-xl transition-transform active:scale-90 sm:h-14 sm:w-14"
    >
      {dir === 1 ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
    </button>
  );

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col bg-ink/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          {/* Top bar: counter + close */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))]">
            <span className="glass pointer-events-auto rounded-full px-4 py-1.5 text-xs tracking-[0.2em] text-warmwhite/80 tabular-nums">
              {String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              aria-label={t('close')}
              onClick={() => {
                haptic(10);
                onClose();
              }}
              className="glass pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full text-warmwhite"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <Swiper
            modules={[Keyboard, Zoom]}
            initialSlide={openIndex ?? 0}
            loop={items.length > 1}
            keyboard={{ enabled: true }}
            zoom={{ maxRatio: 3 }}
            spaceBetween={24}
            onSwiper={(s) => {
              setSwiper(s);
              setActive(s.realIndex);
            }}
            onSlideChange={(s) => setActive(s.realIndex)}
            className="h-full w-full"
          >
            {items.map((item, i) => (
              <SwiperSlide key={i} className="flex items-center justify-center">
                <div className="flex h-full w-full flex-col items-center justify-center px-4 pb-24 pt-[max(4.5rem,env(safe-area-inset-top))]">
                  <div className="swiper-zoom-container flex max-h-[64vh] w-full max-w-lg items-center justify-center">
                    <SmartImage
                      src={item.src}
                      alt={item.title}
                      seed={i}
                      loading="eager"
                      className="max-h-[64vh] w-full rounded-2xl shadow-2xl"
                      imgClassName="!object-contain"
                    />
                  </div>

                  <motion.div
                    key={`meta-${i}-${active}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.5 }}
                    className="glass-dark mt-5 w-full max-w-lg rounded-2xl p-5 text-center"
                  >
                    <h3 className="font-display text-2xl text-gold-gradient">{item.title}</h3>
                    <p className="mt-2 font-serif-el text-base italic text-warmwhite/80 text-pretty">
                      {item.caption}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-warmwhite/50">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {item.date}
                      </span>
                      {item.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {item.location}
                        </span>
                      )}
                    </div>
                  </motion.div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Prev / Next controls */}
          {items.length > 1 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-20 flex items-center justify-center gap-6">
              <NavButton dir={-1} />
              <span className="text-[10px] uppercase tracking-[0.3em] text-warmwhite/40">
                {t('swipeZoom')}
              </span>
              <NavButton dir={1} />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
