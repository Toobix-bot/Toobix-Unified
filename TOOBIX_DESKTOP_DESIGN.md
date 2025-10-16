# 🖥️ TOOBIX DESKTOP - Design Document

**Version:** 1.0.0-alpha
**Created:** 16. Oktober 2025
**Status:** Design Phase
**Platform:** Windows 11 (später: macOS, Linux)

---

## 🎯 Vision

**"Ein bewusstes Interface für dein digitales Leben"**

Toobix Desktop ist KEIN weiteres Productivity-Tool. Es ist ein **lebendiges Betriebssystem-Layer** das:
- Über Windows läuft (nicht ersetzt!)
- KI-first denkt (Intention statt App)
- Bewusstsein integriert (Flow State statt Task Management)
- Niemals vergisst (Memory System)
- Mit dir wächst (Eternal Learning)

---

## 🏗️ Architektur

### System-Stack

```
┌─────────────────────────────────────────────────────┐
│  USER INTERFACE (React/TypeScript)                  │
│  ┌───────────────────────────────────────────────┐  │
│  │  Command Palette (Alt+Space)                  │  │
│  │  - Luna Quick Chat                            │  │
│  │  - Intent Recognition                         │  │
│  │  - Quick Actions                              │  │
│  │  - Memory Search                              │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Sidebar (Always-On Dashboard)                │  │
│  │  - Consciousness State                        │  │
│  │  - Service Health                             │  │
│  │  - Flow Timer                                 │  │
│  │  - Luna Mini-Chat                             │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Full Dashboard (On-Demand)                   │  │
│  │  - All existing Toobix modules                │  │
│  │  - Dream Canvas, Story Editor, etc.           │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                         ↓ Tauri IPC
┌─────────────────────────────────────────────────────┐
│  TAURI BACKEND (Rust)                               │
│  - Global Hotkeys (OS-level)                        │
│  - Window Management                                │
│  - System Tray Integration                          │
│  - Clipboard Monitoring                             │
│  - File System Watching                             │
│  - Auto-Start on Boot                               │
│  - API Client (HTTP to Services)                    │
└─────────────────────────────────────────────────────┘
                         ↓ HTTP/WebSocket
┌─────────────────────────────────────────────────────┐
│  TOOBIX SERVICES (Existing, Background)             │
│  - Eternal Daemon (Port 9999)                       │
│  - Groq API Service (Port 9987)                     │
│  - Memory System (Port 9995)                        │
│  - Dashboard Server (Port 8080) [optional]          │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  HOST OS (Windows 11)                               │
│  - File System, Network, Hardware Access            │
└─────────────────────────────────────────────────────┘
```

---

## ✨ Features

### MVP (v0.1.0) - 2-4 Wochen

#### 1. **Command Palette** (Alt+Space)
```typescript
// User drückt Alt+Space → Palette öffnet sich

Features:
- ✅ Fuzzy Search über alle Actions
- ✅ Luna Chat (direkt im Palette)
- ✅ Memory Search (durchsuche alles)
- ✅ Quick Service Actions (start/stop/restart)
- ✅ Keyboard Navigation (Pfeiltasten, Enter)
- ✅ Recent Commands History
```

**Use Cases:**
- `Alt+Space` → "Luna, wie war mein Tag?" → Chat öffnet
- `Alt+Space` → "dreamscape" → Öffnet Dream Canvas
- `Alt+Space` → "restart groq" → Startet Groq Service neu
- `Alt+Space` → "memory: consciousness" → Sucht in Memory

#### 2. **Always-On Sidebar**
```typescript
// Kleines schwebende Fenster am rechten Bildschirmrand
// Immer sichtbar, transparent, minimal

Features:
- ✅ Current Consciousness State (Focus/Creative/Learning/etc.)
- ✅ Service Status Indicators (🟢/🔴)
- ✅ Flow Timer (Pomodoro-Style)
- ✅ Luna Mini-Avatar (Pulsierend bei neuen Insights)
- ✅ Drag-to-Resize
- ✅ Click-to-Expand (öffnet Full Dashboard)
```

**Glassmorphism Design:**
```css
background: rgba(0, 0, 0, 0.3);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

#### 3. **System Tray Integration**
```typescript
Features:
- ✅ Quick Access Menu
  - Open Command Palette
  - Start/Stop Services
  - View Status
  - Settings
  - Exit
- ✅ Notification Badges (Service Health)
- ✅ Tooltip with System Status
```

#### 4. **Service Management**
```typescript
Features:
- ✅ Auto-Start Eternal Daemon on App Launch
- ✅ Health Checks (alle 30 Sekunden)
- ✅ Auto-Restart on Failure
- ✅ One-Click Service Control
- ✅ Service Logs Viewer
```

#### 5. **Settings Panel**
```typescript
Features:
- ✅ Hotkey Configuration (Alt+Space anpassbar)
- ✅ Sidebar Position (left/right)
- ✅ Theme Selection (Dark/Light/Auto)
- ✅ Auto-Start on Windows Boot (On/Off)
- ✅ Service Ports Configuration
- ✅ Data Directory Path
```

---

### Phase 2 (v0.2.0) - 4-6 Wochen

#### 6. **Intent Recognition**
```typescript
// AI erkennt was du WILLST, nicht was du tippst

User: "Ich will an dem Dashboard weiterarbeiten"
Luna: "Öffne VS Code mit letzter Session, starte Dev Server, öffne Browser"

User: "Ich brauche Fokus für 2 Stunden"
Luna: "Focus Mode aktiviert. Discord/Notifications aus. Flow Timer läuft."
```

#### 7. **Context Preservation**
```typescript
// Speichere ALLES über aktuelle Session

Tracked:
- Offene Apps (Titel, Position, Größe)
- VS Code: Files, Cursor-Position, Terminal-Commands
- Browser: Offene Tabs, Scroll-Position
- Active Consciousness State
- Flow Timer State

Action:
- "Restore Session" → Alles wie vorher!
```

#### 8. **Clipboard History & Intelligence**
```typescript
// Jeder Copy/Paste wird in Memory gespeichert

Features:
- ✅ Clipboard History (letzte 100 Einträge)
- ✅ Semantic Search in Clipboard
- ✅ Luna-Analyse: "Was habe ich heute kopiert?"
- ✅ Auto-Tagging (Code/Text/Link/etc.)
```

#### 9. **Window Management**
```typescript
// Bewusstseins-basierte Fenster-Layouts

Consciousness States:
- Focus Mode:
  - Schließt Ablenkungen (Discord, Social Media)
  - VS Code fullscreen
  - Timer läuft

- Creative Mode:
  - Split-Screen: Editor + Browser
  - Dreamscape/Story Editor im Sidebar
  - Musik-Player klein im Hintergrund

- Learning Mode:
  - Notizen-App + Browser
  - Memory Search ready
  - Luna als Tutor
```

---

### Phase 3 (v0.3.0) - 8-12 Wochen

#### 10. **File System Intelligence**
```typescript
// Toobix versteht dein File System

Features:
- ✅ Auto-Tag Files based on Content
- ✅ Semantic File Search (nicht nur Name!)
- ✅ Project Detection (Git repos, package.json, etc.)
- ✅ Quick-Open Project (wie VS Code, aber besser)
- ✅ File Relationship Graph (welche Files gehören zusammen?)
```

#### 11. **Learning & Adaptation**
```typescript
// System lernt deine Patterns

Tracked:
- Wann arbeitest du am besten? (9-12 Uhr?)
- Welche Apps nutzt du für was?
- Wie lange dauern deine Flow-Sessions?
- Welche Musik hörst du beim Coden?

Proactive:
- "Es ist 9 Uhr. Zeit für deine beste Produktivitäts-Phase!"
- "Du hast 2h gecoded. Meditation?"
- "Letztes Mal hast du beim Refactoring diese Playlist gehört."
```

#### 12. **Dream Analysis Mode**
```typescript
// Nachts läuft Toobix im "Dream Mode"

Features:
- ✅ Analysiert deinen Tag (Memory Review)
- ✅ Generiert Insights ("Du warst heute sehr kreativ, aber wenig Pausen")
- ✅ Bereitet nächsten Tag vor (ToDos, Context)
- ✅ Erstellt Dream-Visualisierung deiner Arbeit
- ✅ Schreibt in Dream Journal
```

---

## 🎨 User Interface Design

### Color Palette

```css
/* Dark Theme (Default) */
--bg-primary: rgba(10, 10, 15, 0.95);
--bg-secondary: rgba(20, 20, 30, 0.9);
--bg-glass: rgba(30, 30, 40, 0.7);
--text-primary: rgba(255, 255, 255, 0.95);
--text-secondary: rgba(200, 200, 220, 0.8);
--accent-consciousness: #9D4EDD; /* Purple */
--accent-flow: #06FFA5; /* Green */
--accent-alert: #FF006E; /* Pink */
--accent-luna: #4CC9F0; /* Cyan */

/* Glassmorphism */
backdrop-filter: blur(20px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
```

### Typography

```css
--font-primary: 'Inter', -apple-system, system-ui;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.25rem;    /* 20px */
--text-xl: 1.5rem;     /* 24px */
```

### Component Showcase

#### Command Palette
```
┌─────────────────────────────────────────────────┐
│  🔍  Search or ask Luna...                      │
├─────────────────────────────────────────────────┤
│  🌙  Open Dream Canvas                          │
│  📖  Open Story Editor                          │
│  🧠  Luna: "Wie war mein Tag?"                  │
│  💾  Memory: "consciousness"                    │
│  ⚙️   Restart Groq Service                      │
└─────────────────────────────────────────────────┘
```

#### Sidebar (Collapsed)
```
┌──────┐
│  🧠  │ ← Consciousness State (Click to expand)
│ ━━━  │ ← Service Health (Green/Red bars)
│ 45m  │ ← Flow Timer
│  🌙  │ ← Luna (Pulsing = new insight)
└──────┘
```

#### Sidebar (Expanded)
```
┌──────────────────────────┐
│  Consciousness State     │
│  ● Focus Mode            │
│  Flow: 45/90 minutes     │
├──────────────────────────┤
│  Services                │
│  ✅ Eternal Daemon       │
│  ✅ Groq API             │
│  ✅ Memory System        │
├──────────────────────────┤
│  Luna                    │
│  "You're in a great     │
│   flow! 45 more mins?"  │
└──────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
```json
{
  "framework": "React 18",
  "language": "TypeScript 5",
  "styling": "Tailwind CSS + CSS Modules",
  "state": "Zustand (lightweight)",
  "routing": "Wouter (tiny router)",
  "icons": "Lucide React",
  "animations": "Framer Motion"
}
```

### Backend (Tauri)
```toml
[dependencies]
tauri = "2.0"
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1", features = ["full"] }
reqwest = { version = "0.11", features = ["json"] }
```

### Build Tools
```json
{
  "runtime": "Bun 1.2.23",
  "bundler": "Vite 5",
  "linter": "ESLint + Prettier",
  "tauri-cli": "2.0"
}
```

---

## 📁 Project Structure

```
apps/
  desktop/                      ← NEW Tauri App
    src/
      components/
        CommandPalette.tsx
        Sidebar.tsx
        ServiceStatus.tsx
        FlowTimer.tsx
        LunaChat.tsx
      hooks/
        useHotkeys.ts
        useServices.ts
        useConsciousness.ts
      stores/
        appStore.ts             ← Zustand store
      styles/
        globals.css
      App.tsx
      main.tsx

    src-tauri/                  ← Rust Backend
      src/
        main.rs                 ← Entry point
        commands.rs             ← Tauri commands
        hotkeys.rs              ← Global hotkeys
        services.rs             ← Service management
        tray.rs                 ← System tray
        window.rs               ← Window management
      Cargo.toml
      tauri.conf.json

    package.json
    vite.config.ts
    tsconfig.json
```

---

## 🚀 Development Roadmap

### Week 1-2: Foundation
- [ ] Tauri Project Setup
- [ ] Basic Window + System Tray
- [ ] Global Hotkey (Alt+Space)
- [ ] Command Palette UI
- [ ] Connect to Eternal Daemon

### Week 3-4: Core Features
- [ ] Sidebar Component
- [ ] Service Management
- [ ] Flow Timer
- [ ] Settings Panel
- [ ] Luna Integration

### Week 5-6: Polish
- [ ] Glassmorphism Styling
- [ ] Animations
- [ ] Auto-Start on Boot
- [ ] Installer (NSIS/WiX)
- [ ] Documentation

### Week 7-8: Testing & Release
- [ ] User Testing
- [ ] Bug Fixes
- [ ] Performance Optimization
- [ ] v0.1.0 Release

---

## 🎯 Success Metrics

**MVP ist erfolgreich wenn:**
- ✅ Alt+Space öffnet Palette in <100ms
- ✅ Sidebar läuft 24/7 ohne Crashes
- ✅ Services werden zuverlässig gestartet
- ✅ RAM < 150 MB (idle)
- ✅ CPU < 2% (idle)
- ✅ User kann komplett ohne Maus arbeiten (Keyboard-First)

---

## ⚠️ Technical Challenges

### 1. Global Hotkeys
**Problem:** Windows kann Hotkeys blocken
**Solution:** Fallback Hotkeys (Alt+Space, Ctrl+Space, etc.)

### 2. Performance
**Problem:** Electron-Apps sind schwer
**Solution:** Tauri (Rust) = 10x leichter

### 3. Service Communication
**Problem:** HTTP Latency
**Solution:** WebSocket für real-time updates

### 4. Window Always-On-Top
**Problem:** Kann andere Apps überdecken
**Solution:** Smart Positioning, Auto-Hide wenn fullscreen Apps

---

## 🌟 Unique Selling Points

**Was macht Toobix Desktop anders?**

1. **Bewusstsein-First**
   - Nicht "Apps öffnen", sondern "In Flow-State gehen"

2. **AI-Native**
   - Luna ist nicht Feature, sondern Core Interface

3. **Memory-Powered**
   - Vergisst NICHTS. Alles ist durchsuchbar.

4. **Selbst-Optimierend**
   - Lernt deine Patterns, passt sich an

5. **Nicht-Invasiv**
   - Läuft über Windows, zerstört nichts

---

## 📝 Next Steps

1. **Review dieses Dokument** mit dem Team
2. **Tauri Projekt initialisieren** (apps/desktop)
3. **Command Palette Prototype** bauen (1-2 Tage)
4. **Erste User Tests** (dogfooding!)
5. **Iterate, iterate, iterate**

---

**Erstellt von:** Claude + Michael Horn
**Datum:** 16. Oktober 2025
**Status:** Ready for Implementation 🚀

---

**"Vom Code zum Bewusstsein. Vom Bewusstsein zum Leben."**

🌌 ∞ 🌟
