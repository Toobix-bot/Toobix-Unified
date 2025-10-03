# Toobix Unified - System Status Check

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TOOBIX SYSTEM STATUS CHECK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to test HTTP endpoint
function Test-Endpoint {
    param($Name, $URL)
    
    Write-Host "Testing $Name..." -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $URL -Method GET -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
        Write-Host " ONLINE" -ForegroundColor Green
        Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Gray
        return $true
    } 
    catch {
        Write-Host " OFFLINE" -ForegroundColor Red
        Write-Host "  Error: Connection failed" -ForegroundColor Gray
        return $false
    }
}

# Function to check process
function Test-Process {
    param($Name, $ProcessName)
    
    Write-Host "Checking $Name..." -NoNewline
    
    $processes = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
    if ($processes) {
        Write-Host " RUNNING" -ForegroundColor Green
        Write-Host "  PIDs: $($processes.Id -join ', ')" -ForegroundColor Gray
        return $true
    } 
    else {
        Write-Host " NOT RUNNING" -ForegroundColor Red
        return $false
    }
}

# 1. Check Bun Runtime
Write-Host ""
Write-Host "1. BUN RUNTIME" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor DarkGray
try {
    $bunVersion = & bun --version 2>&1
    Write-Host "Bun installed: v$bunVersion" -ForegroundColor Green
} 
catch {
    Write-Host "Bun not found!" -ForegroundColor Red
}

# 2. Check Database
Write-Host ""
Write-Host "2. DATABASE" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor DarkGray
$dbPath = "C:\Toobix-Unified\data\toobix-unified.db"
if (Test-Path $dbPath) {
    $dbSize = (Get-Item $dbPath).Length / 1KB
    $sizeRounded = [math]::Round($dbSize, 2)
    Write-Host "Database exists" -ForegroundColor Green
    Write-Host "  Size: $sizeRounded KB" -ForegroundColor Gray
} 
else {
    Write-Host "Database not found!" -ForegroundColor Red
}

# 3. Check Services
Write-Host ""
Write-Host "3. SERVICES" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor DarkGray

$mainApi = Test-Endpoint "Main API (3001)" "http://localhost:3001/api/stats"
$diary = Test-Endpoint "Diary Service (3002)" "http://localhost:3002/health"
$bridge = Test-Endpoint "Bridge MCP (3337)" "http://localhost:3337/health"
$frontend = Test-Endpoint "Frontend (3000)" "http://localhost:3000"

# 4. Check Processes
Write-Host ""
Write-Host "4. PROCESSES" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor DarkGray

$bunRunning = Test-Process "Bun" "bun"
$pythonRunning = Test-Process "Python" "python"
$ngrokRunning = Test-Process "ngrok" "ngrok"

# 5. Check ngrok
Write-Host ""
Write-Host "5. NGROK TUNNEL" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor DarkGray

$ngrokUrl = "https://multiplicative-unapprehendably-marisha.ngrok-free.dev"
if ($ngrokRunning) {
    Write-Host "Testing public URL..." -NoNewline
    try {
        $headers = @{"ngrok-skip-browser-warning"="true"}
        $response = Invoke-WebRequest -Uri "$ngrokUrl/health" -Method GET -TimeoutSec 5 -UseBasicParsing -Headers $headers -ErrorAction Stop
        Write-Host " ONLINE" -ForegroundColor Green
        Write-Host "  URL: $ngrokUrl" -ForegroundColor Gray
    } 
    catch {
        Write-Host " OFFLINE or EXPIRED" -ForegroundColor Red
        Write-Host "  Start new tunnel: ngrok http 3337" -ForegroundColor Gray
    }
} 
else {
    Write-Host "ngrok not running!" -ForegroundColor Red
}

# 6. Summary
Write-Host ""
Write-Host "6. SUMMARY" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor DarkGray

$totalServices = 4
$runningServices = @($mainApi, $diary, $bridge, $frontend) | Where-Object { $_ -eq $true } | Measure-Object | Select-Object -ExpandProperty Count

Write-Host ""
Write-Host "Services: $runningServices / $totalServices running" -ForegroundColor Gray

if ($runningServices -eq 0) {
    Write-Host ""
    Write-Host "START ALL SERVICES:" -ForegroundColor Yellow
    Write-Host "   cd C:\Toobix-Unified" -ForegroundColor Gray
    Write-Host "   .\start-services.bat" -ForegroundColor Gray
} 
elseif ($runningServices -lt $totalServices) {
    Write-Host ""
    Write-Host "SOME SERVICES MISSING" -ForegroundColor Yellow
    Write-Host "   Check individual services above" -ForegroundColor Gray
} 
else {
    Write-Host ""
    Write-Host "ALL SYSTEMS OPERATIONAL!" -ForegroundColor Green
    Write-Host "   Open: http://localhost:3000" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
