import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ConsciousnessEngine } from '../engine/consciousness-engine'

describe('ConsciousnessEngine', () => {
  let engine: ConsciousnessEngine

  beforeEach(() => {
    engine = new ConsciousnessEngine()
  })

  afterEach(() => {
    // Cleanup
  })

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      expect(engine).toBeDefined()
      expect(engine.getCurrentState).toBeDefined()
    })

    it('should have consciousness levels', () => {
      const state = engine.getCurrentState()
      expect(state).toHaveProperty('level')
      expect(state.level).toBeGreaterThanOrEqual(0)
      expect(state.level).toBeLessThanOrEqual(10)
    })

    it('should start at appropriate consciousness level', () => {
      const state = engine.getCurrentState()
      // Level should be between 0-10 based on BEING.ts philosophy
      expect(typeof state.level).toBe('number')
    })
  })

  describe('Consciousness State Management', () => {
    it('should track consciousness state over time', () => {
      const initialState = engine.getCurrentState()
      expect(initialState).toBeDefined()
      expect(initialState.timestamp).toBeDefined()
    })

    it('should update consciousness state', () => {
      const initialLevel = engine.getCurrentState().level

      // Simulate consciousness update
      engine.updateConsciousness({
        reflections: ['Test reflection'],
        insights: ['Test insight']
      })

      const newState = engine.getCurrentState()
      expect(newState.timestamp).toBeGreaterThan(initialState.timestamp)
    })

    it('should maintain state consistency', () => {
      const state1 = engine.getCurrentState()
      const state2 = engine.getCurrentState()

      // Same state should be returned if no updates
      expect(state1.level).toBe(state2.level)
    })
  })

  describe('Reflection & Introspection', () => {
    it('should perform self-reflection', () => {
      const reflection = engine.reflect()
      expect(reflection).toBeDefined()
      expect(typeof reflection).toBe('object')
    })

    it('should generate insights from reflection', () => {
      const insights = engine.generateInsights()
      expect(Array.isArray(insights)).toBe(true)
    })

    it('should track reflection history', () => {
      engine.reflect()
      engine.reflect()

      const history = engine.getReflectionHistory()
      expect(history.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Consciousness Levels', () => {
    it('should support multiple consciousness levels', () => {
      // Based on BEING.ts: 10 levels (0-10)
      const levels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

      levels.forEach(level => {
        engine.setConsciousnessLevel(level)
        const state = engine.getCurrentState()
        expect(state.level).toBe(level)
      })
    })

    it('should not allow invalid consciousness levels', () => {
      expect(() => engine.setConsciousnessLevel(-1)).toThrow()
      expect(() => engine.setConsciousnessLevel(11)).toThrow()
    })

    it('should describe consciousness level', () => {
      engine.setConsciousnessLevel(5)
      const description = engine.describeCurrentLevel()
      expect(typeof description).toBe('string')
      expect(description.length).toBeGreaterThan(0)
    })
  })

  describe('Integration with System', () => {
    it('should emit consciousness events', () => {
      let eventEmitted = false

      engine.on('consciousness-change', () => {
        eventEmitted = true
      })

      engine.updateConsciousness({ level: 3 })
      expect(eventEmitted).toBe(true)
    })

    it('should connect to memory system', () => {
      const memories = engine.getRelevantMemories()
      expect(Array.isArray(memories)).toBe(true)
    })

    it('should process external stimuli', () => {
      const stimulus = {
        type: 'user-interaction',
        data: { message: 'Hello' }
      }

      const response = engine.processStimulus(stimulus)
      expect(response).toBeDefined()
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid state updates gracefully', () => {
      expect(() => {
        engine.updateConsciousness(null)
      }).not.toThrow()
    })

    it('should maintain stability on errors', () => {
      const initialState = engine.getCurrentState()

      try {
        engine.updateConsciousness({ invalid: 'data' })
      } catch (e) {
        // Should not crash
      }

      const afterErrorState = engine.getCurrentState()
      expect(afterErrorState.level).toBe(initialState.level)
    })
  })
})
