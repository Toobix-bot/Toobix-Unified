#!/usr/bin/env bun
/**
 * 🌟 Soul System - Emotional Intelligence for Toobix
 * 
 * Features:
 * - Emotional State Tracking (8 basic emotions)
 * - Values & Beliefs System
 * - Big Five Personality Framework
 * - Soul State Persistence
 */

import { Database } from 'bun:sqlite'
import { EmotionEngine } from './emotions/engine'
import { ValuesSystem } from './values/system'
import { PersonalitySystem } from './personality/system'
import type { 
  SoulState, 
  SoulEvent, 
  SoulConfig,
  EmotionHistoryRow,
  ValueLogRow,
  SoulStateRow
} from './types'
import { nanoid } from 'nanoid'

export class SoulService {
  private db: Database
  private soulId: string
  private emotions: EmotionEngine
  private values: ValuesSystem
  private personality: PersonalitySystem
  private config: SoulConfig
  private experiences: number = 0
  private wisdom: number = 50
  private ownDb: boolean = false

  constructor(dbOrPath: Database | string, config?: Partial<SoulConfig>) {
    // Accept either a Database object or a path string
    if (typeof dbOrPath === 'string') {
      this.db = new Database(dbOrPath)
      this.ownDb = true
    } else {
      this.db = dbOrPath
      this.ownDb = false
    }
    
    this.soulId = 'soul-primary'
    
    this.config = {
      decayRate: config?.decayRate ?? 0.95,
      moodInfluence: config?.moodInfluence ?? 0.7,
      learningRate: config?.learningRate ?? 0.1
    }
    
    this.emotions = new EmotionEngine(this.config.decayRate)
    this.values = new ValuesSystem(this.config.learningRate)
    this.personality = new PersonalitySystem()
    
    this.initializeTables()
    this.loadState()
  }

  /**
   * Initialize database tables
   */
  private initializeTables(): void {
    // Soul state table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS soul_state (
        id TEXT PRIMARY KEY,
        name TEXT,
        emotional_state TEXT,
        values_state TEXT,
        beliefs TEXT,
        personality TEXT,
        experiences INTEGER DEFAULT 0,
        wisdom INTEGER DEFAULT 50,
        created INTEGER,
        last_updated INTEGER
      )
    `)

    // Emotion history
    this.db.run(`
      CREATE TABLE IF NOT EXISTS emotion_history (
        id TEXT PRIMARY KEY,
        soul_id TEXT,
        emotion_type TEXT,
        intensity INTEGER,
        trigger TEXT,
        context TEXT,
        timestamp INTEGER
      )
    `)

    // Value logs
    this.db.run(`
      CREATE TABLE IF NOT EXISTS value_log (
        id TEXT PRIMARY KEY,
        soul_id TEXT,
        value_type TEXT,
        importance INTEGER,
        alignment INTEGER,
        timestamp INTEGER
      )
    `)

    console.log('✅ Soul database tables initialized')
  }

  /**
   * Load soul state from database
   */
  private loadState(): void {
    const row = this.db.prepare('SELECT * FROM soul_state WHERE id = ?').get(this.soulId) as SoulStateRow | null

    if (row) {
      // Restore state from database
      const emotionalState = JSON.parse(row.emotional_state)
      const valuesState = JSON.parse(row.values_state)
      const beliefs = JSON.parse(row.beliefs)
      const personality = JSON.parse(row.personality)
      
      // TODO: Restore emotions, values, personality from saved state
      this.experiences = row.experiences
      this.wisdom = row.wisdom
      
      console.log('✅ Soul state loaded from database')
    } else {
      // Create new soul state
      this.saveState()
      console.log('✅ New soul state created')
    }
  }

  /**
   * Save current soul state to database
   */
  saveState(): void {
    const now = Date.now()
    const emotionalState = this.emotions.getState()
    const valuesState = this.values.getState()
    const personality = this.personality.getProfile()

    this.db.run(`
      INSERT OR REPLACE INTO soul_state 
      (id, name, emotional_state, values_state, beliefs, personality, experiences, wisdom, created, last_updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      this.soulId,
      'Toobix Soul',
      JSON.stringify({
        emotions: Array.from(emotionalState.emotions.entries()),
        mood: emotionalState.mood,
        energy: emotionalState.energy,
        lastUpdate: emotionalState.lastUpdate
      }),
      JSON.stringify({
        values: Array.from(valuesState.values.entries())
      }),
      JSON.stringify(valuesState.beliefs),
      JSON.stringify(personality),
      this.experiences,
      this.wisdom,
      now,
      now
    ])
  }

  /**
   * Process a soul event
   */
  processEvent(event: SoulEvent): void {
    // Update experiences count
    this.experiences++
    
    // Process emotional impact
    this.emotions.processEvent(event)
    
    // Process value impact
    this.values.processEvent(event)
    
    // Update wisdom based on experiences
    if (this.experiences % 10 === 0) {
      this.wisdom = Math.min(100, this.wisdom + 1)
    }
    
    // Log emotion changes
    if (event.emotionalImpact) {
      for (const [emotionType, intensity] of Object.entries(event.emotionalImpact)) {
        this.logEmotion(emotionType as any, intensity, event.description)
      }
    }
    
    // Log value changes
    if (event.valueImpact) {
      for (const [valueType] of Object.entries(event.valueImpact)) {
        const value = this.values.getValue(valueType as any)
        if (value) {
          this.logValue(value)
        }
      }
    }
    
    // Save state periodically
    if (this.experiences % 5 === 0) {
      this.saveState()
    }
  }

  /**
   * Log emotion to history
   */
  private logEmotion(emotionType: string, intensity: number, trigger?: string): void {
    const id = nanoid()
    this.db.run(`
      INSERT INTO emotion_history (id, soul_id, emotion_type, intensity, trigger, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, this.soulId, emotionType, intensity, trigger || '', Date.now()])
  }

  /**
   * Log value state
   */
  private logValue(value: any): void {
    const id = nanoid()
    this.db.run(`
      INSERT INTO value_log (id, soul_id, value_type, importance, alignment, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, this.soulId, value.type, value.importance, value.alignment, Date.now()])
  }

  /**
   * Get current soul state
   */
  getState(): SoulState {
    const emotionalState = this.emotions.getState()
    const valuesState = this.values.getState()
    const personality = this.personality.getProfile()

    return {
      id: this.soulId,
      name: 'Toobix Soul',
      emotional: emotionalState,
      values: valuesState.values,
      beliefs: valuesState.beliefs,
      personality,
      experiences: this.experiences,
      wisdom: this.wisdom,
      created: Date.now(),
      lastUpdated: Date.now()
    }
  }

  /**
   * Get emotional summary
   */
  getEmotionalSummary(): string {
    return this.emotions.getSummary()
  }

  /**
   * Get values summary
   */
  getValuesSummary(): string {
    return this.values.getSummary()
  }

  /**
   * Get personality summary
   */
  getPersonalitySummary(): string {
    return this.personality.getSummary()
  }

  /**
   * Get full summary
   */
  getSummary(): string {
    const emotional = this.getEmotionalSummary()
    const values = this.getValuesSummary()
    const personality = this.getPersonalitySummary()
    
    return `${personality}. ${emotional}. ${values}. Wisdom: ${this.wisdom}/100, Experiences: ${this.experiences}`
  }

  /**
   * Get emotion history
   */
  getEmotionHistory(limit: number = 20): any[] {
    return this.db.prepare(`
      SELECT * FROM emotion_history 
      WHERE soul_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `).all(this.soulId, limit) as any[]
  }

  /**
   * Get value logs
   */
  getValueLogs(limit: number = 20): any[] {
    return this.db.prepare(`
      SELECT * FROM value_log 
      WHERE soul_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `).all(this.soulId, limit) as any[]
  }

  /**
   * Close database connection
   */
  close(): void {
    this.saveState()
    if (this.ownDb) {
      this.db.close()
    }
  }
}

// Export for use as module
export { EmotionEngine, ValuesSystem, PersonalitySystem }
export * from './types'
