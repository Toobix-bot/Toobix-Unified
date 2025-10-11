// Resource Manager - Handles all game resources
// Manages currencies, caps, and resource operations

export interface Resources {
  // Primary Currencies
  codeEnergy: number        // Generated passively, spent on buildings
  creativityPoints: number  // From commits & features
  wisdomTokens: number      // From docs & learning
  loveShards: number        // From kind actions & gratitude

  // Advanced Resources (unlocked later)
  consciousness: number     // High-tier resource
  harmony: number          // Balance between all stats
  inspiration: number      // Rare resource from special events
}

export interface ResourceCaps {
  codeEnergy: number
  creativityPoints: number
  wisdomTokens: number
  loveShards: number
  consciousness: number
  harmony: number
  inspiration: number
}

export interface ResourceGenerationRates {
  codeEnergy: number        // Per minute
  creativityPoints: number  // Per minute
  wisdomTokens: number      // Per minute
  loveShards: number        // Per minute
  consciousness: number     // Per hour
  harmony: number          // Per hour
  inspiration: number      // Per day
}

export const DEFAULT_RESOURCES: Resources = {
  codeEnergy: 100,          // Start with some energy
  creativityPoints: 0,
  wisdomTokens: 0,
  loveShards: 0,
  consciousness: 0,
  harmony: 0,
  inspiration: 0
}

export const DEFAULT_CAPS: ResourceCaps = {
  codeEnergy: 1000,
  creativityPoints: 500,
  wisdomTokens: 500,
  loveShards: 500,
  consciousness: 100,
  harmony: 100,
  inspiration: 50
}

export const BASE_GENERATION_RATES: ResourceGenerationRates = {
  codeEnergy: 1.0,          // 1 per minute base
  creativityPoints: 0.1,    // Slow passive gain
  wisdomTokens: 0.1,
  loveShards: 0.05,
  consciousness: 0.1,       // Very slow
  harmony: 0.05,
  inspiration: 0.01         // Very rare
}

export class ResourceManager {
  private resources: Resources
  private caps: ResourceCaps
  private generationRates: ResourceGenerationRates
  private multipliers: Partial<Record<keyof Resources, number>>

  constructor(
    initialResources?: Partial<Resources>,
    initialCaps?: Partial<ResourceCaps>
  ) {
    this.resources = { ...DEFAULT_RESOURCES, ...initialResources }
    this.caps = { ...DEFAULT_CAPS, ...initialCaps }
    this.generationRates = { ...BASE_GENERATION_RATES }
    this.multipliers = {}
  }

  // Getters
  public getResource(type: keyof Resources): number {
    return this.resources[type]
  }

  public getAllResources(): Resources {
    return { ...this.resources }
  }

  public getCap(type: keyof Resources): number {
    return this.caps[type]
  }

  public getGenerationRate(type: keyof Resources): number {
    const base = this.generationRates[type]
    const multiplier = this.multipliers[type] || 1.0
    return base * multiplier
  }

  // Resource Operations
  public addResource(type: keyof Resources, amount: number): number {
    const current = this.resources[type]
    const cap = this.caps[type]
    const newAmount = Math.min(current + amount, cap)
    const actualAdded = newAmount - current

    this.resources[type] = newAmount
    return actualAdded
  }

  public spendResource(type: keyof Resources, amount: number): boolean {
    if (this.resources[type] >= amount) {
      this.resources[type] -= amount
      return true
    }
    return false
  }

  public hasResource(type: keyof Resources, amount: number): boolean {
    return this.resources[type] >= amount
  }

  // Multiple resources
  public spendResources(costs: Partial<Resources>): boolean {
    // Check if we have enough of everything
    for (const [type, amount] of Object.entries(costs)) {
      if (!this.hasResource(type as keyof Resources, amount as number)) {
        return false
      }
    }

    // Spend all
    for (const [type, amount] of Object.entries(costs)) {
      this.spendResource(type as keyof Resources, amount as number)
    }

    return true
  }

  // Caps
  public increaseCap(type: keyof Resources, amount: number): void {
    this.caps[type] += amount
  }

  public setCap(type: keyof Resources, value: number): void {
    this.caps[type] = value
  }

  // Generation Rates
  public increaseGenerationRate(type: keyof Resources, amount: number): void {
    this.generationRates[type] += amount
  }

  public setGenerationRate(type: keyof Resources, value: number): void {
    this.generationRates[type] = value
  }

  // Multipliers
  public setMultiplier(type: keyof Resources, multiplier: number): void {
    this.multipliers[type] = multiplier
  }

  public getMultiplier(type: keyof Resources): number {
    return this.multipliers[type] || 1.0
  }

  // Passive Generation
  public generatePassive(elapsedMinutes: number): { [key in keyof Resources]?: number } {
    const generated: Partial<Resources> = {}

    for (const type of Object.keys(this.generationRates) as (keyof Resources)[]) {
      const rate = this.getGenerationRate(type)
      const amount = rate * elapsedMinutes

      if (amount > 0) {
        const actualAdded = this.addResource(type, amount)
        if (actualAdded > 0) {
          generated[type] = actualAdded
        }
      }
    }

    return generated
  }

  // Check if at cap
  public isAtCap(type: keyof Resources): boolean {
    return this.resources[type] >= this.caps[type]
  }

  public getPercentage(type: keyof Resources): number {
    return (this.resources[type] / this.caps[type]) * 100
  }

  // Serialization
  public toJSON() {
    return {
      resources: this.resources,
      caps: this.caps,
      generationRates: this.generationRates,
      multipliers: this.multipliers
    }
  }

  public static fromJSON(data: any): ResourceManager {
    const manager = new ResourceManager(data.resources, data.caps)
    manager.generationRates = { ...BASE_GENERATION_RATES, ...data.generationRates }
    manager.multipliers = data.multipliers || {}
    return manager
  }

  // Utility
  public format(type: keyof Resources, includeRate: boolean = false): string {
    const amount = Math.floor(this.resources[type])
    const cap = this.caps[type]
    const percentage = Math.floor(this.getPercentage(type))

    let result = `${amount}/${cap} (${percentage}%)`

    if (includeRate) {
      const rate = this.getGenerationRate(type)
      if (rate > 0) {
        result += ` +${rate.toFixed(2)}/min`
      }
    }

    return result
  }

  // Get all resources that are at or near cap
  public getFullResources(threshold: number = 0.9): (keyof Resources)[] {
    const full: (keyof Resources)[] = []

    for (const type of Object.keys(this.resources) as (keyof Resources)[]) {
      if (this.getPercentage(type) >= threshold * 100) {
        full.push(type)
      }
    }

    return full
  }
}

// Resource Icons/Symbols
export const RESOURCE_SYMBOLS = {
  codeEnergy: '⚡',
  creativityPoints: '🎨',
  wisdomTokens: '📚',
  loveShards: '💝',
  consciousness: '🧠',
  harmony: '☯️',
  inspiration: '✨'
} as const

// Resource Colors (ANSI)
export const RESOURCE_COLORS = {
  codeEnergy: '\x1b[38;5;226m',      // Yellow
  creativityPoints: '\x1b[38;5;213m', // Pink
  wisdomTokens: '\x1b[38;5;33m',     // Blue
  loveShards: '\x1b[38;5;211m',      // Light pink
  consciousness: '\x1b[38;5;141m',    // Purple
  harmony: '\x1b[38;5;120m',         // Green
  inspiration: '\x1b[38;5;228m'      // Bright yellow
} as const

// Format resource with color and symbol
export function formatResourceDisplay(
  type: keyof Resources,
  amount: number,
  showSymbol: boolean = true
): string {
  const color = RESOURCE_COLORS[type]
  const symbol = RESOURCE_SYMBOLS[type]
  const reset = '\x1b[0m'

  const displayAmount = Math.floor(amount)

  if (showSymbol) {
    return `${color}${symbol} ${displayAmount}${reset}`
  } else {
    return `${color}${displayAmount}${reset}`
  }
}
