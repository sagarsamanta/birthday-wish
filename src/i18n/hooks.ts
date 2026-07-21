import { useMemo } from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { rawConfig } from '@/data/config';
import type { SiteConfig } from '@/data/types';
import { localize } from './index';
import { UI, type UIKey } from './ui';

/** The content config, resolved to the active language. */
export function useConfig(): SiteConfig {
  const { lang } = useExperience();
  return useMemo(() => localize(rawConfig, lang) as unknown as SiteConfig, [lang]);
}

/** Translator for UI/chrome strings: `const t = useT(); t('scroll')`. */
export function useT() {
  const { lang } = useExperience();
  return useMemo(() => (key: UIKey) => UI[key][lang], [lang]);
}
