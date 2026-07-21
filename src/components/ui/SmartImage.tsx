import { useMemo, useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

const GRADIENTS = [
  'linear-gradient(135deg, #3a2740, #b76e79 55%, #f6d6c4)',
  'linear-gradient(135deg, #241a33, #6d4b7a 50%, #e6a4b4)',
  'linear-gradient(135deg, #2a1c2e, #d9b382 60%, #f3e4cf)',
  'linear-gradient(135deg, #1f1730, #9a76ad 55%, #f6d6c4)',
  'linear-gradient(135deg, #33212e, #b76e79 45%, #e9cfa8)',
  'linear-gradient(135deg, #201a2e, #6d4b7a 55%, #d9b382)',
];

/** Map an original photo path to its optimised WebP variant (see npm run optimize). */
function optimizedUrl(src: string, variant: 'thumb' | 'full') {
  const dot = src.lastIndexOf('.');
  if (dot === -1) return src;
  return `${src.slice(0, dot)}.${variant === 'thumb' ? 'thumb' : 'opt'}.webp`;
}

/**
 * Shows an elegant gradient placeholder immediately, then fades in the
 * lightest source that works: optimised WebP → original file → placeholder.
 * Nothing ever looks broken, and the grid loads a fraction of the bytes.
 */
export function SmartImage({
  src,
  alt,
  seed = 0,
  variant = 'full',
  className,
  imgClassName,
  loading = 'lazy',
  fetchPriority,
}: {
  src: string;
  alt: string;
  seed?: number;
  variant?: 'thumb' | 'full';
  className?: string;
  imgClassName?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}) {
  // Preference order of sources to try.
  const candidates = useMemo(() => {
    const opt = optimizedUrl(src, variant);
    return opt !== src ? [opt, src] : [src];
  }, [src, variant]);

  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const gradient = GRADIENTS[seed % GRADIENTS.length];

  return (
    <div className={cn('relative overflow-hidden bg-ink-soft', className)} style={{ background: gradient }}>
      {!loaded && !failed && <div className="absolute inset-0 animate-pulse bg-white/5" />}
      {failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-warmwhite/50">
          <ImageIcon className="h-7 w-7" strokeWidth={1.4} />
          <span className="px-4 text-center font-serif-el text-sm italic">{alt}</span>
        </div>
      )}
      <img
        key={candidates[idx]}
        src={candidates[idx]}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (idx < candidates.length - 1) {
            setIdx(idx + 1);
          } else {
            setFailed(true);
          }
        }}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-700 ease-out',
          loaded ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
      />
    </div>
  );
}
