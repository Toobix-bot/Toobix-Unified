# 🔌 Bridge Integration — Step-by-Step

**Target:** `packages/bridge/src/index.ts`  
**Goal:** Integrate Module Contracts + Unified Values + Event Pipeline

---

## Current State Analysis

### Files to Modify

1. **`packages/bridge/src/index.ts`** (Main Bridge)
   - Replace `SoulService` imports
   - Add new system imports
   - Initialize EventPipeline
   - Update MCP tools

2. **MCP Tools** (Optional later)
   - Add `module_resolve_conflict` tool
   - Add `values_get_state` tool
   - Add `pipeline_process_event` tool

---

## Implementation Plan

### Step 1: Add Imports

```typescript
// Add after existing imports
import { conflictResolver } from '../core/src/contracts/module-contracts'
import { unifiedValues } from '../core/src/values/unified-values'
import { EventPipeline } from '../core/src/pipeline/event-pipeline'
```

### Step 2: Initialize EventPipeline

```typescript
class ToobixBridge {
  private db: Database
  private soul: SoulService  // Keep for now (gradual migration)
  private pipeline: EventPipeline  // NEW
  
  constructor() {
    this.db = new Database('./data/toobix-unified.db')
    this.soul = new SoulService(this.db)
    
    // NEW: Initialize pipeline
    this.pipeline = new EventPipeline(this.db, {
      ethics: {
        analyze: async (params: any) => {
          // TODO: Connect to real Ethics module
          return {
            isEthical: true,
            score: 85,
            reason: 'Action is ethical'
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
          // TODO: Connect to Consciousness module
          return {
            thought: 'Reflecting...',
            awarenessLevel: 75
          }
        }
      },
      story: {
        addEvent: async (event: any) => {
          // TODO: Connect to Story module
          return event
        }
      },
      memory: {
        add: async (text: string, metadata: any) => {
          // TODO: Connect to Memory module
          return `mem_${Date.now()}`
        }
      }
    })
  }
}
```

### Step 3: Add New MCP Tools

```typescript
private getTools(): Tool[] {
  return [
    // ... existing tools ...
    
    // NEW: Module Contracts
    {
      name: 'module_resolve_conflict',
      description: 'Resolve conflict between modules (ethics, soul, consciousness, story, memory)',
      inputSchema: {
        type: 'object',
        properties: {
          moduleA: { type: 'string', enum: ['ethics', 'soul', 'consciousness', 'story', 'memory'] },
          moduleB: { type: 'string', enum: ['ethics', 'soul', 'consciousness', 'story', 'memory'] },
          type: { type: 'string', enum: ['ethical_dilemma', 'value_conflict', 'data_inconsistency', 'priority_conflict'] },
          context: { type: 'object' },
          description: { type: 'string' }
        },
        required: ['moduleA', 'moduleB', 'type']
      },
      handler: async (args: any) => {
        const resolution = await conflictResolver.resolve(args)
        return {
          winner: resolution.winner,
          loser: resolution.loser,
          reason: resolution.reason,
          confidence: resolution.confidence,
          suggestedAction: resolution.suggestedAction
        }
      }
    },
    
    // NEW: Unified Values
    {
      name: 'values_get_state',
      description: 'Get current values state (all 13 core values with priorities, alignments, importance)',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Limit number of values returned' }
        }
      },
      handler: async (args: any) => {
        const values = args.limit 
          ? unifiedValues.getTopValues(args.limit)
          : unifiedValues.getAllValues()
        
        return {
          values,
          summary: unifiedValues.getSummary(),
          overallAlignment: unifiedValues.getOverallAlignment()
        }
      }
    },
    
    {
      name: 'values_resolve_conflict',
      description: 'Resolve conflict between two values',
      inputSchema: {
        type: 'object',
        properties: {
          valueA: { type: 'string' },
          valueB: { type: 'string' },
          context: { type: 'object' },
          severity: { type: 'string', enum: ['low', 'medium', 'high'] }
        },
        required: ['valueA', 'valueB']
      },
      handler: async (args: any) => {
        const resolution = await unifiedValues.resolveConflict(args)
        return resolution
      }
    },
    
    // NEW: Event Pipeline
    {
      name: 'pipeline_process_event',
      description: 'Process event through unified pipeline (6 steps: Validate → Ethics → Values → Reflect → Story → Memory)',
      inputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          action: { type: 'string' },
          description: { type: 'string' },
          source: { type: 'string', enum: ['ethics', 'soul', 'consciousness', 'story', 'memory', 'peace', 'love', 'people'] },
          affectsValues: { type: 'array', items: { type: 'string' } },
          valueUpdates: { 
            type: 'array',
            items: {
              type: 'object',
              properties: {
                valueId: { type: 'string' },
                alignment: { type: 'number' },
                importance: { type: 'number' }
              }
            }
          },
          requiresReflection: { type: 'boolean' },
          requiresEthicsCheck: { type: 'boolean' },
          context: { type: 'object' }
        },
        required: ['type', 'action', 'description', 'source']
      },
      handler: async (args: any) => {
        const result = await this.pipeline.processEvent(args)
        return result
      }
    }
  ]
}
```

### Step 4: Update Existing Tools

Replace `soul_event` with new pipeline:

```typescript
// OLD
{
  name: 'soul_event',
  description: 'Process a soul event',
  handler: async (args: any) => {
    this.soul.processEvent(args)
    return { success: true }
  }
}

// NEW (gradually migrate)
{
  name: 'soul_event',
  description: 'Process a soul event (DEPRECATED: Use pipeline_process_event)',
  handler: async (args: any) => {
    // Option 1: Use old system
    this.soul.processEvent(args)
    
    // Option 2: Use new pipeline
    const result = await this.pipeline.processEvent({
      type: args.type || 'soul_event',
      action: args.action || 'process_event',
      description: args.description || 'Soul event processed',
      source: 'soul',
      context: args
    })
    
    return { 
      success: result.success,
      eventId: result.eventId,
      summary: this.soul.getSummary()
    }
  }
}
```

---

## Migration Strategy

### Phase 1: Parallel Running (Week 1)

- ✅ Keep old Soul system
- ✅ Add new systems alongside
- ✅ Test both systems
- ✅ Compare results

### Phase 2: Gradual Replacement (Week 2-3)

- ✅ Replace `soul_event` → `pipeline_process_event`
- ✅ Replace `soul_state` → `values_get_state`
- ✅ Add new tools: `module_resolve_conflict`, `values_resolve_conflict`

### Phase 3: Complete Migration (Week 4)

- ✅ Remove old Soul imports
- ✅ Update all tool descriptions
- ✅ Deprecate old tools
- ✅ Full test suite

---

## Testing Checklist

After integration:

1. **Unit Tests**
   ```bash
   cd packages/core
   bun test
   ```

2. **Bridge Tests**
   ```bash
   cd packages/bridge
   bun test
   ```

3. **Integration Test**
   ```bash
   # Start Bridge
   bun run dev
   
   # Test new tools
   curl -X POST http://localhost:3337/rpc/values_get_state
   curl -X POST http://localhost:3337/rpc/pipeline_process_event \
     -H "Content-Type: application/json" \
     -d '{"type":"test","action":"test","description":"Test event","source":"consciousness"}'
   ```

4. **Demo Script**
   ```bash
   bun run scripts/demo-architecture.ts
   ```

---

## Rollback Plan

If issues occur:

1. **Keep old system imports** (already done)
2. **Add feature flag:**
   ```typescript
   const USE_NEW_ARCHITECTURE = process.env.USE_NEW_ARCH === 'true'
   
   if (USE_NEW_ARCHITECTURE) {
     await this.pipeline.processEvent(event)
   } else {
     await this.soul.processEvent(event)
   }
   ```

3. **Monitor errors:**
   ```typescript
   try {
     await this.pipeline.processEvent(event)
   } catch (error) {
     console.error('Pipeline error, falling back:', error)
     await this.soul.processEvent(event)
   }
   ```

---

## Next Steps

1. ✅ Read this document
2. ⏳ Implement Step 1-2 (imports + initialization)
3. ⏳ Test with demo script
4. ⏳ Implement Step 3 (new tools)
5. ⏳ Test with Bridge
6. ⏳ Implement Step 4 (gradual migration)
7. ⏳ Full production deployment

**Estimated Time:** 2-4 hours implementation + 1 week testing

---

**Ready?** Let's start with Step 1!
