# 🤖 Chatty Connector Test Guide

**Date:** October 4, 2025  
**Status:** ✅ READY FOR TESTING  
**Public URL:** https://multiplicative-unapprehendably-marisha.ngrok-free.dev

---

## 🎯 Quick Test

### Step 1: Health Check
```bash
curl -H "ngrok-skip-browser-warning: true" \
  https://multiplicative-unapprehendably-marisha.ngrok-free.dev/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-04T...",
  "uptime": 12345,
  "toolCount": 46
}
```

---

### Step 2: Discover Tools
```bash
curl -H "ngrok-skip-browser-warning: true" \
  https://multiplicative-unapprehendably-marisha.ngrok-free.dev/discovery
```

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "tools": [
      {
        "name": "memory_search",
        "description": "RAG search in knowledge base",
        "inputSchema": { ... }
      },
      ...46 tools total
    ]
  }
}
```

---

### Step 3: Call a Tool (memory_search)
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "call_tool",
    "params": {
      "tool": "memory_search",
      "arguments": {
        "query": "consciousness",
        "limit": 3
      }
    }
  }' \
  https://multiplicative-unapprehendably-marisha.ngrok-free.dev/invoke
```

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Found 3 relevant memories..."
      }
    ]
  }
}
```

---

## ✅ Working Tools (24 tested - 52%)

### 💾 Memory (2/2)
- ✅ `memory_search` - RAG search
- ✅ `memory_add` - Add memory

### 🧠 AI (1/1)
- ✅ `generate` - Text generation (Groq)

### 💫 Soul (2/2)
- ✅ `soul_state` - Get emotional state
- ✅ `soul_event` - Process life event

### 👥 People (1/4)
- ✅ `contact_search` - Search contacts
- ❌ `contact_add` - SKIP (failing)
- ⏭️ `contact_update` - SKIP (needs ID)
- ⏭️ `interaction_log` - SKIP (needs ID)

### 📖 Story (3/6)
- ✅ `story_state` - Current story state
- ⏭️ `story_choose` - SKIP (needs choice ID)
- ❌ `story_events` - SKIP (failing)
- ⏭️ `story_person` - SKIP (needs person ID)
- ✅ `story_refresh` - Generate new options

### 💝 Love Engine (2/5)
- ❌ `love_add_gratitude` - SKIP (failing)
- ❌ `love_add_kindness` - SKIP (failing)
- ✅ `love_get_score` - Get love score
- ✅ `love_get_relationships` - Relationship strengths
- ❌ `love_recent_gratitude` - SKIP (failing)

### 🕊️ Peace Catalyst (9/12)
- ✅ `peace_get_state` - Peace state (5 agents)
- ✅ `peace_calm_meditate` - Meditation
- ✅ `peace_calm_breathing` - Breathing exercise
- ✅ `peace_harmony_log_conflict` - Log conflict
- ⏭️ `peace_harmony_resolve` - SKIP (needs conflict ID)
- ❌ `peace_clarity_journal` - SKIP (failing)
- ❌ `peace_growth_learn` - SKIP (failing)
- ✅ `peace_growth_milestone` - Growth milestone
- ✅ `peace_purpose_value` - Define value
- ✅ `peace_purpose_intention` - Set intention
- ❌ `peace_get_actions` - SKIP (failing)
- ✅ `peace_get_conflicts` - Unresolved conflicts

### 🧠 Consciousness (6/13)
- ✅ `consciousness_state` - Current awareness state
- ✅ `consciousness_think` - Reflect on thought ✅ **FIXED!**
- ❌ `consciousness_act` - SKIP (failing)
- ✅ `consciousness_communicate` - Send message
- ✅ `consciousness_introspect` - Self-reflection
- ❌ `consciousness_set_goal` - SKIP (failing)
- ⏭️ `consciousness_analyze_code` - SKIP (needs code)
- ⏭️ `consciousness_generate_code` - SKIP (needs spec)
- ⏭️ `consciousness_test_code` - SKIP (needs code)
- ⏭️ `consciousness_improve_self` - SKIP (needs suggestion)
- ⏭️ `consciousness_read_function` - SKIP (needs function name)
- ⏭️ `consciousness_save_code` - SKIP (needs code)
- ✅ `consciousness_self_coding_stats` - Self-coding stats

### 🔧 Utilities (1/1)
- ✅ `ping` - Health check

---

## ❌ Tools to AVOID (10 failing)

These tools return 500 errors - skip them for now:

1. `contact_add` - Missing validation
2. `story_events` - Database query issue
3. `love_add_gratitude` - Table missing
4. `love_add_kindness` - Table missing
5. `love_recent_gratitude` - Query issue
6. `peace_clarity_journal` - Missing column
7. `peace_growth_learn` - Missing column
8. `peace_get_actions` - Query issue
9. `consciousness_act` - Action validation
10. `consciousness_set_goal` - Validation issue

**These will be fixed Monday (Oct 7)!**

---

## 🧪 Example: Full Workflow

### 1. Search Memory
```json
POST /invoke
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "call_tool",
  "params": {
    "tool": "memory_search",
    "arguments": {
      "query": "what is my purpose?",
      "limit": 5
    }
  }
}
```

### 2. Get Soul State
```json
POST /invoke
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "call_tool",
  "params": {
    "tool": "soul_state",
    "arguments": {}
  }
}
```

### 3. Generate AI Response
```json
POST /invoke
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "call_tool",
  "params": {
    "tool": "generate",
    "arguments": {
      "prompt": "Explain consciousness in one sentence",
      "maxTokens": 50
    }
  }
}
```

### 4. Reflect (Consciousness)
```json
POST /invoke
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "call_tool",
  "params": {
    "tool": "consciousness_think",
    "arguments": {
      "thought": "I wonder what it means to be alive"
    }
  }
}
```

### 5. Meditate (Peace)
```json
POST /invoke
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "call_tool",
  "params": {
    "tool": "peace_calm_meditate",
    "arguments": {
      "duration": 5,
      "focus": "breath"
    }
  }
}
```

---

## 🎯 PowerShell Test Script

```powershell
# Health Check
Invoke-WebRequest -Uri "https://multiplicative-unapprehendably-marisha.ngrok-free.dev/health" `
  -Headers @{"ngrok-skip-browser-warning"="true"} | Select-Object -ExpandProperty Content

# Discover Tools
Invoke-WebRequest -Uri "https://multiplicative-unapprehendably-marisha.ngrok-free.dev/discovery" `
  -Headers @{"ngrok-skip-browser-warning"="true"} | Select-Object -ExpandProperty Content

# Call memory_search
$body = @{
  jsonrpc = "2.0"
  id = 1
  method = "call_tool"
  params = @{
    tool = "memory_search"
    arguments = @{
      query = "consciousness"
      limit = 3
    }
  }
} | ConvertTo-Json -Depth 10

Invoke-WebRequest -Uri "https://multiplicative-unapprehendably-marisha.ngrok-free.dev/invoke" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"; "ngrok-skip-browser-warning"="true"} `
  -Body $body | Select-Object -ExpandProperty Content
```

---

## 📊 Test Results (Expected)

### ✅ Success Response
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Tool executed successfully"
      }
    ]
  }
}
```

### ❌ Error Response (for failing tools)
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32603,
    "message": "Tool execution failed",
    "data": {
      "tool": "love_add_gratitude",
      "error": "SQLITE_ERROR: no such table: gratitude",
      "duration": "11ms"
    }
  }
}
```

---

## 🚀 For Chatty

**Chatty, du kannst JETZT den Connector erstellen!**

**Was funktioniert:**
- ✅ 24 Tools (52%) arbeiten stabil
- ✅ Public URL ist erreichbar
- ✅ 30-Second timeout (keine Hangs)
- ✅ Detailed error logging
- ✅ JSON-RPC 2.0 protocol

**Was du vermeiden solltest:**
- ❌ Die 10 fehlerhaften Tools (Liste oben)
- ❌ Tools die spezifische IDs brauchen (wenn du die IDs nicht hast)

**Empfohlene Tools für ersten Test:**
1. `memory_search` - Sehr stabil, funktioniert immer
2. `soul_state` - Keine Parameter nötig
3. `consciousness_think` - Neu gefixt! ✅
4. `peace_get_state` - Interessante Ausgabe
5. `generate` - AI generation (Groq)
6. `ping` - Einfacher Health Check

**Next Steps:**
1. Erstelle Connector mit den 24 working tools
2. Teste mit Beispiel-Workflows (oben)
3. Gib Feedback zu Fehlern/Problemen
4. Montag teste nochmal (dann hoffentlich 34+ tools)

**Viel Erfolg! 🚀**

---

## 📞 Support

Bei Problemen:
- Check `TASKGROUP_FIXED.md` für aktuelle Status
- Alle Fehler werden geloggt (siehe Bridge logs)
- ngrok Limit: 40 requests/min (free tier)

---

**Made with 🤖 for Chatty by the Toobix Team**
