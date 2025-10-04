// Story-Idle Game State Management
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

export interface GameState {
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
}

const DEFAULT_STATE: GameState = {
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
  }
}

export class GameStateManager {
  private statePath: string
  private state: GameState

  constructor(dataPath: string = './data') {
    this.statePath = join(dataPath, 'story-idle-state.json')
    this.state = this.loadState()
  }

  private loadState(): GameState {
    if (existsSync(this.statePath)) {
      try {
        const data = readFileSync(this.statePath, 'utf-8')
        return { ...DEFAULT_STATE, ...JSON.parse(data) }
      } catch (error) {
        console.warn('Could not load game state, using default')
        return DEFAULT_STATE
      }
    }
    return DEFAULT_STATE
  }

  public saveState(): void {
    try {
      writeFileSync(this.statePath, JSON.stringify(this.state, null, 2))
    } catch (error) {
      console.error('Failed to save game state:', error)
    }
  }

  // Getters
  public getState(): GameState {
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
  public addStat(stat: keyof GameState['stats'], amount: number): void {
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
}
