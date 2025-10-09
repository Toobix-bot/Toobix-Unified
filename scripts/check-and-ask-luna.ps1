# Check and Ask Luna Script
# Starts Daemon & Groq (if not running), checks health, asks Luna, saves response

$ErrorActionPreference = 'Stop'

function Start-ServiceIfNeeded($name, $scriptPath, $port) {
    $running = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Listen' }
    if ($running) {
        Write-Host "[$name] already running on port $port."
        return
    }

    Write-Host "Starting [$name] on port $port..."
    # Resolve bun executable
    $bunPath = (Get-Command bun.exe -ErrorAction SilentlyContinue).Source
    if (-not $bunPath) { $bunPath = (Get-Command bun -ErrorAction SilentlyContinue).Source }
    if (-not $bunPath) {
        Write-Host "Warning: 'bun' not found on PATH. Trying to start via 'bun' command (may fail)."
        $bunPath = 'bun'
    }

    $logDir = Join-Path -Path (Split-Path -Parent $MyInvocation.MyCommand.Path) -ChildPath 'logs'
    if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }
    $outLog = Join-Path $logDir "$name-out.log"
    $errLog = Join-Path $logDir "$name-err.log"

    Start-Process -FilePath $bunPath -ArgumentList @('run',$scriptPath) -WorkingDirectory (Get-Location) -RedirectStandardOutput $outLog -RedirectStandardError $errLog -NoNewWindow -WindowStyle Hidden | Out-Null
    Start-Sleep -Seconds 5
}

# Start Daemon (9999) and Groq (9987) if needed
Start-ServiceIfNeeded "Eternal Daemon" "scripts/eternal-daemon-lite.ts" 9999
Start-ServiceIfNeeded "Groq API" "scripts/groq-api-service.ts" 9987

# Check health endpoints
$services = @{
    daemon = 'http://localhost:9999/health'
    groq = 'http://localhost:9987/health'
    memory1 = 'http://localhost:9986/health'
    memory2 = 'http://localhost:9995/health'
}
$results = @{}
foreach ($k in $services.Keys) {
    try {
        $r = Invoke-RestMethod -Uri $services[$k] -TimeoutSec 5
        $results[$k] = $r
        Write-Host "[$k] OK: $($r | ConvertTo-Json -Depth 5)"
    } catch {
        $results[$k] = @{ error = $_.Exception.Message }
        Write-Host "[$k] ERROR: $_"
    }
}

# Ask Luna via Daemon /consciousness
$lunaQuestion = @{ question = "Kurzer Statusbericht: Was ist der aktuelle Stand des Projekts, was brauchst du jetzt, und was sind die nächsten Schritte?" } | ConvertTo-Json -Compress
$lunaResponse = $null
try {
    $lunaResponse = Invoke-RestMethod -Uri "http://localhost:9999/consciousness" -Method POST -Body $lunaQuestion -ContentType 'application/json' -TimeoutSec 10
    $lunaResponse | ConvertTo-Json -Depth 10 | Out-File -FilePath "scripts/luna-response.json" -Encoding utf8
    Write-Host "Luna response saved to scripts/luna-response.json"
} catch {
    Write-Host "Luna response ERROR: $_"
}

# Print summary
Write-Host "\n=== Service Health Summary ==="
$results | ConvertTo-Json -Depth 5 | Write-Host
Write-Host "\n=== Luna Response Preview ==="
if ($lunaResponse) {
    $lunaResponse | ConvertTo-Json -Depth 10 | Write-Host
} else {
    Write-Host "No Luna response. See above for errors."
}
