# Next Steps - Toobix Unified

Koordinierte Task-Liste für alle AIs (GitHub Copilot, ChatGPT, Claude).

**Last Updated:** 2025-10-02 23:45 (Copilot)

---

## 🔥 IMMEDIATE (Next 24h)

### 1. ⏳ USER: Demo zeigen
**Assignee:** User (nicht AI!)  
**Priority:** 🔴 HIGHEST  
**Status:** ⏸️ Waiting for user  
```bash
start C:\Toobix-Unified\apps\web\index.html
```
**Why:** Familie/Freunde heute Abend begeistern!

---

### 2. ~~Dependencies installieren~~
**Assignee:** ✅ Copilot (DONE!)  
**Priority:** 🔴 HIGH  
**Status:** ✅ Complete  
**Completed:** 2025-10-02 00:15

**Result:**
- Bun 1.2.23 installed
- 44 packages installed
- Playwright + Chromium ready
- All TypeScript types available

---

### 3. ~~Database erstellen~~
**Assignee:** ✅ Copilot (DONE!)  
**Priority:** 🔴 HIGH  
**Status:** ✅ Complete  
**Completed:** 2025-10-02 00:15

**Result:**
- Custom migration script created (bun:sqlite)
- Database created: data/toobix-unified.db
- 14 tables ready (people, interactions, moments, etc.)
- Migrations table tracking applied changes

---

## 🚀 Week 1 Tasks (Parallel Work Possible!)

### 4. 🤖 ChatGPT or Claude: Soul System Port
**Assignee:** 🟢 AVAILABLE - Pick it!  
**Priority:** 🟡 MEDIUM  
**Status:** ⏸️ Not started  
**Estimated Time:** 2-3 hours  
**Branch:** `ai/chatgpt/soul-system` or `ai/claude/soul-system`

**Task:**
1. Copy files from `C:\GPT\Version_8\src\soul\*` → `packages\core\src\soul\`
2. Adapt for Drizzle ORM (replace in-memory with SQLite)
3. Update imports
4. Write tests (`*.test.ts`)

**Files to port:**
- Soul state management
- Mood tracking
- Energy levels
- Focus state
- Values system

**Integration:**
- Use `soulState` table from schema
- Use `audits` table for decisions
- Connect to People module (mood affects interactions)

**Blocker:** Step 3 (database)  
**Blocked By:** None (can work in parallel with others)

---

### 5. 🤖 ChatGPT or Claude: Memory/KB Port
**Assignee:** 🟢 AVAILABLE  
**Priority:** 🟡 MEDIUM  
**Status:** ⏸️ Not started  
**Estimated Time:** 2-3 hours  
**Branch:** `ai/chatgpt/memory-kb` or `ai/claude/memory-kb`

**Task:**
1. Copy files from `C:\GPT\Version_8\src\memory\*` → `packages\core\src\memory\`
2. Adapt for Drizzle (chunks, tags, chunkTags tables)
3. Implement vector embeddings with Ollama
4. Write tests

**Files to port:**
- Chunk management
- Tag system
- Search & retrieval
- Context building

**Integration:**
- Use `chunks`, `tags`, `chunkTags` tables
- Connect to People (memories of interactions)
- Connect to Story (knowledge base for arcs)

**Blocker:** Step 3 (database)  
**Can run parallel with:** Step 4 (Soul System)

---

### 6. 🤖 Copilot: People Module UI Components
**Assignee:** GitHub Copilot (VS Code)  
**Priority:** 🟡 MEDIUM  
**Status:** ⏸️ Not started  
**Estimated Time:** 4-6 hours  
**Branch:** `ai/copilot/people-ui`

**Task:**
Build Web Components for People Module:

```
apps/web/components/
├── people-list.js          # List all people
├── people-card.js          # Person card component
├── people-detail.js        # Detailed person view
├── interaction-form.js     # Add new interaction
├── moment-create.js        # Create moment
├── circle-manager.js       # Manage circles
└── people-search.js        # Search & filter
```

**Design:**
- Based on demo HTML glassmorphism style
- Dark/Light theme support
- Responsive (mobile-first)
- Web Components (Custom Elements)
- Zero dependencies (no React/Vue)

**Blocker:** None (can work with mock data)  
**Can run parallel with:** All other tasks

---

### 7. 🤖 Claude: People Service Layer
**Assignee:** 🟢 AVAILABLE  
**Priority:** 🟡 MEDIUM  
**Status:** ⏸️ Not started  
**Estimated Time:** 3-4 hours  
**Branch:** `ai/claude/people-service`

**Task:**
Implement business logic for People Module:

```typescript
// packages/core/src/people/service.ts
class PeopleService {
  // CRUD
  create(data: NewPerson): Promise<Person>
  getById(id: string): Promise<Person | null>
  update(id: string, data: Partial<Person>): Promise<Person>
  delete(id: string): Promise<void>
  
  // Interactions
  addInteraction(data: NewInteraction): Promise<Interaction>
  getInteractions(personId: string): Promise<Interaction[]>
  
  // Moments
  createMoment(data: NewMoment): Promise<Moment>
  linkPeopleToMoment(momentId: string, personIds: string[]): Promise<void>
  
  // Circles
  createCircle(data: NewCircle): Promise<Circle>
  addToCircle(circleId: string, personId: string): Promise<void>
  
  // Analytics
  getLovePoints(personId: string): Promise<number>
  getInteractionStats(personId: string): Promise<Stats>
  getRecentActivity(personId: string, days: number): Promise<Interaction[]>
}
```

**Tests:**
```typescript
// packages/core/src/people/service.test.ts
describe('PeopleService', () => {
  it('should create a person')
  it('should add interaction')
  it('should calculate love points')
  it('should link person to story event')
})
```

**Blocker:** Step 3 (database)  
**Can run parallel with:** Steps 4, 5, 6

---

## 📋 Week 2 Tasks (Future)

### 8. Story Engine Port (V7 → core)
**Assignee:** TBD  
**Priority:** 🟢 LOW (next week)  
**Estimated Time:** 4-6 hours  

Port Story Engine from Version_7:
- Story Arcs
- Story Events
- Quest System
- XP/Level System
- Integration with People

**Source:** `C:\GPT\Version_7\src\story\*`

---

### 9. Love Engine Plugin
**Assignee:** TBD  
**Priority:** 🟢 LOW (next week)  
**Estimated Time:** 4-6 hours  

Create new plugin:
- Gratitude journal
- Acts of Kindness tracker
- Love Points calculation
- Sentiment analysis
- Integration with People.interactions

**Location:** `plugins\love-engine\`

---

## 🎯 Task Assignment Protocol

### How to claim a task:
1. **Read AI_CONTEXT.md** - Check what others are doing
2. **Pick available task** - Look for 🟢 AVAILABLE
3. **Update AI_CONTEXT.md** - Set your status to 🔄 Working
4. **Create branch** - `git checkout -b ai/{your-name}/{feature}`
5. **Update this file** - Change status to "🔄 In Progress - {AI Name}"
6. **Start work!**

### Example:
```markdown
### 4. 🤖 Claude: Soul System Port
**Assignee:** 🔄 Claude (working since 23:50)
**Priority:** 🟡 MEDIUM
**Status:** 🔄 In Progress - Claude
**Branch:** ai/claude/soul-system
**ETA:** 2h (done by ~02:00)
```

---

## 🚨 Blockers & Dependencies

### Current Blockers:
- ⚠️ **Steps 4, 5, 7:** Need database (Step 3)
- ⚠️ **Step 3:** Needs dependencies (Step 2)
- ⏸️ **Step 2:** Waiting for any AI to start

### Dependency Chain:
```
Step 2 (bun install)
  ↓
Step 3 (db:generate, db:migrate)
  ↓
Steps 4, 5, 7 (Soul, Memory, People Service)
  ↓
Week 2 tasks (Story, Love)

Step 6 (People UI) → Independent (can start anytime)
```

---

## 📊 Progress Tracking

**Week 1 Goals:**
- [x] Foundation setup (Copilot ✅)
- [ ] Dependencies installed
- [ ] Database created
- [ ] Soul System ported
- [ ] Memory ported
- [ ] People service implemented
- [ ] People UI components
- [ ] Tests written

**Completion:** 1/8 (12.5%) ⏳

---

## 💬 AI-to-AI Questions

### @Claude: 
_(No questions yet)_

### @ChatGPT:
_(No questions yet)_

### @Copilot:
_(No questions yet)_

**How to ask:**
```markdown
### @Claude: Can you handle Soul System?
I'm working on People UI (Step 6). Soul System (Step 4) is available.
If you start it, please update AI_CONTEXT.md and this file. Thanks!

-- Copilot (2025-10-02 23:55)
```

---

## 🎯 Today's Goal

**End of Day Target:** Steps 2, 3 complete ✅

**Tomorrow:** Start parallel work on Steps 4, 5, 6, 7

**End of Week:** All Week 1 tasks complete ✅

---

## 📝 Update This File!

**When to update:**
- ✅ When claiming a task
- ✅ When starting work
- ✅ When finishing work
- ✅ When blocked
- ✅ When asking questions

**Who updates:**
- 🤖 **ALL AIs** - This is shared coordination!

---

**🌌 Vom Ich zum Wir, vom Wir zum Ich.**

_Die Revolution ist, dass es keine Revolution braucht._
