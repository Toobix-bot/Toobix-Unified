/**
 * 🧠 Embedding Service - Vector embeddings for semantic search
 * 
 * Uses OpenAI text-embedding-3-small model (1536 dimensions)
 * Enables semantic similarity search for memories
 */

import type { Database } from 'bun:sqlite'

export interface EmbeddingConfig {
  apiKey: string
  model?: string
  dimensions?: number
}

export interface TextChunk {
  id: string
  text: string
  embedding?: number[]
  metadata?: Record<string, any>
  created_at: number
}

/**
 * Generate embeddings using OpenAI API
 */
export class EmbeddingService {
  private apiKey: string
  private model: string
  private dimensions: number
  
  constructor(config: EmbeddingConfig) {
    this.apiKey = config.apiKey || process.env.OPENAI_API_KEY || ''
    this.model = config.model || 'text-embedding-3-small'
    this.dimensions = config.dimensions || 1536
    
    if (!this.apiKey) {
      console.warn('⚠️  No OpenAI API key provided. Embeddings will be disabled.')
    }
  }
  
  /**
   * Generate embedding vector for text
   */
  async generateEmbedding(text: string): Promise<number[] | null> {
    if (!this.apiKey) return null
    
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          input: text,
          dimensions: this.dimensions
        })
      })
      
      if (!response.ok) {
        const error = await response.text()
        console.error('❌ Embedding API error:', error)
        return null
      }
      
      const data = await response.json()
      return data.data[0].embedding
      
    } catch (error: any) {
      console.error('❌ Embedding generation failed:', error.message)
      return null
    }
  }
  
  /**
   * Generate embeddings for multiple texts (batch)
   */
  async generateEmbeddings(texts: string[]): Promise<(number[] | null)[]> {
    if (!this.apiKey) return texts.map(() => null)
    
    // Process in batches of 20 (OpenAI limit is 2048 tokens per request)
    const batchSize = 20
    const results: (number[] | null)[] = []
    
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize)
      
      try {
        const response = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: this.model,
            input: batch,
            dimensions: this.dimensions
          })
        })
        
        if (!response.ok) {
          console.error('❌ Batch embedding failed')
          results.push(...batch.map(() => null))
          continue
        }
        
        const data = await response.json()
        results.push(...data.data.map((item: any) => item.embedding))
        
      } catch (error: any) {
        console.error('❌ Batch embedding error:', error.message)
        results.push(...batch.map(() => null))
      }
    }
    
    return results
  }
  
  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have same length')
    }
    
    let dotProduct = 0
    let normA = 0
    let normB = 0
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }
    
    if (normA === 0 || normB === 0) return 0
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }
  
  /**
   * Find most similar vectors using cosine similarity
   */
  findSimilar(query: number[], candidates: number[][], topK: number = 5): Array<{ index: number, similarity: number }> {
    const similarities = candidates.map((candidate, index) => ({
      index,
      similarity: this.cosineSimilarity(query, candidate)
    }))
    
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
  }
}

/**
 * Semantic text chunking - split large texts into meaningful chunks
 */
export class TextChunker {
  private maxChunkSize: number
  private overlap: number
  
  constructor(maxChunkSize: number = 1000, overlap: number = 100) {
    this.maxChunkSize = maxChunkSize
    this.overlap = overlap
  }
  
  /**
   * Split text into chunks by sentences (semantic boundaries)
   */
  chunkBySentences(text: string): string[] {
    // Split by sentence boundaries
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
    
    const chunks: string[] = []
    let currentChunk = ''
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim()
      
      if (currentChunk.length + trimmed.length > this.maxChunkSize) {
        if (currentChunk) chunks.push(currentChunk)
        currentChunk = trimmed
      } else {
        currentChunk += (currentChunk ? ' ' : '') + trimmed
      }
    }
    
    if (currentChunk) chunks.push(currentChunk)
    
    return chunks
  }
  
  /**
   * Split text into overlapping chunks (for better context)
   */
  chunkWithOverlap(text: string): string[] {
    const chunks: string[] = []
    let start = 0
    
    while (start < text.length) {
      const end = Math.min(start + this.maxChunkSize, text.length)
      chunks.push(text.slice(start, end))
      start += this.maxChunkSize - this.overlap
    }
    
    return chunks
  }
  
  /**
   * Split text by paragraphs (natural boundaries)
   */
  chunkByParagraphs(text: string): string[] {
    return text
      .split(/\n\n+/)
      .map(p => p.trim())
      .filter(p => p.length > 0)
  }
}

/**
 * Vector storage in SQLite
 */
export class VectorStore {
  constructor(private db: Database) {
    this.initializeTables()
  }
  
  private initializeTables() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS memory_chunks (
        id TEXT PRIMARY KEY,
        memory_id TEXT NOT NULL,
        chunk_index INTEGER NOT NULL,
        text TEXT NOT NULL,
        embedding BLOB,
        metadata TEXT,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (memory_id) REFERENCES memory(id)
      )
    `)
    
    this.db.run(`
      CREATE INDEX IF NOT EXISTS idx_memory_chunks_memory_id 
      ON memory_chunks(memory_id)
    `)
  }
  
  /**
   * Store chunk with embedding
   */
  storeChunk(chunk: TextChunk): void {
    const embeddingBlob = chunk.embedding 
      ? Buffer.from(new Float32Array(chunk.embedding).buffer)
      : null
    
    this.db.prepare(`
      INSERT INTO memory_chunks (id, memory_id, chunk_index, text, embedding, metadata, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      chunk.id,
      chunk.metadata?.memory_id || 'unknown',
      chunk.metadata?.chunk_index || 0,
      chunk.text,
      embeddingBlob,
      JSON.stringify(chunk.metadata || {}),
      chunk.created_at
    )
  }
  
  /**
   * Get all chunks for a memory
   */
  getChunks(memoryId: string): TextChunk[] {
    const rows = this.db.prepare(`
      SELECT * FROM memory_chunks WHERE memory_id = ? ORDER BY chunk_index
    `).all(memoryId) as any[]
    
    return rows.map(row => ({
      id: row.id,
      text: row.text,
      embedding: row.embedding ? Array.from(new Float32Array(row.embedding.buffer)) : undefined,
      metadata: JSON.parse(row.metadata),
      created_at: row.created_at
    }))
  }
  
  /**
   * Search by vector similarity (brute force for now)
   * TODO: Add FAISS or Annoy for faster search
   */
  searchSimilar(queryEmbedding: number[], limit: number = 5): Array<TextChunk & { similarity: number }> {
    const allChunks = this.db.prepare(`
      SELECT * FROM memory_chunks WHERE embedding IS NOT NULL
    `).all() as any[]
    
    const embedder = new EmbeddingService({ apiKey: '' })
    
    const results = allChunks.map(row => {
      const embedding = Array.from(new Float32Array(row.embedding.buffer))
      const similarity = embedder.cosineSimilarity(queryEmbedding, embedding)
      
      return {
        id: row.id,
        text: row.text,
        embedding,
        metadata: JSON.parse(row.metadata),
        created_at: row.created_at,
        similarity
      }
    })
    
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
  }
}
