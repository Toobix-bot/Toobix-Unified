/**
 * 🔄 Retry with Exponential Backoff
 *
 * Retries failed operations with increasing wait times.
 * Essential for reliable autonomous systems!
 */

export interface RetryOptions {
  maxAttempts?: number
  initialDelayMs?: number
  maxDelayMs?: number
  backoffMultiplier?: number
  onRetry?: (attempt: number, error: Error) => void
}

export class RetryableError extends Error {
  constructor(message: string, public readonly originalError?: Error) {
    super(message)
    this.name = 'RetryableError'
  }
}

export class NonRetryableError extends Error {
  constructor(message: string, public readonly originalError?: Error) {
    super(message)
    this.name = 'NonRetryableError'
  }
}

/**
 * Retry an async function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelayMs = 1000,
    maxDelayMs = 10000,
    backoffMultiplier = 2,
    onRetry
  } = options

  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // Don't retry non-retryable errors
      if (error instanceof NonRetryableError) {
        throw error.originalError || error
      }

      // Last attempt - throw the error
      if (attempt >= maxAttempts) {
        break
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        initialDelayMs * Math.pow(backoffMultiplier, attempt - 1),
        maxDelayMs
      )

      // Call retry callback if provided
      if (onRetry) {
        onRetry(attempt, error)
      }

      console.log(`   ⏳ Retry ${attempt}/${maxAttempts} after ${delay}ms delay...`)

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  // All retries exhausted
  throw lastError || new Error('Unknown error in retry')
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: any): boolean {
  // Network errors are retryable
  if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
    return true
  }

  // API rate limits are retryable
  if (error.status === 429 || error.statusCode === 429) {
    return true
  }

  // Server errors are retryable
  if (error.status >= 500 && error.status < 600) {
    return true
  }

  // Timeout errors are retryable
  if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
    return true
  }

  return false
}

/**
 * Wrap a function to automatically retry on specific errors
 */
export function withRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: RetryOptions = {}
): T {
  return (async (...args: any[]) => {
    return retryWithBackoff(() => fn(...args), options)
  }) as T
}
