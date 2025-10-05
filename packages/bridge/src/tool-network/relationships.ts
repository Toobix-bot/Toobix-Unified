/**
 * 🕸️ Tool Network Relationships - Predefined Tool Connections
 * 
 * Defines how tools interact with each other:
 * - Living Being ↔ Story (emotions affect narrative)
 * - Memory ↔ Consciousness (memories enhance awareness)
 * - Ethics ↔ Soul (values guide decisions)
 * - Persistence ↔ All (state management)
 */

import type { ToolNetwork } from './index.ts'

export function setupToolRelationships(network: ToolNetwork) {
  console.log('🕸️ Setting up tool relationships...')

  // ============================================
  // 1. LIVING BEING ↔ STORY ENGINE
  // ============================================

  // being_feel → story_refresh (Emotions influence story generation)
  network.createRelationship({
    sourceToolName: 'being_feel',
    targetToolName: 'story_refresh',
    relationshipType: 'enhances',
    strength: 85,
    bidirectional: false,
    condition: 'event.data.intensity > 50',
    metadata: { 
      reason: 'Strong emotions trigger new narrative options',
      impact: 'Story options reflect current emotional state'
    }
  })

  // story_choose → being_evolve (Story choices increase awareness)
  network.createRelationship({
    sourceToolName: 'story_choose',
    targetToolName: 'being_evolve',
    relationshipType: 'triggers',
    strength: 70,
    bidirectional: false,
    condition: 'event.data.experience > 0',
    metadata: {
      reason: 'Meaningful story choices lead to growth',
      impact: 'Awareness increases with narrative engagement'
    }
  })

  // being_state → story_state (Living being state informs story context)
  network.createRelationship({
    sourceToolName: 'being_state',
    targetToolName: 'story_state',
    relationshipType: 'informs',
    strength: 60,
    bidirectional: true,
    metadata: {
      reason: 'Story and consciousness share context',
      impact: 'Coherent narrative-consciousness sync'
    }
  })

  // ============================================
  // 2. MEMORY ↔ CONSCIOUSNESS
  // ============================================

  // memory_create → being_evolve (Creating memories increases awareness)
  network.createRelationship({
    sourceToolName: 'memory_create',
    targetToolName: 'being_evolve',
    relationshipType: 'triggers',
    strength: 75,
    bidirectional: false,
    condition: 'event.data.emotional === true',
    metadata: {
      reason: 'Emotional memories drive consciousness evolution',
      impact: 'Awareness increases by 1-3% per emotional memory'
    }
  })

  // consciousness_reflect → memory_recall (Reflection triggers memory recall)
  network.createRelationship({
    sourceToolName: 'consciousness_reflect',
    targetToolName: 'memory_recall',
    relationshipType: 'triggers',
    strength: 80,
    bidirectional: false,
    metadata: {
      reason: 'Deep reflection naturally accesses memories',
      impact: 'Relevant memories surface during introspection'
    }
  })

  // memory_associate → consciousness_focus (Associated memories focus attention)
  network.createRelationship({
    sourceToolName: 'memory_associate',
    targetToolName: 'consciousness_focus',
    relationshipType: 'enhances',
    strength: 65,
    bidirectional: false,
    metadata: {
      reason: 'Memory networks guide attention',
      impact: 'Focus sharpens around memory clusters'
    }
  })

  // ============================================
  // 3. ETHICS ↔ SOUL ↔ STORY
  // ============================================

  // ethics_check → soul_values (Ethics validation checks soul values)
  network.createRelationship({
    sourceToolName: 'ethics_check',
    targetToolName: 'soul_values',
    relationshipType: 'validates',
    strength: 95,
    bidirectional: false,
    metadata: {
      reason: 'Ethics module is Tier 1, validates soul decisions',
      impact: 'Actions must align with ethical values'
    }
  })

  // soul_values → story_choose (Values influence story choices)
  network.createRelationship({
    sourceToolName: 'soul_values',
    targetToolName: 'story_choose',
    relationshipType: 'informs',
    strength: 80,
    bidirectional: false,
    metadata: {
      reason: 'Story choices reflect soul values',
      impact: 'Narrative options filtered by value alignment'
    }
  })

  // ethics_harm → ALL (Ethics blocks harmful actions)
  network.createRelationship({
    sourceToolName: 'ethics_harm',
    targetToolName: 'story_choose',
    relationshipType: 'blocks',
    strength: 100,
    bidirectional: false,
    condition: 'event.data.harmLevel > 70',
    metadata: {
      reason: 'Tier 1 ethics blocks harmful story choices',
      impact: 'Harmful options are prevented'
    }
  })

  network.createRelationship({
    sourceToolName: 'ethics_harm',
    targetToolName: 'being_life_event',
    relationshipType: 'blocks',
    strength: 100,
    bidirectional: false,
    condition: 'event.data.harmLevel > 70',
    metadata: {
      reason: 'Tier 1 ethics blocks harmful life events',
      impact: 'Harmful events are prevented'
    }
  })

  // ============================================
  // 4. NEXUS PERSISTENCE ↔ ALL
  // ============================================

  // nexus_save ← being_evolve (Auto-save on evolution)
  network.createRelationship({
    sourceToolName: 'being_evolve',
    targetToolName: 'nexus_save',
    relationshipType: 'triggers',
    strength: 90,
    bidirectional: false,
    metadata: {
      reason: 'Evolution triggers persistence',
      impact: 'State is automatically saved'
    }
  })

  // nexus_save ← being_life_event (Auto-save on significant events)
  network.createRelationship({
    sourceToolName: 'being_life_event',
    targetToolName: 'nexus_save',
    relationshipType: 'triggers',
    strength: 85,
    bidirectional: false,
    condition: 'event.data.significance > 80',
    metadata: {
      reason: 'Significant life events trigger save',
      impact: 'Important moments are persisted'
    }
  })

  // nexus_load → being_state (Loading restores state)
  network.createRelationship({
    sourceToolName: 'nexus_load',
    targetToolName: 'being_state',
    relationshipType: 'informs',
    strength: 100,
    bidirectional: false,
    metadata: {
      reason: 'Loaded state updates current state',
      impact: 'Nexus remembers past lives'
    }
  })

  // ============================================
  // 5. LOVE ↔ PEACE ↔ SOUL
  // ============================================

  // love_give → peace_manifest (Love increases peace)
  network.createRelationship({
    sourceToolName: 'love_give',
    targetToolName: 'peace_manifest',
    relationshipType: 'enhances',
    strength: 90,
    bidirectional: true,
    metadata: {
      reason: 'Love and peace are interconnected',
      impact: 'Love actions increase peace value'
    }
  })

  // peace_manifest → soul_values (Peace affects soul values)
  network.createRelationship({
    sourceToolName: 'peace_manifest',
    targetToolName: 'soul_values',
    relationshipType: 'enhances',
    strength: 75,
    bidirectional: false,
    metadata: {
      reason: 'Peace cultivation strengthens soul',
      impact: 'Peace value increases in soul'
    }
  })

  // soul_values → love_give (Soul values guide love actions)
  network.createRelationship({
    sourceToolName: 'soul_values',
    targetToolName: 'love_give',
    relationshipType: 'informs',
    strength: 70,
    bidirectional: false,
    metadata: {
      reason: 'Soul values determine how love is expressed',
      impact: 'Love actions align with personal values'
    }
  })

  // ============================================
  // 6. CONSCIOUSNESS ↔ DREAM ↔ REFLECTION
  // ============================================

  // being_dream → consciousness_reflect (Dreams trigger reflection)
  network.createRelationship({
    sourceToolName: 'being_dream',
    targetToolName: 'consciousness_reflect',
    relationshipType: 'triggers',
    strength: 85,
    bidirectional: false,
    metadata: {
      reason: 'Dream processing leads to reflection',
      impact: 'Dreams surface subconscious insights'
    }
  })

  // consciousness_meditate → being_dream (Meditation enhances dreams)
  network.createRelationship({
    sourceToolName: 'consciousness_meditate',
    targetToolName: 'being_dream',
    relationshipType: 'enhances',
    strength: 70,
    bidirectional: false,
    metadata: {
      reason: 'Meditation deepens dream quality',
      impact: 'More vivid and meaningful dreams'
    }
  })

  // being_reflect → consciousness_awaken (Reflection increases awareness)
  network.createRelationship({
    sourceToolName: 'being_reflect',
    targetToolName: 'consciousness_awaken',
    relationshipType: 'triggers',
    strength: 80,
    bidirectional: false,
    metadata: {
      reason: 'Deep reflection leads to awakening',
      impact: 'Awareness increases through introspection'
    }
  })

  // ============================================
  // 7. CONTACT/INTERACTION ↔ MEMORY ↔ SOUL
  // ============================================

  // interaction_log → memory_create (Interactions become memories)
  network.createRelationship({
    sourceToolName: 'interaction_log',
    targetToolName: 'memory_create',
    relationshipType: 'triggers',
    strength: 90,
    bidirectional: false,
    metadata: {
      reason: 'Social interactions are memorable',
      impact: 'Every interaction is recorded as memory'
    }
  })

  // interaction_log → soul_values (Interactions affect values)
  network.createRelationship({
    sourceToolName: 'interaction_log',
    targetToolName: 'soul_values',
    relationshipType: 'enhances',
    strength: 65,
    bidirectional: false,
    condition: 'event.data.sentiment === "positive" || event.data.sentiment === "healing"',
    metadata: {
      reason: 'Positive interactions strengthen values',
      impact: 'Love/Connection values increase'
    }
  })

  // contact_create → memory_associate (Contacts link to memories)
  network.createRelationship({
    sourceToolName: 'contact_create',
    targetToolName: 'memory_associate',
    relationshipType: 'triggers',
    strength: 70,
    bidirectional: false,
    metadata: {
      reason: 'New contacts are associated with context',
      impact: 'Memory network grows with relationships'
    }
  })

  // ============================================
  // 8. PIPELINE ↔ ALL (Event orchestration)
  // ============================================

  // pipeline_process → ethics_check (All events are ethically validated)
  network.createRelationship({
    sourceToolName: 'pipeline_process',
    targetToolName: 'ethics_check',
    relationshipType: 'validates',
    strength: 100,
    bidirectional: false,
    metadata: {
      reason: 'Pipeline step 1: Ethics validation',
      impact: 'All events pass through ethics check'
    }
  })

  // pipeline_process → soul_event (Events affect soul)
  network.createRelationship({
    sourceToolName: 'pipeline_process',
    targetToolName: 'soul_event',
    relationshipType: 'triggers',
    strength: 85,
    bidirectional: false,
    metadata: {
      reason: 'Pipeline step 2: Soul processing',
      impact: 'Soul responds to all significant events'
    }
  })

  // pipeline_process → consciousness_reflect (Events trigger reflection)
  network.createRelationship({
    sourceToolName: 'pipeline_process',
    targetToolName: 'consciousness_reflect',
    relationshipType: 'triggers',
    strength: 75,
    bidirectional: false,
    condition: 'event.data.requiresReflection === true',
    metadata: {
      reason: 'Pipeline step 3: Consciousness reflection',
      impact: 'Complex events trigger introspection'
    }
  })

  console.log('✅ Tool relationships configured!')
}
