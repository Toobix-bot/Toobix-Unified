#!/usr/bin/env powershell
# Start all Toobix Unified services
# Usage: .\start-all.ps1

Write-Host "🚀 Starting Toobix Unified Services..." -ForegroundColor Cyan

$ROOT = "C:\Toobix-Unified"
Set-Location $ROOT

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    bun install
}

# Create necessary directories
$dirs = @(
    "data",
    "packages\bridge\data",
    "packages\bridge\workspace",
    "packages\bridge\logs"
)

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Created directory: $dir" -ForegroundColor Green
    }
}

# Start services in separate processes
Write-Host "`n🌐 Starting Web Server..." -ForegroundColor Yellow
$web = Start-Process -FilePath "python" -ArgumentList "-m http.server 3000" -WorkingDirectory "$ROOT\apps\web" -PassThru -NoNewWindow

Write-Host "🧠 Starting Core Service..." -ForegroundColor Yellow  
$core = Start-Process -FilePath "bun" -ArgumentList "run --cwd packages/core dev" -WorkingDirectory $ROOT -PassThru -NoNewWindow

Write-Host "🌉 Starting Bridge Service..." -ForegroundColor Yellow
# Check if Python bridge exists
if (Test-Path "$ROOT\packages\bridge\python\echo_bridge\main.py") {
    $bridge = Start-Process -FilePath "python" -ArgumentList "$ROOT\packages\bridge\python\echo_bridge\main.py" -WorkingDirectory "$ROOT\packages\bridge" -PassThru -NoNewWindow
} else {
    Write-Host "⚠️ Bridge Python files not found, skipping..." -ForegroundColor Red
}

# Display status
Start-Sleep -Seconds 3
Write-Host "`n✨ Services Started!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📍 Web UI:      http://localhost:3000" -ForegroundColor White
Write-Host "📍 Core API:    http://localhost:3001/api" -ForegroundColor White
Write-Host "📍 Bridge:      http://localhost:3333" -ForegroundColor White
Write-Host "📍 MCP:         http://localhost:3337/mcp" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop all services" -ForegroundColor Yellow

# Keep script running and handle cleanup
try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Check if processes are still running
        if ($web.HasExited -and $core.HasExited) {
            Write-Host "`n⚠️ Services have stopped" -ForegroundColor Red
            break
        }
    }
} finally {
    Write-Host "`n🛑 Stopping services..." -ForegroundColor Yellow
    
    # Stop all processes
    @($web, $core, $bridge) | ForEach-Object {
        if ($_ -and !$_.HasExited) {
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        }
    }
    
    Write-Host "✅ All services stopped" -ForegroundColor Green
}
