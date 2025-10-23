/**
 * 🧪 INTEGRATION TESTS - Service Interactions
 *
 * Tests the integration between different services:
 * - Soul + Memory + Story integration
 * - Error handling across service boundaries
 * - Database transaction consistency
 * - Logging integration
 */

import { describe, test, expect, beforeAll, afterAll } from 'bun:test'
import { Database } from 'bun:sqlite'
import { SoulService } from '../../../soul/src/index'
import { MemoryService } from '../../../bridge/src/memory/service'
import { ActionsService } from '../../../bridge/src/actions/service'
import { StoryService } from '../story/service'
import LoveEngineService from '../../../love/src/service'
import PeaceCatalystService from '../../../peace/src/service'
import {
  DatabaseError,
  NotFoundError,
  OperationError,
  ValidationError,
  ErrorCode
} from '../errors'
import { initLogger, LogLevel, MemoryOutput } from '../logging'

describe('Service Integration Tests', () => {
  let db: Database
  let memoryLogger: MemoryOutput

  beforeAll(() => {
    // Use in-memory database for testing
    db = new Database(':memory:')

    // Setup memory logger for test assertions
    memoryLogger = new MemoryOutput(1000)
    initLogger({
      level: LogLevel.DEBUG,
      service: 'integration-test',
      outputs: [memoryLogger]
    })

    console.log('🧪 Integration test database initialized')
  })

  afterAll(() => {
    db?.close()
    console.log('🧹 Integration test cleanup complete')
  })

  describe('Soul Service Integration', () => {
    test('should initialize and persist state', () => {
      const soul = new SoulService(db)

      // Service should initialize without errors
      expect(soul).toBeDefined()

      // Should be able to save state
      expect(() => soul.saveState()).not.toThrow()

      // Check logs for successful initialization
      const logs = memoryLogger.getByLevel(LogLevel.INFO)
      const soulLogs = logs.filter(log => log.message.includes('Soul'))
      expect(soulLogs.length).toBeGreaterThan(0)
    })

    test('should handle database errors gracefully', () => {
      // Close DB to trigger error
      const brokenDb = new Database(':memory:')
      brokenDb.close()

      // Should throw DatabaseError
      expect(() => {
        new SoulService(brokenDb)
      }).toThrow(DatabaseError)
    })

    test('should process events and update state', () => {
      const soul = new SoulService(db)

      const event = {
        type: 'interaction' as const,
        trigger: 'test',
        intensity: 75,
        valence: 0.8
      }

      // Should process event without error
      expect(() => soul.processEvent(event)).not.toThrow()
    })
  })

  describe('Memory Service Integration', () => {
    test('should initialize without API key (keyword search mode)', () => {
      const memory = new MemoryService(db)
      expect(memory).toBeDefined()

      // Check for warning log about no API key
      const logs = memoryLogger.getByLevel(LogLevel.WARN)
      const memoryLogs = logs.filter(log =>
        log.message.includes('keyword search') ||
        log.message.includes('no API key')
      )
      expect(memoryLogs.length).toBeGreaterThan(0)
    })

    test('should store and retrieve memories', async () => {
      const memory = new MemoryService(db)

      // Add memory
      const id = await memory.add('Test memory content', {
        category: 'test',
        importance: 5
      })

      expect(id).toBeDefined()
      expect(typeof id).toBe('string')

      // Check logs for successful storage
      const logs = memoryLogger.getByLevel(LogLevel.DEBUG)
      const storageLogs = logs.filter(log => log.message.includes('Memory chunk stored'))
      expect(storageLogs.length).toBeGreaterThan(0)
    })

    test('should handle database errors on add', async () => {
      const brokenDb = new Database(':memory:')
      brokenDb.close()
      const memory = new MemoryService(brokenDb)

      await expect(
        memory.add('Test', {})
      ).rejects.toThrow(DatabaseError)
    })

    test('should search memories', async () => {
      const memory = new MemoryService(db)

      // Add some memories
      await memory.add('First test memory about cats', { category: 'animals' })
      await memory.add('Second test memory about dogs', { category: 'animals' })
      await memory.add('Third test memory about birds', { category: 'animals' })

      // Search should work (keyword search)
      const results = await memory.search('cats', 5)
      expect(Array.isArray(results)).toBe(true)
    })
  })

  describe('Actions Service Integration', () => {
    test('should create and retrieve actions', async () => {
      const actions = new ActionsService(db)

      // Create tables (actions service doesn't auto-create)
      db.run(`
        CREATE TABLE IF NOT EXISTS actions (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          config TEXT,
          enabled INTEGER DEFAULT 1,
          last_run INTEGER,
          created_at INTEGER NOT NULL
        )
      `)

      const id = await actions.create('test-action', 'webhook', {
        url: 'https://example.com'
      })

      expect(id).toBeDefined()

      const action = await actions.get(id)
      expect(action).toBeDefined()
      expect(action?.name).toBe('test-action')
      expect(action?.type).toBe('webhook')
      expect(action?.enabled).toBe(true)
    })

    test('should list all actions', async () => {
      const actions = new ActionsService(db)

      const allActions = await actions.list()
      expect(Array.isArray(allActions)).toBe(true)
      expect(allActions.length).toBeGreaterThan(0)
    })

    test('should throw NotFoundError for missing action', async () => {
      const actions = new ActionsService(db)

      await expect(
        actions.trigger('non-existent-id')
      ).rejects.toThrow(NotFoundError)
    })

    test('should throw OperationError for disabled action', async () => {
      const actions = new ActionsService(db)

      const id = await actions.create('disabled-action', 'test')
      await actions.disable(id)

      await expect(
        actions.trigger(id)
      ).rejects.toThrow(OperationError)
    })

    test('should trigger action with registered handler', async () => {
      const actions = new ActionsService(db)

      let handlerCalled = false
      actions.registerHandler('test-handler', async (action: any, context: any) => {
        handlerCalled = true
        return { success: true, action: action.name }
      })

      const id = await actions.create('handler-test', 'test-handler')
      const result = await actions.trigger(id, { test: true })

      expect(handlerCalled).toBe(true)
      expect(result).toBeDefined()
      expect(result.success).toBe(true)
    })
  })

  describe('Story Service Integration', () => {
    test('should initialize with default state', () => {
      const story = new StoryService(db)
      expect(story).toBeDefined()

      const state = story.getState()
      expect(state).toBeDefined()
      expect(state.arc).toBe('foundations')
      expect(state.mood).toBe('calm')
    })

    test('should handle database errors gracefully', () => {
      const brokenDb = new Database(':memory:')
      brokenDb.close()

      expect(() => {
        new StoryService(brokenDb)
      }).toThrow(DatabaseError)
    })
  })

  describe('Love Engine Integration', () => {
    test('should initialize tables', () => {
      const love = new LoveEngineService(db)
      expect(love).toBeDefined()

      // Tables should be created
      const tables = db.prepare(`
        SELECT name FROM sqlite_master
        WHERE type='table' AND name LIKE 'gratitude%' OR name LIKE 'kindness%'
      `).all()

      expect(tables.length).toBeGreaterThan(0)
    })
  })

  describe('Peace Catalyst Integration', () => {
    test('should initialize with 5 agents', () => {
      const peace = new PeaceCatalystService(db)
      expect(peace).toBeDefined()

      expect(peace.calmAgent).toBeDefined()
      expect(peace.harmonyAgent).toBeDefined()
      expect(peace.clarityAgent).toBeDefined()
      expect(peace.growthAgent).toBeDefined()
      expect(peace.purposeAgent).toBeDefined()
    })
  })

  describe('Cross-Service Error Handling', () => {
    test('all services should throw DatabaseError on DB failure', () => {
      const brokenDb = new Database(':memory:')
      brokenDb.close()

      expect(() => new SoulService(brokenDb)).toThrow(DatabaseError)
      expect(() => new MemoryService(brokenDb)).toThrow(DatabaseError)
      expect(() => new StoryService(brokenDb)).toThrow(DatabaseError)
      expect(() => new LoveEngineService(brokenDb)).toThrow(DatabaseError)
      expect(() => new PeaceCatalystService(brokenDb)).toThrow(DatabaseError)
    })

    test('all services should log initialization', () => {
      memoryLogger.clear()

      const soul = new SoulService(db)
      const memory = new MemoryService(db)
      const story = new StoryService(db)

      const logs = memoryLogger.getByLevel(LogLevel.INFO)
      const initLogs = logs.filter(log =>
        log.message.includes('initialized') ||
        log.message.includes('Service')
      )

      expect(initLogs.length).toBeGreaterThan(2)
    })
  })

  describe('Logging Integration', () => {
    test('errors should be logged with context', async () => {
      memoryLogger.clear()

      const actions = new ActionsService(db)

      try {
        await actions.trigger('non-existent')
      } catch (error) {
        // Error should be thrown
      }

      const errorLogs = memoryLogger.getByLevel(LogLevel.ERROR)
      expect(errorLogs.length).toBeGreaterThan(0)
    })

    test('successful operations should be logged', async () => {
      memoryLogger.clear()

      const actions = new ActionsService(db)
      await actions.create('log-test', 'test')

      const infoLogs = memoryLogger.getByLevel(LogLevel.INFO)
      const createLogs = infoLogs.filter(log =>
        log.message.includes('created') ||
        log.message.includes('Action')
      )

      expect(createLogs.length).toBeGreaterThan(0)
    })
  })

  describe('Database Transaction Consistency', () => {
    test('soul state should persist across instances', () => {
      const soul1 = new SoulService(db)
      soul1.saveState()

      const soul2 = new SoulService(db)
      const state = soul2.getState()

      expect(state).toBeDefined()
    })

    test('memory chunks should persist', async () => {
      const memory1 = new MemoryService(db)
      const id = await memory1.add('Persistent memory', { test: true })

      const memory2 = new MemoryService(db)
      const results = await memory2.search('Persistent', 10)

      expect(results.length).toBeGreaterThan(0)
    })
  })
})
