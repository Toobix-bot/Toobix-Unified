/**
 * 🗄️ Database Optimization - Indexes, prepared statements, connection pooling
 * 
 * Optimize database queries for production performance
 */

import type { Database } from 'bun:sqlite'

/**
 * Database optimizer with indexes and prepared statements
 */
export class DatabaseOptimizer {
  constructor(private db: Database) {}
  
  /**
   * Create all necessary indexes
   */
  createIndexes(): void {
    console.log('📊 Creating database indexes...')
    
    // Memory indexes
    this.createIndex('memory_chunks', 'created_at')
    this.createIndex('memory_chunks', 'memory_id')
    
    // Story indexes
    this.createIndex('story_events', 'ts')
    this.createIndex('story_events', 'kind')
    this.createIndex('story_events', 'person_id')
    
    // Consciousness indexes
    this.createIndex('thoughts', 'created_at')
    this.createIndex('reflections', 'created_at')
    
    // Soul indexes
    this.createIndex('emotions', 'timestamp')
    this.createIndex('traits', 'last_updated')
    
    // People indexes
    this.createIndex('contacts', 'name')
    this.createIndex('interactions', 'timestamp')
    this.createIndex('interactions', 'person_id')
    
    console.log('✅ Database indexes created')
  }
  
  /**
   * Create single index
   */
  private createIndex(table: string, column: string): void {
    const indexName = `idx_${table}_${column}`
    
    try {
      this.db.run(`
        CREATE INDEX IF NOT EXISTS ${indexName}
        ON ${table}(${column})
      `)
    } catch (error: any) {
      console.warn(`⚠️  Failed to create index ${indexName}:`, error.message)
    }
  }
  
  /**
   * Analyze query performance
   */
  explainQuery(query: string): any[] {
    return this.db.prepare(`EXPLAIN QUERY PLAN ${query}`).all()
  }
  
  /**
   * Get table statistics
   */
  getTableStats(table: string): { rows: number, pages: number } {
    const rowCount = this.db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as any
    const pageCount = this.db.prepare(`PRAGMA page_count`).get() as any
    
    return {
      rows: rowCount.count,
      pages: pageCount.page_count
    }
  }
  
  /**
   * Vacuum database (reclaim space, rebuild indexes)
   */
  vacuum(): void {
    console.log('🧹 Vacuuming database...')
    this.db.run('VACUUM')
    console.log('✅ Database vacuumed')
  }
  
  /**
   * Analyze database (update statistics for query optimizer)
   */
  analyze(): void {
    console.log('📈 Analyzing database...')
    this.db.run('ANALYZE')
    console.log('✅ Database analyzed')
  }
  
  /**
   * Optimize database (vacuum + analyze)
   */
  optimize(): void {
    this.vacuum()
    this.analyze()
  }
}

/**
 * Prepared statement cache for frequently used queries
 */
export class PreparedStatementCache {
  private statements: Map<string, any> = new Map()
  
  constructor(private db: Database) {}
  
  /**
   * Get or create prepared statement
   */
  get(key: string, sql: string): any {
    if (!this.statements.has(key)) {
      this.statements.set(key, this.db.prepare(sql))
    }
    return this.statements.get(key)!
  }
  
  /**
   * Clear cache
   */
  clear(): void {
    this.statements.clear()
  }
  
  /**
   * Get cache statistics
   */
  getStats(): { cached: number } {
    return { cached: this.statements.size }
  }
}

/**
 * Query builder with optimization hints
 */
export class OptimizedQueryBuilder {
  private query: string = ''
  private params: any[] = []
  
  constructor(private db: Database) {}
  
  /**
   * SELECT with index hint
   */
  select(columns: string[]): this {
    this.query = `SELECT ${columns.join(', ')}`
    return this
  }
  
  /**
   * FROM table
   */
  from(table: string): this {
    this.query += ` FROM ${table}`
    return this
  }
  
  /**
   * WHERE clause
   */
  where(condition: string, ...params: any[]): this {
    this.query += ` WHERE ${condition}`
    this.params.push(...params)
    return this
  }
  
  /**
   * ORDER BY (use index if possible)
   */
  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.query += ` ORDER BY ${column} ${direction}`
    return this
  }
  
  /**
   * LIMIT
   */
  limit(count: number): this {
    this.query += ` LIMIT ${count}`
    return this
  }
  
  /**
   * Execute query
   */
  execute(): any[] {
    return this.db.prepare(this.query).all(...this.params)
  }
  
  /**
   * Get first result
   */
  first(): any | null {
    return this.db.prepare(this.query).get(...this.params)
  }
  
  /**
   * Explain query plan
   */
  explain(): any[] {
    return this.db.prepare(`EXPLAIN QUERY PLAN ${this.query}`).all()
  }
}

/**
 * Transaction manager for bulk operations
 */
export class TransactionManager {
  constructor(private db: Database) {}
  
  /**
   * Execute operations in transaction
   */
  async transaction<T>(callback: () => T): Promise<T> {
    this.db.run('BEGIN TRANSACTION')
    
    try {
      const result = callback()
      this.db.run('COMMIT')
      return result
    } catch (error) {
      this.db.run('ROLLBACK')
      throw error
    }
  }
  
  /**
   * Batch insert with transaction
   */
  async batchInsert(table: string, items: any[]): Promise<void> {
    await this.transaction(() => {
      const stmt = this.db.prepare(`
        INSERT INTO ${table} (id, text, created_at)
        VALUES (?, ?, ?)
      `)
      
      for (const item of items) {
        stmt.run(item.id, item.text, item.created_at)
      }
    })
  }
}

/**
 * Database performance monitor
 */
export class DatabaseMonitor {
  private queryTimes: Map<string, number[]> = new Map()
  
  /**
   * Track query execution time
   */
  trackQuery(query: string, timeMs: number): void {
    if (!this.queryTimes.has(query)) {
      this.queryTimes.set(query, [])
    }
    this.queryTimes.get(query)!.push(timeMs)
  }
  
  /**
   * Get slow queries (> threshold ms)
   */
  getSlowQueries(thresholdMs: number = 100): Array<{ query: string, avgTime: number, count: number }> {
    const slow: Array<{ query: string, avgTime: number, count: number }> = []
    
    for (const [query, times] of this.queryTimes.entries()) {
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length
      
      if (avgTime > thresholdMs) {
        slow.push({ query, avgTime, count: times.length })
      }
    }
    
    return slow.sort((a, b) => b.avgTime - a.avgTime)
  }
  
  /**
   * Get query statistics
   */
  getStats(): { totalQueries: number, uniqueQueries: number } {
    const totalQueries = Array.from(this.queryTimes.values())
      .reduce((sum, times) => sum + times.length, 0)
    
    return {
      totalQueries,
      uniqueQueries: this.queryTimes.size
    }
  }
  
  /**
   * Clear statistics
   */
  clear(): void {
    this.queryTimes.clear()
  }
}

/**
 * Initialize database optimizations
 */
export function initializeDatabaseOptimizations(db: Database): {
  optimizer: DatabaseOptimizer
  stmtCache: PreparedStatementCache
  monitor: DatabaseMonitor
  txManager: TransactionManager
} {
  const optimizer = new DatabaseOptimizer(db)
  const stmtCache = new PreparedStatementCache(db)
  const monitor = new DatabaseMonitor()
  const txManager = new TransactionManager(db)
  
  // Create indexes
  optimizer.createIndexes()
  
  return { optimizer, stmtCache, monitor, txManager }
}
