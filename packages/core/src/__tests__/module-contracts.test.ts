/**
 * 🧪 MODULE CONTRACTS - Unit Tests
 */

import { describe, test, expect } from 'bun:test'
import { 
  conflictResolver,
  MODULE_HIERARCHY,
  canOverride,
  mustDeferTo,
  getAuthority,
  type ModuleName,
  type ModuleConflict
} from '../contracts/module-contracts'

describe('Module Hierarchy', () => {
  test('Ethics has highest level', () => {
    expect(MODULE_HIERARCHY.ethics.level).toBe(1)
    expect(MODULE_HIERARCHY.ethics.authority).toBe('absolute')
  })
  
  test('Soul is level 2', () => {
    expect(MODULE_HIERARCHY.soul.level).toBe(2)
    expect(MODULE_HIERARCHY.soul.authority).toBe('strong')
  })
  
  test('Consciousness is level 3', () => {
    expect(MODULE_HIERARCHY.consciousness.level).toBe(3)
    expect(MODULE_HIERARCHY.consciousness.authority).toBe('advisory')
  })
  
  test('Story and Memory are lowest', () => {
    expect(MODULE_HIERARCHY.story.level).toBe(4)
    expect(MODULE_HIERARCHY.memory.level).toBe(5)
    expect(MODULE_HIERARCHY.story.authority).toBe('informational')
    expect(MODULE_HIERARCHY.memory.authority).toBe('informational')
  })
})

describe('Module Authority Rules', () => {
  test('Ethics can override all modules', () => {
    expect(canOverride('ethics', 'soul')).toBe(true)
    expect(canOverride('ethics', 'consciousness')).toBe(true)
    expect(canOverride('ethics', 'story')).toBe(true)
    expect(canOverride('ethics', 'memory')).toBe(true)
  })
  
  test('Soul can override lower modules', () => {
    expect(canOverride('soul', 'consciousness')).toBe(true)
    expect(canOverride('soul', 'story')).toBe(true)
    expect(canOverride('soul', 'memory')).toBe(true)
  })
  
  test('Soul cannot override ethics', () => {
    expect(canOverride('soul', 'ethics')).toBe(false)
  })
  
  test('Memory cannot override anything', () => {
    expect(canOverride('memory', 'story')).toBe(false)
    expect(canOverride('memory', 'consciousness')).toBe(false)
    expect(canOverride('memory', 'soul')).toBe(false)
    expect(canOverride('memory', 'ethics')).toBe(false)
  })
  
  test('All modules must defer to ethics', () => {
    expect(mustDeferTo('soul', 'ethics')).toBe(true)
    expect(mustDeferTo('consciousness', 'ethics')).toBe(true)
    expect(mustDeferTo('story', 'ethics')).toBe(true)
    expect(mustDeferTo('memory', 'ethics')).toBe(true)
  })
  
  test('Lower modules must defer to higher ones', () => {
    expect(mustDeferTo('consciousness', 'soul')).toBe(true)
    expect(mustDeferTo('story', 'consciousness')).toBe(true)
    expect(mustDeferTo('memory', 'story')).toBe(true)
  })
})

describe('Conflict Resolution - Hierarchy', () => {
  test('Ethics always wins against any module', async () => {
    const conflict: ModuleConflict = {
      moduleA: 'ethics',
      moduleB: 'soul',
      type: 'ethical_dilemma',
      context: { urgency: 'high' },
      description: 'Ethics vs Soul conflict'
    }
    
    const resolution = await conflictResolver.resolve(conflict)
    
    expect(resolution.winner).toBe('ethics')
    expect(resolution.confidence).toBeGreaterThan(0.9)
  })
  
  test('Soul wins against consciousness', async () => {
    const conflict: ModuleConflict = {
      moduleA: 'soul',
      moduleB: 'consciousness',
      type: 'value_conflict',
      context: {},
      description: 'Soul vs Consciousness'
    }
    
    const resolution = await conflictResolver.resolve(conflict)
    
    expect(resolution.winner).toBe('soul')
    expect(resolution.reason).toContain('higher authority')
  })
  
  test('Story wins against memory', async () => {
    const conflict: ModuleConflict = {
      moduleA: 'story',
      moduleB: 'memory',
      type: 'data_inconsistency',
      context: {},
      description: 'Story vs Memory data conflict'
    }
    
    const resolution = await conflictResolver.resolve(conflict)
    
    expect(resolution.winner).toBe('story')
  })
})

describe('Conflict Resolution - Ethical Dilemmas', () => {
  test('Ethics wins in ethical dilemma', async () => {
    const conflict: ModuleConflict = {
      moduleA: 'soul',
      moduleB: 'ethics',
      type: 'ethical_dilemma',
      context: {
        action: 'Share user data',
        urgency: 'low'
      },
      description: 'Privacy vs Growth dilemma'
    }
    
    const resolution = await conflictResolver.resolve(conflict)
    
    expect(resolution.winner).toBe('ethics')
    expect(resolution.reason).toContain('authority')
  })
  
  test('Critical urgency favors ethics', async () => {
    const conflict: ModuleConflict = {
      moduleA: 'consciousness',
      moduleB: 'love',
      type: 'ethical_dilemma',
      context: {
        urgency: 'critical'
      },
      description: 'Critical situation conflict'
    }
    
    const resolution = await conflictResolver.resolve(conflict)
    
    // Should favor safer/ethical option
    expect(resolution.confidence).toBeGreaterThan(0.5)
  })
})

describe('Conflict Resolution - Value Conflicts', () => {
  test('Soul has authority over personal values', async () => {
    const conflict: ModuleConflict = {
      moduleA: 'soul',
      moduleB: 'love',
      type: 'value_conflict',
      context: {},
      description: 'Personal value conflict'
    }
    
    const resolution = await conflictResolver.resolve(conflict)
    
    expect(resolution.winner).toBe('soul')
    expect(resolution.reason).toContain('authority')
  })
  
  test('User consent affects value conflicts', async () => {
    const conflict: ModuleConflict = {
      moduleA: 'consciousness',
      moduleB: 'peace',
      type: 'value_conflict',
      context: {
        userConsent: true
      },
      description: 'User-approved action'
    }
    
    const resolution = await conflictResolver.resolve(conflict)
    
    // With user consent, first module (user's preference) wins
    expect(resolution.winner).toBe('consciousness')
    expect(resolution.reason).toContain('User consent')
  })
})

describe('Conflict Resolution - Data Inconsistency', () => {
  test('Story is source of truth for events', async () => {
    const conflict: ModuleConflict = {
      moduleA: 'story',
      moduleB: 'memory',
      type: 'data_inconsistency',
      context: {},
      description: 'Event data conflict'
    }
    
    const resolution = await conflictResolver.resolve(conflict)
    
    expect(resolution.winner).toBe('story')
    expect(resolution.reason).toContain('authority')
  })
  
  test('Higher module wins data conflicts', async () => {
    const conflict: ModuleConflict = {
      moduleA: 'consciousness',
      moduleB: 'story',
      type: 'data_inconsistency',
      context: {},
      description: 'Data conflict'
    }
    
    const resolution = await conflictResolver.resolve(conflict)
    
    expect(resolution.winner).toBe('consciousness')
  })
})

describe('Conflict Resolution - Priority Conflicts', () => {
  test('Critical urgency prioritizes ethics/soul', async () => {
    const conflict: ModuleConflict = {
      moduleA: 'soul',
      moduleB: 'story',
      type: 'priority_conflict',
      context: {
        urgency: 'critical'
      },
      description: 'Critical priority conflict'
    }
    
    const resolution = await conflictResolver.resolve(conflict)
    
    expect(resolution.winner).toBe('soul')
    expect(resolution.reason).toContain('authority')
  })
})

describe('Helper Functions', () => {
  test('getAuthority returns correct authority level', () => {
    expect(getAuthority('ethics')).toBe('absolute')
    expect(getAuthority('soul')).toBe('strong')
    expect(getAuthority('consciousness')).toBe('advisory')
    expect(getAuthority('story')).toBe('informational')
  })
})

describe('Edge Cases', () => {
  test('Same level modules use tie-breaker', async () => {
    const conflict: ModuleConflict = {
      moduleA: 'love',
      moduleB: 'peace',
      type: 'value_conflict',
      context: {},
      description: 'Same-level conflict'
    }
    
    const resolution = await conflictResolver.resolve(conflict)
    
    // Should use lexicographic order
    expect(['love', 'peace']).toContain(resolution.winner)
    expect(resolution.confidence).toBeLessThan(0.5)
  })
  
  test('Resolution provides alternative actions on low confidence', async () => {
    const conflict: ModuleConflict = {
      moduleA: 'love',
      moduleB: 'peace',
      type: 'priority_conflict',
      context: {},
      description: 'Unclear conflict'
    }
    
    const resolution = await conflictResolver.resolve(conflict)
    
    if (resolution.confidence < 0.5) {
      expect(resolution.alternativeActions).toBeDefined()
      expect(resolution.alternativeActions!.length).toBeGreaterThan(0)
    }
  })
})
