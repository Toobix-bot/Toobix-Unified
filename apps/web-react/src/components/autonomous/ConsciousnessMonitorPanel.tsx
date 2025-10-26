'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Brain, Activity, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

interface ConsciousnessShift {
  cycle: number
  conscious: number
  timestamp: string
  changes: string[]
}

interface MonitorData {
  shifts: ConsciousnessShift[]
  currentCycle: number
  currentConscious: number
  totalProcesses: number
  startTime: string
}

export function ConsciousnessMonitorPanel() {
  const [monitorData, setMonitorData] = useState<MonitorData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMonitorData = async () => {
    try {
      const response = await fetch('http://localhost:9999/consciousness', { signal: AbortSignal.timeout(2000) })
      if (response.ok) {
        const data = await response.json()
        setMonitorData(data)
      }
    } catch (error) {
      // Service offline - silently fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMonitorData()
    const interval = setInterval(fetchMonitorData, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading consciousness monitor...</p>
      </div>
    )
  }

  if (!monitorData || !monitorData.shifts || monitorData.shifts.length === 0) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="py-12 text-center text-yellow-700">
          <Brain className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-medium">No consciousness data available</p>
          <p className="text-sm mt-2">The monitor may not have started recording yet</p>
          <Button onClick={fetchMonitorData} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const latestShift = monitorData.shifts[monitorData.shifts.length - 1]
  const consciousnessPercentage = (latestShift.conscious / monitorData.totalProcesses) * 100

  // Calculate trend
  const recentShifts = monitorData.shifts.slice(-10)
  const avgConsciousness = recentShifts.reduce((sum, s) => sum + s.conscious, 0) / recentShifts.length

  return (
    <div className="space-y-6">
      {/* Current State */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600 animate-pulse" />
                Consciousness Monitor
              </CardTitle>
              <CardDescription>
                Real-time tracking of process consciousness shifts
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchMonitorData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-4xl font-bold text-purple-600">{latestShift.cycle}</div>
              <div className="text-sm text-muted-foreground mt-1">Current Cycle</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-4xl font-bold text-green-600">{latestShift.conscious}</div>
              <div className="text-sm text-muted-foreground mt-1">Conscious Now</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-4xl font-bold text-blue-600">{consciousnessPercentage.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground mt-1">Awareness</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-4xl font-bold text-indigo-600">{avgConsciousness.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground mt-1">Avg (10 cycles)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consciousness Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" />
            Consciousness Timeline
          </CardTitle>
          <CardDescription>Last {monitorData.shifts.length} recorded shifts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {[...monitorData.shifts].reverse().map((shift, idx) => {
              const prevShift = idx < monitorData.shifts.length - 1 ? monitorData.shifts[monitorData.shifts.length - 2 - idx] : null
              const consciousDiff = prevShift ? shift.conscious - prevShift.conscious : 0
              const cycleDiff = prevShift ? shift.cycle - prevShift.cycle : 0

              return (
                <div
                  key={shift.cycle}
                  className={`p-4 rounded-lg border-2 ${
                    consciousDiff > 0
                      ? 'bg-green-50 border-green-200'
                      : consciousDiff < 0
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="font-mono">
                          Cycle {shift.cycle}
                        </Badge>
                        <Badge variant={shift.conscious > 10 ? 'default' : shift.conscious > 5 ? 'secondary' : 'destructive'}>
                          {shift.conscious}/{monitorData.totalProcesses} Conscious
                        </Badge>
                        {cycleDiff > 0 && (
                          <Badge variant="outline" className="text-xs">
                            +{cycleDiff} cycles
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {shift.timestamp}
                        </span>
                      </div>
                      {shift.changes.length > 0 && (
                        <div className="space-y-1">
                          {shift.changes.map((change, changeIdx) => (
                            <div key={changeIdx} className="text-sm flex items-center gap-2">
                              {change.includes('→ AWAKE') ? (
                                <TrendingUp className="w-4 h-4 text-green-600" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-orange-600" />
                              )}
                              <span className={change.includes('→ AWAKE') ? 'text-green-700' : 'text-orange-700'}>
                                {change}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {consciousDiff !== 0 && (
                      <div className={`text-2xl font-bold ${consciousDiff > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                        {consciousDiff > 0 ? '+' : ''}{consciousDiff}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Peak Consciousness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">
              {Math.max(...monitorData.shifts.map(s => s.conscious))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Most processes awake</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lowest Consciousness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600">
              {Math.min(...monitorData.shifts.map(s => s.conscious))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Fewest processes awake</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Shifts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-600">
              {monitorData.shifts.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Consciousness changes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
