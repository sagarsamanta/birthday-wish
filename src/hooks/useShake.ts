import { useEffect, useRef } from 'react';

/**
 * Detects a "shake" gesture via the DeviceMotion API. On iOS 13+ the
 * permission must be requested from a user gesture, so we expose a helper
 * the app can call after the first tap. Gracefully no-ops on desktop.
 */
export function useShake(onShake: () => void, threshold = 16) {
  const last = useRef({ x: 0, y: 0, z: 0, t: 0 });
  const cooldown = useRef(0);

  useEffect(() => {
    const handler = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x == null || acc.y == null || acc.z == null) return;

      const now = e.timeStamp;
      const prev = last.current;
      const dt = now - prev.t;
      if (dt < 90) return;

      const delta =
        Math.abs(acc.x - prev.x) + Math.abs(acc.y - prev.y) + Math.abs(acc.z - prev.z);

      last.current = { x: acc.x, y: acc.y, z: acc.z, t: now };

      if (delta > threshold && now - cooldown.current > 1200) {
        cooldown.current = now;
        onShake();
      }
    };

    window.addEventListener('devicemotion', handler);
    return () => window.removeEventListener('devicemotion', handler);
  }, [onShake, threshold]);
}

/** Requests DeviceMotion permission on iOS. Safe to call anywhere. */
export async function requestMotionPermission(): Promise<void> {
  try {
    const anyMotion = DeviceMotionEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    if (typeof anyMotion.requestPermission === 'function') {
      await anyMotion.requestPermission();
    }
  } catch {
    /* ignore */
  }
}
