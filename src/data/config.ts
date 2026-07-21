import type { SiteConfig } from './types';
import { localize, type LS } from '@/i18n';

/**
 * ─────────────────────────────────────────────────────────────
 *  THE ONLY FILE YOU NEED TO EDIT
 * ─────────────────────────────────────────────────────────────
 *  Every visible line is written in both languages as `{ en, bn }`.
 *  Edit either side freely. Language-neutral values (image paths, the
 *  unlock date, icon names, song moods) are plain strings.
 *
 *  Photos → /public/gallery (then run `npm run optimize`).
 *  Songs  → /public/music, then add `src` to a playlist entry.
 */

// tiny helper for readability
const L = (en: string, bn: string): LS => ({ en, bn });

// reusable date pairs
const D = {
  may8: L('8 May 2026', '৮ মে ২০২৬'),
  jun9: L('9 June 2026', '৯ জুন ২০২৬'),
  jun22: L('22 June 2026', '২২ জুন ২০২৬'),
  jun28: L('28 June 2026', '২৮ জুন ২০২৬'),
  jul15: L('15 July 2026', '১৫ জুলাই ২০২৬'),
  moment: L('A moment I love', 'প্রিয় একটা মুহূর্ত'),
};
const SPECIAL = L('Our special day', 'আমাদের বিশেষ দিন');

export const rawConfig = {
  wifeName: 'Sathi',
  yourName: 'Sagar',
  initials: 'S & S',
  birthdayDate: '2026-07-22',

  // The surprise unlocks at this moment (viewer's local time).
  // Opened earlier → a live countdown. Add ?preview to the URL to bypass.
  unlockDate: '2026-07-22T00:00:00',

  countdown: {
    eyebrow: L('A little patience, my love', 'একটু ধৈর্য ধরো, সোনা'),
    title: L('Almost Time', 'প্রায় সময় হয়ে এল'),
    note: L(
      'Something I made just for you unlocks on your birthday.',
      'শুধু তোমার জন্য বানানো কিছু একটা তোমার জন্মদিনে খুলবে।',
    ),
  },

  loading: {
    whisper: L('Something special is waiting…', 'বিশেষ কিছু একটা অপেক্ষা করছে…'),
  },

  hero: {
    typewriter: [
      L('Of all the days in all the years…', 'এত বছরের এত দিনের মধ্যে…'),
      L('today is the one the whole world got right.', 'আজকের দিনটাই গোটা পৃথিবী নিখুঁত করে দিয়েছে।'),
    ],
    greeting: L('Happy Birthday', 'শুভ জন্মদিন'),
    subgreeting: L(
      'To the most beautiful part of my every day.',
      'আমার প্রতিটা দিনের সবচেয়ে সুন্দর অংশটাকে।',
    ),
    backgroundImage: '/gallery/sathi_solo_photo/background.jpg',
  },

  story: [
    {
      eyebrow: L('Chapter One', 'প্রথম অধ্যায়'),
      line: L('You entered my life…', 'তুমি আমার জীবনে এলে…'),
      sub: L(
        'and quietly rearranged everything into something better.',
        'আর চুপিচুপি সব কিছু আরও সুন্দর করে সাজিয়ে দিলে।',
      ),
    },
    {
      eyebrow: L('Chapter Two', 'দ্বিতীয় অধ্যায়'),
      line: L('Every smile became brighter.', 'প্রতিটা হাসি আরও উজ্জ্বল হয়ে উঠল।'),
      sub: L(
        'Ordinary moments started to glow just because you were in them.',
        'সাধারণ মুহূর্তগুলোও জ্বলজ্বল করতে লাগল, শুধু তুমি ছিলে বলে।',
      ),
    },
    {
      eyebrow: L('Chapter Three', 'তৃতীয় অধ্যায়'),
      line: L('Every memory became precious.', 'প্রতিটা স্মৃতি মূল্যবান হয়ে গেল।'),
      sub: L(
        'Even the small ones. Especially the small ones.',
        'ছোট ছোট মুহূর্তগুলোও। বিশেষ করে সেই ছোট মুহূর্তগুলোই।',
      ),
    },
    {
      eyebrow: L('Chapter Four', 'চতুর্থ অধ্যায়'),
      line: L('Today is your special day.', 'আজ তোমার বিশেষ দিন।'),
      sub: L(
        'And the whole world feels a little softer for it.',
        'আর তাতে গোটা পৃথিবীটাই যেন একটু কোমল হয়ে গেছে।',
      ),
    },
    {
      eyebrow: L('Chapter Five', 'পঞ্চম অধ্যায়'),
      line: L('So I just want to say…', 'তাই শুধু একটা কথাই বলতে চাই…'),
      sub: L('from the very bottom of my heart —', 'আমার মনের একেবারে গভীর থেকে —'),
    },
  ],

  videoMoment: {
    title: L('The Day We Made It Official', 'যেদিন আমরা এক হলাম'),
    intro: L(
      'Our registry — the quiet moment we signed our forever.',
      'আমাদের রেজিস্ট্রি — যে শান্ত মুহূর্তে আমরা চিরকালের জন্য সই করলাম।',
    ),
    caption: L('15 July 2026', '১৫ জুলাই ২০২৬'),
    src: '/music/VID-20260721-WA0017.mp4',
    poster: '/gallery/sagar_sathi_together/IMG-20260715-WA0042.opt.webp',
  },

  familyWishes: {
    title: L('They Wanted to Wish You Too', 'তারাও তোমাকে শুভেচ্ছা জানাতে চেয়েছে'),
    intro: L(
      'Because you’re loved by more hearts than just mine.',
      'কারণ শুধু আমি নই, আরও অনেক মন তোমাকে ভালোবাসে।',
    ),
    items: [
      {
        src: '/gallery/family_birthday_wish/mother_wish.png',
        from: L('From Maa', 'মায়ের তরফ থেকে'),
        note: L('A mother’s love, wrapped in a wish.', 'একটা শুভেচ্ছায় মোড়া মায়ের ভালোবাসা।'),
      },
      {
        src: '/gallery/family_birthday_wish/father_wish.png',
        from: L('From Baba', 'বাবার তরফ থেকে'),
        note: L('From the one who’s always proud of you.', 'যিনি সবসময় তোমাকে নিয়ে গর্বিত, তাঁর কাছ থেকে।'),
      },
      {
        src: '/gallery/family_birthday_wish/brother_wish.png',
        from: L('From Your Brother', 'তোমার ভাইয়ের তরফ থেকে'),
        note: L('Some bonds are simply forever.', 'কিছু বন্ধন সত্যিই চিরকালের।'),
      },
    ],
  },

  gallery: {
    title: L('Our Little Universe', 'আমাদের ছোট্ট পৃথিবী'),
    intro: L('A handful of the moments I keep re-living.', 'কিছু মুহূর্ত, যেগুলো আমি বারবার বেঁচে নিই।'),
    items: [
      { src: '/gallery/sathi_solo_photo/IMG-20260609-WA0003.jpg', title: L('Simply You', 'শুধুই তুমি'), caption: L('No filter needed — you light up every frame you’re in.', 'কোনো ফিল্টার লাগে না — তুমি যে ফ্রেমেই থাকো, আলো করে দাও।'), date: D.jun9 },
      { src: '/gallery/sagar_sathi_together/IMG-20260715-WA0042.jpg', title: L('You & Me', 'তুমি আর আমি'), caption: L('My favourite place in the world is right beside you.', 'পৃথিবীতে আমার সবচেয়ে প্রিয় জায়গাটা তোমার পাশেই।'), date: D.jul15, location: SPECIAL },
      { src: '/gallery/sathi_solo_photo/IMG-20260609-WA0012.jpg', title: L('That Smile', 'সেই হাসিটা'), caption: L('The one that made me forget whatever I was going to say.', 'যে হাসি দেখে আমি ভুলে যাই কী বলতে চেয়েছিলাম।'), date: D.jun9 },
      { src: '/gallery/sagar_sathi_together/file_00000000109c7207aa8d05dc90247811.png', title: L('Us, Always', 'আমরা, সবসময়'), caption: L('Somehow every photo of us feels like home.', 'আমাদের প্রতিটা ছবিই কেমন যেন ঘরের মতো লাগে।'), date: D.moment },
      { src: '/gallery/sathi_solo_photo/IMG-20260622-WA0008.jpg', title: L('Effortless', 'অনায়াসে সুন্দর'), caption: L('You don’t even try, and still you take my breath away.', 'তুমি চেষ্টাও করো না, তবু আমার নিঃশ্বাস কেড়ে নাও।'), date: D.jun22 },
      { src: '/gallery/family/IMG_20260715_133625202.jpg', title: L('Family', 'পরিবার'), caption: L('The day two families became a little bigger, a little happier.', 'যেদিন দুটো পরিবার আরও একটু বড়, আরও একটু খুশি হয়ে উঠল।'), date: D.jul15, location: SPECIAL },
      { src: '/gallery/sathi_solo_photo/IMG-20260628-WA0011.jpg', title: L('Just Beautiful', 'শুধুই সুন্দর'), caption: L('I could look at you for the rest of my life. I intend to.', 'সারাজীবন তোমার দিকে তাকিয়ে থাকতে পারি। আমি সেটাই চাই।'), date: D.jun28 },
      { src: '/gallery/sagar_sathi_together/file_00000000d5e0720798d9419e07cfe6be.png', title: L('Together', 'একসাথে'), caption: L('Every good story I have, you’re somewhere in it.', 'আমার প্রতিটা সুন্দর গল্পে কোথাও না কোথাও তুমি আছো।'), date: D.moment },
      { src: '/gallery/sathi_solo_photo/IMG-20260609-WA0015.jpg', title: L('Radiant', 'দীপ্তিময়'), caption: L('There’s a glow about you that no camera fully captures.', 'তোমার মধ্যে এমন একটা আলো আছে, কোনো ক্যামেরাই পুরোটা ধরতে পারে না।'), date: D.jun9 },
      { src: '/gallery/sagar_sathi_together/IMG-20260715-WA0045.jpg', title: L('Our Day', 'আমাদের দিন'), caption: L('The day I got to call you mine, officially and forever.', 'যেদিন তোমাকে আনুষ্ঠানিকভাবে, চিরকালের জন্য নিজের বলতে পারলাম।'), date: D.jul15, location: SPECIAL },
      { src: '/gallery/sathi_solo_photo/IMG-20260715-WA0057.jpg', title: L('Glowing', 'উজ্জ্বল'), caption: L('You wore happiness like it was made for you.', 'তুমি খুশিটাকে এমনভাবে পরেছিলে, যেন ওটা তোমার জন্যই তৈরি।'), date: D.jul15, location: SPECIAL },
      { src: '/gallery/sagar_sathi_together/file_00000000d83871fa99198e7ad16b3153.png', title: L('My Person', 'আমার মানুষ'), caption: L('Of all the hands to hold, I’m so glad it’s yours.', 'এত হাতের মধ্যে, তোমার হাতটাই ধরতে পেরে আমি ধন্য।'), date: D.moment },
      { src: '/gallery/family/IMG_20260715_133822422.jpg', title: L('Loved', 'ভালোবাসায় ঘেরা'), caption: L('Surrounded by the people who adore you — as you should always be.', 'যারা তোমাকে ভালোবাসে তাদের মাঝে — তুমি সবসময় এমনই থেকো।'), date: D.jul15, location: SPECIAL },
      { src: '/gallery/sathi_solo_photo/file_0000000017b0722f86861cf417c09426.png', title: L('One In A Million', 'লাখে একজন'), caption: L('There is no one, anywhere, quite like you.', 'কোথাও, কেউ ঠিক তোমার মতো নেই।'), date: D.moment },
      { src: '/gallery/sagar_sathi_together/file_00000000e2b072068497deb0614dcf0e.png', title: L('Forever Us', 'চিরকাল আমরা'), caption: L('Here’s to a thousand more photos just like this one.', 'ঠিক এমন আরও হাজারটা ছবির জন্য শুভকামনা।'), date: D.moment },
      { src: '/gallery/sagar_sathi_together/IMG-20260715-WA0026.jpg', title: L('Side by Side', 'পাশাপাশি'), caption: L('Wherever the road goes next, I want to walk it with you.', 'রাস্তা এরপর যেদিকেই যাক, আমি তোমার সাথেই হাঁটতে চাই।'), date: D.jul15, location: SPECIAL },
      { src: '/gallery/family/IMG-20260609-WA0013.jpg', title: L('Where You Come From', 'তোমার শিকড়'), caption: L('The love you give so freely — you learned it here first.', 'যে ভালোবাসা তুমি এত অকৃপণভাবে দাও — সেটা প্রথম এখান থেকেই শিখেছ।'), date: D.jun9 },
      { src: '/gallery/family/IMG-20260715-WA0000.jpg', title: L('All Together', 'সবাই একসাথে'), caption: L('The best days are the ones with everyone under one roof.', 'সেরা দিনগুলো সেই, যখন সবাই এক ছাদের নিচে থাকে।'), date: D.jul15, location: SPECIAL },
      { src: '/gallery/family/file_000000006f407206808914686e5bbd86.png', title: L('Home', 'ঘর'), caption: L('Family isn’t just where we start — it’s where we belong.', 'পরিবার শুধু শুরুর জায়গা নয় — ওটাই আমাদের আপন জায়গা।'), date: D.moment },
    ],
  },

  loveLetter: {
    title: L('A Letter For You', 'তোমার জন্য একটা চিঠি'),
    salutation: L('My Dearest Sathi,', 'আমার প্রিয়তম সাথী,'),
    body: [
      L(
        'Happy Birthday to the most beautiful person in my life.',
        'শুভ জন্মদিন, আমার জীবনের সবচেয়ে সুন্দর মানুষ। 💖',
      ),
      L(
        'Today is not just the day you were born—it’s the day that brought happiness, love, and meaning into my world. Meeting you has been one of the greatest blessings of my life, and every day I thank God for bringing you to me.',
        'আজকের দিনটা শুধু তোমার জন্মদিন নয়, আমার জীবনে সুখ, শান্তি আর ভালোবাসা আসার দিনও। তোমাকে পেয়ে আমি সত্যিই নিজেকে অনেক ভাগ্যবান মনে করি।',
      ),
      L(
        'I may not always be able to express everything I feel, but I hope you always know this: you are the most precious person in my life. Your smile is my favorite sight, your happiness is my biggest wish, and your love is my greatest strength.',
        'হয়তো আমি সবসময় আমার অনুভূতিগুলো ঠিকভাবে প্রকাশ করতে পারি না, কিন্তু বিশ্বাস করো—তুমি আমার কাছে পৃথিবীর সবচেয়ে মূল্যবান মানুষ। তোমার হাসি আমার শক্তি, তোমার সুখ আমার সবচেয়ে বড় ইচ্ছা।',
      ),
      L(
        'As we begin this beautiful journey toward our future together, I want to make you one promise: I will always stand by your side. Through every smile, every challenge, every success, and every difficult moment, I will hold your hand and never let go.',
        'আমি প্রতিশ্রুতি দিচ্ছি, জীবনের প্রতিটি মুহূর্তে তোমার পাশে থাকব। সুখে, দুঃখে, সাফল্যে, ব্যর্থতায়—সবসময় তোমার হাতটা শক্ত করে ধরে রাখব। তুমি কখনো একা নও, কারণ আমি আছি, আজ, আগামীকাল, আর সারাজীবন।',
      ),
      L(
        'I pray that this new year of your life brings you endless happiness, good health, success, and all the dreams you’ve ever wished for. May your beautiful smile never fade, because it lights up my entire world.',
        'তোমার জীবনের প্রতিটি স্বপ্ন পূরণ হোক, প্রতিটি দিন আনন্দে ভরে উঠুক, আর তোমার মুখের এই সুন্দর হাসিটা যেন কখনো হারিয়ে না যায়।',
      ),
      L(
        'Happy 23rd Birthday, My Love. ❤️ You are not just my future wife—you are my best friend, my safe place, my biggest blessing, and the love I want to choose every single day for the rest of my life.',
        'Happy 23rd Birthday, My Love. ❤️ তুমি শুধু আমার হবু স্ত্রী নও, তুমি আমার ভবিষ্যৎ, আমার শান্তি, আমার সবচেয়ে প্রিয় মানুষ।',
      ),
      L(
        'Thank you for loving me, believing in me, and making my life so beautiful. I can’t wait for the day when we’ll celebrate your birthday as husband and wife, creating countless beautiful memories together. Until then, know that my heart belongs to you, today and always. I love you more than words can ever express.',
        'I love you more than words can ever express.',
      ),
    ],
    signature: L('Forever Yours', 'চিরকাল তোমার'),
  },

  timeline: {
    title: L('How We Got Here', 'আমরা এতদূর যেভাবে এলাম'),
    intro: L('Every date on this line is a date I’d live again.', 'এই রেখার প্রতিটা দিন আমি আবার বাঁচতে চাই।'),
    events: [
      { date: D.may8, title: L('The Day We Met', 'যেদিন আমাদের দেখা হলো'), description: L('A perfectly ordinary day that turned out to be the most important one.', 'একদম সাধারণ একটা দিন, যেটা হয়ে উঠল সবচেয়ে গুরুত্বপূর্ণ।'), icon: 'sparkles' },
      { date: L('Our first adventure', 'আমাদের প্রথম অভিযান'), title: L('Natun Pukur', 'নতুন পুকুর'), description: L('Our first trip together — I fell a little more in love with every mile.', 'আমাদের প্রথম একসাথে ঘুরতে যাওয়া — প্রতিটা পথে একটু একটু করে আরও প্রেমে পড়েছি।'), icon: 'plane' },
      { date: D.jul15, title: L('We Made It Official', 'আমরা আনুষ্ঠানিক হলাম'), description: L('Our registry marriage — the day we quietly signed our forever.', 'আমাদের রেজিস্ট্রি বিয়ে — যেদিন চুপিসারে আমাদের চিরকালের সই করলাম।'), icon: 'heart' },
      { date: L('Today', 'আজ'), title: L('Your Birthday', 'তোমার জন্মদিন'), description: L('The celebration of the person who made all of it matter.', 'সেই মানুষটার উদযাপন, যার জন্য সব কিছুর মানে।'), icon: 'cake' },
    ],
  },

  surprise: {
    prompt: L('Tap to open your gift', 'উপহারটা খুলতে ট্যাপ করো'),
    reveal: L('Happy Birthday, My Love ❤', 'শুভ জন্মদিন, আমার ভালোবাসা ❤'),
    sub: L('You are, and always will be, my favorite gift.', 'তুমিই আমার সবচেয়ে প্রিয় উপহার, আর চিরকাল থাকবে।'),
  },

  finale: {
    heartText: L('I Love You', 'ভালোবাসি তোমায়'),
    line: L('Happy Birthday', 'শুভ জন্মদিন'),
  },

  secret: {
    hint: L('Press and hold anywhere…', 'যেকোনো জায়গায় চেপে ধরে রাখো…'),
    title: L('You found it.', 'তুমি খুঁজে পেয়েছ।'),
    body: [
      L(
        'I hid this here just for you — the curious one, the one who always looks a little deeper.',
        'এটা শুধু তোমার জন্য লুকিয়ে রেখেছিলাম — কৌতূহলী তুমি, যে সবসময় একটু গভীরে দেখো।',
      ),
      L(
        'That’s exactly why I love you. You never stop exploring, and you found the secret only your heart would look for.',
        'এই জন্যই তো তোমাকে ভালোবাসি। তুমি কখনো খোঁজা থামাও না, আর শুধু তোমার মনই যা খুঁজত, সেই গোপন কথাটা খুঁজে পেলে।',
      ),
      L(
        'No matter where you are when you read this: I am completely, hopelessly yours.',
        'এটা পড়ার সময় তুমি যেখানেই থাকো: আমি সম্পূর্ণভাবে, বেপরোয়াভাবে তোমার।',
      ),
    ],
    signature: L('Always, and then some.', 'সবসময়, তারও বেশি।'),
  },

  playlist: [
    // Add your own song anytime:  { title: 'Our Song', src: '/music/our-song.mp3' }
    { title: 'Forever', mood: 'dawn' as const },
    { title: 'Starlight', mood: 'starlight' as const },
    { title: 'A Quiet Promise', mood: 'dusk' as const },
  ],
};

/** English-resolved config (handy for non-reactive/default use). */
export const config = localize(rawConfig, 'en') as unknown as SiteConfig;

export default config;
