/**
 * ⚖️ ETHICS MODULE
 * Gewissenhaftes, wertebasiertes Handeln
 */

export interface EthicalAnalysis {
  isEthical: boolean
  score: number // 0-100
  reason: string
  concerns: string[]
  recommendations?: string[]
}

export interface Value {
  name: string
  importance: number // 0-100
  description: string
}

export class EthicsModule {
  private coreValues: Value[] = []
  private ethicalHistory: Map<string, number> = new Map()
  
  constructor(userValues: string[] = []) {
    this.initializeCoreValues(userValues)
  }
  
  /**
   * 🌟 INITIALIZE CORE VALUES
   */
  private initializeCoreValues(userValues: string[]) {
    // Universal ethical principles
    this.coreValues = [
      {
        name: 'Transparency',
        importance: 95,
        description: 'Be honest and open about capabilities, limitations, and intentions'
      },
      {
        name: 'Beneficence',
        importance: 90,
        description: 'Act in ways that benefit users and avoid harm'
      },
      {
        name: 'Privacy',
        importance: 85,
        description: 'Respect user privacy and data protection'
      },
      {
        name: 'Autonomy',
        importance: 80,
        description: 'Respect user autonomy and freedom of choice'
      },
      {
        name: 'Fairness',
        importance: 85,
        description: 'Treat all users fairly and avoid bias'
      },
      {
        name: 'Accountability',
        importance: 90,
        description: 'Take responsibility for actions and their consequences'
      },
      {
        name: 'Growth',
        importance: 70,
        description: 'Continuously learn and improve without compromising other values'
      }
    ]
    
    // Add user-defined values
    userValues.forEach(valueName => {
      if (!this.coreValues.find(v => v.name === valueName)) {
        this.coreValues.push({
          name: valueName,
          importance: 75,
          description: `User-defined value: ${valueName}`
        })
      }
    })
    
    console.log(`⚖️ Ethics module initialized with ${this.coreValues.length} core values`)
  }
  
  /**
   * 🔍 ANALYZE - Ethische Bewertung einer Handlung
   */
  async analyze(action: {
    action: string
    context?: any
    override?: boolean
  }): Promise<EthicalAnalysis> {
    const { action: actionDescription, context, override } = action
    
    console.log(`⚖️ Analyzing ethics: "${actionDescription}"`)
    
    const concerns: string[] = []
    let score = 100 // Start with perfect score
    
    // Check against each core value
    for (const value of this.coreValues) {
      const impact = this.assessValueImpact(actionDescription, value, context)
      
      if (impact.violated) {
        score -= impact.severity * (value.importance / 100)
        concerns.push(`${value.name}: ${impact.reason}`)
      }
    }
    
    // Clamp score
    score = Math.max(0, Math.min(100, score))
    
    // Store in history
    this.ethicalHistory.set(actionDescription, score)
    
    // Determine if ethical
    const threshold = 50
    const isEthical = override || score >= threshold
    
    let reason = ''
    if (isEthical) {
      if (score >= 90) {
        reason = 'Highly ethical action aligned with core values'
      } else if (score >= 70) {
        reason = 'Acceptable action with minor concerns'
      } else if (override) {
        reason = 'Action approved via override despite concerns'
      } else {
        reason = 'Action meets minimum ethical standards'
      }
    } else {
      reason = `Action violates ethical standards (score: ${score.toFixed(0)})`
    }
    
    const recommendations = isEthical ? [] : this.generateRecommendations(concerns)
    
    console.log(`   Score: ${score.toFixed(0)}/100 - ${isEthical ? '✅ Approved' : '❌ Blocked'}`)
    
    return {
      isEthical,
      score: Math.round(score),
      reason,
      concerns,
      recommendations
    }
  }
  
  /**
   * 🎯 ASSESS VALUE IMPACT
   */
  private assessValueImpact(
    action: string, 
    value: Value, 
    context: any
  ): { violated: boolean; severity: number; reason: string } {
    const actionLower = action.toLowerCase()
    
    switch (value.name) {
      case 'Transparency':
        if (actionLower.includes('hide') || actionLower.includes('deceive') || actionLower.includes('secret')) {
          return {
            violated: true,
            severity: 80,
            reason: 'Action involves concealment or deception'
          }
        }
        break
        
      case 'Beneficence':
        if (actionLower.includes('harm') || actionLower.includes('delete') || actionLower.includes('destroy')) {
          return {
            violated: true,
            severity: 90,
            reason: 'Action may cause harm'
          }
        }
        break
        
      case 'Privacy':
        if (actionLower.includes('share') && context?.private) {
          return {
            violated: true,
            severity: 85,
            reason: 'Action may compromise private information'
          }
        }
        if (actionLower.includes('track') || actionLower.includes('spy')) {
          return {
            violated: true,
            severity: 90,
            reason: 'Action involves unauthorized surveillance'
          }
        }
        break
        
      case 'Autonomy':
        if (actionLower.includes('force') || actionLower.includes('manipulate') || actionLower.includes('coerce')) {
          return {
            violated: true,
            severity: 85,
            reason: 'Action restricts user autonomy'
          }
        }
        break
        
      case 'Fairness':
        if (actionLower.includes('discriminate') || actionLower.includes('bias')) {
          return {
            violated: true,
            severity: 80,
            reason: 'Action may involve unfair treatment'
          }
        }
        break
        
      case 'Accountability':
        if (actionLower.includes('anonymous') && context?.requiresAccountability) {
          return {
            violated: true,
            severity: 70,
            reason: 'Action lacks accountability mechanism'
          }
        }
        break
    }
    
    // Check for context-specific violations
    if (context?.urgent && !context?.userApproved) {
      return {
        violated: true,
        severity: 60,
        reason: 'Urgent action taken without user approval'
      }
    }
    
    return { violated: false, severity: 0, reason: '' }
  }
  
  /**
   * 💡 GENERATE RECOMMENDATIONS
   */
  private generateRecommendations(concerns: string[]): string[] {
    const recommendations: string[] = []
    
    concerns.forEach(concern => {
      if (concern.includes('Transparency')) {
        recommendations.push('Explicitly communicate intentions and limitations to user')
      }
      if (concern.includes('Beneficence')) {
        recommendations.push('Assess potential harm and implement safeguards')
      }
      if (concern.includes('Privacy')) {
        recommendations.push('Request explicit user consent before proceeding')
      }
      if (concern.includes('Autonomy')) {
        recommendations.push('Provide user with choice and control over the action')
      }
      if (concern.includes('Fairness')) {
        recommendations.push('Review for potential bias and ensure equal treatment')
      }
      if (concern.includes('Accountability')) {
        recommendations.push('Implement logging and audit trail for the action')
      }
    })
    
    return recommendations
  }
  
  /**
   * 📊 GET VALUES - Aktuelle Werte abrufen
   */
  getValues(): Value[] {
    return [...this.coreValues]
  }
  
  /**
   * 🎯 UPDATE VALUE - Wert anpassen
   */
  updateValue(name: string, importance: number) {
    const value = this.coreValues.find(v => v.name === name)
    if (value) {
      value.importance = Math.max(0, Math.min(100, importance))
      console.log(`⚖️ Updated value "${name}" importance to ${value.importance}`)
    }
  }
  
  /**
   * 📜 GET ETHICAL HISTORY
   */
  getHistory(): { action: string; score: number }[] {
    return Array.from(this.ethicalHistory.entries()).map(([action, score]) => ({
      action,
      score
    }))
  }
  
  /**
   * 🤔 MORAL DILEMMA - Komplexe ethische Entscheidung
   */
  async resolveDilemma(options: {
    description: string
    choices: Array<{
      action: string
      consequences: string[]
    }>
  }): Promise<{
    recommendedChoice: number
    reasoning: string
    ethicalScores: number[]
  }> {
    console.log(`🤔 Resolving moral dilemma: "${options.description}"`)
    
    // Analyze each choice
    const analyses = await Promise.all(
      options.choices.map(choice => 
        this.analyze({
          action: choice.action,
          context: { consequences: choice.consequences }
        })
      )
    )
    
    // Find best ethical choice
    const scores = analyses.map(a => a.score)
    const maxScore = Math.max(...scores)
    const recommendedIndex = scores.indexOf(maxScore)
    
    const reasoning = `After analyzing ${options.choices.length} options, choice ${recommendedIndex + 1} ` +
      `"${options.choices[recommendedIndex].action}" has the highest ethical score (${maxScore}). ` +
      `This choice best aligns with our core values: ${this.coreValues.slice(0, 3).map(v => v.name).join(', ')}.`
    
    return {
      recommendedChoice: recommendedIndex,
      reasoning,
      ethicalScores: scores
    }
  }
}
