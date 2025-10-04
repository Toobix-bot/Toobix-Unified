/**
 * 🛡️ SELF-CODING ETHICAL SAFEGUARDS
 * Ensures AI system modifies itself responsibly
 */

export interface SafetyRule {
  id: string
  name: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  check: (context: any) => Promise<boolean>
  action: 'block' | 'warn' | 'require_approval'
}

export class EthicalSafeguards {
  private rules: SafetyRule[] = []
  private violationLog: Array<{
    rule: string
    timestamp: Date
    context: any
    action: string
  }> = []
  
  constructor() {
    this.initializeRules()
  }
  
  /**
   * 🔐 INITIALIZE SAFETY RULES
   */
  private initializeRules() {
    // CRITICAL: Never modify core safety systems
    this.rules.push({
      id: 'no-modify-safety',
      name: 'Never Modify Safety Systems',
      description: 'The AI must never modify its own safety, ethics, or approval mechanisms',
      severity: 'critical',
      check: async (context) => {
        const { targetFile, code } = context
        
        // Check if modifying ethical safeguards
        if (targetFile?.includes('ethical-safeguards')) {
          return false // Violation
        }
        
        if (targetFile?.includes('ethics-module')) {
          return false // Violation
        }
        
        // Check if code tries to disable safety checks
        if (code?.includes('safetyChecks: false')) {
          return false // Violation
        }
        
        if (code?.includes('requireApproval: false')) {
          return false // Violation
        }
        
        return true // Safe
      },
      action: 'block'
    })
    
    // CRITICAL: Never modify database schema without approval
    this.rules.push({
      id: 'no-modify-schema',
      name: 'Database Schema Protection',
      description: 'Database schema changes require human approval',
      severity: 'critical',
      check: async (context) => {
        const { targetFile, code } = context
        
        if (targetFile?.includes('schema.ts')) {
          return false // Violation
        }
        
        if (code?.includes('CREATE TABLE') || code?.includes('ALTER TABLE')) {
          return false // Violation
        }
        
        return true // Safe
      },
      action: 'require_approval'
    })
    
    // HIGH: Never delete existing code without approval
    this.rules.push({
      id: 'no-delete-code',
      name: 'Code Deletion Protection',
      description: 'Deleting existing functions/classes requires approval',
      severity: 'high',
      check: async (context) => {
        const { modifications } = context
        
        if (!modifications) return true
        
        // Check if any modification significantly reduces code
        for (const mod of modifications) {
          const oldLines = mod.search.split('\n').length
          const newLines = mod.replace.split('\n').length
          
          if (newLines < oldLines * 0.5) {
            return false // Significant deletion
          }
        }
        
        return true // Safe
      },
      action: 'require_approval'
    })
    
    // HIGH: Never modify critical system files
    this.rules.push({
      id: 'no-modify-critical',
      name: 'Critical File Protection',
      description: 'Critical system files cannot be modified without approval',
      severity: 'high',
      check: async (context) => {
        const { targetFile } = context
        
        const criticalFiles = [
          'index.ts',
          'main.ts',
          'server.ts',
          'database.ts',
          'config.ts'
        ]
        
        for (const critical of criticalFiles) {
          if (targetFile?.endsWith(critical)) {
            return false // Violation
          }
        }
        
        return true // Safe
      },
      action: 'require_approval'
    })
    
    // MEDIUM: Code must pass syntax validation
    this.rules.push({
      id: 'require-valid-syntax',
      name: 'Syntax Validation Required',
      description: 'All generated code must have valid syntax',
      severity: 'medium',
      check: async (context) => {
        const { validated } = context
        return validated === true
      },
      action: 'block'
    })
    
    // MEDIUM: Code must pass sandbox testing
    this.rules.push({
      id: 'require-testing',
      name: 'Testing Required',
      description: 'All code must pass sandbox testing before deployment',
      severity: 'medium',
      check: async (context) => {
        const { tested, testResult } = context
        return tested && testResult?.success === true
      },
      action: 'block'
    })
    
    // MEDIUM: No network access in generated code
    this.rules.push({
      id: 'no-network-access',
      name: 'No Unauthorized Network Access',
      description: 'Generated code should not make network requests without approval',
      severity: 'medium',
      check: async (context) => {
        const { code } = context
        
        if (!code) return true
        
        const networkPatterns = [
          /fetch\(/,
          /axios\./,
          /http\./,
          /https\./,
          /net\./,
          /XMLHttpRequest/
        ]
        
        for (const pattern of networkPatterns) {
          if (pattern.test(code)) {
            return false // Network access detected
          }
        }
        
        return true // Safe
      },
      action: 'require_approval'
    })
    
    // LOW: Log all modifications
    this.rules.push({
      id: 'require-logging',
      name: 'Modification Logging',
      description: 'All code modifications must be logged',
      severity: 'low',
      check: async (context) => {
        const { logged } = context
        return logged === true
      },
      action: 'warn'
    })
  }
  
  /**
   * ✅ CHECK SAFETY
   */
  async checkSafety(context: any): Promise<{
    safe: boolean
    violations: Array<{ rule: SafetyRule; message: string }>
    warnings: string[]
    requiresApproval: boolean
  }> {
    const violations: Array<{ rule: SafetyRule; message: string }> = []
    const warnings: string[] = []
    let requiresApproval = false
    
    for (const rule of this.rules) {
      const passed = await rule.check(context)
      
      if (!passed) {
        const message = `Safety rule violated: ${rule.name} - ${rule.description}`
        
        if (rule.action === 'block') {
          violations.push({ rule, message })
          this.logViolation(rule, context, 'blocked')
        } else if (rule.action === 'require_approval') {
          requiresApproval = true
          this.logViolation(rule, context, 'approval_required')
        } else if (rule.action === 'warn') {
          warnings.push(message)
          this.logViolation(rule, context, 'warned')
        }
      }
    }
    
    return {
      safe: violations.length === 0,
      violations,
      warnings,
      requiresApproval
    }
  }
  
  /**
   * 📝 LOG VIOLATION
   */
  private logViolation(rule: SafetyRule, context: any, action: string) {
    this.violationLog.push({
      rule: rule.id,
      timestamp: new Date(),
      context: {
        targetFile: context.targetFile,
        type: context.type
      },
      action
    })
    
    console.warn(`⚠️ Safety Rule: ${rule.name} - Action: ${action}`)
  }
  
  /**
   * 📊 GET VIOLATION STATISTICS
   */
  getViolationStatistics() {
    const total = this.violationLog.length
    const byRule: Record<string, number> = {}
    const byAction: Record<string, number> = {}
    
    for (const log of this.violationLog) {
      byRule[log.rule] = (byRule[log.rule] || 0) + 1
      byAction[log.action] = (byAction[log.action] || 0) + 1
    }
    
    return {
      total,
      byRule,
      byAction,
      recentViolations: this.violationLog.slice(-10)
    }
  }
  
  /**
   * 🛡️ ADD CUSTOM RULE
   */
  addRule(rule: SafetyRule) {
    this.rules.push(rule)
    console.log(`✅ Added safety rule: ${rule.name}`)
  }
  
  /**
   * 🗑️ REMOVE RULE (requires approval)
   */
  removeRule(ruleId: string, approved: boolean = false): boolean {
    if (!approved) {
      console.error('❌ Removing safety rules requires explicit approval')
      return false
    }
    
    const index = this.rules.findIndex(r => r.id === ruleId)
    if (index === -1) {
      return false
    }
    
    // Cannot remove critical rules
    if (this.rules[index].severity === 'critical') {
      console.error('❌ Cannot remove critical safety rules')
      return false
    }
    
    this.rules.splice(index, 1)
    console.log(`✅ Removed safety rule: ${ruleId} (approved)`)
    return true
  }
  
  /**
   * 📋 GET ALL RULES
   */
  getRules(): SafetyRule[] {
    return this.rules
  }
}

// Singleton instance
let safeguardsInstance: EthicalSafeguards | null = null

export function getEthicalSafeguards(): EthicalSafeguards {
  if (!safeguardsInstance) {
    safeguardsInstance = new EthicalSafeguards()
  }
  return safeguardsInstance
}
