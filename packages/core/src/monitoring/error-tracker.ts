/**
 * 📊 Error Tracking & Monitoring System
 *
 * Collects error statistics and provides insights into system health
 */

import type { ToobixError } from '../errors/index.ts'
import { ErrorCode } from '../errors/index.ts'

export interface ErrorEntry {
  timestamp: number
  errorCode: ErrorCode
  errorName: string
  message: string
  statusCode: number
  context?: Record<string, any>
}

export interface ErrorStats {
  total: number
  byCode: Record<string, number>
  byStatusCode: Record<number, number>
  byName: Record<string, number>
  last24Hours: number
  lastHour: number
  lastMinute: number
  recentErrors: ErrorEntry[]
}

export interface AlertThreshold {
  metric: 'total' | 'last24Hours' | 'lastHour' | 'lastMinute'
  threshold: number
  callback: (stats: ErrorStats) => void
}

/**
 * Error Tracker - Collects and analyzes errors
 */
export class ErrorTracker {
  private errors: ErrorEntry[] = []
  private maxEntries: number
  private alerts: AlertThreshold[] = []

  constructor(maxEntries: number = 1000) {
    this.maxEntries = maxEntries
  }

  /**
   * Track an error
   */
  track(error: ToobixError): void {
    const entry: ErrorEntry = {
      timestamp: Date.now(),
      errorCode: error.code,
      errorName: error.name,
      message: error.message,
      statusCode: error.statusCode,
      context: error.context
    }

    this.errors.push(entry)

    // Keep only the most recent entries
    if (this.errors.length > this.maxEntries) {
      this.errors.shift()
    }

    // Check alerts
    this.checkAlerts()
  }

  /**
   * Get error statistics
   */
  getStats(): ErrorStats {
    const now = Date.now()
    const oneMinute = 60 * 1000
    const oneHour = 60 * oneMinute
    const oneDay = 24 * oneHour

    const byCode: Record<string, number> = {}
    const byStatusCode: Record<number, number> = {}
    const byName: Record<string, number> = {}

    let last24Hours = 0
    let lastHour = 0
    let lastMinute = 0

    for (const error of this.errors) {
      // Count by code
      byCode[error.errorCode] = (byCode[error.errorCode] || 0) + 1

      // Count by status code
      byStatusCode[error.statusCode] = (byStatusCode[error.statusCode] || 0) + 1

      // Count by name
      byName[error.errorName] = (byName[error.errorName] || 0) + 1

      // Time-based counts
      const age = now - error.timestamp
      if (age <= oneDay) last24Hours++
      if (age <= oneHour) lastHour++
      if (age <= oneMinute) lastMinute++
    }

    return {
      total: this.errors.length,
      byCode,
      byStatusCode,
      byName,
      last24Hours,
      lastHour,
      lastMinute,
      recentErrors: this.errors.slice(-10)
    }
  }

  /**
   * Get errors by code
   */
  getErrorsByCode(code: ErrorCode): ErrorEntry[] {
    return this.errors.filter(e => e.errorCode === code)
  }

  /**
   * Get errors by status code
   */
  getErrorsByStatusCode(statusCode: number): ErrorEntry[] {
    return this.errors.filter(e => e.statusCode === statusCode)
  }

  /**
   * Get errors in time range
   */
  getErrorsInRange(startTime: number, endTime: number): ErrorEntry[] {
    return this.errors.filter(e =>
      e.timestamp >= startTime && e.timestamp <= endTime
    )
  }

  /**
   * Get error rate (errors per minute)
   */
  getErrorRate(): number {
    const stats = this.getStats()
    return stats.lastMinute
  }

  /**
   * Clear old errors
   */
  clearOld(maxAge: number = 24 * 60 * 60 * 1000): void {
    const cutoff = Date.now() - maxAge
    this.errors = this.errors.filter(e => e.timestamp > cutoff)
  }

  /**
   * Clear all errors
   */
  clearAll(): void {
    this.errors = []
  }

  /**
   * Add alert threshold
   */
  addAlert(alert: AlertThreshold): void {
    this.alerts.push(alert)
  }

  /**
   * Check alert thresholds
   */
  private checkAlerts(): void {
    const stats = this.getStats()

    for (const alert of this.alerts) {
      const value = stats[alert.metric]
      if (typeof value === 'number' && value >= alert.threshold) {
        alert.callback(stats)
      }
    }
  }

  /**
   * Get summary for logging
   */
  getSummary(): string {
    const stats = this.getStats()

    const lines = [
      '📊 Error Tracking Summary:',
      `   Total Errors: ${stats.total}`,
      `   Last 24h: ${stats.last24Hours}`,
      `   Last Hour: ${stats.lastHour}`,
      `   Last Minute: ${stats.lastMinute}`,
      '',
      '   By Status Code:'
    ]

    for (const [code, count] of Object.entries(stats.byStatusCode)) {
      lines.push(`      ${code}: ${count}`)
    }

    lines.push('')
    lines.push('   Top Error Types:')

    const sortedByName = Object.entries(stats.byName)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    for (const [name, count] of sortedByName) {
      lines.push(`      ${name}: ${count}`)
    }

    return lines.join('\n')
  }
}

// Global error tracker instance
export const errorTracker = new ErrorTracker(1000)
