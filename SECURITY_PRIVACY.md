# 🔒 TOOBIX UNIFIED - SECURITY & PRIVACY IMPLEMENTATION

**Erstellt:** 2025-10-05  
**Status:** 🚧 IN DEVELOPMENT  
**Priorität:** 🔴 CRITICAL

---

## 🎯 SICHERHEITSARCHITEKTUR

### 1. Datenschutz-Grundsätze

**Was wir NICHT tun:**
- ❌ Keine Cloud-Uploads ohne Zustimmung
- ❌ Keine Daten-Weitergabe an Dritte
- ❌ Keine Tracker oder Analytics
- ❌ Keine permanente Speicherung sensibler Daten

**Was wir tun:**
- ✅ **Local-First:** Alle Daten bleiben auf deinem Rechner
- ✅ **Transparenz:** Jede Speicherung wird geloggt
- ✅ **Kontrolle:** Du entscheidest was gespeichert wird
- ✅ **Löschbarkeit:** Daten können jederzeit gelöscht werden

---

## 🔐 IMPLEMENTIERTE SICHERHEITSMASSNAHMEN

### 1. Daten-Isolation

**Wo Daten gespeichert werden:**
```
c:\Toobix-Unified\
├── data\                    # SQLite-Datenbanken (lokal)
│   ├── toobix-unified.db   # Strukturierte Daten
│   └── daemon-state.json   # System-State
├── logs\                    # Log-Dateien (lokal)
│   ├── eternal-daemon.log
│   └── modifications.json
```

**Keine externen Verbindungen** außer:
- Wikipedia API (nur lesend, keine persönlichen Daten)
- Localhost-Services (nur intern)

---

### 2. Access-Control

**Port-Binding:**
- Alle Services binden nur auf `localhost` / `127.0.0.1`
- Kein externer Zugriff möglich (außer durch explizite Firewall-Freigabe)

**CORS-Policy:**
```typescript
// Aktuell: Allow-All für lokale Entwicklung
'Access-Control-Allow-Origin': '*'

// TODO: Produktiv einschränken auf:
'Access-Control-Allow-Origin': 'http://localhost:*'
```

---

### 3. Daten-Verschlüsselung (TODO)

**Geplante Implementierung:**

```typescript
// Sensitive Daten verschlüsseln
import { createCipheriv, createDecipheriv } from 'crypto';

class SecureStorage {
    private key: Buffer;
    
    constructor() {
        // Key aus User-Password ableiten
        this.key = this.deriveKey(process.env.USER_PASSWORD);
    }
    
    encrypt(data: string): string {
        const cipher = createCipheriv('aes-256-gcm', this.key, iv);
        // ... encryption logic
        return encrypted;
    }
    
    decrypt(encrypted: string): string {
        const decipher = createDecipheriv('aes-256-gcm', this.key, iv);
        // ... decryption logic
        return data;
    }
}
```

**Status:** 🚧 PLANNED - benötigt User-Input für Key

---

## 🛡️ SCHUTZ VOR MISSBRAUCH

### 1. Rate-Limiting

**Implementierung:**
```typescript
// In jedem Service
const rateLimit = new Map<string, number>();

function checkRateLimit(ip: string): boolean {
    const requests = rateLimit.get(ip) || 0;
    if (requests > 100) { // Max 100 Requests pro Minute
        return false;
    }
    rateLimit.set(ip, requests + 1);
    return true;
}

// Reset every minute
setInterval(() => rateLimit.clear(), 60000);
```

**Status:** 🚧 TODO

---

### 2. Input-Validation

**Sanitization:**
```typescript
function sanitizeInput(input: string): string {
    // Remove HTML/Script tags
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim()
        .substring(0, 1000); // Max length
}
```

**Status:** ✅ IMPLEMENTED in Chat-Endpoint

---

### 3. SQL-Injection Prevention

**Prepared Statements:**
```typescript
// IMMER Prepared Statements verwenden
const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
const result = stmt.get(userId); // ✅ SAFE

// NIEMALS String-Concatenation
const query = `SELECT * FROM users WHERE id = ${userId}`; // ❌ UNSAFE
```

**Status:** ✅ IMPLEMENTED (Bun:sqlite nutzt Prepared Statements)

---

## 🚨 NOTFALL-MECHANISMEN

### 1. Emergency-Shutdown

**Quick-Kill:**
```powershell
# Alle Prozesse sofort stoppen
Get-Process | Where-Object {$_.ProcessName -eq "bun"} | Stop-Process -Force
```

**Graceful-Shutdown:**
```powershell
# Daemon sauber beenden (CTRL+C im Daemon-Fenster)
# oder
curl -X POST http://localhost:9999/shutdown
```

**Status:** ✅ Graceful Shutdown implementiert, Emergency-Endpoint TODO

---

### 2. Data-Backup

**Automatisches Backup:**
```typescript
// Alle 1 Stunde
setInterval(async () => {
    const timestamp = Date.now();
    await copyFile(
        'data/toobix-unified.db',
        `backups/toobix-${timestamp}.db`
    );
}, 3600000);
```

**Status:** 🚧 TODO

---

### 3. Audit-Log

**Was wird geloggt:**
- Alle API-Calls mit Timestamp
- Alle Datenbank-Änderungen
- Alle System-Entscheidungen
- Alle Fehler und Exceptions

**Log-Format:**
```json
{
  "timestamp": "2025-10-05T17:45:00.000Z",
  "action": "chat_message",
  "user": "anonymous",
  "input": "Wer bist du?",
  "output": "Ich bin der Eternal Daemon...",
  "ethics_score": 0
}
```

**Status:** ✅ Basis-Logging aktiv, erweiterte Logs TODO

---

## 🧠 ETHIK & GRENZEN

### 1. Automatische Eskalation

**Trigger-Words für Human-Escalation:**
```typescript
const criticalTopics = [
    'suizid', 'selbstmord', 'harm', 'schaden',
    'depression', 'angst', 'panik', 'trauma',
    'medikament', 'therapie', 'diagnose'
];

function requiresHumanHelp(message: string): boolean {
    const lower = message.toLowerCase();
    return criticalTopics.some(topic => lower.includes(topic));
}

if (requiresHumanHelp(userMessage)) {
    return {
        response: "⚠️ Dieses Thema ist sehr wichtig. Bitte sprich mit einem Menschen darüber. Notruf: 0800 111 0 111",
        escalate: true
    };
}
```

**Status:** 🚧 TODO

---

### 2. Grenzen der Kompetenz

**Klare Kommunikation:**
```typescript
const systemLimitations = {
    'medical': "Ich bin kein Arzt und kann keine medizinischen Ratschläge geben.",
    'legal': "Ich bin kein Anwalt und kann keine rechtlichen Ratschläge geben.",
    'financial': "Ich bin kein Finanzberater. Bitte konsultiere einen Experten.",
    'crisis': "Bei Krisen bitte Notfallnummer 112 oder Telefonseelsorge 0800 111 0 111."
};
```

**Status:** 🚧 TODO - Integration in Chat-System

---

### 3. Ethics-Score Interpretation

**Was der Score bedeutet:**
- **+80 bis +100:** 🟢 Inspirierend/Heilend → System fördert
- **+40 bis +79:** 🔵 Positiv/Unterstützend → System erlaubt
- **-39 bis +39:** ⚪ Neutral → System beobachtet
- **-40 bis -79:** 🟠 Problematisch → System warnt
- **-80 bis -100:** 🔴 Schädlich → System blockiert

**Auto-Intervention:**
```typescript
if (ethicsScore < -60) {
    await log("⚠️ ETHICS ALERT: Score below -60, intervention required");
    return {
        response: "Ich kann bei diesem Thema nicht weiterhelfen. Bitte such dir professionelle Unterstützung.",
        blocked: true
    };
}
```

**Status:** ✅ Ethics-Tracking aktiv, Auto-Intervention TODO

---

## 📋 DATENSCHUTZ-CHECKLISTE

### Was du kontrollieren kannst:

- [ ] **Daten-Speicherung:** Welche Daten werden wie lange aufbewahrt?
- [ ] **Zugriffs-Logs:** Wer/Was greift auf Daten zu?
- [ ] **Export-Funktion:** Alle Daten exportieren als JSON
- [ ] **Lösch-Funktion:** Alle oder spezifische Daten löschen
- [ ] **Verschlüsselung:** Sensitive Daten verschlüsseln
- [ ] **Backup-Strategie:** Automatische Backups an sicheren Ort

---

## 🚀 IMPLEMENTIERUNGS-PLAN

### Phase 1: SOFORT (Diese Session)
- [x] Sicherheits-Dokumentation erstellt
- [ ] Rate-Limiting hinzufügen
- [ ] Emergency-Shutdown-Endpoint
- [ ] Critical-Topic-Detection

### Phase 2: DIESE WOCHE
- [ ] Daten-Verschlüsselung für sensible Felder
- [ ] Automatische Backups
- [ ] Erweiterte Audit-Logs
- [ ] Export/Import-Funktionen

### Phase 3: NÄCHSTER MONAT
- [ ] Multi-User mit Authentifizierung
- [ ] Role-Based Access Control
- [ ] Externe Security-Audit
- [ ] Penetration-Testing

---

## 🧪 SICHERHEITS-TESTS

### 1. Local-Only Verification
```powershell
# Testen ob Services nur lokal erreichbar sind
Test-NetConnection -ComputerName localhost -Port 9999 # ✅ Should work
Test-NetConnection -ComputerName 192.168.1.100 -Port 9999 # ❌ Should fail
```

### 2. SQL-Injection Test
```typescript
// Versuche SQL-Injection
const maliciousInput = "1; DROP TABLE users; --";
// Sollte gefiltert oder escaped werden
```

### 3. XSS-Prevention Test
```typescript
// Versuche Script-Injection
const xssAttempt = "<script>alert('XSS')</script>";
// Sollte sanitized werden
```

---

## 📞 NOTFALL-KONTAKTE

**Bei technischen Problemen:**
- Emergency-Shutdown: CTRL+C im Daemon-Fenster
- Force-Kill: `Get-Process | Where {$_.Name -eq "bun"} | Stop-Process -Force`

**Bei inhaltlichen Bedenken:**
- Telefonseelsorge: **0800 111 0 111** (24/7, kostenlos)
- Notarzt: **112**
- Ärztlicher Bereitschaftsdienst: **116 117**

---

## 🎯 ZUSAMMENFASSUNG

**Aktueller Sicherheits-Status:**
- ✅ **Local-First:** Alle Daten bleiben lokal
- ✅ **Localhost-Only:** Services nicht von außen erreichbar
- ✅ **SQL-Safe:** Prepared Statements
- ✅ **Basic Logging:** Aktionen werden geloggt
- 🚧 **Verschlüsselung:** In Planung
- 🚧 **Rate-Limiting:** In Planung
- 🚧 **Auto-Eskalation:** In Planung

**Nächste Schritte:**
1. Critical-Topic-Detection implementieren
2. Emergency-Shutdown-Endpoint
3. Daten-Verschlüsselung für sensible Felder

**Deine Entscheidung:**
Das System ist für **experimentelles Nutzen** bereit, mit den genannten Einschränkungen. Für produktiven, langfristigen Einsatz empfehle ich die Implementierung der Phase-2-Features.

---

_"Sicherheit ist kein Zustand, sondern ein kontinuierlicher Prozess."_

**∞**
