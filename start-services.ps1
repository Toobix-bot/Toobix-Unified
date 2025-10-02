# Start All Toobix Services
Write-Host "🚀 Starting Toobix Unified Services..." -ForegroundColor Cyan
Write-Host ""

# Set environment
$env:GROQ_API_KEY = (Get-Content .env | Select-String "GROQ_API_KEY" | ForEach-Object { ($_ -replace 'GROQ_API_KEY=', '').Trim() })

Write-Host "Environment loaded" -ForegroundColor Green
Write-Host "Groq API Key configured" -ForegroundColor Gray
Write-Host ""

# Kill existing processes
Get-Process -Name "bun","python" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

# Start Main API Server (Port 3001)
Write-Host "📊 Starting Main API Server (Port 3001)..." -ForegroundColor Yellow
Start-Process -FilePath "C:\Users\micha\.bun\bin\bun.exe" -ArgumentList "run","scripts/api-server.ts" -WorkingDirectory $PWD -WindowStyle Hidden

Start-Sleep -Seconds 2

# Start Diary Service (Port 3002)
Write-Host "📔 Starting Diary Service (Port 3002)..." -ForegroundColor Yellow
Start-Process -FilePath "C:\Users\micha\.bun\bin\bun.exe" -ArgumentList "run","scripts/diary-service.ts" -WorkingDirectory $PWD -WindowStyle Hidden

Start-Sleep -Seconds 2

# Start Bridge Service (Port 3337)
Write-Host "🌉 Starting Bridge Service (Port 3337)..." -ForegroundColor Yellow
Start-Process -FilePath "C:\Users\micha\.bun\bin\bun.exe" -ArgumentList "run","packages/bridge/src/index.ts" -WorkingDirectory $PWD -WindowStyle Hidden

Start-Sleep -Seconds 2

# Start Frontend Dev Server (Port 3000)
Write-Host "🌐 Starting Frontend Server (Port 3000)..." -ForegroundColor Yellow
Start-Process -FilePath "python" -ArgumentList "-m","http.server","3000","--directory","apps/web" -WorkingDirectory $PWD -WindowStyle Hidden

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Service URLs:" -ForegroundColor Cyan
Write-Host "   Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "   Main API:  http://localhost:3001" -ForegroundColor White
Write-Host "   Diary API: http://localhost:3002" -ForegroundColor White
Write-Host "   Bridge:    http://localhost:3337" -ForegroundColor White
Write-Host ""
Write-Host "🧪 Testing services..." -ForegroundColor Yellow

Start-Sleep -Seconds 3

try {
    $stats = Invoke-RestMethod -Uri "http://localhost:3001/api/stats" -TimeoutSec 5
    Write-Host "   ✅ Main API: OK" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Main API: FAILED" -ForegroundColor Red
}

try {
    $health = Invoke-RestMethod -Uri "http://localhost:3002/health" -TimeoutSec 5
    Write-Host "   ✅ Diary API: OK (Groq: $($health.groq))" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Diary API: FAILED" -ForegroundColor Red
}

try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    Write-Host "   ✅ Frontend: OK" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Frontend: FAILED" -ForegroundColor Red
}

try {
    $bridge = Invoke-RestMethod -Uri "http://localhost:3337/health" -TimeoutSec 5
    Write-Host "   ✅ Bridge: OK ($($bridge.tools) tools)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Bridge: FAILED" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 Ready! Open http://localhost:3000 in your browser" -ForegroundColor Cyan
Write-Host ""
