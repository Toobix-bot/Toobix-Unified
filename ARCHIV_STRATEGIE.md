# 🗂️ ARCHIV-STRATEGIE - Toobix Versionen

**Erstellt:** 2025-10-02 18:50  
**Ziel:** Alte Versionen (V1-V6) sicher archivieren, Speicherplatz freigeben

---

## 📊 VERSIONS-ÜBERSICHT

### Aktive Versionen (BEHALTEN)
| Version | Größe | Dateien | Wert | Grund |
|---------|-------|---------|------|-------|
| **Version_7** | 221.54 MB | 12,190 | 🌟🌟🌟🌟🌟 | **Life-Agent System**, Groq Key, Story Engine, Policy System |
| **Version_8** | 327.72 MB | 8,139 | 🌟🌟🌟🌟🌟 | **Echo-Bridge RAG**, MCP Server, CloudFlare Tunnel |
| **Toobix-Unified** | 166 MB | 9,550 | 🌟🌟🌟🌟🌟 | **Hauptprojekt**, Production-ready, Git connected |

**Gesamt Aktiv:** ~715 MB, 29,879 Dateien

### Zu Archivierende Versionen
| Version | Größe | Dateien | Wert | Grund |
|---------|-------|---------|------|-------|
| Version_1 | 41.14 MB | 401 | 🌟 | Echo-Settlement Starter (Vite) |
| Version_2 | 20.11 MB | 1,638 | 🌟 | Minimal README |
| Version_3 | 2.33 MB | 649 | 🌟 | Klein, veraltet |
| Version_4 | 40.25 MB | 2,869 | 🌟🌟 | Mittelgroß, node_modules |
| Version_5 | 0.67 MB | 57 | 🌟 | Sehr klein |
| Version_6 | 0.06 MB | 25 | 🌟 | Minimal |

**Gesamt Archiv:** ~104.56 MB, 5,639 Dateien

### Experiments (PRÜFEN)
| Name | Größe | Dateien | Status |
|------|-------|---------|--------|
| toobix-universe | 0.06 MB | 14 | 🧪 Experiment |
| toobix-live-demo | 0.04 MB | 4 | 🧪 Experiment |

**Entscheidung:** Später prüfen, ggf. zu Unified integrieren

---

## 🎯 ARCHIV-STRUKTUR

```
C:\GPT\
├── Version_7\           ← AKTIV (Life-Agent)
├── Version_8\           ← AKTIV (Echo-Bridge)
├── toobix-universe\     ← Experiment
├── toobix-live-demo\    ← Experiment
│
└── Archive\             ← NEU!
    ├── _README.md       ← Archiv-Dokumentation
    ├── _MANIFEST.json   ← Metadaten aller Versionen
    │
    ├── Version_1\
    │   ├── .archived_at.txt      ← Zeitstempel
    │   └── [Original Content]
    │
    ├── Version_2\
    ├── Version_3\
    ├── Version_4\
    ├── Version_5\
    └── Version_6\
```

---

## 📝 ARCHIV-PROZESS

### Schritt 1: Vorbereitung
```powershell
# Archiv-Verzeichnis existiert bereits
Test-Path C:\GPT\Archive  # True

# Manifest-Datei erstellen
New-Item C:\GPT\Archive\_MANIFEST.json -ItemType File
```

### Schritt 2: Verschieben (mit Sicherheit)
```powershell
# Pro Version:
$version = "Version_1"
$source = "C:\GPT\$version"
$dest = "C:\GPT\Archive\$version"

# Timestamp hinzufügen
Get-Date -Format "yyyy-MM-dd HH:mm:ss" | Out-File "$dest\.archived_at.txt"

# Verschieben
Move-Item -Path $source -Destination $dest -Force

# Verifikation
Test-Path $dest  # Sollte True sein
Test-Path $source  # Sollte False sein
```

### Schritt 3: Manifest aktualisieren
```json
{
  "archived_at": "2025-10-02T18:50:00Z",
  "archived_by": "GitHub Copilot",
  "versions": {
    "Version_1": {
      "size_mb": 41.14,
      "files": 401,
      "archived_at": "2025-10-02T18:50:00Z",
      "reason": "Outdated Vite starter",
      "can_restore": true
    },
    "Version_2": {
      "size_mb": 20.11,
      "files": 1638,
      "archived_at": "2025-10-02T18:50:00Z",
      "reason": "Minimal project",
      "can_restore": true
    }
    // ... weitere Versionen
  },
  "total_archived": {
    "size_mb": 104.56,
    "files": 5639,
    "count": 6
  }
}
```

---

## ⚡ AUTOMATISCHES ARCHIVIERUNGS-SCRIPT

### PowerShell Script: `archive-old-versions.ps1`
```powershell
# C:\GPT\archive-old-versions.ps1

param(
    [string]$ArchiveDir = "C:\GPT\Archive",
    [switch]$DryRun = $false
)

$VersionsToArchive = @("Version_1", "Version_2", "Version_3", "Version_4", "Version_5", "Version_6")
$Manifest = @{
    archived_at = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    archived_by = "PowerShell Script"
    versions = @{}
}

Write-Host "🗂️ TOOBIX ARCHIVIERUNGS-TOOL" -ForegroundColor Cyan
Write-Host "═══════════════════════════════" -ForegroundColor Cyan
Write-Host ""

foreach ($version in $VersionsToArchive) {
    $SourcePath = "C:\GPT\$version"
    $DestPath = "$ArchiveDir\$version"
    
    if (-not (Test-Path $SourcePath)) {
        Write-Host "⏭️  $version nicht gefunden, überspringe" -ForegroundColor Yellow
        continue
    }
    
    # Größe berechnen
    $SizeMB = [math]::Round((Get-ChildItem $SourcePath -Recurse -File -ErrorAction SilentlyContinue | 
        Measure-Object -Property Length -Sum).Sum / 1MB, 2)
    $FileCount = (Get-ChildItem $SourcePath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object).Count
    
    Write-Host "📦 $version" -ForegroundColor Green
    Write-Host "   Größe: $SizeMB MB"
    Write-Host "   Dateien: $FileCount"
    
    if ($DryRun) {
        Write-Host "   ⏸️  DRY RUN - Nicht verschoben" -ForegroundColor Yellow
    } else {
        # Verschieben
        Move-Item -Path $SourcePath -Destination $DestPath -Force
        
        # Timestamp
        Get-Date -Format "yyyy-MM-dd HH:mm:ss" | Out-File "$DestPath\.archived_at.txt"
        
        Write-Host "   ✅ Archiviert nach: $DestPath" -ForegroundColor Green
    }
    
    # Manifest-Eintrag
    $Manifest.versions[$version] = @{
        size_mb = $SizeMB
        files = $FileCount
        archived_at = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
        original_path = $SourcePath
        archived_path = $DestPath
    }
    
    Write-Host ""
}

# Manifest speichern
if (-not $DryRun) {
    $ManifestPath = "$ArchiveDir\_MANIFEST.json"
    $Manifest | ConvertTo-Json -Depth 3 | Out-File $ManifestPath -Encoding UTF8
    Write-Host "📄 Manifest gespeichert: $ManifestPath" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "✅ ARCHIVIERUNG ABGESCHLOSSEN!" -ForegroundColor Green
```

**Verwendung:**
```powershell
# Dry Run (Simulation)
.\archive-old-versions.ps1 -DryRun

# Echte Archivierung
.\archive-old-versions.ps1
```

---

## 🔄 WIEDERHERSTELLUNG

Falls eine Version später benötigt wird:

```powershell
# Version wiederherstellen
$version = "Version_3"
$archivePath = "C:\GPT\Archive\$version"
$restorePath = "C:\GPT\$version"

Move-Item -Path $archivePath -Destination $restorePath -Force
Write-Host "✅ $version wiederhergestellt nach $restorePath"
```

---

## 📊 ERWARTETE ERGEBNISSE

### Vor Archivierung
```
C:\GPT\
├── Version_1  (41 MB)
├── Version_2  (20 MB)
├── Version_3  (2 MB)
├── Version_4  (40 MB)
├── Version_5  (1 MB)
├── Version_6  (0 MB)
├── Version_7  (222 MB)  ← AKTIV
├── Version_8  (328 MB)  ← AKTIV
├── toobix-universe (0 MB)
└── toobix-live-demo (0 MB)

Gesamt: ~654 MB
```

### Nach Archivierung
```
C:\GPT\
├── Version_7  (222 MB)  ← AKTIV
├── Version_8  (328 MB)  ← AKTIV
├── toobix-universe (0 MB)
├── toobix-live-demo (0 MB)
└── Archive\
    ├── Version_1  (41 MB)
    ├── Version_2  (20 MB)
    ├── Version_3  (2 MB)
    ├── Version_4  (40 MB)
    ├── Version_5  (1 MB)
    └── Version_6  (0 MB)

Aktiv: ~550 MB (sauberer!)
Archiv: ~104 MB (aufgeräumt)
Gesamt: ~654 MB (gleich)
```

---

## ⚠️ SICHERHEITSHINWEISE

1. **Backup vor Archivierung!**
   - Erstelle eine komplette Kopie von `C:\GPT\` auf externe Festplatte
   - Oder: GitHub Backup aller wichtigen Repositories

2. **Verifikation nach Archivierung:**
   ```powershell
   # Prüfen ob Archive vollständig sind
   Get-ChildItem C:\GPT\Archive\Version_* -Recurse -File | Measure-Object
   
   # Mit Original-Werten vergleichen
   ```

3. **Kein Löschen!**
   - Archive werden **verschoben**, nicht gelöscht
   - Alles bleibt auf C:\, nur strukturiert

4. **Manifest ist wichtig:**
   - Dokumentiert was wann warum archiviert wurde
   - Erlaubt spätere Analyse

---

## 🎯 NÄCHSTER SCHRITT

**Empfehlung:** Dry Run durchführen:

```powershell
# In C:\GPT\ das Script erstellen und ausführen
.\archive-old-versions.ps1 -DryRun
```

**Wenn alles OK:** Echte Archivierung:
```powershell
.\archive-old-versions.ps1
```

---

**Status:** Archiv-Strategie bereit zur Umsetzung! 📦
