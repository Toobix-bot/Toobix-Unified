@echo off
echo Starting Toobix Unified Services...
echo.

REM Kill existing processes
taskkill /F /IM bun.exe 2>nul
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *http.server*" 2>nul
timeout /t 2 >nul

REM Start Main API Server (Port 3001)
echo Starting Main API Server on port 3001...
start /B "" "C:\Users\micha\.bun\bin\bun.exe" run scripts/api-server.ts
timeout /t 3 >nul

REM Start Diary Service (Port 3002)
echo Starting Diary Service on port 3002...
start /B "" "C:\Users\micha\.bun\bin\bun.exe" run scripts/diary-service.ts
timeout /t 3 >nul

REM Start Frontend Dev Server (Port 3000)
echo Starting Frontend Server on port 3000...
start /B "" python -m http.server 3000 --directory apps/web
timeout /t 3 >nul

echo.
echo All services started!
echo.
echo Service URLs:
echo   Frontend:  http://localhost:3000
echo   Main API:  http://localhost:3001
echo   Diary API: http://localhost:3002
echo.
echo Testing services...
timeout /t 3 >nul

curl -s http://localhost:3001/api/stats >nul 2>&1 && echo   Main API: OK || echo   Main API: FAILED
curl -s http://localhost:3002/health >nul 2>&1 && echo   Diary API: OK || echo   Diary API: FAILED
curl -s http://localhost:3000 >nul 2>&1 && echo   Frontend: OK || echo   Frontend: FAILED

echo.
echo Ready! Open http://localhost:3000 in your browser
echo Press any key to stop all services...
pause >nul

taskkill /F /IM bun.exe 2>nul
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *http.server*" 2>nul
echo Services stopped.
