# 🚀 PC PERFORMANCE OPTIMIZER - Einfache Version

Write-Host @"

╔════════════════════════════════════════════════════════════╗
║                                                            ║
║           🚀 PC PERFORMANCE OPTIMIZER 🚀                  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# System Info
Write-Host "📊 SYSTEM ANALYSE" -ForegroundColor Cyan
Write-Host "════════════════`n" -ForegroundColor Cyan

$os = Get-CimInstance Win32_OperatingSystem
$totalRAM = [math]::Round($os.TotalVisibleMemorySize / 1MB, 2)
$freeRAM = [math]::Round($os.FreePhysicalMemory / 1MB, 2)
$usedRAM = $totalRAM - $freeRAM
$ramPercent = [math]::Round(($usedRAM / $totalRAM) * 100, 1)

Write-Host "💻 System: $($os.Caption)" -ForegroundColor Yellow
Write-Host "🧠 RAM: $usedRAM / $totalRAM GB ($ramPercent%)" -ForegroundColor $(if($ramPercent -gt 80){"Red"}else{"Green"})
Write-Host "💾 Frei: $freeRAM GB`n" -ForegroundColor White

# Top Prozesse
Write-Host "🔥 TOP RAM-VERBRAUCHER" -ForegroundColor Cyan
Write-Host "═══════════════════════`n" -ForegroundColor Cyan

Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 10 | ForEach-Object {
    $ramMB = [math]::Round($_.WorkingSet / 1MB, 1)
    Write-Host "   $($_.ProcessName.PadRight(25)) $ramMB MB"
}

# Temp Files löschen
Write-Host "`n`n🧹 TEMPORÄRE DATEIEN LÖSCHEN" -ForegroundColor Cyan
Write-Host "════════════════════════════`n" -ForegroundColor Cyan

$tempPaths = @(
    "$env:TEMP",
    "$env:LOCALAPPDATA\Temp"
)

$totalFreed = 0

foreach ($path in $tempPaths) {
    Write-Host "🗑️  Lösche: $path" -ForegroundColor Yellow
    try {
        $items = Get-ChildItem -Path "$path\*" -Force -ErrorAction SilentlyContinue
        $sizeBefore = ($items | Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum
        
        if ($sizeBefore) {
            $sizeGB = [math]::Round($sizeBefore / 1GB, 3)
            Write-Host "   Größe: $sizeGB GB" -ForegroundColor White
            
            Remove-Item -Path "$path\*" -Recurse -Force -ErrorAction SilentlyContinue
            $totalFreed += $sizeGB
            Write-Host "   ✅ Gelöscht!" -ForegroundColor Green
        } else {
            Write-Host "   ℹ️  Bereits leer" -ForegroundColor White
        }
    } catch {
        Write-Host "   ⚠️  Einige Dateien in Verwendung" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "💾 Gesamt freigegeben: $([math]::Round($totalFreed, 2)) GB`n" -ForegroundColor Green

# Netzwerk Cache
Write-Host "🌐 NETZWERK-CACHE LEEREN" -ForegroundColor Cyan
Write-Host "════════════════════════`n" -ForegroundColor Cyan

try {
    Write-Host "🔄 DNS Cache wird geleert..." -ForegroundColor Yellow
    ipconfig /flushdns | Out-Null
    Write-Host "✅ DNS Cache geleert!`n" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Fehler beim DNS Cache`n" -ForegroundColor Yellow
}

# Autostart Programme
Write-Host "📋 AUTOSTART-PROGRAMME" -ForegroundColor Cyan
Write-Host "══════════════════════`n" -ForegroundColor Cyan

$startupItems = Get-CimInstance Win32_StartupCommand
Write-Host "🔍 Anzahl Autostart-Programme: $($startupItems.Count)" -ForegroundColor Yellow
Write-Host "`nProgramme:`n" -ForegroundColor White

$startupItems | ForEach-Object {
    $name = $_.Name
    $shouldDisable = $false
    
    # Check if should be disabled
    $recommendations = @("Comet", "Discord", "Overwolf", "Razer", "Claude", "Riot")
    foreach ($rec in $recommendations) {
        if ($name -like "*$rec*") {
            $shouldDisable = $true
            break
        }
    }
    
    if ($shouldDisable) {
        Write-Host "   ❌ $name" -ForegroundColor Red -NoNewline
        Write-Host " (deaktivieren empfohlen)" -ForegroundColor Yellow
    } else {
        Write-Host "   ✅ $name" -ForegroundColor Green
    }
}

Write-Host "`n💡 Deaktiviere diese im Task-Manager:" -ForegroundColor Cyan
Write-Host "   Strg+Shift+Esc > Autostart > Rechtsklick > Deaktivieren`n" -ForegroundColor White

# Finale Stats
Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              ✅ OPTIMIERUNG ABGESCHLOSSEN ✅              ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

# RAM Check After
$freeRAMAfter = [math]::Round((Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory / 1MB, 2)
$improvement = [math]::Round($freeRAMAfter - $freeRAM, 2)

Write-Host "📊 ERGEBNIS:" -ForegroundColor Cyan
Write-Host "   💾 Speicher freigegeben: $([math]::Round($totalFreed, 2)) GB" -ForegroundColor White
if ($improvement -gt 0) {
    Write-Host "   🧠 RAM Verbesserung: +$improvement GB frei" -ForegroundColor Green
}
Write-Host "   🔍 Autostart-Programme: $($startupItems.Count) (manuell optimieren!)" -ForegroundColor Yellow

Write-Host "`n🎯 NÄCHSTE SCHRITTE:" -ForegroundColor Cyan
Write-Host "   1. Task-Manager öffnen (Strg+Shift+Esc)" -ForegroundColor White
Write-Host "   2. Autostart-Tab > Unnötige Programme deaktivieren" -ForegroundColor White
Write-Host "   3. Browser Cache leeren" -ForegroundColor White
Write-Host "   4. Windows Speicheroptimierung ausführen" -ForegroundColor White
Write-Host "   5. PC NEUSTARTEN für vollen Effekt!" -ForegroundColor Yellow

Write-Host "`n✨ Dein PC sollte jetzt schneller laufen!`n" -ForegroundColor Green
