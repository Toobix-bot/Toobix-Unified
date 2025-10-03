'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { bridgeClient, type StoryState, type StoryOption, type StoryEvent } from '@toobix/api-client'

export default function StoryEnginePage() {
  const [state, setState] = useState<StoryState | null>(null)
  const [events, setEvents] = useState<StoryEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load story data
  const loadStory = async () => {
    try {
      setLoading(true)
      const [storyState, eventsData] = await Promise.all([
        bridgeClient.getStoryState(),
        bridgeClient.getStoryEvents(10)
      ])
      setState(storyState)
      setEvents(eventsData.events || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load story')
    } finally {
      setLoading(false)
    }
  }

  // Choose option
  const handleChooseOption = async (optionId: string) => {
    try {
      await bridgeClient.chooseStoryOption(optionId)
      await loadStory() // Reload
    } catch (err) {
      console.error('Failed to choose option:', err)
    }
  }

  // Refresh options
  const handleRefresh = async () => {
    try {
      await bridgeClient.refreshStoryOptions(true)
      await loadStory()
    } catch (err) {
      console.error('Failed to refresh:', err)
    }
  }

  useEffect(() => {
    loadStory()
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadStory, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !state) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-muted-foreground">Loading Story Engine...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>❌ Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={loadStory}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!state) return null

  // Calculate XP progress
  const xpForNextLevel = (state.resources.level || 1) * 100
  const currentXP = state.resources.erfahrung || 0
  const xpPercent = (currentXP / xpForNextLevel) * 100

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">📖 Story Engine</h1>
          <p className="text-muted-foreground">
            Arc: {state.arc} · Level {state.resources.level}
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          🔄 Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="options">Options ({state.options.length})</TabsTrigger>
          <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Epoch</span>
                    <Badge>{state.epoch}</Badge>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Arc</span>
                    <Badge variant="secondary">{state.arc}</Badge>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Level</span>
                    <Badge variant="default">{state.resources.level}</Badge>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">XP to Level {state.resources.level + 1}</span>
                    <span className="text-sm">{currentXP.toFixed(0)} / {xpForNextLevel}</span>
                  </div>
                  <Progress value={xpPercent} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Resources Card */}
            <Card>
              <CardHeader>
                <CardTitle>💎 Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(state.resources)
                  .filter(([key]) => !['level', 'erfahrung'].includes(key))
                  .slice(0, 5)
                  .map(([key, val]) => {
                    const numVal = typeof val === 'number' ? val : 0
                    const percent = Math.min(100, (numVal / 100) * 100)
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground capitalize">{key}</span>
                          <span className="font-semibold">{numVal.toFixed(0)}</span>
                        </div>
                        <Progress value={percent} className="h-1" />
                      </div>
                    )
                  })}
              </CardContent>
            </Card>

            {/* Mood Card */}
            <Card>
              <CardHeader>
                <CardTitle>🌙 Mood & Companions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-lg font-semibold">{state.mood}</p>
                  <p className="text-sm text-muted-foreground">{state.arc}</p>
                </div>
                {state.companions.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Companions:</p>
                    <div className="flex flex-wrap gap-1">
                      {state.companions.map((c, i) => (
                        <Badge key={i} variant="secondary">{c.name || c}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {state.buffs.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Buffs:</p>
                    <div className="space-y-1">
                      {state.buffs.map((b, i) => (
                        <div key={i} className="text-sm">✨ {b.name || b}</div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Options Tab */}
        <TabsContent value="options" className="space-y-4">
          {state.options.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground mb-4">No active story options.</p>
                <Button onClick={handleRefresh}>Generate Options</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {state.options.map(opt => (
                <Card 
                  key={opt.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleChooseOption(opt.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-base">{opt.label}</CardTitle>
                    <CardDescription>{opt.rationale || 'Choose this option'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {opt.expected && (
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(opt.expected).map(([k, v]) => (
                          <Badge key={k} variant={v > 0 ? 'default' : 'destructive'}>
                            {k}: {v > 0 ? '+' : ''}{v}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          {events.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No events yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {events.map(evt => (
                <Card key={evt.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {evt.type === 'choice' ? '🎯' : evt.type === 'level_up' ? '⭐' : '📝'} {evt.description || evt.label}
                      </CardTitle>
                      <span className="text-xs text-muted-foreground">
                        {new Date(evt.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </CardHeader>
                  {evt.effects && (
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(evt.effects).map(([k, v]) => (
                          <Badge key={k} variant={v > 0 ? 'default' : 'secondary'}>
                            {k}: {v > 0 ? '+' : ''}{v}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
