# Groq smoke test
# Calls local groq-api-service endpoints to verify basic functionality and writes results
$ErrorActionPreference = 'Stop'
$out = [ordered]@{}

function Safe-Post($url, $body) {
    try {
        $resp = Invoke-RestMethod -Uri $url -Method POST -Body ($body | ConvertTo-Json -Compress) -ContentType 'application/json' -TimeoutSec 15 -ErrorAction Stop
        return @{ ok = $true; body = $resp }
    } catch {
        return @{ ok = $false; error = $_.Exception.Message }
    }
}

# 1) Health check
try {
    $h = Invoke-RestMethod -Uri 'http://localhost:9987/health' -Method GET -TimeoutSec 5 -ErrorAction Stop
    $out['health'] = @{ ok = $true; body = $h }
} catch {
    $out['health'] = @{ ok = $false; error = $_.Exception.Message }
}

# 2) Luna chat test
$chatBody = @{ message = 'Smoke test: Hello Luna. Bitte antworte kurz mit "pong".' }
$out['luna_chat'] = Safe-Post 'http://localhost:9987/luna/chat' $chatBody

# 3) Generate small content (story-idle quest)
$questBody = @{ playerLevel = 1; playerClass = 'Warrior' }
$out['story_quest'] = Safe-Post 'http://localhost:9987/story-idle/quest' $questBody

# 4) BlockWorld structure generation (optional)
$bwBody = @{ structureType = 'small-house'; size = 'small' }
$out['blockworld_structure'] = Safe-Post 'http://localhost:9987/blockworld/structure' $bwBody

# Save results
$outPath = '.\scripts\groq-test-results.json'
$out | ConvertTo-Json -Depth 10 | Out-File -FilePath $outPath -Encoding utf8
Write-Host "WROTE $outPath"

# Print quick summary
foreach ($k in $out.Keys) {
    $v = $out[$k]
    if ($v.ok) { Write-Host "[$k] OK" } else { Write-Host "[$k] ERROR: $($v.error)" }
}
