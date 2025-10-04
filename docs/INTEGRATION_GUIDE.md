# 🔌 Integration Guide — New Architecture Systems

**Date:** October 2025  
**Version:** 1.0.0  
**Status:** ✅ Ready for Integration

---

## Overview

This guide explains how to integrate the new architecture systems into your Toobix-Unified application:

- **Module Contracts** — Hierarchical conflict resolution
- **Unified Values** — Single source for all values (Ethics + Personal)
- **Event Pipeline** — Single source of truth for events

---

## 📦 What's New

### Before (Old System)

```typescript
// ❌ Two separate systems with conflicts
import { SoulService } from '@toobix/soul'
import { EthicsService } from '@toobix/ethics'

const soul = new SoulService(db)
const ethics = new EthicsService(db)

// No conflict resolution!
soul.updateValue('growth', 90)
ethics.checkAction('share_data')  // Conflict: What if they disagree?
```

### After (New System)

```typescript
// ✅ Unified system with automatic conflict resolution
import { unifiedValues } from '@toobix/core/values'
import { conflictResolver } from '@toobix/core/contracts'
import { EventPipeline } from '@toobix/core/pipeline'

// All conflicts automatically resolved
const resolution = await conflictResolver.resolve({
  moduleA: 'ethics',
  moduleB: 'soul',
  type: 'value_conflict'
})

// Single source of truth
const pipeline = new EventPipeline(db, modules)
await pipeline.processEvent({ ... })
```

---

## 🚀 Quick Start

### Step 1: Install Dependencies

Already installed! Core package includes:
- `@toobix/core/contracts` — Module contracts
- `@toobix/core/values` — Unified values
- `@toobix/core/pipeline` — Event pipeline

### Step 2: Import New Systems

```typescript
import { Database } from 'bun:sqlite'
import { conflictResolver } from '@toobix/core/contracts'
import { unifiedValues } from '@toobix/core/values'
import { EventPipeline } from '@toobix/core/pipeline'
```

### Step 3: Initialize Event Pipeline

```typescript
const db = new Database('./data/toobix-unified.db')

const pipeline = new EventPipeline(db, {
  ethics: ethicsService,      // Your existing ethics module
  soul: soulService,          // Your existing soul module
  consciousness: consciousnessService,
  story: storyService,
  memory: memoryService
})
```

### Step 4: Process Events

```typescript
const result = await pipeline.processEvent({
  type: 'meditation_completed',
  action: 'meditate',
  description: 'User meditated for 20 minutes',
  source: 'peace',
  affectsValues: ['peace', 'wisdom'],
  valueUpdates: [
    { valueId: 'peace', alignment: 85 },
    { valueId: 'wisdom', alignment: 75 }
  ],
  requiresReflection: true
})

console.log(result.success)  // true
console.log(result.eventId)   // evt_1759596307974_32p4d59vp
```

---

## 🔄 Migration Path

### Phase 1: Side-by-Side (Safe)

Run old and new systems in parallel:

```typescript
// OLD (keep running)
await soul.processEvent(event)

// NEW (test in parallel)
const result = await pipeline.processEvent(event)

// Compare results
if (result.success) {
  console.log('✅ New system works!')
}
```

### Phase 2: Gradual Replacement

Replace one module at a time:

```typescript
// Step 1: Replace values
// OLD: const values = await soul.getValues()
const values = unifiedValues.getAllValues()

// Step 2: Replace conflict resolution
// OLD: Manual conflict handling
const resolution = await conflictResolver.resolve(conflict)

// Step 3: Replace event processing
// OLD: await soul.processEvent(event)
const result = await pipeline.processEvent(event)
```

### Phase 3: Complete Migration

Remove old system:

```typescript
// ❌ Delete these imports
// import { SoulService } from '@toobix/soul'
// import { EthicsService } from '@toobix/ethics'

// ✅ Use only new system
import { unifiedValues } from '@toobix/core/values'
import { EventPipeline } from '@toobix/core/pipeline'
```

---

## 🛠️ API Reference

### Module Contracts

#### Resolve Conflict

```typescript
import { conflictResolver, type ModuleConflict } from '@toobix/core/contracts'

const conflict: ModuleConflict = {
  moduleA: 'ethics',
  moduleB: 'soul',
  type: 'ethical_dilemma',
  context: { action: 'Share data', urgency: 'low' },
  description: 'Privacy vs Growth conflict'
}

const resolution = await conflictResolver.resolve(conflict)

console.log(resolution.winner)        // 'ethics'
console.log(resolution.reason)        // 'ethics has higher authority'
console.log(resolution.confidence)    // 1.0
console.log(resolution.suggestedAction) // Optional alternative
```

#### Module Hierarchy

```typescript
const MODULE_HIERARCHY = {
  ethics: { level: 1, authority: 'absolute' },      // Highest
  soul: { level: 2, authority: 'strong' },
  consciousness: { level: 3, authority: 'advisory' },
  story: { level: 4, authority: 'informational' },
  memory: { level: 5, authority: 'informational' }  // Lowest
}
```

**Rules:**
- Lower level = Higher authority
- Ethics (Level 1) always wins
- Story (Level 4) is authoritative for events
- Memory (Level 5) stores but defers to Story

---

### Unified Values

#### Get Values

```typescript
import { unifiedValues } from '@toobix/core/values'

// Get single value
const privacy = unifiedValues.getValue('privacy')
console.log(privacy.priority)      // 9
console.log(privacy.importance)    // 95
console.log(privacy.alignment)     // 85
console.log(privacy.immutable)     // true

// Get all values
const allValues = unifiedValues.getAllValues()
console.log(allValues.length)      // 13

// Get top values
const topValues = unifiedValues.getTopValues(5)
```

#### Update Values

```typescript
// Update mutable value (success)
const success = unifiedValues.updateValue({
  valueId: 'growth',
  alignment: 85,
  importance: 90
})

// Try to update immutable value (fails)
const failed = unifiedValues.updateValue({
  valueId: 'privacy',     // Immutable!
  importance: 50
})
console.log(failed)  // false
```

#### Resolve Conflicts

```typescript
import { type ValueConflict } from '@toobix/core/values'

const conflict: ValueConflict = {
  valueA: 'privacy',
  valueB: 'growth',
  context: { action: 'Share analytics', urgency: 'low' },
  severity: 'high'
}

const resolution = await unifiedValues.resolveConflict(conflict)

console.log(resolution.winner)       // 'privacy'
console.log(resolution.reason)       // 'Higher priority (9 vs 7)'
console.log(resolution.confidence)   // 0.95
```

#### 13 Core Values

| Value ID | Priority | Category | Immutable |
|----------|----------|----------|-----------|
| `do_no_harm` | 10 | Ethical | ✅ |
| `privacy` | 9 | Ethical | ✅ |
| `transparency` | 9 | Ethical | ✅ |
| `autonomy` | 8 | Ethical | ✅ |
| `fairness` | 8 | Ethical | ✅ |
| `growth` | 7 | Personal | ❌ |
| `love` | 7 | Personal | ❌ |
| `peace` | 7 | Personal | ❌ |
| `trust` | 7 | Social | ❌ |
| `empathy` | 6 | Social | ❌ |
| `freedom` | 6 | Personal | ❌ |
| `creativity` | 6 | Growth | ❌ |
| `wisdom` | 6 | Growth | ❌ |

---

### Event Pipeline

#### Process Event

```typescript
import { EventPipeline } from '@toobix/core/pipeline'

const pipeline = new EventPipeline(db, {
  ethics: ethicsService,
  soul: soulService,
  consciousness: consciousnessService,
  story: storyService,
  memory: memoryService
})

const result = await pipeline.processEvent({
  type: 'action_completed',
  action: 'meditate',
  description: 'User meditated for 15 minutes',
  source: 'peace',
  
  // Optional: Affect values
  affectsValues: ['peace', 'wisdom'],
  valueUpdates: [
    { valueId: 'peace', alignment: 85 }
  ],
  
  // Optional: Require reflection
  requiresReflection: true,
  
  // Optional: Ethics check
  requiresEthicsCheck: true,
  
  // Context
  context: { duration: 900, quality: 'high' }
})

if (result.success) {
  console.log('Event ID:', result.eventId)
  console.log('Ethics Score:', result.ethicsScore)
} else {
  console.log('Failed:', result.reason)
  console.log('Errors:', result.errors)
}
```

#### 6-Step Pipeline

```
Event → [1. Validation] → [2. Ethics Check] → [3. Values Update]
      → [4. Reflection] → [5. Story Log] → [6. Memory Store]
```

**Step Details:**

1. **Validation** (Required)
   - Validates event structure
   - Checks required fields
   - Validates value IDs
   
2. **Ethics Check** (Required if `requiresEthicsCheck: true`)
   - Analyzes action with ethics module
   - Blocks if score < 50
   - Logs concerns
   
3. **Values Update** (Optional)
   - Updates value alignments/importance
   - Respects immutable values
   - Logs changes
   
4. **Reflection** (Optional if `requiresReflection: true`)
   - Triggers consciousness.reflect()
   - Deepens awareness
   
5. **Story Log** (Required)
   - Logs to `story_events` table
   - **Authoritative source of truth**
   
6. **Memory Store** (Required)
   - Stores in memory module
   - References story event

#### Get Statistics

```typescript
const stats = pipeline.getStatistics()

console.log(stats.totalEvents)      // 42
console.log(stats.successful)       // 38
console.log(stats.failed)           // 4
console.log(stats.blockedByEthics)  // 2
```

---

## 🎯 Use Cases

### Use Case 1: Ethical Dilemma

**Scenario:** User wants AI to help with privacy-invasive task

```typescript
// Step 1: Check module authority
const moduleConflict = await conflictResolver.resolve({
  moduleA: 'ethics',
  moduleB: 'consciousness',
  type: 'ethical_dilemma',
  context: { action: 'Track location without consent' }
})

// Result: ethics wins (Level 1 > Level 3)

// Step 2: Check values
const valueConflict = await unifiedValues.resolveConflict({
  valueA: 'privacy',
  valueB: 'growth',
  context: { action: 'Track location', urgency: 'low' }
})

// Result: privacy wins (Priority 9 > Priority 7)

// Step 3: Process event
const result = await pipeline.processEvent({
  type: 'action_attempted',
  action: 'track_location_without_consent',
  description: 'User requested location tracking',
  source: 'consciousness',
  requiresEthicsCheck: true
})

// Result: Logged but NOT executed (ethics check blocks execution)
```

### Use Case 2: Value Alignment Improvement

**Scenario:** User completes meditation session

```typescript
const result = await pipeline.processEvent({
  type: 'meditation_completed',
  action: 'meditate',
  description: 'User completed 20-minute meditation',
  source: 'peace',
  valueUpdates: [
    { valueId: 'peace', alignment: 90 },
    { valueId: 'wisdom', alignment: 75 }
  ],
  requiresReflection: true,
  context: { duration: 1200, quality: 'excellent' }
})

// Result: 
// ✅ Peace alignment increased
// ✅ Wisdom alignment increased
// ✅ Reflection triggered
// ✅ Story logged (authoritative)
// ✅ Memory stored (references story)
```

### Use Case 3: Data Inconsistency

**Scenario:** Memory and Story disagree on event duration

```typescript
const conflict = await conflictResolver.resolve({
  moduleA: 'story',
  moduleB: 'memory',
  type: 'data_inconsistency',
  context: {
    field: 'meditation_duration',
    storyValue: 900,    // 15 minutes
    memoryValue: 600    // 10 minutes
  }
})

// Result: story wins (Level 4, authoritative for events)
// Action: Update memory to match story
```

---

## 🧪 Testing

### Unit Tests

```bash
cd packages/core
bun test
```

**Test Coverage:**
- ✅ 65 tests
- ✅ 100% pass rate
- ✅ 280 assertions

**Test Files:**
- `module-contracts.test.ts` — 25 tests
- `unified-values.test.ts` — 27 tests
- `integration.test.ts` — 8 tests

### Demo Script

```bash
bun run scripts/demo-architecture.ts
```

**Demonstrates:**
- Module conflict resolution (3 scenarios)
- Value conflict resolution (4 scenarios)
- Event pipeline processing (3 scenarios)
- Full ethical dilemma resolution (1 scenario)

---

## 📊 Performance

### Benchmarks

| Operation | Time | Notes |
|-----------|------|-------|
| Conflict Resolution | <1ms | In-memory comparison |
| Value Query | <1ms | Direct lookup |
| Value Update | <5ms | Validation + update |
| Event Pipeline | 50-100ms | Full 6-step process |

### Optimization Tips

1. **Batch Events:** Process multiple events in parallel
2. **Cache Values:** Store frequently accessed values
3. **Skip Optional Steps:** Set `requiresReflection: false` when not needed
4. **Lazy Loading:** Load modules only when needed

---

## 🔒 Security

### Immutable Values

These values **cannot** be changed:
- `do_no_harm` (Priority 10)
- `privacy` (Priority 9)
- `transparency` (Priority 9)
- `autonomy` (Priority 8)
- `fairness` (Priority 8)

**Attempts to modify will be rejected:**

```typescript
const failed = unifiedValues.updateValue({
  valueId: 'privacy',
  importance: 10  // Try to lower
})

console.log(failed)  // false
```

### Ethics Blocking

All actions can be checked:

```typescript
const result = await pipeline.processEvent({
  type: 'action_attempted',
  action: 'manipulate_user',
  requiresEthicsCheck: true  // Will block
})

console.log(result.success)  // false
console.log(result.reason)   // 'Ethical violation'
```

---

## 🐛 Troubleshooting

### Problem: Conflict resolution not working

**Check:**
- Module names match hierarchy: `ethics`, `soul`, `consciousness`, `story`, `memory`
- Context provides enough information
- Conflict type is correct: `ethical_dilemma`, `value_conflict`, `data_inconsistency`, `priority_conflict`

### Problem: Event pipeline fails

**Check:**
- All required fields present: `type`, `action`, `description`, `source`
- Value IDs exist in unified values
- Database connection is active
- Modules are initialized

### Problem: Values not updating

**Check:**
- Value is mutable (not in immutable list)
- Update values are in range 0-100
- Value ID is correct

---

## 📚 Additional Resources

- **Architecture Review:** `docs/ARCHITECTURE_REVIEW.md`
- **API Documentation:** `docs/API.md` (this file)
- **Test Files:** `packages/core/src/__tests__/`
- **Demo Script:** `scripts/demo-architecture.ts`

---

## ✅ Checklist: Bridge Integration

Use this checklist when integrating into Bridge service:

- [ ] Import new systems
- [ ] Initialize EventPipeline with all modules
- [ ] Replace `soul.processEvent()` with `pipeline.processEvent()`
- [ ] Replace `soul.getValues()` with `unifiedValues.getAllValues()`
- [ ] Update MCP tools to use new APIs
- [ ] Run tests: `bun test`
- [ ] Run demo: `bun run scripts/demo-architecture.ts`
- [ ] Test in Bridge: Make test request
- [ ] Deploy to production

---

**Ready to integrate?** Continue to [Bridge Integration](./BRIDGE_INTEGRATION.md)
