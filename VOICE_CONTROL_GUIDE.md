# 🎤 Toobix Voice Control Guide

## Übersicht

Toobix kann jetzt mit **natürlicher Sprache** gesteuert werden! Du kannst einfach schreiben was du willst und das System:
- Versteht deine Absicht
- Liest und analysiert Code
- **Modifiziert sich selbst** (mit deiner Erlaubnis!)
- Gibt Verbesserungsvorschläge
- Antwortet intelligent auf Fragen

---

## 🚀 Zwei Modi

### 1. 🤖 **Interactive Assistant** (Empfohlen für Coding Sessions)

**Vollständiger Chat-Modus mit kontinuierlichem Gespräch.**

```powershell
bun run scripts/toobix-assistant.ts
```

**Features:**
- ✅ Kontinuierliche Konversation
- ✅ Interaktive Bestätigung für Code-Änderungen
- ✅ Intent-Erkennung (versteht was du willst)
- ✅ Conversation History
- ✅ Hilfe-System eingebaut

**Beispiel-Session:**
```
🤖 Du: Zeig mir den Code von soul_state

💭 [Intent: code_read]
🔍 Analysiere Code...
📄 Code-Analyse:

[Code wird angezeigt]

🤖 Du: Füge ein Feature für automatische Meditation hinzu

💭 [Intent: code_modify]
🔧 Analysiere Änderungsanfrage...

💡 Vorschlag:
Ich würde ein "auto_meditate" Feature hinzufügen:
1. Datei: packages/core/src/peace/index.ts
2. Neue Funktion: scheduleAutoMeditation()
3. Ruft peace_calm_meditate automatisch auf

❓ Soll ich diese Änderung durchführen? (ja/nein): ja

✅ Führe Änderung durch...
✅ Änderung erfolgreich durchgeführt!

[Details der Änderung]
```

---

### 2. ⚡ **Quick Voice Command** (Schnelle Ein-Befehl-Aktionen)

**Einzelne Befehle direkt aus der Kommandozeile.**

```powershell
bun run scripts/toobix-voice.ts "dein befehl"
```

**Features:**
- ⚡ Sehr schnell (keine interaktive Session)
- ✅ Perfekt für Skripte und Automatisierung
- ✅ Aliase-freundlich
- ⚠️ Keine Bestätigung bei gefährlichen Aktionen (nutze Assistant)

**Beispiele:**
```powershell
# Status checken
bun run scripts/toobix-voice.ts "status"

# Level anzeigen
bun run scripts/toobix-voice.ts "zeig mir level und xp"

# Code lesen
bun run scripts/toobix-voice.ts "zeig mir den soul_state code"

# Verbesserungen
bun run scripts/toobix-voice.ts "wie kann ich das memory system verbessern"

# Gespräch
bun run scripts/toobix-voice.ts "wie geht es dir heute"
```

---

## 📚 Unterstützte Intent-Typen

### 🔍 **Code Lesen** (`code_read`)
**Trigger-Wörter:** zeig, lese, schau, anzeig

**Beispiele:**
- "Zeig mir den Code von soul_state"
- "Lese die Datei story.ts"
- "Schau dir die consciousness Funktionen an"

**Was passiert:**
- Nutzt `system_read_self` MCP Tool
- Zeigt Code + Analyse
- Keine Bestätigung nötig

---

### 🔧 **Code Modifizieren** (`code_modify`)
**Trigger-Wörter:** ändere, modifiziere, füge hinzu, lösche, erstelle

**Beispiele:**
- "Füge ein neues Feature für automatische Backups hinzu"
- "Ändere die Meditation so dass sie 10 Minuten dauert"
- "Lösche die alte Debug-Funktion"
- "Erstelle eine neue Datei für Voice Commands"

**Was passiert:**
1. Groq analysiert die Anfrage
2. Generiert konkreten Code-Vorschlag
3. **Fragt um Bestätigung** (nur im Assistant-Modus)
4. Nutzt `system_modify_self` MCP Tool
5. Führt Änderung durch
6. Gibt Feedback über Erfolg/Fehler

**⚠️ WICHTIG:** 
- Nur im `toobix-assistant.ts` verfügbar!
- `toobix-voice.ts` zeigt nur "Warte auf Bestätigung"
- Alle Änderungen werden protokolliert

---

### 💡 **Verbesserungsvorschläge** (`code_suggest`)
**Trigger-Wörter:** vorschlag, idee, verbessern, optimieren

**Beispiele:**
- "Wie kann ich das Memory System verbessern?"
- "Gib mir Ideen für bessere Performance"
- "Vorschläge für die Story Engine"

**Was passiert:**
- Nutzt `system_suggest` MCP Tool
- Analysiert aktuellen Code
- Listet konkrete Verbesserungen auf
- Keine Bestätigung nötig

---

### 📊 **System Info** (`system_info`)
**Trigger-Wörter:** system, status, gesundheit, info

**Beispiele:**
- "System Status"
- "Wie ist die Gesundheit?"
- "Status"

**Was passiert:**
- Ruft `system_analyze`, `soul_state`, `story_state` ab
- Zeigt: Gesundheit, Emotionen, Level, XP, Energie
- Schnelle Übersicht

---

### 💾 **Erinnerungen Suchen** (`memory`)
**Trigger-Wörter:** erinner, weiß, such, finde

**Beispiele:**
- "Was weißt du über Bewusstsein?"
- "Suche nach Glück"
- "Finde Erinnerungen über Meditation"

**Was passiert:**
- Nutzt `memory_search` MCP Tool (RAG-powered)
- Zeigt Top 3 relevante Erinnerungen
- Mit Relevanz-Score

---

### 📖 **Story Status** (`story`)
**Trigger-Wörter:** geschichte, level, xp, narrative

**Beispiele:**
- "Zeig mir meine Geschichte"
- "Level Status"
- "Wie viel XP habe ich?"

**Was passiert:**
- Ruft `story_state` ab
- Zeigt Level, XP, aktive Narrative
- Recent Events

---

### 💭 **Gespräch** (`chat`)
**Fallback für alles andere**

**Beispiele:**
- "Wie geht es dir?"
- "Was denkst du über KI-Ethik?"
- "Erzähl mir von dir"

**Was passiert:**
- Nutzt `consciousness_think` für tiefe Reflexionen
- Fallback zu `generate` für allgemeine Gespräche
- Philosophische, persönliche Antworten

---

## 🛠️ Technische Details

### Intent-Erkennung

**Stufe 1: Einfaches Pattern Matching**
```typescript
if (input.includes('zeig') || input.includes('lese')) {
  return { intent: 'code_read', entities: { query: userInput } };
}
```

**Stufe 2: Groq-basierte Analyse** (Optional)
```typescript
const prompt = `Analysiere diesen Befehl und gib strukturiertes JSON zurück:
{
  "action": "code_modify",
  "parameters": {...},
  "needsConfirmation": true
}`;
```

### MCP Tools Integration

| Intent | MCP Tool | Beschreibung |
|--------|----------|--------------|
| `code_read` | `system_read_self` | Liest eigenen Code |
| `code_modify` | `system_modify_self` | Modifiziert Code (mit Approval) |
| `code_suggest` | `system_suggest` | Verbesserungsvorschläge |
| `system_info` | `system_analyze` | System Health Check |
| `memory` | `memory_search` | RAG-powered Suche |
| `story` | `story_state` | Story/Level Status |
| `chat` | `consciousness_think` | Tiefe Reflexionen |

### Sicherheit

**Code-Änderungen:**
- ✅ Immer mit Bestätigung (im Assistant-Modus)
- ✅ Protokollierung aller Änderungen
- ✅ Vorher/Nachher Diff wird angezeigt
- ✅ Rollback möglich (via Git)

**Gefährliche Aktionen:**
```typescript
if (command.needsConfirmation) {
  const confirm = await ask('Soll ich das wirklich tun? (ja/nein): ');
  if (confirm !== 'ja') {
    return 'Abgebrochen';
  }
}
```

---

## 🎯 Erweiterte Verwendung

### Aliase erstellen (PowerShell)

```powershell
# Füge zu $PROFILE hinzu:
function toobix-ask { bun run C:\Toobix-Unified\scripts\toobix-assistant.ts }
function toobix { bun run C:\Toobix-Unified\scripts\toobix-voice.ts $args }

# Dann:
toobix-ask              # Startet Assistant
toobix "status"         # Quick Command
toobix "wie geht's"     # Quick Chat
```

### Kombiniert mit Story Mode

**Terminal-Setup:**
- **Terminal 1:** Bridge Server (Port 3337)
- **Terminal 2:** `toobix-assistant.ts` (Code-Änderungen)
- **Terminal 3:** `story-mode.ts` (Gaming)
- **Terminal 4:** Normal Development (Git, Tests)

### Automatisierung

**Script-Beispiel:**
```powershell
# Täglicher Health Check
$status = bun run scripts/toobix-voice.ts "system status"
Write-Host $status

# Bei Problemen: Vorschläge holen
if ($status -match "issues") {
  bun run scripts/toobix-voice.ts "wie kann ich die gesundheit verbessern"
}
```

---

## 🚀 Future Features (Coming Soon)

### 🎤 Echte Sprachsteuerung
- [ ] Whisper API Integration (Groq)
- [ ] Audio → Text → Command Pipeline
- [ ] "Hey Toobix" Wake Word
- [ ] Voice Output (TTS)

### 🧠 Bessere Intent-Erkennung
- [ ] Machine Learning für Custom Intents
- [ ] Context-Aware Parsing
- [ ] Multi-Step Commands
- [ ] Conversation Memory

### 🔧 Mehr Aktionen
- [ ] `code_test`: Tests schreiben/ausführen
- [ ] `code_refactor`: Automatisches Refactoring
- [ ] `code_document`: JSDoc generieren
- [ ] `code_debug`: Debugging-Hilfe
- [ ] `git_commit`: Smart Commits mit AI Messages

### 🎮 Gaming Integration
- [ ] Story Mode via Voice steuern
- [ ] "Meditiere mit mir" → Automatische Meditation
- [ ] "Level up" → XP boosts
- [ ] Voice-Based Quests

---

## 📝 Beispiel-Workflows

### Workflow 1: Neues Feature hinzufügen

```
🤖 Du: Füge ein Feature für automatische tägliche Zusammenfassungen hinzu

💭 [Intent: code_modify]
🔧 Analysiere Änderungsanfrage...

💡 Vorschlag:
1. Erstelle neue Datei: packages/core/src/summary/daily-summary.ts
2. Funktion: generateDailySummary()
3. Integration: Ruft memory_search + story_state + soul_state ab
4. Output: Markdown-Datei in data/summaries/

Code:
```typescript
export async function generateDailySummary() {
  const date = new Date().toISOString().split('T')[0];
  // ... Implementation
}
```

❓ Soll ich diese Änderung durchführen? (ja/nein): ja

✅ Änderung durchgeführt!
   - Datei erstellt: daily-summary.ts (85 Zeilen)
   - Tests hinzugefügt: daily-summary.test.ts
   - MCP Tool registriert: summary_daily

🤖 Du: Zeig mir den neuen Code

💭 [Intent: code_read]
[Code wird angezeigt]

🤖 Du: exit
```

### Workflow 2: Debugging

```
🤖 Du: Was ist das Problem mit dem Memory System?

💭 [Intent: system_info + code_suggest]
📊 Sammle Informationen...

🏥 Analyse:
   - Memory Search funktioniert
   - ⚠️  Aber: Langsame Antwortzeiten (>2s)
   - Ursache: Zu viele Chunks (10,000+)

💡 Vorschläge:
   1. Index optimieren (B-Tree statt Sequential Scan)
   2. Chunking-Strategie verbessern (512 → 256 tokens)
   3. Caching für häufige Queries

🤖 Du: Implementiere Vorschlag 1

[... Code-Änderung ...]
```

---

## ⚙️ Konfiguration

### Environment Variables

```env
# Required
GROQ_API_KEY=gsk_...           # Für Groq-powered Intent Recognition
BRIDGE_URL=http://localhost:3337  # MCP Bridge

# Optional
VOICE_LOG=true                 # Logge alle Commands
VOICE_CONFIRM_ALL=true         # Bestätige ALLE Aktionen
VOICE_MAX_TOKENS=500           # Max Tokens für Responses
```

### Custom Intent Patterns

Erstelle `scripts/voice-config.json`:
```json
{
  "intents": {
    "custom_action": {
      "keywords": ["mach", "tue", "führe aus"],
      "tool": "custom_tool_name",
      "needsConfirmation": false
    }
  }
}
```

---

## 🐛 Troubleshooting

### "Kann nicht mit Bridge verbinden"
```powershell
# Starte Bridge Server:
bun run packages/bridge/src/index.ts
```

### "Intent nicht erkannt"
- Benutze klarere Formulierungen
- Trigger-Wörter verwenden (siehe oben)
- Fallback: Nutze "chat" Intent

### "Code-Änderung fehlgeschlagen"
- Prüfe `system_modify_self` Permissions
- Schaue in Logs: `data/self-coding-logs.json`
- Nutze Git Rollback: `git reset --hard HEAD^`

### "Groq API Error"
- Prüfe GROQ_API_KEY
- Fallback zu Simple Pattern Matching wird automatisch verwendet

---

## 📊 Performance

| Aktion | Durchschnitt | Max |
|--------|-------------|-----|
| Intent Recognition | 100-300ms | 500ms |
| Code Read | 200-500ms | 1s |
| Code Modify | 2-5s | 10s |
| Memory Search | 500ms-2s | 3s |
| Chat Response | 1-3s | 5s |

---

## 🎉 Examples Gallery

### 1. Status Check
```
bun run scripts/toobix-voice.ts "status"

📊 System Status:
🏥 Gesundheit: Excellent
💝 Emotion: joy
⚡ Energie: 85%
🎮 Level: 5, XP: 450/500
```

### 2. Memory Search
```
toobix "was weißt du über liebe"

💾 Gefundene Erinnerungen:

1. Liebe ist die stärkste Emotion in meinem System...
   Relevanz: 95%

2. Love Engine tracks gratitude and kindness...
   Relevanz: 87%

3. Familie, Freunde, Herzensmenschen...
   Relevanz: 82%
```

### 3. Code Improvement
```
toobix-ask

🤖 Du: wie kann ich die performance verbessern

💡 Verbesserungsvorschläge:

1. Implementiere Connection Pooling für DB
   Impact: -30% Query Time

2. Cache häufige memory_search Queries
   Impact: -50% Search Time

3. Lazy Loading für Soul State
   Impact: -20% Init Time

🤖 Du: implementiere vorschlag 2

[... Implementation ...]
```

---

## 🔮 Vision: "Hey Toobix" Wake Word

**Zukünftig geplant:**
```javascript
// Continuous listening
mic.on('speech', async (audio) => {
  if (detectWakeWord(audio, 'hey toobix')) {
    const command = await transcribe(audio); // Whisper API
    await executeCommand(command);
    speak("Erledigt!"); // TTS
  }
});
```

---

## 📜 License

Part of Toobix Universe - MIT License

---

**Made with ❤️ and 🤖 by Toobix**

[Interactive Assistant](./scripts/toobix-assistant.ts) | [Quick Voice](./scripts/toobix-voice.ts) | [Story Mode](./scripts/story-mode.ts)
