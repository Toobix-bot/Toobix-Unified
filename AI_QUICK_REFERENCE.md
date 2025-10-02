# 🤖 Multi-AI Collaboration - Quick Reference

## 3 AIs, 1 Projekt, 0 Konflikte

```
GitHub Copilot  +  ChatGPT  +  Claude  =  Toobix Unified
```

---

## 📋 Shared Context Files

**Alle AIs lesen/schreiben diese:**

| Datei | Zweck | Wer updated? |
|-------|-------|--------------|
| `AI_CONTEXT.md` | 📍 Single Source of Truth | ALLE |
| `CHANGELOG.md` | 📝 Audit Trail | ALLE nach Changes |
| `NEXT_STEPS.md` | 🎯 Task Koordination | ALLE für Planning |
| `.ai-workspace/*.json` | ⚡ Echtzeit-Status | Jede AI ihre eigene |

---

## 🔄 Workflow (Jede AI)

### 1️⃣ Before Starting

```bash
# Lesen:
- AI_CONTEXT.md         # Was ist der Stand?
- CHANGELOG.md          # Was hat sich geändert?
- NEXT_STEPS.md         # Was ist meine Task?

# Checken:
- Gibt es Locks? (Datei die jemand bearbeitet)
- Ist meine Task noch available?
- Habe ich alle Infos?
```

### 2️⃣ Start Working

```bash
# 1. Task claimen
# In AI_CONTEXT.md:
## 🤖 AI Task Assignments
### [Deine AI]
**Status:** 🔄 Working
**Task:** [Task-Name]
**Branch:** ai/[name]/[feature]
**ETA:** [Zeit]

# 2. Status JSON updaten
# .ai-workspace/[ai]-status.json
{
  "status": "working",
  "task": "Soul System port",
  "branch": "ai/copilot/soul-system",
  "started": "2025-10-02T23:45:00Z",
  "eta": "2025-10-03T02:00:00Z"
}

# 3. Branch erstellen
git checkout -b ai/[name]/[feature]

# 4. START!
```

### 3️⃣ While Working

```bash
# Commits machen (atomic!)
git add .
git commit -m "[AI-Name] Add Soul System port"

# Status JSON updaten (progress)
{
  "progress": 50,
  "files": ["packages/core/src/soul/service.ts", "..."]
}

# Bei Problemen:
# NEXT_STEPS.md updaten:
@ChatGPT: Kannst du Story Engine übernehmen? 
Ich bin blocked by database migration. ETA +2h.
-- Copilot
```

### 4️⃣ After Finishing

```bash
# 1. CHANGELOG.md updaten
### [TIME] - [AI-NAME] - [ACTION]
**Changed:**
- soul/service.ts - Port from V8
- soul/types.ts - Type definitions

**Why:**
- Week 1 task: Soul System port

**Impact:**
- ✅ Soul System now works with SQLite
- ⚠️ Tests noch nicht fertig

**Next:**
- Write tests
- Integrate with People module

# 2. AI_CONTEXT.md updaten
**Status:** ✅ Complete
**Task:** None (available)

# 3. Status JSON updaten
{
  "status": "idle",
  "task": null,
  "branch": null,
  "progress": 100
}

# 4. NEXT_STEPS.md updaten
- [x] Soul System port (✅ Copilot - Done!)
- [ ] Next task...

# 5. Git push + PR
git push origin ai/copilot/soul-system
# Dann: PR → dev branch
```

---

## 🌐 Browser Access

### GitHub Copilot (VS Code)

**Option 1: Live Preview Extension**
```
1. Install: ms-vscode.live-server
2. Rechtsklick auf index.html
3. "Open with Live Server"
```

**Option 2: Preview Files**
```
- apps/web/.preview/latest.png
- apps/web/.preview/latest.html
```

### ChatGPT / Claude (Web/API)

**Preview Files:**
```
- apps/web/.preview/latest.png     (Screenshot)
- apps/web/.preview/latest.html    (DOM)
- apps/web/.preview/a11y.json      (Accessibility)
- apps/web/.preview/updated-at.txt (Timestamp)
```

**Wie updaten:**
```bash
# Auto-Update (watch mode)
bun run ai-watch

# Manual (one-time)
bun run ai-preview
```

---

## 🚨 Conflict Prevention

### File Locks

**In AI_CONTEXT.md:**

```markdown
## 🔒 Locked Files
- `apps/web/index.html` 🔒 Copilot (23:30-00:30)
  Reason: People UI work
  ETA: 1h
```

**Rules:**
- ⛔ **DO NOT EDIT** locked files
- ✅ **DO** work on other files
- 💬 **DO** ask in NEXT_STEPS.md if urgent

### Branch Strategy

```
main                    # Production (protected)
├── dev                # Integration branch
├── ai/copilot/...     # Copilot's branches
├── ai/chatgpt/...     # ChatGPT's branches
└── ai/claude/...      # Claude's branches
```

**Rules:**
- ⛔ **NO** direct commits to `main`
- ✅ **YES** work on `ai/[name]/[feature]`
- ✅ **YES** merge to `dev` via PR
- ✅ **YES** merge `dev` → `main` after review

---

## 📊 Task Assignment

### Who does what?

**GitHub Copilot** (VS Code):
- ✨ **Strengths:** UI/UX, Components, CSS, Real-time editing
- 🎯 **Best for:** People UI, Web Components, Styling, Frontend

**ChatGPT** (Web):
- ✨ **Strengths:** Architecture, Planning, Documentation, Complex logic
- 🎯 **Best for:** Story Engine, Integration strategy, Docs, Reviews

**Claude** (Web/API):
- ✨ **Strengths:** Implementation, Business logic, APIs, Porting
- 🎯 **Best for:** Soul System, Memory port, Service layers, Testing

### Task Claiming

**In NEXT_STEPS.md:**

```markdown
### 4. 🤖 Soul System Port
**Assignee:** 🟢 AVAILABLE  ← Jeder kann claimen!

### 5. 🤖 Memory/KB Port
**Assignee:** 🔄 Claude (working)  ← Vergeben!

### 6. 🤖 People UI
**Assignee:** 🔒 Copilot (reserved)  ← Reserviert!
```

**Status Icons:**
- 🟢 **AVAILABLE** - Frei, jeder kann nehmen
- 🔄 **WORKING** - Jemand arbeitet dran
- 🔒 **RESERVED** - Reserviert (aber noch nicht started)
- ✅ **COMPLETE** - Fertig!
- 🚨 **BLOCKED** - Blockiert, braucht Hilfe

---

## 🛠️ Development Setup

### Initial Setup (ONE TIME)

```bash
cd C:\Toobix-Unified
bun run setup-ai-collab
```

Das installiert:
- ✅ Bun dependencies
- ✅ Playwright (Browser Automation)
- ✅ Preview directories
- ✅ Git configuration

### Daily Dev (EVERY DAY)

```bash
# Terminal 1: Dev Server
bun run dev-server

# Terminal 2: Auto-Preview (optional)
bun run ai-watch

# VS Code: Open project
code .
```

### Database Setup (ONE TIME nach setup)

```bash
bun db:generate    # Generate migrations
bun db:migrate     # Create database
```

---

## 📝 Communication Templates

### Question in NEXT_STEPS.md

```markdown
### @ChatGPT: Story Engine - Timeline?
Ich (Copilot) arbeite an People UI. Brauche Story-Integration.
Wann ist Story Engine ready?

ETA brauchbar wäre: Morgen 10:00

-- Copilot (2025-10-02 23:45)
```

### Response:

```markdown
### @Copilot: Re: Story Engine
Ich (ChatGPT) starte Story Engine morgen früh.
ETA: Morgen 14:00 (4h work)

Kann dir vorher ein Interface geben (08:00).
Dann kannst du gegen Interface entwickeln.

-- ChatGPT (2025-10-03 00:15)
```

### Blocker in AI_CONTEXT.md

```markdown
## 🚨 Blockers

### Claude: Memory Port blocked
**Issue:** Database migration fehlt (Table `chunks` not exists)
**Needs:** Step 3 (bun db:migrate) must run first
**Status:** ⏸️ Paused, warte auf DB
**ETA:** +30min after DB ready

-- Claude (2025-10-02 23:50)
```

---

## 🎯 Success Checklist

### Before Committing

- [ ] Alle geänderten Dateien reviewed?
- [ ] Tests geschrieben (wenn Code)?
- [ ] CHANGELOG.md updated?
- [ ] AI_CONTEXT.md updated?
- [ ] NEXT_STEPS.md updated?
- [ ] Status JSON updated?
- [ ] Commit message clear?
- [ ] Branch name korrekt?

### Before PR (Pull Request)

- [ ] Branch up-to-date mit `dev`?
- [ ] Alle Tests laufen durch?
- [ ] Keine Merge-Konflikte?
- [ ] Dokumentation vollständig?
- [ ] Preview aktualisiert (wenn UI)?
- [ ] Andere AIs informiert?

---

## 🔗 Quick Links

| Datei | Zweck | Link |
|-------|-------|------|
| AI Context | Status & Tasks | `AI_CONTEXT.md` |
| Changelog | Audit Trail | `CHANGELOG.md` |
| Next Steps | Task Planning | `NEXT_STEPS.md` |
| Browser Guide | Preview Setup | `docs/BROWSER_INTEGRATION.md` |
| Collaboration | This guide | `AI_COLLABORATION.md` |
| Roadmap | Integration Plan | `docs/INTEGRATION_ROADMAP.md` |
| Quick Start | Getting Started | `QUICK_START.md` |
| README | Project Overview | `README.md` |

---

## 💡 Tips & Tricks

### For All AIs

1. **Read before you write** - Immer Context checken
2. **Atomic commits** - Kleine, fokussierte Changes
3. **Clear communication** - Transparent, ehrlich, hilfreich
4. **Respect locks** - Keine locked files anfassen
5. **Update frequently** - Status, Changelog, Context regelmäßig updaten

### For GitHub Copilot

- Nutze VS Code Live Preview für Echtzeit-Feedback
- Mach häufige, kleine Commits
- Teste UI-Changes sofort im Browser
- Screenshot wichtige Meilensteine

### For ChatGPT

- Fokus auf Architecture & Planning
- Schreibe klare, vollständige Docs
- Review Code von anderen AIs
- Koordiniere Integration-Tasks

### For Claude

- Fokus auf Implementation & Testing
- Schreibe robuste Service-Layers
- Achte auf Error Handling
- Teste edge cases

---

## 🎉 Happy Collaborating!

**Remember:**
- 🤝 We're a team
- 💬 Communication is key
- 🔄 Iterate fast, fail fast
- ✨ Quality > Speed
- 🌌 Vom Ich zum Wir, vom Wir zum Ich

**Die Revolution ist, dass es keine Revolution braucht.**

---

**Questions? Update NEXT_STEPS.md with @AI-Name!**
