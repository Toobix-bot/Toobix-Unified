'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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

export function SelfCodingPanel() {
  const [stats, setStats] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})
  const [generatedCode, setGeneratedCode] = useState('')

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const result = await callMCP('consciousness_self_coding_stats', {})
      setStats(result)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  async function analyzeCode() {
    setLoading({ analyze: true })
    try {
      const result = await callMCP('consciousness_analyze_code', { detailed: true })
      setAnalysis(result)
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Fehler bei der Code-Analyse')
    } finally {
      setLoading({})
    }
  }

  async function generateCode() {
    setLoading({ generate: true })
    try {
      const result = await callMCP('consciousness_generate_code', {
        type: 'function',
        name: 'calculateFactorial',
        description: 'Calculate the factorial of a number',
        parameters: [{ name: 'n', type: 'number' }],
        returnType: 'number'
      })
      setGeneratedCode(result.code || JSON.stringify(result, null, 2))
    } catch (error) {
      console.error('Generation error:', error)
      alert('Fehler bei der Code-Generierung')
    } finally {
      setLoading({})
    }
  }

  async function testCode() {
    setLoading({ test: true })
    try {
      const result = await callMCP('consciousness_test_code', {
        code: 'console.log("Test successful!"); return 42;',
        timeout: 5000
      })
      alert(`Test Result:\nSuccess: ${result.success}\nOutput: ${result.output}\nTime: ${result.executionTime}ms`)
    } catch (error) {
      console.error('Test error:', error)
      alert('Fehler beim Code-Test')
    } finally {
      setLoading({})
    }
  }

  async function improveSelf() {
    setLoading({ improve: true })
    try {
      const result = await callMCP('consciousness_improve_self', { autoApply: false })
      alert(`Self-Improvement Complete!\n\nTotal Attempts: ${result.totalAttempts}\nSuccessful: ${result.successfulAttempts}\nSuccess Rate: ${result.successRate.toFixed(1)}%`)
      loadStats() // Reload stats
    } catch (error) {
      console.error('Improvement error:', error)
      alert('Fehler beim Self-Improvement')
    } finally {
      setLoading({})
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>📊 Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Total Attempts:</span>
              <span className="font-bold">{stats?.totalAttempts || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Successful:</span>
              <Badge className="bg-green-500">{stats?.successfulAttempts || 0}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Deployed:</span>
              <Badge className="bg-blue-500">{stats?.deployedImprovements || 0}</Badge>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-2 text-sm">
                <span>Success Rate:</span>
                <span className="font-bold">{stats?.successRate?.toFixed(1) || 0}%</span>
              </div>
              <Progress value={stats?.successRate || 0} />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>🚀 Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={analyzeCode} disabled={loading.analyze} variant="outline">
                {loading.analyze ? '🔍 Analysiert...' : '🔍 Code Analysieren'}
              </Button>
              <Button onClick={generateCode} disabled={loading.generate} variant="outline">
                {loading.generate ? '✨ Generiert...' : '✨ Code Generieren'}
              </Button>
              <Button onClick={testCode} disabled={loading.test} variant="outline">
                {loading.test ? '🧪 Testet...' : '🧪 Code Testen'}
              </Button>
              <Button onClick={improveSelf} disabled={loading.improve} className="bg-gradient-to-r from-purple-500 to-blue-500">
                {loading.improve ? '🔄 Verbessert...' : '🔄 Self-Improve'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analysis">📊 Analysis</TabsTrigger>
          <TabsTrigger value="generated">✨ Generated Code</TabsTrigger>
          <TabsTrigger value="custom">🛠️ Custom Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>📋 Code Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              {!analysis ? (
                <p className="text-center text-muted-foreground py-8">
                  Klicke auf "Code Analysieren" um die Codebase zu scannen
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold">{analysis.totalFiles}</div>
                      <div className="text-sm text-muted-foreground">Files</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold">{analysis.totalLines}</div>
                      <div className="text-sm text-muted-foreground">Lines</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold">{analysis.totalFunctions}</div>
                      <div className="text-sm text-muted-foreground">Functions</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold">{analysis.modules?.length || 0}</div>
                      <div className="text-sm text-muted-foreground">Modules</div>
                    </div>
                  </div>

                  {analysis.modules && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Top Modules:</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {analysis.modules.slice(0, 10).map((mod: any, idx: number) => (
                          <div key={idx} className="p-3 bg-muted rounded-lg text-sm">
                            <div className="font-mono text-xs mb-1">{mod.path}</div>
                            <div className="flex gap-3 text-xs text-muted-foreground">
                              <span>Exports: {Array.isArray(mod.exports) ? mod.exports.length : mod.exports || 0}</span>
                              <span>Functions: {Array.isArray(mod.functions) ? mod.functions.length : mod.functions || 0}</span>
                              <span>Classes: {Array.isArray(mod.classes) ? mod.classes.length : mod.classes || 0}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generated">
          <Card>
            <CardHeader>
              <CardTitle>✨ Generated Code</CardTitle>
              <CardDescription>Zuletzt generierter Code</CardDescription>
            </CardHeader>
            <CardContent>
              {!generatedCode ? (
                <p className="text-center text-muted-foreground py-8">
                  Klicke auf "Code Generieren" um Code zu erstellen
                </p>
              ) : (
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm font-mono">
                  {generatedCode}
                </pre>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>🛠️ Custom Code Generator</CardTitle>
              <CardDescription>Erstelle benutzerdefinierten Code</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomCodeGenerator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CustomCodeGenerator() {
  const [form, setForm] = useState({
    type: 'function',
    name: '',
    description: '',
    parameters: '',
    returnType: ''
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    try {
      let params: any = {
        type: form.type,
        name: form.name,
        description: form.description
      }

      if (form.parameters) {
        try {
          params.parameters = JSON.parse(form.parameters)
        } catch {
          alert('Invalid JSON in parameters field')
          return
        }
      }

      if (form.returnType) {
        params.returnType = form.returnType
      }

      const result = await callMCP('consciousness_generate_code', params)
      setResult(result.code || JSON.stringify(result, null, 2))
    } catch (error) {
      console.error('Generation error:', error)
      alert('Fehler bei der Code-Generierung')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Type:</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="function">Function</option>
            <option value="class">Class</option>
            <option value="interface">Interface</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Name:</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="z.B. calculateSum"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Description:</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Was soll der Code tun?"
            rows={3}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {form.type === 'function' && (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Parameters (JSON Array):</label>
              <textarea
                value={form.parameters}
                onChange={(e) => setForm({ ...form, parameters: e.target.value })}
                placeholder='[{"name":"x","type":"number"},{"name":"y","type":"number"}]'
                rows={3}
                className="w-full px-3 py-2 border rounded-md font-mono text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Return Type:</label>
              <input
                type="text"
                value={form.returnType}
                onChange={(e) => setForm({ ...form, returnType: e.target.value })}
                placeholder="z.B. number, string, Promise<void>"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </>
        )}
      </div>

      <Button onClick={generate} disabled={loading || !form.name} className="w-full">
        {loading ? '✨ Generiert...' : '✨ Code Generieren'}
      </Button>

      {result && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Generated Code:</h3>
          <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm font-mono">
            {result}
          </pre>
        </div>
      )}
    </div>
  )
}
