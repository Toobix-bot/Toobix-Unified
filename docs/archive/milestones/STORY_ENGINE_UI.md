# 📖 Story Engine UI - Dokumentation

**Status:** ✅ Vollständig implementiert und funktionsfähig  
**Commit:** `6bc8c70` - Story Engine UI with interactive options  
**Datum:** 03.10.2025 09:15

---

## 🎯 Übersicht

Die Story Engine UI bietet eine visuelle Oberfläche für das Backend Story-System mit:

- **Story Status**: Epoch, Arc, Level, XP Tracking
- **Resources**: 7 Ressourcen (energie, wissen, inspiration, ruf, stabilität, erfahrung, level)
- **Story Options**: Interaktive Karten mit Hover-Effekten und Click-Handler
- **Phase Info**: Aktueller Story-Abschnitt mit Beschreibung
- **Dashboard Widget**: Schnellzugriff auf Story Engine vom Dashboard

---

## 🏗️ Architektur

### Komponenten

1. **renderStory()** - Haupt-Page Renderer
   - Fetcht Story State von Bridge MCP `/mcp` endpoint
   - Fetcht Story Stats von Bridge REST `/stats` endpoint
   - Zeigt alle Story-Informationen in Grid-Layout

2. **Story Status Card**
   - Epoch: Aktuelle Story-Epoche
   - Arc: Story-Bogen (z.B. "foundations")
   - Level: Story-Level (1-∞)
   - XP: Gesammelte Erfahrungspunkte

3. **Resources Card**
   - Zeigt 7 Ressourcen an:
     - energie (Energie)
     - wissen (Wissen)
     - inspiration (Inspiration)
     - ruf (Reputation)
     - stabilität (Stabilität)
     - erfahrung (Erfahrung)
     - level (Stufe)

4. **Story Options Grid**
   - Interaktive Karten für jede verfügbare Option
   - Hover-Effekt: -4px translateY
   - Click Handler: `chooseStoryOption(optionId)`
   - Zeigt erwartete Effekte als Badges

5. **Dashboard Widget**
   - Kleines Status-Card im Dashboard
   - Zeigt Arc, Level, XP
   - "Story Engine" Button → #/story

---

## 🔌 API Integration

### MCP Tools

**story_state** - Fetcht vollständigen Story-Zustand
```javascript
POST http://localhost:3337/mcp
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "story_state",
    "arguments": {}
  },
  "id": 1
}
```

Response:
```json
{
  "epoch": 0,
  "mood": "calm",
  "arc": "foundations",
  "resources": {
    "energie": 80,
    "wissen": 0,
    "inspiration": 0,
    "ruf": 0,
    "stabilitaet": 0,
    "erfahrung": 0,
    "level": 1
  },
  "options": [...],
  "companions": [],
  "buffs": [],
  "skills": []
}
```

**story_choose** - Wählt eine Story-Option aus
```javascript
POST http://localhost:3337/mcp
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "story_choose",
    "arguments": {
      "option_id": "opt_explore_1759474599754"
    }
  },
  "id": 2
}
```

**story_refresh** - Generiert neue Story-Optionen
```javascript
POST http://localhost:3337/mcp
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "story_refresh",
    "arguments": {
      "force": true
    }
  },
  "id": 3
}
```

### REST Endpoints

**GET /stats** - Kurz-Stats für Dashboard
```javascript
GET http://localhost:3337/stats

{
  "story": {
    "epoch": 0,
    "arc": "foundations",
    "level": 1,
    "xp": 0,
    "options": 1
  }
}
```

---

## 🎨 UI Features

### Responsive Grid
- 3-spaltig auf Desktop
- 1-spaltig auf Mobile
- Story Options: Full-width (span 3)

### Interaktive Optionen
```javascript
<div class="card" 
     style="cursor: pointer; transition: transform 0.2s"
     onmouseover="this.style.transform='translateY(-4px)'"
     onmouseout="this.style.transform='translateY(0)'"
     onclick="chooseStoryOption('opt_id')">
```

### Badges
- **Epoch**: Standard Badge
- **Arc**: Info Badge (blau)
- **Level**: Success Badge (grün)
- **XP**: Standard Badge

### Error Handling
- Offline State: Zeigt "Story Engine Offline" mit 📖 Icon
- Try/Catch für alle fetch() Aufrufe
- Console.error für Debugging

---

## 🔄 User Flow

1. **Dashboard → Story Widget**
   - User sieht Arc, Level, XP
   - Klickt "Story Engine" Button

2. **Story Page Load**
   - Fetcht /stats (schnell)
   - Fetcht /mcp story_state (detailliert)
   - Zeigt Status + Resources + Options

3. **Option wählen**
   - User klickt auf Option-Card
   - `chooseStoryOption(id)` wird aufgerufen
   - MCP story_choose Request
   - Alert zeigt Erfolgs-Message
   - Page reload zeigt neuen Zustand

4. **Neue Optionen generieren**
   - User klickt "Optionen generieren"
   - `refreshStoryOptions()` wird aufgerufen
   - MCP story_refresh Request
   - Alert zeigt "X neue Optionen generiert"
   - Page reload zeigt neue Optionen

---

## ✅ Testing Results

### Manual Tests (03.10.2025 09:10-09:15)

1. **story_state abrufen** ✅
   ```bash
   curl http://localhost:3337/mcp -Method POST ...
   # Response: epoch=0, arc="foundations", level=1
   ```

2. **story_refresh generieren** ✅
   ```bash
   curl http://localhost:3337/mcp -Method POST ...
   # Response: 1 neue Option generiert
   ```

3. **Optionen anzeigen** ✅
   - Option: "Neuen Gedankenpfad erkunden"
   - Expected: +5 inspiration, -5 energie, +3 erfahrung
   - Risk: 1

4. **UI Navigation** ✅
   - Dashboard → Story Widget → Story Page
   - Sidebar "Story" aktiv
   - Page Title: "Story"

---

## 📊 Statistiken

- **Dateien**: 2 (app.js, dashboard.html)
- **Neue Zeilen**: 241
- **Story Page**: 157 Zeilen
- **Helper Functions**: 55 Zeilen
- **Dashboard Widget**: 24 Zeilen
- **Router Integration**: 5 Zeilen

---

## 🚀 Nächste Schritte

### Story Events Timeline (Ausstehend)
- [ ] Fetch story_events (last 20)
- [ ] Vertical Timeline Component
- [ ] Event Type Icons
- [ ] Timestamp Formatting

### Enhancements
- [ ] Option Preview (Hover → Zeigt Details)
- [ ] Resource Change Animation (Bei story_choose)
- [ ] Story Arc Progress Bar
- [ ] Companions Display
- [ ] Buffs/Skills Integration

### Performance
- [ ] Cache story_state (5s)
- [ ] Optimistic UI Updates
- [ ] Loading Skeleton
- [ ] Error Retry Logic

---

## 🔗 Verwandte Dateien

- `apps/web/app.js` - Story Page + Helper Functions
- `apps/web/dashboard.html` - Sidebar Navigation + Dashboard Widget
- `apps/web/app.css` - Story Card Styles (bereits vorhanden)
- `packages/bridge/src/index.ts` - Story MCP Tools (Backend)

---

## 📝 Code Snippets

### Story Page Route Registration
```javascript
router.route('#/story', renderStory)
```

### Global Helper Functions
```javascript
window.chooseStoryOption = async function(optionId) { ... }
window.refreshStoryOptions = async function() { ... }
```

### Dashboard Widget
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">📖 Story</h3>
  </div>
  <div class="card-body">
    <!-- Arc, Level, XP -->
  </div>
  <div class="card-footer">
    <a href="#/story" class="btn btn-sm btn-primary">Story Engine</a>
  </div>
</div>
```

---

**Status:** ✅ Production Ready  
**Version:** v0.1.0  
**Author:** AI Assistant  
**Review:** Pending User Testing
