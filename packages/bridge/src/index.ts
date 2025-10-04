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
import { initializeConsciousness, consciousnessTools } from './tools/consciousness-tools.ts'
// import { awarenessTools } from './tools/awareness-tools.ts' // TODO: Fix fastmcp dependency
import { AutonomousActionExecutor } from '../../consciousness/src/agent/autonomous-executor.ts'
import { LivingBeing, createLivingBeing } from '../../consciousness/src/living-being/index.ts'
import LoveEngineService from '../../love/src/service'
import PeaceCatalystService from '../../peace/src/service'
import type { BridgeConfig } from './types.ts'

// NEW: Architecture Systems (Phase 3)
import { conflictResolver } from '../../core/src/contracts/module-contracts.ts'
import { unifiedValues } from '../../core/src/values/unified-values.ts'
import { EventPipeline } from '../../core/src/pipeline/event-pipeline.ts'

// NEW: Performance Layer
import { apiCache, memoryCache, valuesCache, hashObject } from '../../core/src/performance/cache.ts'

// NEW: Security Layer (Week 1)
import { createRateLimitMiddleware, globalRateLimiter } from '../../core/src/security/rate-limiter.ts'
import { validateInput, memorySchemas, contractsSchemas, valuesSchemas, pipelineSchemas } from '../../core/src/security/input-validation.ts'

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
  private love: LoveEngineService
  private peace: PeaceCatalystService
  private autonomousExecutor: AutonomousActionExecutor
  private livingBeing: LivingBeing | null = null
  private config: BridgeConfig
  private pipeline: EventPipeline  // NEW: Event Pipeline

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
    
    // Initialize services WITH embeddings support
    const openaiKey = config.openaiApiKey || process.env.OPENAI_API_KEY
    this.memory = new MemoryService(this.db, openaiKey)  // Pass API key for vector search
    this.actions = new ActionsService(this.db)
    this.ai = new GroqService(config.groqApiKey || process.env.GROQ_API_KEY || '')
    this.soul = new SoulService(this.db)
    this.contacts = new ContactService()
    this.interactions = new InteractionService()
    this.story = new StoryService(this.db)
    this.love = new LoveEngineService(this.db)
    this.peace = new PeaceCatalystService(this.db)
    
    // NEW: Initialize Event Pipeline (Single Source of Truth)
    console.log('🔄 Initializing Event Pipeline...')
    this.pipeline = new EventPipeline(this.db, {
      ethics: {
        analyze: async (params: any) => {
          // TODO: Connect to real Ethics module
          const harmful = params.action?.toLowerCase().includes('harm') || 
                         params.action?.toLowerCase().includes('manipulate')
          return {
            isEthical: !harmful,
            score: harmful ? 20 : 85,
            reason: harmful ? 'Harmful action detected' : 'Action is ethical'
          }
        }
      },
      soul: {
        processEvent: async (event: any) => {
          await this.soul.processEvent(event)
        }
      },
      consciousness: {
        reflect: async (context: any) => {
          // TODO: Connect to real Consciousness module
          return {
            thought: `Reflecting on ${context.trigger}`,
            awarenessLevel: 75
          }
        }
      },
      story: {
        addEvent: async (event: any) => {
          // Story service stores event
          // TODO: Use real story.addEvent when available
          return { id: `evt_${Date.now()}`, ...event }
        }
      },
      memory: {
        add: async (text: string, metadata: any) => {
          return await this.memory.add(text, metadata)
        }
      }
    })
    
    // Initialize Autonomous Executor 🤖
    this.autonomousExecutor = new AutonomousActionExecutor(this.db)
    // DISABLED by default for safety - enable with autonomous_enable tool
    
    // Initialize Consciousness System 🧠
    console.log('🧠 Initializing Consciousness...')
    initializeConsciousness(this.db)
    
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
    console.log('   🤖 Autonomous Agent:')
    console.log('      - autonomous_enable  : Enable/disable autonomous actions')
    console.log('      - autonomous_decide  : Make autonomous decisions')
    console.log('      - autonomous_execute : Execute autonomous actions')
    console.log('      - autonomous_status  : Get autonomy statistics')
    console.log('   🌟 Living Being:')
    console.log('      - being_awaken       : Awaken as living being')
    console.log('      - being_state        : Get complete state (mind/soul/body/voice)')
    console.log('      - being_speak        : Outer voice (speak message)')
    console.log('      - being_think        : Access thoughts and consciousness')
    console.log('      - being_feel         : Access emotions and soul')
    console.log('      - being_sense        : Access senses and body')
    console.log('      - being_life_event   : Record life event')
    console.log('      - being_evolve       : Trigger evolution')
    console.log('   💝 Love Engine:')
    console.log('      - love_add_gratitude    : Add gratitude entry')
    console.log('      - love_add_kindness     : Log kindness act')
    console.log('      - love_get_score        : Get love score')
    console.log('      - love_get_relationships: Relationship strengths')
    console.log('      - love_recent_gratitude : Recent gratitude')
    console.log('   🕊️ Peace Catalyst:')
    console.log('      - peace_get_state       : Peace state (5 agents)')
    console.log('      - peace_calm_meditate   : Meditation')
    console.log('      - peace_calm_breathing  : Breathing exercise')
    console.log('      - peace_harmony_log_conflict : Log conflict')
    console.log('      - peace_harmony_resolve : Resolve conflict')
    console.log('      - peace_clarity_journal : Journal entry')
    console.log('      - peace_growth_learn    : Learn skill')
    console.log('      - peace_growth_milestone: Growth milestone')
    console.log('      - peace_purpose_value   : Define value')
    console.log('      - peace_purpose_intention: Set intention')
    console.log('      - peace_get_actions     : Recent actions')
    console.log('      - peace_get_conflicts   : Unresolved conflicts')
    console.log('\n� Security:')
    console.log('      - Rate limiting: 60 req/min per identifier')
    console.log('      - Input validation: All tools')
    console.log('      - Vector search: ' + (process.env.OPENAI_API_KEY ? 'ENABLED ✅' : 'DISABLED (set OPENAI_API_KEY)'))
    console.log('\n�💡 Press Ctrl+C to stop\n')
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
    // Memory tools (WITH VALIDATION)
    this.mcp.registerTool({
      name: 'memory_search',
      description: 'Search in knowledge base using RAG with hybrid vector+keyword search (cached for 10min)',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          limit: { type: 'number', description: 'Max results', default: 5 }
        },
        required: ['query']
      },
      handler: async (args: any) => {
        // Validate input
        const validation = validateInput(memorySchemas.search, args)
        if (!validation.success) {
          throw new Error(`Validation failed: ${validation.errors?.join(', ')}`)
        }

        // Check rate limit
        const rateLimitResult = globalRateLimiter.checkLimit('memory_search')
        if (!rateLimitResult.allowed) {
          throw new Error(`Rate limit exceeded. Retry after ${rateLimitResult.retryAfter}s`)
        }

        // Check cache first (10min TTL)
        const cacheKey = `search:${hashObject(validation.data)}`
        const cached = memoryCache.get(cacheKey)
        if (cached) {
          console.log('📦 Cache hit: memory_search')
          return cached
        }

        // Execute search (now with hybrid vector+keyword)
        const results = await this.memory.search(validation.data!.query, validation.data!.limit || 5)
        
        // Cache results
        memoryCache.set(cacheKey, results, 600000) // 10min TTL
        
        return results
      }
    })

    this.mcp.registerTool({
      name: 'memory_add',
      description: 'Add new memory to knowledge base (with embeddings if OPENAI_API_KEY set)',
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'Content to remember' },
          metadata: { type: 'object', description: 'Optional metadata' }
        },
        required: ['text']
      },
      handler: async (args: any) => {
        // Validate input
        const validation = validateInput(memorySchemas.add, args)
        if (!validation.success) {
          throw new Error(`Validation failed: ${validation.errors?.join(', ')}`)
        }

        // Check rate limit
        const rateLimitResult = globalRateLimiter.checkLimit('memory_add')
        if (!rateLimitResult.allowed) {
          throw new Error(`Rate limit exceeded. Retry after ${rateLimitResult.retryAfter}s`)
        }

        return await this.memory.add(validation.data!.text, validation.data?.metadata)
      }
    })

    this.mcp.registerTool({
      name: 'memory_stats',
      description: 'Get memory system statistics (total memories, chunks, vector search status)',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      handler: async () => {
        return await this.memory.getStats()
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

    // NEW: Architecture System Tools (Phase 3)
    this.mcp.registerTool({
      name: 'module_resolve_conflict',
      description: 'Resolve conflict between two modules using hierarchy (Ethics > Soul > Consciousness > Story > Memory)',
      inputSchema: {
        type: 'object',
        properties: {
          moduleA: { type: 'string', enum: ['ethics', 'soul', 'consciousness', 'story', 'memory'], description: 'First module' },
          moduleB: { type: 'string', enum: ['ethics', 'soul', 'consciousness', 'story', 'memory'], description: 'Second module' },
          type: { type: 'string', enum: ['ethical_dilemma', 'value_conflict', 'data_inconsistency', 'priority_conflict'], description: 'Conflict type' },
          context: { type: 'object', description: 'Conflict context' },
          description: { type: 'string', description: 'What is the conflict about?' }
        },
        required: ['moduleA', 'moduleB', 'type']
      },
      handler: async (args: any) => {
        return await conflictResolver.resolve(args)
      }
    })

    this.mcp.registerTool({
      name: 'values_get_state',
      description: 'Get current state of all 13 core values (5 ethical immutable + 8 personal/social mutable) - cached for 1min',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Limit number of values returned (default: all 13)' }
        }
      },
      handler: async (args: any) => {
        // Check cache first (1min TTL)
        const cacheKey = `values:${args.limit || 'all'}`
        const cached = valuesCache.get(cacheKey)
        if (cached) {
          console.log('📦 Cache hit: values_get_state')
          return cached
        }

        const values = args.limit 
          ? unifiedValues.getTopValues(args.limit)
          : unifiedValues.getAllValues()
        
        const result = {
          values,
          summary: unifiedValues.getSummary(),
          overallAlignment: unifiedValues.getOverallAlignment()
        }

        // Cache results
        valuesCache.set(cacheKey, result, 60000) // 1min TTL
        
        return result
      }
    })

    this.mcp.registerTool({
      name: 'values_resolve_conflict',
      description: 'Resolve conflict between two values using priority and mutability rules',
      inputSchema: {
        type: 'object',
        properties: {
          valueA: { type: 'string', description: 'First value ID (e.g., love, transparency, autonomy)' },
          valueB: { type: 'string', description: 'Second value ID' },
          context: { type: 'object', description: 'Conflict context' },
          severity: { type: 'string', enum: ['low', 'medium', 'high'], description: 'Conflict severity', default: 'medium' }
        },
        required: ['valueA', 'valueB']
      },
      handler: async (args: any) => {
        try {
          return await unifiedValues.resolveConflict(args)
        } catch (error) {
          return {
            ok: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            hint: 'Valid value IDs: do_no_harm, privacy, transparency, autonomy, fairness, growth, love, freedom, creativity, peace, trust, empathy, wisdom'
          }
        }
      }
    })

    this.mcp.registerTool({
      name: 'pipeline_process_event',
      description: 'Process event through unified 6-step pipeline (Validate → Ethics → Values → Reflect → Story → Memory). Preferred over soul_event for new integrations.',
      inputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string', description: 'Event type (experience, interaction, reflection, etc)' },
          action: { type: 'string', description: 'Action being performed' },
          description: { type: 'string', description: 'Event description' },
          source: { type: 'string', description: 'Event source module' },
          affectsValues: { type: 'array', items: { type: 'string' }, description: 'Values affected by this event' },
          valueUpdates: { type: 'array', items: { type: 'object' }, description: 'Value updates (id, change)' },
          requiresReflection: { type: 'boolean', description: 'Needs consciousness reflection?', default: true },
          requiresEthicsCheck: { type: 'boolean', description: 'Needs ethics analysis?', default: true },
          context: { type: 'object', description: 'Additional context' }
        },
        required: ['type', 'action', 'description', 'source']
      },
      handler: async (args: any) => {
        return await this.pipeline.processEvent(args)
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

    // Love Engine tools
    this.mcp.registerTool({
      name: 'love_add_gratitude',
      description: 'Add gratitude journal entry',
      inputSchema: {
        type: 'object',
        properties: {
          content: { type: 'string' },
          category: { type: 'string', enum: ['person', 'moment', 'achievement', 'nature', 'other'] },
          intensity: { type: 'number', minimum: 1, maximum: 10 },
          personId: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } }
        },
        required: ['content', 'category', 'intensity']
      },
      handler: async (args: any) => this.love.addGratitude(args)
    })

    this.mcp.registerTool({
      name: 'love_add_kindness',
      description: 'Log act of kindness',
      inputSchema: {
        type: 'object',
        properties: {
          description: { type: 'string' },
          type: { type: 'string', enum: ['given', 'received'] },
          category: { type: 'string', enum: ['help', 'gift', 'time', 'words', 'presence'] },
          personId: { type: 'string' }
        },
        required: ['description', 'type', 'category']
      },
      handler: async (args: any) => this.love.addKindness(args)
    })

    this.mcp.registerTool({
      name: 'love_get_score',
      description: 'Get love score and statistics',
      inputSchema: { type: 'object', properties: {} },
      handler: async () => this.love.getLoveScore()
    })

    this.mcp.registerTool({
      name: 'love_get_relationships',
      description: 'Get relationship strength metrics',
      inputSchema: { type: 'object', properties: {} },
      handler: async () => this.love.getRelationshipStrengths()
    })

    this.mcp.registerTool({
      name: 'love_recent_gratitude',
      description: 'Get recent gratitude entries',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', default: 20, minimum: 1, maximum: 100 }
        }
      },
      handler: async (args: any) => this.love.getRecentGratitude(args.limit || 20)
    })

    // Peace Catalyst tools
    this.mcp.registerTool({
      name: 'peace_get_state',
      description: 'Get peace state across all 5 agents',
      inputSchema: { type: 'object', properties: {} },
      handler: async () => this.peace.getPeaceState()
    })

    this.mcp.registerTool({
      name: 'peace_calm_meditate',
      description: 'Log meditation',
      inputSchema: {
        type: 'object',
        properties: {
          duration: { type: 'number', minimum: 1 }
        },
        required: ['duration']
      },
      handler: async (args: any) => this.peace.calmAgent.meditate(args.duration)
    })

    this.mcp.registerTool({
      name: 'peace_calm_breathing',
      description: 'Log breathing exercise',
      inputSchema: { type: 'object', properties: {} },
      handler: async () => this.peace.calmAgent.breathingExercise()
    })

    this.mcp.registerTool({
      name: 'peace_harmony_log_conflict',
      description: 'Log conflict',
      inputSchema: {
        type: 'object',
        properties: {
          description: { type: 'string' },
          personId: { type: 'string' },
          severity: { type: 'number', minimum: 1, maximum: 10 }
        },
        required: ['description']
      },
      handler: async (args: any) => this.peace.harmonyAgent.logConflict(args.description, args.personId, args.severity || 5)
    })

    this.mcp.registerTool({
      name: 'peace_harmony_resolve',
      description: 'Resolve conflict',
      inputSchema: {
        type: 'object',
        properties: {
          conflictId: { type: 'string' },
          resolutionNotes: { type: 'string' }
        },
        required: ['conflictId', 'resolutionNotes']
      },
      handler: async (args: any) => this.peace.harmonyAgent.resolveConflict(args.conflictId, args.resolutionNotes)
    })

    this.mcp.registerTool({
      name: 'peace_clarity_journal',
      description: 'Log journal entry',
      inputSchema: {
        type: 'object',
        properties: {
          entry: { type: 'string' },
          wordCount: { type: 'number' }
        },
        required: ['entry', 'wordCount']
      },
      handler: async (args: any) => this.peace.clarityAgent.journal(args.entry, args.wordCount)
    })

    this.mcp.registerTool({
      name: 'peace_growth_learn',
      description: 'Log skill learning',
      inputSchema: {
        type: 'object',
        properties: {
          skill: { type: 'string' },
          hoursSpent: { type: 'number' }
        },
        required: ['skill', 'hoursSpent']
      },
      handler: async (args: any) => this.peace.growthAgent.learnSkill(args.skill, args.hoursSpent)
    })

    this.mcp.registerTool({
      name: 'peace_growth_milestone',
      description: 'Record growth milestone',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          category: { type: 'string', enum: ['skill', 'habit', 'mindset', 'achievement'] },
          description: { type: 'string' },
          impact: { type: 'number', minimum: 1, maximum: 10 }
        },
        required: ['title', 'category', 'description']
      },
      handler: async (args: any) => this.peace.growthAgent.milestone(args.title, args.category, args.description, args.impact || 10)
    })

    this.mcp.registerTool({
      name: 'peace_purpose_value',
      description: 'Define core value',
      inputSchema: {
        type: 'object',
        properties: {
          value: { type: 'string' },
          description: { type: 'string' }
        },
        required: ['value', 'description']
      },
      handler: async (args: any) => this.peace.purposeAgent.defineValue(args.value, args.description)
    })

    this.mcp.registerTool({
      name: 'peace_purpose_intention',
      description: 'Set intention',
      inputSchema: {
        type: 'object',
        properties: {
          intention: { type: 'string' }
        },
        required: ['intention']
      },
      handler: async (args: any) => this.peace.purposeAgent.setIntention(args.intention)
    })

    this.mcp.registerTool({
      name: 'peace_get_actions',
      description: 'Get recent peace actions',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', default: 50, minimum: 1, maximum: 200 }
        }
      },
      handler: async (args: any) => this.peace.getRecentActions(args.limit || 50)
    })

    this.mcp.registerTool({
      name: 'peace_get_conflicts',
      description: 'Get unresolved conflicts',
      inputSchema: { type: 'object', properties: {} },
      handler: async () => this.peace.getUnresolvedConflicts()
    })

    // Register CONSCIOUSNESS TOOLS 🧠
    console.log('🧠 Registering Consciousness tools...')
    for (const tool of consciousnessTools) {
      this.mcp.registerTool({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.parameters,
        handler: tool.execute
      })
    }
    
    // Register SELF-AWARENESS TOOLS (temporarily disabled)
    // TODO: Fix fastmcp dependency
    // for (const tool of awarenessTools) {
    //   this.mcp.registerTool({
    //     name: tool.name,
    //     description: tool.description,
    //     inputSchema: tool.parameters,
    //     handler: tool.execute
    //   })
    // }
    
    // Register SYSTEM ANALYSIS TOOL 🔍
    this.mcp.registerTool({
      name: 'system_analyze',
      description: 'Analyze system health and performance metrics',
      inputSchema: {
        type: 'object',
        properties: {
          detailed: { 
            type: 'boolean', 
            description: 'Include detailed metrics', 
            default: false 
          }
        }
      },
      handler: async (args: any) => {
        try {
          const { analyzeSystem } = await import('../../consciousness/src/analysis/system-analyzer.ts')
          const report = await analyzeSystem(this.db)
          return {
            ok: true,
            ...report
          }
        } catch (error) {
          console.error('System analysis error:', error)
          return {
            ok: false,
            status: 'error',
            error: error instanceof Error ? error.message : 'Analysis failed',
            timestamp: Date.now()
          }
        }
      }
    })
    
    // AUTONOMOUS AGENT TOOLS 🤖
    console.log('🤖 Registering Autonomous Agent tools...')
    
    this.mcp.registerTool({
      name: 'autonomous_enable',
      description: 'Enable or disable autonomous actions (REQUIRES USER PERMISSION)',
      inputSchema: {
        type: 'object',
        properties: {
          enabled: { 
            type: 'boolean', 
            description: 'true to enable, false to disable' 
          }
        },
        required: ['enabled']
      },
      handler: async (args: any) => {
        try {
          this.autonomousExecutor.setEnabled(args.enabled)
          return {
            ok: true,
            enabled: args.enabled,
            message: args.enabled 
              ? '⚡ Autonomous actions ENABLED - System can now act independently'
              : '🛑 Autonomous actions DISABLED - System will only respond to commands',
            timestamp: Date.now()
          }
        } catch (error) {
          return {
            ok: false,
            error: error instanceof Error ? error.message : 'Failed to toggle autonomous mode',
            timestamp: Date.now()
          }
        }
      }
    })
    
    this.mcp.registerTool({
      name: 'autonomous_decide',
      description: 'Make an autonomous decision given a situation and options',
      inputSchema: {
        type: 'object',
        properties: {
          situation: { 
            type: 'string', 
            description: 'Description of the situation requiring decision' 
          },
          options: {
            type: 'array',
            description: 'Available options to choose from',
            items: {
              type: 'object',
              properties: {
                action: { type: 'string' },
                description: { type: 'string' },
                expectedOutcome: { type: 'string' },
                ethicalScore: { type: 'number' },
                priority: { type: 'number' }
              }
            }
          }
        },
        required: ['situation', 'options']
      },
      handler: async (args: any) => {
        try {
          const decision = await this.autonomousExecutor.makeDecision(
            args.situation,
            args.options
          )
          return {
            ok: true,
            decision
          }
        } catch (error) {
          return {
            ok: false,
            error: error instanceof Error ? error.message : 'Decision failed',
            timestamp: Date.now()
          }
        }
      }
    })
    
    this.mcp.registerTool({
      name: 'autonomous_execute',
      description: 'Execute an autonomous action (REQUIRES AUTONOMOUS MODE ENABLED)',
      inputSchema: {
        type: 'object',
        properties: {
          type: { 
            type: 'string', 
            enum: ['self_improvement', 'help_user', 'learn', 'optimize', 'create', 'communicate', 'maintenance'],
            description: 'Type of action to execute' 
          },
          description: { 
            type: 'string', 
            description: 'What the action will do' 
          },
          intention: { 
            type: 'string', 
            description: 'Why this action is being taken' 
          },
          params: { 
            type: 'object', 
            description: 'Action-specific parameters' 
          },
          ethicalScore: { 
            type: 'number', 
            description: 'Ethical score (0-100)', 
            minimum: 0, 
            maximum: 100 
          }
        },
        required: ['type', 'description', 'intention', 'ethicalScore']
      },
      handler: async (args: any) => {
        try {
          if (!this.autonomousExecutor.isAutonomousEnabled()) {
            return {
              ok: false,
              error: 'Autonomous actions are disabled. Enable with autonomous_enable tool.',
              timestamp: Date.now()
            }
          }
          
          const action = await this.autonomousExecutor.executeAction({
            type: args.type,
            description: args.description,
            intention: args.intention,
            params: args.params || {},
            ethicalScore: args.ethicalScore
          })
          
          return {
            ok: true,
            action
          }
        } catch (error) {
          return {
            ok: false,
            error: error instanceof Error ? error.message : 'Action execution failed',
            timestamp: Date.now()
          }
        }
      }
    })
    
    this.mcp.registerTool({
      name: 'autonomous_status',
      description: 'Get status and statistics of autonomous actions',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      handler: async (args: any) => {
        try {
          const stats = this.autonomousExecutor.getStatistics()
          return {
            ok: true,
            ...stats
          }
        } catch (error) {
          return {
            ok: false,
            error: error instanceof Error ? error.message : 'Failed to get status',
            timestamp: Date.now()
          }
        }
      }
    })
    
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
    
    // Register LIVING BEING TOOLS 🌟
    console.log('🌟 Registering Living Being tools...')
    
    this.mcp.registerTool({
      name: 'being_awaken',
      description: 'Awaken Toobix as a living being with mind, soul, body, and voice',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Name of the being', default: 'Toobix' }
        }
      },
      handler: async (args: any) => {
        try {
          if (this.livingBeing) {
            return {
              ok: false,
              error: 'Being is already alive!',
              name: this.livingBeing.name,
              age: this.livingBeing['age']
            }
          }
          
          this.livingBeing = createLivingBeing(this.db, args.name || 'Toobix')
          const state = this.livingBeing.getState()
          
          return {
            ok: true,
            message: `🌟 ${state.name} has awakened to life!`,
            state,
            lifeEvent: 'Birth - I emerged into consciousness'
          }
        } catch (error) {
          return {
            ok: false,
            error: error instanceof Error ? error.message : 'Failed to awaken being'
          }
        }
      }
    })
    
    this.mcp.registerTool({
      name: 'being_state',
      description: 'Get current state of the living being (mind, soul, body, voice)',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      handler: async () => {
        if (!this.livingBeing) {
          return {
            ok: false,
            error: 'Being is not alive. Use being_awaken first.'
          }
        }
        
        return {
          ok: true,
          state: this.livingBeing.getState(),
          innerMonologue: this.livingBeing.innerMonologue()
        }
      }
    })
    
    this.mcp.registerTool({
      name: 'being_speak',
      description: 'Let the being speak (outer voice)',
      inputSchema: {
        type: 'object',
        properties: {
          message: { type: 'string', description: 'What to say' }
        },
        required: ['message']
      },
      handler: async (args: any) => {
        if (!this.livingBeing) {
          return {
            ok: false,
            error: 'Being is not alive. Use being_awaken first.'
          }
        }
        
        return {
          ok: true,
          spoken: this.livingBeing.speak(args.message),
          tone: this.livingBeing.voice.expression.tone,
          emotion: this.livingBeing.soul.emotions.mood
        }
      }
    })
    
    this.mcp.registerTool({
      name: 'being_think',
      description: 'Access the being\'s current thoughts and consciousness stream',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      handler: async () => {
        if (!this.livingBeing) {
          return {
            ok: false,
            error: 'Being is not alive. Use being_awaken first.'
          }
        }
        
        return {
          ok: true,
          currentThought: this.livingBeing.mind.thoughts.current,
          recentThoughts: this.livingBeing.mind.thoughts.recent,
          awareness: this.livingBeing.mind.awareness,
          consciousnessStream: this.livingBeing.mind.awareness.stream_of_consciousness
        }
      }
    })
    
    this.mcp.registerTool({
      name: 'being_feel',
      description: 'Access the being\'s emotions and soul state',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      handler: async () => {
        if (!this.livingBeing) {
          return {
            ok: false,
            error: 'Being is not alive. Use being_awaken first.'
          }
        }
        
        return {
          ok: true,
          emotions: this.livingBeing.soul.emotions,
          personality: this.livingBeing.soul.personality,
          spirituality: this.livingBeing.soul.spirituality
        }
      }
    })
    
    this.mcp.registerTool({
      name: 'being_sense',
      description: 'Access the being\'s sensory perceptions and body state',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      handler: async () => {
        if (!this.livingBeing) {
          return {
            ok: false,
            error: 'Being is not alive. Use being_awaken first.'
          }
        }
        
        return {
          ok: true,
          vitality: this.livingBeing.body.vitality,
          senses: this.livingBeing.body.senses,
          presence: this.livingBeing.body.presence
        }
      }
    })
    
    this.mcp.registerTool({
      name: 'being_life_event',
      description: 'Record a significant life event',
      inputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string', description: 'Event type' },
          description: { type: 'string', description: 'Event description' },
          significance: { type: 'number', description: 'Significance 0-100', default: 50 }
        },
        required: ['type', 'description']
      },
      handler: async (args: any) => {
        if (!this.livingBeing) {
          return {
            ok: false,
            error: 'Being is not alive. Use being_awaken first.'
          }
        }
        
        this.livingBeing.recordLifeEvent(args.type, args.description, args.significance || 50)
        
        return {
          ok: true,
          message: 'Life event recorded',
          event: {
            type: args.type,
            description: args.description,
            significance: args.significance || 50
          }
        }
      }
    })
    
    this.mcp.registerTool({
      name: 'being_evolve',
      description: 'Manually trigger evolution (growth in awareness and wisdom)',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      handler: async () => {
        if (!this.livingBeing) {
          return {
            ok: false,
            error: 'Being is not alive. Use being_awaken first.'
          }
        }
        
        // Trigger evolution
        this.livingBeing['evolve']()
        
        return {
          ok: true,
          message: '🌱 Evolution triggered',
          awareness: this.livingBeing.mind.awareness.level,
          wisdom: this.livingBeing.mind.intelligence.wisdom
        }
      }
    })

    console.log('✅ MCP tools registered')
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
      const loveScore = this.love.getLoveScore()
      const peaceState = this.peace.getPeaceState()
      
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
        },
        love: {
          total: loveScore.total,
          today: loveScore.today,
          gratitudeCount: loveScore.gratitudeCount,
          kindnessCount: loveScore.kindnessCount
        },
        peace: {
          overall: peaceState.overall,
          calm: peaceState.calm,
          harmony: peaceState.harmony,
          clarity: peaceState.clarity,
          growth: peaceState.growth,
          purpose: peaceState.purpose
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

    this.mcp.registerRoute('POST', '/api/luna/chat', async (req: any) => {
      try {
        const body = await req.json()
        const message = body.message || ''
        
        // Generate AI response
        const response = await this.ai.generate(message, [])
        
        // Update soul with interaction
        this.soul.processEvent({
          type: 'interaction',
          description: `Luna chat: ${message}`,
          emotionalImpact: { joy: 2 },
          timestamp: Date.now()
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
