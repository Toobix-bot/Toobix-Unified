# Robust health check script
$ErrorActionPreference = 'Stop'
$services = @{
    daemon = 'http://localhost:9999'
    groq = 'http://localhost:9987'
    memory1 = 'http://localhost:9986'
    memory2 = 'http://localhost:9995'
}

<# Simple retry helper replaced by inline retry loop to avoid scriptblock invocation issues #>

$results = @()
foreach ($k in $services.Keys) {
    $base = $services[$k].TrimEnd('/')
    $entry = [ordered]@{ service = $k; base = $base; checks = @{} }
    foreach ($p in @('health','status')) {
        $url = "$base/$p"
        $success = $false
        $lastError = $null
        for ($attempt = 1; $attempt -le 4; $attempt++) {
            try {
                $res = Invoke-RestMethod -Uri $url -Method GET -TimeoutSec 5 -ErrorAction Stop
                $entry.checks[$p] = @{ ok = $true; body = $res }
                $success = $true
                break
            } catch {
                $lastError = $_.Exception.Message
                Start-Sleep -Seconds (2 * $attempt)
            }
        }
        if (-not $success) {
            $entry.checks[$p] = @{ ok = $false; error = $lastError }
        }
    }
    $results += (New-Object PSObject -Property $entry)
}

$outPath = '.\scripts\service-check-results.json'
$results | ConvertTo-Json -Depth 10 | Out-File -FilePath $outPath -Encoding utf8
Write-Host "WROTE $outPath"

# Print short summary
foreach ($r in $results) {
    $okCount = 0
    foreach ($k in $r.checks.Keys) {
        $check = $r.checks[$k]
        if ($check.ok) { $okCount++ }
    }
    Write-Host "[$($r.service)] OK checks: $okCount/2"
}
