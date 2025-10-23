/**
 * 🧪 MONITORING SYSTEM - Unit Tests
 */

import { describe, test, expect, beforeEach } from 'bun:test'
import { ErrorTracker } from '../monitoring/error-tracker'
import { Counter, Gauge, Histogram, MetricsRegistry } from '../monitoring/metrics'
import { DatabaseError, ValidationError, ErrorCode } from '../errors'

describe('ErrorTracker - Basic Tracking', () => {
  let tracker: ErrorTracker

  beforeEach(() => {
    tracker = new ErrorTracker(100)
  })

  test('Tracks errors correctly', () => {
    const error = new DatabaseError('Test error', ErrorCode.DATABASE_QUERY_FAILED)
    tracker.track(error)

    const stats = tracker.getStats()
    expect(stats.total).toBe(1)
    expect(stats.byCode[ErrorCode.DATABASE_QUERY_FAILED]).toBe(1)
    expect(stats.byStatusCode[500]).toBe(1)
  })

  test('Tracks multiple errors', () => {
    const error1 = new DatabaseError('Error 1', ErrorCode.DATABASE_QUERY_FAILED)
    const error2 = new ValidationError('Error 2')
    const error3 = new DatabaseError('Error 3', ErrorCode.DATABASE_CONNECTION_FAILED)

    tracker.track(error1)
    tracker.track(error2)
    tracker.track(error3)

    const stats = tracker.getStats()
    expect(stats.total).toBe(3)
    expect(stats.byStatusCode[400]).toBe(1)  // ValidationError
    expect(stats.byStatusCode[500]).toBe(2)  // DatabaseErrors
  })

  test('Limits stored errors to maxEntries', () => {
    const tracker = new ErrorTracker(5)

    for (let i = 0; i < 10; i++) {
      const error = new DatabaseError(`Error ${i}`, ErrorCode.DATABASE_QUERY_FAILED)
      tracker.track(error)
    }

    const stats = tracker.getStats()
    expect(stats.total).toBe(5)
  })

  test('Clears old errors', () => {
    const error1 = new DatabaseError('Old error', ErrorCode.DATABASE_QUERY_FAILED)
    tracker.track(error1)

    // Wait 2ms
    const start = Date.now()
    while (Date.now() - start < 2) {}

    const error2 = new DatabaseError('New error', ErrorCode.DATABASE_QUERY_FAILED)
    tracker.track(error2)

    // Clear errors older than 1ms
    tracker.clearOld(1)

    const stats = tracker.getStats()
    expect(stats.total).toBe(1)  // Only the new error remains
  })
})

describe('ErrorTracker - Statistics', () => {
  let tracker: ErrorTracker

  beforeEach(() => {
    tracker = new ErrorTracker(100)
  })

  test('Counts errors by time period', () => {
    const error = new DatabaseError('Test', ErrorCode.DATABASE_QUERY_FAILED)
    tracker.track(error)

    const stats = tracker.getStats()
    expect(stats.lastMinute).toBe(1)
    expect(stats.lastHour).toBe(1)
    expect(stats.last24Hours).toBe(1)
  })

  test('Gets errors by code', () => {
    const error1 = new DatabaseError('Error 1', ErrorCode.DATABASE_QUERY_FAILED)
    const error2 = new DatabaseError('Error 2', ErrorCode.DATABASE_CONNECTION_FAILED)
    const error3 = new DatabaseError('Error 3', ErrorCode.DATABASE_QUERY_FAILED)

    tracker.track(error1)
    tracker.track(error2)
    tracker.track(error3)

    const queryErrors = tracker.getErrorsByCode(ErrorCode.DATABASE_QUERY_FAILED)
    expect(queryErrors.length).toBe(2)

    const connErrors = tracker.getErrorsByCode(ErrorCode.DATABASE_CONNECTION_FAILED)
    expect(connErrors.length).toBe(1)
  })

  test('Gets errors by status code', () => {
    const error1 = new ValidationError('Validation')
    const error2 = new DatabaseError('Database', ErrorCode.DATABASE_QUERY_FAILED)

    tracker.track(error1)
    tracker.track(error2)

    const clientErrors = tracker.getErrorsByStatusCode(400)
    expect(clientErrors.length).toBe(1)

    const serverErrors = tracker.getErrorsByStatusCode(500)
    expect(serverErrors.length).toBe(1)
  })

  test('Generates summary', () => {
    const error1 = new DatabaseError('Error 1', ErrorCode.DATABASE_QUERY_FAILED)
    const error2 = new ValidationError('Error 2')

    tracker.track(error1)
    tracker.track(error2)

    const summary = tracker.getSummary()
    expect(summary).toContain('Total Errors: 2')
    expect(summary).toContain('Last 24h: 2')
  })
})

describe('ErrorTracker - Alerts', () => {
  test('Triggers alerts when threshold reached', () => {
    const tracker = new ErrorTracker(100)
    let alertTriggered = false

    tracker.addAlert({
      metric: 'total',
      threshold: 3,
      callback: () => {
        alertTriggered = true
      }
    })

    // Add 2 errors - alert should not trigger
    tracker.track(new DatabaseError('1', ErrorCode.DATABASE_QUERY_FAILED))
    tracker.track(new DatabaseError('2', ErrorCode.DATABASE_QUERY_FAILED))
    expect(alertTriggered).toBe(false)

    // Add 3rd error - alert should trigger
    tracker.track(new DatabaseError('3', ErrorCode.DATABASE_QUERY_FAILED))
    expect(alertTriggered).toBe(true)
  })
})

describe('Counter Metric', () => {
  test('Increments counter', () => {
    const counter = new Counter('test_counter', 'Test counter')
    counter.inc()
    counter.inc()

    expect(counter.getValue()).toBe(2)
  })

  test('Increments by custom amount', () => {
    const counter = new Counter('test_counter', 'Test counter')
    counter.inc(undefined, 5)

    expect(counter.getValue()).toBe(5)
  })

  test('Supports labels', () => {
    const counter = new Counter('http_requests', 'HTTP requests')
    counter.inc({ method: 'GET', path: '/api/test' })
    counter.inc({ method: 'POST', path: '/api/test' })
    counter.inc({ method: 'GET', path: '/api/test' })

    expect(counter.getValue({ method: 'GET', path: '/api/test' })).toBe(2)
    expect(counter.getValue({ method: 'POST', path: '/api/test' })).toBe(1)
  })

  test('Resets to zero', () => {
    const counter = new Counter('test_counter', 'Test counter')
    counter.inc(undefined, 5)
    counter.reset()

    expect(counter.getValue()).toBe(0)
  })
})

describe('Gauge Metric', () => {
  test('Sets gauge value', () => {
    const gauge = new Gauge('test_gauge', 'Test gauge')
    gauge.set(42)

    expect(gauge.getValue()).toBe(42)
  })

  test('Increments and decrements', () => {
    const gauge = new Gauge('test_gauge', 'Test gauge')
    gauge.set(10)
    gauge.inc()
    gauge.inc(undefined, 5)
    gauge.dec(undefined, 3)

    expect(gauge.getValue()).toBe(13)
  })

  test('Supports labels', () => {
    const gauge = new Gauge('memory_usage', 'Memory usage')
    gauge.set(100, { type: 'heap' })
    gauge.set(50, { type: 'rss' })

    expect(gauge.getValue({ type: 'heap' })).toBe(100)
    expect(gauge.getValue({ type: 'rss' })).toBe(50)
  })
})

describe('Histogram Metric', () => {
  test('Observes values', () => {
    const histogram = new Histogram(
      'request_duration',
      'Request duration',
      [0.1, 0.5, 1, 5]
    )

    histogram.observe(0.05)
    histogram.observe(0.3)
    histogram.observe(0.7)
    histogram.observe(2)

    const metrics = histogram.getAll()
    expect(metrics.length).toBe(1)
    expect(metrics[0].count).toBe(4)
    expect(metrics[0].sum).toBeCloseTo(3.05)
  })

  test('Tracks bucket distribution', () => {
    const histogram = new Histogram(
      'request_duration',
      'Request duration',
      [0.1, 0.5, 1]
    )

    histogram.observe(0.05)  // < 0.1
    histogram.observe(0.3)   // < 0.5
    histogram.observe(0.7)   // < 1
    histogram.observe(2)     // > 1

    const metrics = histogram.getAll()
    const buckets = metrics[0].buckets

    expect(buckets[0].count).toBe(1)  // <= 0.1
    expect(buckets[1].count).toBe(2)  // <= 0.5
    expect(buckets[2].count).toBe(3)  // <= 1
  })

  test('Supports labels', () => {
    const histogram = new Histogram(
      'request_duration',
      'Request duration',
      [0.1, 1]
    )

    histogram.observe(0.5, { endpoint: '/api/v1' })
    histogram.observe(1.5, { endpoint: '/api/v2' })

    const metrics = histogram.getAll()
    expect(metrics.length).toBe(2)
  })
})

describe('MetricsRegistry', () => {
  let registry: MetricsRegistry

  beforeEach(() => {
    registry = new MetricsRegistry()
  })

  test('Registers and retrieves metrics', () => {
    const counter = registry.registerCounter('test_counter', 'Test')
    const gauge = registry.registerGauge('test_gauge', 'Test')
    const histogram = registry.registerHistogram('test_histogram', 'Test')

    expect(registry.getCounter('test_counter')).toBe(counter)
    expect(registry.getGauge('test_gauge')).toBe(gauge)
    expect(registry.getHistogram('test_histogram')).toBe(histogram)
  })

  test('Exports Prometheus format', () => {
    const counter = registry.registerCounter('http_requests_total', 'Total requests')
    counter.inc({ method: 'GET' }, 5)

    const prometheus = registry.exportPrometheus()

    expect(prometheus).toContain('# HELP http_requests_total Total requests')
    expect(prometheus).toContain('# TYPE http_requests_total counter')
    expect(prometheus).toContain('http_requests_total{method="GET"} 5')
  })

  test('Exports JSON format', () => {
    const counter = registry.registerCounter('test_counter', 'Test')
    counter.inc(undefined, 10)

    const json = registry.exportJSON()

    expect(json.counters.test_counter).toBeDefined()
    expect(json.counters.test_counter[0].value).toBe(10)
  })

  test('Resets all metrics', () => {
    const counter = registry.registerCounter('test_counter', 'Test')
    const gauge = registry.registerGauge('test_gauge', 'Test')

    counter.inc(undefined, 5)
    gauge.set(10)

    registry.reset()

    expect(counter.getValue()).toBe(0)
    expect(gauge.getValue()).toBe(0)
  })
})

describe('MetricsRegistry - Complex Scenarios', () => {
  test('Exports multiple metrics correctly', () => {
    const registry = new MetricsRegistry()

    const requests = registry.registerCounter('http_requests_total', 'Total requests')
    requests.inc({ method: 'GET', status: '200' }, 100)
    requests.inc({ method: 'POST', status: '201' }, 50)

    const duration = registry.registerHistogram(
      'http_duration_seconds',
      'Request duration',
      [0.1, 1]
    )
    duration.observe(0.5, { endpoint: '/api/test' })

    const memory = registry.registerGauge('memory_bytes', 'Memory usage')
    memory.set(1024000)

    const prometheus = registry.exportPrometheus()

    expect(prometheus).toContain('http_requests_total')
    expect(prometheus).toContain('http_duration_seconds')
    expect(prometheus).toContain('memory_bytes')
  })
})
