import { Reveal } from './Reveal';
import { cn } from '@/utils/cn';

/** Consistent, elegant section header: eyebrow + display title + intro. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto max-w-2xl text-center', className)}>
      {eyebrow && (
        <Reveal direction="up">
          <p className="eyebrow mb-4">{eyebrow}</p>
        </Reveal>
      )}
      <Reveal direction="up" delay={0.08}>
        <h2 className="font-display text-4xl leading-tight text-balance sm:text-5xl">
          <span className="text-gold-gradient animate-sheen">{title}</span>
        </h2>
      </Reveal>
      {intro && (
        <Reveal direction="up" delay={0.16}>
          <p className="mt-4 font-serif-el text-lg italic text-warmwhite/70 text-pretty">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
