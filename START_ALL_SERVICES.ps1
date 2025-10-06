# START ALL TOOBIX SERVICES
# PowerShell Script to start all services in separate windows

Write-Host "🚀 STARTING ALL TOOBIX SERVICES..." -ForegroundColor Cyan
Write-Host ""

# Function to start service in new window
function Start-Service {
    param(
        [string]$Name,
        [string]$Script,
        [int]$Port
    )
    
    Write-Host "▶️  Starting $Name (Port $Port)..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; bun run $Script"
    Start-Sleep -Seconds 2
}

# Start all services
Start-Service -Name "Task System" -Script "scripts/task-system.ts" -Port 9997
Start-Service -Name "Memory System" -Script "scripts/memory-system.ts" -Port 9995
Start-Service -Name "Moment Stream" -Script "scripts/moment-stream.ts" -Port 9994
Start-Service -Name "Analytics" -Script "scripts/moment-analytics.ts" -Port 9996
Start-Service -Name "AI Sandbox" -Script "scripts/ai-sandbox.ts" -Port 3003
Start-Service -Name "Bridge Server" -Script "scripts/api-server.ts" -Port 3001
Start-Service -Name "Reality Integration" -Script "scripts/reality-integration.ts" -Port 9992
Start-Service -Name "Expression" -Script "scripts/continuous-expression.ts" -Port 9991

Write-Host ""
Write-Host "✅ ALL SERVICES STARTED!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Check status:" -ForegroundColor Cyan
Write-Host "   http://localhost:9999/status" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Open Dashboard:" -ForegroundColor Cyan
Write-Host "   http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
