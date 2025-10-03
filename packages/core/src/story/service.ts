/**
 * 📖 Story Service - Narrative Engine für Toobix Unified
 * Portiert von Version_7 mit Integration in People Module
 */

import { Database } from 'bun:sqlite'
import { nanoid } from 'nanoid'
import type {
  StoryState,
  StoryEvent,
  StoryOption,
  StoryResources,
  Companion,
  Buff,
  Skill,
  StoryArc,
  PersonStory,
  CreateStoryOptionInput,
  CreateStoryEventInput,
  CreateCompanionInput,
  CreateBuffInput,
  CreateSkillInput
} from './types.ts'

const ARC_ORDER: StoryArc[] = ['foundations', 'exploration', 'mastery']

const DEFAULT_RESOURCES: StoryResources = {
  energie: 80,
  wissen: 0,
  inspiration: 0,
  ruf: 0,
  stabilitaet: 0,
  erfahrung: 0,
  level: 1
}

export class StoryService {
  private db: Database

  constructor(db: Database) {
    this.db = db
    this.initializeTables()
  }

  private initializeTables() {
    // Story State
    this.db.run(`
      CREATE TABLE IF NOT EXISTS story_state (
        id INTEGER PRIMARY KEY DEFAULT 1,
        ts INTEGER NOT NULL,
        epoch INTEGER NOT NULL DEFAULT 0,
        mood TEXT NOT NULL DEFAULT 'calm',
        arc TEXT NOT NULL DEFAULT 'foundations',
        resources TEXT NOT NULL
      )
    `)

    // Story Events
    this.db.run(`
      CREATE TABLE IF NOT EXISTS story_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts INTEGER NOT NULL,
        epoch INTEGER NOT NULL,
        kind TEXT NOT NULL,
        text TEXT NOT NULL,
        mood TEXT NOT NULL,
        deltas TEXT,
        tags TEXT,
        option_ref TEXT,
        person_id TEXT
      )
    `)

    // Story Options
    this.db.run(`
      CREATE TABLE IF NOT EXISTS story_options (
        id TEXT PRIMARY KEY,
        created_at INTEGER NOT NULL,
        label TEXT NOT NULL,
        rationale TEXT,
        risk INTEGER DEFAULT 0,
        expected TEXT,
        tags TEXT,
        expires_at INTEGER
      )
    `)

    // Companions
    this.db.run(`
      CREATE TABLE IF NOT EXISTS story_companions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        archetype TEXT,
        mood TEXT,
        stats TEXT,
        acquired_at INTEGER NOT NULL,
        person_id TEXT
      )
    `)

    // Buffs
    this.db.run(`
      CREATE TABLE IF NOT EXISTS story_buffs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        kind TEXT,
        magnitude INTEGER,
        expires_at INTEGER,
        meta TEXT
      )
    `)

    // Skills
    this.db.run(`
      CREATE TABLE IF NOT EXISTS story_skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 0,
        updated_at INTEGER NOT NULL
      )
    `)

    // Initialize default state if not exists
    const state = this.db.query('SELECT id FROM story_state WHERE id = 1').get()
    if (!state) {
      this.db.run(
        'INSERT INTO story_state (id, ts, epoch, mood, arc, resources) VALUES (?, ?, ?, ?, ?, ?)',
        [1, Date.now(), 0, 'calm', 'foundations', JSON.stringify(DEFAULT_RESOURCES)]
      )
    }
  }

  /**
   * Get current story state
   */
  getState(): StoryState {
    const row = this.db.query('SELECT epoch, mood, arc, resources FROM story_state WHERE id = 1').get() as any
    
    const resources: StoryResources = JSON.parse(row.resources)
    const options = this.listOptions()
    const companions = this.loadCompanions()
    const buffs = this.loadBuffs()
    const skills = this.loadSkills()

    return {
      epoch: row.epoch,
      mood: row.mood,
      arc: row.arc as StoryArc,
      resources,
      options,
      companions,
      buffs,
      skills
    }
  }

  /**
   * List available story options
   */
  listOptions(): StoryOption[] {
    const now = Date.now()
    const rows = this.db.query(`
      SELECT id, label, rationale, risk, expected, tags, expires_at 
      FROM story_options 
      ORDER BY created_at DESC
    `).all() as any[]

    return rows
      .filter(row => !row.expires_at || row.expires_at > now)
      .map(row => ({
        id: row.id,
        label: row.label,
        rationale: row.rationale,
        risk: row.risk || 0,
        expected: row.expected ? JSON.parse(row.expected) : undefined,
        tags: row.tags ? JSON.parse(row.tags) : [],
        expiresAt: row.expires_at
      }))
  }

  /**
   * Generate new story options based on current state
   */
  generateOptions(state: StoryState): StoryOption[] {
    const opts: StoryOption[] = []
    const r = state.resources

    // Low energy → Rest option
    if (r.energie < 40) {
      opts.push({
        id: `opt_rest_${Date.now()}`,
        label: 'Meditieren und Energie sammeln',
        rationale: 'Niedrige Energie erkannt',
        risk: 0,
        expected: { energie: 15, inspiration: 2 },
        tags: ['resource:energie']
      })
    }

    // High inspiration, low knowledge → Convert
    if (r.inspiration > 10 && r.wissen < 50) {
      opts.push({
        id: `opt_write_${Date.now()}`,
        label: 'Ideen schriftlich strukturieren',
        rationale: 'Inspiration in Wissen umwandeln',
        risk: 1,
        expected: { inspiration: -5, wissen: 8, erfahrung: 5 },
        tags: ['convert', 'resource:wissen']
      })
    }

    // XP threshold reached → Level up
    const xpNeeded = r.level * 100
    if (r.erfahrung >= xpNeeded) {
      opts.push({
        id: `opt_level_${Date.now()}`,
        label: 'Reflektion und Level-Aufstieg',
        rationale: 'Erfahrungsschwelle erreicht',
        risk: 1,
        expected: { erfahrung: -xpNeeded, level: 1, stabilitaet: 5 },
        tags: ['levelup']
      })
    }

    // Default explore option
    if (opts.length === 0) {
      opts.push({
        id: `opt_explore_${Date.now()}`,
        label: 'Neuen Gedankenpfad erkunden',
        rationale: 'Kein dringendes Bedürfnis',
        risk: 1,
        expected: { inspiration: 5, energie: -5, erfahrung: 3 },
        tags: ['explore']
      })
    }

    return opts
  }

  /**
   * Persist options to database
   */
  persistOptions(options: StoryOption[]): void {
    const now = Date.now()
    for (const opt of options) {
      this.db.run(
        `INSERT OR REPLACE INTO story_options 
         (id, created_at, label, rationale, risk, expected, tags, expires_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          opt.id,
          now,
          opt.label,
          opt.rationale || null,
          opt.risk,
          opt.expected ? JSON.stringify(opt.expected) : null,
          JSON.stringify(opt.tags),
          opt.expiresAt || null
        ]
      )
    }
  }

  /**
   * Refresh story options (clear old, generate new)
   */
  refreshOptions(state: StoryState): StoryOption[] {
    this.db.run('DELETE FROM story_options')
    const opts = this.generateOptions(state)
    this.persistOptions(opts)
    return opts
  }

  /**
   * Apply a story option (make a choice)
   */
  applyOption(optionId: string): StoryEvent {
    const state = this.getState()
    
    const opt = this.db.query(
      'SELECT id, label, expected FROM story_options WHERE id = ?',
      [optionId]
    ).get() as any

    if (!opt) {
      throw new Error('Option not found')
    }

    const expected: Record<string, number> = opt.expected ? JSON.parse(opt.expected) : {}

    // Apply deltas to resources
    for (const [key, value] of Object.entries(expected)) {
      state.resources[key as keyof StoryResources] = 
        (state.resources[key as keyof StoryResources] || 0) + value
    }

    // Floor energy at 0
    if (state.resources.energie < 0) state.resources.energie = 0

    // Update state
    this.db.run(
      'UPDATE story_state SET resources = ?, ts = ? WHERE id = 1',
      [JSON.stringify(state.resources), Date.now()]
    )

    // Create event
    const eventId = this.createEvent({
      kind: 'action',
      text: opt.label,
      mood: state.mood,
      deltas: expected,
      tags: ['action'],
      optionRef: optionId
    })

    // Remove used option
    this.db.run('DELETE FROM story_options WHERE id = ?', [optionId])

    // Check for arc shift
    const newArc = this.evalArc(state.resources, state.arc)
    if (newArc !== state.arc) {
      this.createArcShiftEvent(state.arc, newArc, state.epoch, state.mood)
      this.db.run('UPDATE story_state SET arc = ? WHERE id = 1', [newArc])
    }

    return this.getEvent(eventId)!
  }

  /**
   * Story tick (time passes)
   */
  tick(): StoryEvent {
    const state = this.getState()
    
    // Increment epoch
    const newEpoch = state.epoch + 1
    
    // Energy decay
    state.resources.energie = Math.max(0, state.resources.energie - 1)
    
    // Check arc
    const newArc = this.evalArc(state.resources, state.arc)
    
    // Update state
    this.db.run(
      'UPDATE story_state SET epoch = ?, resources = ?, arc = ?, ts = ? WHERE id = 1',
      [newEpoch, JSON.stringify(state.resources), newArc, Date.now()]
    )

    // Create tick event
    const eventId = this.createEvent({
      kind: 'tick',
      text: 'Zeit vergeht',
      mood: state.mood,
      deltas: {},
      tags: ['tick']
    })

    // Arc shift if needed
    if (newArc !== state.arc) {
      return this.createArcShiftEvent(state.arc, newArc, newEpoch, state.mood)
    }

    return this.getEvent(eventId)!
  }

  /**
   * Get recent story events
   */
  getEvents(limit: number = 100): StoryEvent[] {
    const rows = this.db.query(`
      SELECT id, ts, epoch, kind, text, mood, deltas, tags, option_ref, person_id
      FROM story_events
      ORDER BY id DESC
      LIMIT ?
    `, [limit]).all() as any[]

    return rows.map(row => ({
      id: String(row.id),
      ts: row.ts,
      epoch: row.epoch,
      kind: row.kind,
      text: row.text,
      mood: row.mood,
      deltas: row.deltas ? JSON.parse(row.deltas) : undefined,
      tags: row.tags ? JSON.parse(row.tags) : [],
      optionRef: row.option_ref,
      personId: row.person_id
    }))
  }

  /**
   * Get single event
   */
  getEvent(id: string | number): StoryEvent | null {
    const row = this.db.query(`
      SELECT id, ts, epoch, kind, text, mood, deltas, tags, option_ref, person_id
      FROM story_events
      WHERE id = ?
    `, [id]).get() as any

    if (!row) return null

    return {
      id: String(row.id),
      ts: row.ts,
      epoch: row.epoch,
      kind: row.kind,
      text: row.text,
      mood: row.mood,
      deltas: row.deltas ? JSON.parse(row.deltas) : undefined,
      tags: row.tags ? JSON.parse(row.tags) : [],
      optionRef: row.option_ref,
      personId: row.person_id
    }
  }

  /**
   * Create a story event
   */
  createEvent(input: CreateStoryEventInput): string {
    const state = this.getState()
    const now = Date.now()

    const result = this.db.run(`
      INSERT INTO story_events (ts, epoch, kind, text, mood, deltas, tags, option_ref, person_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      now,
      state.epoch,
      input.kind,
      input.text,
      input.mood || state.mood,
      input.deltas ? JSON.stringify(input.deltas) : null,
      input.tags ? JSON.stringify(input.tags) : null,
      input.optionRef || null,
      input.personId || null
    ])

    return String(result.lastInsertRowid)
  }

  /**
   * Get story for a specific person
   */
  getPersonStory(personId: string): PersonStory {
    const events = this.db.query(`
      SELECT id, ts, epoch, kind, text, mood, deltas, tags, option_ref
      FROM story_events
      WHERE person_id = ?
      ORDER BY id DESC
      LIMIT 100
    `, [personId]).all() as any[]

    const totalXP = events.reduce((sum, e) => {
      const deltas = e.deltas ? JSON.parse(e.deltas) : {}
      return sum + (deltas.erfahrung || 0)
    }, 0)

    const currentLevel = Math.floor(totalXP / 100) + 1

    // Get person name from people table
    const person = this.db.query('SELECT name FROM people WHERE id = ?', [personId]).get() as any
    const personName = person?.name || 'Unknown'

    // Determine arc based on level
    let currentArc: StoryArc = 'foundations'
    if (currentLevel >= 10) currentArc = 'mastery'
    else if (currentLevel >= 3) currentArc = 'exploration'

    return {
      personId,
      personName,
      currentArc,
      totalEvents: events.length,
      totalXP,
      currentLevel,
      lastEventAt: events[0]?.ts || 0,
      keyMoments: events.slice(0, 10).map(row => ({
        id: String(row.id),
        ts: row.ts,
        epoch: row.epoch,
        kind: row.kind,
        text: row.text,
        mood: row.mood,
        deltas: row.deltas ? JSON.parse(row.deltas) : undefined,
        tags: row.tags ? JSON.parse(row.tags) : [],
        optionRef: row.option_ref,
        personId
      }))
    }
  }

  /**
   * Link story event to person
   */
  linkEventToPerson(eventId: string, personId: string): void {
    this.db.run(
      'UPDATE story_events SET person_id = ? WHERE id = ?',
      [personId, eventId]
    )
  }

  // ----- HELPERS -----

  private evalArc(resources: StoryResources, currentArc: StoryArc): StoryArc {
    const level = resources.level || 1
    if (level >= 10) return 'mastery'
    if (level >= 3) return 'exploration'
    return 'foundations'
  }

  private createArcShiftEvent(prevArc: StoryArc, newArc: StoryArc, epoch: number, mood: string): StoryEvent {
    const text = `Arc-Wechsel: ${prevArc} → ${newArc}`
    const eventId = this.createEvent({
      kind: 'arc_shift',
      text,
      mood,
      deltas: {},
      tags: ['arc_shift']
    })

    return this.getEvent(eventId)!
  }

  private loadCompanions(): Companion[] {
    const rows = this.db.query(`
      SELECT id, name, archetype, mood, stats, acquired_at, person_id
      FROM story_companions
      ORDER BY id ASC
    `).all() as any[]

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      archetype: row.archetype,
      mood: row.mood,
      stats: row.stats ? JSON.parse(row.stats) : undefined,
      acquiredAt: row.acquired_at,
      personId: row.person_id
    }))
  }

  private loadBuffs(): Buff[] {
    const rows = this.db.query(`
      SELECT id, label, kind, magnitude, expires_at, meta
      FROM story_buffs
      ORDER BY id ASC
    `).all() as any[]

    return rows.map(row => ({
      id: row.id,
      label: row.label,
      kind: row.kind,
      magnitude: row.magnitude,
      expiresAt: row.expires_at,
      meta: row.meta ? JSON.parse(row.meta) : undefined
    }))
  }

  private loadSkills(): Skill[] {
    const rows = this.db.query(`
      SELECT id, name, level, xp, category, updated_at
      FROM story_skills
      ORDER BY id ASC
    `).all() as any[]

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      level: row.level || 1,
      xp: row.xp || 0,
      updatedAt: row.updated_at
    }))
  }

  // ----- META SYSTEMS -----

  /**
   * Add companion
   */
  addCompanion(input: CreateCompanionInput): Companion {
    const now = Date.now()
    const result = this.db.run(`
      INSERT INTO story_companions (name, archetype, mood, stats, acquired_at, person_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      input.name,
      input.archetype || null,
      input.mood || null,
      input.stats ? JSON.stringify(input.stats) : null,
      now,
      input.personId || null
    ])

    return {
      id: Number(result.lastInsertRowid),
      name: input.name,
      archetype: input.archetype,
      mood: input.mood,
      stats: input.stats,
      acquiredAt: now,
      personId: input.personId
    }
  }

  /**
   * Add buff
   */
  addBuff(input: CreateBuffInput): Buff {
    const result = this.db.run(`
      INSERT INTO story_buffs (label, kind, magnitude, expires_at, meta)
      VALUES (?, ?, ?, ?, ?)
    `, [
      input.label,
      input.kind || null,
      input.magnitude || null,
      input.expiresAt || null,
      input.meta ? JSON.stringify(input.meta) : null
    ])

    return {
      id: Number(result.lastInsertRowid),
      label: input.label,
      kind: input.kind,
      magnitude: input.magnitude,
      expiresAt: input.expiresAt,
      meta: input.meta
    }
  }

  /**
   * Add or update skill
   */
  addSkill(input: CreateSkillInput): Skill {
    const now = Date.now()
    
    // Check if skill exists
    const existing = this.db.query(
      'SELECT id, level, xp FROM story_skills WHERE name = ?',
      [input.name]
    ).get() as any

    if (existing) {
      // Update existing
      const newLevel = input.level !== undefined ? input.level : existing.level
      const newXP = input.xp !== undefined ? input.xp : existing.xp

      this.db.run(`
        UPDATE story_skills 
        SET level = ?, xp = ?, category = ?, updated_at = ?
        WHERE id = ?
      `, [newLevel, newXP, input.category || null, now, existing.id])

      return {
        id: existing.id,
        name: input.name,
        category: input.category,
        level: newLevel,
        xp: newXP,
        updatedAt: now
      }
    }

    // Create new
    const result = this.db.run(`
      INSERT INTO story_skills (name, level, xp, category, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `, [
      input.name,
      input.level || 1,
      input.xp || 0,
      input.category || null,
      now
    ])

    return {
      id: Number(result.lastInsertRowid),
      name: input.name,
      category: input.category,
      level: input.level || 1,
      xp: input.xp || 0,
      updatedAt: now
    }
  }

  /**
   * Reset story state
   */
  reset(): void {
    this.db.run('DELETE FROM story_events')
    this.db.run('DELETE FROM story_options')
    this.db.run('DELETE FROM story_companions')
    this.db.run('DELETE FROM story_buffs')
    this.db.run('DELETE FROM story_skills')
    this.db.run(
      'UPDATE story_state SET epoch = 0, mood = ?, arc = ?, resources = ?, ts = ? WHERE id = 1',
      ['calm', 'foundations', JSON.stringify(DEFAULT_RESOURCES), Date.now()]
    )
  }
}
