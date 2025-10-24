/**
 * Idle Progression System
 *
 * Handles passive XP gain, resource collection, and background progression
 * even when the user is not actively playing.
 */

interface IdleProgress {
  lastActiveTimestamp: number
  totalIdleTime: number
  xpGained: number
  resourcesGained: Record<string, number>
  eventsTriggered: string[]
}

interface IdleConfig {
  xpPerMinute: number
  maxIdleHours: number
  resourceRates: Record<string, number> // resources per minute
  enableAutoQuests: boolean
}

const DEFAULT_CONFIG: IdleConfig = {
  xpPerMinute: 2, // 2 XP per minute idle
  maxIdleHours: 24, // Max 24 hours of idle time counted
  resourceRates: {
    energie: 0.5,
    inspiration: 0.3,
    stabilitaet: 0.2
  },
  enableAutoQuests: false
}

class IdleProgressionManager {
  private config: IdleConfig

  constructor(config: Partial<IdleConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Calculate idle progress since last active timestamp
   */
  calculateIdleProgress(lastActiveTimestamp: number): IdleProgress {
    const now = Date.now()
    const idleTimeMs = now - lastActiveTimestamp
    const idleTimeMinutes = Math.min(
      idleTimeMs / (1000 * 60),
      this.config.maxIdleHours * 60
    )

    // Calculate XP gained
    const xpGained = Math.floor(idleTimeMinutes * this.config.xpPerMinute)

    // Calculate resources gained
    const resourcesGained: Record<string, number> = {}
    Object.entries(this.config.resourceRates).forEach(([resource, rate]) => {
      resourcesGained[resource] = Math.floor(idleTimeMinutes * rate)
    })

    // Generate idle events
    const eventsTriggered: string[] = []

    if (idleTimeMinutes > 60) {
      eventsTriggered.push('long_idle')
    }

    if (idleTimeMinutes > 360) { // 6 hours
      eventsTriggered.push('very_long_idle')
    }

    if (xpGained >= 100) {
      eventsTriggered.push('idle_level_up')
    }

    return {
      lastActiveTimestamp,
      totalIdleTime: idleTimeMinutes,
      xpGained,
      resourcesGained,
      eventsTriggered
    }
  }

  /**
   * Format idle time for display
   */
  formatIdleTime(minutes: number): string {
    if (minutes < 60) {
      return `${Math.floor(minutes)} Minuten`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = Math.floor(minutes % 60)

    if (hours < 24) {
      return `${hours}h ${remainingMinutes}m`
    }

    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    return `${days}d ${remainingHours}h`
  }

  /**
   * Generate welcome back message
   */
  generateWelcomeBackMessage(progress: IdleProgress): string {
    const timeStr = this.formatIdleTime(progress.totalIdleTime)

    if (progress.totalIdleTime < 5) {
      return 'Willkommen zurück!'
    }

    if (progress.totalIdleTime < 60) {
      return `Willkommen zurück! Du warst ${timeStr} weg und hast ${progress.xpGained} XP gesammelt.`
    }

    return `Willkommen zurück, Wanderer! Während deiner ${timeStr} Abwesenheit hat sich viel getan...`
  }

  /**
   * Get idle rewards summary
   */
  getIdleRewardsSummary(progress: IdleProgress): {
    title: string
    items: Array<{ icon: string; text: string; value: number | string }>
  } {
    const items = []

    if (progress.xpGained > 0) {
      items.push({
        icon: '⚡',
        text: 'XP gesammelt',
        value: `+${progress.xpGained}`
      })
    }

    Object.entries(progress.resourcesGained).forEach(([resource, amount]) => {
      if (amount > 0) {
        const icons: Record<string, string> = {
          energie: '💪',
          inspiration: '💡',
          stabilitaet: '🕊️'
        }

        items.push({
          icon: icons[resource] || '📦',
          text: resource.charAt(0).toUpperCase() + resource.slice(1),
          value: `+${amount}`
        })
      }
    })

    return {
      title: 'Idle Belohnungen',
      items
    }
  }
}

// Singleton instance
export const idleManager = new IdleProgressionManager()

// LocalStorage helpers
const STORAGE_KEY = 'toobix_last_active'

export function saveLastActiveTime(): void {
  localStorage.setItem(STORAGE_KEY, Date.now().toString())
}

export function getLastActiveTime(): number {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? parseInt(stored, 10) : Date.now()
}

export function calculateIdleRewards(): IdleProgress | null {
  const lastActive = getLastActiveTime()
  const idleTimeMinutes = (Date.now() - lastActive) / (1000 * 60)

  // Only show idle rewards if away for more than 5 minutes
  if (idleTimeMinutes < 5) {
    return null
  }

  return idleManager.calculateIdleProgress(lastActive)
}

export function clearIdleProgress(): void {
  saveLastActiveTime()
}
