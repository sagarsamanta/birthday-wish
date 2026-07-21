import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Heart } from 'lucide-react';
import { config } from '@/data/config';
import { ParticleField } from './background/ParticleField';

interface Remaining {
  d: number;
  h: number;
  m: number;
  s: number;
  done: boolean;
}

function compute(target: number): Remaining {
  const diff = Math.max(0, target - Date.now());
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
    done: diff <= 0,
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

function Tile({ value, label, pulse }: { value: number; label: string; pulse?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="shimmer-border glass-dark relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl sm:h-24 sm:w-24">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: pulse ? 14 : 0, opacity: pulse ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: pulse ? -14 : 0, opacity: pulse ? 0 : 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-gold-gradient font-display text-3xl font-semibold tabular-nums sm:text-5xl"
          >
            {pad(value)}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[0.6rem] uppercase tracking-[0.28em] text-warmwhite/50">{label}</span>
    </div>
  );
}

/**
 * Locks the whole experience behind a live countdown until `unlockDate`.
 * When the timer reaches zero it flips to all-zeros, celebrates briefly, then
 * calls `onUnlock` to reveal the surprise.
 */
export function CountdownGate({ onUnlock }: { onUnlock: () => void }) {
  const reduced = useReducedMotion();
  const target = useMemo(() => new Date(config.unlockDate ?? '').getTime(), []);
  const [rem, setRem] = useState<Remaining>(() => compute(target));
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (rem.done) {
      // celebrate for a beat, then unlock
      const t = setTimeout(() => {
        setLeaving(true);
        setTimeout(onUnlock, 900);
      }, 1600);
      return () => clearTimeout(t);
    }
    const id = setInterval(() => setRem(compute(target)), 1000);
    return () => clearInterval(id);
  }, [rem.done, target, onUnlock]);

  const prettyDate = useMemo(() => {
    try {
      return new Date(target).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  }, [target]);

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(12px)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_35%,#1a1230_0%,#0a0710_60%,#050308_100%)]" />
          <ParticleField className="absolute inset-0 h-full w-full" density={1.2} />

          <div className="relative flex flex-col items-center">
            <motion.div
              className="relative mb-8 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute h-24 w-24 rounded-full bg-rose/20 blur-2xl" />
              <Heart className="animate-heartbeat h-10 w-10 text-rose" fill="currentColor" strokeWidth={1} />
            </motion.div>

            <motion.p
              className="eyebrow mb-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {config.countdown.eyebrow}
            </motion.p>

            <motion.h1
              className="font-script text-6xl leading-none sm:text-7xl"
              initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.3, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <span
                className="text-gold-gradient animate-sheen"
                style={{ filter: 'drop-shadow(0 6px 26px rgba(230,164,180,0.5))' }}
              >
                {rem.done ? `Happy Birthday, ${config.wifeName}` : config.countdown.title}
              </span>
            </motion.h1>

            <motion.div
              className="mt-10 flex items-start gap-2 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Tile value={rem.d} label="Days" />
              <span className="pt-6 font-display text-3xl text-warmwhite/30 sm:pt-8 sm:text-4xl">:</span>
              <Tile value={rem.h} label="Hours" />
              <span className="pt-6 font-display text-3xl text-warmwhite/30 sm:pt-8 sm:text-4xl">:</span>
              <Tile value={rem.m} label="Minutes" />
              <span className="pt-6 font-display text-3xl text-warmwhite/30 sm:pt-8 sm:text-4xl">:</span>
              <Tile value={rem.s} label="Seconds" pulse={!reduced} />
            </motion.div>

            <motion.p
              className="mt-10 max-w-sm font-serif-el text-lg italic text-warmwhite/60 text-pretty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              {rem.done ? 'Your surprise is ready…' : config.countdown.note}
            </motion.p>

            {!rem.done && prettyDate && (
              <motion.p
                className="mt-3 text-xs uppercase tracking-[0.3em] text-gold-soft/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.85 }}
              >
                {prettyDate}
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
