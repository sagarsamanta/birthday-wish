/**
 * Tiny i18n core.
 *
 * Content lives once, as `{ en, bn }` pairs. `localize()` deep-resolves those
 * pairs to plain strings for the active language, leaving language-neutral
 * values (image paths, dates that stay numeric, moods) untouched — so the rest
 * of the app keeps consuming a normal `SiteConfig`.
 */
export type Lang = 'en' | 'bn';

export interface LS {
  en: string;
  bn: string;
}

/** A localised-string pair: exactly `{ en, bn }` with string values. */
export function isLS(v: unknown): v is LS {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  const keys = Object.keys(o);
  return keys.length === 2 && typeof o.en === 'string' && typeof o.bn === 'string';
}

/** Deep-resolve every `{en,bn}` pair to the chosen language. */
export function localize<T>(node: T, lang: Lang): T {
  if (isLS(node)) return node[lang] as unknown as T;
  if (Array.isArray(node)) return node.map((n) => localize(n, lang)) as unknown as T;
  if (node && typeof node === 'object') {
    const out: Record<string, unknown> = {};
    for (const k in node as Record<string, unknown>) {
      out[k] = localize((node as Record<string, unknown>)[k], lang);
    }
    return out as T;
  }
  return node;
}

/** Convenience for a single pair. */
export const t = (pair: LS | string, lang: Lang): string =>
  typeof pair === 'string' ? pair : pair[lang];
