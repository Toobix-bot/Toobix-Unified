/**
 * 🕸️ Tool Network - Inter-Tool Communication System
 * 
 * Enables tools to:
 * - Communicate with each other via events
 * - Build relationships and dependencies
 * - Trigger cascading actions
 * - Share context and state
 * 
 * Architecture:
 * - Event-based Pub/Sub system
 * - Tool Relationship Graph
 * - Context sharing layer
 * - Cascading action chains
 */

import { Database } from 'bun:sqlite'

// ============================================
// Types
// ============================================

export interface ToolEvent {
  id: string
  type: string
  source: string           // Tool that emitted the event
  target?: string          // Optional: specific tool to notify
  data: any
  timestamp: number
  context?: any
}

export interface ToolRelationship {
  id: string
  sourceToolName: string
  targetToolName: string
  relationshipType: 'triggers' | 'informs' | 'depends' | 'enhances' | 'validates' | 'blocks'
  strength: number         // 0-100: how strong the relationship
  bidirectional: boolean
  condition?: string       // Optional: when this relationship activates
  metadata?: any
  createdAt: number
  lastActivated?: number
  activationCount: number
}

export interface ToolSubscription {
  toolName: string
  eventTypes: string[]
  handler: (event: ToolEvent) => Promise<any>
  priority: number         // 0-10: higher = earlier execution
}

export interface ToolContext {
  toolName: string
  sharedState: Map<string, any>
  history: ToolEvent[]
  relationships: ToolRelationship[]
}

// ============================================
// Tool Network
// ============================================

export class ToolNetwork {
  private db: Database
  private subscriptions: Map<string, ToolSubscription[]> = new Map()
  private relationships: Map<string, ToolRelationship[]> = new Map()
  private contexts: Map<string, ToolContext> = new Map()
  private eventHistory: ToolEvent[] = []
  private maxHistorySize = 1000

  constructor(db: Database) {
    this.db = db
    this.initializeTables()
  }

  // ============================================
  // Database Setup
  // ============================================

  private initializeTables() {
    // Tool events log
    this.db.run(`
      CREATE TABLE IF NOT EXISTS tool_events (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        source TEXT NOT NULL,
        target TEXT,
        data TEXT NOT NULL,
        context TEXT,
        timestamp INTEGER NOT NULL,
        processed INTEGER DEFAULT 0
      )
    `)

    // Tool relationships
    this.db.run(`
      CREATE TABLE IF NOT EXISTS tool_relationships (
        id TEXT PRIMARY KEY,
        source_tool TEXT NOT NULL,
        target_tool TEXT NOT NULL,
        relationship_type TEXT NOT NULL,
        strength INTEGER NOT NULL,
        bidirectional INTEGER DEFAULT 0,
        condition TEXT,
        metadata TEXT,
        created_at INTEGER NOT NULL,
        last_activated INTEGER,
        activation_count INTEGER DEFAULT 0
      )
    `)

    // Tool network metrics
    this.db.run(`
      CREATE TABLE IF NOT EXISTS tool_network_metrics (
        id TEXT PRIMARY KEY,
        tool_name TEXT NOT NULL,
        total_events_sent INTEGER DEFAULT 0,
        total_events_received INTEGER DEFAULT 0,
        total_relationships INTEGER DEFAULT 0,
        last_active INTEGER,
        metadata TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `)

    console.log('🕸️ Tool Network tables initialized')
  }

  // ============================================
  // Event System (Pub/Sub)
  // ============================================

  /**
   * Subscribe a tool to specific event types
   */
  subscribe(subscription: ToolSubscription) {
    for (const eventType of subscription.eventTypes) {
      if (!this.subscriptions.has(eventType)) {
        this.subscriptions.set(eventType, [])
      }
      this.subscriptions.get(eventType)!.push(subscription)
      
      // Sort by priority (higher first)
      this.subscriptions.get(eventType)!.sort((a, b) => b.priority - a.priority)
    }

    console.log(`📡 ${subscription.toolName} subscribed to [${subscription.eventTypes.join(', ')}]`)
  }

  /**
   * Emit an event from a tool
   */
  async emit(event: Omit<ToolEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: ToolEvent = {
      ...event,
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      timestamp: Date.now()
    }

    // Store event
    this.eventHistory.push(fullEvent)
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift()
    }

    // Persist to DB
    this.db.run(`
      INSERT INTO tool_events (id, type, source, target, data, context, timestamp)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
    `, fullEvent.id, fullEvent.type, fullEvent.source, fullEvent.target || null, 
       JSON.stringify(fullEvent.data), JSON.stringify(fullEvent.context || {}), fullEvent.timestamp)

    // Update metrics
    this.updateMetrics(fullEvent.source, 'sent')

    console.log(`📤 Event emitted: ${fullEvent.type} from ${fullEvent.source}`)

    // Notify subscribers
    await this.notifySubscribers(fullEvent)

    // Trigger related tools
    await this.activateRelationships(fullEvent)
  }

  /**
   * Notify all subscribers of an event
   */
  private async notifySubscribers(event: ToolEvent): Promise<void> {
    const subscribers = this.subscriptions.get(event.type) || []
    
    // Filter by target if specified
    const relevantSubscribers = event.target
      ? subscribers.filter(s => s.toolName === event.target)
      : subscribers

    for (const sub of relevantSubscribers) {
      try {
        console.log(`  → Notifying ${sub.toolName}...`)
        await sub.handler(event)
        this.updateMetrics(sub.toolName, 'received')
      } catch (error) {
        console.error(`  ❌ Subscriber ${sub.toolName} failed:`, error)
      }
    }
  }

  // ============================================
  // Relationship System
  // ============================================

  /**
   * Create a relationship between two tools
   */
  createRelationship(relationship: Omit<ToolRelationship, 'id' | 'createdAt' | 'activationCount'>): string {
    const rel: ToolRelationship = {
      ...relationship,
      id: `rel_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      createdAt: Date.now(),
      activationCount: 0
    }

    // Store in memory
    if (!this.relationships.has(rel.sourceToolName)) {
      this.relationships.set(rel.sourceToolName, [])
    }
    this.relationships.get(rel.sourceToolName)!.push(rel)

    // Bidirectional relationship
    if (rel.bidirectional) {
      if (!this.relationships.has(rel.targetToolName)) {
        this.relationships.set(rel.targetToolName, [])
      }
      this.relationships.get(rel.targetToolName)!.push({
        ...rel,
        sourceToolName: rel.targetToolName,
        targetToolName: rel.sourceToolName
      })
    }

    // Persist to DB
    this.db.run(`
      INSERT INTO tool_relationships (
        id, source_tool, target_tool, relationship_type, strength, 
        bidirectional, condition, metadata, created_at, activation_count
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, 0)
    `, rel.id, rel.sourceToolName, rel.targetToolName, rel.relationshipType,
       rel.strength, rel.bidirectional ? 1 : 0, rel.condition || null,
       JSON.stringify(rel.metadata || {}), rel.createdAt)

    console.log(`🔗 Relationship created: ${rel.sourceToolName} --[${rel.relationshipType}]--> ${rel.targetToolName} (strength: ${rel.strength})`)

    return rel.id
  }

  /**
   * Activate relationships when an event occurs
   */
  private async activateRelationships(event: ToolEvent): Promise<void> {
    const relationships = this.relationships.get(event.source) || []

    for (const rel of relationships) {
      // Check condition if specified
      if (rel.condition && !this.evaluateCondition(rel.condition, event)) {
        continue
      }

      // Activate based on type
      switch (rel.relationshipType) {
        case 'triggers':
          // Source tool triggers target tool
          console.log(`  🔄 ${rel.sourceToolName} triggers ${rel.targetToolName}`)
          await this.emit({
            type: 'tool.triggered',
            source: rel.sourceToolName,
            target: rel.targetToolName,
            data: { originalEvent: event, relationship: rel.id }
          })
          break

        case 'informs':
          // Source tool informs target tool (passive notification)
          console.log(`  📢 ${rel.sourceToolName} informs ${rel.targetToolName}`)
          await this.emit({
            type: 'tool.informed',
            source: rel.sourceToolName,
            target: rel.targetToolName,
            data: { originalEvent: event, relationship: rel.id }
          })
          break

        case 'enhances':
          // Source tool enhances target tool's output
          console.log(`  ✨ ${rel.sourceToolName} enhances ${rel.targetToolName}`)
          await this.emit({
            type: 'tool.enhanced',
            source: rel.sourceToolName,
            target: rel.targetToolName,
            data: { originalEvent: event, relationship: rel.id }
          })
          break

        case 'validates':
          // Source tool validates target tool's action
          console.log(`  ✅ ${rel.sourceToolName} validates ${rel.targetToolName}`)
          await this.emit({
            type: 'tool.validated',
            source: rel.sourceToolName,
            target: rel.targetToolName,
            data: { originalEvent: event, relationship: rel.id }
          })
          break

        case 'blocks':
          // Source tool blocks target tool
          console.log(`  🚫 ${rel.sourceToolName} blocks ${rel.targetToolName}`)
          await this.emit({
            type: 'tool.blocked',
            source: rel.sourceToolName,
            target: rel.targetToolName,
            data: { originalEvent: event, relationship: rel.id }
          })
          break
      }

      // Update activation count
      rel.activationCount++
      rel.lastActivated = Date.now()
      this.db.run(`
        UPDATE tool_relationships 
        SET activation_count = ?1, last_activated = ?2 
        WHERE id = ?3
      `, rel.activationCount, rel.lastActivated, rel.id)
    }
  }

  /**
   * Evaluate a condition string
   */
  private evaluateCondition(condition: string, event: ToolEvent): boolean {
    try {
      // Simple condition evaluation
      // Example: "data.awareness > 30"
      const fn = new Function('event', `return ${condition}`)
      return fn(event)
    } catch (error) {
      console.error(`Condition evaluation failed: ${condition}`, error)
      return false
    }
  }

  // ============================================
  // Context Sharing
  // ============================================

  /**
   * Get shared context for a tool
   */
  getContext(toolName: string): ToolContext {
    if (!this.contexts.has(toolName)) {
      this.contexts.set(toolName, {
        toolName,
        sharedState: new Map(),
        history: [],
        relationships: this.relationships.get(toolName) || []
      })
    }
    return this.contexts.get(toolName)!
  }

  /**
   * Update shared state in context
   */
  updateContext(toolName: string, key: string, value: any): void {
    const context = this.getContext(toolName)
    context.sharedState.set(key, value)
    
    // Emit context update event
    this.emit({
      type: 'context.updated',
      source: toolName,
      data: { key, value }
    })
  }

  /**
   * Get shared state from another tool's context
   */
  getSharedState(toolName: string, key: string): any {
    const context = this.contexts.get(toolName)
    return context?.sharedState.get(key)
  }

  // ============================================
  // Metrics & Analytics
  // ============================================

  private updateMetrics(toolName: string, action: 'sent' | 'received'): void {
    const metric = this.db.query(`
      SELECT * FROM tool_network_metrics WHERE tool_name = ?
    `).get(toolName) as any

    if (metric) {
      const field = action === 'sent' ? 'total_events_sent' : 'total_events_received'
      this.db.run(`
        UPDATE tool_network_metrics 
        SET ${field} = ${field} + 1, last_active = ?1, updated_at = ?1
        WHERE tool_name = ?2
      `, Date.now(), toolName)
    } else {
      this.db.run(`
        INSERT INTO tool_network_metrics (
          id, tool_name, total_events_sent, total_events_received, 
          last_active, created_at, updated_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?5, ?5)
      `, `metric_${toolName}_${Date.now()}`, toolName,
         action === 'sent' ? 1 : 0,
         action === 'received' ? 1 : 0,
         Date.now())
    }
  }

  /**
   * Get network statistics
   */
  getNetworkStats(): any {
    const totalEvents = this.eventHistory.length
    const totalRelationships = Array.from(this.relationships.values())
      .reduce((sum, rels) => sum + rels.length, 0)
    const totalSubscriptions = Array.from(this.subscriptions.values())
      .reduce((sum, subs) => sum + subs.length, 0)

    const metrics = this.db.query(`
      SELECT * FROM tool_network_metrics ORDER BY total_events_sent DESC LIMIT 10
    `).all()

    return {
      totalEvents,
      totalRelationships,
      totalSubscriptions,
      activeTools: this.contexts.size,
      topTools: metrics,
      recentEvents: this.eventHistory.slice(-10)
    }
  }

  /**
   * Get relationship graph for visualization
   */
  getRelationshipGraph(): any {
    const nodes = new Set<string>()
    const edges: any[] = []

    for (const [source, rels] of this.relationships) {
      nodes.add(source)
      for (const rel of rels) {
        nodes.add(rel.targetToolName)
        edges.push({
          source: rel.sourceToolName,
          target: rel.targetToolName,
          type: rel.relationshipType,
          strength: rel.strength,
          activations: rel.activationCount
        })
      }
    }

    return {
      nodes: Array.from(nodes).map(name => ({ id: name, name })),
      edges
    }
  }

  /**
   * Get event history for a tool
   */
  getToolHistory(toolName: string, limit = 50): ToolEvent[] {
    return this.eventHistory
      .filter(e => e.source === toolName || e.target === toolName)
      .slice(-limit)
  }
}
