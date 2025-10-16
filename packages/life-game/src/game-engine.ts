/**
 * 🎮 Life Game Chat - Game Engine
 *
 * Core game mechanics: XP calculation, leveling, stat management
 */

export interface PlayerStats {
  creativity: number    // 0-100
  wisdom: number       // 0-100
  love: number         // 0-100
  energy: number       // 0-100
  focus: number        // 0-100
}

export interface Activity {
  category: string      // 'coding', 'design', 'planning', 'reflection', etc.
  complexity: number    // 1-10
  duration?: number     // minutes (optional)
  emotion?: string      // 'excited', 'tired', 'focused', etc.
}

export interface LevelUpResult {
  newLevel: number
  statBonus: Partial<PlayerStats>
  unlocks: string[]    // Unlocked features/abilities
  message: string
}

export class GameEngine {
  /**
   * Calculate XP gain from message complexity and category
   *
   * Formula: baseXP = complexity * 10 * categoryBonus
   */
  calculateXP(complexity: number, category: string): number {
    // Clamp complexity to 1-10
    const clampedComplexity = Math.max(1, Math.min(10, complexity))

    const baseXP = clampedComplexity * 10

    // Category multipliers - encourage diverse activities
    const bonuses: Record<string, number> = {
      'coding': 1.2,        // Building gets bonus
      'design': 1.1,        // Creating visuals gets bonus
      'planning': 1.15,     // Strategic thinking gets bonus
      'reflection': 1.3,    // Self-awareness gets highest bonus
      'learning': 1.25,     // Education gets bonus
      'social': 1.1,        // Connecting with people gets bonus
      'creative': 1.2,      // Artistic work gets bonus
      'general': 1.0        // Default
    }

    const multiplier = bonuses[category] || 1.0
    return Math.floor(baseXP * multiplier)
  }

  /**
   * Calculate level from total XP
   *
   * Formula: level = floor(sqrt(xp / 100)) + 1
   *
   * Progression:
   * Level 1: 0 XP
   * Level 2: 100 XP
   * Level 3: 400 XP
   * Level 4: 900 XP
   * Level 5: 1600 XP
   * ...
   * Level 10: 8100 XP
   * Level 20: 36100 XP
   * Level 50: 240100 XP
   * Level 100: 980100 XP
   */
  calculateLevel(xp: number): number {
    if (xp < 0) return 1
    return Math.floor(Math.sqrt(xp / 100)) + 1
  }

  /**
   * Calculate XP needed for next level
   *
   * Formula: xpForLevel = (level)^2 * 100
   */
  xpForNextLevel(currentLevel: number): number {
    return Math.pow(currentLevel, 2) * 100
  }

  /**
   * Calculate remaining XP to next level
   */
  xpToNextLevel(currentXP: number, currentLevel: number): number {
    const nextLevelXP = this.xpForNextLevel(currentLevel)
    return Math.max(0, nextLevelXP - currentXP)
  }

  /**
   * Calculate percentage progress to next level
   */
  levelProgress(currentXP: number, currentLevel: number): number {
    const previousLevelXP = this.xpForNextLevel(currentLevel - 1)
    const nextLevelXP = this.xpForNextLevel(currentLevel)
    const levelRange = nextLevelXP - previousLevelXP
    const progressInLevel = currentXP - previousLevelXP

    return Math.min(100, Math.max(0, (progressInLevel / levelRange) * 100))
  }

  /**
   * Check if leveling up and calculate rewards
   */
  checkLevelUp(oldXP: number, newXP: number): LevelUpResult | null {
    const oldLevel = this.calculateLevel(oldXP)
    const newLevel = this.calculateLevel(newXP)

    if (newLevel <= oldLevel) {
      return null // No level up
    }

    // Calculate level up rewards
    const levelsGained = newLevel - oldLevel
    const statBonus = this.calculateLevelUpBonus(newLevel, levelsGained)
    const unlocks = this.calculateUnlocks(newLevel)
    const message = this.getLevelUpMessage(newLevel, levelsGained)

    return {
      newLevel,
      statBonus,
      unlocks,
      message
    }
  }

  /**
   * Calculate stat bonus on level up
   */
  private calculateLevelUpBonus(newLevel: number, levelsGained: number): Partial<PlayerStats> {
    const bonus: Partial<PlayerStats> = {}

    // Every level: small bonus to all stats
    const baseBonus = levelsGained * 2

    // Milestone levels: extra bonuses
    if (newLevel % 10 === 0) {
      // Every 10 levels: +5 to all stats
      bonus.creativity = baseBonus + 5
      bonus.wisdom = baseBonus + 5
      bonus.love = baseBonus + 5
      bonus.energy = baseBonus + 5
      bonus.focus = baseBonus + 5
    } else if (newLevel % 5 === 0) {
      // Every 5 levels: +3 to all stats
      bonus.creativity = baseBonus + 3
      bonus.wisdom = baseBonus + 3
      bonus.love = baseBonus + 3
      bonus.energy = baseBonus + 3
      bonus.focus = baseBonus + 3
    } else {
      // Normal level: +2 to all stats
      bonus.creativity = baseBonus
      bonus.wisdom = baseBonus
      bonus.love = baseBonus
      bonus.energy = baseBonus
      bonus.focus = baseBonus
    }

    return bonus
  }

  /**
   * Calculate what unlocks at this level
   */
  private calculateUnlocks(level: number): string[] {
    const unlocks: string[] = []

    // Level milestones
    if (level === 5) unlocks.push('Basic Quest System')
    if (level === 10) unlocks.push('Inventory System', 'Item Drops')
    if (level === 15) unlocks.push('Companion: Blaze 🔥')
    if (level === 20) unlocks.push('Run System', 'Story Arcs')
    if (level === 25) unlocks.push('Advanced Achievements')
    if (level === 30) unlocks.push('Companion: Harmony 🌸')
    if (level === 40) unlocks.push('Legendary Items')
    if (level === 50) unlocks.push('Master Tier', 'Meta Progression')
    if (level === 75) unlocks.push('Transcendence Mode')
    if (level === 100) unlocks.push('Ultimate Form', 'Mentor Status')

    return unlocks
  }

  /**
   * Get level up message
   */
  private getLevelUpMessage(newLevel: number, levelsGained: number): string {
    const messages = [
      `You've reached Level ${newLevel}! Your journey continues to unfold.`,
      `Level ${newLevel} achieved! You're growing stronger.`,
      `Congratulations! Level ${newLevel} unlocked.`,
      `You've ascended to Level ${newLevel}! New possibilities await.`,
      `Level Up! You're now Level ${newLevel}. Keep pushing forward!`
    ]

    if (newLevel % 10 === 0) {
      return `🌟 MILESTONE! You've reached Level ${newLevel}! This is a major achievement!`
    }

    if (levelsGained > 1) {
      return `⚡ POWER SURGE! You've jumped ${levelsGained} levels to Level ${newLevel}!`
    }

    // Random message
    return messages[Math.floor(Math.random() * messages.length)]
  }

  /**
   * Update stats based on activity
   *
   * Different activities affect different stats
   */
  updateStats(currentStats: PlayerStats, activity: Activity): Partial<PlayerStats> {
    const changes: Partial<PlayerStats> = {}

    const { category, complexity, emotion } = activity

    // Category-based stat changes
    switch (category) {
      case 'coding':
        changes.focus = Math.min(5, complexity)
        changes.creativity = Math.min(3, Math.floor(complexity / 2))
        changes.energy = -Math.min(2, Math.floor(complexity / 3)) // Costs energy
        break

      case 'design':
        changes.creativity = Math.min(5, complexity)
        changes.focus = Math.min(3, Math.floor(complexity / 2))
        break

      case 'planning':
        changes.wisdom = Math.min(5, complexity)
        changes.focus = Math.min(4, complexity)
        break

      case 'reflection':
        changes.wisdom = Math.min(6, complexity + 1)
        changes.love = Math.min(3, Math.floor(complexity / 2))
        break

      case 'social':
        changes.love = Math.min(5, complexity)
        changes.wisdom = Math.min(2, Math.floor(complexity / 3))
        break

      case 'creative':
        changes.creativity = Math.min(6, complexity + 1)
        changes.energy = Math.min(2, Math.floor(complexity / 3))
        break

      case 'learning':
        changes.wisdom = Math.min(5, complexity)
        changes.focus = Math.min(4, complexity)
        break

      default:
        // General activity: small boost to all
        changes.wisdom = 1
        changes.focus = 1
        break
    }

    // Emotion modifiers
    if (emotion === 'tired') {
      // Reduce stat gains when tired
      Object.keys(changes).forEach(key => {
        const statKey = key as keyof PlayerStats
        if (changes[statKey]) {
          changes[statKey] = Math.floor((changes[statKey] || 0) * 0.5)
        }
      })
      changes.energy = (changes.energy || 0) - 3 // Extra energy cost when tired
    } else if (emotion === 'excited') {
      // Boost gains when excited
      Object.keys(changes).forEach(key => {
        const statKey = key as keyof PlayerStats
        if (changes[statKey] && changes[statKey]! > 0) {
          changes[statKey] = Math.floor((changes[statKey] || 0) * 1.5)
        }
      })
    }

    return changes
  }

  /**
   * Apply stat changes and clamp to 0-100
   */
  applyStatChanges(current: PlayerStats, changes: Partial<PlayerStats>): PlayerStats {
    const updated: PlayerStats = { ...current }

    Object.entries(changes).forEach(([key, value]) => {
      const statKey = key as keyof PlayerStats
      updated[statKey] = Math.max(0, Math.min(100, updated[statKey] + (value || 0)))
    })

    return updated
  }

  /**
   * Calculate item drop chance based on complexity and luck
   */
  calculateItemDropChance(complexity: number, playerLevel: number): number {
    // Base: 5% chance for items
    let chance = 5

    // Complexity bonus: +2% per complexity point
    chance += complexity * 2

    // Level bonus: +0.5% per level
    chance += playerLevel * 0.5

    // Cap at 50%
    return Math.min(50, chance)
  }

  /**
   * Determine item rarity based on luck roll
   */
  determineItemRarity(roll: number): 'common' | 'rare' | 'legendary' {
    if (roll >= 95) return 'legendary' // 5% chance
    if (roll >= 75) return 'rare'      // 20% chance
    return 'common'                      // 75% chance
  }

  /**
   * Calculate companion relationship gain
   */
  calculateCompanionGain(
    complexity: number,
    category: string,
    emotion: string,
    companionId: string
  ): number {
    let gain = Math.floor(complexity / 2)

    // Luna loves reflection and wisdom
    if (companionId === 'luna') {
      if (category === 'reflection') gain += 3
      if (category === 'learning') gain += 2
      if (emotion === 'curious') gain += 2
    }

    // Blaze loves action and building
    if (companionId === 'blaze') {
      if (category === 'coding') gain += 3
      if (category === 'creative') gain += 2
      if (emotion === 'excited') gain += 2
    }

    return Math.max(1, gain)
  }
}

// Export singleton instance
export const gameEngine = new GameEngine()
