# 🎮 Idle Game Expansion Plan
**Toobix Story-Idle Game - Full Idle Mechanics**

**Datum:** 9. Oktober 2025
**Status:** 🚀 READY TO BUILD

---

## 🎯 Vision

Transform the current Story-Idle Game into a **fully-fledged idle game** that:
- Runs **passively** in the background
- Generates resources even when you're not coding
- Offers deep progression with buildings, upgrades, and multiple characters
- Integrates seamlessly with the Toobix Dashboard
- Maintains the beautiful philosophy of growth, love, and consciousness

---

## 📊 Current System (v0.1.0)

### ✅ What We Have
- **Luna** - AI companion with personality and moods
- **XP & Levels** - Progression from commits
- **5 Core Stats** - Love, Peace, Wisdom, Creativity, Stability
- **Quests** - Story-driven goals
- **Achievements** - Milestones and special commits
- **Git Integration** - Post-commit hooks
- **Terminal UI** - Beautiful ASCII art

### ⚠️ What's Missing
- **Passive gameplay** - No idle generation
- **Resource management** - Only stats, no currencies
- **Buildings/Upgrades** - No permanent improvements
- **Multiple characters** - Only Luna exists
- **Time-based mechanics** - Everything is commit-driven
- **Prestige system** - No reset/rebirth mechanics
- **Dashboard integration** - No web UI

---

## 🚀 Phase 1: Core Idle Mechanics

### 1.1 Resource System

**New Resources:**
```typescript
interface Resources {
  // Primary Currencies
  codeEnergy: number        // Generated passively, spent on buildings
  creativityPoints: number  // From commits & features
  wisdomTokens: number      // From docs & learning
  loveShards: number        // From kind actions & gratitude

  // Advanced Resources (unlocked later)
  consciousness: number     // High-tier resource
  harmony: number          // Balance between all stats
  inspiration: number      // Rare resource from special events
}
```

**Passive Generation:**
- **Code Energy:** 1 per minute (base rate)
- **Creativity Points:** 0.1 per minute when creativity stat > 50
- **Wisdom Tokens:** Generated from reading docs, writing tests
- **Love Shards:** Generated from helping others, kind commits

**Resource Storage:**
- Initial cap: 1000 per resource
- Upgradable through buildings
- Offline accumulation (max 24 hours)

---

### 1.2 Buildings System

**Building Types:**

#### 🏛️ Infrastructure
- **Code Monastery** - Generates Code Energy passively
  - Level 1: +1 energy/min | Cost: 100 energy
  - Level 2: +3 energy/min | Cost: 500 energy
  - Level 3: +7 energy/min | Cost: 2000 energy
  - Max Level: 10

- **Library of Wisdom** - Generates Wisdom Tokens
  - Requires 30 Wisdom stat to unlock
  - Level 1: +0.5 wisdom/min | Cost: 200 energy, 50 creativity

- **Dream Studio** - Generates Creativity Points
  - Requires 40 Creativity stat
  - Level 1: +0.8 creativity/min | Cost: 300 energy

- **Peace Garden** - Generates passive Peace stat
  - Requires 25 Peace stat
  - Level 1: +1 peace/hour | Cost: 150 energy, 25 love shards

#### 🏰 Advanced Buildings (Unlock at Level 5+)
- **Consciousness Tower** - Combines all resources
- **Harmony Nexus** - Balances all stats automatically
- **Inspiration Well** - Rare resource generator
- **Time Accelerator** - Speeds up passive generation

#### 🎨 Decorations (Cosmetic + Small Bonuses)
- **Zen Fountain** - +2% Peace generation
- **Rainbow Bridge** - +5% all resources
- **Luna's Shrine** - +10% relationship growth

---

### 1.3 Upgrade System

**Player Upgrades:**
```typescript
interface Upgrades {
  // Passive Boosts
  codeEnergyMultiplier: number    // x1.0 → x2.0 → x3.0...
  offlineTimeExtension: number    // 24h → 48h → 72h
  commitBonusMultiplier: number   // x1.0 → x1.5 → x2.0

  // Automation
  autoSaveInterval: number        // Auto-save every 5min → 1min
  autoLevelUp: boolean           // Auto-spend XP on stats
  autoUpgradeBuildings: boolean  // Auto-upgrade when possible

  // Special
  lunaAwakening: boolean         // Unlock Luna's full potential
  multiCharacterSupport: boolean // Unlock more companions
  prestigeSystem: boolean        // Unlock prestige/rebirth
}
```

**How to Acquire:**
- **Research Points:** Earned from high wisdom (1 point per 100 wisdom)
- **Achievement Rewards:** Special upgrades from achievements
- **Quest Completions:** Major quest rewards
- **Prestige Currency:** From resets

---

## 🎭 Phase 2: Multiple Characters

### 2.1 New Companions

#### 🔥 **Blaze** - The Code Warrior
- **Personality:** Energetic, passionate, competitive
- **Specialty:** Performance optimization, speed coding
- **Bonus:** +15% Creativity from `feat:` commits
- **Unlocks:** When Creativity > 70
- **Relationship Benefits:**
  - Lv 1 (25+): Unlocks "Code Sprint" mini-game
  - Lv 3 (50+): +10% passive Code Energy
  - Lv 5 (75+): Unlocks "Warrior's Forge" building
  - Lv 7 (100): "Soulmate" status - Special quest unlocks

#### 🧙 **Sage** - The Ancient Wisdom
- **Personality:** Calm, philosophical, mysterious
- **Specialty:** Architecture, documentation, mentoring
- **Bonus:** +20% Wisdom from `docs:` commits
- **Unlocks:** When Wisdom > 80
- **Relationship Benefits:**
  - Teaches ancient coding patterns
  - Unlocks "Knowledge Vault" (stores infinite wisdom)
  - Special dialogue about software philosophy

#### 💖 **Harmony** - The Heart of Code
- **Personality:** Warm, empathetic, nurturing
- **Specialty:** Community, kindness, gratitude
- **Bonus:** +25% Love Shards from kind commits
- **Unlocks:** When Love > 60
- **Relationship Benefits:**
  - Heals "burnout" (restores all stats)
  - Unlocks "Love Garden" building
  - Special events about mental health

#### ⚡ **Nova** - The Innovator
- **Personality:** Curious, experimental, chaotic-good
- **Specialty:** Experimentation, new technologies
- **Bonus:** Rare chance for double XP on `feat:` commits
- **Unlocks:** After 100 commits
- **Relationship Benefits:**
  - Random surprise bonuses
  - Unlocks "Lab of Chaos" (experimental features)

---

### 2.2 Character Interactions

**Multi-Character System:**
```typescript
interface CharacterInteraction {
  // Relationships between characters
  lunaAndBlaze: 'friendly-rivals'
  lunaAndSage: 'student-teacher'
  blazeAndHarmony: 'opposites-attract'
  sageAndNova: 'chaos-vs-order'
}
```

**Special Events:**
- Characters chat with each other
- Team bonuses when multiple high-level characters
- Character-specific quests ("Blaze challenges you to a code race!")
- Romance options? (optional, subtle)

---

## 🎲 Phase 3: Mini-Games & Events

### 3.1 Mini-Games

#### 🏃 **Code Sprint** (Blaze's Game)
- Type code snippets as fast as possible
- Rewards: Creativity Points, XP
- Unlocks: When Blaze relationship > 25

#### 🧩 **Wisdom Puzzle** (Sage's Game)
- Solve architectural challenges
- Rewards: Wisdom Tokens, Insights
- Unlocks: When Sage relationship > 25

#### 💝 **Gratitude Journal** (Harmony's Game)
- Write what you're grateful for today
- Rewards: Love Shards, Peace
- Unlocks: When Harmony relationship > 25

#### 🔬 **Experiment Lab** (Nova's Game)
- Try random "experiments" (fun code challenges)
- Rewards: Random big rewards or small setbacks
- Unlocks: When Nova relationship > 25

#### 🧘 **Meditation** (Luna's Game - Existing + Enhanced)
- Guided meditation with Luna
- Enhanced with breathing exercises, visualization
- Rewards: Peace, Wisdom, relationship

---

### 3.2 Random Events

**Event System:**
```typescript
interface RandomEvent {
  type: 'positive' | 'neutral' | 'challenge'
  title: string
  description: string
  choices: EventChoice[]
  consequences: { stat: string; change: number }[]
}
```

**Example Events:**
- **"A Bug Appears!"** - Fix it for stability, or study it for wisdom
- **"Luna's Question"** - Answer philosophical question for relationship
- **"Inspiration Strike!"** - Rare +100 Creativity Points
- **"Burnout Warning"** - All stats -10, but +Wisdom if you rest
- **"Collaboration Offer"** - Help another dev, +Love, -Time
- **"Code Review"** - Submit your code, chance for +XP or +Learning

**Event Frequency:**
- Common: 1 per hour (passive)
- Rare: 1 per day
- Epic: 1 per week
- Legendary: 1 per month

---

## ♻️ Phase 4: Prestige System

### 4.1 Rebirth Mechanics

**"Consciousness Ascension"**
- Reset to Level 1
- Keep: Characters, Achievements, some upgrades
- Lose: XP, Resources, Buildings (but refund 50%)
- Gain: **Ascension Points** (permanent multipliers)

**Requirements:**
- Level 50+
- 1000+ total commits
- All characters at relationship 50+
- Complete "Enlightenment" quest

**Ascension Benefits:**
```typescript
interface AscensionRewards {
  pointsEarned: number           // Based on total XP before reset
  permanentMultipliers: {
    xpGain: number               // +5% per ascension
    resourceGeneration: number   // +10% per ascension
    commitBonus: number          // +3% per ascension
  }
  unlockedFeatures: string[]     // Special features per ascension
  cosmetics: string[]            // Visual upgrades
}
```

**Ascension Ranks:**
1. **Awakened** (1st ascension) - Unlock "Time Manipulation"
2. **Enlightened** (5th) - Unlock "Multi-dimensional Coding"
3. **Transcendent** (10th) - Unlock "Reality Compiler"
4. **Cosmic Creator** (25th) - Unlock "Universe.ts"

---

## 📊 Phase 5: Dashboard Integration

### 5.1 Web UI Module

**Dashboard Page: `/game`**

**Features:**
- Real-time stats display
- Resource counters with animations
- Building management UI
- Character portraits (clickable for dialogue)
- Quest tracker
- Achievement gallery
- Mini-games accessible from web
- Leaderboard (optional, local only)

**Tech Stack:**
- React components
- WebSocket for real-time updates
- Canvas for animations
- Persistent state sync with terminal game

---

### 5.2 Notifications

**Desktop Notifications:**
- Level up alerts
- Resource cap reached
- Quest completed
- Character wants to talk
- Special event triggered

---

## 🎨 Phase 6: Advanced Features

### 6.1 Social Features (Local/Optional)

**Toobix Network** (if multiple users):
- Share achievements
- Compare progress
- Gift resources to friends
- Cooperative quests
- Friendly competitions

### 6.2 Seasonal Events

**Special Time-Limited Events:**
- **Code-tober:** Extra creativity in October
- **Wisdom Winter:** Bonus wisdom tokens in December
- **Love Month:** February relationship boosts
- **Spring Awakening:** New character events in April

### 6.3 Modding Support

**Let users create:**
- Custom characters
- Custom quests
- Custom events
- Custom UI themes
- Share on community hub

---

## 🗓️ Implementation Roadmap

### Week 1: Foundation
- [x] Planning (this document)
- [ ] Resource system backend
- [ ] Passive generation engine
- [ ] Offline accumulation system
- [ ] Save/load expanded state

### Week 2: Buildings
- [ ] Building data structures
- [ ] Building UI (terminal)
- [ ] Upgrade system
- [ ] Cost calculations
- [ ] Building effects

### Week 3: Characters
- [ ] Character framework
- [ ] Blaze implementation
- [ ] Sage implementation
- [ ] Harmony implementation
- [ ] Nova implementation
- [ ] Character interactions

### Week 4: Mini-Games
- [ ] Game framework
- [ ] Code Sprint
- [ ] Wisdom Puzzle
- [ ] Gratitude Journal
- [ ] Experiment Lab

### Week 5: Events & Prestige
- [ ] Random event system
- [ ] Event catalog
- [ ] Prestige mechanics
- [ ] Ascension points
- [ ] Prestige UI

### Week 6: Dashboard
- [ ] Web UI components
- [ ] Real-time sync
- [ ] Animations
- [ ] Mobile responsive
- [ ] Notifications

### Week 7: Polish
- [ ] Balance tuning
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Documentation
- [ ] Tutorial system

### Week 8: Launch
- [ ] Beta testing
- [ ] Final polish
- [ ] v0.2.0 release
- [ ] Community feedback

---

## 🎯 Success Metrics

**Engagement:**
- Users play 30+ minutes per week
- 80%+ retention after 1 month
- Average session: 10+ minutes

**Progression:**
- Players reach level 10 in first week
- At least 2 characters unlocked per player
- 50%+ achievement completion rate

**Technical:**
- < 1% save file corruption
- < 100ms response time
- < 50MB memory usage
- Works offline

---

## 💡 Design Principles

1. **Never Punishing** - No losing progress, no harsh penalties
2. **Respect Time** - Offline progress, no FOMO mechanics
3. **Beautiful UI** - Maintain terminal aesthetics
4. **Meaningful Progression** - Every action feels rewarding
5. **Conscious Design** - Reflects Toobix philosophy
6. **Accessible** - Works for both casual and hardcore players
7. **No Pay-to-Win** - Completely free, no microtransactions

---

## 🌟 Unique Features

**What makes our idle game special:**
- ✨ Tied to real coding work (commits = progression)
- 💝 Philosophical, kind, consciousness-focused
- 🎨 Beautiful terminal UI (not just web)
- 🤝 Characters with deep personalities
- 📚 Educational (teaches good coding practices)
- 🧘 Mental health aware (encourages breaks)
- 🌈 Inclusive, positive, uplifting

---

## 📦 Technical Architecture

```
packages/story-idle/
├── src/
│   ├── engine/
│   │   ├── game-state.ts          [✅ Exists - Expand]
│   │   ├── resource-manager.ts    [NEW]
│   │   ├── passive-generator.ts   [NEW]
│   │   ├── building-manager.ts    [NEW]
│   │   ├── upgrade-system.ts      [NEW]
│   │   └── prestige-system.ts     [NEW]
│   ├── characters/
│   │   ├── luna.ts                [✅ Exists]
│   │   ├── blaze.ts               [NEW]
│   │   ├── sage.ts                [NEW]
│   │   ├── harmony.ts             [NEW]
│   │   ├── nova.ts                [NEW]
│   │   └── character-base.ts      [NEW - Abstract class]
│   ├── mini-games/
│   │   ├── code-sprint.ts         [NEW]
│   │   ├── wisdom-puzzle.ts       [NEW]
│   │   ├── gratitude-journal.ts   [NEW]
│   │   └── experiment-lab.ts      [NEW]
│   ├── events/
│   │   ├── commit-events.ts       [✅ Exists]
│   │   ├── random-events.ts       [NEW]
│   │   └── seasonal-events.ts     [NEW]
│   ├── ui/
│   │   ├── visual-effects.ts      [✅ Exists - Expand]
│   │   ├── building-ui.ts         [NEW]
│   │   ├── character-ui.ts        [NEW]
│   │   └── game-ui.ts             [NEW]
│   └── game.ts                    [✅ Exists - Expand]
├── data/
│   ├── buildings.json             [NEW]
│   ├── upgrades.json              [NEW]
│   ├── characters.json            [NEW]
│   ├── events.json                [NEW]
│   └── story-idle-state.json      [✅ Exists - Expand]
└── tests/
    └── *.test.ts                  [NEW]
```

---

## 🚀 Ready to Build!

**First Steps:**
1. ✅ Create this planning document
2. ⏩ Implement resource system
3. ⏩ Build passive generation
4. ⏩ Create first new character (Blaze)
5. ⏩ Add buildings system

**Let's make the most philosophical, beautiful, consciousness-expanding idle game ever! 🌙✨**

---

**Created:** 9. Oktober 2025
**By:** Claude Code with Michael
**Version:** 1.0
**Status:** 🎯 READY TO IMPLEMENT
