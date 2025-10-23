/**
 * 📝 Toobix Logging System
 *
 * Structured logging with different levels and contexts
 */

import { ToobixError } from '../errors'

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: number
  context?: Record<string, any>
  error?: {
    name: string
    message: string
    code?: number
    stack?: string
  }
  service?: string
  userId?: string
  requestId?: string
}

export interface LoggerConfig {
  level: LogLevel
  service: string
  prettyPrint: boolean
  includeStackTrace: boolean
  outputs: LogOutput[]
}

export interface LogOutput {
  name: string
  write: (entry: LogEntry) => void | Promise<void>
}

/**
 * Console output with colors
 */
class ConsoleOutput implements LogOutput {
  name = 'console'

  private colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    gray: '\x1b[90m',
    cyan: '\x1b[36m',
  }

  write(entry: LogEntry): void {
    const color = this.getColorForLevel(entry.level)
    const levelName = LogLevel[entry.level]
    const timestamp = new Date(entry.timestamp).toISOString()

    let output = `${this.colors.gray}[${timestamp}]${this.colors.reset} `
    output += `${color}${levelName.padEnd(5)}${this.colors.reset} `

    if (entry.service) {
      output += `${this.colors.cyan}[${entry.service}]${this.colors.reset} `
    }

    output += entry.message

    if (entry.context && Object.keys(entry.context).length > 0) {
      output += `\n${this.colors.gray}${JSON.stringify(entry.context, null, 2)}${this.colors.reset}`
    }

    if (entry.error) {
      output += `\n${color}Error: ${entry.error.message}${this.colors.reset}`
      if (entry.error.stack) {
        output += `\n${this.colors.gray}${entry.error.stack}${this.colors.reset}`
      }
    }

    console.log(output)
  }

  private getColorForLevel(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return this.colors.gray
      case LogLevel.INFO:
        return this.colors.blue
      case LogLevel.WARN:
        return this.colors.yellow
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return this.colors.red
      default:
        return this.colors.reset
    }
  }
}

/**
 * File output (append to log file)
 */
class FileOutput implements LogOutput {
  name = 'file'
  private filePath: string

  constructor(filePath: string) {
    this.filePath = filePath
  }

  async write(entry: LogEntry): Promise<void> {
    try {
      const fs = await import('fs/promises')
      const logLine = JSON.stringify(entry) + '\n'
      await fs.appendFile(this.filePath, logLine, 'utf-8')
    } catch (error) {
      // Fallback to console if file write fails
      console.error('Failed to write log to file:', error)
    }
  }
}

/**
 * Memory output (for testing)
 */
class MemoryOutput implements LogOutput {
  name = 'memory'
  public logs: LogEntry[] = []
  private maxSize: number

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize
  }

  write(entry: LogEntry): void {
    this.logs.push(entry)
    if (this.logs.length > this.maxSize) {
      this.logs.shift()
    }
  }

  clear(): void {
    this.logs = []
  }

  getAll(): LogEntry[] {
    return [...this.logs]
  }

  getByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level)
  }
}

/**
 * Main Logger class
 */
export class Logger {
  private config: LoggerConfig
  private contextData: Record<string, any> = {}

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      level: config?.level ?? LogLevel.INFO,
      service: config?.service ?? 'toobix',
      prettyPrint: config?.prettyPrint ?? true,
      includeStackTrace: config?.includeStackTrace ?? true,
      outputs: config?.outputs ?? [new ConsoleOutput()],
    }
  }

  /**
   * Set persistent context data
   */
  setContext(key: string, value: any): void {
    this.contextData[key] = value
  }

  /**
   * Clear context data
   */
  clearContext(): void {
    this.contextData = {}
  }

  /**
   * Create a child logger with additional context
   */
  child(context: Record<string, any>): Logger {
    const childLogger = new Logger(this.config)
    childLogger.contextData = { ...this.contextData, ...context }
    return childLogger
  }

  /**
   * Log at DEBUG level
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  /**
   * Log at INFO level
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context)
  }

  /**
   * Log at WARN level
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context)
  }

  /**
   * Log at ERROR level
   */
  error(message: string, error?: Error | ToobixError, context?: Record<string, any>): void {
    const entry = this.createEntry(LogLevel.ERROR, message, context)

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        ...(error instanceof ToobixError && { code: error.code }),
        ...(this.config.includeStackTrace && { stack: error.stack }),
      }
    }

    this.writeEntry(entry)
  }

  /**
   * Log at FATAL level
   */
  fatal(message: string, error?: Error | ToobixError, context?: Record<string, any>): void {
    const entry = this.createEntry(LogLevel.FATAL, message, context)

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        ...(error instanceof ToobixError && { code: error.code }),
        ...(this.config.includeStackTrace && { stack: error.stack }),
      }
    }

    this.writeEntry(entry)
  }

  /**
   * Generic log method
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (level < this.config.level) {
      return // Skip if below configured level
    }

    const entry = this.createEntry(level, message, context)
    this.writeEntry(entry)
  }

  /**
   * Create log entry
   */
  private createEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>
  ): LogEntry {
    return {
      level,
      message,
      timestamp: Date.now(),
      service: this.config.service,
      context: { ...this.contextData, ...context },
    }
  }

  /**
   * Write entry to all outputs
   */
  private writeEntry(entry: LogEntry): void {
    for (const output of this.config.outputs) {
      try {
        output.write(entry)
      } catch (error) {
        console.error(`Failed to write to ${output.name}:`, error)
      }
    }
  }

  /**
   * Add output
   */
  addOutput(output: LogOutput): void {
    this.config.outputs.push(output)
  }

  /**
   * Remove output by name
   */
  removeOutput(name: string): void {
    this.config.outputs = this.config.outputs.filter(o => o.name !== name)
  }
}

/**
 * Global logger instance
 */
let globalLogger: Logger | null = null

/**
 * Initialize global logger
 */
export function initLogger(config?: Partial<LoggerConfig>): Logger {
  globalLogger = new Logger(config)
  return globalLogger
}

/**
 * Get global logger instance
 */
export function getLogger(): Logger {
  if (!globalLogger) {
    globalLogger = new Logger()
  }
  return globalLogger
}

/**
 * Create a named logger (with service context)
 */
export function createLogger(service: string, config?: Partial<LoggerConfig>): Logger {
  return new Logger({ ...config, service })
}

// Export output classes
export { ConsoleOutput, FileOutput, MemoryOutput }
