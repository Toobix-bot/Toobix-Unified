'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Sparkles, TrendingUp, Heart } from 'lucide-react'

const API_URL = 'http://localhost:3337/mcp'

interface StoryState {
  epoch: number
  mood: string
  arc: string
  resources: {
    energie: number
    wissen: number
    inspiration: number
    ruf: number
    stabilität: number
  }
  level: number
  xp: number
  xpToNext: number
  options: Array<{
    id: string
    text: string
    impact: string
  }>
}

export function StoryPanel() {
  const [storyState, setStoryState] = useState<StoryState | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStoryState = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'story_state',
            arguments: {}
          }
        })
      })

      const data = await response.json()
      if (data.result?.content?.[0]?.text) {
        const state = JSON.parse(data.result.content[0].text)
        setStoryState(state)
      }
    } catch (error) {
      console.error('Story state fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChoice = async (optionId: string) => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'story_choose',
            arguments: { optionId }
          }
        })
      })
      // Refresh state after choice
      fetchStoryState()
    } catch (error) {
      console.error('Story choice error:', error)
    }
  }

  useEffect(() => {
    fetchStoryState()
    // Refresh every 30 seconds
    const interval = setInterval(fetchStoryState, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📖 Story Engine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading story state...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!storyState) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📖 Story Engine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">
            Failed to load story state
          </div>
        </CardContent>
      </Card>
    )
  }

  const xpProgress = (storyState.xp / storyState.xpToNext) * 100

  return (
    <div className="space-y-6">
      {/* Story Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl flex items-center gap-2">
                <BookOpen className="w-8 h-8" />
                Story Engine
              </CardTitle>
              <CardDescription className="text-purple-100 mt-2">
                Narrative arc: {storyState.arc} • Mood: {storyState.mood}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">Level {storyState.level}</div>
              <div className="text-sm text-purple-200">Epoch {storyState.epoch}</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* XP Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Experience Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{storyState.xp} XP</span>
              <span>{storyState.xpToNext} XP to next level</span>
            </div>
            <Progress value={xpProgress} className="h-3" />
            <div className="text-center text-xs text-muted-foreground">
              {xpProgress.toFixed(1)}% complete
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(storyState.resources).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-2xl font-bold text-primary">{value}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {key}
                </div>
                <Progress value={value} className="h-1 mt-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Story Options */}
      {storyState.options && storyState.options.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Story Choices
            </CardTitle>
            <CardDescription>
              Choose your next action in the story
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {storyState.options.map((option) => (
                <Button
                  key={option.id}
                  variant="outline"
                  className="w-full justify-start h-auto p-4 text-left"
                  onClick={() => handleChoice(option.id)}
                >
                  <div className="flex-1">
                    <div className="font-medium mb-1">{option.text}</div>
                    <div className="text-xs text-muted-foreground">
                      Impact: {option.impact}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Arc Description */}
      <Card>
        <CardHeader>
          <CardTitle>Current Arc: {storyState.arc}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            {storyState.arc === 'foundations' && (
              <p>
                Building the foundations of your journey. Focus on learning,
                gathering resources, and establishing your presence in the world.
                Every choice shapes your path forward.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
