# @toobix/bridge

MCP Tool Bridge - Integration von Echo-Bridge (Version_8) in Toobix Unified.

## Features

- 🔧 **MCP Server** - Model Context Protocol Server auf Port 3337
- 🧠 **Memory Tools** - RAG-basierte Memory-Suche mit Embeddings
- ⚡ **Actions** - Automatisierte Aktionen und Workflows
- 🤖 **AI Integration** - Groq & Ollama Support
- 📁 **File System** - Workspace File Operations

## Architecture

```
packages/bridge/
├── src/
│   ├── index.ts           # Main BridgeService
│   ├── mcp/              # MCP server & tools
│   │   ├── server.ts
│   │   └── tools/
│   ├── memory/           # Memory/RAG service
│   │   ├── service.ts
│   │   └── embeddings.ts
│   ├── actions/          # Action system
│   │   └── service.ts
│   └── ai/               # AI providers
│       ├── groq.ts
│       └── ollama.ts
├── config/
│   └── default.yaml      # Bridge configuration
└── public/               # OpenAPI specs
```

## Quick Start

```bash
# Install dependencies
bun install

# Development mode
bun run dev

# Production
bun run start
```

## Configuration

Create `.env` in bridge root:

```env
GROQ_API_KEY=your_key_here
OLLAMA_HOST=http://localhost:11434
MCP_PORT=3337
DATABASE_PATH=../../data/toobix-unified.db
```

## MCP Tools

### Memory Tools
- `memory_search` - RAG search in memory
- `memory_add` - Add new memory
- `memory_delete` - Remove memory

### Action Tools
- `trigger_action` - Execute action
- `list_actions` - Get available actions

### AI Tools
- `generate` - Generate text with Groq/Ollama
- `embed` - Generate embeddings

### File System Tools
- `read_file` - Read workspace file
- `write_file` - Write workspace file
- `list_dir` - List directory

## Integration

```typescript
import { BridgeService } from '@toobix/bridge'

const bridge = new BridgeService({
  port: 3337,
  database: './data/toobix-unified.db',
  groqApiKey: process.env.GROQ_API_KEY
})

await bridge.start()
```

## Migration from Echo-Bridge

Ported from `C:\GPT\Version_8\echo-bridge\`:
- ✅ Memory service (Python → TypeScript)
- ✅ MCP tools (Python → TypeScript)
- ✅ Action system (Enhanced)
- ✅ AI integrations (Groq + Ollama)

## Development

```bash
# Watch mode
bun run dev

# Build
bun run build

# Test
bun test
```

## License

MIT
