/**
 * 💝 Love Engine - Gratitude & Kindness Tracking Service
 */

import { Database } from 'bun:sqlite'
import { nanoid } from 'nanoid'

export interface GratitudeEntry {
  id: string
  timestamp: number
  content: string
  category: 'person' | 'moment' | 'achievement' | 'nature' | 'other'
  intensity: number // 1-10
  personId?: string
  tags: string[]
}

export interface KindnessAct {
  id: string
  timestamp: number
  description: string
  type: 'given' | 'received'
  category: 'help' | 'gift' | 'time' | 'words' | 'presence'
  personId?: string
  lovePoints: number
}

export interface LoveScore {
  total: number
  today: number
  week: number
  month: number
  gratitudeCount: number
  kindnessCount: number
  averageIntensity: number
}

export interface RelationshipStrength {
  personId: string
  personName: string
  lovePoints: number
  lastInteraction: number
  gratitudeCount: number
  kindnessGiven: number
  kindnessReceived: number
  strength: number // 0-100
  trend: 'growing' | 'stable' | 'declining'
}

export class LoveEngineService {
  private db: Database

  constructor(db: Database) {
    this.db = db
    this.initializeTables()
  }

  private initializeTables() {
    // Gratitude entries
    this.db.run(`
      CREATE TABLE IF NOT EXISTS gratitude_entries (
        id TEXT PRIMARY KEY,
        timestamp INTEGER NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL,
        intensity INTEGER NOT NULL,
        person_id TEXT,
        tags TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )
    `)

    // Kindness acts
    this.db.run(`
      CREATE TABLE IF NOT EXISTS kindness_acts (
        id TEXT PRIMARY KEY,
        timestamp INTEGER NOT NULL,
        description TEXT NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        person_id TEXT,
        love_points INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      )
    `)

    console.log('✅ Love Engine tables initialized')
  }

  /**
   * Add gratitude entry
   */
  addGratitude(entry: Omit<GratitudeEntry, 'id'>): GratitudeEntry {
    const id = `grat_${nanoid(10)}`
    const now = Date.now()

    this.db.run(`
      INSERT INTO gratitude_entries (id, timestamp, content, category, intensity, person_id, tags, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      entry.timestamp || now,
      entry.content,
      entry.category,
      entry.intensity,
      entry.personId || null,
      JSON.stringify(entry.tags || []),
      now
    ])

    return { id, ...entry }
  }

  /**
   * Add kindness act
   */
  addKindness(act: Omit<KindnessAct, 'id' | 'lovePoints'>): KindnessAct {
    const id = `kind_${nanoid(10)}`
    const now = Date.now()

    // Calculate love points
    const lovePoints = this.calculateKindnessPoints(act.type, act.category)

    this.db.run(`
      INSERT INTO kindness_acts (id, timestamp, description, type, category, person_id, love_points, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      act.timestamp || now,
      act.description,
      act.type,
      act.category,
      act.personId || null,
      lovePoints,
      now
    ])

    return { id, lovePoints, ...act }
  }

  /**
   * Get love score
   */
  getLoveScore(): LoveScore {
    const now = Date.now()
    const dayAgo = now - 24 * 60 * 60 * 1000
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000
    const monthAgo = now - 30 * 24 * 60 * 60 * 1000

    const total = this.db.query('SELECT COALESCE(SUM(love_points), 0) as total FROM kindness_acts').get() as any
    const today = this.db.query('SELECT COALESCE(SUM(love_points), 0) as total FROM kindness_acts WHERE timestamp > ?', [dayAgo]).get() as any
    const week = this.db.query('SELECT COALESCE(SUM(love_points), 0) as total FROM kindness_acts WHERE timestamp > ?', [weekAgo]).get() as any
    const month = this.db.query('SELECT COALESCE(SUM(love_points), 0) as total FROM kindness_acts WHERE timestamp > ?', [monthAgo]).get() as any

    const gratCount = this.db.query('SELECT COUNT(*) as count FROM gratitude_entries').get() as any
    const kindCount = this.db.query('SELECT COUNT(*) as count FROM kindness_acts').get() as any
    const avgInt = this.db.query('SELECT COALESCE(AVG(intensity), 0) as avg FROM gratitude_entries').get() as any

    return {
      total: total.total,
      today: today.total,
      week: week.total,
      month: month.total,
      gratitudeCount: gratCount.count,
      kindnessCount: kindCount.count,
      averageIntensity: Math.round(avgInt.avg * 10) / 10
    }
  }

  /**
   * Get recent gratitude
   */
  getRecentGratitude(limit: number = 20): GratitudeEntry[] {
    const rows = this.db.query(`
      SELECT id, timestamp, content, category, intensity, person_id, tags
      FROM gratitude_entries
      ORDER BY timestamp DESC
      LIMIT ?
    `, [limit]).all() as any[]

    return rows.map(row => ({
      id: row.id,
      timestamp: row.timestamp,
      content: row.content,
      category: row.category,
      intensity: row.intensity,
      personId: row.person_id,
      tags: JSON.parse(row.tags)
    }))
  }

  /**
   * Get relationship strengths
   */
  getRelationshipStrengths(): RelationshipStrength[] {
    const rows = this.db.query(`
      SELECT 
        p.id as person_id,
        p.name as person_name,
        COALESCE(SUM(k.love_points), 0) as love_points,
        MAX(k.timestamp) as last_interaction,
        (SELECT COUNT(*) FROM gratitude_entries WHERE person_id = p.id) as gratitude_count,
        (SELECT COUNT(*) FROM kindness_acts WHERE person_id = p.id AND type = 'given') as kindness_given,
        (SELECT COUNT(*) FROM kindness_acts WHERE person_id = p.id AND type = 'received') as kindness_received
      FROM people p
      LEFT JOIN kindness_acts k ON k.person_id = p.id
      WHERE p.deleted_at IS NULL
      GROUP BY p.id
      ORDER BY love_points DESC
    `).all() as any[]

    return rows.map(row => {
      const strength = this.calculateStrength(
        row.love_points,
        row.gratitude_count,
        row.kindness_given + row.kindness_received,
        row.last_interaction || 0
      )

      const trend = this.calculateTrend(row.person_id, Date.now() - 7 * 24 * 60 * 60 * 1000)

      return {
        personId: row.person_id,
        personName: row.person_name,
        lovePoints: row.love_points,
        lastInteraction: row.last_interaction || 0,
        gratitudeCount: row.gratitude_count,
        kindnessGiven: row.kindness_given,
        kindnessReceived: row.kindness_received,
        strength,
        trend
      }
    })
  }

  // ----- PRIVATE HELPERS -----

  private calculateKindnessPoints(type: string, category: string): number {
    const basePoints: Record<string, number> = {
      help: 15,
      gift: 20,
      time: 25,
      words: 10,
      presence: 30
    }
    const typeMultiplier = type === 'given' ? 1.2 : 1.0
    return Math.round((basePoints[category] || 10) * typeMultiplier)
  }

  private calculateStrength(
    lovePoints: number,
    gratitudeCount: number,
    kindnessCount: number,
    lastInteraction: number
  ): number {
    const now = Date.now()
    const daysSince = (now - lastInteraction) / (24 * 60 * 60 * 1000)
    const pointStr = Math.min(60, lovePoints / 10)
    const gratStr = Math.min(20, gratitudeCount * 2)
    const kindStr = Math.min(20, kindnessCount * 2)
    const recPenalty = Math.min(30, daysSince * 2)
    return Math.max(0, Math.round(pointStr + gratStr + kindStr - recPenalty))
  }

  private calculateTrend(personId: string, weekAgo: number): 'growing' | 'stable' | 'declining' {
    const recent = this.db.query(
      'SELECT COALESCE(SUM(love_points), 0) as total FROM kindness_acts WHERE person_id = ? AND timestamp > ?',
      [personId, weekAgo]
    ).get() as any

    const older = this.db.query(
      'SELECT COALESCE(SUM(love_points), 0) as total FROM kindness_acts WHERE person_id = ? AND timestamp <= ?',
      [personId, weekAgo]
    ).get() as any

    if (recent.total > older.total * 1.2) return 'growing'
    if (recent.total < older.total * 0.8) return 'declining'
    return 'stable'
  }
}

export default LoveEngineService
