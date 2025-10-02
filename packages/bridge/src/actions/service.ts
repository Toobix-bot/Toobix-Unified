/**
 * Actions Service
 * Trigger-based action system
 */

import type { Database } from 'bun:sqlite'
import type { Action } from '../types'
import { nanoid } from 'nanoid'

export class ActionsService {
  private db: Database
  private handlers: Map<string, Function> = new Map()

  constructor(db: Database) {
    this.db = db
  }

  async create(name: string, type: string, config?: Record<string, any>): Promise<string> {
    const id = nanoid()
    const now = Date.now()

    this.db.run(`
      INSERT INTO actions (id, name, type, config, enabled, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, name, type, JSON.stringify(config || {}), 1, now])

    return id
  }

  async get(id: string): Promise<Action | null> {
    const row = this.db.prepare('SELECT * FROM actions WHERE id = ?').get(id) as any

    if (!row) return null

    return {
      id: row.id,
      name: row.name,
      type: row.type,
      config: JSON.parse(row.config || '{}'),
      enabled: row.enabled === 1,
      last_run: row.last_run,
      created_at: row.created_at
    }
  }

  async list(): Promise<Action[]> {
    const rows = this.db.prepare('SELECT * FROM actions ORDER BY created_at DESC').all() as any[]

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      type: row.type,
      config: JSON.parse(row.config || '{}'),
      enabled: row.enabled === 1,
      last_run: row.last_run,
      created_at: row.created_at
    }))
  }

  async trigger(id: string, context?: any): Promise<any> {
    const action = await this.get(id)
    
    if (!action) {
      throw new Error(`Action ${id} not found`)
    }

    if (!action.enabled) {
      throw new Error(`Action ${id} is disabled`)
    }

    const handler = this.handlers.get(action.type)
    
    if (!handler) {
      throw new Error(`No handler registered for action type: ${action.type}`)
    }

    const now = Date.now()
    this.db.run('UPDATE actions SET last_run = ? WHERE id = ?', [now, id])

    return await handler(action, context)
  }

  registerHandler(type: string, handler: Function): void {
    this.handlers.set(type, handler)
  }

  async enable(id: string): Promise<void> {
    this.db.run('UPDATE actions SET enabled = 1 WHERE id = ?', [id])
  }

  async disable(id: string): Promise<void> {
    this.db.run('UPDATE actions SET enabled = 0 WHERE id = ?', [id])
  }

  async delete(id: string): Promise<void> {
    this.db.run('DELETE FROM actions WHERE id = ?', [id])
  }

  async count(): Promise<number> {
    const result = this.db.prepare('SELECT COUNT(*) as count FROM actions').get() as any
    return result.count
  }
}
