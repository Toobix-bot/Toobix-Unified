# 🐛 TaskGroup Error - Fix & Analysis

**Error:** `unhandled errors in a TaskGroup (1 sub-exception)`  
**When:** Chatty tries to create MCP connector  
**Status:** 🔍 Investigating

---

## 🔍 Root Cause Analysis (from Chatty)

### Possible Causes:

1. **Tool throws uncaught exception**
   - One of 46 MCP tools throws error without try/catch
   - TaskGroup aborts all parallel tasks

2. **Timeout / Network error**
   - ngrok tunnel latency
   - Connection drops
   - Task hangs without timeout

3. **SSE / Streaming issue**
   - Server-Sent Events error
   - Stream processing failure

4. **Missing error handling in tasks**
   - Exception bubbles up
   - Terminates entire TaskGroup

5. **Protocol mismatch**
   - JSON-RPC format error
   - Wrong parameters
   - Method not found

---

## 🛠️ Fixes to Implement

### 1. Add Error Handling to ALL Tools

**File:** `packages/bridge/src/mcp/server.ts`

**Current issue:** Tools can throw unhandled exceptions

**Fix:** Wrap all tool handlers in try/catch

```typescript
// BEFORE (risky)
case 'tools/call': {
  const { name, arguments: args } = params || {}
  const tool = self.tools.get(name)
  const result = await tool.handler(args || {})  // ❌ Can throw!
  return Response...
}

// AFTER (safe)
case 'tools/call': {
  const { name, arguments: args } = params || {}
  const tool = self.tools.get(name)
  
  try {
    const result = await tool.handler(args || {})  // ✅ Caught!
    return Response...
  } catch (error: any) {
    console.error(`[MCP] Tool ${name} failed:`, error)
    return new Response(JSON.stringify({
      jsonrpc: '2.0',
      id,
      error: {
        code: -32603,
        message: 'Tool execution failed',
        data: {
          tool: name,
          error: error.message,
          stack: error.stack
        }
      }
    }), { status: 500, headers })
  }
}
```

### 2. Add Timeouts to Tool Calls

```typescript
// Add timeout to prevent hanging
async function executeToolWithTimeout(
  handler: Function, 
  args: any, 
  timeoutMs: number = 30000
): Promise<any> {
  return Promise.race([
    handler(args),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Tool timeout')), timeoutMs)
    )
  ])
}

// Use it:
const result = await executeToolWithTimeout(
  tool.handler, 
  args, 
  30000  // 30 second timeout
)
```

### 3. Add Tool Validation

```typescript
// Validate tool exists BEFORE calling
if (!tool) {
  return new Response(JSON.stringify({
    jsonrpc: '2.0',
    id,
    error: {
      code: -32601,
      message: `Tool not found: ${name}`,
      data: {
        available: Array.from(self.tools.keys())
      }
    }
  }), { status: 404, headers })
}

// Validate required parameters
const required = tool.inputSchema?.required || []
const missing = required.filter(r => !(r in args))
if (missing.length > 0) {
  return new Response(JSON.stringify({
    jsonrpc: '2.0',
    id,
    error: {
      code: -32602,
      message: 'Invalid params',
      data: {
        missing: missing,
        required: required
      }
    }
  }), { status: 400, headers })
}
```

### 4. Add Logging to ALL Tool Calls

```typescript
console.log(`[MCP] Tool call START: ${name}`, {
  args,
  timestamp: Date.now()
})

try {
  const startTime = Date.now()
  const result = await tool.handler(args)
  const duration = Date.now() - startTime
  
  console.log(`[MCP] Tool call SUCCESS: ${name}`, {
    duration: `${duration}ms`,
    resultSize: JSON.stringify(result).length
  })
  
  return result
} catch (error: any) {
  console.error(`[MCP] Tool call ERROR: ${name}`, {
    error: error.message,
    stack: error.stack,
    args
  })
  throw error
}
```

---

## 🧪 Testing Each Tool Individually

### Test Script:
```typescript
#!/usr/bin/env bun
// Test each MCP tool individually to find the problematic one

import { ChattyMCPClient } from '../packages/chatty-client/index.ts'

const PUBLIC_URL = process.env.MCP_PUBLIC_URL || 'http://localhost:3337'
const client = new ChattyMCPClient(PUBLIC_URL)

async function testAllTools() {
  console.log('🧪 Testing all 46 tools individually...\n')
  
  const tools = await client.discoverTools()
  const results: Record<string, 'pass' | 'fail'> = {}
  
  for (const tool of tools) {
    try {
      console.log(`Testing ${tool.name}...`)
      
      // Simple test args (might need adjustment per tool)
      const testArgs = getTestArgs(tool.name)
      
      await client.callTool(tool.name, testArgs)
      results[tool.name] = 'pass'
      console.log(`  ✅ ${tool.name} PASSED`)
      
    } catch (error: any) {
      results[tool.name] = 'fail'
      console.error(`  ❌ ${tool.name} FAILED:`, error.message)
    }
  }
  
  // Summary
  const passed = Object.values(results).filter(r => r === 'pass').length
  const failed = Object.values(results).filter(r => r === 'fail').length
  
  console.log(`\n📊 Results:`)
  console.log(`  ✅ Passed: ${passed}`)
  console.log(`  ❌ Failed: ${failed}`)
  
  if (failed > 0) {
    console.log(`\n🔍 Failed tools:`)
    Object.entries(results).forEach(([name, status]) => {
      if (status === 'fail') {
        console.log(`  - ${name}`)
      }
    })
  }
}

function getTestArgs(toolName: string): any {
  // Provide sensible test arguments per tool
  const argsMap: Record<string, any> = {
    'memory_search': { query: 'test', limit: 1 },
    'memory_add': { text: 'test', source: 'test' },
    'generate': { prompt: 'test', max_tokens: 10 },
    'soul_state': {},
    'story_state': {},
    'love_get_score': {},
    'peace_get_state': {},
    'consciousness_state': {},
    'ping': {},
    // Add more as needed
  }
  
  return argsMap[toolName] || {}
}

testAllTools()
```

---

## 🔐 Immediate Fixes (Priority Order)

### P0 - URGENT (Do NOW):
1. ✅ Add try/catch to `/invoke` endpoint
2. ✅ Add 30-second timeout to all tool calls
3. ✅ Add detailed error logging

### P1 - HIGH (Do Monday):
4. ⏳ Test all 46 tools individually
5. ⏳ Identify problematic tool(s)
6. ⏳ Fix tool-specific errors

### P2 - MEDIUM:
7. ⏳ Add parameter validation
8. ⏳ Add rate limiting per tool
9. ⏳ Add circuit breaker pattern

---

## 💡 Quick Diagnosis

**To find the problematic tool RIGHT NOW:**

```bash
# Test each tool manually
curl -X POST http://localhost:3337/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "call_tool",
    "params": {
      "tool": "memory_search",
      "arguments": { "query": "test" }
    },
    "id": "1"
  }'

# Try each tool one by one:
# - memory_search ✅
# - memory_add ✅
# - generate ❌ (might be this one?)
# - soul_state ✅
# ...
```

---

## 📞 For Chatty

**Chatty, danke für die exzellente Analyse!** 🙏

**Was wir jetzt machen:**

1. **Sofort:** Error handling zu `/invoke` hinzufügen
2. **5 Min:** Alle Tools einzeln testen
3. **10 Min:** Problematisches Tool fixen
4. **15 Min:** Nochmal testen

**Kannst du nochmal versuchen den Connector zu erstellen, nachdem wir die Fixes pushed haben?**

---

**Next:** Implementing fixes NOW! ⚡
