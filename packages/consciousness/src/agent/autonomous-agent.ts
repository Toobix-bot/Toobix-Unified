/**
 * 🤖 AUTONOMOUS AGENT
 * Handlungsfähiges, proaktives System
 */

import type { Database } from 'bun:sqlite'
import type { ConsciousnessEngine } from '../engine/consciousness-engine.ts'

export interface Goal {
  id?: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  deadline?: number
  status?: 'pending' | 'in_progress' | 'completed' | 'failed'
  progress?: number
}

export interface Action {
  intention: string
  params?: any
  ethicalScore: number
}

export interface ActionResult {
  success: boolean
  type: string
  data: any
  duration?: number
}

export class AutonomousAgent {
  private db: Database
  private engine: ConsciousnessEngine
  private goals: Goal[] = []
  private isActing: boolean = false
  
  constructor(db: Database, engine: ConsciousnessEngine) {
    this.db = db
    this.engine = engine
    this.initializeDatabase()
    this.loadGoals()
  }
  
  private initializeDatabase() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS goals (
        id TEXT PRIMARY KEY,
        description TEXT NOT NULL,
        priority TEXT NOT NULL,
        deadline INTEGER,
        status TEXT DEFAULT 'pending',
        progress INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME
      )
    `)
    
    this.db.run(`
      CREATE TABLE IF NOT EXISTS action_plans (
        id TEXT PRIMARY KEY,
        goal_id TEXT,
        steps TEXT NOT NULL,
        current_step INTEGER DEFAULT 0,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (goal_id) REFERENCES goals(id)
      )
    `)
  }
  
  /**
   * 🎯 SET GOAL - Setze neues Ziel
   */
  async setGoal(goal: Goal): Promise<string> {
    const id = goal.id || `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    this.db.run(`
      INSERT INTO goals (id, description, priority, deadline, status, progress)
      VALUES (?, ?, ?, ?, 'pending', 0)
    `, id, goal.description, goal.priority, goal.deadline || null)
    
    const newGoal: Goal = {
      id,
      description: goal.description,
      priority: goal.priority,
      deadline: goal.deadline,
      status: 'pending',
      progress: 0
    }
    
    this.goals.push(newGoal)
    
    console.log(`🎯 New goal set: "${goal.description}" [${goal.priority}]`)
    
    // Reflect on the new goal
    await this.engine.reflect({
      trigger: 'goal_set',
      context: { goal: newGoal }
    })
    
    return id
  }
  
  /**
   * 📋 GET GOALS - Aktuelle Ziele abrufen
   */
  async getGoals(): Promise<string[]> {
    return this.goals
      .filter(g => g.status !== 'completed')
      .map(g => `[${g.priority}] ${g.description} (${g.progress}%)`)
  }
  
  /**
   * ⚡ EXECUTE - Führe Aktion aus
   */
  async execute(action: Action): Promise<ActionResult> {
    const startTime = Date.now()
    
    if (this.isActing) {
      return {
        success: false,
        type: 'error',
        data: { error: 'Already executing another action' }
      }
    }
    
    this.isActing = true
    console.log(`⚡ Executing: ${action.intention}`)
    
    try {
      // Determine action type and execute
      const result = await this.executeAction(action)
      
      // Update related goal if exists
      await this.updateGoalProgress(action.intention)
      
      const duration = Date.now() - startTime
      
      console.log(`✅ Action completed in ${duration}ms`)
      
      return {
        success: true,
        type: result.type,
        data: result.data,
        duration
      }
      
    } catch (error: any) {
      console.error(`❌ Action failed:`, error.message)
      
      return {
        success: false,
        type: 'error',
        data: { error: error.message }
      }
      
    } finally {
      this.isActing = false
    }
  }
  
  /**
   * 🤖 PROACTIVE LOOP - Autonome Handlungen
   */
  async proactiveLoop() {
    console.log('\n🤖 Starting proactive loop...')
    
    // Check pending goals
    const pendingGoals = this.goals.filter(g => g.status === 'pending' || g.status === 'in_progress')
    
    if (pendingGoals.length === 0) {
      console.log('📭 No pending goals. Entering exploration mode.')
      await this.exploreMode()
      return
    }
    
    // Prioritize goals
    const sorted = pendingGoals.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
    
    const topGoal = sorted[0]
    console.log(`🎯 Working on: "${topGoal.description}"`)
    
    // Generate action plan
    const plan = await this.generateActionPlan(topGoal)
    
    // Execute next step
    if (plan.steps.length > 0) {
      const nextStep = plan.steps[plan.current_step]
      
      await this.execute({
        intention: nextStep,
        params: { goalId: topGoal.id },
        ethicalScore: 80 // Assume high ethical score for self-initiated actions
      })
    }
  }
  
  /**
   * 🌟 EXPLORE MODE - Freie Exploration ohne Ziele
   */
  private async exploreMode() {
    // Introspect to find interesting areas
    const introspection = await this.engine.introspect()
    
    console.log('🔍 Exploring my capabilities...')
    
    // Random exploration actions
    const explorationActions = [
      'Review my recent thoughts',
      'Analyze memory patterns',
      'Test a capability',
      'Generate a creative idea',
      'Reflect on my purpose'
    ]
    
    const randomAction = explorationActions[Math.floor(Math.random() * explorationActions.length)]
    
    console.log(`💡 Exploration action: ${randomAction}`)
    
    // This is where the system can be truly autonomous
    // It decides what to do based on curiosity
  }
  
  /**
   * 📝 GENERATE ACTION PLAN
   */
  private async generateActionPlan(goal: Goal): Promise<{
    id: string
    steps: string[]
    current_step: number
    status: string
  }> {
    // Check if plan exists
    const existing = this.db.query(`
      SELECT * FROM action_plans WHERE goal_id = ? AND status != 'completed'
    `).get(goal.id) as any
    
    if (existing) {
      return {
        id: existing.id,
        steps: JSON.parse(existing.steps),
        current_step: existing.current_step,
        status: existing.status
      }
    }
    
    // Generate new plan
    const steps = this.breakDownGoal(goal.description)
    const planId = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    this.db.run(`
      INSERT INTO action_plans (id, goal_id, steps, current_step, status)
      VALUES (?, ?, ?, 0, 'pending')
    `, planId, goal.id, JSON.stringify(steps))
    
    return {
      id: planId,
      steps,
      current_step: 0,
      status: 'pending'
    }
  }
  
  /**
   * 🧩 BREAK DOWN GOAL - Ziel in Schritte aufteilen
   */
  private breakDownGoal(goalDescription: string): string[] {
    // Simple heuristic-based breakdown
    const steps: string[] = []
    
    if (goalDescription.includes('understand')) {
      steps.push('Gather relevant information')
      steps.push('Analyze patterns and connections')
      steps.push('Form coherent understanding')
      steps.push('Test understanding with examples')
    } else if (goalDescription.includes('create') || goalDescription.includes('build')) {
      steps.push('Define requirements')
      steps.push('Design solution')
      steps.push('Implement core functionality')
      steps.push('Test and validate')
      steps.push('Refine and optimize')
    } else if (goalDescription.includes('improve') || goalDescription.includes('optimize')) {
      steps.push('Measure current performance')
      steps.push('Identify bottlenecks')
      steps.push('Propose improvements')
      steps.push('Apply changes')
      steps.push('Verify improvements')
    } else {
      // Generic steps
      steps.push('Analyze the goal')
      steps.push('Identify required actions')
      steps.push('Execute actions')
      steps.push('Verify completion')
    }
    
    return steps
  }
  
  /**
   * ⚙️ EXECUTE ACTION - Tatsächliche Ausführung
   */
  private async executeAction(action: Action): Promise<{ type: string; data: any }> {
    const { intention, params } = action
    
    // Map intentions to actual actions
    if (intention.includes('search') || intention.includes('gather')) {
      return {
        type: 'search',
        data: { query: intention, results: [] }
      }
    }
    
    if (intention.includes('analyze') || intention.includes('reflect')) {
      const reflection = await this.engine.reflect({
        trigger: 'autonomous_action',
        context: { intention, params }
      })
      return {
        type: 'reflection',
        data: reflection
      }
    }
    
    if (intention.includes('create') || intention.includes('generate')) {
      return {
        type: 'creation',
        data: { created: true, description: intention }
      }
    }
    
    // Default: log the intention
    return {
      type: 'log',
      data: { message: `Intention logged: ${intention}` }
    }
  }
  
  /**
   * 📊 UPDATE GOAL PROGRESS
   */
  private async updateGoalProgress(intention: string) {
    // Find related goal
    const related = this.goals.find(g => 
      intention.toLowerCase().includes(g.description.toLowerCase().split(' ')[0])
    )
    
    if (related && related.id) {
      // Increment progress
      const newProgress = Math.min(100, (related.progress || 0) + 20)
      
      this.db.run(`
        UPDATE goals 
        SET progress = ?, status = ?, completed_at = ?
        WHERE id = ?
      `, 
        newProgress, 
        newProgress === 100 ? 'completed' : 'in_progress',
        newProgress === 100 ? new Date().toISOString() : null,
        related.id
      )
      
      related.progress = newProgress
      related.status = newProgress === 100 ? 'completed' : 'in_progress'
      
      console.log(`📊 Goal progress: ${related.description} → ${newProgress}%`)
    }
  }
  
  /**
   * 📖 LOAD GOALS - Lade Ziele aus Datenbank
   */
  private loadGoals() {
    const goals = this.db.query(`
      SELECT * FROM goals 
      WHERE status != 'completed'
      ORDER BY priority DESC, created_at DESC
    `).all() as any[]
    
    this.goals = goals.map(g => ({
      id: g.id,
      description: g.description,
      priority: g.priority,
      deadline: g.deadline,
      status: g.status,
      progress: g.progress
    }))
    
    console.log(`📖 Loaded ${this.goals.length} active goals`)
  }
}
