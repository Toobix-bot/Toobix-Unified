/**
 * 🔒 Rate Limiting Middleware for Elysia
 *
 * Protects API from abuse using token bucket algorithm
 */

import type { Elysia } from 'elysia'
import { RateLimiter } from '@toobix/core'
import { RateLimitError, createLogger } from '@toobix/core'

const logger = createLogger('rate-limiter')

export interface RateLimiterConfig {
  requestsPerMinute?: number
  burstSize?: number
  blockDuration?: number
  getIdentifier?: (request: Request) => string
  skip?: (request: Request) => boolean
}

/**
 * Create rate limiter middleware for Elysia
 */
export function rateLimiter(config: RateLimiterConfig = {}) {
  const limiter = new RateLimiter({
    requestsPerMinute: config.requestsPerMinute || 60,
    burstSize: config.burstSize || 10,
    blockDuration: config.blockDuration || 60000
  })

  // Cleanup old buckets every 10 minutes
  const cleanupInterval = setInterval(() => {
    limiter.clearOld()
    logger.debug('Rate limiter buckets cleaned up')
  }, 600000)

  // Log stats every 5 minutes
  const statsInterval = setInterval(() => {
    const stats = limiter.getStats()
    logger.debug('Rate limiter stats', stats)
  }, 300000)

  // Cleanup on process exit
  process.on('beforeExit', () => {
    clearInterval(cleanupInterval)
    clearInterval(statsInterval)
  })

  return (app: Elysia) => {
    return app.derive(({ request, set }) => {
      // Skip rate limiting if configured
      if (config.skip && config.skip(request)) {
        return {}
      }

      // Get identifier (IP or custom)
      const identifier = config.getIdentifier
        ? config.getIdentifier(request)
        : getDefaultIdentifier(request)

      // Check rate limit
      const result = limiter.checkLimit(identifier)

      // Set rate limit headers
      set.headers['X-RateLimit-Limit'] = String(config.burstSize || 10)
      set.headers['X-RateLimit-Remaining'] = String(result.remaining)

      if (!result.allowed) {
        set.headers['X-RateLimit-Retry-After'] = String(result.retryAfter!)

        logger.warn(`Rate limit exceeded for ${identifier}`, {
          identifier,
          retryAfter: result.retryAfter
        })

        throw new RateLimitError(
          `Too many requests. Please try again in ${result.retryAfter} seconds.`,
          result.retryAfter
        )
      }

      // Log heavy usage
      if (result.remaining < 3) {
        logger.info(`Rate limit warning for ${identifier}`, {
          identifier,
          remaining: result.remaining
        })
      }

      return {}
    })
  }
}

/**
 * Get default identifier from request
 */
function getDefaultIdentifier(request: Request): string {
  const url = new URL(request.url)

  // Try to get real IP from headers
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback to hostname
  return url.hostname || 'unknown'
}

/**
 * Strict rate limiter for sensitive endpoints
 */
export function strictRateLimiter() {
  return rateLimiter({
    requestsPerMinute: 10,
    burstSize: 3,
    blockDuration: 300000 // 5 minutes
  })
}

/**
 * Relaxed rate limiter for public endpoints
 */
export function relaxedRateLimiter() {
  return rateLimiter({
    requestsPerMinute: 120,
    burstSize: 30,
    blockDuration: 30000 // 30 seconds
  })
}

/**
 * Skip rate limiting for specific paths
 */
export function rateLimiterWithSkip(skipPaths: string[]) {
  return rateLimiter({
    skip: (request: Request) => {
      const url = new URL(request.url)
      return skipPaths.some(path => url.pathname.startsWith(path))
    }
  })
}
