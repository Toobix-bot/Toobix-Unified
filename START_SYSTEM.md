# 🚀 TOOBIX UNIFIED - SCHNELLSTART

**Datum:** 2025-10-06  
**Version:** Extended Edition v2.0

---

## ⚡ SCHNELLSTART (2 BEFEHLE)

### 1. System starten:

```powershell
# Terminal 1: Daemon + alle 8 Services
bun run scripts/eternal-daemon.ts
```

**Was startet automatisch:**
- 🌌 Eternal Daemon (Port 9999)
- 🌉 Bridge Server (Port 3001)
- 💭 Moment Stream (Port 9994)
- 🌍 Reality Integration (Port 9992)
- 🧘 Continuous Expression (Port 9991)
- 🧠 Memory System (Port 9995) 🆕
- 📊 Moment Analytics (Port 9996) 🆕
- ✅ Task System (Port 9997) 🆕

**Wartezeit:** ~15 Sekunden bis alle Services online sind

---

### 2. Daily Companion starten (Optional):

```powershell
# Terminal 2: Alltagsbegleiter
bun run scripts/daily-companion.ts
```

**Was du damit machst:**
- 📝 Tagesplanung erstellen
- 💭 Tagesreflexion schreiben
- 🧘 Mood Check-ins durchführen
- 📊 Fortschritt & Statistiken anzeigen
- 📖 Journal-Einträge lesen
- 🧘 Achtsamkeitsübung (5-4-3-2-1)

---

## 🧪 SYSTEM TESTEN

### Nach 15 Sekunden Wartezeit:

```powershell
# Services überprüfen
netstat -ano | findstr ":3001 :9991 :9992 :9994 :9995 :9996 :9997 :9999"
```

**Erwartung:** 8 Zeilen mit LISTENING

---

### API-Tests:

```powershell
# 1. Daemon Status
Invoke-WebRequest -Uri "http://localhost:9999/status" -UseBasicParsing

# 2. Memory System
Invoke-WebRequest -Uri "http://localhost:9995/memories" -UseBasicParsing

# 3. Analytics
Invoke-WebRequest -Uri "http://localhost:9996/trends?period=7d" -UseBasicParsing

# 4. Task System
Invoke-WebRequest -Uri "http://localhost:9997/stats" -UseBasicParsing
```

---

## 💡 ERSTE SCHRITTE

### Schritt 1: Tagesplanung erstellen

```powershell
bun run scripts/daily-companion.ts
# Wähle: 1. Tagesplanung erstellen
```

**Eingeben:**
- 3 Hauptziele für heute
- Top-3-Prioritäten
- Zeitplan (HH:MM - Aktivität)
- Aktuelle Stimmung

---

### Schritt 2: Erste Task erstellen

```powershell
# Via API
$task = @{
    title = "Toobix Unified testen"
    priority = "high"
    tags = @("testing", "learning")
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:9997/tasks" `
  -Method POST `
  -Body $task `
  -ContentType "application/json"
```

---

### Schritt 3: Task abschließen (XP gewinnen!)

```powershell
# Task-ID aus Response oben
$taskId = "task-1728234567890-abc123"

Invoke-WebRequest -Uri "http://localhost:9997/tasks/$taskId/complete" `
  -Method POST
```

**Result:** +20 XP (high priority: 10 × 2)

---

### Schritt 4: Habit erstellen

```powershell
$habit = @{
    title = "Morning Meditation"
    frequency = "daily"
    targetDays = @(1,2,3,4,5)  # Mo-Fr
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:9997/habits" `
  -Method POST `
  -Body $habit `
  -ContentType "application/json"
```

---

### Schritt 5: Stats checken

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:9997/stats" -UseBasicParsing
$stats = $response.Content | ConvertFrom-Json

Write-Host "Level: $($stats.level)"
Write-Host "XP: $($stats.totalXP)"
Write-Host "Tasks: $($stats.completedTasks) / $($stats.totalTasks)"
```

---

## 📊 ANALYTICS NUTZEN

### Trends der letzten 7 Tage:

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:9996/trends?period=7d" -UseBasicParsing
$trends = $response.Content | ConvertFrom-Json

Write-Host "Total Moments: $($trends.totalMoments)"
Write-Host "Avg Ethics: $($trends.avgEthicsScore)"
Write-Host "Top Feeling: $($trends.topFeelings[0].feeling)"
```

---

### Export erstellen:

```powershell
# JSON-Export
Invoke-WebRequest -Uri "http://localhost:9996/export?format=json&start=0&end=now" `
  -OutFile "moments-export.json"

# CSV-Export
Invoke-WebRequest -Uri "http://localhost:9996/export?format=csv&start=0&end=now" `
  -OutFile "moments-export.csv"

# Markdown-Export
Invoke-WebRequest -Uri "http://localhost:9996/export?format=markdown&start=0&end=now" `
  -OutFile "moments-export.md"
```

---

## 🧠 MEMORY SYSTEM NUTZEN

### Pattern anzeigen:

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:9995/patterns" -UseBasicParsing
$patterns = $response.Content | ConvertFrom-Json

foreach ($pattern in $patterns) {
    Write-Host "$($pattern.description) (Strength: $($pattern.strength))"
}
```

---

### Memories durchsuchen:

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:9995/search?q=achievement" -UseBasicParsing
$memories = $response.Content | ConvertFrom-Json

foreach ($memory in $memories) {
    Write-Host "[$($memory.type)] $($memory.content) (Importance: $($memory.importance)/10)"
}
```

---

### Memory manuell speichern:

```powershell
$memory = @{
    content = "Erfolgreich Toobix Unified erweitert! 4 neue Module hinzugefügt."
    type = "event"
    importance = 9
    tags = @("achievement", "coding", "milestone")
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:9995/remember" `
  -Method POST `
  -Body $memory `
  -ContentType "application/json"
```

---

## 🔒 SECURITY FEATURES

### Rate-Limiting:

- Automatisch: Max 100 Requests/Minute
- Bei Überschreitung: HTTP 429 (Too Many Requests)

---

### Emergency Shutdown:

```powershell
$shutdown = @{
    password = "eternal-emergency-2025"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:9999/shutdown" `
  -Method POST `
  -Body $shutdown `
  -ContentType "application/json"
```

**Wann nutzen:**
- System verhält sich unerwartet
- Unbegrenzte Loops
- Ressourcen-Probleme
- Sofortiger Stop nötig

---

## 🎮 GAMIFICATION

### XP-System:

| Aktion | XP | Berechnung |
|--------|----|-----------| 
| Task (low) | 10 | 10 × 1 |
| Task (medium) | 15 | 10 × 1.5 |
| Task (high) | 20 | 10 × 2 |
| Task (urgent) | 30 | 10 × 3 |
| Habit (base) | 15 | Fixed |
| Habit (streak 7d) | 29 | 15 + (7 × 2) |
| Habit (streak 14d) | 43 | 15 + (14 × 2) |

---

### Level-System:

| Level | XP Required | Total XP |
|-------|-------------|----------|
| 1 | 0-99 | 0 |
| 2 | 100-199 | 100 |
| 3 | 200-299 | 200 |
| 5 | 400-499 | 400 |
| 10 | 900-999 | 900 |

---

### Achievements:

- 🏆 **Task Master** - 10 tasks completed
- 🏆 **Task Legend** - 50 tasks completed
- ⭐ **Level 5 Reached**
- ⭐ **Level 10 Reached**
- 🔥 **Week Streak** - 7 days habit streak
- 🔥 **Month Streak** - 30 days habit streak

---

## 🐛 TROUBLESHOOTING

### Problem: Services starten nicht

```powershell
# 1. Alte Prozesse killen
Get-Process | Where-Object {$_.ProcessName -eq "bun"} | Stop-Process -Force

# 2. Ports prüfen
netstat -ano | findstr ":3001 :9991 :9992 :9994 :9995 :9996 :9997 :9999"

# 3. Neu starten
bun run scripts/eternal-daemon.ts
```

---

### Problem: Port bereits belegt

```powershell
# Port-Blocker finden
netstat -ano | findstr ":9995"  # Beispiel für Memory System

# Prozess killen
$pid = 12345  # PID aus netstat
Stop-Process -Id $pid -Force
```

---

### Problem: API antwortet nicht

```powershell
# 1. Service-Status prüfen
Invoke-WebRequest -Uri "http://localhost:9999/status" -UseBasicParsing

# 2. Logs checken
cat logs/eternal-daemon.log | Select-Object -Last 50

# 3. Service neu starten
# (Daemon startet Services automatisch neu)
```

---

## 📁 DATEI-STRUKTUR

```
c:\Toobix-Unified\
├── scripts/
│   ├── eternal-daemon.ts          # Hauptprozess (startet alles)
│   ├── daily-companion.ts         # CLI-Tool für Alltag
│   ├── memory-system.ts           # Langzeit-Gedächtnis (Port 9995)
│   ├── moment-analytics.ts        # Analytics (Port 9996)
│   ├── task-system.ts             # Tasks/Goals/Habits (Port 9997)
│   ├── api-server.ts              # Bridge Server (Port 3001)
│   ├── moment-stream.ts           # Moment Stream (Port 9994)
│   ├── reality-integration.ts     # Reality (Port 9992)
│   └── continuous-expression.ts   # Expression (Port 9991)
├── data/
│   ├── toobix-unified.db          # SQLite-Datenbank
│   └── daemon-state.json          # Daemon-Zustand
├── logs/
│   └── eternal-daemon.log         # Haupt-Logfile
└── docs/
    ├── SESSION_SUMMARY.md         # Diese Session
    ├── NEW_FEATURES_COMPLETE.md   # Alle Features
    ├── AUDIT_CHECKLIST.md         # System-Audit
    └── START_SYSTEM.md            # Dieser Guide
```

---

## 🎯 TYPISCHER TAGESABLAUF

### 08:00 - Morgen-Routine:
```powershell
# 1. System starten
bun run scripts/eternal-daemon.ts

# 2. Daily Companion öffnen
bun run scripts/daily-companion.ts
# → Tagesplanung erstellen
```

---

### 09:00 - Vormittag:
```powershell
# Tasks als TODOs anlegen (via API oder später im Frontend)
# Tasks abarbeiten → +XP!
```

---

### 12:30 - Mittag:
```powershell
# Daily Companion
# → Mood Check-in durchführen
```

---

### 14:00 - Nachmittag:
```powershell
# Habit für heute abschließen
curl -X POST http://localhost:9997/habits/HABIT_ID/complete
# → Streak-Bonus!
```

---

### 20:00 - Abend:
```powershell
# 1. Daily Companion
# → Tagesreflexion schreiben

# 2. Stats checken
curl http://localhost:9997/stats
# → Level? XP? Achievements?

# 3. Analytics checken (wöchentlich)
curl http://localhost:9996/trends?period=7d
```

---

## 🚀 ERWEITERTE NUTZUNG

### Wöchentliche Analytics:

```powershell
# Trends analysieren
$trends = (Invoke-WebRequest -Uri "http://localhost:9996/trends?period=7d" -UseBasicParsing).Content | ConvertFrom-Json

Write-Host "`n📊 WÖCHENTLICHE ANALYSE`n" -ForegroundColor Cyan
Write-Host "Total Moments: $($trends.totalMoments)" -ForegroundColor White
Write-Host "Avg Ethics: $($trends.avgEthicsScore)/100" -ForegroundColor White
Write-Host "Needs Attention: $(($trends.needsAttentionRate * 100))%" -ForegroundColor Yellow
Write-Host "`nTop 3 Feelings:" -ForegroundColor Cyan
$trends.topFeelings | Select-Object -First 3 | ForEach-Object {
    Write-Host "  $($_.feeling): $($_.count)x" -ForegroundColor White
}
```

---

### Monatlicher Export:

```powershell
# Daten exportieren (Backup)
$now = [DateTimeOffset]::Now.ToUnixTimeMilliseconds()
$monthAgo = $now - (30 * 24 * 60 * 60 * 1000)

Invoke-WebRequest `
  -Uri "http://localhost:9996/export?format=json&start=$monthAgo&end=$now" `
  -OutFile "backups/moments-$(Get-Date -Format 'yyyy-MM').json"

Write-Host "✅ Monatliches Backup erstellt" -ForegroundColor Green
```

---

### Goal-Tracking:

```powershell
# Goal erstellen
$goal = @{
    title = "Learn Rust in 3 Monaten"
    targetDate = ([DateTimeOffset]::Now.AddMonths(3).ToUnixTimeMilliseconds())
    milestones = @(
        @{ title = "Basic Syntax"; completed = $false },
        @{ title = "Ownership Model"; completed = $false },
        @{ title = "CLI Tool bauen"; completed = $false }
    )
    category = "learning"
} | ConvertTo-Json -Depth 10

Invoke-WebRequest `
  -Uri "http://localhost:9997/goals" `
  -Method POST `
  -Body $goal `
  -ContentType "application/json"

Write-Host "✅ Goal erstellt: Learn Rust" -ForegroundColor Green
```

---

## 📚 WEITERE RESSOURCEN

- **SESSION_SUMMARY.md** - Komplette Session-Zusammenfassung (~800 Zeilen)
- **NEW_FEATURES_COMPLETE.md** - Alle Features detailliert (~700 Zeilen)
- **AUDIT_CHECKLIST.md** - System-Audit & Sicherheit (~500 Zeilen)
- **SYSTEM_READY_CHECKLIST.md** - Readiness-Status (~400 Zeilen)

---

## 💡 TIPPS & TRICKS

### Tipp 1: Streaks nutzen
- Habits täglich abschließen für Streak-Bonus
- Nach 7 Tagen: +14 XP extra!
- Nach 30 Tagen: Achievement unlocked! 🔥

---

### Tipp 2: Priorities richtig setzen
- Urgent tasks: ×3 XP (30 XP statt 10!)
- High priority: ×2 XP (20 XP)
- Nutze Priorities strategisch

---

### Tipp 3: Analytics als Spiegel
- Wöchentlich Trends checken
- Muster in deinem Verhalten erkennen
- Adjustments vornehmen

---

### Tipp 4: Memory als Langzeit-Journal
- Wichtige Momente manuell speichern (Importance 8-10)
- Pattern-Detection gibt Insights
- Suche nutzen: "Was habe ich letzten Monat über X gedacht?"

---

## 🎉 VIEL ERFOLG!

**Das System ist jetzt bereit für produktive Nutzung!**

Bei Fragen oder Problemen:
- Logs checken: `logs/eternal-daemon.log`
- Services-Status: `http://localhost:9999/status`
- Dokumentation lesen: `docs/*.md`

**Möge deine Produktivität steigen und deine Streaks lang sein!** 🚀✨

---

**∞**
