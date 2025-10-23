/**
 * 📈 Metrics Collection System
 *
 * Collects and exposes application metrics in Prometheus format
 */

export interface Metric {
  name: string
  type: 'counter' | 'gauge' | 'histogram'
  help: string
  value: number
  labels?: Record<string, string>
}

export interface HistogramBucket {
  le: number // less than or equal
  count: number
}

export interface HistogramMetric {
  name: string
  help: string
  buckets: HistogramBucket[]
  sum: number
  count: number
  labels?: Record<string, string>
}

/**
 * Counter metric - only increases
 */
export class Counter {
  private value: number = 0
  private labeledValues: Map<string, number> = new Map()

  constructor(
    public readonly name: string,
    public readonly help: string
  ) {}

  inc(labels?: Record<string, string>, amount: number = 1): void {
    if (labels) {
      const key = JSON.stringify(labels)
      const current = this.labeledValues.get(key) || 0
      this.labeledValues.set(key, current + amount)
    } else {
      this.value += amount
    }
  }

  getValue(labels?: Record<string, string>): number {
    if (labels) {
      const key = JSON.stringify(labels)
      return this.labeledValues.get(key) || 0
    }
    return this.value
  }

  getAll(): Metric[] {
    const metrics: Metric[] = []

    // Base metric
    if (this.value > 0) {
      metrics.push({
        name: this.name,
        type: 'counter',
        help: this.help,
        value: this.value
      })
    }

    // Labeled metrics
    for (const [labelKey, value] of this.labeledValues) {
      metrics.push({
        name: this.name,
        type: 'counter',
        help: this.help,
        value,
        labels: JSON.parse(labelKey)
      })
    }

    return metrics
  }

  reset(): void {
    this.value = 0
    this.labeledValues.clear()
  }
}

/**
 * Gauge metric - can increase or decrease
 */
export class Gauge {
  private value: number = 0
  private labeledValues: Map<string, number> = new Map()

  constructor(
    public readonly name: string,
    public readonly help: string
  ) {}

  set(value: number, labels?: Record<string, string>): void {
    if (labels) {
      const key = JSON.stringify(labels)
      this.labeledValues.set(key, value)
    } else {
      this.value = value
    }
  }

  inc(labels?: Record<string, string>, amount: number = 1): void {
    if (labels) {
      const key = JSON.stringify(labels)
      const current = this.labeledValues.get(key) || 0
      this.labeledValues.set(key, current + amount)
    } else {
      this.value += amount
    }
  }

  dec(labels?: Record<string, string>, amount: number = 1): void {
    if (labels) {
      const key = JSON.stringify(labels)
      const current = this.labeledValues.get(key) || 0
      this.labeledValues.set(key, current - amount)
    } else {
      this.value -= amount
    }
  }

  getValue(labels?: Record<string, string>): number {
    if (labels) {
      const key = JSON.stringify(labels)
      return this.labeledValues.get(key) || 0
    }
    return this.value
  }

  getAll(): Metric[] {
    const metrics: Metric[] = []

    // Base metric
    metrics.push({
      name: this.name,
      type: 'gauge',
      help: this.help,
      value: this.value
    })

    // Labeled metrics
    for (const [labelKey, value] of this.labeledValues) {
      metrics.push({
        name: this.name,
        type: 'gauge',
        help: this.help,
        value,
        labels: JSON.parse(labelKey)
      })
    }

    return metrics
  }

  reset(): void {
    this.value = 0
    this.labeledValues.clear()
  }
}

/**
 * Histogram metric - tracks distribution of values
 */
export class Histogram {
  private buckets: number[]
  private bucketCounts: Map<string, number[]> = new Map()
  private sums: Map<string, number> = new Map()
  private counts: Map<string, number> = new Map()

  constructor(
    public readonly name: string,
    public readonly help: string,
    buckets: number[] = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
  ) {
    this.buckets = [...buckets].sort((a, b) => a - b)
  }

  observe(value: number, labels?: Record<string, string>): void {
    const key = labels ? JSON.stringify(labels) : ''

    // Initialize if needed
    if (!this.bucketCounts.has(key)) {
      this.bucketCounts.set(key, new Array(this.buckets.length).fill(0))
      this.sums.set(key, 0)
      this.counts.set(key, 0)
    }

    // Update buckets
    const counts = this.bucketCounts.get(key)!
    for (let i = 0; i < this.buckets.length; i++) {
      if (value <= this.buckets[i]) {
        counts[i]++
      }
    }

    // Update sum and count
    this.sums.set(key, (this.sums.get(key) || 0) + value)
    this.counts.set(key, (this.counts.get(key) || 0) + 1)
  }

  getAll(): HistogramMetric[] {
    const metrics: HistogramMetric[] = []

    for (const [labelKey, counts] of this.bucketCounts) {
      const buckets: HistogramBucket[] = this.buckets.map((le, i) => ({
        le,
        count: counts[i]
      }))

      metrics.push({
        name: this.name,
        help: this.help,
        buckets,
        sum: this.sums.get(labelKey) || 0,
        count: this.counts.get(labelKey) || 0,
        labels: labelKey ? JSON.parse(labelKey) : undefined
      })
    }

    return metrics
  }

  reset(): void {
    this.bucketCounts.clear()
    this.sums.clear()
    this.counts.clear()
  }
}

/**
 * Metrics Registry - Manages all metrics
 */
export class MetricsRegistry {
  private counters: Map<string, Counter> = new Map()
  private gauges: Map<string, Gauge> = new Map()
  private histograms: Map<string, Histogram> = new Map()

  registerCounter(name: string, help: string): Counter {
    if (this.counters.has(name)) {
      return this.counters.get(name)!
    }

    const counter = new Counter(name, help)
    this.counters.set(name, counter)
    return counter
  }

  registerGauge(name: string, help: string): Gauge {
    if (this.gauges.has(name)) {
      return this.gauges.get(name)!
    }

    const gauge = new Gauge(name, help)
    this.gauges.set(name, gauge)
    return gauge
  }

  registerHistogram(name: string, help: string, buckets?: number[]): Histogram {
    if (this.histograms.has(name)) {
      return this.histograms.get(name)!
    }

    const histogram = new Histogram(name, help, buckets)
    this.histograms.set(name, histogram)
    return histogram
  }

  getCounter(name: string): Counter | undefined {
    return this.counters.get(name)
  }

  getGauge(name: string): Gauge | undefined {
    return this.gauges.get(name)
  }

  getHistogram(name: string): Histogram | undefined {
    return this.histograms.get(name)
  }

  /**
   * Export metrics in Prometheus text format
   */
  exportPrometheus(): string {
    const lines: string[] = []

    // Export counters
    for (const counter of this.counters.values()) {
      lines.push(`# HELP ${counter.name} ${counter.help}`)
      lines.push(`# TYPE ${counter.name} counter`)

      for (const metric of counter.getAll()) {
        const labels = metric.labels
          ? Object.entries(metric.labels)
              .map(([k, v]) => `${k}="${v}"`)
              .join(',')
          : ''
        const labelStr = labels ? `{${labels}}` : ''
        lines.push(`${metric.name}${labelStr} ${metric.value}`)
      }

      lines.push('')
    }

    // Export gauges
    for (const gauge of this.gauges.values()) {
      lines.push(`# HELP ${gauge.name} ${gauge.help}`)
      lines.push(`# TYPE ${gauge.name} gauge`)

      for (const metric of gauge.getAll()) {
        const labels = metric.labels
          ? Object.entries(metric.labels)
              .map(([k, v]) => `${k}="${v}"`)
              .join(',')
          : ''
        const labelStr = labels ? `{${labels}}` : ''
        lines.push(`${metric.name}${labelStr} ${metric.value}`)
      }

      lines.push('')
    }

    // Export histograms
    for (const histogram of this.histograms.values()) {
      lines.push(`# HELP ${histogram.name} ${histogram.help}`)
      lines.push(`# TYPE ${histogram.name} histogram`)

      for (const metric of histogram.getAll()) {
        const baseLabels = metric.labels
          ? Object.entries(metric.labels)
              .map(([k, v]) => `${k}="${v}"`)
              .join(',')
          : ''

        // Bucket counts
        for (const bucket of metric.buckets) {
          const labels = baseLabels
            ? `${baseLabels},le="${bucket.le}"`
            : `le="${bucket.le}"`
          lines.push(`${metric.name}_bucket{${labels}} ${bucket.count}`)
        }

        // +Inf bucket
        const infLabels = baseLabels ? `${baseLabels},le="+Inf"` : `le="+Inf"`
        lines.push(`${metric.name}_bucket{${infLabels}} ${metric.count}`)

        // Sum and count
        const labelStr = baseLabels ? `{${baseLabels}}` : ''
        lines.push(`${metric.name}_sum${labelStr} ${metric.sum}`)
        lines.push(`${metric.name}_count${labelStr} ${metric.count}`)
      }

      lines.push('')
    }

    return lines.join('\n')
  }

  /**
   * Export metrics as JSON
   */
  exportJSON(): any {
    const result: any = {
      counters: {},
      gauges: {},
      histograms: {}
    }

    for (const [name, counter] of this.counters) {
      result.counters[name] = counter.getAll()
    }

    for (const [name, gauge] of this.gauges) {
      result.gauges[name] = gauge.getAll()
    }

    for (const [name, histogram] of this.histograms) {
      result.histograms[name] = histogram.getAll()
    }

    return result
  }

  reset(): void {
    for (const counter of this.counters.values()) {
      counter.reset()
    }
    for (const gauge of this.gauges.values()) {
      gauge.reset()
    }
    for (const histogram of this.histograms.values()) {
      histogram.reset()
    }
  }
}

// Global metrics registry
export const metricsRegistry = new MetricsRegistry()
