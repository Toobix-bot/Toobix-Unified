# 🌐 Toobix Bridge MCP - Public Access Setup

## Aktueller Status

**Bridge Service läuft auf:** `http://localhost:3337`

**Ngrok installiert:** ✅ `C:\Users\micha\AppData\Local\Microsoft\WindowsApps\ngrok.exe`

**Alte URL (nicht mehr aktiv):** `https://multiplicative-unapprehendably-marisha.ngrok-free.dev/mcp`

## 🚀 Ngrok Tunnel starten

### Option 1: Einfacher Tunnel (temporär)

```powershell
# Starte Bridge Service
.\start-services.ps1

# In neuem Terminal: Starte ngrok Tunnel
ngrok http 3337
```

**Du bekommst dann eine URL wie:**
```
https://abc123.ngrok-free.app → localhost:3337
```

### Option 2: Mit fixem Subdomain (ngrok Pro)

```powershell
ngrok http 3337 --domain=toobix-bridge.ngrok.app
```

### Option 3: Mit Config File (empfohlen)

**Erstelle `ngrok.yml`:**

```yaml
version: "2"
authtoken: DEIN_NGROK_TOKEN
tunnels:
  toobix-bridge:
    addr: 3337
    proto: http
    inspect: true
    bind_tls: true
    schemes:
      - https
```

**Dann starten:**
```powershell
ngrok start toobix-bridge
```

## 📋 MCP Integration

### Für Claude Desktop

**Config File:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "toobix-bridge": {
      "command": "node",
      "args": [
        "C:\\Toobix-Unified\\packages\\bridge\\mcp-client.js"
      ]
    }
  }
}
```

### Für ChatGPT (Custom GPT Actions)

**OpenAPI Schema:**

```yaml
openapi: 3.1.0
info:
  title: Toobix Bridge MCP
  description: Memory, Soul & AI Tools
  version: 1.0.0
servers:
  - url: https://DEINE-NGROK-URL.ngrok-free.app
    description: Toobix Bridge MCP Server

paths:
  /tools:
    get:
      summary: List available MCP tools
      operationId: listTools
      responses:
        '200':
          description: List of tools
          content:
            application/json:
              schema:
                type: object
                properties:
                  tools:
                    type: array
                    items:
                      type: object

  /tools/execute:
    post:
      summary: Execute an MCP tool
      operationId: executeTool
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                tool:
                  type: string
                  enum:
                    - memory_search
                    - memory_add
                    - generate
                    - trigger_action
                    - soul_state
                    - soul_event
                args:
                  type: object
              required:
                - tool
      responses:
        '200':
          description: Tool execution result
          content:
            application/json:
              schema:
                type: object
                properties:
                  result:
                    type: object

  /stats:
    get:
      summary: Get Bridge statistics
      operationId: getStats
      responses:
        '200':
          description: Statistics
          content:
            application/json:
              schema:
                type: object
                properties:
                  memory:
                    type: integer
                  actions:
                    type: integer
                  tools:
                    type: integer
                  soul:
                    type: object
```

## 🔐 Security

**Wichtig:** Der Bridge Service hat KEINE Authentifizierung!

**Für Production:**

1. **API Key hinzufügen:**
```typescript
// In packages/bridge/src/index.ts
if (req.method === 'POST') {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.BRIDGE_API_KEY}`) {
    return new Response('Unauthorized', { status: 401 })
  }
}
```

2. **Rate Limiting:**
```typescript
// Limit requests pro IP
const rateLimits = new Map<string, number>()
```

3. **CORS Configuration:**
```typescript
'Access-Control-Allow-Origin': 'https://chatgpt.com'
```

## 📝 Quick Start Guide

**1. Starte alle Services:**
```powershell
.\start-services.ps1
```

**2. Starte ngrok Tunnel:**
```powershell
ngrok http 3337
```

**3. Kopiere die ngrok URL** (z.B. `https://abc123.ngrok-free.app`)

**4. Teste die Verbindung:**
```powershell
curl https://abc123.ngrok-free.app/health
```

**5. Verbinde mit ChatGPT:**
- Gehe zu ChatGPT → "Explore GPTs" → "Create"
- Füge Actions hinzu mit der OpenAPI Schema (siehe oben)
- Ersetze `DEINE-NGROK-URL` mit deiner echten URL

**6. Teste im Chat:**
```
"Get my soul state"
"Search my memories for 'test'"
"Add a new memory: I learned MCP today!"
```

## 🎯 Nächste Schritte

- [ ] Ngrok Tunnel starten und URL dokumentieren
- [ ] OpenAPI Schema in ChatGPT GPT einbinden
- [ ] Authentifizierung hinzufügen
- [ ] Claude Desktop Config erstellen
- [ ] Production Deployment (Vercel/Railway)
