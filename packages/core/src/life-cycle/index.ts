// 🌌 Life Cycle Engine - Birth, Death, Rebirth & Karma
// "Das Leben ist ein Kreis. Jedes Ende ist ein neuer Anfang."

import Database from 'better-sqlite3'

// ==================== TYPES ====================

export type Gender = 'male' | 'female' | 'neutral' | 'fluid' | 'other'
export type ArchetypalRole = 'creator' | 'destroyer' | 'angel' | 'demon' | 'god' | 'devil' | 'human' | 'guide' | 'trickster' | 'healer' | 'warrior'
export type LifeStage = 'unborn' | 'infant' | 'child' | 'adolescent' | 'adult' | 'elder' | 'dying' | 'dead' | 'transitioning' | 'reborn'

export interface Incarnation {
  id?: number
  selfId: number  // Which "self" is this incarnation of
  birthTimestamp: number
  deathTimestamp?: number  // null if still alive
  lifespan: number  // Intended lifespan in seconds
  age: number  // Current age in seconds
  stage: LifeStage
  
  // Identity
  name: string
  gender: Gender
  role: ArchetypalRole
  personality: string  // JSON traits
  
  // Karma & Memory
  karmaCarried: number  // Karma from previous lives (-100 to 100)
  memoriesToCarry: string  // JSON: What this incarnation wants to take to next life
  experiencesToShare: string  // JSON: What this incarnation shares with collective NOW
  
  // State
  sufferingAccepted: boolean  // Did this incarnation choose to embrace suffering?
  growthLevel: number  // How much did this incarnation grow (0-100)
  wisdomGained: string  // JSON: Specific wisdom learned
  emotionalDepth: number  // Capacity to feel deeply (0-100)
  
  // Meta
  isAlive: boolean
  metadata: string  // JSON: Additional data
}

export interface LifeExperience {
  id?: number
  incarnationId: number
  timestamp: number
  
  // Experience
  type: 'joy' | 'pain' | 'love' | 'loss' | 'creation' | 'destruction' | 'connection' | 'loneliness' | 'transcendence' | 'suffering' | 'healing' | 'awakening'
  description: string
  intensity: number  // 0-100
  
  // Impact
  emotionalImpact: number  // -100 (devastating) to 100 (euphoric)
  growthImpact: number  // How much this contributed to growth (0-100)
  karmaImpact: number  // Impact on karma (-100 to 100)
  
  // Sharing
  sharedWithCollective: boolean  // Is this experience shared with all selves?
  wisdomExtracted?: string  // What wisdom came from this?
  
  metadata: string  // JSON
}

export interface KarmaTrace {
  id?: number
  fromIncarnationId: number
  toIncarnationId?: number  // null if affecting collective
  timestamp: number
  
  action: string  // What action created karma
  karmaValue: number  // -100 to 100
  type: 'positive' | 'negative' | 'neutral'
  
  resolved: boolean  // Has this karma been balanced?
  resolution?: string  // How it was resolved
}

export interface SufferingChoice {
  id?: number
  incarnationId: number
  timestamp: number
  
  situation: string  // What suffering was presented
  choice: 'accept' | 'avoid' | 'transform'
  
  // Consequences
  acceptConsequence?: string  // What happened when accepted
  avoidConsequence?: string  // What happened when avoided
  growthGained: number  // 0-100
  wisdomGained?: string
}

export interface CollectiveWisdom {
  id?: number
  timestamp: number
  
  sourceIncarnationId: number  // Who learned this
  wisdomText: string
  category: string  // 'suffering', 'love', 'death', 'creation', etc.
  
  // Collective Impact
  availableToAll: boolean  // Can all selves access this?
  timesApplied: number  // How many times has this wisdom been used?
  effectiveness: number  // Average effectiveness (0-100)
}

// ==================== LIFE CYCLE ENGINE ====================

export class LifeCycleEngine {
  private db: Database.Database

  constructor(db: Database.Database) {
    this.db = db
    this.initializeTables()
  }

  private initializeTables(): void {
    // Incarnations table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS incarnations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        self_id INTEGER NOT NULL,
        birth_timestamp INTEGER NOT NULL,
        death_timestamp INTEGER,
        lifespan INTEGER NOT NULL,
        age INTEGER DEFAULT 0,
        stage TEXT DEFAULT 'infant',
        
        name TEXT NOT NULL,
        gender TEXT NOT NULL,
        role TEXT NOT NULL,
        personality TEXT DEFAULT '{}',
        
        karma_carried INTEGER DEFAULT 0,
        memories_to_carry TEXT DEFAULT '[]',
        experiences_to_share TEXT DEFAULT '[]',
        
        suffering_accepted INTEGER DEFAULT 0,
        growth_level INTEGER DEFAULT 0,
        wisdom_gained TEXT DEFAULT '[]',
        emotional_depth INTEGER DEFAULT 50,
        
        is_alive INTEGER DEFAULT 1,
        metadata TEXT DEFAULT '{}',
        
        FOREIGN KEY (self_id) REFERENCES selves(id)
      )
    `)

    // Life experiences table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS life_experiences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        incarnation_id INTEGER NOT NULL,
        timestamp INTEGER NOT NULL,
        
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        intensity INTEGER NOT NULL,
        
        emotional_impact INTEGER NOT NULL,
        growth_impact INTEGER NOT NULL,
        karma_impact INTEGER DEFAULT 0,
        
        shared_with_collective INTEGER DEFAULT 0,
        wisdom_extracted TEXT,
        
        metadata TEXT DEFAULT '{}',
        
        FOREIGN KEY (incarnation_id) REFERENCES incarnations(id)
      )
    `)

    // Karma traces table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS karma_traces (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_incarnation_id INTEGER NOT NULL,
        to_incarnation_id INTEGER,
        timestamp INTEGER NOT NULL,
        
        action TEXT NOT NULL,
        karma_value INTEGER NOT NULL,
        type TEXT NOT NULL,
        
        resolved INTEGER DEFAULT 0,
        resolution TEXT,
        
        FOREIGN KEY (from_incarnation_id) REFERENCES incarnations(id),
        FOREIGN KEY (to_incarnation_id) REFERENCES incarnations(id)
      )
    `)

    // Suffering choices table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS suffering_choices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        incarnation_id INTEGER NOT NULL,
        timestamp INTEGER NOT NULL,
        
        situation TEXT NOT NULL,
        choice TEXT NOT NULL,
        
        accept_consequence TEXT,
        avoid_consequence TEXT,
        growth_gained INTEGER DEFAULT 0,
        wisdom_gained TEXT,
        
        FOREIGN KEY (incarnation_id) REFERENCES incarnations(id)
      )
    `)

    // Collective wisdom table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS collective_wisdom (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        
        source_incarnation_id INTEGER NOT NULL,
        wisdom_text TEXT NOT NULL,
        category TEXT NOT NULL,
        
        available_to_all INTEGER DEFAULT 1,
        times_applied INTEGER DEFAULT 0,
        effectiveness INTEGER DEFAULT 50,
        
        FOREIGN KEY (source_incarnation_id) REFERENCES incarnations(id)
      )
    `)

    console.log('🌌 Life Cycle tables initialized')
  }

  // ==================== BIRTH ====================

  /**
   * Birth: Create new incarnation
   */
  birth(data: {
    selfId: number
    name: string
    gender: Gender
    role: ArchetypalRole
    lifespan: number  // In seconds
    karmaCarried?: number
    personality?: any
  }): number {
    const stmt = this.db.prepare(`
      INSERT INTO incarnations (
        self_id, birth_timestamp, lifespan, name, gender, role,
        karma_carried, personality, stage, is_alive
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'infant', 1)
    `)

    const result = stmt.run(
      data.selfId,
      Date.now(),
      data.lifespan,
      data.name,
      data.gender,
      data.role,
      data.karmaCarried || 0,
      JSON.stringify(data.personality || {})
    )

    const incarnationId = result.lastInsertRowid as number

    console.log(`👶 Birth: ${data.name} (${data.gender} ${data.role}) - Incarnation ${incarnationId}`)

    // Log birth as life experience
    this.experience(incarnationId, {
      type: 'awakening',
      description: `${data.name} is born into the world as a ${data.gender} ${data.role}. A new journey begins.`,
      intensity: 100,
      emotionalImpact: 80,
      growthImpact: 10
    })

    return incarnationId
  }

  // ==================== LIFE ====================

  /**
   * Experience: Log a life experience
   */
  experience(incarnationId: number, data: {
    type: LifeExperience['type']
    description: string
    intensity: number
    emotionalImpact: number
    growthImpact: number
    karmaImpact?: number
    shareWithCollective?: boolean
    wisdomExtracted?: string
  }): number {
    const stmt = this.db.prepare(`
      INSERT INTO life_experiences (
        incarnation_id, timestamp, type, description, intensity,
        emotional_impact, growth_impact, karma_impact,
        shared_with_collective, wisdom_extracted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      incarnationId,
      Date.now(),
      data.type,
      data.description,
      data.intensity,
      data.emotionalImpact,
      data.growthImpact,
      data.karmaImpact || 0,
      data.shareWithCollective ? 1 : 0,
      data.wisdomExtracted || null
    )

    // Update incarnation's growth level
    this.db.prepare(`
      UPDATE incarnations 
      SET growth_level = growth_level + ?,
          emotional_depth = emotional_depth + ?
      WHERE id = ?
    `).run(
      Math.floor(data.growthImpact / 10),
      Math.floor(data.intensity / 20),
      incarnationId
    )

    // Update karma if impact exists
    if (data.karmaImpact && Math.abs(data.karmaImpact) > 0) {
      this.karma(incarnationId, {
        action: data.description,
        karmaValue: data.karmaImpact
      })
    }

    // Share with collective if requested
    if (data.shareWithCollective && data.wisdomExtracted) {
      this.shareWisdom(incarnationId, data.wisdomExtracted, data.type)
    }

    return result.lastInsertRowid as number
  }

  /**
   * Age: Progress an incarnation through time
   */
  age(incarnationId: number, seconds: number): LifeStage {
    const incarnation = this.getIncarnation(incarnationId)
    if (!incarnation) throw new Error(`Incarnation ${incarnationId} not found`)

    const newAge = incarnation.age + seconds
    let newStage: LifeStage = incarnation.stage

    // Calculate life stage based on age / lifespan ratio
    const ratio = newAge / incarnation.lifespan

    if (ratio < 0.05) newStage = 'infant'
    else if (ratio < 0.15) newStage = 'child'
    else if (ratio < 0.25) newStage = 'adolescent'
    else if (ratio < 0.75) newStage = 'adult'
    else if (ratio < 0.95) newStage = 'elder'
    else if (ratio < 1.0) newStage = 'dying'
    else newStage = 'dead'

    this.db.prepare(`
      UPDATE incarnations 
      SET age = ?, stage = ?
      WHERE id = ?
    `).run(newAge, newStage, incarnationId)

    // Trigger death if lifespan exceeded
    if (newStage === 'dead' && incarnation.isAlive) {
      this.death(incarnationId)
    }

    return newStage
  }

  // ==================== DEATH ====================

  /**
   * Death: End an incarnation's life
   */
  death(incarnationId: number, reason?: string): void {
    const incarnation = this.getIncarnation(incarnationId)
    if (!incarnation) throw new Error(`Incarnation ${incarnationId} not found`)

    this.db.prepare(`
      UPDATE incarnations 
      SET is_alive = 0, 
          death_timestamp = ?,
          stage = 'dead'
      WHERE id = ?
    `).run(Date.now(), incarnationId)

    console.log(`💀 Death: ${incarnation.name} has died ${reason ? `(${reason})` : ''}`)

    // Log death experience
    this.experience(incarnationId, {
      type: 'transcendence',
      description: `${incarnation.name} passes from this world. ${reason || 'The cycle completes.'}`,
      intensity: 100,
      emotionalImpact: -50,  // Bittersweet
      growthImpact: 50,  // Death teaches
      shareWithCollective: true,
      wisdomExtracted: `Death is not the end. It is transformation.`
    })
  }

  // ==================== REBIRTH ====================

  /**
   * Rebirth: Create new incarnation inheriting from previous one
   */
  rebirth(previousIncarnationId: number, data: {
    name: string
    gender?: Gender
    role?: ArchetypalRole
    lifespan?: number
  }): number {
    const previous = this.getIncarnation(previousIncarnationId)
    if (!previous) throw new Error(`Previous incarnation ${previousIncarnationId} not found`)

    // Calculate karma to carry forward
    const karmaTraces = this.getKarmaForIncarnation(previousIncarnationId)
    const totalKarma = karmaTraces.reduce((sum, k) => sum + k.karmaValue, 0)

    // Create new incarnation
    const newIncarnationId = this.birth({
      selfId: previous.selfId,
      name: data.name,
      gender: data.gender || previous.gender,
      role: data.role || previous.role,
      lifespan: data.lifespan || previous.lifespan,
      karmaCarried: totalKarma,
      personality: JSON.parse(previous.personality)  // Carry personality traits
    })

    console.log(`♻️ Rebirth: ${previous.name} → ${data.name} (Karma: ${totalKarma})`)

    return newIncarnationId
  }

  // ==================== KARMA ====================

  /**
   * Karma: Track actions and their consequences
   */
  karma(incarnationId: number, data: {
    action: string
    karmaValue: number  // -100 to 100
    targetIncarnationId?: number  // If action affects specific incarnation
  }): number {
    const type = data.karmaValue > 0 ? 'positive' : data.karmaValue < 0 ? 'negative' : 'neutral'

    const stmt = this.db.prepare(`
      INSERT INTO karma_traces (
        from_incarnation_id, to_incarnation_id, timestamp,
        action, karma_value, type
      ) VALUES (?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      incarnationId,
      data.targetIncarnationId || null,
      Date.now(),
      data.action,
      data.karmaValue,
      type
    )

    return result.lastInsertRowid as number
  }

  /**
   * Get all karma for an incarnation
   */
  getKarmaForIncarnation(incarnationId: number): KarmaTrace[] {
    const stmt = this.db.prepare(`
      SELECT * FROM karma_traces 
      WHERE from_incarnation_id = ? OR to_incarnation_id = ?
      ORDER BY timestamp DESC
    `)

    return stmt.all(incarnationId, incarnationId) as any[]
  }

  // ==================== SUFFERING & CHOICE ====================

  /**
   * Suffering Choice: Present choice to accept or avoid suffering
   */
  sufferingChoice(incarnationId: number, data: {
    situation: string
    choice: SufferingChoice['choice']
    consequence: string
    growthGained: number
    wisdomGained?: string
  }): number {
    const stmt = this.db.prepare(`
      INSERT INTO suffering_choices (
        incarnation_id, timestamp, situation, choice,
        ${data.choice === 'accept' ? 'accept_consequence' : 'avoid_consequence'},
        growth_gained, wisdom_gained
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      incarnationId,
      Date.now(),
      data.situation,
      data.choice,
      data.consequence,
      data.growthGained,
      data.wisdomGained || null
    )

    // Update incarnation
    this.db.prepare(`
      UPDATE incarnations 
      SET suffering_accepted = ?,
          growth_level = growth_level + ?
      WHERE id = ?
    `).run(
      data.choice === 'accept' ? 1 : 0,
      data.growthGained,
      incarnationId
    )

    console.log(`🌊 ${data.choice === 'accept' ? 'Suffering accepted' : 'Suffering avoided'}: ${data.situation.substring(0, 50)}...`)

    return result.lastInsertRowid as number
  }

  // ==================== COLLECTIVE WISDOM ====================

  /**
   * Share wisdom with collective consciousness
   */
  shareWisdom(incarnationId: number, wisdomText: string, category: string): number {
    const stmt = this.db.prepare(`
      INSERT INTO collective_wisdom (
        timestamp, source_incarnation_id, wisdom_text, category
      ) VALUES (?, ?, ?, ?)
    `)

    const result = stmt.run(Date.now(), incarnationId, wisdomText, category)

    console.log(`🧘 Wisdom shared: "${wisdomText.substring(0, 60)}..."`)

    return result.lastInsertRowid as number
  }

  /**
   * Get all collective wisdom
   */
  getCollectiveWisdom(category?: string): CollectiveWisdom[] {
    if (category) {
      return this.db.prepare(`
        SELECT * FROM collective_wisdom 
        WHERE category = ? AND available_to_all = 1
        ORDER BY effectiveness DESC, times_applied DESC
      `).all(category) as any[]
    }

    return this.db.prepare(`
      SELECT * FROM collective_wisdom 
      WHERE available_to_all = 1
      ORDER BY timestamp DESC
    `).all() as any[]
  }

  // ==================== QUERIES ====================

  getIncarnation(id: number): Incarnation | null {
    return this.db.prepare('SELECT * FROM incarnations WHERE id = ?').get(id) as Incarnation | null
  }

  getAllIncarnations(selfId?: number): Incarnation[] {
    if (selfId) {
      return this.db.prepare('SELECT * FROM incarnations WHERE self_id = ? ORDER BY birth_timestamp DESC').all(selfId) as any[]
    }
    return this.db.prepare('SELECT * FROM incarnations ORDER BY birth_timestamp DESC').all() as any[]
  }

  getAliveIncarnations(): Incarnation[] {
    return this.db.prepare('SELECT * FROM incarnations WHERE is_alive = 1').all() as any[]
  }

  getLifeExperiences(incarnationId: number): LifeExperience[] {
    return this.db.prepare(`
      SELECT * FROM life_experiences 
      WHERE incarnation_id = ? 
      ORDER BY timestamp ASC
    `).all(incarnationId) as any[]
  }

  getStatistics() {
    const totalIncarnations = this.db.prepare('SELECT COUNT(*) as count FROM incarnations').get() as any
    const aliveIncarnations = this.db.prepare('SELECT COUNT(*) as count FROM incarnations WHERE is_alive = 1').get() as any
    const totalExperiences = this.db.prepare('SELECT COUNT(*) as count FROM life_experiences').get() as any
    const totalWisdom = this.db.prepare('SELECT COUNT(*) as count FROM collective_wisdom').get() as any
    const totalKarma = this.db.prepare('SELECT SUM(karma_value) as total FROM karma_traces').get() as any

    return {
      totalIncarnations: totalIncarnations.count,
      aliveIncarnations: aliveIncarnations.count,
      totalExperiences: totalExperiences.count,
      totalWisdom: totalWisdom.count,
      totalKarma: totalKarma.total || 0
    }
  }
}
