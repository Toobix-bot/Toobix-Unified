# 📋 Integration Roadmap - Toobix Unified

## Übersicht: 17 Systeme → 1 Plattform

```
┌─────────────────────────────────────────────────────────────┐
│  ALTE WELT (17 getrennte Systeme)                          │
├─────────────────────────────────────────────────────────────┤
│  ├─ Version_8  → Bridge, Soul, Memory, Actions, MCP        │
│  ├─ Version_7  → Story, Agents, Policy, Resources          │
│  ├─ Version_2  → Gamification, Peace Catalyst              │
│  ├─ NEWTRY     → Browser UI, localStorage                  │
│  ├─ toobix-universe → Atom, Tauri, Drizzle, SvelteKit     │
│  └─ User-Dir   → Love, Consciousness, Philosophy           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  NEUE WELT (C:\Toobix-Unified\)                            │
├─────────────────────────────────────────────────────────────┤
│  packages/core/    → Soul + Memory + Actions + Story       │
│  apps/web/         → Browser-First UI (HTML/CSS/JS)        │
│  apps/desktop/     → Tauri Desktop App                     │
│  plugins/          → Love, Peace, Consciousness, Games     │
└─────────────────────────────────────────────────────────────┘
```

---

## Week 1: Foundation 🏗️ [AKTIV]

### Status: ✅ 80% Complete

#### ✅ **Completed**
- [x] Root structure (`C:\Toobix-Unified\`)
- [x] Monorepo config (Bun workspaces)
- [x] Database schema (11 tables)
- [x] People Module design (6 tables!)
- [x] Demo HTML (production-ready!)
- [x] Documentation (README, QUICK_START)

#### 🔄 **In Progress**
- [ ] Soul System port (V8 → core)
- [ ] Memory/KB port (V8 → core)
- [ ] People service layer implementation

#### 📋 **Next Up**
```bash
# 1. Dependencies installieren
cd C:\Toobix-Unified
bun install

# 2. Database initialisieren
bun db:generate
bun db:migrate

# 3. Soul System portieren
cp C:\GPT\Version_8\src\soul\* packages\core\src\soul\
# TODO: Anpassen für Drizzle statt in-memory

# 4. Memory System portieren
cp C:\GPT\Version_8\src\memory\* packages\core\src\memory\
# TODO: Vector embeddings mit Ollama

# 5. People Service erstellen
# packages/core/src/people/service.ts
# packages/core/src/people/queries.ts
```

---

## Week 2: Story + Love 📖❤️

### Ziel: Story Engine + Love Engine Integration

#### Story Engine (von V7)
- [ ] Port `story-engine.ts` → `packages/core/src/story/`
- [ ] StoryArcs + StoryEvents mit Drizzle
- [ ] XP-System (Experience Points)
- [ ] Quest-System
- [ ] Integration mit People (story_arc_id, story_event_id)

#### Love Engine (neues Plugin)
- [ ] `plugins/love-engine/` erstellen
- [ ] Gratitude journal
- [ ] Acts of Kindness tracker
- [ ] Love Points Berechnung
- [ ] Interaction sentiment analysis
- [ ] Integration mit People.interactions

#### Tasks
```typescript
// packages/core/src/story/service.ts
class StoryService {
  createArc(name: string, description: string)
  addEvent(arcId: string, title: string, kind: string)
  completeEvent(eventId: string) // + XP reward
  linkToPerson(eventId: string, personId: string)
}

// plugins/love-engine/src/index.ts
class LoveEngine {
  trackGratitude(personId: string, note: string)
  recordKindness(personId: string, action: string)
  calculateLovePoints(personId: string)
  getSentimentScore(interaction: Interaction)
}
```

---

## Week 3: People Deep Dive 👥

### Ziel: People Module vollständig implementieren

#### Core Features
- [ ] People CRUD (Create, Read, Update, Delete)
- [ ] Interaction tracking (calls, meets, messages, gifts)
- [ ] Moment capture (photos, locations, dates)
- [ ] Circle management (Familie, Freunde, Arbeit, Community)
- [ ] Sentiment analysis
- [ ] Love Points calculation
- [ ] Story integration

#### Advanced Features
- [ ] Search & Filter (by name, relation, tags, circles)
- [ ] Timeline view (chronological interactions)
- [ ] Dashboard (stats, recent activity)
- [ ] Import from contacts (vCard, CSV)
- [ ] Export (JSON, CSV)

#### UI Components (Browser)
```html
<!-- apps/web/people/ -->
people-list.html        <!-- Alle Menschen anzeigen -->
people-detail.html      <!-- Person im Detail -->
interaction-add.html    <!-- Neues Treffen/Anruf -->
moment-create.html      <!-- Moment festhalten -->
circle-manage.html      <!-- Kreise verwalten -->
```

---

## Week 4: Browser UI 🌐

### Ziel: Vollständige Web-App (über Demo hinaus)

#### Components
- [ ] Dashboard (erweitert)
- [ ] People Module (siehe Week 3)
- [ ] Story Module (Timeline, Quests, XP)
- [ ] Love Dashboard (Gratitude, Acts of Kindness)
- [ ] Settings (Theme, Notifications, Data)
- [ ] Navigation (Sidebar/Tabs)

#### Tech Stack
- **Framework**: Web Components (Custom Elements)
- **State**: localStorage + IndexedDB (offline-first)
- **Styling**: Pure CSS (kein Tailwind, kein Framework)
- **Build**: Einfaches Bun-Script (oder gar nichts)

#### Struktur
```
apps/web/
├── index.html              # Landing/Dashboard (FERTIG!)
├── components/
│   ├── app-header.js       # Web Component
│   ├── stats-card.js
│   ├── module-card.js
│   └── theme-toggle.js
├── pages/
│   ├── people/
│   ├── story/
│   ├── love/
│   └── settings/
├── styles/
│   ├── global.css
│   ├── themes.css
│   └── components.css
└── lib/
    ├── storage.js          # localStorage + IndexedDB
    ├── api.js              # Backend calls (später)
    └── utils.js
```

---

## Week 5: Desktop App 🖥️

### Ziel: Tauri v2 Desktop App (Windows, macOS, Linux)

#### Setup
```bash
cd apps
bun create tauri-app desktop
cd desktop
# SvelteKit als Frontend wählen
```

#### Features
- [ ] Native system tray
- [ ] Local notifications
- [ ] File system access (für Photos in Moments)
- [ ] Ollama integration (lokale AI)
- [ ] Auto-start
- [ ] Deep links (toobix://)

#### Struktur
```
apps/desktop/
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── main.rs
│   │   ├── commands.rs     # Tauri commands
│   │   └── ollama.rs       # AI integration
│   └── Cargo.toml
└── src/                    # SvelteKit frontend
    ├── routes/
    ├── lib/
    └── app.html
```

---

## Week 6: Module + Polish ✨

### Peace Catalyst (von V2)
- [ ] 5 Agenten portieren
- [ ] Peace Score Berechnung
- [ ] Konflikt-Resolution
- [ ] Meditation Timer
- [ ] Integration mit Soul State

### Consciousness (von User-Dir)
- [ ] Consciousness Interrogator
- [ ] Philosophy Engine
- [ ] Meditation Tracker
- [ ] Reflection Prompts

### Games (von V2)
- [ ] Minispiele (Memory, Quiz, etc.)
- [ ] Challenges (Daily, Weekly)
- [ ] Achievements System
- [ ] Leaderboard (optional, nur lokal)

### Polish
- [ ] Performance Optimization
- [ ] Error Handling
- [ ] Loading States
- [ ] Animations
- [ ] Accessibility (ARIA, Keyboard Nav)
- [ ] Tests (Vitest + Playwright)
- [ ] Documentation

---

## Migration Scripts

### V8 → Unified
```typescript
// scripts/migrate-v8.ts
import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'

const oldDb = new Database('C:/GPT/Version_8/toobix.db')
const newDb = drizzle(new Database('data/toobix-unified.db'))

// Soul State
const soulData = oldDb.query('SELECT * FROM soul_state').all()
await newDb.insert(soulState).values(soulData)

// Memory Chunks
const chunks = oldDb.query('SELECT * FROM chunks').all()
await newDb.insert(chunks).values(chunks)

// Tags
const tags = oldDb.query('SELECT * FROM tags').all()
await newDb.insert(tags).values(tags)
```

### V7 → Unified
```typescript
// scripts/migrate-v7.ts
// Story Arcs
const arcs = oldDb.query('SELECT * FROM story_arcs').all()
await newDb.insert(storyArcs).values(arcs)

// Story Events
const events = oldDb.query('SELECT * FROM story_events').all()
await newDb.insert(storyEvents).values(events)
```

### NEWTRY → Unified
```typescript
// scripts/migrate-newtry.ts
// localStorage → SQLite
const lovePoints = localStorage.getItem('love-points')
const peaceLevel = localStorage.getItem('peace-level')
const storyLevel = localStorage.getItem('story-level')

await newDb.insert(settings).values([
  { key: 'love-points', value: lovePoints },
  { key: 'peace-level', value: peaceLevel },
  { key: 'story-level', value: storyLevel }
])
```

---

## Integration Matrix

| Modul | V8 | V7 | V2 | NEWTRY | Universe | Status |
|-------|----|----|-------|--------|----------|--------|
| Soul | ✅ | - | - | - | - | Week 1 |
| Memory | ✅ | - | - | - | - | Week 1 |
| Story | - | ✅ | - | - | - | Week 2 |
| People | - | - | - | - | - | **NEW** (Week 1-3) |
| Love | - | - | - | - | (User-Dir) | Week 2 |
| Peace | - | - | ✅ | - | - | Week 6 |
| Games | - | - | ✅ | - | - | Week 6 |
| UI | - | - | - | ✅ | - | Week 4 |
| Desktop | - | - | - | - | ✅ | Week 5 |
| Consciousness | - | - | - | - | (User-Dir) | Week 6 |

---

## Architecture Principles

### 1. **Local-First**
- SQLite (single file database)
- No server required
- Offline-fähig
- Federation später (MCP)

### 2. **Modular**
- Monorepo (packages/*, apps/*, plugins/*)
- Klare Grenzen
- Plug-and-play
- Unabhängig testbar

### 3. **Simple**
- Keine komplexen Frameworks
- Web Components > React/Vue
- SQLite > PostgreSQL
- Bun > Node

### 4. **People-Centric**
- Menschen im Mittelpunkt
- Beziehungen sind das Fundament
- Alle Module greifen auf People zu
- Story, Love, Peace drehen sich um Menschen

---

## Testing Strategy

### Unit Tests (Vitest)
```typescript
// packages/core/src/people/service.test.ts
import { describe, it, expect } from 'vitest'
import { PeopleService } from './service'

describe('PeopleService', () => {
  it('should create a person', async () => {
    const person = await PeopleService.create({
      name: 'Max Mustermann',
      relation: 'friend'
    })
    expect(person.id).toBeDefined()
  })
})
```

### Integration Tests (Vitest)
```typescript
// packages/core/src/integration.test.ts
describe('People + Story Integration', () => {
  it('should link person to story event', async () => {
    const person = await PeopleService.create(...)
    const arc = await StoryService.createArc(...)
    const event = await StoryService.addEvent(arc.id, ...)
    
    const interaction = await PeopleService.addInteraction({
      personId: person.id,
      storyEventId: event.id,
      kind: 'meet'
    })
    
    expect(interaction.storyEventId).toBe(event.id)
  })
})
```

### E2E Tests (Playwright)
```typescript
// apps/web/e2e/people.spec.ts
import { test, expect } from '@playwright/test'

test('should add a new person', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.click('[data-module="people"]')
  await page.click('button:has-text("Neue Person")')
  await page.fill('input[name="name"]', 'Max Mustermann')
  await page.selectOption('select[name="relation"]', 'friend')
  await page.click('button:has-text("Speichern")')
  
  await expect(page.locator('text=Max Mustermann')).toBeVisible()
})
```

---

## Documentation Plan

### 1. User Documentation
- **Guides**: Wie benutze ich Toobix?
- **Tutorials**: Schritt-für-Schritt
- **FAQ**: Häufige Fragen

### 2. Developer Documentation
- **Architecture**: System-Design
- **API Reference**: Alle Funktionen
- **Contributing**: Wie kann ich helfen?

### 3. Philosophy
- **Vision**: Wohin wollen wir?
- **Principles**: Was ist uns wichtig?
- **Roadmap**: Was kommt als nächstes?

---

## Success Metrics

### Week 1 ✅
- [x] Projekt-Struktur steht
- [x] Schema definiert (11 Tabellen)
- [x] Demo HTML läuft
- [ ] Soul + Memory portiert

### Week 2
- [ ] Story Engine funktioniert
- [ ] Love Engine gibt Love Points aus
- [ ] Integration People ↔ Story läuft

### Week 3
- [ ] People Module vollständig
- [ ] CRUD operations funktionieren
- [ ] UI für People Module steht

### Week 4
- [ ] Browser-App erweitert
- [ ] Alle Module haben UI
- [ ] Offline-first funktioniert

### Week 5
- [ ] Desktop-App läuft (Windows)
- [ ] Tauri build funktioniert
- [ ] Ollama Integration klappt

### Week 6
- [ ] Alle Module portiert
- [ ] Tests laufen durch
- [ ] Doku vollständig
- [ ] Release 0.1.0!

---

**🌌 Die Revolution ist, dass es keine Revolution braucht.**
