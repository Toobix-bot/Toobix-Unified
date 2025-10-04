'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Brain, Search, Plus, Database, Sparkles, BookOpen } from 'lucide-react'

const API_URL = 'http://localhost:3337/mcp'

interface MemoryChunk {
  id?: string
  text: string
  metadata?: {
    source?: string
    timestamp?: string
    tags?: string[]
    [key: string]: any
  }
  score?: number
}

interface SearchResult extends MemoryChunk {
  relevance: number
}

export function MemoryPanel() {
  const [memories, setMemories] = useState<MemoryChunk[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [totalMemories, setTotalMemories] = useState(0)
  
  // Search form
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLimit, setSearchLimit] = useState(5)
  
  // Add memory form
  const [newMemoryText, setNewMemoryText] = useState('')
  const [newMemorySource, setNewMemorySource] = useState('')
  const [newMemoryTags, setNewMemoryTags] = useState('')

  const searchMemories = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'memory_search',
            arguments: {
              query: searchQuery,
              limit: searchLimit
            }
          }
        })
      })

      const data = await response.json()
      if (data.result?.content?.[0]?.text) {
        const parsed = JSON.parse(data.result.content[0].text)
        setSearchResults(parsed.results || [])
      }
    } catch (error) {
      console.error('Memory search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addMemory = async () => {
    if (!newMemoryText.trim()) return

    setLoading(true)
    try {
      const metadata: any = {
        source: newMemorySource || 'manual',
        timestamp: new Date().toISOString()
      }

      if (newMemoryTags.trim()) {
        metadata.tags = newMemoryTags.split(',').map(t => t.trim())
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'memory_add',
            arguments: {
              text: newMemoryText,
              metadata
            }
          }
        })
      })

      const data = await response.json()
      if (data.result?.content?.[0]?.text) {
        // Success
        setNewMemoryText('')
        setNewMemorySource('')
        setNewMemoryTags('')
        
        // Add to local memories
        setMemories(prev => [{
          text: newMemoryText,
          metadata
        }, ...prev])
        
        setTotalMemories(prev => prev + 1)
      }
    } catch (error) {
      console.error('Add memory error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3337/stats')
      if (response.ok) {
        const data = await response.json()
        setTotalMemories(data.memory || 0)
      }
    } catch (error) {
      console.error('Stats fetch error:', error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      {/* Memory Header */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Brain className="w-8 h-8" />
                Knowledge Base
              </CardTitle>
              <CardDescription className="text-indigo-100 mt-2">
                RAG-powered memory system with semantic search
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{totalMemories}</div>
              <div className="text-sm text-indigo-200">Memory Chunks</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Memories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-500">{totalMemories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Last Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500">{searchResults.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Results found</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Recent Adds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-500">{memories.length}</div>
            <div className="text-xs text-muted-foreground mt-1">This session</div>
          </CardContent>
        </Card>
      </div>

      {/* Search Memory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-500" />
            Search Knowledge Base
          </CardTitle>
          <CardDescription>
            Use semantic search to find relevant information (RAG-powered)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="What do you want to know?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchMemories()}
              className="flex-1"
            />
            <div className="flex items-center gap-2">
              <select
                value={searchLimit}
                onChange={(e) => setSearchLimit(Number(e.target.value))}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="3">Top 3</option>
                <option value="5">Top 5</option>
                <option value="10">Top 10</option>
                <option value="20">Top 20</option>
              </select>
              <Button onClick={searchMemories} disabled={!searchQuery.trim() || loading}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">Found {searchResults.length} relevant results:</span>
              </div>
              {searchResults.map((result, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      Relevance: {((result.relevance || result.score || 0) * 100).toFixed(1)}%
                    </Badge>
                    {result.metadata?.tags && (
                      <div className="flex gap-1">
                        {result.metadata.tags.map((tag: string, tagIdx: number) => (
                          <Badge key={tagIdx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed">{result.text}</p>
                  {result.metadata?.source && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Source: {result.metadata.source}
                    </div>
                  )}
                  {result.metadata?.timestamp && (
                    <div className="text-xs text-muted-foreground">
                      Added: {new Date(result.metadata.timestamp).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {searchResults.length === 0 && searchQuery && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              No results found for "{searchQuery}"
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Memory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-500" />
            Add Knowledge
          </CardTitle>
          <CardDescription>
            Store new information in the knowledge base
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="What information do you want to remember?"
            value={newMemoryText}
            onChange={(e) => setNewMemoryText(e.target.value)}
            rows={5}
            className="resize-none"
          />
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Source (optional)</label>
              <Input
                placeholder="e.g., Meeting notes, Research, Article..."
                value={newMemorySource}
                onChange={(e) => setNewMemorySource(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tags (optional, comma-separated)</label>
              <Input
                placeholder="e.g., tech, important, reference..."
                value={newMemoryTags}
                onChange={(e) => setNewMemoryTags(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={addMemory} className="w-full" disabled={!newMemoryText.trim() || loading}>
            <Plus className="w-4 h-4 mr-2" />
            {loading ? 'Adding...' : 'Add to Knowledge Base'}
          </Button>
        </CardContent>
      </Card>

      {/* Recently Added Memories */}
      {memories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              Recently Added
            </CardTitle>
            <CardDescription>Memories added this session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {memories.map((memory, idx) => (
                <div key={idx} className="p-3 bg-muted rounded-lg">
                  <p className="text-sm leading-relaxed mb-2">{memory.text}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {memory.metadata?.source && (
                      <Badge variant="secondary" className="text-xs">
                        {memory.metadata.source}
                      </Badge>
                    )}
                    {memory.metadata?.tags && memory.metadata.tags.map((tag: string, tagIdx: number) => (
                      <Badge key={tagIdx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {memory.metadata?.timestamp && (
                      <span>{new Date(memory.metadata.timestamp).toLocaleTimeString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-500" />
            How RAG Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="text-2xl">1️⃣</div>
              <div>
                <div className="font-medium mb-1">Store</div>
                <p className="text-muted-foreground">
                  Your text is converted into vector embeddings and stored in the database
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">2️⃣</div>
              <div>
                <div className="font-medium mb-1">Search</div>
                <p className="text-muted-foreground">
                  When you search, your query is also converted to a vector
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">3️⃣</div>
              <div>
                <div className="font-medium mb-1">Match</div>
                <p className="text-muted-foreground">
                  Semantic similarity finds the most relevant memories, even if words don't match exactly
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">4️⃣</div>
              <div>
                <div className="font-medium mb-1">Retrieve</div>
                <p className="text-muted-foreground">
                  Top results are returned, ranked by relevance score
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
