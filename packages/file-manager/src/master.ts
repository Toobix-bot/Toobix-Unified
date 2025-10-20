/**
 * Master File Manager
 * Complete integration of all advanced features
 */

import { createFileManager, type AIFileManager } from './index'
import { AutonomousAgent } from './autonomous/agent'
import { ContentAnalyzer } from './features/content-analyzer'
import { ClipboardManager } from './features/clipboard'
import { ContextManager } from './features/context'
import { TaskScheduler } from './scheduler'

export interface MasterConfig {
  groqApiKey: string
  model?: string
  autonomousEnabled?: boolean
  autoOrganize?: boolean
  learningMode?: boolean
  watchClipboard?: boolean
  watchContext?: boolean
  scheduler?: boolean
}

/**
 * Master File Manager with all features
 */
export class MasterFileManager {
  // Core
  private fileManager: AIFileManager
  private groqApiKey: string

  // Advanced Features
  public autonomous: AutonomousAgent
  public contentAnalyzer: ContentAnalyzer
  public clipboard: ClipboardManager
  public context: ContextManager
  public scheduler: TaskScheduler

  constructor(config: MasterConfig) {
    this.groqApiKey = config.groqApiKey

    // Initialize core file manager
    this.fileManager = createFileManager({
      groqApiKey: config.groqApiKey,
      model: config.model || 'llama-3.3-70b-versatile',
    })

    // Initialize advanced features
    this.contentAnalyzer = new ContentAnalyzer(config.groqApiKey)

    this.autonomous = new AutonomousAgent(this.fileManager, config.groqApiKey, {
      enabled: config.autonomousEnabled ?? false,
      autoOrganize: config.autoOrganize ?? false,
      learningMode: config.learningMode ?? true,
    })

    this.clipboard = new ClipboardManager(config.groqApiKey)
    this.context = new ContextManager(config.groqApiKey)
    this.scheduler = new TaskScheduler(this.fileManager, this.autonomous)

    // Auto-start features
    if (config.watchClipboard) {
      this.clipboard.startWatching()
    }

    if (config.watchContext) {
      this.context.startWatching()
    }

    if (config.scheduler) {
      this.scheduler.start()
    }

    console.log('🚀 Master File Manager initialized')
    console.log(`   Autonomous: ${config.autonomousEnabled ? 'ENABLED' : 'DISABLED'}`)
    console.log(`   Clipboard: ${config.watchClipboard ? 'WATCHING' : 'OFF'}`)
    console.log(`   Context: ${config.watchContext ? 'WATCHING' : 'OFF'}`)
    console.log(`   Scheduler: ${config.scheduler ? 'RUNNING' : 'OFF'}`)
  }

  /**
   * Get file manager instance
   */
  getFileManager(): AIFileManager {
    return this.fileManager
  }

  /**
   * Smart organize with content analysis
   */
  async smartOrganize(path: string, dryRun: boolean = true) {
    console.log(`🧠 Smart organize: ${path}`)

    // 1. Scan files
    const files = await this.fileManager.scanDirectory(path)

    // 2. Analyze content for text files
    const contentAnalyses = await this.contentAnalyzer.analyzeFiles(
      files.filter((f) => f.size < 1024 * 1024) // < 1 MB
    )

    // 3. Create smart organization plan
    const plan = await this.fileManager.createOrganizationPlan(path, files)

    // Apply content-based categories
    for (const [filePath, analysis] of contentAnalyses) {
      const file = plan.files.find((f) => f.path === filePath)
      if (file && analysis.confidence > 70) {
        file.category = analysis.category
        file.subcategory = analysis.subcategory
      }
    }

    // Rebuild structure with new categories
    plan.structure = {}
    for (const file of plan.files) {
      const category = file.category || 'Other'
      if (!plan.structure[category]) {
        plan.structure[category] = []
      }
      plan.structure[category].push(file.path)
    }

    // 4. Execute if not dry run
    if (!dryRun) {
      await this.fileManager.executePlan(path, plan, false)
    }

    return plan
  }

  /**
   * Proactive assistant mode
   */
  async startProactiveMode() {
    console.log('🤖 Starting proactive assistant mode...')

    // Enable autonomous agent
    this.autonomous.setEnabled(true)

    // Start watching
    this.clipboard.startWatching()
    this.context.startWatching()
    this.scheduler.start()

    // Run initial proactive scan
    const decisions = await this.autonomous.proactiveScan()

    console.log(`✅ Proactive mode active (found ${decisions.length} actionable items)`)

    return decisions
  }

  /**
   * Stop proactive mode
   */
  stopProactiveMode() {
    console.log('🛑 Stopping proactive assistant mode...')

    this.autonomous.setEnabled(false)
    this.clipboard.stopWatching()
    this.context.stopWatching()
    this.scheduler.stop()

    console.log('✅ Proactive mode stopped')
  }

  /**
   * Get complete system status
   */
  getStatus() {
    return {
      fileManager: {
        active: true,
      },
      autonomous: {
        enabled: this.autonomous['config'].enabled,
        stats: this.autonomous.getStats(),
        recentDecisions: this.autonomous.getRecentDecisions(5),
      },
      clipboard: {
        watching: this.clipboard['watching'],
        stats: this.clipboard.getStats(),
        recent: this.clipboard.getRecent(5),
      },
      context: {
        watching: this.context['watching'],
        stats: this.context.getStats(),
        current: this.context.getCurrentContext(),
      },
      scheduler: {
        running: this.scheduler['running'],
        stats: this.scheduler.getStats(),
        tasks: this.scheduler.getTasks().map((t) => ({
          id: t.id,
          name: t.name,
          enabled: t.enabled,
          nextRun: t.nextRun,
        })),
      },
    }
  }

  /**
   * Enable specific feature
   */
  enableFeature(feature: 'autonomous' | 'clipboard' | 'context' | 'scheduler') {
    switch (feature) {
      case 'autonomous':
        this.autonomous.setEnabled(true)
        break
      case 'clipboard':
        this.clipboard.startWatching()
        break
      case 'context':
        this.context.startWatching()
        break
      case 'scheduler':
        this.scheduler.start()
        break
    }

    console.log(`✅ Feature "${feature}" enabled`)
  }

  /**
   * Disable specific feature
   */
  disableFeature(feature: 'autonomous' | 'clipboard' | 'context' | 'scheduler') {
    switch (feature) {
      case 'autonomous':
        this.autonomous.setEnabled(false)
        break
      case 'clipboard':
        this.clipboard.stopWatching()
        break
      case 'context':
        this.context.stopWatching()
        break
      case 'scheduler':
        this.scheduler.stop()
        break
    }

    console.log(`❌ Feature "${feature}" disabled`)
  }

  /**
   * Get AI-powered suggestions based on context
   */
  async getSuggestions(): Promise<string[]> {
    const currentContext = this.context.getCurrentContext()

    if (!currentContext) {
      return ['No context available yet']
    }

    // Context-based suggestions are already in the context object
    return currentContext.suggestions
  }

  /**
   * Cleanup everything
   */
  shutdown() {
    console.log('🛑 Shutting down Master File Manager...')

    this.stopProactiveMode()

    console.log('✅ Shutdown complete')
  }
}

/**
 * Create master file manager
 */
export function createMasterFileManager(config: MasterConfig): MasterFileManager {
  return new MasterFileManager(config)
}
