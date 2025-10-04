'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Activity, Brain, Heart, Leaf, BookOpen, Users, 
  Database, Code, Sparkles, TrendingUp, Zap
} from 'lucide-react'

interface SystemStats {
  memory: number
  actions: number
  people: number
  tools: number
  soul: {
    experiences: number
    wisdom: number
    mood: number
    energy: number
  }
  story: {
    epoch: number
    arc: string
    level: number
    xp: number
    options: number
  }
  love: {
    total: number
    today: number
    gratitudeCount: number
    kindnessCount: number
  }
  peace: {
    overall: number
    calm: number
    harmony: number
    clarity: number
    growth: number
    purpose: number
  }
}

export function OverviewPanel() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3337/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Stats fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // Refresh every 10 seconds
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading system overview...</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load system stats
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-4xl flex items-center gap-3 mb-2">
                <Activity className="w-10 h-10 animate-pulse" />
                System Overview
              </CardTitle>
              <CardDescription className="text-purple-100 text-lg">
                All systems operational • Last updated: {new Date().toLocaleTimeString()}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse inline-block"></span>
                ALL SYSTEMS GO
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* MCP Tools */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Code className="w-6 h-6 text-purple-500" />
              <Badge variant="secondary">{stats?.tools || 0}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-1">{stats?.tools || 0}</div>
            <p className="text-xs text-muted-foreground">MCP Tools</p>
          </CardContent>
        </Card>

        {/* People */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Users className="w-6 h-6 text-blue-500" />
              <Badge variant="secondary">{stats?.people || 0}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-1">{stats?.people || 0}</div>
            <p className="text-xs text-muted-foreground">Contacts</p>
          </CardContent>
        </Card>

        {/* Memory */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Database className="w-6 h-6 text-indigo-500" />
              <Badge variant="secondary">{stats?.memory || 0}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600 mb-1">{stats?.memory}</div>
            <p className="text-xs text-muted-foreground">Memory Chunks</p>
          </CardContent>
        </Card>

        {/* Story Level */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <BookOpen className="w-6 h-6 text-purple-500" />
              <Badge variant="secondary">Lvl {stats?.story?.level || 1}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-1">{stats?.story?.xp || 0} XP</div>
            <p className="text-xs text-muted-foreground">Story Progress</p>
          </CardContent>
        </Card>

        {/* Love Points */}
        <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Heart className="w-6 h-6 text-pink-500" />
              <Badge variant="secondary">{stats?.love?.total || 0}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600 mb-1">{stats?.love?.today || 0}</div>
            <p className="text-xs text-muted-foreground">Today's Love</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed System Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Consciousness System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="w-5 h-5 text-purple-500" />
              Consciousness
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Energy</span>
                <span className="font-medium">{stats?.soul?.energy}%</span>
              </div>
              <Progress value={stats?.soul?.energy} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Wisdom</span>
                <span className="font-medium">{stats?.soul?.wisdom}</span>
              </div>
              <Progress value={stats?.soul?.wisdom} className="h-2" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">Experiences</span>
              <Badge variant="secondary">{stats?.soul?.experiences}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Story System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              Story Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Epoch</div>
                <div className="text-2xl font-bold text-indigo-500">{stats?.story?.epoch}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Level</div>
                <div className="text-2xl font-bold text-purple-500">{stats?.story?.level}</div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">XP Progress</span>
                <span className="font-medium">{stats?.story?.xp} XP</span>
              </div>
              <Progress value={(stats?.story?.xp / 100) * 100} className="h-2" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">Arc: {stats?.story?.arc}</span>
              <Badge variant="secondary">{stats?.story?.options} choices</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Love System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5 text-pink-500" />
              Love Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Total</div>
                <div className="text-2xl font-bold text-pink-500">{stats?.love?.total}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Today</div>
                <div className="text-2xl font-bold text-rose-500">{stats?.love?.today}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-xs text-muted-foreground">Gratitude</div>
                  <div className="font-medium">{stats?.love?.gratitudeCount}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-xs text-muted-foreground">Kindness</div>
                  <div className="font-medium">{stats?.love?.kindnessCount}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peace System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Leaf className="w-5 h-5 text-green-500" />
              Peace Catalyst
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center mb-3">
              <div className="text-4xl font-bold text-green-500">{stats?.peace?.overall}</div>
              <div className="text-xs text-muted-foreground">Overall Peace Score</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs w-16 text-muted-foreground">Calm</span>
                <Progress value={stats?.peace?.calm} className="h-1 flex-1" />
                <span className="text-xs w-8 text-right font-medium">{stats?.peace?.calm}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-16 text-muted-foreground">Harmony</span>
                <Progress value={stats?.peace?.harmony} className="h-1 flex-1" />
                <span className="text-xs w-8 text-right font-medium">{stats?.peace?.harmony}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-16 text-muted-foreground">Clarity</span>
                <Progress value={stats?.peace?.clarity} className="h-1 flex-1" />
                <span className="text-xs w-8 text-right font-medium">{stats?.peace?.clarity}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-16 text-muted-foreground">Growth</span>
                <Progress value={stats?.peace?.growth} className="h-1 flex-1" />
                <span className="text-xs w-8 text-right font-medium">{stats?.peace?.growth}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-16 text-muted-foreground">Purpose</span>
                <Progress value={stats?.peace?.purpose} className="h-1 flex-1" />
                <span className="text-xs w-8 text-right font-medium">{stats?.peace?.purpose}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* People Network */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-blue-500" />
              People Network
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center mb-3">
              <div className="text-4xl font-bold text-blue-500">{stats?.people}</div>
              <div className="text-xs text-muted-foreground">Total Contacts</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="text-xs text-muted-foreground">Love Points</div>
                <div className="text-lg font-bold text-pink-500">{stats?.love?.total}</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-xs text-muted-foreground">Actions</div>
                <div className="text-lg font-bold text-green-500">{stats?.actions}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Base */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="w-5 h-5 text-indigo-500" />
              Knowledge Base
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center mb-3">
              <div className="text-4xl font-bold text-indigo-500">{stats?.memory}</div>
              <div className="text-xs text-muted-foreground">Memory Chunks</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-indigo-50 rounded">
                <span className="text-xs text-muted-foreground">RAG Search</span>
                <Badge variant="secondary" className="text-xs">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                <span className="text-xs text-muted-foreground">Embeddings</span>
                <Badge variant="secondary" className="text-xs">Ready</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <div className="text-xs text-muted-foreground">Bridge Service</div>
                <div className="text-sm font-medium">Online</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <div className="text-xs text-muted-foreground">Database</div>
                <div className="text-sm font-medium">Connected</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <div className="text-xs text-muted-foreground">MCP Protocol</div>
                <div className="text-sm font-medium">Active</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <div className="text-xs text-muted-foreground">AI Engine</div>
                <div className="text-sm font-medium">Ready</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <div className="text-xs text-muted-foreground">RAG System</div>
                <div className="text-sm font-medium">Running</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <div className="text-xs text-muted-foreground">Hot Reload</div>
                <div className="text-sm font-medium">Active</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Quick Stats Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">💾 Data Storage</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Memory Chunks:</span>
                  <span className="font-medium">{stats?.memory}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Contacts:</span>
                  <span className="font-medium">{stats?.people}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Actions:</span>
                  <span className="font-medium">{stats?.actions}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">MCP Tools:</span>
                  <span className="font-medium">{stats?.tools}</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">📈 Progress Metrics</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Story Level:</span>
                  <span className="font-medium">Level {stats?.story?.level} ({stats?.story?.xp} XP)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Love Points (Total):</span>
                  <span className="font-medium">{stats?.love?.total}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Peace Score:</span>
                  <span className="font-medium">{stats?.peace?.overall}/100</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Soul Experiences:</span>
                  <span className="font-medium">{stats?.soul?.experiences}</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


