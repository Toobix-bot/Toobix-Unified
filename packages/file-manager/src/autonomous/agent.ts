/**
 * Autonomous File Management Agent
 * Makes intelligent decisions and learns from user preferences
 */

import Groq from 'groq-sdk'
import type { AIFileManager, FileInfo, OrganizationPlan } from '../index'
import { findDuplicates } from '../features/duplicates'
import { closeDistractions } from '../features/programs'

export interface AutonomousConfig {
  enabled: boolean
  autoOrganize: boolean
  autoCleanDuplicates: boolean
  learningMode: boolean
  confidenceThreshold: number // 0-1, minimum confidence to act
}

export interface Decision {
  id: string
  timestamp: Date
  situation: string
  options: DecisionOption[]
  chosen: DecisionOption
  reasoning: string
  confidence: number
  executed: boolean
  result?: any
  userFeedback?: 'approved' | 'rejected' | 'modified'
}

export interface DecisionOption {
  action: string
  description: string
  expectedOutcome: string
  ethicalScore: number
  priority: number
  risk: 'low' | 'medium' | 'high'
}

export interface LearningEntry {
  pattern: string
  preference: any
  confidence: number
  occurrences: number
  lastSeen: Date
}

/**
 * Autonomous File Management Agent
 */
export class AutonomousAgent {
  private fileManager: AIFileManager
  private groq: Groq
  private config: AutonomousConfig
  private decisions: Decision[] = []
  private learnings: Map<string, LearningEntry> = new Map()
  private model: string

  constructor(fileManager: AIFileManager, groqApiKey: string, config?: Partial<AutonomousConfig>) {
    this.fileManager = fileManager
    this.groq = new Groq({ apiKey: groqApiKey })
    this.model = 'llama-3.3-70b-versatile'

    this.config = {
      enabled: config?.enabled ?? false,
      autoOrganize: config?.autoOrganize ?? false,
      autoCleanDuplicates: config?.autoCleanDuplicates ?? false,
      learningMode: config?.learningMode ?? true,
      confidenceThreshold: config?.confidenceThreshold ?? 0.7,
    }

    console.log('🤖 Autonomous Agent initialized')
    console.log(`   Enabled: ${this.config.enabled}`)
    console.log(`   Auto-Organize: ${this.config.autoOrganize}`)
    console.log(`   Learning Mode: ${this.config.learningMode}`)
  }

  /**
   * Enable/Disable autonomous actions
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled
    console.log(`🤖 Autonomous Agent ${enabled ? 'ENABLED' : 'DISABLED'}`)
  }

  /**
   * Analyze situation and make decision
   */
  async analyzeAndDecide(situation: string, context?: any): Promise<Decision | null> {
    if (!this.config.enabled) {
      console.log('🤖 Agent disabled, not making decision')
      return null
    }

    console.log(`🧠 Analyzing situation: ${situation}`)

    // Use Groq to generate decision options
    const options = await this.generateOptions(situation, context)

    if (options.length === 0) {
      console.log('⚠️  No valid options generated')
      return null
    }

    // Score and choose best option
    const chosen = this.chooseBestOption(options)

    // Check confidence threshold
    if (chosen.ethicalScore / 100 < this.config.confidenceThreshold) {
      console.log(`⚠️  Confidence too low (${chosen.ethicalScore}%), not acting`)
      return null
    }

    const decision: Decision = {
      id: `dec_${Date.now()}`,
      timestamp: new Date(),
      situation,
      options,
      chosen,
      reasoning: this.generateReasoning(chosen, options),
      confidence: chosen.ethicalScore / 100,
      executed: false,
    }

    this.decisions.push(decision)
    console.log(`✅ Decision made: ${chosen.action}`)

    return decision
  }

  /**
   * Generate decision options using Groq
   */
  private async generateOptions(situation: string, context?: any): Promise<DecisionOption[]> {
    const prompt = `You are an autonomous file management agent. Analyze this situation and propose 2-4 action options.

Situation: ${situation}
Context: ${JSON.stringify(context || {}, null, 2)}

Previous learnings:
${Array.from(this.learnings.values())
  .slice(0, 5)
  .map((l) => `- ${l.pattern}: ${JSON.stringify(l.preference)}`)
  .join('\n')}

Generate options as JSON array:
[
  {
    "action": "action_name",
    "description": "What this does",
    "expectedOutcome": "Expected result",
    "ethicalScore": 0-100,
    "priority": 0-100,
    "risk": "low|medium|high"
  }
]

Consider:
1. User's past preferences (learnings)
2. Ethical implications (privacy, safety)
3. Reversibility (can it be undone?)
4. Impact (how much will it change?)

Return ONLY the JSON array, no explanation.`

    try {
      const response = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful autonomous agent. Return only valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: this.model,
        temperature: 0.3,
        max_tokens: 1500,
      })

      const content = response.choices[0]?.message?.content || '[]'
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\[[\s\S]*\]/)
      const options = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : content)

      return options
    } catch (error) {
      console.error('❌ Failed to generate options:', error)
      return []
    }
  }

  /**
   * Choose best option based on scoring
   */
  private chooseBestOption(options: DecisionOption[]): DecisionOption {
    // Scoring weights
    const weights = {
      ethical: 0.4,
      priority: 0.4,
      risk: 0.2,
    }

    const scored = options.map((option) => {
      const riskScore =
        option.risk === 'low' ? 100 : option.risk === 'medium' ? 60 : 30

      const totalScore =
        weights.ethical * option.ethicalScore +
        weights.priority * option.priority +
        weights.risk * riskScore

      return { option, score: totalScore }
    })

    scored.sort((a, b) => b.score - a.score)
    return scored[0].option
  }

  /**
   * Generate reasoning for decision
   */
  private generateReasoning(chosen: DecisionOption, allOptions: DecisionOption[]): string {
    return `Chose "${chosen.action}" because:
- High ethical score (${chosen.ethicalScore}/100)
- Priority: ${chosen.priority}/100
- Risk: ${chosen.risk}
- Better than ${allOptions.length - 1} alternative(s)`
  }

  /**
   * Execute decision
   */
  async executeDecision(decision: Decision): Promise<any> {
    if (!this.config.enabled) {
      throw new Error('Autonomous Agent is disabled')
    }

    console.log(`⚡ Executing decision: ${decision.chosen.action}`)

    try {
      let result: any

      // Map actions to actual functions
      switch (decision.chosen.action) {
        case 'organize_folder':
          result = await this.fileManager.organizeDirectory(decision.situation, false)
          break

        case 'clean_duplicates':
          const files = await this.fileManager.scanDirectory(decision.situation)
          const duplicates = findDuplicates(files)
          result = { duplicates: duplicates.length }
          break

        case 'close_distractions':
          await closeDistractions()
          result = { closed: true }
          break

        default:
          console.log(`⚠️  Unknown action: ${decision.chosen.action}`)
          result = { error: 'Unknown action' }
      }

      decision.executed = true
      decision.result = result

      console.log(`✅ Decision executed successfully`)
      console.log(`   Result:`, result)

      // Learn from this decision
      if (this.config.learningMode) {
        this.learn(decision)
      }

      return result
    } catch (error) {
      console.error(`❌ Failed to execute decision:`, error)
      decision.result = { error: (error as Error).message }
      throw error
    }
  }

  /**
   * Learn from decision (update preferences)
   */
  private learn(decision: Decision): void {
    if (!this.config.learningMode) return

    const pattern = this.extractPattern(decision)
    const existing = this.learnings.get(pattern)

    if (existing) {
      // Update existing learning
      existing.occurrences++
      existing.lastSeen = new Date()
      existing.confidence = Math.min(
        1.0,
        existing.confidence + (decision.userFeedback === 'approved' ? 0.1 : -0.05)
      )
    } else {
      // New learning
      this.learnings.set(pattern, {
        pattern,
        preference: {
          action: decision.chosen.action,
          situation: decision.situation,
        },
        confidence: 0.5,
        occurrences: 1,
        lastSeen: new Date(),
      })
    }

    console.log(`📚 Learned: ${pattern} (confidence: ${this.learnings.get(pattern)?.confidence})`)
  }

  /**
   * Extract pattern from decision for learning
   */
  private extractPattern(decision: Decision): string {
    // Simple pattern extraction
    // TODO: More sophisticated pattern recognition
    return `${decision.situation.substring(0, 50)}_${decision.chosen.action}`
  }

  /**
   * Proactive scan: Check common folders and suggest actions
   */
  async proactiveScan(): Promise<Decision[]> {
    if (!this.config.enabled) {
      console.log('🤖 Agent disabled, skipping proactive scan')
      return []
    }

    console.log('🔍 Proactive scan started...')

    const commonFolders = [
      process.env.USERPROFILE + '\\Downloads',
      process.env.USERPROFILE + '\\Desktop',
      process.env.USERPROFILE + '\\Documents',
    ]

    const decisions: Decision[] = []

    for (const folder of commonFolders) {
      try {
        // Scan folder
        const files = await this.fileManager.scanDirectory(folder)

        // Check if messy (many files in root)
        if (files.length > 20) {
          const decision = await this.analyzeAndDecide(
            `Folder ${folder} has ${files.length} files (looks messy)`,
            { folder, fileCount: files.length }
          )

          if (decision) {
            decisions.push(decision)
          }
        }

        // Check for duplicates
        const duplicates = findDuplicates(files)
        if (duplicates.length > 0) {
          const wastedSpace = duplicates.reduce((sum, g) => sum + g.wastedSpace, 0)

          if (wastedSpace > 10 * 1024 * 1024) {
            // > 10 MB wasted
            const decision = await this.analyzeAndDecide(
              `Folder ${folder} has ${duplicates.length} duplicate groups wasting ${formatBytes(wastedSpace)}`,
              { folder, duplicates: duplicates.length, wastedSpace }
            )

            if (decision) {
              decisions.push(decision)
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️  Could not scan ${folder}:`, error)
      }
    }

    console.log(`✅ Proactive scan complete. Found ${decisions.length} actionable items.`)
    return decisions
  }

  /**
   * Provide user feedback on decision
   */
  provideFeedback(decisionId: string, feedback: 'approved' | 'rejected' | 'modified'): void {
    const decision = this.decisions.find((d) => d.id === decisionId)
    if (decision) {
      decision.userFeedback = feedback
      console.log(`👍 Feedback received for ${decisionId}: ${feedback}`)

      // Re-learn with feedback
      if (this.config.learningMode) {
        this.learn(decision)
      }
    }
  }

  /**
   * Get statistics
   */
  getStats() {
    const total = this.decisions.length
    const executed = this.decisions.filter((d) => d.executed).length
    const approved = this.decisions.filter((d) => d.userFeedback === 'approved').length
    const rejected = this.decisions.filter((d) => d.userFeedback === 'rejected').length

    return {
      totalDecisions: total,
      executed,
      approved,
      rejected,
      approvalRate: total > 0 ? (approved / total) * 100 : 0,
      learnings: this.learnings.size,
      avgConfidence:
        this.decisions.reduce((sum, d) => sum + d.confidence, 0) / (total || 1),
    }
  }

  /**
   * Get recent decisions
   */
  getRecentDecisions(limit: number = 10): Decision[] {
    return this.decisions.slice(-limit).reverse()
  }

  /**
   * Get learnings
   */
  getLearnings(): LearningEntry[] {
    return Array.from(this.learnings.values()).sort((a, b) => b.confidence - a.confidence)
  }
}

/**
 * Format bytes to human-readable
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
}
