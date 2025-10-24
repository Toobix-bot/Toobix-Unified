'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Wrench, Plus, CheckCircle2, Clock, XCircle, Code, Sparkles } from 'lucide-react'

interface ToolRequest {
  id: string
  capability: string
  reason: string
  status: 'pending' | 'generating' | 'approved' | 'rejected' | 'complete'
  confidence?: number
  generatedAt?: string
}

interface GeneratedTool {
  id: string
  name: string
  description: string
  code: string
  status: 'active' | 'inactive'
  createdAt: string
}

export function ToolGeneratorPanel() {
  const [toolRequests, setToolRequests] = useState<ToolRequest[]>([])
  const [generatedTools, setGeneratedTools] = useState<GeneratedTool[]>([])
  const [newCapability, setNewCapability] = useState('')
  const [newReason, setNewReason] = useState('')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    // Mock data
    setToolRequests([
      {
        id: '1',
        capability: 'Search the web using a search engine API',
        reason: 'User might ask to search for current information',
        status: 'complete',
        confidence: 87.5,
        generatedAt: '2025-10-24T12:30:00Z'
      },
      {
        id: '2',
        capability: 'Analyze code complexity metrics',
        reason: 'Need to assess codebase quality',
        status: 'pending',
      }
    ])

    setGeneratedTools([
      {
        id: 't1',
        name: 'web_search',
        description: 'Search the web using DuckDuckGo API',
        code: 'async function webSearch(query: string) { ... }',
        status: 'active',
        createdAt: '2025-10-24T12:30:00Z'
      }
    ])
  }, [])

  const requestNewTool = async () => {
    if (!newCapability.trim() || !newReason.trim()) return

    setGenerating(true)
    const newRequest: ToolRequest = {
      id: Date.now().toString(),
      capability: newCapability,
      reason: newReason,
      status: 'generating'
    }

    setToolRequests(prev => [newRequest, ...prev])
    setNewCapability('')
    setNewReason('')

    // Simulate generation
    setTimeout(() => {
      setToolRequests(prev =>
        prev.map(req =>
          req.id === newRequest.id
            ? { ...req, status: 'complete', confidence: Math.random() * 30 + 70, generatedAt: new Date().toISOString() }
            : req
        )
      )
      setGenerating(false)
    }, 5000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'generating': return <Clock className="w-5 h-5 text-blue-600 animate-spin" />
      case 'rejected': return <XCircle className="w-5 h-5 text-red-600" />
      case 'approved': return <CheckCircle2 className="w-5 h-5 text-purple-600" />
      default: return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-50 border-green-300'
      case 'generating': return 'bg-blue-50 border-blue-300'
      case 'rejected': return 'bg-red-50 border-red-300'
      case 'approved': return 'bg-purple-50 border-purple-300'
      default: return 'bg-gray-50 border-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Tool Generator */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Wrench className="w-6 h-6 text-indigo-600" />
            Autonomous Tool Generator
          </CardTitle>
          <CardDescription>
            AI generates new tools based on capability descriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">What capability do you need?</label>
              <Input
                placeholder="e.g., Send emails via SMTP, Query SQL database, Generate PDFs"
                value={newCapability}
                onChange={(e) => setNewCapability(e.target.value)}
                className="mb-3"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Why is this needed?</label>
              <Textarea
                placeholder="Explain the use case and why this tool would be valuable..."
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                rows={3}
              />
            </div>
            <Button
              onClick={requestNewTool}
              disabled={generating || !newCapability.trim() || !newReason.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {generating ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Generating Tool...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Request Tool Generation
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tool Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Tool Requests
          </CardTitle>
          <CardDescription>AI-powered tool generation history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {toolRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No tool requests yet. Request your first tool above!
              </div>
            ) : (
              toolRequests.map((request) => (
                <div
                  key={request.id}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(request.status)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(request.status)}
                      <div className="flex-1">
                        <div className="font-medium mb-1">{request.capability}</div>
                        <p className="text-sm text-muted-foreground mb-2">{request.reason}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {request.status.toUpperCase()}
                          </Badge>
                          {request.confidence && (
                            <Badge
                              variant={request.confidence >= 80 ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {request.confidence.toFixed(1)}% confidence
                            </Badge>
                          )}
                          {request.generatedAt && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(request.generatedAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generated Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-green-500" />
            Generated Tools
          </CardTitle>
          <CardDescription>Successfully created autonomous tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {generatedTools.map((tool) => (
              <div
                key={tool.id}
                className="p-4 rounded-lg border-2 bg-green-50 border-green-300"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium font-mono">{tool.name}()</div>
                    <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                  </div>
                  <Badge variant={tool.status === 'active' ? 'default' : 'secondary'} className="bg-green-600">
                    {tool.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="mt-3 p-3 bg-gray-900 rounded text-xs font-mono text-green-400 overflow-x-auto">
                  {tool.code}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Created: {new Date(tool.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
