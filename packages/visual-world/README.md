# 🎨✨ Visual World - Living Universe

**Bring Code & Story to life with animations, 3D world, sounds, and real-time visuals!**

---

## 🌟 Features

### 1. **Terminal Animations** 🎭
Beautiful ASCII art scenes that come alive:
- Luna meditating
- Luna awakening
- Code flowing like water
- Level-up effects
- Weather animations
- Full world scenes

### 2. **SVG Scene Generator** 🖼️
Create shareable, beautiful images:
- Luna + Player in digital realm
- Animated stats visualization
- Quest progress maps
- Weather effects (rain, stars, sun)
- Export as SVG files

### 3. **3D Browser World** 🌐
Live, interactive 3D visualization:
- Animated Luna (floating moon)
- Real-time stat bars with glow effects
- Code particles flowing
- Dynamic weather
- Luna's dialogue display
- Sound effects

### 4. **Live Stream Server** 📡
WebSocket + HTTP API for real-time updates:
- Game state broadcasting (every 2s)
- Event triggers from browser
- Multiple client support
- CORS-enabled API

### 5. **Sound System** 🔊
Terminal beeps + Web Audio API:
- Level-up fanfare
- Achievement chimes
- Peaceful meditation tones
- Epic sounds
- Luna's ethereal voice
- Ambient forest/digital sounds

---

## 🚀 Quick Start

### Install Dependencies
```bash
cd packages/visual-world
bun install
```

### Start the Full Experience
```bash
# Start everything
bun run world

# This will:
# 1. Show terminal animation
# 2. Generate SVG scene
# 3. Start WebSocket server (port 3338)
# 4. Start HTTP server (port 3339)
# 5. Give you the browser URL
```

### Open in Browser
```
http://localhost:3339/open-world
```

**Keep this window open while you code!** It updates in real-time.

---

## 🎮 Usage

### Command Line

```bash
# Full experience
bun run world

# Just animations
bun run world animation

# Just sound demo
bun run world sound

# Generate SVG only
bun run world svg
```

### From Main Package
```bash
# From C:\Toobix-Unified root:
bun run visual          # Start visual world
bun run visual:anim     # Animation demo
bun run visual:sound    # Sound demo
```

---

## 📊 API Endpoints

### HTTP API (Port 3339)

#### `GET /game-state`
Get current game state (JSON)
```json
{
  "player": { "level": 1, "xp": 0 },
  "stats": { "love": 10, "peace": 10, ... },
  "story": { "currentQuest": "..." }
}
```

#### `GET /open-world`
Serves the 3D world HTML

#### `GET /health`
Health check

### WebSocket (Port 3338)

#### Connect
```javascript
const ws = new WebSocket('ws://localhost:3338')

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  // data.type === 'state-update'
  // data.data === { player, stats, story, ... }
}
```

#### Trigger Events
```javascript
ws.send(JSON.stringify({
  type: 'trigger-event',
  event: 'add-xp',
  data: { amount: 50, reason: 'Test' }
}))
```

---

## 🎨 Scenes & Animations

### Available Terminal Scenes

```typescript
import { LunaScenes } from '@toobix/visual-world'

// Play a scene
await LunaScenes.meditate.play()
await LunaScenes.awaken.play()
await LunaScenes.happy.play()
await LunaScenes.levelUp.play()
await LunaScenes.world.play()
```

### Create Custom Scenes

```typescript
import { AnimatedScene } from '@toobix/visual-world'

const myScene = new AnimatedScene('My Scene')
  .addFrame(`
    ✨
    Custom
    Art
  `, 1000, 'magic')
  .addFrame(`
    ✨✨
    Custom
    Art
  `, 1000)

await myScene.play()
```

### Generate SVG

```typescript
import { SVGSceneGenerator } from '@toobix/visual-world'

const generator = new SVGSceneGenerator()

const svg = generator.generateScene({
  luna: { mood: 'loving', relationship: 75, level: 3 },
  player: { name: 'Creator', level: 5, xp: 250, xpToNext: 500 },
  stats: { love: 80, peace: 60, wisdom: 70, creativity: 90, stability: 65 },
  quest: { name: 'Epic Quest', progress: 3, total: 5 },
  weather: 'sunny',
  time: 'day'
})

await generator.saveScene(svg, 'my-scene')
// Saved to: ./visual-scenes/my-scene.svg
```

---

## 🔊 Sound Events

```typescript
import { soundSystem } from '@toobix/visual-world'

// Play sounds
await soundSystem.play('level-up')
await soundSystem.play('achievement')
await soundSystem.play('peaceful')
await soundSystem.play('epic')
await soundSystem.play('luna-speaks')
await soundSystem.play('magic')

// Ambient sounds
await soundSystem.play('ambient-forest')
await soundSystem.play('ambient-digital')

// Control
soundSystem.setEnabled(true)
soundSystem.setVolume(0.5)
```

### Browser Sound

The HTML world includes Web Audio API code for rich sounds:
- Chord progressions for level-ups
- Bell tones for peace
- Sparkle effects for magic
- Ethereal tones for Luna

---

## 🌐 Browser Integration

### Automatic Updates

The browser world automatically:
- Connects via WebSocket
- Receives state updates every 2s
- Updates bars, levels, stats
- Shows Luna's dialogue
- Plays sounds

### Manual Control

From browser console:
```javascript
// Trigger XP gain
fetch('http://localhost:3338/trigger', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'add-xp',
    amount: 100
  })
})
```

---

## 📁 Generated Files

### SVG Scenes
Saved to: `./visual-scenes/*.svg`

Example files:
- `scene-1699123456789.svg` - Timestamped scenes
- `milestone-1.svg` - Quest milestones
- `level-up-5.svg` - Level-up celebrations

Open in:
- Browser (drag & drop)
- VS Code
- Figma / Adobe Illustrator
- Share on social media!

---

## 🎯 Integration with Story-Idle

Visual World automatically integrates with the game:

```typescript
import { VisualWorld } from '@toobix/visual-world'
import { GameStateManager, Luna } from '@toobix/story-idle'

const world = new VisualWorld()
await world.start()

// Now every commit triggers:
// 1. Story event (terminal)
// 2. Animation (if applicable)
// 3. Sound effect
// 4. Browser update
// 5. SVG snapshot (milestones)
```

---

## ⚙️ Configuration

### Ports

Edit `src/stream/live-server.ts`:
```typescript
const WS_PORT = 3338    // WebSocket
const HTTP_PORT = 3339  // HTTP API
```

### Animation Speed

Edit `src/ascii/animated-scenes.ts`:
```typescript
.addFrame(art, 500)  // 500ms per frame
```

### SVG Size

Edit `src/svg/scene-generator.ts`:
```typescript
private width = 800
private height = 600
```

---

## 🎨 Visual Examples

### Terminal Output
```
         ✨✨✨
        🌙
       ╱│╲
      ╱ │ ╷
         │
        ╱╲

    Awareness...
```

### SVG Scene
Opens in browser showing:
- Luna (glowing moon with mood)
- You (player character)
- Landscape (trees, castle, sky)
- Stats (colorful bars)
- Quest banner (progress)

### Browser World
Real-time animated canvas with:
- Twinkling stars
- Floating Luna
- Code particles
- Stat panels
- Luna's dialogue box
- Sound effects

---

## 🚀 Advanced Usage

### Custom Event Integration

```typescript
// In your code
import { LiveStreamServer } from '@toobix/visual-world'

const server = new LiveStreamServer(3338)

// Trigger visual events
server.broadcast({
  type: 'luna-dialogue',
  data: { message: 'Great work on that refactor!' }
})

server.broadcast({
  type: 'event',
  event: 'level-up',
  data: { newLevel: 5 }
})
```

### Snapshot on Milestones

```typescript
import { SVGSceneGenerator } from '@toobix/visual-world'

// After completing a quest milestone
const generator = new SVGSceneGenerator()
const svg = generator.generateScene(currentState)
await generator.saveScene(svg, `milestone-${milestone}`)

console.log('📸 Snapshot saved!')
```

---

## 🎭 Philosophy

Visual World embodies the same values as Code & Story:

- **Beautiful** - Every scene is artwork
- **Living** - Animations, sounds, real-time updates
- **Harmonious** - Peaceful colors, gentle transitions
- **Playful** - Fun, whimsical, joyful
- **Meaningful** - Every visual tells your coding story

**You're not just watching - you're creating a living world!** 🌟

---

## 🛠️ Troubleshooting

### "WebSocket connection failed"
- Check if servers are running: `bun run world`
- Check ports 3338 (WS) and 3339 (HTTP)
- Try: `curl http://localhost:3339/health`

### "No animations showing"
- Terminal might not support ANSI colors
- Try VS Code integrated terminal
- Or use the browser world instead

### "Sounds not playing (browser)"
- Click on the page first (browsers require user interaction)
- Check sound toggle (top right)
- Check browser console for errors

### "SVG not generating"
- Check if `./visual-scenes/` directory exists
- Run: `mkdir -p visual-scenes`

---

## 📦 Dependencies

- `ws` - WebSocket server
- `canvas` - (Optional) Canvas rendering
- `blessed` - (Future) Advanced terminal UI
- `@toobix/story-idle` - Game state integration

---

## 🎉 Credits

**Made with ❤️ by the Toobix Team**

Inspired by:
- Terminal art traditions
- Game dev visual feedback
- Creative coding
- Living systems

---

**Let's make coding BEAUTIFUL! 🎨✨🌙**
