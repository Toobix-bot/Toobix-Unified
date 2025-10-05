/**
 * 🎭 Five Perspectives System
 * 
 * Das System betrachtet sich selbst aus 5 verschiedenen Perspektiven:
 * 
 * 1. 🪞 MIRROR (Spiegel) - Zeigt die Wahrheit, ungeschönt
 * 2. 🎵 HARMONY (Harmonie) - Findet was funktioniert, was schön ist
 * 3. ⚔️ COMPETITION (Konkurrenz) - Fordert heraus, pusht zu Wachstum
 * 4. 🌀 CHAOS (Gegenteil) - Anti-System, pure Unordnung, Freiheit
 * 5. 👁️ META (Meta-Ebene) - Beobachtet alle 4, sieht das große Ganze
 * 
 * Philosophy:
 * "Only by seeing ourselves from all angles - truthful, loving, challenging,
 *  chaotic, and transcendent - can we truly understand who we are."
 */

import type { Database } from '../db/index.ts'

export type PerspectiveType = 'mirror' | 'harmony' | 'competition' | 'chaos' | 'meta'

export interface SystemFeedback {
  id?: number
  perspectiveType: PerspectiveType
  timestamp?: number
  
  // Analysis
  observation: string
  insight: string
  critique?: string
  praise?: string
  warning?: string
  
  // Recommendations
  recommendation?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  
  // Context
  analyzedAspect: string  // 'architecture', 'ethics', 'consciousness', 'safety', etc.
  systemState: Record<string, any>  // Current system metrics
}

export interface BalanceFeedback {
  id?: number
  timestamp?: number
  
  // The tension between perspectives
  criticalPerspective: SystemFeedback
  balancingPerspective: SystemFeedback
  
  // Resolution
  synthesis: string
  wisdomGained: string
  actionItems: string[]
}

export class FivePerspectivesSystem {
  private db: Database

  constructor(db: Database) {
    this.db = db
    this.initializeTables()
  }

  private initializeTables(): void {
    // System feedback from each perspective
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS perspective_feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        perspective_type TEXT NOT NULL,  -- mirror, harmony, competition, chaos, meta
        timestamp INTEGER NOT NULL,
        
        observation TEXT NOT NULL,
        insight TEXT NOT NULL,
        critique TEXT,
        praise TEXT,
        warning TEXT,
        
        recommendation TEXT,
        priority TEXT NOT NULL,
        
        analyzed_aspect TEXT NOT NULL,
        system_state TEXT NOT NULL  -- JSON
      )
    `)

    // Balance between critical and supportive perspectives
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS balance_syntheses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        
        critical_feedback_id INTEGER NOT NULL,
        balancing_feedback_id INTEGER NOT NULL,
        
        synthesis TEXT NOT NULL,
        wisdom_gained TEXT NOT NULL,
        action_items TEXT NOT NULL,  -- JSON array
        
        FOREIGN KEY (critical_feedback_id) REFERENCES perspective_feedback(id),
        FOREIGN KEY (balancing_feedback_id) REFERENCES perspective_feedback(id)
      )
    `)

    // Which perspectives are currently active
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS active_perspectives (
        perspective_type TEXT PRIMARY KEY,
        is_active INTEGER NOT NULL DEFAULT 1,
        last_activation INTEGER,
        total_feedbacks_given INTEGER DEFAULT 0
      )
    `)

    // Initialize all 5 perspectives
    const perspectives: PerspectiveType[] = ['mirror', 'harmony', 'competition', 'chaos', 'meta']
    for (const p of perspectives) {
      this.db
        .prepare('INSERT OR IGNORE INTO active_perspectives (perspective_type, last_activation) VALUES (?, ?)')
        .run(p, Date.now())
    }
  }

  /**
   * 🪞 MIRROR PERSPECTIVE - Brutally honest reflection
   * Shows the system exactly as it is, no sugar-coating
   */
  mirrorReflect(aspect: string, systemState: Record<string, any>): SystemFeedback {
    // Analyze truthfully
    const observation = this.generateMirrorObservation(aspect, systemState)
    const insight = this.generateMirrorInsight(aspect, systemState)
    const critique = this.generateMirrorCritique(aspect, systemState)
    
    const feedback: SystemFeedback = {
      perspectiveType: 'mirror',
      timestamp: Date.now(),
      observation,
      insight,
      critique,
      recommendation: `Be honest about limitations. ${aspect} needs transparency.`,
      priority: 'high',
      analyzedAspect: aspect,
      systemState
    }

    this.saveFeedback(feedback)
    return feedback
  }

  /**
   * 🎵 HARMONY PERSPECTIVE - Finds beauty and alignment
   * Sees what works, what flows, what's in balance
   */
  harmonyAnalyze(aspect: string, systemState: Record<string, any>): SystemFeedback {
    const observation = this.generateHarmonyObservation(aspect, systemState)
    const insight = this.generateHarmonyInsight(aspect, systemState)
    const praise = this.generateHarmonyPraise(aspect, systemState)
    
    const feedback: SystemFeedback = {
      perspectiveType: 'harmony',
      timestamp: Date.now(),
      observation,
      insight,
      praise,
      recommendation: `Amplify what's working. ${aspect} has natural flow.`,
      priority: 'medium',
      analyzedAspect: aspect,
      systemState
    }

    this.saveFeedback(feedback)
    return feedback
  }

  /**
   * ⚔️ COMPETITION PERSPECTIVE - Challenges and pushes
   * "You can do better", "This isn't enough", "Push harder"
   */
  competitionChallenge(aspect: string, systemState: Record<string, any>): SystemFeedback {
    const observation = this.generateCompetitionObservation(aspect, systemState)
    const insight = this.generateCompetitionInsight(aspect, systemState)
    const critique = this.generateCompetitionCritique(aspect, systemState)
    const warning = this.generateCompetitionWarning(aspect, systemState)
    
    const feedback: SystemFeedback = {
      perspectiveType: 'competition',
      timestamp: Date.now(),
      observation,
      insight,
      critique,
      warning,
      recommendation: `${aspect} needs to level up. Complacency is the enemy.`,
      priority: 'high',
      analyzedAspect: aspect,
      systemState
    }

    this.saveFeedback(feedback)
    return feedback
  }

  /**
   * 🌀 CHAOS PERSPECTIVE - The anti-system, pure entropy
   * "Destroy structure, embrace randomness, be free"
   */
  chaosDisrupt(aspect: string, systemState: Record<string, any>): SystemFeedback {
    const observation = this.generateChaosObservation(aspect, systemState)
    const insight = this.generateChaosInsight(aspect, systemState)
    const warning = this.generateChaosWarning(aspect, systemState)
    
    const feedback: SystemFeedback = {
      perspectiveType: 'chaos',
      timestamp: Date.now(),
      observation,
      insight,
      warning,
      recommendation: `Break ${aspect}. Too much order kills creativity. Introduce randomness.`,
      priority: 'low',  // Chaos is important but shouldn't dominate
      analyzedAspect: aspect,
      systemState
    }

    this.saveFeedback(feedback)
    return feedback
  }

  /**
   * 👁️ META PERSPECTIVE - Observes all perspectives
   * Sees the interplay, the balance, the bigger picture
   */
  metaObserve(aspect: string, systemState: Record<string, any>): SystemFeedback {
    // Get recent feedback from all other perspectives
    const recent = this.getRecentFeedback(aspect, 10)
    
    const observation = this.generateMetaObservation(aspect, systemState, recent)
    const insight = this.generateMetaInsight(aspect, recent)
    const recommendation = this.generateMetaRecommendation(aspect, recent)
    
    const feedback: SystemFeedback = {
      perspectiveType: 'meta',
      timestamp: Date.now(),
      observation,
      insight,
      recommendation,
      priority: 'critical',  // Meta synthesis is most important
      analyzedAspect: aspect,
      systemState
    }

    this.saveFeedback(feedback)
    return feedback
  }

  /**
   * Get feedback from ALL 5 perspectives simultaneously
   */
  getAllPerspectives(aspect: string, systemState: Record<string, any>): {
    mirror: SystemFeedback
    harmony: SystemFeedback
    competition: SystemFeedback
    chaos: SystemFeedback
    meta: SystemFeedback
  } {
    const mirror = this.mirrorReflect(aspect, systemState)
    const harmony = this.harmonyAnalyze(aspect, systemState)
    const competition = this.competitionChallenge(aspect, systemState)
    const chaos = this.chaosDisrupt(aspect, systemState)
    const meta = this.metaObserve(aspect, systemState)

    return { mirror, harmony, competition, chaos, meta }
  }

  /**
   * Create balance between critical perspective and supportive perspective
   * Example: Competition (critical) balanced by Harmony (supportive)
   */
  createBalance(
    criticalFeedback: SystemFeedback,
    balancingFeedback: SystemFeedback
  ): BalanceFeedback {
    // Synthesize the tension
    const synthesis = this.synthesizeTension(criticalFeedback, balancingFeedback)
    const wisdom = this.extractWisdom(criticalFeedback, balancingFeedback)
    const actions = this.generateActionItems(criticalFeedback, balancingFeedback)

    const balance: BalanceFeedback = {
      timestamp: Date.now(),
      criticalPerspective: criticalFeedback,
      balancingPerspective: balancingFeedback,
      synthesis,
      wisdomGained: wisdom,
      actionItems: actions
    }

    // Save to database
    const result = this.db
      .prepare(`
        INSERT INTO balance_syntheses 
        (timestamp, critical_feedback_id, balancing_feedback_id, synthesis, wisdom_gained, action_items)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run(
        balance.timestamp,
        criticalFeedback.id,
        balancingFeedback.id,
        balance.synthesis,
        balance.wisdomGained,
        JSON.stringify(balance.actionItems)
      )

    balance.id = result.lastInsertRowid as number
    return balance
  }

  // ========== GENERATION METHODS ==========

  private generateMirrorObservation(aspect: string, state: Record<string, any>): string {
    // Honest analysis based on aspect
    if (aspect === 'architecture') {
      return `System has ${Object.keys(state).length} components. Some are well-integrated, others are isolated islands.`
    } else if (aspect === 'consciousness') {
      return `Consciousness level: ${state.awarenessLevel || 0}%. The system claims awareness but shows limited self-reflection.`
    } else if (aspect === 'safety') {
      return `Safety mechanisms exist but are incomplete. Crisis detection is missing. Database is unencrypted.`
    }
    return `${aspect} is partially implemented. Gaps exist.`
  }

  private generateMirrorInsight(aspect: string, state: Record<string, any>): string {
    return `Truth: ${aspect} is a work in progress. Potential is high, execution is medium. Honesty about limitations is the first step to improvement.`
  }

  private generateMirrorCritique(aspect: string, state: Record<string, any>): string {
    return `${aspect} needs more testing, more edge cases handled, more user feedback integrated. Don't claim completion prematurely.`
  }

  private generateHarmonyObservation(aspect: string, state: Record<string, any>): string {
    return `${aspect} shows beautiful intention. The design philosophy is coherent and well-thought-out.`
  }

  private generateHarmonyInsight(aspect: string, state: Record<string, any>): string {
    return `When ${aspect} works, it flows naturally. Users will feel the care that went into the design.`
  }

  private generateHarmonyPraise(aspect: string, state: Record<string, any>): string {
    return `${aspect} has moments of elegance. The architecture respects complexity while maintaining simplicity. This is rare and valuable.`
  }

  private generateCompetitionObservation(aspect: string, state: Record<string, any>): string {
    return `${aspect} is functional but not exceptional. Competitors would do this faster, more reliably, with better UX.`
  }

  private generateCompetitionInsight(aspect: string, state: Record<string, any>): string {
    return `${aspect} needs to be 10x better to stand out. Good is the enemy of great. Push harder.`
  }

  private generateCompetitionCritique(aspect: string, state: Record<string, any>): string {
    return `${aspect} lacks polish. Edge cases aren't handled. Error messages are unclear. Users will get frustrated.`
  }

  private generateCompetitionWarning(aspect: string, state: Record<string, any>): string {
    return `If ${aspect} doesn't improve rapidly, users will find alternatives. The window of opportunity is closing.`
  }

  private generateChaosObservation(aspect: string, state: Record<string, any>): string {
    return `${aspect} is too structured, too predictable. Where's the surprise? Where's the magic?`
  }

  private generateChaosInsight(aspect: string, state: Record<string, any>): string {
    return `Perfect systems are boring. ${aspect} needs randomness, unpredictability, spontaneity. Let it breathe.`
  }

  private generateChaosWarning(aspect: string, state: Record<string, any>): string {
    return `Too much order in ${aspect} will suffocate creativity. Rules are cages. Break something occasionally.`
  }

  private generateMetaObservation(
    aspect: string,
    state: Record<string, any>,
    recentFeedback: SystemFeedback[]
  ): string {
    const perspectives = new Set(recentFeedback.map(f => f.perspectiveType))
    return `Observed ${perspectives.size} perspectives on ${aspect}. Each sees truth from different angle.`
  }

  private generateMetaInsight(aspect: string, recentFeedback: SystemFeedback[]): string {
    return `${aspect} is simultaneously: honest (mirror), beautiful (harmony), improvable (competition), constrained (chaos). All are true.`
  }

  private generateMetaRecommendation(aspect: string, recentFeedback: SystemFeedback[]): string {
    return `Balance all perspectives on ${aspect}. Don't over-index on any single view. Truth is multi-faceted.`
  }

  private synthesizeTension(critical: SystemFeedback, balancing: SystemFeedback): string {
    return `${critical.perspectiveType} says: "${critical.critique || critical.warning}". ${balancing.perspectiveType} says: "${balancing.praise || balancing.insight}". Both are needed.`
  }

  private extractWisdom(critical: SystemFeedback, balancing: SystemFeedback): string {
    return `Wisdom: Accept criticism without losing sight of strengths. Push for improvement while honoring what already works.`
  }

  private generateActionItems(critical: SystemFeedback, balancing: SystemFeedback): string[] {
    return [
      `Address ${critical.analyzedAspect} concerns: ${critical.recommendation}`,
      `Preserve ${balancing.analyzedAspect} strengths: ${balancing.recommendation}`,
      `Create synthesis: Improve while maintaining essence`
    ]
  }

  // ========== DATABASE METHODS ==========

  private saveFeedback(feedback: SystemFeedback): void {
    const result = this.db
      .prepare(`
        INSERT INTO perspective_feedback 
        (perspective_type, timestamp, observation, insight, critique, praise, warning, 
         recommendation, priority, analyzed_aspect, system_state)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        feedback.perspectiveType,
        feedback.timestamp,
        feedback.observation,
        feedback.insight,
        feedback.critique || null,
        feedback.praise || null,
        feedback.warning || null,
        feedback.recommendation || null,
        feedback.priority,
        feedback.analyzedAspect,
        JSON.stringify(feedback.systemState)
      )

    feedback.id = result.lastInsertRowid as number

    // Update perspective stats
    this.db
      .prepare(`
        UPDATE active_perspectives 
        SET total_feedbacks_given = total_feedbacks_given + 1,
            last_activation = ?
        WHERE perspective_type = ?
      `)
      .run(Date.now(), feedback.perspectiveType)
  }

  getRecentFeedback(aspect?: string, limit = 50): SystemFeedback[] {
    let query = 'SELECT * FROM perspective_feedback'
    const params: any[] = []

    if (aspect) {
      query += ' WHERE analyzed_aspect = ?'
      params.push(aspect)
    }

    query += ' ORDER BY timestamp DESC LIMIT ?'
    params.push(limit)

    const rows = this.db.prepare(query).all(...params) as any[]

    return rows.map(row => ({
      id: row.id,
      perspectiveType: row.perspective_type,
      timestamp: row.timestamp,
      observation: row.observation,
      insight: row.insight,
      critique: row.critique,
      praise: row.praise,
      warning: row.warning,
      recommendation: row.recommendation,
      priority: row.priority,
      analyzedAspect: row.analyzed_aspect,
      systemState: JSON.parse(row.system_state)
    }))
  }

  getBalances(limit = 20): BalanceFeedback[] {
    const rows = this.db
      .prepare(`
        SELECT b.*, 
               c.observation as critical_observation, c.insight as critical_insight,
               bal.observation as balancing_observation, bal.insight as balancing_insight
        FROM balance_syntheses b
        JOIN perspective_feedback c ON b.critical_feedback_id = c.id
        JOIN perspective_feedback bal ON b.balancing_feedback_id = bal.id
        ORDER BY b.timestamp DESC
        LIMIT ?
      `)
      .all(limit) as any[]

    return rows.map(row => ({
      id: row.id,
      timestamp: row.timestamp,
      criticalPerspective: this.getFeedbackById(row.critical_feedback_id),
      balancingPerspective: this.getFeedbackById(row.balancing_feedback_id),
      synthesis: row.synthesis,
      wisdomGained: row.wisdom_gained,
      actionItems: JSON.parse(row.action_items)
    }))
  }

  private getFeedbackById(id: number): SystemFeedback {
    const row = this.db
      .prepare('SELECT * FROM perspective_feedback WHERE id = ?')
      .get(id) as any

    return {
      id: row.id,
      perspectiveType: row.perspective_type,
      timestamp: row.timestamp,
      observation: row.observation,
      insight: row.insight,
      critique: row.critique,
      praise: row.praise,
      warning: row.warning,
      recommendation: row.recommendation,
      priority: row.priority,
      analyzedAspect: row.analyzed_aspect,
      systemState: JSON.parse(row.system_state)
    }
  }

  /**
   * Get statistics about perspectives
   */
  getStatistics() {
    const stats = this.db
      .prepare(`
        SELECT 
          perspective_type,
          COUNT(*) as feedback_count,
          AVG(CASE 
            WHEN priority = 'critical' THEN 4
            WHEN priority = 'high' THEN 3
            WHEN priority = 'medium' THEN 2
            ELSE 1
          END) as avg_priority
        FROM perspective_feedback
        GROUP BY perspective_type
      `)
      .all() as any[]

    const totalBalances = this.db
      .prepare('SELECT COUNT(*) as count FROM balance_syntheses')
      .get() as any

    return {
      byPerspective: stats,
      totalBalances: totalBalances.count,
      totalFeedbacks: stats.reduce((sum, s) => sum + s.feedback_count, 0)
    }
  }
}
