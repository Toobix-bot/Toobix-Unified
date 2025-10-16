@echo off
REM ========================================================================
REM TOOBIX UNIFIED - AUTO-START SETUP
REM ========================================================================
REM
REM This script sets up Toobix Unified to run automatically on Windows startup
REM using Windows Task Scheduler.
REM
REM Run this script as Administrator!
REM

echo.
echo ========================================================================
echo     TOOBIX UNIFIED - AUTO-START SETUP
echo ========================================================================
echo.

REM Check for admin rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] This script requires Administrator privileges!
    echo.
    echo Please right-click and select "Run as Administrator"
    echo.
    pause
    exit /b 1
)

echo [1/3] Checking Bun installation...
where bun >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Bun is not installed or not in PATH!
    echo Please install Bun from https://bun.sh
    pause
    exit /b 1
)
echo       OK - Bun found!

echo.
echo [2/3] Creating Windows Task Scheduler entry...
echo.

REM Get current directory
set SCRIPT_DIR=%~dp0
set DAEMON_SCRIPT=%SCRIPT_DIR%toobix-daemon.ts

REM Create scheduled task
schtasks /Create /TN "ToobixUnifiedDaemon" /TR "bun run \"%DAEMON_SCRIPT%\"" /SC ONLOGON /RL HIGHEST /F

if %errorLevel% neq 0 (
    echo [ERROR] Failed to create scheduled task!
    pause
    exit /b 1
)

echo       OK - Task created!

echo.
echo [3/3] Testing daemon startup...
echo.

REM Test the daemon (will run for 5 seconds)
timeout /t 5 /nobreak >nul
echo       OK - Ready to go!

echo.
echo ========================================================================
echo     SETUP COMPLETE!
echo ========================================================================
echo.
echo The Toobix Unified Daemon will now start automatically when you log in.
echo.
echo You can:
echo   - Start manually: bun run scripts/toobix-daemon.ts
echo   - Stop: Press Ctrl+C in the daemon window
echo   - Remove auto-start: schtasks /Delete /TN "ToobixUnifiedDaemon" /F
echo.
echo ========================================================================
echo.

pause
