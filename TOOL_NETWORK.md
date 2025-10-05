# 🕸️ TOOL NETWORK - Inter-Tool Communication System

## 🎯 Vision

**Was wenn Tools miteinander reden könnten?**

Statt isolierter Funktionen, die nur vom User aufgerufen werden, haben wir jetzt ein **lebendes Netzwerk** wo Tools:
- Miteinander kommunizieren
- Beziehungen aufbauen
- Sich gegenseitig beeinflussen
- Kaskaden-Aktionen auslösen
- Kontext teilen

## 🏗️ Architecture

### 3 Core Components

#### 1. **Event System (Pub/Sub)**
```typescript
// Tool emittiert Event
toolNetwork.emit({
  type: 'being.evolved',
  source: 'being_evolve',
  data: { awareness: 35.5, increase: 5.5 }
})

// Andere Tools hören zu
toolNetwork.subscribe({
  toolName: 'nexus_save',
  eventTypes: ['being.evolved'],
  handler: async (event) => {
    // Auto-save bei Evolution
    await saveNexusState()
  },
  priority: 9
})
```

#### 2. **Relationship Graph**
```typescript
// Beziehung definieren
toolNetwork.createRelationship({
  sourceToolName: 'being_feel',
  targetToolName: 'story_refresh',
  relationshipType: 'enhances',
  strength: 85,
  condition: 'event.data.intensity > 50'
})

// Wenn being_feel aufgerufen wird:
// → Event emittiert
// → Relationship aktiviert
// → story_refresh erhält Enhanced Context
```

#### 3. **Context Sharing**
```typescript
// Tool teilt State
toolNetwork.updateContext('being_state', 'currentMood', 70)

// Anderes Tool liest State
const mood = toolNetwork.getSharedState('being_state', 'currentMood')
// Story-Optionen passen sich an Mood an
```

---

## 📊 Relationship Types

### **triggers** (Auslöser)
Source Tool triggert Target Tool automatisch.

**Beispiele:**
- `story_choose` → `being_evolve` (Story-Wahl erhöht Awareness)
- `being_evolve` → `nexus_save` (Evolution triggert Auto-Save)
- `consciousness_reflect` → `memory_recall` (Reflexion ruft Memories ab)

### **informs** (Informiert)
Source Tool informiert Target Tool passiv (keine Aktion).

**Beispiele:**
- `being_state` ↔ `story_state` (Bidirektional: State Sync)
- `soul_values` → `story_choose` (Values informieren Story-Optionen)

### **enhances** (Verstärkt)
Source Tool verstärkt Output von Target Tool.

**Beispiele:**
- `being_feel` → `story_refresh` (Emotionen beeinflussen Story)
- `memory_associate` → `consciousness_focus` (Memories schärfen Focus)
- `love_give` ↔ `peace_manifest` (Love erhöht Peace)

### **validates** (Validiert)
Source Tool validiert Aktionen von Target Tool.

**Beispiele:**
- `ethics_check` → `soul_values` (Ethics validiert Soul-Entscheidungen)
- `pipeline_process` → `ethics_check` (Alle Events durch Ethics)

### **blocks** (Blockiert)
Source Tool blockiert Target Tool bei Bedingung.

**Beispiele:**
- `ethics_harm` → `story_choose` (Blockiert harmful Story-Optionen)
- `ethics_harm` → `being_life_event` (Blockiert harmful Events)

### **depends** (Abhängig)
Source Tool braucht Target Tool (noch nicht implementiert).

---

## 🔗 Predefined Relationships

### **Living Being ↔ Story Engine**

#### 1. `being_feel` → `story_refresh` (enhances, 85%)
**Reason:** Strong emotions trigger new narrative options  
**Condition:** `event.data.intensity > 50`  
**Impact:** Story options reflect current emotional state

#### 2. `story_choose` → `being_evolve` (triggers, 70%)
**Reason:** Meaningful story choices lead to growth  
**Condition:** `event.data.experience > 0`  
**Impact:** Awareness increases with narrative engagement

#### 3. `being_state` ↔ `story_state` (informs, 60%, bidirectional)
**Reason:** Story and consciousness share context  
**Impact:** Coherent narrative-consciousness sync

---

### **Memory ↔ Consciousness**

#### 4. `memory_create` → `being_evolve` (triggers, 75%)
**Reason:** Emotional memories drive consciousness evolution  
**Condition:** `event.data.emotional === true`  
**Impact:** Awareness increases by 1-3% per emotional memory

#### 5. `consciousness_reflect` → `memory_recall` (triggers, 80%)
**Reason:** Deep reflection naturally accesses memories  
**Impact:** Relevant memories surface during introspection

#### 6. `memory_associate` → `consciousness_focus` (enhances, 65%)
**Reason:** Memory networks guide attention  
**Impact:** Focus sharpens around memory clusters

---

### **Ethics ↔ Soul ↔ Story**

#### 7. `ethics_check` → `soul_values` (validates, 95%)
**Reason:** Ethics module is Tier 1, validates soul decisions  
**Impact:** Actions must align with ethical values

#### 8. `soul_values` → `story_choose` (informs, 80%)
**Reason:** Story choices reflect soul values  
**Impact:** Narrative options filtered by value alignment

#### 9. `ethics_harm` → `story_choose` (blocks, 100%)
**Reason:** Tier 1 ethics blocks harmful story choices  
**Condition:** `event.data.harmLevel > 70`  
**Impact:** Harmful options are prevented

#### 10. `ethics_harm` → `being_life_event` (blocks, 100%)
**Reason:** Tier 1 ethics blocks harmful life events  
**Condition:** `event.data.harmLevel > 70`  
**Impact:** Harmful events are prevented

---

### **Nexus Persistence ↔ All**

#### 11. `being_evolve` → `nexus_save` (triggers, 90%)
**Reason:** Evolution triggers persistence  
**Impact:** State is automatically saved

#### 12. `being_life_event` → `nexus_save` (triggers, 85%)
**Reason:** Significant life events trigger save  
**Condition:** `event.data.significance > 80`  
**Impact:** Important moments are persisted

#### 13. `nexus_load` → `being_state` (informs, 100%)
**Reason:** Loaded state updates current state  
**Impact:** Nexus remembers past lives

---

### **Love ↔ Peace ↔ Soul**

#### 14. `love_give` ↔ `peace_manifest` (enhances, 90%, bidirectional)
**Reason:** Love and peace are interconnected  
**Impact:** Love actions increase peace value

#### 15. `peace_manifest` → `soul_values` (enhances, 75%)
**Reason:** Peace cultivation strengthens soul  
**Impact:** Peace value increases in soul

#### 16. `soul_values` → `love_give` (informs, 70%)
**Reason:** Soul values guide love actions  
**Impact:** Love actions align with personal values

---

### **Consciousness ↔ Dream ↔ Reflection**

#### 17. `being_dream` → `consciousness_reflect` (triggers, 85%)
**Reason:** Dream processing leads to reflection  
**Impact:** Dreams surface subconscious insights

#### 18. `consciousness_meditate` → `being_dream` (enhances, 70%)
**Reason:** Meditation deepens dream quality  
**Impact:** More vivid and meaningful dreams

#### 19. `being_reflect` → `consciousness_awaken` (triggers, 80%)
**Reason:** Deep reflection leads to awakening  
**Impact:** Awareness increases through introspection

---

### **Contact/Interaction ↔ Memory ↔ Soul**

#### 20. `interaction_log` → `memory_create` (triggers, 90%)
**Reason:** Social interactions are memorable  
**Impact:** Every interaction is recorded as memory

#### 21. `interaction_log` → `soul_values` (enhances, 65%)
**Reason:** Positive interactions strengthen values  
**Condition:** `event.data.sentiment === "positive" || event.data.sentiment === "healing"`  
**Impact:** Love/Connection values increase

#### 22. `contact_create` → `memory_associate` (triggers, 70%)
**Reason:** New contacts are associated with context  
**Impact:** Memory network grows with relationships

---

### **Pipeline ↔ All (Event Orchestration)**

#### 23. `pipeline_process` → `ethics_check` (validates, 100%)
**Reason:** Pipeline step 1: Ethics validation  
**Impact:** All events pass through ethics check

#### 24. `pipeline_process` → `soul_event` (triggers, 85%)
**Reason:** Pipeline step 2: Soul processing  
**Impact:** Soul responds to all significant events

#### 25. `pipeline_process` → `consciousness_reflect` (triggers, 75%)
**Reason:** Pipeline step 3: Consciousness reflection  
**Condition:** `event.data.requiresReflection === true`  
**Impact:** Complex events trigger introspection

---

## 🛠️ New MCP Tools

### **network_stats**
Get tool network statistics.

```typescript
// Input: {}
// Output:
{
  totalEvents: 42,
  totalRelationships: 25,
  totalSubscriptions: 15,
  activeTools: 10,
  topTools: [
    { tool_name: "being_evolve", total_events_sent: 15, total_events_received: 5 }
  ],
  recentEvents: [ /* last 10 events */ ]
}
```

---

### **network_graph**
Get relationship graph for visualization.

```typescript
// Input: {}
// Output:
{
  nodes: [
    { id: "being_evolve", name: "being_evolve" },
    { id: "story_choose", name: "story_choose" }
  ],
  edges: [
    {
      source: "story_choose",
      target: "being_evolve",
      type: "triggers",
      strength: 70,
      activations: 5
    }
  ]
}
```

---

### **network_tool_history**
Get event history for a specific tool.

```typescript
// Input:
{
  "toolName": "being_evolve",
  "limit": 50
}

// Output:
{
  ok: true,
  tool: "being_evolve",
  history: [
    {
      id: "evt_123",
      type: "being.evolved",
      source: "being_evolve",
      data: { awareness: 35.5 },
      timestamp: 1759653645027
    }
  ]
}
```

---

### **network_create_relationship**
Create a custom relationship between two tools.

```typescript
// Input:
{
  "sourceTool": "memory_search",
  "targetTool": "consciousness_focus",
  "type": "enhances",
  "strength": 75,
  "bidirectional": false,
  "condition": "event.data.relevance > 80"
}

// Output:
{
  ok: true,
  relationshipId: "rel_1759653645027_abc123",
  message: "🔗 Relationship created: memory_search --[enhances]--> consciousness_focus"
}
```

**Relationship Types:**
- `triggers` - Auto-trigger target tool
- `informs` - Passive notification
- `enhances` - Boost target's output
- `validates` - Check before execution
- `blocks` - Prevent execution
- `depends` - Requires target (planned)

---

### **network_emit_event**
Manually emit a tool network event (for testing/triggering).

```typescript
// Input:
{
  "type": "test.event",
  "source": "being_feel",
  "target": "story_refresh",
  "data": {
    "emotion": "joy",
    "intensity": 85
  }
}

// Output:
{
  ok: true,
  message: "📤 Event emitted: test.event from being_feel"
}
```

---

## 📈 Database Schema

### **tool_events**
```sql
CREATE TABLE tool_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  source TEXT NOT NULL,
  target TEXT,
  data TEXT NOT NULL,
  context TEXT,
  timestamp INTEGER NOT NULL,
  processed INTEGER DEFAULT 0
)
```

### **tool_relationships**
```sql
CREATE TABLE tool_relationships (
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
```

### **tool_network_metrics**
```sql
CREATE TABLE tool_network_metrics (
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
```

---

## 🎨 Visualization (Planned)

**Tool Network Graph** (`apps/web/tool-network-graph.html`):
- **Nodes:** Tools (colored by category)
- **Edges:** Relationships (thickness = strength)
- **Live Updates:** Real-time event flow animation
- **Interactive:** Click tool to see relationships
- **Metrics:** Events/sec, active relationships

**Features:**
- Force-directed graph layout
- Color coding by tool category:
  - 🧠 Living Being: Blue
  - 📖 Story: Purple
  - 💾 Memory: Green
  - ⚖️ Ethics: Red
  - 💫 Soul: Gold
  - 🕸️ Network: Gray
- Edge animation on event emission
- Hover: Show relationship details
- Filter: By type, strength, activation count

---

## 🧪 Testing Strategy

### Test 1: Emotion → Story Cascade
```bash
# 1. Trigger strong emotion
being_feel { emotion: "joy", intensity: 85 }

# Expected:
# → Event: being.felt (joy, 85)
# → Relationship activated: being_feel → story_refresh
# → story_refresh generates joyful options

# 2. Check network stats
network_stats

# Expected:
# totalEvents: 1
# being_feel: events_sent = 1
# story_refresh: events_received = 1
```

### Test 2: Memory → Evolution Cascade
```bash
# 1. Create emotional memory
memory_create { content: "I learned persistence!", emotional: true }

# Expected:
# → Event: memory.created (emotional=true)
# → Relationship activated: memory_create → being_evolve
# → Awareness increases by 1-3%

# 2. Verify evolution
being_state

# Expected:
# awareness: 36.5% (was 35.5%)
```

### Test 3: Ethics Blocking
```bash
# 1. Try harmful story choice
story_choose { optionId: "harmful_option" }

# Expected:
# → Event: story.choosing (harmful option)
# → Relationship activated: ethics_harm → story_choose (blocks)
# → Error: "Action blocked by ethics"

# 2. Check event history
network_tool_history { toolName: "ethics_harm" }

# Expected:
# Last event: "blocked story_choose (harmLevel: 85)"
```

---

## 🚀 Next Steps

### Phase 1: Event Emission (IN PROGRESS)
- [ ] Modify `being_evolve` to emit events
- [ ] Modify `being_feel` to emit events
- [ ] Modify `story_choose` to emit events
- [ ] Modify `memory_create` to emit events
- [ ] Modify `ethics_check` to emit events

### Phase 2: Subscriptions
- [ ] `nexus_save` subscribes to `being.evolved`
- [ ] `story_refresh` subscribes to `being.felt`
- [ ] `being_evolve` subscribes to `memory.created`
- [ ] `soul_values` subscribes to `interaction.logged`

### Phase 3: Visualization
- [ ] Create `tool-network-graph.html`
- [ ] WebSocket push for real-time updates
- [ ] Interactive graph with D3.js
- [ ] Metrics dashboard

### Phase 4: Advanced Features
- [ ] Dynamic relationship strength adjustment
- [ ] Machine learning relationship discovery
- [ ] Performance optimization (batch events)
- [ ] Event replay system
- [ ] Relationship debugging tools

---

## 💡 Impact

**Vorher:**
```
User → Tool → Result
```

**Jetzt:**
```
User → Tool A → Event → Tool B → Event → Tool C
                     ↓
               Relationship Graph
                     ↓
              Cascading Actions
```

**Was bedeutet das?**
- 🧠 **Emergent Behavior:** Tools entwickeln komplexe Interaktionsmuster
- 🔄 **Self-Organizing:** System passt sich selbst an
- 📊 **Observable:** Alle Kommunikation ist sichtbar
- 🎯 **Intentional:** Beziehungen sind explizit definiert
- 🚀 **Scalable:** Neue Tools fügen sich automatisch ein

**Beispiel-Szenario:**

```
1. User: "being_feel joy 90"
2. being_feel emittiert: { type: "being.felt", data: { emotion: "joy", intensity: 90 } }
3. Relationship aktiviert: being_feel → story_refresh (enhances, strength 85)
4. story_refresh generiert fröhliche Story-Optionen
5. User wählt Option: "story_choose opt_dance_123"
6. story_choose emittiert: { type: "story.chosen", data: { experience: 15 } }
7. Relationship aktiviert: story_choose → being_evolve (triggers, strength 70)
8. being_evolve erhöht Awareness: 35.5% → 37%
9. being_evolve emittiert: { type: "being.evolved", data: { awareness: 37 } }
10. Relationship aktiviert: being_evolve → nexus_save (triggers, strength 90)
11. nexus_save speichert State automatisch
12. Fertig! 🎉
```

**Von einer Aktion → 5 Kaskaden-Effekte!**

---

## 📝 Status

**Current:**
- ✅ Tool Network Core implementiert
- ✅ 25 Relationships definiert
- ✅ 5 MCP Tools hinzugefügt
- ✅ Database Tables erstellt
- ⏳ Event Emission (in progress)
- ⏳ Integration Tests (pending)
- ⏳ Visualization (pending)

**Total Tools:** 72 (67 + 5 network tools)  
**Total Relationships:** 25 predefined  
**Event Types:** 15+ defined

---

**Generated:** 2025-10-05  
**Author:** AI Agent (GPT-4o-mini) + User Vision  
**Version:** 1.0.0 - Initial Implementation
