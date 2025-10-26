/**
 * Central API Configuration
 * Defines all backend service URLs and endpoints
 */

export const API_ENDPOINTS = {
  // Core Services
  STORY_API: 'http://localhost:3004',
  ETERNAL_DAEMON: 'http://localhost:9999',
  MEMORY_SYSTEM: 'http://localhost:9995',
  GROQ_API: 'http://localhost:9987',

  // Optional Services (may not be running)
  BLOCKBOT: 'http://localhost:9990',
  CONSCIOUSNESS: 'http://localhost:9989',
  BRIDGE_API: 'http://localhost:3001',
} as const

/**
 * Safe fetch wrapper with timeout and error handling
 */
export async function safeFetch<T>(
  url: string,
  options?: RequestInit & { timeout?: number }
): Promise<T | null> {
  const timeout = options?.timeout || 5000

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.warn(`API request failed: ${url} (${response.status})`)
      return null
    }

    return await response.json()
  } catch (error) {
    // Silently fail - service might not be running
    return null
  }
}
