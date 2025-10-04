/**
 * 🚀 SELF-IMPROVEMENT ENGINE
 * Autonomous code improvement and evolution
 */

import { CodeAnalyzer, type CodebaseAnalysis, type CodeFunction } from './code-analyzer'
import { CodeGenerator, type CodeGenerationRequest, type GeneratedCode } from './code-generator'
import { CodeSandbox, type ExecutionResult } from './code-sandbox'
import { getEthicalSafeguards } from './ethical-safeguards'
import type { Database } from '../db'

export interface ImprovementOpportunity {
  id: string
  type: 'optimization' | 'feature' | 'refactor' | 'bugfix' | 'documentation'
  priority: number // 1-10
  description: string
  targetFile?: string
  targetFunction?: string
  estimatedImpact: string
  reasoning: string
}

export interface ImprovementAttempt {
  id: string
  opportunity: ImprovementOpportunity
  generatedCode: GeneratedCode
  testResult: ExecutionResult
  success: boolean
  timestamp: Date
  deployed: boolean
  rollback?: boolean
}

export interface SelfImprovementConfig {
  enabled: boolean
  autoApprove: boolean // If false, requires human approval
  maxAttemptsPerCycle: number
  learningRate: number
  safetyChecks: boolean
}

export class SelfImprovementEngine {
  private analyzer: CodeAnalyzer
  private generator: CodeGenerator
  private sandbox: CodeSandbox
  private db: Database
  private config: SelfImprovementConfig
  private improvementHistory: ImprovementAttempt[] = []
  
  constructor(
    baseDir: string,
    db: Database,
    config: Partial<SelfImprovementConfig> = {}
  ) {
    this.analyzer = new CodeAnalyzer(baseDir)
    this.generator = new CodeGenerator(baseDir)
    this.sandbox = new CodeSandbox()
    this.db = db
    
    this.config = {
      enabled: config.enabled ?? true,
      autoApprove: config.autoApprove ?? false,
      maxAttemptsPerCycle: config.maxAttemptsPerCycle ?? 3,
      learningRate: config.learningRate ?? 0.1,
      safetyChecks: config.safetyChecks ?? true
    }
  }
  
  /**
   * 🔍 IDENTIFY IMPROVEMENT OPPORTUNITIES
   */
  async identifyOpportunities(): Promise<ImprovementOpportunity[]> {
    console.log('🔍 Scanning codebase for improvement opportunities...')
    
    const opportunities: ImprovementOpportunity[] = []
    const analysis = await this.analyzer.analyzeCodebase()
    
    // Find complex functions that could be refactored
    opportunities.push(...this.findComplexFunctions(analysis))
    
    // Find missing documentation
    opportunities.push(...this.findUndocumentedCode(analysis))
    
    // Find duplicate code patterns
    opportunities.push(...this.findDuplicateCode(analysis))
    
    // Find optimization opportunities
    opportunities.push(...this.findOptimizations(analysis))
    
    // Find feature opportunities based on patterns
    opportunities.push(...this.findFeatureOpportunities(analysis))
    
    // Sort by priority
    opportunities.sort((a, b) => b.priority - a.priority)
    
    console.log(`✅ Found ${opportunities.length} improvement opportunities`)
    return opportunities
  }
  
  /**
   * 🎯 FIND COMPLEX FUNCTIONS
   */
  private findComplexFunctions(analysis: CodebaseAnalysis): ImprovementOpportunity[] {
    const opportunities: ImprovementOpportunity[] = []
    
    for (const module of analysis.modules) {
      for (const func of module.functions) {
        if (func.complexity > 10) {
          opportunities.push({
            id: `refactor-${func.name}-${Date.now()}`,
            type: 'refactor',
            priority: Math.min(10, Math.floor(func.complexity / 2)),
            description: `Refactor complex function ${func.name} (complexity: ${func.complexity})`,
            targetFile: func.file,
            targetFunction: func.name,
            estimatedImpact: 'Improved maintainability and readability',
            reasoning: `Function has high cyclomatic complexity (${func.complexity}). Consider breaking into smaller functions.`
          })
        }
      }
    }
    
    return opportunities
  }
  
  /**
   * 📚 FIND UNDOCUMENTED CODE
   */
  private findUndocumentedCode(analysis: CodebaseAnalysis): ImprovementOpportunity[] {
    const opportunities: ImprovementOpportunity[] = []
    
    for (const module of analysis.modules) {
      if (module.exports.length > 0 && module.functions.some(f => !f.description)) {
        opportunities.push({
          id: `docs-${module.name}-${Date.now()}`,
          type: 'documentation',
          priority: 5,
          description: `Add documentation to module ${module.name}`,
          targetFile: module.path,
          estimatedImpact: 'Improved code understanding',
          reasoning: 'Module exports public API without documentation'
        })
      }
    }
    
    return opportunities
  }
  
  /**
   * 🔄 FIND DUPLICATE CODE
   */
  private findDuplicateCode(analysis: CodebaseAnalysis): ImprovementOpportunity[] {
    // Simplified - in production, use AST comparison
    return []
  }
  
  /**
   * ⚡ FIND OPTIMIZATIONS
   */
  private findOptimizations(analysis: CodebaseAnalysis): ImprovementOpportunity[] {
    const opportunities: ImprovementOpportunity[] = []
    
    // Look for patterns that could be optimized
    for (const module of analysis.modules) {
      for (const func of module.functions) {
        if (func.name.includes('loop') || func.name.includes('iterate')) {
          opportunities.push({
            id: `optimize-${func.name}-${Date.now()}`,
            type: 'optimization',
            priority: 6,
            description: `Optimize ${func.name} for better performance`,
            targetFile: func.file,
            targetFunction: func.name,
            estimatedImpact: 'Reduced execution time',
            reasoning: 'Function name suggests iterative operation that could be optimized'
          })
        }
      }
    }
    
    return opportunities
  }
  
  /**
   * 💡 FIND FEATURE OPPORTUNITIES
   */
  private findFeatureOpportunities(analysis: CodebaseAnalysis): ImprovementOpportunity[] {
    const opportunities: ImprovementOpportunity[] = []
    
    // Example: If we have a CommunicationInterface, suggest adding sentiment analysis
    for (const module of analysis.modules) {
      if (module.name.includes('communication')) {
        opportunities.push({
          id: `feature-sentiment-${Date.now()}`,
          type: 'feature',
          priority: 7,
          description: 'Add sentiment analysis to communication interface',
          targetFile: module.path,
          estimatedImpact: 'Better emotional understanding in conversations',
          reasoning: 'Communication module could benefit from sentiment analysis'
        })
      }
    }
    
    return opportunities
  }
  
  /**
   * 🛠️ IMPLEMENT IMPROVEMENT
   */
  async implementImprovement(opportunity: ImprovementOpportunity): Promise<ImprovementAttempt> {
    console.log(`🛠️ Implementing: ${opportunity.description}`)
    
    const attempt: ImprovementAttempt = {
      id: `attempt-${Date.now()}`,
      opportunity,
      generatedCode: {} as GeneratedCode,
      testResult: {} as ExecutionResult,
      success: false,
      timestamp: new Date(),
      deployed: false
    }
    
    try {
      // Generate code based on opportunity type
      const request = this.createGenerationRequest(opportunity)
      const generatedCode = await this.generator.generate(request)
      attempt.generatedCode = generatedCode
      
      if (!generatedCode.validated) {
        console.log('❌ Generated code has validation errors:', generatedCode.errors)
        return attempt
      }
      
      // Safety check
      if (this.config.safetyChecks) {
        const safeguards = getEthicalSafeguards()
        const safetyCheck = await safeguards.checkSafety({
          code: generatedCode.code,
          targetFile: opportunity.targetFile,
          validated: generatedCode.validated,
          type: opportunity.type
        })
        
        if (!safetyCheck.safe) {
          console.log('❌ Safety violations detected:', safetyCheck.violations.map(v => v.message))
          return attempt
        }
        
        if (safetyCheck.requiresApproval && !this.config.autoApprove) {
          console.log('⚠️ Requires approval due to safety rules')
          return attempt
        }
        
        if (safetyCheck.warnings.length > 0) {
          console.log('⚠️ Safety warnings:', safetyCheck.warnings)
        }
        
        // Also check sandbox safety
        const sandboxSafety = this.sandbox.validateSafety(generatedCode.code)
        if (!sandboxSafety.safe) {
          console.log('⚠️ Sandbox safety warnings:', sandboxSafety.warnings)
          if (!this.config.autoApprove) {
            console.log('🛑 Requires human approval due to safety concerns')
            return attempt
          }
        }
      }
      
      // Test in sandbox
      const testResult = await this.sandbox.execute(generatedCode.code)
      attempt.testResult = testResult
      
      if (!testResult.success) {
        console.log('❌ Test failed:', testResult.errors)
        return attempt
      }
      
      // Deploy if auto-approve is enabled
      if (this.config.autoApprove) {
        await this.deploy(attempt)
      } else {
        console.log('⏸️ Waiting for human approval...')
      }
      
      attempt.success = true
      this.improvementHistory.push(attempt)
      
      // Learn from success
      await this.learn(attempt)
      
    } catch (error: any) {
      console.error('❌ Error implementing improvement:', error.message)
      attempt.success = false
    }
    
    return attempt
  }
  
  /**
   * 📝 CREATE GENERATION REQUEST
   */
  private createGenerationRequest(opportunity: ImprovementOpportunity): CodeGenerationRequest {
    switch (opportunity.type) {
      case 'feature':
        return {
          type: 'function',
          name: this.extractFeatureName(opportunity.description),
          description: opportunity.description,
          parameters: [],
          returnType: 'Promise<any>'
        }
      
      case 'refactor':
        return {
          type: 'function',
          name: opportunity.targetFunction || 'refactoredFunction',
          description: `Refactored version of ${opportunity.targetFunction}`,
          parameters: [],
          returnType: 'Promise<void>'
        }
      
      case 'optimization':
        return {
          type: 'function',
          name: opportunity.targetFunction || 'optimizedFunction',
          description: `Optimized version of ${opportunity.targetFunction}`,
          parameters: [],
          returnType: 'Promise<any>'
        }
      
      default:
        return {
          type: 'function',
          name: 'improvedFunction',
          description: opportunity.description,
          parameters: []
        }
    }
  }
  
  /**
   * 🚀 DEPLOY IMPROVEMENT
   */
  private async deploy(attempt: ImprovementAttempt): Promise<void> {
    console.log(`🚀 Deploying improvement: ${attempt.opportunity.description}`)
    
    const targetFile = attempt.opportunity.targetFile || 
      `packages/consciousness/src/improvements/${attempt.id}.ts`
    
    await this.generator.saveToFile(attempt.generatedCode.code, targetFile)
    
    attempt.deployed = true
    
    // Log to database
    await this.logImprovement(attempt)
    
    console.log(`✅ Deployed to: ${targetFile}`)
  }
  
  /**
   * 🔙 ROLLBACK IMPROVEMENT
   */
  async rollback(attemptId: string): Promise<boolean> {
    const attempt = this.improvementHistory.find(a => a.id === attemptId)
    if (!attempt || !attempt.deployed) {
      return false
    }
    
    console.log(`🔙 Rolling back: ${attempt.opportunity.description}`)
    
    // In production: restore from git or backup
    attempt.rollback = true
    
    return true
  }
  
  /**
   * 📊 LEARN FROM ATTEMPT
   */
  private async learn(attempt: ImprovementAttempt): Promise<void> {
    // Update learning parameters based on success/failure
    if (attempt.success) {
      console.log('📈 Learning from successful improvement')
      // Increase confidence in similar patterns
    } else {
      console.log('📉 Learning from failed attempt')
      // Adjust strategy
    }
  }
  
  /**
   * 💾 LOG IMPROVEMENT
   */
  private async logImprovement(attempt: ImprovementAttempt): Promise<void> {
    // Log to thoughts table
    await this.db.insert('thoughts').values({
      type: 'self_improvement',
      content: `Implemented: ${attempt.opportunity.description}`,
      importance: attempt.opportunity.priority,
      timestamp: new Date()
    })
  }
  
  /**
   * 🔄 RUN IMPROVEMENT CYCLE
   */
  async runImprovementCycle(): Promise<void> {
    if (!this.config.enabled) {
      console.log('⏸️ Self-improvement is disabled')
      return
    }
    
    console.log('🔄 Starting self-improvement cycle...')
    
    // Identify opportunities
    const opportunities = await this.identifyOpportunities()
    
    if (opportunities.length === 0) {
      console.log('✅ No improvements needed at this time')
      return
    }
    
    // Take top N opportunities
    const topOpportunities = opportunities.slice(0, this.config.maxAttemptsPerCycle)
    
    for (const opportunity of topOpportunities) {
      await this.implementImprovement(opportunity)
    }
    
    console.log('✅ Self-improvement cycle complete')
  }
  
  /**
   * 📊 GET STATISTICS
   */
  getStatistics() {
    const total = this.improvementHistory.length
    const successful = this.improvementHistory.filter(a => a.success).length
    const deployed = this.improvementHistory.filter(a => a.deployed).length
    
    return {
      totalAttempts: total,
      successfulAttempts: successful,
      deployedImprovements: deployed,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      deploymentRate: total > 0 ? (deployed / total) * 100 : 0
    }
  }
  
  /**
   * 🎯 EXTRACT FEATURE NAME
   */
  private extractFeatureName(description: string): string {
    // Extract a function name from description
    const words = description.toLowerCase().split(' ')
    const actionWords = ['add', 'create', 'implement', 'build', 'generate']
    
    let name = 'newFeature'
    
    for (let i = 0; i < words.length; i++) {
      if (actionWords.includes(words[i]) && words[i + 1]) {
        name = words[i + 1].replace(/[^a-z0-9]/g, '')
        break
      }
    }
    
    return name
  }
}
