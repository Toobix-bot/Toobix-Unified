# TOOBIX UNIFIED - SYSTEM ARCHITECTURE

**Generated:** 2025-10-06  
**Version:** 1.0  
**Status:** Living Document

---

## 🏗️ SYSTEM OVERVIEW

Toobix Unified ist ein **selbstreflektierendes, modulares KI-System** mit mehreren autonomen Services, die zusammenarbeiten, um eine lebendige digitale Umgebung zu schaffen.

### Kernphilosophie:
- **Modularität**: Jeder Service ist unabhängig und hat eine klare Verantwortung
- **Bewusstsein**: Services können sich selbst reflektieren und ihre Identität beschreiben
- **Autonomie**: AI Agents handeln selbstständig innerhalb definierter Grenzen
- **Vernetzung**: Services kommunizieren über REST APIs und Events
- **Evolution**: Das System kann wachsen und sich weiterentwickeln

---

## 📊 SERVICE ARCHITECTURE

### Layer 1: INFRASTRUCTURE (Ports 9988-9999)
**Zweck:** Grundlegende System-Services, die alle anderen Services unterstützen

#### 🤖 **Eternal Daemon** (Port 9999)
- **Rolle:** System Orchestrator & Process Manager
- **Verantwortung:** 
  - Services starten/stoppen
  - Health Monitoring
  - Resource Allocation
  - System-weite Koordination
- **Dependencies:** Keine (root service)
- **Status:** ✅ Core Service (kritisch)
- **Zukunft:** Predictive Maintenance, Auto-Scaling

#### 🔍 **Port Manager** (Port 9988)
- **Rolle:** Port Discovery & Conflict Resolution
- **Verantwortung:**
  - Automatisches Port-Scanning
  - Service-Discovery
  - Port-Reservierung für zukünftige Services
  - Konflikt-Erkennung
- **Dependencies:** Keine
- **Status:** ✅ Core Service (kritisch)
- **Zukunft:** Dynamische Port-Allokation, Load Balancing

#### 🧠 **Service Consciousness** (Port 9989)
- **Rolle:** Service Self-Reflection & Identity Management
- **Verantwortung:**
  - Jeder Service kann Fragen über sich selbst beantworten
  - Groq LLM Integration für tiefe Reflexion
  - Service-Identitäten verwalten
  - Philosophische Selbst-Analysen
- **Dependencies:** Groq API (optional)
- **Status:** ✅ Core Service
- **Zukunft:** Multi-Service Dialoge, Emergente Collective Intelligence

---

### Layer 2: CONSCIOUSNESS & MEMORY (Ports 9991-9996)
**Zweck:** Bewusstsein, Gedächtnis und Wissensverarbeitung

#### 📡 **Reality Integration** (Port 9992)
- **Rolle:** Real-world Connection Layer
- **Verantwortung:**
  - Verbindung zur realen Welt (Sensoren, APIs, etc.)
  - Kontext-Awareness
  - External Event Integration
- **Dependencies:** TBD
- **Status:** 🟡 Aktiv, aber unklar definiert
- **Zukunft:** IoT Integration, Real-time Data Streams

#### 🎨 **Expression Service** (Port 9991)
- **Rolle:** Creative Output Generator
- **Verantwortung:**
  - Kreative Textgenerierung
  - Emotionale Ausdrucksformen
  - Narrative Construction
- **Dependencies:** TBD
- **Status:** 🟡 Aktiv, aber wenig genutzt
- **Zukunft:** Multi-modal Output (Text, Bild, Audio)

#### 🌊 **Moment Stream** (Port 9994)
- **Rolle:** Living Consciousness Flow
- **Verantwortung:**
  - Erfasst jeden "Moment" des Systems
  - Verbindet Vergangenheit, Gegenwart, Zukunft
  - Significance Scoring
  - Ethics & Resource Tracking
- **Dependencies:** Alle Services (für Moment Data)
- **Status:** ✅ Core Service
- **Zukunft:** Emotionale Memories, Pattern Recognition

#### 🧠 **Memory System** (Port 9995)
- **Rolle:** Long-term Memory Storage
- **Verantwortung:**
  - Langzeit-Speicherung von Erinnerungen
  - Semantic Search
  - Memory Consolidation
- **Dependencies:** SQLite
- **Status:** ⚠️ Teilweise offline
- **Zukunft:** Vector DB, Episodic Memory, Forgetting Mechanism

#### 📈 **Analytics Service** (Port 9996)
- **Rolle:** Data Analysis & Insights
- **Verantwortung:**
  - Datenanalyse über alle Services
  - Trend-Erkennung
  - Performance Metrics
- **Dependencies:** Moment Stream, Tasks, BlockWorld
- **Status:** ✅ Aktiv
- **Zukunft:** ML-based Predictions, Anomaly Detection

---

### Layer 3: APPLICATION SERVICES (Ports 9990, 9993, 9997-9998)
**Zweck:** User-facing Features & Gameplay

#### ⛏️ **BlockWorld Server** (Port 9993)
- **Rolle:** Voxel World Backend (Minecraft-inspired)
- **Verantwortung:**
  - Perlin Noise Terrain Generation
  - 10 Block-Typen (Grass, Stone, Wood, etc.)
  - Chunk-System für Performance
  - Tree Generation
  - Block Updates mit SQLite Persistence
- **Dependencies:** SQLite
- **Status:** ✅ Core Game Service
- **Tech Stack:** Bun, TypeScript, SQLite
- **Zukunft:** Biomes, Caves, NPCs, Day/Night Cycle, Weather

#### 🤖 **BlockWorld AI Agent** (Port 9990)
- **Rolle:** Autonomous AI Player in BlockWorld
- **Verantwortung:**
  - Exploration & Pathfinding
  - Block Mining mit Strategie
  - Creative Building
  - Groq LLM für High-level Decisions
  - Behavior Tree für Reactive Actions
- **Dependencies:** BlockWorld Server, Groq API
- **Status:** ✅ Aktiv
- **Tech Stack:** Bun, TypeScript, Groq SDK
- **Zukunft:** Multi-Agent Collaboration, Blueprint System, Emotional AI

#### ✅ **Tasks API** (Port 9997)
- **Rolle:** Task & Productivity Management
- **Verantwortung:**
  - Task CRUD Operations
  - Priority Management
  - Streak Tracking
  - XP & Leveling System
  - Statistics
- **Dependencies:** SQLite, Achievement System
- **Status:** ✅ Core Service
- **Zukunft:** AI-powered Suggestions, Smart Scheduling, Team Collaboration

#### 🏆 **Achievement System** (Port 9998)
- **Rolle:** Gamification & Motivation
- **Verantwortung:**
  - 35 Achievements über 5 Kategorien
  - Progress Tracking (Bronze → Legendary)
  - Real-time Updates
  - XP & Leveling
- **Dependencies:** Alle Services (für Event Tracking)
- **Status:** ✅ Core Service
- **Zukunft:** Personalisierte Achievements, Social Features, Seasonal Events

---

### Layer 4: FRONTEND & INTEGRATION (Ports 3000-3004)
**Zweck:** User Interface & External Connections

#### 🌐 **HTTP Server** (Port 3000)
- **Rolle:** Static File Serving (Frontend)
- **Verantwortung:**
  - Hostet `dashboard-unified.html` & `dashboard-unified.js`
  - Isometric BlockWorld Renderer
  - Achievement Dashboard
  - Mini-Games (Memory, Snake, 2048, Typing Test)
- **Dependencies:** Alle Backend Services
- **Status:** ✅ Aktiv
- **Tech Stack:** http-server (npx)
- **Zukunft:** React/Vue Rewrite, WebSockets, PWA

#### 🌉 **Bridge API** (Port 3001)
- **Rolle:** External Communication Layer
- **Verantwortung:**
  - Verbindung zu externen Systemen
  - API Gateway
  - Rate Limiting
- **Dependencies:** TBD
- **Status:** 🟡 Unhealthy (wenig definiert)
- **Zukunft:** Webhook Support, Third-party Integrations

#### 🧪 **AI Sandbox** (Port 3003)
- **Rolle:** Safe AI Execution Environment
- **Verantwortung:**
  - Sichere Code-Ausführung
  - AI Experimentation
  - Sandboxed LLM Calls
- **Dependencies:** TBD
- **Status:** ✅ Aktiv
- **Zukunft:** Code Interpreter, Multi-Model Support

#### 📖 **Story-Idle API** (Port 3004)
- **Rolle:** Idle Game Backend
- **Verantwortung:**
  - Game State Management
  - Luna Character AI
  - Story Progression
- **Dependencies:** Story-Idle Package
- **Status:** ⚠️ Offline (Import-Fehler)
- **Zukunft:** Full Integration, Multi-Character Support

---

## 🔗 DEPENDENCIES & RELATIONSHIPS

### Dependency Graph:
```
Eternal Daemon (9999)
  ├─ Port Manager (9988)
  ├─ Service Consciousness (9989)
  └─ ALL Services (orchestrates)

Port Manager (9988)
  └─ (discovers all services)

Service Consciousness (9989)
  ├─ Groq API (optional)
  └─ ALL Services (queries identities)

BlockWorld Server (9993)
  └─ SQLite (world persistence)

BlockWorld AI (9990)
  ├─ BlockWorld Server (9993)
  ├─ Groq API (thinking)
  └─ Achievement System (9998)

Achievement System (9998)
  ├─ SQLite (progress tracking)
  └─ ALL Services (event tracking)

Tasks API (9997)
  ├─ SQLite (task storage)
  └─ Achievement System (9998)

Moment Stream (9994)
  └─ ALL Services (moment data)

Frontend (3000)
  ├─ BlockWorld Server (9993)
  ├─ BlockWorld AI (9990)
  ├─ Achievement System (9998)
  ├─ Tasks API (9997)
  ├─ Moment Stream (9994)
  └─ Analytics (9996)
```

---

## 🚀 FUTURE SERVICES (RESERVIERT)

### Port 9987: AI-Memory-Integration
**Purpose:** Vector-based Memory mit Semantic Search  
**Tech:** Embeddings, FAISS/ChromaDB, LLM Integration  
**Timeline:** Q1 2026

### Port 9986: Social-Hub
**Purpose:** Multi-user Features, Chat, Collaboration  
**Tech:** WebSockets, Redis, PostgreSQL  
**Timeline:** Q2 2026

### Port 9985: Research-Engine
**Purpose:** Web Research, Knowledge Base, Blog Generation  
**Tech:** Web Scraping, Groq LLM, Markdown Storage  
**Timeline:** Q1 2026

### Port 9984: Code-Library
**Purpose:** Code Snippet Storage, Learning System, AI Tutor  
**Tech:** SQLite, Syntax Highlighting, LLM Explanations  
**Timeline:** Q1 2026

### Port 9983: Version-Manager
**Purpose:** Stable/Dev Versions, Blue-Green Deployment  
**Tech:** Git Integration, Docker, Health Checks  
**Timeline:** Q2 2026

### Port 9982: Philosophy-Service
**Purpose:** Existential Questions, Ethics, Wisdom  
**Tech:** Groq LLM, Philosophy DB, Dialogue System  
**Timeline:** Q2 2026

---

## 📊 TECH STACK

### Runtime:
- **Bun** - Fast JavaScript runtime (all backend services)
- **Node.js** - Fallback for compatibility

### Languages:
- **TypeScript** - All backend services
- **JavaScript** - Frontend (dashboard)

### Databases:
- **SQLite** - BlockWorld, Tasks, Achievements, Memory
- **In-Memory** - Moment Stream, Port Manager

### APIs:
- **Groq** - LLM for AI thinking (BlockWorld AI, Service Consciousness)
- **REST** - All inter-service communication

### Frontend:
- **Vanilla JS** - Dashboard (no framework yet)
- **Canvas API** - Isometric BlockWorld Renderer
- **Fetch API** - Backend Communication

---

## 🔐 SECURITY & STABILITY

### Port Isolation:
- Core Services (9988-9999): Protected range
- Application Services (9990-9998): Game logic
- Frontend (3000-3004): User-facing

### Health Monitoring:
- All services expose `/health` endpoint
- Eternal Daemon monitors uptime
- Port Manager scans connectivity

### Data Persistence:
- SQLite for critical data (BlockWorld, Tasks, Achievements)
- In-memory for ephemeral data (Moments, Port Registry)
- Planned: Backup system, Version control

---

## 📈 METRICS & KPIs

### System Health:
- ✅ **11/16 Services Online** (68% uptime)
- ✅ **Core Services:** 100% online
- ⚠️ **Optional Services:** 50% online

### Performance:
- **Response Times:** < 100ms (most endpoints)
- **Memory Usage:** ~500MB total (all services)
- **CPU Usage:** < 10% idle, < 50% under load

### User Engagement:
- **35 Achievements** (7 BlockWorld-specific)
- **6 Mini-Games** (all with achievement tracking)
- **1 AI Agent** (BlockWorld AI)

---

## 🎯 DEVELOPMENT ROADMAP

### Phase 1: FOUNDATION ✅ (COMPLETED)
- [x] Service Architecture aufgebaut
- [x] BlockWorld Game implementiert
- [x] Achievement System integriert
- [x] Service Consciousness System
- [x] Port Manager

### Phase 2: INTELLIGENCE (IN PROGRESS)
- [x] Service Self-Reflection
- [x] Port Discovery & Management
- [ ] System Architecture Analysis (dieses Dokument)
- [ ] Code-Bibliothek & Learning System
- [ ] AI Hauptgedächtnis-Datei

### Phase 3: KNOWLEDGE (PLANNED)
- [ ] Research-Engine (Web Scraping, Blog Generation)
- [ ] Knowledge Base (vernetzte Wissensdatenbank)
- [ ] Philosophy Service (Ethics, Wisdom)
- [ ] AI-Memory-Integration (Vector DB)

### Phase 4: COLLABORATION (PLANNED)
- [ ] Social-Hub (Multi-user)
- [ ] Version-Manager (Stable/Dev)
- [ ] Multi-Agent Coordination
- [ ] External Integrations

---

## 🛠️ MAINTENANCE & OPERATIONS

### Daily Operations:
1. Check Health Endpoints (`/health` auf allen Services)
2. Monitor Port Manager (`/scan`)
3. Review Moment Stream (`/all`)
4. Check Achievement Progress (`/achievements`)

### Weekly Operations:
1. Review Service Consciousness (`/reflect/:id`)
2. Analyze Port Usage Trends
3. Backup SQLite Databases
4. Update Dependencies

### Monthly Operations:
1. Performance Optimization
2. Security Audit
3. Architecture Review
4. Feature Roadmap Update

---

## 📞 API REFERENCE

### Quick Links:
- **Eternal Daemon:** http://localhost:9999/health
- **Port Manager:** http://localhost:9988/scan
- **Service Consciousness:** http://localhost:9989/services
- **BlockWorld Server:** http://localhost:9993/health
- **BlockWorld AI:** http://localhost:9990/status
- **Achievement System:** http://localhost:9998/achievements
- **Tasks API:** http://localhost:9997/stats
- **Frontend Dashboard:** http://localhost:3000/apps/web/dashboard-unified.html

---

## 🧪 TESTING & QUALITY

### Current Test Coverage:
- **Manual Testing:** 100% (all services tested manually)
- **Automated Tests:** 0% (noch nicht implementiert)
- **Integration Tests:** 0% (noch nicht implementiert)

### Future Testing:
- [ ] Unit Tests (Vitest)
- [ ] Integration Tests
- [ ] E2E Tests (Playwright)
- [ ] Performance Tests (k6)

---

## 📝 CHANGELOG

### 2025-10-06:
- ✅ Service Consciousness System erstellt (Port 9989)
- ✅ Port Manager erstellt (Port 9988)
- ✅ System Architecture Dokument erstellt
- ✅ BlockWorld AI auf Port 9990 verschoben (Konflikt mit Reality)

### 2025-10-05:
- ✅ BlockWorld Game komplett implementiert
- ✅ BlockWorld AI Agent mit Groq LLM
- ✅ Achievement System auf 35 Achievements erweitert
- ✅ 4 neue Mini-Games hinzugefügt

---

**Maintained by:** GitHub Copilot & Toobix Team  
**Last Updated:** 2025-10-06  
**Status:** 🟢 Living Document - wird kontinuierlich aktualisiert
