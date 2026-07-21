import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, Volume2, Volume1, VolumeX, Music2 } from 'lucide-react';
import { useExperience } from '@/context/ExperienceContext';
import { haptic } from '@/utils/haptics';

/**
 * A floating glassmorphism music controller. Collapsed to a single elegant
 * pill; tap to expand into play/pause, next, and volume. Fixed bottom-right,
 * comfortably within one-hand reach.
 */
export function MusicController() {
  const {
    started,
    isPlaying,
    toggleMusic,
    nextTrack,
    volume,
    setVolume,
    trackTitle,
  } = useExperience();
  const [open, setOpen] = useState(false);

  if (!started) return null;

  const VolIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="glass-dark w-60 rounded-3xl p-4 shadow-2xl"
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose/20">
                <Music2 className="h-4 w-4 text-rose" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-warmwhite">{trackTitle}</p>
                <p className="text-[10px] uppercase tracking-widest text-warmwhite/40">
                  {isPlaying ? 'Now playing' : 'Paused'}
                </p>
              </div>
            </div>

            <div className="mb-3 flex items-center justify-center gap-3">
              <button
                type="button"
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
                onClick={toggleMusic}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose to-rose-deep text-ink shadow-lg transition-transform active:scale-90"
              >
                {isPlaying ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" />}
              </button>
              <button
                type="button"
                aria-label="Next track"
                onClick={nextTrack}
                className="flex h-10 w-10 items-center justify-center rounded-full glass text-warmwhite transition-transform active:scale-90"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <VolIcon className="h-4 w-4 shrink-0 text-warmwhite/60" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                aria-label="Volume"
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-rose"
                style={{
                  background: `linear-gradient(to right, var(--color-rose) ${volume * 100}%, rgba(255,255,255,0.15) ${volume * 100}%)`,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pill toggle */}
      <motion.button
        type="button"
        aria-label={open ? 'Close music controls' : 'Open music controls'}
        aria-expanded={open}
        onClick={() => {
          haptic(10);
          setOpen((o) => !o);
        }}
        whileTap={{ scale: 0.92 }}
        className="glass-dark glow-rose flex h-[3.25rem] items-center gap-2 rounded-full px-3 py-2 shadow-xl"
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-rose/25">
          <Music2 className="h-4 w-4 text-rose" />
          {isPlaying && (
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-soft opacity-70" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-gold-soft" />
            </span>
          )}
        </span>
        {/* Equaliser bars when playing */}
        <span className="flex h-4 items-end gap-0.5 pr-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-0.5 rounded-full bg-warmwhite/70"
              style={{
                height: '3px',
                animation: isPlaying ? `eq 0.9s ${i * 0.18}s ease-in-out infinite` : 'none',
              }}
            />
          ))}
        </span>
      </motion.button>
    </div>
  );
}
