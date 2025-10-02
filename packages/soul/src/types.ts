/**
 * Soul System Types
 * Emotional Intelligence, Values, and Personality Framework
 */

// ==================== EMOTIONS ====================

export type EmotionType = 
  | 'joy' 
  | 'sadness' 
  | 'anger' 
  | 'fear' 
  | 'trust' 
  | 'disgust' 
  | 'surprise' 
  | 'anticipation'

export interface Emotion {
  type: EmotionType
  intensity: number // 0-100
  timestamp: number
  trigger?: string
  context?: Record<string, any>
}

export interface EmotionalState {
  emotions: Map<EmotionType, number> // Current intensity per emotion
  mood: number // Overall mood -100 to +100
  energy: number // 0-100
  lastUpdate: number
  history: Emotion[]
}

// ==================== VALUES ====================

export type ValueType =
  | 'love'
  | 'family'
  | 'friendship'
  | 'freedom'
  | 'growth'
  | 'creativity'
  | 'peace'
  | 'justice'
  | 'adventure'
  | 'wisdom'

export interface Value {
  type: ValueType
  importance: number // 0-100
  alignment: number // -100 to +100 (how well living up to it)
  lastUpdated: number
}

export interface Belief {
  id: string
  statement: string
  strength: number // 0-100
  category: string
  formed: number
  challenged?: number
}

// ==================== PERSONALITY ====================

export interface BigFiveTraits {
  openness: number // 0-100
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

export interface PersonalityProfile {
  traits: BigFiveTraits
  archetype?: string
  temperament?: string
  characteristics: string[]
  strengths: string[]
  weaknesses: string[]
}

// ==================== SOUL STATE ====================

export interface SoulState {
  id: string
  name: string
  emotional: EmotionalState
  values: Map<ValueType, Value>
  beliefs: Belief[]
  personality: PersonalityProfile
  experiences: number // Total life experiences count
  wisdom: number // 0-100
  created: number
  lastUpdated: number
}

export interface SoulEvent {
  type: 'experience' | 'interaction' | 'reflection' | 'challenge'
  description: string
  emotionalImpact: Partial<Record<EmotionType, number>>
  valueImpact?: Partial<Record<ValueType, number>>
  timestamp: number
  context?: Record<string, any>
}

export interface SoulConfig {
  decayRate: number // How fast emotions decay
  moodInfluence: number // How much emotions affect mood
  learningRate: number // How fast values/beliefs adjust
}

// ==================== DATABASE ====================

export interface EmotionHistoryRow {
  id: string
  soul_id: string
  emotion_type: EmotionType
  intensity: number
  trigger?: string
  context?: string
  timestamp: number
}

export interface ValueLogRow {
  id: string
  soul_id: string
  value_type: ValueType
  importance: number
  alignment: number
  timestamp: number
}

export interface BeliefRow {
  id: string
  soul_id: string
  statement: string
  strength: number
  category: string
  formed: number
  challenged?: number
}

export interface SoulStateRow {
  id: string
  name: string
  emotional_state: string // JSON
  values_state: string // JSON
  beliefs: string // JSON
  personality: string // JSON
  experiences: number
  wisdom: number
  created: number
  last_updated: number
}
