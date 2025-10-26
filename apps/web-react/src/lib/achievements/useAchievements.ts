'use client'

import { useState, useEffect, useCallback } from 'react'
import { Achievement, ACHIEVEMENTS } from './achievement-types'
import { achievementManager } from './achievement-manager'

/**
 * React Hook for Achievement System
 */
export function useAchievements() {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([])
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [completionPercentage, setCompletionPercentage] = useState(0)

  // Load initial data
  useEffect(() => {
    setUnlockedAchievements(achievementManager.getUnlockedAchievements())
    setCompletionPercentage(achievementManager.getCompletionPercentage())
  }, [])

  // Listen for new achievements
  useEffect(() => {
    const unsubscribe = achievementManager.onAchievementUnlock((achievement) => {
      setNewAchievement(achievement)
      setUnlockedAchievements(achievementManager.getUnlockedAchievements())
      setCompletionPercentage(achievementManager.getCompletionPercentage())

      // Auto-hide after 5 seconds
      setTimeout(() => setNewAchievement(null), 5000)
    })

    return unsubscribe
  }, [])

  const dismissNewAchievement = useCallback(() => {
    setNewAchievement(null)
  }, [])

  return {
    allAchievements: ACHIEVEMENTS,
    unlockedAchievements,
    newAchievement,
    completionPercentage,
    dismissNewAchievement
  }
}

/**
 * Hook for tracking player actions
 */
export function useAchievementTracking() {
  const questCompleted = useCallback((choiceType?: string) => {
    achievementManager.questCompleted(choiceType)
  }, [])

  const levelUp = useCallback((newLevel: number) => {
    achievementManager.levelUp(newLevel)
  }, [])

  const updateStats = useCallback((stats: {
    mut: number
    weisheit: number
    bewusstsein: number
    frieden: number
    liebe: number
  }) => {
    achievementManager.updateStats(stats)
  }, [])

  const addIdleXp = useCallback((xp: number) => {
    achievementManager.addIdleXp(xp)
  }, [])

  const visitPage = useCallback((page: 'world' | 'story' | 'people' | 'unified' | 'autonomous') => {
    achievementManager.visitPage(page)
  }, [])

  return {
    questCompleted,
    levelUp,
    updateStats,
    addIdleXp,
    visitPage
  }
}
