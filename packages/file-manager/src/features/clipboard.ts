/**
 * Clipboard Manager
 * Tracks clipboard history and provides intelligent search
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import Groq from 'groq-sdk'

const execAsync = promisify(exec)

export interface ClipboardEntry {
  id: string
  content: string
  type: 'text' | 'image' | 'file' | 'unknown'
  timestamp: Date
  source?: string
  category?: string
  tags?: string[]
}

/**
 * Clipboard Manager
 */
export class ClipboardManager {
  private history: ClipboardEntry[] = []
  private maxHistory: number = 100
  private watching: boolean = false
  private watchInterval?: NodeJS.Timeout
  private lastContent: string = ''
  private groq?: Groq

  constructor(groqApiKey?: string) {
    if (groqApiKey) {
      this.groq = new Groq({ apiKey: groqApiKey })
    }
  }

  /**
   * Start watching clipboard
   */
  startWatching(intervalMs: number = 1000): void {
    if (this.watching) {
      console.log('⚠️  Already watching clipboard')
      return
    }

    console.log('👀 Started watching clipboard')
    this.watching = true

    this.watchInterval = setInterval(async () => {
      await this.checkClipboard()
    }, intervalMs)
  }

  /**
   * Stop watching clipboard
   */
  stopWatching(): void {
    if (!this.watching) {
      console.log('⚠️  Not watching clipboard')
      return
    }

    if (this.watchInterval) {
      clearInterval(this.watchInterval)
    }

    this.watching = false
    console.log('👋 Stopped watching clipboard')
  }

  /**
   * Check clipboard for new content
   */
  private async checkClipboard(): Promise<void> {
    try {
      // Read clipboard using PowerShell
      const { stdout } = await execAsync(
        'powershell -command "Get-Clipboard"',
        { timeout: 2000 }
      )

      const content = stdout.trim()

      // Check if content changed
      if (content && content !== this.lastContent) {
        this.lastContent = content

        // Add to history
        await this.addEntry(content)
      }
    } catch (error) {
      // Silently fail (clipboard might be busy)
    }
  }

  /**
   * Add clipboard entry
   */
  private async addEntry(content: string): Promise<void> {
    const entry: ClipboardEntry = {
      id: `clip_${Date.now()}`,
      content,
      type: this.detectType(content),
      timestamp: new Date(),
    }

    // Categorize with AI if available
    if (this.groq) {
      try {
        const category = await this.categorizeContent(content)
        entry.category = category.category
        entry.tags = category.tags
      } catch (error) {
        // Fallback to simple categorization
      }
    }

    this.history.push(entry)

    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(-this.maxHistory)
    }

    console.log(`📋 Clipboard: ${entry.type} (${content.substring(0, 50)}...)`)
  }

  /**
   * Detect content type
   */
  private detectType(content: string): ClipboardEntry['type'] {
    // Check if file path
    if (content.match(/^[A-Z]:\\.+/)) {
      return 'file'
    }

    // Check if URL
    if (content.match(/^https?:\/\//)) {
      return 'text'
    }

    // Check if image data
    if (content.startsWith('data:image')) {
      return 'image'
    }

    return 'text'
  }

  /**
   * Categorize content with AI
   */
  private async categorizeContent(
    content: string
  ): Promise<{ category: string; tags: string[] }> {
    if (!this.groq) {
      return { category: 'General', tags: [] }
    }

    const prompt = `Categorize this clipboard content and extract tags.

Content:
${content.substring(0, 500)}

Return JSON:
{
  "category": "Code|Text|URL|Data|Command|Other",
  "tags": ["tag1", "tag2", "tag3"]
}

Keep tags short and relevant.`

    try {
      const response = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a content categorizer. Return only JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.2,
        max_tokens: 200,
      })

      const responseContent = response.choices[0]?.message?.content || '{}'
      const jsonMatch =
        responseContent.match(/```json\n?([\s\S]*?)\n?```/) ||
        responseContent.match(/\{[\s\S]*\}/)
      return JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : responseContent)
    } catch (error) {
      return { category: 'General', tags: [] }
    }
  }

  /**
   * Search clipboard history
   */
  search(query: string): ClipboardEntry[] {
    const lowerQuery = query.toLowerCase()

    return this.history.filter((entry) => {
      // Search in content
      if (entry.content.toLowerCase().includes(lowerQuery)) return true

      // Search in category
      if (entry.category?.toLowerCase().includes(lowerQuery)) return true

      // Search in tags
      if (entry.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)))
        return true

      return false
    })
  }

  /**
   * Get recent entries
   */
  getRecent(limit: number = 10): ClipboardEntry[] {
    return this.history.slice(-limit).reverse()
  }

  /**
   * Get entry by ID
   */
  getEntry(id: string): ClipboardEntry | undefined {
    return this.history.find((e) => e.id === id)
  }

  /**
   * Copy entry back to clipboard
   */
  async copyToClipboard(id: string): Promise<void> {
    const entry = this.getEntry(id)
    if (!entry) {
      throw new Error('Entry not found')
    }

    // Copy to clipboard using PowerShell
    await execAsync(
      `powershell -command "Set-Clipboard -Value '${entry.content.replace(/'/g, "''")}'"`
    )

    console.log(`📋 Copied to clipboard: ${entry.id}`)
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.history = []
    console.log('🗑️  Clipboard history cleared')
  }

  /**
   * Get statistics
   */
  getStats() {
    const totalEntries = this.history.length
    const byType = {
      text: this.history.filter((e) => e.type === 'text').length,
      file: this.history.filter((e) => e.type === 'file').length,
      image: this.history.filter((e) => e.type === 'image').length,
      unknown: this.history.filter((e) => e.type === 'unknown').length,
    }

    const categories = new Set(this.history.map((e) => e.category).filter(Boolean))

    return {
      totalEntries,
      byType,
      categories: categories.size,
      watching: this.watching,
    }
  }
}

/**
 * Create clipboard manager
 */
export function createClipboardManager(groqApiKey?: string): ClipboardManager {
  return new ClipboardManager(groqApiKey)
}
