#!/usr/bin/env bun
/**
 * 🌉 Bridge Service - MCP Tool Bridge for Toobix Unified
 * 
 * Integrates Echo-Bridge functionality from Version_8:
 * - MCP Server on port 3337
 * - Memory/RAG tools
 * - Action system
 * - AI integrations (Groq/Ollama)
 */

import { Database } from 'bun:sqlite'
import { MCPServer } from './mcp/server.ts'
import { MemoryService } from './memory/service.ts'
import { ActionsService } from './actions/service.ts'
import { GroqService } from './ai/groq.ts'
import { SoulService } from '../../soul/src/index.ts'
import type { BridgeConfig } from './types.ts'

export class BridgeService {
  private mcp: MCPServer
  private db: Database
  private memory: MemoryService
  private actions: ActionsService
  private ai: GroqService
  private soul: SoulService
  private config: BridgeConfig

  constructor(config: BridgeConfig) {
    this.config = config
    const dbPath = config.database || './data/toobix-unified.db'
    
    console.log(`📁 Opening database: ${dbPath}`)
    this.db = new Database(dbPath)
    
    // Initialize services
    this.memory = new MemoryService(this.db)
    this.actions = new ActionsService(this.db)
    this.ai = new GroqService(config.groqApiKey || process.env.GROQ_API_KEY || '')
    this.soul = new SoulService(this.db)
    
    // Initialize MCP server
    this.mcp = new MCPServer({
      port: config.port || 3337,
      name: 'toobix-bridge',
      version: '0.1.0'
    })
  }

  async start() {
    console.log('🌉 Bridge Service starting...\n')
    
    // Initialize database tables
    await this.initializeTables()
    
    // Load MCP tools
    await this.loadTools()
    
    // Setup routes
    this.setupRoutes()
    
    // Start MCP server
    await this.mcp.start()
    
    console.log(`✅ Bridge Service running on http://localhost:${this.config.port || 3337}`)
    console.log('\n🔧 MCP Tools loaded:')
    console.log('   - memory_search    : RAG search in knowledge base')
    console.log('   - memory_add       : Add new memory chunk')
    console.log('   - generate         : AI text generation (Groq)')
    console.log('   - embed            : Generate embeddings (Ollama)')
    console.log('   - trigger_action   : Execute action')
    console.log('   - read_file        : Read workspace file')
    console.log('   - write_file       : Write workspace file')
    console.log('\n💡 Press Ctrl+C to stop\n')
  }

  private async initializeTables() {
    // Memory/Chunks table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS memory_chunks (
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        embedding BLOB,
        metadata TEXT,
        source TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `)
    
    // Actions table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS actions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        config TEXT,
        enabled INTEGER DEFAULT 1,
        last_run INTEGER,
        created_at INTEGER NOT NULL
      )
    `)
    
    console.log('✅ Database tables initialized')
  }

  private async loadTools() {
    // Memory tools
    this.mcp.registerTool({
      name: 'memory_search',
      description: 'Search in knowledge base using RAG',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          limit: { type: 'number', description: 'Max results', default: 5 }
        },
        required: ['query']
      },
      handler: async (args: any) => {
        return await this.memory.search(args.query, args.limit || 5)
      }
    })

    this.mcp.registerTool({
      name: 'memory_add',
      description: 'Add new memory to knowledge base',
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'Content to remember' },
          metadata: { type: 'object', description: 'Optional metadata' }
        },
        required: ['text']
      },
      handler: async (args: any) => {
        return await this.memory.add(args.text, args.metadata)
      }
    })

    // AI tools
    this.mcp.registerTool({
      name: 'generate',
      description: 'Generate text using Groq AI',
      inputSchema: {
        type: 'object',
        properties: {
          prompt: { type: 'string', description: 'Generation prompt' },
          context: { type: 'array', items: { type: 'string' }, description: 'Context messages' }
        },
        required: ['prompt']
      },
      handler: async (args: any) => {
        return await this.ai.generate(args.prompt, args.context)
      }
    })

    // Action tools
    this.mcp.registerTool({
      name: 'trigger_action',
      description: 'Execute a registered action',
      inputSchema: {
        type: 'object',
        properties: {
          actionId: { type: 'string', description: 'Action ID' },
          params: { type: 'object', description: 'Action parameters' }
        },
        required: ['actionId']
      },
      handler: async (args: any) => {
        return await this.actions.trigger(args.actionId, args.params)
      }
    })

    // Soul tools
    this.mcp.registerTool({
      name: 'soul_state',
      description: 'Get current soul state (emotions, values, personality)',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      handler: async () => {
        return this.soul.getState()
      }
    })

    this.mcp.registerTool({
      name: 'soul_event',
      description: 'Process a soul event (experience, interaction, reflection)',
      inputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['experience', 'interaction', 'reflection', 'challenge'] },
          description: { type: 'string', description: 'Event description' },
          emotionalImpact: { type: 'object', description: 'Emotional changes (joy: +10, etc)' },
          valueImpact: { type: 'object', description: 'Value alignment changes' }
        },
        required: ['type', 'description']
      },
      handler: async (args: any) => {
        this.soul.processEvent(args)
        return { success: true, summary: this.soul.getSummary() }
      }
    })

    console.log('✅ MCP tools registered')
  }

  private setupRoutes() {
    // Health check endpoint
    this.mcp.registerRoute('GET', '/health', async () => {
      return {
        status: 'ok',
        service: 'bridge',
        mcp: true,
        database: this.db.filename,
        tools: this.mcp.getToolCount()
      }
    })

    // Stats endpoint
    this.mcp.registerRoute('GET', '/stats', async () => {
      const memoryCount = this.db.query('SELECT COUNT(*) as count FROM memory_chunks').get() as any
      const actionsCount = this.db.query('SELECT COUNT(*) as count FROM actions').get() as any
      const soulState = this.soul.getState()
      
      return {
        memory: memoryCount?.count || 0,
        actions: actionsCount?.count || 0,
        tools: this.mcp.getToolCount(),
        soul: {
          experiences: soulState.experiences,
          wisdom: soulState.wisdom,
          mood: Math.round(soulState.emotional.mood),
          energy: Math.round(soulState.emotional.energy)
        }
      }
    })

    console.log('✅ Routes configured')
  }

  async stop() {
    await this.mcp.stop()
    this.soul.close()
    this.db.close()
    console.log('👋 Bridge Service stopped')
  }
}

// Start if run directly
if (import.meta.main) {
  const bridge = new BridgeService({
    port: parseInt(process.env.MCP_PORT || '3337'),
    database: 'data/toobix-unified.db',
    groqApiKey: process.env.GROQ_API_KEY
  })

  await bridge.start()

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n\n🛑 Shutting down...')
    await bridge.stop()
    process.exit(0)
  })
}

export default BridgeService
