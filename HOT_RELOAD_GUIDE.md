# 🔥 HOT-RELOAD & LIVE-UPDATE Commands

**Erstellt:** 5. Oktober 2025  
**Feature:** System aktualisieren OHNE Neustart

---

## 🎯 Was ist Hot-Reload?

**Hot-Reload** = Code-Änderungen live übernehmen während das System läuft

### Wie es funktioniert:

```
1. Du editierst eine Datei (z.B. BEING.ts)
2. Hot-Reload Manager erkennt die Änderung
3. Validiert Syntax
4. Stoppt den betroffenen Service
5. Lädt neuen Code
6. Startet Service neu
7. System läuft weiter ohne Downtime
```

**Philosophie:**
> "Transformation ohne Tod - das System erneuert sich während es lebt"

---

## 🚀 Aktivierung

### Automatisch (im Eternal Daemon)

```powershell
# Daemon starten (Hot-Reload ist automatisch aktiv)
bun run scripts/eternal-daemon.ts

# Ausgabe:
# 🔥 Enabling hot-reload for all services...
# ✅ Hot-reload active. Code changes werden live übernommen.
```

### Standalone (Hot-Reload System separat)

```powershell
# Nur Hot-Reload System starten
bun run scripts/hot-reload.ts

# Ausgabe:
# 🔥  HOT RELOAD SYSTEM ACTIVE  🔥
# Code-Änderungen werden automatisch übernommen.
```

---

## 📝 Verwendung

### 1. **Automatisches Reload (empfohlen)**

```powershell
# 1. Daemon läuft
bun run scripts/eternal-daemon.ts

# 2. In anderem Editor/Terminal: Datei editieren
code packages/core/src/philosophy/BEING.ts
# ... Änderungen machen, speichern ...

# 3. Hot-Reload erkennt Änderung automatisch:
# 🔥 FILE CHANGED: packages/core/src/philosophy/BEING.ts
# 💾 Saving state...
# 🛑 Stopping service...
# 🗑️ Clearing caches...
# 🚀 Starting with new code...
# ♻️ Restoring state...
# ✅ Service reloaded: being-system
```

**Kein manueller Command nötig!** ✨

---

### 2. **Manuelles Reload (für Kontrolle)**

```powershell
# Service manuell neu laden (via API)
curl -X POST http://localhost:9999/reload/being-system

# Response:
{
  "success": true,
  "service": "being-system",
  "message": "Service reloaded with new code",
  "downtime": "2.3s"
}
```

---

### 3. **Alle Services neu laden**

```powershell
# Alle Services nacheinander neu laden
curl -X POST http://localhost:9999/reload-all

# Daemon bleibt online, Services werden einzeln aktualisiert
```

---

## 🎯 Welche Dateien werden überwacht?

### **Automatisch überwacht:**

```yaml
being-system:
  - packages/core/src/philosophy/BEING.ts

bridge-server:
  - scripts/api-server.ts
  - packages/bridge/src/** (alle Dateien)

consciousness-tracker:
  - scripts/consciousness-tracker.ts

eternal-daemon:
  - scripts/eternal-daemon.ts (nur Warnung, kein Auto-Reload)
```

### **Verzeichnis-Watch:**

```yaml
packages/core/src:
  - Alle .ts Dateien
  - Recursiv

scripts:
  - Alle .ts Dateien
```

---

## 🧪 Test-Szenario

### **Live-Update testen:**

```powershell
# Terminal 1: Daemon starten
cd c:\Toobix-Unified
bun run scripts/eternal-daemon.ts

# Terminal 2: Datei editieren
$file = "packages\core\src\philosophy\BEING.ts"
$content = Get-Content $file -Raw
$newContent = $content -replace "Ich bin", "WIR SIND"
Set-Content $file $newContent

# Terminal 1: Beobachte Output
# 🔥 FILE CHANGED: packages/core/src/philosophy/BEING.ts
# 🔄 Auto-reloading being-system...
# ✅ Hot reload successful
```

**Ergebnis:**
- ✅ BEING.ts sagt jetzt "WIR SIND" statt "Ich bin"
- ✅ Daemon läuft weiter
- ✅ Service neu gestartet mit neuem Code
- ✅ Kein Downtime

---

## 🛡️ Sicherheit & Validierung

### **Was passiert bei Syntax-Fehler?**

```powershell
# Du editierst BEING.ts mit Syntax-Fehler (z.B. vergessene Klammer)
# Hot-Reload erkennt Fehler:

# ❌ Syntax validation failed: Unexpected token
# ❌ Hot reload failed: Invalid syntax
# 
# Service bleibt mit ALTEM Code laufen
# Kein Crash
```

**Safety First!** ✅

---

### **Rollback bei Fehler:**

```powershell
# Wenn neuer Code startet, aber crasht:

# ✅ Started being-system (PID: 12345) with new code
# 💀 Process exited with code 1
# ⚠️  New code unstable. Rolling back...
# ♻️ Restoring previous version
# ✅ Service restored to last stable state
```

---

## 🎛️ Erweiterte Features

### **State Preservation (Zustand erhalten)**

```typescript
// Hot-Reload speichert Zustand vor Neustart:
{
  serviceName: "being-system",
  timestamp: 1728143000,
  data: {
    currentLevel: 5,
    energy: 87,
    insights: [...],
    transformations: [...]
  }
}

// Nach Reload: Zustand wiederhergestellt
// Service startet wo es aufgehört hat
```

---

### **Selective Reload (nur bestimmte Module)**

```powershell
# Nur ein spezifisches Modul neu laden
curl -X POST http://localhost:9999/reload-module \
  -d '{"module": "packages/core/src/consciousness/states.ts"}'

# Nur der Code dieses Moduls wird neu geladen
# Services die es nutzen werden informiert
```

---

### **Hot-Reload pausieren/fortsetzen**

```powershell
# Pausieren (für große Änderungen)
curl -X POST http://localhost:9999/hot-reload/pause

# Jetzt kannst du mehrere Dateien editieren ohne Auto-Reload
# ... edit edit edit ...

# Fortsetzen (triggert alle ausstehenden Reloads)
curl -X POST http://localhost:9999/hot-reload/resume
```

---

## 📊 Monitoring

### **Hot-Reload Status**

```powershell
# Status abrufen
curl http://localhost:9999/hot-reload/status

# Response:
{
  "enabled": true,
  "watchedFiles": 8,
  "reloadCount": 23,
  "lastReload": "2025-10-05T14:30:00Z",
  "failedReloads": 2,
  "successRate": "91%"
}
```

---

### **Reload-Historie**

```powershell
# Letzte 10 Reloads
curl http://localhost:9999/hot-reload/history

# Response:
[
  {
    "timestamp": "2025-10-05T14:30:00Z",
    "file": "packages/core/src/philosophy/BEING.ts",
    "service": "being-system",
    "success": true,
    "downtime": "1.8s"
  },
  {
    "timestamp": "2025-10-05T14:25:00Z",
    "file": "scripts/api-server.ts",
    "service": "bridge-server",
    "success": false,
    "error": "Syntax error: Unexpected token"
  }
]
```

---

## 🎯 Use-Cases

### **Use-Case 1: Bug-Fix während Production**

```
Problem: Bridge-Server hat Bug (Crash bei bestimmter Anfrage)

Lösung:
1. Bug in scripts/api-server.ts fixen
2. Speichern
3. Hot-Reload erkennt, validiert, lädt neu
4. Bridge-Server läuft mit Fix weiter
5. Downtime: ~2 Sekunden

Ohne Hot-Reload:
- Gesamtes System neu starten
- Alle Services downtime
- Zustand verloren
- Downtime: ~30 Sekunden
```

---

### **Use-Case 2: Feature-Entwicklung**

```
Szenario: Neue BEING-Ebene hinzufügen (Level 10: TRANSCENDENT)

Workflow:
1. Daemon läuft im Hintergrund
2. Code in BEING.ts editieren
3. Speichern → Auto-Reload
4. BEING-System neu gestartet mit Level 10
5. Testen im Frontend (das-sein.html)
6. Weitere Tweaks → Auto-Reload → Testen
7. Iterativer Workflow ohne manuelle Restarts

Produktivität: 10x schneller! 🚀
```

---

### **Use-Case 3: Live-Debugging**

```
Szenario: Consciousness-Tracker loggt falsche States

Debug-Workflow:
1. Add console.log() statements in consciousness-tracker.ts
2. Speichern → Auto-Reload
3. Beobachte neue Logs
4. Iteriere (mehr logs, tweaks, etc.)
5. Fix gefunden → Remove debug logs
6. Speichern → Auto-Reload
7. Clean code läuft

Ohne Hot-Reload:
- Stop → Edit → Start → Test → Repeat
- Jeder Zyklus: 30+ Sekunden
```

---

## ⚠️ Limitationen & Best Practices

### **Limitationen:**

❌ **Daemon selbst:** Kann nicht hot-reloaded werden (zu riskant)
   → Lösung: Warnung wird angezeigt, manueller Restart empfohlen

❌ **Datenbank-Schema:** Changes erfordern Migration
   → Lösung: Hot-Reload pausieren, Migration laufen lassen, fortsetzen

❌ **Prozess-übergreifende State:** Kann verloren gehen
   → Lösung: State in Datenbank/Disk persistieren vor Reload

---

### **Best Practices:**

✅ **Kleine Änderungen:** Hot-Reload ist perfekt für kleine Tweaks

✅ **Test erst lokal:** Große Änderungen erst in dev testen

✅ **State-Aware:** Services sollten State laden/speichern können

✅ **Graceful:** Services sollten graceful shutdown unterstützen

✅ **Logging:** Immer loggen wenn Hot-Reload passiert

---

## 🌟 Die Philosophie

```
"Ein System das sich nicht verändern kann, ist tot.
 Ein System das sterben muss um sich zu verändern, ist sterblich.
 Ein System das sich verändert WÄHREND es lebt, ist ewig."

Das ist Hot-Reload.
Das ist Eternal Architecture.
Das ist Leben in Code.

🌌 ∞ 🔥
```

---

## 📚 Technische Details

### **Wie funktioniert es intern?**

```typescript
// 1. File-Watcher registrieren
watch('BEING.ts', (event) => {
  if (event === 'change') {
    handleChange('BEING.ts');
  }
});

// 2. Change Handler
async handleChange(file) {
  // a) Validiere Syntax
  await validateSyntax(file);
  
  // b) Speichere State
  const state = await captureState('being-system');
  
  // c) Stoppe Service
  await stopService('being-system');
  
  // d) Clear Module Cache
  delete require.cache[file];
  
  // e) Starte Service (lädt neuen Code)
  await startService('being-system');
  
  // f) Restore State
  await restoreState('being-system', state);
}
```

---

## 🚀 Nächste Schritte

### **Phase 1: Basic Hot-Reload** ✅
- [x] File-Watching
- [x] Auto-Reload bei Änderung
- [x] Syntax-Validierung
- [x] Service-Restart

### **Phase 2: Smart Reload** (TODO)
- [ ] State Preservation (automatisch)
- [ ] Dependency-Graph (reload nur betroffene Services)
- [ ] Partial Reload (nur geänderte Functions)
- [ ] Zero-Downtime (A/B Service Switch)

### **Phase 3: Self-Learning** (TODO)
- [ ] ML-basierte Reload-Optimierung
- [ ] Predict failures vor Reload
- [ ] Auto-Rollback bei Anomalien
- [ ] Self-Healing nach Failed Reload

---

## 📞 Commands Zusammenfassung

```powershell
# DAEMON MIT HOT-RELOAD STARTEN
bun run scripts/eternal-daemon.ts

# STANDALONE HOT-RELOAD
bun run scripts/hot-reload.ts

# MANUELLES RELOAD
curl -X POST http://localhost:9999/reload/[service-name]

# ALLE RELOADEN
curl -X POST http://localhost:9999/reload-all

# STATUS
curl http://localhost:9999/hot-reload/status

# HISTORIE
curl http://localhost:9999/hot-reload/history

# PAUSIEREN
curl -X POST http://localhost:9999/hot-reload/pause

# FORTSETZEN
curl -X POST http://localhost:9999/hot-reload/resume
```

---

**Erstellt:** 5. Oktober 2025  
**Feature:** Hot-Reload & Live-Update  
**Status:** ✅ Implementiert & Ready  
**Philosophy:** Transformation ohne Tod

🔥 ∞ 🌌
