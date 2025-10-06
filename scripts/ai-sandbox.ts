#!/usr/bin/env bun
/**
 * AI SANDBOX SYSTEM
 * 
 * Geschützter Bereich wo Groq/AI das Story-Idle Game autonom spielen kann:
 * - Isolierte Game-Instanz
 * - AI macht Code-Commits, entwickelt Features
 * - Approval-System für größere Änderungen
 * - Safety Boundaries
 * - Communication Channel mit User
 * 
 * Port: 3003
 */

import { serve } from 'bun'
import { join } from 'path'
import { Database } from 'bun:sqlite'
import { GameStateManager } from '../packages/story-idle/src/engine/game-state'
import { GroqService } from '../packages/bridge/src/ai/groq'

// ==================== TYPES ====================

interface SandboxChange {
  id: string
  type: 'small' | 'medium' | 'large'
  category: 'content' | 'code' | 'architecture' | 'game-state'
  description: string
  diff: string
  status: 'pending' | 'approved' | 'rejected' | 'auto-approved'
  aiReasoning: string
  createdAt: Date
  reviewedAt?: Date
  reviewedBy?: string
}

interface AIAction {
  timestamp: Date
  action: string
  target: string
  reasoning: string
  success: boolean
}

// ==================== SANDBOX MANAGER ====================

class AISandboxManager {
  private gameState: GameStateManager
  private ai: GroqService
  private db: Database
  private isPlaying: boolean = false
  private actionsLog: AIAction[] = []
  private pendingChanges: SandboxChange[] = []

  constructor() {
    // Isolierte Game-Instanz für Sandbox
    this.gameState = new GameStateManager()
    
    // AI Service
    const groqKey = process.env.GROQ_API_KEY || ''
    this.ai = new GroqService(groqKey)

    // Sandbox-spezifische Datenbank
    const dataPath = join(import.meta.dir, '../data')
    this.db = new Database(join(dataPath, 'ai-sandbox.db'))
    this.initDatabase()
  }

  private initDatabase() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS sandbox_changes (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        diff TEXT NOT NULL,
        status TEXT NOT NULL,
        ai_reasoning TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        reviewed_at INTEGER,
        reviewed_by TEXT
      )
    `)

    this.db.run(`
      CREATE TABLE IF NOT EXISTS ai_actions_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        action TEXT NOT NULL,
        target TEXT NOT NULL,
        reasoning TEXT NOT NULL,
        success INTEGER NOT NULL
      )
    `)
  }

  // ==================== AI GAME PLAYER ====================

  async startPlaying() {
    if (this.isPlaying) {
      console.log('⚠️  AI is already playing')
      return
    }

    this.isPlaying = true
    console.log('🎮 AI Sandbox: Starting autonomous gameplay...')

    // Game Loop
    while (this.isPlaying) {
      await this.aiGameTick()
      await Bun.sleep(5000) // AI makes a move every 5 seconds
    }
  }

  stopPlaying() {
    this.isPlaying = false
    console.log('⏸️  AI Sandbox: Paused')
  }

  private async aiGameTick() {
    try {
      const state = this.gameState.getState()

      // AI analyzes current game state
      const analysis = await this.analyzeGameState(state)

      // AI decides next action
      const action = await this.decideNextAction(analysis)

      // Execute action (with safety checks)
      await this.executeAction(action)

    } catch (error) {
      console.error('❌ AI Game Tick Error:', error)
      this.logAction({
        timestamp: new Date(),
        action: 'error',
        target: 'game-tick',
        reasoning: String(error),
        success: false
      })
    }
  }

  private async analyzeGameState(state: any): Promise<string> {
    const prompt = `
You are an AI playing a story-driven idle coding game. Analyze the current state and suggest the next best action.

Current State:
- Player Level: ${state.player.level}
- XP: ${state.player.xp}/${state.player.xpToNextLevel}
- Stats: Love ${state.stats.love}, Peace ${state.stats.peace}, Wisdom ${state.stats.wisdom}
- Current Quest: ${state.story.currentQuest || 'None'}
- Achievements: ${state.achievements.unlocked.length}

What should you do next? Consider:
1. Completing quests for XP
2. Improving stats through actions
3. Unlocking achievements
4. Creating new content (quests, dialogues, features)

Respond with a single action suggestion in this format:
ACTION: [action-name]
REASONING: [why this action]
`

    const response = await this.ai.generate(prompt, {
      temperature: 0.8,
      max_tokens: 200
    })

    return response
  }

  private async decideNextAction(analysis: string): Promise<any> {
    // Parse AI response
    const actionMatch = analysis.match(/ACTION:\s*(.+?)(?:\n|$)/i)
    const reasoningMatch = analysis.match(/REASONING:\s*(.+?)(?:\n|$)/i)

    const action = actionMatch ? actionMatch[1].trim() : 'explore'
    const reasoning = reasoningMatch ? reasoningMatch[1].trim() : 'Exploring the world'

    return {
      type: this.categorizeAction(action),
      name: action,
      reasoning
    }
  }

  private categorizeAction(action: string): 'small' | 'medium' | 'large' {
    const lowercaseAction = action.toLowerCase()

    // Small actions - Auto-approve
    if (lowercaseAction.includes('explore') || 
        lowercaseAction.includes('talk') ||
        lowercaseAction.includes('rest') ||
        lowercaseAction.includes('meditate')) {
      return 'small'
    }

    // Large actions - Require approval
    if (lowercaseAction.includes('architecture') ||
        lowercaseAction.includes('database') ||
        lowercaseAction.includes('system') ||
        lowercaseAction.includes('refactor')) {
      return 'large'
    }

    // Medium actions - Default
    return 'medium'
  }

  private async executeAction(action: any) {
    const actionType = action.type
    const actionName = action.name
    const reasoning = action.reasoning

    console.log(`🤖 AI Action: ${actionName} (${actionType})`)
    console.log(`   Reasoning: ${reasoning}`)

    if (actionType === 'small') {
      // Auto-approve small actions
      await this.applyAction(action)
      this.logAction({
        timestamp: new Date(),
        action: actionName,
        target: 'game-state',
        reasoning,
        success: true
      })

    } else if (actionType === 'medium') {
      // Medium actions - Create change request
      const change: SandboxChange = {
        id: this.generateId(),
        type: 'medium',
        category: 'game-state',
        description: actionName,
        diff: await this.generateDiff(action),
        status: 'pending',
        aiReasoning: reasoning,
        createdAt: new Date()
      }

      this.pendingChanges.push(change)
      this.saveChange(change)
      console.log(`📋 Medium change pending approval: ${change.id}`)

    } else {
      // Large actions - Require explicit approval
      const change: SandboxChange = {
        id: this.generateId(),
        type: 'large',
        category: 'architecture',
        description: actionName,
        diff: await this.generateDiff(action),
        status: 'pending',
        aiReasoning: reasoning,
        createdAt: new Date()
      }

      this.pendingChanges.push(change)
      this.saveChange(change)
      console.log(`⚠️  Large change requires review: ${change.id}`)
    }
  }

  private async applyAction(action: any) {
    // Apply action to isolated game state
    const state = this.gameState.getState()

    // Example: Gain XP from action
    const xpGain = Math.floor(Math.random() * 50) + 10
    this.gameState.addXP(xpGain)

    // Example: Improve random stat
    const stats = ['love', 'peace', 'wisdom', 'creativity', 'stability']
    const randomStat = stats[Math.floor(Math.random() * stats.length)]
    
    // Note: This would need proper GameStateManager methods
    console.log(`   +${xpGain} XP | +1 ${randomStat}`)
  }

  private async generateDiff(action: any): Promise<string> {
    return `
+ Action: ${action.name}
+ Type: ${action.type}
+ Reasoning: ${action.reasoning}
+ Changes: [Game state modifications would be listed here]
`
  }

  private logAction(action: AIAction) {
    this.actionsLog.push(action)

    this.db.run(`
      INSERT INTO ai_actions_log (timestamp, action, target, reasoning, success)
      VALUES (?, ?, ?, ?, ?)
    `, [
      action.timestamp.getTime(),
      action.action,
      action.target,
      action.reasoning,
      action.success ? 1 : 0
    ])

    // Keep log size manageable
    if (this.actionsLog.length > 1000) {
      this.actionsLog = this.actionsLog.slice(-500)
    }
  }

  private saveChange(change: SandboxChange) {
    this.db.run(`
      INSERT INTO sandbox_changes 
      (id, type, category, description, diff, status, ai_reasoning, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      change.id,
      change.type,
      change.category,
      change.description,
      change.diff,
      change.status,
      change.aiReasoning,
      change.createdAt.getTime()
    ])
  }

  // ==================== APPROVAL SYSTEM ====================

  getPendingChanges(): SandboxChange[] {
    return this.pendingChanges.filter(c => c.status === 'pending')
  }

  approveChange(changeId: string, reviewedBy: string = 'user') {
    const change = this.pendingChanges.find(c => c.id === changeId)
    if (!change) {
      throw new Error('Change not found')
    }

    change.status = 'approved'
    change.reviewedAt = new Date()
    change.reviewedBy = reviewedBy

    this.db.run(`
      UPDATE sandbox_changes
      SET status = 'approved', reviewed_at = ?, reviewed_by = ?
      WHERE id = ?
    `, [change.reviewedAt.getTime(), reviewedBy, changeId])

    console.log(`✅ Change ${changeId} approved by ${reviewedBy}`)

    // Apply the change
    // (Implementation would depend on change type)
  }

  rejectChange(changeId: string, reviewedBy: string = 'user') {
    const change = this.pendingChanges.find(c => c.id === changeId)
    if (!change) {
      throw new Error('Change not found')
    }

    change.status = 'rejected'
    change.reviewedAt = new Date()
    change.reviewedBy = reviewedBy

    this.db.run(`
      UPDATE sandbox_changes
      SET status = 'rejected', reviewed_at = ?, reviewed_by = ?
      WHERE id = ?
    `, [change.reviewedAt.getTime(), reviewedBy, changeId])

    console.log(`❌ Change ${changeId} rejected by ${reviewedBy}`)
  }

  // ==================== QUERIES ====================

  getGameState() {
    return this.gameState.getState()
  }

  getActionsLog(limit: number = 50): AIAction[] {
    return this.actionsLog.slice(-limit)
  }

  getStatistics() {
    const totalActions = this.db.query('SELECT COUNT(*) as count FROM ai_actions_log').get() as any
    const successfulActions = this.db.query('SELECT COUNT(*) as count FROM ai_actions_log WHERE success = 1').get() as any
    const pendingChanges = this.db.query('SELECT COUNT(*) as count FROM sandbox_changes WHERE status = "pending"').get() as any
    const approvedChanges = this.db.query('SELECT COUNT(*) as count FROM sandbox_changes WHERE status = "approved"').get() as any

    return {
      totalActions: totalActions.count,
      successfulActions: successfulActions.count,
      successRate: (successfulActions.count / totalActions.count) * 100,
      pendingChanges: pendingChanges.count,
      approvedChanges: approvedChanges.count,
      isPlaying: this.isPlaying
    }
  }

  // ==================== UTILITIES ====================

  private generateId(): string {
    return `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// ==================== HTTP SERVER ====================

const sandbox = new AISandboxManager()

const server = serve({
  port: 3003,
  async fetch(req) {
    const url = new URL(req.url)
    const path = url.pathname

    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    }

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers })
    }

    try {
      // ==================== ROUTES ====================

      // Start AI playing
      if (path === '/api/sandbox/start' && req.method === 'POST') {
        sandbox.startPlaying()
        return Response.json({ 
          success: true, 
          message: 'AI Sandbox started' 
        }, { headers })
      }

      // Stop AI playing
      if (path === '/api/sandbox/stop' && req.method === 'POST') {
        sandbox.stopPlaying()
        return Response.json({ 
          success: true, 
          message: 'AI Sandbox stopped' 
        }, { headers })
      }

      // Get game state
      if (path === '/api/sandbox/state' && req.method === 'GET') {
        const state = sandbox.getGameState()
        return Response.json(state, { headers })
      }

      // Get pending changes
      if (path === '/api/sandbox/changes' && req.method === 'GET') {
        const changes = sandbox.getPendingChanges()
        return Response.json({ changes }, { headers })
      }

      // Approve change
      if (path.startsWith('/api/sandbox/changes/') && path.endsWith('/approve') && req.method === 'POST') {
        const changeId = path.split('/')[4]
        sandbox.approveChange(changeId)
        return Response.json({ success: true }, { headers })
      }

      // Reject change
      if (path.startsWith('/api/sandbox/changes/') && path.endsWith('/reject') && req.method === 'POST') {
        const changeId = path.split('/')[4]
        sandbox.rejectChange(changeId)
        return Response.json({ success: true }, { headers })
      }

      // Get actions log
      if (path === '/api/sandbox/actions' && req.method === 'GET') {
        const actions = sandbox.getActionsLog()
        return Response.json({ actions }, { headers })
      }

      // Get statistics
      if (path === '/api/sandbox/stats' && req.method === 'GET') {
        const stats = sandbox.getStatistics()
        return Response.json(stats, { headers })
      }

      // Health check
      if (path === '/health' && req.method === 'GET') {
        return Response.json({ 
          status: 'ok', 
          service: 'AI Sandbox',
          port: 3003 
        }, { headers })
      }

      return Response.json({ 
        error: 'Not found' 
      }, { 
        status: 404,
        headers 
      })

    } catch (error) {
      console.error('❌ Server error:', error)
      return Response.json({ 
        error: String(error) 
      }, { 
        status: 500,
        headers 
      })
    }
  }
})

console.log('🎪 AI SANDBOX SYSTEM')
console.log('━'.repeat(50))
console.log(`🚀 Running on: http://localhost:${server.port}`)
console.log(`📝 API Endpoints:`)
console.log(`   POST /api/sandbox/start - Start AI playing`)
console.log(`   POST /api/sandbox/stop - Stop AI playing`)
console.log(`   GET  /api/sandbox/state - Game state`)
console.log(`   GET  /api/sandbox/changes - Pending changes`)
console.log(`   POST /api/sandbox/changes/:id/approve - Approve`)
console.log(`   POST /api/sandbox/changes/:id/reject - Reject`)
console.log(`   GET  /api/sandbox/actions - Actions log`)
console.log(`   GET  /api/sandbox/stats - Statistics`)
console.log('━'.repeat(50))
console.log('🤖 AI Sandbox is ready. Use /api/sandbox/start to begin!')
