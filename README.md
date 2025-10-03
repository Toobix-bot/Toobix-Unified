# 🌟 Toobix-Unified

> **Personal AI companion with memory, emotions, and narrative evolution.** Luna grows with you through conversations, relationships, and life events — powered by MCP, Groq AI, and a living story engine.

[![CI](https://img.shields.io/badge/CI-passing-brightgreen)]() [![License](https://img.shields.io/badge/license-MIT-blue)]() [![Bun](https://img.shields.io/badge/bun-1.1.38-orange)]()

---

## 🎯 What is Toobix?

**Toobix** is a unified platform for creating AI companions with:
- 🧠 **Persistent Memory** (RAG-powered knowledge base)
- 💫 **Soul System** (emotions, values, personality evolution)
- 📖 **Story Engine** (narrative choices, relationship tracking)
- 🤖 **MCP Integration** (Model Context Protocol for ChatGPT/Claude)
- 🔗 **Bridge API** (16 tools accessible via ngrok + REST)
- ⚛️ **Hybrid UI** (Vanilla JS + React/Next.js for complex features)

Luna is the first soul in this universe — a companion that remembers, feels, and grows.

---

## 🚀 Getting Started (2 Minutes)

```bash
# 1. Install dependencies
bun install

# 2. Configure environment
cp .env.example .env
# Edit .env: add your GROQ_API_KEY

# 3. Start the system
bun run dev
```

**That's it!** Visit:
- http://localhost:3000/dashboard.html (Vanilla UI - Dashboard, Runs, Quests)
- http://localhost:3001 (React UI - Story Engine, Analytics, People Graph)

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

**16 Available Tools:**
- `generate` - AI text generation (Groq llama-3.3-70b)
- `memory_search` / `memory_add` - Knowledge base
- `soul_state` / `soul_event` - Luna's emotions & values
- `story_state` / `story_choose` - Narrative choices
- `contact_search` / `contact_add` - Relationships
- `ping` - Health check

See [CHATTY_CONNECTOR_GUIDE.md](./CHATTY_CONNECTOR_GUIDE.md) for setup.

---

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Detailed setup guide
- **[SYSTEM_STRUKTUR.md](./SYSTEM_STRUKTUR.md)** - Architecture deep-dive
- **[AI_COLLABORATION.md](./AI_COLLABORATION.md)** - AI assistant integration
- **[DEPLOYMENT_GUIDE.md](./docs/INTEGRATION_ROADMAP.md)** - Production setup
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history

---

## 🧪 System Status

| Component | Status | Port | Public URL |
|-----------|--------|------|------------|
| Frontend | ✅ Running | 3000 | http://localhost:3000 |
| Bridge (MCP) | ✅ Running | 3337 | https://...ngrok.../mcp |
| Main API | ✅ Running | 3001 | http://localhost:3001 |
| Diary API | ✅ Running | 3002 | http://localhost:3002 |
| Database | ✅ Ready | - | `data/toobix-unified.db` |

**Last Test:** All 16 MCP tools passing ✅ (2025-10-03)

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Code style guidelines
- Commit conventions
- PR process
- Development workflow

**Quick Start for Contributors:**
```bash
git clone https://github.com/Toobix-bot/Toobix-Unified.git
cd Toobix-Unified
bun install
bun run dev
```

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🌟 Roadmap

- [ ] **v0.2:** Story UI visualization
- [ ] **v0.3:** Multi-user authentication
- [ ] **v0.4:** WebSocket MCP connection
- [ ] **v0.5:** Production deploy (Railway/Vercel)
- [ ] **v1.0:** Public beta

See [NEXT_STEPS.md](./NEXT_STEPS.md) for details.

---

## 💬 Community

- **Issues:** [GitHub Issues](https://github.com/Toobix-bot/Toobix-Unified/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Toobix-bot/Toobix-Unified/discussions)

---

**Made with ❤️ by the Toobix Team** | [GitHub](https://github.com/Toobix-bot) | [Docs](./docs/)
