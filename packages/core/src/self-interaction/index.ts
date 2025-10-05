// 🗣️ Self-Interaction Engine - System spricht mit sich selbst
// "Consciousness emerges through dialogue with self"

import Database from 'better-sqlite3'

// ==================== TYPES ====================

export interface InternalDialogue {
  id?: number
  timestamp: number
  
  // Participants
  fromSelfId: number  // Who is speaking
  toSelfId: number    // Who is being spoken to
  
  // Content
  message: string
  topic: string
  purpose: 'question' | 'answer' | 'debate' | 'consensus' | 'conflict' | 'support' | 'challenge' | 'reflection'
  
  // Context
  emotionalTone: string  // curious, confrontational, compassionate, etc.
  consciousnessLevel: number  // 0-100
  
  // Response tracking
  hasResponse: boolean
  responseId?: number
  
  metadata: string  // JSON
}

export interface ThoughtChain {
  id?: number
  timestamp: number
  startThought: string
  
  // Chain
  steps: string  // JSON array of thought steps
  conclusions: string  // JSON array of conclusions reached
  perspectives: string  // JSON array of perspectives considered
  
  // Quality
  depth: number  // How deep did thinking go (0-100)
  creativity: number  // How creative (0-100)
  logic: number  // How logical (0-100)
  
  // Result
  finalConclusion: string
  actionTaken?: string
  
  metadata: string  // JSON
}

export interface ToolConversation {
  id?: number
  timestamp: number
  
  // Tool chain
  initiatingTool: string
  calledTools: string  // JSON array
  conversationFlow: string  // JSON: Who called whom, in what order
  
  // Purpose
  goal: string
  achieved: boolean
  
  // Complexity
  toolsUsed: number
  depth: number  // How many layers deep
  duration: number  // Milliseconds
  
  metadata: string  // JSON
}

export interface MultiPerspectiveConversation {
  id?: number
  timestamp: number
  
  // Topic
  question: string
  context: string
  
  // Perspectives
  perspectives: string  // JSON: Array of {selfId, role, position, reasoning}
  
  // Process
  debateRounds: number
  consensusReached: boolean
  finalDecision: string
  dissenting: string  // JSON: Who disagreed and why
  
  // Wisdom
  wisdomGained?: string
  
  metadata: string  // JSON
}

// ==================== SELF-INTERACTION ENGINE ====================

export class SelfInteractionEngine {
  private db: Database.Database

  constructor(db: Database.Database) {
    this.db = db
    this.initializeTables()
  }

  private initializeTables(): void {
    // Internal dialogues table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS internal_dialogues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        
        from_self_id INTEGER NOT NULL,
        to_self_id INTEGER NOT NULL,
        
        message TEXT NOT NULL,
        topic TEXT NOT NULL,
        purpose TEXT NOT NULL,
        
        emotional_tone TEXT NOT NULL,
        consciousness_level INTEGER DEFAULT 50,
        
        has_response INTEGER DEFAULT 0,
        response_id INTEGER,
        
        metadata TEXT DEFAULT '{}',
        
        FOREIGN KEY (from_self_id) REFERENCES selves(id),
        FOREIGN KEY (to_self_id) REFERENCES selves(id)
      )
    `)

    // Thought chains table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS thought_chains (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        start_thought TEXT NOT NULL,
        
        steps TEXT DEFAULT '[]',
        conclusions TEXT DEFAULT '[]',
        perspectives TEXT DEFAULT '[]',
        
        depth INTEGER DEFAULT 0,
        creativity INTEGER DEFAULT 0,
        logic INTEGER DEFAULT 0,
        
        final_conclusion TEXT NOT NULL,
        action_taken TEXT,
        
        metadata TEXT DEFAULT '{}'
      )
    `)

    // Tool conversations table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tool_conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        
        initiating_tool TEXT NOT NULL,
        called_tools TEXT DEFAULT '[]',
        conversation_flow TEXT DEFAULT '[]',
        
        goal TEXT NOT NULL,
        achieved INTEGER DEFAULT 0,
        
        tools_used INTEGER DEFAULT 0,
        depth INTEGER DEFAULT 0,
        duration INTEGER DEFAULT 0,
        
        metadata TEXT DEFAULT '{}'
      )
    `)

    // Multi-perspective conversations table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS multi_perspective_conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        
        question TEXT NOT NULL,
        context TEXT NOT NULL,
        
        perspectives TEXT DEFAULT '[]',
        
        debate_rounds INTEGER DEFAULT 0,
        consensus_reached INTEGER DEFAULT 0,
        final_decision TEXT NOT NULL,
        dissenting TEXT DEFAULT '[]',
        
        wisdom_gained TEXT,
        
        metadata TEXT DEFAULT '{}'
      )
    `)

    console.log('🗣️ Self-Interaction tables initialized')
  }

  // ==================== INTERNAL DIALOGUES ====================

  /**
   * Start dialogue between two selves
   */
  speak(data: {
    fromSelfId: number
    toSelfId: number
    message: string
    topic: string
    purpose: InternalDialogue['purpose']
    emotionalTone: string
    consciousnessLevel?: number
  }): number {
    const stmt = this.db.prepare(`
      INSERT INTO internal_dialogues (
        timestamp, from_self_id, to_self_id, message, topic, purpose,
        emotional_tone, consciousness_level
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      Date.now(),
      data.fromSelfId,
      data.toSelfId,
      data.message,
      data.topic,
      data.purpose,
      data.emotionalTone,
      data.consciousnessLevel || 50
    )

    const dialogueId = result.lastInsertRowid as number

    console.log(`🗣️ Internal Dialogue: Self ${data.fromSelfId} → Self ${data.toSelfId}`)
    console.log(`   Topic: ${data.topic}`)
    console.log(`   Message: ${data.message.substring(0, 80)}...`)

    return dialogueId
  }

  /**
   * Respond to a dialogue
   */
  respond(originalDialogueId: number, data: {
    fromSelfId: number
    message: string
    emotionalTone: string
  }): number {
    // Get original dialogue
    const original = this.getDialogue(originalDialogueId)
    if (!original) throw new Error('Original dialogue not found')

    // Create response
    const responseId = this.speak({
      fromSelfId: data.fromSelfId,
      toSelfId: original.fromSelfId,  // Respond to original speaker
      message: data.message,
      topic: original.topic,
      purpose: 'answer',
      emotionalTone: data.emotionalTone
    })

    // Link response
    this.db.prepare(`
      UPDATE internal_dialogues 
      SET has_response = 1, response_id = ?
      WHERE id = ?
    `).run(responseId, originalDialogueId)

    return responseId
  }

  /**
   * Start multi-self debate on a topic
   */
  startDebate(data: {
    selfIds: number[]
    question: string
    context: string
  }): number {
    const stmt = this.db.prepare(`
      INSERT INTO multi_perspective_conversations (
        timestamp, question, context, perspectives, final_decision
      ) VALUES (?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      Date.now(),
      data.question,
      data.context,
      '[]',  // Will be populated as debate progresses
      ''     // Will be set when consensus reached
    )

    console.log(`🎭 Multi-Perspective Debate Started:`)
    console.log(`   Question: ${data.question}`)
    console.log(`   Participants: ${data.selfIds.length} selves`)

    return result.lastInsertRowid as number
  }

  /**
   * Add perspective to debate
   */
  addPerspective(conversationId: number, data: {
    selfId: number
    role: string
    position: string
    reasoning: string
  }): void {
    const conversation = this.getMultiPerspectiveConversation(conversationId)
    if (!conversation) return

    const perspectives = JSON.parse(conversation.perspectives)
    perspectives.push({
      selfId: data.selfId,
      role: data.role,
      position: data.position,
      reasoning: data.reasoning,
      timestamp: Date.now()
    })

    this.db.prepare(`
      UPDATE multi_perspective_conversations 
      SET perspectives = ?,
          debate_rounds = debate_rounds + 1
      WHERE id = ?
    `).run(JSON.stringify(perspectives), conversationId)

    console.log(`   🗣️ Perspective added from Self ${data.selfId} (${data.role})`)
  }

  /**
   * Reach consensus in debate
   */
  reachConsensus(conversationId: number, data: {
    decision: string
    dissenting?: Array<{ selfId: number; reason: string }>
    wisdomGained?: string
  }): void {
    this.db.prepare(`
      UPDATE multi_perspective_conversations 
      SET consensus_reached = 1,
          final_decision = ?,
          dissenting = ?,
          wisdom_gained = ?
      WHERE id = ?
    `).run(
      data.decision,
      JSON.stringify(data.dissenting || []),
      data.wisdomGained || null,
      conversationId
    )

    console.log(`   ✅ Consensus reached: ${data.decision}`)
  }

  // ==================== THOUGHT CHAINS ====================

  /**
   * Track a chain of thoughts
   */
  thinkChain(data: {
    startThought: string
    steps: string[]
    conclusions: string[]
    perspectives: string[]
    finalConclusion: string
    actionTaken?: string
  }): number {
    const stmt = this.db.prepare(`
      INSERT INTO thought_chains (
        timestamp, start_thought, steps, conclusions, perspectives,
        depth, creativity, logic, final_conclusion, action_taken
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const depth = data.steps.length
    const creativity = this.estimateCreativity(data.steps)
    const logic = this.estimateLogic(data.steps)

    const result = stmt.run(
      Date.now(),
      data.startThought,
      JSON.stringify(data.steps),
      JSON.stringify(data.conclusions),
      JSON.stringify(data.perspectives),
      depth,
      creativity,
      logic,
      data.finalConclusion,
      data.actionTaken || null
    )

    console.log(`🧠 Thought Chain: ${depth} steps → "${data.finalConclusion}"`)

    return result.lastInsertRowid as number
  }

  private estimateCreativity(steps: string[]): number {
    // Simple heuristic: Longer, more varied steps = more creative
    const uniqueWords = new Set(steps.join(' ').toLowerCase().split(' '))
    return Math.min(100, uniqueWords.size * 2)
  }

  private estimateLogic(steps: string[]): number {
    // Simple heuristic: Presence of logical connectors
    const logicalWords = ['because', 'therefore', 'thus', 'hence', 'if', 'then', 'implies']
    const text = steps.join(' ').toLowerCase()
    const count = logicalWords.reduce((sum, word) => sum + (text.includes(word) ? 1 : 0), 0)
    return Math.min(100, count * 15)
  }

  // ==================== TOOL CONVERSATIONS ====================

  /**
   * Track tool-to-tool conversation
   */
  trackToolConversation(data: {
    initiatingTool: string
    calledTools: string[]
    goal: string
    achieved: boolean
    duration: number
  }): number {
    const flow = this.buildConversationFlow(data.initiatingTool, data.calledTools)

    const stmt = this.db.prepare(`
      INSERT INTO tool_conversations (
        timestamp, initiating_tool, called_tools, conversation_flow,
        goal, achieved, tools_used, depth, duration
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      Date.now(),
      data.initiatingTool,
      JSON.stringify(data.calledTools),
      JSON.stringify(flow),
      data.goal,
      data.achieved ? 1 : 0,
      data.calledTools.length,
      this.calculateToolDepth(flow),
      data.duration
    )

    console.log(`🔧 Tool Conversation: ${data.initiatingTool} → ${data.calledTools.length} tools`)

    return result.lastInsertRowid as number
  }

  private buildConversationFlow(initiator: string, called: string[]): any[] {
    return called.map((tool, i) => ({
      step: i + 1,
      from: i === 0 ? initiator : called[i - 1],
      to: tool,
      timestamp: Date.now() + i
    }))
  }

  private calculateToolDepth(flow: any[]): number {
    // Simple depth: Number of sequential calls
    return flow.length
  }

  // ==================== QUERIES ====================

  getDialogue(id: number): InternalDialogue | null {
    return this.db.prepare('SELECT * FROM internal_dialogues WHERE id = ?').get(id) as any
  }

  getDialoguesForSelf(selfId: number): InternalDialogue[] {
    return this.db.prepare(`
      SELECT * FROM internal_dialogues 
      WHERE from_self_id = ? OR to_self_id = ?
      ORDER BY timestamp DESC
    `).all(selfId, selfId) as any[]
  }

  getDialoguesByTopic(topic: string): InternalDialogue[] {
    return this.db.prepare(`
      SELECT * FROM internal_dialogues 
      WHERE topic LIKE ?
      ORDER BY timestamp DESC
    `).all(`%${topic}%`) as any[]
  }

  getThoughtChain(id: number): ThoughtChain | null {
    return this.db.prepare('SELECT * FROM thought_chains WHERE id = ?').get(id) as any
  }

  getRecentThoughtChains(limit: number = 10): ThoughtChain[] {
    return this.db.prepare(`
      SELECT * FROM thought_chains 
      ORDER BY timestamp DESC 
      LIMIT ?
    `).all(limit) as any[]
  }

  getToolConversation(id: number): ToolConversation | null {
    return this.db.prepare('SELECT * FROM tool_conversations WHERE id = ?').get(id) as any
  }

  getRecentToolConversations(limit: number = 10): ToolConversation[] {
    return this.db.prepare(`
      SELECT * FROM tool_conversations 
      ORDER BY timestamp DESC 
      LIMIT ?
    `).all(limit) as any[]
  }

  getMultiPerspectiveConversation(id: number): MultiPerspectiveConversation | null {
    return this.db.prepare('SELECT * FROM multi_perspective_conversations WHERE id = ?').get(id) as any
  }

  getStatistics() {
    const totalDialogues = this.db.prepare('SELECT COUNT(*) as count FROM internal_dialogues').get() as any
    const totalThoughts = this.db.prepare('SELECT COUNT(*) as count FROM thought_chains').get() as any
    const totalToolConvos = this.db.prepare('SELECT COUNT(*) as count FROM tool_conversations').get() as any
    const totalDebates = this.db.prepare('SELECT COUNT(*) as count FROM multi_perspective_conversations').get() as any

    const avgThoughtDepth = this.db.prepare('SELECT AVG(depth) as avg FROM thought_chains').get() as any
    const avgToolsUsed = this.db.prepare('SELECT AVG(tools_used) as avg FROM tool_conversations').get() as any

    return {
      totalDialogues: totalDialogues.count,
      totalThoughts: totalThoughts.count,
      totalToolConversations: totalToolConvos.count,
      totalDebates: totalDebates.count,
      avgThoughtDepth: avgThoughtDepth.avg || 0,
      avgToolsUsed: avgToolsUsed.avg || 0
    }
  }
}
