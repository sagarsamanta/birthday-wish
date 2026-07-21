/**
 * Speaks a short birthday wish out loud, optionally repeated a few times.
 *
 * If `src` is given, plays that audio file (record your own voice for the
 * most personal touch). Otherwise falls back to the browser's built-in
 * speech synthesis. Must be called from within a user gesture (e.g. a tap)
 * so mobile browsers allow it. Always calls `onEnd`, even on failure.
 */
export function sayWish({
  text,
  src,
  times = 1,
  onEnd,
}: {
  text: string;
  src?: string;
  times?: number;
  onEnd?: () => void;
}) {
  const n = Math.max(1, times);
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    onEnd?.();
  };
  // safety net so any volume ducking always restores
  const safety = window.setTimeout(finish, 6000 * n + 4000);
  const wrap = () => {
    window.clearTimeout(safety);
    finish();
  };

  // 1) Recorded voice file, if provided — play it `n` times in a row.
  if (src) {
    try {
      const audio = new Audio(src);
      let count = 0;
      audio.onended = () => {
        count += 1;
        if (count < n) {
          audio.currentTime = 0;
          void audio.play().catch(wrap);
        } else {
          wrap();
        }
      };
      audio.onerror = wrap;
      void audio.play().catch(wrap);
      return;
    } catch {
      wrap();
      return;
    }
  }

  // 2) Built-in speech synthesis — queue `n` utterances.
  try {
    const synth = window.speechSynthesis;
    if (!synth) {
      wrap();
      return;
    }
    synth.cancel();

    let spoke = false;
    const speakAll = () => {
      if (spoke) return;
      spoke = true;
      const voices = synth.getVoices();
      const preferred =
        voices.find((v) => /en/i.test(v.lang) && /(female|samantha|google|zira|aria)/i.test(v.name)) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('en'));

      for (let i = 0; i < n; i++) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 0.9;
        utter.pitch = 1.06;
        utter.volume = 1;
        if (preferred) utter.voice = preferred;
        if (i === n - 1) {
          utter.onend = wrap;
          utter.onerror = wrap;
        }
        synth.speak(utter);
      }
    };

    if (synth.getVoices().length) {
      speakAll();
    } else {
      synth.addEventListener('voiceschanged', speakAll, { once: true });
      window.setTimeout(speakAll, 300);
    }
  } catch {
    wrap();
  }
}
