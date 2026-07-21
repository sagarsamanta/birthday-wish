import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useT } from '@/i18n/hooks';
import { haptic } from '@/utils/haptics';

const CANDLES = [22, 40, 58, 76]; // left % positions across the cake top

/**
 * A hand-built birthday cake with candles whose flames flicker and glow.
 * Tap it to "make a wish" and blow the candles out — the flames puff into
 * little wisps of smoke and a wish note appears. Fully CSS/SVG, no images.
 */
export function Cake({ onBlowOut }: { onBlowOut?: () => void }) {
  const reduced = useReducedMotion();
  const t = useT();
  const [lit, setLit] = useState(true);

  const blow = () => {
    if (!lit) return;
    setLit(false);
    haptic([10, 30, 10]);
    onBlowOut?.();
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={blow}
        aria-label={lit ? 'Make a wish and blow out the candles' : 'Candles blown out'}
        className="relative mx-auto block w-[220px] max-w-[72vw] cursor-pointer select-none outline-none"
      >
        <div className="relative mx-auto aspect-[220/210] w-full">
          {/* glow when lit */}
          <AnimatePresence>
            {lit && (
              <motion.div
                className="absolute left-1/2 top-2 h-24 w-40 -translate-x-1/2 rounded-full bg-gold/30 blur-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: reduced ? 0.5 : [0.4, 0.7, 0.4] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.4, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
              />
            )}
          </AnimatePresence>

          {/* candles + flames */}
          {CANDLES.map((x, i) => (
            <div key={i} className="absolute" style={{ left: `${x}%`, top: '2%', width: '7%' }}>
              {/* flame */}
              <div className="relative mx-auto h-8 w-full">
                <AnimatePresence>
                  {lit ? (
                    <motion.div
                      className="absolute left-1/2 bottom-0 -translate-x-1/2"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={
                        reduced
                          ? { scale: 1, opacity: 1 }
                          : { scale: [1, 1.18, 0.92, 1.1, 1], opacity: 1, y: [0, -1, 0.5, 0] }
                      }
                      exit={{ scale: 0, opacity: 0, y: -10 }}
                      transition={{
                        scale: { duration: 0.6 + i * 0.07, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' },
                        y: { duration: 0.7, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' },
                      }}
                    >
                      <div
                        className="h-4 w-2.5 rounded-full"
                        style={{
                          background: 'radial-gradient(circle at 50% 70%, #fff6d6 0%, #ffcf6b 45%, #ff8a3d 80%, transparent 100%)',
                          boxShadow: '0 0 10px 3px rgba(255,180,80,0.7)',
                        }}
                      />
                    </motion.div>
                  ) : (
                    !reduced && (
                      <motion.div
                        className="absolute left-1/2 bottom-1 h-2 w-2 -translate-x-1/2 rounded-full bg-white/40 blur-[2px]"
                        initial={{ opacity: 0.6, y: 0, scale: 0.6 }}
                        animate={{ opacity: 0, y: -26, scale: 1.4 }}
                        transition={{ duration: 1.1, ease: 'easeOut' }}
                      />
                    )
                  )}
                </AnimatePresence>
              </div>
              {/* candle stick */}
              <div
                className="mx-auto h-9 w-full rounded-sm"
                style={{
                  background: `repeating-linear-gradient(45deg, ${i % 2 ? '#e6a4b4' : '#d9b382'} 0 5px, #fff6ec 5px 10px)`,
                }}
              />
            </div>
          ))}

          {/* cake tiers */}
          <div className="absolute bottom-0 left-1/2 w-full -translate-x-1/2">
            {/* top tier */}
            <div className="relative mx-auto h-[64px] w-[72%] rounded-t-xl bg-gradient-to-b from-[#5a3a48] to-[#42303c]">
              {/* frosting */}
              <div className="absolute -top-2 left-0 h-5 w-full rounded-full bg-gradient-to-b from-[#f7ead9] to-[#efd9c0]"
                   style={{ clipPath: 'polygon(0 40%,8% 100%,16% 40%,24% 100%,32% 40%,40% 100%,48% 40%,56% 100%,64% 40%,72% 100%,80% 40%,88% 100%,96% 40%,100% 100%,100% 0,0 0)' }} />
            </div>
            {/* bottom tier */}
            <div className="relative mx-auto -mt-1 h-[86px] w-full rounded-t-xl rounded-b-md bg-gradient-to-b from-[#6d4b5c] to-[#4a2f3d] shadow-2xl">
              <div className="absolute -top-2 left-0 h-5 w-full bg-gradient-to-b from-[#f7ead9] to-[#e9c9ad]"
                   style={{ clipPath: 'polygon(0 40%,6% 100%,12% 40%,18% 100%,24% 40%,30% 100%,36% 40%,42% 100%,48% 40%,54% 100%,60% 40%,66% 100%,72% 40%,78% 100%,84% 40%,90% 100%,96% 40%,100% 100%,100% 0,0 0)' }} />
              {/* little dots */}
              <div className="absolute bottom-4 left-0 flex w-full justify-around px-3">
                {Array.from({ length: 7 }).map((_, k) => (
                  <span key={k} className="h-1.5 w-1.5 rounded-full bg-gold-soft/70" />
                ))}
              </div>
            </div>
            {/* plate */}
            <div className="mx-auto h-2.5 w-[112%] -translate-x-[5%] rounded-full bg-gradient-to-b from-warmwhite/25 to-warmwhite/5" />
          </div>
        </div>
      </button>

      <div className="mt-5 h-6 text-center">
        <AnimatePresence mode="wait">
          {lit ? (
            <motion.p
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm tracking-wide text-warmwhite/60"
            >
              {t('cakeWish')}
            </motion.p>
          ) : (
            <motion.p
              key="done"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-script text-2xl text-rose-gradient"
            >
              {t('cakeDone')}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
