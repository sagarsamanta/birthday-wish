/**
 * Shared content types for the experience.
 * Everything the site renders is described by these shapes and filled in
 * from `src/data/config.ts`. Editing content never requires touching a component.
 */

export interface StoryChapter {
  /** Small overline shown above the line, e.g. "Chapter One" */
  eyebrow: string;
  /** The emotional line, revealed on scroll */
  line: string;
  /** Optional supporting whisper beneath the line */
  sub?: string;
}

export interface GalleryItem {
  /** Path to the image. Drop real files into /public/gallery and point here. */
  src: string;
  /** Short memory title */
  title: string;
  /** Longer caption / the story behind the photo */
  caption: string;
  /** Human-friendly date string */
  date: string;
  /** Optional place */
  location?: string;
}

export interface FamilyWish {
  /** Path to the wish image/card */
  src: string;
  /** Who it's from, e.g. "Mother" */
  from: string;
  /** A short warm caption shown with the card */
  note?: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  /** lucide-react icon name (see IconMap in utils/icons) */
  icon: string;
}

export interface Track {
  title: string;
  /**
   * Optional real audio file (e.g. "/music/song.mp3" in /public/music).
   * If omitted, a gentle generated ambient pad is used instead — so music
   * always works, even before you add your own files.
   */
  src?: string;
  /** Mood used by the generated ambient engine when `src` is absent */
  mood?: 'dawn' | 'dusk' | 'starlight';
}

export interface SiteConfig {
  wifeName: string;
  yourName: string;
  initials: string;
  birthdayDate: string;

  loading: {
    whisper: string;
  };

  hero: {
    /** Lines typed out one after another before the reveal */
    typewriter: string[];
    greeting: string;
    subgreeting: string;
    /** Optional full-bleed background photo for the hero */
    backgroundImage?: string;
  };

  story: StoryChapter[];

  familyWishes: {
    title: string;
    intro: string;
    items: FamilyWish[];
  };

  gallery: {
    title: string;
    intro: string;
    items: GalleryItem[];
  };

  loveLetter: {
    title: string;
    salutation: string;
    /** Paragraphs of the letter */
    body: string[];
    signature: string;
  };

  timeline: {
    title: string;
    intro: string;
    events: TimelineEvent[];
  };

  surprise: {
    prompt: string;
    reveal: string;
    sub: string;
  };

  finale: {
    heartText: string;
    line: string;
  };

  secret: {
    hint: string;
    title: string;
    body: string[];
    signature: string;
  };

  playlist: Track[];
}
