import type { ComponentType } from 'react';
import {
  Sparkles,
  Sparkle,
  Plane,
  MessagesSquare,
  Laugh,
  Heart,
  Cake,
  Smile,
  HeartHandshake,
  Shield,
  Music,
  Infinity as InfinityIcon,
  Star,
  Gift,
  type LucideProps,
} from 'lucide-react';

/**
 * Maps the string icon names used in config.ts to real components,
 * so content can stay data-only. Unknown names fall back to a heart.
 */
const map: Record<string, ComponentType<LucideProps>> = {
  sparkles: Sparkles,
  sparkle: Sparkle,
  plane: Plane,
  'messages-square': MessagesSquare,
  laugh: Laugh,
  heart: Heart,
  cake: Cake,
  smile: Smile,
  'heart-handshake': HeartHandshake,
  shield: Shield,
  music: Music,
  infinity: InfinityIcon,
  star: Star,
  gift: Gift,
};

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = map[name] ?? Heart;
  return <Cmp {...props} />;
}
