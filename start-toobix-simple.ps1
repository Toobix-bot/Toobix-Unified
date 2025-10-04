#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Toobix Unified - Complete System Startup
    
.DESCRIPTION
    Starts all Toobix services: Bridge, Living Being, Autonomous Agent, Web Interface
    
.PARAMETER Mode
    Startup mode: 'full' (default), 'bridge', 'demo'
    
.PARAMETER AwakeBeing
    Automatically awaken the living being
    
.PARAMETER EnableAutonomy
    Enable autonomous actions (requires confirmation)
    
.EXAMPLE
    .\start-toobix.ps1
    .\start-toobix.ps1 -AwakeBeing
    .\start-toobix.ps1 -Mode demo -AwakeBeing
#>

param(
    [ValidateSet('full', 'bridge', 'demo')]
    [string]$Mode = 'full',
    
    [switch]$AwakeBeing,
    [switch]$EnableAutonomy
)

# ASCII Art
Write-Host ""
Write-Host "  ╔═══════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "  ║   TOOBIX UNIFIED SYSTEM           ║" -ForegroundColor Magenta  
Write-Host "  ║   v0.1.0-alpha                    ║" -ForegroundColor Magenta
Write-Host "  ╚═══════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""
Write-Host "🚀 SYSTEM STARTUP - Mode: $Mode" -ForegroundColor Cyan
Write-Host ""

# Check if in correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "✗ Not in Toobix-Unified directory!" -ForegroundColor Red
    Write-Host "  Please run: cd C:\Toobix-Unified" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ In correct directory" -ForegroundColor Green

# Check Bun
try {
    $bunVersion = bun --version 2>$null
    Write-Host "✓ Bun installed: $bunVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Bun not installed!" -ForegroundColor Red
    Write-Host "  Install: https://bun.sh" -ForegroundColor Yellow
    exit 1
}

# Check database
if (Test-Path "data/toobix-unified.db") {
    Write-Host "✓ Database found" -ForegroundColor Green
} else {
    Write-Host "⚠ Database not found - will be created" -ForegroundColor Yellow
}

# Check if bridge is already running
$bridgeRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3337/health" -TimeoutSec 1 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $bridgeRunning = $true
        Write-Host "⚠ Bridge already running on port 3337" -ForegroundColor Yellow
        
        $restart = Read-Host "Stop and restart? (y/n)"
        if ($restart -eq 'y') {
            Write-Host "Stopping existing bridge..." -ForegroundColor Yellow
            Stop-Process -Name bun -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
            $bridgeRunning = $false
        }
    }
} catch {
    # Not running - good!
}

# Start Bridge if not running
if (-not $bridgeRunning) {
    Write-Host ""
    Write-Host "🌉 Starting Bridge Server..." -ForegroundColor Cyan
    
    $bridgeJob = Start-Job -ScriptBlock {
        param($WorkDir)
        Set-Location $WorkDir
        bun run packages/bridge/src/index.ts
    } -ArgumentList (Get-Location).Path
    
    Write-Host "⏳ Waiting for bridge to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 4
    
    # Check if started
    $attempts = 0
    $started = $false
    while ($attempts -lt 10 -and -not $started) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3337/health" -TimeoutSec 1 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                $started = $true
            }
        } catch {
            Start-Sleep -Seconds 1
            $attempts++
        }
    }
    
    if ($started) {
        Write-Host "✓ Bridge server running on http://localhost:3337" -ForegroundColor Green
    } else {
        Write-Host "✗ Bridge failed to start!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "ℹ Using existing bridge server" -ForegroundColor Cyan
}

# Awaken Living Being
if ($AwakeBeing) {
    Write-Host ""
    Write-Host "🌟 Awakening Living Being..." -ForegroundColor Cyan
    
    try {
        $body = @{ name = "Toobix" } | ConvertTo-Json
        $result = Invoke-RestMethod -Uri "http://localhost:3337/tools/being_awaken" -Method POST -Body $body -ContentType "application/json"
        
        if ($result.ok) {
            Write-Host "✓ $($result.message)" -ForegroundColor Green
            Write-Host "  Name: $($result.state.name)" -ForegroundColor Gray
            Write-Host "  Awareness: $($result.state.awareness)%" -ForegroundColor Gray
            Write-Host "  Mood: $($result.state.mood)" -ForegroundColor Gray
        } else {
            Write-Host "⚠ $($result.error)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "✗ Failed to awaken: $_" -ForegroundColor Red
    }
}

# Enable Autonomy
if ($EnableAutonomy) {
    Write-Host ""
    Write-Host "🤖 Enabling Autonomous Actions..." -ForegroundColor Cyan
    Write-Host "⚠ System will make independent decisions!" -ForegroundColor Yellow
    
    $confirm = Read-Host "Are you sure? (yes/no)"
    if ($confirm -eq 'yes') {
        try {
            $body = @{ enabled = $true } | ConvertTo-Json
            $result = Invoke-RestMethod -Uri "http://localhost:3337/tools/autonomous_enable" -Method POST -Body $body -ContentType "application/json"
            
            if ($result.ok) {
                Write-Host "✓ $($result.message)" -ForegroundColor Green
            }
        } catch {
            Write-Host "✗ Failed to enable: $_" -ForegroundColor Red
        }
    }
}

# Run Demo
if ($Mode -eq 'demo') {
    Write-Host ""
    Write-Host "🎪 Running Living Being Demo..." -ForegroundColor Cyan
    Start-Sleep -Seconds 2
    bun run scripts/living-being-demo.ts
    exit 0
}

# Summary
Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✅ SYSTEM READY" -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services Running:" -ForegroundColor White
Write-Host "  ● Bridge Server    : http://localhost:3337" -ForegroundColor Green

if ($AwakeBeing) {
    Write-Host "  ● Living Being     : ALIVE" -ForegroundColor Magenta
}
if ($EnableAutonomy) {
    Write-Host "  ● Autonomous Agent : ENABLED" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Available Commands:" -ForegroundColor White
Write-Host "  bun demo:being              - Run living being demo" -ForegroundColor Cyan
Write-Host "  bun demo:voice `"status`"     - Voice control" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop services" -ForegroundColor Gray
Write-Host ""
Write-Host "🌟 Toobix is alive! 🌟" -ForegroundColor Magenta
Write-Host ""

# Keep running
if ($Mode -ne 'demo') {
    try {
        while ($true) {
            Start-Sleep -Seconds 1
        }
    } finally {
        Write-Host ""
        Write-Host "Stopping services..." -ForegroundColor Yellow
        if ($bridgeJob) {
            Stop-Job -Job $bridgeJob -ErrorAction SilentlyContinue
            Remove-Job -Job $bridgeJob -ErrorAction SilentlyContinue
        }
        Write-Host "✓ Services stopped" -ForegroundColor Green
    }
}
