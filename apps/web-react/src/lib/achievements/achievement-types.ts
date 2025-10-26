/**
 * Achievement System Types
 * Defines all achievements, categories, and rewards
 */

export type AchievementCategory =
  | 'exploration'
  | 'story'
  | 'social'
  | 'progression'
  | 'wisdom'
  | 'hidden'

export type AchievementRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'

export interface AchievementReward {
  xp?: number
  stat?: 'mut' | 'weisheit' | 'bewusstsein' | 'frieden' | 'liebe'
  statValue?: number
  title?: string
  badge?: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: AchievementCategory
  rarity: AchievementRarity
  hidden?: boolean // Don't show until unlocked
  requirement: {
    type: 'quest_count' | 'level' | 'stat_total' | 'idle_time' | 'login_streak' | 'choice_type' | 'custom'
    value: number
    details?: string
  }
  reward: AchievementReward
  unlockedAt?: number // Timestamp
}

export interface AchievementProgress {
  achievementId: string
  progress: number
  completed: boolean
  unlockedAt?: number
}

// All available achievements
export const ACHIEVEMENTS: Achievement[] = [
  // EXPLORATION CATEGORY
  {
    id: 'first_steps',
    name: 'Erste Schritte',
    description: 'Beginne deine Reise durch das Toobix Universe',
    icon: '👣',
    category: 'exploration',
    rarity: 'common',
    requirement: {
      type: 'custom',
      value: 1,
      details: 'app_opened'
    },
    reward: {
      xp: 10
    }
  },
  {
    id: 'world_explorer',
    name: 'Welterkunder',
    description: 'Betrete die BlockWorld zum ersten Mal',
    icon: '🌍',
    category: 'exploration',
    rarity: 'common',
    requirement: {
      type: 'custom',
      value: 1,
      details: 'world_visited'
    },
    reward: {
      xp: 25,
      stat: 'weisheit',
      statValue: 1
    }
  },
  {
    id: 'story_seeker',
    name: 'Geschichtensucher',
    description: 'Öffne den Story Mode',
    icon: '📖',
    category: 'exploration',
    rarity: 'common',
    requirement: {
      type: 'custom',
      value: 1,
      details: 'story_visited'
    },
    reward: {
      xp: 25
    }
  },
  {
    id: 'social_butterfly',
    name: 'Sozialer Schmetterling',
    description: 'Besuche die People Seite',
    icon: '🦋',
    category: 'exploration',
    rarity: 'common',
    requirement: {
      type: 'custom',
      value: 1,
      details: 'people_visited'
    },
    reward: {
      xp: 25,
      stat: 'liebe',
      statValue: 1
    }
  },

  // STORY CATEGORY
  {
    id: 'first_choice',
    name: 'Die Erste Wahl',
    description: 'Triff deine erste Quest-Entscheidung',
    icon: '🎯',
    category: 'story',
    rarity: 'common',
    requirement: {
      type: 'quest_count',
      value: 1
    },
    reward: {
      xp: 50,
      stat: 'mut',
      statValue: 1
    }
  },
  {
    id: 'questor',
    name: 'Questor',
    description: 'Schließe 5 Quests ab',
    icon: '⚔️',
    category: 'story',
    rarity: 'uncommon',
    requirement: {
      type: 'quest_count',
      value: 5
    },
    reward: {
      xp: 100,
      stat: 'mut',
      statValue: 2
    }
  },
  {
    id: 'epic_adventurer',
    name: 'Epischer Abenteurer',
    description: 'Schließe 10 Quests ab',
    icon: '🗡️',
    category: 'story',
    rarity: 'rare',
    requirement: {
      type: 'quest_count',
      value: 10
    },
    reward: {
      xp: 250,
      stat: 'mut',
      statValue: 3,
      title: 'Abenteurer'
    }
  },
  {
    id: 'legend',
    name: 'Lebende Legende',
    description: 'Schließe 25 Quests ab',
    icon: '👑',
    category: 'story',
    rarity: 'legendary',
    requirement: {
      type: 'quest_count',
      value: 25
    },
    reward: {
      xp: 1000,
      stat: 'mut',
      statValue: 5,
      title: 'Legende'
    }
  },
  {
    id: 'wise_choices',
    name: 'Weise Entscheidungen',
    description: 'Wähle 5x Weisheits-Optionen',
    icon: '🦉',
    category: 'story',
    rarity: 'uncommon',
    requirement: {
      type: 'choice_type',
      value: 5,
      details: 'weisheit'
    },
    reward: {
      xp: 150,
      stat: 'weisheit',
      statValue: 3
    }
  },
  {
    id: 'brave_heart',
    name: 'Tapferes Herz',
    description: 'Wähle 5x Mut-Optionen',
    icon: '🦁',
    category: 'story',
    rarity: 'uncommon',
    requirement: {
      type: 'choice_type',
      value: 5,
      details: 'mut'
    },
    reward: {
      xp: 150,
      stat: 'mut',
      statValue: 3
    }
  },

  // PROGRESSION CATEGORY
  {
    id: 'level_5',
    name: 'Level 5 Erreicht',
    description: 'Erreiche Level 5',
    icon: '⭐',
    category: 'progression',
    rarity: 'common',
    requirement: {
      type: 'level',
      value: 5
    },
    reward: {
      xp: 100
    }
  },
  {
    id: 'level_10',
    name: 'Level 10 Erreicht',
    description: 'Erreiche Level 10',
    icon: '⭐⭐',
    category: 'progression',
    rarity: 'uncommon',
    requirement: {
      type: 'level',
      value: 10
    },
    reward: {
      xp: 250,
      title: 'Veteran'
    }
  },
  {
    id: 'level_25',
    name: 'Meister der Reise',
    description: 'Erreiche Level 25',
    icon: '🌟',
    category: 'progression',
    rarity: 'epic',
    requirement: {
      type: 'level',
      value: 25
    },
    reward: {
      xp: 1000,
      title: 'Meister'
    }
  },
  {
    id: 'stat_master',
    name: 'Stat Meister',
    description: 'Erreiche 100 Gesamt-Stats',
    icon: '📊',
    category: 'progression',
    rarity: 'rare',
    requirement: {
      type: 'stat_total',
      value: 100
    },
    reward: {
      xp: 500,
      stat: 'weisheit',
      statValue: 5
    }
  },
  {
    id: 'balanced_soul',
    name: 'Ausgeglichene Seele',
    description: 'Habe alle Stats auf mindestens 15',
    icon: '☯️',
    category: 'progression',
    rarity: 'epic',
    requirement: {
      type: 'custom',
      value: 15,
      details: 'all_stats_min'
    },
    reward: {
      xp: 750,
      title: 'Ausgeglichen'
    }
  },

  // WISDOM CATEGORY
  {
    id: 'philosopher',
    name: 'Philosoph',
    description: 'Erreiche 25 Weisheit',
    icon: '🧙',
    category: 'wisdom',
    rarity: 'uncommon',
    requirement: {
      type: 'custom',
      value: 25,
      details: 'stat_weisheit'
    },
    reward: {
      xp: 200,
      stat: 'weisheit',
      statValue: 2,
      title: 'Philosoph'
    }
  },
  {
    id: 'enlightened',
    name: 'Erleuchtet',
    description: 'Erreiche 30 Bewusstsein',
    icon: '💡',
    category: 'wisdom',
    rarity: 'rare',
    requirement: {
      type: 'custom',
      value: 30,
      details: 'stat_bewusstsein'
    },
    reward: {
      xp: 500,
      stat: 'bewusstsein',
      statValue: 3,
      title: 'Erleuchteter'
    }
  },
  {
    id: 'peaceful_warrior',
    name: 'Friedvoller Krieger',
    description: 'Erreiche 25 Frieden',
    icon: '🕊️',
    category: 'wisdom',
    rarity: 'uncommon',
    requirement: {
      type: 'custom',
      value: 25,
      details: 'stat_frieden'
    },
    reward: {
      xp: 200,
      stat: 'frieden',
      statValue: 2
    }
  },
  {
    id: 'love_incarnate',
    name: 'Liebe in Person',
    description: 'Erreiche 30 Liebe',
    icon: '💖',
    category: 'wisdom',
    rarity: 'rare',
    requirement: {
      type: 'custom',
      value: 30,
      details: 'stat_liebe'
    },
    reward: {
      xp: 500,
      stat: 'liebe',
      statValue: 3,
      title: 'Liebling'
    }
  },

  // HIDDEN ACHIEVEMENTS
  {
    id: 'idle_master',
    name: 'Idle Meister',
    description: 'Sammle 500 XP durch Idle Time',
    icon: '😴',
    category: 'hidden',
    rarity: 'rare',
    hidden: true,
    requirement: {
      type: 'idle_time',
      value: 500
    },
    reward: {
      xp: 300,
      title: 'Idle König'
    }
  },
  {
    id: 'dedicated',
    name: 'Hingabe',
    description: 'Logge dich 7 Tage in Folge ein',
    icon: '🔥',
    category: 'hidden',
    rarity: 'epic',
    hidden: true,
    requirement: {
      type: 'login_streak',
      value: 7
    },
    reward: {
      xp: 500,
      stat: 'mut',
      statValue: 3,
      title: 'Beständig'
    }
  },
  {
    id: 'early_bird',
    name: 'Früher Vogel',
    description: 'Spiele vor 6 Uhr morgens',
    icon: '🌅',
    category: 'hidden',
    rarity: 'uncommon',
    hidden: true,
    requirement: {
      type: 'custom',
      value: 1,
      details: 'early_morning'
    },
    reward: {
      xp: 100,
      badge: '🌅 Frühaufsteher'
    }
  },
  {
    id: 'night_owl',
    name: 'Nachteule',
    description: 'Spiele nach Mitternacht',
    icon: '🦉',
    category: 'hidden',
    rarity: 'uncommon',
    hidden: true,
    requirement: {
      type: 'custom',
      value: 1,
      details: 'late_night'
    },
    reward: {
      xp: 100,
      badge: '🦉 Nachtaktiv'
    }
  },
  {
    id: 'completionist',
    name: 'Vollender',
    description: 'Schalte alle anderen Achievements frei',
    icon: '🏆',
    category: 'hidden',
    rarity: 'legendary',
    hidden: true,
    requirement: {
      type: 'custom',
      value: 24,
      details: 'all_achievements'
    },
    reward: {
      xp: 2000,
      title: '🏆 Vollender',
      badge: '🏆'
    }
  }
]

// Helper function to get achievement by ID
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id)
}

// Helper function to get achievements by category
export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.category === category)
}

// Helper function to get achievements by rarity
export function getAchievementsByRarity(rarity: AchievementRarity): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.rarity === rarity)
}

// Rarity colors for UI
export const RARITY_COLORS = {
  common: '#9ca3af',      // gray
  uncommon: '#10b981',    // green
  rare: '#3b82f6',        // blue
  epic: '#a855f7',        // purple
  legendary: '#f59e0b'    // gold
}

// Rarity display names
export const RARITY_NAMES = {
  common: 'Gewöhnlich',
  uncommon: 'Ungewöhnlich',
  rare: 'Selten',
  epic: 'Episch',
  legendary: 'Legendär'
}
