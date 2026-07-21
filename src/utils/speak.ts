/**
 * Speaks a short birthday wish out loud.
 *
 * If `src` is given, plays that audio file (record your own voice for the
 * most personal touch). Otherwise falls back to the browser's built-in
 * speech synthesis. Must be called from within a user gesture (e.g. a tap)
 * so mobile browsers allow it. Always calls `onEnd`, even on failure.
 */
export function sayWish({
  text,
  src,
  onEnd,
}: {
  text: string;
  src?: string;
  onEnd?: () => void;
}) {
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    onEnd?.();
  };
  // safety net so any volume ducking always restores
  const safety = window.setTimeout(finish, 6000);
  const wrap = () => {
    window.clearTimeout(safety);
    finish();
  };

  // 1) Recorded voice file, if provided.
  if (src) {
    try {
      const audio = new Audio(src);
      audio.onended = wrap;
      audio.onerror = wrap;
      void audio.play().catch(wrap);
      return;
    } catch {
      wrap();
      return;
    }
  }

  // 2) Built-in speech synthesis.
  try {
    const synth = window.speechSynthesis;
    if (!synth) {
      wrap();
      return;
    }
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.06;
    utter.volume = 1;
    utter.onend = wrap;
    utter.onerror = wrap;

    const choose = () => {
      const voices = synth.getVoices();
      if (voices.length) {
        const preferred =
          voices.find((v) => /en/i.test(v.lang) && /(female|samantha|google|zira|aria)/i.test(v.name)) ||
          voices.find((v) => v.lang.toLowerCase().startsWith('en'));
        if (preferred) utter.voice = preferred;
      }
      synth.speak(utter);
    };

    if (synth.getVoices().length) {
      choose();
    } else {
      // voices load async on some browsers
      synth.addEventListener('voiceschanged', choose, { once: true });
      // and try anyway shortly after
      window.setTimeout(() => {
        if (!done) choose();
      }, 250);
    }
  } catch {
    wrap();
  }
}
