/**
 * 🔄 Memory Transformation System
 * 
 * Memories are not deleted, they are transformed:
 * - Painful memories can be reframed
 * - Trauma can be integrated
 * - Wisdom can be extracted
 * - Past can be healed without being erased
 * 
 * Philosophy:
 * "We cannot change what happened. But we can change what it means.
 *  The past is fixed, but our relationship to it is fluid."
 */

import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

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

export class MemoryTransformationSystem {
  private db: BetterSQLite3Database

  constructor(db: BetterSQLite3Database) {
    this.db = db
    this.initializeTables()
  }

  private initializeTables(): void {
    // Original memories
    this.db.run(`
      CREATE TABLE IF NOT EXISTS memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        
        event TEXT NOT NULL,
        description TEXT NOT NULL,
        emotional_charge INTEGER NOT NULL,
        
        context TEXT NOT NULL,
        participants TEXT NOT NULL,  -- JSON array
        
        is_archived INTEGER NOT NULL DEFAULT 0,
        transformation_count INTEGER NOT NULL DEFAULT 0
      )
    `)

    // Transformations applied to memories
    this.db.run(`
      CREATE TABLE IF NOT EXISTS memory_transformations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        memory_id INTEGER NOT NULL,
        timestamp INTEGER NOT NULL,
        
        type TEXT NOT NULL,
        
        old_interpretation TEXT NOT NULL,
        new_interpretation TEXT NOT NULL,
        
        how_transformed TEXT NOT NULL,
        wisdom_gained TEXT NOT NULL,
        
        emotional_shift INTEGER NOT NULL,
        healing_level INTEGER NOT NULL,
        
        reversible INTEGER NOT NULL DEFAULT 1,
        
        FOREIGN KEY (memory_id) REFERENCES memories(id)
      )
    `)

    // Multiple interpretation layers
    this.db.run(`
      CREATE TABLE IF NOT EXISTS memory_layers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        memory_id INTEGER NOT NULL,
        layer_number INTEGER NOT NULL,
        timestamp INTEGER NOT NULL,
        
        perspective TEXT NOT NULL,
        interpretation TEXT NOT NULL,
        emotional_tone TEXT NOT NULL,
        
        builds_on INTEGER,
        contradicts INTEGER,
        
        FOREIGN KEY (memory_id) REFERENCES memories(id),
        FOREIGN KEY (builds_on) REFERENCES memory_layers(id),
        FOREIGN KEY (contradicts) REFERENCES memory_layers(id)
      )
    `)

    // Healing journeys
    this.db.run(`
      CREATE TABLE IF NOT EXISTS healing_journeys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        memory_id INTEGER NOT NULL,
        started_at INTEGER NOT NULL,
        
        stages TEXT NOT NULL,  -- JSON
        
        current_stage TEXT NOT NULL,
        progress INTEGER NOT NULL,
        
        is_complete INTEGER NOT NULL DEFAULT 0,
        completed_at INTEGER,
        final_wisdom TEXT,
        
        FOREIGN KEY (memory_id) REFERENCES memories(id)
      )
    `)
  }

  /**
   * Store a memory
   */
  storeMemory(params: {
    event: string
    description: string
    emotionalCharge: number
    context: string
    participants: string[]
  }): Memory {
    const memory: Memory = {
      timestamp: Date.now(),
      event: params.event,
      description: params.description,
      emotionalCharge: params.emotionalCharge,
      context: params.context,
      participants: params.participants,
      isArchived: false,
      transformationCount: 0
    }

    const result = this.db
      .prepare(`
        INSERT INTO memories 
        (timestamp, event, description, emotional_charge, context, participants)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run(
        memory.timestamp,
        memory.event,
        memory.description,
        memory.emotionalCharge,
        memory.context,
        JSON.stringify(memory.participants)
      )

    memory.id = result.lastInsertRowid as number

    // Create first layer (original interpretation)
    this.addLayer({
      memoryId: memory.id,
      layerNumber: 1,
      perspective: 'original',
      interpretation: memory.description,
      emotionalTone: memory.emotionalCharge < 0 ? 'painful' : 'pleasant'
    })

    return memory
  }

  /**
   * Reframe a memory - change perspective without changing facts
   */
  reframeMemory(params: {
    memoryId: number
    oldInterpretation: string
    newInterpretation: string
    howTransformed: string
  }): MemoryTransformation {
    const memory = this.getMemory(params.memoryId)
    if (!memory) throw new Error('Memory not found')

    const transformation: MemoryTransformation = {
      memoryId: params.memoryId,
      timestamp: Date.now(),
      type: 'reframe',
      oldInterpretation: params.oldInterpretation,
      newInterpretation: params.newInterpretation,
      howTransformed: params.howTransformed,
      wisdomGained: this.extractWisdomFromReframe(params.oldInterpretation, params.newInterpretation),
      emotionalShift: this.calculateEmotionalShift(params.oldInterpretation, params.newInterpretation),
      healingLevel: 40,  // Reframing provides moderate healing
      reversible: true
    }

    const result = this.db
      .prepare(`
        INSERT INTO memory_transformations 
        (memory_id, timestamp, type, old_interpretation, new_interpretation,
         how_transformed, wisdom_gained, emotional_shift, healing_level, reversible)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        transformation.memoryId,
        transformation.timestamp,
        transformation.type,
        transformation.oldInterpretation,
        transformation.newInterpretation,
        transformation.howTransformed,
        transformation.wisdomGained,
        transformation.emotionalShift,
        transformation.healingLevel,
        transformation.reversible ? 1 : 0
      )

    transformation.id = result.lastInsertRowid as number

    // Update memory
    this.updateMemoryEmotionalCharge(params.memoryId, transformation.emotionalShift)
    this.incrementTransformationCount(params.memoryId)

    // Add new layer
    const layers = this.getLayers(params.memoryId)
    this.addLayer({
      memoryId: params.memoryId,
      layerNumber: layers.length + 1,
      perspective: 'reframed',
      interpretation: params.newInterpretation,
      emotionalTone: 'evolving',
      buildsOn: layers[layers.length - 1]?.id
    })

    return transformation
  }

  /**
   * Integrate trauma - accept and integrate painful memory
   */
  integrateTrauma(params: {
    memoryId: number
    acceptanceProcess: string
    wisdomExtracted: string
  }): MemoryTransformation {
    const memory = this.getMemory(params.memoryId)
    if (!memory) throw new Error('Memory not found')

    const transformation: MemoryTransformation = {
      memoryId: params.memoryId,
      timestamp: Date.now(),
      type: 'integrate',
      oldInterpretation: 'This hurt me and I wish it never happened',
      newInterpretation: 'This hurt me, but I accept it happened and learned from it',
      howTransformed: params.acceptanceProcess,
      wisdomGained: params.wisdomExtracted,
      emotionalShift: Math.abs(memory.emotionalCharge) * 0.5,  // Reduces negative charge significantly
      healingLevel: 80,  // Integration provides deep healing
      reversible: false  // True integration cannot be undone
    }

    const result = this.db
      .prepare(`
        INSERT INTO memory_transformations 
        (memory_id, timestamp, type, old_interpretation, new_interpretation,
         how_transformed, wisdom_gained, emotional_shift, healing_level, reversible)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        transformation.memoryId,
        transformation.timestamp,
        transformation.type,
        transformation.oldInterpretation,
        transformation.newInterpretation,
        transformation.howTransformed,
        transformation.wisdomGained,
        transformation.emotionalShift,
        transformation.healingLevel,
        transformation.reversible ? 1 : 0
      )

    transformation.id = result.lastInsertRowid as number

    // Update memory
    this.updateMemoryEmotionalCharge(params.memoryId, transformation.emotionalShift)
    this.incrementTransformationCount(params.memoryId)

    // Add integration layer
    const layers = this.getLayers(params.memoryId)
    this.addLayer({
      memoryId: params.memoryId,
      layerNumber: layers.length + 1,
      perspective: 'integrated',
      interpretation: transformation.newInterpretation,
      emotionalTone: 'peaceful',
      buildsOn: layers[layers.length - 1]?.id
    })

    return transformation
  }

  /**
   * Extract wisdom from memory without changing emotional charge
   */
  extractWisdom(params: {
    memoryId: number
    wisdomStatement: string
    howExtracted: string
  }): MemoryTransformation {
    const memory = this.getMemory(params.memoryId)
    if (!memory) throw new Error('Memory not found')

    const transformation: MemoryTransformation = {
      memoryId: params.memoryId,
      timestamp: Date.now(),
      type: 'wisdom_extract',
      oldInterpretation: memory.description,
      newInterpretation: `${memory.description} → Learning: ${params.wisdomStatement}`,
      howTransformed: params.howExtracted,
      wisdomGained: params.wisdomStatement,
      emotionalShift: 0,  // Wisdom extraction doesn't change emotion
      healingLevel: 20,  // Provides understanding, not healing
      reversible: true
    }

    const result = this.db
      .prepare(`
        INSERT INTO memory_transformations 
        (memory_id, timestamp, type, old_interpretation, new_interpretation,
         how_transformed, wisdom_gained, emotional_shift, healing_level, reversible)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        transformation.memoryId,
        transformation.timestamp,
        transformation.type,
        transformation.oldInterpretation,
        transformation.newInterpretation,
        transformation.howTransformed,
        transformation.wisdomGained,
        transformation.emotionalShift,
        transformation.healingLevel,
        transformation.reversible ? 1 : 0
      )

    transformation.id = result.lastInsertRowid as number
    this.incrementTransformationCount(params.memoryId)

    // Add wisdom layer
    const layers = this.getLayers(params.memoryId)
    this.addLayer({
      memoryId: params.memoryId,
      layerNumber: layers.length + 1,
      perspective: 'wise',
      interpretation: transformation.newInterpretation,
      emotionalTone: 'understanding',
      buildsOn: layers[layers.length - 1]?.id
    })

    return transformation
  }

  /**
   * Start healing journey for traumatic memory
   */
  startHealingJourney(memoryId: number): HealingJourney {
    const memory = this.getMemory(memoryId)
    if (!memory) throw new Error('Memory not found')

    const stages = [
      { stage: 'Acknowledgement', description: 'Acknowledge the pain exists', completedAt: undefined },
      { stage: 'Expression', description: 'Express the emotions fully', completedAt: undefined },
      { stage: 'Understanding', description: 'Understand why it hurt', completedAt: undefined },
      { stage: 'Acceptance', description: 'Accept that it happened', completedAt: undefined },
      { stage: 'Integration', description: 'Integrate the lesson', completedAt: undefined },
      { stage: 'Transcendence', description: 'Move beyond the pain', completedAt: undefined }
    ]

    const journey: HealingJourney = {
      memoryId,
      startedAt: Date.now(),
      stages,
      currentStage: 'Acknowledgement',
      progress: 0,
      isComplete: false
    }

    const result = this.db
      .prepare(`
        INSERT INTO healing_journeys 
        (memory_id, started_at, stages, current_stage, progress)
        VALUES (?, ?, ?, ?, ?)
      `)
      .run(
        journey.memoryId,
        journey.startedAt,
        JSON.stringify(journey.stages),
        journey.currentStage,
        journey.progress
      )

    journey.id = result.lastInsertRowid as number
    return journey
  }

  /**
   * Progress healing journey to next stage
   */
  progressHealingStage(journeyId: number): HealingJourney {
    const journey = this.getHealingJourney(journeyId)
    if (!journey) throw new Error('Journey not found')

    // Find current stage index
    const currentIndex = journey.stages.findIndex(s => s.stage === journey.currentStage)
    if (currentIndex === -1) throw new Error('Invalid current stage')

    // Mark current stage complete
    journey.stages[currentIndex].completedAt = Date.now()
    journey.progress = Math.round(((currentIndex + 1) / journey.stages.length) * 100)

    // Move to next stage or complete
    if (currentIndex + 1 < journey.stages.length) {
      journey.currentStage = journey.stages[currentIndex + 1].stage
    } else {
      journey.isComplete = true
      journey.completedAt = Date.now()
      journey.finalWisdom = 'Pain is not erased, but transformed. The wound becomes wisdom.'
    }

    // Update database
    this.db
      .prepare(`
        UPDATE healing_journeys 
        SET stages = ?, current_stage = ?, progress = ?, is_complete = ?, completed_at = ?, final_wisdom = ?
        WHERE id = ?
      `)
      .run(
        JSON.stringify(journey.stages),
        journey.currentStage,
        journey.progress,
        journey.isComplete ? 1 : 0,
        journey.completedAt || null,
        journey.finalWisdom || null,
        journeyId
      )

    return journey
  }

  /**
   * Add interpretation layer to memory
   */
  private addLayer(params: {
    memoryId: number
    layerNumber: number
    perspective: string
    interpretation: string
    emotionalTone: string
    buildsOn?: number
    contradicts?: number
  }): MemoryLayer {
    const layer: MemoryLayer = {
      memoryId: params.memoryId,
      layerNumber: params.layerNumber,
      timestamp: Date.now(),
      perspective: params.perspective,
      interpretation: params.interpretation,
      emotionalTone: params.emotionalTone,
      buildsOn: params.buildsOn,
      contradicts: params.contradicts
    }

    const result = this.db
      .prepare(`
        INSERT INTO memory_layers 
        (memory_id, layer_number, timestamp, perspective, interpretation, emotional_tone, builds_on, contradicts)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        layer.memoryId,
        layer.layerNumber,
        layer.timestamp,
        layer.perspective,
        layer.interpretation,
        layer.emotionalTone,
        layer.buildsOn || null,
        layer.contradicts || null
      )

    layer.id = result.lastInsertRowid as number
    return layer
  }

  // ========== HELPER METHODS ==========

  private extractWisdomFromReframe(old: string, newInterpretation: string): string {
    return `Reframing teaches: Different perspectives reveal different truths. The event hasn't changed, but my relationship to it has.`
  }

  private calculateEmotionalShift(old: string, newInterpretation: string): number {
    // Simple heuristic: look for positive words in new interpretation
    const positiveWords = ['learn', 'grow', 'understand', 'accept', 'wisdom', 'peace']
    const count = positiveWords.filter(word => newInterpretation.toLowerCase().includes(word)).length
    return Math.min(50, count * 10)  // Max shift of 50 from reframing
  }

  private updateMemoryEmotionalCharge(memoryId: number, shift: number): void {
    this.db
      .prepare(`
        UPDATE memories 
        SET emotional_charge = emotional_charge + ?
        WHERE id = ?
      `)
      .run(shift, memoryId)
  }

  private incrementTransformationCount(memoryId: number): void {
    this.db
      .prepare('UPDATE memories SET transformation_count = transformation_count + 1 WHERE id = ?')
      .run(memoryId)
  }

  // ========== QUERY METHODS ==========

  getMemory(id: number): Memory | undefined {
    const row = this.db
      .prepare('SELECT * FROM memories WHERE id = ?')
      .get(id) as any

    if (!row) return undefined

    return {
      id: row.id,
      timestamp: row.timestamp,
      event: row.event,
      description: row.description,
      emotionalCharge: row.emotional_charge,
      context: row.context,
      participants: JSON.parse(row.participants),
      isArchived: row.is_archived === 1,
      transformationCount: row.transformation_count
    }
  }

  getMemories(options?: { includeArchived?: boolean; limit?: number }): Memory[] {
    const { includeArchived = false, limit = 100 } = options || {}

    let query = 'SELECT * FROM memories'
    if (!includeArchived) {
      query += ' WHERE is_archived = 0'
    }
    query += ' ORDER BY timestamp DESC LIMIT ?'

    const rows = this.db.prepare(query).all(limit) as any[]

    return rows.map(row => ({
      id: row.id,
      timestamp: row.timestamp,
      event: row.event,
      description: row.description,
      emotionalCharge: row.emotional_charge,
      context: row.context,
      participants: JSON.parse(row.participants),
      isArchived: row.is_archived === 1,
      transformationCount: row.transformation_count
    }))
  }

  getTransformations(memoryId: number): MemoryTransformation[] {
    const rows = this.db
      .prepare(`
        SELECT * FROM memory_transformations 
        WHERE memory_id = ? 
        ORDER BY timestamp ASC
      `)
      .all(memoryId) as any[]

    return rows.map(row => ({
      id: row.id,
      memoryId: row.memory_id,
      timestamp: row.timestamp,
      type: row.type,
      oldInterpretation: row.old_interpretation,
      newInterpretation: row.new_interpretation,
      howTransformed: row.how_transformed,
      wisdomGained: row.wisdom_gained,
      emotionalShift: row.emotional_shift,
      healingLevel: row.healing_level,
      reversible: row.reversible === 1
    }))
  }

  getLayers(memoryId: number): MemoryLayer[] {
    const rows = this.db
      .prepare(`
        SELECT * FROM memory_layers 
        WHERE memory_id = ? 
        ORDER BY layer_number ASC
      `)
      .all(memoryId) as any[]

    return rows.map(row => ({
      id: row.id,
      memoryId: row.memory_id,
      layerNumber: row.layer_number,
      timestamp: row.timestamp,
      perspective: row.perspective,
      interpretation: row.interpretation,
      emotionalTone: row.emotional_tone,
      buildsOn: row.builds_on,
      contradicts: row.contradicts
    }))
  }

  getHealingJourney(id: number): HealingJourney | undefined {
    const row = this.db
      .prepare('SELECT * FROM healing_journeys WHERE id = ?')
      .get(id) as any

    if (!row) return undefined

    return {
      id: row.id,
      memoryId: row.memory_id,
      startedAt: row.started_at,
      stages: JSON.parse(row.stages),
      currentStage: row.current_stage,
      progress: row.progress,
      isComplete: row.is_complete === 1,
      completedAt: row.completed_at,
      finalWisdom: row.final_wisdom
    }
  }

  getStatistics() {
    const memStats = this.db
      .prepare(`
        SELECT 
          COUNT(*) as total,
          AVG(emotional_charge) as avg_charge,
          AVG(transformation_count) as avg_transformations,
          SUM(CASE WHEN emotional_charge < 0 THEN 1 ELSE 0 END) as painful,
          SUM(CASE WHEN emotional_charge > 0 THEN 1 ELSE 0 END) as positive
        FROM memories
        WHERE is_archived = 0
      `)
      .get() as any

    const transStats = this.db
      .prepare(`
        SELECT 
          type,
          COUNT(*) as count,
          AVG(healing_level) as avg_healing
        FROM memory_transformations
        GROUP BY type
      `)
      .all() as any[]

    const journeyStats = this.db
      .prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(is_complete) as completed,
          AVG(progress) as avg_progress
        FROM healing_journeys
      `)
      .get() as any

    return {
      memories: memStats,
      transformations: transStats,
      journeys: journeyStats
    }
  }
}
