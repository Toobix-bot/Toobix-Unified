/**
 * Memory Service with RAG
 * Vector similarity search and memory management
 */

import type { Database } from 'bun:sqlite'
import type { MemoryChunk, SearchResult } from '../types'
import { nanoid } from 'nanoid'

export class MemoryService {
  private db: Database

  constructor(db: Database) {
    this.db = db
  }

  async add(text: string, metadata?: Record<string, any>): Promise<string> {
    const id = nanoid()
    const now = Date.now()

    this.db.run(`
      INSERT INTO memory_chunks (id, text, metadata, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `, [id, text, JSON.stringify(metadata || {}), now, now])

    return id
  }

  async search(query: string, limit: number = 10): Promise<SearchResult[]> {
    // Simple text search for now
    // TODO: Replace with proper vector similarity search
    
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
      score: this.calculateSimilarity(query, row.text)
    }))
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
    this.db.run('DELETE FROM memory_chunks WHERE id = ?', [id])
  }

  async count(): Promise<number> {
    const result = this.db.prepare('SELECT COUNT(*) as count FROM memory_chunks').get() as any
    return result.count
  }

  private calculateSimilarity(query: string, text: string): number {
    // Simple word overlap similarity
    const queryWords = new Set(query.toLowerCase().split(/\s+/))
    const textWords = text.toLowerCase().split(/\s+/)
    
    let matches = 0
    for (const word of textWords) {
      if (queryWords.has(word)) matches++
    }
    
    return matches / Math.max(queryWords.size, textWords.length)
  }
}
