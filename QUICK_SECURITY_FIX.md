# 🔒 QUICK SECURITY FIX GUIDE

## ⚡ SCHNELLSTART (5 Minuten)

### 1. 🔴 Alten Key löschen (SOFORT!)
1. Öffne: https://console.groq.com/keys
2. Finde Key: `gsk_...` (Platzhalter)
3. Klicke **"Delete"**

### 2. 🟢 Neuen Key erstellen
1. Auf derselben Seite: **"Create API Key"**
2. Name: `Toobix-Unified-Local`
3. **KOPIERE den Key** (wird nur einmal angezeigt!)

### 3. 📝 Neuen Key eintragen
Öffne `c:\Toobix-Unified\.env` und ersetze:
```properties
GROQ_API_KEY=your_groq_api_key_here
```
mit:
```properties
GROQ_API_KEY=gsk_DEIN_NEUER_KEY_HIER
```

### 4. 🔄 Services neu starten
```powershell
# Im Terminal:
cd C:\Toobix-Unified

# Stoppe alle Bun-Prozesse
Get-Process bun | Stop-Process -Force

# Starte Groq Service neu
Start-Process powershell -ArgumentList "bun run scripts/groq-api-service.ts" -WindowStyle Minimized

# Starte Memory-Groq Integration neu
Start-Process powershell -ArgumentList "bun run scripts/memory-groq-integration.ts" -WindowStyle Minimized
```

### 5. ✅ Teste
```powershell
Invoke-RestMethod http://localhost:9987/health
```

**FERTIG!** 🎉 Jetzt ist alles wieder sicher.

---

## 🧹 OPTIONAL: Git-Historie bereinigen

### Einfache Methode (empfohlen):
```powershell
cd C:\Toobix-Unified
.\scripts\git-cleanup-env.ps1
```

### Manuelle Methode:
Siehe `SECURITY_INCIDENT.md` für Details.

---

## ❓ FAQ

**Q: Wurde mein Key missbraucht?**  
A: Prüfe: https://console.groq.com/usage für verdächtige Aktivitäten.

**Q: Muss ich die Git-Historie wirklich bereinigen?**  
A: Empfohlen, aber nicht kritisch wenn Key widerrufen ist.

**Q: Was wenn ich vergessen habe den neuen Key zu kopieren?**  
A: Lösche den Key und erstelle einen neuen.

**Q: Kann ich denselben Key in mehreren Projekten verwenden?**  
A: Ja, aber separate Keys sind sicherer (Rate Limiting, Tracking).

---

📚 **Vollständige Dokumentation:** `SECURITY_INCIDENT.md`
