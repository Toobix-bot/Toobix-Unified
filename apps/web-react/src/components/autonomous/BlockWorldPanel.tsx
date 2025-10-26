'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Bot, Play, Square, MapPin, Package, Hammer, RefreshCw } from 'lucide-react'

interface BlockBotStatus {
  id: string
  name: string
  state: string
  position: { x: number; y: number; z: number }
  goal: string
  inventory: Record<string, number>
  health: number
  actionsLog: string[]
  lastThinkTime: number
  isRunning: boolean
}

export function BlockWorldPanel() {
  const [status, setStatus] = useState<BlockBotStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStatus = async () => {
    try {
      const response = await fetch('http://localhost:9990/status', { signal: AbortSignal.timeout(2000) })
      if (response.ok) {
        const data = await response.json()
        setStatus(data)
      }
    } catch (error) {
      // Service offline - silently fail
    } finally {
      setLoading(false)
    }
  }

  const startBot = async () => {
    try {
      await fetch('http://localhost:9990/start', { method: 'POST', signal: AbortSignal.timeout(2000) })
      setTimeout(fetchStatus, 1000)
    } catch (error) {
      // Service offline - silently fail
    }
  }

  const stopBot = async () => {
    try {
      await fetch('http://localhost:9990/stop', { method: 'POST', signal: AbortSignal.timeout(2000) })
      setTimeout(fetchStatus, 1000)
    } catch (error) {
      // Service offline - silently fail
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Connecting to BlockBot AI...</p>
      </div>
    )
  }

  if (!status) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-12 text-center text-red-600">
          <p className="text-lg font-medium">Failed to connect to BlockBot AI</p>
          <p className="text-sm mt-2">Make sure the AI agent is running on port 9990</p>
          <Button onClick={fetchStatus} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    )
  }

  const blockNames: Record<string, string> = {
    '1': 'Grass',
    '2': 'Dirt',
    '3': 'Stone',
    '4': 'Wood',
    '5': 'Leaves'
  }

  const totalItems = Object.values(status.inventory).reduce((sum, val) => sum + val, 0)

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Bot className={`w-6 h-6 ${status.isRunning ? 'text-green-600 animate-bounce' : 'text-gray-400'}`} />
                BlockBot AI Agent
              </CardTitle>
              <CardDescription>
                Autonomous Minecraft-like AI playing BlockWorld
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {status.isRunning ? (
                <Button variant="destructive" onClick={stopBot}>
                  <Square className="w-4 h-4 mr-2" />
                  Stop Agent
                </Button>
              ) : (
                <Button variant="default" onClick={startBot} className="bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" />
                  Start Agent
                </Button>
              )}
              <Button variant="outline" onClick={fetchStatus}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={status.isRunning ? 'default' : 'secondary'} className={status.isRunning ? 'bg-green-600 text-lg px-4 py-1' : 'text-lg px-4 py-1'}>
                  {status.state.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{status.health}%</div>
                <Progress value={status.health} className="h-2 mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{totalItems}</div>
                <p className="text-xs text-muted-foreground">Total Items</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Current Goal & Position */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hammer className="w-5 h-5 text-orange-500" />
              Current Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-purple-700">{status.goal}</p>
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-muted-foreground">AI State: <span className="font-medium text-purple-600">{status.state}</span></p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              Position
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xs text-muted-foreground">X</div>
                <div className="text-2xl font-bold text-blue-600">{Math.floor(status.position.x)}</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xs text-muted-foreground">Y</div>
                <div className="text-2xl font-bold text-green-600">{Math.floor(status.position.y)}</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xs text-muted-foreground">Z</div>
                <div className="text-2xl font-bold text-purple-600">{Math.floor(status.position.z)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-500" />
            Inventory
          </CardTitle>
          <CardDescription>Resources collected by AI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.keys(status.inventory).length > 0 ? (
              Object.entries(status.inventory).map(([blockType, count]) => (
                <div key={blockType} className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg text-center border-2 border-indigo-200">
                  <div className="text-3xl mb-1">📦</div>
                  <div className="font-medium">{blockNames[blockType] || `Block ${blockType}`}</div>
                  <div className="text-2xl font-bold text-indigo-600">{count}</div>
                </div>
              ))
            ) : (
              <div className="col-span-5 text-center py-8 text-muted-foreground">
                No items collected yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Log */}
      <Card>
        <CardHeader>
          <CardTitle>Action Log</CardTitle>
          <CardDescription>Recent AI actions (auto-updates every 3s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {status.actionsLog.length > 0 ? (
              status.actionsLog.map((log, idx) => (
                <div key={idx} className="p-2 bg-gray-50 rounded text-sm font-mono">
                  {log}
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-muted-foreground">No actions yet. Start the agent to begin!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
