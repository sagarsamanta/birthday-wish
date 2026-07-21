import { ParticleField } from './ParticleField';
import { useExperience } from '@/context/ExperienceContext';

/**
 * The persistent site backdrop. In dark mode: a deep gradient, drifting
 * aurora blobs, and a particle field. In light mode: a soft warm-cream wash
 * with gently multiplied aurora (particles are dropped — they only read on
 * black). Fixed behind all content.
 */
export function Backdrop() {
  const { theme } = useExperience();
  const dark = theme === 'dark';

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink" aria-hidden="true">
      {/* base wash */}
      <div
        className={
          dark
            ? 'absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,#1c1430_0%,#0a0710_58%,#070409_100%)]'
            : 'absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,#fbf3e8_0%,#f4ebdf_55%,#efe4d4_100%)]'
        }
      />

      {/* aurora blobs */}
      <div className="aurora aurora--rose" />
      <div className="aurora aurora--plum" />
      <div className="aurora aurora--gold" />

      {/* particles (dark only) */}
      {dark && <ParticleField className="absolute inset-0 h-full w-full" />}

      {/* grain */}
      <div className="grain absolute inset-0" />

      {/* bottom fade for legibility */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
    </div>
  );
}
