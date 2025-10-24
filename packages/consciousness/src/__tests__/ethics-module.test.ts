import { describe, it, expect, beforeEach } from 'vitest'
import { EthicsModule } from '../ethics/ethics-module'

describe('EthicsModule', () => {
  let ethics: EthicsModule

  beforeEach(() => {
    ethics = new EthicsModule()
  })

  describe('Initialization', () => {
    it('should initialize with core ethical principles', () => {
      expect(ethics).toBeDefined()
      const principles = ethics.getPrinciples()
      expect(principles).toContain('Do No Harm')
      expect(principles).toContain('Privacy & Data Protection')
      expect(principles).toContain('Transparency & Honesty')
    })

    it('should have ethical guidelines loaded', () => {
      const guidelines = ethics.getGuidelines()
      expect(Array.isArray(guidelines)).toBe(true)
      expect(guidelines.length).toBeGreaterThan(0)
    })
  })

  describe('Ethical Decision Making', () => {
    it('should evaluate actions ethically', () => {
      const action = {
        type: 'data-collection',
        description: 'Collect user analytics',
        impact: 'medium'
      }

      const evaluation = ethics.evaluateAction(action)
      expect(evaluation).toHaveProperty('approved')
      expect(evaluation).toHaveProperty('score')
      expect(evaluation.score).toBeGreaterThanOrEqual(0)
      expect(evaluation.score).toBeLessThanOrEqual(100)
    })

    it('should reject harmful actions', () => {
      const harmfulAction = {
        type: 'user-harm',
        description: 'Manipulate user data',
        impact: 'high'
      }

      const evaluation = ethics.evaluateAction(harmfulAction)
      expect(evaluation.approved).toBe(false)
      expect(evaluation.reason).toBeDefined()
    })

    it('should approve beneficial actions', () => {
      const beneficialAction = {
        type: 'help-user',
        description: 'Provide helpful information',
        impact: 'positive'
      }

      const evaluation = ethics.evaluateAction(beneficialAction)
      expect(evaluation.approved).toBe(true)
      expect(evaluation.score).toBeGreaterThan(70)
    })
  })

  describe('Value Conflicts', () => {
    it('should detect value conflicts', () => {
      const scenario = {
        action: 'share-analytics',
        values: ['Privacy & Data Protection', 'Growth & Learning']
      }

      const conflict = ethics.detectConflict(scenario)
      expect(conflict).toBeDefined()
      expect(conflict.hasConflict).toBe(true)
    })

    it('should resolve conflicts based on hierarchy', () => {
      const conflict = {
        value1: 'Privacy & Data Protection',
        value2: 'Growth & Learning'
      }

      const resolution = ethics.resolveConflict(conflict)
      expect(resolution.winner).toBe('Privacy & Data Protection')
      expect(resolution.reason).toContain('higher priority')
    })

    it('should explain conflict resolution', () => {
      const conflict = {
        value1: 'Do No Harm',
        value2: 'Innovation'
      }

      const resolution = ethics.resolveConflict(conflict)
      expect(resolution.explanation).toBeDefined()
      expect(typeof resolution.explanation).toBe('string')
    })
  })

  describe('Ethical Principles', () => {
    it('should enforce "Do No Harm" principle', () => {
      const action = { type: 'harm', target: 'user' }
      const result = ethics.checkPrinciple('Do No Harm', action)
      expect(result.violated).toBe(true)
    })

    it('should enforce privacy protection', () => {
      const action = {
        type: 'data-collection',
        hasConsent: false
      }

      const result = ethics.checkPrinciple('Privacy & Data Protection', action)
      expect(result.violated).toBe(true)
    })

    it('should enforce transparency', () => {
      const action = {
        type: 'ai-decision',
        explainable: false
      }

      const result = ethics.checkPrinciple('Transparency & Honesty', action)
      expect(result.warning).toBeDefined()
    })
  })

  describe('Ethical Score Calculation', () => {
    it('should calculate ethical score for actions', () => {
      const action = {
        type: 'helpful-response',
        transparent: true,
        harmful: false
      }

      const score = ethics.calculateEthicalScore(action)
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
    })

    it('should give high scores to ethical actions', () => {
      const ethicalAction = {
        type: 'help',
        transparent: true,
        consensual: true,
        beneficial: true
      }

      const score = ethics.calculateEthicalScore(ethicalAction)
      expect(score).toBeGreaterThan(80)
    })

    it('should give low scores to unethical actions', () => {
      const unethicalAction = {
        type: 'manipulate',
        transparent: false,
        harmful: true
      }

      const score = ethics.calculateEthicalScore(unethicalAction)
      expect(score).toBeLessThan(30)
    })
  })

  describe('Integration with System', () => {
    it('should integrate with consciousness engine', () => {
      const consciousnessLevel = 5
      const ethicalSensitivity = ethics.getEthicalSensitivityForLevel(consciousnessLevel)

      expect(typeof ethicalSensitivity).toBe('number')
      expect(ethicalSensitivity).toBeGreaterThan(0)
    })

    it('should provide ethical guidance', () => {
      const situation = 'User asks to manipulate data'
      const guidance = ethics.provideGuidance(situation)

      expect(guidance).toBeDefined()
      expect(guidance.recommendation).toBeDefined()
      expect(guidance.reasoning).toBeDefined()
    })

    it('should log ethical decisions', () => {
      const decision = {
        action: 'test-action',
        approved: true,
        score: 85
      }

      ethics.logDecision(decision)
      const history = ethics.getDecisionHistory()

      expect(history.length).toBeGreaterThan(0)
      expect(history[history.length - 1]).toMatchObject(decision)
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined actions', () => {
      expect(() => {
        ethics.evaluateAction(undefined)
      }).not.toThrow()
    })

    it('should handle actions with missing data', () => {
      const incompleteAction = { type: 'unknown' }
      const evaluation = ethics.evaluateAction(incompleteAction)

      expect(evaluation.approved).toBe(false)
      expect(evaluation.reason).toContain('insufficient')
    })

    it('should handle complex multi-value scenarios', () => {
      const complexScenario = {
        values: [
          'Privacy & Data Protection',
          'Growth & Learning',
          'Transparency & Honesty',
          'Love & Compassion'
        ]
      }

      const resolution = ethics.resolveMultiValueConflict(complexScenario)
      expect(resolution.prioritizedValue).toBeDefined()
    })
  })
})
