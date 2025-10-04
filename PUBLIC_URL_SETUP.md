# 🌍 Public MCP URL Setup - Chatty Connector

**Problem:** Chatty needs a **public URL** to connect to our MCP Server  
**Current:** `http://localhost:3337` (only accessible locally)  
**Solution:** Expose via **ngrok** or **Cloudflare Tunnel**

---

## ⚡ Quick Setup (ngrok - FREE)

### 1. Install ngrok
```bash
# Windows (Chocolatey)
choco install ngrok

# Or download from: https://ngrok.com/download
```

### 2. Signup & Get Auth Token
```bash
# Signup at: https://dashboard.ngrok.com/signup
# Copy your auth token from: https://dashboard.ngrok.com/get-started/your-authtoken

ngrok config add-authtoken YOUR_TOKEN_HERE
```

### 3. Start Bridge (Terminal 1)
```bash
cd C:\Toobix-Unified
bun run dev:bridge
# Bridge running on http://localhost:3337
```

### 4. Start ngrok Tunnel (Terminal 2)
```bash
ngrok http 3337
```

### 5. Copy Public URL
```
ngrok                                                                                                                                         
                                                                                                                                              
Session Status                online                                                                                                          
Account                       Your Name (Plan: Free)                                                                                         
Version                       3.0.0                                                                                                          
Region                        Europe (eu)                                                                                                    
Latency                       20ms                                                                                                           
Web Interface                 http://127.0.0.1:4040                                                                                          
Forwarding                    https://abc123xyz.ngrok-free.app -> http://localhost:3337  👈 THIS IS YOUR PUBLIC URL
                                                                                                                                              
Connections                   ttl     opn     rt1     rt5     p50     p90                                                                    
                              0       0       0.00    0.00    0.00    0.00                                                                   
```

### 6. Test Public URL
```bash
# Test from anywhere (even from Chatty's machine)
curl https://abc123xyz.ngrok-free.app/health
# {"status":"healthy","toolCount":46,"timestamp":...}

curl https://abc123xyz.ngrok-free.app/discovery
# {"tools":[...46 tools...]}
```

### 7. Use in Chatty Client
```typescript
import { ChattyMCPClient } from "@toobix/chatty-client"

// Use PUBLIC ngrok URL instead of localhost
const client = new ChattyMCPClient("https://abc123xyz.ngrok-free.app")

const tools = await client.discoverTools()
console.log(`Found ${tools.length} tools via public URL!`)
```

---

## 🔒 Production Setup (Cloudflare Tunnel - FREE)

### 1. Install Cloudflare Tunnel
```bash
# Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
```

### 2. Login
```bash
cloudflared tunnel login
```

### 3. Create Tunnel
```bash
cloudflared tunnel create toobix-mcp
# Note the Tunnel ID
```

### 4. Configure Tunnel
Create `config.yml`:
```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: C:\Users\YourUser\.cloudflared\YOUR_TUNNEL_ID.json

ingress:
  - hostname: mcp.toobix.app  # Your custom domain
    service: http://localhost:3337
  - service: http_status:404
```

### 5. Run Tunnel
```bash
cloudflared tunnel run toobix-mcp
```

### 6. Add DNS Record
Go to Cloudflare Dashboard → DNS → Add CNAME:
```
mcp.toobix.app → YOUR_TUNNEL_ID.cfargotunnel.com
```

### 7. Use Custom Domain
```typescript
const client = new ChattyMCPClient("https://mcp.toobix.app")
```

---

## 🚀 Recommended: ngrok for Testing, Cloudflare for Production

| Feature | ngrok (Free) | Cloudflare Tunnel (Free) |
|---------|--------------|--------------------------|
| **Setup Time** | 2 minutes | 10 minutes |
| **Custom Domain** | ❌ (random URL) | ✅ |
| **HTTPS** | ✅ | ✅ |
| **Permanent URL** | ❌ (changes on restart) | ✅ |
| **Rate Limits** | 40 req/min | No limits |
| **Best For** | Testing, demos | Production |

---

## 📝 Updated Chatty Client Usage

### Before (localhost only):
```typescript
const client = new ChattyMCPClient("http://localhost:3337")
// ❌ Only works on same machine
```

### After (public URL):
```typescript
// ngrok URL (testing)
const client = new ChattyMCPClient("https://abc123xyz.ngrok-free.app")
// ✅ Works from anywhere

// Or Cloudflare Tunnel (production)
const client = new ChattyMCPClient("https://mcp.toobix.app")
// ✅ Works from anywhere, permanent URL
```

---

## 🔐 Security Considerations

### 1. **Enable JWT Authentication** (Monday)
```typescript
// Add JWT token
const client = new ChattyMCPClient(
  "https://abc123xyz.ngrok-free.app",
  { "Authorization": "Bearer YOUR_JWT_TOKEN" }
)
```

### 2. **Add Rate Limiting** (Monday)
Already written in `packages/bridge/src/middleware/rateLimit.ts`

### 3. **Whitelist IPs** (Optional)
```typescript
// In Bridge
const allowedIPs = ['1.2.3.4', '5.6.7.8']
if (!allowedIPs.includes(req.ip)) {
  return new Response('Forbidden', { status: 403 })
}
```

### 4. **Use API Keys** (Alternative to JWT)
```env
MCP_API_KEY=secret_key_here
```

---

## 📊 Cost Comparison

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| **ngrok** | 1 tunnel, 40 req/min | $8/month (unlimited) |
| **Cloudflare Tunnel** | Unlimited | Free forever |
| **Vercel** | N/A (can't tunnel) | N/A |
| **Railway** | $5 credit/month | $5/month |

**Recommendation:** Start with **ngrok Free** for testing, switch to **Cloudflare Tunnel** when ready for production.

---

## 🎯 Action Plan

### Right Now (5 minutes):
1. Install ngrok: `choco install ngrok`
2. Get auth token: https://dashboard.ngrok.com/get-started/your-authtoken
3. Run: `ngrok http 3337`
4. Copy public URL
5. Test: `curl https://YOUR_URL/health`

### Monday (30 minutes):
1. Setup Cloudflare Tunnel
2. Configure custom domain (mcp.toobix.app)
3. Add JWT authentication
4. Add rate limiting

### This Week:
1. Monitor ngrok usage (40 req/min limit)
2. Upgrade to ngrok paid if needed ($8/month)
3. Or switch to Cloudflare Tunnel (free forever)

---

## 🧪 Testing Public URL

### Test Script (update test-chatty.ts):
```typescript
#!/usr/bin/env bun
import { ChattyMCPClient } from '../packages/chatty-client/index.ts'

// Get public URL from environment or command line
const MCP_URL = process.env.MCP_PUBLIC_URL || 'http://localhost:3337'

console.log(`🌍 Testing public MCP URL: ${MCP_URL}\n`)

const client = new ChattyMCPClient(MCP_URL)

// Test health
const healthy = await client.healthCheck()
console.log(`✅ Health: ${healthy ? 'HEALTHY' : 'UNHEALTHY'}`)

// Test discovery
const tools = await client.discoverTools()
console.log(`✅ Found ${tools.length} tools via public URL!`)

// Test tool call
const result = await client.callTool('memory_search', { query: 'test' })
console.log(`✅ Tool call successful!`)

console.log(`\n🎉 Public URL is working!`)
console.log(`\n📝 Share this URL with Chatty:`)
console.log(`   ${MCP_URL}`)
```

Run:
```bash
# Test localhost
bun run scripts/test-chatty.ts

# Test public URL
MCP_PUBLIC_URL=https://abc123xyz.ngrok-free.app bun run scripts/test-chatty.ts
```

---

## 📞 For Chatty

**Once you have ngrok running:**

```
🌍 Public MCP URL: https://abc123xyz.ngrok-free.app

Endpoints:
- GET  /discovery  - List 46 tools
- POST /invoke     - Call any tool
- GET  /health     - Health check

Example:
curl https://abc123xyz.ngrok-free.app/health
```

**Chatty can connect from anywhere!** 🌍

---

## ⚠️ Important Notes

### ngrok Free Limitations:
- Random URL (changes on restart)
- 40 requests/minute
- 1 concurrent tunnel
- Session timeout after 8 hours

### To Keep URL Permanent:
- Use ngrok paid ($8/month) for static domain
- Or use Cloudflare Tunnel (free, permanent)

### For Production:
- Cloudflare Tunnel + Custom Domain
- JWT Authentication
- Rate Limiting
- Monitoring

---

**Next Steps:**
1. Install ngrok NOW (5 min)
2. Get public URL
3. Share with Chatty
4. Setup Cloudflare Tunnel Monday

---

**Made with 🌍 by the Toobix Team**
