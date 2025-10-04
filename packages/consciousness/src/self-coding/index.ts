/**
 * 🤖 SELF-CODING SYSTEM
 * System that can read, write, and improve its own code
 */

export * from './code-analyzer'
export * from './code-generator'
export * from './code-sandbox'
export * from './self-improvement'

import { CodeAnalyzer } from './code-analyzer'
import { CodeGenerator } from './code-generator'
import { CodeSandbox } from './code-sandbox'
import { SelfImprovementEngine } from './self-improvement'
import type { Database } from '../db'

export interface SelfCodingSystemConfig {
  baseDir: string
  autoImprove: boolean
  improvementInterval?: number // minutes
  requireApproval: boolean
}

export class SelfCodingSystem {
  private analyzer: CodeAnalyzer
  private generator: CodeGenerator
  private sandbox: CodeSandbox
  private improvementEngine: SelfImprovementEngine
  private config: SelfCodingSystemConfig
  private improvementInterval?: NodeJS.Timeout
  
  constructor(db: Database, config: SelfCodingSystemConfig) {
    this.config = config
    
    this.analyzer = new CodeAnalyzer(config.baseDir)
    this.generator = new CodeGenerator(config.baseDir)
    this.sandbox = new CodeSandbox()
    this.improvementEngine = new SelfImprovementEngine(
      config.baseDir,
      db,
      {
        enabled: config.autoImprove,
        autoApprove: !config.requireApproval,
        maxAttemptsPerCycle: 3,
        safetyChecks: true
      }
    )
  }
  
  /**
   * 🚀 START AUTONOMOUS IMPROVEMENT
   */
  async startAutonomousImprovement(): Promise<void> {
    if (this.improvementInterval) {
      console.log('⚠️ Autonomous improvement already running')
      return
    }
    
    console.log('🚀 Starting autonomous self-improvement...')
    
    // Run first cycle immediately
    await this.improvementEngine.runImprovementCycle()
    
    // Schedule periodic improvements
    if (this.config.improvementInterval) {
      this.improvementInterval = setInterval(
        () => this.improvementEngine.runImprovementCycle(),
        this.config.improvementInterval * 60 * 1000
      )
    }
  }
  
  /**
   * 🛑 STOP AUTONOMOUS IMPROVEMENT
   */
  stopAutonomousImprovement(): void {
    if (this.improvementInterval) {
      clearInterval(this.improvementInterval)
      this.improvementInterval = undefined
      console.log('🛑 Stopped autonomous self-improvement')
    }
  }
  
  /**
   * 🔍 ANALYZE CODEBASE
   */
  async analyzeCodebase() {
    return await this.analyzer.analyzeCodebase()
  }
  
  /**
   * ✍️ GENERATE CODE
   */
  async generateCode(request: any) {
    return await this.generator.generate(request)
  }
  
  /**
   * 🧪 TEST CODE
   */
  async testCode(code: string, options?: any) {
    return await this.sandbox.execute(code, options)
  }
  
  /**
   * 🔄 RUN IMPROVEMENT CYCLE
   */
  async runImprovementCycle() {
    return await this.improvementEngine.runImprovementCycle()
  }
  
  /**
   * 📊 GET STATISTICS
   */
  getStatistics() {
    return this.improvementEngine.getStatistics()
  }
  
  /**
   * 🔙 ROLLBACK IMPROVEMENT
   */
  async rollback(attemptId: string) {
    return await this.improvementEngine.rollback(attemptId)
  }
  
  /**
   * 💾 SAVE CODE TO FILE
   */
  async saveCode(code: string, filePath: string) {
    return await this.generator.saveToFile(code, filePath)
  }
  
  /**
   * 📖 READ FUNCTION
   */
  async readFunction(name: string) {
    const func = await this.analyzer.findFunction(name)
    if (!func) return null
    
    const code = await this.analyzer.readFunctionCode(func)
    return { function: func, code }
  }
}

// Export singleton instance (initialized later)
let selfCodingInstance: SelfCodingSystem | null = null

export function initSelfCodingSystem(db: Database, config: SelfCodingSystemConfig): SelfCodingSystem {
  selfCodingInstance = new SelfCodingSystem(db, config)
  return selfCodingInstance
}

export function getSelfCodingSystem(): SelfCodingSystem | null {
  return selfCodingInstance
}
