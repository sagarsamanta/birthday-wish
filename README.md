# For You ❤ — a cinematic birthday experience

A premium, mobile-first, single-page love story built as an interactive
memory journey. Cinematic loader, animated hero, scroll-driven chapters,
polaroid gallery, an unfolding love letter, a scroll timeline, floating
reason cards, a gift-box surprise, a particle-heart finale with fireworks,
plus hidden secrets and easter eggs.

## Tech
React 19 · Vite · TypeScript · Motion (Framer Motion) ·
Lenis smooth scroll · Tailwind CSS v4 · Swiper · Lucide icons ·
Web Audio generative music · hand-written canvas particle systems.

## Run it

```bash
npm install
npm run dev       # start dev server
npm run build     # type-check + production build
npm run preview   # preview the production build
```

Open the dev URL on your phone (same Wi-Fi: `npm run dev -- --host`).

## Make it yours — edit ONE file

Everything personal lives in [`src/data/config.ts`](src/data/config.ts):
her name, your name, the hero lines, the story chapters, gallery captions,
the love letter, the timeline, reasons, the surprise text, the finale, and
the hidden secret letter. No component code needs to change.

### Photos
Drop images into `public/gallery/` (portrait 3:4 looks best) and point the
`gallery.items[].src` values at them. Missing files fall back to elegant
gradient placeholders automatically.

**After adding or changing photos, run:**

```bash
npm run optimize
```

This generates lean WebP variants (`*.thumb.webp` for the grid, `*.opt.webp`
for fullscreen) right next to each original. The app loads those first and
falls back to the original if a variant is missing — it turns ~28 MB of
originals into ~1 MB of what actually loads on the grid. Safe to re-run; it
skips images already done.

### Music
Optional: drop `.mp3` files into `public/music/` and list them in
`playlist` with a `src`. With no files, a soft generated ambient soundtrack
plays — so there's always music.

## The little secrets
- **Press & hold anywhere for 5s** → a hidden love letter.
- **Shake the phone** → flowers rain down.
- **Tap the moon** in the finale → the stars scatter + a firework.
- **Tap the heart** in the finale → a firework.
- **Pull down at the very top** → a hidden whisper.

## Accessibility & performance
- Full `prefers-reduced-motion` support across every animation.
- Lazy-loaded images, code-split vendor chunks, preloaded fonts.
- Keyboard-accessible controls, semantic landmarks, safe-area insets.
- Canvas effects pause when the tab is hidden and cap the device pixel ratio.

## Structure
```
src/
  audio/         generative ambient music engine
  components/    reusable UI, effects, overlays, background
  context/       global experience state (music, secret, easter eggs)
  data/          config.ts (edit me) + types
  hooks/         lenis, typewriter, long-press, shake
  sections/      the page chapters, top to bottom
  styles/        theme tokens + global CSS
  utils/         icons, class helper, haptics
```
