import { useShake } from '@/hooks/useShake';
import { useExperience } from '@/context/ExperienceContext';

/** Bridges a device shake to the flower-fall easter egg. Renders nothing. */
export function ShakeListener() {
  const { dropFlowers } = useExperience();
  useShake(dropFlowers);
  return null;
}
