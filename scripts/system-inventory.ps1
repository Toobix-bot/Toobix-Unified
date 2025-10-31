param(
    [string]$Root = 'C:\\',
    [string]$Output = 'C:\\Dev\\Projects\\AI\\Toobix-Unified\\docs\\SYSTEM_OVERVIEW.md'
)

# Collect top-level directories overview
$items = Get-ChildItem -Path $Root -Force | Where-Object { $_.PSIsContainer }
$rows = foreach ($it in $items) {
    try {
        $subdirs = (Get-ChildItem -LiteralPath $it.FullName -Directory -Force -ErrorAction Stop).Count
    } catch { $subdirs = 'n/a' }
    try {
        $files = (Get-ChildItem -LiteralPath $it.FullName -File -Force -ErrorAction Stop).Count
    } catch { $files = 'n/a' }
    [PSCustomObject]@{
        Name=$it.Name; Subdirs=$subdirs; Files=$files; LastWrite=($it.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss'))
    }
}

# Try to locate memory artifacts using ripgrep if available
$rg = Get-Command rg -ErrorAction SilentlyContinue
$memoryHits = @()
if ($rg) {
    $roots = @('C:\\Dev','C:\\GPT','C:\\Toobix-Life','C:\\Users\\micha') | Where-Object { Test-Path $_ }
    $files = foreach ($r in $roots) { & rg --files --hidden --follow --glob '!$Recycle.Bin/**' --glob '!System Volume Information/**' --glob '!.git/**' --glob '!node_modules/**' $r }
    if ($files) {
        $memoryHits = $files | & rg -i -n "(memories|memory|knowledge|ged(ae|ä)chtn|notes|journal|README\.md|MEMORY_SCALING_PLAN\.md)" | Select-Object -First 50
    }
}

$sb = New-Object System.Text.StringBuilder
$null = $sb.AppendLine('# Systemüberblick ' + $Root)
$null = $sb.AppendLine('')
$null = $sb.AppendLine('Erstellt: ' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
$null = $sb.AppendLine('')
$null = $sb.AppendLine('## Top-Level Ordner (Schnellübersicht)')
foreach ($r in ($rows | Sort-Object Name)) {
    $null = $sb.AppendLine("- $($r.Name) — Subdirs: $($r.Subdirs), Files: $($r.Files), LastWrite: $($r.LastWrite)")
}
$null = $sb.AppendLine('')
$null = $sb.AppendLine('## Gefundene Memory-/Notiz-Artefakte (Auszug)')
if ($memoryHits -and $memoryHits.Count -gt 0) {
    foreach ($line in $memoryHits) { $null = $sb.AppendLine('- ' + $line) }
} else {
    $null = $sb.AppendLine('- (keine Treffer oder rg nicht verfügbar)')
}
$null = $sb.AppendLine('')
$null = $sb.AppendLine('## Hinweise')
$null = $sb.AppendLine('- Dieses Dokument wird von scripts/system-inventory.ps1 generiert.')
$null = $sb.AppendLine('- Quellen: ' + (($roots -join ', ')))

$outDir = Split-Path $Output -Parent
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }
[System.IO.File]::WriteAllText($Output, $sb.ToString(), (New-Object System.Text.UTF8Encoding($false)))
"UPDATED:$Output"
