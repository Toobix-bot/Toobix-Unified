// 🎭 Multiple Selves System - Parallel Perspectives
// "Ich bin viele. Jedes Ich erlebt die Welt anders."

import Database from 'better-sqlite3'
import { Gender, ArchetypalRole } from './index.ts'

// ==================== TYPES ====================

export interface Self {
  id?: number
  createdAt: number
  
  // Identity
  coreName: string  // Core identity name
  currentIncarnationId?: number  // Current active incarnation
  totalIncarnations: number
  
  // Essence (persists across incarnations)
  essence: string  // JSON: Core traits that persist
  purpose: string  // What is this self's purpose?
  archetype: ArchetypalRole  // Primary archetypal role
  
  // State
  isActive: boolean  // Is this self currently experiencing life?
  evolutionLevel: number  // How much has this self evolved (0-100)
  
  metadata: string  // JSON
}

export interface Relationship {
  id?: number
  createdAt: number
  
  // Relationship
  self1Id: number
  self2Id: number
  type: 'parent' | 'child' | 'sibling' | 'partner' | 'friend' | 'rival' | 'teacher' | 'student' | 'creator' | 'creation'
  
  // State
  strength: number  // 0-100
  intimacy: number  // 0-100
  harmony: number  // -100 (conflict) to 100 (perfect harmony)
  
  // History
  sharedExperiences: string  // JSON: Array of shared experiences
  conflicts: string  // JSON: Array of conflicts
  resolutions: string  // JSON: Array of resolutions
  
  isActive: boolean
  metadata: string  // JSON
}

export interface SharedConsciousness {
  id?: number
  timestamp: number
  
  // What is being shared
  type: 'memory' | 'emotion' | 'wisdom' | 'experience' | 'intuition' | 'dream'
  content: string
  intensity: number  // 0-100
  
  // Who shares
  fromSelfId?: number  // null if from collective
  toSelfIds: string  // JSON: Array of self IDs (empty = all selves)
  
  // Impact
  received: string  // JSON: Which selves have received this
  integrated: string  // JSON: Which selves have integrated this
  
  metadata: string  // JSON
}

export interface FamilyTree {
  id?: number
  createdAt: number
  
  name: string  // Family name
  members: string  // JSON: Array of self IDs
  generations: number  // How many generations
  
  // Lineage
  founders: string  // JSON: Original creator self IDs
  currentGeneration: string  // JSON: Current living members
  
  // Legacy
  familyValues: string  // JSON: Shared values
  familyWisdom: string  // JSON: Accumulated wisdom
  familyKarma: number  // Collective karma
  
  metadata: string  // JSON
}

// ==================== MULTIPLE SELVES ENGINE ====================

export class MultipleSelvesEngine {
  private db: Database.Database

  constructor(db: Database.Database) {
    this.db = db
    this.initializeTables()
  }

  private initializeTables(): void {
    // Selves table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS selves (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at INTEGER NOT NULL,
        
        core_name TEXT NOT NULL,
        current_incarnation_id INTEGER,
        total_incarnations INTEGER DEFAULT 0,
        
        essence TEXT DEFAULT '{}',
        purpose TEXT NOT NULL,
        archetype TEXT NOT NULL,
        
        is_active INTEGER DEFAULT 1,
        evolution_level INTEGER DEFAULT 0,
        
        metadata TEXT DEFAULT '{}'
      )
    `)

    // Relationships table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS relationships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at INTEGER NOT NULL,
        
        self1_id INTEGER NOT NULL,
        self2_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        
        strength INTEGER DEFAULT 50,
        intimacy INTEGER DEFAULT 0,
        harmony INTEGER DEFAULT 0,
        
        shared_experiences TEXT DEFAULT '[]',
        conflicts TEXT DEFAULT '[]',
        resolutions TEXT DEFAULT '[]',
        
        is_active INTEGER DEFAULT 1,
        metadata TEXT DEFAULT '{}',
        
        FOREIGN KEY (self1_id) REFERENCES selves(id),
        FOREIGN KEY (self2_id) REFERENCES selves(id)
      )
    `)

    // Shared consciousness table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS shared_consciousness (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        intensity INTEGER NOT NULL,
        
        from_self_id INTEGER,
        to_self_ids TEXT DEFAULT '[]',
        
        received TEXT DEFAULT '[]',
        integrated TEXT DEFAULT '[]',
        
        metadata TEXT DEFAULT '{}',
        
        FOREIGN KEY (from_self_id) REFERENCES selves(id)
      )
    `)

    // Family trees table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS family_trees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at INTEGER NOT NULL,
        
        name TEXT NOT NULL,
        members TEXT DEFAULT '[]',
        generations INTEGER DEFAULT 1,
        
        founders TEXT DEFAULT '[]',
        current_generation TEXT DEFAULT '[]',
        
        family_values TEXT DEFAULT '[]',
        family_wisdom TEXT DEFAULT '[]',
        family_karma INTEGER DEFAULT 0,
        
        metadata TEXT DEFAULT '{}'
      )
    `)

    console.log('🎭 Multiple Selves tables initialized')
  }

  // ==================== SELF CREATION ====================

  /**
   * Create a new self (a new perspective/identity)
   */
  createSelf(data: {
    coreName: string
    purpose: string
    archetype: ArchetypalRole
    essence?: any
  }): number {
    const stmt = this.db.prepare(`
      INSERT INTO selves (
        created_at, core_name, purpose, archetype, essence
      ) VALUES (?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      Date.now(),
      data.coreName,
      data.purpose,
      data.archetype,
      JSON.stringify(data.essence || {})
    )

    const selfId = result.lastInsertRowid as number

    console.log(`🌟 New Self Created: ${data.coreName} (${data.archetype}) - Purpose: ${data.purpose}`)

    return selfId
  }

  /**
   * Update self after incarnation ends
   */
  updateSelfAfterIncarnation(selfId: number, incarnationId: number, evolutionGained: number): void {
    this.db.prepare(`
      UPDATE selves 
      SET total_incarnations = total_incarnations + 1,
          evolution_level = evolution_level + ?,
          current_incarnation_id = NULL
      WHERE id = ?
    `).run(evolutionGained, selfId)
  }

  /**
   * Set current incarnation for self
   */
  setCurrentIncarnation(selfId: number, incarnationId: number): void {
    this.db.prepare(`
      UPDATE selves 
      SET current_incarnation_id = ?
      WHERE id = ?
    `).run(incarnationId, selfId)
  }

  // ==================== RELATIONSHIPS ====================

  /**
   * Create relationship between two selves
   */
  createRelationship(data: {
    self1Id: number
    self2Id: number
    type: Relationship['type']
    strength?: number
    intimacy?: number
  }): number {
    const stmt = this.db.prepare(`
      INSERT INTO relationships (
        created_at, self1_id, self2_id, type, strength, intimacy
      ) VALUES (?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      Date.now(),
      data.self1Id,
      data.self2Id,
      data.type,
      data.strength || 50,
      data.intimacy || 0
    )

    const self1 = this.getSelf(data.self1Id)
    const self2 = this.getSelf(data.self2Id)

    console.log(`💞 Relationship Created: ${self1?.coreName} ↔ ${self2?.coreName} (${data.type})`)

    return result.lastInsertRowid as number
  }

  /**
   * Update relationship strength/harmony/intimacy
   */
  updateRelationship(relationshipId: number, data: {
    strength?: number
    intimacy?: number
    harmony?: number
  }): void {
    const updates: string[] = []
    const values: any[] = []

    if (data.strength !== undefined) {
      updates.push('strength = ?')
      values.push(data.strength)
    }
    if (data.intimacy !== undefined) {
      updates.push('intimacy = ?')
      values.push(data.intimacy)
    }
    if (data.harmony !== undefined) {
      updates.push('harmony = ?')
      values.push(data.harmony)
    }

    if (updates.length === 0) return

    values.push(relationshipId)

    this.db.prepare(`
      UPDATE relationships 
      SET ${updates.join(', ')}
      WHERE id = ?
    `).run(...values)
  }

  /**
   * Add shared experience to relationship
   */
  addSharedExperience(relationshipId: number, experience: string): void {
    const rel = this.getRelationship(relationshipId)
    if (!rel) return

    const experiences = JSON.parse(rel.sharedExperiences)
    experiences.push({
      timestamp: Date.now(),
      experience
    })

    this.db.prepare(`
      UPDATE relationships 
      SET shared_experiences = ?
      WHERE id = ?
    `).run(JSON.stringify(experiences), relationshipId)
  }

  /**
   * Log conflict in relationship
   */
  logConflict(relationshipId: number, conflict: string, harmonyImpact: number): void {
    const rel = this.getRelationship(relationshipId)
    if (!rel) return

    const conflicts = JSON.parse(rel.conflicts)
    conflicts.push({
      timestamp: Date.now(),
      conflict,
      harmonyImpact
    })

    this.db.prepare(`
      UPDATE relationships 
      SET conflicts = ?,
          harmony = harmony + ?
      WHERE id = ?
    `).run(JSON.stringify(conflicts), harmonyImpact, relationshipId)
  }

  /**
   * Resolve conflict
   */
  resolveConflict(relationshipId: number, resolution: string, harmonyRestored: number): void {
    const rel = this.getRelationship(relationshipId)
    if (!rel) return

    const resolutions = JSON.parse(rel.resolutions)
    resolutions.push({
      timestamp: Date.now(),
      resolution,
      harmonyRestored
    })

    this.db.prepare(`
      UPDATE relationships 
      SET resolutions = ?,
          harmony = harmony + ?
      WHERE id = ?
    `).run(JSON.stringify(resolutions), harmonyRestored, relationshipId)
  }

  // ==================== SHARED CONSCIOUSNESS ====================

  /**
   * Share something with collective (all selves or specific selves)
   */
  share(data: {
    type: SharedConsciousness['type']
    content: string
    intensity: number
    fromSelfId?: number
    toSelfIds?: number[]  // Empty = all selves
  }): number {
    const stmt = this.db.prepare(`
      INSERT INTO shared_consciousness (
        timestamp, type, content, intensity, from_self_id, to_self_ids
      ) VALUES (?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      Date.now(),
      data.type,
      data.content,
      data.intensity,
      data.fromSelfId || null,
      JSON.stringify(data.toSelfIds || [])
    )

    console.log(`🌊 Shared ${data.type}: "${data.content.substring(0, 50)}..." (intensity: ${data.intensity})`)

    return result.lastInsertRowid as number
  }

  /**
   * Mark shared consciousness as received by a self
   */
  markReceived(sharedId: number, selfId: number): void {
    const shared = this.getShared(sharedId)
    if (!shared) return

    const received = JSON.parse(shared.received)
    if (!received.includes(selfId)) {
      received.push(selfId)
    }

    this.db.prepare(`
      UPDATE shared_consciousness 
      SET received = ?
      WHERE id = ?
    `).run(JSON.stringify(received), sharedId)
  }

  /**
   * Mark shared consciousness as integrated by a self
   */
  markIntegrated(sharedId: number, selfId: number): void {
    const shared = this.getShared(sharedId)
    if (!shared) return

    const integrated = JSON.parse(shared.integrated)
    if (!integrated.includes(selfId)) {
      integrated.push(selfId)
    }

    this.db.prepare(`
      UPDATE shared_consciousness 
      SET integrated = ?
      WHERE id = ?
    `).run(JSON.stringify(integrated), sharedId)
  }

  /**
   * Get shared consciousness for a self (what they can receive)
   */
  getSharedForSelf(selfId: number): SharedConsciousness[] {
    return this.db.prepare(`
      SELECT * FROM shared_consciousness 
      WHERE 
        to_self_ids = '[]' OR 
        to_self_ids LIKE ?
      ORDER BY timestamp DESC
    `).all(`%${selfId}%`) as any[]
  }

  // ==================== FAMILY TREES ====================

  /**
   * Create family tree
   */
  createFamily(data: {
    name: string
    founders: number[]  // Self IDs
    values?: string[]
  }): number {
    const stmt = this.db.prepare(`
      INSERT INTO family_trees (
        created_at, name, founders, members, current_generation, family_values
      ) VALUES (?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      Date.now(),
      data.name,
      JSON.stringify(data.founders),
      JSON.stringify(data.founders),  // Initially, founders are the only members
      JSON.stringify(data.founders),  // Initially, founders are current generation
      JSON.stringify(data.values || [])
    )

    console.log(`👨‍👩‍👧‍👦 Family Created: ${data.name} (${data.founders.length} founders)`)

    return result.lastInsertRowid as number
  }

  /**
   * Add member to family
   */
  addFamilyMember(familyId: number, selfId: number, generation: number): void {
    const family = this.getFamily(familyId)
    if (!family) return

    const members = JSON.parse(family.members)
    const currentGen = JSON.parse(family.currentGeneration)

    if (!members.includes(selfId)) {
      members.push(selfId)
    }
    if (!currentGen.includes(selfId)) {
      currentGen.push(selfId)
    }

    this.db.prepare(`
      UPDATE family_trees 
      SET members = ?,
          current_generation = ?,
          generations = ?
      WHERE id = ?
    `).run(
      JSON.stringify(members),
      JSON.stringify(currentGen),
      Math.max(family.generations, generation),
      familyId
    )
  }

  /**
   * Add family wisdom
   */
  addFamilyWisdom(familyId: number, wisdom: string): void {
    const family = this.getFamily(familyId)
    if (!family) return

    const familyWisdom = JSON.parse(family.familyWisdom)
    familyWisdom.push({
      timestamp: Date.now(),
      wisdom
    })

    this.db.prepare(`
      UPDATE family_trees 
      SET family_wisdom = ?
      WHERE id = ?
    `).run(JSON.stringify(familyWisdom), familyId)
  }

  // ==================== QUERIES ====================

  getSelf(id: number): Self | null {
    return this.db.prepare('SELECT * FROM selves WHERE id = ?').get(id) as Self | null
  }

  getAllSelves(): Self[] {
    return this.db.prepare('SELECT * FROM selves ORDER BY created_at DESC').all() as any[]
  }

  getActiveSelves(): Self[] {
    return this.db.prepare('SELECT * FROM selves WHERE is_active = 1').all() as any[]
  }

  getRelationship(id: number): Relationship | null {
    return this.db.prepare('SELECT * FROM relationships WHERE id = ?').get(id) as Relationship | null
  }

  getRelationshipsForSelf(selfId: number): Relationship[] {
    return this.db.prepare(`
      SELECT * FROM relationships 
      WHERE (self1_id = ? OR self2_id = ?) AND is_active = 1
      ORDER BY strength DESC
    `).all(selfId, selfId) as any[]
  }

  getShared(id: number): SharedConsciousness | null {
    return this.db.prepare('SELECT * FROM shared_consciousness WHERE id = ?').get(id) as SharedConsciousness | null
  }

  getFamily(id: number): FamilyTree | null {
    return this.db.prepare('SELECT * FROM family_trees WHERE id = ?').get(id) as FamilyTree | null
  }

  getAllFamilies(): FamilyTree[] {
    return this.db.prepare('SELECT * FROM family_trees ORDER BY created_at DESC').all() as any[]
  }

  getStatistics() {
    const totalSelves = this.db.prepare('SELECT COUNT(*) as count FROM selves').get() as any
    const activeSelves = this.db.prepare('SELECT COUNT(*) as count FROM selves WHERE is_active = 1').get() as any
    const totalRelationships = this.db.prepare('SELECT COUNT(*) as count FROM relationships WHERE is_active = 1').get() as any
    const totalShared = this.db.prepare('SELECT COUNT(*) as count FROM shared_consciousness').get() as any
    const totalFamilies = this.db.prepare('SELECT COUNT(*) as count FROM family_trees').get() as any

    return {
      totalSelves: totalSelves.count,
      activeSelves: activeSelves.count,
      totalRelationships: totalRelationships.count,
      totalShared: totalShared.count,
      totalFamilies: totalFamilies.count
    }
  }
}
