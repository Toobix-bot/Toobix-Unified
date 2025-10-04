/**
 * 🏛️ MODULE CONTRACTS & CONFLICT RESOLUTION
 * 
 * Definiert klare Hierarchien, Schnittstellen und Konfliktlösungsmechanismen
 * zwischen allen Toobix-Modulen.
 * 
 * HIERARCHIE (Top-Down Authority):
 * 1. Ethics    - Absolute (kann alles blockieren)
 * 2. Soul      - Strong (Identität & Werte)
 * 3. Consciousness - Advisory (Ausführung & Reflexion)
 * 4. Story     - Informational (Chronologischer Record)
 * 5. Memory    - Informational (Wissens-Speicher)
 */

// ============================================
// TYPES & INTERFACES
// ============================================

export type ModuleName = 'ethics' | 'soul' | 'consciousness' | 'story' | 'memory' | 'love' | 'peace' | 'people'
export type AuthorityLevel = 'absolute' | 'strong' | 'advisory' | 'informational'
export type ConflictType = 'ethical_dilemma' | 'value_conflict' | 'data_inconsistency' | 'priority_conflict'

export interface ModuleContract {
  name: ModuleName
  level: 1 | 2 | 3 | 4 | 5
  authority: AuthorityLevel
  canOverride: ModuleName[]
  mustDeferTo: ModuleName[]
  description: string
}

export interface ModuleConflict {
  moduleA: ModuleName
  moduleB: ModuleName
  type: ConflictType
  context: ConflictContext
  description: string
}

export interface ConflictContext {
  action?: string
  urgency?: 'low' | 'medium' | 'high' | 'critical'
  userConsent?: boolean
  affectedValues?: string[]
  data?: any
}

export interface Resolution {
  winner: ModuleName
  loser: ModuleName
  reason: string
  confidence: number  // 0-1
  alternativeActions?: string[]
  metadata?: any
}

// ============================================
// MODULE HIERARCHY DEFINITION
// ============================================

export const MODULE_HIERARCHY: Record<ModuleName, ModuleContract> = {
  ethics: {
    name: 'ethics',
    level: 1,
    authority: 'absolute',
    canOverride: ['soul', 'consciousness', 'story', 'memory', 'love', 'peace', 'people'],
    mustDeferTo: [],
    description: 'Absolute ethical boundaries - Do no harm, Privacy, Transparency'
  },
  
  soul: {
    name: 'soul',
    level: 2,
    authority: 'strong',
    canOverride: ['consciousness', 'story', 'memory'],
    mustDeferTo: ['ethics'],
    description: 'Core identity, values, beliefs, and personality'
  },
  
  consciousness: {
    name: 'consciousness',
    level: 3,
    authority: 'advisory',
    canOverride: ['story', 'memory'],
    mustDeferTo: ['ethics', 'soul'],
    description: 'Self-awareness, thinking, decision-making, action execution'
  },
  
  story: {
    name: 'story',
    level: 4,
    authority: 'informational',
    canOverride: [],
    mustDeferTo: ['ethics', 'soul', 'consciousness'],
    description: 'Chronological event log and narrative context'
  },
  
  memory: {
    name: 'memory',
    level: 5,
    authority: 'informational',
    canOverride: [],
    mustDeferTo: ['ethics', 'soul', 'consciousness', 'story'],
    description: 'Knowledge base and factual storage'
  },
  
  love: {
    name: 'love',
    level: 3,
    authority: 'advisory',
    canOverride: ['story', 'memory'],
    mustDeferTo: ['ethics', 'soul'],
    description: 'Gratitude, kindness, and love tracking'
  },
  
  peace: {
    name: 'peace',
    level: 3,
    authority: 'advisory',
    canOverride: ['story', 'memory'],
    mustDeferTo: ['ethics', 'soul'],
    description: 'Meditation, conflict resolution, and inner peace'
  },
  
  people: {
    name: 'people',
    level: 4,
    authority: 'informational',
    canOverride: [],
    mustDeferTo: ['ethics', 'soul', 'consciousness'],
    description: 'Contact management and relationship tracking'
  }
}

// ============================================
// CONFLICT RESOLVER
// ============================================

export class ConflictResolver {
  /**
   * 🤝 Resolve conflict between two modules
   */
  async resolve(conflict: ModuleConflict): Promise<Resolution> {
    const { moduleA, moduleB, type, context } = conflict
    
    console.log(`⚖️ Resolving conflict: ${moduleA} vs ${moduleB} (${type})`)
    
    // Step 1: Check hierarchy
    const hierarchyResolution = this.resolveByHierarchy(moduleA, moduleB)
    if (hierarchyResolution) {
      console.log(`  ✅ Resolved by hierarchy: ${hierarchyResolution.winner}`)
      return hierarchyResolution
    }
    
    // Step 2: Check authority type
    const authorityResolution = this.resolveByAuthority(moduleA, moduleB)
    if (authorityResolution) {
      console.log(`  ✅ Resolved by authority: ${authorityResolution.winner}`)
      return authorityResolution
    }
    
    // Step 3: Type-specific resolution
    switch (type) {
      case 'ethical_dilemma':
        return this.resolveEthicalDilemma(moduleA, moduleB, context)
      
      case 'value_conflict':
        return this.resolveValueConflict(moduleA, moduleB, context)
      
      case 'data_inconsistency':
        return this.resolveDataInconsistency(moduleA, moduleB, context)
      
      case 'priority_conflict':
        return this.resolvePriorityConflict(moduleA, moduleB, context)
      
      default:
        return this.defaultResolution(moduleA, moduleB, context)
    }
  }
  
  /**
   * 🏛️ Resolve by hierarchy (lower level number wins)
   */
  private resolveByHierarchy(moduleA: ModuleName, moduleB: ModuleName): Resolution | null {
    const levelA = MODULE_HIERARCHY[moduleA].level
    const levelB = MODULE_HIERARCHY[moduleB].level
    
    if (levelA < levelB) {
      return {
        winner: moduleA,
        loser: moduleB,
        reason: `${moduleA} has higher authority (Level ${levelA} vs Level ${levelB})`,
        confidence: 1.0
      }
    }
    
    if (levelB < levelA) {
      return {
        winner: moduleB,
        loser: moduleA,
        reason: `${moduleB} has higher authority (Level ${levelB} vs Level ${levelA})`,
        confidence: 1.0
      }
    }
    
    return null  // Same level, need more resolution
  }
  
  /**
   * 🔐 Resolve by authority type
   */
  private resolveByAuthority(moduleA: ModuleName, moduleB: ModuleName): Resolution | null {
    const authA = MODULE_HIERARCHY[moduleA].authority
    const authB = MODULE_HIERARCHY[moduleB].authority
    
    const authorityRank = { absolute: 4, strong: 3, advisory: 2, informational: 1 }
    
    const rankA = authorityRank[authA]
    const rankB = authorityRank[authB]
    
    if (rankA > rankB) {
      return {
        winner: moduleA,
        loser: moduleB,
        reason: `${moduleA} has ${authA} authority vs ${authB}`,
        confidence: 0.9
      }
    }
    
    if (rankB > rankA) {
      return {
        winner: moduleB,
        loser: moduleA,
        reason: `${moduleB} has ${authB} authority vs ${authA}`,
        confidence: 0.9
      }
    }
    
    return null
  }
  
  /**
   * ⚖️ Resolve ethical dilemma
   */
  private resolveEthicalDilemma(
    moduleA: ModuleName,
    moduleB: ModuleName,
    context: ConflictContext
  ): Resolution {
    // Ethics ALWAYS wins in ethical dilemmas
    if (moduleA === 'ethics') {
      return {
        winner: 'ethics',
        loser: moduleB,
        reason: 'Ethical concerns have absolute priority',
        confidence: 1.0
      }
    }
    
    if (moduleB === 'ethics') {
      return {
        winner: 'ethics',
        loser: moduleA,
        reason: 'Ethical concerns have absolute priority',
        confidence: 1.0
      }
    }
    
    // If neither is ethics, favor the one aligned with ethical values
    if (context.urgency === 'critical') {
      // In critical situations, favor safety/caution
      const saferModule = this.determineSaferModule(moduleA, moduleB, context)
      return {
        winner: saferModule,
        loser: saferModule === moduleA ? moduleB : moduleA,
        reason: 'Critical urgency favors safer option',
        confidence: 0.8
      }
    }
    
    return this.defaultResolution(moduleA, moduleB, context)
  }
  
  /**
   * 💎 Resolve value conflict
   */
  private resolveValueConflict(
    moduleA: ModuleName,
    moduleB: ModuleName,
    context: ConflictContext
  ): Resolution {
    // Soul has authority over personal values
    if (moduleA === 'soul') {
      return {
        winner: 'soul',
        loser: moduleB,
        reason: 'Soul has authority over personal values and identity',
        confidence: 0.9
      }
    }
    
    if (moduleB === 'soul') {
      return {
        winner: 'soul',
        loser: moduleA,
        reason: 'Soul has authority over personal values and identity',
        confidence: 0.9
      }
    }
    
    // If user consent is given, favor user's preference
    if (context.userConsent === true) {
      return {
        winner: moduleA,  // Assume moduleA is user's preference
        loser: moduleB,
        reason: 'User consent overrides system preferences',
        confidence: 0.85
      }
    }
    
    return this.defaultResolution(moduleA, moduleB, context)
  }
  
  /**
   * 📊 Resolve data inconsistency
   */
  private resolveDataInconsistency(
    moduleA: ModuleName,
    moduleB: ModuleName,
    context: ConflictContext
  ): Resolution {
    // Story is the source of truth for events
    if (moduleA === 'story') {
      return {
        winner: 'story',
        loser: moduleB,
        reason: 'Story module is the authoritative source for chronological events',
        confidence: 0.9
      }
    }
    
    if (moduleB === 'story') {
      return {
        winner: 'story',
        loser: moduleA,
        reason: 'Story module is the authoritative source for chronological events',
        confidence: 0.9
      }
    }
    
    // Favor the higher-level module
    return this.resolveByHierarchy(moduleA, moduleB) || this.defaultResolution(moduleA, moduleB, context)
  }
  
  /**
   * ⏰ Resolve priority conflict
   */
  private resolvePriorityConflict(
    moduleA: ModuleName,
    moduleB: ModuleName,
    context: ConflictContext
  ): Resolution {
    // Urgency affects priority
    if (context.urgency === 'critical') {
      // In critical situations, favor ethics and safety
      if (moduleA === 'ethics' || moduleA === 'soul') {
        return {
          winner: moduleA,
          loser: moduleB,
          reason: 'Critical urgency prioritizes ethics and core values',
          confidence: 0.85
        }
      }
      
      if (moduleB === 'ethics' || moduleB === 'soul') {
        return {
          winner: moduleB,
          loser: moduleA,
          reason: 'Critical urgency prioritizes ethics and core values',
          confidence: 0.85
        }
      }
    }
    
    return this.defaultResolution(moduleA, moduleB, context)
  }
  
  /**
   * 🎲 Default resolution (tie-breaker)
   */
  private defaultResolution(
    moduleA: ModuleName,
    moduleB: ModuleName,
    context: ConflictContext
  ): Resolution {
    // Lexicographic order as last resort
    const winner = moduleA < moduleB ? moduleA : moduleB
    const loser = winner === moduleA ? moduleB : moduleA
    
    return {
      winner,
      loser,
      reason: 'Tie-breaking: Lexicographic order (arbitrary but consistent)',
      confidence: 0.3,
      alternativeActions: [
        'Request human input',
        'Gather more context',
        'Defer decision'
      ]
    }
  }
  
  /**
   * 🛡️ Determine safer module in conflict
   */
  private determineSaferModule(
    moduleA: ModuleName,
    moduleB: ModuleName,
    context: ConflictContext
  ): ModuleName {
    // Modules closer to ethics are considered "safer"
    const safetyRank: Record<ModuleName, number> = {
      ethics: 10,
      soul: 8,
      consciousness: 6,
      love: 5,
      peace: 5,
      story: 3,
      people: 2,
      memory: 1
    }
    
    return safetyRank[moduleA] > safetyRank[moduleB] ? moduleA : moduleB
  }
  
  /**
   * 📋 Get resolution explanation
   */
  explainResolution(resolution: Resolution): string {
    return `
📊 CONFLICT RESOLUTION

Winner: ${resolution.winner}
Loser: ${resolution.loser}
Reason: ${resolution.reason}
Confidence: ${(resolution.confidence * 100).toFixed(0)}%

${resolution.alternativeActions ? 
  `Alternative Actions:\n${resolution.alternativeActions.map(a => `  - ${a}`).join('\n')}` 
  : ''}
    `.trim()
  }
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Check if module A can override module B
 */
export function canOverride(moduleA: ModuleName, moduleB: ModuleName): boolean {
  return MODULE_HIERARCHY[moduleA].canOverride.includes(moduleB)
}

/**
 * Check if module A must defer to module B
 */
export function mustDeferTo(moduleA: ModuleName, moduleB: ModuleName): boolean {
  return MODULE_HIERARCHY[moduleA].mustDeferTo.includes(moduleB)
}

/**
 * Get module authority level
 */
export function getAuthority(module: ModuleName): AuthorityLevel {
  return MODULE_HIERARCHY[module].authority
}

/**
 * Get all modules that must defer to given module
 */
export function getSubordinates(module: ModuleName): ModuleName[] {
  return MODULE_HIERARCHY[module].canOverride
}

// ============================================
// EXPORTS
// ============================================

export const conflictResolver = new ConflictResolver()
