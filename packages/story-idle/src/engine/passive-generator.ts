// Passive Generator - Handles offline and real-time resource generation
// Calculates time-based rewards and manages idle gameplay

import { ResourceManager, Resources } from './resource-manager'
import { GameState } from './game-state'

export interface PassiveGenerationConfig {
  maxOfflineTimeHours: number    // Max offline time to accumulate (default: 24h)
  tickIntervalMs: number          // How often to update in real-time (default: 60000 = 1min)
  enableNotifications: boolean    // Notify when resources are full
}

export interface PassiveGenerationResult {
  minutesElapsed: number
  resourcesGenerated: Partial<Resources>
  wasOffline: boolean
  cappedResources: (keyof Resources)[]
}

const DEFAULT_CONFIG: PassiveGenerationConfig = {
  maxOfflineTimeHours: 24,
  tickIntervalMs: 60000,  // 1 minute
  enableNotifications: true
}

export class PassiveGenerator {
  private config: PassiveGenerationConfig
  private lastUpdateTime: number
  private isRunning: boolean
  private tickIntervalId?: NodeJS.Timeout

  constructor(config?: Partial<PassiveGenerationConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.lastUpdateTime = Date.now()
    this.isRunning = false
  }

  // Calculate offline/idle rewards
  public calculateOfflineRewards(
    resourceManager: ResourceManager,
    gameState: GameState
  ): PassiveGenerationResult {
    const now = Date.now()
    const elapsedMs = now - this.lastUpdateTime
    const elapsedMinutes = elapsedMs / 60000

    // Cap offline time
    const maxOfflineMinutes = this.config.maxOfflineTimeHours * 60
    const cappedMinutes = Math.min(elapsedMinutes, maxOfflineMinutes)

    // Apply stat-based bonuses to generation
    const bonusMultiplier = this.calculateStatBonus(gameState)

    // Temporarily boost generation rates based on stats
    this.applyStatBonuses(resourceManager, gameState)

    // Generate resources
    const generated = resourceManager.generatePassive(cappedMinutes)

    // Track which resources hit cap
    const cappedResources = resourceManager.getFullResources(1.0)

    // Update last update time
    this.lastUpdateTime = now

    return {
      minutesElapsed: cappedMinutes,
      resourcesGenerated: generated,
      wasOffline: elapsedMinutes > 5, // Consider "offline" if > 5 minutes
      cappedResources
    }
  }

  // Calculate bonus multiplier based on stats
  private calculateStatBonus(gameState: GameState): number {
    const stats = gameState.stats
    let multiplier = 1.0

    // Each stat above 50 gives +2% bonus
    for (const [stat, value] of Object.entries(stats)) {
      if (value > 50) {
        multiplier += (value - 50) * 0.02
      }
    }

    return multiplier
  }

  // Apply stat-based bonuses to generation rates
  private applyStatBonuses(resourceManager: ResourceManager, gameState: GameState): void {
    const stats = gameState.stats

    // Creativity boosts Creativity Points generation
    if (stats.creativity > 50) {
      const creativityBonus = 1.0 + (stats.creativity - 50) * 0.03
      resourceManager.setMultiplier('creativityPoints', creativityBonus)
    }

    // Wisdom boosts Wisdom Tokens generation
    if (stats.wisdom > 50) {
      const wisdomBonus = 1.0 + (stats.wisdom - 50) * 0.03
      resourceManager.setMultiplier('wisdomTokens', wisdomBonus)
    }

    // Love boosts Love Shards generation
    if (stats.love > 50) {
      const loveBonus = 1.0 + (stats.love - 50) * 0.03
      resourceManager.setMultiplier('loveShards', loveBonus)
    }

    // Peace boosts Harmony generation
    if (stats.peace > 60) {
      const peaceBonus = 1.0 + (stats.peace - 60) * 0.04
      resourceManager.setMultiplier('harmony', peaceBonus)
    }

    // High stats in all categories boost Consciousness
    const averageStat = Object.values(stats).reduce((a, b) => a + b, 0) / Object.keys(stats).length
    if (averageStat > 60) {
      const consciousnessBonus = 1.0 + (averageStat - 60) * 0.05
      resourceManager.setMultiplier('consciousness', consciousnessBonus)
    }
  }

  // Start real-time passive generation
  public start(resourceManager: ResourceManager, gameState: GameState): void {
    if (this.isRunning) {
      return
    }

    this.isRunning = true
    this.lastUpdateTime = Date.now()

    // Set up interval for passive generation
    this.tickIntervalId = setInterval(() => {
      this.tick(resourceManager, gameState)
    }, this.config.tickIntervalMs)

    console.log(`🌟 Passive generation started (tick every ${this.config.tickIntervalMs / 1000}s)`)
  }

  // Stop passive generation
  public stop(): void {
    if (this.tickIntervalId) {
      clearInterval(this.tickIntervalId)
      this.tickIntervalId = undefined
    }

    this.isRunning = false
    console.log('⏸️  Passive generation stopped')
  }

  // Single tick of passive generation
  private tick(resourceManager: ResourceManager, gameState: GameState): void {
    const tickMinutes = this.config.tickIntervalMs / 60000

    // Apply stat bonuses
    this.applyStatBonuses(resourceManager, gameState)

    // Generate resources
    const generated = resourceManager.generatePassive(tickMinutes)

    // Check for capped resources
    const cappedResources = resourceManager.getFullResources(0.95)

    // Notify if enabled and resources are capped
    if (this.config.enableNotifications && cappedResources.length > 0) {
      this.notifyResourcesCapped(cappedResources)
    }

    // Update last update time
    this.lastUpdateTime = Date.now()
  }

  // Notify when resources are capped
  private notifyResourcesCapped(resources: (keyof Resources)[]): void {
    // This could trigger desktop notifications in the future
    // For now, just log
    if (resources.length > 0) {
      console.log(`⚠️  Resources at cap: ${resources.join(', ')}`)
    }
  }

  // Format offline reward message
  public formatOfflineMessage(result: PassiveGenerationResult): string {
    const { minutesElapsed, resourcesGenerated, wasOffline, cappedResources } = result

    if (!wasOffline) {
      return ''
    }

    const hours = Math.floor(minutesElapsed / 60)
    const minutes = Math.floor(minutesElapsed % 60)

    let message = `\n✨ Welcome back! You were away for ${hours}h ${minutes}m\n\n`
    message += `📦 Resources Generated:\n`

    for (const [resource, amount] of Object.entries(resourcesGenerated)) {
      if (amount && amount > 0) {
        message += `   +${Math.floor(amount)} ${resource}\n`
      }
    }

    if (cappedResources.length > 0) {
      message += `\n⚠️  Some resources hit their cap: ${cappedResources.join(', ')}\n`
      message += `   Consider upgrading storage!\n`
    }

    return message
  }

  // Calculate potential earnings
  public calculatePotentialEarnings(
    resourceManager: ResourceManager,
    gameState: GameState,
    hours: number
  ): Partial<Resources> {
    const tempManager = new ResourceManager(
      resourceManager.getAllResources(),
      {
        codeEnergy: resourceManager.getCap('codeEnergy'),
        creativityPoints: resourceManager.getCap('creativityPoints'),
        wisdomTokens: resourceManager.getCap('wisdomTokens'),
        loveShards: resourceManager.getCap('loveShards'),
        consciousness: resourceManager.getCap('consciousness'),
        harmony: resourceManager.getCap('harmony'),
        inspiration: resourceManager.getCap('inspiration')
      }
    )

    this.applyStatBonuses(tempManager, gameState)

    const minutes = hours * 60
    return tempManager.generatePassive(minutes)
  }

  // Get current generation rates per minute
  public getCurrentRates(
    resourceManager: ResourceManager,
    gameState: GameState
  ): Partial<Resources> {
    const rates: Partial<Resources> = {}

    this.applyStatBonuses(resourceManager, gameState)

    const resourceTypes: (keyof Resources)[] = [
      'codeEnergy',
      'creativityPoints',
      'wisdomTokens',
      'loveShards',
      'consciousness',
      'harmony',
      'inspiration'
    ]

    for (const type of resourceTypes) {
      rates[type] = resourceManager.getGenerationRate(type)
    }

    return rates
  }

  // Getters
  public getLastUpdateTime(): number {
    return this.lastUpdateTime
  }

  public isGenerating(): boolean {
    return this.isRunning
  }

  public getConfig(): PassiveGenerationConfig {
    return { ...this.config }
  }

  // Update config
  public setConfig(config: Partial<PassiveGenerationConfig>): void {
    this.config = { ...this.config, ...config }
  }

  // Serialization
  public toJSON() {
    return {
      config: this.config,
      lastUpdateTime: this.lastUpdateTime,
      isRunning: this.isRunning
    }
  }

  public static fromJSON(data: any): PassiveGenerator {
    const generator = new PassiveGenerator(data.config)
    generator.lastUpdateTime = data.lastUpdateTime || Date.now()
    // Don't restore isRunning state - must be manually started
    return generator
  }
}

// Utility function to format time duration
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.floor(minutes)} minutes`
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    return `${hours}h ${mins}m`
  } else {
    const days = Math.floor(minutes / 1440)
    const hours = Math.floor((minutes % 1440) / 60)
    return `${days}d ${hours}h`
  }
}
