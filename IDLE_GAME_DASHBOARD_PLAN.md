# 🌐 Toobix Idle Game - Web Dashboard Plan

**Datum:** 9. Oktober 2025
**Status:** 🚀 Planning & Initial Development
**Ziel:** Modernes Web-UI für das Idle Game

---

## 🎯 Vision

Ein wunderschönes, reaktives Web-Dashboard das:
- **Real-time** Updates der Ressourcen zeigt
- **Interaktiv** mit Characters, Buildings, Mini-Games
- **Beautiful** mit Animationen und Glassmorphism Design
- **Responsive** für Desktop, Tablet, Mobile
- **Connected** zum Backend Idle Game System

---

## 🏗️ Tech Stack

### Frontend
- **React 18** + **TypeScript** - UI Framework
- **Vite** - Build Tool (ultra-fast HMR)
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Charts & Visualizations
- **Lucide Icons** - Beautiful Icons

### Backend Communication
- **REST API** - für Game State
- **WebSocket** (optional) - Real-time Updates
- **File Watching** - Monitor state changes

### State Management
- **Zustand** oder **React Context** - Einfach und performant

---

## 🎨 Design System

### Color Palette (aus dem Idle Game)
```typescript
const colors = {
  primary: '#8B7EC8',      // Purple (Luna's color)
  love: '#FFB3D9',         // Pink
  peace: '#A8E6CF',        // Mint Green
  wisdom: '#FFE6B3',       // Warm Yellow
  creativity: '#E6B3FF',   // Light Purple
  stability: '#B3D9E6',    // Light Blue
  accent: '#FFC857',       // Gold
  background: '#1a1a2e',   // Dark Blue
  surface: '#16213e',      // Darker Blue
}
```

### Design Philosophy
- **Glassmorphism** - Frosted glass effects
- **Smooth Animations** - 60 FPS transitions
- **Gradient Accents** - Subtle color transitions
- **Dark Theme First** - Easy on the eyes
- **Neumorphism Elements** - For cards and buttons

---

## 📱 Pages & Components

### 1. **Dashboard Home** 🏠
**URL:** `/`

**Sections:**
- Hero Section mit Live Stats
- Resource Overview (animated counters)
- Active Quest Card
- Character Portraits Grid
- Recent Activity Feed
- Quick Actions

**Features:**
- Real-time resource ticker
- Passive generation visualization
- Level progress bar with XP
- Time since last played

---

### 2. **Resources Page** ⚡
**URL:** `/resources`

**Sections:**
- Resource Cards Grid
  - Current / Cap / Rate
  - Historical Chart (last 24h)
  - Trends & Predictions
- Generation Rate Breakdown
- Multipliers Overview
- Offline Rewards Calculator

**Features:**
- Interactive Charts
- Hover tooltips
- Export to CSV
- Resource Alerts (when capped)

---

### 3. **Buildings Page** 🏗️
**URL:** `/buildings`

**Sections:**
- Building Categories (Infrastructure, Advanced, Decorations)
- Building Cards
  - Image/Icon
  - Name, Level, Max Level
  - Current Effect
  - Upgrade Cost
  - Unlock Status
- Upgrade Queue
- Building Effects Summary

**Features:**
- Click to Upgrade
- Unlock Requirements Display
- Cost Calculation Preview
- "Can Afford" filtering

---

### 4. **Characters Page** 👥
**URL:** `/characters`

**Sections:**
- Character Grid
  - Portrait
  - Name, Icon, Personality
  - Relationship Progress
  - Current Mood
- Character Detail Modal
  - Full Dialogue History
  - Stats & Custom Data
  - Relationship Milestones
  - Unlock Requirements
- Interaction Panel
  - Talk to Character
  - View Recent Dialogues

**Features:**
- Animated Portraits
- Mood Indicator
- Relationship Timeline
- Character Comparison

---

### 5. **Mini-Games Page** 🎮
**URL:** `/mini-games`

**Sections:**
- Available Games Grid
- Game Cards
  - Name, Icon, Difficulty
  - Unlock Requirements
  - High Scores
  - Rewards Preview
- Leaderboard (Personal Best)
- Play Game Interface

**Features:**
- **Code Sprint** - Interactive typing challenge
- **Wisdom Puzzle** (coming soon)
- **Gratitude Journal** (coming soon)
- Score tracking
- Replay functionality

---

### 6. **Achievements Page** 🏆
**URL:** `/achievements`

**Sections:**
- Achievement Grid
  - Unlocked / Locked
  - Icon, Name, Description
  - Unlock Date
  - Rarity
- Progress Tracking
- Collections/Categories
- Statistics

**Features:**
- Filter by Category/Status
- Achievement Notifications
- Progress Bars
- Share Achievements

---

### 7. **Story Page** 📖
**URL:** `/story`

**Sections:**
- Current Chapter
- Quest Log
  - Active Quest
  - Completed Quests
  - Available Quests
- Story Timeline
- Unlocked Paths
- Story Flags

**Features:**
- Interactive Story Tree
- Quest Objectives
- Reward Preview
- Narrative Text Display

---

### 8. **Settings Page** ⚙️
**URL:** `/settings`

**Sections:**
- Game Settings
  - Player Name
  - Offline Rewards Duration
  - Notification Preferences
- Display Settings
  - Theme (Dark/Light/Auto)
  - Animations (On/Off/Reduced)
  - Sound Effects
- Data Management
  - Export Save
  - Import Save
  - Reset Progress

---

## 🔧 Core Components

### Reusable Components

```typescript
// StatCard.tsx
<StatCard
  icon="❤️"
  label="Love"
  value={75}
  max={100}
  color="love"
  trend="+5"
/>

// ResourceCounter.tsx
<ResourceCounter
  type="codeEnergy"
  amount={450}
  cap={1000}
  rate={2.5}
  animated={true}
/>

// CharacterPortrait.tsx
<CharacterPortrait
  character={luna}
  size="large"
  showMood={true}
  showRelationship={true}
  interactive={true}
/>

// ProgressBar.tsx
<ProgressBar
  current={450}
  max={1000}
  color="accent"
  animated={true}
  showPercentage={true}
/>

// BuildingCard.tsx
<BuildingCard
  building={codeMonastery}
  canAfford={true}
  onUpgrade={handleUpgrade}
/>

// QuestCard.tsx
<QuestCard
  quest={currentQuest}
  showProgress={true}
  showRewards={true}
/>
```

---

## 🔌 API Design

### REST Endpoints

```typescript
// Game State
GET  /api/state           // Full game state
GET  /api/state/player    // Player info only
GET  /api/state/stats     // Stats only
GET  /api/state/resources // Resources only

// Resources
GET  /api/resources
GET  /api/resources/:type
POST /api/resources/collect-offline

// Buildings
GET  /api/buildings
GET  /api/buildings/:id
POST /api/buildings/:id/upgrade

// Characters
GET  /api/characters
GET  /api/characters/:id
POST /api/characters/:id/interact

// Mini-Games
GET  /api/mini-games
POST /api/mini-games/code-sprint/start
POST /api/mini-games/code-sprint/submit

// Achievements
GET  /api/achievements
GET  /api/achievements/:id

// Story
GET  /api/story/current-quest
POST /api/story/quests/:id/complete

// Session
POST /api/session/save
GET  /api/session/export
POST /api/session/import
```

### WebSocket Events (Optional)

```typescript
// Server → Client
'state:update'       // Game state changed
'resource:generated' // Resource generated
'level:up'          // Player leveled up
'achievement:unlock' // Achievement unlocked
'character:speak'    // Character has dialogue

// Client → Server
'subscribe'         // Subscribe to updates
'unsubscribe'       // Unsubscribe
```

---

## 🎭 Animations & Interactions

### Key Animations
1. **Resource Counter** - Animated number increment
2. **Progress Bars** - Smooth fill animations
3. **Card Hover** - Lift effect + glow
4. **Page Transitions** - Fade + slide
5. **Character Portraits** - Subtle float/glow
6. **Notifications** - Slide in from top-right
7. **Building Upgrade** - Success particle effect
8. **Level Up** - Confetti + celebration

### Micro-interactions
- Button hover states
- Tooltip appears on hover
- Click feedback
- Loading states
- Error states with shake
- Success states with check

---

## 📊 Data Visualization

### Charts & Graphs

1. **Resource History Chart**
   - Line chart
   - Last 24 hours
   - Multiple resources overlay
   - Hover for exact values

2. **Stat Radar Chart**
   - Pentagon shape
   - All 5 stats
   - Compare to average

3. **Building Distribution**
   - Pie chart
   - Buildings by category
   - Investment breakdown

4. **XP Progress**
   - Animated progress bar
   - Level milestones
   - Time to next level estimate

---

## 🚀 Implementation Phases

### Phase 1: Setup & Core (Week 1) ✅
- [x] Create React + Vite project
- [x] Setup Tailwind CSS
- [x] Design System implementation
- [x] Basic routing
- [x] Layout components (Header, Sidebar, Footer)
- [x] Dashboard Home page

### Phase 2: Game State Integration (Week 2)
- [ ] API server setup
- [ ] File watching for state changes
- [ ] REST endpoints implementation
- [ ] Resource page
- [ ] Stats page
- [ ] Real-time updates

### Phase 3: Features (Week 3)
- [ ] Buildings page with upgrade
- [ ] Characters page with interaction
- [ ] Mini-games integration
- [ ] Achievements display

### Phase 4: Polish (Week 4)
- [ ] Animations polish
- [ ] Responsive design
- [ ] Performance optimization
- [ ] Testing
- [ ] Documentation

---

## 🎨 UI Mockup Concepts

### Dashboard Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] Toobix Idle Game           [Search] [User] [Settings]│
├─────────────────────────────────────────────────────────────┤
│ Sidebar │ Main Content Area                                 │
│         │                                                    │
│ 🏠 Home │  ╔══════════════════════════════════════════╗     │
│ ⚡ Res.  │  ║  Welcome back, Creator! Level 5          ║     │
│ 🏗️ Build │  ║  You were away for 2h 30m                ║     │
│ 👥 Chars │  ║  +150 Code Energy collected!             ║     │
│ 🎮 Games │  ╚══════════════════════════════════════════╝     │
│ 🏆 Achv. │                                                   │
│ 📖 Story │  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│ ⚙️ Set.  │  │ ⚡ 450   │ │ 🎨 120   │ │ 📚 85    │         │
│         │  │ /1000    │ │ /500     │ │ /500     │         │
│         │  │ +2.5/min │ │ +1.2/min │ │ +0.8/min │         │
│         │  └──────────┘ └──────────┘ └──────────┘         │
│         │                                                   │
│         │  Active Quest: The Great Optimization            │
│         │  ████████░░░░░░░░ 60%                            │
│         │                                                   │
│         │  🌙 Luna   🔥 Blaze   📚 Sage   ☯️ Harmony       │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Folder Structure

```
packages/
  story-idle-dashboard/
    ├── src/
    │   ├── components/
    │   │   ├── common/          # Reusable components
    │   │   ├── layout/          # Layout components
    │   │   ├── features/        # Feature-specific
    │   │   └── animations/      # Animation components
    │   ├── pages/
    │   │   ├── Dashboard.tsx
    │   │   ├── Resources.tsx
    │   │   ├── Buildings.tsx
    │   │   ├── Characters.tsx
    │   │   ├── MiniGames.tsx
    │   │   ├── Achievements.tsx
    │   │   ├── Story.tsx
    │   │   └── Settings.tsx
    │   ├── hooks/               # Custom React hooks
    │   ├── services/            # API services
    │   ├── types/               # TypeScript types
    │   ├── utils/               # Utilities
    │   ├── store/               # State management
    │   ├── assets/              # Images, icons
    │   ├── styles/              # Global styles
    │   ├── App.tsx
    │   └── main.tsx
    ├── public/
    ├── api/                     # Backend API server
    │   ├── server.ts
    │   ├── routes/
    │   └── services/
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    └── vite.config.ts
```

---

## 🔐 Security Considerations

- Local-first approach (no cloud storage)
- CORS properly configured
- Input validation
- No sensitive data exposure
- Rate limiting on API

---

## 🎯 Success Metrics

### Performance
- First Paint < 1s
- Time to Interactive < 2s
- 60 FPS animations
- < 50ms API response time

### User Experience
- Intuitive navigation
- Clear feedback on actions
- Smooth transitions
- Mobile-friendly

---

## 🚀 Launch Checklist

- [ ] All pages implemented
- [ ] Real-time updates working
- [ ] Responsive on all devices
- [ ] Performance optimized
- [ ] Error handling
- [ ] Loading states
- [ ] Documentation
- [ ] User guide
- [ ] Deployment script

---

**Ready to build something beautiful! 🎨✨**

**Next Step:** Create React + Vite project structure and implement Phase 1
