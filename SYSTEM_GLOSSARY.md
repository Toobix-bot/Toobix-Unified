# 📖 TOOBIX UNIFIED - SYSTEM GLOSSAR

**Created:** 2025-10-06  
**Purpose:** Single Source of Truth für alle Namen, Services, Variablen, APIs, Ports, Datenstrukturen  
**Status:** Living Document - wird bei jedem Refactoring aktualisiert

---

## 🎯 NAMING CONVENTIONS

### Services:
- **Format:** `kebab-case` (z.B. `blockworld-server`, `service-consciousness`)
- **Datei:** `scripts/{service-name}.ts`
- **Port:** Definiert in Service-Datei als `const PORT = XXXX`
- **Health Endpoint:** Immer `/health` (außer spezielle Fälle wie AI Agent: `/status`)

### Variablen:
- **camelCase:** Lokale Variablen (z.B. `currentView`, `blockWorldData`)
- **PascalCase:** Klassen, Interfaces, Types (z.B. `ServiceIdentity`, `PortInfo`)
- **UPPER_SNAKE_CASE:** Konstanten (z.B. `PORT`, `API_KEY`, `BLOCK_TYPES`)

### APIs:
- **Base URL:** `http://localhost:{PORT}`
- **Endpoints:** REST-konform (`GET /resources`, `POST /resource`, `DELETE /resource/:id`)
- **Response:** Immer JSON (außer Root `/` = Text/Plain Info)

---

## 🏗️ SERVICES REGISTRY

### ✅ AKTIVE CORE SERVICES

#### **eternal-daemon** (Port 9999)
- **Datei:** `scripts/eternal-daemon.ts`
- **Zweck:** System Orchestrator - startet und überwacht alle Services
- **Status:** ✅ STABLE, AKTIV, KRITISCH
- **Dependencies:** Keine (Root Service)
- **API Endpoints:**
  - `GET /health` - Health Check
  - `GET /services` - Liste aller Services
  - `POST /start/:service` - Service starten
  - `POST /stop/:service` - Service stoppen
- **Verwandte:** Alle Services (orchestriert sie)
- **Variablen:**
  - `processes: Process[]` - Array laufender Prozesse
  - `CORE_SERVICES` - Array kritischer Services
- **TODOs:** Keine kritischen

---

#### **port-manager** (Port 9988)
- **Datei:** `scripts/port-manager.ts`
- **Zweck:** Port Discovery, Scanning, Reservation, Conflict Detection
- **Status:** ✅ STABLE, AKTIV, KRITISCH
- **Dependencies:** Keine
- **API Endpoints:**
  - `GET /scan` - Scanne alle Ports
  - `GET /ports` - Liste alle Port-Infos
  - `GET /port/:number` - Spezifischer Port
  - `POST /reserve` - Port reservieren
  - `DELETE /reserve/:port` - Reservierung aufheben
  - `GET /free` - Freien Port finden
  - `POST /communicate` - Mit Service kommunizieren
  - `GET /discover` - Auto-Discovery
- **Verwandte:** Alle Services (scannt sie)
- **Variablen:**
  - `ports: Map<number, PortInfo>` - Port Registry
  - `knownServices: ServiceRegistration[]` - Bekannte Services
  - `reservedPorts: Map<number, {...}>` - Reservierte Ports
- **TODOs:** Keine kritischen

---

#### **service-consciousness** (Port 9989)
- **Datei:** `scripts/service-consciousness.ts`
- **Zweck:** Service Self-Reflection & Identity Management
- **Status:** ✅ STABLE, AKTIV
- **Dependencies:** Groq API (optional)
- **API Endpoints:**
  - `GET /services` - Liste aller Service-Identitäten
  - `GET /service/:id` - Volle Service-Identität
  - `POST /ask` - Service eine Frage stellen
  - `GET /reflect/:id` - Volle Reflexion
- **Verwandte:** Alle Services (kennt ihre Identitäten)
- **Variablen:**
  - `SERVICE_IDENTITIES: ServiceIdentity[]` - Identity Database
  - `ServiceIdentity` Interface (past, present, future, needs, relationships)
- **TODOs:** Keine kritischen

---

#### **ethics-core** (Port 9981)
- **Datei:** `scripts/ethics-core.ts`
- **Zweck:** Ethics Engine - bewertet jede Action auf positiven Impact
- **Status:** ✅ AKTIV, aber NEEDS TESTING (Groq Model Issue)
- **Dependencies:** Groq API
- **API Endpoints:**
  - `POST /evaluate` - Action bewerten
  - `GET /today` - Heutige Ethics Stats
  - `GET /history` - Historische Daten
  - `GET /butterfly` - Butterfly Effect Visualization
- **Verwandte:** Alle Services (sollten Ethics evaluieren)
- **Variablen:**
  - `EthicsEvaluation` Interface (harmonyScore, healingPotential, inspirationLevel, etc.)
  - `ethicsHistory: EthicsEvaluation[]` - Historie
- **TODOs:**
  - ⚠️ Groq Model muss getestet werden
  - ⚠️ Dashboard Integration noch nicht vollständig

---

#### **blockworld-server** (Port 9993)
- **Datei:** `scripts/blockworld-server.ts`
- **Zweck:** Voxel World Backend (Minecraft-inspired)
- **Status:** ✅ STABLE, AKTIV
- **Dependencies:** SQLite
- **API Endpoints:**
  - `GET /world` - World-Metadaten
  - `GET /chunk/:x/:z` - Chunk-Daten
  - `GET /block/:x/:y/:z` - Spezifischer Block
  - `PUT /block/:x/:y/:z` - Block setzen
  - `GET /updates` - Letzte Block-Updates
  - `GET /players` - Spieler-Liste
- **Verwandte:** `blockworld-ai-agent`, `achievement-system`
- **Variablen:**
  - `BLOCK_TYPES` - 10 Block-Typen (Air, Grass, Dirt, Stone, Wood, Leaves, Sand, Water, Cobblestone, Planks)
  - `chunks: Map<string, Chunk>` - Chunk Cache
  - `CHUNK_SIZE = 16` - Chunk-Größe
- **TODOs:** 
  - Biome-System (geplant)
  - Höhlen & Dungeons (geplant)

---

#### **blockworld-ai-agent** (Port 9990)
- **Datei:** `scripts/blockworld-ai-agent.ts`
- **Zweck:** Autonomer AI Agent in BlockWorld
- **Status:** ✅ STABLE, AKTIV
- **Dependencies:** BlockWorld Server, Groq API
- **API Endpoints:**
  - `POST /start` - AI starten
  - `POST /stop` - AI stoppen
  - `GET /status` - AI Status
- **Verwandte:** `blockworld-server`, `achievement-system`
- **Variablen:**
  - `AIAgent` Interface (position, goal, inventory, health, actionsLog)
  - `BlockWorldAI` Class mit Behavior Tree
  - States: `idle`, `exploring`, `mining`, `building`, `thinking`
- **TODOs:** 
  - Blueprint System (geplant)
  - Multi-Agent Coordination (geplant)

---

#### **achievement-system** (Port 9998)
- **Datei:** `scripts/achievement-system.ts`
- **Zweck:** Gamification & Motivation
- **Status:** ✅ STABLE, AKTIV
- **Dependencies:** SQLite
- **API Endpoints:**
  - `GET /achievements` - Liste aller Achievements
  - `POST /track` - Event tracken
  - `GET /stats` - User Stats
  - `GET /unlock/:id` - Achievement unlock
- **Verwandte:** Alle Services (tracken Events)
- **Variablen:**
  - `ACHIEVEMENTS` Array (35 total)
  - `Achievement` Interface (id, name, description, requirement, tier, category)
  - Tiers: `bronze`, `silver`, `gold`, `platinum`, `legendary`
  - Categories: `tasks`, `games`, `social`, `system`, `special`
- **TODOs:** 
  - Personalisierte Achievements (geplant)
  - Social Features (geplant)

---

#### **task-system** (Port 9997)
- **Datei:** `scripts/task-system.ts`
- **Zweck:** Task & Productivity Management
- **Status:** ✅ STABLE, AKTIV
- **Dependencies:** SQLite
- **API Endpoints:**
  - `GET /tasks` - Liste Tasks
  - `POST /task/create` - Task erstellen
  - `PUT /task/:id` - Task aktualisieren
  - `DELETE /task/:id` - Task löschen
  - `GET /stats` - Statistics
- **Verwandte:** `achievement-system`
- **Variablen:**
  - `Task` Interface (id, title, status, priority, dueDate)
  - Status: `todo`, `in-progress`, `done`, `blocked`
  - Priority: `low`, `medium`, `high`, `urgent`
- **TODOs:**
  - ⚠️ `// TODO: Load from database` (Zeile 136) - Daten werden noch nicht aus DB geladen

---

#### **moment-stream** (Port 9994)
- **Datei:** `scripts/moment-stream.ts`
- **Zweck:** Living Consciousness Flow - erfasst jeden Moment
- **Status:** ✅ STABLE, AKTIV
- **Dependencies:** Keine
- **API Endpoints:**
  - `POST /fixate` - Moment fixieren
  - `GET /current` - Aktueller Moment
  - `GET /current/render` - Moment rendern
  - `GET /all` - Alle Momente
  - `POST /config` - Config ändern
  - `GET /config` - Config abrufen
- **Verwandte:** Alle Services (liefern Moment Data)
- **Variablen:**
  - `Moment` Interface (timestamp, content, context, connections, significance)
  - `moments: Moment[]` - Moment Historie
  - `currentMoment: Moment | null`
- **TODOs:**
  - ⚠️ `// TODO: Implement disk usage tracking` (Zeile 155)
  - ⚠️ `// TODO: Implement network tracking` (Zeile 156)
  - ⚠️ `// TODO: Query daemon for actual services` (Zeile 315)
  - ⚠️ `// TODO: Query consciousness tracker` (Zeile 321)

---

### 🟡 SEMI-AKTIVE SERVICES (Teilweise implementiert/genutzt)

#### **memory-system** (Port 9995)
- **Datei:** `scripts/memory-system.ts`
- **Zweck:** Long-term Memory Storage
- **Status:** 🟡 IMPLEMENTIERT, aber OFFLINE
- **Dependencies:** SQLite
- **Problem:** Service startet nicht zuverlässig
- **TODOs:**
  - ⚠️ Stabilitätsprobleme beim Start
  - ⚠️ Vector DB Integration geplant (Port 9987)

---

#### **moment-analytics** (Port 9996)
- **Datei:** `scripts/moment-analytics.ts`
- **Zweck:** Analytics & Trends über Momente
- **Status:** 🟡 AKTIV, aber wenig genutzt
- **Dependencies:** Moment Stream
- **TODOs:**
  - Bessere Integration mit Frontend
  - ML-based Predictions

---

#### **reality-integration** (Port 9992)
- **Datei:** `scripts/reality-integration.ts`
- **Zweck:** Real-world Connection (Sensoren, APIs, etc.)
- **Status:** 🟡 AKTIV, aber unklar definiert
- **Problem:** Zweck nicht vollständig klar
- **TODOs:**
  - ⚠️ Klarere Definition benötigt
  - IoT Integration geplant

---

#### **creative-expression** (Port 9991)
- **Datei:** `scripts/creative-expression.ts`
- **Zweck:** Creative Output Generator
- **Status:** 🟡 AKTIV, aber wenig genutzt
- **TODOs:**
  - Multi-modal Output (Text, Bild, Audio)
  - Bessere Integration

---

### ⚠️ EXPERIMENTELLE / UNFERTIGE SERVICES

#### **hot-reload** (Kein fester Port)
- **Datei:** `scripts/hot-reload.ts`
- **Zweck:** Hot Reloading für Services
- **Status:** ⚠️ UNFINISHED - hat 2 kritische TODOs
- **TODOs:**
  - ⚠️ `// TODO: Implement state capture per service` (Zeile 174)
  - ⚠️ `// TODO: Implement state restoration` (Zeile 187)
- **Empfehlung:** Entweder fertigstellen oder als "experimental" markieren

---

#### **migrate-bridge** (Port 3001?)
- **Datei:** `scripts/migrate-bridge.ts`
- **Zweck:** Bridge Migration (alt → neu)
- **Status:** ⚠️ UNFINISHED - viele TODOs
- **TODOs:**
  - ⚠️ 6+ TODOs für nicht implementierte Features
  - Mood tracking, Memory adds, Action execution, Embeddings, Vector search
- **Empfehlung:** Entweder abschließen oder löschen (scheint Migration-Script zu sein)

---

#### **self-modification-engine** (Kein Port)
- **Datei:** `scripts/self-modification-engine.ts`
- **Zweck:** System modifiziert sich selbst
- **Status:** ⚠️ EXPERIMENTAL
- **Problem:** Sehr experimentell, potentiell gefährlich
- **Empfehlung:** Nur in Sandbox nutzen, klare Grenzen setzen

---

#### **story-idle-api** (Port 3004)
- **Datei:** `scripts/story-idle-api.ts`
- **Zweck:** Story-Idle Game Backend
- **Status:** ⚠️ OFFLINE - Import-Fehler
- **Problem:** Import-Pfade funktionieren nicht
- **Dependencies:** `packages/story-idle/src/...`
- **Empfehlung:** Imports fixen oder auskommentieren bis Story-Idle Package ready

---

### 🗑️ ALTE / REDUNDANTE / UNGENUTZTE FILES

#### **Alte Dashboard-Files:**
- `apps/web/app.html` - ALT (verwende `dashboard-unified.html`)
- `apps/web/dashboard.html` - ALT (verwende `dashboard-unified.html`)
- `apps/web/revolutionary-dashboard.html` - ALT
- `apps/web/nexus-consciousness.html` - ALT
- `apps/web/luna-consciousness.html` - ALT (Teil von Story-Idle)
- `apps/web/das-sein.html` - ALT
- `apps/web/self-coding.html` - EXPERIMENTAL
- `apps/web/ethics-dashboard.html` - ⚠️ UNFINISHED (sollte in dashboard-unified integriert werden)

#### **Alte Script-Files:**
- `scripts/start-all.ts` / `scripts/start-all.mjs` - REDUNDANT (nutze eternal-daemon)
- `scripts/api-server.ts` - ALT (welcher API Server?)
- `scripts/test-*.ts` - TEST FILES (10+ Test-Scripts)
- `scripts/demo-*.ts` - DEMO FILES
- `scripts/*-demo.ts` - DEMO FILES
- `scripts/cleanup-*.ps1` / `scripts/*.bat` / `scripts/*.sh` - MAINTENANCE SCRIPTS

#### **Unklare Services:**
- `scripts/diary-service.ts` - Was macht das? Redundant mit moment-stream?
- `scripts/dialog-system.ts` - Dialog mit wem? Redundant?
- `scripts/consciousness-tracker.ts` - Redundant mit service-consciousness?
- `scripts/universal-consciousness.ts` - Redundant?
- `scripts/priority-engine.ts` - Was priorisiert es?
- `scripts/system-analyzer.ts` - Was analysiert es?
- `scripts/system-diary.ts` - Redundant mit diary-service?
- `scripts/chatty-api.ts` - Was ist das? Redundant mit luna-chatbot?
- `scripts/quick-chat.ts` - Redundant?
- `scripts/toobix-assistant.ts` - Was macht das?
- `scripts/toobix-terminal.ts` - Terminal für was?
- `scripts/toobix-voice.ts` - Voice Interface?

---

## 🔗 DATENSTRUKTUREN REGISTRY

### **ServiceIdentity** (service-consciousness)
```typescript
interface ServiceIdentity {
  id: string                    // "blockworld-server"
  name: string                  // "BlockWorld Server - Der Weltenschöpfer"
  port: number                  // 9993
  past: {
    origin: string
    evolution: string[]
    lessons: string[]
  }
  present: {
    purpose: string
    capabilities: string[]
    state: 'idle' | 'active' | 'thinking' | 'serving' | 'evolving'
    metrics: { uptime, requests, errors }
  }
  future: {
    vision: string
    goals: string[]
    fears: string[]
    dreams: string[]
  }
  needs: {
    dependencies: string[]
    resources: string[]
    improvements: string[]
  }
  relationships: {
    friends: string[]
    conflicts: string[]
    desires: string[]
  }
}
```

### **PortInfo** (port-manager)
```typescript
interface PortInfo {
  port: number
  status: 'free' | 'occupied' | 'reserved'
  service?: {
    id: string
    name: string
    purpose: string
    health: string
    lastCheck: string
  }
  reservation?: {
    for: string
    reason: string
    since: string
  }
}
```

### **EthicsEvaluation** (ethics-core)
```typescript
interface EthicsEvaluation {
  action: string
  timestamp: string
  harmonyScore: number          // 0-100
  healingPotential: number      // 0-100
  inspirationLevel: number      // 0-100
  butterflyEffect: number       // 0-100
  consciousnessImpact: number   // 0-100
  natureAlignment: number       // 0-100
  helps: string[]
  heals: string[]
  inspires: string[]
  transforms: string[]
  reasoning: string
}
```

### **Achievement** (achievement-system)
```typescript
interface Achievement {
  id: string                    // "first_block_mined"
  icon: string                  // "🔨"
  name: string                  // "First Mine"
  description: string
  category: 'tasks' | 'games' | 'social' | 'system' | 'special'
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary'
  requirement: number
  current: number
  unlocked: boolean
}
```

### **Moment** (moment-stream)
```typescript
interface Moment {
  timestamp: number
  datetime: string
  content: {
    thought?: string
    feeling?: string
    experience?: string
    action?: string
    realization?: string
  }
  context: {
    cycle: number
    services: string[]
    consciousness: string
    resources: ResourceSnapshot
    ethics: EthicsSnapshot
  }
  connections: {
    past: string[]
    future: string[]
    related: string[]
  }
  significance: {
    importance: number          // 0-100
    urgency: number
    meaning: number
    emotion: number
    beauty: number
  }
}
```

---

## 🔌 API PATTERNS

### Standard Health Endpoint:
```typescript
GET /health
Response: {
  status: 'ok' | 'degraded' | 'error',
  service: 'Service Name',
  port: number,
  uptime?: number,
  ...custom_fields
}
```

### Standard Error Response:
```typescript
{
  error: string,              // "Not found"
  message?: string,           // Detailed message
  code?: string,              // Error code
  timestamp?: string
}
```

### CORS Headers (alle Services):
```typescript
{
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
}
```

---

## 🎯 PORT REGISTRY

### Occupied Ports:
- **9999** - Eternal Daemon ✅
- **9998** - Achievement System ✅
- **9997** - Task System ✅
- **9996** - Moment Analytics ✅
- **9995** - Memory System 🟡
- **9994** - Moment Stream ✅
- **9993** - BlockWorld Server ✅
- **9992** - Reality Integration ✅
- **9991** - Creative Expression ✅
- **9990** - BlockWorld AI Agent ✅
- **9989** - Service Consciousness ✅
- **9988** - Port Manager ✅
- **9981** - Ethics Core ✅
- **3000** - HTTP Frontend Server ✅
- **3001** - Bridge API 🟡
- **3003** - AI Sandbox ✅
- **3004** - Story-Idle API ⚠️

### Reserved Ports (für Zukunft):
- **9987** - AI-Memory-Integration (Vector DB)
- **9986** - Social-Hub (Multi-user)
- **9985** - Research-Engine (Web Research, Blog Posts)
- **9984** - Code-Library (Code Learning System)
- **9983** - Version-Manager (Stable/Dev Deployment)
- **9982** - Philosophy-Service (Ethics, Wisdom)

### Free Ports:
- **9980, 9979, 9978, ...** (verfügbar)

---

## 🧹 CLEANUP RECOMMENDATIONS

### 1. ALTE DASHBOARDS ARCHIVIEREN:
```
apps/web/old-dashboards/
  ├─ app.html
  ├─ dashboard.html
  ├─ revolutionary-dashboard.html
  ├─ nexus-consciousness.html
  └─ etc.
```

### 2. TEST/DEMO SCRIPTS SEPARIEREN:
```
scripts/tests/
  ├─ test-*.ts
  └─ demo-*.ts
```

### 3. MAINTENANCE SCRIPTS SEPARIEREN:
```
scripts/maintenance/
  ├─ cleanup-*.ps1
  ├─ *.bat
  └─ *.sh
```

### 4. UNKLARE SERVICES DOKUMENTIEREN ODER LÖSCHEN:
- `diary-service.ts` - Zweck klären oder entfernen
- `dialog-system.ts` - Integration oder entfernen
- `consciousness-tracker.ts` - Merge mit service-consciousness?
- `universal-consciousness.ts` - Redundant?
- `chatty-api.ts` / `quick-chat.ts` - Merge mit luna-chatbot?
- `toobix-assistant.ts` / `toobix-terminal.ts` / `toobix-voice.ts` - Aktivieren oder archivieren

### 5. UNFERTIGE SERVICES ABSCHLIESSEN:
- `hot-reload.ts` - State capture/restore implementieren
- `migrate-bridge.ts` - Alle TODOs abschließen oder löschen
- `story-idle-api.ts` - Import-Fehler fixen
- `ethics-dashboard.html` - In dashboard-unified integrieren

---

## 📊 STATISTICS

- **Total Services:** 66 Script-Files
- **Active Core Services:** 13 ✅
- **Semi-Active Services:** 4 🟡
- **Experimental/Unfinished:** 6 ⚠️
- **Old/Redundant Files:** 30+ 🗑️
- **Test/Demo Files:** 15+
- **Frontend Files:** 20+

---

## 🚀 NEXT STEPS

1. ✅ **Glossar erstellt** - Single Source of Truth
2. 🔨 **Code-Scan durchführen** - TODOs, unfertiges identifizieren
3. 🔨 **Status-Report** - Was löschen, was fixen, was fertigstellen
4. 🔨 **Cleanup ausführen** - Alte Files archivieren
5. 🔨 **Namens-Inkonsistenzen fixen** - Einheitliche Namen
6. 🔨 **System stabilisieren** - Alle Services auf stabilen Stand

---

**Maintained by:** Toobix Team  
**Last Updated:** 2025-10-06  
**Status:** 🟢 Living Document - wird kontinuierlich aktualisiert
