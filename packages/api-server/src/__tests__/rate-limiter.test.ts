/**
 * 🧪 RATE LIMITER MIDDLEWARE - Integration Tests
 */

import { describe, test, expect, beforeEach } from 'bun:test'
import { Elysia } from 'elysia'
import { rateLimiter, strictRateLimiter, relaxedRateLimiter, rateLimiterWithSkip } from '../middleware/rate-limiter'

describe('Rate Limiter Middleware - Basic Functionality', () => {
  test('Allows requests within limit', async () => {
    const app = new Elysia()
      .use(rateLimiter({
        requestsPerMinute: 60,
        burstSize: 5
      }))
      .get('/test', () => ({ success: true }))

    // First 5 requests should succeed
    for (let i = 0; i < 5; i++) {
      const response = await app.handle(
        new Request('http://localhost/test', {
          headers: { 'x-forwarded-for': '192.168.1.1' }
        })
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    }
  })

  test('Blocks requests exceeding burst size', async () => {
    const app = new Elysia()
      .use(rateLimiter({
        requestsPerMinute: 60,
        burstSize: 3
      }))
      .get('/test', () => ({ success: true }))
      .onError(({ error, set }) => {
        set.status = error.statusCode || 500
        return { error: error.message }
      })

    const requests = []

    // Send 5 requests (burst is 3)
    for (let i = 0; i < 5; i++) {
      const response = await app.handle(
        new Request('http://localhost/test', {
          headers: { 'x-forwarded-for': '192.168.1.1' }
        })
      )
      requests.push(response)
    }

    // First 3 should succeed
    for (let i = 0; i < 3; i++) {
      expect(requests[i].status).toBe(200)
    }

    // 4th and 5th should be rate limited (429)
    expect(requests[3].status).toBe(429)
    expect(requests[4].status).toBe(429)
  })

  test('Sets rate limit headers', async () => {
    const app = new Elysia()
      .use(rateLimiter({
        requestsPerMinute: 60,
        burstSize: 10
      }))
      .get('/test', () => ({ success: true }))

    const response = await app.handle(
      new Request('http://localhost/test', {
        headers: { 'x-forwarded-for': '192.168.1.1' }
      })
    )

    expect(response.headers.get('X-RateLimit-Limit')).toBe('10')
    expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined()
  })

  test('Sets retry-after header when rate limited', async () => {
    const app = new Elysia()
      .use(rateLimiter({
        requestsPerMinute: 60,
        burstSize: 2
      }))
      .get('/test', () => ({ success: true }))
      .onError(({ error, set }) => {
        set.status = error.statusCode || 500
        return { error: error.message }
      })

    // Exhaust burst
    await app.handle(new Request('http://localhost/test', {
      headers: { 'x-forwarded-for': '192.168.1.1' }
    }))
    await app.handle(new Request('http://localhost/test', {
      headers: { 'x-forwarded-for': '192.168.1.1' }
    }))

    // This should be rate limited
    const response = await app.handle(
      new Request('http://localhost/test', {
        headers: { 'x-forwarded-for': '192.168.1.1' }
      })
    )

    expect(response.status).toBe(429)
    expect(response.headers.get('X-RateLimit-Retry-After')).toBeDefined()
  })
})

describe('Rate Limiter Middleware - IP Identification', () => {
  test('Uses x-forwarded-for header', async () => {
    const app = new Elysia()
      .use(rateLimiter({
        requestsPerMinute: 60,
        burstSize: 2
      }))
      .get('/test', () => ({ success: true }))
      .onError(({ error, set }) => {
        set.status = error.statusCode || 500
        return { error: error.message }
      })

    // Two requests from same IP should share limit
    const response1 = await app.handle(new Request('http://localhost/test', {
      headers: { 'x-forwarded-for': '10.0.0.1' }
    }))
    const response2 = await app.handle(new Request('http://localhost/test', {
      headers: { 'x-forwarded-for': '10.0.0.1' }
    }))
    const response3 = await app.handle(new Request('http://localhost/test', {
      headers: { 'x-forwarded-for': '10.0.0.1' }
    }))

    expect(response1.status).toBe(200)
    expect(response2.status).toBe(200)
    expect(response3.status).toBe(429)
  })

  test('Uses x-real-ip header if no x-forwarded-for', async () => {
    const app = new Elysia()
      .use(rateLimiter({
        requestsPerMinute: 60,
        burstSize: 2
      }))
      .get('/test', () => ({ success: true }))
      .onError(({ error, set }) => {
        set.status = error.statusCode || 500
        return { error: error.message }
      })

    const response1 = await app.handle(new Request('http://localhost/test', {
      headers: { 'x-real-ip': '10.0.0.2' }
    }))
    const response2 = await app.handle(new Request('http://localhost/test', {
      headers: { 'x-real-ip': '10.0.0.2' }
    }))
    const response3 = await app.handle(new Request('http://localhost/test', {
      headers: { 'x-real-ip': '10.0.0.2' }
    }))

    expect(response1.status).toBe(200)
    expect(response2.status).toBe(200)
    expect(response3.status).toBe(429)
  })

  test('Separate IPs have separate limits', async () => {
    const app = new Elysia()
      .use(rateLimiter({
        requestsPerMinute: 60,
        burstSize: 2
      }))
      .get('/test', () => ({ success: true }))

    // IP 1 exhausts its limit
    const ip1_req1 = await app.handle(new Request('http://localhost/test', {
      headers: { 'x-forwarded-for': '10.0.0.1' }
    }))
    const ip1_req2 = await app.handle(new Request('http://localhost/test', {
      headers: { 'x-forwarded-for': '10.0.0.1' }
    }))

    // IP 2 should still have its limit
    const ip2_req1 = await app.handle(new Request('http://localhost/test', {
      headers: { 'x-forwarded-for': '10.0.0.2' }
    }))
    const ip2_req2 = await app.handle(new Request('http://localhost/test', {
      headers: { 'x-forwarded-for': '10.0.0.2' }
    }))

    expect(ip1_req1.status).toBe(200)
    expect(ip1_req2.status).toBe(200)
    expect(ip2_req1.status).toBe(200)
    expect(ip2_req2.status).toBe(200)
  })
})

describe('Rate Limiter Middleware - Custom Identifier', () => {
  test('Uses custom identifier function', async () => {
    const app = new Elysia()
      .use(rateLimiter({
        requestsPerMinute: 60,
        burstSize: 2,
        getIdentifier: (request: Request) => {
          return request.headers.get('x-user-id') || 'anonymous'
        }
      }))
      .get('/test', () => ({ success: true }))
      .onError(({ error, set }) => {
        set.status = error.statusCode || 500
        return { error: error.message }
      })

    // Same user ID should share limit
    const response1 = await app.handle(new Request('http://localhost/test', {
      headers: { 'x-user-id': 'user123' }
    }))
    const response2 = await app.handle(new Request('http://localhost/test', {
      headers: { 'x-user-id': 'user123' }
    }))
    const response3 = await app.handle(new Request('http://localhost/test', {
      headers: { 'x-user-id': 'user123' }
    }))

    expect(response1.status).toBe(200)
    expect(response2.status).toBe(200)
    expect(response3.status).toBe(429)
  })
})

describe('Rate Limiter Middleware - Skip Function', () => {
  test('Skips rate limiting for specified paths', async () => {
    const app = new Elysia()
      .use(rateLimiterWithSkip(['/health', '/metrics']))
      .get('/health', () => ({ status: 'ok' }))
      .get('/api/test', () => ({ success: true }))

    // Health endpoint should never be rate limited (even with many requests)
    for (let i = 0; i < 20; i++) {
      const response = await app.handle(new Request('http://localhost/health', {
        headers: { 'x-forwarded-for': '10.0.0.1' }
      }))
      expect(response.status).toBe(200)
    }
  })

  test('Does not skip rate limiting for non-whitelisted paths', async () => {
    const app = new Elysia()
      .use(rateLimiterWithSkip(['/health']))
      .get('/health', () => ({ status: 'ok' }))
      .get('/api/test', () => ({ success: true }))
      .onError(({ error, set }) => {
        set.status = error.statusCode || 500
        return { error: error.message }
      })

    // /api/test should still be rate limited
    const requests = []
    for (let i = 0; i < 15; i++) {
      const response = await app.handle(new Request('http://localhost/api/test', {
        headers: { 'x-forwarded-for': '10.0.0.1' }
      }))
      requests.push(response)
    }

    // Some should succeed, some should be rate limited
    const successCount = requests.filter(r => r.status === 200).length
    const limitedCount = requests.filter(r => r.status === 429).length

    expect(successCount).toBeGreaterThan(0)
    expect(limitedCount).toBeGreaterThan(0)
  })
})

describe('Rate Limiter Variants', () => {
  test('Strict rate limiter has lower limits', async () => {
    const app = new Elysia()
      .use(strictRateLimiter())
      .get('/test', () => ({ success: true }))
      .onError(({ error, set }) => {
        set.status = error.statusCode || 500
        return { error: error.message }
      })

    const requests = []

    // Send 5 requests
    for (let i = 0; i < 5; i++) {
      const response = await app.handle(new Request('http://localhost/test', {
        headers: { 'x-forwarded-for': '10.0.0.1' }
      }))
      requests.push(response)
    }

    // Strict limiter (burst=3) should block after 3 requests
    expect(requests[0].status).toBe(200)
    expect(requests[1].status).toBe(200)
    expect(requests[2].status).toBe(200)
    expect(requests[3].status).toBe(429)
    expect(requests[4].status).toBe(429)
  })

  test('Relaxed rate limiter has higher limits', async () => {
    const app = new Elysia()
      .use(relaxedRateLimiter())
      .get('/test', () => ({ success: true }))

    const requests = []

    // Send 30 requests
    for (let i = 0; i < 30; i++) {
      const response = await app.handle(new Request('http://localhost/test', {
        headers: { 'x-forwarded-for': '10.0.0.1' }
      }))
      requests.push(response)
    }

    // Relaxed limiter (burst=30) should allow all 30
    requests.forEach(response => {
      expect(response.status).toBe(200)
    })
  })
})

describe('Rate Limiter Middleware - Error Messages', () => {
  test('Returns helpful error message when rate limited', async () => {
    const app = new Elysia()
      .use(rateLimiter({
        requestsPerMinute: 60,
        burstSize: 1
      }))
      .get('/test', () => ({ success: true }))
      .onError(({ error, set }) => {
        set.status = error.statusCode || 500
        return { error: error.message }
      })

    // Exhaust limit
    await app.handle(new Request('http://localhost/test', {
      headers: { 'x-forwarded-for': '10.0.0.1' }
    }))

    // Get rate limited
    const response = await app.handle(new Request('http://localhost/test', {
      headers: { 'x-forwarded-for': '10.0.0.1' }
    }))

    expect(response.status).toBe(429)
    const data = await response.json()
    expect(data.error).toContain('Too many requests')
    expect(data.error).toContain('try again')
  })
})
