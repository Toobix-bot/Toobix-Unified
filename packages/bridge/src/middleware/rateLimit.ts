import rateLimit from 'express-rate-limit'

/**
 * Rate limiter for authentication endpoints (login, register)
 * More restrictive to prevent brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again after 15 minutes',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit headers
  // Store in memory (for production, use Redis)
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'You have exceeded the rate limit. Please try again later.',
      retryAfter: Math.ceil((req.rateLimit?.resetTime?.getTime() || 0 - Date.now()) / 1000)
    })
  }
})

/**
 * Rate limiter for general API endpoints
 * More lenient for normal operations
 */
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: {
    error: 'Too many requests',
    message: 'Please slow down',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for authenticated requests with API keys (optional)
  skip: (req) => {
    // Skip if has valid API key in header
    const apiKey = req.headers['x-api-key']
    return apiKey === process.env.ADMIN_API_KEY
  }
})

/**
 * Strict rate limiter for sensitive operations
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  message: {
    error: 'Rate limit exceeded',
    message: 'This operation is rate-limited to 10 requests per hour',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false
})

/**
 * Rate limiter for public endpoints (no auth)
 */
export const publicLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    error: 'Too many requests',
    message: 'Please slow down',
    retryAfter: '1 minute'
  }
})
