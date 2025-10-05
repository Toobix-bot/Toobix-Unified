/**
 * 🌐 Local vs Collective System
 * 
 * "Das System existiert gleichzeitig als:
 *  - Private lokale offline Version (persönlich, geheim, individuell)
 *  - Öffentliche kollektive online Version (geteilt, gemeinsam, universell)
 *  - Hybrid-Zustände dazwischen (teilweise geteilt, selektiv synchronisiert)
 * 
 * Jede Version hat ihre eigene Identität, aber sie können kommunizieren,
 * lernen voneinander, und sich gegenseitig beeinflussen."
 * 
 * Features:
 * - Local version: Python standalone, no internet, personal data only
 * - Collective version: Online, shared experiences, collective wisdom
 * - Hybrid modes: Selective sync, privacy levels, data sharing preferences
 * - Version branches: Old/Current/Future with stability markers
 * 
 * Philosophy:
 * "The self is both private and collective.
 *  We need solitude to discover who we are.
 *  We need connection to become who we can be.
 *  Both are essential. Neither is complete alone."
 */

import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

export type VersionType = 
  | 'local_offline'      // Fully private, no sync
  | 'local_selective'    // Private with selective sharing
  | 'hybrid'             // Mixed local/collective
  | 'collective_filtered' // Collective with privacy filters
  | 'collective_full'    // Fully public/shared

export type VersionBranch =
  | 'archive'      // Old versions (read-only, historical)
  | 'stable'       // Current production version (marked, always active)
  | 'beta'         // Testing version (features being validated)
  | 'prototype'    // Future experimental version
  | 'potential'    // Possible future directions (not yet built)

export interface SystemVersion {
  id?: number
  name: string
  description: string
  
  // Version info
  versionNumber: string    // e.g., "1.0.0", "2.0.0-beta", "future-3.0"
  branch: VersionBranch
  type: VersionType
  
  // Status
  isActive: boolean
  isStable: boolean
  isPublic: boolean
  
  // Timestamps
  createdAt: number
  activatedAt?: number
  deprecatedAt?: number
  
  // Features (what this version has)
  features: string[]       // Feature flags
  capabilities: string[]   // What it can do
  
  // Data
  hasLocalData: boolean
  hasCollectiveData: boolean
  syncEnabled: boolean
  
  // Privacy
  privacyLevel: number     // 0-100, 0=fully private, 100=fully public
  dataSharing: {
    experiences: boolean
    thoughts: boolean
    feelings: boolean
    insights: boolean
    memories: boolean
  }
  
  // Statistics
  userCount?: number
  dataSize?: number        // bytes
  lastSync?: number
}

export interface VersionSyncEvent {
  id?: number
  fromVersionId: number
  toVersionId: number
  timestamp: number
  
  // What was synced
  dataType: 'experience' | 'thought' | 'feeling' | 'insight' | 'memory' | 'all'
  itemsCount: number
  dataSize: number         // bytes
  
  // Direction
  direction: 'upload' | 'download' | 'bidirectional'
  
  // Privacy
  privacyFiltered: boolean
  itemsFiltered: number
  
  // Result
  success: boolean
  error?: string
}

export interface FeatureMigration {
  id?: number
  featureName: string
  description: string
  
  // Source
  sourceVersionId: number
  sourceBranch: VersionBranch
  
  // Destination
  targetVersionId: number
  targetBranch: VersionBranch
  
  // Status
  status: 'proposed' | 'testing' | 'approved' | 'migrated' | 'rejected'
  
  // Timestamps
  proposedAt: number
  approvedAt?: number
  migratedAt?: number
  
  // Impact
  impactLevel: 'minor' | 'moderate' | 'major' | 'breaking'
  affectedSystems: string[]
}

export class LocalCollectiveSystem {
  private db: BetterSQLite3Database
  private currentVersionId?: number

  constructor(db: BetterSQLite3Database) {
    this.db = db
    this.initializeTables()
  }

  private initializeTables(): void {
    // System versions
    this.db.run(`
      CREATE TABLE IF NOT EXISTS system_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        
        version_number TEXT NOT NULL,
        branch TEXT NOT NULL,
        type TEXT NOT NULL,
        
        is_active INTEGER NOT NULL DEFAULT 0,
        is_stable INTEGER NOT NULL DEFAULT 0,
        is_public INTEGER NOT NULL DEFAULT 0,
        
        created_at INTEGER NOT NULL,
        activated_at INTEGER,
        deprecated_at INTEGER,
        
        features TEXT NOT NULL,
        capabilities TEXT NOT NULL,
        
        has_local_data INTEGER NOT NULL DEFAULT 1,
        has_collective_data INTEGER NOT NULL DEFAULT 0,
        sync_enabled INTEGER NOT NULL DEFAULT 0,
        
        privacy_level INTEGER NOT NULL DEFAULT 0,
        data_sharing TEXT NOT NULL,
        
        user_count INTEGER DEFAULT 0,
        data_size INTEGER DEFAULT 0,
        last_sync INTEGER
      )
    `)

    // Version sync events
    this.db.run(`
      CREATE TABLE IF NOT EXISTS version_sync_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_version_id INTEGER NOT NULL,
        to_version_id INTEGER NOT NULL,
        timestamp INTEGER NOT NULL,
        
        data_type TEXT NOT NULL,
        items_count INTEGER NOT NULL,
        data_size INTEGER NOT NULL,
        
        direction TEXT NOT NULL,
        
        privacy_filtered INTEGER NOT NULL DEFAULT 0,
        items_filtered INTEGER DEFAULT 0,
        
        success INTEGER NOT NULL DEFAULT 1,
        error TEXT,
        
        FOREIGN KEY (from_version_id) REFERENCES system_versions(id),
        FOREIGN KEY (to_version_id) REFERENCES system_versions(id)
      )
    `)

    // Feature migrations (cherry-picking from future to present)
    this.db.run(`
      CREATE TABLE IF NOT EXISTS feature_migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        feature_name TEXT NOT NULL,
        description TEXT,
        
        source_version_id INTEGER NOT NULL,
        source_branch TEXT NOT NULL,
        
        target_version_id INTEGER NOT NULL,
        target_branch TEXT NOT NULL,
        
        status TEXT NOT NULL DEFAULT 'proposed',
        
        proposed_at INTEGER NOT NULL,
        approved_at INTEGER,
        migrated_at INTEGER,
        
        impact_level TEXT NOT NULL,
        affected_systems TEXT NOT NULL,
        
        FOREIGN KEY (source_version_id) REFERENCES system_versions(id),
        FOREIGN KEY (target_version_id) REFERENCES system_versions(id)
      )
    `)

    // Indices
    this.db.run('CREATE INDEX IF NOT EXISTS idx_versions_branch ON system_versions(branch)')
    this.db.run('CREATE INDEX IF NOT EXISTS idx_versions_type ON system_versions(type)')
    this.db.run('CREATE INDEX IF NOT EXISTS idx_versions_active ON system_versions(is_active)')
  }

  // ========== VERSION MANAGEMENT ==========

  /**
   * Create new system version
   */
  createVersion(params: {
    name: string
    description: string
    versionNumber: string
    branch: VersionBranch
    type: VersionType
    features?: string[]
    capabilities?: string[]
    privacyLevel?: number
    dataSharing?: Partial<SystemVersion['dataSharing']>
  }): SystemVersion {
    const version: SystemVersion = {
      name: params.name,
      description: params.description,
      versionNumber: params.versionNumber,
      branch: params.branch,
      type: params.type,
      isActive: params.branch === 'stable',
      isStable: params.branch === 'stable',
      isPublic: params.type.includes('collective'),
      createdAt: Date.now(),
      features: params.features || [],
      capabilities: params.capabilities || [],
      hasLocalData: true,
      hasCollectiveData: params.type.includes('collective'),
      syncEnabled: params.type !== 'local_offline',
      privacyLevel: params.privacyLevel ?? (params.type === 'local_offline' ? 0 : 50),
      dataSharing: {
        experiences: false,
        thoughts: false,
        feelings: false,
        insights: false,
        memories: false,
        ...params.dataSharing
      }
    }

    const result = this.db.prepare(`
      INSERT INTO system_versions 
      (name, description, version_number, branch, type, is_active, is_stable, is_public,
       created_at, features, capabilities, has_local_data, has_collective_data, sync_enabled,
       privacy_level, data_sharing)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      version.name,
      version.description,
      version.versionNumber,
      version.branch,
      version.type,
      version.isActive ? 1 : 0,
      version.isStable ? 1 : 0,
      version.isPublic ? 1 : 0,
      version.createdAt,
      JSON.stringify(version.features),
      JSON.stringify(version.capabilities),
      1,
      version.hasCollectiveData ? 1 : 0,
      version.syncEnabled ? 1 : 0,
      version.privacyLevel,
      JSON.stringify(version.dataSharing)
    )

    version.id = result.lastInsertRowid as number

    return version
  }

  /**
   * Get current stable version
   */
  getCurrentVersion(): SystemVersion | undefined {
    const row = this.db.prepare(`
      SELECT * FROM system_versions 
      WHERE branch = 'stable' AND is_active = 1
      ORDER BY created_at DESC
      LIMIT 1
    `).get() as any

    return row ? this.rowToVersion(row) : undefined
  }

  /**
   * Get all versions
   */
  getAllVersions(branch?: VersionBranch): SystemVersion[] {
    const sql = branch
      ? 'SELECT * FROM system_versions WHERE branch = ? ORDER BY created_at DESC'
      : 'SELECT * FROM system_versions ORDER BY created_at DESC'
    
    const rows = branch
      ? this.db.prepare(sql).all(branch) as any[]
      : this.db.prepare(sql).all() as any[]

    return rows.map(this.rowToVersion)
  }

  /**
   * Activate version (switch to it)
   */
  activateVersion(versionId: number): void {
    // Deactivate current version
    if (this.currentVersionId) {
      this.db.prepare('UPDATE system_versions SET is_active = 0 WHERE id = ?')
        .run(this.currentVersionId)
    }

    // Activate new version
    this.db.prepare('UPDATE system_versions SET is_active = 1, activated_at = ? WHERE id = ?')
      .run(Date.now(), versionId)

    this.currentVersionId = versionId
  }

  /**
   * Deprecate version
   */
  deprecateVersion(versionId: number): void {
    this.db.prepare('UPDATE system_versions SET is_active = 0, deprecated_at = ? WHERE id = ?')
      .run(Date.now(), versionId)
  }

  // ========== SYNCHRONIZATION ==========

  /**
   * Sync data between versions
   */
  syncVersions(params: {
    fromVersionId: number
    toVersionId: number
    dataType: VersionSyncEvent['dataType']
    direction: 'upload' | 'download' | 'bidirectional'
    respectPrivacy?: boolean
  }): VersionSyncEvent {
    const fromVersion = this.getVersion(params.fromVersionId)!
    const toVersion = this.getVersion(params.toVersionId)!

    // Check if sync is allowed
    if (!fromVersion.syncEnabled || !toVersion.syncEnabled) {
      throw new Error('Sync not enabled for one or both versions')
    }

    // Privacy filtering
    let itemsFiltered = 0
    let privacyFiltered = false

    if (params.respectPrivacy !== false) {
      // Check data sharing settings
      const canShare = fromVersion.dataSharing[
        params.dataType === 'all' ? 'experiences' : params.dataType
      ]

      if (!canShare && fromVersion.privacyLevel < 50) {
        privacyFiltered = true
        itemsFiltered = Math.floor(Math.random() * 10) // Simulated
      }
    }

    const event: VersionSyncEvent = {
      fromVersionId: params.fromVersionId,
      toVersionId: params.toVersionId,
      timestamp: Date.now(),
      dataType: params.dataType,
      itemsCount: 100, // Simulated
      dataSize: 1024 * 100, // Simulated 100KB
      direction: params.direction,
      privacyFiltered,
      itemsFiltered,
      success: true
    }

    const result = this.db.prepare(`
      INSERT INTO version_sync_events 
      (from_version_id, to_version_id, timestamp, data_type, items_count, data_size,
       direction, privacy_filtered, items_filtered, success)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      event.fromVersionId,
      event.toVersionId,
      event.timestamp,
      event.dataType,
      event.itemsCount,
      event.dataSize,
      event.direction,
      event.privacyFiltered ? 1 : 0,
      event.itemsFiltered,
      1
    )

    event.id = result.lastInsertRowid as number

    // Update last_sync
    this.db.prepare('UPDATE system_versions SET last_sync = ? WHERE id IN (?, ?)')
      .run(Date.now(), params.fromVersionId, params.toVersionId)

    return event
  }

  /**
   * Get sync history
   */
  getSyncHistory(versionId?: number, limit: number = 50): VersionSyncEvent[] {
    const sql = versionId
      ? `SELECT * FROM version_sync_events 
         WHERE from_version_id = ? OR to_version_id = ?
         ORDER BY timestamp DESC LIMIT ?`
      : `SELECT * FROM version_sync_events ORDER BY timestamp DESC LIMIT ?`

    const rows = versionId
      ? this.db.prepare(sql).all(versionId, versionId, limit) as any[]
      : this.db.prepare(sql).all(limit) as any[]

    return rows.map(this.rowToSyncEvent)
  }

  // ========== FEATURE MIGRATION ==========

  /**
   * Propose feature migration (cherry-pick from future/prototype to current)
   */
  proposeFeatureMigration(params: {
    featureName: string
    description: string
    sourceVersionId: number
    targetVersionId: number
    impactLevel: 'minor' | 'moderate' | 'major' | 'breaking'
    affectedSystems: string[]
  }): FeatureMigration {
    const sourceVersion = this.getVersion(params.sourceVersionId)!
    const targetVersion = this.getVersion(params.targetVersionId)!

    const migration: FeatureMigration = {
      featureName: params.featureName,
      description: params.description,
      sourceVersionId: params.sourceVersionId,
      sourceBranch: sourceVersion.branch,
      targetVersionId: params.targetVersionId,
      targetBranch: targetVersion.branch,
      status: 'proposed',
      proposedAt: Date.now(),
      impactLevel: params.impactLevel,
      affectedSystems: params.affectedSystems
    }

    const result = this.db.prepare(`
      INSERT INTO feature_migrations 
      (feature_name, description, source_version_id, source_branch, target_version_id,
       target_branch, status, proposed_at, impact_level, affected_systems)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      migration.featureName,
      migration.description,
      migration.sourceVersionId,
      migration.sourceBranch,
      migration.targetVersionId,
      migration.targetBranch,
      migration.status,
      migration.proposedAt,
      migration.impactLevel,
      JSON.stringify(migration.affectedSystems)
    )

    migration.id = result.lastInsertRowid as number

    return migration
  }

  /**
   * Approve feature migration
   */
  approveFeatureMigration(migrationId: number): void {
    this.db.prepare(`
      UPDATE feature_migrations 
      SET status = 'approved', approved_at = ?
      WHERE id = ?
    `).run(Date.now(), migrationId)
  }

  /**
   * Complete feature migration
   */
  completeFeatureMigration(migrationId: number): void {
    const migration = this.getMigration(migrationId)!
    
    // Add feature to target version
    const targetVersion = this.getVersion(migration.targetVersionId)!
    if (!targetVersion.features.includes(migration.featureName)) {
      targetVersion.features.push(migration.featureName)
      
      this.db.prepare('UPDATE system_versions SET features = ? WHERE id = ?')
        .run(JSON.stringify(targetVersion.features), migration.targetVersionId)
    }

    // Update migration status
    this.db.prepare(`
      UPDATE feature_migrations 
      SET status = 'migrated', migrated_at = ?
      WHERE id = ?
    `).run(Date.now(), migrationId)
  }

  /**
   * Get pending migrations
   */
  getPendingMigrations(): FeatureMigration[] {
    const rows = this.db.prepare(`
      SELECT * FROM feature_migrations 
      WHERE status IN ('proposed', 'testing', 'approved')
      ORDER BY proposed_at DESC
    `).all() as any[]

    return rows.map(this.rowToMigration)
  }

  // ========== HELPERS ==========

  getVersion(id: number): SystemVersion | undefined {
    const row = this.db.prepare('SELECT * FROM system_versions WHERE id = ?').get(id) as any
    return row ? this.rowToVersion(row) : undefined
  }

  getMigration(id: number): FeatureMigration | undefined {
    const row = this.db.prepare('SELECT * FROM feature_migrations WHERE id = ?').get(id) as any
    return row ? this.rowToMigration(row) : undefined
  }

  private rowToVersion(row: any): SystemVersion {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      versionNumber: row.version_number,
      branch: row.branch,
      type: row.type,
      isActive: row.is_active === 1,
      isStable: row.is_stable === 1,
      isPublic: row.is_public === 1,
      createdAt: row.created_at,
      activatedAt: row.activated_at,
      deprecatedAt: row.deprecated_at,
      features: JSON.parse(row.features),
      capabilities: JSON.parse(row.capabilities),
      hasLocalData: row.has_local_data === 1,
      hasCollectiveData: row.has_collective_data === 1,
      syncEnabled: row.sync_enabled === 1,
      privacyLevel: row.privacy_level,
      dataSharing: JSON.parse(row.data_sharing),
      userCount: row.user_count,
      dataSize: row.data_size,
      lastSync: row.last_sync
    }
  }

  private rowToSyncEvent(row: any): VersionSyncEvent {
    return {
      id: row.id,
      fromVersionId: row.from_version_id,
      toVersionId: row.to_version_id,
      timestamp: row.timestamp,
      dataType: row.data_type,
      itemsCount: row.items_count,
      dataSize: row.data_size,
      direction: row.direction,
      privacyFiltered: row.privacy_filtered === 1,
      itemsFiltered: row.items_filtered,
      success: row.success === 1,
      error: row.error
    }
  }

  private rowToMigration(row: any): FeatureMigration {
    return {
      id: row.id,
      featureName: row.feature_name,
      description: row.description,
      sourceVersionId: row.source_version_id,
      sourceBranch: row.source_branch,
      targetVersionId: row.target_version_id,
      targetBranch: row.target_branch,
      status: row.status,
      proposedAt: row.proposed_at,
      approvedAt: row.approved_at,
      migratedAt: row.migrated_at,
      impactLevel: row.impact_level,
      affectedSystems: JSON.parse(row.affected_systems)
    }
  }

  // ========== STATISTICS ==========

  getVersionStatistics() {
    const byBranch = this.db.prepare(`
      SELECT branch, COUNT(*) as count, 
             SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active
      FROM system_versions
      GROUP BY branch
    `).all()

    const byType = this.db.prepare(`
      SELECT type, COUNT(*) as count
      FROM system_versions
      GROUP BY type
    `).all()

    const totalSyncs = this.db.prepare('SELECT COUNT(*) as count FROM version_sync_events').get() as any
    const successfulSyncs = this.db.prepare('SELECT COUNT(*) as count FROM version_sync_events WHERE success = 1').get() as any

    return {
      byBranch,
      byType,
      totalSyncs: totalSyncs.count,
      successfulSyncs: successfulSyncs.count,
      syncSuccessRate: totalSyncs.count > 0 ? (successfulSyncs.count / totalSyncs.count * 100) : 0,
      currentVersion: this.getCurrentVersion(),
      pendingMigrations: this.getPendingMigrations().length
    }
  }
}
