import { motion } from 'motion/react';
import { Sun, Moon, Languages } from 'lucide-react';
import { useExperience } from '@/context/ExperienceContext';

/**
 * Floating language (English ⇄ বাংলা) and theme (dark ⇄ light) toggles.
 * Fixed top-left, glassy, one-handed reachable. Preferences persist.
 */
export function TopControls() {
  const { lang, toggleLang, theme, toggleTheme } = useExperience();

  return (
    <div className="fixed left-4 top-[max(1rem,env(safe-area-inset-top))] z-[60] flex items-center gap-2">
      <motion.button
        type="button"
        onClick={toggleLang}
        whileTap={{ scale: 0.92 }}
        aria-label={lang === 'en' ? 'Switch to Bengali' : 'Switch to English'}
        className="glass-dark flex h-10 items-center gap-1.5 rounded-full px-3.5 text-warmwhite"
      >
        <Languages className="h-4 w-4 opacity-80" />
        <span className="text-xs font-medium tracking-wide">
          {lang === 'en' ? 'বাংলা' : 'EN'}
        </span>
      </motion.button>

      <motion.button
        type="button"
        onClick={toggleTheme}
        whileTap={{ scale: 0.92 }}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        className="glass-dark flex h-10 w-10 items-center justify-center rounded-full text-warmwhite"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </motion.button>
    </div>
  );
}
