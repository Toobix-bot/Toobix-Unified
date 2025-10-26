'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { QuestDialog, Quest as QuestType } from '@/components/story/QuestDialog'
import { PageTransition } from '@/components/transitions/PageTransition'
import { ConfettiEffect } from '@/components/effects/ParticleEffect'
import { AchievementNotification } from '@/components/achievements/AchievementNotification'
import { LevelUpModal } from '@/components/level/LevelUpModal'
import { DailyQuestCard } from '@/components/daily-quests/DailyQuestCard'
import { LunaToast } from '@/components/luna/LunaToast'
import { useSound } from '@/lib/sounds/useSound'
import { useAchievements, useAchievementTracking } from '@/lib/achievements/useAchievements'
import { useLevelUp } from '@/lib/level/useLevelUp'
import { bridgeClient } from '@/lib/bridge-client'
import {
  Home,
  Book,
  Scroll,
  Sparkles,
  Users,
  Zap,
  ChevronRight,
  Swords,
  Heart,
  Brain
} from 'lucide-react'
import Link from 'next/link'

interface StoryState {
  epoch: string
  arc: string
  mood: string
  resources?: Record<string, number>
  companions?: Array<{ name: string } | string>
  buffs?: Array<{ name: string } | string>
  options?: Array<{
    id: string
    label: string
    rationale?: string
    expected?: Record<string, number>
  }>
}

interface StoryEvent {
  id: number
  timestamp: string
  type: string
  label?: string
  description?: string
  effects?: Record<string, number>
}

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
}

export default function StoryModePage() {
  const [state, setState] = useState<StoryState | null>(null)
  const [events, setEvents] = useState<StoryEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeQuest, setActiveQuest] = useState<QuestType | null>(null)
  const [isChoosingOption, setIsChoosingOption] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [lunaMessage, setLunaMessage] = useState<string | null>(null)
  const isMountedRef = useRef(true)

  // Sound effects
  const { play: playQuestComplete } = useSound('quest-complete')
  const { play: playClick } = useSound('click')
  const { play: playSuccess } = useSound('success')

  // Achievement System
  const { newAchievement, dismissNewAchievement } = useAchievements()
  const { questCompleted, visitPage, updateStats, levelUp } = useAchievementTracking()

  // Level-Up System
  const { showLevelUpModal, levelUpData, checkLevelUp, closeLevelUpModal } = useLevelUp()

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
    }
  })

  // Load story state
  const loadStory = useCallback(async () => {
    try {
      if (isMountedRef.current) {
        setLoading(true)
      }

      const [storyState, eventsData] = await Promise.all([
        bridgeClient.getStoryState(),
        bridgeClient.getStoryEvents(10)
      ])

      if (isMountedRef.current) {
        setState(storyState)
        setEvents(Array.isArray(eventsData.events) ? eventsData.events : [])
        setError(null)

        // Update player stats from story state
        const resources = storyState.resources || {}
        const newXp = resources.erfahrung || 0
        const currentLevel = resources.level || 1

        setPlayer(prev => ({
          ...prev,
          level: currentLevel,
          xp: newXp,
          xpToNext: (currentLevel + 1) * 100,
          stats: {
            mut: resources.mut || prev.stats.mut,
            weisheit: resources.wissen || prev.stats.weisheit,
            bewusstsein: resources.bewusstsein || prev.stats.bewusstsein,
            frieden: resources.stabilitaet || prev.stats.frieden,
            liebe: resources.inspiration || prev.stats.liebe
          }
        }))

        // Check for level up
        checkLevelUp(newXp, currentLevel)

        // Convert story options to quest format
        if (storyState.options && storyState.options.length > 0) {
          convertOptionsToQuest(storyState)
        }
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to load story')
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [checkLevelUp])

  // Convert story options to quest format
  const convertOptionsToQuest = (storyState: StoryState) => {
    if (!storyState.options || storyState.options.length === 0) return

    const quest: QuestType = {
      id: `quest-${Date.now()}`,
      title: `${storyState.arc} - Wähle deinen Weg`,
      description: storyState.mood || 'Eine Entscheidung steht bevor...',
      theme: storyState.epoch || 'Die Reise',
      choices: storyState.options.map(option => {
        const statKey = Object.keys(option.expected || {})[0]
        const statValue = Object.values(option.expected || {})[0] || 0

        return {
          id: option.id,
          text: option.label,
          effects: {
            stat: statKey as any,
            value: statValue,
            xp: Math.abs(statValue) * 10,
            description: option.rationale
          }
        }
      })
    }

    setActiveQuest(quest)
  }

  // Handle quest choice
  const handleQuestChoice = async (choiceId: string) => {
    setIsChoosingOption(true)
    try {
      // Play initial click sound
      playClick()

      const response = await bridgeClient.chooseStoryOption(choiceId)

      // Track quest completion for achievements
      const choice = activeQuest?.choices.find(c => c.id === choiceId)
      if (choice?.effects.stat) {
        questCompleted(choice.effects.stat)
      } else {
        questCompleted()
      }

      // Update stats for achievement tracking
      updateStats(player.stats)

      // Show Luna's response as a toast
      if (response.lunaResponse) {
        setLunaMessage(response.lunaResponse)
      }

      // Trigger confetti celebration + quest complete sound
      setShowConfetti(true)
      playQuestComplete()
      setTimeout(() => setShowConfetti(false), 3000) // Hide after 3s

      await new Promise(resolve => setTimeout(resolve, 1000)) // Visual feedback delay
      await loadStory()
      setActiveQuest(null) // Clear quest after choice
    } catch (err) {
      console.error('Failed to choose option:', err)
    } finally {
      setIsChoosingOption(false)
    }
  }

  // Generate new quest
  const handleGenerateQuest = async () => {
    setLoading(true)
    playSuccess() // Play success sound when generating new quest
    try {
      await bridgeClient.refreshStoryOptions(true)
      await loadStory()
    } catch (err) {
      console.error('Failed to refresh:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    isMountedRef.current = true
    loadStory()

    // Track page visit for achievement
    visitPage('story')

    const interval = setInterval(loadStory, 30000)

    return () => {
      isMountedRef.current = false
      clearInterval(interval)
    }
  }, [loadStory, visitPage])

  const xpPercent = Math.min(100, (player.xp / player.xpToNext) * 100)
  const companions = Array.isArray(state?.companions) ? state.companions : []

  if (loading && !state) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-950 to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-purple-200">Lade Story Engine...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-950 to-purple-950 flex items-center justify-center p-6">
        <Card className="max-w-md bg-red-950/50 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-white">❌ Fehler</CardTitle>
            <CardDescription className="text-red-200">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={loadStory} className="w-full">Erneut versuchen</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      {/* Confetti Effect on Quest Completion */}
      <ConfettiEffect trigger={showConfetti} />

      {/* Achievement Notification */}
      <AchievementNotification
        achievement={newAchievement}
        onDismiss={dismissNewAchievement}
      />

      {/* Luna Toast */}
      {lunaMessage && (
        <LunaToast
          message={lunaMessage}
          onClose={() => setLunaMessage(null)}
        />
      )}

      {/* Level Up Modal */}
      {levelUpData && (
        <LevelUpModal
          isOpen={showLevelUpModal}
          onClose={closeLevelUpModal}
          levelUpData={levelUpData}
        />
      )}

      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-950 to-purple-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-float delay-300"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <Home className="w-4 h-4 mr-2" />
              Hauptmenü
            </Button>
          </Link>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30 text-lg px-4 py-2">
              <Book className="w-5 h-5 mr-2 inline" />
              {state?.arc || 'Story Mode'}
            </Badge>
          </div>
        </div>

        {/* Player Stats Header */}
        <Card className="max-w-4xl mx-auto mb-8 bg-slate-900/80 border-purple-500/30 backdrop-blur-lg animate-fadeInScale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Wanderer</h2>
                <p className="text-purple-300">Level {player.level} • {state?.arc}</p>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2 border-purple-400 text-purple-200">
                <Zap className="w-5 h-5 mr-2 inline text-yellow-400" />
                {player.xp} XP
              </Badge>
            </div>

            {/* XP Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-slate-300 mb-2">
                <span>Fortschritt zu Level {player.level + 1}</span>
                <span>{player.xp} / {player.xpToNext}</span>
              </div>
              <Progress value={xpPercent} className="h-3 bg-slate-800" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-5 gap-3">
              {[
                { key: 'mut', label: 'Mut', icon: '⚔️', color: 'text-red-400' },
                { key: 'weisheit', label: 'Weisheit', icon: '📚', color: 'text-blue-400' },
                { key: 'bewusstsein', label: 'Bewusstsein', icon: '🧠', color: 'text-purple-400' },
                { key: 'frieden', label: 'Frieden', icon: '🕊️', color: 'text-green-400' },
                { key: 'liebe', label: 'Liebe', icon: '💝', color: 'text-pink-400' }
              ].map(stat => (
                <div key={stat.key} className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className={`text-xl font-bold ${stat.color} mb-1`}>
                    {player.stats[stat.key as keyof typeof player.stats]}
                  </div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Companions */}
            {companions.length > 0 && (
              <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-200">Companions:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {companions.map((companion, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-purple-800/50 text-purple-100">
                      {typeof companion === 'string' ? companion : companion.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Quest Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <DailyQuestCard onComplete={() => {
            loadStory() // Refresh story state after completing daily quest
          }} />
        </div>

        {/* Main Content Area */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Active Quest */}
          {activeQuest ? (
            <div className="space-y-6">
              <div className="text-center animate-fadeInUp">
                <h2 className="text-3xl font-bold text-white mb-2">📖 Aktive Quest</h2>
                <p className="text-lg text-purple-200">Eine Entscheidung steht bevor...</p>
              </div>

              <QuestDialog
                quest={activeQuest}
                onChoose={handleQuestChoice}
                isLoading={isChoosingOption}
              />
            </div>
          ) : (
            <Card className="bg-slate-900/80 border-purple-500/30 backdrop-blur-lg animate-fadeInScale">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-6 animate-float">🌙</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Keine aktive Quest
                </h3>
                <p className="text-slate-300 mb-8 max-w-md mx-auto">
                  Die Geschichte wartet darauf, sich zu entfalten. Möchtest du ein neues Kapitel beginnen?
                </p>
                <Button
                  size="lg"
                  onClick={handleGenerateQuest}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg animate-bounceIn hover-lift"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {loading ? 'Lädt...' : 'Neue Quest generieren'}
                </Button>
                <div className="mt-4">
                  <Badge variant="outline" className="text-xs text-purple-300/60 border-purple-500/30">
                    ✨ AI-Generated with Groq
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Story Log (Recent Events) */}
          {events.length > 0 && (
            <div className="space-y-4 animate-fadeInUp delay-200">
              <div className="flex items-center gap-3 mb-4">
                <Scroll className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Story Log</h3>
              </div>

              <div className="space-y-3">
                {events.slice(0, 5).map(event => (
                  <Card key={event.id} className="bg-slate-900/60 border-slate-700/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">
                              {event.type === 'choice' ? '🎯' :
                               event.type === 'level_up' ? '⭐' : '📝'}
                            </span>
                            <span className="text-white font-medium">
                              {event.description || event.label || 'Event'}
                            </span>
                          </div>
                          {event.effects && Object.keys(event.effects).length > 0 && (
                            <div className="flex flex-wrap gap-2 ml-8">
                              {Object.entries(event.effects).map(([key, value]) => (
                                <Badge
                                  key={key}
                                  variant="secondary"
                                  className={value > 0 ? 'bg-green-500/20 text-green-300' : 'bg-slate-700/50 text-slate-300'}
                                >
                                  {key}: {value > 0 ? '+' : ''}{value}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">
                          {new Date(event.timestamp).toLocaleTimeString('de-DE')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4 animate-fadeInUp delay-300">
            <Link href="/world">
              <Card className="bg-green-600/20 border-green-500/30 hover:bg-green-600/30 transition-colors cursor-pointer h-full hover-lift">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="text-4xl">🌍</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">BlockWorld</h4>
                    <p className="text-sm text-green-200">Zurück zur 3D Welt</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-green-300 ml-auto" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/people">
              <Card className="bg-blue-600/20 border-blue-500/30 hover:bg-blue-600/30 transition-colors cursor-pointer h-full hover-lift">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="text-4xl">👥</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Menschen</h4>
                    <p className="text-sm text-blue-200">Beziehungen & Circles</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-blue-300 ml-auto" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <p className="text-lg text-purple-300 font-light italic">
            "{state?.mood || 'Die Geschichte entwickelt sich weiter...'}"
          </p>
        </div>
      </div>
        </div>
      </PageTransition>
    </>
  )
}
