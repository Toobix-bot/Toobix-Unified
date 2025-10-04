/**
 * 🔒 Rate Limiter - Token bucket algorithm
 * 
 * Protects API from abuse with sliding window rate limiting
 */

export interface RateLimitConfig {
  requestsPerMinute: number
  burstSize: number
  blockDuration?: number // ms to block after exceeding limit
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfter?: number
}

/**
 * Token bucket for rate limiting
 */
class TokenBucket {
  private tokens: number
  private lastRefill: number
  
  constructor(
    private tokensPerMinute: number,
    private maxTokens: number
  ) {
    this.tokens = maxTokens
    this.lastRefill = Date.now()
  }
  
  /**
   * Try to consume a token
   */
  consume(): boolean {
    this.refill()
    
    if (this.tokens >= 1) {
      this.tokens -= 1
      return true
    }
    
    return false
  }
  
  /**
   * Get remaining tokens
   */
  getRemaining(): number {
    this.refill()
    return Math.floor(this.tokens)
  }
  
  /**
   * Refill tokens based on time elapsed
   */
  private refill(): void {
    const now = Date.now()
    const elapsed = now - this.lastRefill
    const tokensToAdd = (elapsed / 60000) * this.tokensPerMinute
    
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd)
    this.lastRefill = now
  }
  
  /**
   * Get seconds until next token available
   */
  getRetryAfter(): number {
    const tokensNeeded = 1 - this.tokens
    return Math.ceil((tokensNeeded / this.tokensPerMinute) * 60)
  }
  
  /**
   * Reset bucket
   */
  reset(): void {
    this.tokens = this.maxTokens
    this.lastRefill = Date.now()
  }
}

/**
 * Advanced rate limiter with per-identifier buckets
 */
export class RateLimiter {
  private buckets: Map<string, TokenBucket>
  private config: Required<RateLimitConfig>
  
  constructor(config: Partial<RateLimitConfig> = {}) {
    this.buckets = new Map()
    this.config = {
      requestsPerMinute: config.requestsPerMinute || 60,
      burstSize: config.burstSize || 10,
      blockDuration: config.blockDuration || 60000
    }
  }
  
  /**
   * Check if request is allowed
   */
  checkLimit(identifier: string): RateLimitResult {
    let bucket = this.buckets.get(identifier)
    
    if (!bucket) {
      bucket = new TokenBucket(
        this.config.requestsPerMinute,
        this.config.burstSize
      )
      this.buckets.set(identifier, bucket)
    }
    
    const allowed = bucket.consume()
    const remaining = bucket.getRemaining()
    
    if (!allowed) {
      return {
        allowed: false,
        remaining: 0,
        retryAfter: bucket.getRetryAfter()
      }
    }
    
    return {
      allowed: true,
      remaining
    }
  }
  
  /**
   * Reset limit for identifier
   */
  reset(identifier: string): void {
    this.buckets.delete(identifier)
  }
  
  /**
   * Get current limit status
   */
  getStatus(identifier: string): { remaining: number, total: number } {
    const bucket = this.buckets.get(identifier)
    
    if (!bucket) {
      return {
        remaining: this.config.burstSize,
        total: this.config.burstSize
      }
    }
    
    return {
      remaining: bucket.getRemaining(),
      total: this.config.burstSize
    }
  }
  
  /**
   * Clear old buckets (garbage collection)
   */
  clearOld(maxAge: number = 3600000): void {
    const now = Date.now()
    
    for (const [identifier, bucket] of this.buckets.entries()) {
      if (bucket.getRemaining() === this.config.burstSize) {
        // Bucket is full and hasn't been used recently
        this.buckets.delete(identifier)
      }
    }
  }
  
  /**
   * Get statistics
   */
  getStats(): {
    totalBuckets: number
    config: RateLimitConfig
  } {
    return {
      totalBuckets: this.buckets.size,
      config: this.config
    }
  }
}

/**
 * Rate limit middleware for Express/Bun
 */
export function createRateLimitMiddleware(config?: Partial<RateLimitConfig>) {
  const limiter = new RateLimiter(config)
  
  // Cleanup old buckets every 10 minutes
  setInterval(() => limiter.clearOld(), 600000)
  
  return async (req: any, res: any, next: any) => {
    // Use IP address as identifier (or user ID if authenticated)
    const identifier = req.headers['x-forwarded-for'] || 
                      req.connection?.remoteAddress || 
                      'unknown'
    
    const result = limiter.checkLimit(identifier)
    
    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', config?.burstSize || 10)
    res.setHeader('X-RateLimit-Remaining', result.remaining)
    
    if (!result.allowed) {
      res.setHeader('X-RateLimit-Retry-After', result.retryAfter!)
      res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: result.retryAfter,
        message: `Too many requests. Please try again in ${result.retryAfter} seconds.`
      })
      return
    }
    
    next()
  }
}

/**
 * Global rate limiter instance
 */
export const globalRateLimiter = new RateLimiter({
  requestsPerMinute: 60,
  burstSize: 10
})
