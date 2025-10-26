'use client'

import { useState, useEffect, useCallback } from 'react'
import { achievementManager } from '@/lib/achievements/achievement-manager'

interface LevelUpData {
  oldLevel: number
  newLevel: number
  xpGained: number
  statIncreases: {
    stat: string
    amount: number
    icon: string
  }[]
  unlockedFeatures?: string[]
}

const STAT_ICONS = {
  mut: '⚔️',
  weisheit: '📚',
  bewusstsein: '🧠',
  frieden: '🕊️',
  liebe: '💝'
}

const LEVEL_FEATURES: { [level: number]: string } = {
  5: 'Zugriff auf erweiterte Quests',
  10: 'Persönlichkeitsprofil freigeschaltet',
  15: 'Fähigkeit, eigene Quests zu erstellen',
  20: 'Mentor-Modus aktiviert',
  25: 'Philosophische Tiefenanalyse verfügbar',
  30: 'Meister-Status erreicht'
}

/**
 * Hook to manage level-up system with celebration
 *
 * Features:
 * - Automatic level detection based on XP
 * - Stat increases on level up
 * - Feature unlocks at milestone levels
 * - Level-up modal management
 */
export function useLevelUp() {
  const [showLevelUpModal, setShowLevelUpModal] = useState(false)
  const [levelUpData, setLevelUpData] = useState<LevelUpData | null>(null)
  const [lastKnownLevel, setLastKnownLevel] = useState<number>(1)

  /**
   * Calculate XP required for a specific level
   * Formula: level * 100 (can be adjusted for more complex progression)
   */
  const getXpForLevel = useCallback((level: number): number => {
    return level * 100
  }, [])

  /**
   * Calculate current level from total XP
   */
  const getLevelFromXp = useCallback((xp: number): number => {
    let level = 1
    while (xp >= getXpForLevel(level)) {
      level++
    }
    return level - 1
  }, [getXpForLevel])

  /**
   * Calculate stat increases for leveling up
   * Every level gives +1 to all stats, with bonus points every 5 levels
   */
  const calculateStatIncreases = useCallback((newLevel: number) => {
    const baseIncrease = 1
    const bonusIncrease = newLevel % 5 === 0 ? 2 : 0
    const totalIncrease = baseIncrease + bonusIncrease

    return [
      { stat: 'mut', amount: totalIncrease, icon: STAT_ICONS.mut },
      { stat: 'weisheit', amount: totalIncrease, icon: STAT_ICONS.weisheit },
      { stat: 'bewusstsein', amount: totalIncrease, icon: STAT_ICONS.bewusstsein },
      { stat: 'frieden', amount: totalIncrease, icon: STAT_ICONS.frieden },
      { stat: 'liebe', amount: totalIncrease, icon: STAT_ICONS.liebe }
    ]
  }, [])

  /**
   * Get unlocked features for a specific level
   */
  const getUnlockedFeatures = useCallback((level: number): string[] => {
    const features: string[] = []
    if (LEVEL_FEATURES[level]) {
      features.push(LEVEL_FEATURES[level])
    }
    return features
  }, [])

  /**
   * Check for level up and trigger celebration
   */
  const checkLevelUp = useCallback((currentXp: number, currentLevel: number) => {
    const calculatedLevel = getLevelFromXp(currentXp)

    // If calculated level is higher than current level, trigger level up
    if (calculatedLevel > currentLevel && calculatedLevel > lastKnownLevel) {
      const xpForNewLevel = getXpForLevel(calculatedLevel)
      const xpForOldLevel = getXpForLevel(currentLevel)
      const xpGained = xpForNewLevel - xpForOldLevel

      const data: LevelUpData = {
        oldLevel: currentLevel,
        newLevel: calculatedLevel,
        xpGained,
        statIncreases: calculateStatIncreases(calculatedLevel),
        unlockedFeatures: getUnlockedFeatures(calculatedLevel)
      }

      setLevelUpData(data)
      setShowLevelUpModal(true)
      setLastKnownLevel(calculatedLevel)

      // Notify achievement manager
      achievementManager.levelUp(calculatedLevel)

      return true
    }

    return false
  }, [lastKnownLevel, getLevelFromXp, getXpForLevel, calculateStatIncreases, getUnlockedFeatures])

  /**
   * Manually trigger level up (for testing or special events)
   */
  const triggerLevelUp = useCallback((oldLevel: number, newLevel: number, xpGained: number = 100) => {
    const data: LevelUpData = {
      oldLevel,
      newLevel,
      xpGained,
      statIncreases: calculateStatIncreases(newLevel),
      unlockedFeatures: getUnlockedFeatures(newLevel)
    }

    setLevelUpData(data)
    setShowLevelUpModal(true)
    setLastKnownLevel(newLevel)

    // Notify achievement manager
    achievementManager.levelUp(newLevel)
  }, [calculateStatIncreases, getUnlockedFeatures])

  /**
   * Close level up modal
   */
  const closeLevelUpModal = useCallback(() => {
    setShowLevelUpModal(false)
  }, [])

  return {
    showLevelUpModal,
    levelUpData,
    checkLevelUp,
    triggerLevelUp,
    closeLevelUpModal,
    getLevelFromXp,
    getXpForLevel
  }
}
