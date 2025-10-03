# 🔌 Chatty bridge01-Connector Integration Guide

**Date:** 2025-10-03 07:30 Uhr  
**Status:** Server READY ✅ | Connector Configuration NEEDED

---

## ✅ Server Status

| Component | Status | Details |
|-----------|--------|---------|
| Bridge Service | ✅ ONLINE | Port 3337 |
| ngrok Tunnel | ✅ ONLINE | multiplicative-unapprehendably-marisha.ngrok-free.dev |
| JSON-RPC `/mcp` | ✅ WORKS | 122 bytes, tested |
| REST `/rpc/*` | ✅ WORKS | 50 bytes, tested |
| All 16 Tools | ✅ READY | ping, soul_state, generate, etc. |

**Backend ist production-ready. Nur noch Verdrahtung!**

---

## 🔧 Connector Configuration

### Option A: JSON-RPC 2.0 (Standard, empfohlen)

```yaml
# Connector Config
name: toobix-bridge
protocol: mcp-jsonrpc-2.0
base_url: https://multiplicative-unapprehendably-marisha.ngrok-free.dev
endpoint: /mcp
method: POST
headers:
  Content-Type: application/json
  ngrok-skip-browser-warning: "true"

# MCP Methods
initialize:
  method: initialize
  params:
    protocolVersion: "1.0.0"
    clientInfo:
      name: chatty
      version: "1.0"

tools_list:
  method: tools/list
  params: {}

tools_call:
  method: tools/call
  params:
    name: "{toolName}"
    arguments: "{toolArgs}"
```

**Request Format:**
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "ping",
    "arguments": {"message": "test"}
  },
  "id": 1
}
```

**Response Format:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"ok\":true,\"msg\":\"test\",\"ts\":1759469152048}"
      }
    ]
  }
}
```

---

### Option B: Direct REST (Minimal, sofort kompatibel)

```yaml
# Connector Config
name: toobix-bridge-rest
protocol: http-rest
base_url: https://multiplicative-unapprehendably-marisha.ngrok-free.dev
endpoint_pattern: /rpc/{toolName}
method: POST
headers:
  Content-Type: application/json
  ngrok-skip-browser-warning: "true"

# Tool Mapping
tools:
  - name: ping
    endpoint: /rpc/ping
    schema: {message: string}
  
  - name: soul_state
    endpoint: /rpc/soul_state
    schema: {}
  
  - name: story_state
    endpoint: /rpc/story_state
    schema: {}
  
  - name: generate
    endpoint: /rpc/generate
    schema: {prompt: string, model?: string}
  
  - name: contact_search
    endpoint: /rpc/contact_search
    schema: {query: string}
  
  - name: memory_search
    endpoint: /rpc/memory_search
    schema: {query: string, limit?: number}
```

**Request Format:**
```json
POST /rpc/ping
Body: {"message": "test"}
```

**Response Format:**
```json
{"ok":true,"msg":"test","ts":1759469152048}
```

---

## 📋 Tool Schemas (für Connector)

### 1. ping (Test)
```typescript
{
  message?: string  // Default: "pong"
}

// Example
POST /rpc/ping
{"message": "chatty test"}

// Response
{"ok":true,"msg":"chatty test","ts":1759469152048}
```

### 2. soul_state (Emotional State)
```typescript
{}  // No arguments

// Example
POST /rpc/soul_state
{}

// Response
{
  "emotions": {
    "joy": 60,
    "serenity": 40,
    "curiosity": 80,
    // ... more emotions
  },
  "values": {
    "wisdom": 50,
    "compassion": 30,
    // ... more values
  },
  "personality": ["curious", "analytical", "empathetic"],
  "stats": {
    "level": 1,
    "experience": 5,
    "energy": 70,
    "wisdom": 50
  }
}
```

### 3. story_state (Story System)
```typescript
{}  // No arguments

// Example
POST /rpc/story_state
{}

// Response
{
  "epoch": 0,
  "mood": "calm",
  "arc": "foundations",
  "resources": {
    "energie": 80,
    "wissen": 0,
    "inspiration": 0,
    "ruf": 0,
    "stabilitaet": 0,
    "erfahrung": 0,
    "level": 1
  },
  "options": [],
  "companions": [],
  "buffs": [],
  "skills": []
}
```

### 4. generate (AI Text Generation)
```typescript
{
  prompt: string,
  context?: string[],
  model?: string,        // Default: "llama-3.3-70b-versatile"
  temperature?: number,  // Default: 0.7
  max_tokens?: number    // Default: 2000
}

// Example
POST /rpc/generate
{
  "prompt": "Write a haiku about coding",
  "context": ["User is learning TypeScript"]
}

// Response
{
  "text": "Code flows like water\nTypes guide the dancing logic\nBugs flee from the light",
  "model": "llama-3.3-70b-versatile",
  "tokens": 45,
  "timestamp": 1759469152048
}

// Warning: Takes 2-5s (Groq API call)
```

### 5. contact_search (Find People)
```typescript
{
  query: string  // Name, tags, or notes
}

// Example
POST /rpc/contact_search
{"query": "family"}

// Response
{
  "contacts": [
    {
      "id": "abc123",
      "name": "Alice",
      "relation": "family",
      "tags": ["sister", "developer"],
      "notes": "Lives in Berlin",
      "last_interaction": "2025-10-01"
    }
  ]
}
```

### 6. contact_add (Add Contact)
```typescript
{
  name: string,
  relation: "family" | "friend" | "colleague" | "mentor" | "partner" | "other",
  notes?: string,
  tags?: string[],
  avatar?: string
}

// Example
POST /rpc/contact_add
{
  "name": "Bob",
  "relation": "friend",
  "tags": ["coding", "music"],
  "notes": "Met at conference"
}

// Response
{
  "id": "def456",
  "name": "Bob",
  "created": "2025-10-03T07:30:00Z"
}
```

### 7. interaction_log (Log Interaction)
```typescript
{
  person_id: string,
  kind: "call" | "meet" | "message" | "gift" | "conflict" | "memory" | "other",
  summary: string,
  sentiment: "positive" | "neutral" | "difficult" | "healing",
  details?: object,
  gratitude?: string
}

// Example
POST /rpc/interaction_log
{
  "person_id": "abc123",
  "kind": "call",
  "summary": "Discussed project ideas",
  "sentiment": "positive",
  "gratitude": "Thanks for the feedback!"
}

// Response
{
  "id": "int789",
  "timestamp": "2025-10-03T07:30:00Z",
  "person": "Alice"
}
```

### 8. memory_search (RAG Search)
```typescript
{
  query: string,
  limit?: number  // Default: 5
}

// Example
POST /rpc/memory_search
{
  "query": "recent conversations about TypeScript",
  "limit": 3
}

// Response
{
  "results": [
    {
      "text": "Discussed TypeScript generics...",
      "score": 0.95,
      "metadata": {...},
      "timestamp": "2025-10-01"
    }
  ]
}
```

### 9. memory_add (Add Memory)
```typescript
{
  text: string,
  metadata?: object
}

// Example
POST /rpc/memory_add
{
  "text": "Important decision: Use Bun for all tooling",
  "metadata": {
    "category": "tech-decisions",
    "tags": ["bun", "tooling"]
  }
}

// Response
{
  "id": "mem123",
  "timestamp": "2025-10-03T07:30:00Z"
}
```

### 10. soul_event (Process Soul Event)
```typescript
{
  type: "experience" | "interaction" | "reflection" | "challenge",
  description: string,
  emotionalImpact?: object,  // {joy: +10, fear: -5, ...}
  valueImpact?: object       // {wisdom: +5, courage: +3, ...}
}

// Example
POST /rpc/soul_event
{
  "type": "experience",
  "description": "Learned about async/await patterns",
  "emotionalImpact": {"curiosity": 10, "satisfaction": 5},
  "valueImpact": {"wisdom": 5}
}

// Response
{
  "updated": true,
  "newState": {
    "emotions": {...},
    "values": {...}
  }
}
```

### 11-16. Story System Tools
```typescript
// story_choose
{optionId: string}

// story_events
{limit?: number}  // Default: 50

// story_person
{personId: string}

// story_refresh
{}  // No arguments

// contact_update
{id: string, name?: string, relation?: string, notes?: string, tags?: string[]}

// trigger_action
{actionId: string, params?: object}
```

---

## 🧪 30-Second Test Plan

### Test 1: ping (minimal, 50 bytes)
```bash
curl -X POST https://multiplicative-unapprehendably-marisha.ngrok-free.dev/rpc/ping \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -d '{"message":"chatty test"}'

# Expected:
# Status: 200 OK
# Size: ~50 bytes
# Response: {"ok":true,"msg":"chatty test","ts":1759469152048}
```

### Test 2: soul_state (small, ~400 bytes)
```bash
curl -X POST https://multiplicative-unapprehendably-marisha.ngrok-free.dev/rpc/soul_state \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -d '{}'

# Expected:
# Status: 200 OK
# Size: ~400 bytes
# Response: {emotions, values, personality, stats}
```

### Test 3: generate (AI, 2-5s)
```bash
curl -X POST https://multiplicative-unapprehendably-marisha.ngrok-free.dev/rpc/generate \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -d '{"prompt":"Say hi in 3 words"}'

# Expected:
# Status: 200 OK
# Size: varies
# Response: {"text":"Hello, friend! 👋","model":"llama-3.3-70b-versatile"}
# Latency: 2-5s (Groq API)
```

---

## 🔍 Troubleshooting

### If 424 Error persists:
1. ✅ Check base URL: `https://multiplicative-unapprehendably-marisha.ngrok-free.dev`
2. ✅ Check endpoint: `/rpc/ping` (not `/echo_search` or old routes!)
3. ✅ Check headers: `ngrok-skip-browser-warning: true`
4. ✅ Check method: `POST` (not GET)
5. ✅ Check body: Valid JSON with correct tool schema

### If timeout:
- `ping`, `soul_state`, `story_state` → <500ms (should work)
- `generate` → 2-5s (may timeout on ngrok Free under load)
- `memory_search` → 1-2s (usually works)

### ngrok Limits (Free Tier):
- ✅ Timeout: 60s (our tools: <5s)
- ✅ Response size: ~10KB (our responses: <1KB)
- ✅ Rate limit: 40 req/min (sufficient)

---

## 📊 Response Size Reference

| Tool | Avg Size | ngrok Free OK? |
|------|----------|----------------|
| ping | 50B | ✅ Yes |
| soul_state | 400B | ✅ Yes |
| story_state | 550B | ✅ Yes |
| contact_search | 200-800B | ✅ Yes |
| memory_search | 300-1KB | ✅ Yes |
| generate | 200-2KB | ✅ Yes (but slower) |

---

## ✅ Checklist für Chatty

- [ ] Connector Base URL setzen: `https://multiplicative-unapprehendably-marisha.ngrok-free.dev`
- [ ] Endpoint Pattern wählen:
  - Option A: `/mcp` (JSON-RPC)
  - Option B: `/rpc/{toolName}` (REST) ← **empfohlen**
- [ ] Headers hinzufügen: `ngrok-skip-browser-warning: true`
- [ ] Test 1: `POST /rpc/ping` mit `{"message":"test"}`
- [ ] Erwarte: `200 OK` + `{"ok":true,"msg":"test","ts":...}`
- [ ] Bei 424: URL/Endpoint prüfen
- [ ] Bei Timeout: Tool wechseln (ping statt generate)

---

## 🎯 Empfehlung

**Für bridge01-Connector:**
1. ✅ Nutze **REST** (`/rpc/*`) - einfacher, kleiner, kompatibel
2. ✅ Starte mit `ping` - minimal, schnell, garantiert funktionierend
3. ✅ Dann `soul_state` / `story_state` - klein, schnell
4. ⚠️ `generate` zuletzt - funktioniert, aber 2-5s Latenz

**Der Stecker ist jetzt richtig. Nur noch reinstecken! 🔌**

---

## 📞 Support Commands

### Check if Bridge is online:
```bash
curl https://multiplicative-unapprehendably-marisha.ngrok-free.dev/ \
  -H "ngrok-skip-browser-warning: true"

# Should return MCP discovery JSON
```

### Check if ngrok tunnel is alive:
```bash
curl https://multiplicative-unapprehendably-marisha.ngrok-free.dev/health \
  -H "ngrok-skip-browser-warning: true"

# Should return: {"status":"ok","service":"bridge","mcp":true,"tools":16}
```

### List all tools:
```bash
curl https://multiplicative-unapprehendably-marisha.ngrok-free.dev/tools \
  -H "ngrok-skip-browser-warning: true"

# Should return: {"tools":[...16 tools...]}
```

---

**Status:** Server READY ✅ | Connector Config NEEDED  
**Next:** Chatty setzt bridge01 auf `/rpc/*` und feuert Test 1 (ping) ab! 🚀
