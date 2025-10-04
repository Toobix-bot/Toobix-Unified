# C:\GPT Legacy Versions Cleanup Script
# Analysiert alte Versionen, erstellt Backup-Empfehlungen
# Erstellt: 2025-10-04

param(
    [switch]$DryRun,
    [switch]$AnalyzeOnly,
    [string]$BackupPath = "D:\Toobix-Backup-$(Get-Date -Format 'yyyyMMdd')"
)

$ErrorActionPreference = "Stop"
$GPTPath = "C:\GPT"

Write-Host "🗂️  C:\GPT Legacy Cleanup Analyzer" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $GPTPath)) {
    Write-Host "❌ C:\GPT nicht gefunden!" -ForegroundColor Red
    exit 1
}

# Analyse aller Versionen
Write-Host "📊 Analysiere Versionen..." -ForegroundColor Cyan
Write-Host ""

$versions = @()
$totalSize = 0

# Version 1-8 analysieren
for ($i = 1; $i -le 8; $i++) {
    $versionPath = Join-Path $GPTPath "Version_$i"

    if (Test-Path $versionPath) {
        # Größe berechnen (kann dauern)
        Write-Host "  Analysiere Version_$i..." -ForegroundColor Gray

        $size = 0
        $fileCount = 0

        try {
            $files = Get-ChildItem -Path $versionPath -Recurse -File -ErrorAction SilentlyContinue
            $fileCount = $files.Count
            $size = ($files | Measure-Object -Property Length -Sum).Sum
        } catch {
            Write-Host "    ⚠️  Zugriff teilweise eingeschränkt" -ForegroundColor Yellow
        }

        $sizeMB = [math]::Round($size / 1MB, 2)
        $totalSize += $size

        # Letzte Änderung
        $lastModified = (Get-ChildItem -Path $versionPath -Recurse -File -ErrorAction SilentlyContinue |
                        Sort-Object LastWriteTime -Descending |
                        Select-Object -First 1).LastWriteTime

        $versions += [PSCustomObject]@{
            Version      = "Version_$i"
            Path         = $versionPath
            SizeMB       = $sizeMB
            FileCount    = $fileCount
            LastModified = $lastModified
            Age          = if ($lastModified) { (New-TimeSpan -Start $lastModified -End (Get-Date)).Days } else { $null }
        }

        Write-Host "    ✓ $sizeMB MB, $fileCount Dateien" -ForegroundColor Green
    }
}

# Andere Ordner
$otherDirs = @("Archive", "toobix-live-demo", "toobix-universe")
foreach ($dir in $otherDirs) {
    $dirPath = Join-Path $GPTPath $dir

    if (Test-Path $dirPath) {
        Write-Host "  Analysiere $dir..." -ForegroundColor Gray

        $size = 0
        $fileCount = 0

        try {
            $files = Get-ChildItem -Path $dirPath -Recurse -File -ErrorAction SilentlyContinue
            $fileCount = $files.Count
            $size = ($files | Measure-Object -Property Length -Sum).Sum
        } catch {}

        $sizeMB = [math]::Round($size / 1MB, 2)
        $totalSize += $size

        $lastModified = (Get-ChildItem -Path $dirPath -Recurse -File -ErrorAction SilentlyContinue |
                        Sort-Object LastWriteTime -Descending |
                        Select-Object -First 1).LastWriteTime

        $versions += [PSCustomObject]@{
            Version      = $dir
            Path         = $dirPath
            SizeMB       = $sizeMB
            FileCount    = $fileCount
            LastModified = $lastModified
            Age          = if ($lastModified) { (New-TimeSpan -Start $lastModified -End (Get-Date)).Days } else { $null }
        }

        Write-Host "    ✓ $sizeMB MB, $fileCount Dateien" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "📊 ANALYSE-ERGEBNISSE" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host ""

# Sortiert nach Alter
$versions | Sort-Object Age -Descending | Format-Table -AutoSize @(
    @{Label="Version"; Expression={$_.Version}},
    @{Label="Größe (MB)"; Expression={$_.SizeMB}},
    @{Label="Dateien"; Expression={$_.FileCount}},
    @{Label="Alter (Tage)"; Expression={$_.Age}},
    @{Label="Letzte Änderung"; Expression={$_.LastModified.ToString("yyyy-MM-dd")}}
)

$totalSizeMB = [math]::Round($totalSize / 1MB, 2)
$totalSizeGB = [math]::Round($totalSize / 1GB, 2)

Write-Host "Gesamt-Größe: $totalSizeMB MB ($totalSizeGB GB)" -ForegroundColor Yellow
Write-Host ""

# Empfehlungen
Write-Host "💡 EMPFEHLUNGEN" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan
Write-Host ""

$keepVersions = @()
$archiveVersions = @()
$deleteVersions = @()

foreach ($v in $versions) {
    # Aktuellste Version behalten (Version_8)
    if ($v.Version -eq "Version_8") {
        $keepVersions += $v
        Write-Host "  ✅ BEHALTEN: $($v.Version) (neueste Version)" -ForegroundColor Green
    }
    # Archive behalten (schon archiviert)
    elseif ($v.Version -eq "Archive") {
        $keepVersions += $v
        Write-Host "  ✅ BEHALTEN: $($v.Version) (bereits archiviert)" -ForegroundColor Green
    }
    # Toobix-Universe könnte relevant sein
    elseif ($v.Version -eq "toobix-universe" -or $v.Version -eq "toobix-live-demo") {
        if ($v.Age -lt 30) {
            $keepVersions += $v
            Write-Host "  ✅ BEHALTEN: $($v.Version) (noch aktuell)" -ForegroundColor Green
        } else {
            $archiveVersions += $v
            Write-Host "  📦 ARCHIVIEREN: $($v.Version) (älter als 30 Tage)" -ForegroundColor Yellow
        }
    }
    # Alte Versionen (1-7)
    elseif ($v.Age -gt 60) {
        $deleteVersions += $v
        Write-Host "  🗑️  LÖSCHEN: $($v.Version) (älter als 60 Tage, $($v.SizeMB) MB)" -ForegroundColor Red
    }
    else {
        $archiveVersions += $v
        Write-Host "  📦 ARCHIVIEREN: $($v.Version) ($($v.Age) Tage alt)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "📦 CLEANUP-PLAN" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan
Write-Host ""

$deleteSizeMB = ($deleteVersions | Measure-Object -Property SizeMB -Sum).Sum
$archiveSizeMB = ($archiveVersions | Measure-Object -Property SizeMB -Sum).Sum

Write-Host "Behalten:    $($keepVersions.Count) Ordner" -ForegroundColor Green
Write-Host "Archivieren: $($archiveVersions.Count) Ordner ($archiveSizeMB MB)" -ForegroundColor Yellow
Write-Host "Löschen:     $($deleteVersions.Count) Ordner ($deleteSizeMB MB)" -ForegroundColor Red
Write-Host ""
Write-Host "Speicher-Einsparung: $deleteSizeMB MB (~$([math]::Round($deleteSizeMB/1024, 2)) GB)" -ForegroundColor Cyan

if ($AnalyzeOnly) {
    Write-Host ""
    Write-Host "ℹ️  Nur Analyse (keine Änderungen)" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🎯 AUSFÜHRUNGS-OPTIONEN" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "🔍 DRY-RUN MODUS (keine Änderungen)" -ForegroundColor Yellow
    Write-Host ""
}

# Backup-Empfehlung
Write-Host "1️⃣  BACKUP ERSTELLEN (empfohlen!)" -ForegroundColor Cyan
Write-Host "   Ziel: $BackupPath" -ForegroundColor Gray
Write-Host ""

if (-not $DryRun) {
    $createBackup = Read-Host "Backup erstellen? (ja/nein)"

    if ($createBackup -eq "ja") {
        Write-Host ""
        Write-Host "📦 Erstelle Backup..." -ForegroundColor Cyan

        New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null

        foreach ($v in ($archiveVersions + $deleteVersions)) {
            $backupTarget = Join-Path $BackupPath $v.Version
            Write-Host "  Sichere $($v.Version)..." -ForegroundColor Gray
            Copy-Item -Path $v.Path -Destination $backupTarget -Recurse -Force
        }

        Write-Host "  ✅ Backup erstellt!" -ForegroundColor Green
    }
}

# Verschieben nach Archive
Write-Host ""
Write-Host "2️⃣  ARCHIVIEREN" -ForegroundColor Cyan

if ($archiveVersions.Count -gt 0) {
    foreach ($v in $archiveVersions) {
        $archiveTarget = Join-Path $GPTPath "Archive\$($v.Version)"

        if ($DryRun) {
            Write-Host "  [DRY] $($v.Version) → Archive\" -ForegroundColor DarkGray
        } else {
            $confirm = Read-Host "  Archivieren: $($v.Version)? (ja/nein)"
            if ($confirm -eq "ja") {
                Move-Item -Path $v.Path -Destination $archiveTarget -Force
                Write-Host "    ✓ Verschoben" -ForegroundColor Green
            }
        }
    }
}

# Löschen
Write-Host ""
Write-Host "3️⃣  LÖSCHEN (Vorsicht!)" -ForegroundColor Red

if ($deleteVersions.Count -gt 0) {
    foreach ($v in $deleteVersions) {
        if ($DryRun) {
            Write-Host "  [DRY] $($v.Version) löschen ($($v.SizeMB) MB)" -ForegroundColor DarkGray
        } else {
            $confirm = Read-Host "  WIRKLICH LÖSCHEN: $($v.Version) ($($v.SizeMB) MB)? (JA LÖSCHEN/nein)"
            if ($confirm -eq "JA LÖSCHEN") {
                Remove-Item -Path $v.Path -Recurse -Force
                Write-Host "    ✅ Gelöscht" -ForegroundColor Red
            } else {
                Write-Host "    Übersprungen" -ForegroundColor Yellow
            }
        }
    }
}

Write-Host ""
Write-Host "✅ CLEANUP ABGESCHLOSSEN" -ForegroundColor Green
Write-Host ""

if (-not $DryRun) {
    Write-Host "📊 Neue Struktur:" -ForegroundColor Cyan
    Get-ChildItem -Path $GPTPath -Directory | ForEach-Object {
        Write-Host "  $($_.Name)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "💾 Backup-Pfad: $BackupPath" -ForegroundColor Cyan
Write-Host ""
