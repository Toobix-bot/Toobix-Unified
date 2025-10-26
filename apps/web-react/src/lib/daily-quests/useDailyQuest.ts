'use client'

import { useState, useEffect, useCallback } from 'react'
import { dailyQuestManager } from './daily-quest-manager'
import { Quest } from '@/components/story/QuestDialog'

/**
 * Hook to manage daily quest system
 *
 * Features:
 * - Get today's daily quest
 * - Track completion status
 * - Manage streak
 * - Auto-refresh at midnight
 */
export function useDailyQuest() {
  const [dailyQuest, setDailyQuest] = useState<Quest | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [streak, setStreak] = useState(0)
  const [totalCompleted, setTotalCompleted] = useState(0)
  const [streakBonus, setStreakBonus] = useState(0)

  /**
   * Load daily quest state
   */
  const loadDailyQuest = useCallback(() => {
    const status = dailyQuestManager.getStatus()
    setDailyQuest(status.quest)
    setIsCompleted(status.completed)
    setStreak(status.streak)
    setTotalCompleted(status.totalCompleted)
    setStreakBonus(status.streakBonus)
  }, [])

  /**
   * Mark daily quest as completed
   */
  const markCompleted = useCallback(() => {
    dailyQuestManager.markCompleted()
    loadDailyQuest()
  }, [loadDailyQuest])

  /**
   * Calculate time until midnight (ms)
   */
  const getTimeUntilMidnight = useCallback((): number => {
    const now = new Date()
    const midnight = new Date()
    midnight.setHours(24, 0, 0, 0)
    return midnight.getTime() - now.getTime()
  }, [])

  useEffect(() => {
    // Load initial state
    loadDailyQuest()

    // Set up auto-refresh at midnight
    const timeUntilMidnight = getTimeUntilMidnight()
    const midnightTimeout = setTimeout(() => {
      loadDailyQuest()

      // After midnight refresh, set up daily interval
      const dailyInterval = setInterval(() => {
        loadDailyQuest()
      }, 24 * 60 * 60 * 1000) // 24 hours

      return () => clearInterval(dailyInterval)
    }, timeUntilMidnight)

    // Also refresh every minute to catch any changes
    const refreshInterval = setInterval(() => {
      loadDailyQuest()
    }, 60 * 1000)

    return () => {
      clearTimeout(midnightTimeout)
      clearInterval(refreshInterval)
    }
  }, [loadDailyQuest, getTimeUntilMidnight])

  return {
    dailyQuest,
    isCompleted,
    streak,
    totalCompleted,
    streakBonus,
    markCompleted,
    refresh: loadDailyQuest
  }
}
