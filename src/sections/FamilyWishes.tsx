import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Pagination } from 'swiper/modules';
import { Heart } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import { useConfig, useT } from '@/i18n/hooks';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/ui/SmartImage';
import { Reveal } from '@/components/ui/Reveal';

/**
 * A swipeable stack of birthday wishes from her family, presented like a
 * deck of keepsake cards. Each image is shown in full (object-contain) so
 * nothing is ever cropped out of a message.
 */
export function FamilyWishes() {
  const config = useConfig();
  const t = useT();
  const { title, intro, items } = config.familyWishes;
  if (!items.length) return null;

  return (
    <section id="wishes" aria-label={title} className="section relative py-24">
      <SectionHeading eyebrow={t('eyebrowWishes')} title={title} intro={intro} className="mb-14" />

      <Reveal direction="scale" className="mx-auto w-full max-w-[20rem]">
        <Swiper
          modules={[EffectCards, Pagination]}
          effect="cards"
          grabCursor
          pagination={{ clickable: true }}
          className="w-full"
        >
          {items.map((wish, i) => (
            <SwiperSlide key={i} className="overflow-hidden rounded-3xl">
              <div className="glass-dark shimmer-border relative flex flex-col rounded-3xl p-3">
                <SmartImage
                  src={wish.src}
                  alt={`Birthday wish ${wish.from}`}
                  seed={i + 2}
                  className="aspect-[3/4] w-full rounded-2xl"
                  imgClassName="!object-contain"
                />
                <div className="flex items-center justify-between px-2 pb-1 pt-3">
                  <div>
                    <p className="font-display text-lg leading-none text-warmwhite">{wish.from}</p>
                    {wish.note && (
                      <p className="mt-1 font-serif-el text-sm italic text-warmwhite/60">{wish.note}</p>
                    )}
                  </div>
                  <Heart className="h-5 w-5 shrink-0 text-rose" fill="currentColor" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Reveal>

      <p className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] text-warmwhite/30">
        {t('swipeCards')}
      </p>
    </section>
  );
}
