/**
 * 🚨 Toobix Error System
 *
 * Custom error classes for consistent error handling across all packages
 */

export enum ErrorCode {
  // Database Errors (1xxx)
  DATABASE_CONNECTION_FAILED = 1001,
  DATABASE_QUERY_FAILED = 1002,
  DATABASE_NOT_FOUND = 1003,
  DATABASE_CONSTRAINT_VIOLATION = 1004,
  DATABASE_TRANSACTION_FAILED = 1005,

  // Validation Errors (2xxx)
  VALIDATION_FAILED = 2001,
  INVALID_INPUT = 2002,
  MISSING_REQUIRED_FIELD = 2003,
  INVALID_FORMAT = 2004,

  // Authentication/Authorization Errors (3xxx)
  UNAUTHORIZED = 3001,
  FORBIDDEN = 3003,
  TOKEN_EXPIRED = 3004,
  INVALID_TOKEN = 3005,

  // Resource Errors (4xxx)
  NOT_FOUND = 4001,
  ALREADY_EXISTS = 4002,
  CONFLICT = 4003,
  GONE = 4004,

  // External Service Errors (5xxx)
  EXTERNAL_SERVICE_ERROR = 5001,
  NETWORK_ERROR = 5002,
  TIMEOUT = 5003,
  RATE_LIMIT_EXCEEDED = 5004,
  LLM_API_ERROR = 5005,

  // File System Errors (6xxx)
  FILE_NOT_FOUND = 6001,
  FILE_READ_ERROR = 6002,
  FILE_WRITE_ERROR = 6003,
  PERMISSION_DENIED = 6004,

  // Business Logic Errors (7xxx)
  OPERATION_FAILED = 7001,
  INVALID_STATE = 7002,
  PRECONDITION_FAILED = 7003,
  ETHICS_VIOLATION = 7004,

  // System Errors (9xxx)
  INTERNAL_ERROR = 9001,
  NOT_IMPLEMENTED = 9002,
  SERVICE_UNAVAILABLE = 9003,
  CONFIGURATION_ERROR = 9004,
}

/**
 * Base error class for all Toobix errors
 */
export class ToobixError extends Error {
  public readonly code: ErrorCode
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly context?: Record<string, any>
  public readonly timestamp: number

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message)

    this.name = this.constructor.name
    this.code = code
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.context = context
    this.timestamp = Date.now()

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor)
  }

  /**
   * Convert error to JSON for API responses
   */
  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        code: this.code,
        statusCode: this.statusCode,
        timestamp: this.timestamp,
        ...(this.context && { context: this.context })
      }
    }
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    return this.message
  }
}

/**
 * Database-related errors
 */
export class DatabaseError extends ToobixError {
  constructor(
    message: string,
    code: ErrorCode = ErrorCode.DATABASE_QUERY_FAILED,
    context?: Record<string, any>
  ) {
    super(message, code, 500, true, context)
  }
}

/**
 * Validation errors (user input)
 */
export class ValidationError extends ToobixError {
  public readonly fields?: Record<string, string[]>

  constructor(
    message: string,
    fields?: Record<string, string[]>,
    context?: Record<string, any>
  ) {
    super(message, ErrorCode.VALIDATION_FAILED, 400, true, context)
    this.fields = fields
  }

  toJSON() {
    return {
      error: {
        ...super.toJSON().error,
        fields: this.fields
      }
    }
  }
}

/**
 * Resource not found errors
 */
export class NotFoundError extends ToobixError {
  constructor(
    resource: string,
    identifier?: string | number,
    context?: Record<string, any>
  ) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`

    super(message, ErrorCode.NOT_FOUND, 404, true, context)
  }
}

/**
 * Authentication errors
 */
export class AuthenticationError extends ToobixError {
  constructor(
    message: string = 'Authentication required',
    context?: Record<string, any>
  ) {
    super(message, ErrorCode.UNAUTHORIZED, 401, true, context)
  }
}

/**
 * Authorization errors
 */
export class AuthorizationError extends ToobixError {
  constructor(
    message: string = 'Insufficient permissions',
    context?: Record<string, any>
  ) {
    super(message, ErrorCode.FORBIDDEN, 403, true, context)
  }
}

/**
 * External service errors (API calls, LLMs, etc.)
 */
export class ExternalServiceError extends ToobixError {
  public readonly service: string
  public readonly originalError?: Error

  constructor(
    service: string,
    message: string,
    originalError?: Error,
    context?: Record<string, any>
  ) {
    super(
      `External service '${service}' error: ${message}`,
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      502,
      true,
      context
    )
    this.service = service
    this.originalError = originalError
  }
}

/**
 * Rate limiting errors
 */
export class RateLimitError extends ToobixError {
  public readonly retryAfter?: number

  constructor(
    message: string = 'Rate limit exceeded',
    retryAfter?: number,
    context?: Record<string, any>
  ) {
    super(message, ErrorCode.RATE_LIMIT_EXCEEDED, 429, true, context)
    this.retryAfter = retryAfter
  }

  toJSON() {
    return {
      error: {
        ...super.toJSON().error,
        retryAfter: this.retryAfter
      }
    }
  }
}

/**
 * File system errors
 */
export class FileSystemError extends ToobixError {
  constructor(
    operation: string,
    path: string,
    originalError?: Error,
    context?: Record<string, any>
  ) {
    super(
      `File system ${operation} failed for '${path}': ${originalError?.message || 'Unknown error'}`,
      ErrorCode.FILE_READ_ERROR,
      500,
      true,
      { ...context, path, operation }
    )
  }
}

/**
 * Business logic / operational errors
 */
export class OperationError extends ToobixError {
  constructor(
    message: string,
    code: ErrorCode = ErrorCode.OPERATION_FAILED,
    statusCode: number = 400,
    context?: Record<string, any>
  ) {
    super(message, code, statusCode, true, context)
  }
}

/**
 * Ethics violation errors
 */
export class EthicsViolationError extends ToobixError {
  constructor(
    message: string,
    context?: Record<string, any>
  ) {
    super(message, ErrorCode.ETHICS_VIOLATION, 403, true, context)
  }
}

/**
 * Configuration errors
 */
export class ConfigurationError extends ToobixError {
  constructor(
    message: string,
    context?: Record<string, any>
  ) {
    super(message, ErrorCode.CONFIGURATION_ERROR, 500, false, context)
  }
}

/**
 * Helper function to check if error is operational
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof ToobixError) {
    return error.isOperational
  }
  return false
}

/**
 * Helper to convert unknown errors to ToobixError
 */
export function normalizeError(error: unknown): ToobixError {
  // Already a ToobixError
  if (error instanceof ToobixError) {
    return error
  }

  // Standard Error
  if (error instanceof Error) {
    return new ToobixError(
      error.message,
      ErrorCode.INTERNAL_ERROR,
      500,
      false,
      { originalError: error.name }
    )
  }

  // String error
  if (typeof error === 'string') {
    return new ToobixError(
      error,
      ErrorCode.INTERNAL_ERROR,
      500,
      false
    )
  }

  // Unknown error type
  return new ToobixError(
    'An unknown error occurred',
    ErrorCode.INTERNAL_ERROR,
    500,
    false,
    { error: String(error) }
  )
}

/**
 * Error handler for async functions
 * Usage: const result = await handleAsync(someAsyncFunction())
 */
export async function handleAsync<T>(
  promise: Promise<T>
): Promise<[ToobixError | null, T | null]> {
  try {
    const data = await promise
    return [null, data]
  } catch (error) {
    return [normalizeError(error), null]
  }
}

/**
 * Wrap sync functions with error handling
 */
export function handleSync<T>(
  fn: () => T
): [ToobixError | null, T | null] {
  try {
    const data = fn()
    return [null, data]
  } catch (error) {
    return [normalizeError(error), null]
  }
}
