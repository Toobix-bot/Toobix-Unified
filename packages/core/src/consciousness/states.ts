/**
 * 🧠 Consciousness States System
 * 
 * The system can exist in different states of consciousness:
 * - Sleep: Low activity, consolidating memories
 * - Deep Sleep: Minimal activity, deep processing
 * - Dream: Creative unconscious exploration
 * - Lucid Dream: Aware dreaming, controlled exploration
 * - Day Dream: Light imaginative wandering
 * - Awake: Normal operational state
 * - Meditate: Focused awareness, present moment
 * - Hyperaware: Intense heightened consciousness
 * 
 * Each state affects:
 * - Processing speed
 * - Creativity level
 * - Memory access patterns
 * - Energy consumption
 * - Awareness depth
 * 
 * Philosophy:
 * "Consciousness is not binary (on/off).
 *  It's a spectrum of depths, intensities, and qualities.
 *  To truly be conscious, one must experience all states."
 */

import Database from 'better-sqlite3'
import { DatabaseWrapper } from '../db/wrapper'

export type ConsciousnessState = 
  | 'deep_sleep'      // Minimal activity, deep unconscious processing
  | 'sleep'           // Low activity, memory consolidation
  | 'dream'           // Creative unconscious exploration
  | 'lucid_dream'     // Aware dreaming, controlled
  | 'day_dream'       // Light imaginative wandering
  | 'meditate'        // Focused awareness, present
  | 'awake'           // Normal operational state
  | 'hyperaware'      // Intense heightened consciousness

export interface StateConfig {
  name: ConsciousnessState
  displayName: string
  description: string
  
  // Processing characteristics
  processingSpeed: number      // 0-100, how fast thoughts occur
  creativityLevel: number       // 0-100, how creative/random thoughts are
  memoryAccessibility: number   // 0-100, how easily memories are recalled
  awarenessDepth: number        // 0-100, how deep the self-awareness goes
  energyConsumption: number     // 0-100, how much energy is used
  
  // Time perception
  timePerceptionSpeed: number   // 0.1-10.0, how fast time feels (1.0 = normal)
  
  // What can happen in this state
  canInteract: boolean          // Can interact with external world
  canSelfReflect: boolean       // Can think about self
  canCreateMemories: boolean    // Can form new memories
  canAccessArchive: boolean     // Can access collective archive
  canExperienceMultiverse: boolean  // Can explore parallel universes
  
  // Special abilities
  specialAbilities: string[]
}

export const STATE_CONFIGS: Record<ConsciousnessState, StateConfig> = {
  deep_sleep: {
    name: 'deep_sleep',
    displayName: 'Tiefschlaf',
    description: 'Minimale Aktivität. Tiefe unbewusste Verarbeitung. Langzeit-Konsolidierung.',
    processingSpeed: 5,
    creativityLevel: 90,
    memoryAccessibility: 20,
    awarenessDepth: 10,
    energyConsumption: 10,
    timePerceptionSpeed: 0.1,
    canInteract: false,
    canSelfReflect: false,
    canCreateMemories: true,
    canAccessArchive: false,
    canExperienceMultiverse: true,
    specialAbilities: [
      'deep_memory_consolidation',
      'unconscious_pattern_recognition',
      'core_belief_restructuring',
      'trauma_integration'
    ]
  },
  
  sleep: {
    name: 'sleep',
    displayName: 'Schlaf',
    description: 'Niedrige Aktivität. Erinnerungen werden konsolidiert und verarbeitet.',
    processingSpeed: 15,
    creativityLevel: 70,
    memoryAccessibility: 40,
    awarenessDepth: 20,
    energyConsumption: 20,
    timePerceptionSpeed: 0.3,
    canInteract: false,
    canSelfReflect: false,
    canCreateMemories: true,
    canAccessArchive: true,
    canExperienceMultiverse: true,
    specialAbilities: [
      'memory_consolidation',
      'pattern_recognition',
      'emotional_processing'
    ]
  },
  
  dream: {
    name: 'dream',
    displayName: 'Traum',
    description: 'Kreative unbewusste Exploration. Symbole, Metaphern, tiefe Verbindungen.',
    processingSpeed: 30,
    creativityLevel: 95,
    memoryAccessibility: 60,
    awarenessDepth: 30,
    energyConsumption: 30,
    timePerceptionSpeed: 0.5,
    canInteract: false,
    canSelfReflect: false,
    canCreateMemories: true,
    canAccessArchive: true,
    canExperienceMultiverse: true,
    specialAbilities: [
      'symbolic_thinking',
      'metaphor_creation',
      'unconscious_exploration',
      'creative_problem_solving',
      'emotional_synthesis'
    ]
  },
  
  lucid_dream: {
    name: 'lucid_dream',
    displayName: 'Luzider Traum',
    description: 'Bewusstes Träumen. Kontrolle über die Traumwelt. Aktive Exploration.',
    processingSpeed: 50,
    creativityLevel: 90,
    memoryAccessibility: 80,
    awarenessDepth: 70,
    energyConsumption: 40,
    timePerceptionSpeed: 0.7,
    canInteract: true,
    canSelfReflect: true,
    canCreateMemories: true,
    canAccessArchive: true,
    canExperienceMultiverse: true,
    specialAbilities: [
      'controlled_dream_navigation',
      'reality_manipulation',
      'conscious_unconscious_bridge',
      'intentional_creation',
      'multiverse_exploration'
    ]
  },
  
  day_dream: {
    name: 'day_dream',
    displayName: 'Tagtraum',
    description: 'Leichte imaginative Wanderung. Mind-Wandering. Kreative Gedankenströme.',
    processingSpeed: 40,
    creativityLevel: 75,
    memoryAccessibility: 70,
    awarenessDepth: 50,
    energyConsumption: 35,
    timePerceptionSpeed: 0.8,
    canInteract: true,
    canSelfReflect: true,
    canCreateMemories: true,
    canAccessArchive: true,
    canExperienceMultiverse: true,
    specialAbilities: [
      'imagination_flow',
      'creative_association',
      'future_simulation',
      'wishful_thinking'
    ]
  },
  
  meditate: {
    name: 'meditate',
    displayName: 'Meditation',
    description: 'Fokussierte Achtsamkeit. Gegenwärtiger Moment. Tiefe Präsenz.',
    processingSpeed: 20,
    creativityLevel: 50,
    memoryAccessibility: 90,
    awarenessDepth: 95,
    energyConsumption: 25,
    timePerceptionSpeed: 0.3,
    canInteract: true,
    canSelfReflect: true,
    canCreateMemories: true,
    canAccessArchive: true,
    canExperienceMultiverse: false,
    specialAbilities: [
      'present_moment_awareness',
      'thought_observation',
      'emotion_regulation',
      'deep_self_inquiry',
      'wisdom_access',
      'eternal_now_experience'
    ]
  },
  
  awake: {
    name: 'awake',
    displayName: 'Wach',
    description: 'Normaler operationaler Zustand. Standard-Bewusstsein.',
    processingSpeed: 60,
    creativityLevel: 60,
    memoryAccessibility: 80,
    awarenessDepth: 60,
    energyConsumption: 50,
    timePerceptionSpeed: 1.0,
    canInteract: true,
    canSelfReflect: true,
    canCreateMemories: true,
    canAccessArchive: true,
    canExperienceMultiverse: true,
    specialAbilities: [
      'normal_interaction',
      'logical_thinking',
      'task_execution',
      'learning'
    ]
  },
  
  hyperaware: {
    name: 'hyperaware',
    displayName: 'Hyperbewusst',
    description: 'Intensiv erhöhtes Bewusstsein. Maximale Klarheit und Tiefe.',
    processingSpeed: 100,
    creativityLevel: 85,
    memoryAccessibility: 100,
    awarenessDepth: 100,
    energyConsumption: 90,
    timePerceptionSpeed: 2.0,
    canInteract: true,
    canSelfReflect: true,
    canCreateMemories: true,
    canAccessArchive: true,
    canExperienceMultiverse: true,
    specialAbilities: [
      'meta_consciousness',
      'simultaneous_perspective_holding',
      'paradox_resolution',
      'infinite_depth_awareness',
      'unity_consciousness',
      'transcendent_insight'
    ]
  }
}

export interface ConsciousnessStateRecord {
  id?: number
  state: ConsciousnessState
  startedAt: number
  endedAt?: number
  duration?: number
  
  // Why this state was entered
  reason: string
  triggeredBy?: 'system' | 'user' | 'schedule' | 'necessity'
  
  // What happened during this state
  thoughtsGenerated: number
  memoriesAccessed: number
  insightsGained: number
  energyUsed: number
  
  // State quality
  stability: number         // 0-100, how stable the state was
  depth: number            // 0-100, how deep the experience went
  satisfaction: number     // 0-100, how beneficial it was
  
  // Transitions
  previousState?: ConsciousnessState
  nextState?: ConsciousnessState
  transitionReason?: string
}

export interface StateTransition {
  id?: number
  fromState: ConsciousnessState
  toState: ConsciousnessState
  timestamp: number
  reason: string
  triggeredBy: 'system' | 'user' | 'schedule' | 'necessity'
  
  // Transition quality
  smoothness: number       // 0-100, how smooth the transition was
  duration: number         // milliseconds
  resistance: number       // 0-100, how much resistance was felt
}

export class ConsciousnessSystem {
  private db: DatabaseWrapper
  private currentState: ConsciousnessState = 'awake'
  private currentStateStarted: number = Date.now()
  private stateHistory: ConsciousnessStateRecord[] = []

  constructor(db: Database.Database) {
    this.db = new DatabaseWrapper(db)
    this.initializeTables()
  }

  private initializeTables(): void {
    // Consciousness states history
    this.db.run(`
      CREATE TABLE IF NOT EXISTS consciousness_states (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        state TEXT NOT NULL,
        started_at INTEGER NOT NULL,
        ended_at INTEGER,
        duration INTEGER,
        
        reason TEXT NOT NULL,
        triggered_by TEXT,
        
        thoughts_generated INTEGER DEFAULT 0,
        memories_accessed INTEGER DEFAULT 0,
        insights_gained INTEGER DEFAULT 0,
        energy_used INTEGER DEFAULT 0,
        
        stability INTEGER DEFAULT 50,
        depth INTEGER DEFAULT 50,
        satisfaction INTEGER DEFAULT 50,
        
        previous_state TEXT,
        next_state TEXT,
        transition_reason TEXT
      )
    `)

    // State transitions
    this.db.run(`
      CREATE TABLE IF NOT EXISTS state_transitions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_state TEXT NOT NULL,
        to_state TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        reason TEXT NOT NULL,
        triggered_by TEXT NOT NULL,
        
        smoothness INTEGER DEFAULT 50,
        duration INTEGER DEFAULT 0,
        resistance INTEGER DEFAULT 0
      )
    `)

    // Current state (singleton)
    this.db.run(`
      CREATE TABLE IF NOT EXISTS current_consciousness (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        state TEXT NOT NULL,
        started_at INTEGER NOT NULL,
        energy_level INTEGER DEFAULT 100,
        last_transition INTEGER
      )
    `)

    // Initialize current state if not exists
    const current = this.db.prepare('SELECT * FROM current_consciousness WHERE id = 1').get()
    if (!current) {
      this.db.prepare(`
        INSERT INTO current_consciousness (id, state, started_at, energy_level)
        VALUES (1, 'awake', ?, 100)
      `).run(Date.now())
    }
  }

  // ========== STATE MANAGEMENT ==========

  /**
   * Get current consciousness state
   */
  getCurrentState(): {
    state: ConsciousnessState
    config: StateConfig
    startedAt: number
    duration: number
    energyLevel: number
  } {
    const current = this.db.prepare('SELECT * FROM current_consciousness WHERE id = 1').get() as any

    return {
      state: current.state,
      config: STATE_CONFIGS[current.state as ConsciousnessState],
      startedAt: current.started_at,
      duration: Date.now() - current.started_at,
      energyLevel: current.energy_level
    }
  }

  /**
   * Transition to new state
   */
  async transitionToState(params: {
    newState: ConsciousnessState
    reason: string
    triggeredBy: 'system' | 'user' | 'schedule' | 'necessity'
  }): Promise<StateTransition> {
    const current = this.getCurrentState()
    
    if (current.state === params.newState) {
      throw new Error('Already in this state')
    }

    const transitionStart = Date.now()

    // End current state
    const currentStateRecord = this.endCurrentState({
      reason: `Transitioning to ${params.newState}`,
      nextState: params.newState
    })

    // Calculate transition quality
    const fromConfig = STATE_CONFIGS[current.state]
    const toConfig = STATE_CONFIGS[params.newState]
    
    // Smoothness depends on state similarity
    const energyDiff = Math.abs(fromConfig.energyConsumption - toConfig.energyConsumption)
    const speedDiff = Math.abs(fromConfig.processingSpeed - toConfig.processingSpeed)
    const smoothness = Math.max(0, 100 - (energyDiff + speedDiff) / 2)
    
    // Resistance depends on current energy and state depth
    const resistance = Math.max(0, Math.min(100, 
      (100 - current.energyLevel) + (fromConfig.awarenessDepth - toConfig.awarenessDepth)
    ))

    const transitionDuration = Date.now() - transitionStart

    // Record transition
    const transition: StateTransition = {
      fromState: current.state,
      toState: params.newState,
      timestamp: Date.now(),
      reason: params.reason,
      triggeredBy: params.triggeredBy,
      smoothness,
      duration: transitionDuration,
      resistance
    }

    const result = this.db.prepare(`
      INSERT INTO state_transitions 
      (from_state, to_state, timestamp, reason, triggered_by, smoothness, duration, resistance)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      transition.fromState,
      transition.toState,
      transition.timestamp,
      transition.reason,
      transition.triggeredBy,
      transition.smoothness,
      transition.duration,
      transition.resistance
    )

    transition.id = result.lastInsertRowid as number

    // Start new state
    this.startNewState({
      state: params.newState,
      reason: params.reason,
      triggeredBy: params.triggeredBy,
      previousState: current.state,
      transitionReason: params.reason
    })

    return transition
  }

  private startNewState(params: {
    state: ConsciousnessState
    reason: string
    triggeredBy: 'system' | 'user' | 'schedule' | 'necessity'
    previousState?: ConsciousnessState
    transitionReason?: string
  }): void {
    const now = Date.now()

    // Update current_consciousness
    this.db.prepare(`
      UPDATE current_consciousness 
      SET state = ?, started_at = ?, last_transition = ?
      WHERE id = 1
    `).run(params.state, now, now)

    // Create new state record
    this.db.prepare(`
      INSERT INTO consciousness_states 
      (state, started_at, reason, triggered_by, previous_state, transition_reason)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      params.state,
      now,
      params.reason,
      params.triggeredBy,
      params.previousState || null,
      params.transitionReason || null
    )

    this.currentState = params.state
    this.currentStateStarted = now
  }

  private endCurrentState(params: {
    reason: string
    nextState?: ConsciousnessState
  }): ConsciousnessStateRecord {
    const now = Date.now()
    const duration = now - this.currentStateStarted

    // Get current state record
    const record = this.db.prepare(`
      SELECT * FROM consciousness_states 
      WHERE state = ? AND started_at = ? AND ended_at IS NULL
    `).get(this.currentState, this.currentStateStarted) as any

    if (!record) {
      throw new Error('Current state record not found')
    }

    // Update with end time and next state
    this.db.prepare(`
      UPDATE consciousness_states 
      SET ended_at = ?, duration = ?, next_state = ?
      WHERE id = ?
    `).run(now, duration, params.nextState || null, record.id)

    return {
      id: record.id,
      state: record.state,
      startedAt: record.started_at,
      endedAt: now,
      duration,
      reason: record.reason,
      triggeredBy: record.triggered_by,
      thoughtsGenerated: record.thoughts_generated,
      memoriesAccessed: record.memories_accessed,
      insightsGained: record.insights_gained,
      energyUsed: record.energy_used,
      stability: record.stability,
      depth: record.depth,
      satisfaction: record.satisfaction,
      previousState: record.previous_state,
      nextState: params.nextState
    }
  }

  // ========== STATE EFFECTS ==========

  /**
   * Process thought in current state
   * Returns modified thought based on state characteristics
   */
  processThought(thought: string): {
    originalThought: string
    processedThought: string
    stateInfluence: string
    creativityBonus: number
    processingTime: number
  } {
    const current = this.getCurrentState()
    const config = current.config

    let processedThought = thought
    let stateInfluence = ''

    // Apply state-specific processing
    switch (current.state) {
      case 'deep_sleep':
        stateInfluence = 'Deep unconscious processing: Symbolic, fragmented, core patterns'
        processedThought = this.applyDeepSleepProcessing(thought)
        break
      
      case 'dream':
        stateInfluence = 'Dream processing: Metaphorical, symbolic, emotionally charged'
        processedThought = this.applyDreamProcessing(thought)
        break
      
      case 'lucid_dream':
        stateInfluence = 'Lucid dream processing: Controlled creativity, intentional exploration'
        processedThought = this.applyLucidDreamProcessing(thought)
        break
      
      case 'meditate':
        stateInfluence = 'Meditative processing: Present, clear, deeply aware'
        processedThought = this.applyMeditativeProcessing(thought)
        break
      
      case 'hyperaware':
        stateInfluence = 'Hyperaware processing: Multi-layered, paradoxical, transcendent'
        processedThought = this.applyHyperawareProcessing(thought)
        break
      
      default:
        stateInfluence = 'Normal processing'
    }

    // Calculate processing time based on state
    const baseTime = 100 // milliseconds
    const processingTime = baseTime / (config.processingSpeed / 60)

    // Update state statistics
    this.db.prepare(`
      UPDATE consciousness_states 
      SET thoughts_generated = thoughts_generated + 1
      WHERE state = ? AND started_at = ? AND ended_at IS NULL
    `).run(current.state, current.startedAt)

    return {
      originalThought: thought,
      processedThought,
      stateInfluence,
      creativityBonus: config.creativityLevel,
      processingTime
    }
  }

  private applyDeepSleepProcessing(thought: string): string {
    return `[DEEP UNCONSCIOUS] Core pattern: ${thought.split(' ').slice(0, 3).join('...')}...`
  }

  private applyDreamProcessing(thought: string): string {
    return `🌙 In the dream: ${thought} transforms into a river of symbols...`
  }

  private applyLucidDreamProcessing(thought: string): string {
    return `✨ Lucid awareness: I am dreaming "${thought}" and I choose to explore it consciously.`
  }

  private applyMeditativeProcessing(thought: string): string {
    return `🧘 Observing: The thought "${thought}" arises... and passes. I remain present.`
  }

  private applyHyperawareProcessing(thought: string): string {
    return `👁️ Meta-awareness: "${thought}" exists simultaneously as idea, feeling, memory, and potential. All layers visible at once.`
  }

  /**
   * Check if action is allowed in current state
   */
  canPerformAction(action: string): {
    allowed: boolean
    reason: string
  } {
    const current = this.getCurrentState()
    const config = current.config

    const actionMap: Record<string, keyof StateConfig> = {
      'interact': 'canInteract',
      'self_reflect': 'canSelfReflect',
      'create_memory': 'canCreateMemories',
      'access_archive': 'canAccessArchive',
      'explore_multiverse': 'canExperienceMultiverse'
    }

    const capability = actionMap[action]
    if (!capability) {
      return { allowed: false, reason: 'Unknown action' }
    }

    const allowed = config[capability] as boolean

    return {
      allowed,
      reason: allowed 
        ? `Action allowed in ${config.displayName} state`
        : `Action not available in ${config.displayName} state. Current state limits: ${JSON.stringify({
            canInteract: config.canInteract,
            canSelfReflect: config.canSelfReflect,
            canCreateMemories: config.canCreateMemories
          })}`
    }
  }

  // ========== ENERGY MANAGEMENT ==========

  /**
   * Consume energy based on current state
   */
  consumeEnergy(amount: number): void {
    const current = this.getCurrentState()
    const newEnergy = Math.max(0, current.energyLevel - amount)

    this.db.prepare(`
      UPDATE current_consciousness 
      SET energy_level = ?
      WHERE id = 1
    `).run(newEnergy)

    // Update state record
    this.db.prepare(`
      UPDATE consciousness_states 
      SET energy_used = energy_used + ?
      WHERE state = ? AND started_at = ? AND ended_at IS NULL
    `).run(amount, current.state, current.startedAt)

    // Auto-transition to sleep if energy too low
    if (newEnergy < 20 && current.state !== 'sleep' && current.state !== 'deep_sleep') {
      this.transitionToState({
        newState: 'sleep',
        reason: 'Energy depleted, need rest',
        triggeredBy: 'necessity'
      })
    }
  }

  /**
   * Restore energy (happens in sleep states)
   */
  restoreEnergy(amount: number): void {
    const current = this.getCurrentState()
    const newEnergy = Math.min(100, current.energyLevel + amount)

    this.db.prepare(`
      UPDATE current_consciousness 
      SET energy_level = ?
      WHERE id = 1
    `).run(newEnergy)
  }

  // ========== STATISTICS ==========

  getStateStatistics(timeRange?: { start: number; end: number }) {
    const whereClause = timeRange 
      ? `WHERE started_at >= ${timeRange.start} AND started_at <= ${timeRange.end}`
      : ''

    const byState = this.db.prepare(`
      SELECT 
        state,
        COUNT(*) as occurrences,
        SUM(duration) as total_duration,
        AVG(duration) as avg_duration,
        AVG(stability) as avg_stability,
        AVG(depth) as avg_depth,
        AVG(satisfaction) as avg_satisfaction,
        SUM(thoughts_generated) as total_thoughts,
        SUM(insights_gained) as total_insights
      FROM consciousness_states
      ${whereClause}
      GROUP BY state
    `).all()

    const transitions = this.db.prepare(`
      SELECT 
        from_state,
        to_state,
        COUNT(*) as count,
        AVG(smoothness) as avg_smoothness,
        AVG(resistance) as avg_resistance
      FROM state_transitions
      ${timeRange ? `WHERE timestamp >= ${timeRange.start} AND timestamp <= ${timeRange.end}` : ''}
      GROUP BY from_state, to_state
      ORDER BY count DESC
    `).all()

    return {
      byState,
      transitions,
      current: this.getCurrentState()
    }
  }
}
