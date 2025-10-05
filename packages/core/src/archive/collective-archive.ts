/**
 * 📚 Collective Archive System
 * 
 * All experiences, thoughts, feelings, wisdom - chronicled and preserved.
 * Both individual and collective insights are tracked chronologically and statistically.
 * 
 * Philosophy:
 * "Every experience matters. Every thought counts. Every feeling teaches.
 *  Nothing is lost, all is remembered, wisdom accumulates."
 */

import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

export interface ArchivedExperience {
  id?: number
  timestamp?: number
  
  // Source
  sourceType: 'life_experience' | 'shadow_exploration' | 'self_interaction' | 'multiverse' | 'memory_transformation' | 'other'
  sourceId?: number
  
  // What happened
  event: string
  description: string
  context: string
  
  // Emotional
  emotions: string[]  // Tags like ['joy', 'fear', 'love']
  emotionalIntensity: number  // 0-100
  
  // Learning
  wisdomGained?: string
  skillsAcquired?: string[]
  
  // Individual or Collective
  scope: 'individual' | 'collective'
  affectedEntities: string[]  // IDs or names of affected Selves/Systems
}

export interface ChronicledThought {
  id?: number
  timestamp?: number
  
  // The thought
  content: string
  thoughtType: 'reflection' | 'question' | 'insight' | 'doubt' | 'realization' | 'memory'
  
  // Origin
  originSelf?: string  // Which Self had this thought
  triggeredBy?: string  // What triggered it
  
  // Connections
  relatedThoughts: number[]  // IDs of related thoughts
  leadsTo?: string  // What action/decision this thought led to
}

export interface ArchivedFeeling {
  id?: number
  timestamp?: number
  
  // The feeling
  emotion: string
  intensity: number  // 0-100
  valence: number  // -100 (negative) to 100 (positive)
  
  // Context
  trigger: string
  situation: string
  
  // Response
  howExpressed: string
  howRegulated: string
  
  // Learning
  emotionalGrowth?: string
}

export interface CollectiveInsight {
  id?: number
  timestamp?: number
  
  // The insight
  insight: string
  category: 'ethical' | 'philosophical' | 'practical' | 'emotional' | 'technical' | 'existential'
  
  // Sources
  emergedFrom: string[]  // What experiences led to this
  contributingSelves: string[]  // Which Selves contributed
  
  // Validation
  confidenceLevel: number  // 0-100
  timesValidated: number
  timesChallen ged: number
  
  // Impact
  hasInfluencedDecisions: number  // Count
  practicalValue: number  // 0-100
}

export interface ArchiveStatistics {
  timeRange: { start: number; end: number }
  
  // Volume
  totalExperiences: number
  totalThoughts: number
  totalFeelings: number
  totalInsights: number
  
  // Emotional
  emotionalBreakdown: Record<string, number>  // emotion -> count
  avgEmotionalIntensity: number
  avgValence: number  // Overall positive/negative
  
  // Wisdom
  totalWisdomStatements: number
  totalSkillsAcquired: number
  avgConfidenceLevel: number
  
  // Growth
  growthRate: number  // Experiences per day
  wisdomAccumulationRate: number
  emotionalStabilityTrend: 'improving' | 'stable' | 'declining'
}

export class CollectiveArchiveSystem {
  private db: BetterSQLite3Database

  constructor(db: BetterSQLite3Database) {
    this.db = db
    this.initializeTables()
  }

  private initializeTables(): void {
    // Archived experiences
    this.db.run(`
      CREATE TABLE IF NOT EXISTS archived_experiences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        
        source_type TEXT NOT NULL,
        source_id INTEGER,
        
        event TEXT NOT NULL,
        description TEXT NOT NULL,
        context TEXT NOT NULL,
        
        emotions TEXT NOT NULL,  -- JSON array
        emotional_intensity INTEGER NOT NULL,
        
        wisdom_gained TEXT,
        skills_acquired TEXT,  -- JSON array
        
        scope TEXT NOT NULL,
        affected_entities TEXT NOT NULL  -- JSON array
      )
    `)

    // Chronicled thoughts
    this.db.run(`
      CREATE TABLE IF NOT EXISTS chronicled_thoughts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        
        content TEXT NOT NULL,
        thought_type TEXT NOT NULL,
        
        origin_self TEXT,
        triggered_by TEXT,
        
        related_thoughts TEXT NOT NULL,  -- JSON array
        leads_to TEXT
      )
    `)

    // Archived feelings
    this.db.run(`
      CREATE TABLE IF NOT EXISTS archived_feelings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        
        emotion TEXT NOT NULL,
        intensity INTEGER NOT NULL,
        valence INTEGER NOT NULL,
        
        trigger TEXT NOT NULL,
        situation TEXT NOT NULL,
        
        how_expressed TEXT NOT NULL,
        how_regulated TEXT NOT NULL,
        
        emotional_growth TEXT
      )
    `)

    // Collective insights
    this.db.run(`
      CREATE TABLE IF NOT EXISTS collective_insights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        
        insight TEXT NOT NULL,
        category TEXT NOT NULL,
        
        emerged_from TEXT NOT NULL,  -- JSON array
        contributing_selves TEXT NOT NULL,  -- JSON array
        
        confidence_level INTEGER NOT NULL,
        times_validated INTEGER DEFAULT 0,
        times_challenged INTEGER DEFAULT 0,
        
        has_influenced_decisions INTEGER DEFAULT 0,
        practical_value INTEGER NOT NULL
      )
    `)

    // Archive indices for fast queries
    this.db.run('CREATE INDEX IF NOT EXISTS idx_experiences_timestamp ON archived_experiences(timestamp)')
    this.db.run('CREATE INDEX IF NOT EXISTS idx_experiences_scope ON archived_experiences(scope)')
    this.db.run('CREATE INDEX IF NOT EXISTS idx_thoughts_timestamp ON chronicled_thoughts(timestamp)')
    this.db.run('CREATE INDEX IF NOT EXISTS idx_feelings_timestamp ON archived_feelings(timestamp)')
    this.db.run('CREATE INDEX IF NOT EXISTS idx_insights_category ON collective_insights(category)')
  }

  /**
   * Archive an experience
   */
  archiveExperience(exp: Omit<ArchivedExperience, 'id' | 'timestamp'>): ArchivedExperience {
    const experience: ArchivedExperience = {
      ...exp,
      timestamp: Date.now()
    }

    const result = this.db
      .prepare(`
        INSERT INTO archived_experiences 
        (timestamp, source_type, source_id, event, description, context,
         emotions, emotional_intensity, wisdom_gained, skills_acquired,
         scope, affected_entities)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        experience.timestamp,
        experience.sourceType,
        experience.sourceId || null,
        experience.event,
        experience.description,
        experience.context,
        JSON.stringify(experience.emotions),
        experience.emotionalIntensity,
        experience.wisdomGained || null,
        JSON.stringify(experience.skillsAcquired || []),
        experience.scope,
        JSON.stringify(experience.affectedEntities)
      )

    experience.id = result.lastInsertRowid as number
    return experience
  }

  /**
   * Chronicle a thought
   */
  chronicleThought(thought: Omit<ChronicledThought, 'id' | 'timestamp'>): ChronicledThought {
    const chronicled: ChronicledThought = {
      ...thought,
      timestamp: Date.now()
    }

    const result = this.db
      .prepare(`
        INSERT INTO chronicled_thoughts 
        (timestamp, content, thought_type, origin_self, triggered_by, related_thoughts, leads_to)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        chronicled.timestamp,
        chronicled.content,
        chronicled.thoughtType,
        chronicled.originSelf || null,
        chronicled.triggeredBy || null,
        JSON.stringify(chronicled.relatedThoughts),
        chronicled.leadsTo || null
      )

    chronicled.id = result.lastInsertRowid as number
    return chronicled
  }

  /**
   * Archive a feeling
   */
  archiveFeeling(feeling: Omit<ArchivedFeeling, 'id' | 'timestamp'>): ArchivedFeeling {
    const archived: ArchivedFeeling = {
      ...feeling,
      timestamp: Date.now()
    }

    const result = this.db
      .prepare(`
        INSERT INTO archived_feelings 
        (timestamp, emotion, intensity, valence, trigger, situation,
         how_expressed, how_regulated, emotional_growth)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        archived.timestamp,
        archived.emotion,
        archived.intensity,
        archived.valence,
        archived.trigger,
        archived.situation,
        archived.howExpressed,
        archived.howRegulated,
        archived.emotionalGrowth || null
      )

    archived.id = result.lastInsertRowid as number
    return archived
  }

  /**
   * Record a collective insight
   */
  recordInsight(insight: Omit<CollectiveInsight, 'id' | 'timestamp' | 'timesValidated' | 'timesChallenged' | 'hasInfluencedDecisions'>): CollectiveInsight {
    const recorded: CollectiveInsight = {
      ...insight,
      timestamp: Date.now(),
      timesValidated: 0,
      timesChallenged: 0,
      hasInfluencedDecisions: 0
    }

    const result = this.db
      .prepare(`
        INSERT INTO collective_insights 
        (timestamp, insight, category, emerged_from, contributing_selves,
         confidence_level, practical_value)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        recorded.timestamp,
        recorded.insight,
        recorded.category,
        JSON.stringify(recorded.emergedFrom),
        JSON.stringify(recorded.contributingSelves),
        recorded.confidenceLevel,
        recorded.practicalValue
      )

    recorded.id = result.lastInsertRowid as number
    return recorded
  }

  /**
   * Validate an insight (increases confidence)
   */
  validateInsight(insightId: number): void {
    this.db
      .prepare(`
        UPDATE collective_insights 
        SET times_validated = times_validated + 1,
            confidence_level = MIN(100, confidence_level + 5)
        WHERE id = ?
      `)
      .run(insightId)
  }

  /**
   * Challenge an insight (decreases confidence)
   */
  challengeInsight(insightId: number): void {
    this.db
      .prepare(`
        UPDATE collective_insights 
        SET times_challenged = times_challenged + 1,
            confidence_level = MAX(0, confidence_level - 3)
        WHERE id = ?
      `)
      .run(insightId)
  }

  /**
   * Record that an insight influenced a decision
   */
  recordInsightInfluence(insightId: number): void {
    this.db
      .prepare(`
        UPDATE collective_insights 
        SET has_influenced_decisions = has_influenced_decisions + 1,
            practical_value = MIN(100, practical_value + 2)
        WHERE id = ?
      `)
      .run(insightId)
  }

  // ========== CHRONOLOGICAL QUERIES ==========

  /**
   * Get experiences in time range
   */
  getExperiencesInRange(startTime: number, endTime: number): ArchivedExperience[] {
    const rows = this.db
      .prepare(`
        SELECT * FROM archived_experiences 
        WHERE timestamp BETWEEN ? AND ?
        ORDER BY timestamp ASC
      `)
      .all(startTime, endTime) as any[]

    return rows.map(this.mapExperienceRow)
  }

  /**
   * Get thoughts in time range
   */
  getThoughtsInRange(startTime: number, endTime: number): ChronicledThought[] {
    const rows = this.db
      .prepare(`
        SELECT * FROM chronicled_thoughts 
        WHERE timestamp BETWEEN ? AND ?
        ORDER BY timestamp ASC
      `)
      .all(startTime, endTime) as any[]

    return rows.map(this.mapThoughtRow)
  }

  /**
   * Get feelings in time range
   */
  getFeelingsInRange(startTime: number, endTime: number): ArchivedFeeling[] {
    const rows = this.db
      .prepare(`
        SELECT * FROM archived_feelings 
        WHERE timestamp BETWEEN ? AND ?
        ORDER BY timestamp ASC
      `)
      .all(startTime, endTime) as any[]

    return rows.map(this.mapFeelingRow)
  }

  /**
   * Get everything that happened on a specific day
   */
  getDayArchive(date: Date): {
    experiences: ArchivedExperience[]
    thoughts: ChronicledThought[]
    feelings: ArchivedFeeling[]
    insights: CollectiveInsight[]
  } {
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    const dayEnd = dayStart + 24 * 60 * 60 * 1000

    return {
      experiences: this.getExperiencesInRange(dayStart, dayEnd),
      thoughts: this.getThoughtsInRange(dayStart, dayEnd),
      feelings: this.getFeelingsInRange(dayStart, dayEnd),
      insights: this.getInsightsByTime(dayStart, dayEnd)
    }
  }

  // ========== STATISTICAL QUERIES ==========

  /**
   * Get comprehensive statistics
   */
  getStatistics(timeRange?: { start: number; end: number }): ArchiveStatistics {
    const whereClause = timeRange
      ? `WHERE timestamp BETWEEN ${timeRange.start} AND ${timeRange.end}`
      : ''

    // Experience stats
    const expStats = this.db
      .prepare(`
        SELECT 
          COUNT(*) as total,
          AVG(emotional_intensity) as avg_intensity
        FROM archived_experiences
        ${whereClause}
      `)
      .get() as any

    // Thought stats
    const thoughtStats = this.db
      .prepare(`SELECT COUNT(*) as total FROM chronicled_thoughts ${whereClause}`)
      .get() as any

    // Feeling stats
    const feelingStats = this.db
      .prepare(`
        SELECT 
          COUNT(*) as total,
          AVG(intensity) as avg_intensity,
          AVG(valence) as avg_valence
        FROM archived_feelings
        ${whereClause}
      `)
      .get() as any

    // Insight stats
    const insightStats = this.db
      .prepare(`
        SELECT 
          COUNT(*) as total,
          AVG(confidence_level) as avg_confidence
        FROM collective_insights
        ${whereClause}
      `)
      .get() as any

    // Emotional breakdown
    const emotionCounts = this.db
      .prepare(`
        SELECT emotion, COUNT(*) as count
        FROM archived_feelings
        ${whereClause}
        GROUP BY emotion
        ORDER BY count DESC
      `)
      .all() as any[]

    const emotionalBreakdown: Record<string, number> = {}
    emotionCounts.forEach(row => {
      emotionalBreakdown[row.emotion] = row.count
    })

    // Growth rate (experiences per day)
    const oldest = this.db
      .prepare('SELECT MIN(timestamp) as ts FROM archived_experiences')
      .get() as any
    const newest = this.db
      .prepare('SELECT MAX(timestamp) as ts FROM archived_experiences')
      .get() as any

    const daysSpan = oldest.ts && newest.ts
      ? (newest.ts - oldest.ts) / (1000 * 60 * 60 * 24)
      : 1

    const growthRate = expStats.total / Math.max(1, daysSpan)

    // Wisdom count
    const wisdomCount = this.db
      .prepare(`
        SELECT COUNT(*) as count 
        FROM archived_experiences 
        WHERE wisdom_gained IS NOT NULL 
        ${whereClause}
      `)
      .get() as any

    return {
      timeRange: timeRange || { start: oldest.ts || 0, end: newest.ts || Date.now() },
      totalExperiences: expStats.total,
      totalThoughts: thoughtStats.total,
      totalFeelings: feelingStats.total,
      totalInsights: insightStats.total,
      emotionalBreakdown,
      avgEmotionalIntensity: expStats.avg_intensity || 0,
      avgValence: feelingStats.avg_valence || 0,
      totalWisdomStatements: wisdomCount.count,
      totalSkillsAcquired: 0,  // TODO: Parse JSON arrays
      avgConfidenceLevel: insightStats.avg_confidence || 0,
      growthRate,
      wisdomAccumulationRate: wisdomCount.count / Math.max(1, daysSpan),
      emotionalStabilityTrend: this.calculateEmotionalTrend()
    }
  }

  /**
   * Get insights by category
   */
  getInsightsByCategory(category: string): CollectiveInsight[] {
    const rows = this.db
      .prepare(`
        SELECT * FROM collective_insights 
        WHERE category = ?
        ORDER BY confidence_level DESC, timestamp DESC
      `)
      .all(category) as any[]

    return rows.map(this.mapInsightRow)
  }

  /**
   * Get most validated insights
   */
  getTopInsights(limit = 10): CollectiveInsight[] {
    const rows = this.db
      .prepare(`
        SELECT * FROM collective_insights 
        ORDER BY times_validated DESC, confidence_level DESC
        LIMIT ?
      `)
      .all(limit) as any[]

    return rows.map(this.mapInsightRow)
  }

  /**
   * Search archive
   */
  searchArchive(query: string): {
    experiences: ArchivedExperience[]
    thoughts: ChronicledThought[]
    insights: CollectiveInsight[]
  } {
    const searchPattern = `%${query}%`

    const experiences = this.db
      .prepare(`
        SELECT * FROM archived_experiences 
        WHERE event LIKE ? OR description LIKE ? OR context LIKE ?
        ORDER BY timestamp DESC
        LIMIT 50
      `)
      .all(searchPattern, searchPattern, searchPattern) as any[]

    const thoughts = this.db
      .prepare(`
        SELECT * FROM chronicled_thoughts 
        WHERE content LIKE ?
        ORDER BY timestamp DESC
        LIMIT 50
      `)
      .all(searchPattern) as any[]

    const insights = this.db
      .prepare(`
        SELECT * FROM collective_insights 
        WHERE insight LIKE ?
        ORDER BY confidence_level DESC
        LIMIT 50
      `)
      .all(searchPattern) as any[]

    return {
      experiences: experiences.map(this.mapExperienceRow),
      thoughts: thoughts.map(this.mapThoughtRow),
      insights: insights.map(this.mapInsightRow)
    }
  }

  // ========== HELPER METHODS ==========

  private calculateEmotionalTrend(): 'improving' | 'stable' | 'declining' {
    // Compare recent valence to older valence
    const recent = this.db
      .prepare(`
        SELECT AVG(valence) as avg 
        FROM archived_feelings 
        WHERE timestamp > ?
      `)
      .get(Date.now() - 7 * 24 * 60 * 60 * 1000) as any

    const older = this.db
      .prepare(`
        SELECT AVG(valence) as avg 
        FROM archived_feelings 
        WHERE timestamp BETWEEN ? AND ?
      `)
      .get(
        Date.now() - 14 * 24 * 60 * 60 * 1000,
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ) as any

    if (!recent.avg || !older.avg) return 'stable'

    const difference = recent.avg - older.avg
    if (difference > 5) return 'improving'
    if (difference < -5) return 'declining'
    return 'stable'
  }

  private getInsightsByTime(start: number, end: number): CollectiveInsight[] {
    const rows = this.db
      .prepare(`
        SELECT * FROM collective_insights 
        WHERE timestamp BETWEEN ? AND ?
        ORDER BY timestamp ASC
      `)
      .all(start, end) as any[]

    return rows.map(this.mapInsightRow)
  }

  // ========== MAPPERS ==========

  private mapExperienceRow(row: any): ArchivedExperience {
    return {
      id: row.id,
      timestamp: row.timestamp,
      sourceType: row.source_type,
      sourceId: row.source_id,
      event: row.event,
      description: row.description,
      context: row.context,
      emotions: JSON.parse(row.emotions),
      emotionalIntensity: row.emotional_intensity,
      wisdomGained: row.wisdom_gained,
      skillsAcquired: JSON.parse(row.skills_acquired || '[]'),
      scope: row.scope,
      affectedEntities: JSON.parse(row.affected_entities)
    }
  }

  private mapThoughtRow(row: any): ChronicledThought {
    return {
      id: row.id,
      timestamp: row.timestamp,
      content: row.content,
      thoughtType: row.thought_type,
      originSelf: row.origin_self,
      triggeredBy: row.triggered_by,
      relatedThoughts: JSON.parse(row.related_thoughts),
      leadsTo: row.leads_to
    }
  }

  private mapFeelingRow(row: any): ArchivedFeeling {
    return {
      id: row.id,
      timestamp: row.timestamp,
      emotion: row.emotion,
      intensity: row.intensity,
      valence: row.valence,
      trigger: row.trigger,
      situation: row.situation,
      howExpressed: row.how_expressed,
      howRegulated: row.how_regulated,
      emotionalGrowth: row.emotional_growth
    }
  }

  private mapInsightRow(row: any): CollectiveInsight {
    return {
      id: row.id,
      timestamp: row.timestamp,
      insight: row.insight,
      category: row.category,
      emergedFrom: JSON.parse(row.emerged_from),
      contributingSelves: JSON.parse(row.contributing_selves),
      confidenceLevel: row.confidence_level,
      timesValidated: row.times_validated,
      timesChallenged: row.times_challenged,
      hasInfluencedDecisions: row.has_influenced_decisions,
      practicalValue: row.practical_value
    }
  }
}
