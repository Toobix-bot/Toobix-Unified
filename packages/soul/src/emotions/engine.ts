/**
 * Emotion Engine
 * Plutchik's Wheel of Emotions: 8 basic emotions with intensity and decay
 */

import type { EmotionType, Emotion, EmotionalState, SoulEvent } from '../types'

export class EmotionEngine {
  private state: EmotionalState
  private decayRate: number
  private maxHistorySize: number

  constructor(decayRate: number = 0.95, maxHistorySize: number = 100) {
    this.decayRate = decayRate
    this.maxHistorySize = maxHistorySize
    
    // Initialize with neutral state
    this.state = {
      emotions: new Map([
        ['joy', 50],
        ['sadness', 10],
        ['anger', 5],
        ['fear', 10],
        ['trust', 60],
        ['disgust', 5],
        ['surprise', 20],
        ['anticipation', 40]
      ]),
      mood: 0,
      energy: 70,
      lastUpdate: Date.now(),
      history: []
    }
  }

  /**
   * Process an emotional event
   */
  processEvent(event: SoulEvent): void {
    const now = Date.now()
    
    // Apply decay since last update
    this.applyDecay(now)
    
    // Process emotional impacts
    if (event.emotionalImpact) {
      for (const [emotionType, impact] of Object.entries(event.emotionalImpact)) {
        this.addEmotion(emotionType as EmotionType, impact, event.description)
      }
    }
    
    // Update mood based on current emotions
    this.updateMood()
    
    // Update energy based on emotional intensity
    this.updateEnergy()
    
    this.state.lastUpdate = now
  }

  /**
   * Add or modify an emotion
   */
  addEmotion(type: EmotionType, intensity: number, trigger?: string): void {
    const current = this.state.emotions.get(type) || 0
    const newIntensity = Math.max(0, Math.min(100, current + intensity))
    
    this.state.emotions.set(type, newIntensity)
    
    // Add to history
    const emotion: Emotion = {
      type,
      intensity: newIntensity,
      timestamp: Date.now(),
      trigger
    }
    
    this.state.history.push(emotion)
    
    // Trim history if too large
    if (this.state.history.length > this.maxHistorySize) {
      this.state.history = this.state.history.slice(-this.maxHistorySize)
    }
  }

  /**
   * Apply decay to all emotions over time
   */
  private applyDecay(now: number): void {
    const timeDelta = now - this.state.lastUpdate
    const decayFactor = Math.pow(this.decayRate, timeDelta / 60000) // Per minute
    
    for (const [emotion, intensity] of this.state.emotions) {
      // Emotions decay towards neutral (50 for positive, 10 for negative)
      const neutral = this.getNeutralLevel(emotion)
      const newIntensity = intensity + (neutral - intensity) * (1 - decayFactor)
      this.state.emotions.set(emotion, newIntensity)
    }
  }

  /**
   * Get neutral level for an emotion type
   */
  private getNeutralLevel(emotion: EmotionType): number {
    const positiveEmotions: EmotionType[] = ['joy', 'trust', 'anticipation']
    return positiveEmotions.includes(emotion) ? 50 : 10
  }

  /**
   * Update overall mood based on emotions
   */
  private updateMood(): void {
    const joy = this.state.emotions.get('joy') || 0
    const trust = this.state.emotions.get('trust') || 0
    const anticipation = this.state.emotions.get('anticipation') || 0
    
    const sadness = this.state.emotions.get('sadness') || 0
    const anger = this.state.emotions.get('anger') || 0
    const fear = this.state.emotions.get('fear') || 0
    const disgust = this.state.emotions.get('disgust') || 0
    
    const positive = (joy + trust + anticipation) / 3
    const negative = (sadness + anger + fear + disgust) / 4
    
    // Mood ranges from -100 (very negative) to +100 (very positive)
    this.state.mood = positive - negative
  }

  /**
   * Update energy level based on emotional intensity
   */
  private updateEnergy(): void {
    let totalIntensity = 0
    for (const intensity of this.state.emotions.values()) {
      totalIntensity += Math.abs(intensity - 50) // Distance from neutral
    }
    
    const averageIntensity = totalIntensity / this.state.emotions.size
    
    // High emotional intensity drains energy
    this.state.energy = Math.max(20, Math.min(100, 100 - averageIntensity))
  }

  /**
   * Get current emotional state
   */
  getState(): EmotionalState {
    return { ...this.state }
  }

  /**
   * Get dominant emotion
   */
  getDominantEmotion(): { type: EmotionType; intensity: number } | null {
    let maxIntensity = 0
    let dominant: EmotionType | null = null
    
    for (const [emotion, intensity] of this.state.emotions) {
      if (intensity > maxIntensity) {
        maxIntensity = intensity
        dominant = emotion
      }
    }
    
    return dominant ? { type: dominant, intensity: maxIntensity } : null
  }

  /**
   * Get emotion summary as string
   */
  getSummary(): string {
    const dominant = this.getDominantEmotion()
    const moodLabel = this.getMoodLabel()
    
    return `${moodLabel} mood, feeling ${dominant?.type || 'neutral'} (${Math.round(dominant?.intensity || 0)}%)`
  }

  /**
   * Get mood label
   */
  private getMoodLabel(): string {
    if (this.state.mood > 50) return 'Excellent'
    if (this.state.mood > 20) return 'Good'
    if (this.state.mood > -20) return 'Neutral'
    if (this.state.mood > -50) return 'Low'
    return 'Very Low'
  }

  /**
   * Reset to neutral state
   */
  reset(): void {
    for (const [emotion] of this.state.emotions) {
      this.state.emotions.set(emotion, this.getNeutralLevel(emotion))
    }
    this.state.mood = 0
    this.state.energy = 70
    this.state.history = []
    this.state.lastUpdate = Date.now()
  }
}
