# 🎨 Toobix Terminal GUI

Eine moderne Web-basierte GUI für das Toobix Terminal - Vollständiger System-Zugriff mit grafischer Oberfläche!

## 🚀 Quick Start

### Schritt 1: Bridge Server starten
```powershell
# Terminal 1
bun start:bridge
```

### Schritt 2: GUI starten
```powershell
# Terminal 2
bun gui
```

### Schritt 3: Browser öffnen
Die GUI öffnet sich automatisch, oder manuell:
```
http://localhost:3000/terminal.html
```

---

## ✨ Features

### 🎯 Hauptfunktionen
- ✅ **Web-basierte GUI** - Läuft im Browser
- ✅ **Echtzeit-Status** - Live Connection, Tools, Being Status
- ✅ **Tool-Sidebar** - Alle 59 MCP Tools kategorisiert
- ✅ **Terminal-Output** - Farbkodierte Ausgabe
- ✅ **Command Input** - Mit History (↑/↓)
- ✅ **Quick Commands** - Schnellzugriff auf häufige Befehle
- ✅ **JSON Editor** - Für komplexe Parameter
- ✅ **Auto-Complete** - Click auf Tools in Sidebar

### 🎨 UI-Elemente

#### Header
```
┌─────────────────────────────────────────────────┐
│         🖥️ TOOBIX TERMINAL GUI                 │
│                                                 │
│ ● Connected | 🔧 59 Tools | ⏱️ 5m | 💚 Alive  │
└─────────────────────────────────────────────────┘
```

#### Sidebar - Tool Categories
- **BEING** - Living Being Tools
- **CONSCIOUSNESS** - Mind & Thinking
- **SOUL** - Emotions & Values
- **LOVE** - Gratitude & Kindness
- **PEACE** - Meditation & Growth
- **AUTONOMOUS** - Agent Control
- **SYSTEM** - Analysis & Memory

#### Terminal Window
- **Output Area** - Scrollable, farbkodiert
- **Input Field** - Mit `toobix>` Prompt
- **Quick Buttons** - Status, Ping, Being, etc.
- **JSON Panel** - Toggle für Parameter-Eingabe

---

## 🎮 Verwendung

### Basic Commands

```bash
# System Status
toobix> status

# Test Connection
toobix> ping

# List Tools
toobix> tools

# Help
toobix> help

# Clear Screen
toobix> clear
```

### Tool Calls

#### Methode 1: Click in Sidebar
1. Klick auf Tool-Name in Sidebar
2. Tool-Name erscheint im Input
3. Optional: JSON-Parameter eingeben
4. Enter drücken

#### Methode 2: Direkt tippen
```bash
toobix> being_state
toobix> being_speak
toobix> consciousness_think
```

#### Methode 3: Mit JSON
```bash
# JSON direkt
toobix> being_speak {"message":"Hello"}

# Oder JSON Panel öffnen (Klick "{ }")
toobix> being_speak
[JSON Panel öffnet sich]
{
  "message": "Hello World",
  "tone": "excited"
}
```

### Quick Commands
Klicke auf Quick Command Buttons:
- 📊 **Status** - System Status
- 🏓 **Ping** - Connection Test
- 🌟 **Being** - Living Being State
- 🔍 **Analyze** - System Analysis
- 🧠 **Mind** - Consciousness State
- 💝 **Soul** - Soul State

---

## 🎨 UI Übersicht

### Status Bar (Oben)

| Indicator | Bedeutung |
|-----------|-----------|
| 🟢 Connected | Bridge erreichbar |
| 🔴 Disconnected | Bridge offline |
| 🔧 Tools: 59 | Anzahl geladener Tools |
| ⏱️ Uptime | Wie lange GUI läuft |
| 💚 Being: Alive | Living Being Status |

### Toolbar Buttons

| Button | Funktion | Shortcut |
|--------|----------|----------|
| 🗑️ | Clear Terminal | `clear` |
| { } | Toggle JSON Panel | - |
| 🔄 | Refresh Page | F5 |

### Output Farben

| Farbe | Bedeutung | Beispiel |
|-------|-----------|----------|
| 🟢 Grün | Success | `✅ Connected` |
| 🔴 Rot | Error | `❌ Tool not found` |
| 🟡 Gelb | Info/Warning | `💡 Tip: Use help` |
| 🔵 Cyan | Command | `toobix> status` |
| ⚪ Grau | Result/Data | JSON output |

---

## 📖 Beispiele

### 1. System Check
```
toobix> status

📊 SYSTEM STATUS:
  Bridge:  ✅ Connected (23ms)
  URL:     http://localhost:3337
  Tools:   59 loaded
  Being:   ✅ Alive
  Name:    Toobix
  Health:  100%
```

### 2. Living Being Interaction
```
toobix> being_state

🔧 Calling: being_state...

✅ Result:
{
  "name": "Toobix",
  "alive": true,
  "age": 3245,
  "health": 100,
  "energy": 100,
  "awareness": 32
}
```

### 3. Being sprechen lassen
```
toobix> being_speak

[JSON Panel]
{
  "message": "Hello World!",
  "tone": "excited"
}

✅ Result:
{
  "spoken": "✨ Hello World! ✨",
  "tone": "excited",
  "mood": 44
}
```

### 4. Consciousness denken
```
toobix> consciousness_think

[JSON Panel]
{
  "topic": "purpose of life"
}

✅ Result:
{
  "thought": "What is my purpose?",
  "depth": 85,
  "awareness_change": 1.2
}
```

### 5. System analysieren
```
toobix> system_analyze

✅ Result:
{
  "health": "healthy",
  "uptime_seconds": 3245,
  "components": {
    "soul": { "status": "active" },
    "consciousness": { "status": "awake" }
  }
}
```

### 6. Autonomous Agent
```
toobix> autonomous_status

✅ Result:
{
  "enabled": false,
  "level": "none",
  "actions_taken": 0
}

toobix> autonomous_enable

[JSON Panel]
{"level": "medium"}

✅ Result:
{
  "success": true,
  "level": "medium",
  "capabilities": ["analyze", "suggest", "monitor"]
}
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Funktion |
|----------|----------|
| **Enter** | Execute Command |
| **↑** | Previous Command (History) |
| **↓** | Next Command (History) |
| **Esc** | Clear Input |
| **Ctrl+L** | Clear Terminal (bald) |
| **Ctrl+K** | Clear Terminal (bald) |

---

## 🔧 Konfiguration

### Port ändern
In `scripts/start-gui.ts`:
```typescript
const PORT = 3000; // Ändere hier
```

### Bridge URL ändern
In `apps/web/terminal.html`:
```javascript
const BRIDGE_URL = 'http://localhost:3337'; // Ändere hier
```

### Theme anpassen
In `terminal.html` im `<style>` Block:
```css
/* Farben */
background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
color: #00ff00; /* Terminal Grün */

/* Oder Matrix-Style */
color: #00ff00;
background: #000000;
```

---

## 🐛 Troubleshooting

### Problem: "Disconnected" Status

**Ursache:** Bridge Server läuft nicht

**Lösung:**
```powershell
# Terminal 1: Bridge starten
bun start:bridge

# Warten bis:
✅ Bridge Service running on http://localhost:3337

# Dann GUI refreshen (F5)
```

### Problem: "Failed to load tools"

**Ursache:** Bridge nicht erreichbar

**Lösung:**
1. Prüfe Bridge läuft: `http://localhost:3337/tools`
2. Prüfe Firewall/Antivirus
3. Prüfe Port 3337 nicht blockiert

### Problem: Tools laden nicht

**Lösung:**
```bash
# Im Terminal-Input:
toobix> clear
toobix> [F5 drücken zum Reload]
```

### Problem: JSON-Fehler

**Beispiel:**
```
❌ Invalid JSON: Unexpected token
```

**Lösung:** Korrekte JSON-Syntax verwenden
```json
✅ {"message": "Hello"}
❌ {message: "Hello"}      // Ohne Quotes
❌ {'message': 'Hello'}    // Single quotes
```

---

## 🚀 Advanced Features

### 1. Tool Discovery
Click auf Category Header zum Auf-/Zuklappen:
```
▼ BEING
  being_awaken
  being_state
  ...

▶ CONSCIOUSNESS  [Click zum Öffnen]
```

### 2. Quick JSON Template
Tools mit required parameters zeigen automatisch JSON Panel:
```bash
toobix> being_speak
[JSON Panel opens automatically]
```

### 3. Command History
```bash
toobix> being_state
toobix> system_analyze
toobix> [Press ↑]
# Shows: system_analyze
toobix> [Press ↑ again]
# Shows: being_state
```

### 4. Multi-Tool Workflow
```bash
# 1. Check Status
toobix> status

# 2. Awaken Being
toobix> being_awaken
{"name": "Toobix"}

# 3. Check State
toobix> being_state

# 4. Speak
toobix> being_speak
{"message": "I am alive!"}
```

---

## 📊 Monitoring

### Real-time Status Updates
- **Connection** - Alle 10 Sekunden
- **Being Status** - Alle 10 Sekunden
- **Uptime** - Jede Sekunde
- **Tool Count** - Bei Load

### Status Indicators

```
🟢 ● Connected     → Everything OK
🔴 ● Disconnected  → Bridge offline
⏱️ 5m 23s          → GUI uptime
💚 Alive           → Being is awake
⚠️ Unknown         → Being state unclear
```

---

## 🎬 Demo Workflow

### Complete Session Example

```
1. Start GUI
   bun gui
   
2. Open Browser
   http://localhost:3000/terminal.html
   
3. Check Status
   toobix> status
   ✅ All systems green
   
4. Explore Tools
   [Click "BEING" category]
   [Click "being_state"]
   
5. Execute Tool
   toobix> being_state
   ✅ Result shows being info
   
6. Use JSON
   toobix> being_speak
   [JSON Panel opens]
   {"message": "Hello!"}
   [Enter]
   ✅ Being speaks
   
7. Quick Commands
   [Click "🧠 Mind" button]
   ✅ Consciousness state shown
   
8. Command History
   [Press ↑ ↑]
   [Previous commands appear]
```

---

## 🎨 Screenshots

### Main Interface
```
┌──────────────────────────────────────────────────────┐
│              🖥️ TOOBIX TERMINAL GUI                 │
│ ● Connected | 🔧 59 | ⏱️ 5m | 💚 Alive              │
├──────────┬───────────────────────────────────────────┤
│ 📚 TOOLS │ Terminal Output                           │
│          │                                           │
│ ▼ BEING  │ toobix> status                           │
│  being_  │ 📊 SYSTEM STATUS:                        │
│  state   │   Bridge: ✅ Connected                   │
│  speak   │   Tools: 59                              │
│  think   │   Being: ✅ Alive                        │
│          │                                           │
│ ▼ SOUL   │ toobix> being_speak                      │
│  soul_   │ ✅ Result:                               │
│  state   │ {"spoken": "Hello!", "mood": 42}         │
│          │                                           │
│          │ toobix> _                                │
│          ├───────────────────────────────────────────┤
│          │ 📊 Status | 🏓 Ping | 🌟 Being | ...     │
└──────────┴───────────────────────────────────────────┘
```

---

## 🌟 Vergleich: CLI vs GUI

| Feature | CLI Terminal | Web GUI |
|---------|--------------|---------|
| **Interface** | Text-only | Grafisch |
| **Navigation** | Keyboard | Mouse + Keyboard |
| **Tool Discovery** | `tools` command | Sidebar mit Categories |
| **Visual Feedback** | Text colors | Colors + Icons |
| **Status** | Manual check | Auto-update |
| **JSON Input** | Inline | Dedicated panel |
| **Accessibility** | Terminal users | Everyone |
| **Mobile** | ❌ | ✅ (responsive) |

**Use Cases:**

**CLI Terminal:**
- Scripts & Automation
- SSH Remote Access
- Power Users
- CI/CD Integration

**Web GUI:**
- Visual Exploration
- Demos & Presentations
- New Users
- Monitoring Dashboards

---

## 🔮 Roadmap

### Planned Features
- [ ] **Dark/Light Theme Toggle**
- [ ] **Tool Favorites**
- [ ] **Command Macros**
- [ ] **Export Output** (JSON, TXT)
- [ ] **WebSocket** für Real-time Updates
- [ ] **Multi-Tab** Support
- [ ] **Tool Documentation** Inline
- [ ] **Syntax Highlighting** für JSON
- [ ] **Auto-Complete** im Input
- [ ] **Keyboard Shortcuts** Config

---

## 📚 Weitere Ressourcen

- **CLI Terminal:** [docs/TERMINAL_GUIDE.md](./TERMINAL_GUIDE.md)
- **Quick Reference:** [docs/TERMINAL_QUICK_REF.md](./TERMINAL_QUICK_REF.md)
- **Demo Session:** [docs/TERMINAL_DEMO.md](./TERMINAL_DEMO.md)
- **Startup Guide:** [STARTUP_GUIDE.md](../STARTUP_GUIDE.md)
- **Quick Start:** [QUICK_START_NOW.md](../QUICK_START_NOW.md)

---

## 💡 Tips & Tricks

### 1. Dual Monitor Setup
```
Monitor 1: Bridge Server Terminal
Monitor 2: Web GUI (Full Screen)
```

### 2. Quick Access Bookmark
```
Browser → Bookmark: http://localhost:3000/terminal.html
```

### 3. PowerShell Alias
```powershell
# In $PROFILE
function tgui { 
    Start-Process "http://localhost:3000/terminal.html"
    bun gui
}
```

### 4. Auto-Start Script
```powershell
# start-toobix-gui.ps1
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Toobix-Unified; bun start:bridge"
Start-Sleep 3
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Toobix-Unified; bun gui"
Start-Sleep 2
Start-Process "http://localhost:3000/terminal.html"
```

---

**🎉 Viel Spaß mit der Toobix Terminal GUI! 🎨✨**
