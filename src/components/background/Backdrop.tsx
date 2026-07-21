import { ParticleField } from './ParticleField';

/**
 * The persistent site backdrop: a deep gradient base, three slowly drifting
 * aurora "blobs" for colour depth, a subtle grain, and the particle field.
 * Fixed behind all content.
 */
export function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink" aria-hidden="true">
      {/* base vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,#1c1430_0%,#0a0710_58%,#070409_100%)]" />

      {/* aurora blobs */}
      <div className="aurora aurora--rose" />
      <div className="aurora aurora--plum" />
      <div className="aurora aurora--gold" />

      {/* particles */}
      <ParticleField className="absolute inset-0 h-full w-full" />

      {/* grain */}
      <div className="grain absolute inset-0" />

      {/* bottom fade for legibility */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
    </div>
  );
}
