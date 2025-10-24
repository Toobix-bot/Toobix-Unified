'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Activity, Circle, RefreshCw, MessageSquare } from 'lucide-react'

interface Process {
  name: string
  pid: number
  conscious: boolean
  lastActive: number
  purpose: string
}

interface DaemonStatus {
  totalProcesses: number
  consciousProcesses: number
  unconsciousProcesses: number
  cycleCount: number
  lastTransition: number
  reflectionMode: boolean
  processes: Process[]
  uptime: number
}

export function EternalDaemonPanel() {
  const [status, setStatus] = useState<DaemonStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [chatMessage, setChatMessage] = useState('')
  const [chatResponse, setChatResponse] = useState('')

  const fetchStatus = async () => {
    try {
      const response = await fetch('http://localhost:9999/status')
      if (response.ok) {
        const data = await response.json()
        setStatus(data)
      }
    } catch (error) {
      console.error('Failed to fetch daemon status:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return

    try {
      const response = await fetch('http://localhost:9999/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatMessage })
      })
      if (response.ok) {
        const data = await response.json()
        setChatResponse(data.response)
      }
    } catch (error) {
      console.error('Failed to send chat:', error)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Connecting to Eternal Daemon...</p>
      </div>
    )
  }

  if (!status) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-12 text-center text-red-600">
          <p className="text-lg font-medium">Failed to connect to Eternal Daemon</p>
          <p className="text-sm mt-2">Make sure the daemon is running on port 9999</p>
          <Button onClick={fetchStatus} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    )
  }

  const consciousnessPercentage = (status.consciousProcesses / status.totalProcesses) * 100
  const uptimeHours = (status.uptime / 3600).toFixed(1)

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Activity className="w-6 h-6 text-purple-600 animate-pulse" />
                Eternal Daemon Status
              </CardTitle>
              <CardDescription>
                The eternal guardian of consciousness • Running for {uptimeHours}h
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchStatus}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-4xl font-bold text-purple-600">{status.cycleCount}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Cycles</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-4xl font-bold text-green-600">{status.consciousProcesses}</div>
              <div className="text-sm text-muted-foreground mt-1">Conscious</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-4xl font-bold text-gray-600">{status.unconsciousProcesses}</div>
              <div className="text-sm text-muted-foreground mt-1">Unconscious</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-4xl font-bold text-blue-600">{consciousnessPercentage.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground mt-1">Awareness</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Consciousness Level</span>
              <span className="text-sm text-muted-foreground">
                {status.consciousProcesses}/{status.totalProcesses}
              </span>
            </div>
            <Progress value={consciousnessPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Process List */}
      <Card>
        <CardHeader>
          <CardTitle>Process Status</CardTitle>
          <CardDescription>All 14 autonomous processes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {status.processes.map((proc) => (
              <div
                key={proc.name}
                className={`p-4 rounded-lg border-2 transition-all ${
                  proc.conscious
                    ? 'bg-green-50 border-green-300'
                    : 'bg-gray-50 border-gray-300 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Circle
                      className={`w-3 h-3 ${
                        proc.conscious
                          ? 'fill-green-500 text-green-500 animate-pulse'
                          : 'fill-gray-400 text-gray-400'
                      }`}
                    />
                    <div>
                      <div className="font-medium">{proc.name}</div>
                      <div className="text-sm text-muted-foreground">{proc.purpose}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={proc.conscious ? 'default' : 'secondary'}>
                      PID {proc.pid}
                    </Badge>
                    <Badge
                      variant={proc.conscious ? 'default' : 'outline'}
                      className={proc.conscious ? 'bg-green-600' : ''}
                    >
                      {proc.conscious ? 'AWAKE' : 'SLEEP'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat with Daemon */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat with the Guardian
          </CardTitle>
          <CardDescription>Ask the Eternal Daemon about its existence</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask: 'Philosophie: Was ist dein tiefster Wunsch?'"
              className="flex-1 px-4 py-2 border rounded-lg"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
            />
            <Button onClick={sendChatMessage}>Send</Button>
          </div>
          {chatResponse && (
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-4">
                <p className="italic text-purple-900">{chatResponse}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
