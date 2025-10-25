/**
 * Sound Manager for Toobix Universe
 *
 * Manages game audio with volume control, muting, and preloading
 */

export type SoundEffect =
  | 'hover'
  | 'click'
  | 'success'
  | 'quest-complete'
  | 'level-up'
  | 'notification'
  | 'page-transition'
  | 'sparkle'

interface SoundConfig {
  volume: number
  loop?: boolean
  playbackRate?: number
}

class SoundManager {
  private audioContext: AudioContext | null = null
  private sounds: Map<SoundEffect, AudioBuffer> = new Map()
  private masterVolume: number = 0.7
  private isMuted: boolean = false
  private isEnabled: boolean = true

  constructor() {
    if (typeof window !== 'undefined') {
      // Initialize AudioContext on user interaction
      this.initializeAudioContext()
    }
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
      this.isEnabled = false
    }
  }

  /**
   * Preload a sound effect
   */
  async preloadSound(name: SoundEffect, url: string): Promise<void> {
    if (!this.audioContext || !this.isEnabled) return

    try {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      this.sounds.set(name, audioBuffer)
    } catch (error) {
      console.warn(`Failed to load sound: ${name}`, error)
    }
  }

  /**
   * Play a sound effect
   */
  play(name: SoundEffect, config: Partial<SoundConfig> = {}): void {
    if (!this.audioContext || !this.isEnabled || this.isMuted) return

    const buffer = this.sounds.get(name)
    if (!buffer) {
      console.warn(`Sound not loaded: ${name}`)
      return
    }

    try {
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()

      source.buffer = buffer
      source.loop = config.loop || false
      source.playbackRate.value = config.playbackRate || 1.0

      const volume = (config.volume ?? 1.0) * this.masterVolume
      gainNode.gain.value = volume

      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      source.start(0)
    } catch (error) {
      console.warn(`Failed to play sound: ${name}`, error)
    }
  }

  /**
   * Generate procedural sound effect (when audio files not available)
   */
  playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3): void {
    if (!this.audioContext || !this.isEnabled || this.isMuted) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.type = type
      oscillator.frequency.value = frequency

      gainNode.gain.value = volume * this.masterVolume
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.start()
      oscillator.stop(this.audioContext.currentTime + duration)
    } catch (error) {
      console.warn('Failed to play tone:', error)
    }
  }

  /**
   * Procedural sound effects
   */
  playHoverSound(): void {
    this.playTone(800, 0.05, 'sine', 0.1)
  }

  playClickSound(): void {
    this.playTone(1200, 0.08, 'sine', 0.15)
  }

  playSuccessSound(): void {
    // Play a chord
    this.playTone(523.25, 0.15, 'sine', 0.2) // C
    setTimeout(() => this.playTone(659.25, 0.15, 'sine', 0.2), 50) // E
    setTimeout(() => this.playTone(783.99, 0.2, 'sine', 0.2), 100) // G
  }

  playQuestCompleteSound(): void {
    // Ascending arpeggio
    this.playTone(523.25, 0.1, 'sine', 0.2) // C
    setTimeout(() => this.playTone(659.25, 0.1, 'sine', 0.2), 80) // E
    setTimeout(() => this.playTone(783.99, 0.1, 'sine', 0.2), 160) // G
    setTimeout(() => this.playTone(1046.50, 0.3, 'sine', 0.25), 240) // C (octave)
  }

  playLevelUpSound(): void {
    // Triumphant fanfare
    this.playTone(523.25, 0.15, 'square', 0.2)
    setTimeout(() => this.playTone(659.25, 0.15, 'square', 0.2), 100)
    setTimeout(() => this.playTone(783.99, 0.15, 'square', 0.2), 200)
    setTimeout(() => this.playTone(1046.50, 0.4, 'square', 0.25), 300)
  }

  playNotificationSound(): void {
    this.playTone(1000, 0.1, 'sine', 0.15)
    setTimeout(() => this.playTone(1200, 0.15, 'sine', 0.15), 100)
  }

  playPageTransitionSound(): void {
    this.playTone(600, 0.1, 'sine', 0.08)
  }

  playSparkleSound(): void {
    this.playTone(2000 + Math.random() * 1000, 0.05, 'sine', 0.05)
  }

  /**
   * Set master volume (0.0 - 1.0)
   */
  setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume))
    localStorage.setItem('toobix_sound_volume', this.masterVolume.toString())
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.masterVolume
  }

  /**
   * Mute/unmute all sounds
   */
  setMuted(muted: boolean): void {
    this.isMuted = muted
    localStorage.setItem('toobix_sound_muted', muted.toString())
  }

  /**
   * Check if muted
   */
  isSoundMuted(): boolean {
    return this.isMuted
  }

  /**
   * Enable/disable sound system
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
    localStorage.setItem('toobix_sound_enabled', enabled.toString())
  }

  /**
   * Load settings from localStorage
   */
  loadSettings(): void {
    const volume = localStorage.getItem('toobix_sound_volume')
    if (volume) {
      this.masterVolume = parseFloat(volume)
    }

    const muted = localStorage.getItem('toobix_sound_muted')
    if (muted) {
      this.isMuted = muted === 'true'
    }

    const enabled = localStorage.getItem('toobix_sound_enabled')
    if (enabled) {
      this.isEnabled = enabled === 'true'
    }
  }

  /**
   * Resume audio context (required for some browsers)
   */
  async resume(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
  }
}

// Global singleton instance
export const soundManager = new SoundManager()

// Load settings on init
if (typeof window !== 'undefined') {
  soundManager.loadSettings()
}
