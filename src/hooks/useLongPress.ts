import { useCallback, useRef } from 'react';

interface Options {
  /** ms to hold before firing */
  delay?: number;
  /** called once the hold completes */
  onLongPress: () => void;
  /** optional progress callback 0..1 while holding */
  onProgress?: (p: number) => void;
}

/**
 * Long-press / press-and-hold detector that works for both touch and mouse.
 * Returns handlers to spread onto any element. Cancels if the pointer
 * moves too far or lifts early.
 */
export function useLongPress({ delay = 5000, onLongPress, onProgress }: Options) {
  const timer = useRef<number | null>(null);
  const raf = useRef<number | null>(null);
  const start = useRef(0);
  const origin = useRef<{ x: number; y: number } | null>(null);

  const clear = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    if (raf.current) cancelAnimationFrame(raf.current);
    timer.current = null;
    raf.current = null;
    origin.current = null;
    onProgress?.(0);
  }, [onProgress]);

  const begin = useCallback(
    (x: number, y: number) => {
      origin.current = { x, y };
      start.current = performance.now();

      const tick = () => {
        const elapsed = performance.now() - start.current;
        onProgress?.(Math.min(1, elapsed / delay));
        if (elapsed < delay) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);

      timer.current = window.setTimeout(() => {
        onLongPress();
        clear();
      }, delay);
    },
    [delay, onLongPress, onProgress, clear],
  );

  const move = useCallback(
    (x: number, y: number) => {
      if (!origin.current) return;
      const dx = x - origin.current.x;
      const dy = y - origin.current.y;
      if (Math.hypot(dx, dy) > 18) clear();
    },
    [clear],
  );

  return {
    onTouchStart: (e: React.TouchEvent) => begin(e.touches[0].clientX, e.touches[0].clientY),
    onTouchMove: (e: React.TouchEvent) => move(e.touches[0].clientX, e.touches[0].clientY),
    onTouchEnd: clear,
    onTouchCancel: clear,
    onMouseDown: (e: React.MouseEvent) => begin(e.clientX, e.clientY),
    onMouseMove: (e: React.MouseEvent) => move(e.clientX, e.clientY),
    onMouseUp: clear,
    onMouseLeave: clear,
  };
}
