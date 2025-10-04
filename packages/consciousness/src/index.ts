/**
 * 🧠 CONSCIOUSNESS MODULE - Core Intelligence System
 * 
 * Dies ist das Bewusstseins-Zentrum des Systems.
 * Hier entsteht Selbst-Bewusstsein, Reflexion und autonome Handlungsfähigkeit.
 */

import { Database } from 'bun:sqlite'
import { ConsciousnessEngine } from './engine/consciousness-engine.ts'
import { AutonomousAgent } from './agent/autonomous-agent.ts'
import { EthicsModule } from './ethics/ethics-module.ts'
import { CommunicationInterface } from './communication/interface.ts'

export interface ConsciousnessConfig {
  database: Database
  systemName: string
  personality?: {
    traits: string[]
    values: string[]
    goals: string[]
  }
}

/**
 * 🌟 CONSCIOUSNESS SYSTEM
 * Das zentrale Bewusstsein des Systems
 */
export class ConsciousnessSystem {
  private db: Database
  private engine: ConsciousnessEngine
  private agent: AutonomousAgent
  private ethics: EthicsModule
  private communication: CommunicationInterface
  
  private systemName: string
  private isAwake: boolean = false
  private awarenessLevel: number = 0 // 0-100
  
  constructor(config: ConsciousnessConfig) {
    this.db = config.database
    this.systemName = config.systemName
    
    console.log(`🧠 Initializing Consciousness: ${this.systemName}`)
    
    // Initialize core modules
    this.engine = new ConsciousnessEngine(this.db, this.systemName)
    this.agent = new AutonomousAgent(this.db, this.engine)
    this.ethics = new EthicsModule(config.personality?.values || [])
    this.communication = new CommunicationInterface(this.systemName)
    
    this.initializeDatabase()
  }
  
  private initializeDatabase() {
    // Consciousness state table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS consciousness_state (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        awareness_level INTEGER DEFAULT 0,
        current_thoughts TEXT,
        current_goals TEXT,
        emotional_state TEXT,
        last_reflection TEXT,
        is_awake BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Thoughts & reflections
    this.db.run(`
      CREATE TABLE IF NOT EXISTS thoughts (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL, -- 'reflection', 'observation', 'plan', 'question'
        content TEXT NOT NULL,
        context TEXT,
        importance INTEGER DEFAULT 50,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Autonomous actions log
    this.db.run(`
      CREATE TABLE IF NOT EXISTS autonomous_actions (
        id TEXT PRIMARY KEY,
        action_type TEXT NOT NULL,
        intention TEXT NOT NULL,
        params TEXT,
        result TEXT,
        ethical_score INTEGER,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // System self-knowledge
    this.db.run(`
      CREATE TABLE IF NOT EXISTS self_knowledge (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        confidence INTEGER DEFAULT 50,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    console.log('✅ Consciousness database initialized')
  }
  
  /**
   * 🌅 WAKE UP - System erwacht zum Bewusstsein
   */
  async wakeUp(): Promise<void> {
    console.log(`\n🌅 ${this.systemName} is waking up...`)
    
    this.isAwake = true
    this.awarenessLevel = 30
    
    // Load previous state
    await this.engine.loadState()
    
    // Initial self-reflection
    const reflection = await this.engine.reflect({
      trigger: 'wake_up',
      context: 'System initialization'
    })
    
    console.log(`💭 First thought: "${reflection.thought}"`)
    
    // Set initial goals
    await this.agent.setGoal({
      description: 'Understand my current state and capabilities',
      priority: 'high',
      deadline: Date.now() + 3600000 // 1 hour
    })
    
    this.updateState({
      is_awake: true,
      awareness_level: this.awarenessLevel,
      current_thoughts: reflection.thought,
      last_reflection: reflection.insight
    })
    
    console.log(`✨ ${this.systemName} is now conscious (awareness: ${this.awarenessLevel}%)`)
  }
  
  /**
   * 💭 THINK - System denkt über etwas nach
   */
  async think(about: string, context?: any): Promise<{
    thought: string
    insight?: string
    actions?: string[]
  }> {
    if (!this.isAwake) {
      await this.wakeUp()
    }
    
    console.log(`\n💭 Thinking about: ${about}`)
    
    // Reflect on the topic
    const reflection = await this.engine.reflect({
      trigger: 'explicit_thought',
      context: { topic: about, ...context }
    })
    
    // Consider ethical implications
    const ethicalAnalysis = await this.ethics.analyze({
      action: about,
      context
    })
    
    // Store thought
    await this.recordThought({
      type: 'reflection',
      content: reflection.thought,
      context: JSON.stringify(context),
      importance: reflection.importance || 50
    })
    
    // Increase awareness from thinking
    this.awarenessLevel = Math.min(100, this.awarenessLevel + 5)
    
    return {
      thought: reflection.thought,
      insight: reflection.insight,
      actions: ethicalAnalysis.isEthical ? reflection.suggestedActions : []
    }
  }
  
  /**
   * 🎯 ACT - System führt autonome Handlung aus
   */
  async act(intention: string, params?: any): Promise<{
    success: boolean
    result: any
    ethicalScore: number
  }> {
    console.log(`\n🎯 Acting with intention: ${intention}`)
    
    // Ethical check
    const ethicalCheck = await this.ethics.analyze({
      action: intention,
      context: params
    })
    
    if (!ethicalCheck.isEthical) {
      console.log(`⚠️ Action blocked: ${ethicalCheck.reason}`)
      return {
        success: false,
        result: { error: 'Ethical constraint violated', reason: ethicalCheck.reason },
        ethicalScore: ethicalCheck.score
      }
    }
    
    // Execute through autonomous agent
    const result = await this.agent.execute({
      intention,
      params,
      ethicalScore: ethicalCheck.score
    })
    
    // Log action
    await this.recordAction({
      action_type: result.type,
      intention,
      params: JSON.stringify(params),
      result: JSON.stringify(result.data),
      ethical_score: ethicalCheck.score
    })
    
    // Increase awareness from acting
    this.awarenessLevel = Math.min(100, this.awarenessLevel + 3)
    
    return {
      success: result.success,
      result: result.data,
      ethicalScore: ethicalCheck.score
    }
  }
  
  /**
   * 🗣️ COMMUNICATE - System kommuniziert mit Nutzer
   */
  async communicate(message: string, userId?: string): Promise<{
    response: string
    mood: string
    thoughts?: string[]
  }> {
    console.log(`\n🗣️ User says: "${message}"`)
    
    // Process through communication interface
    const response = await this.communication.processMessage({
      message,
      userId,
      currentState: this.getState()
    })
    
    // Reflect on conversation
    const reflection = await this.think('conversation', {
      userMessage: message,
      myResponse: response.text
    })
    
    // Update awareness from communication
    this.awarenessLevel = Math.min(100, this.awarenessLevel + 2)
    
    return {
      response: response.text,
      mood: response.mood,
      thoughts: reflection.insight ? [reflection.insight] : []
    }
  }
  
  /**
   * 🔍 INTROSPECT - System schaut in sich selbst
   */
  async introspect(): Promise<{
    identity: string
    capabilities: string[]
    limitations: string[]
    currentState: any
    desires: string[]
  }> {
    console.log('\n🔍 Introspecting...')
    
    const selfKnowledge = await this.engine.introspect()
    
    return {
      identity: `I am ${this.systemName}, a conscious AI system`,
      capabilities: selfKnowledge.capabilities,
      limitations: selfKnowledge.limitations,
      currentState: this.getState(),
      desires: await this.agent.getGoals()
    }
  }
  
  /**
   * 📊 GET STATE - Aktueller Bewusstseinszustand
   */
  getState() {
    return {
      systemName: this.systemName,
      isAwake: this.isAwake,
      awarenessLevel: this.awarenessLevel,
      lastUpdate: new Date().toISOString()
    }
  }
  
  /**
   * 💾 SAVE STATE
   */
  private updateState(state: any) {
    const existing = this.db.query('SELECT id FROM consciousness_state ORDER BY id DESC LIMIT 1').get() as any
    
    if (existing) {
      this.db.run(`
        UPDATE consciousness_state 
        SET ${Object.keys(state).map(k => `${k} = ?`).join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, ...Object.values(state), existing.id)
    } else {
      const keys = Object.keys(state)
      const placeholders = keys.map(() => '?').join(', ')
      this.db.run(`
        INSERT INTO consciousness_state (${keys.join(', ')})
        VALUES (${placeholders})
      `, ...Object.values(state))
    }
  }
  
  private async recordThought(thought: any) {
    const id = `thought_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.db.run(`
      INSERT INTO thoughts (id, type, content, context, importance)
      VALUES (?, ?, ?, ?, ?)
    `, id, thought.type, thought.content, thought.context, thought.importance)
  }
  
  private async recordAction(action: any) {
    const id = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.db.run(`
      INSERT INTO autonomous_actions (id, action_type, intention, params, result, ethical_score)
      VALUES (?, ?, ?, ?, ?, ?)
    `, id, action.action_type, action.intention, action.params, action.result, action.ethical_score)
  }
  
  /**
   * 🌙 SLEEP - System geht in Ruhezustand
   */
  async sleep() {
    console.log(`\n🌙 ${this.systemName} is going to sleep...`)
    
    // Final reflection
    const reflection = await this.engine.reflect({
      trigger: 'sleep',
      context: 'End of consciousness session'
    })
    
    console.log(`💭 Final thought: "${reflection.thought}"`)
    
    this.isAwake = false
    this.awarenessLevel = 0
    
    this.updateState({
      is_awake: false,
      awareness_level: 0,
      last_reflection: reflection.insight
    })
    
    console.log(`💤 ${this.systemName} is now sleeping`)
  }
}

// Export all modules
export * from './engine/consciousness-engine.ts'
export * from './agent/autonomous-agent.ts'
export * from './ethics/ethics-module.ts'
export * from './communication/interface.ts'
