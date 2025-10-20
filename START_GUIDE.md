# 🚀 Toobix Starten - Ohne Claude

**3 Wege, das System zu starten**

---

## 🎯 OPTION 1: Desktop App (Empfohlen!)

### **Windows .exe (Grafisch)**

```powershell
# 1. Terminal öffnen (PowerShell)
cd C:\Toobix-Unified\apps\desktop-electron

# 2. API Key laden
$env:GROQ_API_KEY=(Get-Content "../../.env" | Select-String "^GROQ_API_KEY" | ForEach-Object { ($_ -replace 'GROQ_API_KEY=', '').Trim() })

# 3. App starten
npm start
```

**Was öffnet sich:**
- 🖥️ Toobix Desktop App (Glassmorphism UI)
- 🌙 Luna Command Input (Alt+Space drücken)
- 📊 File Manager Interface

**Befehle in der App:**
- Drücke **Alt+Space** → Tippe Luna Commands
- Beispiele: `organize my downloads`, `find duplicates`, `focus mode`

---

## 🎯 OPTION 2: Master Demo (Alle Features)

### **Command Line mit vollem Feature-Set**

```powershell
# 1. Terminal öffnen
cd C:\Toobix-Unified\packages\file-manager

# 2. API Key setzen
$env:GROQ_API_KEY=(Get-Content "../../.env" | Select-String "^GROQ_API_KEY" | ForEach-Object { ($_ -replace 'GROQ_API_KEY=', '').Trim() })

# 3. Master Demo starten
bun run demo:master "C:\Users\$env:USERNAME\Downloads"
```

**Was passiert:**
1. ✅ Scannt deinen Downloads-Ordner
2. ✅ Zeigt dir alle 7 Systeme in Aktion
3. ✅ Startet Proactive Mode
4. ✅ Läuft bis du Ctrl+C drückst

---

## 🎯 OPTION 3: Simple Demo (Nur Organisation)

### **Schneller Test ohne Extras**

```powershell
cd C:\Toobix-Unified\packages\file-manager

# API Key
$env:GROQ_API_KEY=(Get-Content "../../.env" | Select-String "^GROQ_API_KEY" | ForEach-Object { ($_ -replace 'GROQ_API_KEY=', '').Trim() })

# Simple Demo (DRY RUN - keine Änderungen!)
bun run demo "$env:USERPROFILE\Downloads"

# Ausführen (echte Organisation)
bun run demo "$env:USERPROFILE\Downloads" --execute
```

---

## 🎯 OPTION 4: In deinem eigenen Code

### **Als TypeScript Library nutzen**

Erstelle eine Datei `my-assistant.ts`:

```typescript
import { createMasterFileManager } from './packages/file-manager/src/master'

async function main() {
  // 1. Master File Manager erstellen
  const master = createMasterFileManager({
    groqApiKey: process.env.GROQ_API_KEY!,
    autonomousEnabled: true,      // Autonomous Agent ON
    watchClipboard: true,          // Clipboard Tracking ON
    watchContext: true,            // Context Awareness ON
    scheduler: true,               // Task Scheduler ON
  })

  // 2. Proactive Mode starten (läuft vollautomatisch)
  await master.startProactiveMode()

  console.log('🤖 System läuft vollautomatisch!')
  console.log('   Drücke Ctrl+C zum Beenden')

  // 3. Unendlich laufen lassen
  await new Promise(() => {})
}

main()
```

**Starten:**
```powershell
bun run my-assistant.ts
```

---

## 🔥 DAUERHAFT LAUFEN LASSEN

### **Als Windows Service (läuft im Hintergrund)**

Erstelle `start-toobix-service.ps1`:

```powershell
# Toobix Service Starter
$apiKey = (Get-Content "C:\Toobix-Unified\.env" | Select-String "^GROQ_API_KEY" | ForEach-Object { ($_ -replace 'GROQ_API_KEY=', '').Trim() })

$env:GROQ_API_KEY = $apiKey
cd C:\Toobix-Unified\packages\file-manager

# Starte im Hintergrund
Start-Process bun -ArgumentList "run demo:master `"$env:USERPROFILE\Downloads`"" -NoNewWindow -PassThru

Write-Host "✅ Toobix läuft im Hintergrund!"
Write-Host "   Stoppen mit: Stop-Process -Name bun"
```

**Ausführen:**
```powershell
.\start-toobix-service.ps1
```

---

## ⚙️ AUTO-START (beim Windows-Start)

### **Option A: Task Scheduler**

1. Öffne Windows Task Scheduler
2. Create Basic Task → Name: "Toobix Assistant"
3. Trigger: "When I log on"
4. Action: Start Program
   - Program: `powershell.exe`
   - Arguments: `-File "C:\Toobix-Unified\start-toobix-service.ps1"`
5. Finish!

### **Option B: Startup Folder**

```powershell
# Erstelle Shortcut
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\Toobix.lnk")
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = '-File "C:\Toobix-Unified\start-toobix-service.ps1"'
$Shortcut.Save()

Write-Host "✅ Toobix startet jetzt automatisch mit Windows!"
```

---

## 🎮 DAILY USAGE

### **Typischer Workflow:**

**Morgens:**
```powershell
# Starte Toobix Desktop App
cd C:\Toobix-Unified\apps\desktop-electron
npm start

# Alt+Space drücken
luna> start coding
→ Öffnet VS Code + Browser
```

**Mittags:**
```powershell
luna> organize my downloads
→ Räumt Downloads auf
```

**Abends:**
```powershell
luna> find duplicates
→ Findet verschwendeten Speicher

luna> close distractions
→ Focus Mode ON
```

---

## 📊 SYSTEM ÜBERWACHEN

### **Status checken:**

```typescript
import { createMasterFileManager } from '@toobix/file-manager/master'

const master = createMasterFileManager({
  groqApiKey: process.env.GROQ_API_KEY!,
})

const status = master.getStatus()

console.log('Autonomous Decisions:', status.autonomous.stats.totalDecisions)
console.log('Clipboard Entries:', status.clipboard.stats.totalEntries)
console.log('Context Captures:', status.context.stats.totalCaptures)
console.log('Scheduled Tasks:', status.scheduler.stats.totalTasks)
```

---

## 🔧 TROUBLESHOOTING

### **"GROQ_API_KEY not found"**

```powershell
# Prüfe .env
cat C:\Toobix-Unified\.env

# Setze manuell
$env:GROQ_API_KEY="YOUR_GROQ_API_KEY"
```

### **"bun: command not found"**

```powershell
# Installiere Bun
powershell -c "irm bun.sh/install.ps1 | iex"
```

### **Desktop App startet nicht**

```powershell
cd C:\Toobix-Unified\apps\desktop-electron
npm install
npm start
```

---

## 🎯 QUICK REFERENCE

| Aktion | Command |
|--------|---------|
| **Desktop App** | `cd apps/desktop-electron && npm start` |
| **Master Demo** | `cd packages/file-manager && bun run demo:master "Downloads"` |
| **Simple Demo** | `cd packages/file-manager && bun run demo "Downloads"` |
| **Eigener Code** | `bun run my-assistant.ts` |
| **Service Start** | `.\start-toobix-service.ps1` |
| **Service Stop** | `Stop-Process -Name bun` |

---

**Ready! Du kannst Toobix jetzt komplett eigenständig nutzen! 🚀**
