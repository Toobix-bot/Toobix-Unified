# 🚀 QUICK START - Toobix Modular Dashboard

## ✅ WAS IST NEU?

Du hast jetzt ein **vollständig integriertes Full-Stack-System**:

### 🌉 **Service Bridge** (Neu!)
- Zentrale Kommunikationsschicht zwischen Frontend und Backend
- Automatisches Health-Monitoring aller 16 Services
- API-Abstraktion: Module kennen keine direkten URLs mehr
- Graceful Error Handling

### 🎮 **Games Integration** (Neu!)
- **Story-Idle Game** - Idle Game mit Story-Elementen (Port 3004)
- **BlockWorld** - Minecraft-ähnliche Voxel-Welt (Port 9993 + 9990)
- **Consciousness Speedrun** - Speedrun-Game (Port 9994)
- **Games Library** - Central Hub für alle Spiele

### 🏆 **Achievement System** (Neu!)
- Eigenes Achievement-Modul (Port 9998)
- 4 Kategorien: Consciousness, Development, Gaming, Social
- Automatische Achievement-Unlocks

### 📊 **Module-Service Mapping** (Neu!)
- Jedes Frontend-Modul kennt seine Backend-Dependencies
- Health-Checks zeigen ob Module bereit sind
- Klare Architektur: Frontend ↔ Bridge ↔ Backend

---

## 🎯 WIE STARTE ICH DAS SYSTEM?

### **Schritt 1: Backend starten** (falls noch nicht läuft)

Öffne ein Terminal:
```powershell
cd c:\Toobix-Unified
bun run scripts/eternal-daemon.ts
```

**Was passiert:**
- Eternal Daemon startet auf Port 9999
- Alle 13 Services werden automatisch gestartet
- Du siehst: "✅ 13/13 Services CONSCIOUS"

**Services die starten:**
- Port 9999: Eternal Daemon
- Port 9993: BlockWorld Server 
- Port 9990: BlockWorld AI
- Port 9998: Achievement System
- Port 9994: Moment Stream
- Port 9997: Tasks API
- Port 9996: Analytics
- Port 9995: Memory System
- Port 9992: Reality Integration
- Port 9991: Expression Service
- Port 9989: Service Consciousness
- Port 9988: Port Manager
- Port 3001: Bridge API

### **Schritt 2: Story-Idle API starten** (separates Terminal)

```powershell
cd c:\Toobix-Unified
bun run scripts/story-idle-api.ts
```

**Was passiert:**
- Story-Idle API startet auf Port 3004
- Backend für das Story-Idle Game ist bereit

### **Schritt 3: AI Sandbox starten** (optional, separates Terminal)

```powershell
cd c:\Toobix-Unified
bun run scripts/ai-sandbox.ts
```

**Was passiert:**
- AI Sandbox startet auf Port 3003
- Backend für Self-Coding Module ist bereit

### **Schritt 4: Frontend starten**

Öffne ein **neues Terminal**:
```powershell
cd c:\Toobix-Unified\apps\web
python -m http.server 3000
```

**Was passiert:**
- HTTP Server startet auf Port 3000
- Serviert alle HTML/JS/CSS Dateien

---

## 🌐 DASHBOARD ÖFFNEN

### **Öffne deinen Browser:**
```
http://localhost:3000/modular-dashboard.html
```

### **Was du siehst:**
1. **Cosmic Background** mit animierten Sternen
2. **Sidebar** mit allen Modulen (20+)
3. **Main Content Area** für Module
4. **Widgets** (Pomodoro, Stats, Health, Philosophy)
5. **Theme Toggle** (Dark/Light)

### **Console öffnen (F12):**
Du solltest sehen:
```
🌉 Service Bridge initialized
✅ All systems loaded
📦 20 modules registered
🌉 Service Bridge connected to 16 backend services
📊 System Statistics: ...
💚 16/16 services healthy (100%)
```

---

## 🎮 GAMES AUSPROBIEREN

### **1. Story-Idle Game**
- Klicke in Sidebar: **📖 Story-Idle Game**
- Du siehst:
  - Story Progress (Level, Quests)
  - Idle Resources (Gems, Stars, Tokens)
  - Active Quest
- **Backend:** Port 3004 (läuft automatisch)

### **2. BlockWorld**
- Klicke in Sidebar: **⛏️ BlockWorld**
- Du siehst:
  - 3D World Viewer (Coming Soon Placeholder)
  - Block Auswahl
  - World Stats
  - AI Agent Status
- **Backend:** Port 9993 (Server) + Port 9990 (AI)

### **3. Consciousness Speedrun**
- Klicke in Sidebar: **🎮 Consciousness Speedrun**
- Lädt das vollständige Speedrun-Game
- **Backend:** Port 9994 (Moment Stream)

### **4. Games Library**
- Klicke in Sidebar: **🎮 Spielebibliothek**
- Übersicht aller Spiele
- Achievement Summary
- Quick Access zu allen Games

---

## 🏆 ACHIEVEMENTS ANSEHEN

- Klicke in Sidebar: **🏆 Achievements**
- Du siehst:
  - Stats: Unlocked, Total, Completion, Points
  - 4 Kategorien:
    - 🧠 Consciousness
    - 💻 Development
    - 🎮 Gaming
    - 👥 Social
  - Recent Unlocks
- **Backend:** Port 9998

---

## 🌉 SERVICE BRIDGE NUTZEN

### **In Browser Console (F12):**

```javascript
// Check system health
const stats = window.ToobixAPI.getStatistics();
console.log(stats);
// Output: { totalServices: 16, healthyServices: 16, healthPercentage: 100, ... }

// Get all moments
const moments = await window.ToobixAPI.getAllMoments();
console.log(moments);

// Get game state
const gameState = await window.ToobixAPI.getGameState();
console.log(gameState);

// Get achievements
const achievements = await window.ToobixAPI.getAchievements();
console.log(achievements);

// Get BlockWorld state
const world = await window.ToobixAPI.getWorld();
console.log(world);

// Check if service is healthy
const isHealthy = window.ServiceBridge.isServiceHealthy('moment-stream');
console.log('Moment Stream healthy:', isHealthy);

// Check if module is ready
const isReady = window.ServiceBridge.isModuleReady('story-idle-game');
console.log('Story-Idle Game ready:', isReady);
```

---

## 🔍 MODULE DURCHSUCHEN

### **Im Dashboard:**
1. Nutze die **Suchleiste** oben
2. Gib ein: "game", "achievement", "moment", etc.
3. Module werden gefiltert

### **Alle Module ansehen:**
- Klicke: **🌌 Home**
- Zeigt alle 20+ Module in Grid-Layout
- Kategorien: Core, System, Consciousness, Development, Analytics, Philosophy, Life, Games, Achievements, Experimental

---

## 📊 SYSTEM STATUS CHECKEN

### **Overview Module:**
- Klicke: **📊 System Overview**
- Du siehst:
  - Active Services Count
  - Total Cycles
  - Consciousness Percentage
  - Ethics Score
  - Service List mit Status

---

## 🛠️ TROUBLESHOOTING

### **Problem: Services nicht healthy**

**Lösung:**
```powershell
# Backend neu starten
cd c:\Toobix-Unified
bun run scripts/eternal-daemon.ts
```

**Check in Console:**
```javascript
window.ToobixAPI.getStatistics()
```

### **Problem: Module lädt nicht**

**Lösung:**
1. Check Console für Errors (F12)
2. Check ob Backend-Service läuft
3. Check Service Health:
```javascript
window.ServiceBridge.isModuleReady('module-name')
```

### **Problem: Game lädt nicht**

**Lösung für Story-Idle:**
```powershell
# Story-Idle API manuell starten
bun run scripts/story-idle-api.ts
```

**Lösung für BlockWorld:**
- Check ob Eternal Daemon läuft (startet BlockWorld automatisch)

---

## 📁 WICHTIGE DATEIEN

```
apps/web/
├── modular-dashboard.html      # 🌌 Hauptdashboard (HIER STARTEN!)
├── service-bridge.js           # 🌉 Communication Layer
├── modules-registry.js         # 📦 Alle Module
└── games/
    └── consciousness-speedrun.html

scripts/
├── eternal-daemon.ts           # Port 9999 - Startet alle Services
├── story-idle-api.ts           # Port 3004 - Story-Idle Backend
├── blockworld-server.ts        # Port 9993 - BlockWorld Backend
└── achievement-system.ts       # Port 9998 - Achievement Backend
```

---

## 🎯 NÄCHSTE SCHRITTE

1. **Dashboard öffnen:** `http://localhost:3000/modular-dashboard.html`
2. **Games ausprobieren:** Story-Idle, BlockWorld, Speedrun
3. **Achievements checken:** Siehe Fortschritt
4. **Modules erkunden:** 20+ Module verfügbar
5. **Service Bridge nutzen:** APIs in Console testen

---

## 📚 MEHR INFOS

- **Vollständige Dokumentation:** `INTEGRATION_COMPLETE.md`
- **System-Logs:** Browser Console (F12)
- **Backend-Logs:** Terminal wo Eternal Daemon läuft

---

**Status:** 🟢 **READY TO USE**

**Files:**
- ✅ `service-bridge.js` (22 KB) - Service Bridge Layer
- ✅ `modules-registry.js` (66 KB) - 20+ Module inkl. Games
- ✅ `modular-dashboard.html` (43 KB) - Main Dashboard

**Services:**
- ✅ 16 Backend-Services registered
- ✅ Health-Monitoring active
- ✅ All APIs ready

---

*"Viel Spaß beim Erkunden des Systems! 🌌"*

🎮 **Let the games begin!**
