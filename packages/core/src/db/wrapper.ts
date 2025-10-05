/**
 * Database Wrapper für better-sqlite3
 * 
 * Bietet einheitliche API für:
 * - CREATE TABLE/INDEX (exec)
 * - INSERT/UPDATE/DELETE (prepare + run)
 * - SELECT (prepare + get/all)
 */

import Database from 'better-sqlite3'

export class DatabaseWrapper {
  private db: Database.Database

  constructor(db: Database.Database) {
    this.db = db
  }

  /**
   * Execute DDL statement (CREATE TABLE, CREATE INDEX, etc.)
   */
  run(sql: string): void {
    this.db.exec(sql)
  }

  /**
   * Execute DDL statement directly (alias for run)
   */
  exec(sql: string): void {
    this.db.exec(sql)
  }

  /**
   * Prepare statement for DML (INSERT, UPDATE, DELETE, SELECT)
   */
  prepare(sql: string): Database.Statement {
    return this.db.prepare(sql)
  }

  /**
   * Get raw database (for advanced usage)
   */
  raw(): Database.Database {
    return this.db
  }
}
