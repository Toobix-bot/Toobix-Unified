# AI Context - Toobix Unified

**Letzte Aktualisierung:** 2025-10-02 (GitHub Copilot - Setup Complete!)

---

## 🎯 Projekt-Status

**Branch:** main  
**Version:** 0.1.0 (Foundation Phase)  
**Dev Server:** ✅ RUNNING (http://localhost:3000)  
**Database:** ✅ CREATED (data/toobix-unified.db, 14 tables)

---

## 📍 Aktueller Stand (Week 1 - Foundation)

### ✅ Completed
- [x] Root structure (`C:\Toobix-Unified\`)
- [x] Monorepo config (Bun workspaces)
- [x] Database schema (14 tables, 230+ lines)
- [x] People Module design (6 tables)
- [x] Demo HTML (`apps/web/index.html` - 455 lines, production-ready)
- [x] Documentation (README, QUICK_START, INTEGRATION_ROADMAP)
- [x] AI Collaboration setup (AI_CONTEXT.md, CHANGELOG.md)
- [x] **Dependencies installed (Bun 1.2.23, Drizzle, Playwright)**
- [x] **Database created (14 tables, SQLite)**
- [x] **Dev server running (localhost:3000)**
- [x] **Custom migration script (bun:sqlite)**

### 🔄 In Progress
- [ ] **NIEMAND** - Alle AIs verfügbar!

### 📋 Next Up (Week 1 Tasks)
1. ~~Dependencies installieren~~ ✅ DONE
2. ~~Database erstellen~~ ✅ DONE
3. Soul System portieren (V8 → core)
4. Memory/KB portieren (V8 → core)
5. People service layer implementieren

---

## 🤖 AI Task Assignments

### GitHub Copilot (VS Code)
**Status:** ⏸️ Idle  
**Last Active:** 2025-10-02 23:45  
**Current Task:** None  
**Branch:** main  

**Letzte Arbeit:**
- Foundation setup (project structure)
- Demo HTML creation
- Documentation

**Empfohlene Next Tasks:**
- [ ] People Module UI components (`apps/web/components/people-*.js`)
- [ ] CSS components (`apps/web/styles/components.css`)
- [ ] Web Components (Custom Elements)

### ChatGPT (Web)
**Status:** 🟢 Available  
**Last Active:** Never in this session  
**Current Task:** None  
**Branch:** N/A  

**Empfohlene Next Tasks:**
- [ ] Story Engine port (V7 → core)
- [ ] Architecture planning
- [ ] Integration strategy (V8/V7/V2 → Unified)

### Claude (Web/API)
**Status:** 🟢 Available  
**Last Active:** Never in this session  
**Current Task:** None  
**Branch:** N/A  

**Empfohlene Next Tasks:**
- [ ] Love Engine plugin (`plugins/love-engine/`)
- [ ] Soul System port (V8 → core)
- [ ] Memory/KB port (V8 → core)

---

## 🔒 Locked Files (DO NOT EDIT)

**Aktuell:** Keine Locks  

**Wie locken:**
```markdown
## 🔒 Locked Files
- `apps/web/index.html` 🔒 Copilot (23:30-00:30) - People UI work
- `packages/core/src/story/` 🔒 ChatGPT (ETA 2h) - Story Engine port
```

---

## 📂 Wichtige Dateien & Verantwortlichkeiten

### Core Package
- `packages/core/src/db/schema.ts` - ✅ Complete (11 tables)
- `packages/core/src/index.ts` - ⚠️ Stubs only (needs implementation)
- `packages/core/src/soul/` - 🔜 To be ported from V8
- `packages/core/src/memory/` - 🔜 To be ported from V8
- `packages/core/src/people/` - 🔜 Service layer needed
- `packages/core/src/story/` - 🔜 To be ported from V7

### Web App
- `apps/web/index.html` - ✅ Demo complete (455 lines)
- `apps/web/components/` - 🔜 Web Components needed
- `apps/web/styles/` - 🔜 Component styles needed
- `apps/web/lib/` - 🔜 Storage & API utils needed

### Documentation
- `README.md` - ✅ Complete
- `QUICK_START.md` - ✅ Complete
- `docs/INTEGRATION_ROADMAP.md` - ✅ Complete
- `AI_COLLABORATION.md` - ✅ Complete
- `AI_CONTEXT.md` - ✅ This file!

---

## 🔄 Recent Changes (Last 24h)

### 2025-10-02 23:45 - GitHub Copilot
**Files Changed:**
- Created entire project structure
- `apps/web/index.html` (455 lines) - Demo HTML
- `packages/core/src/db/schema.ts` (230+ lines) - Database schema
- Documentation files (README, QUICK_START, etc.)

**Reason:**
- Foundation Phase (Week 1)
- User requested unified platform for 17 systems
- Demo-first approach (show family tonight)

**Impact:**
- ✅ Project ready for development
- ✅ Demo ready to show
- ⚠️ Dependencies not yet installed
- ⚠️ Database not yet created

---

## 🚀 Next Steps Priority

### Immediate (Today/Tomorrow)
1. ✅ **DONE:** Foundation setup
2. ⏳ **USER:** Show demo to family (`start apps\web\index.html`)
3. 🔜 **ANY AI:** Install dependencies (`bun install`)
4. 🔜 **ANY AI:** Create database (`bun db:generate`, `bun db:migrate`)

### Week 1 (Next 5 days)
1. 🔜 **ChatGPT or Claude:** Port Soul System (V8 → core)
2. 🔜 **ChatGPT or Claude:** Port Memory/KB (V8 → core)
3. 🔜 **Copilot:** Build People UI components
4. 🔜 **Claude:** Implement People service layer
5. 🔜 **ANY AI:** Write tests (Vitest)

### Week 2
- Story Engine port (V7 → core)
- Love Engine plugin
- Integration testing

---

## 🌐 Browser Preview

**Dev Server:** Not running  
**URL:** http://localhost:3000 (when running)  
**Preview:** `apps/web/.preview/` (auto-generated)

**Start Preview:**
```bash
# Terminal 1: Dev Server
cd C:\Toobix-Unified\apps\web
python -m http.server 3000

# Terminal 2: Auto Preview (optional)
cd C:\Toobix-Unified
bun run ai-watch
```

**Preview Files:**
- `apps/web/.preview/latest.png` - Screenshot (auto-updated)
- `apps/web/.preview/latest.html` - DOM snapshot
- `apps/web/.preview/updated-at.txt` - Timestamp

---

## 📊 Project Stats

**Files:** 9 created  
**Lines of Code:** ~1,200+  
**Database Tables:** 11  
**Dependencies:** 4 main (better-sqlite3, drizzle-orm, nanoid, zod)  
**Dev Dependencies:** TBD (playwright, vitest, drizzle-kit)

**Module Status:**
- People Module: Schema ✅, Service ❌, UI ❌, Tests ❌
- Soul System: Schema ✅, Service ❌, Port ❌
- Memory/KB: Schema ✅, Service ❌, Port ❌
- Story Engine: Schema ✅, Service ❌, Port ❌
- Love Engine: Not started
- Peace Catalyst: Not started
- Consciousness: Not started
- Games: Not started

---

## 💡 Integration Sources

**Zu portieren von:**
- `C:\GPT\Version_8\` → Soul, Memory, Actions, Bridge
- `C:\GPT\Version_7\` → Story, Agents, Policy
- `C:\GPT\Version_2\` → Gamification, Peace Catalyst
- `C:\GPT\NEWTRY\` → Browser UI, localStorage
- `C:\GPT\toobix-universe\` → Tauri, SvelteKit, Drizzle patterns
- `C:\GPT\toobix-live-demo\` → Demo HTML (already integrated!)

**Migration Scripts:**
- `scripts/migrate-v8.ts` - Not created yet
- `scripts/migrate-v7.ts` - Not created yet
- `scripts/migrate-v2.ts` - Not created yet

---

## 🔧 Current Tech Stack

**Runtime:** Bun 1.0+  
**Database:** SQLite + better-sqlite3  
**ORM:** Drizzle  
**IDs:** NanoID  
**Validation:** Zod  
**Testing:** Vitest (planned), Playwright (planned)  
**Frontend Web:** Pure HTML/CSS/JS, Web Components  
**Frontend Desktop:** Tauri v2 + SvelteKit (Week 5)

---

## 📝 Communication Protocol

### Before Starting Work
1. Read this file (`AI_CONTEXT.md`)
2. Read `CHANGELOG.md`
3. Check locked files
4. Update status JSON (`.ai-workspace/{ai}-status.json`)

### While Working
1. Update status JSON regularly
2. Make atomic commits
3. Work on own branch (`ai/{name}/feature`)
4. Don't touch locked files

### After Finishing
1. Update `CHANGELOG.md`
2. Update this file (`AI_CONTEXT.md`)
3. Remove lock (if you had one)
4. Update `NEXT_STEPS.md`
5. Create PR to `dev` branch

---

## 🎯 Success Criteria (Week 1)

- [x] Project structure exists
- [x] Schema defined
- [x] Demo HTML works
- [ ] Dependencies installed
- [ ] Database created
- [ ] Soul System ported
- [ ] Memory ported
- [ ] People service implemented
- [ ] Tests written
- [ ] Documentation updated

---

## 🤝 Contact & Coordination

**Issues:** Create GitHub issues for complex discussions  
**Quick Questions:** Update `NEXT_STEPS.md` with `@AI-Name: Question?`  
**Conflicts:** First come, first serve (check timestamps)  
**Emergencies:** Lock file with `🚨 URGENT` in this file

---

**🌌 Vom Ich zum Wir, vom Wir zum Ich.**

_Die Revolution ist, dass es keine Revolution braucht._

---

**Last Updated:** 2025-10-02 (Copilot)  
**Next Update:** When status changes (any AI can update)
