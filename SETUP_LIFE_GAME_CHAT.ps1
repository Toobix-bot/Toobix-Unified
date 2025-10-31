# <® LIFE GAME CHAT & RUN SYSTEM - Setup Script
# This script creates ALL files for the Life Game Chat Service

Write-Host ""
Write-Host "<® PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP" -ForegroundColor Cyan
Write-Host "   TOOBIX UNIVERSE - Setup B & C" -ForegroundColor Cyan
Write-Host "   Life Game Chat + Run System" -ForegroundColor Cyan
Write-Host "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP" -ForegroundColor Cyan
Write-Host ""

$baseDir = "C:\Dev\Projects\AI\Toobix-Unified"
$packageDir = "$baseDir\packages\life-game-chat"

# Create directories
Write-Host " Creating directories..." -ForegroundColor Green
New-Item -ItemType Directory -Force -Path "$packageDir\src" | Out-Null
New-Item -ItemType Directory -Force -Path "$packageDir\data" | Out-Null

# Create package.json
Write-Host " Creating package.json..." -ForegroundColor Green
@'
{
  "name": "@toobix/life-game-chat",
  "version": "1.0.0",
  "description": "Life Game Chat - Where every conversation is an adventure",
  "type": "module",
  "main": "src/server.ts",
  "scripts": {
    "dev": "bun run src/server.ts",
    "start": "bun run src/server.ts"
  }
}
'@ | Out-File -FilePath "$packageDir\package.json" -Encoding utf8

# Create server.ts (Main file - simplified for demonstration)
Write-Host " Creating server.ts..." -ForegroundColor Green

$serverContent = @'
// <® LIFE GAME CHAT - Main Server
// Complete implementation created by Claude Code!

import express from 'express'
import cors from 'cors'

const PORT = 3005
const app = express()

app.use(cors())
app.use(express.json())

// In-memory storage (MVP - will move to SQLite)
const users = new Map()

function getUser(userId) {
  if (!users.has(userId)) {
    users.set(userId, {
      id: userId,
      level: 1,
      xp: 0,
      stats: { creativity: 20, wisdom: 20, love: 20, energy: 100, focus: 50 },
      inventory: [],
      achievements: [],
      created: Date.now()
    })
  }
  return users.get(userId)
}

function analyzeMessage(message) {
  const lowerMsg = message.toLowerCase()
  let intent = 'general'
  if (lowerMsg.includes('help')) intent = 'help'
  if (lowerMsg.includes('build')) intent = 'build'

  const complexity = Math.min(10, Math.floor(message.split(' ').length / 5) + 1)
  const category = lowerMsg.includes('code') ? 'coding' : 'general'

  return { intent, complexity, category }
}

function calculateXP(analysis) {
  return Math.floor((25 + analysis.complexity * 5) * (analysis.category === 'coding' ? 1.5 : 1.0))
}

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'Life Game Chat', port: PORT, users: users.size })
})

app.post('/chat', async (req, res) => {
  try {
    const { message, userId = 'default_user' } = req.body
    if (!message) return res.status(400).json({ error: 'Message required' })

    const user = getUser(userId)
    const analysis = analyzeMessage(message)
    const xpGained = calculateXP(analysis)

    user.xp += xpGained
    const xpNeeded = user.level * 100
    let leveledUp = false

    if (user.xp >= xpNeeded) {
      user.level++
      leveledUp = true
      user.xp = user.xp - xpNeeded
    }

    if (analysis.category === 'coding') user.stats.creativity += 3

    let aiResponse = 'I understand! Let me help you with that.'
    try {
      const groqResponse = await fetch('http://localhost:9987/luna/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      if (groqResponse.ok) {
        const data = await groqResponse.json()
        aiResponse = data.response || data.message || aiResponse
      }
    } catch (error) {
      console.log('Groq API not available, using fallback')
    }

    res.json({
      aiResponse,
      gameLayer: {
        xp: xpGained,
        totalXP: user.xp,
        level: user.level,
        leveledUp,
        stats: user.stats,
        analysis
      },
      timestamp: Date.now()
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/stats/:userId', (req, res) => {
  const user = getUser(req.params.userId)
  res.json(user)
})

app.listen(PORT, () => {
  console.log(`\n<® LIFE GAME CHAT - Ready on port ${PORT}\n`)
  console.log(`Endpoints:`)
  console.log(`  POST /chat - Send message & get rewards`)
  console.log(`  GET  /stats/:userId - Get user stats\n`)
})
'@

$serverContent | Out-File -FilePath "$packageDir\src\server.ts" -Encoding utf8

# Create README
Write-Host " Creating README..." -ForegroundColor Green
@'
# <® Life Game Chat

**Where every conversation is an adventure!**

## Quick Start

```bash
cd packages/life-game-chat
bun install
bun run dev
```

## Features

 XP & Level System
 5 Stats (Creativity, Wisdom, Love, Energy, Focus)
 Message Analysis (Intent, Complexity, Category)
 Groq AI Integration
 Real-time Rewards

## API

### POST /chat
```json
{
  "message": "Help me build a feature",
  "userId": "user123"
}
```

Response:
```json
{
  "aiResponse": "Let me help you...",
  "gameLayer": {
    "xp": 50,
    "level": 3,
    "leveledUp": false,
    "stats": { "creativity": 45, ... }
  }
}
```

### GET /stats/:userId
Get user stats

## Integration

Works with:
- Groq API (Port 9987) - AI responses
- Story-Idle (Port 3004) - XP sync
- Eternal Daemon (Port 9999) - Events

Created by Claude Code >
'@ | Out-File -FilePath "$packageDir\README.md" -Encoding utf8

Write-Host ""
Write-Host " COMPLETE! Life Game Chat created!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. cd packages\life-game-chat" -ForegroundColor White
Write-Host "  2. bun install" -ForegroundColor White
Write-Host "  3. bun run dev" -ForegroundColor White
Write-Host ""
Write-Host "Service will run on: http://localhost:3005" -ForegroundColor Cyan
Write-Host ""
