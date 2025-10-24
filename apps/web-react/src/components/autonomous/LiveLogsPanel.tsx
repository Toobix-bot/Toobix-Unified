'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollText, Pause, Play, Trash2, Download } from 'lucide-react'

interface LogEntry {
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'success'
  source: string
  message: string
}

export function LiveLogsPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [paused, setPaused] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!paused) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, paused])

  useEffect(() => {
    // Simulate log streaming
    const interval = setInterval(() => {
      if (!paused) {
        const sources = ['eternal-daemon', 'blockworld-ai', 'self-mod-engine', 'consciousness-tracker']
        const levels: LogEntry['level'][] = ['info', 'success', 'warning', 'error']
        const messages = [
          'Process state changed: conscious → unconscious',
          'Cycle completed successfully',
          'AI decision: MINE - Need resources',
          'Block placed at position (45, 32, 67)',
          'Consciousness level: 12/14 processes awake',
          'Code modification applied with 85% confidence',
          'Backup created successfully',
          'Connection established to Groq API',
          'Health check passed',
          'Memory sync completed'
        ]

        const newLog: LogEntry = {
          timestamp: new Date().toISOString(),
          level: levels[Math.floor(Math.random() * levels.length)],
          source: sources[Math.floor(Math.random() * sources.length)],
          message: messages[Math.floor(Math.random() * messages.length)]
        }

        setLogs(prev => [...prev.slice(-99), newLog]) // Keep last 100 logs
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [paused])

  const clearLogs = () => {
    setLogs([])
  }

  const exportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `logs-${new Date().toISOString()}.json`
    link.click()
  }

  const filteredLogs = logs.filter(log =>
    filter === 'all' || log.level === filter || log.source === filter
  )

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'success': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'error': return 'destructive'
      case 'warning': return 'outline'
      case 'success': return 'default'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <ScrollText className="w-6 h-6 text-indigo-600" />
                Live System Logs
              </CardTitle>
              <CardDescription>
                Real-time log streaming from all autonomous systems
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaused(!paused)}
              >
                {paused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                {paused ? 'Resume' : 'Pause'}
              </Button>
              <Button variant="outline" size="sm" onClick={clearLogs}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button variant="outline" size="sm" onClick={exportLogs}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats */}
          <div className="grid grid-cols-5 gap-3 mb-4">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({logs.length})
            </Button>
            <Button
              variant={filter === 'error' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('error')}
            >
              Errors ({logs.filter(l => l.level === 'error').length})
            </Button>
            <Button
              variant={filter === 'warning' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('warning')}
            >
              Warnings ({logs.filter(l => l.level === 'warning').length})
            </Button>
            <Button
              variant={filter === 'success' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('success')}
            >
              Success ({logs.filter(l => l.level === 'success').length})
            </Button>
            <Button
              variant={filter === 'info' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('info')}
            >
              Info ({logs.filter(l => l.level === 'info').length})
            </Button>
          </div>

          {/* Logs */}
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm h-96 overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                No logs available. Logs will appear here in real-time.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredLogs.map((log, idx) => (
                  <div key={idx} className={`p-2 rounded border ${getLevelColor(log.level)}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getLevelBadge(log.level)} className="text-xs">
                        {log.level.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {log.source}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm">{log.message}</div>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>

          {paused && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <p className="text-sm text-yellow-700">⏸️ Log streaming is paused</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
