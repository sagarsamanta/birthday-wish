import type { LS } from './index';

/**
 * Interface / chrome strings that live in components rather than content.
 * Use via the `useT()` hook: `const t = useT(); t('scroll')`.
 */
export const UI = {
  // Loading
  enter: { en: 'Open your surprise', bn: 'তোমার সারপ্রাইজ খোলো' },
  soundHint: { en: 'best experienced with sound on', bn: 'সাউন্ড চালু রাখলে সবচেয়ে ভালো লাগবে' },

  // Hero
  scroll: { en: 'scroll', bn: 'নিচে নামো' },

  // Section eyebrows
  eyebrowMemories: { en: 'Memories', bn: 'স্মৃতিরা' },
  eyebrowJourney: { en: 'Our journey', bn: 'আমাদের পথচলা' },
  eyebrowLetter: { en: 'From my heart', bn: 'আমার মন থেকে' },
  eyebrowWishes: { en: 'With love, from your family', bn: 'ভালোবাসা সহ, তোমার পরিবার থেকে' },
  eyebrowMoment: { en: 'A moment to keep forever', bn: 'চিরকাল রেখে দেওয়ার মতো মুহূর্ত' },
  playVideo: { en: 'Play the moment', bn: 'মুহূর্তটা চালাও' },

  // Gallery / Lightbox
  swipeZoom: { en: 'swipe · pinch to zoom', bn: 'সোয়াইপ · জুম করতে দুই আঙুল' },
  swipeCards: { en: 'swipe through the cards', bn: 'কার্ডগুলো সোয়াইপ করো' },
  next: { en: 'Next photo', bn: 'পরের ছবি' },
  prev: { en: 'Previous photo', bn: 'আগের ছবি' },
  close: { en: 'Close', bn: 'বন্ধ করো' },

  // Music
  nowPlaying: { en: 'Now playing', bn: 'এখন বাজছে' },
  paused: { en: 'Paused', bn: 'থেমে আছে' },

  // Countdown
  cdDays: { en: 'Days', bn: 'দিন' },
  cdHours: { en: 'Hours', bn: 'ঘণ্টা' },
  cdMinutes: { en: 'Minutes', bn: 'মিনিট' },
  cdSeconds: { en: 'Seconds', bn: 'সেকেন্ড' },
  cdReady: { en: 'Your surprise is ready…', bn: 'তোমার সারপ্রাইজ তৈরি…' },
  cdHappy: { en: 'Happy Birthday', bn: 'শুভ জন্মদিন' },

  // Cake
  cakeWish: { en: 'Make a wish — tap to blow out the candles', bn: 'একটা ইচ্ছে করো — মোমবাতি নেভাতে ট্যাপ করো' },
  cakeDone: { en: 'Wish made ✨', bn: 'ইচ্ছে পূরণ হোক ✨' },

  // Pull-to-reveal
  keepPulling: { en: 'keep pulling…', bn: 'আরেকটু টানো…' },

  // Closing  ({name} is replaced at render)
  closingLine1: { en: 'This little page will always end here.', bn: 'এই ছোট্ট পাতাটা এখানেই শেষ হবে।' },
  closingLine2: { en: 'We never will.', bn: 'কিন্তু আমরা কখনো শেষ হব না।' },
  madeWithLove: { en: 'Made with love, only for {name}.', bn: 'ভালোবেসে বানানো, শুধু {name}-এর জন্য।' },
  replay: { en: 'Relive it from the start', bn: 'শুরু থেকে আবার দেখো' },

  // Pull-to-reveal ({name})
  pullReveal: {
    en: 'Even here, at the very top — I was thinking of you, {name}.',
    bn: 'এমনকি এখানে, একদম উপরেও — আমি তোমার কথাই ভাবছিলাম, {name}.',
  },

  // toggles
  switchToBn: { en: 'বাংলায় পড়ো', bn: 'বাংলায় পড়ো' },
  switchToEn: { en: 'Read in English', bn: 'Read in English' },
  lightMode: { en: 'Light mode', bn: 'লাইট মোড' },
  darkMode: { en: 'Dark mode', bn: 'ডার্ক মোড' },
} satisfies Record<string, LS>;

export type UIKey = keyof typeof UI;
