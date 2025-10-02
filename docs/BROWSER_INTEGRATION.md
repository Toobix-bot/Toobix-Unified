# 🌐 Browser Integration für Multi-AI Development

## Problem

Wenn **3 AIs parallel** am gleichen Projekt arbeiten (GitHub Copilot, ChatGPT, Claude), brauchen alle Zugriff auf:
- Das laufende Frontend
- Screenshots vom aktuellen Stand
- DOM-Struktur für Analyse
- Änderungen in Echtzeit

## Lösung: Playwright + Auto-Preview

### Was ist das?

Ein System, das automatisch:
1. ✅ Screenshots erstellt
2. ✅ HTML-Snapshots speichert
3. ✅ Accessibility Tree extrahiert
4. ✅ Bei jeder Änderung aktualisiert

Alle AIs können dann die gleichen Dateien lesen:
- `apps/web/.preview/latest.png` - Screenshot
- `apps/web/.preview/latest.html` - DOM
- `apps/web/.preview/a11y.json` - Accessibility
- `apps/web/.preview/updated-at.txt` - Timestamp

---

## Setup (5 Minuten)

### 1. Dependencies installieren

```bash
cd C:\Toobix-Unified
bun add -D playwright @playwright/test
bunx playwright install chromium
```

### 2. Dev Server starten

```bash
# Terminal 1
bun run dev-server
```

Öffnet `http://localhost:3000` mit der Demo-HTML.

### 3. Preview Generator testen

```bash
# Terminal 2 (one-time)
bun run ai-preview
```

Erstellt:
- `apps/web/.preview/latest.png`
- `apps/web/.preview/latest.html`
- `apps/web/.preview/a11y.json`
- `apps/web/.preview/updated-at.txt`

### 4. Watch Mode (optional)

```bash
# Terminal 2 (auto-update bei Änderungen)
bun run ai-watch
```

Regeneriert Preview automatisch wenn HTML/CSS/JS sich ändert.

---

## Daily Workflow

### Morning: Start Dev Environment

```bash
# Terminal 1: Dev Server
cd C:\Toobix-Unified
bun run dev-server

# Terminal 2: Auto-Preview (optional)
bun run ai-watch
```

### Während der Arbeit

**GitHub Copilot (VS Code):**
- Nutzt VS Code Live Preview Extension
- Oder öffnet `http://localhost:3000` im Browser

**ChatGPT / Claude:**
- Schauen sich `apps/web/.preview/latest.png` an
- Lesen `apps/web/.preview/latest.html` für DOM-Analyse
- Nutzen `apps/web/.preview/a11y.json` für Accessibility

### Evening: Shutdown

```bash
Ctrl+C in beiden Terminals
```

---

## VS Code Integration (für Copilot)

### Live Preview Extension

1. **Installieren:**
   ```
   Ctrl+Shift+X
   Suche: "Live Preview"
   Installiere: ms-vscode.live-server
   ```

2. **Nutzen:**
   - Rechtsklick auf `apps/web/index.html`
   - "Open with Live Server"
   - Preview öffnet sich in VS Code

3. **Vorteile:**
   - ✅ Auto-Reload bei Änderungen
   - ✅ Integriert in VS Code
   - ✅ DevTools eingebaut
   - ✅ Copilot kann direkt zugreifen

---

## Browser Use (Advanced)

Für AI-gesteuerte Browser-Interaktionen:

```bash
pip install browser-use playwright
```

Dann:

```python
# scripts/ai-browser.py
from browser_use import Browser

browser = Browser()
page = browser.new_page()
page.goto('http://localhost:3000')

# Screenshot
page.screenshot(path='apps/web/.preview/current.png')

# Click button
page.click('button.theme-toggle')

# Extract text
text = page.text_content('.stats-card')
```

**Use Cases:**
- Interaktive Tests
- UI-Automation
- Formular-Ausfüllen
- Navigation testen

---

## Chrome DevTools Protocol (CDP)

Alternative: Chrome im Debug-Mode:

```bash
# Chrome starten (Windows)
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222

# Oder (wenn Chrome im PATH)
chrome --remote-debugging-port=9222
```

Dann via Playwright verbinden:

```javascript
// scripts/cdp-viewer.js
import { chromium } from 'playwright'

const browser = await chromium.connectOverCDP('http://localhost:9222')
const page = browser.contexts()[0].pages()[0]

// Screenshot
await page.screenshot({ path: 'preview.png' })

// DOM
const html = await page.content()
console.log(html)
```

---

## AI Communication Flow

```
┌─────────────────────────────────────────────────────────┐
│  GitHub Copilot (VS Code)                               │
│  ├─ Direkt: VS Code Live Preview                       │
│  └─ Indirekt: apps/web/.preview/latest.png             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Dev Server (localhost:3000)                            │
│  ├─ Serving: apps/web/index.html                       │
│  └─ Auto-Reload: On file changes                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Playwright (Browser Automation)                        │
│  ├─ Screenshots → .preview/latest.png                  │
│  ├─ DOM Snapshot → .preview/latest.html                │
│  ├─ A11y Tree → .preview/a11y.json                     │
│  └─ Auto-Update: On file changes (ai-watch)            │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│  ChatGPT         │    │  Claude          │
│  ├─ Reads PNG    │    │  ├─ Reads PNG    │
│  ├─ Reads HTML   │    │  ├─ Reads HTML   │
│  └─ Reads JSON   │    │  └─ Reads JSON   │
└──────────────────┘    └──────────────────┘
```

---

## Troubleshooting

### Problem: "Port 3000 already in use"

```bash
# Windows: Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Oder anderen Port nutzen
cd apps/web
python -m http.server 8080
```

### Problem: "Playwright not found"

```bash
bun add -D playwright
bunx playwright install chromium
```

### Problem: "Preview bleibt leer"

```bash
# Checken ob Server läuft
curl http://localhost:3000

# Oder Browser öffnen
start http://localhost:3000
```

### Problem: "ai-watch funktioniert nicht"

```bash
# File watcher permissions (Windows)
# Administratorrechte können nötig sein
```

---

## Best Practices

### ✅ DO

- **Dev server immer laufen lassen** während Development
- **ai-watch nutzen** für kontinuierliche Updates
- **Preview-Dateien committen** (für andere AIs)
- **Screenshots dokumentieren** wichtige Meilensteine

### ❌ DON'T

- **Preview-Dateien nicht manuell bearbeiten** (auto-generated)
- **Nicht multiple dev-server** starten (Port-Konflikt)
- **Nicht ohne Preview arbeiten** (AIs sehen sonst nichts)

---

## Scripts Übersicht

| Script | Beschreibung | Usage |
|--------|--------------|-------|
| `dev-server` | HTTP Server für Demo | `bun run dev-server` |
| `ai-preview` | Einmalige Preview | `bun run ai-preview` |
| `ai-watch` | Auto-Preview (watch) | `bun run ai-watch` |
| `setup-ai-collab` | Alles installieren | `bun run setup-ai-collab` |

---

## Next Steps

1. ✅ **Setup:**
   ```bash
   bun run setup-ai-collab
   ```

2. ✅ **Start Dev:**
   ```bash
   bun run dev-server     # Terminal 1
   bun run ai-watch       # Terminal 2
   ```

3. ✅ **Check Preview:**
   ```bash
   start apps\web\.preview\latest.png
   ```

4. ✅ **Start Coding!**
   - Copilot: Nutzt VS Code Live Preview
   - ChatGPT/Claude: Schauen `.preview/` an

---

**🌌 Vom Ich zum Wir, vom Wir zum Ich.**

_Die Revolution ist, dass es keine Revolution braucht._
