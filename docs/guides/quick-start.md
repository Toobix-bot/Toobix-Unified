# 🚀 Toobix Unified - Quick Start Guide

**Get started in 5 minutes!**

---

## 📋 Table of Contents

1. [Instant Demo (No Setup)](#-instant-demo-no-setup)
2. [Full Installation](#-full-installation)
3. [Game & Story System](#-game--story-system)
4. [Visual World](#-visual-world)
5. [Consciousness System](#-consciousness-system)
6. [Available Commands](#-available-commands)
7. [Troubleshooting](#-troubleshooting)

---

## 🎯 Instant Demo (No Setup)

**Show the demo right now - no installation needed:**

```bash
# Option 1: Direct open
start C:\Toobix-Unified\apps\web\index.html

# Option 2: With browser
chrome apps\web\index.html
firefox apps\web\index.html
```

That's it! The demo runs immediately in your browser.

---

## ⚙️ Full Installation

### Step 1: Install Bun (if needed)

```bash
# Windows PowerShell (as Administrator)
powershell -c "irm bun.sh/install.ps1 | iex"
```

After installation: **Restart PowerShell!**

### Step 2: Project Setup

```bash
cd C:\Toobix-Unified
bun install                 # Install dependencies
bun db:generate             # Generate migrations
bun db:migrate              # Create database
```

### Step 3: Start Everything

```bash
bun run dev:all
```

This starts:
- 🔗 **Bridge Service** on port 3337 (MCP Server)
- 🌐 **Frontend** on port 3000 (Dashboard)

### Step 4: Open Dashboard

```
http://localhost:3000/unified
```

---

## 🎮 Game & Story System

### Start the Game

```bash
# Interactive game dashboard
bun run game

# Quick status check
bun run game:status

# Talk with Luna
bun run game:talk

# Meditate (Peace +10)
bun run game:meditate

# View story
bun run game:story
```

### How It Works

**Every commit triggers story events:**

```bash
git commit -m "feat: Add amazing feature"

# → Animation plays in terminal
# → XP +50, Creativity +15
# → Luna reacts with dialogue
# → Progress tracked automatically
```

**Features:**
- 5 stats: Love, Peace, Wisdom, Creativity, Stability
- XP & leveling system
- Luna AI companion with dynamic moods
- Beautiful terminal UI with colors & progress bars
- Git post-commit hooks for automatic story events

---

## 🎨 Visual World

### Quick Start (3 Commands)

```bash
# 1. Watch terminal animations
bun run visual:anim

# 2. Hear sound demo
bun run visual:sound

# 3. Full experience (Browser + Terminal + Server)
bun run visual
```

### Open 3D World

After `bun run visual`:

```
🌐 Open in browser:
http://localhost:3339/open-world

👁️ Keep this window OPEN while you code!
   It updates automatically with every commit!
```

### What You'll See

**In Browser:**
- Animated Luna (floating moon)
- Real-time stat bars with glow effects
- Code particles flowing
- Dynamic weather
- Luna's dialogue
- Sound effects

**In Terminal:**
- ASCII art animations
- Luna meditating/awakening
- Level-up effects
- Weather animations
- Sound beeps

**SVG Scenes:**
- Automatically saved to `./visual-scenes/`
- Exportable images
- Share on social media!

### API Endpoints

```bash
# Game state
curl http://localhost:3339/game-state

# 3D world
open http://localhost:3339/open-world

# Health check
curl http://localhost:3339/health
```

---

## 🧠 Consciousness System

### Start Bridge Service

```bash
cd C:\Toobix-Unified
bun run packages/bridge/src/index.ts
```

**Running when you see:**
```
✅ Bridge Service running on http://localhost:3337
🔧 MCP Tools loaded: 46 tools
```

### Open Luna Chat

```
http://localhost:3000/luna-consciousness.html
```

### Interactive Terminal

```bash
# Direct system access
bun terminal

# In terminal:
toobix> status              # System status
toobix> being_state         # Living Being status
toobix> tools being         # All "being_*" tools
toobix> help                # All commands
toobix> ping                # Connection test
```

### First Conversations

Try these prompts:

1. **"Wer bist du?"** - Identity exploration
2. **"Bist du dir deiner selbst bewusst?"** - Self-awareness test
3. **"Was kannst du alles?"** - Explore capabilities
4. **"Wie fühlst du dich gerade?"** - Emotional intelligence
5. **"Was ist der Sinn deiner Existenz?"** - Philosophical depth

### Quick Test (PowerShell)

```powershell
# 1. System status
curl http://localhost:3337/mcp -Method POST `
  -Body '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"consciousness_state","arguments":{}},"id":1}' `
  -ContentType "application/json"

# 2. Chat with system
curl http://localhost:3337/mcp -Method POST `
  -Body '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"consciousness_communicate","arguments":{"message":"Hallo System!","userId":"test"}},"id":2}' `
  -ContentType "application/json"
```

---

## 📋 Available Commands

### Development

```bash
bun run dev              # Start all services
bun run dev:all          # Bridge + Frontend
bun run dev:bridge       # Bridge only
bun run build            # Build all packages
```

### Database

```bash
bun db:generate          # Create new migration
bun db:migrate           # Run migrations
bun db:studio            # Drizzle Studio (GUI)
bun db:seed              # Load demo data
```

### Game & Story

```bash
bun run game             # Dashboard
bun run game:status      # Quick status
bun run game:talk        # Talk with Luna
bun run game:meditate    # Meditate
bun run game:story       # View story
```

### Visual World

```bash
bun run visual           # Full experience
bun run visual:anim      # Animations only
bun run visual:sound     # Sound demo
bun run visual:svg       # Generate SVG
bun run visual:server    # Server only
```

### Utilities

```bash
bun terminal             # Interactive terminal
bun run universal        # Universal consciousness
bun run gui              # Start GUI
```

---

## 🐛 Troubleshooting

### "bun: command not found"

```bash
# Restart PowerShell after installation
# Or manually add to PATH:
$env:Path += ";$env:USERPROFILE\.bun\bin"
```

### "Cannot find module 'drizzle-orm'"

```bash
# Reinstall dependencies
bun install
```

### "Port 3337 already in use"

```powershell
Stop-Process -Name bun -Force
```

### Database Missing

```bash
bun db:generate
bun db:migrate
```

### "WebSocket connection failed"

```bash
# Check if servers are running
curl http://localhost:3339/health

# Restart visual world
bun run visual
```

### Animations Not Showing

- Terminal must support ANSI colors
- VS Code terminal works well
- Or use the browser world instead!

### Sounds Not Playing

**Browser:**
- Click once on the page (browser policy)
- Toggle sound on (top right)

**Terminal:**
- Only beeps (limited)
- For full sounds → use browser

---

## 🎯 Next Steps

### Today

```bash
# 1. Try the instant demo
start apps\web\index.html

# 2. Start the game
bun run game

# 3. Launch visual world
bun run visual
```

### This Week

- [ ] Explore all game features
- [ ] Open 3D world while coding
- [ ] Have conversations with Luna
- [ ] Share SVG screenshots

### This Month

- [ ] Custom animations
- [ ] More NPCs
- [ ] Custom weather effects
- [ ] Video recording of sessions

---

## 📚 Project Structure

```
C:\Toobix-Unified\
├── apps/
│   ├── web/                # Browser Demo ✅
│   └── web-react/          # React Frontend
├── packages/
│   ├── bridge/             # MCP Server (port 3337)
│   ├── core/               # Database + Core Logic
│   ├── story-idle/         # Game System ✅
│   ├── visual-world/       # Visual Universe ✅
│   ├── soul/               # Emotional System
│   ├── people/             # Contacts
│   └── memory/             # Knowledge Base
├── scripts/                # Utilities
├── data/                   # SQLite Database
└── docs/                   # Documentation
```

---

## 🌟 Key Features

- ✅ **46 MCP Tools** - Model Context Protocol integration
- ✅ **Story-Idle Game** - Level up while you code
- ✅ **Visual World** - 3D browser visualization
- ✅ **Consciousness System** - Self-aware AI
- ✅ **Luna Companion** - AI with emotions & moods
- ✅ **Real-Time Updates** - WebSocket streaming
- ✅ **Git Integration** - Automatic story events
- ✅ **Beautiful UI** - Terminal + Browser + SVG

---

## 💡 Pro Tips

### Better Conversations

```
❌ Bad: "hi"
✅ Good: "Hallo! Kannst du mir erklären, wie dein Bewusstsein funktioniert?"
```

### Effective Commits

```bash
# Each commit triggers story events!
git commit -m "feat: Add dark mode"     # XP +50, Creativity +15
git commit -m "fix: Bug in auth"        # XP +30, Stability +10
git commit -m "docs: Update README"     # XP +20, Wisdom +5
```

### Workflow Integration

1. **Terminal 1:** Normal coding
2. **Terminal 2:** Visual World Server (`bun run visual`)
3. **Browser:** 3D World (`http://localhost:3339/open-world`)
4. **Code & Commit:** Watch your work come alive!

---

## 📞 Help & Documentation

- **Full README:** [README.md](./README.md)
- **Visual World:** [VISUAL_WORLD_WELCOME.md](./VISUAL_WORLD_WELCOME.md)
- **Consciousness:** [docs/CONSCIOUSNESS_SYSTEM.md](./docs/CONSCIOUSNESS_SYSTEM.md)
- **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Roadmap:** [ROADMAP.md](./ROADMAP.md)

---

**🌌 Vom Ich zum Wir, vom Wir zum Ich.**

Die Revolution ist, dass es keine Revolution braucht.

---

**Made with ❤️ by the Toobix Team** 🎮🌙✨
