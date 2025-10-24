# 🖥️ Toobix Desktop (Tauri)

**Version:** 0.1.0-alpha
**Status:** ✅ Ready to Build
**Tech Stack:** Tauri 2.0 + React 18 + TypeScript + Tailwind CSS

---

## 🎯 Was ist das?

Eine **native Desktop-App** für Toobix Unified - 10x leichter als Electron dank Rust + Tauri.

**Features:**
- ⌨️ **Global Hotkey** (Alt+Space) - Öffnet Command Palette systemweit
- 🎨 **Command Palette** - Fuzzy Search über alle Actions
- 📊 **Service Monitoring** - Live-Status aller Eternal Services
- 🌙 **Luna Chat** - AI Companion Interface
- 🗂️ **System Tray** - Always-on in der Taskleiste
- 💨 **Glassmorphism Design** - Modern & schön
- 🔥 **Hot Reload** - Änderungen sofort sichtbar

---

## 🚀 Installation (Einmalig)

### 1. Rust installieren

**Windows:**
```powershell
# PowerShell als Administrator:
Invoke-WebRequest -Uri "https://win.rustup.rs/x86_64" -OutFile "$env:TEMP\rustup-init.exe"
Start-Process "$env:TEMP\rustup-init.exe" -Wait
```

**Oder manuell:** https://rustup.rs/

**Nach Installation:**
```powershell
# Terminal NEU öffnen, dann testen:
rustc --version   # Sollte Version zeigen
cargo --version   # Sollte Version zeigen
```

### 2. Dependencies installieren

```bash
cd C:\Toobix-Unified\apps\desktop-tauri
bun install
```

---

## 💻 Entwicklung

### Dev Mode starten

```bash
cd C:\Toobix-Unified\apps\desktop-tauri
bun run tauri:dev
```

**Was passiert:**
1. Vite Dev Server startet auf Port 5173
2. Tauri Rust Backend kompiliert
3. Desktop-Fenster öffnet sich
4. Hot Reload aktiv (Frontend-Änderungen sofort sichtbar)

**Wichtig:** Das **Eternal Daemon** muss laufen!

```bash
# In anderem Terminal:
cd C:\Toobix-Unified
bun run scripts/eternal-daemon.ts
```

### Hotkeys (während Dev läuft)

- **Alt+Space** - Command Palette öffnen
- **Escape** - Command Palette schließen
- **Arrow Keys** - Navigation in Palette
- **Enter** - Command ausführen

---

## 🏗️ Build (Production)

```bash
bun run tauri:build
```

**Output:**
- Windows: `src-tauri/target/release/toobix-desktop.exe`
- Installer: `src-tauri/target/release/bundle/` (MSI, NSIS)

**Bundle-Größe:** ~10-15 MB (vs. 100+ MB bei Electron!)

---

## 📂 Projekt-Struktur

```
apps/desktop-tauri/
├── src/                          # React Frontend
│   ├── components/
│   │   ├── CommandPalette.tsx    # Alt+Space Palette
│   │   ├── Sidebar.tsx           # Navigation
│   │   ├── Dashboard.tsx         # Startseite
│   │   ├── LunaChat.tsx          # Chat Interface
│   │   └── ServicesPage.tsx      # Service Monitoring
│   ├── App.tsx                   # Main Component
│   ├── main.tsx                  # Entry Point
│   └── index.css                 # Glassmorphism Styles
│
├── src-tauri/                    # Rust Backend
│   ├── src/
│   │   └── main.rs               # Tauri Commands, Hotkeys, Tray
│   ├── Cargo.toml                # Rust Dependencies
│   ├── tauri.conf.json           # Tauri Config
│   └── build.rs                  # Build Script
│
├── package.json                  # Frontend Dependencies
├── vite.config.ts                # Vite Config
├── tailwind.config.js            # Tailwind Config
└── tsconfig.json                 # TypeScript Config
```

---

## 🔧 Verfügbare Commands

### Frontend (Vite)
```bash
bun run dev          # Vite Dev Server only (Port 5173)
bun run build        # Build Frontend
bun run preview      # Preview Production Build
```

### Tauri
```bash
bun run tauri:dev    # Dev Mode (Rust + React)
bun run tauri:build  # Production Build + Installer
```

---

## 🎨 Design System

### Colors
```ts
consciousness: '#9D4EDD'  // Purple
flow:          '#06FFA5'  // Green
alert:         '#FF006E'  // Pink
luna:          '#4CC9F0'  // Cyan
```

### Components
- **glass** - Glassmorphism Effect
- **btn-primary** - Gradient Button
- **btn-secondary** - Glass Button
- **input-glass** - Glass Input Field

---

## 🔌 Tauri Commands (Rust → React)

### Service Management
```tsx
import { invoke } from '@tauri-apps/api/tauri'

// Check service health
const isHealthy = await invoke<boolean>('check_service_health', { port: 9999 })

// Get all services
const services = await invoke<Service[]>('get_all_services_status')

// Update service status
const service = await invoke<Service>('update_service_status', {
  serviceName: 'Eternal Daemon',
  port: 9999
})
```

### Eternal Daemon API
```tsx
// Fetch Eternal status
const status = await invoke<string>('fetch_eternal_status')
const data = JSON.parse(status)

// Fetch consciousness state
const consciousness = await invoke<string>('fetch_consciousness_state')
```

### Window Management
```tsx
// Show window
await invoke('show_main_window')

// Hide window
await invoke('hide_main_window')
```

---

## 🐛 Troubleshooting

### Problem: Rust nicht gefunden
**Lösung:**
1. Terminal **komplett schließen**
2. Neues Terminal öffnen
3. `rustc --version` testen

### Problem: "error: failed to run custom build command"
**Lösung:**
```bash
# Windows: Visual Studio Build Tools installieren
# https://visualstudio.microsoft.com/downloads/
# Wähle: "Desktop development with C++"
```

### Problem: Services offline
**Lösung:**
```bash
# Eternal Daemon starten:
cd C:\Toobix-Unified
bun run scripts/eternal-daemon.ts
```

### Problem: Port 5173 already in use
**Lösung:**
```bash
# Ändere Port in vite.config.ts:
server: { port: 5174 }
```

---

## 📊 Performance

**Tauri vs Electron:**
- **Bundle Size:** 10-15 MB vs 100+ MB
- **RAM Usage:** ~50 MB vs 200+ MB
- **Startup Time:** <1s vs 3-5s
- **CPU Idle:** <1% vs 5%+

---

## 🎯 Roadmap

### Phase 1 (Jetzt) ✅
- [x] Project Setup
- [x] Command Palette
- [x] Sidebar Navigation
- [x] Service Monitoring
- [x] Global Hotkeys
- [x] System Tray

### Phase 2 (Next)
- [ ] Luna Chat mit Groq API
- [ ] Work Module Integration
- [ ] Health Module mit Flow Timer
- [ ] People Module
- [ ] Finance Module

### Phase 3 (Future)
- [ ] Dreamscape Integration
- [ ] Stories Integration
- [ ] Auto-Update System
- [ ] Plugins Support

---

## 🤝 Contributing

1. Fork & Clone
2. `bun install`
3. Make changes
4. Test with `bun run tauri:dev`
5. Open Pull Request

---

## 📝 License

MIT License - See main project LICENSE

---

## 🌟 Quick Start (TL;DR)

```bash
# 1. Install Rust (one-time)
# https://rustup.rs/

# 2. Install deps
cd C:\Toobix-Unified\apps\desktop-tauri
bun install

# 3. Start Eternal Daemon (separate terminal)
cd C:\Toobix-Unified
bun run scripts/eternal-daemon.ts

# 4. Run app
cd apps/desktop-tauri
bun run tauri:dev

# 5. Press Alt+Space anywhere!
```

---

**Erstellt von:** Michael Horn + Claude
**Datum:** 19. Oktober 2025
**Status:** 🚀 Ready to Launch

🌌 ∞ 🌟
