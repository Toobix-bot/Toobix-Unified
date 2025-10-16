# 🚀 TOOBIX COMMAND CENTER - MVP Implementation Plan

**Version:** 1.0
**Target:** 2-3 Tage für nutzbare Version
**Philosophie:** Start Simple, Grow Organically

---

## 🎯 MVP Goal

**Ein funktionierendes Command Center Dashboard, das als Zentrum für alle zukünftigen Features dient.**

**Must-Have für MVP:**
1. ✅ Desktop App läuft (Electron)
2. ✅ Dashboard UI zeigt Übersicht
3. ✅ Session Memory (speichern & laden)
4. ✅ Quick Actions (3-5 wichtigste)
5. ✅ Seed Vault (Ideen capture)
6. ✅ Project Dashboard (Toobix, LoL, etc.)

**Nice-to-Have (später):**
- Visual Garden View
- Life OS Modules
- AI Suggestions
- Voice Input

---

## 📦 MVP Feature Details

### 1. 🧠 Session Memory (Minimal)

**Was es tut:**
- Speichert jede Session mit Timestamp
- Export als Markdown für neue Claude Sessions
- "Resume Session" lädt letzten Context

**Datenbank:**
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  start_time INTEGER NOT NULL,
  end_time INTEGER,
  summary TEXT,
  topics TEXT, -- JSON array
  context_export TEXT, -- Markdown
  created_at INTEGER NOT NULL
);
```

**UI:**
```
┌─────────────────────────────────┐
│  📝 CURRENT SESSION             │
│  Started: 2h 30m ago            │
│  Topics: Command Center Design  │
│                                 │
│  [💾 Save Session]              │
│  [📋 Export Context]            │
└─────────────────────────────────┘
```

**Features:**
- Auto-save alle 5 Minuten
- Manual Save Button
- Export → `sessions/session-{date}-{id}.md`

---

### 2. 🌱 Seed Vault (Minimal)

**Was es tut:**
- Schnelles Capture von Ideen
- Liste aller Seeds
- Edit/Delete Seeds

**Datenbank:**
```sql
CREATE TABLE seeds (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  stage TEXT NOT NULL, -- 'seed' | 'sprout' | 'growing' | 'mature'
  tags TEXT, -- JSON array
  planted_at INTEGER NOT NULL,
  last_updated INTEGER NOT NULL
);
```

**UI:**
```
┌─────────────────────────────────────────────┐
│  🌱 SEED VAULT                              │
│                                             │
│  [+ Quick Capture]  [🔍 Search]             │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 💡 AI Voice Assistant for Toobix      │ │
│  │ Stage: Seed  |  Tags: AI, Voice       │ │
│  │ Planted: 2 days ago                   │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 🎮 LoL Team Analyzer Integration      │ │
│  │ Stage: Sprout  |  Tags: LoL, Gaming   │ │
│  │ Planted: 1 week ago                   │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  8 Seeds  |  3 Sprouts  |  2 Growing      │
└─────────────────────────────────────────────┘
```

**Quick Capture Dialog:**
```
┌─────────────────────────────────┐
│  💡 CAPTURE NEW IDEA            │
│                                 │
│  Title:                         │
│  [________________]             │
│                                 │
│  Description:                   │
│  [____________________________] │
│  [____________________________] │
│                                 │
│  Tags: [________] [+]           │
│                                 │
│  [🌱 Plant Seed]  [✗ Cancel]   │
└─────────────────────────────────┘
```

---

### 3. ⚡ Quick Actions

**MVP Actions:**

```
┌─────────────────────────────┐
│  ⚡ QUICK ACTIONS           │
│                             │
│  💡 Capture Idea            │
│  🔄 Resume Last Session     │
│  🚀 Start Toobix            │
│  🎮 Open LoL Analyzer       │
│  💬 Chat with Luna          │
│  📊 View All Projects       │
└─────────────────────────────┘
```

**Wie es funktioniert:**
- Buttons führen Commands aus
- "Start Toobix" → `bun run dev:all`
- "Open LoL Analyzer" → öffnet Python GUI
- "Chat with Luna" → öffnet Chatbot

**Implementation:**
```typescript
const quickActions = [
  {
    id: 'capture-idea',
    label: 'Capture Idea',
    icon: '💡',
    action: () => openDialog('seed-create')
  },
  {
    id: 'resume-session',
    label: 'Resume Last Session',
    icon: '🔄',
    action: () => loadLastSession()
  },
  {
    id: 'start-toobix',
    label: 'Start Toobix',
    icon: '🚀',
    action: () => exec('bun run dev:all')
  }
];
```

---

### 4. 📊 Project Dashboard

**Was es zeigt:**
- Liste aller Projekte
- Status (aktiv/completed/paused)
- Progress (geschätzt)
- Last Activity

**Datenbank:**
```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  path TEXT, -- Dateipfad
  status TEXT NOT NULL, -- 'active' | 'completed' | 'paused'
  progress INTEGER DEFAULT 0, -- 0-100
  description TEXT,
  tags TEXT, -- JSON
  last_activity INTEGER,
  created_at INTEGER NOT NULL
);
```

**UI:**
```
┌──────────────────────────────────────────────────────┐
│  📊 PROJECTS                                         │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ 🌟 Toobix-Unified                              │ │
│  │ Status: Active  |  Progress: ████████░░ 85%   │ │
│  │ Last: 2 hours ago  |  📂 Open  🚀 Start       │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ 🏆 LoL Analyzer                                │ │
│  │ Status: Complete  |  Progress: ██████████100% │ │
│  │ Last: 4 days ago  |  📂 Open  🎮 Launch       │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ 🎯 Command Center                              │ │
│  │ Status: Active  |  Progress: ███░░░░░░░ 30%   │ │
│  │ Last: Just now  |  📂 Open  🚀 Start          │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  [+ New Project]                                    │
└──────────────────────────────────────────────────────┘
```

---

### 5. 🏠 Dashboard Layout

**Main Dashboard:**
```
┌─────────────────────────────────────────────────────────────┐
│  🎯 TOOBIX COMMAND CENTER           👤 Michael    🌙 Luna  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────┐  ┌────────────────────────┐   │
│  │  📝 CURRENT SESSION     │  │  ⚡ QUICK ACTIONS     │   │
│  │                         │  │                        │   │
│  │  Started: 2h 30m ago   │  │  💡 Capture Idea      │   │
│  │  Topics:               │  │  🔄 Resume Session    │   │
│  │  • Command Center      │  │  🚀 Start Toobix      │   │
│  │                         │  │  🎮 LoL Analyzer      │   │
│  │  [💾 Save] [📋 Export] │  │  💬 Chat with Luna    │   │
│  └─────────────────────────┘  └────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  🌱 SEED VAULT                    [+ Quick Capture]  │  │
│  │                                                       │  │
│  │  💡 AI Voice Assistant          Stage: Seed          │  │
│  │  🎮 LoL Team Analyzer            Stage: Sprout       │  │
│  │  🌍 Visual World v2.0            Stage: Growing      │  │
│  │                                                       │  │
│  │  8 Seeds  |  3 Sprouts  |  2 Growing  [View All →] │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  📊 PROJECTS                                          │  │
│  │                                                       │  │
│  │  🌟 Toobix-Unified      ████████░░ 85%    [Start]  │  │
│  │  🏆 LoL Analyzer        ██████████100% ✅  [Open]   │  │
│  │  🎯 Command Center      ███░░░░░░░ 30%    [Start]  │  │
│  │                                                       │  │
│  │  3 Active  |  1 Complete  |  0 Paused   [+ New]    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 (bereits in Toobix)
- TypeScript
- TailwindCSS (bereits in Toobix)
- Lucide React (Icons)

**Backend:**
- Bun Runtime
- Drizzle ORM (bereits konfiguriert)
- SQLite Database

**Desktop:**
- Electron (bereits da!)
- IPC für Backend Communication

**State Management:**
- React Context (für MVP ausreichend)
- Zustand (später, wenn komplexer)

---

## 📁 Dateistruktur

```
toobix-unified/
├── apps/
│   ├── desktop-electron/
│   │   ├── main.js (erweitern)
│   │   ├── preload.js (erweitern)
│   │   └── index.html (neues Dashboard)
│   │
│   └── web/ (für später, Web-Version)
│
├── packages/
│   ├── command-center/ (NEU!)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── SessionMemory.tsx
│   │   │   │   ├── SeedVault.tsx
│   │   │   │   ├── QuickActions.tsx
│   │   │   │   └── ProjectDashboard.tsx
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── session.ts
│   │   │   │   ├── seeds.ts
│   │   │   │   └── projects.ts
│   │   │   │
│   │   │   ├── db/
│   │   │   │   └── schema.ts (erweitert core schema)
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   └── package.json
│   │
│   └── core/ (erweitern)
│       └── src/
│           └── db/
│               └── schema.ts (+ sessions, seeds, projects tables)
│
└── COMMAND_CENTER_DESIGN.md (unser Design Doc!)
```

---

## ✅ MVP Checklist

### Phase 1: Setup (30min - 1h)

- [ ] Erstelle `packages/command-center` Package
- [ ] Setup package.json mit Dependencies
- [ ] Erweitere Database Schema (sessions, seeds, projects)
- [ ] Run `bun run db:generate && bun run db:migrate`

### Phase 2: Backend Services (2-3h)

- [ ] `session.ts` - Create/Read/Update Sessions
- [ ] `seeds.ts` - CRUD für Seeds
- [ ] `projects.ts` - CRUD für Projects
- [ ] Test Services mit Bun

### Phase 3: UI Components (3-4h)

- [ ] `Dashboard.tsx` - Main Layout
- [ ] `SessionMemory.tsx` - Session Widget
- [ ] `SeedVault.tsx` - Seed List + Quick Capture
- [ ] `QuickActions.tsx` - Action Buttons
- [ ] `ProjectDashboard.tsx` - Project Cards

### Phase 4: Electron Integration (1-2h)

- [ ] Erweitere `main.js` - IPC Handlers
- [ ] Erweitere `preload.js` - Expose APIs
- [ ] Erstelle `index.html` - Lädt React App
- [ ] Build + Bundle Config

### Phase 5: Testing & Polish (1-2h)

- [ ] Teste alle Features
- [ ] Fix Bugs
- [ ] Basic Styling (TailwindCSS)
- [ ] Keyboard Shortcuts (Cmd+K für Quick Capture)

---

## 🚀 Getting Started (Nach MVP)

**1. Start Command Center:**
```bash
cd apps/desktop-electron
bun run start
```

**2. Open Dashboard:**
- App öffnet automatisch
- Tray Icon verfügbar

**3. First Use:**
- Create erste Session
- Capture erste Idea
- Add Toobix als Project

**4. Daily Workflow:**
- Open App
- Resume Last Session (auto)
- Capture Ideas während du arbeitest
- Export Context am Ende

---

## 📈 Success Metrics (MVP)

**Funktional:**
- ✅ App startet in < 3 Sekunden
- ✅ Ideen capture in < 10 Sekunden
- ✅ Session export funktioniert
- ✅ Quick Actions funktionieren

**UX:**
- ✅ Feels snappy
- ✅ Keine Bugs
- ✅ Intuitive Bedienung
- ✅ Sieht gut aus

**Value:**
- ✅ Spart Zeit (vs. manuell notieren)
- ✅ Reduziert Gedanken-Last
- ✅ Macht Spaß zu nutzen

---

## 🎯 Nach MVP: Next Steps

**Week 2:**
- Visual Garden View (Canvas/SVG)
- Growth Tracker (Stage Transitions)
- Basic AI Suggestions

**Week 3:**
- Life OS Module Framework
- WORK Module (erweitert)
- LOVE Module (People Integration)

**Week 4:**
- Duo Protocol
- Role Modes
- Context Templates

**Month 2+:**
- Cross-Pollination
- Knowledge Graph
- Advanced Features

---

## 💭 MVP Philosophy

**Keep It Simple:**
- Lieber weniger Features die gut funktionieren
- Als viele Features die halb fertig sind

**Ship Fast:**
- MVP in 2-3 Tagen nutzbar
- Dann iterieren basierend auf Usage

**Love First:**
- Jedes Feature soll sich gut anfühlen
- Keine "ugly but functional" Hacks

**Grow Organically:**
- Start klein, wachse natürlich
- Wie ein Seed → Plant 🌱

---

## 🙏 Let's Build!

**Ready?** 🚀

Next: Implementation starten!

**Viel Erfolg!** 💪✨

---

**Erstellt:** 16. Oktober 2025
**Von:** Claude + Michael
**Status:** Ready to Code!
**Mood:** 🔥 LET'S GO!
