'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BlockWorldPanel } from '@/components/autonomous/BlockWorldPanel'
import { PageTransition } from '@/components/transitions/PageTransition'
import {
  Home,
  Zap,
  Heart,
  Book,
  Sword,
  Brain,
  Leaf,
  MapPin,
  Package,
  Settings,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import Link from 'next/link'

interface PlayerStats {
  level: number
  xp: number
  xpToNext: number
  stats: {
    mut: number
    weisheit: number
    bewusstsein: number
    frieden: number
    liebe: number
  }
  currentArc: string
  health: number
  energy: number
}

interface Quest {
  id: string
  title: string
  description: string
  progress: number
  maxProgress: number
  reward: string
}

export default function WorldPage() {
  const [player, setPlayer] = useState<PlayerStats>({
    level: 1,
    xp: 0,
    xpToNext: 100,
    stats: {
      mut: 5,
      weisheit: 5,
      bewusstsein: 5,
      frieden: 5,
      liebe: 5
    },
    currentArc: 'Das Erwachen',
    health: 100,
    energy: 85
  })

  const [activeQuest, setActiveQuest] = useState<Quest>({
    id: 'gather-resources',
    title: 'Ressourcen sammeln',
    description: 'Sammle 10 Holzblöcke',
    progress: 0,
    maxProgress: 10,
    reward: '+50 XP, +1 Weisheit'
  })

  const [isStatsExpanded, setIsStatsExpanded] = useState(true)
  const [isQuestExpanded, setIsQuestExpanded] = useState(true)

  useEffect(() => {
    // Load player stats from API
    const loadPlayerStats = async () => {
      try {
        const response = await fetch('http://localhost:3337/story/state')
        if (response.ok) {
          const data = await response.json()
          const resources = data.resources || {}
          setPlayer(prev => ({
            ...prev,
            level: resources.level || 1,
            xp: resources.erfahrung || 0,
            xpToNext: (resources.level || 1) * 100,
            currentArc: data.arc || 'Das Erwachen',
            stats: {
              mut: resources.mut || prev.stats.mut,
              weisheit: resources.wissen || prev.stats.weisheit,
              bewusstsein: resources.bewusstsein || prev.stats.bewusstsein,
              frieden: resources.stabilitaet || prev.stats.frieden,
              liebe: resources.inspiration || prev.stats.liebe
            }
          }))
        }
      } catch (error) {
        console.error('Failed to load player stats:', error)
      }
    }

    loadPlayerStats()
    const interval = setInterval(loadPlayerStats, 10000) // Update every 10s

    return () => clearInterval(interval)
  }, [])

  const xpPercent = Math.min(100, (player.xp / player.xpToNext) * 100)
  const questPercent = Math.min(100, (activeQuest.progress / activeQuest.maxProgress) * 100)

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-900/95 to-transparent backdrop-blur-md border-b border-slate-700/50">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Home className="w-4 h-4 mr-2" />
              Zurück zum Hauptmenü
            </Button>
          </Link>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
              Level {player.level}
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-400/30">
              <Zap className="w-3 h-3 mr-1 inline" />
              {player.xp} XP
            </Badge>
          </div>
        </div>
      </div>

      {/* Left Sidebar - Character Stats */}
      <div className="absolute left-6 top-24 z-40 w-80 animate-slideInLeft">
        <Card className="bg-slate-900/90 backdrop-blur-lg border-slate-700/50 hover-lift">
          <CardContent className="p-4">
            <div
              className="flex items-center justify-between mb-3 cursor-pointer"
              onClick={() => setIsStatsExpanded(!isStatsExpanded)}
            >
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sword className="w-5 h-5 text-purple-400" />
                Charakter
              </h3>
              {isStatsExpanded ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </div>

            {isStatsExpanded && (
              <div className="space-y-3">
                {/* XP Progress */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>XP</span>
                    <span>{player.xp} / {player.xpToNext}</span>
                  </div>
                  <Progress value={xpPercent} className="h-2 bg-slate-800" />
                </div>

                {/* Health & Energy */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">❤️ Health</div>
                    <Progress value={player.health} className="h-2 bg-slate-800" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">⚡ Energy</div>
                    <Progress value={player.energy} className="h-2 bg-slate-800" />
                  </div>
                </div>

                {/* Stats */}
                <div className="pt-2 border-t border-slate-700/50">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      { key: 'mut', label: 'Mut', icon: '⚔️', color: 'text-red-400' },
                      { key: 'weisheit', label: 'Weisheit', icon: '📚', color: 'text-blue-400' },
                      { key: 'bewusstsein', label: 'Bewusstsein', icon: '🧠', color: 'text-purple-400' },
                      { key: 'frieden', label: 'Frieden', icon: '🕊️', color: 'text-green-400' },
                      { key: 'liebe', label: 'Liebe', icon: '💝', color: 'text-pink-400' }
                    ].slice(0, 4).map(stat => (
                      <div key={stat.key} className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
                        <span className="text-slate-400 text-xs">{stat.icon} {stat.label}</span>
                        <span className={`font-bold ${stat.color}`}>
                          {player.stats[stat.key as keyof typeof player.stats]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-between p-2 bg-slate-800/50 rounded text-sm">
                    <span className="text-slate-400 text-xs">💝 Liebe</span>
                    <span className="font-bold text-pink-400">{player.stats.liebe}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Active Quest */}
      <div className="absolute right-6 top-24 z-40 w-80 animate-slideInRight">
        <Card className="bg-slate-900/90 backdrop-blur-lg border-slate-700/50 mb-4 hover-lift">
          <CardContent className="p-4">
            <div
              className="flex items-center justify-between mb-3 cursor-pointer"
              onClick={() => setIsQuestExpanded(!isQuestExpanded)}
            >
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Book className="w-5 h-5 text-orange-400" />
                Aktive Quest
              </h3>
              {isQuestExpanded ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </div>

            {isQuestExpanded && (
              <div className="space-y-3">
                <div>
                  <h4 className="text-white font-medium mb-1">{activeQuest.title}</h4>
                  <p className="text-sm text-slate-400 mb-2">{activeQuest.description}</p>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Fortschritt</span>
                    <span>{activeQuest.progress} / {activeQuest.maxProgress}</span>
                  </div>
                  <Progress value={questPercent} className="h-2 bg-slate-800" />
                </div>

                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded">
                  <div className="text-xs text-slate-400 mb-1">Belohnung:</div>
                  <div className="text-sm text-orange-300">{activeQuest.reward}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-slate-900/90 backdrop-blur-lg border-slate-700/50 hover-lift">
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              Schnellaktionen
            </h3>
            <div className="space-y-2">
              <Link href="/story">
                <Button variant="outline" size="sm" className="w-full justify-start text-white border-slate-600 hover:bg-slate-800">
                  <Book className="w-4 h-4 mr-2" />
                  Story Mode
                </Button>
              </Link>
              <Link href="/people">
                <Button variant="outline" size="sm" className="w-full justify-start text-white border-slate-600 hover:bg-slate-800">
                  <Heart className="w-4 h-4 mr-2" />
                  Menschen
                </Button>
              </Link>
              <Link href="/autonomous">
                <Button variant="outline" size="sm" className="w-full justify-start text-white border-slate-600 hover:bg-slate-800">
                  <Settings className="w-4 h-4 mr-2" />
                  Systems
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Bar - Current Arc */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 animate-fadeInUp delay-200">
        <Badge variant="secondary" className="text-lg px-6 py-3 bg-purple-900/90 text-purple-200 border-purple-500/30 backdrop-blur-lg animate-glow">
          <Brain className="w-5 h-5 mr-2 inline" />
          {player.currentArc}
        </Badge>
      </div>

      {/* Main Content - BlockWorld (FULLSCREEN) */}
      <div className="absolute inset-0 pt-20 pb-6 px-6">
        <div className="h-full w-full animate-fadeInScale">
          <Card className="h-full bg-slate-900/50 backdrop-blur-sm border-slate-700/50 overflow-hidden">
            <CardContent className="p-6 h-full">
              <BlockWorldPanel />
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </PageTransition>
  )
}
