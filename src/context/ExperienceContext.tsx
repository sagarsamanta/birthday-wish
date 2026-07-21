import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AmbientEngine } from '@/audio/AmbientEngine';
import { rawConfig } from '@/data/config';
import { haptic } from '@/utils/haptics';
import type { Lang } from '@/i18n';

type Theme = 'dark' | 'light';

interface ExperienceValue {
  /** true once the loading screen has been dismissed */
  started: boolean;
  start: () => void;

  // Music
  musicReady: boolean;
  isPlaying: boolean;
  volume: number;
  trackIndex: number;
  trackTitle: string;
  toggleMusic: () => void;
  setVolume: (v: number) => void;
  nextTrack: () => void;
  playTrack: (i: number) => void;

  // Secret letter
  secretOpen: boolean;
  openSecret: () => void;
  closeSecret: () => void;

  // Easter eggs — bump a counter to re-trigger a one-shot animation
  flowerBurst: number;
  dropFlowers: () => void;

  // Balloons — released as she enters the experience
  balloonBurst: number;
  releaseBalloons: () => void;

  // Preferences
  lang: Lang;
  toggleLang: () => void;
  theme: Theme;
  toggleTheme: () => void;
}

const readLang = (): Lang => {
  try {
    const v = localStorage.getItem('lang');
    if (v === 'en' || v === 'bn') return v;
  } catch {
    /* ignore */
  }
  return 'en';
};

const readTheme = (): Theme => {
  try {
    const v = localStorage.getItem('theme');
    if (v === 'dark' || v === 'light') return v;
  } catch {
    /* ignore */
  }
  return 'dark';
};

const Ctx = createContext<ExperienceValue | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<AmbientEngine | null>(null);
  const [started, setStarted] = useState(false);
  const [musicReady, setMusicReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.6);
  const [trackIndex, setTrackIndex] = useState(0);
  const [secretOpen, setSecretOpen] = useState(false);
  const [flowerBurst, setFlowerBurst] = useState(0);
  const [balloonBurst, setBalloonBurst] = useState(0);
  const [lang, setLang] = useState<Lang>(readLang);
  const [theme, setTheme] = useState<Theme>(readTheme);

  const tracks = rawConfig.playlist;

  // Apply + persist theme.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  // Persist + reflect language on <html lang>.
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang === 'bn' ? 'bn' : 'en');
    try {
      localStorage.setItem('lang', lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((l) => (l === 'en' ? 'bn' : 'en'));
    haptic(10);
  }, []);
  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
    haptic(10);
  }, []);

  // Lazily create the engine on first need.
  const engine = () => {
    if (!engineRef.current) {
      engineRef.current = new AmbientEngine();
      engineRef.current.load(tracks[0]);
      engineRef.current.setVolume(volume);
      setMusicReady(true);
    }
    return engineRef.current;
  };

  useEffect(() => {
    return () => engineRef.current?.destroy();
  }, []);

  const toggleMusic = useCallback(() => {
    const e = engine();
    const nowPlaying = e.toggle();
    setIsPlaying(nowPlaying);
    haptic(10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    engine().setVolume(v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playTrack = useCallback(
    (i: number) => {
      const idx = (i + tracks.length) % tracks.length;
      setTrackIndex(idx);
      const e = engine();
      e.load(tracks[idx]);
      if (!e.playing) {
        void e.play();
        setIsPlaying(true);
      }
      haptic(10);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tracks.length],
  );

  const nextTrack = useCallback(() => playTrack(trackIndex + 1), [playTrack, trackIndex]);

  const releaseBalloons = useCallback(() => setBalloonBurst((n) => n + 1), []);

  const start = useCallback(() => {
    setStarted(true);
    // Begin music automatically — this call originates from the user's tap,
    // so it satisfies autoplay policies.
    const e = engine();
    void e.play();
    setIsPlaying(true);
    // Celebrate the entrance with a rise of balloons.
    setBalloonBurst((n) => n + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openSecret = useCallback(() => {
    setSecretOpen(true);
    haptic([12, 40, 12]);
  }, []);
  const closeSecret = useCallback(() => setSecretOpen(false), []);

  const dropFlowers = useCallback(() => {
    setFlowerBurst((n) => n + 1);
    haptic([8, 30, 8]);
  }, []);

  const value = useMemo<ExperienceValue>(
    () => ({
      started,
      start,
      musicReady,
      isPlaying,
      volume,
      trackIndex,
      trackTitle: tracks[trackIndex]?.title ?? '',
      toggleMusic,
      setVolume,
      nextTrack,
      playTrack,
      secretOpen,
      openSecret,
      closeSecret,
      flowerBurst,
      dropFlowers,
      balloonBurst,
      releaseBalloons,
      lang,
      toggleLang,
      theme,
      toggleTheme,
    }),
    [
      started, start, musicReady, isPlaying, volume, trackIndex, tracks,
      toggleMusic, setVolume, nextTrack, playTrack,
      secretOpen, openSecret, closeSecret, flowerBurst, dropFlowers,
      balloonBurst, releaseBalloons, lang, toggleLang, theme, toggleTheme,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useExperience() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useExperience must be used within ExperienceProvider');
  return v;
}
