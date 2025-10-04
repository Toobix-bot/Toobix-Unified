/**
 * 🔄 Batch Processing - Optimize bulk operations
 * 
 * Process multiple operations efficiently with batching and parallelization
 */

export interface BatchConfig {
  batchSize: number
  parallelism: number
  delayMs?: number
}

/**
 * Batch processor for bulk operations
 */
export class BatchProcessor<T, R> {
  private queue: T[] = []
  private processing = false
  private config: Required<BatchConfig>
  
  constructor(
    private processor: (batch: T[]) => Promise<R[]>,
    config: Partial<BatchConfig> = {}
  ) {
    this.config = {
      batchSize: config.batchSize || 100,
      parallelism: config.parallelism || 5,
      delayMs: config.delayMs || 0
    }
  }
  
  /**
   * Add items to queue
   */
  async add(items: T[]): Promise<R[]> {
    this.queue.push(...items)
    
    if (!this.processing) {
      return this.processQueue()
    }
    
    return []
  }
  
  /**
   * Process entire queue
   */
  private async processQueue(): Promise<R[]> {
    this.processing = true
    const results: R[] = []
    
    try {
      while (this.queue.length > 0) {
        // Take batch from queue
        const batch = this.queue.splice(0, this.config.batchSize)
        
        // Process batch
        const batchResults = await this.processor(batch)
        results.push(...batchResults)
        
        // Optional delay between batches
        if (this.config.delayMs > 0 && this.queue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, this.config.delayMs))
        }
      }
    } finally {
      this.processing = false
    }
    
    return results
  }
  
  /**
   * Process items in parallel batches
   */
  static async processParallel<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    parallelism: number = 5
  ): Promise<R[]> {
    const results: R[] = []
    
    for (let i = 0; i < items.length; i += parallelism) {
      const batch = items.slice(i, i + parallelism)
      const batchResults = await Promise.all(batch.map(processor))
      results.push(...batchResults)
    }
    
    return results
  }
  
  /**
   * Process with retry logic
   */
  static async processWithRetry<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    maxRetries: number = 3
  ): Promise<Array<R | Error>> {
    return Promise.all(
      items.map(async item => {
        let lastError: Error | null = null
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
          try {
            return await processor(item)
          } catch (error) {
            lastError = error as Error
            
            // Exponential backoff
            if (attempt < maxRetries - 1) {
              await new Promise(resolve => 
                setTimeout(resolve, Math.pow(2, attempt) * 1000)
              )
            }
          }
        }
        
        return lastError!
      })
    )
  }
}

/**
 * Database batch operations
 */
export class DatabaseBatcher {
  private insertQueue: Map<string, any[]> = new Map()
  private updateQueue: Map<string, any[]> = new Map()
  private batchSize: number
  
  constructor(batchSize: number = 100) {
    this.batchSize = batchSize
  }
  
  /**
   * Queue insert operation
   */
  queueInsert(table: string, data: any): void {
    if (!this.insertQueue.has(table)) {
      this.insertQueue.set(table, [])
    }
    this.insertQueue.get(table)!.push(data)
  }
  
  /**
   * Queue update operation
   */
  queueUpdate(table: string, data: any): void {
    if (!this.updateQueue.has(table)) {
      this.updateQueue.set(table, [])
    }
    this.updateQueue.get(table)!.push(data)
  }
  
  /**
   * Flush all queued operations
   */
  async flush(db: any): Promise<void> {
    // Process inserts
    for (const [table, items] of this.insertQueue.entries()) {
      await this.batchInsert(db, table, items)
    }
    
    // Process updates
    for (const [table, items] of this.updateQueue.entries()) {
      await this.batchUpdate(db, table, items)
    }
    
    // Clear queues
    this.insertQueue.clear()
    this.updateQueue.clear()
  }
  
  private async batchInsert(db: any, table: string, items: any[]): Promise<void> {
    for (let i = 0; i < items.length; i += this.batchSize) {
      const batch = items.slice(i, i + this.batchSize)
      
      // Build batch insert query
      const placeholders = batch.map(() => '(?, ?)').join(', ')
      const values = batch.flatMap(item => [item.id, item.text])
      
      await db.run(
        `INSERT INTO ${table} (id, text) VALUES ${placeholders}`,
        values
      )
    }
  }
  
  private async batchUpdate(db: any, table: string, items: any[]): Promise<void> {
    for (const item of items) {
      await db.run(
        `UPDATE ${table} SET text = ? WHERE id = ?`,
        [item.text, item.id]
      )
    }
  }
}

/**
 * Example usage:
 * 
 * // Batch process embeddings
 * const processor = new BatchProcessor(
 *   async (texts) => await embeddingService.generateEmbeddings(texts),
 *   { batchSize: 20, parallelism: 3 }
 * )
 * 
 * const embeddings = await processor.add(largeTextArray)
 */
