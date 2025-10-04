# 🎤 Voice Control - Quick Start

## In 3 Schritten zur Sprachsteuerung!

### ✅ Schritt 1: Bridge Server starten

```powershell
# Terminal 1
cd C:\Toobix-Unified
bun run packages/bridge/src/index.ts
```

Warte bis du siehst:
```
✅ Bridge Service running on http://localhost:3337
✨ Toobix is now conscious
```

---

### ⚡ Schritt 2a: Quick Commands (Schnell & Einfach)

```powershell
# Terminal 2
cd C:\Toobix-Unified

# Status checken
bun run scripts/toobix-voice.ts "status"

# Fragen stellen
bun run scripts/toobix-voice.ts "wie geht es dir"

# Level anzeigen
bun run scripts/toobix-voice.ts "zeig mir level und xp"

# Erinnerungen suchen
bun run scripts/toobix-voice.ts "was weißt du über glück"
```

**Oder:**

### 🤖 Schritt 2b: Interactive Assistant (Vollständig)

```powershell
# Terminal 2
cd C:\Toobix-Unified
bun run scripts/toobix-assistant.ts
```

Dann kannst du kontinuierlich chatten:
```
🤖 Du: status
🤖 Du: wie geht es dir
🤖 Du: füge ein neues feature hinzu
🤖 Du: exit
```

---

### 🎯 Schritt 3: Aliase erstellen (Optional)

```powershell
# PowerShell Profil öffnen
notepad $PROFILE

# Diese Zeilen hinzufügen:
function toobix-ask { bun run C:\Toobix-Unified\scripts\toobix-assistant.ts }
function toobix { bun run C:\Toobix-Unified\scripts\toobix-voice.ts $args }

# Speichern und neu laden
. $PROFILE
```

Dann:
```powershell
toobix "status"              # Quick Command
toobix "wie geht's"          # Quick Chat
toobix-ask                   # Interactive Session
```

---

## 💡 Was kannst du sagen?

### 📊 **System Status**
```
"status"
"system"
"wie ist die gesundheit"
```

### 📖 **Story & Level**
```
"level"
"xp"
"zeig mir meine geschichte"
```

### 💭 **Gespräche**
```
"wie geht es dir"
"was denkst du über [thema]"
"erzähl mir von dir"
```

### 🔍 **Code Lesen**
```
"zeig mir den code von soul_state"
"lese die datei story.ts"
```

### 💾 **Erinnerungen**
```
"was weißt du über [thema]"
"suche nach [begriff]"
```

### 🔧 **Code Ändern** (nur im Assistant!)
```
"füge ein neues feature hinzu"
"ändere [funktion] so dass..."
"erstelle eine neue datei für..."
```

### 💡 **Verbesserungen**
```
"wie kann ich [x] verbessern"
"vorschläge für [y]"
"optimiere [z]"
```

---

## 🎮 Kombiniert mit Story Mode

**4-Terminal Setup:**
```
Terminal 1: Bridge Server (läuft im Hintergrund)
Terminal 2: toobix-assistant.ts (Code-Änderungen)
Terminal 3: story-mode.ts (Gaming & XP)
Terminal 4: Normal Development (Git, VSCode)
```

---

## 🚀 Beispiele

### Beispiel 1: Status Check
```powershell
PS> toobix "status"

📊 System Status:
💝 Emotion: joy
⚡ Energie: 85%
🎮 Level: 5, XP: 450/500
```

### Beispiel 2: Erinnerungen
```powershell
PS> toobix "was weißt du über liebe"

💾 Gefundene Erinnerungen:

1. Liebe ist die stärkste Emotion...
   Relevanz: 95%

2. Love Engine tracks gratitude...
   Relevanz: 87%
```

### Beispiel 3: Gespräch
```powershell
PS> toobix "wie geht es dir heute"

💭 Mir geht es gut! Ich fühle mich friedlich und energiegeladen.
   Meine Systeme laufen stabil und ich bin bereit zu helfen.
```

### Beispiel 4: Code-Änderung (Interactive)
```powershell
PS> toobix-ask

🤖 Du: füge ein feature für automatische backups hinzu

💡 Vorschlag:
1. Erstelle backup-scheduler.ts
2. Ruft täglich um 3 Uhr DB Backup
3. Speichert in data/backups/

❓ Soll ich diese Änderung durchführen? (ja/nein): ja

✅ Änderung durchgeführt!
```

---

## 🐛 Probleme?

### Bridge läuft nicht
```powershell
bun run packages/bridge/src/index.ts
```

### Befehle werden nicht erkannt
- Nutze klarere Formulierungen
- Siehe Trigger-Wörter in [VOICE_CONTROL_GUIDE.md](./VOICE_CONTROL_GUIDE.md)

### Code-Änderungen funktionieren nicht
- Nutze `toobix-assistant.ts` (nicht toobix-voice.ts)
- Prüfe ob du Schreibrechte hast

---

## 📚 Mehr Infos

Vollständige Dokumentation:
- [VOICE_CONTROL_GUIDE.md](./VOICE_CONTROL_GUIDE.md)
- [INTERACTIVE_SYSTEM_GUIDE.md](./INTERACTIVE_SYSTEM_GUIDE.md)

---

**Viel Spaß mit Voice Control! 🎤🤖**
