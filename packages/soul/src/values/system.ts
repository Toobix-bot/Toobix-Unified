/**
 * Values System
 * Core values, beliefs, and alignment tracking
 */

import type { ValueType, Value, Belief, SoulEvent } from '../types'
import { nanoid } from 'nanoid'

export class ValuesSystem {
  private values: Map<ValueType, Value>
  private beliefs: Belief[]
  private learningRate: number

  constructor(learningRate: number = 0.1) {
    this.learningRate = learningRate
    this.beliefs = []
    
    // Initialize core values with default importance
    this.values = new Map([
      ['love', { type: 'love', importance: 90, alignment: 70, lastUpdated: Date.now() }],
      ['family', { type: 'family', importance: 85, alignment: 75, lastUpdated: Date.now() }],
      ['friendship', { type: 'friendship', importance: 80, alignment: 80, lastUpdated: Date.now() }],
      ['freedom', { type: 'freedom', importance: 75, alignment: 60, lastUpdated: Date.now() }],
      ['growth', { type: 'growth', importance: 85, alignment: 70, lastUpdated: Date.now() }],
      ['creativity', { type: 'creativity', importance: 70, alignment: 65, lastUpdated: Date.now() }],
      ['peace', { type: 'peace', importance: 90, alignment: 70, lastUpdated: Date.now() }],
      ['justice', { type: 'justice', importance: 75, alignment: 60, lastUpdated: Date.now() }],
      ['adventure', { type: 'adventure', importance: 60, alignment: 50, lastUpdated: Date.now() }],
      ['wisdom', { type: 'wisdom', importance: 80, alignment: 65, lastUpdated: Date.now() }]
    ])
  }

  /**
   * Process value impacts from an event
   */
  processEvent(event: SoulEvent): void {
    if (!event.valueImpact) return
    
    const now = Date.now()
    
    for (const [valueType, impact] of Object.entries(event.valueImpact)) {
      const value = this.values.get(valueType as ValueType)
      if (!value) continue
      
      // Update alignment based on impact and learning rate
      const newAlignment = Math.max(-100, Math.min(100, 
        value.alignment + impact * this.learningRate
      ))
      
      value.alignment = newAlignment
      value.lastUpdated = now
      
      this.values.set(valueType as ValueType, value)
    }
  }

  /**
   * Add or update a belief
   */
  addBelief(statement: string, category: string, strength: number = 70): string {
    const belief: Belief = {
      id: nanoid(),
      statement,
      strength: Math.max(0, Math.min(100, strength)),
      category,
      formed: Date.now()
    }
    
    this.beliefs.push(belief)
    return belief.id
  }

  /**
   * Challenge a belief (reduces strength)
   */
  challengeBelief(id: string, amount: number = 10): boolean {
    const belief = this.beliefs.find(b => b.id === id)
    if (!belief) return false
    
    belief.strength = Math.max(0, belief.strength - amount)
    belief.challenged = Date.now()
    
    return true
  }

  /**
   * Reinforce a belief (increases strength)
   */
  reinforceBelief(id: string, amount: number = 10): boolean {
    const belief = this.beliefs.find(b => b.id === id)
    if (!belief) return false
    
    belief.strength = Math.min(100, belief.strength + amount)
    
    return true
  }

  /**
   * Get value by type
   */
  getValue(type: ValueType): Value | undefined {
    return this.values.get(type)
  }

  /**
   * Get all values sorted by importance
   */
  getTopValues(limit: number = 5): Value[] {
    return Array.from(this.values.values())
      .sort((a, b) => b.importance - a.importance)
      .slice(0, limit)
  }

  /**
   * Get overall values alignment score
   */
  getAlignmentScore(): number {
    let totalWeightedAlignment = 0
    let totalImportance = 0
    
    for (const value of this.values.values()) {
      totalWeightedAlignment += value.alignment * value.importance
      totalImportance += value.importance
    }
    
    return totalImportance > 0 ? totalWeightedAlignment / totalImportance : 0
  }

  /**
   * Get values that are not being lived up to (low alignment)
   */
  getUnalignedValues(threshold: number = 50): Value[] {
    return Array.from(this.values.values())
      .filter(v => v.alignment < threshold && v.importance > 50)
      .sort((a, b) => (a.alignment - a.importance) - (b.alignment - b.importance))
  }

  /**
   * Get strong beliefs (strength > threshold)
   */
  getStrongBeliefs(threshold: number = 70): Belief[] {
    return this.beliefs
      .filter(b => b.strength >= threshold)
      .sort((a, b) => b.strength - a.strength)
  }

  /**
   * Get all beliefs by category
   */
  getBeliefsByCategory(category: string): Belief[] {
    return this.beliefs.filter(b => b.category === category)
  }

  /**
   * Get values summary as string
   */
  getSummary(): string {
    const topValues = this.getTopValues(3)
    const alignment = Math.round(this.getAlignmentScore())
    const valueNames = topValues.map(v => v.type).join(', ')
    
    return `Core values: ${valueNames}. Overall alignment: ${alignment}%`
  }

  /**
   * Export state
   */
  getState(): { values: Map<ValueType, Value>; beliefs: Belief[] } {
    return {
      values: new Map(this.values),
      beliefs: [...this.beliefs]
    }
  }

  /**
   * Import state
   */
  setState(values: Map<ValueType, Value>, beliefs: Belief[]): void {
    this.values = new Map(values)
    this.beliefs = [...beliefs]
  }
}
