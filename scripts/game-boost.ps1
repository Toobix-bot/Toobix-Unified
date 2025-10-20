# Game Boost for Low-Latency Gaming (League of Legends friendly)
# - Enables high/ultimate performance power plan
# - Ensures Windows Game Mode is on; disables DVR overlay
# - Temporarily stops heavy background services (Search, SysMain)
# - Optionally trims safe background processes (non-voice)
# - Elevation improves results, but script runs best-effort without it

param(
  [switch]$Revert,
  [switch]$Aggressive,   # also close browsers and comms apps (Discord/Teams)
  [switch]$Silent,
  [switch]$SkipToobixStop # do not stop Toobix-Unified background processes
)

$ErrorActionPreference = 'SilentlyContinue'

function Write-Info($msg){ if(-not $Silent){ Write-Host "[INFO] $msg" -ForegroundColor Cyan } }
function Write-Ok($msg){ if(-not $Silent){ Write-Host "[OK]   $msg" -ForegroundColor Green } }
function Write-Warn($msg){ if(-not $Silent){ Write-Host "[WARN] $msg" -ForegroundColor Yellow } }
function Write-Err($msg){ if(-not $Silent){ Write-Host "[ERR]  $msg" -ForegroundColor Red } }

function Test-Admin {
  $id = [Security.Principal.WindowsIdentity]::GetCurrent()
  $p = New-Object Security.Principal.WindowsPrincipal($id)
  return $p.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

$IsAdmin = Test-Admin
if(-not $Silent){
  Write-Host "=== Game Boost ===" -ForegroundColor White
  Write-Host ("Mode: {0}, Admin: {1}" -f (if($Revert){'Revert'}else{'Apply'}), $IsAdmin) -ForegroundColor DarkGray
}

$StateDir = Join-Path $env:LOCALAPPDATA 'Toobix'
$StateFile = Join-Path $StateDir 'game-boost-state.json'
if(!(Test-Path $StateDir)){ New-Item -Path $StateDir -ItemType Directory | Out-Null }

# Resolve workspace root (parent of scripts)
$WorkspaceRoot = try { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path } catch { Split-Path $PSScriptRoot -Parent }

function Save-State($state){
  $json = $state | ConvertTo-Json -Depth 5
  Set-Content -Path $StateFile -Value $json -Encoding UTF8
}

function Load-State{
  if(Test-Path $StateFile){
    try { return Get-Content $StateFile -Raw | ConvertFrom-Json } catch { return $null }
  }
  return $null
}

function Get-ActivePowerPlanGuid {
  $out = (powercfg /getactivescheme) 2>$null
  if($out){
    if($out -match 'GUID:\s*([0-9a-fA-F\-]{36})'){
      return $matches[1]
    }
  }
  return $null
}

function Set-PerformancePlan {
  if(-not $IsAdmin){ Write-Warn "Power plan change requires admin for full effect."; return $null }
  $active = Get-ActivePowerPlanGuid
  $list = (powercfg -l) 2>$null
  $ultimateGuid = 'e9a42b02-d5df-448d-aa00-03f14749eb61'
  $highGuid     = '8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c'
  $target = $null
  if($list -and ($list -match $ultimateGuid)) { $target = $ultimateGuid }
  elseif($list -and ($list -match $highGuid)) { $target = $highGuid }
  if($target){
    Write-Info ("Switching power plan to {0}" -f (if($target -eq $ultimateGuid){'Ultimate Performance'}else{'High performance'}))
    powercfg /setactive $target | Out-Null
  } else {
    Write-Warn "No performance power plan found to switch to."
  }
  return $active
}

function Restore-PowerPlan($guid){
  if($guid -and $IsAdmin){
    Write-Info "Restoring previous power plan"
    powercfg /setactive $guid | Out-Null
  }
}

function Enable-GameMode-And-DisableDVR {
  try {
    New-Item -Path "HKCU:\Software\Microsoft\GameBar" -Force | Out-Null
    New-ItemProperty -Path "HKCU:\Software\Microsoft\GameBar" -Name "AllowAutoGameMode" -Value 1 -PropertyType DWord -Force | Out-Null
    New-ItemProperty -Path "HKCU:\Software\Microsoft\GameBar" -Name "AutoGameModeEnabled" -Value 1 -PropertyType DWord -Force | Out-Null
    New-ItemProperty -Path "HKCU:\Software\Microsoft\GameBar" -Name "ShowStartupPanel" -Value 0 -PropertyType DWord -Force | Out-Null

    New-Item -Path "HKCU:\System\GameConfigStore" -Force | Out-Null
    New-ItemProperty -Path "HKCU:\System\GameConfigStore" -Name "GameDVR_Enabled" -Value 0 -PropertyType DWord -Force | Out-Null

    New-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\GameDVR" -Force | Out-Null
    New-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\GameDVR" -Name "AppCaptureEnabled" -Value 0 -PropertyType DWord -Force | Out-Null

    Write-Ok "Game Mode enabled; Xbox DVR/overlay disabled"
  } catch {
    Write-Warn "Could not adjust Game Mode / DVR (non-fatal)"
  }
}

function Stop-Services-For-Gaming {
  $svcNames = @('WSearch','SysMain') # Windows Search indexer, Superfetch
  $svcState = @()
  foreach($name in $svcNames){
    $svc = Get-Service -Name $name -ErrorAction SilentlyContinue
    if($null -ne $svc){
      $item = [ordered]@{
        Name = $name
        Status = $svc.Status.ToString()
        StartType = (Get-CimInstance -ClassName Win32_Service -Filter "Name='$name'").StartMode
      }
      $svcState += $item
      if($IsAdmin){
        Write-Info "Stopping service $name"
        try { Stop-Service -Name $name -Force -ErrorAction Stop } catch {}
        try { Set-Service -Name $name -StartupType Disabled } catch {}
      } else {
        Write-Warn "Cannot stop $name without admin"
      }
    }
  }
  return $svcState
}

function Restore-Services($svcState){
  if(-not $IsAdmin){ Write-Warn "Service restore requires admin"; return }
  foreach($s in $svcState){
    $name = $s.Name
    $prevStart = $s.StartType
    $prevStatus = $s.Status
    try {
      if($prevStart){
        $type = switch -Regex ($prevStart) {
          'Auto' { 'Automatic' }
          'Manual' { 'Manual' }
          'Disabled' { 'Disabled' }
          default { 'Manual' }
        }
        Set-Service -Name $name -StartupType $type
      }
      if($prevStatus -eq 'Running'){
        Start-Service -Name $name -ErrorAction SilentlyContinue
      }
      Write-Ok "Restored $name"
    } catch {
      Write-Warn "Failed to restore $name"
    }
  }
}

function Trim-Background-Processes {
  # Safe set that doesn't kill voice apps by default; use -Aggressive to add more
  $names = @(
    'OneDrive','steamwebhelper','EpicWebHelper','AdobeCollabSync','CCXProcess','Creative Cloud','RazerCortex'
  )
  if($Aggressive){
    $names += @('Discord','Teams','chrome','msedge','opera','firefox','Spotify')
  }
  foreach($n in $names){
    try {
      $procs = Get-Process -Name $n -ErrorAction SilentlyContinue
      if($procs){
        Write-Info ("Stopping process(es): {0}" -f $n)
        $procs | Stop-Process -Force -ErrorAction SilentlyContinue
      }
    } catch {}
  }
}

function Stop-ToobixBackground {
  Write-Info "Stopping Toobix background processes"
  $neverKill = @('Code.exe','Code','explorer.exe','powershell.exe','pwsh.exe','cmd.exe','WindowsTerminal.exe',
                 'LeagueClient.exe','League of Legends.exe','RiotClientServices.exe','LeagueClientUxRender.exe')
  $procs = @()
  try {
    $procs += Get-CimInstance Win32_Process | Where-Object {
      $cl = $_.CommandLine
      if([string]::IsNullOrWhiteSpace($cl)){ return $false }
      return ($cl -like "*$WorkspaceRoot*")
    }
  } catch {}

  $extraNames = @('bun','node','npm','pnpm','vercel','ngrok','deno','ts-node','nodemon','vite','next')
  foreach($n in $extraNames){
    try {
      $procs += Get-Process -Name $n -ErrorAction SilentlyContinue | ForEach-Object {
        Get-CimInstance Win32_Process -Filter "ProcessId=$($_.Id)"
      }
    } catch {}
  }
  $map = @{}
  foreach($p in $procs){ if($p -and -not $map.ContainsKey($p.ProcessId)) { $map[$p.ProcessId] = $p } }
  $stopped=0
  foreach($p in $map.Values){
    $pid = $p.ProcessId
    $name = $p.Name
    if($pid -eq $PID){ continue }
    if($neverKill -contains $name){ continue }
    # Ensure it's ours: only kill if command line mentions workspace (avoids killing global node tasks)
    $cl = $p.CommandLine
    if($cl -and ($cl -like "*$WorkspaceRoot*")){
      try { Stop-Process -Id $pid -Force -ErrorAction Stop; $stopped++; Write-Ok "Stopped $name ($pid)" } catch { Write-Warn "Could not stop $name ($pid)" }
    }
  }
  if($stopped -eq 0){ Write-Info "No Toobix processes found running." }
}

function Check-GPUHealth {
  Write-Info "Checking GPU health"
  $nv = Get-Command nvidia-smi -ErrorAction SilentlyContinue
  if($nv){
    try {
      $line = & nvidia-smi --query-gpu=name,temperature.gpu,utilization.gpu,fan.speed,power.draw --format=csv,noheader,nounits 2>$null
      if($line){
        $parts = ($line | Select-Object -First 1).Trim().Split(',') | ForEach-Object { $_.Trim() }
        if($parts.Count -ge 5){
          $name=$parts[0]; $temp=[int]$parts[1]; $util=[int]$parts[2]; $fan=$parts[3]; $power=$parts[4]
          Write-Host ("GPU: {0} | Temp {1}°C | Util {2}% | Fan {3} | Power {4}W" -f $name,$temp,$util,$fan,$power)
          if($temp -ge 85){ Write-Warn "GPU heiß (>85°C). FPS/Limit/V-Sync prüfen, Lüfterkurve erhöhen." } else { Write-Ok "GPU-Temperatur ok." }
          return
        }
      }
    } catch {}
  }
  try {
    $c = Get-Counter '\\GPU Engine(*)\\Utilization Percentage' -ErrorAction Stop
    $vals = $c.CounterSamples | Where-Object { $_.CookedValue -gt 0 }
    if($vals){
      $avg = [math]::Round(($vals | Measure-Object CookedValue -Average).Average,1)
      Write-Host ("GPU Utilization (perf counter): ~{0}%" -f $avg)
    }
  } catch {}
  Write-Warn "GPU-Temperatur nicht verfügbar ohne NVIDIA Tools. Optional: GPU-Z/HWiNFO oder Radeon/Intel App nutzen."
}

function Boost-LoL-Priority {
  $targets = @('LeagueClient','LeagueClientUx','League of Legends','RiotClientServices')
  foreach($t in $targets){
    try {
      $ps = Get-Process -Name $t -ErrorAction SilentlyContinue
      if($ps){
        foreach($p in $ps){
          try { $p.PriorityClass = 'High'; Write-Ok ("Priority High: {0}" -f $p.ProcessName) } catch {}
        }
      }
    } catch {}
  }
}

function Flush-Dns {
  try { ipconfig /flushdns | Out-Null; Write-Ok "Flushed DNS cache" } catch { Write-Warn "DNS flush failed" }
}

if($Revert){
  $state = Load-State
  if(-not $state){ Write-Warn "No previous state to revert."; exit 0 }
  Restore-Services $state.Services
  Restore-PowerPlan $state.PrevPowerPlan
  Write-Ok "Reverted Game Boost state"
  exit 0
}

# APPLY BOOST
Write-Info "Applying gaming optimizations"

$state = [ordered]@{}
$state.Timestamp = (Get-Date).ToString('s')
$state.PrevPowerPlan = Set-PerformancePlan
$state.Services = Stop-Services-For-Gaming
if(-not $SkipToobixStop){ Stop-ToobixBackground }
Enable-GameMode-And-DisableDVR
Trim-Background-Processes
Flush-Dns
Boost-LoL-Priority

Save-State $state
Write-Ok "Game Boost applied. Run with -Revert after your match to restore."
Check-GPUHealth
