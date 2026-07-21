import type { Track } from '@/data/types';

/**
 * A generative, emotional score built on the Web Audio API.
 *
 * Rather than a flat drone, this plays a slow piano-led ballad: a warm chord
 * progression, a soft string pad underneath, a gentle bass, and an expressive
 * melody on top — all washed in a generated convolution reverb. The melody is
 * (re)improvised every bar, so it evolves and never loops mechanically.
 *
 * No audio files required. If a Track provides a real `src`, that plays through
 * an <audio> element instead. Public API is unchanged: play / pause / toggle /
 * setVolume / load, plus `playing` and `volume`.
 */

type Mood = NonNullable<Track['mood']>;
type ChordType = 'maj' | 'min';
interface Chord {
  root: number; // semitones from C4
  type: ChordType;
}

const C4 = 261.6256;
const semi = (n: number) => C4 * Math.pow(2, n / 12);

// Three distinct emotional progressions. bpm kept slow & tender.
const MOODS: Record<Mood, { bpm: number; chords: Chord[] }> = {
  // "Forever" — C · G · Am · F  (the classic heart-tug)
  dawn: {
    bpm: 52,
    chords: [
      { root: 0, type: 'maj' },
      { root: 7, type: 'maj' },
      { root: 9, type: 'min' },
      { root: 5, type: 'maj' },
    ],
  },
  // "Starlight" — Am · F · C · G  (dreamy, wistful)
  starlight: {
    bpm: 48,
    chords: [
      { root: 9, type: 'min' },
      { root: 5, type: 'maj' },
      { root: 0, type: 'maj' },
      { root: 7, type: 'maj' },
    ],
  },
  // "A Quiet Promise" — Em · C · G · D  (cinematic, hopeful)
  dusk: {
    bpm: 46,
    chords: [
      { root: 4, type: 'min' },
      { root: 0, type: 'maj' },
      { root: 7, type: 'maj' },
      { root: 2, type: 'maj' },
    ],
  },
};

// Sparser, more spacious phrases — tender rather than busy.
const MELODY_PATTERNS = [
  [0, 2],
  [1, 3],
  [0.5, 2.5],
  [2],
  [0, 1.5],
];

export class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private dry: GainNode | null = null;
  private wet: GainNode | null = null;
  private tone: BiquadFilterNode | null = null; // soft master low-pass
  private timer: number | null = null;
  private barIndex = 0;
  private lastMelody = -99;
  private oscs: OscillatorNode[] = [];

  private audioEl: HTMLAudioElement | null = null;
  private mode: 'generated' | 'file' = 'generated';
  private currentMood: Mood = 'dawn';
  private _volume = 0.6;
  private _playing = false;

  get playing() {
    return this._playing;
  }
  get volume() {
    return this._volume;
  }

  private ensureContext() {
    if (this.ctx) return;
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctor();

    this.master = this.ctx.createGain();
    this.master.gain.value = 0;

    // gentle master low-pass to keep everything soft & round
    this.tone = this.ctx.createBiquadFilter();
    this.tone.type = 'lowpass';
    this.tone.frequency.value = 5200;
    this.tone.Q.value = 0.4;
    this.tone.connect(this.master);
    this.master.connect(this.ctx.destination);

    // reverb (generated impulse) + dry/wet mix, both into the tone filter.
    // Longer, lusher tail + more wet for an intimate, romantic room.
    const convolver = this.ctx.createConvolver();
    convolver.buffer = this.makeImpulse(4.4, 2.2);
    this.wet = this.ctx.createGain();
    this.wet.gain.value = 0.5;
    convolver.connect(this.wet);
    this.wet.connect(this.tone);

    this.dry = this.ctx.createGain();
    this.dry.gain.value = 0.82;
    this.dry.connect(this.tone);

    this.reverbInput = convolver;
  }

  private reverbInput: ConvolverNode | null = null;

  private makeImpulse(seconds: number, decay: number) {
    const ctx = this.ctx!;
    const rate = ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  load(track: Track) {
    const wasPlaying = this._playing;
    this.stopGenerated();
    this.stopFile();

    if (track.src) {
      this.mode = 'file';
      this.audioEl = new Audio(track.src);
      this.audioEl.loop = true;
      this.audioEl.volume = this._volume;
      this.audioEl.crossOrigin = 'anonymous';
    } else {
      this.mode = 'generated';
      this.currentMood = track.mood ?? 'dawn';
      this.barIndex = 0;
    }

    if (wasPlaying) void this.play();
  }

  async play() {
    this._playing = true;
    if (this.mode === 'file' && this.audioEl) {
      try {
        await this.audioEl.play();
      } catch {
        /* blocked — retries on next gesture */
      }
      return;
    }

    this.ensureContext();
    if (!this.ctx || !this.master) return;
    if (this.ctx.state === 'suspended') await this.ctx.resume();

    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(this._volume * 0.42, now + 2.4);

    if (!this.timer) {
      const barMs = (60 / MOODS[this.currentMood].bpm) * 4 * 1000;
      this.scheduleBar();
      this.timer = window.setInterval(() => this.scheduleBar(), barMs);
    }
  }

  pause() {
    this._playing = false;
    if (this.mode === 'file' && this.audioEl) {
      this.audioEl.pause();
      return;
    }
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + 1.4);
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    window.setTimeout(() => this.stopGenerated(), 1800);
  }

  toggle() {
    return this._playing ? (this.pause(), false) : (void this.play(), true);
  }

  setVolume(v: number) {
    this._volume = Math.max(0, Math.min(1, v));
    if (this.audioEl) this.audioEl.volume = this._volume;
    if (this.ctx && this.master && this._playing) {
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.linearRampToValueAtTime(this._volume * 0.42, now + 0.4);
    }
  }

  // ── voices ───────────────────────────────────────────────────────────────

  private connectOut(node: AudioNode) {
    if (this.dry) node.connect(this.dry);
    if (this.reverbInput) node.connect(this.reverbInput);
  }

  /** Piano/bell-like plucked tone from a few decaying partials. */
  private piano(freq: number, at: number, dur: number, peak: number) {
    const ctx = this.ctx!;
    const env = ctx.createGain();
    // softer attack + a longer, singing tail → felt-piano warmth
    env.gain.setValueAtTime(0.0001, at);
    env.gain.exponentialRampToValueAtTime(peak, at + 0.035);
    env.gain.exponentialRampToValueAtTime(0.0001, at + dur * 1.35);

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(2600, at);
    lp.frequency.exponentialRampToValueAtTime(900, at + dur);
    env.connect(lp);
    this.connectOut(lp);

    const partials: Array<[number, number, OscillatorType]> = [
      [0.5, 0.16, 'sine'], // sub-octave for warmth
      [1, 1, 'sine'],
      [2, 0.4, 'sine'],
      [3, 0.1, 'sine'],
    ];
    for (const [mult, amp, type] of partials) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = freq * mult;
      const g = ctx.createGain();
      g.gain.value = amp;
      o.connect(g);
      g.connect(env);
      o.start(at);
      o.stop(at + dur + 0.1);
      this.oscs.push(o);
    }
  }

  /** Warm sustained string-ish pad, one note. */
  private pad(freq: number, at: number, dur: number, peak: number) {
    const ctx = this.ctx!;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 820;
    const env = ctx.createGain();
    // slow swell in and out — a warm cushion under everything
    env.gain.setValueAtTime(0.0001, at);
    env.gain.linearRampToValueAtTime(peak, at + dur * 0.45);
    env.gain.setValueAtTime(peak, at + dur * 0.62);
    env.gain.linearRampToValueAtTime(0.0001, at + dur * 1.1);
    lp.connect(env);
    this.connectOut(env);

    for (const detune of [-8, 8]) {
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.value = freq;
      o.detune.value = detune;
      o.connect(lp);
      o.start(at);
      o.stop(at + dur * 1.2 + 0.1);
      this.oscs.push(o);
    }
  }

  private bass(freq: number, at: number, dur: number, peak: number) {
    const ctx = this.ctx!;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, at);
    env.gain.exponentialRampToValueAtTime(peak, at + 0.04);
    env.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    this.connectOut(env);
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = freq;
    o.connect(env);
    o.start(at);
    o.stop(at + dur + 0.1);
    this.oscs.push(o);
  }

  // ── the arranger ───────────────────────────────────────────────────────────

  private scheduleBar() {
    if (!this.ctx) return;
    const mood = MOODS[this.currentMood];
    const beat = 60 / mood.bpm;
    const bar = beat * 4;
    const t0 = this.ctx.currentTime + 0.06;
    const chord = mood.chords[this.barIndex % mood.chords.length];
    this.barIndex++;

    const third = chord.type === 'min' ? 3 : 4;
    const seventh = chord.type === 'min' ? 10 : 11; // min7 / maj7 for lushness
    // Lush voicing: root · third · fifth · seventh · ninth
    const voicing = [chord.root, chord.root + third, chord.root + 7, chord.root + seventh, chord.root + 14];

    // Pad — the full lush chord, one octave down, gently swelling across the bar.
    for (const n of voicing) this.pad(semi(n - 12), t0, bar * 1.05, 0.038);

    // Bass — soft root, held almost the whole bar (one slow heartbeat).
    this.bass(semi(chord.root - 24), t0, beat * 3.4, 0.13);

    // Rolled-chord piano — a slow, tender arpeggio (7th chord).
    const arp = [chord.root, chord.root + third, chord.root + 7, chord.root + seventh];
    arp.forEach((n, i) => this.piano(semi(n), t0 + i * beat * 0.9, beat * 2, 0.045));

    // Melody — sparse and expressive, leaning on the emotional tones
    // (3rd, 7th, 9th). Up an octave, with room to breathe.
    const safe = [third, 7, seventh, 12, third + 12, 14, 9, 16].map((o) => chord.root + o + 12);
    const pattern = MELODY_PATTERNS[Math.floor(Math.random() * MELODY_PATTERNS.length)];
    for (const beatPos of pattern) {
      if (Math.random() < 0.22) continue; // more rests → more tender
      let note = safe[Math.floor(Math.random() * safe.length)];
      if (note === this.lastMelody && Math.random() < 0.7) {
        note = safe[Math.floor(Math.random() * safe.length)];
      }
      this.lastMelody = note;
      const dur = beat * (1.8 + Math.random() * 1.2); // longer, singing notes
      this.piano(semi(note), t0 + beatPos * beat, dur, 0.07 + Math.random() * 0.02);
    }

    if (this.oscs.length > 120) this.oscs = this.oscs.slice(-60);
  }

  private stopGenerated() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    for (const o of this.oscs) {
      try {
        o.stop();
      } catch {
        /* already stopped */
      }
    }
    this.oscs = [];
  }

  private stopFile() {
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.src = '';
      this.audioEl = null;
    }
  }

  destroy() {
    this.stopGenerated();
    this.stopFile();
    if (this.ctx) void this.ctx.close();
    this.ctx = null;
  }
}
