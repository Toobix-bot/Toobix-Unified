/**
 * Achievement Manager
 * Handles achievement tracking, unlocking, and persistence
 */

import { Achievement, AchievementProgress, ACHIEVEMENTS, getAchievementById } from './achievement-types'

const STORAGE_KEY = 'toobix_achievements'
const STATS_KEY = 'toobix_achievement_stats'

interface AchievementStats {
  questsCompleted: number
  level: number
  stats: {
    mut: number
    weisheit: number
    bewusstsein: number
    frieden: number
    liebe: number
  }
  idleXpEarned: number
  loginStreak: number
  lastLoginDate: string
  choiceTypes: {
    mut: number
    weisheit: number
    bewusstsein: number
    frieden: number
    liebe: number
  }
  pagesVisited: {
    world: boolean
    story: boolean
    people: boolean
    unified: boolean
    autonomous: boolean
  }
}

class AchievementManager {
  private progress: Map<string, AchievementProgress> = new Map()
  private stats: AchievementStats = {
    questsCompleted: 0,
    level: 1,
    stats: { mut: 5, weisheit: 5, bewusstsein: 5, frieden: 5, liebe: 5 },
    idleXpEarned: 0,
    loginStreak: 0,
    lastLoginDate: '',
    choiceTypes: { mut: 0, weisheit: 0, bewusstsein: 0, frieden: 0, liebe: 0 },
    pagesVisited: {
      world: false,
      story: false,
      people: false,
      unified: false,
      autonomous: false
    }
  }
  private listeners: Array<(achievement: Achievement) => void> = []

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadProgress()
      this.loadStats()
      this.checkInitialAchievements()
    }
  }

  /**
   * Load progress from localStorage
   */
  private loadProgress(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        this.progress = new Map(Object.entries(data))
      }
    } catch (error) {
      console.error('Failed to load achievement progress:', error)
    }
  }

  /**
   * Save progress to localStorage
   */
  private saveProgress(): void {
    try {
      const data = Object.fromEntries(this.progress)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save achievement progress:', error)
    }
  }

  /**
   * Load stats from localStorage
   */
  private loadStats(): void {
    try {
      const saved = localStorage.getItem(STATS_KEY)
      if (saved) {
        this.stats = { ...this.stats, ...JSON.parse(saved) }
      }
    } catch (error) {
      console.error('Failed to load achievement stats:', error)
    }
  }

  /**
   * Save stats to localStorage
   */
  private saveStats(): void {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(this.stats))
    } catch (error) {
      console.error('Failed to save achievement stats:', error)
    }
  }

  /**
   * Check initial achievements (app opened, etc.)
   */
  private checkInitialAchievements(): void {
    // First steps - always unlock on app open
    this.checkAndUnlock('first_steps')
  }

  /**
   * Add listener for achievement unlocks
   */
  onAchievementUnlock(callback: (achievement: Achievement) => void): () => void {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  /**
   * Notify listeners
   */
  private notifyUnlock(achievement: Achievement): void {
    this.listeners.forEach(listener => listener(achievement))
  }

  /**
   * Check and unlock achievement
   */
  private checkAndUnlock(achievementId: string): boolean {
    const achievement = getAchievementById(achievementId)
    if (!achievement) return false

    const progress = this.progress.get(achievementId)
    if (progress?.completed) return false // Already unlocked

    // Check if requirement is met
    const isMet = this.checkRequirement(achievement)
    if (isMet) {
      this.unlockAchievement(achievementId)
      return true
    }

    return false
  }

  /**
   * Check if achievement requirement is met
   */
  private checkRequirement(achievement: Achievement): boolean {
    const { type, value, details } = achievement.requirement

    switch (type) {
      case 'quest_count':
        return this.stats.questsCompleted >= value

      case 'level':
        return this.stats.level >= value

      case 'stat_total': {
        const total = Object.values(this.stats.stats).reduce((a, b) => a + b, 0)
        return total >= value
      }

      case 'idle_time':
        return this.stats.idleXpEarned >= value

      case 'login_streak':
        return this.stats.loginStreak >= value

      case 'choice_type':
        if (!details) return false
        const choiceType = details as keyof typeof this.stats.choiceTypes
        return this.stats.choiceTypes[choiceType] >= value

      case 'custom':
        return this.checkCustomRequirement(details || '', value)

      default:
        return false
    }
  }

  /**
   * Check custom requirements
   */
  private checkCustomRequirement(details: string, value: number): boolean {
    switch (details) {
      case 'app_opened':
        return true

      case 'world_visited':
        return this.stats.pagesVisited.world

      case 'story_visited':
        return this.stats.pagesVisited.story

      case 'people_visited':
        return this.stats.pagesVisited.people

      case 'all_stats_min': {
        return Object.values(this.stats.stats).every(s => s >= value)
      }

      case 'stat_weisheit':
        return this.stats.stats.weisheit >= value

      case 'stat_bewusstsein':
        return this.stats.stats.bewusstsein >= value

      case 'stat_frieden':
        return this.stats.stats.frieden >= value

      case 'stat_liebe':
        return this.stats.stats.liebe >= value

      case 'stat_mut':
        return this.stats.stats.mut >= value

      case 'early_morning': {
        const hour = new Date().getHours()
        return hour >= 5 && hour < 6
      }

      case 'late_night': {
        const hour = new Date().getHours()
        return hour >= 0 && hour < 3
      }

      case 'all_achievements': {
        const unlockedCount = Array.from(this.progress.values())
          .filter(p => p.completed && p.achievementId !== 'completionist').length
        return unlockedCount >= (ACHIEVEMENTS.length - 1)
      }

      default:
        return false
    }
  }

  /**
   * Unlock achievement
   */
  private unlockAchievement(achievementId: string): void {
    const achievement = getAchievementById(achievementId)
    if (!achievement) return

    const now = Date.now()
    this.progress.set(achievementId, {
      achievementId,
      progress: 100,
      completed: true,
      unlockedAt: now
    })

    this.saveProgress()
    this.notifyUnlock(achievement)

    console.log(`🎉 Achievement Unlocked: ${achievement.name}`)
  }

  /**
   * Update quest count
   */
  questCompleted(choiceType?: string): void {
    this.stats.questsCompleted++

    if (choiceType && choiceType in this.stats.choiceTypes) {
      this.stats.choiceTypes[choiceType as keyof typeof this.stats.choiceTypes]++
    }

    this.saveStats()
    this.checkAllAchievements()
  }

  /**
   * Update level
   */
  levelUp(newLevel: number): void {
    this.stats.level = newLevel
    this.saveStats()
    this.checkAllAchievements()
  }

  /**
   * Update stats
   */
  updateStats(stats: { mut: number; weisheit: number; bewusstsein: number; frieden: number; liebe: number }): void {
    this.stats.stats = stats
    this.saveStats()
    this.checkAllAchievements()
  }

  /**
   * Add idle XP
   */
  addIdleXp(xp: number): void {
    this.stats.idleXpEarned += xp
    this.saveStats()
    this.checkAllAchievements()
  }

  /**
   * Mark page as visited
   */
  visitPage(page: keyof AchievementStats['pagesVisited']): void {
    this.stats.pagesVisited[page] = true
    this.saveStats()
    this.checkAllAchievements()
  }

  /**
   * Check all achievements
   */
  private checkAllAchievements(): void {
    ACHIEVEMENTS.forEach(achievement => {
      this.checkAndUnlock(achievement.id)
    })
  }

  /**
   * Get all unlocked achievements
   */
  getUnlockedAchievements(): Achievement[] {
    return ACHIEVEMENTS.filter(achievement => {
      const progress = this.progress.get(achievement.id)
      return progress?.completed
    })
  }

  /**
   * Get achievement progress
   */
  getProgress(achievementId: string): AchievementProgress | null {
    return this.progress.get(achievementId) || null
  }

  /**
   * Get completion percentage
   */
  getCompletionPercentage(): number {
    const unlocked = this.getUnlockedAchievements().length
    return Math.round((unlocked / ACHIEVEMENTS.length) * 100)
  }

  /**
   * Get stats
   */
  getStats(): AchievementStats {
    return { ...this.stats }
  }

  /**
   * Reset all progress (for testing)
   */
  reset(): void {
    this.progress.clear()
    this.stats = {
      questsCompleted: 0,
      level: 1,
      stats: { mut: 5, weisheit: 5, bewusstsein: 5, frieden: 5, liebe: 5 },
      idleXpEarned: 0,
      loginStreak: 0,
      lastLoginDate: '',
      choiceTypes: { mut: 0, weisheit: 0, bewusstsein: 0, frieden: 0, liebe: 0 },
      pagesVisited: {
        world: false,
        story: false,
        people: false,
        unified: false,
        autonomous: false
      }
    }
    this.saveProgress()
    this.saveStats()
  }
}

// Global singleton
export const achievementManager = new AchievementManager()
