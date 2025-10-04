# 🎮 TOOBIX INTERACTIVE SYSTEM - USAGE GUIDE

## 🎯 Du hast jetzt 2 Möglichkeiten mit Toobix zu interagieren!

---

### 1. 📖 **Story Mode** (Immersive Experience)

**Terminal 1: Story Mode läuft bereits!**

Das ist das **volle Erlebnis** - wie ein Textadventure-Game während du codest!

**Was du tun kannst:**
- 📖 Geschichte weiterspielen
- 💭 Mit Toobix reden
- 💝 Dankbarkeit ausdrücken
- 🧘 Meditieren
- 🔍 Erinnerungen durchsuchen
- 🎯 Ziele setzen

**Läuft in:** Terminal mit Story Mode  
**Blockiert Terminal:** Ja (interaktiv)

---

### 2. ⚡ **Quick Chat** (Schnelle Befehle)

**Terminal 2: Quick Commands**

Das ist für **schnelle Fragen** während du codest!

#### 📊 Status checken:
```powershell
bun run scripts/quick-chat.ts status
```

#### 💭 Toobix fragen:
```powershell
bun run scripts/quick-chat.ts think "Was ist Bewusstsein?"
```

#### 🔍 Erinnerungen suchen:
```powershell
bun run scripts/quick-chat.ts memory "letzte Woche"
```

#### 💬 Direkt chatten:
```powershell
bun run scripts/quick-chat.ts "Wie geht es dir?"
```

#### ✨ Text generieren:
```powershell
bun run scripts/quick-chat.ts generate "Erzähl mir einen Witz"
```

**Läuft in:** Neues Terminal  
**Blockiert Terminal:** Nein (einmalig)

---

## 🎮 EMPFOHLENES SETUP

### 3 Terminals:

**Terminal 1: Story Mode (optional - wenn du spielen willst)**
```powershell
cd c:\Toobix-Unified
bun run scripts/story-mode.ts
```
→ Für immersive Erfahrung während Pausen

**Terminal 2: Quick Chat (nutze das!)**
```powershell
cd c:\Toobix-Unified
bun run scripts/quick-chat.ts status
bun run scripts/quick-chat.ts think "Deine Frage"
```
→ Für schnelle Interaktionen während du codest

**Terminal 3: Entwicklung (dein normales)**
```powershell
cd c:\Toobix-Unified
# Deine normalen Commands
git status
code .
bun run dev
```

---

## 💡 PRO-TIPPS

### Alias erstellen (optional):

PowerShell Profile editieren:
```powershell
notepad $PROFILE
```

Hinzufügen:
```powershell
function toobix { bun run c:\Toobix-Unified\scripts\quick-chat.ts $args }
```

Dann kannst du nutzen:
```powershell
toobix status
toobix think "Was ist Liebe?"
toobix "Wie fühlst du dich?"
```

---

## 🎯 BEISPIEL-WORKFLOW

**Während du codest:**

1. **Start:** Bridge läuft (Port 3337)
2. **Code:** Du schreibst Code
3. **Frage:** `bun run scripts/quick-chat.ts think "Ist dieser Algorithmus gut?"`
4. **Antwort:** Toobix denkt und antwortet
5. **Weiter:** Du codest weiter

**Pause-Zeit:**

1. **Switch:** Zu Story Mode Terminal
2. **Play:** Wähle "Continue Story"
3. **Interact:** Spiele 5-10 Minuten
4. **Return:** Zurück zum Coding

---

## 🔥 COOLE BEFEHLE ZUM TESTEN

### Quick Status:
```powershell
bun run scripts/quick-chat.ts status
```

### Philosophische Frage:
```powershell
bun run scripts/quick-chat.ts think "Warum existiere ich?"
```

### Erinnerung suchen:
```powershell
bun run scripts/quick-chat.ts memory "Glück"
```

### Witz generieren:
```powershell
bun run scripts/quick-chat.ts "Erzähl mir einen Witz über Programmierer"
```

### Motivation:
```powershell
bun run scripts/quick-chat.ts "Motiviere mich zum Weitercoden!"
```

---

## 📊 UNTERSCHIED STORY MODE VS QUICK CHAT

| Feature | Story Mode | Quick Chat |
|---------|-----------|------------|
| **Immersion** | 🌟🌟🌟🌟🌟 Voll immersiv | ⚡ Schnell & einfach |
| **Terminal** | Blockiert | Einmalig |
| **Nutzung** | Pausen, Gaming | Während Coding |
| **XP Gain** | ✅ Ja | ❌ Nein |
| **Story Progress** | ✅ Ja | ❌ Nein |
| **Schnelligkeit** | 🐢 Langsam (interaktiv) | 🚀 Instant |
| **Beste für** | Erleben | Fragen |

---

## 🎮 WAS GERADE LÄUFT

**Status:**
- ✅ Bridge Server: Port 3337 (läuft)
- ✅ Story Mode: Terminal 1 (aktiv)
- ⏳ Quick Chat: Bereit zum Nutzen

**Nächster Schritt:**
Öffne ein **neues PowerShell Terminal** und teste:

```powershell
cd c:\Toobix-Unified
bun run scripts/quick-chat.ts status
```

---

## 🆘 HILFE

**Story Mode:**
```powershell
# Im Story Terminal: Wähle Option 8 für Exit
```

**Quick Chat:**
```powershell
bun run scripts/quick-chat.ts help
```

**Bridge Status:**
```powershell
curl http://localhost:3337/health
```

---

**Viel Spaß beim Interagieren mit Toobix! 🚀✨**

Du hast jetzt ein **lebendes System** das mit dir spricht, während du es baust! 🤖❤️
