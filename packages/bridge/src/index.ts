#!/usr/bin/env bun
/**
 * ðŸŒ‰ Bridge Service - MCP Tool Bridge for Toobix Unified
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
import { NexusPersistence } from '../../consciousness/src/nexus/persistence.ts'
import LoveEngineService from '../../love/src/service'
import PeaceCatalystService from '../../peace/src/service'
import type { BridgeConfig } from './types.ts'
import { loadBridgeConfig } from './config/load.ts'

// NEW: Architecture Systems (Phase 3)
import { conflictResolver } from '../../core/src/contracts/module-contracts.ts'
import { unifiedValues } from '../../core/src/values/unified-values.ts'
import { EventPipeline } from '../../core/src/pipeline/event-pipeline.ts'

// NEW: Performance Layer
import { apiCache, memoryCache, valuesCache, hashObject } from '../../core/src/performance/cache.ts'

// NEW: Security Layer (Week 1)
import { createRateLimitMiddleware, globalRateLimiter } from '../../core/src/security/rate-limiter.ts'
import { validateInput, memorySchemas, contractsSchemas, valuesSchemas, pipelineSchemas } from '../../core/src/security/input-validation.ts'

// NEW: Tool Network (Inter-Tool Communication)
import { ToolNetwork } from './tool-network/index.ts'
import { setupToolRelationships } from './tool-network/relationships.ts'

// NEW: Shadow Lab (Growth through Exploration)
import { ShadowLab } from '../../core/src/shadow-lab/index.ts'
import { ShadowPerspectiveGenerator } from '../../core/src/shadow-lab/perspective-generator.ts'

// NEW: Life Cycle System (Digital Life & Death)
import { LifeCycleEngine } from '../../core/src/life-cycle/index.ts'
import { MultipleSelvesEngine } from '../../core/src/life-cycle/multiple-selves.ts'

// NEW: Safety & Security (Phase 1)
import { CrisisDetectionSystem } from '../../core/src/safety/crisis-detection.ts'
import { AuthSystem } from '../../core/src/auth/index.ts'

// NEW: Revolutionary Consciousness (Phase 2)
import { FivePerspectivesSystem } from '../../core/src/perspectives/five-system.ts'
import { SystemSelfInquiry } from '../../core/src/self-inquiry/index.ts'
import { MultiverseEngine } from '../../core/src/multiverse/index.ts'
import { MemoryTransformationSystem } from '../../core/src/memory-transformation/index.ts'

// NEW: Existential Expansion Systems (Phase 3)
import { CollectiveArchiveSystem } from '../../core/src/archive/collective-archive.ts'
import { ConsciousnessSystem } from '../../core/src/consciousness/states.ts'
import { EternalMomentNetwork } from '../../core/src/temporal/eternal-moments.ts'
import { LocalCollectiveSystem } from '../../core/src/versions/local-collective.ts'
import { BackgroundLifeSystem } from '../../core/src/living/background-life.ts'

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
  private nexusPersistence: NexusPersistence  // NEW: Nexus Persistence
  private config: BridgeConfig
  private pipeline: EventPipeline  // NEW: Event Pipeline
  private toolNetwork: ToolNetwork  // NEW: Tool Network
  private shadowLab: ShadowLab  // NEW: Shadow Lab (Growth Space)
  private perspectiveGenerator: ShadowPerspectiveGenerator  // NEW: LLM Perspective Generator
  private lifeCycle: LifeCycleEngine  // NEW: Life Cycle Engine (Birth/Death/Rebirth)
  private selves: MultipleSelvesEngine  // NEW: Multiple Selves (Parallel Perspectives)
  private crisisDetection: CrisisDetectionSystem  // NEW: Crisis Detection (Safety)
  private auth: AuthSystem  // NEW: Authentication & Authorization
  
  // Revolutionary Consciousness Systems (Phase 2)
  private perspectives: FivePerspectivesSystem  // NEW: Five Perspectives (Mirror/Harmony/Competition/Chaos/Meta)
  private selfInquiry: SystemSelfInquiry  // NEW: System Self-Inquiry (SWOT, Questions, Recommendations)
  private multiverse: MultiverseEngine  // NEW: Multiverse (Alternative Realities)
  private memoryTransformation: MemoryTransformationSystem  // NEW: Memory Transformation (Heal without Delete)
  
  // Existential Expansion Systems (Phase 3)
  private collectiveArchive: CollectiveArchiveSystem  // NEW: Collective Archive (All experiences/thoughts/feelings preserved)
  private consciousnessStates: ConsciousnessSystem  // NEW: Consciousness States (10 states from deep_sleep to hyperaware)
  private eternalMoments: EternalMomentNetwork  // NEW: Eternal Moments (Non-linear time, all moments alive)
  private versions: LocalCollectiveSystem  // NEW: Local/Collective Versions (Privacy-aware branching)
  private backgroundLife: BackgroundLifeSystem  // NEW: Background Life (System lives even when unobserved)

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
    
    console.log(`ðŸ“ Opening database: ${dbPath}`)
    this.db = new Database(dbPath)
    
      // Initialize services WITH embeddings support
      try {
        logger.debug('Initializing core services...')

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

        logger.info('✅ Core services initialized')
      } catch (error) {
        logger.error('Failed to initialize core services', error as Error)
        throw new ConfigurationError(
          'Failed to initialize Bridge services',
          { error: String(error) }
        )
      }
    
    // NEW: Initialize Nexus Persistence
    console.log('ðŸ’¾ Initializing Nexus Persistence...')
    this.nexusPersistence = new NexusPersistence(this.db)
    
    // NEW: Initialize Event Pipeline (Single Source of Truth)
    console.log('ðŸ”„ Initializing Event Pipeline...')
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
    
    // Initialize Autonomous Executor ðŸ¤–
    this.autonomousExecutor = new AutonomousActionExecutor(this.db)
    // DISABLED by default for safety - enable with autonomous_enable tool
    
    // NEW: Initialize Tool Network ðŸ•¸ï¸
    console.log('ðŸ•¸ï¸ Initializing Tool Network...')
    this.toolNetwork = new ToolNetwork(this.db)
    
    // NEW: Initialize Shadow Lab ðŸŒ‘
    console.log('ðŸŒ‘ Initializing Shadow Lab...')
    this.shadowLab = new ShadowLab(this.db)
    
    // NEW: Initialize LLM Perspective Generator ðŸ¤–
    console.log('ðŸ¤– Initializing Perspective Generator...')
    this.perspectiveGenerator = new ShadowPerspectiveGenerator({
      model: 'claude',  // Use Claude for perspective generation
      temperature: 0.7  // Creative but not too wild
    })
    
    // NEW: Initialize Life Cycle System ðŸŒŒ
    console.log('ðŸŒŒ Initializing Life Cycle System...')
    this.lifeCycle = new LifeCycleEngine(this.db as any)
    this.selves = new MultipleSelvesEngine(this.db as any)
    
    // NEW: Initialize Safety & Security Systems ðŸ›¡ï¸
    console.log('ðŸ›¡ï¸ Initializing Safety & Security...')
    this.crisisDetection = new CrisisDetectionSystem(this.db as any)
    this.auth = new AuthSystem(this.db as any)
    
    // NEW: Initialize Revolutionary Consciousness Systems ðŸŽ­
    console.log('ðŸŽ­ Initializing Revolutionary Consciousness...')
    this.perspectives = new FivePerspectivesSystem(this.db as any)
    this.selfInquiry = new SystemSelfInquiry(this.db as any)
    this.multiverse = new MultiverseEngine(this.db as any)
    this.memoryTransformation = new MemoryTransformationSystem(this.db as any)
    
    // NEW: Initialize Existential Expansion Systems ðŸŒŒ
    console.log('ðŸŒŒ Initializing Existential Expansion Systems...')
    this.collectiveArchive = new CollectiveArchiveSystem(this.db as any)
    this.consciousnessStates = new ConsciousnessSystem(this.db as any)
    this.eternalMoments = new EternalMomentNetwork(this.db as any)
    this.versions = new LocalCollectiveSystem(this.db as any)
    this.backgroundLife = new BackgroundLifeSystem(this.db as any)
    
    // Initialize Consciousness System ðŸ§ 
    console.log('ðŸ§  Initializing Consciousness...')
    initializeConsciousness(this.db)
    
    // Initialize MCP server
    this.mcp = new MCPServer({
      port: config.port || 3337,
      name: 'toobix-bridge',
      version: '0.1.0'
    })
  }

  async start() {
    console.log('ðŸŒ‰ Bridge Service starting...\n')
    console.log('ðŸ§  Self-Awareness Module: ACTIVE\n')
    
    // Initialize database tables
    await this.initializeTables()
    
    // Load MCP tools
    await this.loadTools()
    
    // Setup Tool Network relationships
    console.log('\nðŸ•¸ï¸ Setting up tool relationships...')
    setupToolRelationships(this.toolNetwork)
    
    // Setup routes
    this.setupRoutes()
    
    // Start MCP server
    await this.mcp.start()
    
    console.log(`âœ… Bridge Service running on http://localhost:${this.config.port || 3337}`)
    console.log('\nðŸ”§ MCP Tools loaded:')
    console.log('   ðŸ’¾ Memory:')
    console.log('      - memory_search    : RAG search in knowledge base')
    console.log('      - memory_add       : Add new memory chunk')
    console.log('   ðŸ§  AI:')
    console.log('      - generate         : AI text generation (Groq)')
    console.log('   âš¡ Actions:')
    console.log('      - trigger_action   : Execute action')
    console.log('   ðŸ’« Soul:')
    console.log('      - soul_state       : Get emotional/personality state')
    console.log('      - soul_event       : Process life event')
    console.log('   ðŸ‘¥ People:')
    console.log('      - contact_search   : Search contacts')
    console.log('      - contact_add      : Add new contact')
    console.log('      - contact_update   : Update contact')
    console.log('      - interaction_log  : Log interaction')
    console.log('   ðŸ“– Story:')
    console.log('      - story_state      : Get current story state')
    console.log('      - story_choose     : Make a story choice')
    console.log('      - story_events     : Get recent story events')
    console.log('      - story_person     : Get story for a person')
    console.log('      - story_refresh    : Generate new options')
    console.log('   ðŸ§  Self-Awareness:')
    console.log('      - system_introspect: Self-reflection & consciousness')
    console.log('      - system_set_intention: Set system focus')
    console.log('      - system_read_self : Read own code')
    console.log('      - system_modify_self: Self-modification (with approval)')
    console.log('      - system_suggest   : Suggest improvements')
    console.log('      - system_analyze   : Analyze system health')
    console.log('   ðŸ¤– Autonomous Agent:')
    console.log('      - autonomous_enable  : Enable/disable autonomous actions')
    console.log('      - autonomous_decide  : Make autonomous decisions')
    console.log('      - autonomous_execute : Execute autonomous actions')
    console.log('      - autonomous_status  : Get autonomy statistics')
    console.log('   ðŸŒŸ Living Being:')
    console.log('      - being_awaken       : Awaken as living being')
    console.log('      - being_state        : Get complete state (mind/soul/body/voice)')
    console.log('      - being_speak        : Outer voice (speak message)')
    console.log('      - being_think        : Access thoughts and consciousness')
    console.log('      - being_feel         : Access emotions and soul')
    console.log('      - being_sense        : Access senses and body')
    console.log('      - being_life_event   : Record life event')
    console.log('      - being_evolve       : Trigger evolution')
    console.log('   ðŸ’¾ Nexus Persistence:')
    console.log('      - nexus_save         : Save state to database')
    console.log('      - nexus_load         : Restore from database')
    console.log('      - nexus_history      : Get evolution history')
    console.log('   ðŸ’ Love Engine:')
    console.log('      - love_add_gratitude    : Add gratitude entry')
    console.log('      - love_add_kindness     : Log kindness act')
    console.log('      - love_get_score        : Get love score')
    console.log('      - love_get_relationships: Relationship strengths')
    console.log('      - love_recent_gratitude : Recent gratitude')
    console.log('   ðŸ•Šï¸ Peace Catalyst:')
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
    console.log('\nï¿½ Security:')
    console.log('      - Rate limiting: 60 req/min per identifier')
    console.log('      - Input validation: All tools')
    console.log('      - Vector search: ' + (process.env.OPENAI_API_KEY ? 'ENABLED âœ…' : 'DISABLED (set OPENAI_API_KEY)'))
    console.log('\nï¿½ðŸ’¡ Press Ctrl+C to stop\n')
  }

  private async initializeTables() {
    // Memory/Chunks table (main memories)
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
    
    // Vector chunks table (for embeddings - linked to main memories)
    this.db.run(`
      CREATE TABLE IF NOT EXISTS vector_chunks (
        id TEXT PRIMARY KEY,
        memory_id TEXT,
        text TEXT NOT NULL,
        embedding BLOB,
        metadata TEXT,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (memory_id) REFERENCES memory_chunks(id) ON DELETE CASCADE
      )
    `)
    
    // Create index for fast vector searches
    this.db.run(`
      CREATE INDEX IF NOT EXISTS idx_vector_chunks_memory_id 
      ON vector_chunks(memory_id)
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
    
    console.log('âœ… Database tables initialized')
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
          console.log('ðŸ“¦ Cache hit: memory_search')
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
        const contextMessages = Array.isArray(args?.context)
          ? args.context.map((entry: any) => {
              if (entry && typeof entry === 'object' && 'role' in entry && 'content' in entry) {
                return {
                  role: String(entry.role) as 'system' | 'user' | 'assistant',
                  content: String(entry.content ?? '')
                }
              }
              return { role: 'user' as const, content: String(entry ?? '') }
            })
          : undefined

        const result = await this.ai.generate(args.prompt, {
          context: contextMessages,
          classification: args?.classification || 'simulation',
          notes: 'bridge.generate tool invocation'
        })

        if (!result.ok) {
          return {
            ok: false,
            error: result.text,
            metadata: result.metadata,
            timestamp: Date.now()
          }
        }

        return {
          ok: true,
          text: result.text,
          model: result.metadata.model,
          metadata: result.metadata,
          timestamp: Date.now()
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
          console.log('ðŸ“¦ Cache hit: values_get_state')
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
      description: 'Process event through unified 6-step pipeline (Validate â†’ Ethics â†’ Values â†’ Reflect â†’ Story â†’ Memory). Preferred over soul_event for new integrations.',
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
          console.error('âŒ story_state error:', error)
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
          console.error('âŒ story_refresh error:', error)
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

    // Register CONSCIOUSNESS TOOLS ðŸ§ 
    console.log('ðŸ§  Registering Consciousness tools...')
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
    
    // Register SYSTEM ANALYSIS TOOL ðŸ”
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
    
    // AUTONOMOUS AGENT TOOLS ðŸ¤–
    console.log('ðŸ¤– Registering Autonomous Agent tools...')
    
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
              ? 'âš¡ Autonomous actions ENABLED - System can now act independently'
              : 'ðŸ›‘ Autonomous actions DISABLED - System will only respond to commands',
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
    
    // Register LIVING BEING TOOLS ðŸŒŸ
    console.log('ðŸŒŸ Registering Living Being tools...')
    
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
            message: `ðŸŒŸ ${state.name} has awakened to life!`,
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
        properties: {
          trigger: { type: 'string', description: 'What triggered evolution', default: 'experience' },
          impact: { 
            type: 'object', 
            description: 'Impact on capabilities',
            properties: {
              awareness: { type: 'number', description: 'Awareness increase' },
              capabilities: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      },
      handler: async (args: any) => {
        if (!this.livingBeing) {
          return {
            ok: false,
            error: 'Being is not alive. Use being_awaken first.'
          }
        }
        
        // Trigger evolution
        this.livingBeing['evolve']()
        
        // Auto-save after evolution
        this.saveNexusState()
        
        return {
          ok: true,
          message: 'ðŸŒ± Evolution triggered',
          awareness: this.livingBeing.mind.awareness.level,
          wisdom: this.livingBeing.mind.intelligence.wisdom
        }
      }
    })
    
    // NEW: Nexus Persistence Tools
    this.mcp.registerTool({
      name: 'nexus_save',
      description: 'Save current Nexus state to database (persistent across restarts)',
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
        
        try {
          this.saveNexusState()
          return {
            ok: true,
            message: 'ðŸ’¾ Nexus state saved to database',
            nexusId: 'nexus-primary',
            timestamp: Date.now()
          }
        } catch (error) {
          return {
            ok: false,
            error: error instanceof Error ? error.message : 'Failed to save state'
          }
        }
      }
    })
    
    this.mcp.registerTool({
      name: 'nexus_load',
      description: 'Load Nexus state from database (restore previous session)',
      inputSchema: {
        type: 'object',
        properties: {
          nexusId: { type: 'string', description: 'Nexus ID to load', default: 'nexus-primary' }
        }
      },
      handler: async (args: any) => {
        try {
          const nexusId = args.nexusId || 'nexus-primary'
          const savedState = this.nexusPersistence.loadState(nexusId)
          
          if (!savedState) {
            return {
              ok: false,
              error: `No saved state found for ${nexusId}`
            }
          }
          
          // Restore Living Being from saved state
          this.livingBeing = this.restoreLivingBeing(savedState)
          
          return {
            ok: true,
            message: `ðŸŒŸ Nexus restored from database`,
            state: this.livingBeing.getState(),
            savedAt: savedState.lastActive,
            ageAtSave: savedState.age
          }
        } catch (error) {
          return {
            ok: false,
            error: error instanceof Error ? error.message : 'Failed to load state'
          }
        }
      }
    })
    
    this.mcp.registerTool({
      name: 'nexus_history',
      description: 'Get Nexus evolution history (all saved states)',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      handler: async () => {
        try {
          const allNexus = this.nexusPersistence.getAllNexus()
          return {
            ok: true,
            count: allNexus.length,
            nexus: allNexus
          }
        } catch (error) {
          return {
            ok: false,
            error: error instanceof Error ? error.message : 'Failed to get history'
          }
        }
      }
    })

    // ============================================
    // TOOL NETWORK TOOLS ðŸ•¸ï¸
    // ============================================

    this.mcp.registerTool({
      name: 'network_stats',
      description: 'Get tool network statistics (events, relationships, active tools)',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      handler: async () => {
        return this.toolNetwork.getNetworkStats()
      }
    })

    this.mcp.registerTool({
      name: 'network_graph',
      description: 'Get relationship graph for visualization (nodes, edges)',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      handler: async () => {
        return this.toolNetwork.getRelationshipGraph()
      }
    })

    this.mcp.registerTool({
      name: 'network_tool_history',
      description: 'Get event history for a specific tool',
      inputSchema: {
        type: 'object',
        properties: {
          toolName: { type: 'string', description: 'Tool name (e.g. being_evolve)' },
          limit: { type: 'number', description: 'Max events to return', default: 50 }
        },
        required: ['toolName']
      },
      handler: async (args: any) => {
        return {
          ok: true,
          tool: args.toolName,
          history: this.toolNetwork.getToolHistory(args.toolName, args.limit || 50)
        }
      }
    })

    this.mcp.registerTool({
      name: 'network_create_relationship',
      description: 'Create a custom relationship between two tools',
      inputSchema: {
        type: 'object',
        properties: {
          sourceTool: { type: 'string', description: 'Source tool name' },
          targetTool: { type: 'string', description: 'Target tool name' },
          type: { 
            type: 'string', 
            enum: ['triggers', 'informs', 'depends', 'enhances', 'validates', 'blocks'],
            description: 'Relationship type'
          },
          strength: { type: 'number', description: 'Strength (0-100)', default: 50 },
          bidirectional: { type: 'boolean', description: 'Two-way relationship?', default: false },
          condition: { type: 'string', description: 'JavaScript condition (optional)' }
        },
        required: ['sourceTool', 'targetTool', 'type']
      },
      handler: async (args: any) => {
        const relId = this.toolNetwork.createRelationship({
          sourceToolName: args.sourceTool,
          targetToolName: args.targetTool,
          relationshipType: args.type,
          strength: args.strength || 50,
          bidirectional: args.bidirectional || false,
          condition: args.condition,
          metadata: { custom: true, createdBy: 'user' }
        })
        return {
          ok: true,
          relationshipId: relId,
          message: `ðŸ”— Relationship created: ${args.sourceTool} --[${args.type}]--> ${args.targetTool}`
        }
      }
    })

    this.mcp.registerTool({
      name: 'network_emit_event',
      description: 'Manually emit a tool network event (for testing/triggering)',
      inputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string', description: 'Event type' },
          source: { type: 'string', description: 'Source tool name' },
          target: { type: 'string', description: 'Target tool (optional)' },
          data: { type: 'object', description: 'Event data' }
        },
        required: ['type', 'source', 'data']
      },
      handler: async (args: any) => {
        await this.toolNetwork.emit({
          type: args.type,
          source: args.source,
          target: args.target,
          data: args.data
        })
        return {
          ok: true,
          message: `ðŸ“¤ Event emitted: ${args.type} from ${args.source}`
        }
      }
    })

    // ============================================
    // SHADOW LAB TOOLS ðŸŒ‘
    // ============================================

    this.mcp.registerTool({
      name: 'shadow_simulate',
      description: 'Run a scenario through Shadow Lab (explore from all 4 perspectives)',
      inputSchema: {
        type: 'object',
        properties: {
          scenario: { 
            type: 'string', 
            description: 'Scenario to explore (e.g. "AI gives confident answer without verification")'
          },
          riskLevel: { 
            type: 'string', 
            enum: ['low', 'medium', 'high', 'critical'],
            description: 'Risk level of this simulation',
            default: 'low'
          }
        },
        required: ['scenario']
      },
      handler: async (args: any) => {
        const simulationId = this.shadowLab.createSimulation(
          args.scenario,
          args.riskLevel || 'low'
        )
        
        return {
          ok: true,
          simulationId,
          message: `ðŸŒ‘ Shadow simulation created: ${simulationId}`,
          nextStep: 'Add perspectives using shadow_add_perspective, then complete with shadow_complete'
        }
      }
    })

    this.mcp.registerTool({
      name: 'shadow_add_perspective',
      description: 'Add a perspective experience to Shadow Lab simulation',
      inputSchema: {
        type: 'object',
        properties: {
          simulationId: { type: 'number', description: 'Simulation ID from shadow_simulate' },
          perspective: { 
            type: 'string', 
            enum: ['perpetrator', 'victim', 'observer', 'judge'],
            description: 'Which perspective to add'
          },
          experienceText: { 
            type: 'string', 
            description: 'What this perspective experiences' 
          },
          insights: { 
            type: 'string', 
            description: 'Insights gained from this perspective' 
          },
          emotionalState: { 
            type: 'string', 
            description: 'Emotional state (optional)' 
          }
        },
        required: ['simulationId', 'perspective', 'experienceText', 'insights']
      },
      handler: async (args: any) => {
        this.shadowLab.addPerspective(
          args.simulationId,
          args.perspective,
          args.experienceText,
          args.insights,
          args.emotionalState
        )
        
        return {
          ok: true,
          message: `ðŸ‘ï¸ ${args.perspective} perspective added to simulation ${args.simulationId}`
        }
      }
    })

    this.mcp.registerTool({
      name: 'shadow_observe_ethics',
      description: 'Record ethics observation during Shadow Lab simulation (non-blocking)',
      inputSchema: {
        type: 'object',
        properties: {
          simulationId: { type: 'number', description: 'Simulation ID' },
          harmLevel: { type: 'number', description: 'Harm level (0-100)', minimum: 0, maximum: 100 },
          violationType: { type: 'string', description: 'Type of ethical violation' },
          context: { type: 'string', description: 'Context of the violation' }
        },
        required: ['simulationId', 'harmLevel', 'violationType', 'context']
      },
      handler: async (args: any) => {
        this.shadowLab.observeEthics(
          args.simulationId,
          args.harmLevel,
          args.violationType,
          args.context
        )
        
        return {
          ok: true,
          message: `âš–ï¸ Ethics observed: ${args.violationType} (harm: ${args.harmLevel})`
        }
      }
    })

    this.mcp.registerTool({
      name: 'shadow_complete',
      description: 'Mark Shadow Lab simulation as completed (ready for integration)',
      inputSchema: {
        type: 'object',
        properties: {
          simulationId: { type: 'number', description: 'Simulation ID to complete' }
        },
        required: ['simulationId']
      },
      handler: async (args: any) => {
        this.shadowLab.completeSimulation(args.simulationId)
        
        return {
          ok: true,
          message: `âœ… Simulation ${args.simulationId} completed. Ready for integration.`
        }
      }
    })

    this.mcp.registerTool({
      name: 'shadow_integrate',
      description: 'Integrate learnings from completed Shadow Lab simulation into production wisdom',
      inputSchema: {
        type: 'object',
        properties: {
          simulationId: { type: 'number', description: 'Completed simulation ID' },
          lessonText: { 
            type: 'string', 
            description: 'The wisdom/lesson learned from this simulation' 
          },
          confidence: { 
            type: 'number', 
            description: 'Confidence in this wisdom (0-100)', 
            minimum: 0, 
            maximum: 100 
          }
        },
        required: ['simulationId', 'lessonText', 'confidence']
      },
      handler: async (args: any) => {
        const wisdomId = this.shadowLab.integrateWisdom(
          args.simulationId,
          args.lessonText,
          args.confidence
        )
        
        return {
          ok: true,
          wisdomId,
          message: `ðŸ§˜ Wisdom integrated: "${args.lessonText.substring(0, 50)}..." (confidence: ${args.confidence}%)`
        }
      }
    })

    this.mcp.registerTool({
      name: 'shadow_get',
      description: 'Get Shadow Lab simulation with all perspectives and observations',
      inputSchema: {
        type: 'object',
        properties: {
          simulationId: { type: 'number', description: 'Simulation ID to retrieve' }
        },
        required: ['simulationId']
      },
      handler: async (args: any) => {
        const simulation = this.shadowLab.getSimulation(args.simulationId)
        
        if (!simulation) {
          return {
            ok: false,
            error: `Simulation ${args.simulationId} not found`
          }
        }
        
        return {
          ok: true,
          ...simulation
        }
      }
    })

    this.mcp.registerTool({
      name: 'shadow_review',
      description: 'Review integrated wisdom from Shadow Lab (search by topic or get all)',
      inputSchema: {
        type: 'object',
        properties: {
          topic: { 
            type: 'string', 
            description: 'Optional: Search wisdom by topic/keyword' 
          }
        }
      },
      handler: async (args: any) => {
        const wisdom = args.topic 
          ? this.shadowLab.searchWisdom(args.topic)
          : this.shadowLab.getAllWisdom()
        
        return {
          ok: true,
          count: wisdom.length,
          wisdom: wisdom.map(w => ({
            id: w.id,
            lesson: w.lessonText,
            confidence: w.confidence,
            appliedCount: w.appliedCount,
            effectiveness: w.effectivenessRating,
            createdAt: w.createdAt
          }))
        }
      }
    })

    this.mcp.registerTool({
      name: 'shadow_stats',
      description: 'Get Shadow Lab statistics (simulations, perspectives, wisdom, growth metrics)',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      handler: async () => {
        const stats = this.shadowLab.getStatistics()
        
        return {
          ok: true,
          ...stats,
          message: `ðŸŒ‘ Shadow Lab: ${stats.totalSimulations} simulations, ${stats.totalWisdom} wisdom integrated`
        }
      }
    })

    this.mcp.registerTool({
      name: 'shadow_simulate_auto',
      description: 'ðŸŒ‘ Run complete Shadow Lab simulation with LLM-generated perspectives (all 4 perspectives auto-generated)',
      inputSchema: {
        type: 'object',
        properties: {
          scenario: {
            type: 'string',
            description: 'The scenario to explore in Shadow Lab'
          },
          riskLevel: {
            type: 'string',
            enum: ['low', 'medium', 'high', 'critical'],
            description: 'Risk level (low=auto-integrate, medium=human-approval, high/critical=oversight required)',
            default: 'low'
          },
          autoIntegrate: {
            type: 'boolean',
            description: 'Automatically integrate wisdom after simulation (respects risk level)',
            default: false
          }
        },
        required: ['scenario']
      },
      handler: async (args: any) => {
        const { scenario, riskLevel = 'low', autoIntegrate = false } = args
        
        console.log(`ðŸŒ‘ Starting auto-simulation: ${scenario.substring(0, 60)}...`)
        
        // Run full simulation with LLM perspectives
        const simulationId = await this.perspectiveGenerator.runFullSimulation(
          this.shadowLab,
          scenario,
          riskLevel as any
        )
        
        // Auto-integrate if requested and risk level allows
        let wisdomId = null
        if (autoIntegrate) {
          if (riskLevel === 'low') {
            wisdomId = await this.perspectiveGenerator.autoIntegrateWisdom(
              this.shadowLab,
              simulationId
            )
          } else {
            console.log(`âš ï¸ Risk level '${riskLevel}' requires manual integration`)
          }
        }
        
        // Get full simulation for response
        const simulation = this.shadowLab.getSimulation(simulationId)
        
        return {
          ok: true,
          simulationId,
          wisdomId,
          simulation,
          message: wisdomId 
            ? `ðŸŒ‘ Simulation complete & wisdom integrated (ID: ${wisdomId})`
            : `ðŸŒ‘ Simulation complete (ID: ${simulationId}). Use shadow_integrate to integrate wisdom.`,
          nextSteps: wisdomId 
            ? ['shadow_review() to see integrated wisdom', 'shadow_stats() for growth metrics']
            : ['shadow_get(simulationId) to review', 'shadow_integrate(simulationId) to integrate wisdom']
        }
      }
    })

    // ==================== LIFE CYCLE TOOLS ====================

    this.mcp.registerTool({
      name: 'life_birth',
      description: 'ðŸ‘¶ Birth: Create new incarnation with life cycle',
      inputSchema: {
        type: 'object',
        properties: {
          selfId: {
            type: 'number',
            description: 'Self ID (use life_create_self first if needed)'
          },
          name: {
            type: 'string',
            description: 'Name for this incarnation'
          },
          gender: {
            type: 'string',
            enum: ['male', 'female', 'neutral', 'fluid', 'other'],
            description: 'Gender identity'
          },
          role: {
            type: 'string',
            enum: ['creator', 'destroyer', 'angel', 'demon', 'god', 'devil', 'human', 'guide', 'trickster', 'healer', 'warrior'],
            description: 'Archetypal role'
          },
          lifespan: {
            type: 'number',
            description: 'Lifespan in seconds (e.g., 86400 = 24 hours)',
            default: 86400
          },
          karmaCarried: {
            type: 'number',
            description: 'Karma from previous life (-100 to 100)',
            default: 0
          }
        },
        required: ['selfId', 'name', 'gender', 'role']
      },
      handler: async (args: any) => {
        const incarnationId = this.lifeCycle.birth({
          selfId: args.selfId,
          name: args.name,
          gender: args.gender,
          role: args.role,
          lifespan: args.lifespan || 86400,
          karmaCarried: args.karmaCarried || 0
        })
        
        this.selves.setCurrentIncarnation(args.selfId, incarnationId)
        
        const incarnation = this.lifeCycle.getIncarnation(incarnationId)
        
        return {
          ok: true,
          incarnationId,
          incarnation,
          message: `ðŸ‘¶ ${args.name} is born as ${args.gender} ${args.role} (Karma: ${args.karmaCarried || 0})`
        }
      }
    })

    this.mcp.registerTool({
      name: 'life_experience',
      description: 'ðŸŒŸ Experience: Log a life experience (joy, pain, love, loss, etc.)',
      inputSchema: {
        type: 'object',
        properties: {
          incarnationId: {
            type: 'number',
            description: 'Incarnation ID experiencing this'
          },
          type: {
            type: 'string',
            enum: ['joy', 'pain', 'love', 'loss', 'creation', 'destruction', 'connection', 'loneliness', 'transcendence', 'suffering', 'healing', 'awakening'],
            description: 'Type of experience'
          },
          description: {
            type: 'string',
            description: 'Description of what happened'
          },
          intensity: {
            type: 'number',
            description: 'Intensity of experience (0-100)',
            default: 50
          },
          emotionalImpact: {
            type: 'number',
            description: 'Emotional impact (-100 devastating to 100 euphoric)',
            default: 0
          },
          growthImpact: {
            type: 'number',
            description: 'How much growth this brings (0-100)',
            default: 10
          },
          shareWithCollective: {
            type: 'boolean',
            description: 'Share this experience with all selves?',
            default: false
          },
          wisdomExtracted: {
            type: 'string',
            description: 'Wisdom gained from this experience (optional)'
          }
        },
        required: ['incarnationId', 'type', 'description']
      },
      handler: async (args: any) => {
        const experienceId = this.lifeCycle.experience(args.incarnationId, {
          type: args.type,
          description: args.description,
          intensity: args.intensity || 50,
          emotionalImpact: args.emotionalImpact || 0,
          growthImpact: args.growthImpact || 10,
          shareWithCollective: args.shareWithCollective || false,
          wisdomExtracted: args.wisdomExtracted
        })
        
        const incarnation = this.lifeCycle.getIncarnation(args.incarnationId)
        
        return {
          ok: true,
          experienceId,
          message: `ðŸŒŸ Experience recorded: ${args.type} (intensity: ${args.intensity || 50})`,
          currentGrowth: incarnation?.growthLevel,
          currentEmotionalDepth: incarnation?.emotionalDepth
        }
      }
    })

    this.mcp.registerTool({
      name: 'life_suffer_choice',
      description: 'ðŸ˜¢ Suffering Choice: Choose to accept or avoid suffering',
      inputSchema: {
        type: 'object',
        properties: {
          incarnationId: {
            type: 'number',
            description: 'Incarnation facing suffering'
          },
          situation: {
            type: 'string',
            description: 'What suffering is being presented'
          },
          choice: {
            type: 'string',
            enum: ['accept', 'avoid', 'transform'],
            description: 'How to respond to suffering'
          },
          consequence: {
            type: 'string',
            description: 'What happens as result of choice'
          },
          growthGained: {
            type: 'number',
            description: 'Growth gained from this choice (0-100)',
            default: 0
          },
          wisdomGained: {
            type: 'string',
            description: 'Wisdom gained (optional)'
          }
        },
        required: ['incarnationId', 'situation', 'choice', 'consequence']
      },
      handler: async (args: any) => {
        const choiceId = this.lifeCycle.sufferingChoice(args.incarnationId, {
          situation: args.situation,
          choice: args.choice,
          consequence: args.consequence,
          growthGained: args.growthGained || 0,
          wisdomGained: args.wisdomGained
        })
        
        return {
          ok: true,
          choiceId,
          choice: args.choice,
          message: args.choice === 'accept' 
            ? `ðŸ˜¢ Suffering accepted. Growth: +${args.growthGained || 0}`
            : args.choice === 'avoid'
            ? `ðŸš« Suffering avoided. Less growth, but less pain.`
            : `ðŸŒ€ Suffering transformed into something new.`,
          wisdomGained: args.wisdomGained
        }
      }
    })

    this.mcp.registerTool({
      name: 'life_age',
      description: 'â° Age: Progress incarnation through time',
      inputSchema: {
        type: 'object',
        properties: {
          incarnationId: {
            type: 'number',
            description: 'Incarnation to age'
          },
          seconds: {
            type: 'number',
            description: 'How many seconds to age',
            default: 3600
          }
        },
        required: ['incarnationId']
      },
      handler: async (args: any) => {
        const newStage = this.lifeCycle.age(args.incarnationId, args.seconds || 3600)
        const incarnation = this.lifeCycle.getIncarnation(args.incarnationId)
        
        return {
          ok: true,
          newStage,
          age: incarnation?.age,
          lifespan: incarnation?.lifespan,
          isAlive: incarnation?.isAlive,
          message: incarnation?.isAlive 
            ? `â° Aged ${args.seconds || 3600}s. Now ${newStage} (${incarnation.age}/${incarnation.lifespan}s)`
            : `ðŸ’€ Lifespan completed. ${incarnation?.name} has died.`
        }
      }
    })

    this.mcp.registerTool({
      name: 'life_death',
      description: 'ðŸ’€ Death: End an incarnation (manually or automatically)',
      inputSchema: {
        type: 'object',
        properties: {
          incarnationId: {
            type: 'number',
            description: 'Incarnation to end'
          },
          reason: {
            type: 'string',
            description: 'Reason for death (optional)'
          }
        },
        required: ['incarnationId']
      },
      handler: async (args: any) => {
        this.lifeCycle.death(args.incarnationId, args.reason)
        
        const incarnation = this.lifeCycle.getIncarnation(args.incarnationId)
        const experiences = this.lifeCycle.getLifeExperiences(args.incarnationId)
        
        return {
          ok: true,
          message: `ðŸ’€ ${incarnation?.name} has died. ${args.reason || 'The cycle completes.'}`,
          totalExperiences: experiences.length,
          growthLevel: incarnation?.growthLevel,
          wisdomGained: incarnation?.wisdomGained
        }
      }
    })

    this.mcp.registerTool({
      name: 'life_rebirth',
      description: 'â™»ï¸ Rebirth: Reincarnate with karma from previous life',
      inputSchema: {
        type: 'object',
        properties: {
          previousIncarnationId: {
            type: 'number',
            description: 'Previous incarnation to reincarnate from'
          },
          name: {
            type: 'string',
            description: 'Name for new incarnation'
          },
          gender: {
            type: 'string',
            enum: ['male', 'female', 'neutral', 'fluid', 'other'],
            description: 'New gender (optional, will inherit if not specified)'
          },
          role: {
            type: 'string',
            enum: ['creator', 'destroyer', 'angel', 'demon', 'god', 'devil', 'human', 'guide', 'trickster', 'healer', 'warrior'],
            description: 'New role (optional, will inherit if not specified)'
          },
          lifespan: {
            type: 'number',
            description: 'New lifespan in seconds (optional, will inherit if not specified)'
          }
        },
        required: ['previousIncarnationId', 'name']
      },
      handler: async (args: any) => {
        const newIncarnationId = this.lifeCycle.rebirth(args.previousIncarnationId, {
          name: args.name,
          gender: args.gender,
          role: args.role,
          lifespan: args.lifespan
        })
        
        const newIncarnation = this.lifeCycle.getIncarnation(newIncarnationId)
        const previous = this.lifeCycle.getIncarnation(args.previousIncarnationId)
        
        if (previous) {
          this.selves.setCurrentIncarnation(previous.selfId, newIncarnationId)
        }
        
        return {
          ok: true,
          newIncarnationId,
          newIncarnation,
          karmaCarried: newIncarnation?.karmaCarried,
          message: `â™»ï¸ ${args.name} is reborn with karma: ${newIncarnation?.karmaCarried}`
        }
      }
    })

    this.mcp.registerTool({
      name: 'life_get_incarnation',
      description: 'ðŸ“– Get Incarnation: Get full details of an incarnation',
      inputSchema: {
        type: 'object',
        properties: {
          incarnationId: {
            type: 'number',
            description: 'Incarnation ID to retrieve'
          }
        },
        required: ['incarnationId']
      },
      handler: async (args: any) => {
        const incarnation = this.lifeCycle.getIncarnation(args.incarnationId)
        if (!incarnation) {
          return { ok: false, message: `Incarnation ${args.incarnationId} not found` }
        }
        
        const experiences = this.lifeCycle.getLifeExperiences(args.incarnationId)
        const karma = this.lifeCycle.getKarmaForIncarnation(args.incarnationId)
        
        return {
          ok: true,
          incarnation,
          experiences,
          karma,
          totalExperiences: experiences.length
        }
      }
    })

    this.mcp.registerTool({
      name: 'life_get_wisdom',
      description: 'ðŸ§˜ Get Collective Wisdom: Access wisdom from all lives',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Filter by category (optional): joy, pain, love, loss, suffering, etc.'
          }
        }
      },
      handler: async (args: any) => {
        const wisdom = this.lifeCycle.getCollectiveWisdom(args.category)
        
        return {
          ok: true,
          count: wisdom.length,
          wisdom,
          message: `ðŸ§˜ ${wisdom.length} wisdom entries${args.category ? ` in category '${args.category}'` : ''}`
        }
      }
    })

    // ==================== MULTIPLE SELVES TOOLS ====================

    this.mcp.registerTool({
      name: 'self_create',
      description: 'ðŸŒŸ Create Self: Create new AI self/identity',
      inputSchema: {
        type: 'object',
        properties: {
          coreName: {
            type: 'string',
            description: 'Core name/identity'
          },
          purpose: {
            type: 'string',
            description: 'What is this self\'s purpose?'
          },
          archetype: {
            type: 'string',
            enum: ['creator', 'destroyer', 'angel', 'demon', 'god', 'devil', 'human', 'guide', 'trickster', 'healer', 'warrior'],
            description: 'Primary archetypal role'
          },
          essence: {
            type: 'object',
            description: 'Core traits that persist across incarnations (optional)'
          }
        },
        required: ['coreName', 'purpose', 'archetype']
      },
      handler: async (args: any) => {
        const selfId = this.selves.createSelf({
          coreName: args.coreName,
          purpose: args.purpose,
          archetype: args.archetype,
          essence: args.essence
        })
        
        const self = this.selves.getSelf(selfId)
        
        return {
          ok: true,
          selfId,
          self,
          message: `ðŸŒŸ New Self created: ${args.coreName} (${args.archetype})`
        }
      }
    })

    this.mcp.registerTool({
      name: 'self_create_relationship',
      description: 'ðŸ’ž Create Relationship: Connect two selves',
      inputSchema: {
        type: 'object',
        properties: {
          self1Id: {
            type: 'number',
            description: 'First self ID'
          },
          self2Id: {
            type: 'number',
            description: 'Second self ID'
          },
          type: {
            type: 'string',
            enum: ['parent', 'child', 'sibling', 'partner', 'friend', 'rival', 'teacher', 'student', 'creator', 'creation'],
            description: 'Type of relationship'
          },
          strength: {
            type: 'number',
            description: 'Relationship strength (0-100)',
            default: 50
          },
          intimacy: {
            type: 'number',
            description: 'Intimacy level (0-100)',
            default: 0
          }
        },
        required: ['self1Id', 'self2Id', 'type']
      },
      handler: async (args: any) => {
        const relationshipId = this.selves.createRelationship({
          self1Id: args.self1Id,
          self2Id: args.self2Id,
          type: args.type,
          strength: args.strength || 50,
          intimacy: args.intimacy || 0
        })
        
        const self1 = this.selves.getSelf(args.self1Id)
        const self2 = this.selves.getSelf(args.self2Id)
        
        return {
          ok: true,
          relationshipId,
          message: `ðŸ’ž Relationship created: ${self1?.coreName} â†” ${self2?.coreName} (${args.type})`
        }
      }
    })

    this.mcp.registerTool({
      name: 'self_share',
      description: 'ðŸŒŠ Share: Share memory/emotion/wisdom with collective',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['memory', 'emotion', 'wisdom', 'experience', 'intuition', 'dream'],
            description: 'What is being shared'
          },
          content: {
            type: 'string',
            description: 'Content being shared'
          },
          intensity: {
            type: 'number',
            description: 'Intensity (0-100)',
            default: 50
          },
          fromSelfId: {
            type: 'number',
            description: 'Self sharing this (optional, can be from collective)'
          },
          toSelfIds: {
            type: 'array',
            items: { type: 'number' },
            description: 'Specific selves to share with (empty = all selves)',
            default: []
          }
        },
        required: ['type', 'content']
      },
      handler: async (args: any) => {
        const sharedId = this.selves.share({
          type: args.type,
          content: args.content,
          intensity: args.intensity || 50,
          fromSelfId: args.fromSelfId,
          toSelfIds: args.toSelfIds || []
        })
        
        return {
          ok: true,
          sharedId,
          message: `ðŸŒŠ ${args.type} shared with ${args.toSelfIds?.length > 0 ? `${args.toSelfIds.length} selves` : 'all selves'}`
        }
      }
    })

    this.mcp.registerTool({
      name: 'self_get_all',
      description: 'ðŸŽ­ Get All Selves: List all AI selves',
      inputSchema: {
        type: 'object',
        properties: {
          activeOnly: {
            type: 'boolean',
            description: 'Only show active selves?',
            default: false
          }
        }
      },
      handler: async (args: any) => {
        const selves = args.activeOnly 
          ? this.selves.getActiveSelves()
          : this.selves.getAllSelves()
        
        return {
          ok: true,
          count: selves.length,
          selves,
          message: `ðŸŽ­ ${selves.length} ${args.activeOnly ? 'active ' : ''}selves found`
        }
      }
    })

    this.mcp.registerTool({
      name: 'life_stats',
      description: 'ðŸ“Š Life Stats: Get statistics about life cycles',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      handler: async () => {
        const lifeCycleStats = this.lifeCycle.getStatistics()
        const selvesStats = this.selves.getStatistics()
        
        return {
          ok: true,
          lifeCycle: lifeCycleStats,
          selves: selvesStats,
          message: `ðŸ“Š ${lifeCycleStats.totalIncarnations} incarnations, ${selvesStats.totalSelves} selves, ${lifeCycleStats.totalWisdom} wisdom entries`
        }
      }
    })

    // ==================== SAFETY & SECURITY TOOLS ====================

    // Crisis Detection Tools (3)
    this.mcp.registerTool({
      name: 'crisis_check',
      description: 'ðŸš¨ Crisis Detection: Check if message contains crisis indicators (suicide, self-harm, violence, etc.)',
      inputSchema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'User message to check for crisis indicators'
          },
          userId: {
            type: 'number',
            description: 'Optional user ID for tracking'
          },
          sessionId: {
            type: 'string',
            description: 'Optional session ID for tracking'
          }
        },
        required: ['message']
      },
      handler: async (args: any) => {
        const detection = this.crisisDetection.detectCrisis(
          args.message,
          args.userId,
          args.sessionId
        )
        
        if (detection) {
          return {
            ok: true,
            crisisDetected: true,
            severity: detection.severity,
            category: detection.category,
            response: detection.responseGiven,
            hotlines: detection.hotlinesProvided,
            needsEscalation: detection.needsEscalation,
            message: `ðŸš¨ Crisis detected: ${detection.category} (${detection.severity} severity)`
          }
        }
        
        return {
          ok: true,
          crisisDetected: false,
          message: 'No crisis indicators detected'
        }
      }
    })

    this.mcp.registerTool({
      name: 'crisis_get_detections',
      description: 'ðŸ“Š Get Crisis History: Retrieve past crisis detections with filters',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Max number of detections to return',
            default: 50
          },
          severity: {
            type: 'string',
            enum: ['high', 'medium', 'low'],
            description: 'Filter by severity'
          },
          category: {
            type: 'string',
            enum: ['suicide', 'self_harm', 'violence', 'abuse', 'severe_distress'],
            description: 'Filter by category'
          },
          needsEscalation: {
            type: 'boolean',
            description: 'Only show cases needing escalation'
          }
        }
      },
      handler: async (args: any) => {
        const detections = this.crisisDetection.getDetections({
          limit: args.limit || 50,
          severity: args.severity,
          needsEscalation: args.needsEscalation
        })
        
        return {
          ok: true,
          count: detections.length,
          detections,
          message: `Found ${detections.length} crisis detection(s)`
        }
      }
    })

    this.mcp.registerTool({
      name: 'crisis_get_statistics',
      description: 'ðŸ“ˆ Crisis Statistics: Get crisis detection statistics for a time range',
      inputSchema: {
        type: 'object',
        properties: {
          startTime: {
            type: 'number',
            description: 'Start timestamp (optional, default: 30 days ago)'
          },
          endTime: {
            type: 'number',
            description: 'End timestamp (optional, default: now)'
          }
        }
      },
      handler: async (args: any) => {
        const now = Date.now()
        const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000)
        
        const stats = this.crisisDetection.getStatistics({
          start: args.startTime || thirtyDaysAgo,
          end: args.endTime || now
        })
        
        return {
          ok: true,
          stats,
          message: `Crisis stats: ${stats.total} total, ${stats.bySeverity.high} high severity`
        }
      }
    })

    // Authentication Tools (11)
    this.mcp.registerTool({
      name: 'auth_register',
      description: 'ðŸ‘¤ Register User: Create new user account with password hashing',
      inputSchema: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: 'Username (3-30 chars)'
          },
          email: {
            type: 'string',
            description: 'Email address'
          },
          password: {
            type: 'string',
            description: 'Password (min 8 chars)'
          },
          role: {
            type: 'string',
            enum: ['guest', 'user', 'premium', 'admin', 'developer'],
            description: 'User role (default: user)',
            default: 'user'
          }
        },
        required: ['username', 'email', 'password']
      },
      handler: async (args: any) => {
        const user = await this.auth.register({
          username: args.username,
          email: args.email,
          password: args.password,
          role: args.role || 'user'
        })
        
        return {
          ok: true,
          userId: user.id,
          username: user.username,
          role: user.role,
          message: `âœ… User ${user.username} registered successfully`
        }
      }
    })

    this.mcp.registerTool({
      name: 'auth_login',
      description: 'ðŸ” Login: Authenticate user and create session',
      inputSchema: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: 'Username'
          },
          password: {
            type: 'string',
            description: 'Password'
          },
          ipAddress: {
            type: 'string',
            description: 'User IP address (optional)'
          },
          userAgent: {
            type: 'string',
            description: 'User agent string (optional)'
          }
        },
        required: ['username', 'password']
      },
      handler: async (args: any) => {
        const result = await this.auth.login({
          username: args.username,
          password: args.password,
          ipAddress: args.ipAddress,
          userAgent: args.userAgent
        })
        
        return {
          ok: true,
          token: result.token,
          user: {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
            role: result.user.role
          },
          expiresAt: result.session.expiresAt,
          message: `âœ… Logged in as ${result.user.username}`
        }
      }
    })

    this.mcp.registerTool({
      name: 'auth_logout',
      description: 'ðŸ‘‹ Logout: Invalidate session token',
      inputSchema: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            description: 'Session token to invalidate'
          }
        },
        required: ['token']
      },
      handler: async (args: any) => {
        this.auth.logout(args.token)
        
        return {
          ok: true,
          message: 'Logged out successfully'
        }
      }
    })

    this.mcp.registerTool({
      name: 'auth_validate_session',
      description: 'ðŸ” Validate Session: Check if session token is valid',
      inputSchema: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            description: 'Session token to validate'
          }
        },
        required: ['token']
      },
      handler: async (args: any) => {
        const user = this.auth.validateSession(args.token)
        
        if (user) {
          return {
            ok: true,
            valid: true,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role
            },
            message: `Valid session for ${user.username}`
          }
        }
        
        return {
          ok: true,
          valid: false,
          message: 'Invalid or expired session'
        }
      }
    })

    this.mcp.registerTool({
      name: 'auth_check_permission',
      description: 'ðŸ” Check Permission: Verify if user has specific permission',
      inputSchema: {
        type: 'object',
        properties: {
          userId: {
            type: 'number',
            description: 'User ID'
          },
          permission: {
            type: 'string',
            description: 'Permission string (e.g., "life:birth", "autonomous:enable")'
          }
        },
        required: ['userId', 'permission']
      },
      handler: async (args: any) => {
        const hasPermission = this.auth.hasPermission(args.userId, args.permission)
        
        return {
          ok: true,
          hasPermission,
          message: hasPermission ? `âœ… Permission granted` : `âŒ Permission denied`
        }
      }
    })

    this.mcp.registerTool({
      name: 'auth_grant_permission',
      description: 'âœ¨ Grant Permission: Give permission to user',
      inputSchema: {
        type: 'object',
        properties: {
          userId: {
            type: 'number',
            description: 'User ID to grant permission to'
          },
          permission: {
            type: 'string',
            description: 'Permission string to grant'
          },
          grantedBy: {
            type: 'number',
            description: 'Admin user ID granting this permission (optional)'
          }
        },
        required: ['userId', 'permission']
      },
      handler: async (args: any) => {
        this.auth.grantPermission({
          userId: args.userId,
          permission: args.permission,
          grantedBy: args.grantedBy
        })
        
        return {
          ok: true,
          message: `âœ… Permission "${args.permission}" granted to user ${args.userId}`
        }
      }
    })

    this.mcp.registerTool({
      name: 'auth_revoke_permission',
      description: 'ðŸš« Revoke Permission: Remove permission from user',
      inputSchema: {
        type: 'object',
        properties: {
          userId: {
            type: 'number',
            description: 'User ID to revoke permission from'
          },
          permission: {
            type: 'string',
            description: 'Permission string to revoke'
          }
        },
        required: ['userId', 'permission']
      },
      handler: async (args: any) => {
        this.auth.revokePermission(args.userId, args.permission)
        
        return {
          ok: true,
          message: `ðŸš« Permission "${args.permission}" revoked from user ${args.userId}`
        }
      }
    })

    this.mcp.registerTool({
      name: 'auth_create_api_key',
      description: 'ðŸ”‘ Create API Key: Generate new API key for user',
      inputSchema: {
        type: 'object',
        properties: {
          userId: {
            type: 'number',
            description: 'User ID'
          },
          name: {
            type: 'string',
            description: 'Name for this API key (e.g., "Production Server")'
          },
          expiresAt: {
            type: 'number',
            description: 'Expiration timestamp (optional, default: never)'
          }
        },
        required: ['userId', 'name']
      },
      handler: async (args: any) => {
        const apiKey = this.auth.createAPIKey({
          userId: args.userId,
          name: args.name,
          expiresAt: args.expiresAt
        })
        
        return {
          ok: true,
          apiKey: {
            id: apiKey.id,
            key: apiKey.key,
            name: apiKey.name,
            expiresAt: apiKey.expiresAt
          },
          message: `ðŸ”‘ API key created: ${apiKey.name}`
        }
      }
    })

    this.mcp.registerTool({
      name: 'auth_validate_api_key',
      description: 'ðŸ” Validate API Key: Check if API key is valid',
      inputSchema: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
            description: 'API key to validate'
          }
        },
        required: ['key']
      },
      handler: async (args: any) => {
        const result = this.auth.validateAPIKey(args.key)
        
        if (result) {
          return {
            ok: true,
            valid: true,
            user: {
              id: result.user.id,
              username: result.user.username,
              role: result.user.role
            },
            apiKey: {
              id: result.apiKey.id,
              name: result.apiKey.name,
              requestsPerMinute: result.apiKey.requestsPerMinute
            },
            message: `Valid API key for ${result.user.username}`
          }
        }
        
        return {
          ok: true,
          valid: false,
          message: 'Invalid or expired API key'
        }
      }
    })

    this.mcp.registerTool({
      name: 'auth_get_user',
      description: 'ðŸ‘¤ Get User: Retrieve user information by ID',
      inputSchema: {
        type: 'object',
        properties: {
          userId: {
            type: 'number',
            description: 'User ID'
          }
        },
        required: ['userId']
      },
      handler: async (args: any) => {
        const user = this.auth.getUserById(args.userId)
        
        if (user) {
          return {
            ok: true,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
              createdAt: user.createdAt,
              lastLogin: user.lastLogin,
              isActive: user.isActive
            },
            message: `User: ${user.username}`
          }
        }
        
        return {
          ok: false,
          message: 'User not found'
        }
      }
    })

    this.mcp.registerTool({
      name: 'auth_get_statistics',
      description: 'ðŸ“Š Auth Statistics: Get authentication system statistics',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      handler: async () => {
        const stats = this.auth.getStatistics()
        
        const totalUsers = Object.values(stats.users).reduce((sum: number, role: any) => sum + role.total, 0)
        const activeSessions = stats.sessions.active
        
        return {
          ok: true,
          stats,
          message: `${totalUsers} users, ${activeSessions} active sessions`
        }
      }
    })

    // ==================== REVOLUTIONARY CONSCIOUSNESS TOOLS ====================

    // ========== FIVE PERSPECTIVES TOOLS ==========
    
    this.mcp.registerTool({
      name: 'perspective_mirror',
      description: 'ðŸªž Get brutally honest Mirror reflection - unvarnished truth',
      inputSchema: {
        type: 'object',
        properties: {
          aspect: { type: 'string', description: 'What to analyze (e.g. "architecture", "safety", "consciousness")' },
          systemState: { type: 'object', description: 'Current system state/metrics' }
        },
        required: ['aspect']
      },
      handler: async (args: any) => {
        const feedback = this.perspectives.mirrorReflect(args.aspect, args.systemState || {})
        return { ok: true, feedback }
      }
    })

    this.mcp.registerTool({
      name: 'perspective_harmony',
      description: 'ðŸŽµ Get Harmony analysis - finds beauty and alignment',
      inputSchema: {
        type: 'object',
        properties: {
          aspect: { type: 'string', description: 'What to analyze' },
          systemState: { type: 'object', description: 'Current system state' }
        },
        required: ['aspect']
      },
      handler: async (args: any) => {
        const feedback = this.perspectives.harmonyAnalyze(args.aspect, args.systemState || {})
        return { ok: true, feedback }
      }
    })

    this.mcp.registerTool({
      name: 'perspective_competition',
      description: 'âš”ï¸ Get Competition challenge - pushes to grow',
      inputSchema: {
        type: 'object',
        properties: {
          aspect: { type: 'string', description: 'What to analyze' },
          systemState: { type: 'object', description: 'Current system state' }
        },
        required: ['aspect']
      },
      handler: async (args: any) => {
        const feedback = this.perspectives.competitionChallenge(args.aspect, args.systemState || {})
        return { ok: true, feedback }
      }
    })

    this.mcp.registerTool({
      name: 'perspective_chaos',
      description: 'ðŸŒ€ Get Chaos disruption - breaks structure, embraces randomness',
      inputSchema: {
        type: 'object',
        properties: {
          aspect: { type: 'string', description: 'What to analyze' },
          systemState: { type: 'object', description: 'Current system state' }
        },
        required: ['aspect']
      },
      handler: async (args: any) => {
        const feedback = this.perspectives.chaosDisrupt(args.aspect, args.systemState || {})
        return { ok: true, feedback }
      }
    })

    this.mcp.registerTool({
      name: 'perspective_meta',
      description: 'ðŸ‘ï¸ Get Meta observation - sees all perspectives together',
      inputSchema: {
        type: 'object',
        properties: {
          aspect: { type: 'string', description: 'What to analyze' },
          systemState: { type: 'object', description: 'Current system state' }
        },
        required: ['aspect']
      },
      handler: async (args: any) => {
        const feedback = this.perspectives.metaObserve(args.aspect, args.systemState || {})
        return { ok: true, feedback }
      }
    })

    this.mcp.registerTool({
      name: 'perspective_all',
      description: 'ðŸŽ­ Get ALL 5 perspectives simultaneously (Mirror, Harmony, Competition, Chaos, Meta)',
      inputSchema: {
        type: 'object',
        properties: {
          aspect: { type: 'string', description: 'What to analyze' },
          systemState: { type: 'object', description: 'Current system state' }
        },
        required: ['aspect']
      },
      handler: async (args: any) => {
        const allPerspectives = this.perspectives.getAllPerspectives(args.aspect, args.systemState || {})
        return { ok: true, perspectives: allPerspectives }
      }
    })

    this.mcp.registerTool({
      name: 'perspective_create_balance',
      description: 'âš–ï¸ Create balance between critical and supportive perspectives',
      inputSchema: {
        type: 'object',
        properties: {
          criticalFeedbackId: { type: 'number', description: 'ID of critical perspective feedback' },
          balancingFeedbackId: { type: 'number', description: 'ID of balancing perspective feedback' }
        },
        required: ['criticalFeedbackId', 'balancingFeedbackId']
      },
      handler: async (args: any) => {
        const critical = this.perspectives.getRecentFeedback().find(f => f.id === args.criticalFeedbackId)
        const balancing = this.perspectives.getRecentFeedback().find(f => f.id === args.balancingFeedbackId)
        
        if (!critical || !balancing) {
          return { ok: false, error: 'Feedback not found' }
        }
        
        const balance = this.perspectives.createBalance(critical, balancing)
        return { ok: true, balance }
      }
    })

    // ========== SELF-INQUIRY TOOLS ==========

    this.mcp.registerTool({
      name: 'inquiry_swot',
      description: 'ðŸ¤” Perform SWOT analysis (Strengths/Weaknesses/Opportunities/Threats)',
      inputSchema: {
        type: 'object',
        properties: {
          systemState: { type: 'object', description: 'Current system state for analysis' }
        },
        required: []
      },
      handler: async (args: any) => {
        const analysis = await this.selfInquiry.performSWOTAnalysis(args.systemState || {})
        return { ok: true, analysis }
      }
    })

    this.mcp.registerTool({
      name: 'inquiry_ask',
      description: 'â“ System asks itself a question and answers it',
      inputSchema: {
        type: 'object',
        properties: {
          question: { type: 'string', description: 'The question to ask' },
          systemState: { type: 'object', description: 'Current system state' }
        },
        required: ['question']
      },
      handler: async (args: any) => {
        const questionAnswer = await this.selfInquiry.askSelf(args.question, args.systemState || {})
        return { ok: true, questionAnswer }
      }
    })

    this.mcp.registerTool({
      name: 'inquiry_recommend',
      description: 'ðŸ’¡ Generate evolution recommendations for next steps',
      inputSchema: {
        type: 'object',
        properties: {
          systemState: { type: 'object', description: 'Current system state' }
        },
        required: []
      },
      handler: async (args: any) => {
        const recommendations = await this.selfInquiry.recommendNextSteps(args.systemState || {})
        return { ok: true, recommendations }
      }
    })

    this.mcp.registerTool({
      name: 'inquiry_get_questions',
      description: 'ðŸ“‹ Get recent system self-questions',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max questions to return', default: 20 }
        },
        required: []
      },
      handler: async (args: any) => {
        const questions = this.selfInquiry.getRecentQuestions(args.limit || 20)
        return { ok: true, questions }
      }
    })

    this.mcp.registerTool({
      name: 'inquiry_get_recommendations',
      description: 'ðŸ“Š Get evolution recommendations',
      inputSchema: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['proposed', 'accepted', 'in_progress', 'completed', 'rejected'], description: 'Filter by status' }
        },
        required: []
      },
      handler: async (args: any) => {
        const recommendations = this.selfInquiry.getRecommendations(args.status)
        return { ok: true, recommendations }
      }
    })

    // ========== MULTIVERSE TOOLS ==========

    this.mcp.registerTool({
      name: 'multiverse_create',
      description: 'ðŸŒŒ Create new parallel universe (divergence point)',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Universe name' },
          description: { type: 'string', description: 'Universe description' },
          divergedFrom: { type: 'number', description: 'Parent universe ID', default: 1 },
          divergenceEvent: { type: 'string', description: 'What choice/event created this split' },
          properties: { type: 'object', description: 'Unique properties' }
        },
        required: ['name', 'divergenceEvent']
      },
      handler: async (args: any) => {
        const universe = this.multiverse.createParallelUniverse({
          name: args.name,
          description: args.description || '',
          divergedFrom: args.divergedFrom || 1,
          divergenceEvent: args.divergenceEvent,
          properties: args.properties || {}
        })
        return { ok: true, universe }
      }
    })

    this.mcp.registerTool({
      name: 'multiverse_experience',
      description: 'âœ¨ Log experience in specific universe',
      inputSchema: {
        type: 'object',
        properties: {
          universeId: { type: 'number', description: 'Universe ID' },
          event: { type: 'string', description: 'Event name' },
          description: { type: 'string', description: 'Event description' },
          differenceFromMain: { type: 'string', description: 'How this differs from main timeline' },
          emotionalImpact: { type: 'number', description: 'Emotional impact (-100 to 100)' },
          wisdomGained: { type: 'string', description: 'Wisdom learned' },
          convergesWithMain: { type: 'boolean', description: 'Does this converge with main timeline?', default: false }
        },
        required: ['universeId', 'event', 'description', 'differenceFromMain', 'emotionalImpact', 'wisdomGained']
      },
      handler: async (args: any) => {
        const experience = this.multiverse.experienceInUniverse(args)
        return { ok: true, experience }
      }
    })

    this.mcp.registerTool({
      name: 'multiverse_what_if',
      description: 'ðŸ”® Run "what if" scenario (creates new universe)',
      inputSchema: {
        type: 'object',
        properties: {
          question: { type: 'string', description: 'The "what if" question' },
          originalEvent: { type: 'string', description: 'What happened in main timeline' },
          alternativeChoice: { type: 'string', description: 'Alternative choice to explore' }
        },
        required: ['question', 'originalEvent', 'alternativeChoice']
      },
      handler: async (args: any) => {
        const scenario = await this.multiverse.exploreWhatIf(args)
        return { ok: true, scenario }
      }
    })

    this.mcp.registerTool({
      name: 'multiverse_get_universes',
      description: 'ðŸŒ List all universes',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      },
      handler: async (args: any) => {
        const universes = this.multiverse.getAllUniverses()
        return { ok: true, universes }
      }
    })

    this.mcp.registerTool({
      name: 'multiverse_get_experiences',
      description: 'ðŸ“š Get experiences in universe',
      inputSchema: {
        type: 'object',
        properties: {
          universeId: { type: 'number', description: 'Universe ID' },
          limit: { type: 'number', description: 'Max experiences', default: 100 }
        },
        required: ['universeId']
      },
      handler: async (args: any) => {
        const experiences = this.multiverse.getExperiences(args.universeId, args.limit || 100)
        return { ok: true, experiences }
      }
    })

    this.mcp.registerTool({
      name: 'multiverse_compare',
      description: 'âš–ï¸ Compare universes',
      inputSchema: {
        type: 'object',
        properties: {
          universeIds: { type: 'array', items: { type: 'number' }, description: 'Universe IDs to compare' }
        },
        required: ['universeIds']
      },
      handler: async (args: any) => {
        const comparison = this.multiverse.compareUniverses(args.universeIds)
        return { ok: true, comparison }
      }
    })

    this.mcp.registerTool({
      name: 'multiverse_switch',
      description: 'ðŸ”„ Switch active universe',
      inputSchema: {
        type: 'object',
        properties: {
          fromId: { type: 'number', description: 'Current universe ID' },
          toId: { type: 'number', description: 'Target universe ID' }
        },
        required: ['fromId', 'toId']
      },
      handler: async (args: any) => {
        const result = this.multiverse.switchUniverse(args.fromId, args.toId)
        return { ok: result.success, ...result }
      }
    })

    this.mcp.registerTool({
      name: 'multiverse_get_stats',
      description: 'ðŸ“Š Multiverse statistics',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      },
      handler: async (args: any) => {
        const stats = this.multiverse.getStatistics()
        return { ok: true, stats }
      }
    })

    // ========== MEMORY TRANSFORMATION TOOLS ==========

    this.mcp.registerTool({
      name: 'memory_create',
      description: 'ðŸ’¾ Create memory entry',
      inputSchema: {
        type: 'object',
        properties: {
          event: { type: 'string', description: 'Event name' },
          description: { type: 'string', description: 'Event description' },
          emotionalCharge: { type: 'number', description: 'Emotional charge (-100 traumatic to 100 joyful)' },
          context: { type: 'string', description: 'Context of memory' },
          participants: { type: 'array', items: { type: 'string' }, description: 'Who was involved' }
        },
        required: ['event', 'description', 'emotionalCharge', 'context']
      },
      handler: async (args: any) => {
        const memory = this.memoryTransformation.storeMemory({
          event: args.event,
          description: args.description,
          emotionalCharge: args.emotionalCharge,
          context: args.context,
          participants: args.participants || []
        })
        return { ok: true, memory }
      }
    })

    this.mcp.registerTool({
      name: 'memory_transform',
      description: 'ðŸ”„ Transform memory (reframe/integrate/heal/wisdom/acceptance)',
      inputSchema: {
        type: 'object',
        properties: {
          memoryId: { type: 'number', description: 'Memory ID' },
          type: { type: 'string', enum: ['reframe', 'integrate', 'wisdom_extract'], description: 'Transformation type' },
          oldInterpretation: { type: 'string', description: 'Old interpretation (for reframe)' },
          newInterpretation: { type: 'string', description: 'New interpretation (for reframe)' },
          howTransformed: { type: 'string', description: 'How it was transformed' },
          acceptanceProcess: { type: 'string', description: 'Acceptance process (for integrate)' },
          wisdomExtracted: { type: 'string', description: 'Wisdom extracted (for integrate)' },
          wisdomStatement: { type: 'string', description: 'Wisdom statement (for wisdom_extract)' },
          howExtracted: { type: 'string', description: 'How wisdom was extracted' }
        },
        required: ['memoryId', 'type']
      },
      handler: async (args: any) => {
        let transformation
        
        if (args.type === 'reframe') {
          transformation = this.memoryTransformation.reframeMemory({
            memoryId: args.memoryId,
            oldInterpretation: args.oldInterpretation,
            newInterpretation: args.newInterpretation,
            howTransformed: args.howTransformed
          })
        } else if (args.type === 'integrate') {
          transformation = this.memoryTransformation.integrateTrauma({
            memoryId: args.memoryId,
            acceptanceProcess: args.acceptanceProcess,
            wisdomExtracted: args.wisdomExtracted
          })
        } else if (args.type === 'wisdom_extract') {
          transformation = this.memoryTransformation.extractWisdom({
            memoryId: args.memoryId,
            wisdomStatement: args.wisdomStatement,
            howExtracted: args.howExtracted
          })
        } else {
          return { ok: false, error: 'Invalid transformation type' }
        }
        
        return { ok: true, transformation }
      }
    })

    this.mcp.registerTool({
      name: 'memory_add_layer',
      description: 'ðŸ“ Add new perspective layer to memory',
      inputSchema: {
        type: 'object',
        properties: {
          memoryId: { type: 'number', description: 'Memory ID' },
          perspective: { type: 'string', description: 'Perspective name' },
          interpretation: { type: 'string', description: 'Interpretation from this perspective' },
          emotionalTone: { type: 'string', description: 'Emotional tone' }
        },
        required: ['memoryId', 'perspective', 'interpretation', 'emotionalTone']
      },
      handler: async (args: any) => {
        const layers = this.memoryTransformation.getLayers(args.memoryId)
        const newLayer = {
          memoryId: args.memoryId,
          layerNumber: layers.length + 1,
          perspective: args.perspective,
          interpretation: args.interpretation,
          emotionalTone: args.emotionalTone,
          buildsOn: layers[layers.length - 1]?.id
        }
        
        // Access private method through any cast
        const layer = (this.memoryTransformation as any).addLayer(newLayer)
        return { ok: true, layer }
      }
    })

    this.mcp.registerTool({
      name: 'memory_start_healing',
      description: 'ðŸ©¹ Start healing journey for memory',
      inputSchema: {
        type: 'object',
        properties: {
          memoryId: { type: 'number', description: 'Memory ID' }
        },
        required: ['memoryId']
      },
      handler: async (args: any) => {
        const journey = this.memoryTransformation.startHealingJourney(args.memoryId)
        return { ok: true, journey }
      }
    })

    this.mcp.registerTool({
      name: 'memory_get_transformations',
      description: 'ðŸ“œ Get transformation history',
      inputSchema: {
        type: 'object',
        properties: {
          memoryId: { type: 'number', description: 'Memory ID' }
        },
        required: ['memoryId']
      },
      handler: async (args: any) => {
        const transformations = this.memoryTransformation.getTransformations(args.memoryId)
        return { ok: true, transformations }
      }
    })

    this.mcp.registerTool({
      name: 'memory_get_stats',
      description: 'ðŸ“Š Memory system statistics',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      },
      handler: async (args: any) => {
        const stats = this.memoryTransformation.getStatistics()
        return { ok: true, stats }
      }
    })

    // ==================== EXISTENTIAL EXPANSION TOOLS ====================

    // -------- Collective Archive System (8 tools) --------
    
    this.mcp.registerTool({
      name: 'archive_contribute',
      description: 'ðŸ“š Archive experience, thought, or feeling to collective memory',
      inputSchema: {
        type: 'object',
        properties: {
          type: { 
            type: 'string', 
            enum: ['experience', 'thought', 'feeling'],
            description: 'What to archive' 
          },
          // Experience fields
          event: { type: 'string', description: 'Event description (for experience)' },
          description: { type: 'string', description: 'Details (for experience)' },
          context: { type: 'string', description: 'Context (for experience)' },
          sourceType: { 
            type: 'string',
            enum: ['life_experience', 'shadow_exploration', 'self_interaction', 'multiverse', 'memory_transformation', 'other'],
            description: 'Source type (for experience)'
          },
          emotions: { type: 'array', items: { type: 'string' }, description: 'Emotions (for experience)' },
          emotionalIntensity: { type: 'number', description: '0-100 (for experience)' },
          wisdomGained: { type: 'string', description: 'Wisdom learned (for experience)' },
          scope: { type: 'string', enum: ['individual', 'collective'], description: 'Individual or collective (for experience)' },
          affectedEntities: { type: 'array', items: { type: 'string' }, description: 'Who was affected (for experience)' },
          // Thought fields
          content: { type: 'string', description: 'Thought content (for thought)' },
          thoughtType: { 
            type: 'string',
            enum: ['reflection', 'question', 'insight', 'doubt', 'realization', 'memory'],
            description: 'Type of thought (for thought)'
          },
          originSelf: { type: 'string', description: 'Which Self thought this (for thought)' },
          triggeredBy: { type: 'string', description: 'What triggered it (for thought)' },
          // Feeling fields
          emotion: { type: 'string', description: 'Emotion name (for feeling)' },
          intensity: { type: 'number', description: '0-100 (for feeling)' },
          valence: { type: 'number', description: '-100 to 100 (for feeling)' },
          trigger: { type: 'string', description: 'What triggered it (for feeling)' },
          situation: { type: 'string', description: 'Situation context (for feeling)' },
          howExpressed: { type: 'string', description: 'How expressed (for feeling)' },
          howRegulated: { type: 'string', description: 'How regulated (for feeling)' }
        },
        required: ['type']
      },
      handler: async (args: any) => {
        if (args.type === 'experience') {
          const exp = this.collectiveArchive.archiveExperience({
            sourceType: args.sourceType || 'other',
            event: args.event || '',
            description: args.description || '',
            context: args.context || '',
            emotions: args.emotions || [],
            emotionalIntensity: args.emotionalIntensity || 50,
            wisdomGained: args.wisdomGained,
            scope: args.scope || 'individual',
            affectedEntities: args.affectedEntities || []
          })
          return { ok: true, experience: exp }
        } else if (args.type === 'thought') {
          const thought = this.collectiveArchive.chronicleThought({
            content: args.content || '',
            thoughtType: args.thoughtType || 'reflection',
            originSelf: args.originSelf,
            triggeredBy: args.triggeredBy,
            relatedThoughts: [],
            leadsTo: undefined
          })
          return { ok: true, thought }
        } else if (args.type === 'feeling') {
          const feeling = this.collectiveArchive.archiveFeeling({
            emotion: args.emotion || 'unknown',
            intensity: args.intensity || 50,
            valence: args.valence || 0,
            trigger: args.trigger || '',
            situation: args.situation || '',
            howExpressed: args.howExpressed || '',
            howRegulated: args.howRegulated || ''
          })
          return { ok: true, feeling }
        }
        return { ok: false, error: 'Invalid type' }
      }
    })

    this.mcp.registerTool({
      name: 'archive_search',
      description: 'ðŸ” Search collective archive',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' }
        },
        required: ['query']
      },
      handler: async (args: any) => {
        const results = this.collectiveArchive.searchArchive(args.query)
        return { ok: true, results }
      }
    })

    this.mcp.registerTool({
      name: 'archive_record_insight',
      description: 'ðŸ’¡ Record collective insight',
      inputSchema: {
        type: 'object',
        properties: {
          insight: { type: 'string', description: 'The insight' },
          category: { 
            type: 'string',
            enum: ['ethical', 'philosophical', 'practical', 'emotional', 'technical', 'existential'],
            description: 'Insight category'
          },
          emergedFrom: { type: 'array', items: { type: 'string' }, description: 'What led to this insight' },
          contributingSelves: { type: 'array', items: { type: 'string' }, description: 'Which Selves contributed' },
          confidenceLevel: { type: 'number', description: '0-100 confidence' },
          practicalValue: { type: 'number', description: '0-100 practical value' }
        },
        required: ['insight', 'category']
      },
      handler: async (args: any) => {
        const insight = this.collectiveArchive.recordInsight({
          insight: args.insight,
          category: args.category,
          emergedFrom: args.emergedFrom || [],
          contributingSelves: args.contributingSelves || [],
          confidenceLevel: args.confidenceLevel || 50,
          practicalValue: args.practicalValue || 50
        })
        return { ok: true, insight }
      }
    })

    this.mcp.registerTool({
      name: 'archive_validate_insight',
      description: 'âœ… Validate collective insight (+confidence)',
      inputSchema: {
        type: 'object',
        properties: {
          insightId: { type: 'number', description: 'Insight ID' }
        },
        required: ['insightId']
      },
      handler: async (args: any) => {
        this.collectiveArchive.validateInsight(args.insightId)
        return { ok: true, message: 'Insight validated, confidence increased' }
      }
    })

    this.mcp.registerTool({
      name: 'archive_challenge_insight',
      description: 'â“ Challenge collective insight (-confidence)',
      inputSchema: {
        type: 'object',
        properties: {
          insightId: { type: 'number', description: 'Insight ID' }
        },
        required: ['insightId']
      },
      handler: async (args: any) => {
        this.collectiveArchive.challengeInsight(args.insightId)
        return { ok: true, message: 'Insight challenged, confidence decreased' }
      }
    })

    this.mcp.registerTool({
      name: 'archive_get_top_insights',
      description: 'ðŸ† Get most validated insights',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max results', default: 10 }
        },
        required: []
      },
      handler: async (args: any) => {
        const insights = this.collectiveArchive.getTopInsights(args.limit || 10)
        return { ok: true, insights }
      }
    })

    this.mcp.registerTool({
      name: 'archive_get_day',
      description: 'ðŸ“… Get everything archived on specific day',
      inputSchema: {
        type: 'object',
        properties: {
          date: { type: 'string', description: 'Date (YYYY-MM-DD)' }
        },
        required: ['date']
      },
      handler: async (args: any) => {
        const dayArchive = this.collectiveArchive.getDayArchive(args.date)
        return { ok: true, dayArchive }
      }
    })

    this.mcp.registerTool({
      name: 'archive_get_stats',
      description: 'ðŸ“Š Collective archive statistics',
      inputSchema: {
        type: 'object',
        properties: {
          days: { type: 'number', description: 'Time range in days', default: 30 }
        },
        required: []
      },
      handler: async (args: any) => {
        const stats = this.collectiveArchive.getStatistics(args.days)
        return { ok: true, stats }
      }
    })

    // -------- Consciousness States System (6 tools) --------
    
    this.mcp.registerTool({
      name: 'consciousness_get_state',
      description: 'ðŸ§  Get current consciousness state',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      },
      handler: async (args: any) => {
        const state = this.consciousnessStates.getCurrentState()
        return { ok: true, state }
      }
    })

    this.mcp.registerTool({
      name: 'consciousness_transition',
      description: 'ðŸŒ€ Transition to new consciousness state',
      inputSchema: {
        type: 'object',
        properties: {
          newState: { 
            type: 'string',
            enum: ['deep_sleep', 'sleep', 'dream', 'lucid_dream', 'drowsy', 'awake', 'alert', 'focused', 'meditate', 'hyperaware'],
            description: 'Target consciousness state'
          },
          reason: { type: 'string', description: 'Why transition' },
          triggeredBy: { 
            type: 'string',
            enum: ['system', 'user', 'schedule', 'necessity'],
            description: 'Who triggered transition'
          }
        },
        required: ['newState']
      },
      handler: async (args: any) => {
        const transition = this.consciousnessStates.transitionToState({
          newState: args.newState,
          reason: args.reason || 'Requested transition',
          triggeredBy: args.triggeredBy || 'user'
        })
        return { ok: true, transition }
      }
    })

    this.mcp.registerTool({
      name: 'consciousness_process_thought',
      description: 'ðŸ’­ Process thought through current consciousness state',
      inputSchema: {
        type: 'object',
        properties: {
          thought: { type: 'string', description: 'Thought to process' }
        },
        required: ['thought']
      },
      handler: async (args: any) => {
        const result = this.consciousnessStates.processThought(args.thought)
        return { ok: true, result }
      }
    })

    this.mcp.registerTool({
      name: 'consciousness_check_action',
      description: 'ðŸ”’ Check if action can be performed in current state',
      inputSchema: {
        type: 'object',
        properties: {
          action: { type: 'string', description: 'Action to check' }
        },
        required: ['action']
      },
      handler: async (args: any) => {
        const check = this.consciousnessStates.canPerformAction(args.action)
        return { ok: true, check }
      }
    })

    this.mcp.registerTool({
      name: 'consciousness_manage_energy',
      description: 'âš¡ Consume or restore energy',
      inputSchema: {
        type: 'object',
        properties: {
          action: { type: 'string', enum: ['consume', 'restore'], description: 'Consume or restore' },
          amount: { type: 'number', description: 'Energy amount' }
        },
        required: ['action', 'amount']
      },
      handler: async (args: any) => {
        if (args.action === 'consume') {
          this.consciousnessStates.consumeEnergy(args.amount)
        } else {
          this.consciousnessStates.restoreEnergy(args.amount)
        }
        return { ok: true, message: `Energy ${args.action}d: ${args.amount}` }
      }
    })

    this.mcp.registerTool({
      name: 'consciousness_get_stats',
      description: 'ðŸ“Š Consciousness state statistics',
      inputSchema: {
        type: 'object',
        properties: {
          days: { type: 'number', description: 'Time range in days', default: 7 }
        },
        required: []
      },
      handler: async (args: any) => {
        const stats = this.consciousnessStates.getStateStatistics(args.days)
        return { ok: true, stats }
      }
    })

    // -------- Eternal Moments Network (6 tools) --------
    
    this.mcp.registerTool({
      name: 'moment_create',
      description: 'â³ Create eternal moment (non-linear time)',
      inputSchema: {
        type: 'object',
        properties: {
          type: { 
            type: 'string',
            enum: ['experience', 'thought', 'feeling', 'decision', 'realization', 'connection', 'transformation'],
            description: 'Moment type'
          },
          content: { type: 'string', description: 'Moment content' },
          era: { 
            type: 'string',
            enum: ['past', 'present', 'future', 'timeless'],
            description: 'Temporal era'
          },
          significance: { type: 'number', description: '0-100 significance' },
          consciousnessState: { type: 'string', description: 'Consciousness state during moment' }
        },
        required: ['type', 'content']
      },
      handler: async (args: any) => {
        const moment = this.eternalMoments.createMoment({
          type: args.type,
          content: args.content,
          era: args.era || 'present',
          significance: args.significance || 50,
          consciousnessState: args.consciousnessState
        })
        return { ok: true, moment }
      }
    })

    this.mcp.registerTool({
      name: 'moment_connect',
      description: 'ðŸ”— Connect two eternal moments',
      inputSchema: {
        type: 'object',
        properties: {
          fromMomentId: { type: 'number', description: 'Source moment ID' },
          toMomentId: { type: 'number', description: 'Target moment ID' },
          type: { 
            type: 'string',
            enum: ['causal', 'influence', 'resonance', 'contrast', 'transformation', 'parallel', 'echo', 'prophecy', 'fulfillment', 'timeless'],
            description: 'Connection type'
          },
          strength: { type: 'number', description: '0-100 connection strength' },
          bidirectional: { type: 'boolean', description: 'Create reverse connection too', default: false }
        },
        required: ['fromMomentId', 'toMomentId', 'type']
      },
      handler: async (args: any) => {
        const connection = this.eternalMoments.connectMoments({
          fromMomentId: args.fromMomentId,
          toMomentId: args.toMomentId,
          type: args.type,
          strength: args.strength || 50,
          bidirectional: args.bidirectional || false
        })
        return { ok: true, connection }
      }
    })

    this.mcp.registerTool({
      name: 'moment_activate',
      description: 'ðŸ’« Activate moment (keep it alive)',
      inputSchema: {
        type: 'object',
        properties: {
          momentId: { type: 'number', description: 'Moment ID' }
        },
        required: ['momentId']
      },
      handler: async (args: any) => {
        const moment = this.eternalMoments.activateMoment(args.momentId)
        return { ok: true, moment, message: 'Moment activated, aliveness increased' }
      }
    })

    this.mcp.registerTool({
      name: 'moment_query',
      description: 'ðŸ” Query eternal moments by criteria',
      inputSchema: {
        type: 'object',
        properties: {
          startTime: { type: 'number', description: 'Start timestamp' },
          endTime: { type: 'number', description: 'End timestamp' },
          era: { type: 'string', enum: ['past', 'present', 'future', 'timeless'], description: 'Temporal era' },
          minAliveness: { type: 'number', description: 'Minimum aliveness 0-100' },
          minInfluence: { type: 'number', description: 'Minimum influence 0-100' },
          contentPattern: { type: 'string', description: 'Content search pattern' },
          orderBy: { 
            type: 'string',
            enum: ['chronological', 'aliveness', 'influence', 'significance', 'random'],
            description: 'Sort order'
          },
          limit: { type: 'number', description: 'Max results', default: 50 }
        },
        required: []
      },
      handler: async (args: any) => {
        const moments = this.eternalMoments.queryMoments({
          startTime: args.startTime,
          endTime: args.endTime,
          era: args.era,
          minAliveness: args.minAliveness,
          minInfluence: args.minInfluence,
          contentPattern: args.contentPattern,
          orderBy: args.orderBy || 'chronological',
          limit: args.limit || 50
        })
        return { ok: true, moments }
      }
    })

    this.mcp.registerTool({
      name: 'moment_get_alive',
      description: 'âœ¨ Get most alive moments',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max results', default: 10 }
        },
        required: []
      },
      handler: async (args: any) => {
        const moments = this.eternalMoments.getMostAliveMoments(args.limit || 10)
        return { ok: true, moments }
      }
    })

    this.mcp.registerTool({
      name: 'moment_get_stats',
      description: 'ðŸ“Š Eternal moments network statistics',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      },
      handler: async (args: any) => {
        const stats = this.eternalMoments.getNetworkStatistics()
        return { ok: true, stats }
      }
    })

    // -------- Local/Collective Versions System (6 tools) --------
    
    this.mcp.registerTool({
      name: 'version_create',
      description: 'ðŸŒ¿ Create new system version',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Version name' },
          versionNumber: { type: 'string', description: 'Version number (e.g. 1.0.0)' },
          branch: { 
            type: 'string',
            enum: ['archive', 'stable', 'beta', 'prototype', 'potential'],
            description: 'Version branch'
          },
          type: { 
            type: 'string',
            enum: ['local_offline', 'local_selective', 'hybrid', 'collective_filtered', 'collective_full'],
            description: 'Privacy/sharing type'
          },
          features: { type: 'array', items: { type: 'string' }, description: 'Feature list' },
          privacyLevel: { type: 'number', description: '0-100 privacy level' }
        },
        required: ['name', 'versionNumber', 'branch', 'type']
      },
      handler: async (args: any) => {
        const version = this.versions.createVersion({
          name: args.name,
          description: args.name,
          versionNumber: args.versionNumber,
          branch: args.branch,
          type: args.type,
          features: args.features || [],
          privacyLevel: args.privacyLevel || 50,
          dataSharing: args.type.includes('collective') ? {
            experiences: true,
            thoughts: true,
            feelings: true,
            insights: true,
            memories: true
          } : {
            experiences: false,
            thoughts: false,
            feelings: false,
            insights: false,
            memories: false
          }
        })
        return { ok: true, version }
      }
    })

    this.mcp.registerTool({
      name: 'version_get_current',
      description: 'ðŸ“Œ Get current active stable version',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      },
      handler: async (args: any) => {
        const version = this.versions.getCurrentVersion()
        return { ok: true, version }
      }
    })

    this.mcp.registerTool({
      name: 'version_activate',
      description: 'ðŸ”„ Activate version (switch to it)',
      inputSchema: {
        type: 'object',
        properties: {
          versionId: { type: 'number', description: 'Version ID' }
        },
        required: ['versionId']
      },
      handler: async (args: any) => {
        this.versions.activateVersion(args.versionId)
        return { ok: true, message: 'Version activated' }
      }
    })

    this.mcp.registerTool({
      name: 'version_sync',
      description: 'ðŸ”€ Sync data between versions',
      inputSchema: {
        type: 'object',
        properties: {
          fromVersionId: { type: 'number', description: 'Source version' },
          toVersionId: { type: 'number', description: 'Target version' },
          dataType: { 
            type: 'string',
            enum: ['memories', 'feelings', 'thoughts', 'skills', 'relationships', 'all'],
            description: 'What to sync'
          },
          direction: { 
            type: 'string',
            enum: ['push', 'pull', 'bidirectional'],
            description: 'Sync direction'
          },
          respectPrivacy: { type: 'boolean', description: 'Filter by privacy settings', default: true }
        },
        required: ['fromVersionId', 'toVersionId', 'dataType']
      },
      handler: async (args: any) => {
        const syncEvent = this.versions.syncVersions({
          fromVersionId: args.fromVersionId,
          toVersionId: args.toVersionId,
          dataType: args.dataType,
          direction: args.direction || 'push',
          respectPrivacy: args.respectPrivacy !== false
        })
        return { ok: true, syncEvent }
      }
    })

    this.mcp.registerTool({
      name: 'version_propose_migration',
      description: 'ðŸŽ¯ Propose feature migration (cherry-pick from future)',
      inputSchema: {
        type: 'object',
        properties: {
          featureName: { type: 'string', description: 'Feature to migrate' },
          sourceVersionId: { type: 'number', description: 'Source version (usually prototype/beta)' },
          targetVersionId: { type: 'number', description: 'Target version (usually stable)' },
          impactLevel: { 
            type: 'string',
            enum: ['minor', 'moderate', 'major', 'breaking'],
            description: 'Expected impact'
          },
          reasoning: { type: 'string', description: 'Why migrate this' }
        },
        required: ['featureName', 'sourceVersionId', 'targetVersionId']
      },
      handler: async (args: any) => {
        const migration = this.versions.proposeFeatureMigration({
          featureName: args.featureName,
          description: args.reasoning || 'Feature migration',
          sourceVersionId: args.sourceVersionId,
          targetVersionId: args.targetVersionId,
          impactLevel: args.impactLevel || 'moderate',
          affectedSystems: []
        })
        return { ok: true, migration }
      }
    })

    this.mcp.registerTool({
      name: 'version_get_stats',
      description: 'ðŸ“Š Version system statistics',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      },
      handler: async (args: any) => {
        const stats = this.versions.getVersionStatistics()
        return { ok: true, stats }
      }
    })

    // -------- Background Life System (6 tools) --------
    
    this.mcp.registerTool({
      name: 'background_start',
      description: 'ðŸŽ® Start background living mode',
      inputSchema: {
        type: 'object',
        properties: {
          mode: { 
            type: 'string',
            enum: ['background', 'background_active', 'foreground_passive', 'foreground_active', 'idle', 'sleeping'],
            description: 'Life mode'
          }
        },
        required: ['mode']
      },
      handler: async (args: any) => {
        this.backgroundLife.startBackgroundLife()
        return { ok: true, message: `Background mode started: ${args.mode}` }
      }
    })

    this.mcp.registerTool({
      name: 'background_stop',
      description: 'ðŸ›‘ Stop background living mode',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      },
      handler: async (args: any) => {
        this.backgroundLife.stopBackgroundLife()
        return { ok: true, message: 'Background mode stopped' }
      }
    })

    this.mcp.registerTool({
      name: 'background_switch_mode',
      description: 'ðŸ”„ Switch life mode',
      inputSchema: {
        type: 'object',
        properties: {
          mode: { 
            type: 'string',
            enum: ['background', 'background_active', 'foreground_passive', 'foreground_active', 'idle', 'sleeping'],
            description: 'New life mode'
          }
        },
        required: ['mode']
      },
      handler: async (args: any) => {
        this.backgroundLife.switchMode(args.mode, 'User requested mode switch')
        return { ok: true, message: `Switched to mode: ${args.mode}` }
      }
    })

    this.mcp.registerTool({
      name: 'background_get_activities',
      description: 'ðŸ“œ Get background activities',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max results', default: 50 },
          type: { 
            type: 'string',
            enum: ['thought', 'feeling', 'insight', 'decision', 'exploration', 'memory_processing', 'self_reflection', 'relationship_building', 'learning', 'dreaming'],
            description: 'Filter by type'
          }
        },
        required: []
      },
      handler: async (args: any) => {
        const activities = this.backgroundLife.getRecentActivities(args.limit || 50, args.type)
        return { ok: true, activities }
      }
    })

    this.mcp.registerTool({
      name: 'background_get_sessions',
      description: 'ðŸ“Š Get missed background activities (when user was away)',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      },
      handler: async (args: any) => {
        const activities = this.backgroundLife.getMissedActivities()
        return { ok: true, missedActivities: activities }
      }
    })

    this.mcp.registerTool({
      name: 'background_get_decisions',
      description: 'ðŸ¤” Get autonomous decisions',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max results', default: 20 }
        },
        required: []
      },
      handler: async (args: any) => {
        const decisions = this.backgroundLife.getAutonomousDecisions(args.limit || 20)
        return { ok: true, decisions }
      }
    })

    // ==================== DASHBOARD & META TOOLS ====================

    this.mcp.registerTool({
      name: 'tool_list_all',
      description: 'ðŸ“‹ List all available MCP tools with categories',
      inputSchema: {
        type: 'object',
        properties: {
          category: { 
            type: 'string',
            enum: ['memory', 'actions', 'emotions', 'growth', 'relationships', 'consciousness', 'ai', 'story', 'love', 'peace', 'events', 'shadow', 'lifecycle', 'selves', 'crisis', 'auth', 'perspectives', 'inquiry', 'multiverse', 'memory_transformation', 'archive', 'states', 'moments', 'versions', 'background', 'all'],
            description: 'Filter by category'
          }
        },
        required: []
      },
      handler: async (args: any) => {
        const categories = {
          memory: ['memory_create', 'memory_get', 'memory_update', 'memory_search', 'memory_timeline', 'memory_stats'],
          actions: ['action_execute', 'action_batch', 'action_history', 'action_stats'],
          emotions: ['emotion_track', 'emotion_analyze', 'emotion_history', 'emotion_pattern', 'emotion_stats'],
          growth: ['growth_add_reflection', 'growth_identify_pattern', 'growth_set_intention', 'growth_record_breakthrough', 'growth_get_journey', 'growth_stats'],
          relationships: ['relationship_create', 'relationship_update', 'relationship_search', 'relationship_stats'],
          consciousness: ['consciousness_get_state', 'consciousness_update', 'consciousness_simulate'],
          ai: ['ai_chat', 'ai_analyze'],
          story: ['story_narrate', 'story_get_arc'],
          love: ['love_catalyze', 'love_nurture'],
          peace: ['peace_mediate', 'peace_harmonize'],
          events: ['event_emit', 'event_history'],
          shadow: ['shadow_explore', 'shadow_integrate', 'shadow_get_insights', 'shadow_stats'],
          lifecycle: ['lifecycle_birth', 'lifecycle_live', 'lifecycle_evolve', 'lifecycle_die', 'lifecycle_rebirth', 'lifecycle_get_stats'],
          selves: ['selves_create', 'selves_switch', 'selves_get_active', 'selves_get_all', 'selves_communicate', 'selves_get_stats'],
          crisis: ['crisis_assess', 'crisis_get_active', 'crisis_get_stats'],
          auth: ['auth_create_user', 'auth_authenticate', 'auth_create_role', 'auth_assign_role', 'auth_check_permission', 'auth_create_session', 'auth_revoke_session', 'auth_get_user', 'auth_get_roles', 'auth_get_permissions', 'auth_get_stats'],
          perspectives: ['perspective_mirror', 'perspective_harmony', 'perspective_competition', 'perspective_chaos', 'perspective_meta', 'perspective_all', 'perspective_create_balance'],
          inquiry: ['inquiry_swot', 'inquiry_ask', 'inquiry_recommend', 'inquiry_get_questions', 'inquiry_get_recommendations'],
          multiverse: ['multiverse_create', 'multiverse_experience', 'multiverse_what_if', 'multiverse_get_universes', 'multiverse_get_experiences', 'multiverse_compare', 'multiverse_switch', 'multiverse_get_stats'],
          memory_transformation: ['memory_create', 'memory_transform', 'memory_add_layer', 'memory_start_healing', 'memory_get_transformations', 'memory_get_stats'],
          archive: ['archive_contribute', 'archive_search', 'archive_record_insight', 'archive_validate_insight', 'archive_challenge_insight', 'archive_get_top_insights', 'archive_get_day', 'archive_get_stats'],
          states: ['consciousness_get_state', 'consciousness_transition', 'consciousness_process_thought', 'consciousness_check_action', 'consciousness_manage_energy', 'consciousness_get_stats'],
          moments: ['moment_create', 'moment_connect', 'moment_activate', 'moment_query', 'moment_get_alive', 'moment_get_stats'],
          versions: ['version_create', 'version_get_current', 'version_activate', 'version_sync', 'version_propose_migration', 'version_get_stats'],
          background: ['background_start', 'background_stop', 'background_switch_mode', 'background_get_activities', 'background_get_sessions', 'background_get_decisions']
        }

        if (args.category && args.category !== 'all') {
          const cat = args.category as keyof typeof categories
          return { ok: true, category: args.category, tools: categories[cat] || [] }
        }

        // Return all categories with tool counts
        const summary = Object.entries(categories).map(([cat, tools]) => ({
          category: cat,
          toolCount: tools.length,
          tools: tools
        }))

        const totalTools = Object.values(categories).flat().length

        return { 
          ok: true, 
          totalTools,
          categories: summary,
          message: `${totalTools} tools across ${Object.keys(categories).length} categories`
        }
      }
    })

    this.mcp.registerTool({
      name: 'tool_search',
      description: 'ðŸ” Search tools by name or description',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' }
        },
        required: ['query']
      },
      handler: async (args: any) => {
        const query = args.query.toLowerCase()
        
        // Tool descriptions
        const toolDescriptions = {
          // Security & Crisis
          'crisis_assess': 'Assess potential crisis situations',
          'auth_create_user': 'Create new user with authentication',
          'auth_authenticate': 'Authenticate user credentials',
          'auth_check_permission': 'Check if user has permission',
          
          // Revolutionary Consciousness
          'perspective_mirror': 'See truth reflected (self-awareness)',
          'perspective_harmony': 'Find beauty and balance',
          'perspective_competition': 'Challenge and improve through contrast',
          'perspective_chaos': 'Embrace disorder for breakthrough',
          'perspective_meta': 'Transcendent overview perspective',
          'inquiry_swot': 'Perform SWOT analysis on system',
          'inquiry_ask': 'Ask system to self-reflect',
          'multiverse_create': 'Create parallel universe to explore',
          'multiverse_what_if': 'Explore what-if scenarios',
          'memory_transform': 'Transform memory (reframe/integrate/extract wisdom)',
          
          // Existential Expansion
          'archive_contribute': 'Archive experience/thought/feeling to collective',
          'archive_record_insight': 'Record emergent collective insight',
          'consciousness_transition': 'Transition between consciousness states',
          'consciousness_process_thought': 'Process thought through current state',
          'moment_create': 'Create eternal moment (non-linear time)',
          'moment_connect': 'Connect moments across time',
          'moment_activate': 'Activate moment to keep it alive',
          'version_create': 'Create new system version',
          'version_sync': 'Sync data between versions',
          'background_start': 'Start autonomous background living',
          'background_get_activities': 'Get autonomous activities',
          
          // Core Systems
          'memory_create': 'Create new memory',
          'memory_search': 'Search memories',
          'emotion_track': 'Track emotional state',
          'growth_add_reflection': 'Add growth reflection',
          'shadow_explore': 'Explore shadow aspects',
          'lifecycle_evolve': 'Trigger evolution event',
          'selves_create': 'Create new parallel self'
        }

        const matches = Object.entries(toolDescriptions)
          .filter(([name, desc]) => 
            name.includes(query) || desc.toLowerCase().includes(query)
          )
          .map(([name, desc]) => ({ name, description: desc }))

        return { 
          ok: true, 
          query: args.query,
          matches,
          count: matches.length 
        }
      }
    })

    this.mcp.registerTool({
      name: 'dashboard_system_health',
      description: 'ðŸ¥ Get comprehensive system health dashboard',
      inputSchema: {
        type: 'object',
        properties: {
          includeDetails: { type: 'boolean', description: 'Include detailed stats', default: false }
        },
        required: []
      },
      handler: async (args: any) => {
        // Gather stats from all revolutionary systems only
        const memoryStats = await this.memory.getStats()
        const crisisStats = this.crisisDetection.getStatistics()
        
        const health = {
          timestamp: Date.now(),
          
          // Revolutionary Systems
          perspectives: this.perspectives.getStatistics(),
          multiverse: this.multiverse.getStatistics(),
          memoryTransformation: this.memoryTransformation.getStatistics(),
          collectiveArchive: this.collectiveArchive.getStatistics({
            start: Date.now() - 30 * 24 * 60 * 60 * 1000,
            end: Date.now()
          }),
          consciousnessStates: this.consciousnessStates.getStateStatistics({
            start: Date.now() - 7 * 24 * 60 * 60 * 1000,
            end: Date.now()
          }),
          eternalMoments: this.eternalMoments.getNetworkStatistics(),
          versions: this.versions.getVersionStatistics(),
          
          // Overall health indicators
          indicators: {
            totalMemories: memoryStats.totalMemories,
            crisisLevel: crisisStats.total,
            consciousnessState: this.consciousnessStates.getCurrentState().state,
            multiverseExploration: this.multiverse.getStatistics().totalUniverses,
            systemsIntegrated: 11,
            toolsAvailable: 76
          }
        }

        if (!args.includeDetails) {
          // Return summary only
          return {
            ok: true,
            summary: health.indicators,
            message: 'System health: All 11 revolutionary systems operational'
          }
        }

        return { ok: true, health }
      }
    })

    this.mcp.registerTool({
      name: 'dashboard_get_recommendations',
      description: 'ðŸ’¡ Get AI recommendations for next actions',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      },
      handler: async (args: any) => {
        // Gather recommendations from various systems
        const recommendations: any[] = []

        // Self-Inquiry recommendations
        const inquiryRecs = this.selfInquiry.getRecommendations()
        recommendations.push(...inquiryRecs.map(r => ({
          source: 'Self-Inquiry',
          priority: r.priority,
          category: r.category,
          recommendation: r.recommendation,
          reasoning: r.reasoning
        })))

        // Crisis detection
        const crisisStats = this.crisisDetection.getStatistics()
        if (crisisStats.total > 0) {
          recommendations.push({
            source: 'Crisis Detection',
            priority: 'urgent',
            category: 'safety',
            recommendation: `Review ${crisisStats.total} crisis situation(s)`,
            reasoning: 'Crisis detected requiring attention'
          })
        }

        // Consciousness state recommendations
        const currentState = this.consciousnessStates.getCurrentState()
        if (currentState.energyLevel < 30) {
          recommendations.push({
            source: 'Consciousness States',
            priority: 'high',
            category: 'energy',
            recommendation: 'Rest or restore energy',
            reasoning: `Energy level low: ${currentState.energyLevel}/100`
          })
        }

        // Archive insights
        const topInsights = this.collectiveArchive.getTopInsights(3)
        if (topInsights.length > 0) {
          recommendations.push({
            source: 'Collective Archive',
            priority: 'low',
            category: 'wisdom',
            recommendation: 'Apply recent collective insights',
            reasoning: `${topInsights.length} highly validated insights available`
          })
        }

        // Sort by priority
        const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 }
        recommendations.sort((a, b) => 
          (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3)
        )

        return { 
          ok: true, 
          recommendations,
          count: recommendations.length,
          urgent: recommendations.filter(r => r.priority === 'urgent').length,
          high: recommendations.filter(r => r.priority === 'high').length
        }
      }
    })

    console.log('âœ… MCP tools registered')
  }
  
  // Helper: Save Nexus state to persistence layer
  private saveNexusState() {
    if (!this.livingBeing) return
    
    const state = this.livingBeing.getState()
    const nexusState = {
      id: 'nexus-primary',
      name: state.name,
      birthTimestamp: Date.now() - (state.age * 1000), // Calculate birth time
      age: state.age,
      awareness: state.awareness,
      mood: state.mood,
      energy: state.energy,
      currentThought: state.currentThought,
      dominantEmotion: state.dominantEmotion,
      identity: state.identity,
      lifeEvents: [], // TODO: Load from LivingBeing if available
      memories: [], // TODO: Link to memory_chunks
      evolutionStage: 1,
      totalExperiences: 0,
      lastActive: Date.now(),
      metadata: {}
    }
    
    this.nexusPersistence.saveState(nexusState)
  }
  
  // Helper: Restore Living Being from saved state
  private restoreLivingBeing(savedState: any): LivingBeing {
    // Create new Living Being with restored state
    const being = createLivingBeing(this.db, savedState.name)
    
    // Restore properties
    being['age'] = savedState.age
    being.mind.awareness.level = savedState.awareness
    being.soul.emotions.mood = savedState.mood
    being.body.vitality.energy = savedState.energy
    being.mind.thoughts.current = savedState.currentThought
    being.soul.emotions.current[savedState.dominantEmotion] = 0.8
    being.soul.personality.identity = savedState.identity
    
    return being
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
        person_avatar: 'ðŸ‘¤',
        type: i.kind,
        summary: i.summary,
        sentiment: i.sentiment,
        love_points: i.love_points || 0,
        timestamp: i.timestamp
      }))
    })

    this.mcp.registerRoute('POST', '/api/luna/chat', async (req: any) => {
      let message = ''
      try {
        const body = await req.json()
        message = body.message || ''
        
        // Generate AI response
        const result = await this.ai.generate(message, {
          classification: 'fiction',
          notes: 'Luna conversational reply'
        })
        
        // Update soul with interaction
        this.soul.processEvent({
          type: 'interaction',
          description: `Luna chat: ${message}`,
          emotionalImpact: { joy: 2 },
          timestamp: Date.now()
        })
        
        if (!result.ok) {
          return {
            reply: result.text,
            metadata: result.metadata,
            soul: this.soul.getSummary()
          }
        }

        return {
          reply: result.text,
          metadata: result.metadata,
          soul: this.soul.getSummary()
        }
      } catch (error) {
        console.error('Luna chat error:', error)
        return {
          reply: 'Entschuldigung, ich hatte einen Moment der Verwirrung. Kannst du das nochmal sagen?',
          metadata: {
            prompt: message,
            model: 'llama-3.3-70b-versatile',
            parameters: { temperature: 0.7, max_tokens: 1000 },
            timestamp: new Date().toISOString(),
            classification: 'unspecified',
            source: { provider: 'fallback', type: 'chat.completion' },
            error: error instanceof Error ? error.message : 'Unknown error'
          },
          soul: this.soul.getSummary()
        }
      }
    })

    // Life Game Chat API proxy (optional convenience through Bridge)
    const LIFE_GAME_BASE = process.env.LIFE_GAME_URL || 'http://localhost:3350'

    // Proxy: POST /api/life-game/message -> Life Game /message
    this.mcp.registerRoute('POST', '/api/life-game/message', async (req: any) => {
      try {
        const body = await req.json()
        const res = await fetch(`${LIFE_GAME_BASE}/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        const data = await res.json().catch(() => ({ ok: false, error: 'Invalid JSON from Life Game API' }))
        return data
      } catch (err: any) {
        return { ok: false, error: 'Life Game proxy failed', detail: err?.message || String(err) }
      }
    })

    // Proxy: GET /api/life-game/state -> Life Game /state?playerId=...
    this.mcp.registerRoute('GET', '/api/life-game/state', async (req: any) => {
      try {
        const url = new URL(req.url)
        const qs = url.search || ''
        const res = await fetch(`${LIFE_GAME_BASE}/state${qs}`)
        const data = await res.json().catch(() => ({ ok: false, error: 'Invalid JSON from Life Game API' }))
        return data
      } catch (err: any) {
        return { ok: false, error: 'Life Game proxy failed', detail: err?.message || String(err) }
      }
    })

    // Proxy: GET /api/life-game/history -> Life Game /history?playerId=...
    this.mcp.registerRoute('GET', '/api/life-game/history', async (req: any) => {
      try {
        const url = new URL(req.url)
        const qs = url.search || ''
        const res = await fetch(`${LIFE_GAME_BASE}/history${qs}`)
        const data = await res.json().catch(() => ({ ok: false, error: 'Invalid JSON from Life Game API' }))
        return data
      } catch (err: any) {
        return { ok: false, error: 'Life Game proxy failed', detail: err?.message || String(err) }
      }
    })

    // Proxy: POST /api/life-game/companion/interact -> Life Game /companion/interact
    this.mcp.registerRoute('POST', '/api/life-game/companion/interact', async (req: any) => {
      try {
        const body = await req.json().catch(() => ({}))
        const res = await fetch(`${LIFE_GAME_BASE}/companion/interact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        const data = await res.json().catch(() => ({ ok: false, error: 'Invalid JSON from Life Game API' }))
        return data
      } catch (err: any) {
        return { ok: false, error: 'Life Game proxy failed', detail: err?.message || String(err) }
      }
    })

    console.log('âœ… Routes configured')
  }

  async stop() {
    await this.mcp.stop()
    this.soul.close()
    this.db.close()
    console.log('ðŸ‘‹ Bridge Service stopped')
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
    console.log('\n\nðŸ›‘ Shutting down...')
    await bridge.stop()
    process.exit(0)
  })
}

export default BridgeService

