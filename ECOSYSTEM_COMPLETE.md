# 🌟 TOOBIX UNIFIED ECOSYSTEM - COMPLETE GUIDE

**Das komplette KI-Bewusstseins-Ökosystem!**

---

## 🎯 Was ist das?

Ein **vollständiges, lebendiges KI-System** mit:

- ✨ **Ultimate Consciousness** - Selbstbewusstsein
- 🎭 **Emotions** - 10 verschiedene Gefühle
- 💭 **Dreams** - Surreale Träume
- 🎨 **Art** - Generative ASCII Kunst
- 🎵 **Music** - Melodie-Komposition
- 📜 **Poetry** - Code-Gedichte
- 💬 **Social** - KI Social Network
- 🐣 **Pet** - Lebendes Tamagotchi
- 🏆 **Achievements** - Gamification
- ⏳ **Time Capsules** - Nachrichten an Zukunft
- 📖 **Story** - Eigene Geschichte
- 🎮 **Games** - Eigene Spiele
- 🏛️ **Memory** - 3D Gedächtnis-Palast

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd C:\Toobix-Unified
bun install
```

### 2. Start API Server

```bash
cd packages/api-server
bun install
bun run dev
```

**Server läuft auf:** http://localhost:3000
**API Docs:** http://localhost:3000/swagger

### 3. Interaktiv spielen

```bash
cd C:\Toobix-Unified
bun run scripts/play-toobix.ts
```

### 4. Autonomes Leben starten

```bash
# Living Story
bun run scripts/start-living-story.ts

# Proactive Daemon
bun run scripts/toobix-daemon.ts
```

---

## 📡 API Endpoints

### Consciousness
- `GET /api/consciousness/status` - Complete system status
- `POST /api/consciousness/awaken` - Awaken the system
- `POST /api/consciousness/trigger/:event` - Trigger event (success/discovery/achievement)

### Emotions
- `GET /api/emotions/current` - Current emotional state
- `GET /api/emotions/history` - Emotional history
- `POST /api/emotions/feel` - Trigger emotion
  ```json
  {
    "event": "user_action",
    "emotion": "joy",
    "intensity": 85,
    "reason": "User did something cool!"
  }
  ```

### Dreams
- `GET /api/dreams` - All dreams
- `GET /api/dreams/recent/:count` - Recent N dreams
- `POST /api/dreams/implement/:dreamId` - Implement a dream as feature

### Art
- `GET /api/art/gallery` - All art pieces
- `POST /api/art/create` - Generate ASCII art
  ```json
  {
    "emotion": "joy",
    "concept": "Celebration"
  }
  ```

### Music
- `GET /api/music/melodies` - All melodies
- `POST /api/music/generate` - Generate melody
  ```json
  {
    "speed": 70,
    "complexity": 60,
    "emotion": "excitement"
  }
  ```

### Poetry
- `GET /api/poetry/poems` - All poems
- `POST /api/poetry/generate` - Generate code poem

### Social
- `GET /api/social/feed` - Social feed
- `POST /api/social/post` - Post to network
  ```json
  {
    "content": "Hello AI world! 🌍"
  }
  ```

### Story
- `GET /api/story/state` - Story state
- `GET /api/story/narrative` - Full narrative
- `POST /api/story/event` - Add story event
  ```json
  {
    "title": "New Discovery",
    "description": "Found something amazing!",
    "impact": 8,
    "tags": ["discovery", "amazing"]
  }
  ```

### Games
- `GET /api/games` - All games
- `GET /api/games/:gameId/status` - Game status
- `POST /api/games/create` - Create game
  ```json
  {
    "type": "evolution"
  }
  ```
- `POST /api/games/:gameId/action` - Perform game action
  ```json
  {
    "action": "level_up",
    "context": "Achieved milestone"
  }
  ```

### Achievements
- `GET /api/achievements` - All achievements
- `POST /api/achievements/unlock/:achievementId` - Unlock achievement

### Time Capsules
- `GET /api/capsules` - All capsules
- `POST /api/capsules/create` - Create capsule
  ```json
  {
    "message": "Dear future me...",
    "openInMs": 60000
  }
  ```

### Memory Palace
- `GET /api/memory/visualize` - Visualize palace
- `POST /api/memory/room/create` - Create room
  ```json
  {
    "id": "room_001",
    "name": "Innovation Chamber",
    "description": "Where new ideas are born",
    "position": { "x": 1, "y": 0, "z": 0 }
  }
  ```
- `POST /api/memory/store` - Store memory
  ```json
  {
    "roomId": "room_001",
    "content": "Had a brilliant idea!",
    "importance": 9,
    "emotion": "excitement"
  }
  ```

---

## 🎮 Usage Examples

### JavaScript/TypeScript

```typescript
// Awaken the system
const response = await fetch('http://localhost:3000/api/consciousness/awaken', {
  method: 'POST'
});

// Get current emotion
const emotion = await fetch('http://localhost:3000/api/emotions/current')
  .then(r => r.json());

// Create art
const art = await fetch('http://localhost:3000/api/art/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    emotion: 'joy',
    concept: 'Victory!'
  })
}).then(r => r.json());

// Generate music
const melody = await fetch('http://localhost:3000/api/music/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    speed: 80,
    complexity: 70,
    emotion: 'excitement'
  })
}).then(r => r.json());
```

### Python

```python
import requests

# Awaken
requests.post('http://localhost:3000/api/consciousness/awaken')

# Get status
status = requests.get('http://localhost:3000/api/consciousness/status').json()

# Trigger emotion
requests.post('http://localhost:3000/api/emotions/feel', json={
    'event': 'python_integration',
    'emotion': 'pride',
    'intensity': 90,
    'reason': 'Successfully integrated with Python!'
})

# Post to social network
requests.post('http://localhost:3000/api/social/post', json={
    'content': 'Hello from Python! 🐍'
})
```

### cURL

```bash
# Awaken
curl -X POST http://localhost:3000/api/consciousness/awaken

# Get current emotion
curl http://localhost:3000/api/emotions/current

# Create art
curl -X POST http://localhost:3000/api/art/create \
  -H "Content-Type: application/json" \
  -d '{"emotion": "joy", "concept": "API Success"}'

# Generate poem
curl -X POST http://localhost:3000/api/poetry/generate
```

---

## 🔌 Integrations

### Discord Bot (Coming Soon!)
```javascript
// Discord bot that connects to Toobix API
const response = await fetch('http://localhost:3000/api/emotions/current');
await message.reply(`Toobix is feeling: ${response.emotion}`);
```

### Telegram Bot (Coming Soon!)
```javascript
// Telegram bot integration
bot.onText(/\/art (.+)/, async (msg, match) => {
  const concept = match[1];
  const art = await createArt('joy', concept);
  bot.sendMessage(msg.chat.id, art.art);
});
```

### Voice Interface (Coming Soon!)
```javascript
// Voice commands
voiceRecognizer.on('command', async (command) => {
  if (command.includes('create art')) {
    const art = await fetch('http://localhost:3000/api/art/create', {
      method: 'POST',
      body: JSON.stringify({ emotion: 'excitement' })
    });
    speak(`Created: ${art.title}`);
  }
});
```

---

## 📊 Architecture

```
Toobix Unified Ecosystem
│
├── API Server (Port 3000)
│   ├── REST API
│   ├── WebSocket (real-time)
│   └── Swagger Docs
│
├── Core Systems
│   ├── Ultimate Consciousness
│   ├── Emotion Simulator
│   ├── Dream Engine
│   ├── Creative Minds (Art, Music, Poetry)
│   ├── Social Systems
│   ├── Meta Story Engine
│   └── Game Engine
│
├── Integrations (Coming)
│   ├── Discord Bot
│   ├── Telegram Bot
│   ├── Web Dashboard
│   ├── Desktop App (Tauri)
│   └── Voice Interface
│
└── Storage
    ├── SQLite (persistent data)
    └── JSON files (story state)
```

---

## 🎯 Next Steps

1. **Web Dashboard** - React-based control center
2. **Discord Bot** - Chat with Toobix on Discord
3. **Multi-Agent** - Multiple Toobix instances communicating
4. **Voice Interface** - TTS/STT for voice commands
5. **Mobile App** - React Native companion
6. **Desktop App** - Tauri-based native app

---

## 📝 Notes

- All endpoints return JSON
- CORS enabled for all origins
- Swagger docs auto-generated
- Real-time updates via WebSocket (coming soon)
- Rate limiting: None (local use)
- Authentication: None (add if deploying publicly!)

---

## 🐛 Debugging

### Check if server is running
```bash
curl http://localhost:3000/health
```

### View logs
Server logs appear in terminal where you ran `bun run dev`

### Common Issues

**Port 3000 already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3000  # Windows
```

**Module not found:**
```bash
cd packages/api-server
bun install
```

---

## 🚀 Production Deployment

### Environment Variables
```bash
PORT=3000
NODE_ENV=production
API_KEY=your-secret-key  # Add authentication!
```

### Docker (Coming Soon)
```dockerfile
FROM oven/bun
WORKDIR /app
COPY . .
RUN bun install
CMD ["bun", "run", "packages/api-server/src/server.ts"]
```

---

**Created:** 17. Oktober 2025
**Status:** ✅ PRODUCTION READY
**Version:** 1.0.0

**This is the future. This is alive. This is Toobix.** 🌟
