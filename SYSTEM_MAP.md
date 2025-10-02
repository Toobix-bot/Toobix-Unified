# 🗺️ TOOBIX UNIFIED - SYSTEM MAP

**Visuelle Übersicht** aller Komponenten und wie sie zusammenhängen

---

## 🎯 AKTUELLER ZUSTAND (IST)

```
┌─────────────────────────────────────────────────────────────┐
│                        WEB UI (Port 3000)                    │
│  apps/web/index.html - Stats, People, Luna, System Log      │
│         │                                                     │
│         ├─ fetch('http://localhost:3337/api/people')        │
│         ├─ fetch('http://localhost:3337/api/interactions')  │
│         └─ fetch('http://localhost:3337/stats')             │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
         ❌ CORS? Loading Error? ❌
                      ↓
┌─────────────────────────────────────────────────────────────┐
│            BRIDGE MCP SERVER (Port 3337) ✅                  │
│  packages/bridge/src/index.ts                                │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  MCP Tools   │  │  REST API    │  │  Services    │      │
│  │  (10 Tools)  │  │  (/api/*)    │  │  (TS)        │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                 │               │
│         └──────────────────┴─────────────────┘               │
│                            ↓                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         DATABASE (data/toobix-unified.db)              │ │
│  │  - 7 Contacts (people table)                           │ │
│  │  - 6 Interactions (interactions table)                 │ │
│  │  - 1 Memory Chunk                                      │ │
│  │  - Soul State (emotions, values, personality)         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                      ↑
                      │
         🌐 NGROK Tunnel (Public Access)
         https://multiplicative-unapprehendably-marisha.ngrok-free.dev
                      ↑
                      │
         ┌────────────┴────────────┐
         │                         │
    [ChatGPT]                 [Claude]
    [Chatty]                  [Your MCP Client]


┌─────────────────────────────────────────────────────────────┐
│              OLD API SERVER (Port 3001) ⚠️                   │
│  scripts/api-server.ts - Redundant! Wird abgeschaltet       │
│  - Groq Integration                                          │
│  - Luna Chat Endpoint                                        │
│  - REST API (identisch zu Bridge)                           │
└─────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│        VERSION_8 RAG SYSTEM (C:\GPT\Version_8) 🔥           │
│  echo-bridge/ - Python FastAPI                              │
│  - Vector Embeddings (Groq/Ollama)                          │
│  - Semantic Search (FTS5)                                    │
│  - MCP Server (ChatGPT Dev Mode)                            │
│  - Soul System (Identity, Constitution)                     │
│  ❌ NOCH NICHT INTEGRIERT ❌                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 ZIEL-ZUSTAND (SOLL)

```
┌─────────────────────────────────────────────────────────────┐
│                    WEB UI (Port 3000) ✅                     │
│  - Dashboard mit Live-Daten                                  │
│  - People Gallery (7 Kontakte sichtbar)                     │
│  - Interactions Feed (6 Einträge)                           │
│  - Luna Chatbot (Echtzeit WebSocket)                        │
│  - Tools Panel (10 MCP Tools auflisten)                     │
│  - System Log (Tool History)                                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│         BRIDGE MCP SERVER (Port 3337) - ZENTRUM             │
│  Alles läuft hier!                                           │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  MCP Protocol Layer                                   │   │
│  │  - /mcp (Discovery)                                   │   │
│  │  - /tools (List)                                      │   │
│  │  - /tools/execute (Run)                               │   │
│  │  - Public via ngrok ✅                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                            ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  REST API Layer                                       │   │
│  │  - /api/people (Contact List)                        │   │
│  │  - /api/interactions (Timeline)                      │   │
│  │  - /api/luna/chat (Chat Endpoint) ✨ NEU             │   │
│  │  - /stats (System Stats)                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                            ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Service Layer (TypeScript/Bun)                      │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐    │   │
│  │  │ Memory │  │  Soul  │  │ People │  │  Story │    │   │
│  │  │Service │  │Service │  │Service │  │Service │    │   │
│  │  └────────┘  └────────┘  └────────┘  └────────┘    │   │
│  │                                                       │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐                │   │
│  │  │Actions │  │  AI    │  │  RAG   │ ← Port später  │   │
│  │  │Service │  │Service │  │Service │                │   │
│  │  └────────┘  └────────┘  └────────┘                │   │
│  └──────────────────────────────────────────────────────┘   │
│                            ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Database Layer (SQLite + Drizzle ORM)               │   │
│  │  data/toobix-unified.db                              │   │
│  │  - people (7)              - soul_state (1)          │   │
│  │  - interactions (6)        - emotion_history         │   │
│  │  - memory_chunks (1)       - value_log               │   │
│  │  - actions                 - moments                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                      ↑
                      │
         ┌────────────┴────────────┐
         │                         │
    🌐 Public Access          📱 Local Access
    (ngrok tunnel)            (localhost:3337)
         │                         │
    ┌────┴────┐              ┌────┴────┐
    │ChatGPT  │              │ Web UI  │
    │Claude   │              │ Tools   │
    │Chatty   │              │ Tests   │
    └─────────┘              └─────────┘


Optional: Python RAG Server (später)
┌─────────────────────────────────────────────────────────────┐
│         RAG SERVICE (Port 8100) - FastAPI ✨ OPTIONAL        │
│  Portiert aus Version_8                                      │
│  - Vector Embeddings (Groq/Ollama)                          │
│  - Semantic Clustering                                       │
│  - FTS5 Search                                              │
│  ↕ HTTP API                                                 │
│  Bridge ruft RAG auf bei memory_search                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 DATENFLUSS: Beispiel "Luna Chat"

### IST (Nicht funktionierend):
```
User tippt "Hallo Luna!" im Browser
  ↓
UI sendet: fetch('http://localhost:3001/api/luna/chat')
  ↓
❌ Server 3001 läuft nicht / ist veraltet
  ↓
Error: Connection refused
```

### SOLL (Nach Fix):
```
User tippt "Hallo Luna!" im Browser
  ↓
UI sendet: fetch('http://localhost:3337/api/luna/chat', {
  method: 'POST',
  body: JSON.stringify({ message: "Hallo Luna!" })
})
  ↓
Bridge empfängt Request
  ↓
AI Service (Groq) generiert Antwort
  ↓
Soul Service updated Mood (+5 joy)
  ↓
Response: {
  reply: "Hallo! Mir gehts gut! 😊",
  soul: { mood: +5, energy: 70 }
}
  ↓
UI zeigt Antwort + Soul State
```

---

## 🔄 DATENFLUSS: Beispiel "Contact hinzufügen"

### Via UI (Web):
```
User klickt "+ Add Contact"
  ↓
Form: Name, Relation, Tags
  ↓
UI sendet: POST /api/people/create
  ↓
Bridge → ContactService.createContact()
  ↓
Database INSERT into people table
  ↓
Response: { id: "abc123", name: "...", ... }
  ↓
UI aktualisiert People Gallery
```

### Via MCP (ChatGPT):
```
ChatGPT: "Add Max Mustermann as friend"
  ↓
MCP Tool: contact_add
  ↓
Bridge → ContactService.createContact()
  ↓
Database INSERT into people table
  ↓
Response to ChatGPT: { id: "abc123", name: "Max Mustermann" }
  ↓
ChatGPT: "✅ Contact added!"
```

### Via External Client (Chatty):
```
Chatty → https://multiplicative-unapprehendably-marisha.ngrok-free.dev/mcp
  ↓
Discovery: { tools: ["contact_add", ...] }
  ↓
Chatty sendet: POST /tools/execute { tool: "contact_add", args: {...} }
  ↓
Bridge → ContactService.createContact()
  ↓
Database INSERT
  ↓
Response via ngrok zurück zu Chatty
```

---

## 📦 PACKAGE STRUKTUR

```
Toobix-Unified/
├── 📦 packages/
│   ├── core/                    ✅ Database, Schema
│   │   ├── src/
│   │   │   ├── db/
│   │   │   │   ├── schema.ts    (8 tables)
│   │   │   │   └── index.ts     (Connection)
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── bridge/                  ✅ MCP Server, REST API
│   │   ├── src/
│   │   │   ├── index.ts         (Main Service)
│   │   │   ├── mcp/
│   │   │   │   ├── server.ts    (MCP Protocol)
│   │   │   │   └── tools.ts     (Tool Registry)
│   │   │   ├── memory/
│   │   │   │   └── service.ts   (Memory CRUD)
│   │   │   ├── actions/
│   │   │   │   └── service.ts   (Actions CRUD)
│   │   │   └── ai/
│   │   │       ├── groq.ts      (Groq API)
│   │   │       └── ollama.ts    (Local LLM)
│   │   └── package.json
│   │
│   ├── soul/                    ✅ Emotional Intelligence
│   │   ├── src/
│   │   │   ├── index.ts         (Main Service)
│   │   │   ├── emotion.ts       (8 emotions)
│   │   │   ├── values.ts        (10 values)
│   │   │   └── personality.ts   (Big Five)
│   │   └── package.json
│   │
│   ├── people/                  ✅ Contact Management
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── services/
│   │   │       ├── contact.service.ts
│   │   │       └── interaction.service.ts
│   │   └── package.json
│   │
│   └── rag/                     🔜 TODO: Vector Search
│       ├── src/
│       │   ├── index.ts
│       │   ├── embedder.ts
│       │   └── search.ts
│       └── package.json
│
├── 📱 apps/
│   └── web/                     ✅ Frontend UI
│       ├── index.html           (Dashboard)
│       ├── styles.css
│       └── luna-chat.css
│
├── 🗄️ data/
│   └── toobix-unified.db        ✅ SQLite Database
│
├── 📜 scripts/
│   ├── api-server.ts            ⚠️ DEPRECATED (Use Bridge!)
│   └── load-demo-data.ts        ✅ Demo Data
│
└── 📚 docs/
    ├── SYSTEM_MASTERPLAN.md     ← Diese Datei
    ├── SYSTEM_STATUS.md
    ├── PHASE_3_PEOPLE_COMPLETE.md
    └── MCP_LIVE_NOW.md
```

---

## 🎯 MIGRATIONS-PFAD

### Phase 1: Sichtbar machen (HEUTE)
```
[WEB UI] → [Bridge API] → [Database]
   ↓
Fix CORS
   ↓
Luna Chat Endpoint
   ↓
✅ Alles läuft!
```

### Phase 2: API Server abschalten (MORGEN)
```
Old: [UI] → [API Server 3001] → [DB]
             ❌ Löschen

New: [UI] → [Bridge 3337] → [DB]
             ✅ Einziger Server
```

### Phase 3: RAG integrieren (WOCHE 1)
```
[Bridge] → [RAG Service 8100] → [Groq/Ollama]
           (Python FastAPI)
              ↓
        Vector Search
        Semantic Clustering
        Embeddings
```

### Phase 4: Deployment (WOCHE 2)
```
[Railway] → [Bridge Container]
         → [Python RAG Container]
         → [Postgres Database]
         → [Public URL]
```

---

## 🔧 DEBUGGING CHECKLIST

### UI zeigt keine Daten:
- [ ] Bridge läuft auf 3337? → `curl http://localhost:3337/health`
- [ ] CORS aktiviert? → Browser Console schauen
- [ ] Fetch URLs korrekt? → apps/web/index.html prüfen
- [ ] Database hat Daten? → `bun run scripts/load-demo-data.ts`

### Luna Chat antwortet nicht:
- [ ] Endpoint existiert? → `curl -X POST http://localhost:3337/api/luna/chat`
- [ ] Groq API Key gesetzt? → `.env` file checken
- [ ] AI Service läuft? → Bridge Logs schauen

### MCP Tools funktionieren nicht:
- [ ] Tools registriert? → `curl http://localhost:3337/tools`
- [ ] Tool execution? → `curl -X POST http://localhost:3337/tools/execute`
- [ ] ngrok Tunnel live? → `curl https://multiplicative-unapprehendably-marisha.ngrok-free.dev/mcp`

---

## 📊 SYSTEM HEALTH DASHBOARD

```
┌──────────────────────────────────────────────────────────┐
│  🟢 OPERATIONAL                                           │
├──────────────────────────────────────────────────────────┤
│  ✅ Bridge MCP Server (Port 3337)                        │
│  ✅ Database (7 contacts, 6 interactions)                │
│  ✅ 10 MCP Tools registered                              │
│  ✅ ngrok Tunnel active                                  │
│  ✅ Soul System initialized                              │
│  ✅ People Module functional                             │
├──────────────────────────────────────────────────────────┤
│  🟡 NEEDS ATTENTION                                       │
├──────────────────────────────────────────────────────────┤
│  ⚠️  UI not showing data (CORS?)                         │
│  ⚠️  Luna Chat endpoint missing                          │
│  ⚠️  Old API Server (3001) still running                 │
├──────────────────────────────────────────────────────────┤
│  🔴 NOT INTEGRATED                                        │
├──────────────────────────────────────────────────────────┤
│  ❌ Version_8 RAG System                                 │
│  ❌ WebSocket for Luna                                   │
│  ❌ Tools visualization in UI                            │
│  ❌ Story Engine                                         │
└──────────────────────────────────────────────────────────┘
```

---

## 🎯 NEXT ACTIONS

```bash
# 1. CHECK UI
Open: http://localhost:3000
F12 → Console → Look for errors

# 2. TEST API
curl http://localhost:3337/api/people
# Should return 7 contacts

# 3. FIX CORS (if needed)
# Edit: packages/bridge/src/mcp/server.ts
# Add: response.headers.set('Access-Control-Allow-Origin', '*')

# 4. RESTART BRIDGE
Stop-Process -Name "bun" -Force
bun run packages/bridge/src/index.ts

# 5. VERIFY
Refresh browser → Should show data!
```

**Status:** Masterplan komplett! 🎯  
**Nächster Schritt:** UI Daten-Anzeige reparieren (30 min)

Bereit? 🚀
