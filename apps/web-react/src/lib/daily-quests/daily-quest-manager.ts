'use client'

import { philosophicalQuests } from '@/data/quests'
import { Quest } from '@/components/story/QuestDialog'

interface DailyQuestState {
  date: string // YYYY-MM-DD format
  questId: string
  completed: boolean
  completedAt?: number
  streak: number
  totalCompleted: number
}

const STORAGE_KEY = 'toobix_daily_quest'
const BONUS_XP_MULTIPLIER = 2
const STREAK_BONUS_PER_DAY = 10

/**
 * Daily Quest Manager
 *
 * Features:
 * - One daily quest per day, reset at midnight
 * - Bonus rewards for completing daily quests
 * - Streak tracking with bonuses
 * - LocalStorage persistence
 */
class DailyQuestManager {
  private state: DailyQuestState | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadState()
    }
  }

  /**
   * Load state from localStorage
   */
  private loadState(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        this.state = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load daily quest state:', error)
      this.state = null
    }
  }

  /**
   * Save state to localStorage
   */
  private saveState(): void {
    try {
      if (this.state) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state))
      }
    } catch (error) {
      console.error('Failed to save daily quest state:', error)
    }
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  private getTodayString(): string {
    const now = new Date()
    return now.toISOString().split('T')[0]
  }

  /**
   * Get yesterday's date in YYYY-MM-DD format
   */
  private getYesterdayString(): string {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toISOString().split('T')[0]
  }

  /**
   * Generate a deterministic random quest based on date
   */
  private generateQuestForDate(dateString: string): Quest {
    // Use date as seed for deterministic random selection
    const seed = dateString.split('-').reduce((acc, part) => acc + parseInt(part), 0)
    const index = seed % philosophicalQuests.length

    const baseQuest = philosophicalQuests[index]

    // Apply bonus rewards to all choices
    const enhancedQuest: Quest = {
      ...baseQuest,
      title: `⭐ DAILY QUEST: ${baseQuest.title}`,
      description: `${baseQuest.description}\n\n🎁 BONUS: ${BONUS_XP_MULTIPLIER}x XP für tägliche Quest!`,
      choices: baseQuest.choices.map(choice => ({
        ...choice,
        effects: {
          ...choice.effects,
          xp: choice.effects.xp * BONUS_XP_MULTIPLIER
        }
      }))
    }

    return enhancedQuest
  }

  /**
   * Check if we need to reset for a new day
   */
  private checkAndResetForNewDay(): void {
    const today = this.getTodayString()
    const yesterday = this.getYesterdayString()

    if (!this.state || this.state.date !== today) {
      // Check if streak should continue
      let newStreak = 1
      if (this.state && this.state.completed && this.state.date === yesterday) {
        // Completed yesterday's quest, continue streak
        newStreak = (this.state.streak || 0) + 1
      } else if (this.state && !this.state.completed && this.state.date === yesterday) {
        // Didn't complete yesterday's quest, reset streak
        newStreak = 1
      } else if (this.state && this.state.date !== yesterday && this.state.date !== today) {
        // Missed more than one day, reset streak
        newStreak = 1
      }

      // Generate new quest for today
      const todayQuest = this.generateQuestForDate(today)

      this.state = {
        date: today,
        questId: todayQuest.id,
        completed: false,
        streak: newStreak,
        totalCompleted: this.state?.totalCompleted || 0
      }

      this.saveState()
    }
  }

  /**
   * Get today's daily quest
   */
  getDailyQuest(): Quest | null {
    this.checkAndResetForNewDay()

    if (!this.state) return null

    const quest = this.generateQuestForDate(this.state.date)
    return quest
  }

  /**
   * Check if today's daily quest is completed
   */
  isCompleted(): boolean {
    this.checkAndResetForNewDay()
    return this.state?.completed || false
  }

  /**
   * Mark today's daily quest as completed
   */
  markCompleted(): void {
    this.checkAndResetForNewDay()

    if (this.state && !this.state.completed) {
      this.state.completed = true
      this.state.completedAt = Date.now()
      this.state.totalCompleted++
      this.saveState()
    }
  }

  /**
   * Get current streak
   */
  getStreak(): number {
    this.checkAndResetForNewDay()
    return this.state?.streak || 0
  }

  /**
   * Get total completed daily quests
   */
  getTotalCompleted(): number {
    return this.state?.totalCompleted || 0
  }

  /**
   * Calculate bonus XP for current streak
   */
  getStreakBonus(): number {
    const streak = this.getStreak()
    return streak * STREAK_BONUS_PER_DAY
  }

  /**
   * Get daily quest status summary
   */
  getStatus() {
    this.checkAndResetForNewDay()

    return {
      hasQuest: !!this.state,
      completed: this.state?.completed || false,
      streak: this.state?.streak || 0,
      totalCompleted: this.state?.totalCompleted || 0,
      streakBonus: this.getStreakBonus(),
      quest: this.getDailyQuest()
    }
  }

  /**
   * Reset daily quest state (for testing)
   */
  reset(): void {
    localStorage.removeItem(STORAGE_KEY)
    this.state = null
  }
}

export const dailyQuestManager = new DailyQuestManager()
