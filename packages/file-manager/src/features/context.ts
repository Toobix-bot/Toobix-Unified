/**
 * Context Awareness
 * Understands what the user is doing and provides proactive help
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import Groq from 'groq-sdk'

const execAsync = promisify(exec)

export interface UserContext {
  timestamp: Date
  activeWindow: string
  activeProcess: string
  openApplications: string[]
  currentActivity: 'coding' | 'browsing' | 'writing' | 'idle' | 'unknown'
  mood: 'focused' | 'distracted' | 'exploring' | 'unknown'
  suggestions: string[]
}

export interface ContextHistory {
  entries: UserContext[]
  patterns: Map<string, number>
  commonActivities: string[]
}

/**
 * Context Awareness Manager
 */
export class ContextManager {
  private history: UserContext[] = []
  private maxHistory: number = 100
  private watching: boolean = false
  private watchInterval?: NodeJS.Timeout
  private groq?: Groq

  constructor(groqApiKey?: string) {
    if (groqApiKey) {
      this.groq = new Groq({ apiKey: groqApiKey })
    }
  }

  /**
   * Start watching user context
   */
  startWatching(intervalMs: number = 30000): void {
    // 30 seconds
    if (this.watching) {
      console.log('⚠️  Already watching context')
      return
    }

    console.log('👀 Started watching user context')
    this.watching = true

    this.watchInterval = setInterval(async () => {
      await this.captureContext()
    }, intervalMs)

    // Capture immediately
    this.captureContext()
  }

  /**
   * Stop watching
   */
  stopWatching(): void {
    if (!this.watching) {
      console.log('⚠️  Not watching context')
      return
    }

    if (this.watchInterval) {
      clearInterval(this.watchInterval)
    }

    this.watching = false
    console.log('👋 Stopped watching context')
  }

  /**
   * Capture current user context
   */
  async captureContext(): Promise<UserContext> {
    const context: UserContext = {
      timestamp: new Date(),
      activeWindow: await this.getActiveWindow(),
      activeProcess: await this.getActiveProcess(),
      openApplications: await this.getOpenApplications(),
      currentActivity: 'unknown',
      mood: 'unknown',
      suggestions: [],
    }

    // Infer activity from context
    context.currentActivity = this.inferActivity(context)
    context.mood = this.inferMood(context)

    // Generate suggestions with AI
    if (this.groq) {
      context.suggestions = await this.generateSuggestions(context)
    }

    // Add to history
    this.history.push(context)

    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(-this.maxHistory)
    }

    console.log(
      `🧠 Context: ${context.currentActivity} (${context.activeProcess})`
    )

    return context
  }

  /**
   * Get active window title (Windows)
   */
  private async getActiveWindow(): Promise<string> {
    try {
      const { stdout } = await execAsync(
        'powershell -command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SystemInformation]::ComputerName"',
        { timeout: 2000 }
      )
      return stdout.trim()
    } catch (error) {
      return 'Unknown'
    }
  }

  /**
   * Get active process name
   */
  private async getActiveProcess(): Promise<string> {
    try {
      const { stdout } = await execAsync(
        'powershell -command "Get-Process | Where-Object {$_.MainWindowTitle} | Select-Object -First 1 -ExpandProperty ProcessName"',
        { timeout: 2000 }
      )
      return stdout.trim() || 'Unknown'
    } catch (error) {
      return 'Unknown'
    }
  }

  /**
   * Get open applications
   */
  private async getOpenApplications(): Promise<string[]> {
    try {
      const { stdout } = await execAsync(
        'powershell -command "Get-Process | Where-Object {$_.MainWindowTitle} | Select-Object -ExpandProperty ProcessName"',
        { timeout: 3000 }
      )

      const processes = stdout
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean)

      return [...new Set(processes)] // Remove duplicates
    } catch (error) {
      return []
    }
  }

  /**
   * Infer activity from context
   */
  private inferActivity(context: UserContext): UserContext['currentActivity'] {
    const process = context.activeProcess.toLowerCase()

    // Coding
    if (
      process.includes('code') ||
      process.includes('vscode') ||
      process.includes('visual studio') ||
      process.includes('sublime') ||
      process.includes('atom')
    ) {
      return 'coding'
    }

    // Browsing
    if (
      process.includes('chrome') ||
      process.includes('firefox') ||
      process.includes('edge') ||
      process.includes('brave')
    ) {
      return 'browsing'
    }

    // Writing
    if (
      process.includes('word') ||
      process.includes('notepad') ||
      process.includes('onenote') ||
      process.includes('notion')
    ) {
      return 'writing'
    }

    // Idle (no significant apps)
    if (context.openApplications.length < 2) {
      return 'idle'
    }

    return 'unknown'
  }

  /**
   * Infer mood from context
   */
  private inferMood(context: UserContext): UserContext['mood'] {
    const apps = context.openApplications.map((a) => a.toLowerCase())

    // Focused: Only coding/work apps
    if (
      context.currentActivity === 'coding' &&
      !apps.some((a) => a.includes('discord') || a.includes('spotify'))
    ) {
      return 'focused'
    }

    // Distracted: Many apps open
    if (apps.length > 5) {
      return 'distracted'
    }

    // Exploring: Browser + other apps
    if (context.currentActivity === 'browsing' && apps.length > 2) {
      return 'exploring'
    }

    return 'unknown'
  }

  /**
   * Generate proactive suggestions with AI
   */
  private async generateSuggestions(context: UserContext): Promise<string[]> {
    if (!this.groq) return []

    const prompt = `Based on user context, suggest 2-3 helpful actions.

Current Activity: ${context.currentActivity}
Active App: ${context.activeProcess}
Mood: ${context.mood}
Open Apps: ${context.openApplications.slice(0, 5).join(', ')}

Recent patterns:
${this.getRecentPatterns()}

Suggest actions like:
- "Clean up Downloads folder (47 files)"
- "Close distracting apps for focus mode"
- "Organize Desktop (looks messy)"
- "Take a break (coding for 2 hours)"

Return JSON array of 2-3 strings:
["suggestion1", "suggestion2", "suggestion3"]`

    try {
      const response = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant. Return only JSON array.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.4,
        max_tokens: 300,
      })

      const content = response.choices[0]?.message?.content || '[]'
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\[[\s\S]*\]/)
      return JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : content)
    } catch (error) {
      return []
    }
  }

  /**
   * Get recent activity patterns
   */
  private getRecentPatterns(): string {
    const recent = this.history.slice(-10)
    const activities = recent.map((c) => c.currentActivity)
    const mostCommon = this.getMostCommon(activities)

    return `Most common: ${mostCommon} (${activities.filter((a) => a === mostCommon).length}/10)`
  }

  /**
   * Get most common value in array
   */
  private getMostCommon<T>(arr: T[]): T {
    const counts = new Map<T, number>()
    arr.forEach((item) => counts.set(item, (counts.get(item) || 0) + 1))

    let maxCount = 0
    let mostCommon = arr[0]

    counts.forEach((count, item) => {
      if (count > maxCount) {
        maxCount = count
        mostCommon = item
      }
    })

    return mostCommon
  }

  /**
   * Get current context
   */
  getCurrentContext(): UserContext | null {
    return this.history[this.history.length - 1] || null
  }

  /**
   * Get recent contexts
   */
  getRecentContexts(limit: number = 10): UserContext[] {
    return this.history.slice(-limit).reverse()
  }

  /**
   * Analyze patterns
   */
  analyzePatterns(): ContextHistory {
    const patterns = new Map<string, number>()

    this.history.forEach((context) => {
      const key = `${context.currentActivity}_${context.mood}`
      patterns.set(key, (patterns.get(key) || 0) + 1)
    })

    const commonActivities = Array.from(
      new Set(this.history.map((c) => c.currentActivity))
    )

    return {
      entries: this.history,
      patterns,
      commonActivities,
    }
  }

  /**
   * Get statistics
   */
  getStats() {
    const activities = this.history.map((c) => c.currentActivity)
    const moods = this.history.map((c) => c.mood)

    return {
      totalCaptures: this.history.length,
      mostCommonActivity: this.getMostCommon(activities),
      mostCommonMood: this.getMostCommon(moods),
      watching: this.watching,
    }
  }
}

/**
 * Create context manager
 */
export function createContextManager(groqApiKey?: string): ContextManager {
  return new ContextManager(groqApiKey)
}
