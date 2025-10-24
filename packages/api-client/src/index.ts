// ============================================
// Types
// ============================================

export interface StoryState {
  epoch: number
  mood: string
  arc: 'foundations' | 'exploration' | 'mastery'
  resources: {
    energie: number
    wissen: number
    inspiration: number
    ruf: number
    stabilitaet: number
    erfahrung: number
    level: number
  }
  options: StoryOption[]
  companions: any[]
  buffs: any[]
  skills: any[]
}

export interface StoryOption {
  id: string
  label: string
  rationale?: string
  risk: number
  expected?: Record<string, number>
  tags: string[]
  expiresAt?: number
}

export interface StoryEvent {
  id: string
  timestamp: number
  type: string
  description: string
  label: string
  status: string
  effects?: Record<string, number>
}

export interface StoryStats {
  epoch: number
  arc: string
  level: number
  xp: number
  options: number
}

export interface BridgeToolSchema {
  type?: string | string[]
  description?: string
  enum?: unknown[]
  default?: unknown
  format?: string
  properties?: Record<string, BridgeToolSchema>
  required?: string[]
  items?: BridgeToolSchema | BridgeToolSchema[]
  anyOf?: BridgeToolSchema[]
  oneOf?: BridgeToolSchema[]
  allOf?: BridgeToolSchema[]
  additionalProperties?: boolean | BridgeToolSchema
}

export interface BridgeTool {
  name: string
  description?: string
  inputSchema?: BridgeToolSchema
}

// ============================================
// Utility Functions
// ============================================

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const normalizeSchema = (schema: unknown): BridgeToolSchema | undefined => {
  if (!isRecord(schema)) return undefined

  const normalized: BridgeToolSchema = {}

  Object.keys(schema).forEach((key) => {
    switch (key) {
      case 'type':
        if (typeof schema[key] === 'string' || Array.isArray(schema[key])) {
          normalized.type = schema[key]
        }
        break
      case 'description':
        if (typeof schema[key] === 'string') {
          normalized.description = schema[key]
        }
        break
      case 'enum':
        if (Array.isArray(schema[key])) {
          normalized.enum = schema[key]
        }
        break
      case 'default':
        normalized.default = schema[key]
        break
      case 'format':
        if (typeof schema[key] === 'string') {
          normalized.format = schema[key]
        }
        break
      case 'required':
        if (Array.isArray(schema[key])) {
          normalized.required = schema[key].filter((item): item is string => typeof item === 'string')
        }
        break
      case 'properties':
        if (isRecord(schema[key])) {
          const properties: Record<string, BridgeToolSchema> = {}
          Object.entries(schema[key]).forEach(([propertyKey, propertyValue]) => {
            const normalizedChild = normalizeSchema(propertyValue)
            if (normalizedChild) {
              properties[propertyKey] = normalizedChild
            }
          })
          if (Object.keys(properties).length > 0) {
            normalized.properties = properties
          }
        }
        break
      case 'items':
        if (Array.isArray(schema[key])) {
          const normalizedItems = schema[key].map((item) => normalizeSchema(item)).filter((item): item is BridgeToolSchema => Boolean(item))
          if (normalizedItems.length > 0) {
            normalized.items = normalizedItems
          }
        } else {
          const normalizedItem = normalizeSchema(schema[key])
          if (normalizedItem) {
            normalized.items = normalizedItem
          }
        }
        break
      case 'anyOf':
      case 'oneOf':
      case 'allOf':
        if (Array.isArray(schema[key])) {
          const normalizedArray = schema[key].map((entry) => normalizeSchema(entry)).filter((entry): entry is BridgeToolSchema => Boolean(entry))
          if (normalizedArray.length > 0) {
            normalized[key] = normalizedArray
          }
        }
        break
      case 'additionalProperties':
        if (typeof schema[key] === 'boolean') {
          normalized.additionalProperties = schema[key]
        } else {
          const additionalProps = normalizeSchema(schema[key])
          if (additionalProps) {
            normalized.additionalProperties = additionalProps
          }
        }
        break
    }
  })

  return normalized
}

const normalizeTool = (raw: unknown): BridgeTool | null => {
  if (!isRecord(raw)) return null

  const name = typeof raw.name === 'string' ? raw.name : undefined
  if (!name) return null

  const description = typeof raw.description === 'string' ? raw.description : undefined
  const inputSchema = normalizeSchema(raw.inputSchema)

  return {
    name,
    description,
    ...(inputSchema ? { inputSchema } : {})
  }
}

// ============================================
// Bridge API Client
// ============================================

export class BridgeClient {
  private baseUrl: string
  private mcpUrl: string

  constructor(baseUrl = 'http://localhost:3337') {
    this.baseUrl = baseUrl
    this.mcpUrl = `${baseUrl}/mcp`
  }

  async health(): Promise<{ status: string; tools: number }> {
    const res = await fetch(`${this.baseUrl}/health`)
    return res.json()
  }

  async stats(): Promise<{
    memory: number
    actions: number
    people: number
    tools: number
    soul: any
    story: StoryStats
  }> {
    const res = await fetch(`${this.baseUrl}/stats`)
    return res.json()
  }

  private async callTool(name: string, args: any = {}): Promise<any> {
    const res = await fetch(this.mcpUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: { name, arguments: args },
        id: Date.now()
      })
    })

    const data = await res.json()

    if (data.error) {
      throw new Error(data.error.message || 'MCP tool call failed')
    }

    if (data.result?.content?.[0]?.text) {
      try {
        return JSON.parse(data.result.content[0].text)
      } catch {
        return data.result.content[0].text
      }
    }

    return data.result
  }

  // Story Engine Methods
  async getStoryState(): Promise<StoryState> {
    return this.callTool('story_state')
  }

  async getStoryEvents(limit = 10): Promise<{ events: StoryEvent[]; total: number }> {
    return this.callTool('story_events', { limit })
  }

  async chooseStoryOption(optionId: string): Promise<any> {
    return this.callTool('story_choose', { option_id: optionId })
  }

  async refreshStoryOptions(force = false): Promise<any> {
    return this.callTool('story_refresh', { force })
  }

  async getPersonStory(personId: string): Promise<any> {
    return this.callTool('story_person', { personId })
  }

  async listTools(): Promise<BridgeTool[]> {
    const res = await fetch(`${this.baseUrl}/tools`)

    if (!res.ok) {
      throw new Error('Failed to load tools')
    }

    const data = await res.json()
    if (!isRecord(data) || !Array.isArray(data.tools)) {
      return []
    }

    return data.tools.map(normalizeTool).filter((tool): tool is BridgeTool => Boolean(tool))
  }

  // Memory Methods
  async searchMemory(query: string, limit = 10): Promise<any> {
    return this.callTool('memory_search', { query, limit })
  }

  async addMemory(text: string, tags: string[] = []): Promise<any> {
    return this.callTool('memory_add', { text, tags })
  }

  // People Methods
  async searchContacts(query: string): Promise<any> {
    return this.callTool('contact_search', { query })
  }

  async addContact(data: any): Promise<any> {
    return this.callTool('contact_add', data)
  }

  async updateContact(id: string, updates: any): Promise<any> {
    return this.callTool('contact_update', { id, updates })
  }

  async logInteraction(personId: string, data: any): Promise<any> {
    return this.callTool('interaction_log', { person_id: personId, ...data })
  }

  // Soul Methods
  async getSoulState(): Promise<any> {
    return this.callTool('soul_state')
  }

  async logSoulEvent(data: any): Promise<any> {
    return this.callTool('soul_event', data)
  }

  // AI Methods
  async generate(prompt: string, context?: any): Promise<any> {
    return this.callTool('generate', { prompt, context })
  }

  // Actions Methods
  async triggerAction(actionId: string, params?: any): Promise<any> {
    return this.callTool('trigger_action', { action_id: actionId, params })
  }
}

// ============================================
// Singleton Instance
// ============================================

export const bridgeClient = new BridgeClient()

// ============================================
// WebSocket Client (for React real-time updates)
// ============================================

export class BridgeWebSocket {
  private ws: WebSocket | null = null
  private listeners: Map<string, Set<(data: any) => void>> = new Map()
  private reconnectTimer: any = null
  private url: string

  constructor(url = 'ws://localhost:3337/ws') {
    this.url = url
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return

    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      console.log('🔌 Bridge WebSocket connected')
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = null
      }
    }

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        const listeners = this.listeners.get(message.type)
        if (listeners) {
          listeners.forEach((fn) => fn(message.data))
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err)
      }
    }

    this.ws.onclose = () => {
      console.log('🔌 Bridge WebSocket disconnected')
      // Auto-reconnect after 3 seconds
      this.reconnectTimer = setTimeout(() => this.connect(), 3000)
    }

    this.ws.onerror = (err) => {
      console.error('WebSocket error:', err)
    }
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.ws?.close()
  }

  on(eventType: string, callback: (data: any) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }
    this.listeners.get(eventType)!.add(callback)

    // Return unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(callback)
    }
  }

  emit(eventType: string, data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: eventType, data }))
    }
  }
}

// ============================================
// React Hooks (optional, for React apps)
// ============================================

export const createBridgeHooks = () => {
  // These will be implemented in the React app
  // using react-query or SWR
  return {
    useStoryState: () => {},
    useStoryEvents: () => {},
    useStoryOptions: () => {},
    useSoulState: () => {},
    useContacts: () => {}
  }
}