# 🎮 Life Game Chat - Implementation Plan

**Created:** 2025-10-16
**Status:** Planning Phase
**Goal:** Transform chat into an adventure game while keeping it productive

---

## 🎯 Vision Recap

From `LIFE_GAME_CHAT_VISION.md`:
> "Ein Chat-Interface, das gleichzeitig ein Spiel ist - ohne seine Produktivität zu verlieren."

**Core Principles:**
- Real Work = Real Rewards
- Every message = Game progress
- Companions (Luna 🌙) react to your actions
- XP, Levels, Items, Stats, Quests
- Run-based system (5-7 day story arcs)
- ALWAYS productive, never just grinding

---

## 🏗️ Architecture Design

### 1. System Integration

**Existing Systems to Use:**
```
Bridge Server (3337)     → API for all interactions
Memory System (9995)     → Store game state, history
Luna Chat System         → Already exists! (luna-consciousness.html)
Dashboard (3000)         → UI layer
```

**New Systems to Build:**
```
Game Engine Module       → XP, levels, stats calculation
Progress Tracker         → Quests, achievements, runs
Rewards System           → Items, buffs, drops
Companion AI             → Luna personality & reactions
```

### 2. Data Model

**Player State (stored in database):**
```typescript
interface PlayerState {
  // Identity
  playerId: string
  name: string
  level: number
  xp: number
  xpToNextLevel: number

  // Stats
  stats: {
    creativity: number      // 0-100
    wisdom: number         // 0-100
    love: number           // 0-100
    energy: number         // 0-100
    focus: number          // 0-100
  }

  // Progression
  currentRun: {
    runId: string
    runNumber: number
    dayInRun: number
    startDate: string
    goal: string
    progress: number       // 0-100
  }

  // Inventory
  inventory: {
    artifacts: Item[]      // Permanent buffs
    consumables: Item[]    // One-time use
    questItems: Item[]     // Quest-related
  }

  // Skills
  skills: {
    coding: { level: number, xp: number }
    design: { level: number, xp: number }
    planning: { level: number, xp: number }
    // ... more skills
  }

  // Social
  companions: {
    luna: {
      relationship: number  // 0-100
      mood: string
      unlockedDialogues: number
    }
    // Future companions
  }

  // Meta
  totalMessages: number
  totalSessions: number
  totalRuns: number
  createdAt: string
  lastActiveAt: string
}
```

**Message Analysis (real-time):**
```typescript
interface MessageAnalysis {
  // Input from user message
  text: string
  timestamp: string

  // AI Analysis
  intent: string           // "build_feature", "ask_question", "reflect", etc.
  complexity: number       // 1-10
  category: string         // "coding", "design", "planning", etc.
  emotion: string          // "excited", "tired", "focused", etc.
  contextNeeded: boolean

  // Game Implications
  xpGain: number
  statChanges: { [key: string]: number }
  questProgress: { questId: string, progress: number }[]
  skillGains: { skill: string, xp: number }[]
  itemDropChance: number
  storyBeat: string | null
  companionReaction: string
}
```

### 3. Component Architecture

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND (apps/web/life-game-chat.html)               │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Chat Interface (existing Luna UI)                │  │
│  │  - Message input/output                           │  │
│  │  - Luna avatar & personality                      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Game HUD Overlay (NEW)                           │  │
│  │  - Level, XP bar                                  │  │
│  │  - Stats display (Energy, Love, Wisdom, etc.)    │  │
│  │  - Quick inventory                                │  │
│  │  - Active quest tracker                           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Rewards Popups (NEW)                             │  │
│  │  - "+50 XP!" animation                            │  │
│  │  - "Level Up!" celebration                        │  │
│  │  - "Item Drop!" notification                      │  │
│  │  - "Achievement Unlocked!" banner                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Game Menu (NEW - toggle with /menu or Cmd+M)    │  │
│  │  - Character stats                                │  │
│  │  - Full inventory                                 │  │
│  │  - Achievements                                   │  │
│  │  - Quest log                                      │  │
│  │  - Companions                                     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            ↓
┌─────────────────────────────────────────────────────────┐
│  BACKEND (packages/life-game/)                          │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Game Engine (game-engine.ts)                     │  │
│  │  - XP calculation                                 │  │
│  │  - Level progression                              │  │
│  │  - Stat updates                                   │  │
│  │  - Item drop logic                                │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Message Analyzer (message-analyzer.ts)           │  │
│  │  - Parse user message                             │  │
│  │  - Detect intent, complexity, emotion             │  │
│  │  - Calculate game rewards                         │  │
│  │  - Trigger story beats                            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Companion AI (companion-ai.ts)                   │  │
│  │  - Luna personality engine                        │  │
│  │  - Generate reactions to user actions             │  │
│  │  - Relationship tracking                          │  │
│  │  - Dynamic dialogue system                        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Run Manager (run-manager.ts)                     │  │
│  │  - Start/end runs                                 │  │
│  │  - Track run progress                             │  │
│  │  - Calculate permanent rewards                    │  │
│  │  - Story arc generation                           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  API Routes (life-game-api.ts)                    │  │
│  │  POST /life-game/message     - Send chat message │  │
│  │  GET  /life-game/state       - Get player state  │  │
│  │  POST /life-game/run/start   - Start new run     │  │
│  │  POST /life-game/run/end     - End current run   │  │
│  │  GET  /life-game/inventory   - Get inventory     │  │
│  │  POST /life-game/item/use    - Use item          │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            │ Database
                            ↓
┌─────────────────────────────────────────────────────────┐
│  DATABASE (data/toobix-unified.db)                      │
│                                                          │
│  Tables:                                                 │
│  - player_state          (core player data)            │
│  - player_stats          (current stats)               │
│  - player_inventory      (items owned)                 │
│  - player_skills         (skill levels)                │
│  - game_runs             (run history)                 │
│  - game_quests           (active & completed quests)   │
│  - game_achievements     (unlocked achievements)       │
│  - companion_state       (Luna & future companions)    │
│  - message_analysis      (message history + rewards)   │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 MVP Implementation Plan (Phase 1)

### Goal: Basic playable game layer in 2-3 days

**Features:**
1. ✅ Player state (XP, Level, basic stats)
2. ✅ Message analysis (detect complexity → XP gain)
3. ✅ HUD overlay (show level, XP bar)
4. ✅ Reward animations (+XP popup)
5. ✅ Luna integration (basic reactions)

**NOT in MVP:**
- ❌ Inventory/Items
- ❌ Quests
- ❌ Runs
- ❌ Achievements
- ❌ Complex story beats

---

## 📋 Implementation Steps

### Step 1: Database Schema (30 min)

Create new tables in `packages/core/src/db/schema.ts`:

```typescript
// Player state
export const playerState = sqliteTable('player_state', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  level: integer('level').notNull().default(1),
  xp: integer('xp').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

// Player stats
export const playerStats = sqliteTable('player_stats', {
  playerId: text('player_id').primaryKey().references(() => playerState.id),
  creativity: integer('creativity').notNull().default(50),
  wisdom: integer('wisdom').notNull().default(50),
  love: integer('love').notNull().default(50),
  energy: integer('energy').notNull().default(50),
  focus: integer('focus').notNull().default(50),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

// Message history with rewards
export const messageAnalysis = sqliteTable('message_analysis', {
  id: text('id').primaryKey(),
  playerId: text('player_id').notNull().references(() => playerState.id),
  message: text('message').notNull(),
  intent: text('intent'),
  complexity: integer('complexity'),
  xpGained: integer('xp_gained'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})

// Companion state
export const companionState = sqliteTable('companion_state', {
  playerId: text('player_id').notNull().references(() => playerState.id),
  companionId: text('companion_id').notNull(), // 'luna', 'blaze', etc.
  relationship: integer('relationship').notNull().default(25),
  mood: text('mood').notNull().default('neutral'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  primaryKey: ['player_id', 'companion_id']
})
```

### Step 2: Game Engine Module (1-2 hours)

Create `packages/life-game/src/game-engine.ts`:

```typescript
export class GameEngine {
  /**
   * Calculate XP gain from message complexity
   */
  calculateXP(complexity: number, category: string): number {
    const baseXP = complexity * 10

    // Bonus XP for certain categories
    const bonuses = {
      'coding': 1.2,
      'design': 1.1,
      'planning': 1.15,
      'reflection': 1.3
    }

    return Math.floor(baseXP * (bonuses[category] || 1.0))
  }

  /**
   * Calculate level from total XP
   */
  calculateLevel(xp: number): number {
    // Level formula: level = floor(sqrt(xp / 100))
    return Math.floor(Math.sqrt(xp / 100)) + 1
  }

  /**
   * Calculate XP needed for next level
   */
  xpForNextLevel(level: number): number {
    return Math.pow(level, 2) * 100
  }

  /**
   * Update stats based on activity
   */
  updateStats(currentStats: PlayerStats, activity: Activity): PlayerStats {
    // Example: coding increases focus, decreases energy
    // TODO: Implement stat logic
    return currentStats
  }
}
```

### Step 3: Message Analyzer (1-2 hours)

Create `packages/life-game/src/message-analyzer.ts`:

```typescript
export class MessageAnalyzer {
  async analyzeMessage(text: string): Promise<MessageAnalysis> {
    // Simple rule-based analysis for MVP
    // Later: Use Groq AI for better analysis

    const wordCount = text.split(' ').length
    const hasCodeBlock = text.includes('```')
    const hasQuestion = text.includes('?')

    // Detect intent
    let intent = 'general'
    if (text.includes('build') || text.includes('implement')) {
      intent = 'build_feature'
    } else if (hasQuestion) {
      intent = 'ask_question'
    } else if (text.includes('plan') || text.includes('design')) {
      intent = 'planning'
    }

    // Calculate complexity (1-10)
    let complexity = Math.min(10, Math.floor(wordCount / 10) + 1)
    if (hasCodeBlock) complexity += 2

    // Detect category
    const category = this.detectCategory(text)

    // Detect emotion (simple keywords)
    const emotion = this.detectEmotion(text)

    return {
      text,
      timestamp: new Date().toISOString(),
      intent,
      complexity,
      category,
      emotion,
      contextNeeded: false,
      xpGain: 0, // Will be calculated by GameEngine
      statChanges: {},
      questProgress: [],
      skillGains: [],
      itemDropChance: 0,
      storyBeat: null,
      companionReaction: ''
    }
  }

  private detectCategory(text: string): string {
    const keywords = {
      'coding': ['code', 'function', 'bug', 'implement', 'build'],
      'design': ['design', 'ui', 'ux', 'layout', 'style'],
      'planning': ['plan', 'roadmap', 'strategy', 'goal'],
      'reflection': ['think', 'reflect', 'understand', 'learn']
    }

    // Check which category has most keyword matches
    // TODO: Implement
    return 'general'
  }

  private detectEmotion(text: string): string {
    // Simple keyword matching
    if (text.match(/tired|exhausted|low energy/i)) return 'tired'
    if (text.match(/excited|amazing|awesome|great/i)) return 'excited'
    if (text.match(/focused|concentrate/i)) return 'focused'
    return 'neutral'
  }
}
```

### Step 4: API Routes (1 hour)

Create `packages/life-game/src/life-game-api.ts`:

```typescript
import { Hono } from 'hono'
import { GameEngine } from './game-engine'
import { MessageAnalyzer } from './message-analyzer'

const app = new Hono()
const gameEngine = new GameEngine()
const messageAnalyzer = new MessageAnalyzer()

/**
 * POST /life-game/message
 * Process a chat message and return game state + AI response
 */
app.post('/message', async (c) => {
  const { playerId, message } = await c.req.json()

  // 1. Analyze message
  const analysis = await messageAnalyzer.analyzeMessage(message)

  // 2. Calculate XP gain
  const xpGain = gameEngine.calculateXP(analysis.complexity, analysis.category)
  analysis.xpGain = xpGain

  // 3. Get current player state
  const playerState = await db.query.playerState.findFirst({
    where: eq(schema.playerState.id, playerId)
  })

  if (!playerState) {
    return c.json({ error: 'Player not found' }, 404)
  }

  // 4. Update XP and level
  const newXP = playerState.xp + xpGain
  const newLevel = gameEngine.calculateLevel(newXP)
  const leveledUp = newLevel > playerState.level

  await db.update(schema.playerState)
    .set({ xp: newXP, level: newLevel, updatedAt: new Date() })
    .where(eq(schema.playerState.id, playerId))

  // 5. Save message analysis
  await db.insert(schema.messageAnalysis).values({
    id: nanoid(),
    playerId,
    message,
    intent: analysis.intent,
    complexity: analysis.complexity,
    xpGained: xpGain,
    createdAt: new Date()
  })

  // 6. Generate Luna response (use existing Luna system)
  const lunaResponse = await generateLunaResponse(message, analysis)

  // 7. Generate companion reaction
  const companionReaction = generateCompanionReaction(analysis, leveledUp)

  return c.json({
    // AI response
    response: lunaResponse,

    // Game state update
    gameState: {
      xpGained: xpGain,
      newXP,
      newLevel,
      leveledUp,
      xpToNextLevel: gameEngine.xpForNextLevel(newLevel) - newXP
    },

    // Companion reaction
    companion: companionReaction,

    // Analysis (for debugging)
    analysis
  })
})

/**
 * GET /life-game/state
 * Get current player state
 */
app.get('/state', async (c) => {
  const playerId = c.req.query('playerId')

  const playerState = await db.query.playerState.findFirst({
    where: eq(schema.playerState.id, playerId),
    with: {
      stats: true,
      companions: true
    }
  })

  if (!playerState) {
    return c.json({ error: 'Player not found' }, 404)
  }

  return c.json(playerState)
})

export default app
```

### Step 5: Frontend HUD (2-3 hours)

Create `apps/web/life-game-hud.js`:

```javascript
/**
 * Life Game HUD Overlay
 * Shows player level, XP, stats on top of chat interface
 */

class LifeGameHUD {
  constructor(playerId) {
    this.playerId = playerId
    this.state = null

    this.createHUD()
    this.loadState()

    // Update HUD every 5 seconds
    setInterval(() => this.loadState(), 5000)
  }

  createHUD() {
    const hud = document.createElement('div')
    hud.id = 'life-game-hud'
    hud.innerHTML = `
      <div class="hud-container">
        <div class="hud-level">
          <span class="level-badge">Lv. <span id="player-level">1</span></span>
          <div class="xp-bar">
            <div class="xp-fill" id="xp-fill" style="width: 0%"></div>
            <span class="xp-text" id="xp-text">0 / 100</span>
          </div>
        </div>

        <div class="hud-stats">
          <div class="stat" title="Energy">⚡ <span id="stat-energy">50</span></div>
          <div class="stat" title="Love">💝 <span id="stat-love">50</span></div>
          <div class="stat" title="Wisdom">📚 <span id="stat-wisdom">50</span></div>
          <div class="stat" title="Creativity">🎨 <span id="stat-creativity">50</span></div>
        </div>

        <div class="hud-menu">
          <button onclick="lifeGameHUD.openMenu()" title="Menu (Cmd+M)">☰</button>
        </div>
      </div>
    `

    document.body.appendChild(hud)

    // Add CSS
    this.addStyles()
  }

  addStyles() {
    const style = document.createElement('style')
    style.textContent = `
      #life-game-hud {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }

      .hud-container {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 10px 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .hud-level {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .level-badge {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 5px 15px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 14px;
      }

      .xp-bar {
        position: relative;
        width: 200px;
        height: 20px;
        background: rgba(255,255,255,0.1);
        border-radius: 10px;
        overflow: hidden;
      }

      .xp-fill {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
        transition: width 0.5s ease;
      }

      .xp-text {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 11px;
        font-weight: bold;
        text-shadow: 0 1px 3px rgba(0,0,0,0.5);
      }

      .hud-stats {
        display: flex;
        gap: 15px;
        flex: 1;
      }

      .stat {
        display: flex;
        align-items: center;
        gap: 5px;
        color: white;
        font-size: 14px;
        cursor: help;
      }

      .hud-menu button {
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: white;
        padding: 8px 15px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .hud-menu button:hover {
        background: rgba(255,255,255,0.2);
        border-color: rgba(255,255,255,0.3);
      }
    `
    document.head.appendChild(style)
  }

  async loadState() {
    const response = await fetch(`/life-game/state?playerId=${this.playerId}`)
    this.state = await response.json()
    this.updateHUD()
  }

  updateHUD() {
    if (!this.state) return

    // Update level
    document.getElementById('player-level').textContent = this.state.level

    // Update XP bar
    const xpPercent = (this.state.xp / this.xpForNextLevel(this.state.level)) * 100
    document.getElementById('xp-fill').style.width = `${xpPercent}%`
    document.getElementById('xp-text').textContent =
      `${this.state.xp} / ${this.xpForNextLevel(this.state.level)}`

    // Update stats
    if (this.state.stats) {
      document.getElementById('stat-energy').textContent = this.state.stats.energy
      document.getElementById('stat-love').textContent = this.state.stats.love
      document.getElementById('stat-wisdom').textContent = this.state.stats.wisdom
      document.getElementById('stat-creativity').textContent = this.state.stats.creativity
    }
  }

  xpForNextLevel(level) {
    return Math.pow(level, 2) * 100
  }

  /**
   * Show reward animation when XP is gained
   */
  showReward(xpGained, leveledUp) {
    // +XP animation
    const xpPopup = document.createElement('div')
    xpPopup.className = 'xp-popup'
    xpPopup.textContent = `+${xpGained} XP`
    xpPopup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      padding: 20px 40px;
      border-radius: 10px;
      font-size: 24px;
      font-weight: bold;
      z-index: 10000;
      animation: xpPopup 1.5s ease-out forwards;
      box-shadow: 0 10px 40px rgba(240, 147, 251, 0.5);
    `
    document.body.appendChild(xpPopup)

    // Remove after animation
    setTimeout(() => xpPopup.remove(), 1500)

    // Level up celebration
    if (leveledUp) {
      setTimeout(() => this.showLevelUp(), 800)
    }

    // Refresh HUD
    this.loadState()
  }

  showLevelUp() {
    const levelUpBanner = document.createElement('div')
    levelUpBanner.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        animation: fadeIn 0.3s ease;
      ">
        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 60px 100px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(102, 126, 234, 0.5);
        ">
          <div style="font-size: 72px; margin-bottom: 20px;">🎉</div>
          <div style="font-size: 48px; font-weight: bold; color: white; margin-bottom: 10px;">
            LEVEL UP!
          </div>
          <div style="font-size: 24px; color: rgba(255,255,255,0.8);">
            You reached Level ${this.state.level}
          </div>
        </div>
      </div>
    `
    document.body.appendChild(levelUpBanner)

    // Remove after 3 seconds
    setTimeout(() => levelUpBanner.remove(), 3000)
  }

  openMenu() {
    // TODO: Implement full game menu
    alert('Game Menu coming soon! 🎮')
  }
}

// Initialize HUD when page loads
window.addEventListener('DOMContentLoaded', () => {
  const playerId = 'default-player' // TODO: Get from session
  window.lifeGameHUD = new LifeGameHUD(playerId)
})
```

### Step 6: Integrate with Luna Chat (1 hour)

Modify `apps/web/luna-consciousness.html` to include Life Game Chat:

```html
<!-- Add at top of <body> -->
<script src="life-game-hud.js"></script>

<!-- Modify message sending to include game state -->
<script>
async function sendMessage(message) {
  // Send to Life Game API
  const response = await fetch('/life-game/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      playerId: 'default-player',
      message
    })
  })

  const result = await response.json()

  // Show Luna's response
  addMessageToChat('luna', result.response)

  // Show XP reward animation
  if (result.gameState.xpGained > 0) {
    window.lifeGameHUD.showReward(
      result.gameState.xpGained,
      result.gameState.leveledUp
    )
  }

  // Show companion reaction
  if (result.companion) {
    addCompanionReaction(result.companion)
  }
}
</script>
```

---

## ✅ MVP Checklist

### Day 1: Database & Backend
- [ ] Create database schema (30 min)
- [ ] Run migrations (10 min)
- [ ] Implement GameEngine class (1-2 hours)
- [ ] Implement MessageAnalyzer class (1-2 hours)
- [ ] Create API routes (1 hour)
- [ ] Test API with Postman/curl (30 min)

### Day 2: Frontend HUD
- [ ] Create HUD overlay component (2 hours)
- [ ] Add XP bar animation (30 min)
- [ ] Add reward popup animations (1 hour)
- [ ] Add level-up celebration (30 min)
- [ ] Test HUD in browser (30 min)

### Day 3: Integration & Polish
- [ ] Integrate HUD with Luna chat (1 hour)
- [ ] Connect frontend to backend API (1 hour)
- [ ] Create default player on first visit (30 min)
- [ ] Add keyboard shortcut for menu (30 min)
- [ ] Test complete flow (1 hour)
- [ ] Polish animations & UX (1-2 hours)

---

## 🎯 Success Criteria

**MVP is complete when:**
1. ✅ User can send messages to Luna
2. ✅ Each message gives XP based on complexity
3. ✅ HUD shows current level, XP bar, and stats
4. ✅ Reward animations appear after each message
5. ✅ Level-up celebration triggers when reaching new level
6. ✅ All data persists in database
7. ✅ Luna's responses feel natural and encouraging

---

## 🚀 Next Steps (Phase 2+)

After MVP:
- **Week 2:** Add inventory, items, item drops
- **Week 3:** Add quests, quest tracking
- **Week 4:** Add runs, story arcs
- **Week 5:** Add achievements
- **Week 6:** Add more companions (Blaze, Harmony)
- **Week 7:** Polish, balance, playtesting

---

## 📝 Notes

- Keep it simple for MVP - no overengineering!
- Use existing Luna personality, don't rebuild from scratch
- Database schema can evolve, start minimal
- Focus on feel and UX - animations matter!
- Test frequently in browser, not just API

---

**Ready to start implementation!** 🎮✨

**Next file to create:** `packages/core/src/db/schema-life-game.ts`
