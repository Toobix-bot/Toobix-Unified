Param(
  [string]$Key,
  [string]$EnvPath = ".env",
  [switch]$UpdateEnvFile,
  [switch]$ScopeUser = $true
)

$ErrorActionPreference = 'Stop'

function Mask-Key([string]$v){
  if([string]::IsNullOrWhiteSpace($v)){ return '' }
  if($v.Length -le 10){ return ('*' * $v.Length) }
  return $v.Substring(0,4) + ('*' * ($v.Length-8)) + $v.Substring($v.Length-4)
}

function Get-KeyFromEnvFile([string]$path){
  if(-not (Test-Path $path)){ return $null }
  $line = Select-String -Path $path -Pattern '^(?i)GROQ_API_KEY\s*=\s*(.+)$' | Select-Object -First 1
  if(-not $line){ return $null }
  return ($line.Matches[0].Groups[1].Value).Trim()
}

function Validate-Key([string]$v){
  if([string]::IsNullOrWhiteSpace($v)){ return $false }
  return ($v -match '^gsk_[A-Za-z0-9]+$')
}

# 1) Resolve key priority: explicit param > .env value > existing process env
if(-not $Key){ $Key = Get-KeyFromEnvFile -path $EnvPath }
if(-not $Key){ $Key = $env:GROQ_API_KEY }

if(-not (Validate-Key $Key)){
  Write-Host "No valid GROQ key provided/found. Provide via -Key or ensure .env contains GROQ_API_KEY=gsk_..." -ForegroundColor Yellow
  exit 1
}

$masked = Mask-Key $Key
Write-Host ("Using GROQ_API_KEY=" + $masked)

# 2) Persist to user environment (default)
try {
  if($ScopeUser){
    [System.Environment]::SetEnvironmentVariable('GROQ_API_KEY', $Key, 'User')
    Write-Host "Saved to User environment (GROQ_API_KEY)." -ForegroundColor Green
  } else {
    # Process-level only
    $env:GROQ_API_KEY = $Key
    Write-Host "Set process-level GROQ_API_KEY (not persisted)." -ForegroundColor Green
  }
} catch {
  Write-Host ("Failed to set environment variable: " + $_.Exception.Message) -ForegroundColor Red
  exit 1
}

# 3) Optional: update .env
if($UpdateEnvFile){
  try {
    if(Test-Path $EnvPath){
      $content = Get-Content -Path $EnvPath -Raw
      if($content -match '^(?im)GROQ_API_KEY\s*='){ 
        $content = [regex]::Replace($content,'^(?im)GROQ_API_KEY\s*=.*$','GROQ_API_KEY=' + $Key)
      } else {
        if(-not $content.EndsWith("`n")){ $content += "`n" }
        $content += "GROQ_API_KEY=$Key`n"
      }
      Set-Content -Path $EnvPath -Value $content -Encoding utf8
      Write-Host ("Updated " + $EnvPath + " with GROQ_API_KEY=") -NoNewline; Write-Host $masked
    } else {
      Set-Content -Path $EnvPath -Value ("GROQ_API_KEY=$Key`n") -Encoding utf8
      Write-Host ("Created " + $EnvPath + " with GROQ_API_KEY=") -NoNewline; Write-Host $masked
    }
  } catch {
    Write-Host ("Failed to update .env: " + $_.Exception.Message) -ForegroundColor Yellow
  }
}

Write-Host "Done." -ForegroundColor Green

# Usage examples:
#   pwsh -File scripts/set-groq-key.ps1 -Key gsk_xxx -UpdateEnvFile
#   pwsh -File scripts/set-groq-key.ps1               # syncs from .env if present
