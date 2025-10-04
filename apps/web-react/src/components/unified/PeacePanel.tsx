'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Leaf, Wind, Eye, TrendingUp, Target, Lightbulb } from 'lucide-react'

const API_URL = 'http://localhost:3337/mcp'

interface PeaceState {
  overall: number
  calm: number
  harmony: number
  clarity: number
  growth: number
  purpose: number
}

interface Conflict {
  id: number
  description: string
  status: string
  createdAt: string
}

export function PeacePanel() {
  const [peaceState, setPeaceState] = useState<PeaceState | null>(null)
  const [conflicts, setConflicts] = useState<Conflict[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form states
  const [journalEntry, setJournalEntry] = useState('')
  const [conflictDesc, setConflictDesc] = useState('')
  const [learningWhat, setLearningWhat] = useState('')
  const [valueText, setValueText] = useState('')
  const [intentionText, setIntentionText] = useState('')

  const fetchPeaceState = async () => {
    try {
      // Fetch peace state
      const stateResponse = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'peace_get_state',
            arguments: {}
          }
        })
      })

      const stateData = await stateResponse.json()
      if (stateData.result?.content?.[0]?.text) {
        setPeaceState(JSON.parse(stateData.result.content[0].text))
      }

      // Fetch conflicts
      const conflictsResponse = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now() + 1,
          method: 'tools/call',
          params: {
            name: 'peace_get_conflicts',
            arguments: { limit: 5 }
          }
        })
      })

      const conflictsData = await conflictsResponse.json()
      if (conflictsData.result?.content?.[0]?.text) {
        setConflicts(JSON.parse(conflictsData.result.content[0].text))
      }
    } catch (error) {
      console.error('Peace state fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const meditate = async () => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'peace_calm_meditate',
            arguments: { duration: 5, points: 3 }
          }
        })
      })
      fetchPeaceState()
    } catch (error) {
      console.error('Meditate error:', error)
    }
  }

  const addJournalEntry = async () => {
    if (!journalEntry.trim()) return

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'peace_clarity_journal',
            arguments: {
              entry: journalEntry,
              points: 2
            }
          }
        })
      })

      setJournalEntry('')
      fetchPeaceState()
    } catch (error) {
      console.error('Journal error:', error)
    }
  }

  const logConflict = async () => {
    if (!conflictDesc.trim()) return

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'peace_harmony_log_conflict',
            arguments: {
              description: conflictDesc
            }
          }
        })
      })

      setConflictDesc('')
      fetchPeaceState()
    } catch (error) {
      console.error('Log conflict error:', error)
    }
  }

  const logLearning = async () => {
    if (!learningWhat.trim()) return

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'peace_growth_learn',
            arguments: {
              what: learningWhat,
              points: 5
            }
          }
        })
      })

      setLearningWhat('')
      fetchPeaceState()
    } catch (error) {
      console.error('Log learning error:', error)
    }
  }

  const setIntention = async () => {
    if (!intentionText.trim()) return

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'peace_purpose_intention',
            arguments: {
              intention: intentionText,
              points: 5
            }
          }
        })
      })

      setIntentionText('')
      fetchPeaceState()
    } catch (error) {
      console.error('Set intention error:', error)
    }
  }

  useEffect(() => {
    fetchPeaceState()
    // Refresh every 30 seconds
    const interval = setInterval(fetchPeaceState, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>☮️ Peace Catalyst</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading peace state...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Peace Score Header */}
      <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Leaf className="w-8 h-8" />
                Peace Catalyst
              </CardTitle>
              <CardDescription className="text-green-100 mt-2">
                Cultivate inner peace through calm, harmony, clarity, growth, and purpose
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{peaceState?.overall || 0}</div>
              <div className="text-sm text-green-200">Overall Peace Score</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Peace Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1">
              <Wind className="w-4 h-4" />
              Calm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {peaceState?.calm || 0}
            </div>
            <Progress value={peaceState?.calm || 0} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1">
              <Leaf className="w-4 h-4" />
              Harmony
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500 mb-2">
              {peaceState?.harmony || 0}
            </div>
            <Progress value={peaceState?.harmony || 0} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1">
              <Eye className="w-4 h-4" />
              Clarity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500 mb-2">
              {peaceState?.clarity || 0}
            </div>
            <Progress value={peaceState?.clarity || 0} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500 mb-2">
              {peaceState?.growth || 0}
            </div>
            <Progress value={peaceState?.growth || 0} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1">
              <Target className="w-4 h-4" />
              Purpose
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-500 mb-2">
              {peaceState?.purpose || 0}
            </div>
            <Progress value={peaceState?.purpose || 0} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Peace Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={meditate} variant="outline" className="h-auto py-4">
              <div className="text-center w-full">
                <Wind className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <div className="font-medium">Meditate</div>
                <div className="text-xs text-muted-foreground">+3 Calm</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto py-4" disabled>
              <div className="text-center w-full">
                <Wind className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <div className="font-medium">Breathing</div>
                <div className="text-xs text-muted-foreground">+2 Calm</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Journal Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-500" />
            Clarity Journal
          </CardTitle>
          <CardDescription>Write to gain clarity and insight</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="What's on your mind? Write to clarify your thoughts..."
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            rows={4}
          />
          <Button onClick={addJournalEntry} className="w-full" disabled={!journalEntry.trim()}>
            <Eye className="w-4 h-4 mr-2" />
            Add Journal Entry (+2 Clarity)
          </Button>
        </CardContent>
      </Card>

      {/* Learning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-orange-500" />
            Log Learning
          </CardTitle>
          <CardDescription>What did you learn today?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="I learned that..."
            value={learningWhat}
            onChange={(e) => setLearningWhat(e.target.value)}
          />
          <Button onClick={logLearning} className="w-full" disabled={!learningWhat.trim()}>
            <Lightbulb className="w-4 h-4 mr-2" />
            Log Learning (+5 Growth)
          </Button>
        </CardContent>
      </Card>

      {/* Intention Setting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            Set Intention
          </CardTitle>
          <CardDescription>What is your intention for today?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="My intention is to..."
            value={intentionText}
            onChange={(e) => setIntentionText(e.target.value)}
          />
          <Button onClick={setIntention} className="w-full" disabled={!intentionText.trim()}>
            <Target className="w-4 h-4 mr-2" />
            Set Intention (+5 Purpose)
          </Button>
        </CardContent>
      </Card>

      {/* Conflicts */}
      {conflicts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-yellow-500" />
              Active Conflicts
            </CardTitle>
            <CardDescription>Conflicts to resolve for harmony</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conflicts.map((conflict) => (
                <div key={conflict.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-medium">{conflict.description}</div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      {conflict.status}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(conflict.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Log Conflict */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-yellow-500" />
            Log Conflict
          </CardTitle>
          <CardDescription>Acknowledge conflicts to work toward harmony</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe the conflict..."
            value={conflictDesc}
            onChange={(e) => setConflictDesc(e.target.value)}
            rows={3}
          />
          <Button onClick={logConflict} className="w-full" disabled={!conflictDesc.trim()}>
            <Leaf className="w-4 h-4 mr-2" />
            Log Conflict
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
