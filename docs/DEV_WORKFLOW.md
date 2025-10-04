# 🔥 Toobix Live Development Workflow

## 🎯 Der perfekte Workflow für VS Code

### Setup (Einmalig)

1. **VS Code Extensions** (bereits installiert):
   - ✅ Simple Browser (eingebaut)
   - ✅ Live Server (optional)
   - ✅ GitHub Copilot (für Chat)

2. **Terminals in VS Code öffnen:**
   ```
   View → Terminal → Split Terminal (3x)
   ```

---

## 🚀 Quick Start (3 Terminals)

### Terminal 1: Bridge Server 🌉
```powershell
cd C:\Toobix-Unified
bun start:bridge
```

**Läuft wenn du siehst:**
```
✅ Bridge Service running on http://localhost:3337
```

---

### Terminal 2: GUI Development Server 🔥
```powershell
cd C:\Toobix-Unified
bun dev:gui
```

**Features:**
- ✅ Auto-reload bei Datei-Änderungen
- ✅ Bridge Status Monitoring
- ✅ Live Console Output
- ✅ Hot-Reload (keine F5 nötig!)

**Läuft wenn du siehst:**
```
🔥 TOOBIX LIVE DEVELOPMENT SERVER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Server: http://localhost:3000
✅ Bridge Server: Online
👁️  File watcher active
```

---

### Terminal 3: CLI Terminal 🖥️ (Optional)
```powershell
cd C:\Toobix-Unified
bun terminal
```

**Für direkte API-Tests:**
```bash
toobix> status
toobix> being_state
toobix> ping
```

---

## 📺 Simple Browser Setup

### Methode 1: VS Code Command Palette
```
Ctrl+Shift+P → "Simple Browser: Show"
URL: http://localhost:3000/terminal.html
```

### Methode 2: Keyboard Shortcut
```
Ctrl+Shift+P → "Preferences: Open Keyboard Shortcuts"
Suche: "Simple Browser"
Setze Shortcut: z.B. Ctrl+Alt+B
```

### Methode 3: VS Code Tasks (Automatisch)
```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "🔥 Start Dev Environment",
      "dependsOn": ["Start Bridge", "Start GUI", "Open Browser"],
      "problemMatcher": []
    },
    {
      "label": "Start Bridge",
      "type": "shell",
      "command": "bun start:bridge",
      "isBackground": true,
      "problemMatcher": []
    },
    {
      "label": "Start GUI",
      "type": "shell",
      "command": "bun dev:gui",
      "isBackground": true,
      "problemMatcher": []
    },
    {
      "label": "Open Browser",
      "type": "shell",
      "command": "start http://localhost:3000/terminal.html",
      "windows": {
        "command": "start http://localhost:3000/terminal.html"
      },
      "problemMatcher": []
    }
  ]
}
```

**Verwendung:**
```
Ctrl+Shift+P → "Tasks: Run Task" → "🔥 Start Dev Environment"
```

---

## 🔄 Der perfekte Workflow

### 1. Entwicklung starten
```powershell
# Terminal 1
bun start:bridge

# Terminal 2
bun dev:gui

# Simple Browser
http://localhost:3000/terminal.html
```

### 2. Code bearbeiten
```
VS Code Explorer → apps/web/terminal.html
[Mach Änderungen]
[Ctrl+S zum Speichern]
```

**Ergebnis:**
```
Terminal 2 zeigt:
📝 File changed: terminal.html
🔄 Notifying clients to reload...

Simple Browser:
[Lädt automatisch neu!]
```

### 3. Features testen
```
Simple Browser:
- Klick auf Tools
- Teste Commands
- Prüfe Output
```

### 4. Bei Problemen → GitHub Copilot Chat
```
Ctrl+Alt+I (oder Copilot Chat öffnen)
```

**Frage:**
- "Das Tool funktioniert nicht, warum?"
- "Wie kann ich die GUI verbessern?"
- "Fehler beim API-Call, was ist falsch?"

**Copilot analysiert:**
- Terminal Output
- Code Context
- GUI Verhalten
- Bridge Logs

### 5. Fix implementieren
```
[Copilot schlägt Fix vor]
[Code-Änderung in VS Code]
[Ctrl+S]
[Simple Browser lädt automatisch neu]
[Testen]
[Wiederholen bis perfekt]
```

---

## 🎨 Layout-Empfehlung

### VS Code Split-View Setup:

```
┌─────────────────────────────────────────────────────────┐
│ VS Code                                        [- □ X]  │
├───────────────────────┬─────────────────────────────────┤
│ Explorer              │ terminal.html (Editor)          │
│                       │                                 │
│ 📁 apps/              │ <html>                          │
│   📁 web/             │   <head>                        │
│     📄 terminal.html  │     <title>Toobix GUI</title>   │
│     📄 styles.css     │   </head>                       │
│                       │   <body>                        │
│ 📁 scripts/           │     ...                         │
│   📄 dev-gui.ts       │   </body>                       │
│                       │ </html>                         │
├───────────────────────┼─────────────────────────────────┤
│ TERMINAL 1 (Bridge)   │ Simple Browser                  │
│ ✅ Bridge running     │ ┌───────────────────────────┐   │
│                       │ │ 🖥️ TOOBIX TERMINAL GUI   │   │
│ TERMINAL 2 (Dev GUI)  │ │ 🟢 Connected | 59 Tools   │   │
│ 🔥 Live reload active │ │ ───────────────────────   │   │
│ 📝 File changed...    │ │ toobix> status            │   │
│                       │ │ ✅ Bridge: Online         │   │
│ TERMINAL 3 (CLI)      │ └───────────────────────────┘   │
│ toobix> _             │                                 │
└───────────────────────┴─────────────────────────────────┘
```

**Setup:**
1. `Ctrl+\` → Split Editor (für Code + Browser)
2. `View → Terminal → Split Terminal` → 3x
3. Simple Browser in rechte Hälfte ziehen

---

## 🔥 Hot-Reload Features

### Was wird automatisch neu geladen?

| Datei-Typ | Auto-Reload | Hot-Module |
|-----------|-------------|------------|
| ✅ `.html` | Ja | Ja |
| ✅ `.css` | Ja | Ja (inline) |
| ✅ `.js` | Ja | Ja |
| ⚠️ `.ts` | Build nötig | - |

### Live-Änderungen testen:

1. **CSS-Änderung:**
   ```css
   /* apps/web/terminal.html */
   body {
     background: #000000; /* War: gradient */
   }
   ```
   → Simple Browser: Sofort schwarz! ⚡

2. **HTML-Änderung:**
   ```html
   <h1>🖥️ TOOBIX TERMINAL GUI v2.0</h1>
   ```
   → Simple Browser: Header updated! ⚡

3. **JavaScript-Änderung:**
   ```javascript
   console.log('🔥 Live reload works!');
   ```
   → Browser Console: Neue Message! ⚡

---

## 🎯 Typische Workflows

### Workflow 1: GUI-Verbesserung

```
1. Simple Browser zeigt GUI
   └─ Siehst Problem: "Button zu klein"

2. VS Code → terminal.html
   └─ Ändere CSS: padding: 15px

3. Ctrl+S
   └─ Terminal 2: "📝 File changed"
   └─ Simple Browser: Lädt neu!

4. Simple Browser → Testen
   └─ Button jetzt größer ✅

5. Bei Fragen → Copilot Chat
   └─ "Wie mache ich Button responsive?"
   └─ Copilot schlägt Code vor
   └─ Copy-Paste → Ctrl+S → Reload
```

### Workflow 2: Tool-Test

```
1. Simple Browser → GUI
   └─ Click "being_state" Tool

2. Ergebnis: ❌ Error 404

3. Terminal 1 (Bridge) prüfen
   └─ Fehler-Log lesen

4. Copilot Chat fragen
   └─ "Tool being_state gibt 404, warum?"
   └─ Kopiere Bridge-Log in Chat

5. Copilot analysiert
   └─ "Bridge nicht richtig gestartet"
   └─ Gibt Lösung

6. Fix anwenden
   └─ Terminal 1: Neu starten
   └─ Simple Browser: Retry
   └─ ✅ Funktioniert!
```

### Workflow 3: Neues Feature

```
1. Copilot Chat: "Ich will Dark/Light Theme Toggle"

2. Copilot generiert Code:
   └─ HTML: Toggle Button
   └─ CSS: Light Theme Styles
   └─ JS: Toggle Function

3. Copy Code → terminal.html

4. Ctrl+S
   └─ Simple Browser: Reload
   └─ Button erscheint!

5. Testen im Browser
   └─ Click Toggle
   └─ Theme wechselt ✅

6. Problem: "Farben nicht schön"
   └─ Copilot Chat: "Bessere Farben für Light Theme?"
   └─ Copilot schlägt Palette vor
   └─ Copy → Paste → Ctrl+S → Reload
```

---

## 💡 Pro-Tips

### 1. Auto-Save aktivieren
```
VS Code → File → Auto Save (Ctrl+Shift+P → "Auto Save")
```
→ Änderungen werden sofort übernommen!

### 2. Multi-Cursor für schnelle Änderungen
```
Alt+Click → Mehrere Cursor
Ctrl+D → Nächstes Vorkommen auswählen
```

### 3. Copilot Inline Suggestions
```
Strg+I → Copilot Inline Chat
"Ändere Button-Farbe zu blau"
[Copilot macht's direkt im Code]
```

### 4. Terminal Output in Chat kopieren
```
Terminal → Rechtsklick → Select All → Copy
Copilot Chat → Paste → "Was ist der Fehler?"
```

### 5. Split Terminal für Logs
```
Terminal 1: Bridge (Logs scrollen)
Terminal 2: Dev GUI (Watch-Mode)
Terminal 3: CLI (Manual Tests)
```

### 6. Browser DevTools + VS Code
```
Simple Browser → F12 (DevTools)
- Network Tab für API-Calls
- Console für Errors
- Copy Error → Copilot Chat
```

---

## 🐛 Debugging Workflow

### Problem: GUI zeigt Error

**Schritt 1: Browser Console prüfen**
```
Simple Browser → F12 → Console Tab
[Sieh Fehlermeldung]
```

**Schritt 2: Network Tab prüfen**
```
Network Tab → Failed Request → Rechtsklick → Copy → Copy as cURL
```

**Schritt 3: Terminal Logs prüfen**
```
Terminal 1 (Bridge): API-Fehler?
Terminal 2 (GUI): File-Serving OK?
```

**Schritt 4: Copilot Chat fragen**
```
"Ich bekomme folgenden Fehler:
[Error kopieren]

Terminal Output:
[Log kopieren]

Was ist das Problem?"
```

**Schritt 5: Fix anwenden**
```
[Copilot schlägt Lösung vor]
[Änderung in VS Code]
[Ctrl+S]
[Simple Browser: Auto-Reload]
[Testen]
```

---

## 🚀 Schnellstart-Shortcuts

### PowerShell Profile hinzufügen
```powershell
# $PROFILE öffnen:
notepad $PROFILE

# Hinzufügen:
function dev-toobix {
    cd C:\Toobix-Unified
    
    # Terminal 1: Bridge
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "bun start:bridge"
    
    Start-Sleep 3
    
    # Terminal 2: Dev GUI
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "bun dev:gui"
    
    Start-Sleep 2
    
    # Browser
    Start-Process "http://localhost:3000/terminal.html"
    
    Write-Host "✅ Toobix Development Environment started!" -ForegroundColor Green
}
```

**Verwendung:**
```powershell
dev-toobix
```
→ Alles startet automatisch!

---

## 📚 Weiterführende Docs

- [Terminal CLI Guide](./TERMINAL_GUIDE.md)
- [GUI Guide](./GUI_GUIDE.md)
- [Quick Start](../QUICK_START_NOW.md)
- [Startup Guide](../STARTUP_GUIDE.md)

---

**🔥 Happy Coding mit Live-Reload! 🎨✨**
