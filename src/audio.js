/**
 * Audio feedback and Speech Synthesis helper
 * Uses Web Audio API for synthetic feedback tones (zero external files required)
 * and Web Speech API for authentic Japanese character pronunciation.
 */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a synthetic sound effect for correct or incorrect answers
 * @param {boolean} isCorrect
 */
export function playSound(isCorrect) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (isCorrect) {
      // Pleasant upward chime (C5 to G5)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      // Gentle downward buzz
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    // Graceful fallback if Web Audio is blocked or unsupported
  }
}

/**
 * Pronounce a Japanese kana character using Web Speech API
 * @param {string} kana
 */
export function speakKana(kana) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(kana);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9; // Slightly slower for clear learning

    // Attempt to locate a native ja-JP voice if available
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang === 'ja-JP' || v.lang.startsWith('ja'));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
}
