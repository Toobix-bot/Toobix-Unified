/**
 * 📈 Metrics Collection Middleware
 *
 * Tracks API performance and request statistics
 */

import type { Elysia } from 'elysia'
import { metricsRegistry } from '@toobix/core'

// Register metrics
const httpRequestsTotal = metricsRegistry.registerCounter(
  'http_requests_total',
  'Total number of HTTP requests'
)

const httpRequestDuration = metricsRegistry.registerHistogram(
  'http_request_duration_seconds',
  'HTTP request duration in seconds',
  [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
)

const httpRequestsInProgress = metricsRegistry.registerGauge(
  'http_requests_in_progress',
  'Number of HTTP requests currently being processed'
)

const httpResponseSize = metricsRegistry.registerHistogram(
  'http_response_size_bytes',
  'HTTP response size in bytes',
  [100, 1000, 10000, 100000, 1000000, 10000000]
)

const httpErrorsTotal = metricsRegistry.registerCounter(
  'http_errors_total',
  'Total number of HTTP errors'
)

/**
 * Metrics middleware for Elysia
 */
export const metricsMiddleware = (app: Elysia) => {
  return app
    .derive(({ request }) => {
      const startTime = Date.now()
      const url = new URL(request.url)
      const path = url.pathname
      const method = request.method

      // Increment in-progress counter
      httpRequestsInProgress.inc({ method, path })

      return {
        metrics: {
          startTime,
          path,
          method
        }
      }
    })
    .onAfterHandle(({ metrics, set, response }) => {
      const { startTime, path, method } = metrics!

      // Calculate duration
      const duration = (Date.now() - startTime) / 1000
      const status = String(set.status || 200)

      // Record metrics
      httpRequestsTotal.inc({ method, path, status })
      httpRequestDuration.observe(duration, { method, path })

      // Record response size if available
      if (response) {
        try {
          const size = JSON.stringify(response).length
          httpResponseSize.observe(size, { method, path })
        } catch {
          // Ignore if response cannot be stringified
        }
      }

      // Decrement in-progress counter
      httpRequestsInProgress.dec({ method, path })
    })
    .onError(({ metrics, set }) => {
      if (!metrics) return

      const { startTime, path, method } = metrics
      const duration = (Date.now() - startTime) / 1000
      const status = String(set.status || 500)

      // Record error metrics
      httpRequestsTotal.inc({ method, path, status })
      httpRequestDuration.observe(duration, { method, path })
      httpErrorsTotal.inc({ method, path, status })

      // Decrement in-progress counter
      httpRequestsInProgress.dec({ method, path })
    })
}

/**
 * Get current metrics summary
 */
export function getMetricsSummary() {
  const json = metricsRegistry.exportJSON()

  const summary: any = {
    requests: {},
    errors: {},
    performance: {}
  }

  // Extract request counts
  if (json.counters.http_requests_total) {
    summary.requests.total = json.counters.http_requests_total.reduce(
      (sum: number, m: any) => sum + m.value,
      0
    )

    // Group by status code
    const byStatus: Record<string, number> = {}
    for (const metric of json.counters.http_requests_total) {
      if (metric.labels?.status) {
        byStatus[metric.labels.status] =
          (byStatus[metric.labels.status] || 0) + metric.value
      }
    }
    summary.requests.byStatus = byStatus
  }

  // Extract error counts
  if (json.counters.http_errors_total) {
    summary.errors.total = json.counters.http_errors_total.reduce(
      (sum: number, m: any) => sum + m.value,
      0
    )
  }

  // Extract performance metrics
  if (json.histograms.http_request_duration_seconds) {
    const durations = json.histograms.http_request_duration_seconds
    if (durations.length > 0) {
      const first = durations[0]
      summary.performance.avgDuration = first.count > 0 ? first.sum / first.count : 0
      summary.performance.totalRequests = first.count
    }
  }

  // Current load
  if (json.gauges.http_requests_in_progress) {
    summary.requests.inProgress = json.gauges.http_requests_in_progress.reduce(
      (sum: number, m: any) => sum + m.value,
      0
    )
  }

  return summary
}
