# 🗂️ C:\GPT Cleanup Guide

**Erstellt:** 2025-10-04
**Ziel:** Legacy-Versionen aufräumen, Speicher zurückgewinnen

---

## 📊 Aktuelle Situation

### Gefundene Ordner in C:\GPT:
```
C:\GPT\
├── Archive/            (bereits archiviert)
├── Version_1/          (alt - ca. Aug 2024)
├── Version_2/          (alt - ca. Aug 2024)
├── Version_3/          (alt - ca. Aug 2024)
├── Version_4/          (alt - ca. Sep 2024)
├── Version_5/          (alt - ca. Sep 2024)
├── Version_6/          (alt - ca. Sep 2024)
├── Version_7/          (alt - ca. Sep 2024)
├── Version_8/          (aktuellste - Okt 2024)
├── toobix-live-demo/   (Demo-Version)
└── toobix-universe/    (alte Tauri-Version)
```

### Problem:
- **8 alte Versionen** (Version_1 bis Version_8)
- Geschätzte Gesamtgröße: **2-5 GB**
- Älteste Dateien: >60 Tage
- Viele redundante node_modules, builds, etc.

---

## 🎯 Empfohlene Strategie

### Option 1: SICHER (empfohlen)
```powershell
# 1. Analyse durchführen
.\scripts\cleanup-gpt-legacy.ps1 -AnalyzeOnly

# 2. Backup erstellen
.\scripts\cleanup-gpt-legacy.ps1 -DryRun

# 3. Cleanup mit Bestätigung
.\scripts\cleanup-gpt-legacy.ps1
```

**Was passiert:**
- Version_8 bleibt (neueste)
- Archive bleibt
- Version_1-7 → Backup nach D:\ → Löschen
- toobix-* → Archivieren (falls älter als 30 Tage)

**Einsparung:** ~2-4 GB

---

### Option 2: AGGRESSIV
```powershell
# Direkt alles außer Version_8 löschen
Remove-Item -Path "C:\GPT\Version_1" -Recurse -Force
Remove-Item -Path "C:\GPT\Version_2" -Recurse -Force
Remove-Item -Path "C:\GPT\Version_3" -Recurse -Force
Remove-Item -Path "C:\GPT\Version_4" -Recurse -Force
Remove-Item -Path "C:\GPT\Version_5" -Recurse -Force
Remove-Item -Path "C:\GPT\Version_6" -Recurse -Force
Remove-Item -Path "C:\GPT\Version_7" -Recurse -Force
```

**⚠️ WARNUNG:** Kein Backup! Nur wenn Sie sicher sind, dass nichts gebraucht wird.

---

### Option 3: MANUELL
1. **Öffne:** `C:\GPT`
2. **Prüfe jede Version:**
   - Gibt es wichtige Dateien? → Einzeln sichern
   - Nur Code/Dependencies? → Löschen OK
3. **Verschiebe nach Archive:**
   - Wichtige Versionen → `C:\GPT\Archive\`
   - Unwichtige → Löschen

---

## 📦 Was behalten?

### ✅ BEHALTEN
- **C:\Toobix-Unified** (Hauptprojekt - NICHT in C:\GPT!)
- **Version_8** (neueste Legacy-Version als Referenz)
- **Archive** (falls vorhanden)

### 📦 ARCHIVIEREN (nach D:\ oder externe HDD)
- Version_6, Version_7 (falls <60 Tage alt)
- toobix-universe (falls noch Tauri-Code benötigt wird)
- toobix-live-demo (falls Demo-Daten wichtig)

### 🗑️ LÖSCHEN
- Version_1 bis Version_5 (>60 Tage alt)
- node_modules in allen Versionen
- .next, dist, build Ordner

---

## 🛠️ Script-Verwendung

### 1. Analyse (sicher)
```powershell
.\scripts\cleanup-gpt-legacy.ps1 -AnalyzeOnly
```

**Output:**
```
Version       | Größe (MB) | Dateien | Alter (Tage)
Version_1     | 234        | 1,234   | 92
Version_2     | 456        | 2,345   | 85
...
Gesamt-Größe: 3,456 MB (3.37 GB)
```

### 2. Dry-Run (Test ohne Änderungen)
```powershell
.\scripts\cleanup-gpt-legacy.ps1 -DryRun
```

**Output:**
```
[DRY] Version_1 → Löschen (234 MB)
[DRY] Version_2 → Löschen (456 MB)
Speicher-Einsparung: 2,345 MB
```

### 3. Cleanup mit Backup
```powershell
.\scripts\cleanup-gpt-legacy.ps1
```

**Interaktiv:**
1. Backup erstellen? → **ja**
2. Version_1 archivieren/löschen? → **JA LÖSCHEN**
3. ...

**Backup-Pfad:** `D:\Toobix-Backup-20251004\`

### 4. Custom Backup-Pfad
```powershell
.\scripts\cleanup-gpt-legacy.ps1 -BackupPath "E:\Backups\GPT-Legacy"
```

---

## 📊 Erwartete Ergebnisse

### Vorher (C:\GPT)
```
Version_1/     → 234 MB
Version_2/     → 456 MB
Version_3/     → 312 MB
Version_4/     → 567 MB
Version_5/     → 423 MB
Version_6/     → 389 MB
Version_7/     → 298 MB
Version_8/     → 456 MB
Archive/       → 123 MB
toobix-*       → 198 MB
----------------------------
GESAMT:        ~3.4 GB
```

### Nachher (C:\GPT)
```
Version_8/     → 456 MB  (neueste als Referenz)
Archive/       → 123 MB  (wichtige alte Versionen)
----------------------------
GESAMT:        ~580 MB
EINGESPART:    ~2.8 GB
```

---

## 🚨 WICHTIG: Vor dem Löschen prüfen

### Checklist:
- [ ] Gibt es Custom-Code in alten Versionen?
- [ ] Sind wichtige Konfigurationsdateien vorhanden (.env mit Keys)?
- [ ] Wurden Migrations/Datenbanken behalten?
- [ ] Ist ein Backup erstellt?
- [ ] Wurde C:\Toobix-Unified bereits auf neuesten Stand aktualisiert?

### Wichtige Dateien sichern:
```powershell
# Beispiel: .env Dateien finden
Get-ChildItem -Path "C:\GPT" -Filter ".env" -Recurse

# Kopiere wichtige Files
Copy-Item "C:\GPT\Version_5\.env" -Destination "D:\Backup\"
```

---

## 🔄 Rollback (falls etwas schief geht)

### Aus Backup wiederherstellen:
```powershell
# Backup-Pfad finden
$backup = Get-ChildItem -Path "D:\" -Filter "Toobix-Backup-*" |
          Sort-Object Name -Descending |
          Select-Object -First 1

# Wiederherstellen
Copy-Item -Path "$($backup.FullName)\Version_5" -Destination "C:\GPT\" -Recurse
```

---

## 📝 Empfohlener Workflow

### Schritt-für-Schritt:

**Tag 1: Analyse**
```powershell
# 1. Größen analysieren
.\scripts\cleanup-gpt-legacy.ps1 -AnalyzeOnly

# 2. Wichtige Dateien identifizieren
Get-ChildItem "C:\GPT" -Recurse -Filter "*.env"
Get-ChildItem "C:\GPT" -Recurse -Filter "*.db"
Get-ChildItem "C:\GPT" -Recurse -Filter "*.config.json"
```

**Tag 2: Backup**
```powershell
# 3. Backup auf externe HDD/USB
.\scripts\cleanup-gpt-legacy.ps1 -BackupPath "E:\Toobix-Backup"
```

**Tag 3: Cleanup**
```powershell
# 4. Cleanup durchführen
.\scripts\cleanup-gpt-legacy.ps1

# 5. Verifizieren
Get-ChildItem "C:\GPT" -Directory
```

**Tag 4: Verifizierung**
```powershell
# 6. Ist C:\Toobix-Unified funktional?
cd C:\Toobix-Unified
bun install
bun run dev

# 7. Alles OK? → Backup auf externe HDD verschieben
```

---

## 🎯 Finale Struktur

### Ziel-Zustand:
```
C:\
├── Toobix-Unified/     ← HAUPTPROJEKT (aktiv entwickelt)
│
├── GPT/                ← Legacy-Referenz (minimal)
│   ├── Archive/        ← Wichtige alte Versionen
│   └── Version_8/      ← Neueste Legacy-Version
│
└── (Standard Windows-Verzeichnisse)
```

### Backup (externe HDD):
```
E:\Toobix-Backup\
├── Version_1/
├── Version_2/
├── Version_3/
├── Version_4/
├── Version_5/
├── Version_6/
├── Version_7/
└── README.md  ← Notizen zu jeder Version
```

---

## 💡 Zusätzliche Optimierungen

### node_modules entfernen (falls nicht gelöscht):
```powershell
# Findet alle node_modules in C:\GPT
Get-ChildItem -Path "C:\GPT" -Recurse -Directory -Filter "node_modules" |
    Remove-Item -Recurse -Force

# Einsparung: ~1-2 GB
```

### Build-Artefakte löschen:
```powershell
# .next, dist, build
Get-ChildItem -Path "C:\GPT" -Recurse -Directory |
    Where-Object { $_.Name -match "^(\.next|dist|build)$" } |
    Remove-Item -Recurse -Force

# Einsparung: ~500 MB
```

### Git-History komprimieren:
```powershell
# In jeder Version (falls .git vorhanden)
cd C:\GPT\Version_8
git gc --aggressive --prune=now

# Einsparung: ~100-300 MB pro Repo
```

---

## 📞 Support

Bei Problemen:
1. **Backup prüfen:** Ist D:\Toobix-Backup vorhanden?
2. **Script-Log:** Output vom Script speichern
3. **Rollback:** Siehe Rollback-Sektion oben
4. **Frage stellen:** Mit Script-Output und Fehlermeldung

---

**Erstellt mit ❤️ von Claude Code Agent**
*Letzte Aktualisierung: 2025-10-04*
