/**
 * 🔍 System Analysis Tool
 * 
 * Analysiert die Gesundheit und Performance des Toobix-Systems
 */

import { Database } from 'bun:sqlite'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

export interface SystemHealthReport {
  status: 'excellent' | 'good' | 'warning' | 'critical'
  issues: string[]
  metrics: {
    database: {
      size: number
      tables: number
      records: number
    }
    consciousness: {
      awarenessLevel: number
      activeGoals: number
      recentThoughts: number
    }
    soul: {
      energy: number
      dominantEmotion: string
      emotionBalance: number
    }
    story: {
      level: number
      xp: number
      recentEvents: number
    }
    memory: {
      totalChunks: number
      recentSearches: number
    }
    peace: {
      meditationCount: number
      conflictsResolved: number
      growthMilestones: number
    }
    performance: {
      avgResponseTime: number
      errorRate: number
      uptime: number
    }
  }
  recommendations: string[]
  timestamp: number
}

export async function analyzeSystem(db: Database): Promise<SystemHealthReport> {
  const issues: string[] = []
  const recommendations: string[] = []
  
  // 1. Database Health
  const dbPath = 'C:/Toobix-Unified/data/toobix-unified.db'
  const dbSize = fs.existsSync(dbPath) ? fs.statSync(dbPath).size : 0
  
  const tables = db.prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'").get() as any
  const tableCount = tables?.count || 0
  
  // 2. Consciousness Metrics
  const consciousnessState = db.prepare(`
    SELECT awareness_level, is_awake 
    FROM consciousness_state 
    ORDER BY updated_at DESC 
    LIMIT 1
  `).get() as any
  
  const activeGoals = db.prepare("SELECT COUNT(*) as count FROM goals WHERE status = 'active'").get() as any
  const recentThoughts = db.prepare("SELECT COUNT(*) as count FROM thoughts WHERE created_at > datetime('now', '-24 hours')").get() as any
  
  const awarenessLevel = consciousnessState?.awareness_level || 0
  
  // Check consciousness health
  if (awarenessLevel < 20) {
    issues.push('Low awareness level (<20%)')
    recommendations.push('Increase system interactions to boost awareness')
  }
  
  // 3. Soul/Emotional State
  const soulState = db.prepare("SELECT * FROM soul_state ORDER BY created_at DESC LIMIT 1").get() as any
  
  let emotions: Record<string, number> = {}
  let energy = 50
  let dominantEmotion = 'calm'
  
  if (soulState) {
    try {
      const emotional = JSON.parse(soulState.emotional_state || '{}')
      emotions = emotional.emotions || {}
      energy = emotional.energy || 50
      
      const emotionEntries = Object.entries(emotions)
      if (emotionEntries.length > 0) {
        const sorted = emotionEntries.sort((a: any, b: any) => b[1] - a[1])
        dominantEmotion = sorted[0][0]
      }
    } catch (e) {}
  }
  
  // Calculate emotion balance (how evenly distributed)
  const emotionValues = Object.values(emotions)
  const emotionBalance = emotionValues.length > 0 
    ? 1 - (Math.max(...emotionValues) - Math.min(...emotionValues))
    : 1
  
  if (energy < 30) {
    issues.push('Low energy level (<30%)')
    recommendations.push('Schedule meditation or rest periods')
  }
  
  // 4. Story Progress
  const storyState = db.prepare("SELECT * FROM story_state ORDER BY updated_at DESC LIMIT 1").get() as any
  const recentEvents = db.prepare("SELECT COUNT(*) as count FROM story_events WHERE created_at > datetime('now', '-7 days')").get() as any
  
  const level = storyState?.current_level || 1
  const xp = storyState?.current_xp || 0
  
  if (recentEvents.count === 0) {
    recommendations.push('No recent story events - consider adding new narratives')
  }
  
  // 5. Memory System
  const memoryChunks = db.prepare("SELECT COUNT(*) as count FROM memory_chunks").get() as any
  const recentSearches = db.prepare("SELECT COUNT(*) as count FROM memory_searches WHERE created_at > datetime('now', '-24 hours')").get() as any
  
  if (memoryChunks.count === 0) {
    issues.push('No memory chunks stored')
    recommendations.push('Add memories to enable knowledge retrieval')
  }
  
  if (memoryChunks.count > 50000) {
    issues.push('Large memory database may slow searches')
    recommendations.push('Consider implementing memory pruning or archiving')
  }
  
  // 6. Peace System
  const meditations = db.prepare("SELECT COUNT(*) as count FROM peace_actions WHERE action_type = 'meditation'").get() as any
  const conflictsResolved = db.prepare("SELECT COUNT(*) as count FROM peace_conflicts WHERE resolution_status = 'resolved'").get() as any
  const growthMilestones = db.prepare("SELECT COUNT(*) as count FROM peace_growth WHERE milestone_reached = 1").get() as any
  
  // 7. Performance Metrics (simplified)
  const avgResponseTime = 150 // ms (placeholder - would need actual tracking)
  const errorRate = 0.02 // 2% (placeholder)
  const uptime = Date.now() - (consciousnessState?.created_at ? new Date(consciousnessState.created_at).getTime() : Date.now())
  
  if (avgResponseTime > 1000) {
    issues.push('High response times (>1s)')
    recommendations.push('Consider caching frequently accessed data')
  }
  
  if (errorRate > 0.05) {
    issues.push('High error rate (>5%)')
    recommendations.push('Review error logs and fix failing operations')
  }
  
  // Determine overall status
  let status: SystemHealthReport['status'] = 'excellent'
  if (issues.length === 0) {
    status = 'excellent'
  } else if (issues.length <= 2) {
    status = 'good'
  } else if (issues.length <= 5) {
    status = 'warning'
  } else {
    status = 'critical'
  }
  
  return {
    status,
    issues,
    metrics: {
      database: {
        size: dbSize,
        tables: tableCount,
        records: 0 // Would need to sum all tables
      },
      consciousness: {
        awarenessLevel,
        activeGoals: activeGoals.count,
        recentThoughts: recentThoughts.count
      },
      soul: {
        energy,
        dominantEmotion,
        emotionBalance
      },
      story: {
        level,
        xp,
        recentEvents: recentEvents.count
      },
      memory: {
        totalChunks: memoryChunks.count,
        recentSearches: recentSearches.count
      },
      peace: {
        meditationCount: meditations.count,
        conflictsResolved: conflictsResolved.count,
        growthMilestones: growthMilestones.count
      },
      performance: {
        avgResponseTime,
        errorRate,
        uptime
      }
    },
    recommendations,
    timestamp: Date.now()
  }
}
