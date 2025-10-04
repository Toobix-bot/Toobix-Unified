'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function MCPToolsPanel() {
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTools()
  }, [])

  async function loadTools() {
    try {
      const response = await fetch('http://localhost:3337/tools')
      const data = await response.json()
      setTools(data.tools || [])
    } catch (error) {
      console.error('Failed to load tools:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = {
    '🧠 Consciousness': [
      'consciousness_state',
      'consciousness_reflect',
      'consciousness_think',
      'consciousness_learn',
      'consciousness_communicate',
      'consciousness_thoughts'
    ],
    '✍️ Self-Coding': [
      'consciousness_analyze_code',
      'consciousness_generate_code',
      'consciousness_test_code',
      'consciousness_improve_self',
      'consciousness_read_function',
      'consciousness_save_code',
      'consciousness_self_coding_stats'
    ],
    '💾 Memory & RAG': [
      'memory_search',
      'memory_add'
    ],
    '🤖 AI Generation': [
      'generate'
    ],
    '⚡ Actions': [
      'trigger_action'
    ],
    '💫 Soul Engine': [
      'soul_state',
      'soul_update'
    ],
    '📖 Story System': [
      'story_state',
      'story_act',
      'story_progress'
    ],
    '👥 People Management': [
      'people_list',
      'people_add',
      'people_search',
      'interaction_add',
      'interaction_list'
    ]
  }

  if (loading) {
    return <div className="text-center py-8">Loading tools...</div>
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>🔧 All MCP Tools ({tools.length})</CardTitle>
          <CardDescription>
            Alle verfügbaren Tools des Systems - kombinierbar und verknüpfbar
          </CardDescription>
        </CardHeader>
      </Card>

      {Object.entries(categories).map(([category, toolNames]) => {
        const categoryTools = tools.filter(t => toolNames.includes(t.name))
        
        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{category}</span>
                <Badge variant="secondary">{categoryTools.length} Tools</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {toolNames.map(toolName => {
                  const tool = tools.find(t => t.name === toolName)
                  const isAvailable = !!tool
                  
                  return (
                    <div
                      key={toolName}
                      className={`p-4 border rounded-lg transition-all ${
                        isAvailable
                          ? 'hover:bg-muted hover:shadow-md cursor-pointer'
                          : 'opacity-50 bg-muted'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="font-mono text-sm font-semibold break-all">
                          {toolName}
                        </div>
                        {isAvailable ? (
                          <Badge className="bg-green-500 shrink-0">✓</Badge>
                        ) : (
                          <Badge variant="outline" className="shrink-0">?</Badge>
                        )}
                      </div>
                      {tool && (
                        <div className="text-xs text-muted-foreground mt-2">
                          {tool.description}
                        </div>
                      )}
                      {tool && tool.inputSchema && (
                        <div className="mt-2 text-xs">
                          <details className="cursor-pointer">
                            <summary className="text-muted-foreground hover:text-foreground">
                              Parameters
                            </summary>
                            <div className="mt-2 p-2 bg-muted rounded text-xs font-mono overflow-x-auto">
                              <pre>{JSON.stringify(tool.inputSchema.properties, null, 2)}</pre>
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}

      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/50">
        <CardHeader>
          <CardTitle>🔗 Tool Kombinationen</CardTitle>
          <CardDescription>
            Beispiele wie Tools zusammenarbeiten können
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-background rounded-lg border">
              <div className="font-semibold text-sm mb-2">💡 Code Analysis → Self-Improvement</div>
              <div className="text-xs text-muted-foreground mb-2">
                1. consciousness_analyze_code → 2. consciousness_improve_self
              </div>
              <Badge variant="outline" className="text-xs">Automatische Code-Optimierung</Badge>
            </div>

            <div className="p-3 bg-background rounded-lg border">
              <div className="font-semibold text-sm mb-2">💬 Luna Chat → Code Generation</div>
              <div className="text-xs text-muted-foreground mb-2">
                1. consciousness_communicate → 2. consciousness_generate_code → 3. consciousness_save_code
              </div>
              <Badge variant="outline" className="text-xs">Natürlichsprachliche Code-Erstellung</Badge>
            </div>

            <div className="p-3 bg-background rounded-lg border">
              <div className="font-semibold text-sm mb-2">🧠 Reflection → Memory Storage</div>
              <div className="text-xs text-muted-foreground mb-2">
                1. consciousness_reflect → 2. memory_add
              </div>
              <Badge variant="outline" className="text-xs">Gedanken im Langzeitgedächtnis speichern</Badge>
            </div>

            <div className="p-3 bg-background rounded-lg border">
              <div className="font-semibold text-sm mb-2">🤖 AI Generation → Code Testing</div>
              <div className="text-xs text-muted-foreground mb-2">
                1. generate (AI prompt) → 2. consciousness_generate_code → 3. consciousness_test_code
              </div>
              <Badge variant="outline" className="text-xs">AI-gesteuerte Code-Entwicklung</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
