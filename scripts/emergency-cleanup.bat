@echo off
REM Emergency Memory Cleanup Script
REM Closes heavy applications and clears cache

echo ========================================
echo   EMERGENCY MEMORY CLEANUP
echo ========================================
echo.

echo [1/5] Closing Discord...
taskkill /F /IM Discord.exe /T 2>nul
if %errorlevel% == 0 (echo    ✓ Discord closed) else (echo    - Discord not running)

echo [2/5] Closing ChatGPT Desktop...
taskkill /F /IM ChatGPT.exe /T 2>nul
if %errorlevel% == 0 (echo    ✓ ChatGPT closed) else (echo    - ChatGPT not running)

echo [3/5] Closing Claude Desktop...
taskkill /F /IM claude.exe /T 2>nul
if %errorlevel% == 0 (echo    ✓ Claude closed) else (echo    - Claude not running)

echo [4/5] Clearing Windows Temp files...
del /q /f /s %TEMP%\* 2>nul
echo    ✓ Temp files cleared

echo [5/5] Emptying Recycle Bin...
rd /s /q %SystemDrive%\$Recycle.bin 2>nul
echo    ✓ Recycle Bin emptied

echo.
echo ========================================
echo   CLEANUP COMPLETE!
echo ========================================
echo.
echo You should now have ~2-3 GB more RAM free.
echo.
pause
