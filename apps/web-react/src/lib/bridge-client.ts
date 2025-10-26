/**
 * Bridge Client for Backend Communication
 *
 * Connects the React frontend with the Node.js backend (http://localhost:3337)
 */

const BACKEND_URL = 'http://localhost:3337'

interface StoryState {
  epoch: string
  arc: string
  mood: string
  resources?: Record<string, number>
  companions?: Array<{ name: string } | string>
  buffs?: Array<{ name: string } | string>
  options?: Array<{
    id: string
    label: string
    rationale?: string
    expected?: Record<string, number>
  }>
}

interface StoryEvents {
  events: Array<{
    id: number
    timestamp: string
    type: string
    label?: string
    description?: string
    effects?: Record<string, number>
  }>
}

class BridgeClient {
  private baseUrl: string

  constructor(baseUrl: string = BACKEND_URL) {
    this.baseUrl = baseUrl
  }

  /**
   * Get current story state
   */
  async getStoryState(): Promise<StoryState> {
    try {
      const response = await fetch(`${this.baseUrl}/story/state`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch story state:', error)
      // Return default state if backend is unavailable
      return {
        epoch: 'Modern Era',
        arc: 'Das Erwachen',
        mood: 'Eine neue Reise beginnt...',
        resources: {
          level: 1,
          erfahrung: 0,
          mut: 5,
          wissen: 5,
          bewusstsein: 5,
          stabilitaet: 5,
          inspiration: 5
        },
        companions: [],
        buffs: [],
        options: []
      }
    }
  }

  /**
   * Get recent story events
   */
  async getStoryEvents(limit: number = 10): Promise<StoryEvents> {
    try {
      const response = await fetch(`${this.baseUrl}/story/events?limit=${limit}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch story events:', error)
      return { events: [] }
    }
  }

  /**
   * Choose a story option
   */
  async chooseStoryOption(optionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/story/choose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ option: optionId })
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to choose story option:', error)
      throw error
    }
  }

  /**
   * Refresh story options (generate new ones)
   */
  async refreshStoryOptions(force: boolean = false): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/story/refresh${force ? '?force=true' : ''}`, {
        method: 'POST'
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to refresh story options:', error)
      throw error
    }
  }

  /**
   * Check if backend is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, { method: 'GET' })
      return response.ok
    } catch (error) {
      return false
    }
  }
}

export const bridgeClient = new BridgeClient()
