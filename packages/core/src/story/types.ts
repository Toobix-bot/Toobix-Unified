/**
 * 📖 Story Engine Types
 * Portiert von Version_7 - Narrative System für Toobix Unified
 */

/**
 * Story Option - Eine Entscheidungsmöglichkeit
 */
export interface StoryOption {
  id: string
  label: string
  rationale?: string
  risk: number
  expected?: Record<string, number>
  tags: string[]
  expiresAt?: number
}

/**
 * Story Event - Ein Ereignis in der Story
 */
export interface StoryEvent {
  id: string
  ts: number
  epoch: number
  kind: 'action' | 'tick' | 'arc_shift' | 'custom'
  text: string
  mood: string
  deltas?: Record<string, number>
  tags: string[]
  optionRef?: string
  personId?: string  // NEW: Link to People
}

/**
 * Story State - Aktueller Zustand
 */
export interface StoryState {
  epoch: number
  mood: string
  arc: 'foundations' | 'exploration' | 'mastery'
  resources: StoryResources
  options: StoryOption[]
  companions: Companion[]
  buffs: Buff[]
  skills: Skill[]
}

/**
 * Story Resources
 */
export interface StoryResources {
  energie: number       // Energy
  wissen: number       // Knowledge
  inspiration: number  // Inspiration
  ruf: number          // Reputation
  stabilitaet: number  // Stability
  erfahrung: number    // XP
  level: number        // Level
}

/**
 * Companion - Begleiter im Leben
 */
export interface Companion {
  id: number
  name: string
  archetype?: string
  mood?: string
  stats?: Record<string, any>
  acquiredAt: number
  personId?: string  // NEW: Link to People module
}

/**
 * Buff - Temporärer Effekt
 */
export interface Buff {
  id: number
  label: string
  kind?: string
  magnitude?: number
  expiresAt?: number
  meta?: Record<string, any>
}

/**
 * Skill - Fähigkeit
 */
export interface Skill {
  id: number
  name: string
  category?: string
  level: number
  xp: number
  updatedAt: number
}

/**
 * Story Arc Type
 */
export type StoryArc = 'foundations' | 'exploration' | 'mastery'

/**
 * Story for Person - Narrative für eine bestimmte Person
 */
export interface PersonStory {
  personId: string
  personName: string
  currentArc: StoryArc
  totalEvents: number
  totalXP: number
  currentLevel: number
  lastEventAt: number
  keyMoments: StoryEvent[]
}

/**
 * NEW: Story Input Types
 */
export interface CreateStoryOptionInput {
  label: string
  rationale?: string
  risk?: number
  expected?: Record<string, number>
  tags?: string[]
  expiresAt?: number
}

export interface CreateStoryEventInput {
  kind: 'action' | 'tick' | 'arc_shift' | 'custom'
  text: string
  mood?: string
  deltas?: Record<string, number>
  tags?: string[]
  optionRef?: string
  personId?: string
}

export interface CreateCompanionInput {
  name: string
  archetype?: string
  mood?: string
  stats?: Record<string, any>
  personId?: string
}

export interface CreateBuffInput {
  label: string
  kind?: string
  magnitude?: number
  expiresAt?: number
  meta?: Record<string, any>
}

export interface CreateSkillInput {
  name: string
  category?: string
  level?: number
  xp?: number
}
