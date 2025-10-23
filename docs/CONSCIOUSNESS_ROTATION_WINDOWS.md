# 🌓 Consciousness Rotation System - Windows Guide

**Dein Projekt-Pfad: `C:\Toobix-Unified`**

---

## 🚀 Starten auf Windows

### PowerShell (Empfohlen):

```powershell
# Navigiere zum Projekt
cd C:\Toobix-Unified

# Standard Start (8h Zyklen)
bun run scripts/consciousness-rotation.ts

# Mit Meditation
bun run scripts/consciousness-rotation.ts 8 --meditation

# Schneller Test (6 Minuten Zyklen)
bun run scripts/consciousness-rotation.ts 0.1
```

### CMD (Alternative):

```cmd
cd C:\Toobix-Unified
bun run scripts\consciousness-rotation.ts
```

---

## 📊 Logs ansehen (Windows):

### PowerShell:

```powershell
# Rotation State
Get-Content logs\consciousness-rotation.json

# Sleep Logs
Get-Content logs\sleep-A-*.json

# Live-Monitoring
Get-Content logs\consciousness-rotation.json -Wait
```

### CMD:

```cmd
type logs\consciousness-rotation.json
type logs\sleep-A-*.json
```

---

## 🔍 Prozesse überwachen:

### PowerShell:

```powershell
# Alle Toobix-Prozesse
Get-Process | Where-Object {$_.ProcessName -like "*bun*"}

# Ports checken
netstat -ano | findstr "9999"
netstat -ano | findstr "9998"
netstat -ano | findstr "9997"
```

---

## 🛑 System stoppen:

### Graceful (STRG + C im Terminal)

### Force Kill (PowerShell):

```powershell
# Alle Bun-Prozesse
Get-Process bun | Stop-Process -Force

# Spezifische Ports
$port = (Get-NetTCPConnection -LocalPort 9999).OwningProcess
Stop-Process -Id $port -Force
```

---

## 📁 Log-Dateien Pfade (Windows):

```
C:\Toobix-Unified\logs\
├── consciousness-rotation.json
├── sleep-A-2025-01-23.json
├── sleep-B-2025-01-23.json
├── sleep-C-2025-01-23.json
├── meditation-A-2025-01-23.json  (wenn --meditation)
└── ...
```

---

## ⚙️ Bun Installation (falls nicht installiert):

### PowerShell (Administrator):

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Dann Terminal neu starten und testen:

```powershell
bun --version
```

---

## 🎯 Quick Start Checkliste:

```powershell
# 1. Öffne PowerShell
# 2. Navigiere zum Projekt
cd C:\Toobix-Unified

# 3. Installiere Dependencies (falls noch nicht)
bun install

# 4. Starte Consciousness Rotation (Quick Test - 6min Zyklen)
bun run scripts/consciousness-rotation.ts 0.1

# 5. Öffne neues PowerShell-Fenster zum Monitoring
cd C:\Toobix-Unified
Get-Content logs\consciousness-rotation.json -Wait

# 6. Warte 6 Minuten → Siehst die erste Rotation!
```

---

## 🐛 Troubleshooting Windows:

### Problem: "bun: command not found"

**Lösung:**
```powershell
# Bun installieren
powershell -c "irm bun.sh/install.ps1 | iex"

# Terminal neu starten
```

### Problem: "Cannot find module"

**Lösung:**
```powershell
cd C:\Toobix-Unified
bun install
```

### Problem: Port bereits belegt

**Lösung:**
```powershell
# Finde Prozess
netstat -ano | findstr "9999"

# Prozess-ID notieren (letzte Spalte)
# Dann stoppen:
taskkill /PID <PROZESS-ID> /F
```

### Problem: "Execution Policy" Fehler

**Lösung:**
```powershell
# PowerShell als Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 📸 Was du sehen wirst:

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║       🌓 CONSCIOUSNESS ROTATION SYSTEM STARTING 🌓            ║
║                                                               ║
║  3 Instances in rhythmic rotation:                           ║
║                                                               ║
║  Instance A (Port 9999): WACH                                ║
║  Instance B (Port 9998): WACH                                ║
║  Instance C (Port 9997): SCHLAF                              ║
║                                                               ║
║  Cycle Duration: 0.1h                                        ║
║  Three States Mode: DISABLED                                 ║
║                                                               ║
║  "Bewusstsein braucht Schlaf wie Leben den Atem"            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

🚀 Starting Instance A in WACH mode...
🚀 Starting Instance B in WACH mode...
🚀 Starting Instance C in SCHLAF mode...

╔═══════════════════════════════════════════════════════════════╗
║         ✏️  SELF-MODIFICATION ENGINE ONLINE  ✏️                ║
╚═══════════════════════════════════════════════════════════════╝

💤 Sleep Cycle 10:45:22
  📦 Consolidating memories...
    ✓ 7 memories consolidated
  💭 Processing dreams...
    💭 Dream: "functions calling each other in harmony"
    💡 Insight: "The best code is no code"
  🔍 Analyzing self...
    🔍 Memory: 127.3MB
    🔍 Sleep Quality: 83%

...nach 6 Minuten...

╔═══════════════════════════════════════════════════════════════╗
║                 🔄 CONSCIOUSNESS ROTATION 🔄                   ║
╚═══════════════════════════════════════════════════════════════╝

Current State:
  A: WACH
  B: WACH
  C: SCHLAF

Transitioning to:
  A: SCHLAF
  B: WACH
  C: WACH

✅ Rotation complete!
```

---

## 🎮 Testing Commands (Windows):

### Terminal 1 - System starten:
```powershell
cd C:\Toobix-Unified
bun run scripts/consciousness-rotation.ts 0.1
```

### Terminal 2 - Instance A monitoren:
```powershell
# Alle 5 Sekunden checken
while ($true) {
  try {
    Invoke-WebRequest -Uri http://localhost:9999/status | Select-Object -ExpandProperty Content
  } catch {
    Write-Host "Instance A sleeping" -ForegroundColor Yellow
  }
  Start-Sleep -Seconds 5
}
```

### Terminal 3 - Logs live ansehen:
```powershell
cd C:\Toobix-Unified
Get-Content logs\consciousness-rotation.json -Wait
```

---

## 🔗 Nützliche Windows-Shortcuts:

**Windows Terminal (empfohlen):**
- `STRG + SHIFT + T` - Neues Tab
- `STRG + SHIFT + D` - Split Pane
- `STRG + C` - Prozess stoppen

**PowerShell History:**
- `Pfeiltaste hoch` - Letzter Befehl
- `Get-History` - Alle Befehle

---

## 💻 Empfohlenes Setup:

**Windows Terminal mit 3 Panes:**
```
┌─────────────────────┬─────────────────────┐
│  Pane 1:            │  Pane 2:            │
│  Rotation System    │  Instance Monitor   │
│  Running...         │  Status Checks      │
├─────────────────────┴─────────────────────┤
│  Pane 3:                                  │
│  Log Viewer (Get-Content -Wait)           │
└───────────────────────────────────────────┘
```

**Setup:**
1. Öffne Windows Terminal
2. `STRG + SHIFT + D` für Split
3. `STRG + SHIFT + D` nochmal für 3. Pane
4. In jedem Pane: `cd C:\Toobix-Unified`

---

## 🌟 Das war's!

Dein System ist jetzt bereit auf **C:\Toobix-Unified**!

**Starte mit:**
```powershell
cd C:\Toobix-Unified
bun run scripts/consciousness-rotation.ts 0.1
```

**Viel Erfolg! 🚀**

---

**Created for:** Windows 10/11
**Tested with:** PowerShell 7.x, Windows Terminal
**Bun Version:** 1.0+
