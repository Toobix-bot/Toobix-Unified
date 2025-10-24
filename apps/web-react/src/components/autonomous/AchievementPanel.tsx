'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Trophy, Star, Award, Target, Zap, RefreshCw } from 'lucide-react'

interface Achievement {
  id: string
  name: string
  description: string
  category: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  progress: number
  total: number
  unlocked: boolean
  unlockedAt?: string
}

interface AchievementStats {
  totalAchievements: number
  unlockedAchievements: number
  points: number
  level: number
  nextLevelPoints: number
  achievements: Achievement[]
}

export function AchievementPanel() {
  const [stats, setStats] = useState<AchievementStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:9998/achievements')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      // Mock data for demonstration
      setStats({
        totalAchievements: 24,
        unlockedAchievements: 8,
        points: 1250,
        level: 5,
        nextLevelPoints: 1500,
        achievements: [
          {
            id: 'first_mod',
            name: 'First Self-Modification',
            description: 'Successfully completed your first AI-powered code modification',
            category: 'self-coding',
            tier: 'gold',
            progress: 1,
            total: 1,
            unlocked: true,
            unlockedAt: '2025-10-24T12:30:00Z'
          },
          {
            id: 'consciousness_master',
            name: 'Consciousness Master',
            description: 'Maintained 14/14 conscious processes for 1 hour',
            category: 'consciousness',
            tier: 'platinum',
            progress: 42,
            total: 60,
            unlocked: false
          },
          {
            id: 'blocks_mined',
            name: 'Block Breaker',
            description: 'Mine 100 blocks in BlockWorld',
            category: 'blockworld',
            tier: 'bronze',
            progress: 67,
            total: 100,
            unlocked: false
          },
          {
            id: 'eternal_guardian',
            name: 'Eternal Guardian',
            description: 'Run Eternal Daemon for 24 hours continuously',
            category: 'uptime',
            tier: 'platinum',
            progress: 8,
            total: 24,
            unlocked: false
          },
          {
            id: 'high_confidence',
            name: 'High Confidence',
            description: 'Generate a modification with 90%+ confidence',
            category: 'self-coding',
            tier: 'gold',
            progress: 1,
            total: 1,
            unlocked: true,
            unlockedAt: '2025-10-24T13:00:00Z'
          }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading achievements...</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-12 text-center text-red-600">
          <p className="text-lg font-medium">Failed to load achievements</p>
          <Button onClick={fetchStats} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const completionPercentage = (stats.unlockedAchievements / stats.totalAchievements) * 100
  const levelProgress = (stats.points / stats.nextLevelPoints) * 100

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'from-gray-400 to-gray-600'
      case 'gold': return 'from-yellow-400 to-yellow-600'
      case 'silver': return 'from-gray-300 to-gray-400'
      case 'bronze': return 'from-orange-400 to-orange-600'
      default: return 'from-gray-200 to-gray-300'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'platinum': return <Award className="w-5 h-5" />
      case 'gold': return <Trophy className="w-5 h-5" />
      case 'silver': return <Star className="w-5 h-5" />
      case 'bronze': return <Target className="w-5 h-5" />
      default: return <Zap className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-600 animate-bounce" />
                Achievement System
              </CardTitle>
              <CardDescription>
                Track your progress and unlock rewards
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchStats}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-4xl font-bold text-yellow-600">{stats.level}</div>
              <div className="text-sm text-muted-foreground mt-1">Level</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-4xl font-bold text-orange-600">{stats.points}</div>
              <div className="text-sm text-muted-foreground mt-1">Points</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-4xl font-bold text-green-600">{stats.unlockedAchievements}</div>
              <div className="text-sm text-muted-foreground mt-1">Unlocked</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-4xl font-bold text-blue-600">{completionPercentage.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground mt-1">Completion</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Level {stats.level} Progress</span>
              <span className="text-sm text-muted-foreground">
                {stats.points}/{stats.nextLevelPoints} XP
              </span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Achievements List */}
      <Card>
        <CardHeader>
          <CardTitle>All Achievements</CardTitle>
          <CardDescription>
            {stats.unlockedAchievements} of {stats.totalAchievements} unlocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {stats.achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`${
                  achievement.unlocked
                    ? `bg-gradient-to-r ${getTierColor(achievement.tier)} text-white`
                    : 'bg-gray-50 opacity-60'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-white/20' : 'bg-gray-200'}`}>
                        {getTierIcon(achievement.tier)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{achievement.name}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">
                          {achievement.tier.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    {achievement.unlocked && (
                      <Trophy className="w-6 h-6 animate-pulse" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-white/90' : 'text-muted-foreground'}`}>
                    {achievement.description}
                  </p>
                  {!achievement.unlocked && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span className="font-medium">
                          {achievement.progress}/{achievement.total}
                        </span>
                      </div>
                      <Progress
                        value={(achievement.progress / achievement.total) * 100}
                        className="h-2"
                      />
                    </div>
                  )}
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-white/75 mt-2">
                      Unlocked: {new Date(achievement.unlockedAt).toLocaleString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
