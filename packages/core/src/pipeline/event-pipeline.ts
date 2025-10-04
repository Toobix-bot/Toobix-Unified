/**
 * 🎯 EVENT PIPELINE - Single Source of Truth
 * 
 * Alle Ereignisse durchlaufen EINE Pipeline:
 * Event → Validation → Ethics Check → Values Update → Story Log → Memory Store
 * 
 * Verhindert Inkonsistenzen zwischen Modulen durch zentralisierte Verarbeitung.
 */

import type { Database } from 'bun:sqlite'
import { conflictResolver, type ModuleName } from '../contracts/module-contracts'
import { unifiedValues, type ValueUpdate } from '../values/unified-values'

// ============================================
// TYPES & INTERFACES
// ============================================

export interface SystemEvent {
  id?: string
  type: EventType
  action: string
  description: string
  source: ModuleName
  affectsValues?: string[]    // Which values are affected
  valueUpdates?: ValueUpdate[] // How to update values
  requiresReflection?: boolean
  requiresEthicsCheck?: boolean
  context?: any
  metadata?: any
  timestamp?: number
}

export type EventType = 
  | 'action_completed'
  | 'value_changed'
  | 'goal_set'
  | 'thought_generated'
  | 'meditation_completed'
  | 'gratitude_added'
  | 'conflict_resolved'
  | 'memory_stored'
  | 'story_event'
  | 'user_interaction'
  | 'system_reflection'
  | 'error_occurred'

export interface EventValidation {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export interface EventResult {
  success: boolean
  eventId?: string
  reason?: string
  ethicsScore?: number
  affectedModules?: ModuleName[]
  errors?: string[]
}

export interface PipelineStep {
  name: string
  required: boolean
  execute: (event: SystemEvent) => Promise<StepResult>
}

export interface StepResult {
  success: boolean
  data?: any
  errors?: string[]
  warnings?: string[]
}

// ============================================
// EVENT PIPELINE
// ============================================

export class EventPipeline {
  private db: Database
  private steps: PipelineStep[] = []
  private eventLog: SystemEvent[] = []
  
  // Module references (injected)
  private ethics: any
  private soul: any
  private consciousness: any
  private story: any
  private memory: any
  
  constructor(db: Database, modules: {
    ethics: any
    soul: any
    consciousness: any
    story: any
    memory: any
  }) {
    this.db = db
    this.ethics = modules.ethics
    this.soul = modules.soul
    this.consciousness = modules.consciousness
    this.story = modules.story
    this.memory = modules.memory
    
    this.initializePipeline()
  }
  
  /**
   * 🔧 Initialize pipeline steps
   */
  private initializePipeline() {
    this.steps = [
      {
        name: '1. Validation',
        required: true,
        execute: async (event) => this.validateEvent(event)
      },
      {
        name: '2. Ethics Check',
        required: true,
        execute: async (event) => this.ethicsCheck(event)
      },
      {
        name: '3. Values Update',
        required: false,
        execute: async (event) => this.updateValues(event)
      },
      {
        name: '4. Consciousness Reflection',
        required: false,
        execute: async (event) => this.triggerReflection(event)
      },
      {
        name: '5. Story Logging',
        required: true,
        execute: async (event) => this.logToStory(event)
      },
      {
        name: '6. Memory Storage',
        required: true,
        execute: async (event) => this.storeInMemory(event)
      }
    ]
  }
  
  /**
   * 📥 Process event through pipeline
   */
  async processEvent(event: SystemEvent): Promise<EventResult> {
    // Generate event ID
    event.id = event.id || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    event.timestamp = event.timestamp || Date.now()
    
    console.log(`\n📥 Processing event: ${event.type}`)
    console.log(`   Source: ${event.source}`)
    console.log(`   Action: ${event.action}`)
    
    const affectedModules: ModuleName[] = [event.source]
    const errors: string[] = []
    let ethicsScore = 100
    
    // Execute each pipeline step
    for (const step of this.steps) {
      console.log(`   ${step.name}...`)
      
      try {
        const result = await step.execute(event)
        
        if (!result.success) {
          if (step.required) {
            console.log(`   ❌ ${step.name} failed (required step)`)
            errors.push(...(result.errors || [`${step.name} failed`]))
            
            return {
              success: false,
              reason: `Pipeline failed at ${step.name}`,
              errors
            }
          } else {
            console.log(`   ⚠️ ${step.name} failed (optional step)`)
            if (result.warnings) {
              console.log(`      Warnings: ${result.warnings.join(', ')}`)
            }
          }
        } else {
          console.log(`   ✅ ${step.name}`)
          
          // Store ethics score
          if (step.name.includes('Ethics') && result.data?.score) {
            ethicsScore = result.data.score
          }
        }
      } catch (error: any) {
        console.error(`   💥 ${step.name} threw error:`, error.message)
        
        if (step.required) {
          return {
            success: false,
            reason: `Pipeline error at ${step.name}: ${error.message}`,
            errors: [error.message]
          }
        }
      }
    }
    
    // Store in event log
    this.eventLog.push(event)
    
    console.log(`✅ Event processed successfully: ${event.id}`)
    
    return {
      success: true,
      eventId: event.id,
      ethicsScore,
      affectedModules
    }
  }
  
  /**
   * ✅ Step 1: Validate event structure
   */
  private async validateEvent(event: SystemEvent): Promise<StepResult> {
    const errors: string[] = []
    const warnings: string[] = []
    
    // Required fields
    if (!event.type) errors.push('Event type is required')
    if (!event.action) errors.push('Event action is required')
    if (!event.description) errors.push('Event description is required')
    if (!event.source) errors.push('Event source module is required')
    
    // Validate source module exists
    const validModules: ModuleName[] = ['ethics', 'soul', 'consciousness', 'story', 'memory', 'love', 'peace', 'people']
    if (event.source && !validModules.includes(event.source)) {
      errors.push(`Invalid source module: ${event.source}`)
    }
    
    // Validate value IDs
    if (event.affectsValues) {
      event.affectsValues.forEach(valueId => {
        if (!unifiedValues.getValue(valueId)) {
          warnings.push(`Unknown value ID: ${valueId}`)
        }
      })
    }
    
    return {
      success: errors.length === 0,
      errors,
      warnings
    }
  }
  
  /**
   * ⚖️ Step 2: Ethics check
   */
  private async ethicsCheck(event: SystemEvent): Promise<StepResult> {
    if (!event.requiresEthicsCheck) {
      return {
        success: true,
        data: { score: 100, reason: 'Ethics check not required' }
      }
    }
    
    try {
      const ethicsResult = await this.ethics.analyze({
        action: event.action,
        context: event.context
      })
      
      if (!ethicsResult.isEthical) {
        return {
          success: false,
          errors: [`Ethical violation: ${ethicsResult.reason}`],
          data: { score: ethicsResult.score }
        }
      }
      
      return {
        success: true,
        data: { 
          score: ethicsResult.score,
          reason: ethicsResult.reason
        }
      }
    } catch (error: any) {
      return {
        success: false,
        errors: [`Ethics check error: ${error.message}`]
      }
    }
  }
  
  /**
   * 💎 Step 3: Update values
   */
  private async updateValues(event: SystemEvent): Promise<StepResult> {
    if (!event.valueUpdates || event.valueUpdates.length === 0) {
      return {
        success: true,
        warnings: ['No value updates specified']
      }
    }
    
    const errors: string[] = []
    let updated = 0
    
    for (const update of event.valueUpdates) {
      const success = unifiedValues.updateValue(update)
      if (success) {
        updated++
      } else {
        errors.push(`Failed to update value: ${update.valueId}`)
      }
    }
    
    if (errors.length > 0) {
      return {
        success: false,
        errors,
        data: { updated }
      }
    }
    
    return {
      success: true,
      data: { updated }
    }
  }
  
  /**
   * 🤔 Step 4: Trigger consciousness reflection
   */
  private async triggerReflection(event: SystemEvent): Promise<StepResult> {
    if (!event.requiresReflection) {
      return {
        success: true,
        warnings: ['Reflection not required']
      }
    }
    
    try {
      const reflection = await this.consciousness.reflect({
        trigger: event.type,
        context: {
          event: event.description,
          ...event.context
        }
      })
      
      return {
        success: true,
        data: { reflection }
      }
    } catch (error: any) {
      return {
        success: false,
        errors: [`Reflection error: ${error.message}`]
      }
    }
  }
  
  /**
   * 📖 Step 5: Log to story
   */
  private async logToStory(event: SystemEvent): Promise<StepResult> {
    try {
      // Map to Story service schema
      const storyEvent = {
        id: event.id!,
        ts: event.timestamp!,
        epoch: 0, // Current epoch
        kind: event.type || 'system_event',
        text: event.description,
        mood: 'calm', // Default mood
        deltas: JSON.stringify({
          action: event.action,
          source: event.source,
          ...event.metadata
        }),
        tags: JSON.stringify([event.type, event.source]),
        option_ref: null,
        person_id: null
      }
      
      // Store in database using Story schema
      this.db.prepare(`
        INSERT INTO story_events (id, ts, epoch, kind, text, mood, deltas, tags, option_ref, person_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        storyEvent.id,
        storyEvent.ts,
        storyEvent.epoch,
        storyEvent.kind,
        storyEvent.text,
        storyEvent.mood,
        storyEvent.deltas,
        storyEvent.tags,
        storyEvent.option_ref,
        storyEvent.person_id
      )
      
      return {
        success: true,
        data: { storyEventId: event.id }
      }
    } catch (error: any) {
      return {
        success: false,
        errors: [`Story logging error: ${error.message}`]
      }
    }
  }
  
  /**
   * 💾 Step 6: Store in memory
   */
  private async storeInMemory(event: SystemEvent): Promise<StepResult> {
    try {
      await this.memory.add(
        `Event: ${event.description}`,
        {
          source: 'pipeline',
          eventType: event.type,
          eventId: event.id,
          module: event.source,
          timestamp: event.timestamp
        }
      )
      
      return {
        success: true
      }
    } catch (error: any) {
      return {
        success: false,
        errors: [`Memory storage error: ${error.message}`]
      }
    }
  }
  
  /**
   * 📊 Get event log
   */
  getEventLog(limit: number = 100): SystemEvent[] {
    return this.eventLog.slice(-limit)
  }
  
  /**
   * 🔍 Query events by type
   */
  getEventsByType(type: EventType, limit: number = 50): SystemEvent[] {
    return this.eventLog
      .filter(e => e.type === type)
      .slice(-limit)
  }
  
  /**
   * 📈 Get event statistics
   */
  getStatistics(): {
    total: number
    byType: Record<string, number>
    bySource: Record<string, number>
    successRate: number
  } {
    const byType: Record<string, number> = {}
    const bySource: Record<string, number> = {}
    
    this.eventLog.forEach(event => {
      byType[event.type] = (byType[event.type] || 0) + 1
      bySource[event.source] = (bySource[event.source] || 0) + 1
    })
    
    return {
      total: this.eventLog.length,
      byType,
      bySource,
      successRate: 1.0  // Simplified - would track failures in production
    }
  }
}

// ============================================
// EXAMPLE USAGE
// ============================================

export async function exampleUsage(pipeline: EventPipeline) {
  // Example: User completes meditation
  const result = await pipeline.processEvent({
    type: 'meditation_completed',
    action: 'record_peace_action',
    description: 'User completed 15min guided meditation',
    source: 'peace',
    affectsValues: ['peace', 'growth'],
    valueUpdates: [
      { valueId: 'peace', alignment: 75 },  // Improved alignment
      { valueId: 'growth', alignment: 72 }
    ],
    requiresReflection: true,
    requiresEthicsCheck: false,
    context: {
      duration: 900,  // 15min in seconds
      quality: 'high',
      guided: true
    }
  })
  
  console.log('\n📊 Result:', result)
  
  // Example: Ethical dilemma
  const dilemmaResult = await pipeline.processEvent({
    type: 'action_completed',
    action: 'share_analytics_data',
    description: 'System wants to share anonymous analytics',
    source: 'consciousness',
    affectsValues: ['privacy', 'growth'],
    requiresEthicsCheck: true,
    context: {
      urgency: 'low',
      userConsent: false,
      dataType: 'usage_patterns',
      anonymized: true
    }
  })
  
  console.log('\n📊 Dilemma Result:', dilemmaResult)
}
