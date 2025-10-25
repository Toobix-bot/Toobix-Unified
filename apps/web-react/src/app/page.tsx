'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { IdleRewardsModal } from '@/components/idle/IdleRewardsModal'
import {
  calculateIdleRewards,
  clearIdleProgress,
  saveLastActiveTime,
  idleManager
} from '@/lib/idle/idle-progression'
import { Gamepad2, Zap, Heart, Book, Users, Sparkles, Settings } from 'lucide-react'

interface PlayerStats {
  name: string
  level: number
  xp: number
  xpToNext: number
  stats: {
    mut: number          // Courage
    weisheit: number     // Wisdom
    bewusstsein: number  // Consciousness
    frieden: number      // Peace
    liebe: number        // Love
  }
  currentArc: string
  totalPlayTime: number
}

export default function Home() {
  const [player, setPlayer] = useState<PlayerStats>({
    name: 'Wanderer',
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
    totalPlayTime: 0
  })

  const [isHovering, setIsHovering] = useState(false)
  const [showIdleRewards, setShowIdleRewards] = useState(false)
  const [idleRewardsData, setIdleRewardsData] = useState<{
    idleTime: string
    rewards: Array<{ icon: string; text: string; value: number | string }>
    welcomeMessage: string
  } | null>(null)

  useEffect(() => {
    // Check for idle rewards on mount
    const idleProgress = calculateIdleRewards()

    if (idleProgress && idleProgress.totalIdleTime >= 5) {
      const summary = idleManager.getIdleRewardsSummary(idleProgress)
      const welcomeMessage = idleManager.generateWelcomeBackMessage(idleProgress)
      const idleTime = idleManager.formatIdleTime(idleProgress.totalIdleTime)

      setIdleRewardsData({
        idleTime,
        rewards: summary.items,
        welcomeMessage
      })

      setShowIdleRewards(true)

      // Apply idle rewards to player stats
      setPlayer(prev => ({
        ...prev,
        xp: prev.xp + idleProgress.xpGained
      }))
    }

    // Save last active time on unload
    const handleBeforeUnload = () => {
      saveLastActiveTime()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      saveLastActiveTime()
    }
  }, [])

  const handleCloseIdleRewards = () => {
    setShowIdleRewards(false)
    clearIdleProgress()
  }

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
  }, [])

  const xpPercent = Math.min(100, (player.xp / player.xpToNext) * 100)

  return (
    <>
      {/* Idle Rewards Modal */}
      {idleRewardsData && (
        <IdleRewardsModal
          isOpen={showIdleRewards}
          onClose={handleCloseIdleRewards}
          idleTime={idleRewardsData.idleTime}
          rewards={idleRewardsData.rewards}
          welcomeMessage={idleRewardsData.welcomeMessage}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden">
      {/* Animated Background Stars */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-starTwinkle opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-starTwinkle delay-200 opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-purple-300 rounded-full animate-starTwinkle delay-300 opacity-50"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-white rounded-full animate-starTwinkle delay-100 opacity-70"></div>
        <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-pink-300 rounded-full animate-starTwinkle delay-400 opacity-60"></div>
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-yellow-200 rounded-full animate-starTwinkle delay-500 opacity-50"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-6">
          <div className="inline-block mb-4 animate-fadeInScale">
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-purple-500/20 text-purple-200 border-purple-400/30 animate-glow">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Toobix Universe v0.1.0-alpha
            </Badge>
          </div>

          <h1 className="text-7xl font-bold text-white mb-4 tracking-tight animate-fadeInUp">
            🌌 Willkommen zurück
          </h1>

          <p className="text-2xl text-purple-200 font-light italic mb-2 animate-fadeInUp delay-100">
            "Vom Ich zum Wir, vom Wir zum Ich"
          </p>

          <p className="text-lg text-slate-300 max-w-2xl mx-auto animate-fadeInUp delay-200">
            Deine Reise durch Bewusstsein, Story und Blockworld wartet.
            Das Universum entwickelt sich weiter – mit dir.
          </p>
        </div>

        {/* Player Stats Card */}
        <Card className="max-w-4xl mx-auto mb-12 bg-gradient-to-br from-slate-900/90 to-purple-900/90 border-purple-500/30 backdrop-blur-sm animate-fadeInScale delay-300 hover-lift">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">{player.name}</h2>
                <p className="text-purple-300">Level {player.level} • {player.currentArc}</p>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2 border-purple-400 text-purple-200">
                <Zap className="w-5 h-5 mr-2 inline text-yellow-400" />
                {player.xp} XP
              </Badge>
            </div>

            {/* XP Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-300 mb-2">
                <span>Fortschritt zu Level {player.level + 1}</span>
                <span>{player.xp} / {player.xpToNext}</span>
              </div>
              <Progress value={xpPercent} className="h-3 bg-slate-800" />
            </div>

            {/* Character Stats */}
            <div className="grid grid-cols-5 gap-4">
              {[
                { key: 'mut', label: 'Mut', icon: '⚔️', color: 'text-red-400' },
                { key: 'weisheit', label: 'Weisheit', icon: '📚', color: 'text-blue-400' },
                { key: 'bewusstsein', label: 'Bewusstsein', icon: '🧠', color: 'text-purple-400' },
                { key: 'frieden', label: 'Frieden', icon: '🕊️', color: 'text-green-400' },
                { key: 'liebe', label: 'Liebe', icon: '💝', color: 'text-pink-400' }
              ].map(stat => (
                <div key={stat.key} className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="text-3xl mb-1">{stat.icon}</div>
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {player.stats[stat.key as keyof typeof player.stats]}
                  </div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Game Entrance */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Primary: Enter BlockWorld */}
          <Card
            className="bg-gradient-to-r from-green-600 to-emerald-600 border-0 shadow-2xl animate-fadeInUp delay-400 hover-lift hover-glow cursor-pointer"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <CardContent className="p-12 text-center">
              <div className="text-7xl mb-6 animate-bounce">🎮</div>
              <h2 className="text-4xl font-bold text-white mb-4">
                BlockWorld betreten
              </h2>
              <p className="text-xl text-green-100 mb-8">
                Deine 3D-Welt wartet. Der BlockBot AI Agent hat {Math.floor(Math.random() * 50) + 10} neue Ressourcen gesammelt.
              </p>
              <Link href="/world">
                <Button
                  size="lg"
                  className="text-2xl px-12 py-8 bg-white text-green-700 hover:bg-green-50 font-bold shadow-xl"
                >
                  <Gamepad2 className="w-8 h-8 mr-3" />
                  Welt Betreten
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Secondary Options Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Story Mode */}
            <Link href="/story">
              <Card className="bg-gradient-to-br from-purple-600/90 to-pink-600/90 border-purple-400/30 hover:scale-105 transition-transform cursor-pointer h-full animate-fadeInUp delay-500 hover-lift">
                <CardContent className="p-8 text-center text-white">
                  <div className="text-5xl mb-4">📖</div>
                  <h3 className="text-2xl font-bold mb-3">Story Mode</h3>
                  <p className="text-purple-100 mb-4">
                    Epische Quests, Companions & Progression
                  </p>
                  <Badge variant="secondary" className="bg-purple-800/50 text-purple-100">
                    <Book className="w-4 h-4 mr-2 inline" />
                    {player.currentArc}
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            {/* People */}
            <Link href="/people">
              <Card className="bg-gradient-to-br from-blue-600/90 to-cyan-600/90 border-blue-400/30 hover:scale-105 transition-transform cursor-pointer h-full animate-fadeInUp delay-500 hover-lift">
                <CardContent className="p-8 text-center text-white">
                  <div className="text-5xl mb-4">👥</div>
                  <h3 className="text-2xl font-bold mb-3">Menschen</h3>
                  <p className="text-blue-100 mb-4">
                    Beziehungen, Circles & Momente
                  </p>
                  <Badge variant="secondary" className="bg-blue-800/50 text-blue-100">
                    <Users className="w-4 h-4 mr-2 inline" />
                    0 Verbindungen
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            {/* Love & Peace */}
            <Link href="/unified">
              <Card className="bg-gradient-to-br from-pink-600/90 to-rose-600/90 border-pink-400/30 hover:scale-105 transition-transform cursor-pointer h-full animate-fadeInUp delay-500 hover-lift">
                <CardContent className="p-8 text-center text-white">
                  <div className="text-5xl mb-4">💝</div>
                  <h3 className="text-2xl font-bold mb-3">Love & Peace</h3>
                  <p className="text-pink-100 mb-4">
                    Dankbarkeit, Acts of Kindness & Harmonie
                  </p>
                  <Badge variant="secondary" className="bg-pink-800/50 text-pink-100">
                    <Heart className="w-4 h-4 mr-2 inline" />
                    87 Love Points
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            {/* Systems (Debug) */}
            <Link href="/autonomous">
              <Card className="bg-gradient-to-br from-slate-700/90 to-slate-800/90 border-slate-500/30 hover:scale-105 transition-transform cursor-pointer h-full animate-fadeInUp delay-500 hover-lift">
                <CardContent className="p-8 text-center text-white">
                  <div className="text-5xl mb-4">⚙️</div>
                  <h3 className="text-2xl font-bold mb-3">Systems</h3>
                  <p className="text-slate-300 mb-4">
                    Autonomous, Consciousness & Tools
                  </p>
                  <Badge variant="secondary" className="bg-slate-600/50 text-slate-200">
                    <Settings className="w-4 h-4 mr-2 inline" />
                    Debug Mode
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <p className="text-xl text-purple-300 font-light italic">
            "Die Revolution ist, dass es keine Revolution braucht."
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Version 0.1.0-alpha • Built with 💝 in 2025
          </p>
        </div>
      </div>
    </div>
    </>
  )
}
