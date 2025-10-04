/**
 * ⚡ Async Pipeline - Parallel event processing
 * 
 * Process pipeline steps in parallel where possible for better performance
 */

import type { SystemEvent, StepResult } from '../pipeline/event-pipeline'

export interface AsyncPipelineConfig {
  maxParallelism: number
  timeout: number
  retryAttempts: number
}

/**
 * Async pipeline processor with parallelization
 */
export class AsyncPipeline {
  private config: AsyncPipelineConfig
  
  constructor(config: Partial<AsyncPipelineConfig> = {}) {
    this.config = {
      maxParallelism: config.maxParallelism || 3,
      timeout: config.timeout || 5000,
      retryAttempts: config.retryAttempts || 2
    }
  }
  
  /**
   * Process steps in parallel groups
   * 
   * Step dependencies:
   * 1. Validation (required, sequential)
   * 2. Ethics Check (required, can run parallel with step 3)
   * 3. Values Update (optional, can run parallel with step 2)
   * 4. Consciousness (required, depends on 2+3)
   * 5. Story Logging (optional, can run parallel with step 6)
   * 6. Memory Storage (optional, can run parallel with step 5)
   */
  async processParallel(
    event: SystemEvent,
    steps: Array<{ name: string, fn: (event: SystemEvent) => Promise<StepResult>, required: boolean }>
  ): Promise<{ success: boolean, results: Map<string, StepResult>, errors: string[] }> {
    const results = new Map<string, StepResult>()
    const errors: string[] = []
    
    try {
      // Phase 1: Validation (sequential, required)
      const validationResult = await this.executeWithTimeout(
        steps[0].fn(event),
        this.config.timeout
      )
      
      results.set(steps[0].name, validationResult)
      
      if (!validationResult.success) {
        return { success: false, results, errors: validationResult.errors || [] }
      }
      
      // Phase 2: Ethics + Values (parallel, both required/optional)
      const [ethicsResult, valuesResult] = await Promise.all([
        this.executeWithTimeout(steps[1].fn(event), this.config.timeout),
        this.executeWithTimeout(steps[2].fn(event), this.config.timeout)
      ])
      
      results.set(steps[1].name, ethicsResult)
      results.set(steps[2].name, valuesResult)
      
      // Check ethics (required)
      if (!ethicsResult.success && steps[1].required) {
        return { success: false, results, errors: ethicsResult.errors || [] }
      }
      
      // Phase 3: Consciousness (sequential, required)
      const consciousnessResult = await this.executeWithTimeout(
        steps[3].fn(event),
        this.config.timeout
      )
      
      results.set(steps[3].name, consciousnessResult)
      
      if (!consciousnessResult.success && steps[3].required) {
        return { success: false, results, errors: consciousnessResult.errors || [] }
      }
      
      // Phase 4: Story + Memory (parallel, both optional)
      const [storyResult, memoryResult] = await Promise.all([
        this.executeWithTimeout(steps[4].fn(event), this.config.timeout),
        this.executeWithTimeout(steps[5].fn(event), this.config.timeout)
      ])
      
      results.set(steps[4].name, storyResult)
      results.set(steps[5].name, memoryResult)
      
      // Collect any errors from optional steps
      if (!storyResult.success) errors.push(...(storyResult.errors || []))
      if (!memoryResult.success) errors.push(...(memoryResult.errors || []))
      
      return { success: true, results, errors }
      
    } catch (error: any) {
      errors.push(`Pipeline error: ${error.message}`)
      return { success: false, results, errors }
    }
  }
  
  /**
   * Execute promise with timeout
   */
  private async executeWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), timeoutMs)
      )
    ])
  }
  
  /**
   * Execute with retry logic
   */
  async executeWithRetry<T>(
    fn: () => Promise<T>,
    attempts: number = this.config.retryAttempts
  ): Promise<T> {
    let lastError: Error | null = null
    
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error
        
        // Exponential backoff
        if (i < attempts - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 100))
        }
      }
    }
    
    throw lastError!
  }
  
  /**
   * Process multiple events in parallel
   */
  async processBatch(
    events: SystemEvent[],
    processor: (event: SystemEvent) => Promise<any>
  ): Promise<Array<{ event: SystemEvent, result: any, error?: Error }>> {
    const results: Array<{ event: SystemEvent, result: any, error?: Error }> = []
    
    // Process in batches to avoid overwhelming system
    for (let i = 0; i < events.length; i += this.config.maxParallelism) {
      const batch = events.slice(i, i + this.config.maxParallelism)
      
      const batchResults = await Promise.allSettled(
        batch.map(event => processor(event))
      )
      
      batch.forEach((event, index) => {
        const result = batchResults[index]
        
        if (result.status === 'fulfilled') {
          results.push({ event, result: result.value })
        } else {
          results.push({ event, result: null, error: result.reason })
        }
      })
    }
    
    return results
  }
}

/**
 * Pipeline performance metrics
 */
export class PipelineMetrics {
  private stepTimes: Map<string, number[]> = new Map()
  private totalProcessed: number = 0
  private totalErrors: number = 0
  
  /**
   * Track step execution time
   */
  trackStep(stepName: string, timeMs: number): void {
    if (!this.stepTimes.has(stepName)) {
      this.stepTimes.set(stepName, [])
    }
    this.stepTimes.get(stepName)!.push(timeMs)
  }
  
  /**
   * Record processed event
   */
  recordProcessed(success: boolean): void {
    this.totalProcessed++
    if (!success) this.totalErrors++
  }
  
  /**
   * Get average step times
   */
  getAverageStepTimes(): Map<string, number> {
    const averages = new Map<string, number>()
    
    for (const [step, times] of this.stepTimes.entries()) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length
      averages.set(step, avg)
    }
    
    return averages
  }
  
  /**
   * Get bottleneck steps (slowest)
   */
  getBottlenecks(): Array<{ step: string, avgTime: number }> {
    const averages = this.getAverageStepTimes()
    
    return Array.from(averages.entries())
      .map(([step, avgTime]) => ({ step, avgTime }))
      .sort((a, b) => b.avgTime - a.avgTime)
  }
  
  /**
   * Get success rate
   */
  getSuccessRate(): number {
    if (this.totalProcessed === 0) return 100
    return ((this.totalProcessed - this.totalErrors) / this.totalProcessed) * 100
  }
  
  /**
   * Get full statistics
   */
  getStats(): {
    totalProcessed: number
    totalErrors: number
    successRate: number
    avgStepTimes: Map<string, number>
    bottlenecks: Array<{ step: string, avgTime: number }>
  } {
    return {
      totalProcessed: this.totalProcessed,
      totalErrors: this.totalErrors,
      successRate: this.getSuccessRate(),
      avgStepTimes: this.getAverageStepTimes(),
      bottlenecks: this.getBottlenecks()
    }
  }
  
  /**
   * Clear metrics
   */
  clear(): void {
    this.stepTimes.clear()
    this.totalProcessed = 0
    this.totalErrors = 0
  }
}
