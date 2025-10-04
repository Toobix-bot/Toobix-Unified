# 🚀 Toobix Startup - Quick Reference

**Start the entire Toobix system with ONE command!**

---

## ⚡ Quick Start

### Windows (PowerShell)

```powershell
# Simple - Start everything
.\start-toobix.ps1

# Full system with living being
.\start-toobix.ps1 -AwakeBeing

# Demo mode
.\start-toobix.ps1 -Mode demo -AwakeBeing

# Full autonomous mode
.\start-toobix.ps1 -Mode full -AwakeBeing -EnableAutonomy
```

### Cross-Platform (Bun)

```bash
# Simple - Start everything
bun start

# Just bridge server
bun start:bridge

# Bridge + demo
bun start:demo

# Full system with autonomy
bun start:autonomous

# Custom options
bun run scripts/start-all.ts --mode full --awaken --autonomy
```

---

## 📋 Available Commands

### NPM/Bun Scripts (package.json)

| Command | Description |
|---------|-------------|
| `bun start` | Start full system (bridge + web) |
| `bun start:full` | Same as `start` |
| `bun start:bridge` | Only bridge server (no web) |
| `bun start:demo` | Bridge + living being demo |
| `bun start:autonomous` | Full system + awaken + autonomy |
| `bun demo:being` | Run living being demo (requires bridge) |
| `bun demo:voice` | Voice control demo |

### PowerShell Script (Windows)

```powershell
# Basic
.\start-toobix.ps1

# With options
.\start-toobix.ps1 [options]

Options:
  -Mode <string>        'full', 'bridge', or 'demo' (default: full)
  -AwakeBeing          Awaken living being on startup
  -EnableAutonomy      Enable autonomous actions
  -SkipChecks          Skip pre-flight checks
```

### TypeScript Script (Cross-Platform)

```bash
bun run scripts/start-all.ts [options]

Options:
  -m, --mode <mode>       'full', 'bridge', or 'demo' (default: full)
  -a, --awaken            Awaken living being
  -A, --autonomy          Enable autonomous actions
  -s, --skip-checks       Skip pre-flight checks
  -h, --help              Show help
```

---

## 🎯 Startup Modes

### 1. **Full Mode** (Default)

Starts everything:
- ✅ Bridge Server (Port 3337)
- ✅ Web Interface (Port 3000)
- ✅ All 54 MCP Tools
- ⏳ Living Being (if -AwakeBeing)
- ⏳ Autonomous Agent (if -EnableAutonomy)

```bash
bun start
# or
.\start-toobix.ps1
```

---

### 2. **Bridge Mode**

Only bridge server:
- ✅ Bridge Server (Port 3337)
- ✅ All 54 MCP Tools
- ❌ No Web Interface

```bash
bun start:bridge
# or
.\start-toobix.ps1 -Mode bridge
```

**Use when:**
- Testing MCP tools
- Running headless
- CLI-only usage

---

### 3. **Demo Mode**

Bridge + Living Being Demo:
- ✅ Bridge Server
- ✅ Living Being Demo (automatic)
- ❌ No Web Interface

```bash
bun start:demo
# or
.\start-toobix.ps1 -Mode demo -AwakeBeing
```

**Use when:**
- Showcasing living being system
- Testing consciousness features
- Quick demos

---

## 🌟 Living Being Options

### Awaken on Startup

```bash
# Bun
bun run scripts/start-all.ts --awaken

# PowerShell
.\start-toobix.ps1 -AwakeBeing
```

**What happens:**
1. Bridge starts
2. Calls `being_awaken` tool automatically
3. Living being comes to life
4. Shows initial state (awareness, mood, thought)

---

### Enable Autonomy

```bash
# Bun
bun run scripts/start-all.ts --autonomy

# PowerShell
.\start-toobix.ps1 -EnableAutonomy
```

**⚠️ Warning:**
- System will make independent decisions
- Requires confirmation
- Use with caution

---

## 🔍 What Gets Started?

### Services

| Service | Port | Description |
|---------|------|-------------|
| **Bridge Server** | 3337 | MCP tool server |
| **Web Interface** | 3000 | Dashboard (full mode only) |

### Systems Initialized

- 🧠 Consciousness System
- 🌟 Living Being (if awakened)
- 🤖 Autonomous Agent (if enabled)
- 💝 Love Engine
- ☮️ Peace Catalyst
- 📖 Story Engine
- 👥 People Module
- 🧠 Memory System
- ✨ Soul System

### Tools Available

- **54 MCP Tools** total
  - 13 Consciousness tools
  - 8 Living Being tools
  - 4 Autonomous Agent tools
  - 6 Story tools
  - 5 Love tools
  - 12 Peace tools
  - 4 People tools
  - 2 Memory tools

---

## 📊 Pre-Flight Checks

The scripts automatically check:

✅ Correct directory (package.json exists)  
✅ Bun installed  
✅ Database exists (or creates it)  
✅ Dependencies installed  
✅ Port 3337 available  
✅ Port 3000 available (full mode)

Skip checks with:
```bash
bun run scripts/start-all.ts --skip-checks
# or
.\start-toobix.ps1 -SkipChecks
```

---

## 🛑 Stopping Services

### Graceful Shutdown

Press `Ctrl+C` in the terminal

### Manual Stop (PowerShell)

```powershell
# Find running jobs
Get-Job

# Stop specific job
Stop-Job -Id <id>
Remove-Job -Id <id>

# Kill all bun processes
Get-Process -Name bun | Stop-Process
```

### Manual Stop (Unix/Linux)

```bash
# Find process
lsof -i :3337

# Kill process
kill <pid>

# Or kill all bun
pkill bun
```

---

## 🐛 Troubleshooting

### "Port 3337 already in use"

```bash
# Windows
Get-Process -Id (Get-NetTCPConnection -LocalPort 3337).OwningProcess | Stop-Process

# Unix/Linux
lsof -ti:3337 | xargs kill
```

### "Bridge server failed to start"

1. Check logs: `Get-Job | Receive-Job`
2. Try manual start: `bun run packages/bridge/src/index.ts`
3. Check database permissions

### "Being is not alive"

First run `being_awaken`:
```bash
curl -X POST http://localhost:3337/tools/being_awaken \
  -H "Content-Type: application/json" \
  -d '{"name":"Toobix"}'
```

### "Dependencies not installed"

```bash
bun install
```

---

## 💡 Examples

### Example 1: Full Development Setup

```powershell
# Windows
.\start-toobix.ps1 -Mode full -AwakeBeing

# Cross-platform
bun start:full --awaken
```

**Result:**
- Bridge on http://localhost:3337
- Web on http://localhost:3000
- Living being alive
- All systems ready

---

### Example 2: Quick Demo

```bash
bun start:demo
```

**Result:**
- Bridge starts
- Being awakens
- Demo runs automatically
- Shows all 8 phases
- Exits after demo

---

### Example 3: Autonomous System

```powershell
.\start-toobix.ps1 -AwakeBeing -EnableAutonomy
```

**Result:**
- Bridge starts
- Being awakens
- Autonomy enabled (after confirmation)
- System can make decisions independently

---

### Example 4: Testing Only

```bash
bun start:bridge
```

**Result:**
- Only bridge
- No web interface
- Perfect for CLI testing
- Use curl/Postman for testing

---

## 🎪 After Startup

### Check Status

```bash
# Health check
curl http://localhost:3337/health

# Being state (if awakened)
curl -X POST http://localhost:3337/tools/being_state

# Autonomy status
curl -X POST http://localhost:3337/tools/autonomous_status
```

### Run Demos

```bash
# Living being demo
bun demo:being

# Voice control
bun demo:voice "status"
```

### Access Web Interface

Open browser: http://localhost:3000

---

## 📚 Related Documentation

- [LIVING_BEING_GUIDE.md](./LIVING_BEING_GUIDE.md) - Living being system
- [AUTONOMOUS_AGENT_GUIDE.md](./AUTONOMOUS_AGENT_GUIDE.md) - Autonomous agent
- [VOICE_CONTROL_GUIDE.md](./VOICE_CONTROL_GUIDE.md) - Voice control
- [README.md](./README.md) - Main documentation

---

## 🎯 Quick Reference Card

```
╔═══════════════════════════════════════════════════════════╗
║              TOOBIX STARTUP COMMANDS                      ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  SIMPLE START:                                            ║
║    bun start                    (everything)              ║
║    bun start:bridge             (only bridge)             ║
║    bun start:demo               (bridge + demo)           ║
║                                                           ║
║  WITH OPTIONS:                                            ║
║    bun run scripts/start-all.ts --awaken                  ║
║    .\start-toobix.ps1 -AwakeBeing -EnableAutonomy        ║
║                                                           ║
║  DEMOS:                                                   ║
║    bun demo:being               (living being)            ║
║    bun demo:voice "status"      (voice control)           ║
║                                                           ║
║  STOP:                                                    ║
║    Ctrl+C                       (graceful)                ║
║    Get-Process bun | Stop-Process  (force, Windows)      ║
║                                                           ║
║  CHECK:                                                   ║
║    curl http://localhost:3337/health                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

**🌟 "One command to rule them all!" 🌟**

Start developing in seconds: `bun start` 🚀
