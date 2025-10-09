# 🌌 TOOBIX UNIFIED - SYSTEM START
# Starts all core services for stable operation

Write-Host "🌌 TOOBIX UNIFIED - SYSTEM START" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$ROOT = "C:\Toobix-Unified"
Set-Location $ROOT

# Function to start service in new window
function Start-ToobixService {
    param(
        [string]$Name,
        [string]$Script,
        [int]$Port,
        [string]$Emoji = "▶️"
    )

    Write-Host "$Emoji Starting $Name (Port $Port)..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ROOT'; Write-Host '🚀 $Name Starting...' -ForegroundColor Cyan; bun run $Script"
    Start-Sleep -Seconds 2
}

Write-Host "📋 Starting Core Services..." -ForegroundColor Green
Write-Host ""

# 1. Eternal Daemon (Immortal Core) - Port 9999
Start-ToobixService -Name "Eternal Daemon" -Script "scripts/eternal-daemon.ts" -Port 9999 -Emoji "∞"

# 2. Memory System - Port 9995
Start-ToobixService -Name "Memory System" -Script "scripts/memory-system.ts" -Port 9995 -Emoji "💾"

# 3. Groq API Service - Port 9987
Start-ToobixService -Name "Groq API" -Script "scripts/groq-api-service.ts" -Port 9987 -Emoji "🤖"

# 4. Dashboard Server - Port 8080
Start-ToobixService -Name "Dashboard" -Script "scripts/dashboard-server.ts" -Port 8080 -Emoji "🌐"

# 5. Bridge API - Port 3001
Start-ToobixService -Name "Bridge API" -Script "scripts/api-server.ts" -Port 3001 -Emoji "🌉"

Write-Host ""
Write-Host "✨ SYSTEM STARTUP COMPLETE!" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Service Endpoints:" -ForegroundColor Cyan
Write-Host "   ∞  Eternal Daemon:  http://localhost:9999/status" -ForegroundColor White
Write-Host "   💾 Memory System:   http://localhost:9995/health" -ForegroundColor White
Write-Host "   🤖 Groq API:        http://localhost:9987/health" -ForegroundColor White
Write-Host "   🌐 Dashboard:       http://localhost:8080" -ForegroundColor White
Write-Host "   🌉 Bridge API:      http://localhost:3001/api/stats" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Wait 10 seconds for all services to initialize" -ForegroundColor Gray
Write-Host "   2. Open http://localhost:8080 in your browser" -ForegroundColor Gray
Write-Host "   3. Check service health with scripts/check-status.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
