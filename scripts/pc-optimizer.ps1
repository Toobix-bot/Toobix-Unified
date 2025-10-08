#!/usr/bin/env pwsh
<#
.SYNOPSIS
    🚀 PC Performance Optimizer
    
.DESCRIPTION
    Optimiert deinen Windows PC für bessere Performance
    - Temporäre Dateien löschen
    - RAM freigeben
    - Disk Cleanup
    - Netzwerk-Cache leeren
    - System-Performance analysieren
    
.EXAMPLE
    .\pc-optimizer.ps1
    
.NOTES
    Author: Toobix AI Assistant
    Date: 7. Oktober 2025
#>

Write-Host @"

╔════════════════════════════════════════════════════════════╗
║                                                            ║
║           🚀 PC PERFORMANCE OPTIMIZER 🚀                  ║
║                                                            ║
║  Optimiert deinen PC für maximale Performance             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# Require Admin Rights
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  WARNUNG: Einige Optimierungen benötigen Admin-Rechte!" -ForegroundColor Yellow
    Write-Host "   Starte PowerShell als Administrator für volle Funktionalität`n" -ForegroundColor Yellow
}

# ═══════════════════════════════════════════════════════════
# 📊 SYSTEM ANALYSE
# ═══════════════════════════════════════════════════════════

function Get-SystemInfo {
    Write-Host "`n📊 SYSTEM ANALYSE" -ForegroundColor Cyan
    Write-Host "══════════════════`n" -ForegroundColor Cyan
    
    $os = Get-CimInstance Win32_OperatingSystem
    $cpu = Get-CimInstance Win32_Processor
    $disk = Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='C:'"
    
    # RAM Info
    $totalRAM = [math]::Round($os.TotalVisibleMemorySize / 1MB, 2)
    $freeRAM = [math]::Round($os.FreePhysicalMemory / 1MB, 2)
    $usedRAM = $totalRAM - $freeRAM
    $ramPercent = [math]::Round(($usedRAM / $totalRAM) * 100, 1)
    
    # Disk Info
    $diskFreeGB = [math]::Round($disk.FreeSpace / 1GB, 2)
    $diskTotalGB = [math]::Round($disk.Size / 1GB, 2)
    $diskUsedGB = $diskTotalGB - $diskFreeGB
    $diskPercent = [math]::Round(($diskUsedGB / $diskTotalGB) * 100, 1)
    
    Write-Host "💻 System:" -ForegroundColor Yellow
    Write-Host "   OS: $($os.Caption)"
    Write-Host "   CPU: $($cpu.Name)"
    Write-Host "   Cores: $($cpu.NumberOfCores) | Threads: $($cpu.NumberOfLogicalProcessors)"
    
    Write-Host "`n🧠 RAM:" -ForegroundColor Yellow
    Write-Host "   Total: $totalRAM GB"
    $ramColor = if($ramPercent -gt 80) { "Red" } elseif($ramPercent -gt 60) { "Yellow" } else { "Green" }
    Write-Host "   Verwendet: $usedRAM GB ($ramPercent%)" -ForegroundColor $ramColor
    Write-Host "   Frei: $freeRAM GB"
    
    Write-Host "`n💾 Disk C:\" -ForegroundColor Yellow
    Write-Host "   Total: $diskTotalGB GB"
    $diskColor = if($diskPercent -gt 90) { "Red" } elseif($diskPercent -gt 80) { "Yellow" } else { "Green" }
    Write-Host "   Verwendet: $diskUsedGB GB ($diskPercent%)" -ForegroundColor $diskColor
    Write-Host "   Frei: $diskFreeGB GB"
    
    # Return values for later use
    return @{
        RAMPercent = $ramPercent
        DiskPercent = $diskPercent
        FreeRAM = $freeRAM
        FreeDisk = $diskFreeGB
    }
}

# ═══════════════════════════════════════════════════════════
# 🔥 TOP RESSOURCE-VERBRAUCHER
# ═══════════════════════════════════════════════════════════

function Get-TopProcesses {
    Write-Host "`n🔥 TOP RESSOURCE-VERBRAUCHER" -ForegroundColor Cyan
    Write-Host "════════════════════════════`n" -ForegroundColor Cyan
    
    $topRAM = Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 10
    
    Write-Host "📊 Top 10 RAM-Verbraucher:" -ForegroundColor Yellow
    $topRAM | ForEach-Object {
        $ramMB = [math]::Round($_.WorkingSet / 1MB, 1)
        Write-Host "   $($_.ProcessName.PadRight(25)) $ramMB MB"
    }
}

# ═══════════════════════════════════════════════════════════
# 🧹 CLEANUP: TEMPORÄRE DATEIEN
# ═══════════════════════════════════════════════════════════

function Clear-TempFiles {
    Write-Host "`n🧹 TEMPORÄRE DATEIEN LÖSCHEN" -ForegroundColor Cyan
    Write-Host "════════════════════════════`n" -ForegroundColor Cyan
    
    $tempPaths = @(
        "$env:TEMP",
        "$env:LOCALAPPDATA\Temp",
        "C:\Windows\Temp"
    )
    
    $totalFreed = 0
    
    foreach ($path in $tempPaths) {
        if (Test-Path $path) {
            try {
                $items = Get-ChildItem -Path "$path\*" -Force -ErrorAction SilentlyContinue
                $sizeBefore = ($items | Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum
                
                if ($sizeBefore) {
                    $sizeGB = [math]::Round($sizeBefore / 1GB, 2)
                    Write-Host "🗑️  $path" -ForegroundColor Yellow
                    Write-Host "   Größe: $sizeGB GB" -ForegroundColor White
                    
                    Remove-Item -Path "$path\*" -Recurse -Force -ErrorAction SilentlyContinue
                    
                    $totalFreed += $sizeGB
                    Write-Host "   ✅ Gelöscht!" -ForegroundColor Green
                }
            } catch {
                Write-Host "   ⚠️  Einige Dateien konnten nicht gelöscht werden (in Verwendung)" -ForegroundColor Yellow
            }
        }
    }
    
    Write-Host "`n💾 Gesamt freigegeben: $totalFreed GB" -ForegroundColor Green
    return $totalFreed
}

# ═══════════════════════════════════════════════════════════
# 🌐 NETZWERK-CACHE LEEREN
# ═══════════════════════════════════════════════════════════

function Clear-NetworkCache {
    Write-Host "`n🌐 NETZWERK-CACHE LEEREN" -ForegroundColor Cyan
    Write-Host "════════════════════════════`n" -ForegroundColor Cyan
    
    try {
        Write-Host "🔄 DNS Cache wird geleert..." -ForegroundColor Yellow
        ipconfig /flushdns | Out-Null
        Write-Host "✅ DNS Cache geleert!" -ForegroundColor Green
        
        Write-Host "`n🔄 NetBIOS Cache wird geleert..." -ForegroundColor Yellow
        nbtstat -R | Out-Null
        Write-Host "✅ NetBIOS Cache geleert!" -ForegroundColor Green
        
        Write-Host "`n🔄 NetBIOS Namen werden neu geladen..." -ForegroundColor Yellow
        nbtstat -RR | Out-Null
        Write-Host "✅ NetBIOS Namen neu geladen!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Fehler beim Leeren des Netzwerk-Cache" -ForegroundColor Yellow
    }
}

# ═══════════════════════════════════════════════════════════
# 💾 WINDOWS DISK CLEANUP
# ═══════════════════════════════════════════════════════════

function Start-DiskCleanup {
    Write-Host "`n💾 WINDOWS DISK CLEANUP" -ForegroundColor Cyan
    Write-Host "═══════════════════════`n" -ForegroundColor Cyan
    
    if ($isAdmin) {
        Write-Host "🔄 Starte Disk Cleanup (dies kann einige Minuten dauern)..." -ForegroundColor Yellow
        
        # CleanMgr mit automatischen Flags
        Start-Process -FilePath "cleanmgr.exe" -ArgumentList "/sagerun:1" -Wait -NoNewWindow -ErrorAction SilentlyContinue
        
        Write-Host "✅ Disk Cleanup abgeschlossen!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Disk Cleanup benötigt Admin-Rechte" -ForegroundColor Yellow
        Write-Host "   Starte manuell: cleanmgr.exe" -ForegroundColor White
    }
}

# ═══════════════════════════════════════════════════════════
# ⚡ SSD TRIM (falls vorhanden)
# ═══════════════════════════════════════════════════════════

function Optimize-SSD {
    Write-Host "`n⚡ SSD OPTIMIERUNG" -ForegroundColor Cyan
    Write-Host "══════════════════`n" -ForegroundColor Cyan
    
    try {
        $drives = Get-PhysicalDisk
        $hasSSD = $drives | Where-Object { $_.MediaType -eq "SSD" }
        
        if ($hasSSD) {
            Write-Host "🔍 SSD erkannt: $($hasSSD.FriendlyName)" -ForegroundColor Green
            
            if ($isAdmin) {
                Write-Host "🔄 TRIM-Befehl wird ausgeführt..." -ForegroundColor Yellow
                Optimize-Volume -DriveLetter C -ReTrim -Verbose
                Write-Host "✅ SSD optimiert!" -ForegroundColor Green
            } else {
                Write-Host "⚠️  TRIM benötigt Admin-Rechte" -ForegroundColor Yellow
            }
        } else {
            Write-Host "ℹ️  Keine SSD erkannt (HDD vorhanden)" -ForegroundColor White
        }
    } catch {
        Write-Host "⚠️  SSD-Optimierung fehlgeschlagen" -ForegroundColor Yellow
    }
}

# ═══════════════════════════════════════════════════════════
# 📋 AUTOSTART-PROGRAMME ANALYSIEREN
# ═══════════════════════════════════════════════════════════

function Get-AutostartPrograms {
    Write-Host "`n📋 AUTOSTART-PROGRAMME" -ForegroundColor Cyan
    Write-Host "══════════════════════`n" -ForegroundColor Cyan
    
    $startupItems = Get-CimInstance Win32_StartupCommand
    
    Write-Host "🔍 Programme die beim Start geladen werden ($($startupItems.Count)):" -ForegroundColor Yellow
    
    $startupItems | ForEach-Object {
        Write-Host "   • $($_.Name)" -ForegroundColor White
    }
    
    Write-Host "`n💡 TIPP: Deaktiviere unnötige Autostart-Programme in:" -ForegroundColor Cyan
    Write-Host "   Task-Manager (Strg+Shift+Esc) > Autostart" -ForegroundColor White
    
    # Empfehlungen
    Write-Host "`n⚡ Empfehlung zum Deaktivieren:" -ForegroundColor Yellow
    $recommendations = @("Comet", "Discord", "Overwolf", "RazerCortex", "Claude", "RiotClient")
    
    $startupItems | ForEach-Object {
        foreach ($rec in $recommendations) {
            if ($_.Name -like "*$rec*") {
                Write-Host "   ❌ $($_.Name) - nicht beim Start nötig" -ForegroundColor Red
            }
        }
    }
}

# ═══════════════════════════════════════════════════════════
# 🎯 PERFORMANCE-TIPPS
# ═══════════════════════════════════════════════════════════

function Show-PerformanceTips {
    Write-Host "`n🎯 ZUSÄTZLICHE PERFORMANCE-TIPPS" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════`n" -ForegroundColor Cyan
    
    Write-Host "💡 Windows Einstellungen:" -ForegroundColor Yellow
    Write-Host "   1. Einstellungen > System > Speicher > Speicheroptimierung"
    Write-Host "   2. Einstellungen > Datenschutz > Hintergrund-Apps deaktivieren"
    Write-Host "   3. Einstellungen > System > Benachrichtigungen reduzieren"
    
    Write-Host "`n💡 Browser optimieren:" -ForegroundColor Yellow
    Write-Host "   1. Cache regelmäßig leeren"
    Write-Host "   2. Unnötige Extensions deaktivieren"
    Write-Host "   3. Tabs-Limit setzen (zu viele Tabs = hoher RAM)"
    
    Write-Host "`n💡 VS Code optimieren:" -ForegroundColor Yellow
    Write-Host "   1. Extensions reduzieren"
    Write-Host "   2. Files.exclude für node_modules"
    Write-Host "   3. Terminal Buffer Size begrenzen"
    Write-Host "   4. Git Auto-Fetch deaktivieren wenn nicht benötigt"
    
    Write-Host "`n💡 System Wartung:" -ForegroundColor Yellow
    Write-Host "   1. Windows Updates installieren"
    Write-Host "   2. Treiber aktualisieren"
    Write-Host "   3. Virenscanner-Scans zeitlich planen"
    Write-Host "   4. Regelmäßig neustarten (1x pro Woche)"
}

# ═══════════════════════════════════════════════════════════
# 🚀 HAUPTPROGRAMM
# ═══════════════════════════════════════════════════════════

function Start-Optimization {
    $startTime = Get-Date
    
    # System analysieren
    $sysInfo = Get-SystemInfo
    
    # Top Prozesse anzeigen
    Get-TopProcesses
    
    # Autostart Programme
    Get-AutostartPrograms
    
    Write-Host "`n`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║         AUTOMATISCHE OPTIMIERUNGEN STARTEN?               ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green
    
    Write-Host "Folgende Optimierungen werden durchgeführt:" -ForegroundColor Yellow
    Write-Host "  1. ✅ Temporäre Dateien löschen"
    Write-Host "  2. ✅ Netzwerk-Cache leeren"
    Write-Host "  3. ✅ SSD TRIM (falls vorhanden)"
    Write-Host "  4. ⚠️  Disk Cleanup (benötigt Admin)"
    
    Write-Host "`nFortfahren? (J/N): " -ForegroundColor Cyan -NoNewline
    $answer = Read-Host
    
    if ($answer -eq "J" -or $answer -eq "j" -or $answer -eq "Y" -or $answer -eq "y") {
        Write-Host "`n🚀 OPTIMIERUNG LÄUFT...`n" -ForegroundColor Green
        
        # Cleanup durchführen
        $freedSpace = Clear-TempFiles
        Clear-NetworkCache
        Optimize-SSD
        
        if ($isAdmin) {
            Start-DiskCleanup
        }
        
        # Abschluss
        $endTime = Get-Date
        $duration = ($endTime - $startTime).TotalSeconds
        
        Write-Host "`n`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║              ✅ OPTIMIERUNG ABGESCHLOSSEN ✅              ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green
        
        Write-Host "⏱️  Dauer: $([math]::Round($duration, 1)) Sekunden" -ForegroundColor White
        Write-Host "💾 Speicher freigegeben: ca. $freedSpace GB" -ForegroundColor White
        Write-Host "`n🔄 Neustart empfohlen für beste Performance!" -ForegroundColor Yellow
        
        # Neue System-Info
        Write-Host "`n📊 SYSTEM NACH OPTIMIERUNG:" -ForegroundColor Cyan
        $sysInfoAfter = Get-SystemInfo
        
    } else {
        Write-Host "`n❌ Optimierung abgebrochen" -ForegroundColor Red
    }
    
    # Performance Tipps
    Show-PerformanceTips
    
    Write-Host "`n`n✨ Optimierung abgeschlossen! Dein PC sollte jetzt schneller laufen.`n" -ForegroundColor Green
}

# Script starten
Start-Optimization
