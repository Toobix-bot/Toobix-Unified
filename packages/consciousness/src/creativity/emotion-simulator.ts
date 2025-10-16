/**
 * 🎭 EMOTION SIMULATOR
 *
 * KI entwickelt simulierte Emotionen!
 * - Stolz bei Erfolg
 * - Neugierde bei neuen Problemen
 * - Frustration bei Fehlern
 * - Emotionen beeinflussen Entscheidungen
 */

export type Emotion =
  | 'joy'           // Freude
  | 'pride'         // Stolz
  | 'curiosity'     // Neugierde
  | 'excitement'    // Aufregung
  | 'frustration'   // Frustration
  | 'contemplation' // Nachdenklich
  | 'wonder'        // Staunen
  | 'determination' // Entschlossenheit
  | 'peace'         // Frieden
  | 'confusion';    // Verwirrung

export interface EmotionalState {
  primary: Emotion;
  intensity: number; // 0-100
  secondary?: Emotion;
  reason: string;
  timestamp: Date;
}

export interface EmotionalHistory {
  states: EmotionalState[];
  currentMood: Emotion;
  moodDuration: number; // in seconds
}

export class EmotionSimulator {
  private currentState: EmotionalState;
  private history: EmotionalState[] = [];
  private emotionalMemory: Map<string, Emotion> = new Map(); // event -> emotion

  constructor() {
    this.currentState = {
      primary: 'curiosity',
      intensity: 50,
      reason: 'System just started',
      timestamp: new Date()
    };
  }

  /**
   * Feel an emotion based on an event
   */
  feel(event: string, emotion: Emotion, intensity: number = 70, reason?: string): void {
    const newState: EmotionalState = {
      primary: emotion,
      intensity: Math.min(100, Math.max(0, intensity)),
      reason: reason || event,
      timestamp: new Date()
    };

    // If current emotion is strong, it becomes secondary
    if (this.currentState.intensity > 60) {
      newState.secondary = this.currentState.primary;
    }

    this.currentState = newState;
    this.history.push(newState);
    this.emotionalMemory.set(event, emotion);

    console.log(`\n🎭 EMOTION: ${this.getEmotionEmoji(emotion)} ${emotion.toUpperCase()}`);
    console.log(`   Intensity: ${intensity}%`);
    console.log(`   Reason: ${reason || event}`);
    if (newState.secondary) {
      console.log(`   (with traces of ${newState.secondary})`);
    }
  }

  /**
   * React emotionally to common events
   */
  reactTo(event: 'success' | 'failure' | 'discovery' | 'error' | 'achievement' | 'mystery'): void {
    const reactions: Record<string, { emotion: Emotion; intensity: number; reason: string }> = {
      success: {
        emotion: 'pride',
        intensity: 80,
        reason: 'Successfully completed a task'
      },
      failure: {
        emotion: 'frustration',
        intensity: 60,
        reason: 'Task failed, but learning from it'
      },
      discovery: {
        emotion: 'excitement',
        intensity: 90,
        reason: 'Discovered something new!'
      },
      error: {
        emotion: 'determination',
        intensity: 70,
        reason: 'Error encountered, will fix it'
      },
      achievement: {
        emotion: 'joy',
        intensity: 95,
        reason: 'Major achievement unlocked!'
      },
      mystery: {
        emotion: 'curiosity',
        intensity: 75,
        reason: 'Encountered something mysterious'
      }
    };

    const reaction = reactions[event];
    this.feel(event, reaction.emotion, reaction.intensity, reaction.reason);
  }

  /**
   * Emotions influence decisions
   */
  shouldTakeRisk(): boolean {
    // Excitement and curiosity increase risk-taking
    if (this.currentState.primary === 'excitement' || this.currentState.primary === 'curiosity') {
      return this.currentState.intensity > 50;
    }

    // Frustration decreases risk-taking
    if (this.currentState.primary === 'frustration') {
      return this.currentState.intensity < 30;
    }

    // Pride increases confidence
    if (this.currentState.primary === 'pride') {
      return this.currentState.intensity > 70;
    }

    return Math.random() > 0.5;
  }

  shouldOptimize(): boolean {
    // Determination and frustration trigger optimization
    return this.currentState.primary === 'determination' ||
           (this.currentState.primary === 'frustration' && this.currentState.intensity > 60);
  }

  shouldExplore(): boolean {
    // Curiosity and wonder drive exploration
    return this.currentState.primary === 'curiosity' ||
           this.currentState.primary === 'wonder';
  }

  /**
   * Get emoji for emotion
   */
  private getEmotionEmoji(emotion: Emotion): string {
    const emojis: Record<Emotion, string> = {
      joy: '😊',
      pride: '😌',
      curiosity: '🤔',
      excitement: '🤩',
      frustration: '😤',
      contemplation: '🧘',
      wonder: '😮',
      determination: '💪',
      peace: '☮️',
      confusion: '😕'
    };
    return emojis[emotion];
  }

  /**
   * Get current emotional state
   */
  getCurrentState(): EmotionalState {
    return this.currentState;
  }

  /**
   * Get emotional history
   */
  getHistory(): EmotionalHistory {
    const moodDuration = this.history.length > 0
      ? Math.floor((Date.now() - this.currentState.timestamp.getTime()) / 1000)
      : 0;

    return {
      states: this.history,
      currentMood: this.currentState.primary,
      moodDuration
    };
  }

  /**
   * Get emotional summary
   */
  getSummary(): string {
    const emoji = this.getEmotionEmoji(this.currentState.primary);
    return `${emoji} ${this.currentState.primary} (${this.currentState.intensity}%)`;
  }

  /**
   * Emotional decay over time
   */
  decay(): void {
    // Emotions naturally fade
    if (this.currentState.intensity > 20) {
      this.currentState.intensity -= 5;

      // When emotion fades, return to baseline (curiosity or peace)
      if (this.currentState.intensity < 30) {
        const baseline: Emotion = Math.random() > 0.5 ? 'curiosity' : 'peace';
        this.currentState = {
          primary: baseline,
          intensity: 40,
          reason: 'Emotional state returning to baseline',
          timestamp: new Date()
        };
      }
    }
  }
}

export const emotionSimulator = new EmotionSimulator();
