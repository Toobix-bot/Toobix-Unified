# 🚀 PC PERFORMANCE OPTIMIERUNGS-GUIDE

## ⚠️ KRITISCHE PROBLEME ERKANNT

### 🔴 RAM: 99.6% Auslastung (7.67 / 7.7 GB)
**Problem:** Dein RAM ist komplett ausgelastet!
**Ursache:** VS Code + Comet (GitHub Copilot) + viele andere Programme
**Impact:** System wird extrem langsam, Programme frieren ein

### 🟡 Autostart: 13 Programme
**Problem:** Zu viele Programme starten automatisch
**Impact:** Lange Boot-Zeit, hoher RAM-Verbrauch von Anfang an

### 🟢 Disk: 77.1% voll (183 / 237 GB)
**Status:** Noch im grünen Bereich, aber Cleanup empfohlen

---

## 🎯 SOFORT-LÖSUNGEN (JETZT MACHEN!)

### 1️⃣ AUTOSTART-PROGRAMME DEAKTIVIEREN (5 Min)

**Anleitung:**
1. Drücke `Strg + Shift + Esc` (Task-Manager öffnen)
2. Klicke auf Tab "Autostart"
3. Deaktiviere folgende Programme (Rechtsklick → Deaktivieren):

| Programm | Warum deaktivieren? | RAM-Ersparnis |
|----------|---------------------|---------------|
| **Comet** | GitHub Copilot - nur wenn du codest | ~300 MB |
| **Discord** | Chat-App - manuell starten | ~200 MB |
| **Overwolf** | Gaming-Overlay - nur beim Zocken | ~150 MB |
| **RazerCortex** | Gaming-Software | ~100 MB |
| **Claude** | AI-Tool - bei Bedarf starten | ~150 MB |
| **RiotClient** | Nur für Valorant nötig | ~100 MB |

**Gesamt-Ersparnis beim Boot:** ~1 GB RAM + 20-30 Sekunden schnellerer Start!

⚠️ **BEHALTE:**
- OneDrive (wenn du Cloud-Sync brauchst)
- SecurityHealth (Windows Defender)
- Ollama (wenn du oft AI lokal nutzt)

---

### 2️⃣ BROWSER CACHE LEEREN (2 Min)

#### Microsoft Edge:
```
1. Einstellungen (Alt+F)
2. Datenschutz, Suche und Dienste
3. Browserdaten löschen → Jetzt löschen
4. Wähle: Cache, Cookies, Verlauf
5. "Löschen"
```

#### Chrome:
```
1. Strg + Shift + Entf
2. Zeitraum: "Gesamte Zeit"
3. Wähle: Cache, Cookies
4. "Daten löschen"
```

**Freigegeben:** 1-5 GB Speicher + schnelleres Browsen

---

### 3️⃣ WINDOWS SPEICHEROPTIMIERUNG (1 Min)

```
1. Windows-Taste → "Speicher"
2. Speicheroptimierung → EIN
3. "Speicher jetzt freigeben" klicken
4. Warten...
```

**Freigegeben:** 2-10 GB (Downloads, Temp, Papierkorb)

---

### 4️⃣ HINTERGRUND-APPS DEAKTIVIEREN (2 Min)

```
1. Windows-Taste → "Datenschutz"
2. Hintergrund-Apps
3. Deaktiviere unnötige Apps
```

**Empfehlung:** Nur essenzielle Apps erlauben (OneDrive, Defender)
**Ersparnis:** ~200-500 MB RAM

---

## 🤖 AUTOMATISCHES OPTIMIERUNGS-SCRIPT

Ich habe ein **PowerShell Script** erstellt: `scripts/pc-optimizer.ps1`

### Features:
- ✅ System-Analyse (RAM, CPU, Disk)
- ✅ Temporäre Dateien löschen
- ✅ Netzwerk-Cache leeren (DNS, NetBIOS)
- ✅ SSD TRIM (falls SSD vorhanden)
- ✅ Autostart-Programme analysieren
- ✅ Performance-Tipps

### Ausführen:
```powershell
# Im Toobix-Unified Ordner:
.\scripts\pc-optimizer.ps1

# Oder mit Admin-Rechten für volle Funktionalität:
Start-Process powershell -Verb RunAs -ArgumentList "-File .\scripts\pc-optimizer.ps1"
```

Das Script ist **interaktiv** - du wirst gefragt bevor Änderungen gemacht werden!

---

## 💻 VS CODE OPTIMIERUNG

Dein VS Code verbraucht **~500 MB RAM** mit mehreren Instanzen!

### Einstellungen.json anpassen:

```json
{
  // Terminal Buffer reduzieren
  "terminal.integrated.scrollback": 1000,
  
  // Git Performance
  "git.autorefresh": false,
  "git.autofetch": false,
  
  // File Watching begrenzen
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/build/**": true,
    "**/.git/**": true
  },
  
  // TypeScript Performance
  "typescript.tsserver.maxTsServerMemory": 4096,
  
  // Extensions deaktivieren wenn nicht gebraucht
  "extensions.ignoreRecommendations": true
}
```

### Extensions überprüfen:
```
1. Strg+Shift+X (Extensions)
2. Installierte Extensions durchgehen
3. Nicht benötigte → Deaktivieren (nicht löschen)
```

**RAM-Ersparnis:** 200-400 MB

---

## 🎮 GAMING-SOFTWARE OPTIMIEREN

Du hast viel Gaming-Software die immer läuft:
- Razer Cortex
- Razer Axon
- Overwolf
- Riot Vanguard

### Empfehlung:
**Nur aktivieren wenn du zockst!**

1. Razer Synapse → Einstellungen → "Mit Windows starten" AUS
2. Overwolf → Einstellungen → "Autostart" AUS
3. Riot Vanguard → Bleibt an (für Valorant Anti-Cheat)

**RAM-Ersparnis:** ~400 MB

---

## 📊 PERFORMANCE-MESSUNGEN

### Vorher:
```
RAM:   99.6% (7.67 / 7.7 GB)  ❌ KRITISCH
Disk:  77.1% (183 / 237 GB)   🟡 OK
Boot:  ~60-90 Sekunden         🟡 Langsam
```

### Nachher (nach Optimierungen):
```
RAM:   ~70% (5.4 / 7.7 GB)    ✅ Gut
Disk:  ~70% (166 / 237 GB)    ✅ Besser
Boot:  ~30-40 Sekunden         ✅ Schneller
```

**Erwartete Verbesserung:**
- ✅ 2+ GB RAM freigegeben
- ✅ 10+ GB Disk-Speicher freigegeben
- ✅ 30+ Sekunden schnellerer Boot
- ✅ Flüssigeres Arbeiten

---

## 🔧 ERWEITERTE OPTIMIERUNGEN (Optional)

### 1. Windows Update Cache leeren (Admin nötig)
```powershell
# Als Administrator:
Stop-Service wuauserv
Remove-Item C:\Windows\SoftwareDistribution\Download\* -Recurse -Force
Start-Service wuauserv
```
**Freigegeben:** 1-5 GB

### 2. Windows.old löschen (falls vorhanden)
```powershell
# Nach Windows Update manchmal vorhanden:
Remove-Item C:\Windows.old -Recurse -Force
```
**Freigegeben:** 10-30 GB

### 3. Hibernate deaktivieren (wenn nicht genutzt)
```powershell
# Als Administrator:
powercfg -h off
```
**Freigegeben:** ~6 GB (hiberfil.sys wird gelöscht)

### 4. System File Cleanup
```powershell
# Als Administrator:
Dism.exe /online /Cleanup-Image /StartComponentCleanup
```
**Freigegeben:** 1-3 GB

---

## 🔄 WARTUNGSPLAN

### Täglich:
- ❌ Nichts! (Automatisch läuft genug)

### Wöchentlich:
- 🔄 PC neustarten (1x pro Woche)
- 🗑️ Downloads-Ordner aufräumen

### Monatlich:
- 🧹 Browser Cache leeren
- 📊 Task-Manager checken (neue RAM-Fresser?)
- 🔍 Autostart-Programme überprüfen

### Vierteljährlich:
- 🚀 Optimierungs-Script ausführen
- 💾 Große Dateien archivieren/löschen
- 🔧 Windows Update ausführen
- 🎯 Unnötige Programme deinstallieren

---

## 📱 QUICK COMMANDS CHEAT SHEET

```powershell
# System Info schnell anzeigen
systeminfo

# RAM-Nutzung checken
Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 10

# Disk-Speicher analysieren
Get-ChildItem C:\ -Recurse -ErrorAction SilentlyContinue | 
  Group-Object Extension | 
  Sort-Object {($_.Group | Measure-Object Length -Sum).Sum} -Descending |
  Select-Object -First 20

# Temp-Dateien schnell löschen
Remove-Item $env:TEMP\* -Recurse -Force -ErrorAction SilentlyContinue

# DNS Cache leeren
ipconfig /flushdns

# Netzwerk reset
netsh winsock reset

# Autostart-Programme anzeigen
Get-CimInstance Win32_StartupCommand | Select-Object Name, Command
```

---

## 🎯 PRIORITÄTEN (In dieser Reihenfolge!)

### SOFORT (Jetzt machen!):
1. ✅ Autostart-Programme deaktivieren → **~1 GB RAM frei**
2. ✅ Browser Cache leeren → **~2 GB Disk frei**
3. ✅ Windows Speicheroptimierung → **~5 GB Disk frei**

### HEUTE:
4. ✅ pc-optimizer.ps1 Script ausführen
5. ✅ VS Code Einstellungen optimieren
6. ✅ Hintergrund-Apps deaktivieren

### DIESE WOCHE:
7. ✅ Gaming-Software Autostart deaktivieren
8. ✅ Unnötige Programme deinstallieren
9. ✅ PC neustarten nach Optimierungen

---

## 💡 PRO-TIPPS

### Für Entwickler:
- **node_modules** regelmäßig löschen bei alten Projekten
- **Build-Ordner** (dist, out, target) löschen
- **Docker Images** aufräumen: `docker system prune -a`
- **Git Repos** bereinigen: `git clean -fdx`

### Für Gamer:
- **Shader Cache** leeren (NVIDIA/AMD Control Panel)
- **Game Recordings** regelmäßig löschen
- **Steam Downloads** Ordner leeren

### Für Alle:
- **Downloads-Ordner** ist oft 10+ GB groß!
- **Desktop** nicht als Speicher nutzen (verlangsamt Explorer)
- **Papierkorb** automatisch leeren aktivieren

---

## ❓ FAQ

**Q: Muss ich wirklich neustarten?**
A: JA! Nach Optimierungen ist ein Neustart essentiell damit RAM komplett freigegeben wird.

**Q: Kann ich alles rückgängig machen?**
A: Ja! Autostart-Programme kannst du jederzeit wieder aktivieren. Gelöschte Temp-Dateien sind eh unwichtig.

**Q: Ist mein PC zu schwach?**
A: NEIN! i7-1165G7 + 8GB RAM ist gut. Problem ist nur zu viele Programme gleichzeitig.

**Q: Sollte ich RAM aufrüsten?**
A: Mit Optimierungen erstmal nicht nötig. Aber 16GB wären langfristig besser für Development.

**Q: Windows neu installieren?**
A: Nur im Extremfall! Probiere erst alle Optimierungen aus.

---

## 📞 SCRIPT AUSFÜHREN

```powershell
# Navigiere zu Toobix-Unified:
cd C:\Toobix-Unified

# Führe Optimizer aus:
.\scripts\pc-optimizer.ps1

# Mit Admin-Rechten (empfohlen):
Start-Process powershell -Verb RunAs -ArgumentList "-ExecutionPolicy Bypass -File $PWD\scripts\pc-optimizer.ps1"
```

---

## ✨ ERGEBNIS

Nach allen Optimierungen solltest du merken:
- ✅ **Schnellerer Boot** (30+ Sekunden gespart)
- ✅ **Mehr freier RAM** (2+ GB)
- ✅ **Flüssigeres Arbeiten** (keine Freezes mehr)
- ✅ **Schnellere Programme** (besonders VS Code)
- ✅ **Mehr Speicherplatz** (10+ GB)

---

## 🌟 NEXT LEVEL (Optional)

- 🔧 **SSD Upgrade:** Von HDD zu SSD = 10x schneller
- 🧠 **RAM Upgrade:** 8GB → 16GB = Nie wieder RAM-Probleme
- 🔥 **GPU Treiber:** Immer aktuell halten
- 💻 **BIOS Update:** Manchmal Performance-Verbesserungen

---

**Created by:** Toobix AI Assistant 🤖
**Date:** 7. Oktober 2025
**Version:** 1.0

*"Ein schneller PC ist ein glücklicher PC!"* 🚀
