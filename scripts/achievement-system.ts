#!/usr/bin/env bun
/**
 * ACHIEVEMENT SYSTEM
 * 
 * Vollständiges Gamification-System:
 * - Achievements/Badges definieren
 * - Progress tracking
 * - Unlock notifications
 * - Integration mit Tasks, Games, XP
 * 
 * Port: 9998
 */

import { serve } from 'bun'
import { Database } from 'bun:sqlite'
import { join } from 'path'

// ==================== TYPES ====================

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'tasks' | 'games' | 'social' | 'system' | 'special'
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary'
  points: number
  requirement: {
    type: string
    target: number
    current?: number
  }
  unlocked: boolean
  unlockedAt?: Date
  progress: number // 0-100
}

// ==================== ACHIEVEMENT DEFINITIONS ====================

const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  // TASK ACHIEVEMENTS
  {
    id: 'first_task',
    name: 'First Steps',
    description: 'Complete your first task',
    icon: '✅',
    category: 'tasks',
    tier: 'bronze',
    points: 10,
    requirement: { type: 'tasks_completed', target: 1 }
  },
  {
    id: 'task_warrior',
    name: 'Task Warrior',
    description: 'Complete 10 tasks',
    icon: '⚔️',
    category: 'tasks',
    tier: 'silver',
    points: 50,
    requirement: { type: 'tasks_completed', target: 10 }
  },
  {
    id: 'task_master',
    name: 'Task Master',
    description: 'Complete 50 tasks',
    icon: '👑',
    category: 'tasks',
    tier: 'gold',
    points: 200,
    requirement: { type: 'tasks_completed', target: 50 }
  },
  {
    id: 'task_legend',
    name: 'Task Legend',
    description: 'Complete 100 tasks',
    icon: '🏆',
    category: 'tasks',
    tier: 'platinum',
    points: 500,
    requirement: { type: 'tasks_completed', target: 100 }
  },
  {
    id: 'streak_3',
    name: 'Getting Started',
    description: 'Complete tasks 3 days in a row',
    icon: '🔥',
    category: 'tasks',
    tier: 'bronze',
    points: 30,
    requirement: { type: 'streak_days', target: 3 }
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Complete tasks 7 days in a row',
    icon: '🔥🔥',
    category: 'tasks',
    tier: 'silver',
    points: 100,
    requirement: { type: 'streak_days', target: 7 }
  },
  {
    id: 'streak_30',
    name: 'Consistency King',
    description: 'Complete tasks 30 days in a row',
    icon: '🔥🔥🔥',
    category: 'tasks',
    tier: 'gold',
    points: 500,
    requirement: { type: 'streak_days', target: 30 }
  },

  // LEVEL ACHIEVEMENTS
  {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '⭐',
    category: 'system',
    tier: 'bronze',
    points: 50,
    requirement: { type: 'level_reached', target: 5 }
  },
  {
    id: 'level_10',
    name: 'Veteran',
    description: 'Reach level 10',
    icon: '⭐⭐',
    category: 'system',
    tier: 'silver',
    points: 150,
    requirement: { type: 'level_reached', target: 10 }
  },
  {
    id: 'level_25',
    name: 'Elite',
    description: 'Reach level 25',
    icon: '⭐⭐⭐',
    category: 'system',
    tier: 'gold',
    points: 500,
    requirement: { type: 'level_reached', target: 25 }
  },
  {
    id: 'level_50',
    name: 'Legendary',
    description: 'Reach level 50',
    icon: '💫',
    category: 'system',
    tier: 'legendary',
    points: 2000,
    requirement: { type: 'level_reached', target: 50 }
  },

  // GAME ACHIEVEMENTS
  {
    id: 'game_master',
    name: 'Game Master',
    description: 'Play all 6 games',
    icon: '🎮',
    category: 'games',
    tier: 'silver',
    points: 100,
    requirement: { type: 'games_played', target: 6 }
  },
  {
    id: 'tictactoe_win',
    name: 'Tic-Tac-Toe Champion',
    description: 'Win a game of Tic-Tac-Toe',
    icon: '❌⭕',
    category: 'games',
    tier: 'bronze',
    points: 20,
    requirement: { type: 'tictactoe_wins', target: 1 }
  },
  {
    id: 'quiz_perfect',
    name: 'Quiz Master',
    description: 'Get all questions correct in Quiz',
    icon: '🧠',
    category: 'games',
    tier: 'gold',
    points: 100,
    requirement: { type: 'quiz_perfect', target: 1 }
  },
  {
    id: 'memory_expert',
    name: 'Memory Expert',
    description: 'Complete Memory game in under 30 seconds',
    icon: '🃏',
    category: 'games',
    tier: 'gold',
    points: 150,
    requirement: { type: 'memory_fast', target: 1 }
  },
  {
    id: 'snake_long',
    name: 'Snake Master',
    description: 'Reach length 20 in Snake',
    icon: '🐍',
    category: 'games',
    tier: 'silver',
    points: 80,
    requirement: { type: 'snake_length', target: 20 }
  },
  {
    id: '2048_tile',
    name: '2048 Champion',
    description: 'Create a 2048 tile',
    icon: '🏁',
    category: 'games',
    tier: 'gold',
    points: 200,
    requirement: { type: '2048_tile', target: 2048 }
  },
  {
    id: 'typing_fast',
    name: 'Speed Demon',
    description: 'Type 60 WPM in Typing Test',
    icon: '⚡',
    category: 'games',
    tier: 'silver',
    points: 100,
    requirement: { type: 'typing_wpm', target: 60 }
  },

  // BLOCKWORLD ACHIEVEMENTS
  {
    id: 'first_block_mined',
    name: 'First Mine',
    description: 'Break your first block in BlockWorld',
    icon: '⛏️',
    category: 'games',
    tier: 'bronze',
    points: 10,
    requirement: { type: 'blocks_broken', target: 1 }
  },
  {
    id: 'tree_chopper',
    name: 'Lumberjack',
    description: 'Chop down a tree (break 10 wood blocks)',
    icon: '🪓',
    category: 'games',
    tier: 'bronze',
    points: 20,
    requirement: { type: 'wood_chopped', target: 10 }
  },
  {
    id: 'builder',
    name: 'Builder',
    description: 'Place 100 blocks',
    icon: '🧱',
    category: 'games',
    tier: 'silver',
    points: 50,
    requirement: { type: 'blocks_placed', target: 100 }
  },
  {
    id: 'house_builder',
    name: 'Architect',
    description: 'Build a house (place 50 blocks)',
    icon: '🏠',
    category: 'games',
    tier: 'silver',
    points: 80,
    requirement: { type: 'blocks_placed', target: 50 }
  },
  {
    id: 'deep_miner',
    name: 'Deep Miner',
    description: 'Mine at depth Y < 10',
    icon: '💎',
    category: 'games',
    tier: 'gold',
    points: 150,
    requirement: { type: 'deep_mine', target: 1 }
  },
  {
    id: 'block_master',
    name: 'Block Master',
    description: 'Break 1000 blocks total',
    icon: '👑',
    category: 'games',
    tier: 'platinum',
    points: 500,
    requirement: { type: 'blocks_broken', target: 1000 }
  },
  {
    id: 'ai_architect',
    name: 'AI Architect',
    description: 'Watch AI build a structure (AI places 27 blocks)',
    icon: '🤖',
    category: 'games',
    tier: 'gold',
    points: 200,
    requirement: { type: 'ai_blocks_placed', target: 27 }
  },

  // SOCIAL ACHIEVEMENTS
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Add 10 people to circles',
    icon: '👥',
    category: 'social',
    tier: 'silver',
    points: 80,
    requirement: { type: 'people_count', target: 10 }
  },
  {
    id: 'love_giver',
    name: 'Love Giver',
    description: 'Give 100 love points',
    icon: '❤️',
    category: 'social',
    tier: 'gold',
    points: 150,
    requirement: { type: 'love_points_given', target: 100 }
  },
  {
    id: 'interaction_king',
    name: 'Interaction King',
    description: 'Log 50 interactions',
    icon: '💬',
    category: 'social',
    tier: 'silver',
    points: 100,
    requirement: { type: 'interactions_count', target: 50 }
  },

  // SYSTEM ACHIEVEMENTS
  {
    id: 'luna_friend',
    name: 'Luna\'s Friend',
    description: 'Chat with Luna 10 times',
    icon: '🤖',
    category: 'system',
    tier: 'bronze',
    points: 50,
    requirement: { type: 'luna_chats', target: 10 }
  },
  {
    id: 'moment_keeper',
    name: 'Moment Keeper',
    description: 'Capture 50 moments',
    icon: '✨',
    category: 'system',
    tier: 'silver',
    points: 100,
    requirement: { type: 'moments_count', target: 50 }
  },
  {
    id: 'memory_palace',
    name: 'Memory Palace',
    description: 'Store 100 memories',
    icon: '🧠',
    category: 'system',
    tier: 'gold',
    points: 200,
    requirement: { type: 'memories_count', target: 100 }
  },

  // SPECIAL ACHIEVEMENTS
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete a task before 6 AM',
    icon: '🌅',
    category: 'special',
    tier: 'bronze',
    points: 30,
    requirement: { type: 'task_early_morning', target: 1 }
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a task after midnight',
    icon: '🦉',
    category: 'special',
    tier: 'bronze',
    points: 30,
    requirement: { type: 'task_late_night', target: 1 }
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete 10 tasks with high priority',
    icon: '💎',
    category: 'special',
    tier: 'gold',
    points: 150,
    requirement: { type: 'high_priority_tasks', target: 10 }
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Visit all dashboard views',
    icon: '🗺️',
    category: 'special',
    tier: 'bronze',
    points: 50,
    requirement: { type: 'views_visited', target: 12 }
  }
]

// ==================== DATABASE ====================

class AchievementDatabase {
  private db: Database

  constructor() {
    const dataPath = join(import.meta.dir, '../data')
    this.db = new Database(join(dataPath, 'achievements.db'))
    this.init()
  }

  private init() {
    // User achievements
    this.db.run(`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id TEXT PRIMARY KEY,
        unlocked INTEGER DEFAULT 0,
        unlocked_at INTEGER,
        progress REAL DEFAULT 0,
        current_value INTEGER DEFAULT 0
      )
    `)

    // Achievement progress history
    this.db.run(`
      CREATE TABLE IF NOT EXISTS achievement_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        achievement_id TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        old_value INTEGER,
        new_value INTEGER,
        progress REAL
      )
    `)

    // Stats tracking
    this.db.run(`
      CREATE TABLE IF NOT EXISTS user_stats (
        key TEXT PRIMARY KEY,
        value INTEGER DEFAULT 0
      )
    `)

    // Initialize achievements
    for (const achievement of ACHIEVEMENTS) {
      this.db.run(`
        INSERT OR IGNORE INTO user_achievements (id)
        VALUES (?)
      `, [achievement.id])
    }

    console.log(`✅ Achievement database initialized with ${ACHIEVEMENTS.length} achievements`)
  }

  getAllAchievements(): Achievement[] {
    const rows = this.db.query(`
      SELECT * FROM user_achievements
    `).all() as any[]

    return ACHIEVEMENTS.map(def => {
      const row = rows.find(r => r.id === def.id)
      return {
        ...def,
        unlocked: row?.unlocked === 1,
        unlockedAt: row?.unlocked_at ? new Date(row.unlocked_at) : undefined,
        progress: row?.progress || 0,
        requirement: {
          ...def.requirement,
          current: row?.current_value || 0
        }
      }
    })
  }

  getAchievement(id: string): Achievement | null {
    const def = ACHIEVEMENTS.find(a => a.id === id)
    if (!def) return null

    const row = this.db.query(`
      SELECT * FROM user_achievements WHERE id = ?
    `).get(id) as any

    if (!row) return null

    return {
      ...def,
      unlocked: row.unlocked === 1,
      unlockedAt: row.unlocked_at ? new Date(row.unlocked_at) : undefined,
      progress: row.progress || 0,
      requirement: {
        ...def.requirement,
        current: row.current_value || 0
      }
    }
  }

  updateProgress(achievementId: string, newValue: number): Achievement | null {
    const achievement = this.getAchievement(achievementId)
    if (!achievement) return null

    const target = achievement.requirement.target
    const progress = Math.min(100, (newValue / target) * 100)
    const shouldUnlock = newValue >= target && !achievement.unlocked

    // Update achievement
    this.db.run(`
      UPDATE user_achievements
      SET current_value = ?, progress = ?, unlocked = ?, unlocked_at = ?
      WHERE id = ?
    `, [
      newValue,
      progress,
      shouldUnlock ? 1 : (achievement.unlocked ? 1 : 0),
      shouldUnlock ? Date.now() : (achievement.unlockedAt?.getTime() || null),
      achievementId
    ])

    // Log progress
    this.db.run(`
      INSERT INTO achievement_progress (achievement_id, timestamp, old_value, new_value, progress)
      VALUES (?, ?, ?, ?, ?)
    `, [
      achievementId,
      Date.now(),
      achievement.requirement.current || 0,
      newValue,
      progress
    ])

    return this.getAchievement(achievementId)
  }

  getStat(key: string): number {
    const row = this.db.query(`
      SELECT value FROM user_stats WHERE key = ?
    `).get(key) as any

    return row?.value || 0
  }

  incrementStat(key: string, amount: number = 1): number {
    this.db.run(`
      INSERT INTO user_stats (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = value + ?
    `, [key, amount, amount])

    return this.getStat(key)
  }

  getStats() {
    const unlocked = this.db.query(`
      SELECT COUNT(*) as count FROM user_achievements WHERE unlocked = 1
    `).get() as any
    
    // Calculate total points manually
    const unlockedAchievements = this.db.query(`
      SELECT id FROM user_achievements WHERE unlocked = 1
    `).all() as any[]
    
    const totalPoints = ACHIEVEMENTS
      .filter(a => unlockedAchievements.some(u => u.id === a.id))
      .reduce((sum, a) => sum + (a.points || 0), 0)
    
    // Calculate level from XP
    const xp = totalPoints
    const level = Math.floor(xp / 100) + 1
    
    return {
      totalAchievements: ACHIEVEMENTS.length,
      unlockedAchievements: unlocked.count,
      totalPoints,
      xp,
      level,
      xpToNextLevel: (level * 100) - xp
    }
  }
}

// ==================== SERVER ====================

const db = new AchievementDatabase()

const server = serve({
  port: 9998,
  async fetch(req) {
    const url = new URL(req.url)
    const path = url.pathname

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    }

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers })
    }

    try {
      // Get all achievements
      if (path === '/achievements' && req.method === 'GET') {
        const category = url.searchParams.get('category')
        const unlocked = url.searchParams.get('unlocked')

        let achievements = db.getAllAchievements()

        if (category) {
          achievements = achievements.filter(a => a.category === category)
        }

        if (unlocked === 'true') {
          achievements = achievements.filter(a => a.unlocked)
        } else if (unlocked === 'false') {
          achievements = achievements.filter(a => !a.unlocked)
        }

        return Response.json({ achievements }, { headers })
      }

      // Get single achievement
      if (path.startsWith('/achievements/') && req.method === 'GET') {
        const id = path.split('/')[2]
        const achievement = db.getAchievement(id)

        if (!achievement) {
          return Response.json({ error: 'Achievement not found' }, { status: 404, headers })
        }

        return Response.json(achievement, { headers })
      }

      // Update achievement progress
      if (path.startsWith('/achievements/') && path.endsWith('/progress') && req.method === 'POST') {
        const id = path.split('/')[2]
        const { value } = await req.json()

        const achievement = db.updateProgress(id, value)

        if (!achievement) {
          return Response.json({ error: 'Achievement not found' }, { status: 404, headers })
        }

        return Response.json({ 
          achievement,
          unlocked: achievement.unlocked && achievement.progress === 100
        }, { headers })
      }

      // Track event (auto-updates related achievements)
      if (path === '/track' && req.method === 'POST') {
        const { event, value = 1 } = await req.json()

        const newValue = db.incrementStat(event, value)

        // Find achievements that match this event
        const relatedAchievements = ACHIEVEMENTS.filter(a => 
          a.requirement.type === event
        )

        const updated = relatedAchievements.map(a => 
          db.updateProgress(a.id, newValue)
        ).filter(Boolean)

        const newlyUnlocked = updated.filter(a => 
          a && a.unlocked && a.progress === 100
        )

        return Response.json({ 
          event,
          value: newValue,
          updated: updated.length,
          unlocked: newlyUnlocked
        }, { headers })
      }

      // Get statistics
      if (path === '/stats' && req.method === 'GET') {
        const stats = db.getStats()
        return Response.json(stats, { headers })
      }

      // Health check
      if (path === '/health' && req.method === 'GET') {
        return Response.json({ 
          status: 'ok',
          service: 'Achievement System',
          port: 9998
        }, { headers })
      }

      return Response.json({ error: 'Not found' }, { status: 404, headers })

    } catch (error) {
      console.error('❌ Server error:', error)
      return Response.json({ 
        error: String(error) 
      }, { 
        status: 500,
        headers 
      })
    }
  }
})

console.log('🏆 ACHIEVEMENT SYSTEM')
console.log('━'.repeat(50))
console.log(`🚀 Running on: http://localhost:${server.port}`)
console.log(`📊 Total Achievements: ${ACHIEVEMENTS.length}`)
console.log(`📝 API Endpoints:`)
console.log(`   GET  /achievements - All achievements`)
console.log(`   GET  /achievements?category=tasks - Filter by category`)
console.log(`   GET  /achievements?unlocked=true - Filter by status`)
console.log(`   GET  /achievements/:id - Single achievement`)
console.log(`   POST /achievements/:id/progress - Update progress`)
console.log(`   POST /track - Track event (auto-updates)`)
console.log(`   GET  /stats - Overall statistics`)
console.log('━'.repeat(50))
console.log('🎮 Ready to track achievements!')
