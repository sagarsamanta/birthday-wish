import { useEffect, useRef, useState } from 'react';

interface Options {
  lines: string[];
  /** ms per character */
  speed?: number;
  /** ms pause between lines */
  linePause?: number;
  /** delay before starting */
  startDelay?: number;
  enabled?: boolean;
}

interface TypewriterState {
  /** fully or partially typed lines, in order */
  displayed: string[];
  done: boolean;
}

/**
 * Types out an array of lines one character at a time. Honours
 * prefers-reduced-motion by rendering everything instantly.
 */
export function useTypewriter({
  lines,
  speed = 45,
  linePause = 650,
  startDelay = 300,
  enabled = true,
}: Options): TypewriterState {
  const [displayed, setDisplayed] = useState<string[]>(() => lines.map(() => ''));
  const [done, setDone] = useState(false);
  const timers = useRef<number[]>([]);

  const linesKey = lines.join('');

  useEffect(() => {
    if (!enabled) return;

    // reset when the text (e.g. language) changes
    setDisplayed(lines.map(() => ''));
    setDone(false);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setDisplayed([...lines]);
      setDone(true);
      return;
    }

    let cancelled = false;
    const run = (line: number, char: number, elapsed: number) => {
      if (line >= lines.length) {
        timers.current.push(window.setTimeout(() => !cancelled && setDone(true), elapsed));
        return;
      }
      const text = lines[line];
      if (char > text.length) {
        run(line + 1, 0, elapsed + linePause);
        return;
      }
      timers.current.push(
        window.setTimeout(() => {
          if (cancelled) return;
          setDisplayed((prev) => {
            const next = [...prev];
            next[line] = text.slice(0, char);
            return next;
          });
        }, elapsed),
      );
      run(line, char + 1, elapsed + speed);
    };

    timers.current.push(
      window.setTimeout(() => !cancelled && run(0, 0, 0), startDelay),
    );

    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, linesKey]);

  return { displayed, done };
}
