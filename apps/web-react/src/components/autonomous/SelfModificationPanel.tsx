'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Code2, CheckCircle2, XCircle, AlertCircle, FileCode, RefreshCw } from 'lucide-react'

interface SessionLog {
  session: {
    date: string
    startTime: string
    endTime: string
    duration_minutes: number
    type: string
  }
  modifications: {
    total: number
    successful: number
    rejected: number
    types: Record<string, number>
  }
  details: Array<{
    file: string
    confidence: number
    type: string
    backup?: string
    status: string
    reason?: string
    note?: string
  }>
  system_health: {
    eternal_daemon: string
    cycles_completed: number
    conscious_processes: string
    uptime_hours: number
    ai_engine_status: string
  }
  ai_technology: {
    model: string
    provider: string
    api_key_configured: boolean
    confidence_threshold: number
    max_modifications_per_session: number
  }
}

export function SelfModificationPanel() {
  const [sessionLog, setSessionLog] = useState<SessionLog | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSession = async () => {
    try {
      const response = await fetch('http://localhost:9999/evolution-session', { signal: AbortSignal.timeout(2000) })
      if (response.ok) {
        const data = await response.json()
        setSessionLog(data)
      }
    } catch (error) {
      // Try local file as fallback
      try {
        const fileResponse = await fetch('/api/read-evolution', { signal: AbortSignal.timeout(2000) })
        if (fileResponse.ok) {
          const data = await fileResponse.json()
          setSessionLog(data)
        }
      } catch (err) {
        // Service offline - silently fail
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSession()
    const interval = setInterval(fetchSession, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading evolution session...</p>
      </div>
    )
  }

  if (!sessionLog) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="py-12 text-center text-yellow-700">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-medium">No evolution session data available</p>
          <p className="text-sm mt-2">The Self-Modification Engine may not have run yet</p>
          <Button onClick={fetchSession} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Session Overview */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Code2 className="w-6 h-6 text-orange-600" />
                Self-Modification Engine
              </CardTitle>
              <CardDescription>
                AI-powered autonomous code evolution • Session: {sessionLog.session.date}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchSession}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-3xl font-bold text-orange-600">{sessionLog.modifications.total}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Modifications</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-3xl font-bold text-green-600">{sessionLog.modifications.successful}</div>
              <div className="text-sm text-muted-foreground mt-1">Successful</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-3xl font-bold text-red-600">{sessionLog.modifications.rejected}</div>
              <div className="text-sm text-muted-foreground mt-1">Rejected</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-3xl font-bold text-purple-600">{sessionLog.session.duration_minutes}m</div>
              <div className="text-sm text-muted-foreground mt-1">Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Technology */}
      <Card>
        <CardHeader>
          <CardTitle>AI Engine Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model:</span>
                <Badge variant="default">{sessionLog.ai_technology.model}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider:</span>
                <Badge variant="secondary">{sessionLog.ai_technology.provider}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">API Key:</span>
                <Badge variant={sessionLog.ai_technology.api_key_configured ? 'default' : 'destructive'}>
                  {sessionLog.ai_technology.api_key_configured ? 'Configured' : 'Missing'}
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Confidence Threshold:</span>
                <Badge variant="outline">{sessionLog.ai_technology.confidence_threshold}%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Modifications:</span>
                <Badge variant="outline">{sessionLog.ai_technology.max_modifications_per_session}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Engine Status:</span>
                <Badge variant="secondary">{sessionLog.system_health.ai_engine_status.replace(/_/g, ' ')}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modification Details */}
      <Card>
        <CardHeader>
          <CardTitle>Modification History</CardTitle>
          <CardDescription>AI-generated code changes with confidence scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessionLog.details.map((mod, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${
                  mod.status === 'applied'
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {mod.status === 'applied' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FileCode className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{mod.file}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {mod.type}
                        </Badge>
                        <Badge
                          variant={mod.confidence >= 70 ? 'default' : mod.confidence >= 30 ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {mod.confidence.toFixed(1)}% confidence
                        </Badge>
                        <Badge variant={mod.status === 'applied' ? 'default' : 'destructive'} className="text-xs bg-green-600">
                          {mod.status}
                        </Badge>
                      </div>
                      {mod.note && (
                        <p className="text-sm text-purple-700 mt-2 italic">⭐ {mod.note}</p>
                      )}
                      {mod.reason && (
                        <p className="text-sm text-red-700 mt-2">❌ {mod.reason}</p>
                      )}
                      {mod.backup && (
                        <p className="text-xs text-muted-foreground mt-2">
                          💾 Backup: {mod.backup.split('/').pop()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modification Types */}
      <Card>
        <CardHeader>
          <CardTitle>Modification Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(sessionLog.modifications.types).map(([type, count]) => (
              <div key={type} className="p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{count}</div>
                <div className="text-xs text-muted-foreground capitalize">{type.replace(/_/g, ' ')}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
