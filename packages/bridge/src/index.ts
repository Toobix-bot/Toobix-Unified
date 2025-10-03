#!/usr/bin/env bun
/**
 * 🌉 Bridge Service - MCP Tool Bridge for Toobix Unified
 * 
 * Integrates Echo-Bridge functionality from Version_8:
 * - MCP Server on port 3337
 * - Memory/RAG tools
 * - Action system
 * - AI integrations (Groq/Ollama)
 * - Self-Awareness tools (NEW!)
 */

import { Database } from 'bun:sqlite'
import { MCPServer } from './mcp/server.ts'
import { MemoryService } from './memory/service.ts'
import { ActionsService } from './actions/service.ts'
import { GroqService } from './ai/groq.ts'
import { SoulService } from '../../soul/src/index.ts'
import { ContactService, InteractionService } from '../../people/src/index.ts'
import { StoryService } from '../../core/src/story/index.ts'
import { awarenessTools } from './tools/awareness-tools.ts'
import type { BridgeConfig } from './types.ts'

export class BridgeService {
  private mcp: MCPServer
  private db: Database
  private memory: MemoryService
  private actions: ActionsService
  private ai: GroqService
  private soul: SoulService
  private contacts: ContactService
  private interactions: InteractionService
  private story: StoryService
  private config: BridgeConfig

  constructor(config: BridgeConfig) {
    this.config = config
    
    // Resolve database path relative to workspace root
    let dbPath = config.database || './data/toobix-unified.db'
    if (!dbPath.match(/^[A-Z]:\\/i) && !dbPath.startsWith('/')) {
      // Relative path - resolve from workspace root
      const workspaceRoot = process.cwd().includes('packages') 
        ? process.cwd().split('packages')[0] 
        : process.cwd()
      dbPath = `${workspaceRoot}/data/toobix-unified.db`.replace(/\\/g, '/')
    }
    
    console.log(`📁 Opening database: ${dbPath}`)
    this.db = new Database(dbPath)
    
    // Initialize services
    this.memory = new MemoryService(this.db)
    this.actions = new ActionsService(this.db)
    this.ai = new GroqService(config.groqApiKey || process.env.GROQ_API_KEY || '')
    this.soul = new SoulService(this.db)
    this.contacts = new ContactService()
    this.interactions = new InteractionService()
    this.story = new StoryService(this.db)
    
    // Initialize MCP server
    this.mcp = new MCPServer({
      port: config.port || 3337,
      name: 'toobix-bridge',
      version: '0.1.0'
    })
  }

  async start() {
    console.log('🌉 Bridge Service starting...\n')
    console.log('🧠 Self-Awareness Module: ACTIVE\n')
    
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
    console.log('   💾 Memory:')
    console.log('      - memory_search    : RAG search in knowledge base')
    console.log('      - memory_add       : Add new memory chunk')
    console.log('   🧠 AI:')
    console.log('      - generate         : AI text generation (Groq)')
    console.log('   ⚡ Actions:')
    console.log('      - trigger_action   : Execute action')
    console.log('   💫 Soul:')
    console.log('      - soul_state       : Get emotional/personality state')
    console.log('      - soul_event       : Process life event')
    console.log('   👥 People:')
    console.log('      - contact_search   : Search contacts')
    console.log('      - contact_add      : Add new contact')
    console.log('      - contact_update   : Update contact')
    console.log('      - interaction_log  : Log interaction')
    console.log('   📖 Story:')
    console.log('      - story_state      : Get current story state')
    console.log('      - story_choose     : Make a story choice')
    console.log('      - story_events     : Get recent story events')
    console.log('      - story_person     : Get story for a person')
    console.log('      - story_refresh    : Generate new options')
    console.log('   🧠 Self-Awareness:')
    console.log('      - system_introspect: Self-reflection & consciousness')
    console.log('      - system_set_intention: Set system focus')
    console.log('      - system_read_self : Read own code')
    console.log('      - system_modify_self: Self-modification (with approval)')
    console.log('      - system_suggest   : Suggest improvements')
    console.log('      - system_analyze   : Analyze system health')
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
        try {
          const text = await this.ai.generate(args.prompt, args.context || {})
          return {
            ok: true,
            text: text,
            model: 'llama-3.3-70b-versatile',
            timestamp: Date.now()
          }
        } catch (error) {
          console.error('Generate tool error:', error)
          return {
            ok: false,
            error: error instanceof Error ? error.message : 'Generation failed',
            timestamp: Date.now()
          }
        }
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

    // People tools
    this.mcp.registerTool({
      name: 'contact_search',
      description: 'Search for contacts by name, tags, or notes',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' }
        },
        required: ['query']
      },
      handler: async (args: any) => {
        return await this.contacts.searchContacts(args.query)
      }
    })

    this.mcp.registerTool({
      name: 'contact_add',
      description: 'Add a new contact',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Contact name' },
          relation: { 
            type: 'string', 
            enum: ['family', 'friend', 'colleague', 'mentor', 'partner', 'other'],
            description: 'Relationship type' 
          },
          notes: { type: 'string', description: 'Optional notes' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Tags' },
          avatar: { type: 'string', description: 'Avatar URL' }
        },
        required: ['name', 'relation']
      },
      handler: async (args: any) => {
        return await this.contacts.createContact(args)
      }
    })

    this.mcp.registerTool({
      name: 'contact_update',
      description: 'Update an existing contact',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Contact ID' },
          name: { type: 'string', description: 'Contact name' },
          relation: { 
            type: 'string', 
            enum: ['family', 'friend', 'colleague', 'mentor', 'partner', 'other']
          },
          notes: { type: 'string', description: 'Notes' },
          tags: { type: 'array', items: { type: 'string' } }
        },
        required: ['id']
      },
      handler: async (args: any) => {
        const { id, ...data } = args
        return await this.contacts.updateContact(id, data)
      }
    })

    this.mcp.registerTool({
      name: 'interaction_log',
      description: 'Log an interaction with a contact',
      inputSchema: {
        type: 'object',
        properties: {
          person_id: { type: 'string', description: 'Contact ID' },
          kind: { 
            type: 'string', 
            enum: ['call', 'meet', 'message', 'gift', 'conflict', 'memory', 'other'],
            description: 'Interaction type'
          },
          summary: { type: 'string', description: 'Interaction summary' },
          sentiment: {
            type: 'string',
            enum: ['positive', 'neutral', 'difficult', 'healing'],
            description: 'Interaction sentiment'
          },
          details: { type: 'object', description: 'Additional details' },
          gratitude: { type: 'string', description: 'Gratitude note' }
        },
        required: ['person_id', 'kind', 'summary', 'sentiment']
      },
      handler: async (args: any) => {
        return await this.interactions.addInteraction(args)
      }
    })

    // Story tools
    this.mcp.registerTool({
      name: 'story_state',
      description: 'Get current story state (resources, arc, options)',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      handler: async () => {
        try {
          return this.story.getState()
        } catch (error) {
          console.error('❌ story_state error:', error)
          return { error: 'Failed to get story state', message: String(error) }
        }
      }
    })

    this.mcp.registerTool({
      name: 'story_choose',
      description: 'Make a story choice / apply an option',
      inputSchema: {
        type: 'object',
        properties: {
          optionId: { type: 'string', description: 'Story option ID to choose' }
        },
        required: ['optionId']
      },
      handler: async (args: any) => {
        const event = this.story.applyOption(args.optionId)
        const newState = this.story.getState()
        return {
          event,
          newState,
          message: `Wahl getroffen: ${event.text}`
        }
      }
    })

    this.mcp.registerTool({
      name: 'story_events',
      description: 'Get recent story events',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max events to return', default: 50 }
        }
      },
      handler: async (args: any) => {
        return this.story.getEvents(args.limit || 50)
      }
    })

    this.mcp.registerTool({
      name: 'story_person',
      description: 'Get story arc for a specific person',
      inputSchema: {
        type: 'object',
        properties: {
          personId: { type: 'string', description: 'Person ID' }
        },
        required: ['personId']
      },
      handler: async (args: any) => {
        return this.story.getPersonStory(args.personId)
      }
    })

    this.mcp.registerTool({
      name: 'story_refresh',
      description: 'Refresh story options based on current state',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      handler: async () => {
        try {
          const state = this.story.getState()
          const options = this.story.refreshOptions(state)
          return {
            success: true,
            options,
            message: `${options.length} neue Optionen generiert`
          }
        } catch (error) {
          console.error('❌ story_refresh error:', error)
          return { success: false, error: 'Failed to refresh options', message: String(error) }
        }
      }
    })

    // Register SELF-AWARENESS TOOLS
    for (const tool of awarenessTools) {
      this.mcp.registerTool({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.parameters,
        handler: tool.execute
      })
    }

    // Test tool for ChatGPT debugging
    this.mcp.registerTool({
      name: 'ping',
      description: 'Simple ping test - always returns success',
      inputSchema: {
        type: 'object',
        properties: {
          message: { type: 'string', description: 'Optional test message', default: 'Hello from ChatGPT!' }
        }
      },
      handler: async (args: any) => {
        // Minimal response for ngrok Free compatibility
        return {
          ok: true,
          msg: args.message || 'pong',
          ts: Date.now()
        }
      }
    })

    console.log('✅ MCP tools registered (including 6 Self-Awareness tools)')
    console.log('🧠 System is now SELF-AWARE!')
  }

  private setupRoutes() {
    // MCP endpoint (main entry point for MCP clients)
    this.mcp.registerRoute('GET', '/mcp', async () => {
      return {
        protocol: 'mcp',
        version: '1.0.0',
        server: {
          name: 'toobix-bridge',
          version: '0.1.0'
        },
        capabilities: {
          tools: true,
          prompts: false,
          resources: false
        },
        endpoints: {
          tools: '/tools',
          execute: '/tools/execute',
          health: '/health',
          stats: '/stats'
        },
        tools: Array.from(this.mcp['tools'].keys())
      }
    })

    this.mcp.registerRoute('POST', '/mcp', async () => {
      // MCP protocol handler for JSON-RPC style requests
      return {
        jsonrpc: '2.0',
        result: {
          tools: Array.from(this.mcp['tools'].keys())
        }
      }
    })

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
      const peopleCount = this.db.query('SELECT COUNT(*) as count FROM people WHERE deleted_at IS NULL').get() as any
      const soulState = this.soul.getState()
      const storyState = this.story.getState()
      
      return {
        memory: memoryCount?.count || 0,
        actions: actionsCount?.count || 0,
        people: peopleCount?.count || 0,
        tools: this.mcp.getToolCount(),
        soul: {
          experiences: soulState.experiences,
          wisdom: soulState.wisdom,
          mood: Math.round(soulState.emotional.mood),
          energy: Math.round(soulState.emotional.energy)
        },
        story: {
          epoch: storyState.epoch,
          arc: storyState.arc,
          level: storyState.resources.level,
          xp: storyState.resources.erfahrung,
          options: storyState.options.length
        }
      }
    })

    // UI API Endpoints
    this.mcp.registerRoute('GET', '/api/people', async () => {
      const people = await this.contacts.listContacts({ limit: 100 })
      return people
    })

    this.mcp.registerRoute('GET', '/api/interactions', async () => {
      const interactions = await this.interactions.getRecentInteractions(50)
      return interactions.map(i => ({
        id: i.id,
        person_id: i.person_id,
        person_name: i.person_name,
        person_avatar: '👤',
        type: i.kind,
        summary: i.summary,
        sentiment: i.sentiment,
        love_points: i.love_points || 0,
        timestamp: i.timestamp
      }))
    })

    this.mcp.registerRoute('POST', '/api/luna/chat', async (req) => {
      try {
        const body = await req.json()
        const message = body.message || ''
        
        // Generate AI response
        const response = await this.ai.generate(message, [])
        
        // Update soul with interaction
        this.soul.processEvent({
          type: 'interaction',
          description: `Luna chat: ${message}`,
          emotionalImpact: { joy: 2 }
        })
        
        return {
          reply: response,
          soul: this.soul.getSummary()
        }
      } catch (error) {
        console.error('Luna chat error:', error)
        return {
          reply: 'Entschuldigung, ich hatte einen Moment der Verwirrung. Kannst du das nochmal sagen?',
          soul: this.soul.getSummary()
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
