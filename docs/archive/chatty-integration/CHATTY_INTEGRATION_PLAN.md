# 🤖 Chatty MCP Integration - Implementation Plan

**Status:** 🚧 In Progress  
**Target:** Week of October 7-11, 2025  
**Owner:** Toobix Team

---

## 📋 Overview

Integrate "Chatty" (external AI reviewer/agent) with the Toobix MCP Server to enable:
- Direct tool access (46 MCP tools)
- Real-time memory search
- Story/consciousness interaction
- External AI collaboration

**Key Insight from Chatty:**
> "Wie verbinden wir dich chatty mit dem mcp server?"

This is a **critical milestone** - connecting external AI agents to Toobix tools enables:
- Multi-AI collaboration
- External code reviews
- Automated testing via AI agents
- Community-driven AI integrations

---

## 🎯 Goals

### Primary Goals
1. ✅ **ChattyMCPClient** - Low-level MCP protocol client
2. ✅ **ChattyAgent** - High-level conversational interface
3. ⏳ **Bridge Integration** - Connect to existing MCP Server (Port 3337)
4. ⏳ **Authentication** - JWT tokens for secure access
5. ⏳ **Testing** - Unit tests + integration tests

### Stretch Goals
- WebSocket support for streaming
- Tool batching (multiple tools in one request)
- Retry logic + exponential backoff
- Rate limiting awareness

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                       External AI Agent                       │
│                      (ChatGPT, Claude, etc.)                  │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │   ChattyAgent        │  ← High-level interface
                │   (Command Parsing)  │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │  ChattyMCPClient     │  ← Low-level MCP protocol
                │  (JSON-RPC 2.0)      │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │   Toobix Bridge      │  ← Existing MCP Server
                │   Port 3337          │     (Port 3337)
                │   46 Tools           │
                └──────────────────────┘
```

---

## 📦 Components

### 1. `ChattyMCPClient` (Low-Level Client)

**File:** `packages/chatty-client/ChattyMCPClient.ts`

**Responsibilities:**
- JSON-RPC 2.0 protocol implementation
- Tool discovery (`GET /discovery`)
- Tool invocation (`POST /invoke`)
- Error handling
- Health checks

**API:**
```typescript
class ChattyMCPClient {
  constructor(baseUrl: string, headers?: Record<string,string>)
  
  async discoverTools(): Promise<MCPTool[]>
  async callTool(toolName: string, params: any): Promise<any>
  async listTools(): Promise<string[]>
  async healthCheck(): Promise<boolean>
}
```

**Status:** ✅ Implemented (Oct 4, 2025)

---

### 2. `ChattyAgent` (High-Level Agent)

**File:** `packages/chatty-client/index.ts`

**Responsibilities:**
- Command parsing (`/mem`, `/story`, `/think`, etc.)
- Natural language understanding
- Context management
- Response formatting

**Commands:**
- `/mem <query>` - Memory search
- `/story` - Story status
- `/think <thought>` - Consciousness
- `/gratitude <text>` - Log gratitude
- `/tools` - List tools
- `/help` - Show help

**Status:** ✅ Implemented (Oct 4, 2025)

---

### 3. Bridge Integration

**Files:**
- `packages/bridge/src/routes/chatty.ts` (new)
- `packages/bridge/src/index.ts` (update)

**Requirements:**
- Endpoint: `/chatty/chat` (POST)
- Auth: JWT token
- Rate limiting: 60 req/min
- Logging: All tool calls

**Status:** ⏳ Planned (Oct 7, 2025)

---

### 4. Authentication

**JWT Token Handling:**
```typescript
const agent = new ChattyAgent("http://localhost:3337", process.env.MCP_JWT);
```

**Token Format:**
```json
{
  "userId": "chatty-external",
  "role": "ai-agent",
  "permissions": ["read", "write"],
  "expiresAt": "2025-10-14T00:00:00Z"
}
```

**Status:** ⏳ Planned (Oct 8, 2025)

---

### 5. Testing

**Unit Tests:**
```typescript
// packages/chatty-client/__tests__/ChattyMCPClient.test.ts
describe("ChattyMCPClient", () => {
  it("should discover tools", async () => {
    const client = new ChattyMCPClient("http://localhost:3337");
    const tools = await client.discoverTools();
    expect(tools.length).toBeGreaterThan(0);
  });

  it("should call memory_search tool", async () => {
    const client = new ChattyMCPClient("http://localhost:3337");
    const result = await client.callTool("memory_search", { query: "test" });
    expect(result).toBeDefined();
  });
});
```

**Integration Tests:**
```typescript
// packages/chatty-client/__tests__/ChattyAgent.integration.test.ts
describe("ChattyAgent Integration", () => {
  it("should handle /mem command", async () => {
    const agent = new ChattyAgent("http://localhost:3337");
    await agent.initialize();
    const response = await agent.handleUserInput("/mem test query");
    expect(response).toContain("Memory search results");
  });
});
```

**Status:** ⏳ Planned (Oct 9-10, 2025)

---

## 📅 Timeline

### **Day 1 (Oct 7, Monday) - Setup**
**Morning (9:00-12:00):**
- ✅ Create `packages/chatty-client` package
- ✅ Implement `ChattyMCPClient` class
- ✅ Implement `ChattyAgent` class
- ⏳ Add to workspace (`package.json`)

**Afternoon (13:00-17:00):**
- ⏳ Install dependencies (`bun install`)
- ⏳ Create bridge route `/chatty/chat`
- ⏳ Test basic connection (health check)

**Deliverable:** Basic client working, can discover tools

---

### **Day 2 (Oct 8, Tuesday) - Integration**
**Morning (9:00-12:00):**
- ⏳ Integrate JWT authentication
- ⏳ Add rate limiting
- ⏳ Test tool invocation (memory_search)

**Afternoon (13:00-17:00):**
- ⏳ Add error handling
- ⏳ Add logging (all tool calls)
- ⏳ Test all commands (`/mem`, `/story`, `/think`)

**Deliverable:** Full integration working, all commands tested

---

### **Day 3-4 (Oct 9-10, Wed-Thu) - Testing**
**Tasks:**
- ⏳ Write unit tests (ChattyMCPClient)
- ⏳ Write integration tests (ChattyAgent)
- ⏳ Test with real ChatGPT/Claude
- ⏳ Test all 46 MCP tools

**Target:** 80% test coverage

---

### **Day 5 (Oct 11, Friday) - Documentation**
**Tasks:**
- ⏳ Update README.md
- ⏳ Add usage examples
- ⏳ Document API endpoints
- ⏳ Create demo video/GIF

**Deliverable:** Documentation complete, ready for release

---

## 🔐 Security Considerations

### 1. **Authentication**
- JWT tokens required for all requests
- Token expiration: 7 days
- Refresh token mechanism

### 2. **Rate Limiting**
- 60 requests/minute per token
- Tool-specific limits (e.g., memory_search: 20/min)
- Exponential backoff on rate limit

### 3. **Input Validation**
- Validate all tool parameters
- Sanitize user input
- Prevent injection attacks

### 4. **Audit Logging**
- Log all tool calls (tool name, params, result)
- Log authentication attempts
- Log rate limit violations

### 5. **Permissions**
- Read-only tools (memory_search, story_get_status)
- Write tools (consciousness_think, love_log_gratitude)
- Admin tools (system_reset) - blocked for external agents

---

## 🧪 Testing Strategy

### Unit Tests
- ChattyMCPClient methods
- Error handling
- Health checks
- Tool discovery

### Integration Tests
- Full flow: Initialize → Command → Tool → Response
- All 46 MCP tools
- Error scenarios (network, auth, rate limit)

### End-to-End Tests
- Real ChatGPT/Claude connection
- Real MCP Server (Port 3337)
- Real database interactions

### Load Tests
- 100 concurrent agents
- 1000 requests/minute
- Sustained load (1 hour)

---

## 📊 Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| **Tools Accessible** | 46/46 | 0/46 |
| **Test Coverage** | 80%+ | 0% |
| **Response Time** | <500ms | N/A |
| **Error Rate** | <1% | N/A |
| **Uptime** | 99.5%+ | N/A |

---

## 🚧 Known Issues & Blockers

### Current Blockers
- ❌ Bridge doesn't have `/discovery` and `/invoke` endpoints yet
- ❌ No JWT auth system (auth.ts not integrated)
- ❌ No rate limiting middleware

### Solutions
1. **Bridge Endpoints:** Add in Day 1 afternoon
2. **JWT Auth:** Integrate Day 2 morning (already written in `middleware/auth.ts`)
3. **Rate Limiting:** Already written in `middleware/rateLimit.ts`, integrate Day 2

---

## 🎯 Next Steps After This Week

### v0.2 Features (Week 2-3)
- WebSocket support for streaming responses
- Tool batching (multiple tools in one request)
- Retry logic with exponential backoff
- Caching of tool responses

### v0.3 Features (Week 4-5)
- Multi-agent coordination (multiple Chattys)
- Agent-to-agent communication
- Shared context/memory across agents
- Agent marketplace (community agents)

### v1.0 Features (November)
- Production-ready
- Full security audit
- Performance optimization
- Documentation complete

---

## 📞 Chatty's Offer

> **Chatty:** "Wenn du willst, kann ich eine fertige Pull-Request-Vorlage für dein Toobix-Repo schreiben mit genau diesem Client-Code (angepasst an deine Verzeichnisse), damit du ihn direkt einchecken kannst — und wir zusammen testen können. Möchtest du das?"

**Our Response:** ✅ **YES, PLEASE!**

**What we need from Chatty:**
1. Review `packages/chatty-client/*` code
2. Suggest improvements (error handling, edge cases)
3. Test with real ChatGPT/Claude connection
4. Provide PR review feedback

**How to collaborate:**
- Weekly sync (Fridays)
- PR reviews on GitHub
- Test external agent connections
- Document best practices

---

## 🙏 Thank You, Chatty!

This integration proposal is **exactly what we needed**:
- ✅ Concrete code examples
- ✅ Clear architecture
- ✅ Step-by-step guide
- ✅ Security considerations
- ✅ Testing strategy

**This is the kind of collaboration that makes Toobix better!** 🚀

---

**Next Action:** Implement Bridge endpoints Monday morning (Oct 7, 9:00 AM)

**Status:** 🟢 Ready to execute

---

**Made with ❤️ by the Toobix Team & Chatty**
