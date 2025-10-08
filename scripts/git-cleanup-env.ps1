# 🧹 Git History Cleanup Script
# Entfernt .env aus der gesamten Git-Historie

Write-Host "`n🧹 GIT HISTORY CLEANUP - .env entfernen`n" -ForegroundColor Cyan
Write-Host "⚠️  WARNUNG: Dies ändert die Git-Historie!" -ForegroundColor Yellow
Write-Host "⚠️  Nur ausführen wenn du weißt was du tust!`n" -ForegroundColor Yellow

$confirmation = Read-Host "Möchtest du fortfahren? (yes/no)"
if ($confirmation -ne "yes") {
    Write-Host "`n❌ Abgebrochen.`n" -ForegroundColor Red
    exit
}

Write-Host "`n1️⃣ Erstelle Backup-Branch..." -ForegroundColor Cyan
git branch backup-before-cleanup
Write-Host "   ✅ Backup erstellt: 'backup-before-cleanup'`n" -ForegroundColor Green

Write-Host "2️⃣ Entferne .env aus Git-Historie..." -ForegroundColor Cyan
git filter-branch --force --index-filter `
  "git rm --cached --ignore-unmatch .env" `
  --prune-empty --tag-name-filter cat -- --all

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ .env aus Historie entfernt`n" -ForegroundColor Green
} else {
    Write-Host "   ❌ Fehler beim Entfernen`n" -ForegroundColor Red
    exit 1
}

Write-Host "3️⃣ Bereinige Referenzen..." -ForegroundColor Cyan
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
Write-Host "   ✅ Referenzen bereinigt`n" -ForegroundColor Green

Write-Host "4️⃣ Bereinige Reflog..." -ForegroundColor Cyan
git reflog expire --expire=now --all
Write-Host "   ✅ Reflog bereinigt`n" -ForegroundColor Green

Write-Host "5️⃣ Garbage Collection..." -ForegroundColor Cyan
git gc --prune=now --aggressive
Write-Host "   ✅ GC durchgeführt`n" -ForegroundColor Green

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              ✅ CLEANUP ERFOLGREICH!                       ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "📋 NÄCHSTE SCHRITTE:`n" -ForegroundColor Yellow
Write-Host "   1. Prüfe Git-Log:" -ForegroundColor White
Write-Host "      git log --all --pretty=format:'%h %s' | Select-String '.env'`n" -ForegroundColor Cyan

Write-Host "   2. Wenn nichts gefunden wird, force-pushe:" -ForegroundColor White
Write-Host "      git push origin main --force`n" -ForegroundColor Cyan

Write-Host "   ⚠️  WARNUNG: Force-Push überschreibt Remote-Historie!" -ForegroundColor Yellow
Write-Host "   ⚠️  Nur machen wenn du allein am Projekt arbeitest!`n" -ForegroundColor Yellow

Write-Host "   3. Backup-Branch löschen (optional):" -ForegroundColor White
Write-Host "      git branch -D backup-before-cleanup`n" -ForegroundColor Cyan

Write-Host "✨ Fertig!`n" -ForegroundColor Green
