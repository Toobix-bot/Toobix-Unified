/**
 * 🔄 Memory Transformation System - Type Definitions
 *
 * Philosophy:
 * "We cannot change what happened. But we can change what it means.
 *  The past is fixed, but our relationship to it is fluid."
 */

export interface Memory {
  id?: number
  timestamp?: number

  // Original memory
  event: string
  description: string
  emotionalCharge: number  // -100 (traumatic) to 100 (joyful)

  // Context
  context: string
  participants: string[]

  // Status
  isArchived: boolean
  transformationCount: number
}

export interface MemoryTransformation {
  id?: number
  memoryId: number
  timestamp?: number

  // Transformation type
  type: 'reframe' | 'integrate' | 'heal' | 'wisdom_extract' | 'acceptance'

  // Old vs New
  oldInterpretation: string
  newInterpretation: string

  // Process
  howTransformed: string
  wisdomGained: string

  // Result
  emotionalShift: number  // Change in emotional charge
  healingLevel: number  // 0-100: How much healing occurred

  // Can it be undone?
  reversible: boolean
}

export interface MemoryLayer {
  id?: number
  memoryId: number
  layerNumber: number
  timestamp?: number

  // Each layer is a new perspective
  perspective: string
  interpretation: string
  emotionalTone: string

  // Connection to past layers
  buildsOn?: number  // Previous layer ID
  contradicts?: number  // Layer it contradicts
}

export interface HealingJourney {
  id?: number
  memoryId: number
  startedAt?: number

  // Process
  stages: Array<{
    stage: string
    description: string
    completedAt?: number
  }>

  // Current state
  currentStage: string
  progress: number  // 0-100

  // Outcome
  isComplete: boolean
  completedAt?: number
  finalWisdom?: string
}

/**
 * Parameters for storing a new memory
 */
export interface StoreMemoryParams {
  event: string
  description: string
  emotionalCharge: number
  context: string
  participants: string[]
}

/**
 * Parameters for reframing a memory
 */
export interface ReframeMemoryParams {
  memoryId: number
  oldInterpretation: string
  newInterpretation: string
  howTransformed: string
}

/**
 * Parameters for adding a memory layer
 */
export interface AddLayerParams {
  memoryId: number
  layerNumber: number
  perspective: string
  interpretation: string
  emotionalTone: string
  buildsOn?: number
  contradicts?: number
}

/**
 * Parameters for starting a healing journey
 */
export interface StartHealingJourneyParams {
  memoryId: number
  stages: Array<{
    stage: string
    description: string
  }>
}
