/**
 * Soft "haptic-like" feedback. Uses the Vibration API where available
 * (most Android phones); silently no-ops elsewhere (iOS Safari).
 */
export function haptic(pattern: number | number[] = 12) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    /* ignore */
  }
}
