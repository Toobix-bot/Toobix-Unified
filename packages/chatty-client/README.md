# @toobix/chatty-client

**Chatty AI Agent with MCP Integration**

Connect an AI agent (like ChatGPT, Claude, or custom models) to the Toobix MCP Server to access 46 tools across 7 core systems.

---

## 🚀 Quick Start

### Installation

```bash
cd packages/chatty-client
bun install
```

### Basic Usage

```typescript
import { ChattyAgent } from "@toobix/chatty-client";

// Create agent
const agent = new ChattyAgent("http://localhost:3337");

// Initialize (discover tools)
await agent.initialize();

// Process user input
const response = await agent.handleUserInput("/mem what did I say yesterday?");
console.log(response);
```

---

## 📚 API Reference

### `ChattyMCPClient`

Low-level client for MCP protocol.

```typescript
const client = new ChattyMCPClient("http://localhost:3337", {
  "Authorization": "Bearer <JWT_TOKEN>"
});

// Discover tools
const tools = await client.discoverTools();

// Call a tool
const result = await client.callTool("memory_search", { query: "..." });

// Health check
const healthy = await client.healthCheck();
```

### `ChattyAgent`

High-level agent with command parsing.

```typescript
const agent = new ChattyAgent("http://localhost:3337", "<JWT_TOKEN>");
await agent.initialize();

// Commands
await agent.handleUserInput("/mem <query>");       // Memory search
await agent.handleUserInput("/story");              // Story status
await agent.handleUserInput("/think <thought>");    // Consciousness
await agent.handleUserInput("/gratitude <text>");   // Log gratitude
await agent.handleUserInput("/tools");              // List tools
await agent.handleUserInput("/help");               // Show help
```

---

## 🔧 Integration Examples

### Express API

```typescript
import express from "express";
import { ChattyAgent } from "@toobix/chatty-client";

const app = express();
app.use(express.json());

const agent = new ChattyAgent("http://localhost:3337");
await agent.initialize();

app.post("/chat", async (req, res) => {
  const { userInput } = req.body;
  try {
    const reply = await agent.handleUserInput(userInput);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(4000);
```

### Next.js API Route

```typescript
// app/api/chat/route.ts
import { ChattyAgent } from "@toobix/chatty-client";

const agent = new ChattyAgent(process.env.MCP_BASE_URL!);
await agent.initialize();

export async function POST(req: Request) {
  const { userInput } = await req.json();
  const reply = await agent.handleUserInput(userInput);
  return Response.json({ reply });
}
```

---

## 🛠️ Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/mem <query>` | Search memory system | `/mem what did I learn?` |
| `/story` | Get story/level status | `/story` |
| `/think <thought>` | Consciousness reflection | `/think I am grateful` |
| `/gratitude <text>` | Log gratitude | `/gratitude Thank you!` |
| `/tools` | List all MCP tools | `/tools` |
| `/help` | Show help | `/help` |

---

## 🔐 Security

### JWT Authentication

```typescript
const agent = new ChattyAgent("http://localhost:3337", process.env.MCP_JWT);
```

### Environment Variables

```env
MCP_BASE_URL=http://localhost:3337
MCP_JWT_TOKEN=your-jwt-token-here
```

---

## 🧪 Testing

```bash
bun test
```

Example test:

```typescript
import { describe, it, expect } from "vitest";
import { ChattyMCPClient } from "./ChattyMCPClient";

describe("ChattyMCPClient", () => {
  it("should discover tools", async () => {
    const client = new ChattyMCPClient("http://localhost:3337");
    const tools = await client.discoverTools();
    expect(tools.length).toBeGreaterThan(0);
  });
});
```

---

## 📖 Architecture

```
┌─────────────────┐
│  ChattyAgent    │  ← High-level conversational interface
│  (index.ts)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ChattyMCPClient │  ← Low-level MCP protocol
│ (Client.ts)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   MCP Server    │  ← Toobix Bridge (Port 3337)
│   46 Tools      │
└─────────────────┘
```

---

## 🚧 Roadmap

### v0.2 (This Week)
- ✅ Basic client implementation
- ✅ Command parsing
- ⏳ Unit tests
- ⏳ Integration with Bridge

### v0.3 (Next Week)
- Streaming responses (WebSockets)
- Tool batching (multiple tools in one request)
- Retry logic & error handling
- Rate limiting awareness

### v1.0 (November)
- Production-ready
- Full test coverage (80%+)
- Documentation
- Examples

---

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md)

---

## 📄 License

MIT License - see [LICENSE](../../LICENSE)

---

**Made with ❤️ by the Toobix Team**
