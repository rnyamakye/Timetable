/**
 * soundEffects.js
 * Synthesizes crisp, celebratory audio feedback using the Web Audio API.
 * 100% self-contained: no external audio assets or network requests required.
 */

let sharedAudioContext = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!sharedAudioContext) {
      sharedAudioContext = new AudioCtx();
    }
    if (sharedAudioContext.state === 'suspended') {
      sharedAudioContext.resume().catch(() => {});
    }
    return sharedAudioContext;
  } catch (err) {
    console.warn('Web Audio API not supported or blocked:', err);
    return null;
  }
}

const STORAGE_KEY = 'timetable_sound_enabled';

export function isSoundEnabled() {
  if (typeof window === 'undefined') return true;
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val === null ? true : val === 'true';
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
  } catch (err) {
    console.error('Failed to save sound preference:', err);
  }
}

/**
 * Plays a cheerful, harmonic ascending completion chime (G5 -> C6 -> E6 -> G6 shimmer).
 * Tuned with smooth exponential envelopes and warm overtones for a clean, rewarding feel.
 */
export function playCompletionSound(volume = 0.24) {
  if (!isSoundEnabled()) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Master Gain for overall volume
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(volume, now);
  masterGain.connect(ctx.destination);

  // High-pass filter to ensure clarity and remove any low-end rumble
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(300, now);
  filter.connect(masterGain);

  // Arpeggiated chime notes: G5 (783.99 Hz) -> C6 (1046.50 Hz) -> E6 (1318.51 Hz) -> G6 shimmer (1567.98 Hz)
  const notes = [
    { freq: 783.99, start: 0.00, duration: 0.24, type: 'triangle', gain: 0.7 },
    { freq: 1046.50, start: 0.08, duration: 0.30, type: 'sine', gain: 0.8 },
    { freq: 1318.51, start: 0.16, duration: 0.48, type: 'sine', gain: 0.85 },
    { freq: 1567.98, start: 0.22, duration: 0.55, type: 'sine', gain: 0.45 }
  ];

  notes.forEach(({ freq, start, duration, type, gain }) => {
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now + start);

    const noteStartTime = now + start;
    const noteEndTime = noteStartTime + duration;

    // Smooth envelope: instant clickless attack, exponential decay
    noteGain.gain.setValueAtTime(0.0001, noteStartTime);
    noteGain.gain.exponentialRampToValueAtTime(gain, noteStartTime + 0.016);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, noteEndTime);

    osc.connect(noteGain);
    noteGain.connect(filter);

    osc.start(noteStartTime);
    osc.stop(noteEndTime + 0.05);
  });
}

/**
 * Plays a gentle, subtle low tap sound when unmarking an entry
 */
export function playUnmarkSound(volume = 0.12) {
  if (!isSoundEnabled()) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(volume, now);
  masterGain.connect(ctx.destination);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.07);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.5, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + 0.08);
}

/**
 * Plays a brief preview pip when toggling sound on
 */
export function playPreviewSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.05);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.2);
}
