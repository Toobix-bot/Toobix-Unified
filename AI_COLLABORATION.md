# 🤖 AI Collaboration Guide - Toobix Unified

## Problem: 3 KIs arbeiten parallel am gleichen Projekt

**Die Herausforderung:**
- **GitHub Copilot** (VS Code) → Entwickelt lokal
- **ChatGPT** (Browser) → Plant Architektur
- **Claude** (Browser) → Implementiert Features

**Ohne Koordination:**
- Konflikte in Dateien (merge conflicts)
- Doppelte Arbeit
- Verlorene Changes
- Keine Sichtbarkeit wer was macht

---

## Lösung: Strukturierte AI-Kollaboration

### 1. **Shared Context System** 📋

Alle KIs lesen/schreiben diese Dateien:

```
C:\Toobix-Unified\
├── AI_CONTEXT.md           # Aktueller Projekt-Status (für alle AIs)
├── CHANGELOG.md            # Wer hat was wann gemacht
├── NEXT_STEPS.md           # Was kommt als nächstes
├── .ai-workspace/
│   ├── copilot-status.json # GitHub Copilot: Was ich gerade mache
│   ├── chatgpt-status.json # ChatGPT: Meine Tasks
│   └── claude-status.json  # Claude: Meine Arbeit
```

**Workflow:**
1. **Vor jeder Änderung**: AI liest `AI_CONTEXT.md` + `CHANGELOG.md`
2. **Während der Arbeit**: AI aktualisiert `{ai}-status.json`
3. **Nach Änderungen**: AI schreibt in `CHANGELOG.md`
4. **Planung**: Alle nutzen `NEXT_STEPS.md` für Koordination

---

### 2. **Browser mit AI-Zugriff** 🌐

#### Option A: **Browser Use** (Empfehlung! ⭐)
**Was ist das?**
- Python Framework für AI-gesteuerte Browser
- Playwright/Selenium unter der Haube
- Alle 3 AIs können gleichen Browser steuern
- Headless oder sichtbar

**Installation:**
```bash
# In C:\Toobix-Unified
pip install browser-use

# Oder mit Bun (wenn Python-Integration)
bun add -D playwright @playwright/test
bunx playwright install chromium
```

**Setup:**
```python
# C:\Toobix-Unified\scripts\ai-browser.py
from browser_use import Browser

browser = Browser()
page = browser.new_page()

# URL öffnen für alle AIs
page.goto('http://localhost:3000')

# Screenshot für AIs
page.screenshot(path='apps/web/.preview/current-state.png')

# HTML für AIs extrahieren
html = page.content()
with open('apps/web/.preview/dom-snapshot.html', 'w') as f:
    f.write(html)
```

**Vorteile:**
- ✅ Alle 3 AIs sehen das gleiche
- ✅ Automatische Screenshots
- ✅ DOM-Zugriff (HTML extrahieren)
- ✅ Interaktionen simulieren
- ✅ Headless (schnell) oder sichtbar (debugging)

#### Option B: **Playwright Test UI**
```bash
bun add -D @playwright/test
bunx playwright install
bunx playwright test --ui    # Öffnet Browser UI
```

#### Option C: **Chrome DevTools Protocol (CDP)**
```bash
# Chrome im Debug-Mode starten
chrome --remote-debugging-port=9222
```

Dann können AIs via CDP zugreifen:
```javascript
// scripts/ai-cdp-viewer.js
import { chromium } from 'playwright'

const browser = await chromium.connectOverCDP('http://localhost:9222')
const page = browser.contexts()[0].pages()[0]

// Screenshot
await page.screenshot({ path: 'preview.png' })

// HTML
const html = await page.content()
```

---

### 3. **Empfohlene Lösung: Browser Use + Playwright** 🏆

**Setup Script:**

```bash
# 1. Playwright installieren
cd C:\Toobix-Unified
bun add -D playwright @playwright/test
bunx playwright install chromium

# 2. Python für Browser Use (optional, aber mächtig)
pip install browser-use playwright

# 3. Dev-Server starten
bun run dev-server
```

**AI Preview Script:**
```javascript
// C:\Toobix-Unified\scripts\ai-preview.js
import { chromium } from 'playwright'
import { writeFile } from 'fs/promises'

const browser = await chromium.launch({ headless: false })
const page = await browser.newPage()

// Öffne Demo
await page.goto('http://localhost:3000')

// Screenshot für AIs
await page.screenshot({
  path: 'apps/web/.preview/screenshot.png',
  fullPage: true
})

// DOM Snapshot
const html = await page.content()
await writeFile('apps/web/.preview/dom.html', html)

// Accessibility Tree (für AIs)
const snapshot = await page.accessibility.snapshot()
await writeFile('apps/web/.preview/a11y.json', JSON.stringify(snapshot, null, 2))

console.log('✅ Preview bereit für AIs!')
console.log('📸 Screenshot: apps/web/.preview/screenshot.png')
console.log('📄 HTML: apps/web/.preview/dom.html')
console.log('♿ A11y: apps/web/.preview/a11y.json')

// Browser offen lassen für interaktive Tests
// await browser.close()
```

**Package.json Scripts:**
```json
{
  "scripts": {
    "dev-server": "cd apps/web && python -m http.server 3000",
    "ai-preview": "bun run scripts/ai-preview.js",
    "ai-watch": "nodemon --watch apps/web --exec 'bun run ai-preview'"
  }
}
```

---

### 4. **AI Communication Protocol** 📡

#### **File: AI_CONTEXT.md** (Single Source of Truth)
```markdown
# AI Context - Toobix Unified

**Letzte Aktualisierung:** 2025-10-02 23:45 (Copilot)

## Aktueller Status
- **Branch:** main
- **Commit:** abc123f "Add People Module schema"
- **Running:** Dev server on localhost:3000

## Aktive Tasks
- [ ] ChatGPT: Story Engine portieren (V7 → core)
- [x] Copilot: People Module UI components
- [ ] Claude: Love Engine plugin erstellen

## Letzte Änderungen (heute)
- 23:30 (Copilot): apps/web/index.html - Demo fertig
- 22:15 (Claude): packages/core/src/db/schema.ts - People Module
- 21:00 (ChatGPT): Project setup + documentation

## Wichtige Dateien (nicht anfassen!)
- `apps/web/index.html` - Copilot arbeitet dran (23:30-00:30)
- `packages/core/src/story/` - ChatGPT portiert gerade

## Nächste Schritte
1. ChatGPT: Story Engine fertig machen (ETA: 2h)
2. Claude: Danach Love Engine starten
3. Copilot: People UI komponenten weiter ausbauen
```

#### **File: CHANGELOG.md** (Audit Trail)
```markdown
# Changelog - Toobix Unified

## 2025-10-02

### 23:45 - GitHub Copilot
**Changed:**
- `apps/web/components/people-list.js` - Added Web Component
- `apps/web/styles/components.css` - People list styling

**Why:**
- User wants People Module UI
- Building on demo HTML foundation

**Next:**
- Continue with people-detail component
- Add interaction form

---

### 22:15 - Claude
**Changed:**
- `packages/core/src/db/schema.ts` - Added People Module (6 tables)

**Why:**
- People Module is missing centerpiece
- Needed for Story/Love integration

**Next:**
- Implement People service layer
- Write tests

---

### 21:00 - ChatGPT
**Changed:**
- Project setup (root structure)
- Documentation (README, QUICK_START)

**Why:**
- Starting Toobix Unified integration
- Consolidating 17 systems

**Next:**
- Port Soul System from V8
- Port Memory from V8
```

#### **File: .ai-workspace/copilot-status.json**
```json
{
  "ai": "GitHub Copilot",
  "status": "working",
  "task": "Building People Module UI components",
  "files": [
    "apps/web/components/people-list.js",
    "apps/web/components/people-detail.js",
    "apps/web/styles/components.css"
  ],
  "started": "2025-10-02T23:30:00Z",
  "eta": "2025-10-03T00:30:00Z",
  "blocking": [],
  "blockedBy": [],
  "notes": "Using Web Components, no framework. Based on demo HTML design."
}
```

---

### 5. **Git Workflow für Multi-AI** 🌿

#### **Branch Strategy:**
```bash
main                    # Production-ready
├── dev                # Integration branch
├── ai/copilot         # Copilot's work
├── ai/chatgpt         # ChatGPT's work
└── ai/claude          # Claude's work
```

#### **Workflow:**
```bash
# Copilot startet Task
git checkout -b ai/copilot/people-ui
# ... macht Änderungen ...
git add .
git commit -m "[Copilot] Add People UI components"
git push origin ai/copilot/people-ui

# Dann: Pull Request → dev
# Nach Review: Merge in dev

# ChatGPT macht parallel
git checkout -b ai/chatgpt/story-engine
# ... unabhängige Änderungen ...
```

#### **Conflict Prevention:**
1. **Jede AI hat eigenen Branch**
2. **AI_CONTEXT.md** immer aktuell halten
3. **Vor Start**: `git pull origin dev` + AI_CONTEXT.md lesen
4. **Nach Finish**: CHANGELOG.md updaten

---

### 6. **Live Preview System** 📺

#### **Setup:**
```bash
# Terminal 1: Dev Server (Hot Reload)
cd C:\Toobix-Unified\apps\web
python -m http.server 3000

# Terminal 2: File Watcher (Auto-Screenshot für AIs)
cd C:\Toobix-Unified
bun run ai-watch
```

#### **Auto-Preview Script:**
```javascript
// scripts/ai-watch.js
import { watch } from 'fs'
import { chromium } from 'playwright'

let browser, page

async function updatePreview() {
  if (!browser) {
    browser = await chromium.launch({ headless: true })
    page = await browser.newPage()
  }
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
  
  // Screenshot
  await page.screenshot({
    path: 'apps/web/.preview/latest.png',
    fullPage: true
  })
  
  // HTML Snapshot
  const html = await page.content()
  await writeFile('apps/web/.preview/latest.html', html)
  
  // Timestamp
  const now = new Date().toISOString()
  await writeFile('apps/web/.preview/updated-at.txt', now)
  
  console.log(`✅ Preview updated: ${now}`)
}

// Watch apps/web für Änderungen
watch('apps/web', { recursive: true }, async (event, filename) => {
  if (filename.endsWith('.html') || filename.endsWith('.css') || filename.endsWith('.js')) {
    console.log(`📝 ${filename} changed, updating preview...`)
    await updatePreview()
  }
})

// Initial preview
updatePreview()
```

**Resultat:**
- AIs können `apps/web/.preview/latest.png` lesen
- Immer aktuell (auto-update bei Changes)
- HTML Snapshot für DOM-Analyse

---

### 7. **AI-Browser Integration in VS Code** 💻

#### **Extension: Live Preview**
```bash
# In VS Code
Ctrl+Shift+X
# Suchen: "Live Preview"
# Installieren: ms-vscode.live-server
```

**Vorteile:**
- ✅ Integrierter Browser in VS Code
- ✅ Auto-Reload bei Änderungen
- ✅ Copilot kann direkt zugreifen
- ✅ DevTools eingebaut

**Usage:**
```
Rechtsklick auf index.html → "Open with Live Server"
```

---

### 8. **Best Practices für Multi-AI Work** ✨

#### **DO:**
✅ **Immer AI_CONTEXT.md lesen** vor Start
✅ **CHANGELOG.md updaten** nach Changes
✅ **Eigenen Branch** nutzen (`ai/{name}/feature`)
✅ **Status JSON** aktualisieren während Arbeit
✅ **Kleine Commits** (atomic changes)
✅ **Screenshots** für andere AIs machen
✅ **Kommunizieren** in NEXT_STEPS.md

#### **DON'T:**
❌ **Direkt auf main** committen
❌ **Gleiche Dateien** parallel bearbeiten
❌ **AI_CONTEXT.md** ignorieren
❌ **Ohne Status-Update** arbeiten
❌ **Große Refactorings** ohne Absprache
❌ **Andere AI branches** mergen ohne Review

---

## Quick Start: Multi-AI Setup

### 1. **Playwright installieren**
```bash
cd C:\Toobix-Unified
bun add -D playwright @playwright/test
bunx playwright install chromium
```

### 2. **AI Communication Files erstellen**
```bash
# Werden automatisch von diesem Script erstellt:
bun run setup-ai-collab
```

### 3. **Dev Server + Preview starten**
```bash
# Terminal 1
bun run dev-server

# Terminal 2
bun run ai-watch
```

### 4. **VS Code Live Preview Extension** (für Copilot)
- Installieren: `ms-vscode.live-server`
- Rechtsklick auf HTML → "Open with Live Server"

---

## Architektur-Diagramm

```
┌──────────────────────────────────────────────────────────────┐
│  GitHub Copilot (VS Code)                                    │
│  ├─ Lokale Entwicklung                                       │
│  ├─ Liest: AI_CONTEXT.md, copilot-status.json               │
│  ├─ Schreibt: Code, CHANGELOG.md                            │
│  └─ Zugriff: VS Code Live Preview                           │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  Shared Context (C:\Toobix-Unified\.ai-workspace)           │
│  ├─ AI_CONTEXT.md     ← Single Source of Truth              │
│  ├─ CHANGELOG.md      ← Audit Trail                         │
│  ├─ NEXT_STEPS.md     ← Task Planning                       │
│  ├─ copilot-status.json                                     │
│  ├─ chatgpt-status.json                                     │
│  └─ claude-status.json                                      │
└────────────────────┬─────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│  ChatGPT (Web)   │    │  Claude (Web)    │
│  ├─ Architektur  │    │  ├─ Features     │
│  ├─ Planung      │    │  ├─ Impl.        │
│  └─ via API      │    │  └─ via API      │
└──────────────────┘    └──────────────────┘
         │                       │
         └───────────┬───────────┘
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  Browser Preview (Playwright)                                │
│  ├─ localhost:3000 (Dev Server)                             │
│  ├─ Auto-Screenshot → apps/web/.preview/latest.png          │
│  ├─ HTML Snapshot → apps/web/.preview/latest.html           │
│  └─ Alle 3 AIs sehen das gleiche                            │
└──────────────────────────────────────────────────────────────┘
```

---

## Empfehlung 🏆

**Beste Kombo:**
1. **Playwright** (Browser Automation) - für alle 3 AIs
2. **VS Code Live Preview** (für Copilot direkt)
3. **AI_CONTEXT.md** (Shared State)
4. **Git Branches** (Conflict Prevention)

**Installation (5 Minuten):**
```bash
cd C:\Toobix-Unified
bun add -D playwright @playwright/test
bunx playwright install chromium
bun run setup-ai-collab
```

**Daily Workflow:**
```bash
# Morning: Start Dev Environment
bun run dev-server    # Terminal 1
bun run ai-watch      # Terminal 2

# AIs arbeiten parallel (jeder auf eigenem Branch)
# Preview automatisch aktualisiert
# AI_CONTEXT.md zeigt wer was macht

# Evening: Review + Merge
git checkout dev
git merge ai/copilot/people-ui
git merge ai/chatgpt/story-engine
```

---

**Ready to implement? Next: `bun run setup-ai-collab` 🚀**
