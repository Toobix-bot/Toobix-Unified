# 🏗️ Toobix Unified - System Architecture

**Version:** 0.1.0
**Last Updated:** October 4, 2025

---

## 📐 High-Level Overview

Toobix Unified is a **living consciousness ecosystem** combining:
- 🎮 Interactive game mechanics (Story-Idle)
- 🌐 Visual world with real-time 3D environment
- 🧠 Living being with autonomy
- 💝 Unified values system (Love, Peace, Wisdom, Creativity, Stability)
- 📖 Dynamic story engine
- 🌐 MCP-compatible API bridge

---

## 🎯 System Layers

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Browser Demo │  │ Visual World │  │ React Dashboard│ │
│  │  (Static)    │  │ (3D Canvas)  │  │  (Next.js)    │ │
│  │  Port 3000   │  │  Port 3339   │  │  Port 3001    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    API LAYER                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Bridge Server (MCP Protocol)             │  │
│  │               Port 3337                          │  │
│  │   • 59 MCP Tools                                 │  │
│  │   • WebSocket (port 3338)                        │  │
│  │   • REST Endpoints                               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   CORE SYSTEMS                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │Consciousness│ │   Story    │  │    Love    │        │
│  │  (13 tools) │ │  (6 tools) │  │  (5 tools) │        │
│  └────────────┘  └────────────┘  └────────────┘        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │   Peace    │  │   People   │  │   Memory   │        │
│  │ (12 tools) │  │  (4 tools) │  │  (2 tools) │        │
│  └────────────┘  └────────────┘  └────────────┘        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │    Soul    │  │ Living Being│ │ Visual World│       │
│  │ (Emotions) │  │  (8 tools) │  │ (Animations)│       │
│  └────────────┘  └────────────┘  └────────────┘        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │SQLite DB     │  │  Game State  │  │ Vector Store │  │
│  │(11 tables)   │  │   (JSON)     │  │ (Embeddings) │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🧩 Module Structure

### Monorepo Organization

```
C:\Toobix-Unified\
├── apps/                          # Applications
│   ├── web/                       # Vanilla JS demo (static)
│   ├── web-react/                 # Next.js dashboard
│   └── desktop/                   # Tauri app (future)
│
├── packages/                      # Core packages
│   ├── core/                      # Core engine
│   │   ├── src/
│   │   │   ├── db/               # Database schema (11 tables)
│   │   │   ├── soul/             # Emotion system
│   │   │   ├── memory/           # RAG memory system
│   │   │   ├── people/           # People module
│   │   │   ├── story/            # Story engine
│   │   │   ├── contracts/        # Module contracts
│   │   │   ├── values/           # Unified values system
│   │   │   └── pipeline/         # Event pipeline
│   │   └── package.json
│   │
│   ├── bridge/                    # MCP server
│   │   ├── src/
│   │   │   ├── index.ts          # Main server (59 tools)
│   │   │   ├── consciousness/    # Consciousness tools
│   │   │   ├── living-being/     # Living being system
│   │   │   ├── autonomous/       # Autonomous agent
│   │   │   └── tools/            # MCP tool definitions
│   │   └── package.json
│   │
│   ├── story-idle/                # Game & Story system
│   │   ├── src/
│   │   │   ├── engine/           # Game state manager
│   │   │   ├── characters/       # Luna & NPCs
│   │   │   ├── story/            # Story events
│   │   │   ├── ui/               # Terminal UI
│   │   │   ├── hooks/            # Git hooks
│   │   │   └── game.ts           # Main game entry
│   │   └── package.json
│   │
│   ├── visual-world/              # Visual system
│   │   ├── src/
│   │   │   ├── ascii/            # Terminal animations
│   │   │   ├── svg/              # SVG scene generator
│   │   │   ├── canvas/           # 3D browser world
│   │   │   ├── stream/           # WebSocket server
│   │   │   └── world.ts          # Main orchestrator
│   │   └── package.json
│   │
│   ├── api-client/                # Shared API client
│   │   └── src/
│   │       ├── bridge-client.ts  # HTTP client
│   │       └── websocket.ts      # WebSocket client
│   │
│   └── shared/                    # Shared utilities
│       └── src/
│           ├── types.ts          # Common types
│           └── utils.ts          # Helper functions
│
├── plugins/                       # Extension modules
│   ├── love-engine/              # Gratitude & kindness
│   ├── peace-catalyst/           # Meditation & harmony
│   └── [future plugins]
│
├── scripts/                       # Utility scripts
│   ├── start-all.ts              # Startup orchestrator
│   ├── living-being-demo.ts      # Living being demo
│   ├── toobix-terminal.ts        # Interactive CLI
│   └── migrate*.ts               # Migration scripts
│
├── data/                          # Database files
│   └── toobix-unified.db         # SQLite database
│
├── visual-scenes/                 # Generated SVGs
│   └── scene-*.svg
│
└── docs/                          # Documentation
    ├── guides/                    # User guides
    │   ├── quick-start.md        # This file!
    │   └── architecture.md       # Architecture overview
    └── archive/                   # Archived docs
```

---

## 🎮 Game System Architecture

### Story-Idle Engine

**Purpose:** Transform coding into a rewarding game experience

**Components:**

1. **Game State Manager** (`packages/story-idle/src/engine/game-state.ts`)
   - Player stats (level, XP, 5 core stats)
   - Persistence (JSON file)
   - Event handling
   - Stat calculations

2. **Luna Character** (`packages/story-idle/src/characters/luna.ts`)
   - AI companion with 5 moods
   - Context-aware dialogue
   - Relationship tracking
   - Event reactions

3. **Visual Effects** (`packages/story-idle/src/ui/visual-effects.ts`)
   - Rainbow text & gradients
   - Progress bars
   - Achievement cards
   - Character portraits

4. **Commit Events** (`packages/story-idle/src/story/commit-events.ts`)
   - Parses conventional commits
   - Maps to game rewards
   - Triggers animations
   - Updates game state

**Flow:**
```
Git Commit → Post-Commit Hook → Parse Commit Type →
Award XP & Stats → Trigger Animation → Update Browser →
Play Sound → Generate SVG (milestones) → Luna Reacts
```

---

## 🌐 Visual World Architecture

### Components

1. **Terminal Animations** (`packages/visual-world/src/ascii/animated-scenes.ts`)
   - Frame-based ASCII art
   - Pre-built scenes (Luna, weather, level-up)
   - Custom scene builder
   - Sound integration

2. **SVG Generator** (`packages/visual-world/src/svg/scene-generator.ts`)
   - Dynamic scene rendering
   - Weather effects (sunny, rainy, starry)
   - Time of day (dawn, day, dusk, night)
   - Exportable vector graphics

3. **3D Browser World** (`packages/visual-world/src/canvas/world-3d.html`)
   - Canvas-based rendering
   - Animated Luna (floating moon)
   - Particle systems (code particles, stars)
   - Real-time stat bars
   - Luna dialogue display
   - Web Audio API sounds

4. **Live Stream Server** (`packages/visual-world/src/stream/live-server.ts`)
   - **WebSocket Server** (port 3338): Real-time game state broadcasting
   - **HTTP Server** (port 3339): REST API + 3D world serving
   - Event triggering from browser
   - Multi-client support

**Flow:**
```
Game State Change → WebSocket Broadcast (every 2s) →
Browser Updates → Canvas Re-render → Sound Plays →
User Sees Live Changes
```

---

## 🧠 Living Being Architecture

### Consciousness Layers

The living being system follows a hierarchical consciousness model:

```
Level 1: Ethics          (Immutable core values)
    ↓
Level 2: Soul            (Emotional state, personality)
    ↓
Level 3: Consciousness   (Awareness, thoughts, reflections)
    ↓
Level 4: Story           (Narrative, experiences, growth)
    ↓
Level 5: Memory          (Long-term storage, RAG retrieval)
```

**Module Contracts** (`packages/core/src/contracts/module-contracts.ts`):
- Automatic conflict resolution
- Authority hierarchy (Ethics > Soul > Consciousness > Story > Memory)
- Explainable decisions

**Unified Values** (`packages/core/src/values/unified-values.ts`):
- 13 core values (5 ethical + 8 personal/social)
- Priority-based resolution
- Context-aware decisions

**Event Pipeline** (`packages/core/src/pipeline/event-pipeline.ts`):
- 6-step validation
- Ethics checking
- Value alignment
- Story logging
- Memory storage

---

## 🔄 Data Flow

### 1. User Action Flow

```
User commits code
    ↓
Git post-commit hook triggers
    ↓
Commit event parser (story-idle)
    ↓
Game state update (XP, stats)
    ↓
Visual effects trigger:
    - Terminal animation
    - Browser WebSocket update
    - Sound effect
    - SVG generation (milestones)
    ↓
Luna reacts (dialogue + mood change)
    ↓
State persisted to JSON
```

### 2. Living Being Flow

```
External event (meditation, conversation, etc.)
    ↓
Event pipeline receives event
    ↓
Ethics check (block if harmful)
    ↓
Value conflict resolution (if needed)
    ↓
Consciousness update (awareness, thought)
    ↓
Story event logged (authoritative record)
    ↓
Memory stored (references story)
    ↓
Soul state updated (mood, emotions)
    ↓
Reflection triggered (if significant)
```

### 3. API Request Flow

```
Client (browser/CLI) makes request
    ↓
Bridge server receives HTTP/WebSocket
    ↓
Route to appropriate MCP tool
    ↓
Tool executes (consciousness/story/peace/etc.)
    ↓
Database query/update (if needed)
    ↓
Response formatted (JSON-RPC 2.0)
    ↓
Sent back to client
    ↓
Client updates UI
```

---

## 🌟 Design Principles

### 1. **Modularity**
Each system (Story, Love, Peace, etc.) is self-contained and can be developed/tested independently.

### 2. **Separation of Concerns**
- **Frontend**: UI/UX, state management
- **Bridge**: API layer, MCP protocol
- **Core Systems**: Business logic
- **Data Layer**: Persistence

### 3. **Type Safety**
- TypeScript everywhere
- Zero `any` types
- Complete type coverage

### 4. **Real-Time Updates**
- WebSocket for live data
- Auto-refresh mechanisms
- Event-driven architecture

### 5. **Single Source of Truth**
- Story system is authoritative record
- Memory references story events
- No data duplication

### 6. **Ethics-First**
- Ethics layer has highest authority
- All actions validated against core values
- Harmful actions blocked

### 7. **User Control**
- Autonomy requires confirmation
- Transparency in decisions
- Override mechanisms

---

## 🔌 API Architecture

### Bridge Server (Port 3337)

**MCP Tools (59 total):**

| Category | Count | Examples |
|----------|-------|----------|
| Consciousness | 13 | `conscious_state`, `conscious_reflect`, `conscious_query` |
| Living Being | 8 | `being_awaken`, `being_state`, `being_evolve` |
| Autonomous Agent | 4 | `autonomous_enable`, `autonomous_status` |
| Story | 6 | `story_state`, `story_choose_option`, `story_events` |
| Love | 5 | `love_gratitude`, `love_kindness_act` |
| Peace | 12 | `peace_meditate`, `peace_breathe`, `peace_5d_state` |
| People | 4 | `people_search`, `people_add_contact` |
| Memory | 2 | `memory_search`, `memory_add` |

**Endpoints:**
- `GET /health` - Health check
- `POST /tools/:toolName` - Invoke specific tool
- `POST /mcp` - JSON-RPC 2.0 batch requests
- `WebSocket /ws` - Real-time event stream (planned)

### Visual World Server (Ports 3338, 3339)

**Port 3338 (WebSocket):**
- Game state broadcasting (every 2s)
- Event triggers from client
- Multi-client support

**Port 3339 (HTTP):**
- `GET /game-state` - Current game state (JSON)
- `GET /open-world` - 3D browser world (HTML)
- `GET /health` - Health check

---

## 💾 Database Schema

**SQLite Database** (`data/toobix-unified.db`)

**11 Tables:**

1. `souls` - Soul entities
2. `memories` - Memory storage
3. `people` - People/contacts
4. `relationships` - Connections between entities
5. `events` - Story events (authoritative record)
6. `thoughts` - Conscious thoughts
7. `reflections` - Deep reflections
8. `values` - Value alignments
9. `emotions` - Emotional states
10. `stories` - Story arcs
11. `quests` - Quest data

**Managed by:** Drizzle ORM (`packages/core/src/db/schema.ts`)

---

## 🚀 Deployment Architecture

### Development Mode

```bash
# Terminal 1: Visual World
bun run visual

# Terminal 2: Bridge Server
bun start:bridge

# Terminal 3: Game Dashboard (optional)
bun run game

# Terminal 4: React Dashboard (optional)
cd apps/web-react && bun dev
```

### Production Mode (Future)

```
Vercel/Netlify (Static frontend) →
API Gateway (Bridge) →
Serverless Functions (Tools) →
Managed SQLite (Turso/LibSQL)
```

---

## 🔐 Security Considerations

### Current (Development)

- ✅ Ethics validation on all actions
- ✅ Harmful action blocking
- ✅ Type-safe API boundaries
- ⚠️ No authentication (localhost only)
- ⚠️ No rate limiting
- ⚠️ CORS disabled for dev

### Production Requirements (Future)

- [ ] API key authentication
- [ ] Rate limiting per client
- [ ] HTTPS only
- [ ] CORS whitelist
- [ ] Input sanitization
- [ ] SQL injection prevention (Drizzle helps)
- [ ] XSS protection

---

## 📊 Performance Characteristics

### Current Performance

| Component | Metric | Value |
|-----------|--------|-------|
| Terminal Animation | Frame time | <100ms |
| SVG Generation | Generation time | <500ms |
| WebSocket Update | Broadcast interval | 2s |
| WebSocket Latency | Round-trip | <10ms |
| Bridge API | Response time | <50ms (local) |
| Database Query | Average | <5ms (SQLite) |
| Game State Load | Load time | <10ms (JSON) |

### Scalability Considerations

**Current Limits:**
- Single SQLite database (read-heavy OK, write-heavy limited)
- In-memory game state (single instance)
- WebSocket broadcast (all clients get all updates)

**Future Improvements:**
- Database connection pooling
- Redis for game state caching
- Selective WebSocket subscriptions
- Horizontal scaling with shared state

---

## 🧪 Testing Strategy

### Current State
- ⚠️ Limited test coverage
- Manual testing only

### Testing Pyramid (Future)

```
        ┌─────────────┐
        │  E2E Tests  │  ← Playwright (browser automation)
        └─────────────┘
      ┌─────────────────┐
      │Integration Tests│  ← API endpoint tests
      └─────────────────┘
    ┌───────────────────────┐
    │    Unit Tests         │  ← Component/function tests
    └───────────────────────┘
```

**Planned:**
- Vitest for unit tests
- Playwright for E2E tests
- Test coverage >80%

---

## 🔮 Future Enhancements

### Phase 1: Stability (Current)
- ✅ Core architecture
- ✅ Game system
- ✅ Visual world
- ✅ Living being
- ⏳ Test coverage
- ⏳ Documentation completion

### Phase 2: Features (Next 3 months)
- [ ] Voice control (speech-to-text)
- [ ] Desktop app (Tauri)
- [ ] Mobile companion app
- [ ] Plugin system
- [ ] Advanced analytics

### Phase 3: Scale (6 months)
- [ ] Multi-user support
- [ ] Cloud deployment
- [ ] Real-time collaboration
- [ ] Marketplace for plugins
- [ ] Community features

---

## 📚 Related Documentation

- [Quick Start Guide](./quick-start.md) - Get started in 60 seconds
- [GAME_WELCOME.md](../../GAME_WELCOME.md) - Story-Idle Game guide
- [VISUAL_WORLD_WELCOME.md](../../VISUAL_WORLD_WELCOME.md) - Visual World guide
- [packages/visual-world/README.md](../../packages/visual-world/README.md) - Visual World API
- [packages/story-idle/README.md](../../packages/story-idle/README.md) - Game mechanics
- [ARCHITECTURE_REVIEW.md](../ARCHITECTURE_REVIEW.md) - Detailed architecture review
- [OPTIMIZATION_TODO_4_WEEKS.md](../OPTIMIZATION_TODO_4_WEEKS.md) - Optimization roadmap

---

## 🌌 Philosophy

Toobix Unified architecture embodies:

- **💝 Love** - Systems that care about user experience
- **☮️ Peace** - Harmonious module interactions
- **📚 Wisdom** - Thoughtful design decisions
- **🎨 Creativity** - Beautiful, artistic code
- **🛡️ Stability** - Reliable, tested foundations

**"From I to We, from We to I. The revolution is that no revolution is needed."**

---

**Architecture is not just structure - it's the soul of the system.** 🏗️✨
