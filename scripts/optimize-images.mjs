/**
 * Image optimiser.
 *
 * Walks /public/gallery and, for every source photo (.jpg/.jpeg/.png),
 * produces two lean WebP variants alongside it:
 *
 *   <name>.thumb.webp  — small, for the gallery grid & card decks
 *   <name>.opt.webp    — larger, for the fullscreen lightbox / hero
 *
 * The app requests the WebP variants first and transparently falls back to
 * the original file if a variant is missing — so running this is optional,
 * but it turns ~29 MB of originals into a few hundred KB of what actually
 * loads on screen.
 *
 * Usage:  npm run optimize
 */
import { readdir, stat } from 'node:fs/promises';
import { join, extname, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'gallery');
const SRC_EXT = new Set(['.jpg', '.jpeg', '.png']);

/** wishes contain text — keep them larger & higher quality so they stay legible */
const isWish = (p) => p.includes('family_birthday_wish');

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function outPaths(file) {
  const dir = dirname(file);
  const name = basename(file, extname(file));
  return {
    thumb: join(dir, `${name}.thumb.webp`),
    opt: join(dir, `${name}.opt.webp`),
  };
}

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

let made = 0;
let skipped = 0;

for await (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase();
  if (!SRC_EXT.has(ext)) continue;
  if (/\.(thumb|opt)\.webp$/i.test(file)) continue; // already an output

  const { thumb, opt } = outPaths(file);
  const wish = isWish(file);

  const jobs = [];

  if (!(await exists(thumb))) {
    jobs.push(
      sharp(file)
        .rotate() // honour EXIF orientation
        .resize({ width: wish ? 900 : 760, withoutEnlargement: true })
        .webp({ quality: wish ? 74 : 66, effort: 5 })
        .toFile(thumb),
    );
  }
  if (!(await exists(opt))) {
    jobs.push(
      sharp(file)
        .rotate()
        .resize({ width: wish ? 1500 : 1600, withoutEnlargement: true })
        .webp({ quality: wish ? 84 : 80, effort: 5 })
        .toFile(opt),
    );
  }

  if (jobs.length === 0) {
    skipped++;
    continue;
  }
  await Promise.all(jobs);
  made++;
  process.stdout.write(`✓ ${file.replace(ROOT, 'gallery')}\n`);
}

console.log(`\nOptimised ${made} image(s), ${skipped} already up to date.`);
