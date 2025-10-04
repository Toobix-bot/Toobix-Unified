/**
 * Memory Service with RAG
 * Vector similarity search and memory management
 */

import type { Database } from 'bun:sqlite'
import type { MemoryChunk, SearchResult } from '../types'
import { nanoid } from 'nanoid'
import { EmbeddingService, TextChunker, VectorStore } from './embeddings'

export class MemoryService {
  private db: Database
  private embedder?: EmbeddingService
  private chunker: TextChunker
  private vectorStore: VectorStore
  private useVectorSearch: boolean

  constructor(db: Database, apiKey?: string) {
    this.db = db
    this.chunker = new TextChunker(1000, 100)
    this.vectorStore = new VectorStore(db)
    this.useVectorSearch = !!apiKey
    
    if (apiKey) {
      this.embedder = new EmbeddingService({ apiKey })
      console.log('✅ Memory Service: Vector search enabled')
    } else {
      console.log('⚠️  Memory Service: Using keyword search only (no API key)')
    }
  }

  async add(text: string, metadata?: Record<string, any>): Promise<string> {
    const id = nanoid()
    const now = Date.now()

    // Store main memory chunk
    this.db.run(`
      INSERT INTO memory_chunks (id, text, metadata, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `, [id, text, JSON.stringify(metadata || {}), now, now])

    // Generate embeddings if available
    if (this.embedder && this.useVectorSearch) {
      // Chunk large texts
      const chunks = text.length > 1000 
        ? this.chunker.chunkBySentences(text)
        : [text]
      
      // Generate embeddings for each chunk
      const embeddings = await this.embedder.generateEmbeddings(chunks)
      
      // Store chunks with embeddings
      chunks.forEach((chunkText, index) => {
        this.vectorStore.storeChunk({
          id: `${id}_chunk_${index}`,
          text: chunkText,
          embedding: embeddings[index] || undefined,
          metadata: {
            memory_id: id,
            chunk_index: index,
            ...metadata
          },
          created_at: now
        })
      })
      
      console.log(`📦 Stored memory ${id} with ${chunks.length} chunks and embeddings`)
    }

    return id
  }

  async search(query: string, limit: number = 10): Promise<SearchResult[]> {
    // Hybrid search: Vector + Keyword
    
    if (this.embedder && this.useVectorSearch) {
      return await this.hybridSearch(query, limit)
    } else {
      return await this.keywordSearch(query, limit)
    }
  }
  
  /**
   * Hybrid search: Combines vector similarity and keyword matching
   */
  private async hybridSearch(query: string, limit: number): Promise<SearchResult[]> {
    // 1. Generate query embedding
    const queryEmbedding = await this.embedder!.generateEmbedding(query)
    
    if (!queryEmbedding) {
      console.warn('⚠️  Failed to generate query embedding, falling back to keyword search')
      return await this.keywordSearch(query, limit)
    }
    
    // 2. Vector similarity search
    const vectorResults = this.vectorStore.searchSimilar(queryEmbedding, limit * 2)
    
    // 3. Keyword search
    const keywordResults = await this.keywordSearch(query, limit * 2)
    
    // 4. Fusion: Combine and re-rank results
    const fusedResults = this.fuseResults(vectorResults, keywordResults, limit)
    
    return fusedResults
  }
  
  /**
   * Keyword search (fallback)
   */
  private async keywordSearch(query: string, limit: number): Promise<SearchResult[]> {
    const results = this.db.prepare(`
      SELECT * FROM memory_chunks
      WHERE text LIKE ?
      ORDER BY created_at DESC
      LIMIT ?
    `).all(`%${query}%`, limit) as any[]

    return results.map(row => ({
      chunk: {
        id: row.id,
        text: row.text,
        metadata: JSON.parse(row.metadata || '{}'),
        created_at: row.created_at,
        updated_at: row.updated_at
      },
      score: this.calculateKeywordSimilarity(query, row.text)
    }))
  }
  
  /**
   * Fuse vector and keyword results using Reciprocal Rank Fusion
   */
  private fuseResults(
    vectorResults: Array<any>,
    keywordResults: SearchResult[],
    limit: number
  ): SearchResult[] {
    const k = 60 // RRF constant
    const scores = new Map<string, number>()
    
    // Add vector scores
    vectorResults.forEach((result, index) => {
      const memoryId = result.metadata.memory_id
      const rrfScore = 1 / (k + index + 1)
      scores.set(memoryId, (scores.get(memoryId) || 0) + rrfScore * 0.7) // 70% weight
    })
    
    // Add keyword scores
    keywordResults.forEach((result, index) => {
      const memoryId = result.chunk.id
      const rrfScore = 1 / (k + index + 1)
      scores.set(memoryId, (scores.get(memoryId) || 0) + rrfScore * 0.3) // 30% weight
    })
    
    // Sort by fused score
    const fusedMemoryIds = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id)
    
    // Fetch full memory chunks
    const results: SearchResult[] = []
    
    for (const memoryId of fusedMemoryIds) {
      const row = this.db.prepare('SELECT * FROM memory_chunks WHERE id = ?').get(memoryId) as any
      
      if (row) {
        results.push({
          chunk: {
            id: row.id,
            text: row.text,
            metadata: JSON.parse(row.metadata || '{}'),
            created_at: row.created_at,
            updated_at: row.updated_at
          },
          score: scores.get(memoryId)!
        })
      }
    }
    
    return results
  }
  
  private calculateKeywordSimilarity(query: string, text: string): number {
    // Simple word overlap similarity
    const queryWords = new Set(query.toLowerCase().split(/\s+/))
    const textWords = text.toLowerCase().split(/\s+/)
    
    let matches = 0
    for (const word of textWords) {
      if (queryWords.has(word)) matches++
    }
    
    return matches / Math.max(queryWords.size, textWords.length)
  }

  async get(id: string): Promise<MemoryChunk | null> {
    const row = this.db.prepare('SELECT * FROM memory_chunks WHERE id = ?').get(id) as any

    if (!row) return null

    return {
      id: row.id,
      text: row.text,
      metadata: JSON.parse(row.metadata || '{}'),
      created_at: row.created_at,
      updated_at: row.updated_at
    }
  }

  async update(id: string, text: string, metadata?: Record<string, any>): Promise<void> {
    const now = Date.now()
    
    this.db.run(`
      UPDATE memory_chunks
      SET text = ?, metadata = ?, updated_at = ?
      WHERE id = ?
    `, [text, JSON.stringify(metadata || {}), now, id])
  }

  async delete(id: string): Promise<void> {
    // Delete main chunk
    this.db.run('DELETE FROM memory_chunks WHERE id = ?', [id])
    
    // Delete vector chunks (CASCADE should handle this, but be explicit)
    if (this.useVectorSearch) {
      this.db.run('DELETE FROM vector_chunks WHERE memory_id = ?', [id])
    }
  }

  async count(): Promise<number> {
    const result = this.db.prepare('SELECT COUNT(*) as count FROM memory_chunks').get() as any
    return result.count
  }
  
  /**
   * Get memory statistics
   */
  async getStats(): Promise<{
    totalMemories: number
    totalChunks: number
    vectorSearchEnabled: boolean
    avgChunksPerMemory: number
  }> {
    const totalMemories = await this.count()
    
    let totalChunks = 0
    if (this.useVectorSearch) {
      const result = this.db.prepare('SELECT COUNT(*) as count FROM vector_chunks').get() as any
      totalChunks = result.count
    }
    
    return {
      totalMemories,
      totalChunks,
      vectorSearchEnabled: this.useVectorSearch,
      avgChunksPerMemory: totalMemories > 0 ? totalChunks / totalMemories : 0
    }
  }
}
