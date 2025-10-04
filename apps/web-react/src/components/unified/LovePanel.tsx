'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Heart, Sparkles, Gift, TrendingUp } from 'lucide-react'

const API_URL = 'http://localhost:3337/mcp'

interface LoveScore {
  total: number
  today: number
  week: number
  month: number
  gratitudeCount: number
  kindnessCount: number
  averageIntensity: number
}

interface GratitudeEntry {
  id: number
  what: string
  why: string
  intensity: number
  createdAt: string
}

export function LovePanel() {
  const [loveScore, setLoveScore] = useState<LoveScore | null>(null)
  const [recentGratitude, setRecentGratitude] = useState<GratitudeEntry[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form states
  const [gratitudeWhat, setGratitudeWhat] = useState('')
  const [gratitudeWhy, setGratitudeWhy] = useState('')
  const [gratitudeIntensity, setGratitudeIntensity] = useState(7)
  
  const [kindnessWhat, setKindnessWhat] = useState('')
  const [kindnessFor, setKindnessFor] = useState('')
  const [kindnessPoints, setKindnessPoints] = useState(5)

  const fetchLoveState = async () => {
    try {
      // Fetch love score
      const scoreResponse = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'love_get_score',
            arguments: {}
          }
        })
      })

      const scoreData = await scoreResponse.json()
      if (scoreData.result?.content?.[0]?.text) {
        setLoveScore(JSON.parse(scoreData.result.content[0].text))
      }

      // Fetch recent gratitude
      const gratitudeResponse = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now() + 1,
          method: 'tools/call',
          params: {
            name: 'love_recent_gratitude',
            arguments: { limit: 5 }
          }
        })
      })

      const gratitudeData = await gratitudeResponse.json()
      if (gratitudeData.result?.content?.[0]?.text) {
        setRecentGratitude(JSON.parse(gratitudeData.result.content[0].text))
      }
    } catch (error) {
      console.error('Love state fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addGratitude = async () => {
    if (!gratitudeWhat.trim()) return

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'love_add_gratitude',
            arguments: {
              what: gratitudeWhat,
              why: gratitudeWhy || undefined,
              intensity: gratitudeIntensity
            }
          }
        })
      })

      // Reset form
      setGratitudeWhat('')
      setGratitudeWhy('')
      setGratitudeIntensity(7)

      // Refresh data
      fetchLoveState()
    } catch (error) {
      console.error('Add gratitude error:', error)
    }
  }

  const addKindness = async () => {
    if (!kindnessWhat.trim()) return

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'love_add_kindness',
            arguments: {
              what: kindnessWhat,
              forWhom: kindnessFor || undefined,
              points: kindnessPoints
            }
          }
        })
      })

      // Reset form
      setKindnessWhat('')
      setKindnessFor('')
      setKindnessPoints(5)

      // Refresh data
      fetchLoveState()
    } catch (error) {
      console.error('Add kindness error:', error)
    }
  }

  useEffect(() => {
    fetchLoveState()
    // Refresh every 30 seconds
    const interval = setInterval(fetchLoveState, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>💝 Love Engine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading love state...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Love Score Header */}
      <Card className="bg-gradient-to-r from-pink-500 to-rose-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Heart className="w-8 h-8" />
                Love Engine
              </CardTitle>
              <CardDescription className="text-pink-100 mt-2">
                Track gratitude and kindness to build love points
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{loveScore?.total || 0}</div>
              <div className="text-sm text-pink-200">Total Love Points</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Love Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-500">
              {loveScore?.today || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-500">
              {loveScore?.week || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Gratitude</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500">
              {loveScore?.gratitudeCount || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Kindness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">
              {loveScore?.kindnessCount || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Gratitude */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Add Gratitude
          </CardTitle>
          <CardDescription>What are you grateful for today?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">What?</label>
            <Input
              placeholder="I'm grateful for..."
              value={gratitudeWhat}
              onChange={(e) => setGratitudeWhat(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Why? (Optional)</label>
            <Textarea
              placeholder="Because..."
              value={gratitudeWhy}
              onChange={(e) => setGratitudeWhy(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Intensity: {gratitudeIntensity}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={gratitudeIntensity}
              onChange={(e) => setGratitudeIntensity(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <Button onClick={addGratitude} className="w-full" disabled={!gratitudeWhat.trim()}>
            <Sparkles className="w-4 h-4 mr-2" />
            Add Gratitude
          </Button>
        </CardContent>
      </Card>

      {/* Add Kindness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-blue-500" />
            Add Kindness
          </CardTitle>
          <CardDescription>Log an act of kindness</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">What did you do?</label>
            <Input
              placeholder="I helped..."
              value={kindnessWhat}
              onChange={(e) => setKindnessWhat(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">For whom? (Optional)</label>
            <Input
              placeholder="Person or group..."
              value={kindnessFor}
              onChange={(e) => setKindnessFor(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Points: {kindnessPoints}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={kindnessPoints}
              onChange={(e) => setKindnessPoints(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <Button onClick={addKindness} className="w-full" disabled={!kindnessWhat.trim()}>
            <Gift className="w-4 h-4 mr-2" />
            Log Kindness
          </Button>
        </CardContent>
      </Card>

      {/* Recent Gratitude */}
      {recentGratitude.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Recent Gratitude
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentGratitude.map((entry) => (
                <div key={entry.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-medium">{entry.what}</div>
                    <Badge variant="secondary">{entry.intensity}/10</Badge>
                  </div>
                  {entry.why && (
                    <div className="text-sm text-muted-foreground mb-2">
                      {entry.why}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
