// Bridge Service Types

export interface BridgeConfig {
  port?: number
  database?: string
  groqApiKey?: string
  ollamaHost?: string
}

export interface MCPTool {
  name: string
  description: string
  inputSchema: any
  handler: (args: any) => Promise<any>
}

export interface MemoryChunk {
  id: string
  text: string
  embedding?: Float32Array
  metadata?: Record<string, any>
  source?: string
  created_at: number
  updated_at: number
}

export interface Action {
  id: string
  name: string
  type: string
  config?: Record<string, any>
  enabled: boolean
  last_run?: number
  created_at: number
}

export interface SearchResult {
  chunk: MemoryChunk
  score: number
}

export interface MCPServerConfig {
  port: number
  name: string
  version: string
}
