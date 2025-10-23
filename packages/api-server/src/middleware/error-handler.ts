/**
 * 🚨 API Server Error Handler Middleware
 *
 * Catches and formats all errors in a consistent way
 */

import type { Elysia } from 'elysia'
import {
  ToobixError,
  ValidationError,
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
  RateLimitError,
  normalizeError,
  ErrorCode,
  errorTracker
} from '@toobix/core'
import { getLogger } from '@toobix/core'

const logger = getLogger()

/**
 * Error response format
 */
export interface ErrorResponse {
  error: {
    message: string
    code: number
    statusCode: number
    timestamp: number
    requestId?: string
    details?: any
  }
}

/**
 * Format error for API response
 */
function formatErrorResponse(
  error: ToobixError,
  requestId?: string
): ErrorResponse {
  return {
    error: {
      message: error.getUserMessage(),
      code: error.code,
      statusCode: error.statusCode,
      timestamp: error.timestamp,
      ...(requestId && { requestId }),
      ...(error instanceof ValidationError && error.fields && { details: error.fields }),
      ...(error instanceof RateLimitError && error.retryAfter && { retryAfter: error.retryAfter }),
    }
  }
}

/**
 * Log error with appropriate level
 */
function logError(error: ToobixError, path: string, method: string): void {
  const context = {
    path,
    method,
    code: error.code,
    statusCode: error.statusCode,
    ...(error.context && { errorContext: error.context })
  }

  if (error.statusCode >= 500) {
    // Server errors - log as ERROR
    logger.error(`Server error on ${method} ${path}`, error, context)
  } else if (error.statusCode >= 400) {
    // Client errors - log as WARN
    logger.warn(`Client error on ${method} ${path}: ${error.message}`, context)
  } else {
    // Other errors - log as INFO
    logger.info(`Error on ${method} ${path}: ${error.message}`, context)
  }
}

/**
 * Error handler plugin for Elysia
 */
export const errorHandler = (app: Elysia) => {
  return app
    .onError(({ code, error, set, request }) => {
      // Get request details
      const url = new URL(request.url)
      const path = url.pathname
      const method = request.method

      // Normalize error to ToobixError
      let toobixError: ToobixError

      // Handle Elysia-specific errors
      if (code === 'NOT_FOUND') {
        toobixError = new NotFoundError('Endpoint', path)
      } else if (code === 'VALIDATION') {
        toobixError = new ValidationError(
          'Request validation failed',
          undefined,
          { path, method }
        )
      } else if (code === 'PARSE') {
        toobixError = new ValidationError(
          'Invalid request body format',
          undefined,
          { path, method }
        )
      } else if (code === 'INVALID_COOKIE_SIGNATURE') {
        toobixError = new AuthenticationError('Invalid authentication')
      } else if (error instanceof ToobixError) {
        toobixError = error
      } else {
        toobixError = normalizeError(error)
      }

      // Log the error
      logError(toobixError, path, method)

      // Track the error for monitoring
      errorTracker.track(toobixError)

      // Set HTTP status code
      set.status = toobixError.statusCode as any

      // Return formatted error response
      return formatErrorResponse(toobixError)
    })
}

/**
 * Request logging middleware
 */
export const requestLogger = (app: Elysia) => {
  return app
    .onRequest(({ request }) => {
      const url = new URL(request.url)
      logger.debug(`${request.method} ${url.pathname}`)
    })
    .onAfterHandle(({ request, set }) => {
      const url = new URL(request.url)
      const status = set.status || 200

      if (status >= 400) {
        logger.warn(`${request.method} ${url.pathname} - ${status}`)
      } else {
        logger.debug(`${request.method} ${url.pathname} - ${status}`)
      }
    })
}

/**
 * Async handler wrapper for route handlers
 * Automatically catches and normalizes errors
 *
 * Usage:
 * app.get('/api/something', asyncHandler(async ({ params }) => {
 *   const data = await someAsyncOperation(params.id)
 *   return { data }
 * }))
 */
export function asyncHandler<T extends (...args: any[]) => Promise<any>>(
  handler: T
): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args)
    } catch (error) {
      // Let the error middleware handle it
      throw normalizeError(error)
    }
  }) as T
}

/**
 * Validation helper
 * Throws ValidationError if condition is false
 */
export function validate(
  condition: boolean,
  message: string,
  fields?: Record<string, string[]>
): asserts condition {
  if (!condition) {
    throw new ValidationError(message, fields)
  }
}

/**
 * Not found helper
 * Throws NotFoundError
 */
export function notFound(resource: string, identifier?: string | number): never {
  throw new NotFoundError(resource, identifier)
}

/**
 * Unauthorized helper
 * Throws AuthenticationError
 */
export function unauthorized(message?: string): never {
  throw new AuthenticationError(message)
}

/**
 * Forbidden helper
 * Throws AuthorizationError
 */
export function forbidden(message?: string): never {
  throw new AuthorizationError(message)
}
