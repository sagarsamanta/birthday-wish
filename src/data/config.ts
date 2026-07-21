import type { SiteConfig } from './types';

/**
 * ─────────────────────────────────────────────────────────────
 *  THE ONLY FILE YOU NEED TO EDIT
 * ─────────────────────────────────────────────────────────────
 *  Replace the placeholder text, dates and image paths below with
 *  your own. Drop photos into  /public/gallery  and reference them
 *  as  "/gallery/your-file.jpg". Drop songs into  /public/music.
 *
 *  Every value here is optional to change — the site works as-is.
 */
export const config: SiteConfig = {
  wifeName: 'Sathi',
  yourName: 'Sagar',
  initials: 'S & S',
  birthdayDate: '2026-07-21',

  loading: {
    whisper: 'Something special is waiting…',
  },

  hero: {
    typewriter: [
      'Of all the days in all the years…',
      'today is the one the whole world got right.',
    ],
    greeting: 'Happy Birthday',
    subgreeting: 'To the most beautiful part of my every day.',
    backgroundImage: '/gallery/sathi_solo_photo/background.jpg',
  },

  story: [
    {
      eyebrow: 'Chapter One',
      line: 'You entered my life…',
      sub: 'and quietly rearranged everything into something better.',
    },
    {
      eyebrow: 'Chapter Two',
      line: 'Every smile became brighter.',
      sub: 'Ordinary moments started to glow just because you were in them.',
    },
    {
      eyebrow: 'Chapter Three',
      line: 'Every memory became precious.',
      sub: 'Even the small ones. Especially the small ones.',
    },
    {
      eyebrow: 'Chapter Four',
      line: 'Today is your special day.',
      sub: 'And the whole world feels a little softer for it.',
    },
    {
      eyebrow: 'Chapter Five',
      line: 'So I just want to say…',
      sub: 'from the very bottom of my heart —',
    },
  ],

  familyWishes: {
    title: 'They Wanted to Wish You Too',
    intro: 'Because you’re loved by more hearts than just mine.',
    items: [
      { src: '/gallery/family_birthday_wish/mother_wish.png', from: 'From Maa', note: 'A mother’s love, wrapped in a wish.' },
      { src: '/gallery/family_birthday_wish/father_wish.png', from: 'From Baba', note: 'From the one who’s always proud of you.' },
      { src: '/gallery/family_birthday_wish/brother_wish.png', from: 'From Your Brother', note: 'Some bonds are simply forever.' },
    ],
  },

  gallery: {
    title: 'Our Little Universe',
    intro: 'A handful of the moments I keep re-living.',
    items: [
      {
        src: '/gallery/sathi_solo_photo/IMG-20260609-WA0003.jpg',
        title: 'Simply You',
        caption: 'No filter needed — you light up every frame you’re in.',
        date: '9 June 2026',
      },
      {
        src: '/gallery/sagar_sathi_together/IMG-20260715-WA0042.jpg',
        title: 'You & Me',
        caption: 'My favourite place in the world is right beside you.',
        date: '15 July 2026',
        location: 'Our special day',
      },
      {
        src: '/gallery/sathi_solo_photo/IMG-20260609-WA0012.jpg',
        title: 'That Smile',
        caption: 'The one that made me forget whatever I was going to say.',
        date: '9 June 2026',
      },
      {
        src: '/gallery/sagar_sathi_together/file_00000000109c7207aa8d05dc90247811.png',
        title: 'Us, Always',
        caption: 'Somehow every photo of us feels like home.',
        date: 'A moment I love',
      },
      {
        src: '/gallery/sathi_solo_photo/IMG-20260622-WA0008.jpg',
        title: 'Effortless',
        caption: 'You don’t even try, and still you take my breath away.',
        date: '22 June 2026',
      },
      {
        src: '/gallery/family/IMG_20260715_133625202.jpg',
        title: 'Family',
        caption: 'The day two families became a little bigger, a little happier.',
        date: '15 July 2026',
        location: 'Our special day',
      },
      {
        src: '/gallery/sathi_solo_photo/IMG-20260628-WA0011.jpg',
        title: 'Just Beautiful',
        caption: 'I could look at you for the rest of my life. I intend to.',
        date: '28 June 2026',
      },
      {
        src: '/gallery/sagar_sathi_together/file_00000000d5e0720798d9419e07cfe6be.png',
        title: 'Together',
        caption: 'Every good story I have, you’re somewhere in it.',
        date: 'A moment I love',
      },
      {
        src: '/gallery/sathi_solo_photo/IMG-20260609-WA0015.jpg',
        title: 'Radiant',
        caption: 'There’s a glow about you that no camera fully captures.',
        date: '9 June 2026',
      },
      {
        src: '/gallery/sagar_sathi_together/IMG-20260715-WA0045.jpg',
        title: 'Our Day',
        caption: 'The day I got to call you mine, officially and forever.',
        date: '15 July 2026',
        location: 'Our special day',
      },
      {
        src: '/gallery/sagar_sathi_together/IMG-20260715-WA0026.jpg',
        title: 'Side by Side',
        caption: 'Wherever the road goes next, I want to walk it with you.',
        date: '15 July 2026',
        location: 'Our special day',
      },
      {
        src: '/gallery/sathi_solo_photo/IMG-20260715-WA0057.jpg',
        title: 'Glowing',
        caption: 'You wore happiness like it was made for you.',
        date: '15 July 2026',
        location: 'Our special day',
      },
      {
        src: '/gallery/sagar_sathi_together/file_00000000d83871fa99198e7ad16b3153.png',
        title: 'My Person',
        caption: 'Of all the hands to hold, I’m so glad it’s yours.',
        date: 'A moment I love',
      },
      {
        src: '/gallery/family/IMG_20260715_133822422.jpg',
        title: 'Loved',
        caption: 'Surrounded by the people who adore you — as you should always be.',
        date: '15 July 2026',
        location: 'Our special day',
      },
      {
        src: '/gallery/family/IMG-20260609-WA0013.jpg',
        title: 'Where You Come From',
        caption: 'The love you give so freely — you learned it here first.',
        date: '9 June 2026',
      },
      {
        src: '/gallery/family/IMG-20260715-WA0000.jpg',
        title: 'All Together',
        caption: 'The best days are the ones with everyone under one roof.',
        date: '15 July 2026',
        location: 'Our special day',
      },
      {
        src: '/gallery/family/file_000000006f407206808914686e5bbd86.png',
        title: 'Home',
        caption: 'Family isn’t just where we start — it’s where we belong.',
        date: 'A moment I love',
      },
      {
        src: '/gallery/sathi_solo_photo/file_0000000017b0722f86861cf417c09426.png',
        title: 'One In A Million',
        caption: 'There is no one, anywhere, quite like you.',
        date: 'A moment I love',
      },
      {
        src: '/gallery/sagar_sathi_together/file_00000000e2b072068497deb0614dcf0e.png',
        title: 'Forever Us',
        caption: 'Here’s to a thousand more photos just like this one.',
        date: 'A moment I love',
      },
    ],
  },

  loveLetter: {
    title: 'A Letter For You',
    salutation: 'My dearest,',
    body: [
      'If I tried to write down every reason I love you, I would run out of paper long before I ran out of reasons.',
      'You have this way of turning ordinary days into ones I never want to forget. A glance, a laugh, the sound of your footsteps coming home — these are the things my heart collects.',
      'Thank you for your patience, your kindness, and the thousand tiny ways you make my world softer. Growing beside you is the greatest privilege of my life.',
      'Today the world celebrates the day you were born. But I get to celebrate you every single day, and I will never stop feeling lucky about it.',
    ],
    signature: 'Forever yours',
  },

  timeline: {
    title: 'How We Got Here',
    intro: 'Every date on this line is a date I’d live again.',
    events: [
      { date: '8 May 2026', title: 'The Day We Met', description: 'A perfectly ordinary day that turned out to be the most important one.', icon: 'sparkles' },
      { date: 'Our first adventure', title: 'Natun Pukur', description: 'Our first trip together — I fell a little more in love with every mile.', icon: 'plane' },
      { date: '15 July 2026', title: 'We Made It Official', description: 'Our registry marriage — the day we quietly signed our forever.', icon: 'heart' },
      { date: 'Today', title: 'Your Birthday', description: 'The celebration of the person who made all of it matter.', icon: 'cake' },
    ],
  },

  surprise: {
    prompt: 'Tap to open your gift',
    reveal: 'Happy Birthday, My Love ❤',
    sub: 'You are, and always will be, my favorite gift.',
  },

  finale: {
    heartText: 'I Love You',
    line: 'Happy Birthday',
  },

  secret: {
    hint: 'Press and hold anywhere…',
    title: 'You found it.',
    body: [
      'I hid this here just for you — the curious one, the one who always looks a little deeper.',
      'That’s exactly why I love you. You never stop exploring, and you found the secret only your heart would look for.',
      'No matter where you are when you read this: I am completely, hopelessly yours.',
    ],
    signature: 'Always, and then some.',
  },

  playlist: [
    // Add your own song anytime:  { title: 'Our Song', src: '/music/our-song.mp3' }
    { title: 'Forever', mood: 'dawn' },
    { title: 'Starlight', mood: 'starlight' },
    { title: 'A Quiet Promise', mood: 'dusk' },
  ],
};

export default config;
