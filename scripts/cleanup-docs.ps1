# Toobix Dokumentations-Cleanup Script
# Mit automatischem Backup und Rollback-Funktion
# Erstellt: 2025-10-04

param(
    [switch]$DryRun,
    [switch]$Rollback,
    [string]$BackupPath = ".\docs-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
)

$ErrorActionPreference = "Stop"
$RootPath = Split-Path $PSScriptRoot -Parent

Write-Host "🧹 Toobix Dokumentations-Cleanup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Rollback-Funktion
if ($Rollback) {
    Write-Host "⏪ ROLLBACK-MODUS" -ForegroundColor Yellow
    Write-Host ""

    $latestBackup = Get-ChildItem -Path $RootPath -Filter "docs-backup-*" -Directory |
                    Sort-Object Name -Descending |
                    Select-Object -First 1

    if (-not $latestBackup) {
        Write-Host "❌ Kein Backup gefunden!" -ForegroundColor Red
        exit 1
    }

    Write-Host "📦 Backup gefunden: $($latestBackup.Name)" -ForegroundColor Green
    $confirm = Read-Host "Wirklich alle Änderungen rückgängig machen? (ja/nein)"

    if ($confirm -ne "ja") {
        Write-Host "Abgebrochen." -ForegroundColor Yellow
        exit 0
    }

    # Restore aus Backup
    Write-Host "🔄 Stelle Dateien wieder her..." -ForegroundColor Cyan
    Copy-Item -Path "$($latestBackup.FullName)\*" -Destination $RootPath -Recurse -Force

    # Lösche docs/archive falls vorhanden
    if (Test-Path "$RootPath\docs\archive") {
        Remove-Item -Path "$RootPath\docs\archive" -Recurse -Force
    }

    Write-Host "✅ Rollback erfolgreich!" -ForegroundColor Green
    exit 0
}

# Backup erstellen
Write-Host "📦 Erstelle Backup..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null

# Alle MD-Dateien im Root sichern
Get-ChildItem -Path $RootPath -Filter "*.md" -File | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $BackupPath
}

Write-Host "✅ Backup erstellt: $BackupPath" -ForegroundColor Green
Write-Host ""

# Dry-Run Modus
if ($DryRun) {
    Write-Host "🔍 DRY-RUN MODUS (keine Änderungen)" -ForegroundColor Yellow
    Write-Host ""
}

# Archive-Struktur erstellen
$archivePaths = @(
    "$RootPath\docs\archive\chatty-integration",
    "$RootPath\docs\archive\session-reports",
    "$RootPath\docs\archive\milestones",
    "$RootPath\docs\archive\old-guides",
    "$RootPath\docs\archive\system-status"
)

Write-Host "📁 Erstelle Archive-Struktur..." -ForegroundColor Cyan
foreach ($path in $archivePaths) {
    if (-not $DryRun) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
    }
    Write-Host "  ✓ $path" -ForegroundColor Gray
}
Write-Host ""

# Dateien verschieben
$movePatterns = @{
    "chatty-integration" = @("CHATTY_*.md", "MESSAGE_FOR_CHATTY.md", "RESPONSE_TO_CHATTY.md", "MCP_*.md", "PUBLIC_URL_*.md")
    "session-reports"    = @("SESSION_*.md")
    "milestones"         = @("*COMPLETE.md", "*SUCCESS.md", "*FIXED.md", "FINAL_*.md", "LIVE_TEST_RESULTS.md",
                             "NGROK_TOOLS_CALL_FIXED.md", "REPO_UPGRADE_SUMMARY.md", "SELF_CODING_*.md",
                             "STORY_ENGINE_UI.md", "UI_STATUS.md", "UNIFIED_DASHBOARD.md", "SUCCESS_CONSCIOUSNESS.md")
    "old-guides"         = @("QUICK_START_NEUSTART.md", "SICHTBARES_ERGEBNIS.md", "LUNA_SYSTEM_LOG_LIVE.md",
                             "PROJEKT_STATISTIKEN.md", "TASKGROUP_*.md", "CONNECTOR_DIAGNOSE.md")
    "system-status"      = @("SYSTEM_STATUS*.md", "SYSTEM_ANALYSE*.md", "SYSTEM_OPERATIONAL.md",
                             "SYSTEM_ANALYSIS_*.md", "SYSTEM_HEALTH_REPORT.md", "SYSTEM_LIVE.md",
                             "SYSTEM_MAP.md", "SYSTEM_MASTERPLAN.md", "SYSTEM_STRUKTUR.md")
}

$movedCount = 0
$totalCount = 0

foreach ($category in $movePatterns.Keys) {
    $targetPath = "$RootPath\docs\archive\$category"

    foreach ($pattern in $movePatterns[$category]) {
        $files = Get-ChildItem -Path $RootPath -Filter $pattern -File -ErrorAction SilentlyContinue

        foreach ($file in $files) {
            $totalCount++
            $destination = Join-Path $targetPath $file.Name

            if ($DryRun) {
                Write-Host "  [DRY] $($file.Name) → docs/archive/$category/" -ForegroundColor DarkGray
            } else {
                Move-Item -Path $file.FullName -Destination $destination -Force
                Write-Host "  ✓ $($file.Name) → docs/archive/$category/" -ForegroundColor Green
            }
            $movedCount++
        }
    }
}

Write-Host ""
Write-Host "📊 ZUSAMMENFASSUNG" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "Verschobene Dateien: $movedCount" -ForegroundColor Green

if (-not $DryRun) {
    $remainingFiles = (Get-ChildItem -Path $RootPath -Filter "*.md" -File).Count
    Write-Host "Verbleibende MD-Dateien im Root: $remainingFiles" -ForegroundColor Yellow

    Write-Host ""
    Write-Host "✅ Cleanup erfolgreich!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔄 Rollback verfügbar mit:" -ForegroundColor Cyan
    Write-Host "   .\scripts\cleanup-docs.ps1 -Rollback" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "ℹ️  Führe ohne -DryRun aus, um Änderungen anzuwenden" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Backup gespeichert: $BackupPath" -ForegroundColor Cyan
