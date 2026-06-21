/**
 * Aviator Sound Effects using Web Audio API
 * No external libraries or audio files needed
 */

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

export const aviatorSounds = {
  startEngine: () => {
    try {
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const distortion = ctx.createWaveShaper();
      
      oscillator.connect(distortion);
      distortion.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(80, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      
      oscillator.start();
      
      return {
        ctx,
        oscillator,
        gainNode,
        updateMultiplier: (multiplier: number) => {
          const freq = 80 + (multiplier * 12);
          oscillator.frequency.linearRampToValueAtTime(freq, ctx.currentTime + 0.1);
        },
        stop: () => {
          gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
          setTimeout(() => {
            oscillator.stop();
            ctx.close();
          }, 300);
        }
      };
    } catch (error) {
      console.error("Error starting engine sound:", error);
      return null;
    }
  },

  playCrash: () => {
    try {
      const ctx = new AudioContext();
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
      }
      
      const source = ctx.createBufferSource();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      source.buffer = buffer;
      filter.type = "lowpass";
      filter.frequency.value = 400;
      gainNode.gain.setValueAtTime(1.5, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
      
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      source.start();
    } catch (error) {
      console.error("Error playing crash sound:", error);
    }
  },

  playCashout: () => {
    try {
      const ctx = new AudioContext();
      const gainNode = ctx.createGain();
      gainNode.connect(ctx.destination);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      
      const notes = [523, 659, 784];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.connect(gainNode);
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.15);
      });
    } catch (error) {
      console.error("Error playing cashout sound:", error);
    }
  },

  placeBet: () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (error) {
      console.error("Error playing bet sound:", error);
    }
  },

  playCountdown: () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.value = 440;
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (error) {
      console.error("Error playing countdown sound:", error);
    }
  }
};

// Mute state management
let isMuted = false;

export const setMuted = (muted: boolean) => {
  isMuted = muted;
  localStorage.setItem("aviator_muted", String(muted));
};

export const getMuted = (): boolean => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("aviator_muted");
    if (stored !== null) {
      isMuted = stored === "true";
    }
  }
  return isMuted;
};

// Wrapper that checks mute state
export const playSound = (soundFn: () => void) => {
  if (!isMuted) {
    soundFn();
  }
};
