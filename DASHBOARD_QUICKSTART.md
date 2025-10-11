# 🌐 Dashboard Quick-Start Guide

**Das Web-Dashboard außerhalb des Monorepos erstellen**

---

## 📍 Setup (in neuem Verzeichnis)

```bash
# 1. Erstelle Dashboard-Projekt in separatem Verzeichnis
cd c:/
npm create vite@latest toobix-dashboard -- --template react-ts
cd toobix-dashboard

# 2. Installiere Dependencies
npm install
npm install -D tailwindcss postcss autoprefixer
npm install react-router-dom framer-motion lucide-react recharts

# 3. Tailwind initialisieren
npx tailwindcss init -p
```

---

## ⚙️ Tailwind konfigurieren

**tailwind.config.js:**
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#8B7EC8',
        love: '#FFB3D9',
        peace: '#A8E6CF',
        wisdom: '#FFE6B3',
        creativity: '#E6B3FF',
        stability: '#B3D9E6',
        accent: '#FFC857',
        'bg-dark': '#1a1a2e',
        'bg-surface': '#16213e',
      },
    },
  },
  plugins: [],
}
```

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-bg-dark text-white;
  font-family: 'Inter', sans-serif;
}
```

---

## 🎨 Erste Komponente: ResourceCard

**src/components/ResourceCard.tsx:**
```tsx
interface ResourceCardProps {
  type: string
  icon: string
  amount: number
  cap: number
  rate: number
  color: string
}

export function ResourceCard({ type, icon, amount, cap, rate, color }: ResourceCardProps) {
  const percentage = (amount / cap) * 100

  return (
    <div className={`bg-bg-surface p-6 rounded-xl border-2 border-${color}/20 hover:border-${color}/50 transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{icon}</span>
          <h3 className="font-bold text-xl">{type}</h3>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{amount.toLocaleString()}</span>
          <span className="text-gray-400">/ {cap.toLocaleString()}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`bg-${color} h-2 rounded-full transition-all`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {rate > 0 && (
          <div className="text-sm text-green-400">
            +{rate.toFixed(2)}/min
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## 📡 API Service zum Lesen des Game State

**src/services/gameStateService.ts:**
```typescript
import { GameState } from '../types'

export async function loadGameState(): Promise<GameState> {
  // Lese die JSON-Datei aus dem Idle Game
  const response = await fetch('../../story-idle/data/story-idle-state.json')
  return response.json()
}

// Alternative: Node.js server für bessere Integration
export class GameStateWatcher {
  private ws: WebSocket

  constructor() {
    // WebSocket für real-time updates (optional)
    this.ws = new WebSocket('ws://localhost:3001')
  }

  subscribe(callback: (state: GameState) => void) {
    this.ws.onmessage = (event) => {
      callback(JSON.parse(event.data))
    }
  }
}
```

---

## 🏗️ Dashboard Hauptseite

**src/pages/Dashboard.tsx:**
```tsx
import { useEffect, useState } from 'react'
import { ResourceCard } from '../components/ResourceCard'
import { loadGameState } from '../services/gameStateService'

export function Dashboard() {
  const [gameState, setGameState] = useState(null)

  useEffect(() => {
    // Lade initial state
    loadGameState().then(setGameState)

    // Poll alle 5 Sekunden
    const interval = setInterval(() => {
      loadGameState().then(setGameState)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!gameState) return <div>Loading...</div>

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Toobix Idle Game Dashboard
        </h1>
        <p className="text-gray-400">
          Level {gameState.player.level} • {gameState.player.xp}/{gameState.player.xpToNextLevel} XP
        </p>
      </header>

      {/* Resources Grid */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <ResourceCard
            type="Code Energy"
            icon="⚡"
            amount={gameState.resources.current.codeEnergy}
            cap={gameState.resources.caps.codeEnergy}
            rate={gameState.resources.generationRates.codeEnergy || 0}
            color="wisdom"
          />
          {/* Mehr Resource Cards... */}
        </div>
      </section>

      {/* Stats */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Stats</h2>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(gameState.stats).map(([stat, value]) => (
            <div key={stat} className="bg-bg-surface p-4 rounded-lg">
              <div className="text-sm text-gray-400">{stat}</div>
              <div className="text-2xl font-bold">{value}/100</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
```

---

## 🔄 Live Reload Option (Backend Server)

**server.ts (Optional für real-time updates):**
```typescript
import express from 'express'
import { WebSocketServer } from 'ws'
import { watch } from 'fs'
import { readFileSync } from 'fs'

const app = express()
const wss = new WebSocketServer({ port: 3001 })

// Watch game state file
watch('../story-idle/data/story-idle-state.json', () => {
  const state = JSON.parse(readFileSync('../story-idle/data/story-idle-state.json', 'utf-8'))

  // Broadcast to all connected clients
  wss.clients.forEach(client => {
    client.send(JSON.stringify(state))
  })
})

// REST API
app.get('/api/state', (req, res) => {
  const state = readFileSync('../story-idle/data/story-idle-state.json', 'utf-8')
  res.json(JSON.parse(state))
})

app.listen(3000, () => console.log('API Server running on port 3000'))
```

---

## 🚀 Starten

```bash
# Frontend
npm run dev

# Backend (optional)
bun run server.ts

# Öffne http://localhost:5173
```

---

## ✨ Next Steps

1. **Basis-Dashboard** läuft mit Resource-Anzeige
2. **Character Portraits** hinzufügen
3. **Building Management** UI
4. **Charts** für Resource-History
5. **Mini-Games** einbetten
6. **Animations** mit Framer Motion

---

## 💡 Pro-Tips

- **Glassmorphism:** Nutze `backdrop-blur` für glasartige Effekte
- **Animations:** Framer Motion für smooth page transitions
- **Icons:** Lucide-react für schöne Icons
- **Charts:** Recharts für Visualisierungen
- **State:** Zustand für globale State Management

---

**Happy Building! 🎨✨**
