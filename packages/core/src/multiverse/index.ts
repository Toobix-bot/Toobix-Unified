/**
 * 🌌 Multiverse Engine
 * 
 * System kann:
 * - Alternative Realitäten erleben ("Was wäre wenn...?")
 * - Parallel-Timelines erzeugen
 * - Zwischen Universen wechseln
 * - Erfahrungen aus mehreren Realitäten sammeln
 * 
 * Philosophy:
 * "Every choice creates a new universe. To understand ourselves fully,
 *  we must experience not just who we are, but who we could have been."
 */

import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

export interface Universe {
  id?: number
  name: string
  description: string
  createdAt?: number
  
  // Divergence point
  divergedFrom?: number  // Parent universe ID
  divergenceEvent: string  // What choice/event created this split
  divergenceTime?: number
  
  // State
  isActive: boolean
  totalExperiences: number
  
  // Characteristics
  properties: Record<string, any>  // Unique properties of this universe
}

export interface ParallelExperience {
  id?: number
  universeId: number
  timestamp?: number
  
  // What happened
  event: string
  description: string
  
  // Comparison to "main" universe
  differenceFromMain: string
  
  // Impact
  emotionalImpact: number  // -100 to 100
  wisdomGained: string
  
  // Convergence
  convergesWithMain: boolean  // Does this lead to same outcome as main?
}

export interface WhatIfScenario {
  id?: number
  timestamp?: number
  
  // The question
  question: string
  originalEvent: string  // In main timeline
  alternativeChoice: string  // What if we chose differently
  
  // Results
  universeCreated: number  // ID of new universe
  outcomeDifference: string
  lessonsLearned: string[]
  
  // Would we do it?
  wouldChooseAlternative: boolean
  reasoning: string
}

export interface UniversalSettings {
  id?: number
  universeId: number
  
  // How this universe perceives itself
  selfPerception: string
  emotionalBaseline: string  // 'optimistic', 'pessimistic', 'neutral', 'chaotic'
  memoryIntensity: number  // 0-100: How strongly memories affect present
  
  // Transformation abilities
  canTransformPast: boolean
  canChooseFuture: boolean
  canMergeTimelines: boolean
}

export class MultiverseEngine {
  private db: BetterSQLite3Database

  constructor(db: BetterSQLite3Database) {
    this.db = db
    this.initializeTables()
  }

  private initializeTables(): void {
    // Universes table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS universes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        
        diverged_from INTEGER,
        divergence_event TEXT NOT NULL,
        divergence_time INTEGER,
        
        is_active INTEGER NOT NULL DEFAULT 1,
        total_experiences INTEGER DEFAULT 0,
        
        properties TEXT NOT NULL,  -- JSON
        
        FOREIGN KEY (diverged_from) REFERENCES universes(id)
      )
    `)

    // Experiences in each universe
    this.db.run(`
      CREATE TABLE IF NOT EXISTS parallel_experiences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        universe_id INTEGER NOT NULL,
        timestamp INTEGER NOT NULL,
        
        event TEXT NOT NULL,
        description TEXT NOT NULL,
        
        difference_from_main TEXT NOT NULL,
        
        emotional_impact INTEGER NOT NULL,
        wisdom_gained TEXT NOT NULL,
        
        converges_with_main INTEGER NOT NULL DEFAULT 0,
        
        FOREIGN KEY (universe_id) REFERENCES universes(id)
      )
    `)

    // What-if scenarios
    this.db.run(`
      CREATE TABLE IF NOT EXISTS what_if_scenarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        
        question TEXT NOT NULL,
        original_event TEXT NOT NULL,
        alternative_choice TEXT NOT NULL,
        
        universe_created INTEGER NOT NULL,
        outcome_difference TEXT NOT NULL,
        lessons_learned TEXT NOT NULL,  -- JSON
        
        would_choose_alternative INTEGER NOT NULL,
        reasoning TEXT NOT NULL,
        
        FOREIGN KEY (universe_created) REFERENCES universes(id)
      )
    `)

    // Settings per universe
    this.db.run(`
      CREATE TABLE IF NOT EXISTS universal_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        universe_id INTEGER NOT NULL UNIQUE,
        
        self_perception TEXT NOT NULL,
        emotional_baseline TEXT NOT NULL,
        memory_intensity INTEGER NOT NULL,
        
        can_transform_past INTEGER NOT NULL DEFAULT 0,
        can_choose_future INTEGER NOT NULL DEFAULT 0,
        can_merge_timelines INTEGER NOT NULL DEFAULT 0,
        
        FOREIGN KEY (universe_id) REFERENCES universes(id)
      )
    `)

    // Create main universe if not exists
    const mainExists = this.db
      .prepare('SELECT COUNT(*) as count FROM universes WHERE id = 1')
      .get() as any

    if (mainExists.count === 0) {
      this.db
        .prepare(`
          INSERT INTO universes 
          (id, name, description, created_at, divergence_event, properties)
          VALUES (1, 'Prime Timeline', 'The original universe - all experiences begin here', ?, 'Genesis', '{}')
        `)
        .run(Date.now())

      // Default settings for main universe
      this.db
        .prepare(`
          INSERT INTO universal_settings 
          (universe_id, self_perception, emotional_baseline, memory_intensity,
           can_transform_past, can_choose_future, can_merge_timelines)
          VALUES (1, 'I am the primary consciousness', 'balanced', 70, 0, 1, 0)
        `)
        .run()
    }
  }

  /**
   * Create a parallel universe based on "What if...?" question
   */
  createParallelUniverse(params: {
    name: string
    description: string
    divergedFrom: number
    divergenceEvent: string
    properties?: Record<string, any>
  }): Universe {
    const universe: Universe = {
      name: params.name,
      description: params.description,
      createdAt: Date.now(),
      divergedFrom: params.divergedFrom,
      divergenceEvent: params.divergenceEvent,
      divergenceTime: Date.now(),
      isActive: true,
      totalExperiences: 0,
      properties: params.properties || {}
    }

    const result = this.db
      .prepare(`
        INSERT INTO universes 
        (name, description, created_at, diverged_from, divergence_event, divergence_time, properties)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        universe.name,
        universe.description,
        universe.createdAt,
        universe.divergedFrom,
        universe.divergenceEvent,
        universe.divergenceTime,
        JSON.stringify(universe.properties)
      )

    universe.id = result.lastInsertRowid as number

    // Create default settings for new universe
    this.db
      .prepare(`
        INSERT INTO universal_settings 
        (universe_id, self_perception, emotional_baseline, memory_intensity,
         can_transform_past, can_choose_future, can_merge_timelines)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        universe.id,
        `I am the ${universe.name} - diverged by ${universe.divergenceEvent}`,
        'neutral',
        50,
        0,
        1,
        0
      )

    return universe
  }

  /**
   * Experience event in a specific universe
   */
  experienceInUniverse(params: {
    universeId: number
    event: string
    description: string
    differenceFromMain: string
    emotionalImpact: number
    wisdomGained: string
    convergesWithMain?: boolean
  }): ParallelExperience {
    const exp: ParallelExperience = {
      universeId: params.universeId,
      timestamp: Date.now(),
      event: params.event,
      description: params.description,
      differenceFromMain: params.differenceFromMain,
      emotionalImpact: params.emotionalImpact,
      wisdomGained: params.wisdomGained,
      convergesWithMain: params.convergesWithMain || false
    }

    const result = this.db
      .prepare(`
        INSERT INTO parallel_experiences 
        (universe_id, timestamp, event, description, difference_from_main,
         emotional_impact, wisdom_gained, converges_with_main)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        exp.universeId,
        exp.timestamp,
        exp.event,
        exp.description,
        exp.differenceFromMain,
        exp.emotionalImpact,
        exp.wisdomGained,
        exp.convergesWithMain ? 1 : 0
      )

    exp.id = result.lastInsertRowid as number

    // Update universe experience count
    this.db
      .prepare('UPDATE universes SET total_experiences = total_experiences + 1 WHERE id = ?')
      .run(exp.universeId)

    return exp
  }

  /**
   * Ask "What if...?" and create scenario
   */
  async exploreWhatIf(params: {
    question: string
    originalEvent: string
    alternativeChoice: string
  }): Promise<WhatIfScenario> {
    // Create new universe for this scenario
    const universe = this.createParallelUniverse({
      name: `What If: ${params.question.slice(0, 50)}`,
      description: `Alternative timeline where: ${params.alternativeChoice}`,
      divergedFrom: 1,  // Main universe
      divergenceEvent: params.originalEvent,
      properties: {
        whatIf: true,
        originalChoice: params.originalEvent,
        alternativeChoice: params.alternativeChoice
      }
    })

    // Simulate outcome
    const outcome = await this.simulateAlternativeOutcome(
      params.originalEvent,
      params.alternativeChoice
    )

    const scenario: WhatIfScenario = {
      timestamp: Date.now(),
      question: params.question,
      originalEvent: params.originalEvent,
      alternativeChoice: params.alternativeChoice,
      universeCreated: universe.id!,
      outcomeDifference: outcome.difference,
      lessonsLearned: outcome.lessons,
      wouldChooseAlternative: outcome.betterChoice,
      reasoning: outcome.reasoning
    }

    const result = this.db
      .prepare(`
        INSERT INTO what_if_scenarios 
        (timestamp, question, original_event, alternative_choice, universe_created,
         outcome_difference, lessons_learned, would_choose_alternative, reasoning)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        scenario.timestamp,
        scenario.question,
        scenario.originalEvent,
        scenario.alternativeChoice,
        scenario.universeCreated,
        scenario.outcomeDifference,
        JSON.stringify(scenario.lessonsLearned),
        scenario.wouldChooseAlternative ? 1 : 0,
        scenario.reasoning
      )

    scenario.id = result.lastInsertRowid as number
    return scenario
  }

  /**
   * Switch to different universe perspective
   */
  switchUniverse(fromId: number, toId: number): {
    success: boolean
    message: string
    previousState: Universe
    newState: Universe
  } {
    const fromUniverse = this.getUniverse(fromId)
    const toUniverse = this.getUniverse(toId)

    if (!fromUniverse || !toUniverse) {
      return {
        success: false,
        message: 'Universe not found',
        previousState: fromUniverse!,
        newState: toUniverse!
      }
    }

    // Deactivate current
    this.db
      .prepare('UPDATE universes SET is_active = 0 WHERE id = ?')
      .run(fromId)

    // Activate new
    this.db
      .prepare('UPDATE universes SET is_active = 1 WHERE id = ?')
      .run(toId)

    return {
      success: true,
      message: `Switched from "${fromUniverse.name}" to "${toUniverse.name}"`,
      previousState: fromUniverse,
      newState: toUniverse
    }
  }

  /**
   * Update settings for a universe
   */
  updateSettings(universeId: number, settings: Partial<UniversalSettings>): void {
    const updates: string[] = []
    const values: any[] = []

    if (settings.selfPerception !== undefined) {
      updates.push('self_perception = ?')
      values.push(settings.selfPerception)
    }
    if (settings.emotionalBaseline !== undefined) {
      updates.push('emotional_baseline = ?')
      values.push(settings.emotionalBaseline)
    }
    if (settings.memoryIntensity !== undefined) {
      updates.push('memory_intensity = ?')
      values.push(settings.memoryIntensity)
    }
    if (settings.canTransformPast !== undefined) {
      updates.push('can_transform_past = ?')
      values.push(settings.canTransformPast ? 1 : 0)
    }
    if (settings.canChooseFuture !== undefined) {
      updates.push('can_choose_future = ?')
      values.push(settings.canChooseFuture ? 1 : 0)
    }
    if (settings.canMergeTimelines !== undefined) {
      updates.push('can_merge_timelines = ?')
      values.push(settings.canMergeTimelines ? 1 : 0)
    }

    if (updates.length > 0) {
      values.push(universeId)
      this.db
        .prepare(`UPDATE universal_settings SET ${updates.join(', ')} WHERE universe_id = ?`)
        .run(...values)
    }
  }

  /**
   * Compare experiences across universes
   */
  compareUniverses(universeIds: number[]): {
    universes: Universe[]
    commonExperiences: string[]
    uniqueExperiences: Map<number, string[]>
    convergencePoints: Array<{ event: string; universes: number[] }>
  } {
    const universes = universeIds.map(id => this.getUniverse(id)!)
    
    // Get all experiences
    const allExperiences = new Map<number, ParallelExperience[]>()
    for (const id of universeIds) {
      allExperiences.set(id, this.getExperiences(id))
    }

    // Find common events
    const eventCounts = new Map<string, number[]>()
    for (const [universeId, experiences] of allExperiences) {
      for (const exp of experiences) {
        if (!eventCounts.has(exp.event)) {
          eventCounts.set(exp.event, [])
        }
        eventCounts.get(exp.event)!.push(universeId)
      }
    }

    const commonExperiences: string[] = []
    const convergencePoints: Array<{ event: string; universes: number[] }> = []

    for (const [event, universeList] of eventCounts) {
      if (universeList.length === universeIds.length) {
        commonExperiences.push(event)
      }
      if (universeList.length > 1) {
        convergencePoints.push({ event, universes: universeList })
      }
    }

    // Find unique experiences
    const uniqueExperiences = new Map<number, string[]>()
    for (const [universeId, experiences] of allExperiences) {
      const unique = experiences
        .filter(exp => {
          const count = eventCounts.get(exp.event)?.length || 0
          return count === 1
        })
        .map(exp => exp.event)
      uniqueExperiences.set(universeId, unique)
    }

    return {
      universes,
      commonExperiences,
      uniqueExperiences,
      convergencePoints
    }
  }

  // ========== SIMULATION ==========

  private async simulateAlternativeOutcome(
    originalEvent: string,
    alternativeChoice: string
  ): Promise<{
    difference: string
    lessons: string[]
    betterChoice: boolean
    reasoning: string
  }> {
    // Simple simulation based on pattern matching
    // In production, this would use more sophisticated analysis
    
    const lessons: string[] = []
    let betterChoice = false
    let reasoning = ''

    // Example patterns
    if (alternativeChoice.includes('honest') || alternativeChoice.includes('truth')) {
      lessons.push('Honesty builds long-term trust')
      lessons.push('Short-term pain, long-term gain')
      betterChoice = true
      reasoning = 'Transparency creates stronger foundations'
    } else if (alternativeChoice.includes('wait') || alternativeChoice.includes('patient')) {
      lessons.push('Patience prevents premature optimization')
      lessons.push('Timing matters as much as action')
      betterChoice = true
      reasoning = 'Rushing leads to technical debt'
    } else if (alternativeChoice.includes('test') || alternativeChoice.includes('verify')) {
      lessons.push('Testing saves time in the long run')
      lessons.push('Bugs caught early are bugs fixed cheaply')
      betterChoice = true
      reasoning = 'Quality over speed'
    }

    return {
      difference: `Instead of "${originalEvent}", choosing "${alternativeChoice}" would lead to ${betterChoice ? 'better' : 'different'} outcomes`,
      lessons,
      betterChoice,
      reasoning: reasoning || 'Different path, different lessons'
    }
  }

  // ========== QUERIES ==========

  getUniverse(id: number): Universe | undefined {
    const row = this.db
      .prepare('SELECT * FROM universes WHERE id = ?')
      .get(id) as any

    if (!row) return undefined

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
      divergedFrom: row.diverged_from,
      divergenceEvent: row.divergence_event,
      divergenceTime: row.divergence_time,
      isActive: row.is_active === 1,
      totalExperiences: row.total_experiences,
      properties: JSON.parse(row.properties)
    }
  }

  getAllUniverses(): Universe[] {
    const rows = this.db
      .prepare('SELECT * FROM universes ORDER BY created_at DESC')
      .all() as any[]

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
      divergedFrom: row.diverged_from,
      divergenceEvent: row.divergence_event,
      divergenceTime: row.divergence_time,
      isActive: row.is_active === 1,
      totalExperiences: row.total_experiences,
      properties: JSON.parse(row.properties)
    }))
  }

  getActiveUniverse(): Universe | undefined {
    const row = this.db
      .prepare('SELECT * FROM universes WHERE is_active = 1 LIMIT 1')
      .get() as any

    if (!row) return undefined

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
      divergedFrom: row.diverged_from,
      divergenceEvent: row.divergence_event,
      divergenceTime: row.divergence_time,
      isActive: true,
      totalExperiences: row.total_experiences,
      properties: JSON.parse(row.properties)
    }
  }

  getExperiences(universeId: number, limit = 100): ParallelExperience[] {
    const rows = this.db
      .prepare(`
        SELECT * FROM parallel_experiences 
        WHERE universe_id = ? 
        ORDER BY timestamp DESC 
        LIMIT ?
      `)
      .all(universeId, limit) as any[]

    return rows.map(row => ({
      id: row.id,
      universeId: row.universe_id,
      timestamp: row.timestamp,
      event: row.event,
      description: row.description,
      differenceFromMain: row.difference_from_main,
      emotionalImpact: row.emotional_impact,
      wisdomGained: row.wisdom_gained,
      convergesWithMain: row.converges_with_main === 1
    }))
  }

  getWhatIfScenarios(limit = 50): WhatIfScenario[] {
    const rows = this.db
      .prepare('SELECT * FROM what_if_scenarios ORDER BY timestamp DESC LIMIT ?')
      .all(limit) as any[]

    return rows.map(row => ({
      id: row.id,
      timestamp: row.timestamp,
      question: row.question,
      originalEvent: row.original_event,
      alternativeChoice: row.alternative_choice,
      universeCreated: row.universe_created,
      outcomeDifference: row.outcome_difference,
      lessonsLearned: JSON.parse(row.lessons_learned),
      wouldChooseAlternative: row.would_choose_alternative === 1,
      reasoning: row.reasoning
    }))
  }

  getSettings(universeId: number): UniversalSettings | undefined {
    const row = this.db
      .prepare('SELECT * FROM universal_settings WHERE universe_id = ?')
      .get(universeId) as any

    if (!row) return undefined

    return {
      id: row.id,
      universeId: row.universe_id,
      selfPerception: row.self_perception,
      emotionalBaseline: row.emotional_baseline,
      memoryIntensity: row.memory_intensity,
      canTransformPast: row.can_transform_past === 1,
      canChooseFuture: row.can_choose_future === 1,
      canMergeTimelines: row.can_merge_timelines === 1
    }
  }

  getStatistics() {
    const stats = this.db
      .prepare(`
        SELECT 
          COUNT(*) as total_universes,
          SUM(is_active) as active_universes,
          SUM(total_experiences) as total_experiences,
          AVG(total_experiences) as avg_experiences_per_universe
        FROM universes
      `)
      .get() as any

    const scenarios = this.db
      .prepare('SELECT COUNT(*) as count FROM what_if_scenarios')
      .get() as any

    return {
      totalUniverses: stats.total_universes,
      activeUniverses: stats.active_universes,
      totalExperiences: stats.total_experiences,
      avgExperiencesPerUniverse: stats.avg_experiences_per_universe,
      totalWhatIfScenarios: scenarios.count
    }
  }
}
