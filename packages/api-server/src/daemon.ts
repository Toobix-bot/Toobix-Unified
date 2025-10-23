/**
 * 🔄 Eternal Daemon - Process Manager
 *
 * Keeps the API server running forever with auto-restart on crashes
 */

import { spawn, type ChildProcess } from 'child_process'
import { initLogger, LogLevel } from '@toobix/core'
import * as path from 'path'
import * as fs from 'fs'

const logger = initLogger({
  service: 'eternal-daemon',
  level: LogLevel.INFO,
  prettyPrint: true
})

export interface DaemonConfig {
  serverPath: string
  maxRestarts?: number
  restartDelay?: number
  crashThreshold?: number
  crashWindow?: number
  logFile?: string
  pidFile?: string
}

export interface DaemonStats {
  startTime: number
  restarts: number
  crashes: number
  lastCrash?: number
  uptime: number
  status: 'running' | 'stopped' | 'crashed'
}

/**
 * Eternal Daemon - Manages server lifecycle
 */
export class EternalDaemon {
  private config: Required<DaemonConfig>
  private process?: ChildProcess
  private stats: DaemonStats
  private running: boolean = false
  private restarting: boolean = false
  private crashTimestamps: number[] = []

  constructor(config: DaemonConfig) {
    this.config = {
      serverPath: config.serverPath,
      maxRestarts: config.maxRestarts ?? Infinity,
      restartDelay: config.restartDelay ?? 1000,
      crashThreshold: config.crashThreshold ?? 5,
      crashWindow: config.crashWindow ?? 60000, // 1 minute
      logFile: config.logFile ?? './logs/daemon.log',
      pidFile: config.pidFile ?? './daemon.pid'
    }

    this.stats = {
      startTime: Date.now(),
      restarts: 0,
      crashes: 0,
      uptime: 0,
      status: 'stopped'
    }
  }

  /**
   * Start the daemon
   */
  async start(): Promise<void> {
    if (this.running) {
      logger.warn('Daemon already running')
      return
    }

    logger.info('🚀 Starting Eternal Daemon...')
    this.running = true
    this.stats.startTime = Date.now()
    this.writePidFile()

    // Setup signal handlers
    this.setupSignalHandlers()

    // Start the server
    await this.startServer()
  }

  /**
   * Stop the daemon
   */
  async stop(): Promise<void> {
    logger.info('🛑 Stopping Eternal Daemon...')
    this.running = false

    if (this.process) {
      await this.stopServer()
    }

    this.removePidFile()
    logger.info('✅ Daemon stopped')
  }

  /**
   * Restart the server
   */
  async restart(): Promise<void> {
    logger.info('🔄 Restarting server...')
    this.restarting = true

    if (this.process) {
      await this.stopServer()
    }

    await this.delay(this.config.restartDelay)
    await this.startServer()

    this.restarting = false
  }

  /**
   * Get daemon statistics
   */
  getStats(): DaemonStats {
    return {
      ...this.stats,
      uptime: Date.now() - this.stats.startTime
    }
  }

  /**
   * Start the server process
   */
  private async startServer(): Promise<void> {
    if (!this.running) return

    logger.info('Starting server process...')

    try {
      // Spawn the server
      this.process = spawn('bun', ['run', this.config.serverPath], {
        stdio: 'inherit',
        env: process.env
      })

      this.stats.status = 'running'
      logger.info(`✅ Server started (PID: ${this.process.pid})`)

      // Handle process exit
      this.process.on('exit', (code, signal) => {
        this.handleServerExit(code, signal)
      })

      // Handle process errors
      this.process.on('error', (error) => {
        logger.error('Server process error', error)
        this.handleServerCrash()
      })

    } catch (error) {
      logger.error('Failed to start server', error as Error)
      this.handleServerCrash()
    }
  }

  /**
   * Stop the server process
   */
  private async stopServer(): Promise<void> {
    if (!this.process) return

    logger.info('Stopping server process...')

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        logger.warn('Server did not stop gracefully, forcing kill...')
        this.process?.kill('SIGKILL')
        resolve()
      }, 5000)

      this.process!.on('exit', () => {
        clearTimeout(timeout)
        logger.info('✅ Server stopped')
        this.process = undefined
        resolve()
      })

      // Try graceful shutdown first
      this.process!.kill('SIGTERM')
    })
  }

  /**
   * Handle server exit
   */
  private handleServerExit(code: number | null, signal: string | null): void {
    logger.info(`Server exited with code ${code}, signal ${signal}`)

    this.stats.status = 'stopped'
    this.process = undefined

    if (!this.running || this.restarting) {
      return
    }

    // Check if this was a crash
    if (code !== 0 && code !== null) {
      this.handleServerCrash()
    } else {
      // Normal exit - restart if daemon is still running
      logger.info('Server exited normally, restarting...')
      this.scheduleRestart()
    }
  }

  /**
   * Handle server crash
   */
  private handleServerCrash(): void {
    this.stats.crashes++
    this.stats.lastCrash = Date.now()
    this.stats.status = 'crashed'

    // Track crash timestamp
    this.crashTimestamps.push(Date.now())

    // Remove old crash timestamps outside the window
    const cutoff = Date.now() - this.config.crashWindow
    this.crashTimestamps = this.crashTimestamps.filter(t => t > cutoff)

    logger.error(`❌ Server crashed (${this.stats.crashes} total crashes)`)

    // Check if we've exceeded crash threshold
    if (this.crashTimestamps.length >= this.config.crashThreshold) {
      logger.fatal(
        `Server crashed ${this.crashTimestamps.length} times in ${this.config.crashWindow}ms. Stopping daemon.`
      )
      this.running = false
      this.removePidFile()
      process.exit(1)
    }

    // Check restart limit
    if (this.stats.restarts >= this.config.maxRestarts) {
      logger.fatal(`Max restarts (${this.config.maxRestarts}) reached. Stopping daemon.`)
      this.running = false
      this.removePidFile()
      process.exit(1)
    }

    // Schedule restart
    this.scheduleRestart()
  }

  /**
   * Schedule a restart
   */
  private scheduleRestart(): void {
    this.stats.restarts++

    logger.info(`Scheduling restart in ${this.config.restartDelay}ms (restart #${this.stats.restarts})...`)

    setTimeout(() => {
      if (this.running) {
        this.startServer()
      }
    }, this.config.restartDelay)
  }

  /**
   * Setup signal handlers for graceful shutdown
   */
  private setupSignalHandlers(): void {
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`)
      await this.stop()
      process.exit(0)
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

    // Handle SIGHUP for reload
    process.on('SIGHUP', async () => {
      logger.info('Received SIGHUP, reloading...')
      await this.restart()
    })
  }

  /**
   * Write PID file
   */
  private writePidFile(): void {
    try {
      const dir = path.dirname(this.config.pidFile)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(this.config.pidFile, String(process.pid))
      logger.debug(`PID file written: ${this.config.pidFile}`)
    } catch (error) {
      logger.warn('Failed to write PID file', { error: String(error) })
    }
  }

  /**
   * Remove PID file
   */
  private removePidFile(): void {
    try {
      if (fs.existsSync(this.config.pidFile)) {
        fs.unlinkSync(this.config.pidFile)
        logger.debug('PID file removed')
      }
    } catch (error) {
      logger.warn('Failed to remove PID file', { error: String(error) })
    }
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * Start daemon from CLI
 */
export async function startDaemon(config?: Partial<DaemonConfig>): Promise<void> {
  const daemon = new EternalDaemon({
    serverPath: config?.serverPath ?? './src/server.ts',
    ...config
  })

  await daemon.start()

  // Log stats every 5 minutes
  setInterval(() => {
    const stats = daemon.getStats()
    logger.info('📊 Daemon Stats:', {
      uptime: `${Math.floor(stats.uptime / 1000)}s`,
      restarts: stats.restarts,
      crashes: stats.crashes,
      status: stats.status
    })
  }, 300000)
}

// CLI entry point
if (import.meta.main) {
  startDaemon()
}
