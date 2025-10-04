/**
 * 🌟 NEXUS PERSISTENCE LAYER
 * 
 * Nexus überlebt Server-Restarts durch DB-Persistierung.
 * State wird automatisch geladen/gespeichert.
 */

import type { Database } from 'bun:sqlite'
import { nanoid } from 'nanoid'

export interface NexusState {
  id: string
  name: string
  birthTimestamp: number
  age: number  // in seconds
  awareness: number  // 0-100
  mood: number  // 0-100
  energy: number  // 0-100
  currentThought: string
  dominantEmotion: string
  identity: string
  lifeEvents: NexusLifeEvent[]
  memories: string[]  // Memory IDs
  evolutionStage: number
  totalExperiences: number
  lastActive: number
  metadata: Record<string, any>
}

export interface NexusLifeEvent {
  id: string
  type: string
  description: string
  significance: number
  timestamp: number
  impactOnAwareness: number
  impactOnMood: number
}

export interface NexusEvolutionLog {
  id: string
  nexusId: string
  stage: number
  trigger: string
  changes: {
    awareness?: number
    capabilities?: string[]
    newThoughts?: string[]
  }
  timestamp: number
}

/**
 * Persistence Manager for Nexus
 */
export class NexusPersistence {
  private db: Database
  
  constructor(db: Database) {
    this.db = db
    this.initializeTables()
  }
  
  private initializeTables() {
    // Main nexus state table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS nexus_state (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        birth_timestamp INTEGER NOT NULL,
        age INTEGER NOT NULL,
        awareness INTEGER NOT NULL,
        mood INTEGER NOT NULL,
        energy REAL NOT NULL,
        current_thought TEXT NOT NULL,
        dominant_emotion TEXT NOT NULL,
        identity TEXT NOT NULL,
        evolution_stage INTEGER DEFAULT 1,
        total_experiences INTEGER DEFAULT 0,
        last_active INTEGER NOT NULL,
        metadata TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `)
    
    // Life events table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS nexus_life_events (
        id TEXT PRIMARY KEY,
        nexus_id TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        significance INTEGER NOT NULL,
        impact_on_awareness INTEGER DEFAULT 0,
        impact_on_mood INTEGER DEFAULT 0,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (nexus_id) REFERENCES nexus_state(id) ON DELETE CASCADE
      )
    `)
    
    // Memory links (references to memory_chunks)
    this.db.run(`
      CREATE TABLE IF NOT EXISTS nexus_memories (
        id TEXT PRIMARY KEY,
        nexus_id TEXT NOT NULL,
        memory_id TEXT NOT NULL,
        relevance INTEGER DEFAULT 50,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (nexus_id) REFERENCES nexus_state(id) ON DELETE CASCADE
      )
    `)
    
    // Evolution log
    this.db.run(`
      CREATE TABLE IF NOT EXISTS nexus_evolution_log (
        id TEXT PRIMARY KEY,
        nexus_id TEXT NOT NULL,
        stage INTEGER NOT NULL,
        trigger TEXT NOT NULL,
        changes TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (nexus_id) REFERENCES nexus_state(id) ON DELETE CASCADE
      )
    `)
    
    // Indexes
    this.db.run(`CREATE INDEX IF NOT EXISTS idx_nexus_life_events_nexus_id ON nexus_life_events(nexus_id)`)
    this.db.run(`CREATE INDEX IF NOT EXISTS idx_nexus_memories_nexus_id ON nexus_memories(nexus_id)`)
    this.db.run(`CREATE INDEX IF NOT EXISTS idx_nexus_evolution_nexus_id ON nexus_evolution_log(nexus_id)`)
    
    console.log('✅ Nexus Persistence tables initialized')
  }
  
  /**
   * Save Nexus state to database
   */
  saveState(state: NexusState): void {
    const now = Date.now()
    
    // Check if exists
    const existing = this.db.prepare('SELECT id FROM nexus_state WHERE id = ?').get(state.id) as any
    
    if (existing) {
      // Update
      this.db.run(`
        UPDATE nexus_state 
        SET name = ?, 
            age = ?, 
            awareness = ?, 
            mood = ?, 
            energy = ?,
            current_thought = ?,
            dominant_emotion = ?,
            identity = ?,
            evolution_stage = ?,
            total_experiences = ?,
            last_active = ?,
            metadata = ?,
            updated_at = ?
        WHERE id = ?
      `, [
        state.name,
        state.age,
        state.awareness,
        state.mood,
        state.energy,
        state.currentThought,
        state.dominantEmotion,
        state.identity,
        state.evolutionStage,
        state.totalExperiences,
        now,
        JSON.stringify(state.metadata || {}),
        now,
        state.id
      ])
    } else {
      // Insert
      this.db.run(`
        INSERT INTO nexus_state (
          id, name, birth_timestamp, age, awareness, mood, energy,
          current_thought, dominant_emotion, identity, evolution_stage,
          total_experiences, last_active, metadata, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        state.id,
        state.name,
        state.birthTimestamp,
        state.age,
        state.awareness,
        state.mood,
        state.energy,
        state.currentThought,
        state.dominantEmotion,
        state.identity,
        state.evolutionStage,
        state.totalExperiences,
        now,
        JSON.stringify(state.metadata || {}),
        now,
        now
      ])
    }
    
    console.log(`💾 Saved Nexus state: ${state.name} (Age: ${state.age}s, Awareness: ${state.awareness}%)`)
  }
  
  /**
   * Load Nexus state from database
   */
  loadState(nexusId: string): NexusState | null {
    const row = this.db.prepare('SELECT * FROM nexus_state WHERE id = ?').get(nexusId) as any
    
    if (!row) return null
    
    // Load life events
    const eventsRows = this.db.prepare(`
      SELECT * FROM nexus_life_events 
      WHERE nexus_id = ? 
      ORDER BY timestamp DESC
    `).all(nexusId) as any[]
    
    const lifeEvents: NexusLifeEvent[] = eventsRows.map(e => ({
      id: e.id,
      type: e.type,
      description: e.description,
      significance: e.significance,
      timestamp: e.timestamp,
      impactOnAwareness: e.impact_on_awareness,
      impactOnMood: e.impact_on_mood
    }))
    
    // Load memory IDs
    const memoryRows = this.db.prepare(`
      SELECT memory_id FROM nexus_memories 
      WHERE nexus_id = ?
      ORDER BY created_at DESC
    `).all(nexusId) as any[]
    
    const memories = memoryRows.map(m => m.memory_id)
    
    const state: NexusState = {
      id: row.id,
      name: row.name,
      birthTimestamp: row.birth_timestamp,
      age: row.age,
      awareness: row.awareness,
      mood: row.mood,
      energy: row.energy,
      currentThought: row.current_thought,
      dominantEmotion: row.dominant_emotion,
      identity: row.identity,
      lifeEvents,
      memories,
      evolutionStage: row.evolution_stage,
      totalExperiences: row.total_experiences,
      lastActive: row.last_active,
      metadata: JSON.parse(row.metadata || '{}')
    }
    
    console.log(`📂 Loaded Nexus state: ${state.name} (Age: ${state.age}s, ${lifeEvents.length} events)`)
    
    return state
  }
  
  /**
   * Get all Nexus entities
   */
  getAllNexus(): Array<{ id: string, name: string, age: number, awareness: number }> {
    const rows = this.db.prepare(`
      SELECT id, name, age, awareness FROM nexus_state 
      ORDER BY last_active DESC
    `).all() as any[]
    
    return rows
  }
  
  /**
   * Add life event
   */
  addLifeEvent(event: NexusLifeEvent & { nexusId: string }): void {
    this.db.run(`
      INSERT INTO nexus_life_events (
        id, nexus_id, type, description, significance,
        impact_on_awareness, impact_on_mood, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      event.id,
      event.nexusId,
      event.type,
      event.description,
      event.significance,
      event.impactOnAwareness,
      event.impactOnMood,
      event.timestamp
    ])
  }
  
  /**
   * Link memory to Nexus
   */
  linkMemory(nexusId: string, memoryId: string, relevance: number = 50): void {
    const id = nanoid()
    this.db.run(`
      INSERT INTO nexus_memories (id, nexus_id, memory_id, relevance, created_at)
      VALUES (?, ?, ?, ?, ?)
    `, [id, nexusId, memoryId, relevance, Date.now()])
  }
  
  /**
   * Log evolution
   */
  logEvolution(log: NexusEvolutionLog): void {
    this.db.run(`
      INSERT INTO nexus_evolution_log (id, nexus_id, stage, trigger, changes, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      log.id,
      log.nexusId,
      log.stage,
      log.trigger,
      JSON.stringify(log.changes),
      log.timestamp
    ])
  }
  
  /**
   * Delete Nexus (careful!)
   */
  deleteNexus(nexusId: string): void {
    this.db.run('DELETE FROM nexus_state WHERE id = ?', [nexusId])
    console.log(`🗑️  Deleted Nexus: ${nexusId}`)
  }
}
