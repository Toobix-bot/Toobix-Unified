# Toobix Package Optimization Script
# Vereinheitlicht Dependencies, entfernt Duplikate
# Erstellt: 2025-10-04

param(
    [switch]$DryRun,
    [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"
$RootPath = Split-Path $PSScriptRoot -Parent

Write-Host "📦 Toobix Package Optimization" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "🔍 DRY-RUN MODUS (keine Änderungen)" -ForegroundColor Yellow
    Write-Host ""
}

# 1. Zod-Versionen vereinheitlichen
Write-Host "1️⃣  Zod-Versionen prüfen..." -ForegroundColor Cyan

$packages = Get-ChildItem -Path "$RootPath\packages\*\package.json" -Recurse
$zodVersions = @{}

foreach ($pkg in $packages) {
    $json = Get-Content $pkg.FullName | ConvertFrom-Json
    if ($json.dependencies.zod) {
        $version = $json.dependencies.zod
        if (-not $zodVersions.ContainsKey($version)) {
            $zodVersions[$version] = @()
        }
        $zodVersions[$version] += $pkg.Directory.Name
    }
}

Write-Host "  Gefundene Zod-Versionen:" -ForegroundColor Gray
foreach ($version in $zodVersions.Keys) {
    $pkgs = $zodVersions[$version] -join ", "
    Write-Host "    $version → $pkgs" -ForegroundColor Yellow
}

# Root package.json Version
$rootPkg = Get-Content "$RootPath\package.json" | ConvertFrom-Json
$targetVersion = $rootPkg.dependencies.zod
Write-Host "  ✓ Ziel-Version (Root): $targetVersion" -ForegroundColor Green
Write-Host ""

# 2. Ungenutzte DevDependencies prüfen
Write-Host "2️⃣  Ungenutzte Dependencies prüfen..." -ForegroundColor Cyan

$hasPlaywrightTests = (Get-ChildItem -Path $RootPath -Filter "*.spec.ts" -Recurse).Count -gt 0
$hasE2ETests = Test-Path "$RootPath\tests\e2e"

if (-not $hasPlaywrightTests -and -not $hasE2ETests) {
    Write-Host "  ⚠️  Playwright installiert, aber keine Tests gefunden" -ForegroundColor Yellow
    Write-Host "      → @playwright/test, playwright (~500 MB)" -ForegroundColor Gray
} else {
    Write-Host "  ✓ Playwright: Tests vorhanden" -ForegroundColor Green
}

$vitestTests = Get-ChildItem -Path $RootPath -Filter "*.test.ts" -Recurse
Write-Host "  ℹ️  Vitest: $($vitestTests.Count) Test-Dateien gefunden" -ForegroundColor Cyan
Write-Host ""

# 3. Scripts organisieren
Write-Host "3️⃣  Scripts-Organisation prüfen..." -ForegroundColor Cyan

$scriptDirs = @("dev", "deployment", "tools", "demo")
$scriptCategories = @{
    "dev"        = @("start-all.ts", "dev-gui.ts", "start-gui.ts", "hot-reload.ts")
    "deployment" = @("api-server.ts", "chatty-api.ts", "luna-chatbot.ts")
    "tools"      = @("system-analyzer.ts", "memory-monitor.ts", "migrate.ts", "migrate-v*.ts")
    "demo"       = @("living-being-demo.ts", "toobix-voice.ts", "toobix-terminal.ts")
}

$scriptsPath = "$RootPath\scripts"
$allScripts = Get-ChildItem -Path $scriptsPath -Filter "*.ts" -File

Write-Host "  Gefundene Scripts: $($allScripts.Count)" -ForegroundColor Gray

foreach ($category in $scriptCategories.Keys) {
    $categoryPath = "$scriptsPath\$category"
    $matched = @()

    foreach ($pattern in $scriptCategories[$category]) {
        $files = $allScripts | Where-Object { $_.Name -like $pattern }
        $matched += $files
    }

    if ($matched.Count -gt 0) {
        Write-Host "    📁 $category/ → $($matched.Count) Scripts" -ForegroundColor Cyan

        if (-not $DryRun) {
            New-Item -ItemType Directory -Path $categoryPath -Force | Out-Null

            foreach ($file in $matched) {
                $dest = Join-Path $categoryPath $file.Name
                Move-Item -Path $file.FullName -Destination $dest -Force
                Write-Host "      ✓ $($file.Name)" -ForegroundColor Green
            }
        } else {
            foreach ($file in $matched) {
                Write-Host "      [DRY] $($file.Name)" -ForegroundColor DarkGray
            }
        }
    }
}
Write-Host ""

# 4. Optimierungs-Kommandos
Write-Host "4️⃣  Empfohlene Optimierungen:" -ForegroundColor Cyan
Write-Host ""

$commands = @()

# Zod vereinheitlichen
if ($zodVersions.Count -gt 1) {
    $commands += @"
# Zod-Versionen vereinheitlichen (auf $targetVersion)
cd $RootPath
bun remove zod
bun add zod@$targetVersion
"@
}

# Playwright entfernen (falls keine Tests)
if (-not $hasPlaywrightTests -and -not $hasE2ETests) {
    $commands += @"
# Playwright entfernen (keine Tests gefunden)
bun remove @playwright/test playwright
# Einsparung: ~500 MB
"@
}

# Package.json optimieren
$commands += @"
# Dependencies prüfen und optimieren
bun install --check
bun pm ls --all  # Zeigt alle installierten Packages
"@

foreach ($cmd in $commands) {
    Write-Host $cmd -ForegroundColor Yellow
    Write-Host ""
}

# 5. Ausführen
if (-not $DryRun -and -not $SkipInstall) {
    Write-Host "5️⃣  Optimierungen anwenden..." -ForegroundColor Cyan
    Write-Host ""

    $confirm = Read-Host "Optimierungen jetzt ausführen? (ja/nein)"

    if ($confirm -eq "ja") {
        # Zod vereinheitlichen
        if ($zodVersions.Count -gt 1) {
            Write-Host "  🔄 Vereinheitliche Zod..." -ForegroundColor Cyan
            & bun remove zod
            & bun add "zod@$targetVersion"
        }

        # Dependencies checken
        Write-Host "  ✅ Prüfe Dependencies..." -ForegroundColor Cyan
        & bun install --check

        Write-Host ""
        Write-Host "✅ Optimierung abgeschlossen!" -ForegroundColor Green
    } else {
        Write-Host "Abgebrochen." -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  Führe ohne -DryRun aus, um Änderungen anzuwenden" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📊 ZUSAMMENFASSUNG" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "Zod-Versionen: $($zodVersions.Count) → 1 (vereinheitlichen)" -ForegroundColor Yellow
Write-Host "Scripts organisiert: $(if (-not $DryRun) { 'Ja' } else { 'Nein (Dry-Run)' })" -ForegroundColor $(if (-not $DryRun) { 'Green' } else { 'Gray' })
Write-Host "Ungenutzte Deps: $(if (-not $hasPlaywrightTests) { 'Playwright (entfernen?)' } else { 'Keine' })" -ForegroundColor Yellow
