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
