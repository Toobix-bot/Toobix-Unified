/**
 * Task Scheduler
 * Runs automated file management tasks on schedule
 */

import type { AIFileManager } from '../index'
import type { AutonomousAgent } from '../autonomous/agent'
import { findDuplicates } from '../features/duplicates'

export interface ScheduledTask {
  id: string
  name: string
  description: string
  schedule: 'hourly' | 'daily' | 'weekly' | 'monthly'
  lastRun?: Date
  nextRun?: Date
  enabled: boolean
  action: (manager: AIFileManager, agent?: AutonomousAgent) => Promise<any>
}

export interface TaskResult {
  taskId: string
  timestamp: Date
  success: boolean
  result?: any
  error?: string
  duration: number
}

/**
 * Task Scheduler
 */
export class TaskScheduler {
  private fileManager: AIFileManager
  private agent?: AutonomousAgent
  private tasks: Map<string, ScheduledTask> = new Map()
  private results: TaskResult[] = []
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private running: boolean = false

  constructor(fileManager: AIFileManager, agent?: AutonomousAgent) {
    this.fileManager = fileManager
    this.agent = agent

    // Register default tasks
    this.registerDefaultTasks()
  }

  /**
   * Register default tasks
   */
  private registerDefaultTasks(): void {
    // Task 1: Daily Downloads cleanup
    this.registerTask({
      id: 'daily-downloads-cleanup',
      name: 'Clean Downloads',
      description: 'Organize Downloads folder daily',
      schedule: 'daily',
      enabled: false, // User must enable
      action: async (manager) => {
        const downloadsPath = process.env.USERPROFILE + '\\Downloads'
        const plan = await manager.organizeDirectory(downloadsPath, true)
        return {
          files: plan.files.length,
          categories: Object.keys(plan.structure).length,
        }
      },
    })

    // Task 2: Weekly duplicate scan
    this.registerTask({
      id: 'weekly-duplicate-scan',
      name: 'Find Duplicates',
      description: 'Scan common folders for duplicates weekly',
      schedule: 'weekly',
      enabled: false,
      action: async (manager) => {
        const folders = [
          process.env.USERPROFILE + '\\Downloads',
          process.env.USERPROFILE + '\\Documents',
          process.env.USERPROFILE + '\\Desktop',
        ]

        let totalDuplicates = 0
        let totalWasted = 0

        for (const folder of folders) {
          try {
            const files = await manager.scanDirectory(folder)
            const duplicates = findDuplicates(files)
            totalDuplicates += duplicates.length
            totalWasted += duplicates.reduce((sum, g) => sum + g.wastedSpace, 0)
          } catch (error) {
            console.warn(`⚠️  Could not scan ${folder}`)
          }
        }

        return { duplicateGroups: totalDuplicates, wastedSpace: totalWasted }
      },
    })

    // Task 3: Hourly proactive scan (with agent)
    this.registerTask({
      id: 'hourly-proactive-scan',
      name: 'Proactive Scan',
      description: 'Autonomous agent scans for issues hourly',
      schedule: 'hourly',
      enabled: false,
      action: async (manager, agent) => {
        if (!agent) {
          return { error: 'Autonomous agent not available' }
        }

        const decisions = await agent.proactiveScan()
        return { decisions: decisions.length }
      },
    })

    // Task 4: Daily learning summary
    this.registerTask({
      id: 'daily-learning-summary',
      name: 'Learning Summary',
      description: 'Generate daily summary of learnings',
      schedule: 'daily',
      enabled: false,
      action: async (manager, agent) => {
        if (!agent) {
          return { error: 'Autonomous agent not available' }
        }

        const stats = agent.getStats()
        const learnings = agent.getLearnings().slice(0, 10)

        return {
          totalDecisions: stats.totalDecisions,
          approvalRate: stats.approvalRate,
          topLearnings: learnings.length,
        }
      },
    })

    console.log(`✅ Registered ${this.tasks.size} default tasks`)
  }

  /**
   * Register custom task
   */
  registerTask(task: ScheduledTask): void {
    this.tasks.set(task.id, task)
    console.log(`📋 Registered task: ${task.name}`)
  }

  /**
   * Enable/disable task
   */
  setTaskEnabled(taskId: string, enabled: boolean): void {
    const task = this.tasks.get(taskId)
    if (task) {
      task.enabled = enabled
      console.log(`${enabled ? '✅' : '❌'} Task "${task.name}" ${enabled ? 'enabled' : 'disabled'}`)

      if (this.running) {
        if (enabled) {
          this.scheduleTask(task)
        } else {
          this.unscheduleTask(task)
        }
      }
    }
  }

  /**
   * Start scheduler
   */
  start(): void {
    if (this.running) {
      console.log('⚠️  Scheduler already running')
      return
    }

    console.log('⏰ Starting task scheduler...')
    this.running = true

    // Schedule all enabled tasks
    for (const task of this.tasks.values()) {
      if (task.enabled) {
        this.scheduleTask(task)
      }
    }

    console.log(`✅ Scheduler started (${this.intervals.size} tasks scheduled)`)
  }

  /**
   * Stop scheduler
   */
  stop(): void {
    if (!this.running) {
      console.log('⚠️  Scheduler not running')
      return
    }

    console.log('⏰ Stopping task scheduler...')

    // Clear all intervals
    for (const interval of this.intervals.values()) {
      clearInterval(interval)
    }

    this.intervals.clear()
    this.running = false

    console.log('✅ Scheduler stopped')
  }

  /**
   * Schedule task
   */
  private scheduleTask(task: ScheduledTask): void {
    const intervalMs = this.getIntervalMs(task.schedule)

    const interval = setInterval(async () => {
      await this.runTask(task)
    }, intervalMs)

    this.intervals.set(task.id, interval)

    // Calculate next run
    task.nextRun = new Date(Date.now() + intervalMs)

    console.log(`📅 Scheduled "${task.name}" (${task.schedule})`)
  }

  /**
   * Unschedule task
   */
  private unscheduleTask(task: ScheduledTask): void {
    const interval = this.intervals.get(task.id)
    if (interval) {
      clearInterval(interval)
      this.intervals.delete(task.id)
      task.nextRun = undefined
      console.log(`❌ Unscheduled "${task.name}"`)
    }
  }

  /**
   * Run task immediately
   */
  async runTask(task: ScheduledTask): Promise<TaskResult> {
    console.log(`⚡ Running task: ${task.name}`)

    const startTime = Date.now()
    const result: TaskResult = {
      taskId: task.id,
      timestamp: new Date(),
      success: false,
      duration: 0,
    }

    try {
      const taskResult = await task.action(this.fileManager, this.agent)

      result.success = true
      result.result = taskResult
      result.duration = Date.now() - startTime

      task.lastRun = new Date()
      console.log(`✅ Task "${task.name}" completed (${result.duration}ms)`)
    } catch (error) {
      result.success = false
      result.error = (error as Error).message
      result.duration = Date.now() - startTime

      console.error(`❌ Task "${task.name}" failed:`, error)
    }

    this.results.push(result)

    // Keep only last 100 results
    if (this.results.length > 100) {
      this.results = this.results.slice(-100)
    }

    return result
  }

  /**
   * Get interval in milliseconds
   */
  private getIntervalMs(schedule: ScheduledTask['schedule']): number {
    const intervals = {
      hourly: 60 * 60 * 1000, // 1 hour
      daily: 24 * 60 * 60 * 1000, // 24 hours
      weekly: 7 * 24 * 60 * 60 * 1000, // 7 days
      monthly: 30 * 24 * 60 * 60 * 1000, // 30 days
    }

    return intervals[schedule]
  }

  /**
   * Get all tasks
   */
  getTasks(): ScheduledTask[] {
    return Array.from(this.tasks.values())
  }

  /**
   * Get task by ID
   */
  getTask(id: string): ScheduledTask | undefined {
    return this.tasks.get(id)
  }

  /**
   * Get recent results
   */
  getRecentResults(limit: number = 10): TaskResult[] {
    return this.results.slice(-limit).reverse()
  }

  /**
   * Get task statistics
   */
  getStats() {
    const totalTasks = this.tasks.size
    const enabledTasks = Array.from(this.tasks.values()).filter((t) => t.enabled).length
    const totalRuns = this.results.length
    const successfulRuns = this.results.filter((r) => r.success).length
    const failedRuns = this.results.filter((r) => !r.success).length

    return {
      totalTasks,
      enabledTasks,
      totalRuns,
      successfulRuns,
      failedRuns,
      successRate: totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0,
      running: this.running,
    }
  }
}

/**
 * Create scheduler with default tasks
 */
export function createScheduler(
  fileManager: AIFileManager,
  agent?: AutonomousAgent
): TaskScheduler {
  return new TaskScheduler(fileManager, agent)
}
