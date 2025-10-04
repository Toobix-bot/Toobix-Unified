// Sound System for Terminal & Browser
// Beeps, chimes, ambient sounds

export type SoundEvent =
  | 'level-up'
  | 'achievement'
  | 'commit'
  | 'peaceful'
  | 'epic'
  | 'error'
  | 'success'
  | 'ambient-forest'
  | 'ambient-digital'
  | 'luna-speaks'
  | 'magic'

export interface Sound {
  type: SoundEvent
  frequency?: number
  duration?: number
  pattern?: number[]
}

export class SoundSystem {
  private enabled: boolean = true
  private volume: number = 0.5

  constructor() {
    // Check if terminal supports beep
    this.enabled = process.stdout.isTTY || false
  }

  // Terminal beep patterns
  async playTerminalBeep(pattern: number[] = [1]): Promise<void> {
    if (!this.enabled) return

    for (const count of pattern) {
      for (let i = 0; i < count; i++) {
        process.stdout.write('\x07')
        await this.sleep(100)
      }
      await this.sleep(200)
    }
  }

  // Pre-defined sound effects
  async play(event: SoundEvent): Promise<void> {
    switch (event) {
      case 'level-up':
        await this.playTerminalBeep([1, 2, 3])
        console.log('🔊 ✨ *Level up chime* ✨')
        break

      case 'achievement':
        await this.playTerminalBeep([2, 2])
        console.log('🔊 🏆 *Achievement unlocked!* 🏆')
        break

      case 'commit':
        await this.playTerminalBeep([1])
        console.log('🔊 ✓ *Commit sound*')
        break

      case 'peaceful':
        console.log('🔊 🎵 *Gentle chime* 🎵')
        break

      case 'epic':
        await this.playTerminalBeep([3, 3, 3])
        console.log('🔊 💥 *EPIC FANFARE* 💥')
        break

      case 'error':
        await this.playTerminalBeep([1, 1, 1])
        console.log('🔊 ⚠️ *Error beep*')
        break

      case 'success':
        await this.playTerminalBeep([1, 1])
        console.log('🔊 ✅ *Success!* ✅')
        break

      case 'luna-speaks':
        console.log('🔊 🌙 *Luna\'s voice resonates...*')
        break

      case 'magic':
        await this.playTerminalBeep([1, 2, 1])
        console.log('🔊 ✨ *Sparkle!* ✨')
        break

      case 'ambient-forest':
        console.log('🔊 🌳 *Forest ambience... birds chirping...*')
        break

      case 'ambient-digital':
        console.log('🔊 💻 *Digital hum... data flowing...*')
        break
    }
  }

  // Generate browser-compatible audio
  generateWebAudio(event: SoundEvent): string {
    // Returns HTML5 Audio element or Web Audio API code
    const soundMap: Record<SoundEvent, string> = {
      'level-up': `
        const ctx = new AudioContext();
        const notes = [523, 659, 784]; // C, E, G (major chord)
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.2);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.2 + 0.5);
          osc.start(ctx.currentTime + i * 0.2);
          osc.stop(ctx.currentTime + i * 0.2 + 0.5);
        });
      `,
      'achievement': `
        // Triumphant chord
        const ctx = new AudioContext();
        [262, 330, 392, 523].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = 'triangle';
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
          osc.start();
          osc.stop(ctx.currentTime + 1);
        });
      `,
      'peaceful': `
        // Gentle bell
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 432; // Healing frequency
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
        osc.start();
        osc.stop(ctx.currentTime + 2);
      `,
      'epic': `
        // Epic fanfare
        const ctx = new AudioContext();
        const melody = [523, 659, 784, 1047]; // C major scale up
        melody.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = 'sawtooth';
          gain.gain.setValueAtTime(0.4, ctx.currentTime + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.3);
          osc.start(ctx.currentTime + i * 0.15);
          osc.stop(ctx.currentTime + i * 0.15 + 0.3);
        });
      `,
      'commit': `
        // Quick blip
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        osc.type = 'square';
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      `,
      'error': `
        // Dissonant beep
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 200;
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      `,
      'success': `
        // Cheerful beep
        const ctx = new AudioContext();
        [600, 800].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.15);
          osc.start(ctx.currentTime + i * 0.1);
          osc.stop(ctx.currentTime + i * 0.1 + 0.15);
        });
      `,
      'luna-speaks': `
        // Ethereal tone
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        osc.connect(gain);
        gain.connect(ctx.destination);

        lfo.frequency.value = 5; // Vibrato
        lfoGain.gain.value = 10;
        osc.frequency.value = 440;
        osc.type = 'sine';

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

        lfo.start();
        osc.start();
        lfo.stop(ctx.currentTime + 1.5);
        osc.stop(ctx.currentTime + 1.5);
      `,
      'magic': `
        // Sparkle sound
        const ctx = new AudioContext();
        [1000, 1200, 1400, 1600, 1800].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.05 + 0.1);
          osc.start(ctx.currentTime + i * 0.05);
          osc.stop(ctx.currentTime + i * 0.05 + 0.1);
        });
      `,
      'ambient-forest': `
        // Gentle white noise with filtering
        const ctx = new AudioContext();
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        const gain = ctx.createGain();
        gain.gain.value = 0.05;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      `,
      'ambient-digital': `
        // Synthetic hum
        const ctx = new AudioContext();
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.frequency.value = 60;
        osc2.frequency.value = 120;
        osc1.type = 'sine';
        osc2.type = 'sine';

        gain.gain.value = 0.03;

        osc1.start();
        osc2.start();
      `
    }

    return soundMap[event] || ''
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Export singleton
export const soundSystem = new SoundSystem()
