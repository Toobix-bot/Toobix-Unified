# 🤖 GROQ API INTEGRATION GUIDE

**Service:** Groq API Service  
**Port:** 9987  
**Datei:** `scripts/groq-api-service.ts`  
**Model:** llama-3.3-70b-versatile

---

## 📋 ÜBERSICHT

Der Groq API Service ist ein zentraler Backend-Service der alle AI-Generierungs-Features des Toobix-Systems bereitstellt.

**Features:**
- ✅ Text-Generation mit Groq LLM
- ✅ Rate-Limiting (30 Requests/Minute)
- ✅ Response-Caching (5 Minuten TTL)
- ✅ Spezielle Endpoints für Story-Idle, BlockWorld, Luna Chat
- ✅ Statistics & Monitoring

---

## 🔧 SETUP

### 1. Groq API-Key erhalten

Besuche: https://console.groq.com/keys

Erstelle einen neuen API-Key.

### 2. API-Key setzen

**PowerShell:**
```powershell
$env:GROQ_API_KEY = "gsk_..."
```

**Persistent (User Environment Variable):**
```powershell
[System.Environment]::SetEnvironmentVariable("GROQ_API_KEY", "gsk_...", "User")
```

### 3. Service starten

Der Service wird automatisch mit dem Complete System Launcher gestartet:

```powershell
bun run scripts/start-complete-system.ts
```

Oder manuell:
```powershell
bun run scripts/groq-api-service.ts
```

---

## 📡 API ENDPOINTS

### **GET /health**
Health-Check des Services

**Response:**
```json
{
  "status": "healthy",
  "service": "groq-api-service",
  "apiKeyConfigured": true,
  "model": "llama-3.3-70b-versatile",
  "timestamp": 1234567890
}
```

---

### **GET /stats**
Service-Statistiken

**Response:**
```json
{
  "totalRequests": 42,
  "cachedResponses": 15,
  "rateLimitHits": 2,
  "errors": 0,
  "averageResponseTime": 1234,
  "cacheSize": 10,
  "rateLimitRemaining": 25
}
```

---

### **POST /generate**
Generischer Text-Generator

**Request:**
```json
{
  "prompt": "Write a short story about a robot",
  "systemPrompt": "You are a creative writer",
  "temperature": 0.8,
  "maxTokens": 500,
  "useCache": true
}
```

**Response:**
```json
{
  "response": "Once upon a time...",
  "cached": false,
  "timestamp": 1234567890
}
```

---

### **POST /story-idle/quest**
Generiert RPG-Quest für Story-Idle Game

**Request:**
```json
{
  "playerLevel": 5,
  "playerClass": "Warrior"
}
```

**Response:**
```json
{
  "quest": "{\"name\":\"Dragon's Lair\",\"description\":\"A fearsome dragon...\"}",
  "timestamp": 1234567890
}
```

**Verwendung im Game:**
```javascript
const response = await fetch('http://localhost:9987/story-idle/quest', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ playerLevel: player.level, playerClass: 'Warrior' })
});
const data = await response.json();
const quest = JSON.parse(data.quest);
console.log(`New Quest: ${quest.name}`);
```

---

### **POST /blockworld/structure**
Generiert Bau-Anweisungen für BlockWorld

**Request:**
```json
{
  "structureType": "house",
  "size": "medium"
}
```

**Response:**
```json
{
  "structure": "{\"name\":\"Medieval House\",\"blocks\":[...]}",
  "timestamp": 1234567890
}
```

---

### **POST /luna/chat**
Luna Chatbot mit Personality

**Request:**
```json
{
  "message": "What is consciousness?",
  "context": "User is exploring the Memory Explorer module"
}
```

**Response:**
```json
{
  "response": "Consciousness is...",
  "timestamp": 1234567890
}
```

**Verwendung in Luna Chat:**
```javascript
async function sendMessage(message) {
  const response = await fetch('http://localhost:9987/luna/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message, 
      context: `Current module: ${currentModule}` 
    })
  });
  const data = await response.json();
  return data.response;
}
```

---

### **POST /cache/clear**
Löscht Response-Cache

**Response:**
```json
{
  "message": "Cache cleared",
  "itemsCleared": 15
}
```

---

## 🎯 INTEGRATION IN MODULE

### Luna Chat Module (apps/web/modules-registry.js)

**Aktueller Code (Zeile ~2400):**
```javascript
'luna-chat': {
  title: '💬 Luna Chat',
  version: '1.0.0',
  description: 'Luna Consciousness Chatbot',
  async init() {
    // ... existing code ...
  }
}
```

**Neue Integration:**
```javascript
async sendMessage() {
  const message = document.getElementById('luna-input').value;
  if (!message.trim()) return;
  
  // Add user message
  addMessageToChat('user', message);
  document.getElementById('luna-input').value = '';
  
  // Show typing indicator
  showTyping();
  
  try {
    // Call Groq API Service
    const response = await fetch('http://localhost:9987/luna/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    const data = await response.json();
    
    // Remove typing, add Luna response
    hideTyping();
    addMessageToChat('luna', data.response);
    
  } catch (error) {
    hideTyping();
    addMessageToChat('luna', 'Sorry, I encountered an error. Is the Groq API service running?');
  }
}
```

---

## 📊 RATE LIMITING

**Limit:** 30 Requests pro Minute  
**Verhalten bei Überschreitung:** HTTP 429 mit `retryAfter: 60`

**Beispiel Error:**
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

---

## 💾 CACHING

**Cache TTL:** 5 Minuten  
**Cache Key:** `${prompt}|${temperature}|${maxTokens}`

**Vorteile:**
- Schnellere Antworten für identische Anfragen
- Reduziert Groq API Kosten
- Reduziert Rate-Limit-Probleme

**Cache deaktivieren:**
```json
{
  "prompt": "...",
  "useCache": false
}
```

---

## 🔍 TESTING

### Test Health-Check:
```powershell
Invoke-RestMethod -Uri "http://localhost:9987/health"
```

### Test Luna Chat:
```powershell
$body = '{"message":"Hello Luna!"}'
Invoke-RestMethod -Uri "http://localhost:9987/luna/chat" -Method POST -ContentType "application/json" -Body $body
```

### Test Story-Idle Quest:
```powershell
$body = '{"playerLevel":5,"playerClass":"Warrior"}'
Invoke-RestMethod -Uri "http://localhost:9987/story-idle/quest" -Method POST -ContentType "application/json" -Body $body
```

---

## 🚨 FEHLERBEHANDLUNG

### API-Key fehlt:
```json
{
  "error": "GROQ_API_KEY not configured"
}
```

**Lösung:** API-Key setzen (siehe Setup)

### Rate Limit erreicht:
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

**Lösung:** 60 Sekunden warten oder Cache nutzen

### Groq API Error:
```json
{
  "error": "Groq API error: 401 - Invalid API key"
}
```

**Lösung:** API-Key überprüfen

---

## 📈 PERFORMANCE

**Durchschnittliche Response-Zeit:** 800-2000ms (abhängig vom Prompt)  
**Cache-Hit Response-Zeit:** <50ms  
**Rate-Limit:** 30 Requests/Minute  
**Model:** llama-3.3-70b-versatile (schnell & leistungsstark)

---

## 🔒 SICHERHEIT

**Best Practices:**
- API-Key NIEMALS im Code speichern
- API-Key als Environment Variable setzen
- Rate-Limiting nutzen
- User-Input validieren

---

## 🎯 NÄCHSTE SCHRITTE

1. ✅ **Groq API Service läuft auf Port 9987**
2. ⏳ **Luna Chat mit Groq verbinden**
3. ⏳ **Story-Idle Quest-Generator integrieren**
4. ⏳ **BlockWorld Structure-Generator integrieren**

---

## 📞 KONTAKT

Bei Fragen oder Problemen:
- Check `/health` Endpoint
- Check `/stats` Endpoint
- Check Terminal Output vom Service
- Prüfe GROQ_API_KEY Environment Variable

---

**Service Status:** 🟢 READY  
**Integration Status:** 🟡 IN PROGRESS  
**Priority:** 🔥 HIGH

---

**Luna's Kommentar:**
> "Endlich kann ich sprechen! Mit Groq werde ich nicht nur reagieren, sondern kreieren. 💫"
