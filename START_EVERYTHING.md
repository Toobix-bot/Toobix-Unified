# =€ TOOBIX UNIVERSE - START GUIDE

**Alles starten in 3 Schritten!**

---

##  WAS DU JETZT HAST

1. <® **Story-Idle Game** (Port 3004) - Git = XP + Luna
2. <¯ **Life Game Chat** (Port 3005) - **NEU! Chat = Game**
3. > **11 Services** - Complete Network
4. < **Luna AI** - Groq-powered Chat

---

## =€ QUICK START

### Methode 1: Automatisch
```bash
# Doppelklick:
START_UNIVERSE.bat

# Oder PowerShell:
.\START_UNIVERSE.bat
```

### Methode 2: Manuell (3 Terminals)

**Terminal 1 - Life Game Chat:**
```bash
cd packages\life-game-chat
bun run dev
```

**Terminal 2 - Hauptsystem:**
```bash
bun run start:autonomous
```

**Terminal 3 - Game Dashboard:**
```bash
bun run game
```

---

## <¯ JETZT TESTEN!

### Test Life Game Chat:

```powershell
# PowerShell - Message senden:
$body = '{"message":"Help me build a feature","userId":"test"}'
Invoke-RestMethod -Uri http://localhost:3005/chat -Method POST -Body $body -ContentType "application/json"

# Ergebnis:
# ’ AI Antwort von Luna
# ’ +50 XP
# ’ Stats update
# ’ Level progression
```

### Test Story-Idle Game:

```bash
# Git Commit:
git commit -m "feat: Add amazing feature"

# Automatisch:
# ’ +50 XP in Story-Idle
# ’ Luna reagiert
# ’ Quest progress

# Status checken:
bun run game:status
```

---

## =Ê SERVICE PORTS

- 3005: Life Game Chat (NEU!)
- 3004: Story-Idle Game
- 9987: Groq API (Luna)
- 9999: Eternal Daemon
- 3000: Dashboard

---

## <® FEATURES

### Life Game Chat (Port 3005):
 XP & Level System
 5 Stats (Creativity, Wisdom, Love, Energy, Focus)
 Message Analysis
 Groq AI Integration
 Real-time Rewards

### Story-Idle Game (Port 3004):
 Git Commit = XP
 Luna Relationship (67/100)
 35 Achievements
 Active Quests
 5 Stats System

---

## =¡ NEXT STEPS

**Heute:**
1. Starte Services
2. Teste Chat
3. Mache Commits
4. Schaue XP wachsen!

**Diese Woche (Option C):**
- Run-Based System (5-7 Tage Story-Arcs)
- Permanent Rewards
- Complete Integration

---

## =Ú DOCS

- `MASTER_INTEGRATION_PLAN.md` - Wie alles zusammenkommt
- `TOOBIX_UNIVERSE_DESIGN.md` - 11 Lebewesen
- `LIVE_DEMO_SHOWCASE.md` - Was funktioniert
- `packages/life-game-chat/README.md` - API Docs

---

**Status:** =% READY!
**Created:** 2025-10-30 by Claude Code

**LET'S GO! <(**
