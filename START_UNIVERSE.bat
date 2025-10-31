@echo off
REM 🌌 TOOBIX UNIVERSE - Quick Start Script
REM Startet alle Services im Hintergrund

echo.
echo ╔═══════════════════════════════════════╗
echo ║  🌌 TOOBIX UNIVERSE - STARTING...     ║
echo ╚═══════════════════════════════════════╝
echo.

cd /d "C:\Dev\Projects\AI\Toobix-Unified"

echo ✓ Installing dependencies...
call bun install

echo.
echo ✓ Starting services...
start "Toobix Universe" cmd /k "bun run start:autonomous"

echo.
echo ╔═══════════════════════════════════════╗
echo ║  ✨ UNIVERSE IS AWAKENING...          ║
echo ╚═══════════════════════════════════════╝
echo.
echo A new window opened with the services!
echo Check that window to see the universe come alive!
echo.
echo Press any key to continue with Life Game Chat setup...
pause > nul
