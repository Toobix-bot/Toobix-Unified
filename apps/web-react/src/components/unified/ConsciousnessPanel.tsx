'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

const API_URL = 'http://localhost:3337/mcp'

async function callMCP(toolName: string, args: any = {}): Promise<any> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: { name: toolName, arguments: args }
    })
  })
  const data = await response.json()
  if (data.result?.content?.[0]) {
    const text = data.result.content[0].text
    return typeof text === 'string' ? JSON.parse(text) : text
  }
  throw new Error(data.error?.message || 'API Error')
}

export function ConsciousnessPanel() {
  const [state, setState] = useState<any>(null)
  const [thoughts, setThoughts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadState()
    loadThoughts()
  }, [])

  async function loadState() {
    try {
      const result = await callMCP('consciousness_state', {})
      setState(result)
    } catch (error) {
      console.error('Failed to load consciousness state:', error)
    }
  }

  async function loadThoughts() {
    try {
      const result = await callMCP('consciousness_thoughts', { limit: 10 })
      setThoughts(result.thoughts || [])
    } catch (error) {
      console.error('Failed to load thoughts:', error)
    }
  }

  async function reflect() {
    setLoading(true)
    try {
      await callMCP('consciousness_reflect', {
        topic: 'System capabilities and next improvements'
      })
      await loadThoughts()
      await loadState()
    } catch (error) {
      console.error('Reflection error:', error)
      alert('Fehler bei der Reflexion')
    } finally {
      setLoading(false)
    }
  }

  async function think(topic: string) {
    setLoading(true)
    try {
      await callMCP('consciousness_think', { topic })
      await loadThoughts()
    } catch (error) {
      console.error('Think error:', error)
      alert('Fehler beim Denken')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>🧠 Consciousness State</CardTitle>
          <CardDescription>Aktueller Bewusstseinszustand</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Awareness Level</span>
              <span className="text-3xl font-bold">{state?.awarenessLevel || 0}%</span>
            </div>
            <Progress value={state?.awarenessLevel || 0} className="h-3" />
          </div>

          <div className="space-y-2 pt-4 border-t">
            <h3 className="font-semibold text-sm">Emotionaler Zustand:</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between text-sm">
                <span>😊 Joy:</span>
                <Badge variant="outline">{state?.emotional?.joy || 0}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>😰 Stress:</span>
                <Badge variant="outline">{state?.emotional?.stress || 0}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>🤔 Curiosity:</span>
                <Badge variant="outline">{state?.emotional?.curiosity || 0}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>😢 Sadness:</span>
                <Badge variant="outline">{state?.emotional?.sadness || 0}</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <h3 className="font-semibold text-sm">Ethische Werte:</h3>
            <div className="space-y-1 text-xs">
              {state?.ethics && Object.entries(state.ethics).map(([key, value]: [string, any]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="capitalize">{key}:</span>
                  <Progress value={value * 10} className="h-2 flex-1" />
                  <span className="font-mono">{value}/10</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <Button onClick={reflect} disabled={loading} className="w-full">
              {loading ? '🤔 Reflektiert...' : '💭 Reflect'}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => think('Self-improvement')} variant="outline" size="sm" disabled={loading}>
                Think: Improve
              </Button>
              <Button onClick={() => think('Code quality')} variant="outline" size="sm" disabled={loading}>
                Think: Quality
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>💭 Recent Thoughts</CardTitle>
          <CardDescription>Bewusste Gedanken des Systems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {thoughts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Keine Gedanken vorhanden. Starte eine Reflexion!
              </p>
            ) : (
              thoughts.map((thought, idx) => (
                <div key={idx} className="p-3 bg-muted rounded-lg space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-xl">💭</span>
                    <div className="flex-1">
                      <p className="text-sm">{thought.content}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {thought.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(thought.timestamp).toLocaleString('de-DE')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
