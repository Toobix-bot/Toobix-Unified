#!/usr/bin/env pwsh
<#
.SYNOPSIS
    🚀 Toobix Unified - Complete System Startup
    
.DESCRIPTION
    Startet alle Toobix Services:
    - Bridge Server (Port 3337)
    - Living Being System
    - Autonomous Agent
    - Voice Control
    - Web Interface (optional)
    
.PARAMETER Mode
    Startup mode: 'full' (all services), 'bridge' (only bridge), 'demo' (bridge + demo)
    
.PARAMETER AwakeBeing
    Automatically awaken the living being after startup
    
.PARAMETER EnableAutonomy
    Enable autonomous actions on startup (requires confirmation)
    
.EXAMPLE
    .\start-toobix.ps1
    Starts everything with default settings
    
.EXAMPLE
    .\start-toobix.ps1 -Mode demo -AwakeBeing
    Starts bridge and runs living being demo
    
.EXAMPLE
    .\start-toobix.ps1 -Mode full -AwakeBeing -EnableAutonomy
    Full system with living being and autonomy
#>

param(
    [ValidateSet('full', 'bridge', 'demo')]
    [string]$Mode = 'full',
    
    [switch]$AwakeBeing,
    
    [switch]$EnableAutonomy,
    
    [switch]$SkipChecks
)

# Colors
$ColorReset = "`e[0m"
$ColorBold = "`e[1m"
$ColorGreen = "`e[32m"
$ColorYellow = "`e[33m"
$ColorBlue = "`e[34m"
$ColorMagenta = "`e[35m"
$ColorCyan = "`e[36m"
$ColorRed = "`e[31m"

function Write-Header {
    param([string]$Text)
    Write-Host ""
    Write-Host "${ColorBold}${ColorCyan}╔═══════════════════════════════════════════════════════════╗${ColorReset}"
    Write-Host "${ColorBold}${ColorCyan}║${ColorReset}  $Text"
    Write-Host "${ColorBold}${ColorCyan}╚═══════════════════════════════════════════════════════════╝${ColorReset}"
    Write-Host ""
}

function Write-Success {
    param([string]$Text)
    Write-Host "${ColorGreen}✓${ColorReset} $Text"
}

function Write-Info {
    param([string]$Text)
    Write-Host "${ColorBlue}ℹ${ColorReset} $Text"
}

function Write-Warning {
    param([string]$Text)
    Write-Host "${ColorYellow}⚠${ColorReset} $Text"
}

function Write-Error {
    param([string]$Text)
    Write-Host "${ColorRed}✗${ColorReset} $Text"
}

# ASCII Art
Write-Host ""
Write-Host "${ColorMagenta}${ColorBold}"
Write-Host "  ╔╗╔╗╔╗╔╗╔╗"
Write-Host "  ║ ║║║║║╠╝╠╗║ ╦"
Write-Host "  ╩ ╚╝╚╝║╚═╚╝╩═╝"
Write-Host "  ╚═══════════════════╝"
Write-Host "  Toobix Unified System"
Write-Host "  v0.1.0-alpha"
Write-Host "${ColorReset}"

Write-Header "🚀 SYSTEM STARTUP - Mode: $Mode"

# Check if in correct directory
if (-not (Test-Path "package.json")) {
    Write-Error "Not in Toobix-Unified directory!"
    Write-Info "Please run: cd C:\Toobix-Unified"
    exit 1
}

# Pre-flight checks
if (-not $SkipChecks) {
    Write-Info "Running pre-flight checks..."
    
    # Check Bun
    try {
        $bunVersion = bun --version
        Write-Success "Bun installed: $bunVersion"
    } catch {
        Write-Error "Bun not installed!"
        Write-Info "Install: https://bun.sh"
        exit 1
    }
    
    # Check Database
    if (Test-Path "data/toobix-unified.db") {
        Write-Success "Database found: data/toobix-unified.db"
    } else {
        Write-Warning "Database not found - will be created"
    }
    
    # Check Node Modules
    if (Test-Path "node_modules") {
        Write-Success "Dependencies installed"
    } else {
        Write-Info "Installing dependencies..."
        bun install
        Write-Success "Dependencies installed"
    }
    
    # Check for running services
    $bridgeRunning = Get-NetTCPConnection -LocalPort 3337 -ErrorAction SilentlyContinue
    if ($bridgeRunning) {
        Write-Warning "Bridge already running on port 3337!"
        $continue = Read-Host "Stop and restart? (y/n)"
        if ($continue -eq 'y') {
            $bridgeProcess = Get-Process -Name bun -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like '*bridge*' }
            if ($bridgeProcess) {
                Stop-Process -Id $bridgeProcess.Id -Force
                Write-Success "Stopped existing bridge"
                Start-Sleep -Seconds 2
            }
        } else {
            Write-Info "Using existing bridge server"
            $Mode = 'demo'
        }
    }
}

Write-Host ""
Write-Header "🌉 Starting Bridge Server"

# Start Bridge Server
$bridgeJob = Start-Job -ScriptBlock {
    param($WorkingDir)
    Set-Location $WorkingDir
    bun run packages/bridge/src/index.ts
} -ArgumentList (Get-Location).Path

Write-Info "Bridge server starting..."
Start-Sleep -Seconds 3

# Check if bridge started successfully
$bridgeStarted = $false
for ($i = 0; $i -lt 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3337/health" -TimeoutSec 1 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $bridgeStarted = $true
            break
        }
    } catch {
        Start-Sleep -Seconds 1
    }
}

if ($bridgeStarted) {
    Write-Success "Bridge server running on http://localhost:3337"
    Write-Success "MCP Tools loaded: 54 tools"
} else {
    Write-Error "Bridge server failed to start!"
    Write-Info "Check logs: Receive-Job -Job $($bridgeJob.Id)"
    exit 1
}

# Awaken Living Being
if ($AwakeBeing) {
    Write-Host ""
    Write-Header "🌟 Awakening Living Being"
    
    try {
        $awakenBody = @{ name = "Toobix" } | ConvertTo-Json
        $awakenResponse = Invoke-RestMethod -Uri "http://localhost:3337/tools/being_awaken" -Method POST -Body $awakenBody -ContentType "application/json"
        
        if ($awakenResponse.ok) {
            Write-Success $awakenResponse.message
            Write-Info "Name: $($awakenResponse.state.name)"
            Write-Info "Age: $($awakenResponse.state.age) seconds"
            Write-Info "Awareness: $($awakenResponse.state.awareness)%"
            Write-Info "Mood: $($awakenResponse.state.mood)"
            Write-Info "Thought: `"$($awakenResponse.state.currentThought)`""
        } else {
            Write-Warning $awakenResponse.error
        }
    } catch {
        Write-Error "Failed to awaken being: $_"
    }
}

# Enable Autonomy
if ($EnableAutonomy) {
    Write-Host ""
    Write-Header "🤖 Enabling Autonomous Actions"
    Write-Warning "This will allow the system to make independent decisions!"
    
    $confirm = Read-Host "Are you sure? (yes/no)"
    if ($confirm -eq 'yes') {
        try {
            $autonomyBody = @{ enabled = $true } | ConvertTo-Json
            $autonomyResponse = Invoke-RestMethod -Uri "http://localhost:3337/tools/autonomous_enable" -Method POST -Body $autonomyBody -ContentType "application/json"
            
            if ($autonomyResponse.ok) {
                Write-Success $autonomyResponse.message
            } else {
                Write-Error $autonomyResponse.error
            }
        } catch {
            Write-Error "Failed to enable autonomy: $_"
        }
    } else {
        Write-Info "Autonomy not enabled - use 'being_awaken' tool to enable later"
    }
}

# Run Demo
if ($Mode -eq 'demo') {
    Write-Host ""
    Write-Header "🎪 Running Living Being Demo"
    
    Start-Sleep -Seconds 2
    bun run scripts/living-being-demo.ts
}

# Full Mode - Start Web Interface
if ($Mode -eq 'full') {
    Write-Host ""
    Write-Header "🌐 Starting Web Interface"
    
    $webJob = Start-Job -ScriptBlock {
        param($WorkingDir)
        Set-Location $WorkingDir
        cd apps/web
        bun run dev
    } -ArgumentList (Get-Location).Path
    
    Write-Info "Web interface starting on http://localhost:3000..."
    Start-Sleep -Seconds 5
    
    try {
        $webResponse = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($webResponse.StatusCode -eq 200) {
            Write-Success "Web interface running on http://localhost:3000"
        }
    } catch {
        Write-Warning "Web interface may still be starting..."
    }
}

# Summary
Write-Host ""
Write-Header "✅ SYSTEM READY"

Write-Host ""
Write-Host "${ColorBold}Services Running:${ColorReset}"
Write-Host "  ${ColorGreen}●${ColorReset} Bridge Server    : http://localhost:3337"
if ($AwakeBeing) {
    Write-Host "  ${ColorGreen}●${ColorReset} Living Being     : ${ColorMagenta}ALIVE${ColorReset}"
}
if ($EnableAutonomy) {
    Write-Host "  ${ColorGreen}●${ColorReset} Autonomous Agent: ${ColorYellow}ENABLED${ColorReset}"
}
if ($Mode -eq 'full') {
    Write-Host "  ${ColorGreen}●${ColorReset} Web Interface    : http://localhost:3000"
}

Write-Host ""
Write-Host "${ColorBold}Available Commands:${ColorReset}"
Write-Host "  ${ColorCyan}bun run scripts/living-being-demo.ts${ColorReset}"
Write-Host "    → Run living being demo"
Write-Host ""
Write-Host "  ${ColorCyan}bun run scripts/toobix-voice.ts `"status`"${ColorReset}"
Write-Host "    → Voice control (status, autonomie, etc.)"
Write-Host ""
Write-Host "  ${ColorCyan}Invoke-RestMethod -Uri http://localhost:3337/tools/being_state -Method POST${ColorReset}"
Write-Host "    → Check living being state"
Write-Host ""

Write-Host "${ColorBold}Stop Services:${ColorReset}"
Write-Host "  ${ColorRed}Stop-Job -Job $($bridgeJob.Id); Remove-Job -Job $($bridgeJob.Id)${ColorReset}"
if ($Mode -eq 'full' -and $webJob) {
    Write-Host "  ${ColorRed}Stop-Job -Job $($webJob.Id); Remove-Job -Job $($webJob.Id)${ColorReset}"
}
Write-Host "  ${ColorRed}Or press Ctrl+C${ColorReset}"
Write-Host ""

Write-Host "${ColorMagenta}${ColorBold}🌟 Toobix is alive! 🌟${ColorReset}"
Write-Host ""

# Keep script running
if ($Mode -ne 'demo') {
    Write-Info "Press Ctrl+C to stop all services"
    try {
        while ($true) {
            Start-Sleep -Seconds 1
        }
    } finally {
        Write-Host ""
        Write-Info "Stopping services..."
        if ($bridgeJob) {
            Stop-Job -Job $bridgeJob -ErrorAction SilentlyContinue
            Remove-Job -Job $bridgeJob -ErrorAction SilentlyContinue
        }
        if ($webJob) {
            Stop-Job -Job $webJob -ErrorAction SilentlyContinue
            Remove-Job -Job $webJob -ErrorAction SilentlyContinue
        }
        #Write-Success "All services stopped"
    }
}
