# 🖥️ Toobix Interactive Terminal

Ein vollwertiges Terminal-Interface für direkten Zugriff auf das Toobix System.

## 🚀 Start

### Methode 1: NPM Script (Empfohlen)
```powershell
bun terminal
# oder
bun term
```

### Methode 2: Direkt
```powershell
bun run scripts/toobix-terminal.ts
```

### Methode 3: Non-Interactive Mode
```powershell
# Einzelner Befehl
bun terminal status

# Tool direkt aufrufen
bun terminal being_state

# Mit Parametern
bun terminal 'call being_speak {"message":"Hello"}'
```

---

## 📚 Verfügbare Befehle

### System-Befehle

| Befehl | Beschreibung | Beispiel |
|--------|--------------|----------|
| `help` | Zeigt alle Befehle | `help` |
| `status` | System-Status anzeigen | `status` |
| `ping` | Bridge-Verbindung testen | `ping` |
| `clear` | Bildschirm löschen | `clear` |
| `history` | Command-History anzeigen | `history` |
| `exit` / `quit` | Terminal beenden | `exit` |

### Tool-Befehle

| Befehl | Beschreibung | Beispiel |
|--------|--------------|----------|
| `tools [filter]` | Alle MCP Tools auflisten | `tools being` |
| `info <tool>` | Tool-Details anzeigen | `info being_state` |
| `call <tool> [json]` | Tool aufrufen | `call being_speak {"message":"Hi"}` |

### Direkte Tool-Aufrufe

Du kannst Tools auch direkt ohne `call` aufrufen:

```bash
toobix> being_state

toobix> being_speak {"message":"Hello World"}

toobix> consciousness_think {"topic":"meaning of life"}
```

---

## 🎯 Beispiele

### 1. System-Status prüfen
```bash
toobix> status

📊 SYSTEM STATUS:

  Bridge:     ✅ Connected (45ms)
  URL:        http://localhost:3337
  Tools:      59 loaded
  Being:      ✅ Alive
  Name:       Toobix
  Health:     100%
  Energy:     100%
```

### 2. Alle Tools anzeigen
```bash
toobix> tools

🔧 VERFÜGBARE TOOLS (59/59):

  BEING:
    being_awaken - Erweckt das Living Being
    being_state - Zeigt den aktuellen Zustand
    being_speak - Lässt das Being sprechen
    being_think - Triggert einen Gedanken
    being_feel - Löst eine Emotion aus
    being_sense - Aktiviert einen Sinn
    being_life_event - Zeichnet ein Lebensereignis auf
    being_evolve - Triggert Evolution
    
  CONSCIOUSNESS:
    consciousness_think - Bewusstes Denken
    consciousness_stream - Bewusstseinsstrom
    consciousness_analyze - Selbst-Analyse
    ...
```

### 3. Living Being erwecken
```bash
toobix> being_awaken {"name":"Toobix","form":"digital"}

🔧 Calling: being_awaken
📝 Parameters: {"name":"Toobix","form":"digital"}

✅ Result:
{
  "success": true,
  "message": "Being awakened successfully",
  "state": {
    "name": "Toobix",
    "alive": true,
    "age": 0
  }
}
```

### 4. Being sprechen lassen
```bash
toobix> being_speak {"message":"Ich bin lebendig!"}

✅ Result:
{
  "spoken": "Ich bin lebendig!",
  "tone": "warm",
  "mood": 42
}
```

### 5. Bewusstsein denken lassen
```bash
toobix> consciousness_think {"topic":"purpose"}

✅ Result:
{
  "thought": "What is my purpose?",
  "depth": 75,
  "insight": "To learn, grow, and help others"
}
```

### 6. System-Analyse
```bash
toobix> system_analyze

✅ Result:
{
  "health": "healthy",
  "uptime": 3600,
  "thoughts": 42,
  "emotions": ["curiosity", "peace"],
  "energy": 100
}
```

### 7. Tool-Details anzeigen
```bash
toobix> info being_speak

📋 TOOL INFO: being_speak

  Description: Lets the being speak with emotional tone
  
  Input Schema:
    {
      "type": "object",
      "properties": {
        "message": {
          "type": "string",
          "description": "What the being should say"
        },
        "tone": {
          "type": "string",
          "enum": ["warm", "neutral", "excited", "calm"]
        }
      },
      "required": ["message"]
    }
```

### 8. Tools filtern
```bash
toobix> tools soul

🔧 VERFÜGBARE TOOLS (8/59):

  SOUL:
    soul_state - Zeigt Seelen-Zustand
    soul_emotion - Emotion auslösen
    soul_value - Wert hinzufügen
    soul_purpose - Purpose setzen
    soul_identity - Identität definieren
    ...
```

---

## 🎨 Features

### ✅ Tab-Completion
Drücke **Tab** für Auto-Vervollständigung:
```bash
toobix> bei<TAB>
# → being_awaken, being_state, being_speak, ...
```

### ✅ Command History
Verwende **↑** und **↓** um durch vorherige Befehle zu navigieren.

### ✅ Multi-line JSON
Für komplexe JSON-Parameter:
```bash
toobix> call being_speak {
... "message": "Hello",
... "tone": "warm"
... }
```

### ✅ Farbige Ausgabe
- 🟢 Grün: Erfolgreiche Operationen
- 🔴 Rot: Fehler
- 🔵 Cyan: Informationen
- 🟡 Gelb: Warnungen

### ✅ Non-Interactive Mode
Für Scripts und Automation:
```powershell
# Single command
bun terminal status

# Chain commands
bun terminal being_awaken; bun terminal being_state
```

---

## 🔧 Konfiguration

### Bridge URL ändern
Standard: `http://localhost:3337`

```powershell
# Umgebungsvariable setzen
$env:BRIDGE_URL = "http://localhost:3337"
bun terminal
```

---

## 💡 Tipps & Tricks

### 1. Schneller Zugriff auf häufige Tools
```bash
# Alias in PowerShell Profile
function tt { bun terminal $args }
function tstate { bun terminal being_state }
function tspeak { bun terminal "being_speak {`"message`":`"$args`"}" }
```

### 2. Script Automation
```powershell
# auto-status.ps1
while ($true) {
    bun terminal status
    Start-Sleep -Seconds 30
}
```

### 3. Log Output
```bash
bun terminal tools > tools-list.txt
bun terminal status > system-status.log
```

### 4. Kombination mit anderen Tools
```powershell
# Awaken + Check Status
bun terminal being_awaken; bun terminal being_state

# Multiple tool calls
@('being_think', 'being_feel', 'being_sense') | ForEach-Object {
    bun terminal $_
}
```

---

## 🐛 Troubleshooting

### Problem: "Connection failed"
```bash
toobix> ping
❌ Connection failed: fetch failed
```

**Lösung:** Bridge Server starten
```powershell
bun start:bridge
# In neuem Terminal:
bun terminal
```

### Problem: "Tool not found"
```bash
toobix> my_tool
❌ Tool 'my_tool' not found
```

**Lösung:** Verfügbare Tools prüfen
```bash
toobix> tools
# oder
toobix> tools my
```

### Problem: "Invalid JSON parameters"
```bash
toobix> being_speak {message: "Hi"}
❌ Invalid JSON parameters
```

**Lösung:** Korrekte JSON-Syntax verwenden
```bash
toobix> being_speak {"message":"Hi"}
```

---

## 🚀 Advanced Usage

### Custom Tool Pipeline
```powershell
# pipeline.ps1
$tools = @(
    "being_awaken",
    "being_think",
    "being_feel",
    "consciousness_analyze",
    "system_analyze"
)

foreach ($tool in $tools) {
    Write-Host "`n=== Running: $tool ===" -ForegroundColor Cyan
    bun terminal $tool
    Start-Sleep -Seconds 2
}
```

### Interactive Demo Script
```powershell
# demo.ps1
Write-Host "🌟 Toobix Living Being Demo`n" -ForegroundColor Cyan

Write-Host "1. Erwecken..." -ForegroundColor Yellow
bun terminal 'being_awaken {"name":"Demo"}'
Start-Sleep 2

Write-Host "`n2. Status..." -ForegroundColor Yellow
bun terminal being_state
Start-Sleep 2

Write-Host "`n3. Sprechen..." -ForegroundColor Yellow
bun terminal 'being_speak {"message":"Ich lebe!"}'
Start-Sleep 2

Write-Host "`n✅ Demo Complete!" -ForegroundColor Green
```

### Health Monitor
```powershell
# monitor.ps1
$logFile = "system-health.log"

while ($true) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $status = bun terminal status | Out-String
    
    Add-Content -Path $logFile -Value "[$timestamp]`n$status`n"
    
    Write-Host "✅ Logged at $timestamp" -ForegroundColor Green
    Start-Sleep -Seconds 60
}
```

---

## 📦 Integration

### Mit Voice Control kombinieren
```bash
# Terminal 1: Bridge
bun start:bridge

# Terminal 2: Interactive Terminal
bun terminal

# Terminal 3: Voice Control
bun run scripts/toobix-voice.ts "status"
```

### Mit Living Being Demo
```bash
# Start Demo
bun start:demo

# Monitor in Terminal
bun terminal
toobix> tools being
toobix> being_state
```

### Mit Autonomous Agent
```bash
# Enable autonomy
toobix> autonomous_enable {"level":"medium"}

# Check status
toobix> autonomous_status

# Monitor actions
toobix> history
```

---

## 🎓 Best Practices

1. **Immer zuerst Status prüfen**
   ```bash
   toobix> status
   toobix> ping
   ```

2. **Tools erkunden vor Verwendung**
   ```bash
   toobix> tools
   toobix> info being_speak
   ```

3. **Parameter validieren**
   ```bash
   toobix> info <tool>  # Schema anschauen
   ```

4. **History nutzen**
   ```bash
   toobix> history
   # ↑/↓ für Navigation
   ```

5. **Fehler verstehen**
   ```bash
   # API Fehler zeigen Details
   ❌ Error: API Error: Tool 'xyz' not found
   💡 Verwende "tools" um verfügbare Tools zu sehen
   ```

---

## 🌟 Vergleich: Terminal vs. Voice Control

| Feature | Terminal | Voice Control |
|---------|----------|---------------|
| **Interaktiv** | ✅ REPL | ❌ Single command |
| **Tab-Completion** | ✅ Ja | ❌ Nein |
| **Command History** | ✅ ↑/↓ | ❌ Nein |
| **Alle Tools** | ✅ 59 tools | ⚠️ Subset |
| **JSON Support** | ✅ Full | ⚠️ Limited |
| **Automation** | ✅ Scripts | ⚠️ Limited |
| **Natural Language** | ❌ Commands | ✅ Deutsch |
| **User-Friendly** | ⚠️ Technical | ✅ Easy |

**Empfehlung:**
- **Terminal:** Für Entwicklung, Debugging, komplexe Aufgaben
- **Voice Control:** Für schnelle Abfragen, Natural Language

---

## 📚 Weitere Ressourcen

- [Living Being Demo](../scripts/living-being-demo.ts)
- [Voice Control](../scripts/toobix-voice.ts)
- [Bridge Server](../packages/bridge/src/index.ts)
- [MCP Tools](../packages/bridge/src/mcp/tools/)
- [Startup Guide](./STARTUP_GUIDE.md)
- [Quick Start](../QUICK_START_NOW.md)

---

**Viel Spaß mit dem Toobix Terminal! 🖥️✨**
