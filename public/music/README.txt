Optional — drop your own songs here (e.g. our-song.mp3).

Then reference them in src/data/config.ts:
  playlist: [
    { title: 'Our Song', src: '/music/our-song.mp3' },
    ...
  ]

If you don't add any files, the site plays a gentle, generated
ambient soundtrack (Web Audio) — so music always works out of the box.
