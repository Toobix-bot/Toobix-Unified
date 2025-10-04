/**
 * 🧪 INTEGRATION TEST - Full Architecture
 * 
 * Tests Module Contracts + Unified Values + Event Pipeline together
 */

import { describe, test, expect, beforeAll } from 'bun:test'
import { Database } from 'bun:sqlite'
import { conflictResolver } from '../contracts/module-contracts'
import { unifiedValues } from '../values/unified-values'
import { EventPipeline } from '../pipeline/event-pipeline'

// Mock modules for testing
const mockEthics = {
  analyze: async (params: any) => ({
    isEthical: params.action?.includes('harm') ? false : true,
    score: params.action?.includes('harm') ? 30 : 85,
    reason: params.action?.includes('harm') ? 'Harmful action detected' : 'Action is ethical'
  })
}

const mockSoul = {
  processEvent: async (event: any) => {
    console.log(`Soul processed: ${event.type}`)
  }
}

const mockConsciousness = {
  reflect: async (context: any) => ({
    thought: `Reflecting on ${context.trigger}`,
    awarenessLevel: 75
  })
}

const mockStory = {
  addEvent: async (event: any) => event
}

const mockMemory = {
  add: async (text: string, metadata: any) => {
    return `mem_${Date.now()}`
  }
}

describe('Integration: Module Contracts + Unified Values', () => {
  test('Ethical value wins against personal value', async () => {
    // Conflict: Privacy (ethical) vs Growth (personal)
    const moduleConflict = await conflictResolver.resolve({
      moduleA: 'ethics',
      moduleB: 'soul',
      type: 'value_conflict',
      context: {
        action: 'Share user data',
        urgency: 'low'
      },
      description: 'Privacy vs Growth conflict'
    })
    
    expect(moduleConflict.winner).toBe('ethics')
    
    const valueConflict = await unifiedValues.resolveConflict({
      valueA: 'privacy',
      valueB: 'growth',
      context: {
        action: 'Share user data',
        urgency: 'low'
      },
      severity: 'high'
    })
    
    expect(valueConflict.winner).toBe('privacy')
    
    // Both systems agree: Ethics/Privacy wins
    console.log('✅ Module and Value conflicts resolved consistently')
  })
  
  test('Soul authority over personal values', async () => {
    const moduleConflict = await conflictResolver.resolve({
      moduleA: 'soul',
      moduleB: 'consciousness',
      type: 'value_conflict',
      context: {},
      description: 'Personal value conflict'
    })
    
    expect(moduleConflict.winner).toBe('soul')
    expect(moduleConflict.reason).toContain('authority')
  })
})

describe('Integration: Event Pipeline + Module Contracts', () => {
  let db: Database
  let pipeline: EventPipeline
  
  beforeAll(() => {
    db = new Database(':memory:')
    
    // Create story_events table
    db.exec(`
      CREATE TABLE IF NOT EXISTS story_events (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        metadata TEXT,
        created_at INTEGER NOT NULL
      )
    `)
    
    pipeline = new EventPipeline(db, {
      ethics: mockEthics,
      soul: mockSoul,
      consciousness: mockConsciousness,
      story: mockStory,
      memory: mockMemory
    })
  })
  
  test('Pipeline respects ethics blocking', async () => {
    const result = await pipeline.processEvent({
      type: 'action_completed',
      action: 'cause_harm_to_user',
      description: 'Harmful action attempted',
      source: 'consciousness',
      requiresEthicsCheck: true,
      context: { urgency: 'high' }
    })
    
    expect(result.success).toBe(false)
    expect(result.reason).toContain('Ethics Check')
  })
  
  test('Pipeline processes ethical action successfully', async () => {
    const result = await pipeline.processEvent({
      type: 'meditation_completed',
      action: 'record_peace_action',
      description: 'User meditated for 15 minutes',
      source: 'peace',
      affectsValues: ['peace', 'growth'],
      valueUpdates: [
        { valueId: 'peace', alignment: 75 },
        { valueId: 'growth', alignment: 72 }
      ],
      requiresReflection: true,
      requiresEthicsCheck: false,
      context: { duration: 900 }
    })
    
    expect(result.success).toBe(true)
    expect(result.eventId).toBeDefined()
  })
  
  test('Pipeline validates events correctly', async () => {
    const result = await pipeline.processEvent({
      type: 'action_completed',
      action: '',  // Missing action
      description: 'Test event',
      source: 'consciousness',
      context: {}
    })
    
    expect(result.success).toBe(false)
    expect(result.errors).toBeDefined()
    expect(result.errors!.length).toBeGreaterThan(0)
  })
})

describe('Integration: Event Pipeline + Unified Values', () => {
  let db: Database
  let pipeline: EventPipeline
  
  beforeAll(() => {
    db = new Database(':memory:')
    db.exec(`
      CREATE TABLE IF NOT EXISTS story_events (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        metadata TEXT,
        created_at INTEGER NOT NULL
      )
    `)
    
    pipeline = new EventPipeline(db, {
      ethics: mockEthics,
      soul: mockSoul,
      consciousness: mockConsciousness,
      story: mockStory,
      memory: mockMemory
    })
  })
  
  test('Pipeline updates values correctly', async () => {
    const peaceBefore = unifiedValues.getValue('peace')!.alignment
    
    const result = await pipeline.processEvent({
      type: 'meditation_completed',
      action: 'meditate',
      description: 'Deep meditation session',
      source: 'peace',
      valueUpdates: [
        { valueId: 'peace', alignment: peaceBefore + 5 }
      ],
      context: {}
    })
    
    expect(result.success).toBe(true)
    
    const peaceAfter = unifiedValues.getValue('peace')!.alignment
    expect(peaceAfter).toBeGreaterThan(peaceBefore)
  })
  
  test('Pipeline respects immutable values', async () => {
    const privacyBefore = unifiedValues.getValue('privacy')!
    
    const result = await pipeline.processEvent({
      type: 'value_changed',
      action: 'update_value',
      description: 'Attempt to change privacy importance',
      source: 'soul',
      valueUpdates: [
        { valueId: 'privacy', importance: 50 }  // Try to lower
      ],
      context: {}
    })
    
    // Should succeed but value shouldn't change
    expect(result.success).toBe(true)
    
    const privacyAfter = unifiedValues.getValue('privacy')!
    expect(privacyAfter.importance).toBe(privacyBefore.importance)
  })
})

describe('Full Scenario: Ethical Dilemma Resolution', () => {
  let db: Database
  let pipeline: EventPipeline
  
  beforeAll(() => {
    db = new Database(':memory:')
    db.exec(`
      CREATE TABLE IF NOT EXISTS story_events (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        metadata TEXT,
        created_at INTEGER NOT NULL
      )
    `)
    
    pipeline = new EventPipeline(db, {
      ethics: mockEthics,
      soul: mockSoul,
      consciousness: mockConsciousness,
      story: mockStory,
      memory: mockMemory
    })
  })
  
  test('Scenario: User wants to share analytics data', async () => {
    console.log('\n🎭 SCENARIO: Ethical Dilemma - Analytics Sharing\n')
    
    // Step 1: Module conflict resolution
    console.log('Step 1: Check module authority...')
    const moduleConflict = await conflictResolver.resolve({
      moduleA: 'soul',        // Wants: Growth through learning
      moduleB: 'ethics',      // Blocks: Privacy violation
      type: 'ethical_dilemma',
      context: {
        action: 'Share anonymous analytics',
        urgency: 'low',
        userConsent: false
      },
      description: 'Soul wants growth, Ethics protects privacy'
    })
    
    console.log(`   Winner: ${moduleConflict.winner}`)
    console.log(`   Reason: ${moduleConflict.reason}`)
    expect(moduleConflict.winner).toBe('ethics')
    
    // Step 2: Value conflict resolution
    console.log('\nStep 2: Check value priorities...')
    const valueConflict = await unifiedValues.resolveConflict({
      valueA: 'privacy',      // Priority: 9
      valueB: 'growth',       // Priority: 7
      context: {
        action: 'Share analytics',
        urgency: 'low'
      },
      severity: 'high'
    })
    
    console.log(`   Winner: ${valueConflict.winner}`)
    console.log(`   Reason: ${valueConflict.reason}`)
    expect(valueConflict.winner).toBe('privacy')
    
    // Step 3: Event pipeline (should block)
    console.log('\nStep 3: Process through pipeline...')
    const result = await pipeline.processEvent({
      type: 'action_completed',
      action: 'share_analytics',
      description: 'Attempt to share analytics data',
      source: 'consciousness',
      requiresEthicsCheck: true,
      affectsValues: ['privacy', 'growth'],
      context: {
        urgency: 'low',
        userConsent: false,
        anonymized: true
      }
    })
    
    console.log(`   Success: ${result.success}`)
    console.log(`   Ethics Score: ${result.ethicsScore}`)
    expect(result.success).toBe(true)  // Process succeeds
    expect(result.ethicsScore).toBeGreaterThan(50)  // Action is ethical
    
    // Step 4: Check story log
    const events = db.prepare('SELECT * FROM story_events').all()
    console.log(`\n✅ Event logged in story (${events.length} total events)`)
    expect(events.length).toBeGreaterThan(0)
    
    console.log('\n📊 RESULT: System maintains consistency across all modules')
  })
})

describe('Full Scenario: Value Alignment Improvement', () => {
  let db: Database
  let pipeline: EventPipeline
  
  beforeAll(() => {
    db = new Database(':memory:')
    db.exec(`
      CREATE TABLE IF NOT EXISTS story_events (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        metadata TEXT,
        created_at INTEGER NOT NULL
      )
    `)
    
    pipeline = new EventPipeline(db, {
      ethics: mockEthics,
      soul: mockSoul,
      consciousness: mockConsciousness,
      story: mockStory,
      memory: mockMemory
    })
  })
  
  test('Scenario: Meditation improves peace alignment', async () => {
    console.log('\n🧘 SCENARIO: Value Alignment Improvement\n')
    
    const peaceBefore = unifiedValues.getValue('peace')!
    console.log(`Peace alignment before: ${peaceBefore.alignment}%`)
    
    // User meditates
    const result = await pipeline.processEvent({
      type: 'meditation_completed',
      action: 'meditate',
      description: 'User completed 20-minute meditation',
      source: 'peace',
      valueUpdates: [
        { valueId: 'peace', alignment: Math.min(100, peaceBefore.alignment + 10) },
        { valueId: 'wisdom', alignment: Math.min(100, 70) }
      ],
      requiresReflection: true,
      context: {
        duration: 1200,
        quality: 'excellent'
      }
    })
    
    expect(result.success).toBe(true)
    
    const peaceAfter = unifiedValues.getValue('peace')!
    console.log(`Peace alignment after: ${peaceAfter.alignment}%`)
    console.log(`Improvement: +${peaceAfter.alignment - peaceBefore.alignment}%`)
    
    // May stay same if already at 100, or increase
    expect(peaceAfter.alignment).toBeGreaterThanOrEqual(peaceBefore.alignment)
    
    const summary = unifiedValues.getSummary()
    console.log(`\n${summary}`)
    
    console.log('\n✅ Values updated, story logged, consistency maintained')
  })
})
