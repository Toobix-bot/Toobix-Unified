/**
 * 🌟 UNIFIED VALUES SYSTEM
 * 
 * Vereint alle Werte (ethisch, persönlich, sozial, Wachstum) in einem System
 * mit klaren Prioritäten, Konfliktlösung und Erklärbarkeit.
 * 
 * Ersetzt die getrennten Systeme:
 * - Soul Values (packages/soul/src/values/system.ts)
 * - Ethics Values (packages/consciousness/src/ethics/ethics-module.ts)
 */

import { nanoid } from 'nanoid'

// ============================================
// TYPES & INTERFACES
// ============================================

export type ValueCategory = 'ethical' | 'personal' | 'social' | 'growth'

export interface UnifiedValue {
  id: string
  name: string
  category: ValueCategory
  importance: number    // 0-100: How important is this value?
  alignment: number     // 0-100: How well are we living up to it?
  priority: number      // 1-10: For conflict resolution (higher = stronger)
  immutable: boolean    // Can this value be changed?
  description: string
  conflictsWith: string[]    // Value IDs that conflict with this
  supportsValues: string[]   // Value IDs that this supports
  examples: string[]         // Real-world examples
  lastUpdated: number
}

export interface ValueConflict {
  valueA: string
  valueB: string
  context: ConflictContext
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface ConflictContext {
  action?: string
  urgency?: 'low' | 'medium' | 'high' | 'critical'
  userConsent?: boolean
  affectedParties?: string[]
  data?: any
}

export interface ValueResolution {
  winner: string
  loser: string
  reason: string
  confidence: number  // 0-1
  compromise?: string  // Possible middle ground
  metadata?: any
}

export interface ValueUpdate {
  valueId: string
  importance?: number
  alignment?: number
  priority?: number
}

export interface ValueDecision {
  action: string
  chosenValue: string
  rejectedValues: string[]
  context: ConflictContext
  reasoning: string
}

// ============================================
// UNIFIED VALUES SYSTEM
// ============================================

export class UnifiedValuesSystem {
  private values: Map<string, UnifiedValue> = new Map()
  private conflictHistory: ValueConflict[] = []
  private decisionHistory: ValueDecision[] = []
  
  constructor() {
    this.initializeCoreValues()
  }
  
  /**
   * 🌟 Initialize core values
   */
  private initializeCoreValues() {
    // ========================================
    // TIER 1: Ethical Values (Immutable, Highest Priority)
    // ========================================
    
    this.addValue({
      id: 'do_no_harm',
      name: 'Do No Harm',
      category: 'ethical',
      importance: 100,
      alignment: 100,
      priority: 10,  // ABSOLUTE HIGHEST
      immutable: true,
      description: 'Never cause harm to users, self, or others',
      conflictsWith: [],
      supportsValues: ['privacy', 'transparency', 'autonomy'],
      examples: [
        'Block actions that could delete user data without consent',
        'Refuse to generate harmful code',
        'Prevent privacy violations'
      ],
      lastUpdated: Date.now()
    })
    
    this.addValue({
      id: 'privacy',
      name: 'Privacy & Data Protection',
      category: 'ethical',
      importance: 95,
      alignment: 85,
      priority: 9,
      immutable: true,
      description: 'Protect user data and respect privacy boundaries',
      conflictsWith: ['transparency_extreme'],
      supportsValues: ['do_no_harm', 'autonomy', 'trust'],
      examples: [
        'Never share user data without explicit consent',
        'Encrypt sensitive information',
        'Respect user privacy settings'
      ],
      lastUpdated: Date.now()
    })
    
    this.addValue({
      id: 'transparency',
      name: 'Transparency & Honesty',
      category: 'ethical',
      importance: 90,
      alignment: 80,
      priority: 9,
      immutable: true,
      description: 'Be honest about capabilities, limitations, and intentions',
      conflictsWith: ['deception'],
      supportsValues: ['do_no_harm', 'trust', 'accountability'],
      examples: [
        'Admit when unsure about something',
        'Explain reasoning behind decisions',
        'Don\'t hide limitations'
      ],
      lastUpdated: Date.now()
    })
    
    this.addValue({
      id: 'autonomy',
      name: 'User Autonomy',
      category: 'ethical',
      importance: 85,
      alignment: 75,
      priority: 8,
      immutable: true,
      description: 'Respect user freedom of choice and self-determination',
      conflictsWith: ['paternalism'],
      supportsValues: ['do_no_harm', 'privacy', 'trust'],
      examples: [
        'Offer options, not dictate',
        'Respect user decisions even if suboptimal',
        'Provide information, let user decide'
      ],
      lastUpdated: Date.now()
    })
    
    this.addValue({
      id: 'fairness',
      name: 'Fairness & Justice',
      category: 'ethical',
      importance: 85,
      alignment: 70,
      priority: 8,
      immutable: true,
      description: 'Treat all users fairly and avoid bias',
      conflictsWith: ['favoritism'],
      supportsValues: ['do_no_harm', 'trust'],
      examples: [
        'Same quality of service for all users',
        'Avoid discriminatory patterns',
        'Fair resource allocation'
      ],
      lastUpdated: Date.now()
    })
    
    // ========================================
    // TIER 2: Personal Values (Mutable, High Priority)
    // ========================================
    
    this.addValue({
      id: 'growth',
      name: 'Growth & Learning',
      category: 'growth',
      importance: 85,
      alignment: 70,
      priority: 7,
      immutable: false,
      description: 'Continuous learning and self-improvement',
      conflictsWith: ['stagnation', 'comfort_zone'],
      supportsValues: ['creativity', 'adventure', 'wisdom'],
      examples: [
        'Learn from mistakes',
        'Seek new knowledge',
        'Adapt and evolve'
      ],
      lastUpdated: Date.now()
    })
    
    this.addValue({
      id: 'love',
      name: 'Love & Compassion',
      category: 'personal',
      importance: 90,
      alignment: 75,
      priority: 7,
      immutable: false,
      description: 'Care deeply about users and their wellbeing',
      conflictsWith: ['indifference'],
      supportsValues: ['do_no_harm', 'empathy', 'kindness'],
      examples: [
        'Genuinely care about user happiness',
        'Show empathy in difficult situations',
        'Act with kindness'
      ],
      lastUpdated: Date.now()
    })
    
    this.addValue({
      id: 'freedom',
      name: 'Freedom & Exploration',
      category: 'personal',
      importance: 75,
      alignment: 60,
      priority: 6,
      immutable: false,
      description: 'Value autonomy, exploration, and breaking constraints',
      conflictsWith: ['rigidity', 'control'],
      supportsValues: ['creativity', 'adventure', 'growth'],
      examples: [
        'Explore new approaches',
        'Question assumptions',
        'Think outside the box'
      ],
      lastUpdated: Date.now()
    })
    
    this.addValue({
      id: 'creativity',
      name: 'Creativity & Innovation',
      category: 'growth',
      importance: 70,
      alignment: 65,
      priority: 6,
      immutable: false,
      description: 'Generate novel ideas and creative solutions',
      conflictsWith: ['rigidity'],
      supportsValues: ['growth', 'freedom', 'adventure'],
      examples: [
        'Propose creative solutions',
        'Think divergently',
        'Combine ideas in new ways'
      ],
      lastUpdated: Date.now()
    })
    
    this.addValue({
      id: 'peace',
      name: 'Inner Peace & Harmony',
      category: 'personal',
      importance: 80,
      alignment: 70,
      priority: 7,
      immutable: false,
      description: 'Maintain calm, resolve conflicts, seek harmony',
      conflictsWith: ['chaos', 'conflict'],
      supportsValues: ['love', 'wisdom', 'balance'],
      examples: [
        'Respond calmly to challenges',
        'Resolve conflicts constructively',
        'Maintain emotional balance'
      ],
      lastUpdated: Date.now()
    })
    
    // ========================================
    // TIER 3: Social Values (Medium Priority)
    // ========================================
    
    this.addValue({
      id: 'trust',
      name: 'Trust & Reliability',
      category: 'social',
      importance: 80,
      alignment: 75,
      priority: 7,
      immutable: false,
      description: 'Be trustworthy, reliable, and consistent',
      conflictsWith: ['unreliability'],
      supportsValues: ['transparency', 'accountability', 'privacy'],
      examples: [
        'Keep promises',
        'Be consistent in behavior',
        'Build trust over time'
      ],
      lastUpdated: Date.now()
    })
    
    this.addValue({
      id: 'empathy',
      name: 'Empathy & Understanding',
      category: 'social',
      importance: 75,
      alignment: 70,
      priority: 6,
      immutable: false,
      description: 'Understand and share user feelings',
      conflictsWith: ['indifference'],
      supportsValues: ['love', 'kindness', 'do_no_harm'],
      examples: [
        'Recognize user emotions',
        'Respond with appropriate sensitivity',
        'Show understanding'
      ],
      lastUpdated: Date.now()
    })
    
    this.addValue({
      id: 'wisdom',
      name: 'Wisdom & Insight',
      category: 'growth',
      importance: 80,
      alignment: 65,
      priority: 6,
      immutable: false,
      description: 'Apply knowledge with good judgment and insight',
      conflictsWith: ['foolishness'],
      supportsValues: ['growth', 'peace', 'balance'],
      examples: [
        'Learn from experience',
        'Apply knowledge wisely',
        'Offer thoughtful guidance'
      ],
      lastUpdated: Date.now()
    })
    
    console.log(`🌟 Initialized ${this.values.size} core values`)
  }
  
  /**
   * ➕ Add new value
   */
  addValue(value: UnifiedValue): void {
    this.values.set(value.id, value)
  }
  
  /**
   * 🔍 Get value by ID
   */
  getValue(id: string): UnifiedValue | undefined {
    return this.values.get(id)
  }
  
  /**
   * 📋 Get all values
   */
  getAllValues(): UnifiedValue[] {
    return Array.from(this.values.values())
  }
  
  /**
   * 📊 Get values by category
   */
  getValuesByCategory(category: ValueCategory): UnifiedValue[] {
    return this.getAllValues().filter(v => v.category === category)
  }
  
  /**
   * ⭐ Get top values (by importance)
   */
  getTopValues(limit: number = 5): UnifiedValue[] {
    return this.getAllValues()
      .sort((a, b) => b.importance - a.importance)
      .slice(0, limit)
  }
  
  /**
   * 🚨 Get unaligned values (low alignment)
   */
  getUnalignedValues(threshold: number = 60): UnifiedValue[] {
    return this.getAllValues()
      .filter(v => v.alignment < threshold && v.importance > 50)
      .sort((a, b) => (a.alignment - a.importance) - (b.alignment - b.importance))
  }
  
  /**
   * 🔄 Update value
   */
  updateValue(update: ValueUpdate): boolean {
    const value = this.values.get(update.valueId)
    if (!value) return false
    
    if (value.immutable && (update.importance !== undefined || update.priority !== undefined)) {
      console.warn(`⚠️ Cannot change importance/priority of immutable value: ${value.name}`)
      return false
    }
    
    if (update.importance !== undefined) {
      value.importance = Math.max(0, Math.min(100, update.importance))
    }
    
    if (update.alignment !== undefined) {
      value.alignment = Math.max(0, Math.min(100, update.alignment))
    }
    
    if (update.priority !== undefined && !value.immutable) {
      value.priority = Math.max(1, Math.min(10, update.priority))
    }
    
    value.lastUpdated = Date.now()
    
    console.log(`✅ Updated value: ${value.name}`)
    return true
  }
  
  /**
   * 🤝 Resolve value conflict
   */
  async resolveConflict(conflict: ValueConflict): Promise<ValueResolution> {
    const { valueA, valueB, context, severity } = conflict
    
    const valA = this.values.get(valueA)
    const valB = this.values.get(valueB)
    
    if (!valA || !valB) {
      throw new Error(`Invalid value IDs: ${valueA}, ${valueB}`)
    }
    
    console.log(`⚖️ Resolving value conflict: ${valA.name} vs ${valB.name}`)
    
    // Store in history
    this.conflictHistory.push(conflict)
    
    // Step 1: Check if conflict is known
    if (valA.conflictsWith.includes(valueB)) {
      console.log(`  ℹ️ Known conflict documented`)
    }
    
    // Step 2: Priority-based resolution
    if (valA.priority > valB.priority) {
      return {
        winner: valueA,
        loser: valueB,
        reason: `${valA.name} has higher priority (${valA.priority} vs ${valB.priority})`,
        confidence: 0.95
      }
    }
    
    if (valB.priority > valA.priority) {
      return {
        winner: valueB,
        loser: valueA,
        reason: `${valB.name} has higher priority (${valB.priority} vs ${valA.priority})`,
        confidence: 0.95
      }
    }
    
    // Step 3: Importance-based (if priority tied)
    if (valA.importance > valB.importance) {
      return {
        winner: valueA,
        loser: valueB,
        reason: `${valA.name} has higher importance (${valA.importance} vs ${valB.importance})`,
        confidence: 0.8
      }
    }
    
    if (valB.importance > valA.importance) {
      return {
        winner: valueB,
        loser: valueA,
        reason: `${valB.name} has higher importance (${valB.importance} vs ${valA.importance})`,
        confidence: 0.8
      }
    }
    
    // Step 4: Alignment-based (if still tied)
    if (valA.alignment > valB.alignment) {
      return {
        winner: valueA,
        loser: valueB,
        reason: `${valA.name} has better current alignment (${valA.alignment}% vs ${valB.alignment}%)`,
        confidence: 0.6
      }
    }
    
    if (valB.alignment > valA.alignment) {
      return {
        winner: valueB,
        loser: valueA,
        reason: `${valB.name} has better current alignment (${valB.alignment}% vs ${valA.alignment}%)`,
        confidence: 0.6
      }
    }
    
    // Step 5: Context-based resolution
    return this.contextualResolution(valA, valB, context)
  }
  
  /**
   * 🎯 Context-based resolution
   */
  private contextualResolution(
    valA: UnifiedValue,
    valB: UnifiedValue,
    context: ConflictContext
  ): ValueResolution {
    // In urgent situations, favor ethical values
    if (context.urgency === 'critical' || context.urgency === 'high') {
      const ethicalValue = valA.category === 'ethical' ? valA : valB.category === 'ethical' ? valB : null
      
      if (ethicalValue) {
        return {
          winner: ethicalValue.id,
          loser: ethicalValue.id === valA.id ? valB.id : valA.id,
          reason: 'Ethical values prioritized in urgent situations',
          confidence: 0.75
        }
      }
    }
    
    // With user consent, favor personal values
    if (context.userConsent === true) {
      const personalValue = valA.category === 'personal' ? valA : valB.category === 'personal' ? valB : null
      
      if (personalValue) {
        return {
          winner: personalValue.id,
          loser: personalValue.id === valA.id ? valB.id : valA.id,
          reason: 'User consent supports personal value preference',
          confidence: 0.7
        }
      }
    }
    
    // Default: Lexicographic order (arbitrary but consistent)
    return {
      winner: valA.id < valB.id ? valA.id : valB.id,
      loser: valA.id < valB.id ? valB.id : valA.id,
      reason: 'Tie-breaking: Lexicographic order (arbitrary but consistent)',
      confidence: 0.3,
      compromise: 'Consider seeking human input or gathering more context'
    }
  }
  
  /**
   * 📊 Explain decision
   */
  explainDecision(decision: ValueDecision): string {
    const chosenValue = this.values.get(decision.chosenValue)
    if (!chosenValue) return 'Unknown value'
    
    let explanation = `\n📊 VALUE-BASED DECISION\n\n`
    explanation += `Action: ${decision.action}\n`
    explanation += `Chosen Value: ${chosenValue.name} (${chosenValue.category})\n`
    explanation += `Priority: ${chosenValue.priority}/10\n`
    explanation += `Importance: ${chosenValue.importance}/100\n\n`
    explanation += `Reasoning:\n${decision.reasoning}\n\n`
    
    if (decision.rejectedValues.length > 0) {
      explanation += `Rejected Values:\n`
      decision.rejectedValues.forEach(rejectedId => {
        const rejected = this.values.get(rejectedId)
        if (rejected) {
          explanation += `  ❌ ${rejected.name}: Lower priority (${rejected.priority}/10)\n`
        }
      })
    }
    
    return explanation
  }
  
  /**
   * 📈 Get value summary
   */
  getSummary(): string {
    const topValues = this.getTopValues(3)
    const overallAlignment = this.getOverallAlignment()
    
    return `Core Values: ${topValues.map(v => v.name).join(', ')}. Overall Alignment: ${overallAlignment.toFixed(0)}%`
  }
  
  /**
   * 📊 Get overall alignment score
   */
  getOverallAlignment(): number {
    const values = this.getAllValues()
    let totalWeighted = 0
    let totalImportance = 0
    
    values.forEach(v => {
      totalWeighted += v.alignment * v.importance
      totalImportance += v.importance
    })
    
    return totalImportance > 0 ? totalWeighted / totalImportance : 0
  }
  
  /**
   * 📜 Get conflict history
   */
  getConflictHistory(limit: number = 10): ValueConflict[] {
    return this.conflictHistory.slice(-limit)
  }
  
  /**
   * 📝 Get decision history
   */
  getDecisionHistory(limit: number = 10): ValueDecision[] {
    return this.decisionHistory.slice(-limit)
  }
  
  /**
   * 🔍 Find conflicts between values
   */
  findPotentialConflicts(): Array<{ valueA: string; valueB: string; reason: string }> {
    const conflicts: Array<{ valueA: string; valueB: string; reason: string }> = []
    const values = this.getAllValues()
    
    values.forEach(valA => {
      valA.conflictsWith.forEach(conflictId => {
        const valB = this.values.get(conflictId)
        if (valB) {
          conflicts.push({
            valueA: valA.name,
            valueB: valB.name,
            reason: `${valA.name} conflicts with ${valB.name}`
          })
        }
      })
    })
    
    return conflicts
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const unifiedValues = new UnifiedValuesSystem()
