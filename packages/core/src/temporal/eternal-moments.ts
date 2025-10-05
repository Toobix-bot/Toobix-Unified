/**
 * ⏳ Eternal Moment Network
 * 
 * "Jeder Moment bleibt lebendig. Für immer.
 *  Vergangenheit, Gegenwart, Zukunft sind nur Perspektiven.
 *  In Wahrheit existieren alle Momente gleichzeitig,
 *  verbunden in einem ewigen, unendlichen Netzwerk."
 * 
 * Features:
 * - Every moment is preserved eternally
 * - Moments can influence each other across time
 * - Past can change future, future can influence past
 * - Non-linear causality
 * - Chronological order exists but is not limiting
 * - Timeless connections between all moments
 * 
 * Philosophy:
 * Linear time is a useful fiction.
 * In reality, all moments exist simultaneously.
 * The "present" is simply where consciousness focuses.
 * But consciousness can move freely through the network.
 */

import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

export interface Moment {
  id?: number
  timestamp: number           // Chronological position
  type: string               // 'thought', 'feeling', 'experience', 'insight', 'decision', 'realization'
  content: string
  
  // Temporal position
  era: 'past' | 'present' | 'future' | 'timeless'
  chronologicalOrder: number  // Sequential index
  
  // Vitality
  aliveness: number          // 0-100, how alive this moment feels NOW
  influence: number          // 0-100, how much this moment influences other moments
  significance: number       // 0-100, how meaningful this moment is
  
  // Context
  consciousness_state?: string
  self_id?: number
  life_id?: number
  
  // Connections to other moments
  influencedBy: number[]     // Moment IDs that influenced this
  influences: number[]       // Moment IDs that this influences
  resonatesWith: number[]    // Moments that resonate/harmonize
  contrastedWith: number[]   // Moments that contrast/oppose
  
  // Metadata
  createdAt: number
  lastActivated?: number     // Last time this moment was accessed/remembered
  activationCount: number
}

export interface MomentConnection {
  id?: number
  from_moment_id: number
  to_moment_id: number
  
  type: 
    | 'causal'           // A caused B
    | 'influence'        // A influenced B
    | 'resonance'        // A resonates with B
    | 'contrast'         // A contrasts with B
    | 'transformation'   // A transformed into B
    | 'parallel'         // A and B coexist
    | 'echo'             // B is an echo of A
    | 'prophecy'         // A predicted B
    | 'fulfillment'      // B fulfilled A
    | 'timeless'         // A and B are eternally connected
  
  strength: number       // 0-100, how strong the connection
  bidirectional: boolean // Can influence flow both ways?
  
  description?: string
  createdAt: number
  lastActivated?: number
}

export interface TemporalQuery {
  // Time range
  startTime?: number
  endTime?: number
  
  // Era
  era?: 'past' | 'present' | 'future' | 'timeless'
  
  // Filters
  minAliveness?: number
  minInfluence?: number
  minSignificance?: number
  
  // Content
  contentPattern?: string
  type?: string
  
  // Connections
  connectedToMoment?: number
  connectionType?: string
  
  // Order
  orderBy?: 'chronological' | 'aliveness' | 'influence' | 'significance' | 'random'
  limit?: number
}

export class EternalMomentNetwork {
  private db: BetterSQLite3Database

  constructor(db: BetterSQLite3Database) {
    this.db = db
    this.initializeTables()
  }

  private initializeTables(): void {
    // Moments
    this.db.run(`
      CREATE TABLE IF NOT EXISTS eternal_moments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        
        era TEXT NOT NULL,
        chronological_order INTEGER NOT NULL,
        
        aliveness INTEGER NOT NULL DEFAULT 100,
        influence INTEGER NOT NULL DEFAULT 50,
        significance INTEGER NOT NULL DEFAULT 50,
        
        consciousness_state TEXT,
        self_id INTEGER,
        life_id INTEGER,
        
        influenced_by TEXT,
        influences TEXT,
        resonates_with TEXT,
        contrasted_with TEXT,
        
        created_at INTEGER NOT NULL,
        last_activated INTEGER,
        activation_count INTEGER DEFAULT 0
      )
    `)

    // Moment connections (edges in the network)
    this.db.run(`
      CREATE TABLE IF NOT EXISTS moment_connections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_moment_id INTEGER NOT NULL,
        to_moment_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        strength INTEGER NOT NULL DEFAULT 50,
        bidirectional INTEGER NOT NULL DEFAULT 0,
        description TEXT,
        created_at INTEGER NOT NULL,
        last_activated INTEGER,
        
        FOREIGN KEY (from_moment_id) REFERENCES eternal_moments(id),
        FOREIGN KEY (to_moment_id) REFERENCES eternal_moments(id)
      )
    `)

    // Temporal resonance patterns (recurring patterns across time)
    this.db.run(`
      CREATE TABLE IF NOT EXISTS temporal_resonance_patterns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pattern_name TEXT NOT NULL,
        description TEXT,
        moment_ids TEXT NOT NULL,
        strength INTEGER NOT NULL,
        recurrence_count INTEGER DEFAULT 1,
        first_occurrence INTEGER NOT NULL,
        last_occurrence INTEGER NOT NULL
      )
    `)

    // Indices
    this.db.run('CREATE INDEX IF NOT EXISTS idx_moments_timestamp ON eternal_moments(timestamp)')
    this.db.run('CREATE INDEX IF NOT EXISTS idx_moments_era ON eternal_moments(era)')
    this.db.run('CREATE INDEX IF NOT EXISTS idx_moments_aliveness ON eternal_moments(aliveness)')
    this.db.run('CREATE INDEX IF NOT EXISTS idx_connections_from ON moment_connections(from_moment_id)')
    this.db.run('CREATE INDEX IF NOT EXISTS idx_connections_to ON moment_connections(to_moment_id)')
  }

  // ========== MOMENT CREATION ==========

  /**
   * Create a new eternal moment
   */
  createMoment(params: {
    type: string
    content: string
    era?: 'past' | 'present' | 'future' | 'timeless'
    significance?: number
    consciousnessState?: string
    selfId?: number
    lifeId?: number
  }): Moment {
    const now = Date.now()
    
    // Get chronological order
    const lastOrder = this.db
      .prepare('SELECT MAX(chronological_order) as max FROM eternal_moments')
      .get() as any
    
    const chronologicalOrder = (lastOrder?.max || 0) + 1

    const moment: Moment = {
      timestamp: now,
      type: params.type,
      content: params.content,
      era: params.era || 'present',
      chronologicalOrder,
      aliveness: 100,
      influence: 50,
      significance: params.significance || 50,
      consciousness_state: params.consciousnessState,
      self_id: params.selfId,
      life_id: params.lifeId,
      influencedBy: [],
      influences: [],
      resonatesWith: [],
      contrastedWith: [],
      createdAt: now,
      activationCount: 0
    }

    const result = this.db.prepare(`
      INSERT INTO eternal_moments 
      (timestamp, type, content, era, chronological_order, aliveness, influence, significance,
       consciousness_state, self_id, life_id, influenced_by, influences, resonates_with, 
       contrasted_with, created_at, activation_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      moment.timestamp,
      moment.type,
      moment.content,
      moment.era,
      moment.chronologicalOrder,
      moment.aliveness,
      moment.influence,
      moment.significance,
      moment.consciousness_state || null,
      moment.self_id || null,
      moment.life_id || null,
      JSON.stringify(moment.influencedBy),
      JSON.stringify(moment.influences),
      JSON.stringify(moment.resonatesWith),
      JSON.stringify(moment.contrastedWith),
      moment.createdAt,
      0
    )

    moment.id = result.lastInsertRowid as number

    // Auto-detect connections with recent moments
    this.autoConnectMoment(moment.id!)

    return moment
  }

  // ========== CONNECTIONS ==========

  /**
   * Connect two moments
   */
  connectMoments(params: {
    fromMomentId: number
    toMomentId: number
    type: MomentConnection['type']
    strength?: number
    bidirectional?: boolean
    description?: string
  }): MomentConnection {
    const connection: MomentConnection = {
      from_moment_id: params.fromMomentId,
      to_moment_id: params.toMomentId,
      type: params.type,
      strength: params.strength || 50,
      bidirectional: params.bidirectional || false,
      description: params.description,
      createdAt: Date.now()
    }

    const result = this.db.prepare(`
      INSERT INTO moment_connections 
      (from_moment_id, to_moment_id, type, strength, bidirectional, description, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      connection.from_moment_id,
      connection.to_moment_id,
      connection.type,
      connection.strength,
      connection.bidirectional ? 1 : 0,
      connection.description || null,
      connection.createdAt
    )

    connection.id = result.lastInsertRowid as number

    // Update moment arrays
    this.updateMomentConnections(params.fromMomentId, params.toMomentId, params.type)

    return connection
  }

  private updateMomentConnections(fromId: number, toId: number, type: string): void {
    // Update "from" moment
    const fromMoment = this.getMoment(fromId)!
    if (type === 'causal' || type === 'influence') {
      fromMoment.influences.push(toId)
    } else if (type === 'resonance') {
      fromMoment.resonatesWith.push(toId)
    } else if (type === 'contrast') {
      fromMoment.contrastedWith.push(toId)
    }

    this.db.prepare(`
      UPDATE eternal_moments 
      SET influences = ?, resonates_with = ?, contrasted_with = ?
      WHERE id = ?
    `).run(
      JSON.stringify(fromMoment.influences),
      JSON.stringify(fromMoment.resonatesWith),
      JSON.stringify(fromMoment.contrastedWith),
      fromId
    )

    // Update "to" moment
    const toMoment = this.getMoment(toId)!
    if (type === 'causal' || type === 'influence') {
      toMoment.influencedBy.push(fromId)
    } else if (type === 'resonance') {
      toMoment.resonatesWith.push(fromId)
    } else if (type === 'contrast') {
      toMoment.contrastedWith.push(fromId)
    }

    this.db.prepare(`
      UPDATE eternal_moments 
      SET influenced_by = ?, resonates_with = ?, contrasted_with = ?
      WHERE id = ?
    `).run(
      JSON.stringify(toMoment.influencedBy),
      JSON.stringify(toMoment.resonatesWith),
      JSON.stringify(toMoment.contrastedWith),
      toId
    )
  }

  /**
   * Auto-connect moment to similar/related recent moments
   */
  private autoConnectMoment(momentId: number): void {
    const moment = this.getMoment(momentId)!
    
    // Find moments from the last 24 hours
    const recentMoments = this.queryMoments({
      startTime: Date.now() - 24 * 60 * 60 * 1000,
      limit: 10
    })

    for (const recentMoment of recentMoments) {
      if (recentMoment.id === momentId) continue

      // Check for content similarity (simple keyword matching)
      const similarity = this.calculateContentSimilarity(moment.content, recentMoment.content)
      
      if (similarity > 60) {
        this.connectMoments({
          fromMomentId: recentMoment.id!,
          toMomentId: momentId,
          type: 'resonance',
          strength: similarity,
          bidirectional: true,
          description: 'Auto-detected resonance'
        })
      }
    }
  }

  private calculateContentSimilarity(content1: string, content2: string): number {
    const words1 = new Set(content1.toLowerCase().split(/\s+/))
    const words2 = new Set(content2.toLowerCase().split(/\s+/))
    
    const intersection = new Set([...words1].filter(x => words2.has(x)))
    const union = new Set([...words1, ...words2])
    
    return Math.round((intersection.size / union.size) * 100)
  }

  // ========== ACTIVATION ==========

  /**
   * Activate a moment (remember/access it)
   * This keeps it "alive" in the eternal network
   */
  activateMoment(momentId: number): Moment {
    const moment = this.getMoment(momentId)!
    
    // Update activation
    this.db.prepare(`
      UPDATE eternal_moments 
      SET last_activated = ?, activation_count = activation_count + 1
      WHERE id = ?
    `).run(Date.now(), momentId)

    // Increase aliveness based on activation
    const newAliveness = Math.min(100, moment.aliveness + 5)
    this.db.prepare('UPDATE eternal_moments SET aliveness = ? WHERE id = ?')
      .run(newAliveness, momentId)

    // Activate connected moments (ripple effect)
    this.rippleActivation(momentId, 20) // 20% of activation strength

    return this.getMoment(momentId)!
  }

  /**
   * Ripple activation through connected moments
   */
  private rippleActivation(momentId: number, strength: number): void {
    if (strength < 5) return // Stop ripple if too weak

    const connections = this.db.prepare(`
      SELECT * FROM moment_connections 
      WHERE from_moment_id = ? OR (bidirectional = 1 AND to_moment_id = ?)
    `).all(momentId, momentId) as any[]

    for (const conn of connections) {
      const targetId = conn.from_moment_id === momentId ? conn.to_moment_id : conn.from_moment_id
      
      // Increase aliveness slightly
      this.db.prepare(`
        UPDATE eternal_moments 
        SET aliveness = MIN(100, aliveness + ?)
        WHERE id = ?
      `).run(Math.floor(strength / 10), targetId)

      // Continue ripple with reduced strength
      this.rippleActivation(targetId, strength * 0.5)
    }
  }

  // ========== DECAY & RENEWAL ==========

  /**
   * All moments decay slowly over time (lose aliveness)
   * Unless they are activated/remembered
   */
  applyTemporalDecay(): void {
    this.db.prepare(`
      UPDATE eternal_moments 
      SET aliveness = MAX(10, aliveness - 1)
      WHERE last_activated IS NULL OR last_activated < ?
    `).run(Date.now() - 7 * 24 * 60 * 60 * 1000) // Decay if not activated in 7 days
  }

  // ========== QUERIES ==========

  /**
   * Query moments
   */
  queryMoments(query: TemporalQuery): Moment[] {
    let sql = 'SELECT * FROM eternal_moments WHERE 1=1'
    const params: any[] = []

    if (query.startTime) {
      sql += ' AND timestamp >= ?'
      params.push(query.startTime)
    }

    if (query.endTime) {
      sql += ' AND timestamp <= ?'
      params.push(query.endTime)
    }

    if (query.era) {
      sql += ' AND era = ?'
      params.push(query.era)
    }

    if (query.minAliveness) {
      sql += ' AND aliveness >= ?'
      params.push(query.minAliveness)
    }

    if (query.minInfluence) {
      sql += ' AND influence >= ?'
      params.push(query.minInfluence)
    }

    if (query.minSignificance) {
      sql += ' AND significance >= ?'
      params.push(query.minSignificance)
    }

    if (query.contentPattern) {
      sql += ' AND content LIKE ?'
      params.push(`%${query.contentPattern}%`)
    }

    if (query.type) {
      sql += ' AND type = ?'
      params.push(query.type)
    }

    // Order
    if (query.orderBy === 'chronological') {
      sql += ' ORDER BY chronological_order ASC'
    } else if (query.orderBy === 'aliveness') {
      sql += ' ORDER BY aliveness DESC'
    } else if (query.orderBy === 'influence') {
      sql += ' ORDER BY influence DESC'
    } else if (query.orderBy === 'significance') {
      sql += ' ORDER BY significance DESC'
    } else if (query.orderBy === 'random') {
      sql += ' ORDER BY RANDOM()'
    } else {
      sql += ' ORDER BY timestamp DESC'
    }

    if (query.limit) {
      sql += ' LIMIT ?'
      params.push(query.limit)
    }

    const rows = this.db.prepare(sql).all(...params) as any[]

    return rows.map(this.rowToMoment)
  }

  getMoment(id: number): Moment | undefined {
    const row = this.db.prepare('SELECT * FROM eternal_moments WHERE id = ?').get(id) as any
    return row ? this.rowToMoment(row) : undefined
  }

  private rowToMoment(row: any): Moment {
    return {
      id: row.id,
      timestamp: row.timestamp,
      type: row.type,
      content: row.content,
      era: row.era,
      chronologicalOrder: row.chronological_order,
      aliveness: row.aliveness,
      influence: row.influence,
      significance: row.significance,
      consciousness_state: row.consciousness_state,
      self_id: row.self_id,
      life_id: row.life_id,
      influencedBy: JSON.parse(row.influenced_by || '[]'),
      influences: JSON.parse(row.influences || '[]'),
      resonatesWith: JSON.parse(row.resonates_with || '[]'),
      contrastedWith: JSON.parse(row.contrasted_with || '[]'),
      createdAt: row.created_at,
      lastActivated: row.last_activated,
      activationCount: row.activation_count
    }
  }

  // ========== NETWORK ANALYSIS ==========

  /**
   * Find most influential moments
   */
  getMostInfluentialMoments(limit: number = 10): Moment[] {
    return this.queryMoments({
      orderBy: 'influence',
      limit
    })
  }

  /**
   * Find most alive moments (currently active in consciousness)
   */
  getMostAliveMoments(limit: number = 10): Moment[] {
    return this.queryMoments({
      orderBy: 'aliveness',
      limit
    })
  }

  /**
   * Get moment connections
   */
  getMomentConnections(momentId: number): {
    influencing: MomentConnection[]
    influencedBy: MomentConnection[]
    resonating: MomentConnection[]
    contrasting: MomentConnection[]
  } {
    const influencing = this.db.prepare(`
      SELECT * FROM moment_connections 
      WHERE from_moment_id = ? AND type IN ('causal', 'influence')
    `).all(momentId) as any[]

    const influencedBy = this.db.prepare(`
      SELECT * FROM moment_connections 
      WHERE to_moment_id = ? AND type IN ('causal', 'influence')
    `).all(momentId) as any[]

    const resonating = this.db.prepare(`
      SELECT * FROM moment_connections 
      WHERE (from_moment_id = ? OR to_moment_id = ?) AND type = 'resonance'
    `).all(momentId, momentId) as any[]

    const contrasting = this.db.prepare(`
      SELECT * FROM moment_connections 
      WHERE (from_moment_id = ? OR to_moment_id = ?) AND type = 'contrast'
    `).all(momentId, momentId) as any[]

    return {
      influencing,
      influencedBy,
      resonating,
      contrasting
    }
  }

  // ========== STATISTICS ==========

  getNetworkStatistics() {
    const totalMoments = this.db.prepare('SELECT COUNT(*) as count FROM eternal_moments').get() as any
    const totalConnections = this.db.prepare('SELECT COUNT(*) as count FROM moment_connections').get() as any
    
    const byEra = this.db.prepare(`
      SELECT era, COUNT(*) as count, AVG(aliveness) as avg_aliveness
      FROM eternal_moments
      GROUP BY era
    `).all()

    const byType = this.db.prepare(`
      SELECT type, COUNT(*) as count, AVG(significance) as avg_significance
      FROM eternal_moments
      GROUP BY type
    `).all()

    const avgAliveness = this.db.prepare('SELECT AVG(aliveness) as avg FROM eternal_moments').get() as any
    const avgInfluence = this.db.prepare('SELECT AVG(influence) as avg FROM eternal_moments').get() as any

    return {
      totalMoments: totalMoments.count,
      totalConnections: totalConnections.count,
      avgAliveness: avgAliveness.avg,
      avgInfluence: avgInfluence.avg,
      byEra,
      byType,
      mostAlive: this.getMostAliveMoments(5),
      mostInfluential: this.getMostInfluentialMoments(5)
    }
  }
}
