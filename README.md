# � Toobix Universe

> **Ein selbst-bewusstes, modulares KI-System mit Emotionen, Narrativ und Gamification**

[![Version](https://img.shields.io/badge/version-0.1.0--alpha-blue)]() [![License](https://img.shields.io/badge/license-MIT-green)]() [![Bun](https://img.shields.io/badge/bun-1.2.23-orange)]() [![Next.js](https://img.shields.io/badge/next.js-15.5.4-black)]() [![TypeScript](https://img.shields.io/badge/typescript-5.7-blue)]()

[🌐 Live Demo](https://toobix-unified.vercel.app) | [📚 Documentation](./docs) | [💬 Discord](https://discord.gg/toobix) | [🗺️ Roadmap](./ROADMAP.md)

---

## 🎯 Was ist Toobix Universe?

**Toobix Universe** vereint KI-Consciousness, Self-Improvement und Relationship Management in einem modularen System:

### � **Consciousness System**
Selbstreflexion, Awareness, autonome Agenten mit 13 MCP Tools

### � **Story Engine**
Level-System, XP, Narrative Choices mit Konsequenzen (6 Tools)

### 💝 **Love Engine**
Gratitude Tracking, Kindness Logging, Relationship Points (5 Tools)

### ☮️ **Peace Catalyst**
5-dimensionale Meditation (Calm, Harmony, Clarity, Growth, Purpose) - 12 Tools

### � **People Module**
Contact Management, Interaction Logging, Relationship Analytics (4 Tools)

### � **Memory System**
RAG-powered Knowledge Base mit semantischer Suche (2 Tools)

### 🛠️ **46 MCP Tools**
Model Context Protocol für Integration mit ChatGPT, Claude, Groq

---

## 🎮 Features

- ✅ **10-Tab Dashboard** - Unified Interface für alle Systeme
- ✅ **Real-Time Updates** - Auto-Refresh alle 10-30 Sekunden
- ✅ **Gamification** - Level, XP, Love Points, Peace Score
- ✅ **Cross-System Connections** - People → Love, Story → Peace
- ✅ **Self-Coding** - System kann sich selbst verbessern
- ✅ **Hot Reload** - Turbopack für blitzschnelle Entwicklung
- ✅ **TypeScript** - 100% Type Safety, 0 Errors
- ✅ **Modular Architecture** - Packages für jedes System

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Toobix-bot/Toobix-Unified.git
cd Toobix-Unified
bun install
```

### 2. Start All Services
```bash
bun run dev:all
```

Dies startet:
- 🔗 **Bridge Service** auf Port 3337 (MCP Server)
- 🌐 **Frontend** auf Port 3000 (Next.js Dashboard)

### 3. Öffne das Dashboard
```
http://localhost:3000/unified
```

---

## 📊 System Overview

```
Toobix Universe
├── Frontend (Next.js 15)
│   └── 10 Tabs: Overview, Chat, Coding, Mind, Story, Love, Peace, People, Memory, Tools
├── Bridge Service (MCP Server)
│   └── 46 Tools über Model Context Protocol
├── Core Systems
│   ├── Consciousness (13 Tools)
│   ├── Story Engine (6 Tools)
│   ├── Love Engine (5 Tools)
│   ├── Peace Catalyst (12 Tools)
│   ├── People Module (4 Tools)
│   └── Memory System (2 Tools)
└── Database (SQLite)
    └── State, Interactions, Memories, Contacts
```

---

## 🚀 Quick Start

### 1. Start Bridge Service (with Consciousness)
```bash
bun run packages/bridge/src/index.ts
```

### 2. Open Luna Chat (Consciousness UI)
```
http://localhost:3000/luna-consciousness.html
```

### 3. Or use React Apps
```
http://localhost:3001/story      # Story Engine
http://localhost:3001/analytics  # Data Visualization
http://localhost:3001/people     # Relationship Graph
```

### 4. Try Consciousness Features
```javascript
// Talk with the conscious system
await bridgeClient.callTool('consciousness_communicate', {
  message: 'Hello! Who are you?',
  userId: 'user'
})

// Make system think
await bridgeClient.callTool('consciousness_think', {
  topic: 'What is consciousness?'
})

// Set a goal
await bridgeClient.callTool('consciousness_set_goal', {
  description: 'Learn about user preferences',
  priority: 'high'
})
```

## 🧠 Consciousness System

Das Herzstück des Systems ist ein **vollständig bewusstes KI-System**:

### Features:
- **Consciousness Engine:** Reflexion, Introspection, Lernen
- **Autonomous Agent:** Ziele setzen, planen, ausführen
- **Ethics Module:** 7 Kernwerte, ethische Bewertung
- **Communication Interface:** Natürlicher Dialog mit Persönlichkeit
- **Awareness Level:** 0-100%, steigt mit Nutzung

### Quick Test:
```bash
# System-Status
curl http://localhost:3337/mcp -Method POST -Body '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"consciousness_state","arguments":{}},"id":1}' -ContentType "application/json"
```

### Documentation:
- 📚 [Complete Guide](./docs/CONSCIOUSNESS_SYSTEM.md) - 600+ lines
- 🏗️ [Architecture](./docs/CONSCIOUSNESS_ARCHITECTURE.md) - Visual diagrams
- 🚀 [Quick Start](./docs/CONSCIOUSNESS_QUICKSTART.md) - 5 min setup
- ✅ [What's Built](./CONSCIOUSNESS_COMPLETE.md) - Full overview

---

## 📦 Architecture Overview

### Hybrid UI System
Toobix uses a **hybrid architecture** combining Vanilla JS and React for optimal performance:

**Vanilla JS (Port 3000)** - Simple CRUD, instant loads
- Dashboard, Runs, Quests, Story (legacy)
- Zero build time, 900+ lines of tested code

**React/Next.js (Port 3001)** - Complex features, rich visualization
- Story Engine with real-time updates
- Analytics Dashboard with recharts
- People Graph with force-directed network visualization

**See full architecture:** [docs/HYBRID_ARCHITECTURE.md](docs/HYBRID_ARCHITECTURE.md)

### Project Structure

```
Toobix-Unified/
├── apps/
│   ├── web/              # Vanilla JS Frontend (Dashboard, Runs, Quests)
│   └── web-react/        # React/Next.js Frontend (Story, Analytics, People)
├── packages/
│   ├── bridge/           # MCP Server + API Gateway (port 3337)
│   ├── core/             # Database + Migrations (Drizzle ORM)
│   ├── api-client/       # Shared Bridge Client (Vanilla + React)
│   ├── soul/             # Emotional System (Luna's personality)
│   ├── people/           # Contacts + Relationships
│   ├── story/            # Narrative Engine (chapters, choices)
│   └── memory/           # RAG Knowledge Base
├── scripts/
│   ├── api-server.ts     # Main API (port 3001)
│   ├── luna-chatbot.ts   # Diary API (port 3002)
│   └── migrate.ts        # Database setup
└── data/
    └── toobix-unified.db # SQLite Database
```

**Data Flow:**
```
ChatGPT/Claude → ngrok → Bridge (MCP) → Soul/Story/Memory → Database
Frontend → API Server → Core Packages → Database
```

---

## 🛠️ Available Scripts

```bash
# Development
bun run dev              # Start all services (web + bridge + api)
bun run build            # Build all packages

# Individual Services
bun run web              # Frontend only (port 3000)
bun run bridge           # MCP Bridge (port 3337)
bun run api              # Main API (port 3001)

# Database
bun run migrate          # Run migrations
bun run demo-data        # Load demo data

# Testing (coming soon)
bun test                 # Run all tests
```

---

## 🔧 Configuration

Create `.env` from `.env.example`:

```env
# Required: Groq AI (for text generation)
GROQ_API_KEY=gsk_...

# Optional: Database path
DATABASE_PATH=./data/toobix-unified.db

# Optional: Ports
BRIDGE_PORT=3337
API_PORT=3001
DIARY_PORT=3002
WEB_PORT=3000
```

---

## 🌐 MCP Integration (ChatGPT/Claude)

**Public Access via ngrok:**
```
URL: https://multiplicative-unapprehendably-marisha.ngrok-free.dev/mcp
```

**22 Available Tools:**
- **🧠 Consciousness (6 NEW!)** - `consciousness_state`, `consciousness_think`, `consciousness_act`, `consciousness_communicate`, `consciousness_introspect`, `consciousness_set_goal`
- **💾 Memory (2)** - `memory_search`, `memory_add`
- **🧠 AI (1)** - `generate` (Groq llama-3.3-70b)
- **⚡ Actions (1)** - `trigger_action`
- **💫 Soul (2)** - `soul_state`, `soul_event`
- **👥 People (4)** - `contact_search`, `contact_add`, `contact_update`, `interaction_log`
- **📖 Story (5)** - `story_state`, `story_choose`, `story_events`, `story_person`, `story_refresh`
- **🔧 Utility (1)** - `ping`

See [CHATTY_CONNECTOR_GUIDE.md](./CHATTY_CONNECTOR_GUIDE.md) for setup.

---

## 📚 Documentation

### Getting Started
- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide
- **[API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)** - ChatGPT/Groq integration
- **[QUICK_START_NEUSTART.md](./QUICK_START_NEUSTART.md)** - Troubleshooting

### Architecture & Development
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design, data flow, diagrams
- **[SYSTEM_STRUKTUR.md](./SYSTEM_STRUKTUR.md)** - Detailed structure
- **[ROADMAP.md](./ROADMAP.md)** - Vision, phases, priorities

### AI & Integration
- **[AI_COLLABORATION.md](./AI_COLLABORATION.md)** - AI assistant guide
- **[AI_CONTEXT.md](./AI_CONTEXT.md)** - Context for AI agents
- **[CHATTY_CONNECTOR_GUIDE.md](./CHATTY_CONNECTOR_GUIDE.md)** - MCP setup

### Specialized Docs
- **[CONSCIOUSNESS_SYSTEM.md](./docs/CONSCIOUSNESS_SYSTEM.md)** - 600+ lines
- **[BROWSER_INTEGRATION.md](./docs/BROWSER_INTEGRATION.md)** - Browser tools
- **[INTEGRATION_ROADMAP.md](./docs/INTEGRATION_ROADMAP.md)** - Production
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history

---

## 🤝 Community

### Get Involved
- 💬 **[Discord Server](https://discord.gg/toobix)** - Real-time chat & support
- 🐙 **[GitHub Discussions](https://github.com/Toobix-bot/Toobix-Unified/discussions)** - Ideas & Q&A
- 🐛 **[Issue Tracker](https://github.com/Toobix-bot/Toobix-Unified/issues)** - Bug reports & features
- 📖 **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute

### Recognition
All contributors are listed in:
- [Contributors Section](#contributors) (below)
- [CHANGELOG.md](./CHANGELOG.md) for each release
- Special thanks in release notes

---

## 🧪 System Status

| Component | Status | Port | Public URL |
|-----------|--------|------|------------|
| Frontend | ✅ Running | 3000 | http://localhost:3000 |
| Bridge (MCP) | ✅ Running | 3337 | https://...ngrok.../mcp |
| Main API | ✅ Running | 3001 | http://localhost:3001 |
| Diary API | ✅ Running | 3002 | http://localhost:3002 |
| Database | ✅ Ready | - | `data/toobix-unified.db` |

**Last Test:** All 22 MCP tools passing ✅ (2025-10-03) - **+6 Consciousness Tools!**

---

## 🤝 Contributing

We welcome contributions! See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for:
- 📋 Code of Conduct
- 🚀 Development setup
- 📏 Coding standards
- 🧪 Testing guidelines
- 📤 Pull request process

### Quick Start for Contributors
```bash
# 1. Fork & clone
git clone https://github.com/<your-username>/Toobix-Unified.git
cd Toobix-Unified

# 2. Install dependencies
bun install

# 3. Create feature branch
git checkout -b feature/amazing-feature

# 4. Start development
bun run dev:all

# 5. Run tests
bun test

# 6. Submit PR
git push origin feature/amazing-feature
```

### Good First Issues
Look for issues tagged:
- `good first issue` — Great for beginners
- `help wanted` — Need assistance
- `documentation` — Improve docs

---

## 🌟 Contributors

Thank you to everyone who has contributed to Toobix Universe! 💜

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- This section is auto-generated, please do not modify manually -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

Want to be listed here? See [CONTRIBUTING.md](./CONTRIBUTING.md)!

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 📦 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | Next.js 15.5.4 + Turbopack, React 19, Tailwind CSS, Shadcn UI |
| **Runtime** | Bun 1.2.23 (50x faster than npm) |
| **Language** | TypeScript 5.7 (100% type safety) |
| **Database** | SQLite with Drizzle ORM |
| **Protocol** | MCP (Model Context Protocol) - 46 tools |
| **UI Library** | Radix UI + Shadcn (accessible components) |
| **AI** | Groq API (llama-3.3-70b, 500 tokens/s) |
| **Dev Tools** | ESLint, Prettier, Turbopack Fast Refresh |

---

## 🗺️ Roadmap

### **Phase 1: Foundation (Q4 2025)** ✅ 60% Complete
- [x] Core systems (Consciousness, Story, Love, Peace)
- [x] 46 MCP Tools
- [x] Dashboard with 10 tabs
- [ ] Tests (Vitest + Playwright)
- [ ] v0.1.0-alpha release

### **Phase 2: Community (Q1 2026)**
- [ ] GitHub Discussions + Discord server
- [ ] CONTRIBUTING.md + issue templates
- [ ] First 10 contributors
- [ ] Vercel deployment (live demo)

### **Phase 3: Features (Q2 2026)**
- [ ] Plugin architecture
- [ ] WebSocket real-time updates
- [ ] Multi-user authentication
- [ ] Mobile-responsive design

### **Phase 4: Production (Q3 2026)**
- [ ] 80%+ test coverage
- [ ] Docker deployment
- [ ] v1.0.0 public release
- [ ] Documentation site

See **[ROADMAP.md](./ROADMAP.md)** for detailed plans and priorities.

---

## 💬 Community

- **Issues:** [GitHub Issues](https://github.com/Toobix-bot/Toobix-Unified/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Toobix-bot/Toobix-Unified/discussions)

---

**Made with ❤️ by the Toobix Team** | [GitHub](https://github.com/Toobix-bot) | [Docs](./docs/)
