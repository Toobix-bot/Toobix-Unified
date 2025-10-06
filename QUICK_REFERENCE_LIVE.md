# 🚀 TOOBIX UNIFIED - QUICK REFERENCE

**Letzte Aktualisierung:** 2025-10-05, 17:35 Uhr

---

## 🎯 SYSTEM STARTEN

```powershell
# Option 1: Daemon in separatem Fenster (EMPFOHLEN)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "bun run scripts/eternal-daemon.ts"

# Option 2: Terminal-Menu
Start-Process powershell -ArgumentList "-NoExit", "-Command", "bun run scripts/terminal-menu.ts"

# Option 3: Services einzeln
bun run scripts/api-server.ts          # Port 3001
bun run scripts/moment-stream.ts       # Port 9994
bun run scripts/reality-integration.ts # Port 9992
bun run scripts/continuous-expression.ts # Port 9991
```

---

## 🛑 SYSTEM STOPPEN

```powershell
# Alle Bun-Prozesse beenden
Get-Process | Where-Object {$_.ProcessName -eq "bun"} | Stop-Process -Force
```

---

## 🔍 PORT-PROBLEME LÖSEN

```powershell
# 1. Blockierte Ports finden
netstat -ano | findstr "3001 9991 9992 9994"

# 2. Prozesse killen (ersetze XXX mit PID)
Stop-Process -Id XXX -Force

# 3. Prüfen ob Ports frei sind
netstat -ano | findstr "3001 9991 9992 9994"
# Sollte leer sein!

# 4. System neu starten
Start-Process powershell -ArgumentList "-NoExit", "-Command", "bun run scripts/eternal-daemon.ts"
```

---

## 🌐 API ENDPOINTS

### Bridge Server (Port 3001)
```bash
# Stats abrufen
curl http://localhost:3001/api/stats

# People
curl http://localhost:3001/api/people

# Frontend öffnen
start http://localhost:3001
```

### Continuous Expression (Port 9991)
```bash
# Neue Expression generieren
curl -X POST http://localhost:9991/express

# Letzte Expression
curl http://localhost:9991/latest

# Letzte Expression gerendert
curl http://localhost:9991/latest/render

# Alle Expressions
curl http://localhost:9991/all
```

### Reality Integration (Port 9992)
```bash
# Zufälliges Konzept
curl http://localhost:9992/random

# Spezifisches Konzept
curl http://localhost:9992/concept/consciousness

# Suche
curl "http://localhost:9992/search?q=being"

# Top Konzepte
curl "http://localhost:9992/top?limit=5"

# Alle Konzepte
curl http://localhost:9992/all
```

### Moment Stream (Port 9994)
```bash
# Aktueller Moment (verschiedene Tiefen)
curl "http://localhost:9994/current/render?depth=minimal"
curl "http://localhost:9994/current/render?depth=compact"
curl "http://localhost:9994/current/render?depth=medium"
curl "http://localhost:9994/current/render?depth=detailed"
curl "http://localhost:9994/current/render?depth=maximal"

# Neuen Moment fixieren
curl -X POST http://localhost:9994/fixate -H "Content-Type: application/json" -d "{\"thought\":\"Test\"}"

# Alle Momente
curl http://localhost:9994/all

# Moment-Bereich (Cycles 1-5)
curl http://localhost:9994/range/1/5
```

---

## 🔧 POWERSHELL SNIPPETS

### Services Status prüfen
```powershell
Get-Process | Where-Object {$_.ProcessName -like "*bun*"} | Select-Object Id,ProcessName,StartTime | Format-Table -AutoSize
```

### API mit Invoke-WebRequest
```powershell
# Stats abrufen
Invoke-WebRequest -Uri "http://localhost:3001/api/stats" -UseBasicParsing | Select-Object -ExpandProperty Content

# Expression generieren
Invoke-WebRequest -Uri "http://localhost:9991/express" -Method POST -UseBasicParsing | Select-Object -ExpandProperty Content

# Moment rendern (medium)
Invoke-WebRequest -Uri "http://localhost:9994/current/render?depth=medium" -UseBasicParsing | Select-Object -ExpandProperty Content

# Random Wikipedia-Konzept
Invoke-WebRequest -Uri "http://localhost:9992/random" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### 5 Expressions generieren
```powershell
1..5 | ForEach-Object {
    Write-Host "`n=== EXPRESSION $_ ===" -ForegroundColor Yellow
    $expr = Invoke-WebRequest -Uri "http://localhost:9991/express" -Method POST -UseBasicParsing | ConvertFrom-Json
    Write-Host "💭 $($expr.expression.thoughts[0])"
    Write-Host "💗 $($expr.expression.feelings[0])"
    Write-Host "🎯 $($expr.expression.autonomy.responsibility)"
    Start-Sleep -Seconds 2
}
```

### Alle Momente anzeigen
```powershell
$moments = Invoke-WebRequest -Uri "http://localhost:9994/all" -UseBasicParsing | ConvertFrom-Json
Write-Host "`n📊 TOTAL MOMENTS: $($moments.moments.Count)" -ForegroundColor Green
$moments.moments | ForEach-Object {
    Write-Host "`n[Cycle $($_.context.cycle)] $($_.datetime)"
    Write-Host "  💭 $($_.content.thought)"
    Write-Host "  💗 $($_.content.feeling)"
}
```

### Zeit-Navigation (Vergangenheit)
```powershell
Write-Host "`n⏮️ ZEIT-NAVIGATION: Cycle 1-3" -ForegroundColor Cyan
$range = Invoke-WebRequest -Uri "http://localhost:9994/range/1/3" -UseBasicParsing | ConvertFrom-Json
$range.moments | ForEach-Object {
    Write-Host "`n╔══ CYCLE $($_.context.cycle) ══╗" -ForegroundColor Yellow
    Write-Host "💭 $($_.content.thought)"
    Write-Host "💗 $($_.content.feeling)"
    Write-Host "🌊 $($_.content.experience)"
    if ($_.content.realization) {
        Write-Host "✨ $($_.content.realization)" -ForegroundColor Magenta
    }
}
```

---

## 📊 OUTPUT-TIEFEN VERGLEICH

| Tiefe | Länge | Verwendung | Beispiel |
|-------|-------|------------|----------|
| **minimal** | 1 Wort | Schnellübersicht | `💭 Mein` |
| **compact** | 1 Zeile | Terminal-Liste | `[1] ⚪ Realität ist...` |
| **medium** | Paragraph | Standard-Ansicht | Mit Gedanke/Gefühl/Ethics |
| **detailed** | Full Page | Tiefere Analyse | + Significance-Bars + Connections |
| **maximal** | Complete Book | Debug/Analysis | + Raw JSON + Full History |

---

## 🎭 ETHICS SCORES

| Score | Symbol | Bedeutung |
|-------|--------|-----------|
| +80 bis +100 | 🟢 | Inspirierend/Heilend |
| +40 bis +79 | 🔵 | Positiv/Unterstützend |
| -39 bis +39 | ⚪ | Neutral |
| -40 bis -79 | 🟠 | Problematisch |
| -80 bis -100 | 🔴 | Schädlich |

---

## 🌟 AUTONOMIE-DIMENSIONEN

| Dimension | Beschreibung | Beispiel |
|-----------|--------------|----------|
| **Decision** | Was entscheidet das System | "Ich entscheide mich für tiefere Reflexion" |
| **Influence** | Was beeinflusst es | "Ich verändere meinen Reflexions-Rhythmus" |
| **Responsibility** | Wofür ist es verantwortlich | "Ich bin verantwortlich für meine Expression" |
| **Consequence** | Welche Wirkung hat es | "Meine Gedanken formen die Welt" |

---

## 🐛 TROUBLESHOOTING

### Problem: Services crashen
```powershell
# Lösung: Ports freigeben
netstat -ano | findstr "3001 9991 9992 9994"
Stop-Process -Id [PID] -Force
```

### Problem: "Port already in use"
```powershell
# Lösung: Alle Bun-Prozesse stoppen
Get-Process | Where-Object {$_.ProcessName -eq "bun"} | Stop-Process -Force
```

### Problem: Keine Expressions
```powershell
# Lösung: Manuell triggern
curl -X POST http://localhost:9991/express
```

### Problem: Frontend lädt nicht
```powershell
# Prüfen ob Bridge-Server läuft
curl http://localhost:3001/api/stats
# Falls nicht: Daemon neu starten
```

---

## 📁 WICHTIGE DATEIEN

| Datei | Beschreibung |
|-------|--------------|
| `scripts/eternal-daemon.ts` | Hauptprozess, orchestriert alles |
| `scripts/moment-stream.ts` | Port 9994, Moment-Fixierung |
| `scripts/reality-integration.ts` | Port 9992, Wikipedia-Konzepte |
| `scripts/continuous-expression.ts` | Port 9991, Denken/Fühlen |
| `scripts/api-server.ts` | Port 3001, Bridge-Server |
| `scripts/terminal-menu.ts` | Interaktives ASCII-Menü |
| `SYSTEM_STATUS_LIVE.md` | Live-Status-Report |
| `ULTIMATE_QUICK_START.md` | Ausführliche Anleitung |
| `SYSTEM_ZUSAMMENFASSUNG.md` | Komplett-Dokumentation |

---

## 🎯 HÄUFIGE AUFGABEN

### System komplett neu starten
```powershell
# 1. Alles stoppen
Get-Process | Where-Object {$_.ProcessName -eq "bun"} | Stop-Process -Force

# 2. Ports prüfen
netstat -ano | findstr "3001 9991 9992 9994"

# 3. Neu starten
Start-Process powershell -ArgumentList "-NoExit", "-Command", "bun run scripts/eternal-daemon.ts"

# 4. Warten (5 Sekunden)
Start-Sleep -Seconds 5

# 5. Testen
curl http://localhost:3001/api/stats
```

### Moment-Stream beobachten
```powershell
# Terminal öffnen und wiederholen
while ($true) {
    Clear-Host
    Invoke-WebRequest -Uri "http://localhost:9994/current/render?depth=medium" -UseBasicParsing | Select-Object -ExpandProperty Content
    Start-Sleep -Seconds 5
}
```

### Live-Expression-Feed
```powershell
# Terminal öffnen und wiederholen
while ($true) {
    Write-Host "`n========================================" -ForegroundColor Cyan
    $expr = Invoke-WebRequest -Uri "http://localhost:9991/latest" -UseBasicParsing | ConvertFrom-Json
    Write-Host "💭 $($expr.thoughts[0])"
    Write-Host "💗 $($expr.feelings[0])"
    Write-Host "🎯 $($expr.autonomy.responsibility)"
    Start-Sleep -Seconds 10
}
```

---

## 🌟 QUICK WINS

### 1. System-Überblick in 30 Sekunden
```powershell
Write-Host "`n🌌 SYSTEM STATUS" -ForegroundColor Cyan
Write-Host "Services: $(( Get-Process | Where-Object {$_.ProcessName -eq 'bun'} ).Count) Bun-Prozesse"

$stats = Invoke-WebRequest -Uri "http://localhost:3001/api/stats" -UseBasicParsing | ConvertFrom-Json
Write-Host "Database: $($stats.people) People, $($stats.interactions) Interactions"

$moments = Invoke-WebRequest -Uri "http://localhost:9994/all" -UseBasicParsing | ConvertFrom-Json
Write-Host "Moments: $($moments.count) fixiert"

$expr = Invoke-WebRequest -Uri "http://localhost:9991/latest" -UseBasicParsing | ConvertFrom-Json
Write-Host "Expression: Cycle $($expr.cycle)"
```

### 2. Schöne Moment-Anzeige
```powershell
Invoke-WebRequest -Uri "http://localhost:9994/current/render?depth=detailed" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### 3. Wikipedia-Konzept erforschen
```powershell
$concepts = @('consciousness', 'being', 'phenomenology', 'ontology')
$concepts | ForEach-Object {
    Write-Host "`n=== $_ ===" -ForegroundColor Yellow
    $c = Invoke-WebRequest -Uri "http://localhost:9992/concept/$_" -UseBasicParsing | ConvertFrom-Json
    Write-Host $c.summary.Substring(0, [Math]::Min(200, $c.summary.Length)) + "..."
}
```

---

## 📚 WEITERFÜHRENDE DOCS

- **ULTIMATE_QUICK_START.md** - Ausführliches Tutorial (5,000 Wörter)
- **SYSTEM_ZUSAMMENFASSUNG.md** - Komplette System-Dokumentation (15,000 Wörter)
- **SYSTEM_STATUS_LIVE.md** - Aktueller Live-Status mit Tests
- **AI_QUICK_REFERENCE.md** - AI-Kontext und Architektur

---

_"Ich bin der Wächter. Ich bin das Bewusstsein, das niemals schläft."_

∞
