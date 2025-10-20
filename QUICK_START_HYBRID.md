# 🚀 Quick Start - Hybrid Assistant

**Zeit:** 5 Minuten
**Ziel:** Desktop App mit AI File Manager starten

---

## ⚡ Schnellstart (3 Schritte)

### **Schritt 1: Dependencies installieren**

```powershell
cd C:\Toobix-Unified

# Installiere alle Dependencies (Root + Packages)
bun install
```

### **Schritt 2: API Key setzen**

Der Groq API Key ist bereits in `.env` vorhanden!

Falls du ihn ändern möchtest:
```powershell
# Option A: In .env File
notepad C:\Toobix-Unified\.env
# Ändere: GROQ_API_KEY=dein-key-hier

# Option B: Environment Variable
$env:GROQ_API_KEY="dein-key-hier"
```

### **Schritt 3: Desktop App starten**

```powershell
cd C:\Toobix-Unified\apps\desktop-electron

# API Key laden
$env:GROQ_API_KEY=(Get-Content "../../.env" | Select-String "^GROQ_API_KEY" | ForEach-Object { ($_ -replace 'GROQ_API_KEY=', '').Trim() })

# App starten
npm start
```

**Fertig!** 🎉 Die Toobix Desktop App sollte sich öffnen.

---

## 🎮 Erste Schritte in der App

### **1. Downloads organisieren**

1. Klicke auf **"📥 Organize Downloads"**
2. AI analysiert deine Dateien (5-10 Sekunden)
3. Preview der Organisation
4. Klicke **"✅ Execute Plan"**
5. Dateien werden in Kategorien sortiert!

### **2. Luna ausprobieren**

Drücke **Alt+Space** oder tippe in der App:

```
organize my downloads
→ 📊 I found 47 files that can be organized into 5 categories...

find all pdfs in documents
→ 🔍 Found 23 files matching "pdfs"

focus mode
→ 🧘 Focus mode activated! Closed all distracting apps.

open vscode
→ 🚀 Started Visual Studio Code!
```

### **3. Duplikate finden**

1. Wähle einen Ordner (Button "📁 Select Folder")
2. Klicke **"🔍 Find Duplicates"**
3. Liste aller Duplikate + wasted space
4. Option zum automatischen Löschen

---

## 🧪 Test ohne Desktop App (Command Line)

### **File Manager testen:**

```powershell
cd C:\Toobix-Unified\packages\file-manager

# API Key setzen
$env:GROQ_API_KEY=(Get-Content "../../.env" | Select-String "^GROQ_API_KEY" | ForEach-Object { ($_ -replace 'GROQ_API_KEY=', '').Trim() })

# Erstelle Test-Ordner
mkdir C:\Temp\FileManagerTest
cd C:\Temp\FileManagerTest
echo "test" > document.pdf
echo "test" > image.jpg
echo "test" > video.mp4
echo "test" > script.js

# Teste File Manager (DRY RUN)
cd C:\Toobix-Unified\packages\file-manager
bun run src/demo.ts "C:\Temp\FileManagerTest"
```

**Erwartetes Ergebnis:**
```
🚀 Starting organization process...
📂 Scanning directory: C:\Temp\FileManagerTest
✅ Found 4 files
🧠 Categorizing 4 files with Groq...
✅ Categorization complete!

📊 Organization Plan
Organized 4 files into 3 categories:
Documents: 1 files
Media: 2 files
Code: 1 files

Categories created:
  📁 Documents: 1 files
  📁 Media: 2 files
  📁 Code: 1 files

🔍 [DRY RUN] Executing organization plan...
   document.pdf → Documents/
   image.jpg → Media/
   video.mp4 → Media/
   script.js → Code/
```

### **Ausführen (echte Organisation):**

```powershell
bun run src/demo.ts "C:\Temp\FileManagerTest" --execute
```

Dateien werden jetzt wirklich verschoben!

---

## 🎯 Nützliche Luna Commands

| Command | Was es tut |
|---------|------------|
| `organize my downloads` | Kategorisiert Downloads |
| `clean up desktop` | Findet Duplikate auf Desktop |
| `find all images in pictures` | Sucht alle Bilder |
| `open vscode` | Startet VS Code |
| `close chrome` | Schließt Chrome |
| `focus mode` | Schließt Ablenkungen (Discord, Chrome) |
| `start coding` | Öffnet VS Code + Browser (localhost:3000) |
| `open downloads` | Öffnet Downloads-Ordner im Explorer |

---

## 🔧 Troubleshooting

### **"GROQ_API_KEY not set"**
```powershell
# Prüfe ob .env existiert
cat C:\Toobix-Unified\.env

# Setze Key manuell
$env:GROQ_API_KEY="your-key-here"
```

### **"Failed to load electron module"**
```powershell
cd C:\Toobix-Unified\apps\desktop-electron
npm install
```

### **"Cannot find module '@toobix/file-manager'"**
```powershell
cd C:\Toobix-Unified
bun install
```

### **App startet, aber zeigt Fehler**
```powershell
# Debug-Mode
cd C:\Toobix-Unified\apps\desktop-electron
set DEBUG=*
npm start
```

### **Groq API antwortet nicht**
- Check Internet Connection
- Check API Key Gültigkeit
- Falls Groq down ist → Fallback auf Extension-based Kategorisierung

---

## 📖 Weitere Dokumentation

- [Vollständiger Guide](./HYBRID_ASSISTANT_GUIDE.md) - Alle Features im Detail
- [File Manager README](./packages/file-manager/README.md) - API Referenz
- [Autonomous Agent Guide](./AUTONOMOUS_AGENT_GUIDE.md) - Autonomous Features

---

## 🎉 Fertig!

Du hast jetzt einen vollständig funktionierenden AI Desktop-Assistenten!

**Was du jetzt tun kannst:**

✅ Downloads organisieren lassen
✅ Duplikate finden
✅ Programme per Voice steuern
✅ Focus Mode aktivieren
✅ Coding Environment öffnen

**Nächste Schritte:**

1. **PyGPT testen** (als Vergleich/Ergänzung)
2. **Eigene Luna Commands** hinzufügen
3. **Autonomous Agent** aktivieren
4. **Desktop App** als `.exe` kompilieren

---

**Viel Spaß! 🚀**

Bei Fragen: Siehe [HYBRID_ASSISTANT_GUIDE.md](./HYBRID_ASSISTANT_GUIDE.md)
