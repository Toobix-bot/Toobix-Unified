/**
 * Actions Service
 * Trigger-based action system
 */

import type { Database } from 'bun:sqlite'
import type { Action } from '../types'
import { nanoid } from 'nanoid'
import { DatabaseError, ErrorCode, NotFoundError, OperationError, createLogger } from '@toobix/core'

const logger = createLogger('actions-service')

export class ActionsService {
  private db: Database
  private handlers: Map<string, Function> = new Map()

  constructor(db: Database) {
    try {
      this.db = db
      logger.info('Actions Service initialized successfully')
    } catch (error) {
      logger.error('Failed to initialize Actions Service', error as Error)
      throw new DatabaseError(
        'Failed to initialize Actions Service',
        ErrorCode.DATABASE_CONNECTION_FAILED,
        { error: String(error) }
      )
    }
  }

  async create(name: string, type: string, config?: Record<string, any>): Promise<string> {
    try {
      const id = nanoid()
      const now = Date.now()

      this.db.run(`
        INSERT INTO actions (id, name, type, config, enabled, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [id, name, type, JSON.stringify(config || {}), 1, now])

      logger.info(`Action created: ${name} (${type})`, { id })
      return id
    } catch (error) {
      logger.error('Failed to create action', error as Error, { name, type })
      throw new DatabaseError(
        'Failed to create action',
        ErrorCode.DATABASE_QUERY_FAILED,
        { name, type, error: String(error) }
      )
    }
  }

  async get(id: string): Promise<Action | null> {
    try {
      const row = this.db.prepare('SELECT * FROM actions WHERE id = ?').get(id) as any

      if (!row) {
        logger.debug(`Action not found: ${id}`)
        return null
      }

      return {
        id: row.id,
        name: row.name,
        type: row.type,
        config: JSON.parse(row.config || '{}'),
        enabled: row.enabled === 1,
        last_run: row.last_run,
        created_at: row.created_at
      }
    } catch (error) {
      logger.error('Failed to get action', error as Error, { id })
      throw new DatabaseError(
        'Failed to retrieve action',
        ErrorCode.DATABASE_QUERY_FAILED,
        { id, error: String(error) }
      )
    }
  }

  async list(): Promise<Action[]> {
    try {
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
    } catch (error) {
      logger.error('Failed to list actions', error as Error)
      throw new DatabaseError(
        'Failed to list actions',
        ErrorCode.DATABASE_QUERY_FAILED,
        { error: String(error) }
      )
    }
  }

  async trigger(id: string, context?: any): Promise<any> {
    try {
      const action = await this.get(id)

      if (!action) {
        throw new NotFoundError('Action', id)
      }

      if (!action.enabled) {
        throw new OperationError(
          `Action '${action.name}' is disabled`,
          ErrorCode.OPERATION_FAILED,
          400,
          { id, name: action.name }
        )
      }

      const handler = this.handlers.get(action.type)

      if (!handler) {
        throw new OperationError(
          `No handler registered for action type: ${action.type}`,
          ErrorCode.OPERATION_FAILED,
          500,
          { id, type: action.type }
        )
      }

      const now = Date.now()
      this.db.run('UPDATE actions SET last_run = ? WHERE id = ?', [now, id])

      logger.info(`Triggering action: ${action.name}`, { id, type: action.type })
      const result = await handler(action, context)

      logger.debug(`Action triggered successfully`, { id })
      return result
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof OperationError) {
        throw error
      }
      logger.error('Failed to trigger action', error as Error, { id })
      throw new OperationError(
        'Failed to trigger action',
        ErrorCode.OPERATION_FAILED,
        500,
        { id, error: String(error) }
      )
    }
  }

  registerHandler(type: string, handler: Function): void {
    this.handlers.set(type, handler)
    logger.debug(`Handler registered for action type: ${type}`)
  }

  async enable(id: string): Promise<void> {
    try {
      this.db.run('UPDATE actions SET enabled = 1 WHERE id = ?', [id])
      logger.info(`Action enabled: ${id}`)
    } catch (error) {
      logger.error('Failed to enable action', error as Error, { id })
      throw new DatabaseError(
        'Failed to enable action',
        ErrorCode.DATABASE_QUERY_FAILED,
        { id, error: String(error) }
      )
    }
  }

  async disable(id: string): Promise<void> {
    try {
      this.db.run('UPDATE actions SET enabled = 0 WHERE id = ?', [id])
      logger.info(`Action disabled: ${id}`)
    } catch (error) {
      logger.error('Failed to disable action', error as Error, { id })
      throw new DatabaseError(
        'Failed to disable action',
        ErrorCode.DATABASE_QUERY_FAILED,
        { id, error: String(error) }
      )
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.db.run('DELETE FROM actions WHERE id = ?', [id])
      logger.info(`Action deleted: ${id}`)
    } catch (error) {
      logger.error('Failed to delete action', error as Error, { id })
      throw new DatabaseError(
        'Failed to delete action',
        ErrorCode.DATABASE_QUERY_FAILED,
        { id, error: String(error) }
      )
    }
  }

  async count(): Promise<number> {
    const result = this.db.prepare('SELECT COUNT(*) as count FROM actions').get() as any
    return result.count
  }
}
