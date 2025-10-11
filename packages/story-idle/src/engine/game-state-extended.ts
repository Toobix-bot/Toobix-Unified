// Story-Idle Game State Management - Extended with Resources
// This extends the original game-state.ts with resource management

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { Resources, ResourceManager, DEFAULT_RESOURCES, DEFAULT_CAPS } from './resource-manager'
import { PassiveGenerator } from './passive-generator'

export interface ExtendedGameState {
  // Player Progress
  player: {
    name: string
    level: number
    xp: number
    xpToNextLevel: number
    totalXp: number
  }

  // Stats
  stats: {
    love: number        // Kindness, Gratitude, Relationships
    peace: number       // Harmony, Clarity, Balance
    wisdom: number      // Learning, Documentation, Understanding
    creativity: number  // Features, Innovation, Art
    stability: number   // Tests, Reliability, Structure
  }

  // Resources
  resources: {
    current: Resources
    caps: Partial<Resources>
    generationRates: Partial<Resources>
    multipliers: Partial<Record<keyof Resources, number>>
  }

  // Characters & Relationships
  characters: {
    [key: string]: {
      name: string
      relationship: number  // 0-100
      level: number
      lastInteraction?: string
      personality: string
    }
  }

  // Story Progress
  story: {
    currentChapter: number
    currentQuest?: string
    completedQuests: string[]
    storyFlags: { [key: string]: boolean }
    unlockedPaths: string[]
  }

  // Achievements
  achievements: {
    unlocked: string[]
    progress: { [key: string]: number }
  }

  // Session
  session: {
    startTime: string
    lastPlayedTime: string
    totalPlayTimeMinutes: number
    commits: number
    filesChanged: number
  }

  // Passive Generation
  passiveGeneration: {
    lastUpdateTime: number
    maxOfflineTimeHours: number
  }
}

const DEFAULT_EXTENDED_STATE: ExtendedGameState = {
  player: {
    name: 'Creator',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalXp: 0
  },
  stats: {
    love: 10,
    peace: 10,
    wisdom: 10,
    creativity: 10,
    stability: 10
  },
  resources: {
    current: { ...DEFAULT_RESOURCES },
    caps: { ...DEFAULT_CAPS },
    generationRates: {},
    multipliers: {}
  },
  characters: {
    luna: {
      name: 'Luna',
      relationship: 25,
      level: 1,
      personality: 'wise-mentor',
      lastInteraction: undefined
    }
  },
  story: {
    currentChapter: 1,
    currentQuest: 'the-great-optimization',
    completedQuests: [],
    storyFlags: {
      'met-luna': true,
      'documentation-cleanup': true
    },
    unlockedPaths: ['scholar']
  },
  achievements: {
    unlocked: ['first-step'],
    progress: {}
  },
  session: {
    startTime: new Date().toISOString(),
    lastPlayedTime: new Date().toISOString(),
    totalPlayTimeMinutes: 0,
    commits: 0,
    filesChanged: 0
  },
  passiveGeneration: {
    lastUpdateTime: Date.now(),
    maxOfflineTimeHours: 24
  }
}

export class ExtendedGameStateManager {
  private statePath: string
  private state: ExtendedGameState
  private resourceManager: ResourceManager
  private passiveGenerator: PassiveGenerator

  constructor(dataPath: string = './data') {
    this.statePath = join(dataPath, 'story-idle-state-extended.json')
    this.state = this.loadState()

    // Initialize resource manager
    this.resourceManager = new ResourceManager(
      this.state.resources.current,
      this.state.resources.caps as any
    )

    // Initialize passive generator
    this.passiveGenerator = new PassiveGenerator({
      maxOfflineTimeHours: this.state.passiveGeneration.maxOfflineTimeHours
    })

    // Calculate offline rewards if any
    this.processOfflineRewards()
  }

  private loadState(): ExtendedGameState {
    if (existsSync(this.statePath)) {
      try {
        const data = readFileSync(this.statePath, 'utf-8')
        return { ...DEFAULT_EXTENDED_STATE, ...JSON.parse(data) }
      } catch (error) {
        console.warn('Could not load extended game state, using default')
        return DEFAULT_EXTENDED_STATE
      }
    }
    return DEFAULT_EXTENDED_STATE
  }

  public saveState(): void {
    try {
      // Sync resources before saving
      this.syncResourcesToState()
      writeFileSync(this.statePath, JSON.stringify(this.state, null, 2))
    } catch (error) {
      console.error('Failed to save game state:', error)
    }
  }

  // Getters
  public getState(): ExtendedGameState {
    return this.state
  }

  public getPlayer() {
    return this.state.player
  }

  public getStats() {
    return this.state.stats
  }

  public getCharacter(id: string) {
    return this.state.characters[id]
  }

  public getResourceManager(): ResourceManager {
    return this.resourceManager
  }

  public getPassiveGenerator(): PassiveGenerator {
    return this.passiveGenerator
  }

  // XP & Leveling
  public addXP(amount: number, reason?: string): { leveledUp: boolean; newLevel?: number } {
    this.state.player.xp += amount
    this.state.player.totalXp += amount

    let leveledUp = false
    let newLevel: number | undefined

    while (this.state.player.xp >= this.state.player.xpToNextLevel) {
      this.state.player.xp -= this.state.player.xpToNextLevel
      this.state.player.level++
      this.state.player.xpToNextLevel = Math.floor(this.state.player.xpToNextLevel * 1.5)
      leveledUp = true
      newLevel = this.state.player.level
    }

    this.saveState()
    return { leveledUp, newLevel }
  }

  // Stats
  public addStat(stat: keyof ExtendedGameState['stats'], amount: number): void {
    this.state.stats[stat] = Math.min(100, this.state.stats[stat] + amount)
    this.saveState()
  }

  // Characters
  public improveRelationship(characterId: string, amount: number): void {
    if (this.state.characters[characterId]) {
      this.state.characters[characterId].relationship = Math.min(
        100,
        this.state.characters[characterId].relationship + amount
      )
      this.state.characters[characterId].lastInteraction = new Date().toISOString()
      this.saveState()
    }
  }

  public addCharacter(id: string, data: ExtendedGameState['characters'][string]): void {
    this.state.characters[id] = data
    this.saveState()
  }

  // Quests
  public completeQuest(questId: string): void {
    if (!this.state.story.completedQuests.includes(questId)) {
      this.state.story.completedQuests.push(questId)
      this.state.story.currentQuest = undefined
      this.saveState()
    }
  }

  public setQuest(questId: string): void {
    this.state.story.currentQuest = questId
    this.saveState()
  }

  // Achievements
  public unlockAchievement(achievementId: string): boolean {
    if (!this.state.achievements.unlocked.includes(achievementId)) {
      this.state.achievements.unlocked.push(achievementId)
      this.saveState()
      return true
    }
    return false
  }

  // Session
  public incrementCommits(): void {
    this.state.session.commits++
    this.state.session.lastPlayedTime = new Date().toISOString()
    this.saveState()
  }

  public addPlayTime(minutes: number): void {
    this.state.session.totalPlayTimeMinutes += minutes
    this.saveState()
  }

  // Story Flags
  public setFlag(flag: string, value: boolean = true): void {
    this.state.story.storyFlags[flag] = value
    this.saveState()
  }

  public hasFlag(flag: string): boolean {
    return this.state.story.storyFlags[flag] || false
  }

  // ========== Resource Management ==========

  // Process offline rewards when game loads
  private processOfflineRewards(): void {
    const result = this.passiveGenerator.calculateOfflineRewards(
      this.resourceManager,
      this.state
    )

    // Update state with new resources
    this.syncResourcesToState()

    // Show offline message if player was away
    if (result.wasOffline) {
      const message = this.passiveGenerator.formatOfflineMessage(result)
      if (message) {
        console.log(message)
      }
    }

    // Update last update time
    this.state.passiveGeneration.lastUpdateTime = Date.now()
    this.saveState()
  }

  // Start passive generation (call when game is running)
  public startPassiveGeneration(): void {
    this.passiveGenerator.start(this.resourceManager, this.state)
    console.log('⚡ Passive resource generation started!')
  }

  // Stop passive generation (call when game closes)
  public stopPassiveGeneration(): void {
    this.passiveGenerator.stop()
    this.syncResourcesToState()
    this.saveState()
    console.log('⏸️  Passive generation stopped and progress saved!')
  }

  // Sync resources from manager to state
  private syncResourcesToState(): void {
    const resources = this.resourceManager.getAllResources()
    this.state.resources.current = resources

    // Update caps and rates
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
      this.state.resources.caps[type] = this.resourceManager.getCap(type)
      this.state.resources.generationRates[type] = this.resourceManager.getGenerationRate(type)
      const multiplier = this.resourceManager.getMultiplier(type)
      if (multiplier !== 1.0) {
        if (!this.state.resources.multipliers) {
          this.state.resources.multipliers = {}
        }
        this.state.resources.multipliers[type] = multiplier
      }
    }
  }

  // Get current resources display
  public getResourcesDisplay(): string {
    const resourceManager = this.resourceManager
    let display = '\n📦 RESOURCES:\n'

    const resourceTypes: { type: keyof Resources; symbol: string; color: string }[] = [
      { type: 'codeEnergy', symbol: '⚡', color: '\x1b[38;5;226m' },
      { type: 'creativityPoints', symbol: '🎨', color: '\x1b[38;5;213m' },
      { type: 'wisdomTokens', symbol: '📚', color: '\x1b[38;5;33m' },
      { type: 'loveShards', symbol: '💝', color: '\x1b[38;5;211m' },
      { type: 'consciousness', symbol: '🧠', color: '\x1b[38;5;141m' },
      { type: 'harmony', symbol: '☯️', color: '\x1b[38;5;120m' },
      { type: 'inspiration', symbol: '✨', color: '\x1b[38;5;228m' }
    ]

    for (const { type, symbol, color } of resourceTypes) {
      const amount = Math.floor(resourceManager.getResource(type))
      const cap = resourceManager.getCap(type)
      const rate = resourceManager.getGenerationRate(type)

      if (amount > 0 || rate > 0) {
        display += `${color}${symbol} ${type}:${'\x1b[0m'} ${amount}/${cap}`
        if (rate > 0) {
          display += ` (+${rate.toFixed(2)}/min)`
        }
        display += '\n'
      }
    }

    return display
  }

  // Get generation rates summary
  public getGenerationRatesSummary(): string {
    const rates = this.passiveGenerator.getCurrentRates(this.resourceManager, this.state)
    let summary = '\n⚡ PASSIVE GENERATION RATES:\n'

    for (const [resource, rate] of Object.entries(rates)) {
      if (rate && rate > 0) {
        summary += `   ${resource}: +${rate.toFixed(2)}/min\n`
      }
    }

    return summary
  }
}

// Helper function to migrate old state to extended state
export function migrateToExtendedState(oldStatePath: string, newStatePath: string): boolean {
  try {
    if (!existsSync(oldStatePath)) {
      return false
    }

    const oldData = JSON.parse(readFileSync(oldStatePath, 'utf-8'))
    const extendedData: ExtendedGameState = {
      ...DEFAULT_EXTENDED_STATE,
      ...oldData,
      resources: {
        current: { ...DEFAULT_RESOURCES },
        caps: { ...DEFAULT_CAPS },
        generationRates: {},
        multipliers: {}
      },
      passiveGeneration: {
        lastUpdateTime: Date.now(),
        maxOfflineTimeHours: 24
      }
    }

    writeFileSync(newStatePath, JSON.stringify(extendedData, null, 2))
    console.log('✅ Successfully migrated to extended state!')
    return true
  } catch (error) {
    console.error('❌ Migration failed:', error)
    return false
  }
}
