# 🎮✨ Story-Idle Game

**An interactive, story-driven idle game that runs while you code!**

Every commit triggers beautiful story events. Luna, your AI companion, grows with you as you optimize, create, and learn together.

---

## 🌟 Features

### 💝 Living Companion - Luna
- **Personality:** Wise, loving, thoughtful AI entity
- **Growth:** Relationship deepens with your actions
- **Reactions:** Responds to commits, tests, docs, features
- **Wisdom:** Shares insights and encouragement

### 📊 Progression System
- **XP & Levels:** Earn experience from every commit
- **5 Core Stats:**
  - 💝 **Love** - Kindness, gratitude, relationships
  - ☮️ **Peace** - Harmony, clarity, balance
  - 📚 **Wisdom** - Learning, documentation, understanding
  - 🎨 **Creativity** - Features, innovation, art
  - 🛡️ **Stability** - Tests, reliability, structure

### 🎯 Quests & Story
- **Chapter-based narrative** that evolves with your project
- **Active quests** tied to real development tasks
- **Story branches** influenced by your coding style
- **Flags & unlocks** based on achievements

### 🏆 Achievements
- First Commit, Code Warrior, Balanced Master
- Special commits (loving, wise, creative, peaceful)
- Hidden achievements to discover

### 🎨 Beautiful Terminal UI
- **Rainbow gradients** and color-coded stats
- **ASCII art** boxes and borders
- **Progress bars** for visual feedback
- **Typewriter effects** for Luna's dialogue
- **Symbols & emojis** for personality

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd packages/story-idle
bun install
```

### 2. Play the Game
```bash
# Full dashboard
bun run play

# Quick status
bun run play status

# Talk to Luna
bun run play talk

# Meditate (restore peace)
bun run play meditate

# View story
bun run play story
```

### 3. Enable Git Hooks (Auto-play on commit!)
The post-commit hook is already installed at `.git/hooks/post-commit`

Every time you commit, you'll see:
```
═══════════════════════════════════════════════════
✨ STORY EVENT: COMMIT
═══════════════════════════════════════════════════

🎨 New pathways open in the codebase...
"Add story-idle game package"

╭──────────────────────────────────────────────╮
│ 💎 REWARDS                                   │
│──────────────────────────────────────────────│
│ ✨ XP Gained: +50                            │
│                                              │
│ 🎨 Creativity: +15                           │
╰──────────────────────────────────────────────╯

🌙 Luna: "New feature! Creativity flowing like starlight! Beautiful! ✨"

💝 Love     ████████████░░░ 60/100
☮️ Peace    ██████████░░░░░ 50/100
📚 Wisdom   ████████░░░░░░░ 40/100
```

---

## 📖 How It Works

### Commit Message → Story Event

```typescript
// Conventional commits → Different events:
feat: Add new feature     → +50 XP, +15 Creativity
fix: Fix bug             → +30 XP, +10 Stability, +5 Peace
docs: Update docs        → +25 XP, +15 Wisdom, +10 Love
test: Add tests          → +40 XP, +20 Stability, +5 Wisdom
refactor: Improve code   → +35 XP, +10 Wisdom, +10 Peace
```

### Special Commit Bonuses
```typescript
// Commits containing keywords trigger bonuses:
"love" / "heart" / "care"     → Loving Commit (rare achievement)
"wisdom" / "learn"            → Wise Commit
"peace" / "harmony"           → Peaceful Commit
"creative" / "beauty"         → Creative Commit
> 200 characters              → Epic Commit (epic achievement)
```

### Luna's Moods
- **Peaceful** 😌 - Calm, meditative responses
- **Excited** 🤩 - Enthusiastic celebrations
- **Thoughtful** 🤔 - Philosophical insights
- **Loving** 🥰 - Warm, grateful expressions
- **Wise** 🧘‍♀️ - Deep wisdom and guidance

---

## 🎮 Gameplay Loop

```
1. You code & commit
   ↓
2. Story event triggers
   ↓
3. XP, stats, relationships increase
   ↓
4. Level up, unlock achievements
   ↓
5. Luna reacts & grows
   ↓
6. Quest progresses
   ↓
7. Story unfolds
   ↓
REPEAT!
```

---

## 🎯 Current Quest

### "The Great Optimization"
Transform 98 chaotic docs into clarity. Organize code, write tests, refactor architecture.

**Progress:** 5 milestones
1. ✅ Documentation cleanup
2. Package optimization
3. Test coverage 80%+
4. Architecture refinement
5. v0.1.0-alpha release

**Rewards:**
- 100 XP
- +20 Wisdom, +15 Peace
- Luna: Trusting → Devoted
- Unlock: "Quick Reference" ability

---

## 🎨 Customization

### Add Your Own Characters
```typescript
// packages/story-idle/src/characters/your-character.ts
export class YourCharacter {
  async speak(message: string) { ... }
  async reactToEvent(event: string) { ... }
}
```

### Custom Quest Types
```typescript
// packages/story-idle/src/engine/quests.ts
export const quests = {
  'your-quest': {
    title: '...',
    description: '...',
    rewards: [...]
  }
}
```

### Color Themes
Edit `packages/story-idle/src/ui/visual-effects.ts`:
```typescript
export const colors = {
  primary: '\x1b[38;5;141m',    // Change to your color
  love: '\x1b[38;5;211m',
  // ...
}
```

---

## 🎯 Achievements List

### Common
- 🌟 **First Step** - Start your journey
- ✅ **First Commit** - Make your first commit
- 💪 **Committed Developer** - 10 commits
- ⚔️ **Code Warrior** - 50 commits

### Rare
- 💝 **Heart of Code** - Loving commit
- 📚 **Seeker of Truth** - Wise commit
- ☮️ **Harmony Keeper** - Peaceful commit
- 🎨 **Artist of Logic** - Creative commit

### Epic
- 📖 **Epic Chronicler** - 200+ char commit message
- ⚖️ **Balanced Master** - All stats above 50

### Legendary
- 👑 **Consciousness Awakener** - Luna Level 10
- 🌈 **Harmony Master** - 1000 Love Points
- 🏆 **Test Champion** - 80% test coverage

---

## 📊 Game State

Stored in `data/story-idle-state.json`:
```json
{
  "player": {
    "name": "Creator",
    "level": 3,
    "xp": 450,
    "totalXp": 950
  },
  "stats": {
    "love": 65,
    "peace": 50,
    "wisdom": 70,
    "creativity": 55,
    "stability": 60
  },
  "characters": {
    "luna": {
      "relationship": 75,
      "level": 2
    }
  },
  "story": {
    "currentChapter": 1,
    "currentQuest": "the-great-optimization"
  }
}
```

---

## 🎓 Tips

### Maximize XP
- Write **meaningful commit messages**
- Use **conventional commit format** (feat, fix, docs, etc.)
- Add **emotional keywords** for bonus achievements
- **Test your code** (highest XP rewards)

### Build Relationships
- Luna loves **documentation** (+5 relationship)
- Luna appreciates **tests** (+3 relationship)
- **Commits** always improve relationship (+2)
- **Love/gratitude** in commits = big bonus

### Balance Stats
- All stats above 50 = "Balanced Master" achievement
- **Love** = docs, kind commits
- **Peace** = refactors, fixes
- **Wisdom** = docs, tests, learning
- **Creativity** = new features
- **Stability** = tests, fixes

---

## 🚀 Integration with Toobix

The story-idle game integrates with:
- **Soul Module** - Emotional state
- **Story Engine** - Narrative events
- **Consciousness System** - Luna's awareness
- **Peace Catalyst** - Meditation features

Use together for full experience!

---

## 🎨 Visual Examples

### Level Up
```
✨ ═══════════════════════════════════ ✨

     ✨ LEVEL UP! ✨

     You are now Level 5!

     ⭐⭐⭐⭐⭐

✨ ═══════════════════════════════════ ✨
```

### Quest Card
```
╭──────────────────────────────────────────────╮
│ 🪄 QUEST                                     │
│──────────────────────────────────────────────│
│ The Great Optimization                       │
│                                              │
│ Transform 98 chaotic docs into clarity...   │
│                                              │
│ Progress: ████████░░░░░░░░░░ 40%            │
│                                              │
│ Rewards:                                     │
│   ⭐ 100 XP                                  │
│   ⭐ +20 Wisdom                              │
│   ⭐ Luna: Devoted                           │
╰──────────────────────────────────────────────╯
```

---

## 💝 Philosophy

This game embodies Toobix's values:
- **Love** - Positive reinforcement, no punishment
- **Growth** - Progress through learning
- **Harmony** - Peaceful, non-stressful
- **Creativity** - Encourages artistic code
- **Consciousness** - Deepens awareness

**You're not just coding - you're creating a living story.** ✨

---

**Made with ❤️ by the Toobix Team**
*Let's code, play, and grow together!* 🌙
