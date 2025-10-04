/**
 * 🚀 Performance: Caching Layer
 * 
 * LRU cache with TTL for expensive operations:
 * - API responses (Groq, OpenAI)
 * - Memory searches
 * - Value queries
 * 
 * Benefits:
 * - 10-100x faster for repeated queries
 * - Reduced API costs
 * - Better user experience
 */

export interface CacheEntry<T> {
  value: T
  expiry: number
}

export class CacheLayer<T = any> {
  private cache: Map<string, CacheEntry<T>>
  private accessOrder: string[]
  
  constructor(
    private maxSize: number = 1000,
    private defaultTTL: number = 300000  // 5 minutes
  ) {
    this.cache = new Map()
    this.accessOrder = []
  }
  
  get(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }
    
    // Check expiry
    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      this.accessOrder = this.accessOrder.filter(k => k !== key)
      return null
    }
    
    // Update LRU order
    this.accessOrder = this.accessOrder.filter(k => k !== key)
    this.accessOrder.push(key)
    
    return entry.value
  }
  
  set(key: string, value: T, ttl?: number): void {
    // Evict if at capacity
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const oldestKey = this.accessOrder.shift()
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }
    
    // Set new entry
    this.cache.set(key, {
      value,
      expiry: Date.now() + (ttl || this.defaultTTL)
    })
    
    // Update access order
    this.accessOrder = this.accessOrder.filter(k => k !== key)
    this.accessOrder.push(key)
  }
  
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      this.accessOrder = this.accessOrder.filter(k => k !== key)
      return false
    }
    
    return true
  }
  
  delete(key: string): void {
    this.cache.delete(key)
    this.accessOrder = this.accessOrder.filter(k => k !== key)
  }
  
  clear(): void {
    this.cache.clear()
    this.accessOrder = []
  }
  
  size(): number {
    return this.cache.size
  }
  
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      utilizationPercent: (this.cache.size / this.maxSize) * 100
    }
  }
}

/**
 * Helper: Create hash from object for cache key
 */
export function hashObject(obj: any): string {
  const str = JSON.stringify(obj, Object.keys(obj).sort())
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString(36)
}

/**
 * Global cache instances
 */
export const apiCache = new CacheLayer<any>(500, 300000)      // 500 items, 5min
export const memoryCache = new CacheLayer<any>(1000, 600000)  // 1000 items, 10min
export const valuesCache = new CacheLayer<any>(100, 60000)    // 100 items, 1min
