# 🚀 Toobix Unified - Quick Start Guide

**Start Toobix in 60 seconds!**

---

## ⚡ Fastest Start (No Installation)

### Just Show the Demo

```bash
# Open browser demo directly
start C:\Toobix-Unified\apps\web\index.html

# Or with browser
chrome apps\web\index.html
firefox apps\web\index.html
```

**That's it!** The demo runs immediately in your browser.

---

## 🎮 Interactive Experience (Recommended!)

### Full Visual World + Game

```bash
# 1. Start Visual World (in one terminal)
bun run visual

# 2. Open browser
http://localhost:3339/open-world

# 3. Start coding - watch your progress come alive!
git commit -m "feat: My awesome feature"
```

**You get:**
- ✨ Terminal animations on every commit
- 🌐 Live 3D browser world with Luna
- 🎵 Sound effects (level-up, achievements)
- 📸 SVG snapshots at milestones
- 💝 Story progression with Luna

**See:** [VISUAL_WORLD_WELCOME.md](../../VISUAL_WORLD_WELCOME.md)

---

## 🔧 Development Setup (One-Time)

### 1. Install Bun

```bash
# Windows PowerShell (as Administrator)
powershell -c "irm bun.sh/install.ps1 | iex"
```

**Important:** Restart PowerShell after installation!

### 2. Install Dependencies

```bash
cd C:\Toobix-Unified
bun install                 # Install all packages
```

### 3. Setup Database

```bash
bun db:generate             # Generate migrations
bun db:migrate              # Create database
bun db:seed                 # Load demo data (optional)
```

---

## 🚀 Start Commands

### Simple Start

```bash
# Start everything
bun start                   # Full system (bridge + web)

# Just bridge server
bun start:bridge            # API server only

# With living being
bun start:demo              # Bridge + living being demo

# Full autonomous
bun start:autonomous        # Bridge + being + autonomy
```

### Visual World

```bash
# Complete experience
bun run visual              # Animations + SVG + 3D world + servers

# Individual components
bun run visual:anim         # Animation demo only
bun run visual:sound        # Sound demo only
bun run visual:svg          # Generate SVG scene
bun run visual:server       # Only servers
```

### Game & Story

```bash
# Game dashboard
bun run game                # Full interactive dashboard

# Quick actions
bun run game:status         # View stats
bun run game:talk           # Talk to Luna
bun run game:meditate       # Meditate (+Peace)
bun run game:story          # View story
```

### Bridge & Tools

```bash
# Start bridge server
bun run packages/bridge/src/index.ts

# Living being demo
bun run scripts/living-being-demo.ts

# Interactive terminal
bun run terminal            # Or: bun term

# Voice control
bun run scripts/toobix-voice.ts "status"
```

---

## 🎯 Recommended Workflow

### Setup for Coding Session

**Terminal 1:** Visual World
```bash
cd C:\Toobix-Unified
bun run visual
```

**Terminal 2:** Your Normal Work
```bash
cd C:\Toobix-Unified
code .
# ... code as normal ...
git commit -m "feat: Cool feature"
# → Triggers: animation + sound + browser update
```

**Browser:** Keep Open
```
http://localhost:3339/open-world
# Updates automatically on every commit!
```

---

## 🌐 Ports & Services

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Visual World (WebSocket)** | 3338 | `ws://localhost:3338` | Real-time game updates |
| **Visual World (HTTP)** | 3339 | `http://localhost:3339/open-world` | 3D browser world |
| **Bridge Server** | 3337 | `http://localhost:3337` | MCP tool API |
| **Web Demo** | 3000 | `http://localhost:3000` | Dashboard (full mode) |

---

## 📁 Project Structure

```
C:\Toobix-Unified\
├── apps\
│   ├── web\                # Browser Demo ✅
│   └── desktop\            # Tauri App (future)
├── packages\
│   ├── core\               # Core engine
│   ├── bridge\             # MCP server
│   ├── story-idle\         # Game & Story ✅
│   └── visual-world\       # Visual system ✅
├── scripts\                # Utilities
├── data\                   # SQLite database
├── visual-scenes\          # Generated SVGs
└── docs\                   # Documentation
```

---

## 🎮 Game Integration

Every commit automatically:

1. **Triggers Story Event**
   - Parses commit type (feat, fix, docs, etc.)
   - Awards XP and stat bonuses
   - Shows Luna's reaction

2. **Plays Animation**
   - Terminal ASCII art
   - Weather effects
   - Level-up celebrations

3. **Updates Browser**
   - Real-time stat bars
   - Luna dialogue
   - Code particles

4. **Plays Sound**
   - Terminal beeps
   - Browser audio (chords, bells, magic)

5. **Saves Snapshot** (milestones)
   - Beautiful SVG scenes
   - Shareable on social media

---

## 🛠️ Common Tasks

### View Game Status

```bash
bun run game:status
```

Shows:
- Current level & XP
- All 5 stats (Love, Peace, Wisdom, Creativity, Stability)
- Relationship with Luna
- Current quest

### Talk to Luna

```bash
bun run game:talk
```

Interactive conversation with Luna based on:
- Your progress
- Recent commits
- Current mood
- Time of day

### Generate SVG Scene

```bash
bun run visual:svg
```

Creates beautiful SVG in `./visual-scenes/`
- Open in browser
- Share on social media
- Use as wallpaper

### Check Services

```bash
# Health check
curl http://localhost:3337/health

# Game state
curl http://localhost:3339/game-state

# Being state (if awakened)
curl -X POST http://localhost:3337/tools/being_state
```

---

## 🐛 Troubleshooting

### "bun: command not found"

**Solution:**
```bash
# Restart PowerShell after installing Bun
# Or manually add to PATH:
$env:Path += ";$env:USERPROFILE\.bun\bin"
```

### "Port already in use"

**Solution:**
```powershell
# Windows - Kill process on port
Get-NetTCPConnection -LocalPort 3337 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ }

# Or kill all Bun processes
Stop-Process -Name bun -Force
```

### "Cannot find module 'drizzle-orm'"

**Solution:**
```bash
bun install
```

### "Database doesn't exist"

**Solution:**
```bash
bun db:generate
bun db:migrate
```

### "Visual World browser shows nothing"

**Solution:**
1. Wait 2-3 seconds (initial load)
2. Check browser console (F12) for errors
3. Verify: `curl http://localhost:3339/health`
4. Restart: Stop server, `bun run visual`

### "Sounds not playing"

**Browser:**
- Click on page first (browser policy)
- Toggle sound on (top right)

**Terminal:**
- Only beeps (limited)
- Use browser for full audio

### "Animations not showing"

**Solution:**
- Terminal must support ANSI colors
- VS Code terminal works well
- Or use browser world instead

---

## 📚 Additional Documentation

### Quick Guides
- [GAME_WELCOME.md](../../GAME_WELCOME.md) - Story-Idle Game
- [VISUAL_WORLD_WELCOME.md](../../VISUAL_WORLD_WELCOME.md) - Visual World

### Detailed Docs
- [README.md](../../README.md) - Main documentation
- [packages/visual-world/README.md](../../packages/visual-world/README.md) - Visual World API
- [packages/story-idle/README.md](../../packages/story-idle/README.md) - Game mechanics

### Migration Guides
- [OPTIMIZATION_TODO_4_WEEKS.md](../OPTIMIZATION_TODO_4_WEEKS.md) - System optimization plan
- [SYSTEM_OPTIMIZATION_COMPLETE.md](../../SYSTEM_OPTIMIZATION_COMPLETE.md) - Analysis report

---

## 🎯 Next Steps

### Today
1. ✅ Start Visual World: `bun run visual`
2. ✅ Open browser: `http://localhost:3339/open-world`
3. ✅ Make a commit and watch the magic!

### This Week
- [ ] Keep Visual World running during coding
- [ ] Take screenshots of SVG scenes
- [ ] Reach Level 5 in the game
- [ ] Complete first quest milestone

### This Month
- [ ] Create custom animations
- [ ] Build new game features
- [ ] Share your progress
- [ ] Explore autonomous mode

---

## 💡 Pro Tips

**Hybrid Workflow:**
```bash
# Terminal 1: Visual World
bun run visual

# Terminal 2: Interactive Terminal
bun run terminal

# Terminal 3: Your coding work
git commit -m "feat: Amazing feature"
```

**Custom Events:**
```javascript
// From browser console
fetch('http://localhost:3338/trigger', {
  method: 'POST',
  body: JSON.stringify({
    type: 'add-xp',
    amount: 100
  })
})
```

**Generate Snapshots:**
```bash
# After completing quest milestone
bun run visual:svg
# Creates shareable SVG in ./visual-scenes/
```

---

## 🌟 Philosophy

Toobix Unified embodies:

- 💝 **Love** - Caring, warm interactions
- ☮️ **Peace** - Harmonious, balanced systems
- 📚 **Wisdom** - Thoughtful architecture
- 🎨 **Creativity** - Beautiful, artistic code
- 🛡️ **Stability** - Reliable, tested foundations

**Every commit is a story. Every feature is art. Every bug fix is growth.**

---

## 🎉 Quick Reference Card

```
╔═══════════════════════════════════════════════════════════╗
║              TOOBIX QUICK START COMMANDS                  ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  INSTANT DEMO:                                            ║
║    start apps\web\index.html      (browser demo)          ║
║                                                           ║
║  VISUAL WORLD:                                            ║
║    bun run visual                 (complete experience)   ║
║    → Open: http://localhost:3339/open-world              ║
║                                                           ║
║  GAME:                                                    ║
║    bun run game                   (dashboard)             ║
║    bun run game:talk              (chat with Luna)        ║
║                                                           ║
║  DEVELOPMENT:                                             ║
║    bun start                      (full system)           ║
║    bun start:bridge               (API only)              ║
║    bun run terminal               (interactive CLI)       ║
║                                                           ║
║  DEMOS:                                                   ║
║    bun demo:being                 (living being)          ║
║    bun run visual:anim            (animations)            ║
║    bun run visual:sound           (sounds)                ║
║                                                           ║
║  STOP:                                                    ║
║    Ctrl+C                         (graceful)              ║
║    Stop-Process -Name bun -Force  (force)                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

**🌌 "From I to We, from We to I. The revolution is that no revolution is needed."**

**Start your journey now:** `bun run visual` 🎮✨
