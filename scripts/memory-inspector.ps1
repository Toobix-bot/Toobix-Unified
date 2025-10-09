# Memory Inspector / Starter
# Tries to detect a running memory service on common ports, starts memory script if not running, and tails logs
$ErrorActionPreference = 'Stop'
$ports = @(9986, 9995)
$results = @()

function Is-PortOpen($port) {
    try {
        $t = Test-NetConnection -ComputerName '127.0.0.1' -Port $port -WarningAction SilentlyContinue
        return $t.TcpTestSucceeded
    } catch { return $false }
}

foreach ($p in $ports) {
    Write-Host "Checking port $p..."
    if (Is-PortOpen $p) {
        Write-Host "Port $p is open"
        $results += @{ port = $p; open = $true }
    } else {
        Write-Host "Port $p is closed. Attempting to start memory service for port $p..."
        # Choose script based on port guess
        if ($p -eq 9986) { $script = 'scripts/memory-system.ts' } else { $script = 'scripts/memory-groq-integration.ts' }
        Start-Process -FilePath 'powershell' -ArgumentList '-NoExit','-Command',"bun run $script" -WorkingDirectory (Get-Location) -WindowStyle Hidden
        Start-Sleep -Seconds 3
        $openNow = Is-PortOpen $p
        if ($openNow) { Write-Host "Port $p is now open" } else { Write-Host "Port $p still closed" }
        $results += @{ port = $p; open = $openNow }
    }
}

# Save results
$results | ConvertTo-Json -Depth 5 | Out-File -FilePath '.\scripts\memory-inspector-results.json' -Encoding utf8
Write-Host 'WROTE .\scripts\memory-inspector-results.json'

Write-Host 'If a service was started, check its PowerShell window for logs, or run:'
Write-Host "  Get-Content .\scripts\logs\memory-system-out.log -Tail 200 -Wait (if present)"
