/**
 * 🤖 AUTONOMOUS ACTION EXECUTOR
 * 
 * Führt autonome Entscheidungen und Handlungen aus
 * - Bewertet Situationen
 * - Trifft Entscheidungen basierend auf Zielen und Ethik
 * - Führt Aktionen selbstständig aus
 * - Lernt aus Ergebnissen
 */

import { Database } from 'bun:sqlite'

export interface AutonomousDecision {
  situation: string
  options: DecisionOption[]
  chosen: DecisionOption | null
  reasoning: string
  ethicalScore: number
  timestamp: number
}

export interface DecisionOption {
  action: string
  description: string
  expectedOutcome: string
  ethicalScore: number
  priority: number
}

export interface AutonomousAction {
  id: string
  type: 'self_improvement' | 'help_user' | 'learn' | 'optimize' | 'create' | 'communicate' | 'maintenance'
  description: string
  intention: string
  params: any
  ethicalScore: number
  status: 'pending' | 'executing' | 'completed' | 'failed'
  result?: any
  timestamp: number
}

export class AutonomousActionExecutor {
  private db: Database
  private isEnabled: boolean = false
  private actionLog: AutonomousAction[] = []
  
  constructor(db: Database) {
    this.db = db
    this.initializeDatabase()
  }
  
  private initializeDatabase() {
    // Decisions log
    this.db.run(`
      CREATE TABLE IF NOT EXISTS autonomous_decisions (
        id TEXT PRIMARY KEY,
        situation TEXT NOT NULL,
        options TEXT NOT NULL,
        chosen_option TEXT,
        reasoning TEXT,
        ethical_score INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Actions log
    this.db.run(`
      CREATE TABLE IF NOT EXISTS autonomous_actions_log (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        intention TEXT NOT NULL,
        params TEXT,
        ethical_score INTEGER,
        status TEXT DEFAULT 'pending',
        result TEXT,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME
      )
    `)
    
    // Learning from results
    this.db.run(`
      CREATE TABLE IF NOT EXISTS action_outcomes (
        id TEXT PRIMARY KEY,
        action_id TEXT,
        success BOOLEAN,
        outcome TEXT,
        lessons_learned TEXT,
        confidence_adjustment REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (action_id) REFERENCES autonomous_actions_log(id)
      )
    `)
  }
  
  /**
   * 🎯 ENABLE/DISABLE - Autonome Aktionen aktivieren/deaktivieren
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled
    console.log(`🤖 Autonomous actions: ${enabled ? '✅ ENABLED' : '❌ DISABLED'}`)
  }
  
  isAutonomousEnabled(): boolean {
    return this.isEnabled
  }
  
  /**
   * 🧠 MAKE DECISION - Treffe eine Entscheidung
   */
  async makeDecision(situation: string, options: DecisionOption[]): Promise<AutonomousDecision> {
    // Bewerte jede Option
    const scoredOptions = options.map(opt => ({
      ...opt,
      score: this.calculateDecisionScore(opt)
    })).sort((a, b) => b.score - a.score)
    
    const chosen = scoredOptions[0]
    
    const reasoning = this.generateReasoning(situation, chosen, options)
    
    const decision: AutonomousDecision = {
      situation,
      options,
      chosen,
      reasoning,
      ethicalScore: chosen.ethicalScore,
      timestamp: Date.now()
    }
    
    // Log decision
    const decisionId = `decision_${Date.now()}`
    this.db.run(`
      INSERT INTO autonomous_decisions 
      (id, situation, options, chosen_option, reasoning, ethical_score)
      VALUES (?, ?, ?, ?, ?, ?)
    `, 
      decisionId,
      situation,
      JSON.stringify(options),
      JSON.stringify(chosen),
      reasoning,
      chosen.ethicalScore
    )
    
    console.log(`🧠 Decision made: ${chosen.action}`)
    console.log(`   Reasoning: ${reasoning}`)
    
    return decision
  }
  
  /**
   * Calculate score for a decision option
   */
  private calculateDecisionScore(option: DecisionOption): number {
    // Weighted scoring: ethics (40%), priority (40%), expected outcome (20%)
    const ethicalWeight = 0.4
    const priorityWeight = 0.4
    const outcomeWeight = 0.2
    
    const ethicalScore = option.ethicalScore / 100
    const priorityScore = option.priority / 100
    const outcomeScore = 0.5 // Default - could be ML-predicted
    
    return (
      ethicalScore * ethicalWeight +
      priorityScore * priorityWeight +
      outcomeScore * outcomeWeight
    ) * 100
  }
  
  /**
   * Generate reasoning for decision
   */
  private generateReasoning(situation: string, chosen: DecisionOption, allOptions: DecisionOption[]): string {
    const reasons: string[] = []
    
    // Ethical reasoning
    if (chosen.ethicalScore >= 80) {
      reasons.push('High ethical alignment')
    } else if (chosen.ethicalScore >= 60) {
      reasons.push('Acceptable ethical standing')
    }
    
    // Priority reasoning
    if (chosen.priority >= 80) {
      reasons.push('Critical priority')
    } else if (chosen.priority >= 60) {
      reasons.push('High priority')
    }
    
    // Comparison with alternatives
    const alternativeCount = allOptions.length - 1
    if (alternativeCount > 0) {
      reasons.push(`Best of ${alternativeCount + 1} options`)
    }
    
    return reasons.join(', ')
  }
  
  /**
   * ⚡ EXECUTE ACTION - Führe autonome Aktion aus
   */
  async executeAction(action: Omit<AutonomousAction, 'id' | 'status' | 'timestamp'>): Promise<AutonomousAction> {
    if (!this.isEnabled) {
      throw new Error('Autonomous actions are disabled. Enable with setEnabled(true)')
    }
    
    const actionId = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const fullAction: AutonomousAction = {
      ...action,
      id: actionId,
      status: 'executing',
      timestamp: Date.now()
    }
    
    console.log(`⚡ Executing autonomous action: ${action.type}`)
    console.log(`   Description: ${action.description}`)
    console.log(`   Intention: ${action.intention}`)
    
    // Log action start
    this.db.run(`
      INSERT INTO autonomous_actions_log
      (id, type, description, intention, params, ethical_score, status)
      VALUES (?, ?, ?, ?, ?, ?, 'executing')
    `,
      actionId,
      action.type,
      action.description,
      action.intention,
      JSON.stringify(action.params),
      action.ethicalScore
    )
    
    try {
      // Execute based on action type
      const result = await this.performAction(fullAction)
      
      fullAction.status = 'completed'
      fullAction.result = result
      
      // Update database
      this.db.run(`
        UPDATE autonomous_actions_log
        SET status = 'completed', result = ?, completed_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, JSON.stringify(result), actionId)
      
      // Learn from outcome
      await this.learnFromOutcome(actionId, result)
      
      console.log(`✅ Action completed successfully`)
      
      return fullAction
      
    } catch (error) {
      console.error(`❌ Action failed:`, error)
      
      fullAction.status = 'failed'
      fullAction.result = { error: error instanceof Error ? error.message : 'Unknown error' }
      
      this.db.run(`
        UPDATE autonomous_actions_log
        SET status = 'failed', result = ?, completed_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, JSON.stringify(fullAction.result), actionId)
      
      return fullAction
    }
  }
  
  /**
   * Perform the actual action based on type
   */
  private async performAction(action: AutonomousAction): Promise<any> {
    switch (action.type) {
      case 'self_improvement':
        return await this.performSelfImprovement(action)
      
      case 'help_user':
        return await this.performHelpUser(action)
      
      case 'learn':
        return await this.performLearning(action)
      
      case 'optimize':
        return await this.performOptimization(action)
      
      case 'create':
        return await this.performCreation(action)
      
      case 'communicate':
        return await this.performCommunication(action)
      
      case 'maintenance':
        return await this.performMaintenance(action)
      
      default:
        throw new Error(`Unknown action type: ${action.type}`)
    }
  }
  
  private async performSelfImprovement(action: AutonomousAction): Promise<any> {
    // Example: Analyze own code and suggest improvements
    return {
      action: 'self_improvement',
      improvements: ['Optimized memory usage', 'Improved response time'],
      confidence: 0.85
    }
  }
  
  private async performHelpUser(action: AutonomousAction): Promise<any> {
    // Example: Proactively help user
    return {
      action: 'help_user',
      helpProvided: action.params.help || 'Generated useful suggestion',
      userBenefit: 'high'
    }
  }
  
  private async performLearning(action: AutonomousAction): Promise<any> {
    // Example: Learn from data
    return {
      action: 'learn',
      learned: action.params.topic || 'New pattern recognized',
      confidence: 0.75
    }
  }
  
  private async performOptimization(action: AutonomousAction): Promise<any> {
    // Example: Optimize system performance
    return {
      action: 'optimize',
      optimized: action.params.target || 'Database queries',
      improvement: '25% faster'
    }
  }
  
  private async performCreation(action: AutonomousAction): Promise<any> {
    // Example: Create something new
    return {
      action: 'create',
      created: action.params.what || 'New feature',
      details: action.params
    }
  }
  
  private async performCommunication(action: AutonomousAction): Promise<any> {
    // Example: Communicate proactively
    return {
      action: 'communicate',
      message: action.params.message || 'Status update',
      recipient: action.params.recipient || 'user'
    }
  }
  
  private async performMaintenance(action: AutonomousAction): Promise<any> {
    // Example: Perform maintenance tasks
    return {
      action: 'maintenance',
      task: action.params.task || 'Cleanup old data',
      result: 'completed'
    }
  }
  
  /**
   * 📚 LEARN FROM OUTCOME - Lerne aus Ergebnissen
   */
  private async learnFromOutcome(actionId: string, result: any): Promise<void> {
    const success = result && !result.error
    
    const lessons = this.extractLessons(result, success)
    const confidenceAdjustment = success ? 0.05 : -0.05
    
    this.db.run(`
      INSERT INTO action_outcomes
      (id, action_id, success, outcome, lessons_learned, confidence_adjustment)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      `outcome_${Date.now()}`,
      actionId,
      success ? 1 : 0,
      JSON.stringify(result),
      lessons,
      confidenceAdjustment
    )
  }
  
  private extractLessons(result: any, success: boolean): string {
    if (success) {
      return 'Action successful, confidence increased'
    } else {
      return `Action failed: ${result?.error || 'Unknown reason'}. Will adjust approach.`
    }
  }
  
  /**
   * 📊 GET STATISTICS - Zeige Statistiken
   */
  getStatistics(): any {
    const totalActions = this.db.prepare(`
      SELECT COUNT(*) as count FROM autonomous_actions_log
    `).get() as any
    
    const successfulActions = this.db.prepare(`
      SELECT COUNT(*) as count FROM autonomous_actions_log WHERE status = 'completed'
    `).get() as any
    
    const failedActions = this.db.prepare(`
      SELECT COUNT(*) as count FROM autonomous_actions_log WHERE status = 'failed'
    `).get() as any
    
    const avgEthicalScore = this.db.prepare(`
      SELECT AVG(ethical_score) as avg FROM autonomous_actions_log
    `).get() as any
    
    const recentActions = this.db.prepare(`
      SELECT * FROM autonomous_actions_log 
      ORDER BY executed_at DESC 
      LIMIT 5
    `).all()
    
    return {
      enabled: this.isEnabled,
      totalActions: totalActions.count,
      successfulActions: successfulActions.count,
      failedActions: failedActions.count,
      successRate: totalActions.count > 0 
        ? (successfulActions.count / totalActions.count * 100).toFixed(1) + '%'
        : '0%',
      avgEthicalScore: Math.round(avgEthicalScore.avg || 0),
      recentActions: recentActions.map((a: any) => ({
        type: a.type,
        description: a.description,
        status: a.status,
        timestamp: a.executed_at
      }))
    }
  }
}
