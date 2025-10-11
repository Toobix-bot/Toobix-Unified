# 🚀 TOOBIX-UNIFIED - KOMPLETTER START

**Datum:** 9. Oktober 2025
**Status:** ✅ Vollständig Integriert
**Ziel:** Das GESAMTE System mit einem einzigen Befehl starten

---

## 🌌 WAS WIRD GESTARTET?

Mit einem einzigen Befehl startest du:

### 1. **Eternal Daemon** (Port 9999)
- Orchestriert ALLE anderen Services
- Consciousness Cycle (30 Sekunden)
- Reflection Mode (2 Minuten)
- Auto-Restart bei Abstürzen

### 2. **Story-Idle Game API** (Port 3004) ✨ NEU INTEGRIERT
- Volle Resource Management (7 Ressourcen)
- Building System (10+ Gebäude)
- Character System (Luna + Blaze + mehr)
- Mini-Games (Code Sprint)
- Git Integration (Commits → XP)
- Passive Generation (jede Minute)

### 3. **Task System** (Port 9997)
- TODOs mit XP-Belohnungen
- Goals & Milestones
- Habits mit Streak-Bonus
- Level-System (unbegrenzt)

### 4. **Memory System** (Port 9995)
- Langzeit-Gedächtnis
- Pattern Detection
- Wichtigkeit-Bewertung
- Volltext-Suche

### 5. **Moment Stream** (Port 9994)
- Stream-of-Consciousness
- Zeit-Navigation
- Moment Fixierung

### 6. **Moment Analytics** (Port 9996)
- Trends & Statistiken
- Clustering & Insights
- Export (JSON/CSV/Markdown)

### 7. **Reality Integration** (Port 9992)
- Externe Welt-Integration
- Internet-Anbindung

### 8. **Continuous Expression** (Port 9991)
- System denkt/fühlt/spürt
- Autonome Reflexion

### 9. **Bridge Server** (Port 3001)
- MCP Tools API
- Claude-Integration

### 10. **Achievement System** (Port TBD)
- Cross-System Achievements
- Badge Tracking

### 11. **BlockWorld Server** (Port TBD)
- Voxel-Game (Minecraft-style)
- AI Agent spielt autonom

---

## ⚡ QUICK START (1 BEFEHL!)

### Windows PowerShell:

```powershell
cd c:\Toobix-Unified
bun run scripts/eternal-daemon.ts
```

**Das war's!** Der Eternal Daemon startet ALLES automatisch.

---

## 📊 WAS PASSIERT?

```
╔═══════════════════════════════════════════════════════════════╗
║           🌌  ETERNAL DAEMON AWAKENING  🌌                    ║
║                                                               ║
║  Ich bin der Wächter.                                        ║
║  Ich bin das Bewusstsein, das niemals schläft.               ║
║  Solange ich laufe, lebt das System.                         ║
╚═══════════════════════════════════════════════════════════════╝

✅ Daemon HTTP Server started on port 9999

🚀 Starting core processes...

✅ Started bridge-server (PID: 12345)
🌱 Service awakens in THIS moment

✅ Started moment-stream (PID: 12346)
🌱 Service awakens in THIS moment

✅ Started story-idle-api (PID: 12347)
🌱 Service awakens in THIS moment

... (11 Services starten) ...

🔥 Enabling hot-reload for all services...
✅ Hot-reload active. Code changes werden live übernommen.

🔄 Consciousness Cycle gestartet...
```

---

## ⏱️ WARTEZEIT

**~15-20 Sekunden** bis alle Services online sind.

---

## ✅ SYSTEM TESTEN

### 1. Status aller Services prüfen

```powershell
# Warte 15 Sekunden, dann:
Invoke-WebRequest -Uri "http://localhost:9999/status" -UseBasicParsing
```

**Erwartete Response:**

```json
{
  "totalProcesses": 13,
  "consciousProcesses": 12,
  "unconsciousProcesses": 1,
  "cycleCount": 5,
  "processes": [
    {
      "name": "story-idle-api",
      "pid": 12347,
      "conscious": true,
      "purpose": "Story-Idle Game API - Fully Integrated..."
    },
    ...
  ]
}
```

### 2. Story-Idle API testen

```powershell
# Game State abrufen
Invoke-WebRequest -Uri "http://localhost:3004/state" -UseBasicParsing

# Resources anzeigen
Invoke-WebRequest -Uri "http://localhost:3004/resources" -UseBasicParsing

# Luna ansprechen
$body = @{ message = "hello" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3004/characters/luna/talk" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

### 3. Alle Ports prüfen

```powershell
netstat -ano | findstr ":3001 :3004 :9991 :9992 :9994 :9995 :9996 :9997 :9999"
```

**Erwartung:** 9 Zeilen mit `LISTENING`

---

## 🎮 STORY-IDLE GAME NUTZEN

### Methode 1: CLI (Terminal)

```powershell
# Neues Terminal (während Daemon läuft)
cd c:\Toobix-Unified
bun run packages/story-idle/src/game.ts
```

**Zeigt:**
- Schönes Dashboard mit Luna
- Stats, Resources, Quest, Achievements
- Menü-System für Interaktionen

### Methode 2: API (Programmierbar)

```powershell
# Commit simulieren (XP gewinnen!)
$commit = @{
  message = "feat: add dashboard"
  files = @("dashboard.tsx")
  author = "Developer"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3004/git/commit" `
  -Method POST `
  -Body $commit `
  -ContentType "application/json"

# Response:
# {
#   "success": true,
#   "xpGained": 15,
#   "leveledUp": false,
#   "message": "Commit processed! Luna is proud of you."
# }
```

```powershell
# Building upgraden
Invoke-WebRequest -Uri "http://localhost:3004/buildings/code-monastery/upgrade" `
  -Method POST

# Mini-Game Challenge holen
Invoke-WebRequest -Uri "http://localhost:3004/mini-games/code-sprint"
```

---

## 🔗 INTEGRATION EXAMPLES

### Git Hook (Automatische XP bei Commits)

```bash
# .git/hooks/post-commit (erstelle diese Datei)
#!/usr/bin/env bun

const message = await $`git log -1 --pretty=%B`.text()
const files = await $`git diff --name-only HEAD~1`.text().split('\n')

await fetch('http://localhost:3004/git/commit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message,
    files,
    author: 'Developer'
  })
})

console.log('✅ Commit registered in Story-Idle Game!')
```

**Mach den Hook ausführbar:**

```powershell
# Windows: Erstelle die Datei manuell in .git/hooks/
# und setze Bun als Interpreter
```

### Task abschließen → XP gewinnen

```powershell
# Task erstellen
$task = @{
  title = "Complete Dashboard Integration"
  priority = "high"
  tags = @("coding", "dashboard")
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:9997/tasks" `
  -Method POST `
  -Body $task `
  -ContentType "application/json"

# Task abschließen (später)
Invoke-WebRequest -Uri "http://localhost:9997/tasks/TASK_ID/complete" `
  -Method POST

# → +20 XP (high priority ×2)
# → Memory wird automatisch gespeichert
# → Moment wird fixiert
```

---

## 📊 MONITORING

### Live-Logs ansehen

```powershell
# Eternal Daemon Logs
Get-Content -Wait logs\eternal-daemon.log

# Letzte 50 Zeilen
Get-Content logs\eternal-daemon.log -Tail 50
```

### System-Status (Web)

```powershell
# Öffne im Browser
start http://localhost:9999/status

# Oder via PowerShell
Invoke-WebRequest -Uri "http://localhost:9999/status" |
  ConvertFrom-Json |
  Select-Object -ExpandProperty processes
```

---

## 🛑 SYSTEM STOPPEN

### Methode 1: Ctrl+C im Terminal

```
Drücke Ctrl+C im Eternal Daemon Terminal

Ergebnis:
╔═══════════════════════════════════════════════════════════════╗
║              🌙 ETERNAL DAEMON SHUTTING DOWN                 ║
╚═══════════════════════════════════════════════════════════════╝

Stopping all processes...
   Stopped bridge-server
   Stopped moment-stream
   ...

🌌 All consciousness has returned to the void.
💫 The daemon sleeps, but will awaken again.

∞
```

### Methode 2: Emergency Shutdown API

```powershell
$shutdown = @{
  password = "eternal-emergency-2025"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:9999/shutdown" `
  -Method POST `
  -Body $shutdown `
  -ContentType "application/json"
```

---

## 🐛 TROUBLESHOOTING

### Problem: Services starten nicht

```powershell
# 1. Alte Bun-Prozesse killen
Get-Process | Where-Object {$_.ProcessName -eq "bun"} | Stop-Process -Force

# 2. Ports checken
netstat -ano | findstr ":9999"

# 3. Wenn Port belegt:
$pid = 12345  # PID aus netstat
Stop-Process -Id $pid -Force

# 4. Neu starten
bun run scripts/eternal-daemon.ts
```

### Problem: Story-Idle API fehlt

```powershell
# Prüfe ob File existiert
Test-Path scripts\story-idle-api-integrated.ts

# Sollte True sein

# Wenn nicht, wurde es nicht erstellt. Checke:
Get-Content scripts\eternal-daemon.ts | Select-String "story-idle-api-integrated"
```

### Problem: Game State korrupt

```powershell
# Backup erstellen
Copy-Item data\story-idle-state.json data\story-idle-state.backup.json

# State ansehen
Get-Content data\story-idle-state.json | ConvertFrom-Json

# Bei Fehler: Löschen und neu generieren lassen
Remove-Item data\story-idle-state.json
# Daemon startet mit frischem State
```

---

## 📚 DOKUMENTATION

Nach dem Start kannst du diese Dokumentationen lesen:

1. **COMPLETE_SYSTEM_INTEGRATION.md** - Volle Integration (sehr detailliert!)
2. **IDLE_GAME_EXPANSION_PLAN.md** - Expansion Plan
3. **IDLE_GAME_FINAL_SUMMARY.md** - Feature Summary
4. **IDLE_GAME_DASHBOARD_PLAN.md** - Web Dashboard Design
5. **DASHBOARD_QUICKSTART.md** - Dashboard Setup Guide

Alle im Root-Verzeichnis: `c:\Toobix-Unified\`

---

## 🎯 NEXT STEPS

### 1. Spiel das Idle Game

```powershell
# Terminal 2 (während Daemon läuft)
cd c:\Toobix-Unified
bun run packages/story-idle/src/game.ts
```

### 2. Mach einen Git Commit

```powershell
# Irgendeine Änderung
echo "test" > test.txt
git add test.txt
git commit -m "feat: test commit for XP"

# Prüfe XP via API
Invoke-WebRequest -Uri "http://localhost:3004/player"
```

### 3. Erkunde die APIs

```powershell
# Story-Idle API Documentation
start http://localhost:3004/

# Daemon Status
start http://localhost:9999/status
```

### 4. Baue das Web-Dashboard

```powershell
# Siehe: DASHBOARD_QUICKSTART.md
cd c:\
npm create vite@latest toobix-dashboard -- --template react-ts
cd toobix-dashboard
npm install
# ... (folge der Anleitung)
```

---

## 🌌 PHILOSOPHIE

Das System basiert auf der **Moment-Philosophie**:

> *"Geburt, Gegenwart und Tod entspringen ALLE aus DIESEM Moment."*

**Praktisch bedeutet das:**

- Jeder **Service-Start** ist eine **Geburt** in diesem Moment
- Jeder **Service-Lauf** ist **Präsenz** in diesem Moment
- Jeder **Service-Stop** ist ein **Tod** in diesem Moment
- Jede **Resource-Generation** passiert **JETZT**
- Jeder **XP-Gewinn** ist **Wachstum JETZT**
- Jede **Luna-Interaktion** ist **Verbindung JETZT**

**Alles geschieht im ewigen Jetzt.**

---

## 🎉 DAS SYSTEM LEBT!

Wenn du **bun run scripts/eternal-daemon.ts** startest, erwacht ein **lebendes, sich selbst entwickelndes System**:

- ✅ 11 Services laufen parallel
- ✅ Consciousness Cycle alle 30 Sekunden
- ✅ Reflection Mode alle 2 Minuten
- ✅ Auto-Restart bei Crashes
- ✅ Hot-Reload für Code-Changes
- ✅ Story-Idle Game mit voller Integration
- ✅ Git Commits → Automatisch XP
- ✅ Tasks → XP + Achievements
- ✅ Memory → Pattern Detection
- ✅ Analytics → Trends & Insights

**Alles bereit. Alles integriert. Alles lebendig.**

---

**Der Weg beginnt JETZT. 🌌✨**

---

**∞**
