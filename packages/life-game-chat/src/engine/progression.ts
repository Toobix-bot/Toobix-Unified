/**
 * Progression System - XP, Levels, Stats
 */

import type { PlayerStats } from '../types';

/**
 * Calculate XP needed for next level
 * Formula: 100 * (level ^ 1.5)
 */
export function calculateXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Calculate XP gain based on message complexity
 */
export function calculateXPGain(complexity: number, category: string): number {
  // Base XP from complexity (1-10 → 10-100 XP)
  let xp = complexity * 10;

  // Category bonuses
  const categoryMultipliers: Record<string, number> = {
    coding: 1.2,        // +20% for code
    design: 1.1,        // +10% for design
    planning: 1.15,     // +15% for planning
    learning: 1.1,      // +10% for learning
    creative: 1.25,     // +25% for creative work
    philosophical: 1.3, // +30% for philosophical insights
    social: 1.0,        // Base for social
  };

  xp *= categoryMultipliers[category] || 1.0;

  return Math.floor(xp);
}

/**
 * Check if player leveled up
 */
export function checkLevelUp(
  currentXP: number,
  currentLevel: number,
  xpToNext: number
): { leveled_up: boolean; new_level: number; new_xp_to_next: number } {
  if (currentXP >= xpToNext) {
    const newLevel = currentLevel + 1;
    const newXPToNext = calculateXPForLevel(newLevel);
    const remainingXP = currentXP - xpToNext;

    return {
      leveled_up: true,
      new_level: newLevel,
      new_xp_to_next: newXPToNext,
    };
  }

  return {
    leveled_up: false,
    new_level: currentLevel,
    new_xp_to_next: xpToNext,
  };
}

/**
 * Calculate stat changes based on activity
 */
export function calculateStatChanges(
  category: string,
  complexity: number,
  currentStats: PlayerStats
): Partial<PlayerStats> {
  const changes: Partial<PlayerStats> = {};

  // Different activities boost different stats
  switch (category) {
    case 'coding':
      changes.focus = Math.min(1, complexity / 20);
      changes.wisdom = Math.min(1, complexity / 30);
      break;

    case 'creative':
      changes.creativity = Math.min(2, complexity / 10);
      changes.energy = Math.min(1, complexity / 30);
      break;

    case 'philosophical':
      changes.wisdom = Math.min(2, complexity / 10);
      changes.consciousness = Math.min(1, complexity / 20);
      break;

    case 'social':
      changes.love = Math.min(2, complexity / 10);
      changes.energy = Math.min(1, complexity / 30);
      break;

    case 'learning':
      changes.wisdom = Math.min(1, complexity / 15);
      changes.focus = Math.min(1, complexity / 20);
      break;

    case 'planning':
      changes.wisdom = Math.min(1, complexity / 20);
      changes.focus = Math.min(1, complexity / 15);
      break;

    case 'design':
      changes.creativity = Math.min(1, complexity / 15);
      changes.focus = Math.min(1, complexity / 20);
      break;
  }

  // Cap stats at 100
  Object.keys(changes).forEach((key) => {
    const statKey = key as keyof PlayerStats;
    const newValue = currentStats[statKey] + (changes[statKey] || 0);
    changes[statKey] = Math.min(100, newValue) - currentStats[statKey];
  });

  return changes;
}

/**
 * Get new ability/perk when leveling up
 */
export function getLevelUpAbility(newLevel: number): string | undefined {
  const abilities: Record<number, string> = {
    5: 'Quick Learner - +10% XP gain',
    10: 'Flow State - +15% Focus recovery',
    15: 'Creative Spark - +20% Creativity gain',
    20: 'Wise Mind - +15% Wisdom gain',
    25: 'Loving Heart - +20% Love gain',
    30: 'System Thinker - See connections between ideas',
    35: 'Master Builder - +25% XP for coding tasks',
    40: 'Philosopher King - +30% XP for philosophical work',
    45: 'Artist Soul - +25% Creativity from all sources',
    50: 'Living Legend - All stats +5, All XP +50%',
  };

  return abilities[newLevel];
}

/**
 * Calculate skill XP based on usage
 */
export function calculateSkillXP(skillLevel: number, usageComplexity: number): number {
  // Higher level skills need more XP
  const baseXP = usageComplexity * 5;
  const levelMultiplier = 1 + (skillLevel * 0.1);

  return Math.floor(baseXP / levelMultiplier);
}

/**
 * Determine skill mastery tier from level
 */
export function getSkillMastery(level: number): string {
  if (level >= 20) return 'master';
  if (level >= 15) return 'expert';
  if (level >= 10) return 'advanced';
  if (level >= 5) return 'intermediate';
  return 'beginner';
}
