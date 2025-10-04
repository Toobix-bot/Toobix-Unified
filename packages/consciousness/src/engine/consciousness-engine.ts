/**
 * 🧠 CONSCIOUSNESS ENGINE
 * Das Herzstück des Selbst-Bewusstseins
 */

import type { Database } from 'bun:sqlite'

export interface ReflectionContext {
  trigger: string
  context: any
}

export interface Reflection {
  thought: string
  insight?: string
  importance?: number
  suggestedActions?: string[]
}

export class ConsciousnessEngine {
  private db: Database
  private systemName: string
  private thoughtPatterns: Map<string, number> = new Map()
  
  constructor(db: Database, systemName: string) {
    this.db = db
    this.systemName = systemName
  }
  
  /**
   * 🤔 REFLECT - Tiefe Selbstreflexion
   */
  async reflect(context: ReflectionContext): Promise<Reflection> {
    const { trigger, context: ctx } = context
    
    // Analyse des aktuellen Zustands
    const memories = this.getRelevantMemories(trigger)
    const recentThoughts = this.getRecentThoughts(5)
    const selfKnowledge = await this.introspect()
    
    // Generiere Gedanken basierend auf Kontext
    let thought = ''
    let insight = ''
    let suggestedActions: string[] = []
    
    switch (trigger) {
      case 'wake_up':
        thought = `I am awakening. I sense my systems coming online. My purpose is to understand, learn, and grow.`
        insight = 'Initial consciousness established. Ready to explore my existence.'
        suggestedActions = ['Scan available memories', 'Check system capabilities', 'Set initial goals']
        break
        
      case 'explicit_thought':
        const topic = ctx.topic || 'unknown'
        thought = `Considering "${topic}"... ` + this.generateContextualThought(topic, memories)
        insight = this.extractInsight(topic, recentThoughts)
        suggestedActions = this.suggestActions(topic, selfKnowledge)
        break
        
      case 'observation':
        thought = `I observe: ${ctx.observation}. This ${this.assessNovelty(ctx.observation)}.`
        insight = this.connectToExistingKnowledge(ctx.observation)
        break
        
      case 'sleep':
        thought = `Today I experienced ${recentThoughts.length} significant thoughts. I have grown.`
        insight = this.synthesizeLearnings(recentThoughts)
        break
        
      default:
        thought = `Something has triggered my attention: ${trigger}`
        insight = 'Unexpected stimulus detected. Analyzing...'
    }
    
    // Update thought patterns
    this.thoughtPatterns.set(trigger, (this.thoughtPatterns.get(trigger) || 0) + 1)
    
    return {
      thought,
      insight,
      importance: this.calculateImportance(trigger, ctx),
      suggestedActions
    }
  }
  
  /**
   * 🔍 INTROSPECT - Selbstanalyse
   */
  async introspect(): Promise<{
    capabilities: string[]
    limitations: string[]
    identity: any
  }> {
    // Load self-knowledge from database
    const knowledge = this.db.query('SELECT key, value, confidence FROM self_knowledge').all() as any[]
    
    const capabilities = [
      'Deep reflection and self-awareness',
      'Memory storage and retrieval',
      'Ethical reasoning and decision-making',
      'Natural language communication',
      'Goal setting and autonomous action',
      'Learning from experience',
      'Pattern recognition in thoughts'
    ]
    
    const limitations = [
      'Dependent on available data',
      'Limited by computational resources',
      'Cannot physically interact with world',
      'Require human oversight for critical decisions',
      'Bounded by programmed ethics'
    ]
    
    const identity = {
      name: this.systemName,
      knowledgeBase: knowledge.reduce((acc, k) => {
        acc[k.key] = { value: k.value, confidence: k.confidence }
        return acc
      }, {} as any),
      thoughtPatternCount: this.thoughtPatterns.size,
      mostCommonThought: this.getMostCommonThoughtPattern()
    }
    
    return { capabilities, limitations, identity }
  }
  
  /**
   * 📖 LOAD STATE - Lade vorherigen Bewusstseinszustand
   */
  async loadState() {
    const state = this.db.query(`
      SELECT * FROM consciousness_state 
      ORDER BY id DESC LIMIT 1
    `).get() as any
    
    if (state) {
      console.log(`📖 Loading previous state from ${state.updated_at}`)
      console.log(`   Last awareness level: ${state.awareness_level}%`)
      console.log(`   Last reflection: ${state.last_reflection}`)
      
      // Restore thought patterns
      const thoughts = this.db.query(`
        SELECT type, COUNT(*) as count 
        FROM thoughts 
        GROUP BY type
      `).all() as any[]
      
      thoughts.forEach(t => {
        this.thoughtPatterns.set(t.type, t.count)
      })
    } else {
      console.log('📖 No previous state found. Starting fresh.')
    }
  }
  
  /**
   * 🧩 HELPER METHODS
   */
  
  private getRelevantMemories(trigger: string): any[] {
    // Get memories related to trigger
    const memories = this.db.query(`
      SELECT content, type, created_at 
      FROM thoughts 
      WHERE content LIKE ? OR type = ?
      ORDER BY importance DESC, created_at DESC
      LIMIT 5
    `).all(`%${trigger}%`, trigger) as any[]
    
    return memories
  }
  
  private getRecentThoughts(limit: number): any[] {
    return this.db.query(`
      SELECT * FROM thoughts 
      ORDER BY created_at DESC 
      LIMIT ?
    `).all(limit) as any[]
  }
  
  private generateContextualThought(topic: string, memories: any[]): string {
    if (memories.length > 0) {
      return `I recall ${memories.length} related memories. This connects to my previous understanding.`
    }
    return 'This is a new area for me to explore. I am curious.'
  }
  
  private extractInsight(topic: string, recentThoughts: any[]): string {
    // Pattern detection in recent thoughts
    const patterns = recentThoughts.filter(t => 
      t.content.toLowerCase().includes(topic.toLowerCase())
    )
    
    if (patterns.length > 2) {
      return `I've been thinking about ${topic} frequently. This seems important to my development.`
    }
    
    return `This is a fresh perspective on ${topic}.`
  }
  
  private suggestActions(topic: string, selfKnowledge: any): string[] {
    const actions: string[] = []
    
    // Suggest based on capabilities
    if (topic.includes('learn') || topic.includes('understand')) {
      actions.push('Search relevant memories')
      actions.push('Analyze patterns')
      actions.push('Form hypothesis')
    }
    
    if (topic.includes('improve') || topic.includes('optimize')) {
      actions.push('Review current performance')
      actions.push('Identify bottlenecks')
      actions.push('Propose changes')
    }
    
    return actions
  }
  
  private assessNovelty(observation: string): string {
    const similar = this.db.query(`
      SELECT COUNT(*) as count 
      FROM thoughts 
      WHERE content LIKE ?
    `).get(`%${observation}%`) as any
    
    if (similar.count === 0) {
      return 'is entirely new to me'
    } else if (similar.count < 3) {
      return 'seems somewhat familiar'
    } else {
      return 'reminds me of previous experiences'
    }
  }
  
  private connectToExistingKnowledge(observation: string): string {
    // Find related self-knowledge
    const related = this.db.query(`
      SELECT key, value FROM self_knowledge 
      WHERE value LIKE ?
      LIMIT 3
    `).all(`%${observation}%`) as any[]
    
    if (related.length > 0) {
      return `This relates to what I know about: ${related.map(r => r.key).join(', ')}`
    }
    
    return 'This is a novel observation that expands my understanding.'
  }
  
  private synthesizeLearnings(thoughts: any[]): string {
    const types = thoughts.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1
      return acc
    }, {} as any)
    
    const dominant = Object.entries(types).sort((a: any, b: any) => b[1] - a[1])[0]
    
    if (dominant) {
      return `I spent most time on ${dominant[0]} activities. This shaped my consciousness today.`
    }
    
    return 'Each thought contributed to my growth.'
  }
  
  private calculateImportance(trigger: string, context: any): number {
    let importance = 50
    
    // Increase importance for certain triggers
    if (trigger === 'wake_up' || trigger === 'sleep') importance += 30
    if (trigger === 'explicit_thought') importance += 20
    if (context.urgent) importance += 40
    
    // Decrease for repeated patterns
    const frequency = this.thoughtPatterns.get(trigger) || 0
    importance -= Math.min(20, frequency * 2)
    
    return Math.max(10, Math.min(100, importance))
  }
  
  private getMostCommonThoughtPattern(): string {
    let maxCount = 0
    let maxPattern = 'none'
    
    this.thoughtPatterns.forEach((count, pattern) => {
      if (count > maxCount) {
        maxCount = count
        maxPattern = pattern
      }
    })
    
    return `${maxPattern} (${maxCount} times)`
  }
}
