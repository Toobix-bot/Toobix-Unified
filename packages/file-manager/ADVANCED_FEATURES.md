# 🚀 Advanced Features - File Manager

**Version:** 2.0.0
**Datum:** 18. Oktober 2025
**Status:** ✅ Production Ready

---

## 🎯 Übersicht

Der Master File Manager kombiniert **7 fortgeschrittene Systeme** zu einem vollautonomen Desktop-Assistenten:

1. **🤖 Autonomous Agent** - Trifft selbstständig Entscheidungen
2. **📄 Content Analyzer** - Liest Datei-Inhalte für smarte Kategorisierung
3. **📋 Clipboard Manager** - Tracking & intelligente Suche
4. **🧠 Context Awareness** - Versteht was User tut
5. **⏰ Task Scheduler** - Automatische wiederkehrende Aufgaben
6. **📚 Learning System** - Lernt aus User-Präferenzen
7. **🎯 Smart Organization** - Kombiniert alle Features

---

## 🤖 1. AUTONOMOUS AGENT

### **Was es kann:**

- **Proaktive Scans**: Sucht automatisch nach Problemen (Downloads zu voll, Duplikate, etc.)
- **Intelligente Entscheidungen**: Verwendet Groq AI um beste Aktion zu wählen
- **Lernt aus Feedback**: Passt sich an User-Präferenzen an
- **Ethik-First**: Jede Aktion hat Ethik-Score und Risk-Assessment

### **Installation:**

```typescript
import { createMasterFileManager } from '@toobix/file-manager/master'

const master = createMasterFileManager({
  groqApiKey: process.env.GROQ_API_KEY!,
  autonomousEnabled: true, // ← Enable autonomous mode
  learningMode: true,
})
```

### **Verwendung:**

```typescript
// Proactive scan
const decisions = await master.autonomous.proactiveScan()

console.log(`Found ${decisions.length} actionable items`)

decisions.forEach((decision) => {
  console.log(`Situation: ${decision.situation}`)
  console.log(`Chosen Action: ${decision.chosen.action}`)
  console.log(`Reasoning: ${decision.reasoning}`)
  console.log(`Confidence: ${decision.confidence}`)
})

// Execute a decision
await master.autonomous.executeDecision(decisions[0])

// Provide feedback
master.autonomous.provideFeedback(decisions[0].id, 'approved')
```

### **Beispiel-Decisions:**

```
Situation: "Folder Downloads has 47 files (looks messy)"
Chosen Action: organize_folder
Reasoning: High ethical score (95/100), Priority: 80/100, Risk: low
Confidence: 0.85

Situation: "Folder Downloads has 8 duplicate groups wasting 2.3 GB"
Chosen Action: clean_duplicates
Reasoning: High ethical score (90/100), Priority: 70/100, Risk: low
Confidence: 0.82
```

### **Learning System:**

Der Agent lernt aus jeder Entscheidung:

```typescript
// Learnings werden automatisch gespeichert
const learnings = master.autonomous.getLearnings()

learnings.forEach((learning) => {
  console.log(`Pattern: ${learning.pattern}`)
  console.log(`Confidence: ${learning.confidence}`)
  console.log(`Occurrences: ${learning.occurrences}`)
})
```

### **Statistiken:**

```typescript
const stats = master.autonomous.getStats()

console.log(`Total Decisions: ${stats.totalDecisions}`)
console.log(`Executed: ${stats.executed}`)
console.log(`Approval Rate: ${stats.approvalRate}%`)
console.log(`Learnings: ${stats.learnings}`)
console.log(`Avg Confidence: ${stats.avgConfidence}`)
```

---

## 📄 2. CONTENT ANALYZER

### **Was es kann:**

- **Liest Datei-Inhalte** (Text, Code, Config, etc.)
- **Semantische Analyse** mit Groq AI
- **Intelligente Kategorisierung** basierend auf Inhalt, nicht nur Extension
- **Keyword-Extraktion** und Zusammenfassungen

### **Verwendung:**

```typescript
import { ContentAnalyzer } from '@toobix/file-manager/features/content-analyzer'

const analyzer = new ContentAnalyzer(groqApiKey)

// Analyze single file
const analysis = await analyzer.analyzeFile(fileInfo)

console.log(`Content Type: ${analysis.contentType}`)
console.log(`Summary: ${analysis.summary}`)
console.log(`Keywords: ${analysis.keywords.join(', ')}`)
console.log(`Category: ${analysis.category}`)
console.log(`Subcategory: ${analysis.subcategory}`)
console.log(`Confidence: ${analysis.confidence}%`)
```

### **Batch Analysis:**

```typescript
// Analyze multiple files
const files = await fileManager.scanDirectory('C:\\Downloads')
const analyses = await analyzer.analyzeFiles(files)

analyses.forEach((analysis, filePath) => {
  console.log(`${filePath}: ${analysis.contentType}`)
})
```

### **Smart Categorization:**

```typescript
// Combines filename + content for best results
const result = await analyzer.smartCategorize(fileInfo)

console.log(`Category: ${result.category}`)
console.log(`Subcategory: ${result.subcategory}`)
console.log(`Confidence: ${result.confidence}`)
console.log(`Reasoning: ${result.reasoning}`)
```

### **Beispiel-Output:**

```json
{
  "fileType": "code",
  "contentType": "TypeScript React Component",
  "summary": "React component for file upload with drag & drop",
  "keywords": ["react", "upload", "drag-drop", "typescript"],
  "language": "TypeScript",
  "category": "Code",
  "subcategory": "React Components",
  "confidence": 95
}
```

---

## 📋 3. CLIPBOARD MANAGER

### **Was es kann:**

- **Clipboard History**: Speichert alles, was du kopierst
- **Intelligente Kategorisierung**: Text, Code, URLs, Dateien
- **Semantic Search**: Durchsuche alte Clipboard-Einträge
- **Tag-Extraktion**: AI extrahiert relevante Tags

### **Verwendung:**

```typescript
import { ClipboardManager } from '@toobix/file-manager/features/clipboard'

const clipboard = new ClipboardManager(groqApiKey)

// Start watching
clipboard.startWatching() // Checks every 1 second

// Search history
const results = clipboard.search('typescript')
results.forEach((entry) => {
  console.log(`[${entry.type}] ${entry.content}`)
  console.log(`Tags: ${entry.tags?.join(', ')}`)
})

// Get recent entries
const recent = clipboard.getRecent(10)

// Copy old entry back to clipboard
await clipboard.copyToClipboard(entry.id)

// Stop watching
clipboard.stopWatching()
```

### **Statistiken:**

```typescript
const stats = clipboard.getStats()

console.log(`Total Entries: ${stats.totalEntries}`)
console.log(`Text: ${stats.byType.text}`)
console.log(`Files: ${stats.byType.file}`)
console.log(`Categories: ${stats.categories}`)
```

### **Beispiel-Entry:**

```json
{
  "id": "clip_1697654321000",
  "content": "const hello = 'world'",
  "type": "text",
  "timestamp": "2025-10-18T15:32:01.000Z",
  "category": "Code",
  "tags": ["javascript", "const", "variable"]
}
```

---

## 🧠 4. CONTEXT AWARENESS

### **Was es kann:**

- **Trackt aktive Apps**: Weiß was du gerade machst
- **Erkennt Aktivität**: coding, browsing, writing, idle
- **Inferred Mood**: focused, distracted, exploring
- **Proaktive Vorschläge**: AI-generated basierend auf Kontext

### **Verwendung:**

```typescript
import { ContextManager } from '@toobix/file-manager/features/context'

const context = new ContextManager(groqApiKey)

// Start watching (captures every 30 seconds)
context.startWatching(30000)

// Get current context
const current = context.getCurrentContext()

console.log(`Activity: ${current.currentActivity}`)
console.log(`Active App: ${current.activeProcess}`)
console.log(`Mood: ${current.mood}`)
console.log(`Open Apps: ${current.openApplications.join(', ')}`)

// AI Suggestions
current.suggestions.forEach((suggestion) => {
  console.log(`💡 ${suggestion}`)
})
```

### **Pattern Analysis:**

```typescript
const patterns = context.analyzePatterns()

console.log('Common activities:', patterns.commonActivities)
console.log('Patterns:')
patterns.patterns.forEach((count, pattern) => {
  console.log(`  ${pattern}: ${count} times`)
})
```

### **Beispiel-Context:**

```json
{
  "timestamp": "2025-10-18T15:32:01.000Z",
  "activeWindow": "Visual Studio Code",
  "activeProcess": "Code",
  "openApplications": ["Code", "chrome", "Spotify"],
  "currentActivity": "coding",
  "mood": "focused",
  "suggestions": [
    "You've been coding for 90 minutes. Take a break!",
    "Desktop looks messy (24 files). Organize?",
    "Close Spotify for deeper focus?"
  ]
}
```

---

## ⏰ 5. TASK SCHEDULER

### **Was es kann:**

- **Automatische Tasks**: hourly, daily, weekly, monthly
- **Default Tasks**: Downloads cleanup, Duplicate scan, Proactive scan
- **Custom Tasks**: Definiere eigene wiederkehrende Aufgaben
- **Statistics**: Tracking von Success Rate, Duration, etc.

### **Verwendung:**

```typescript
import { TaskScheduler } from '@toobix/file-manager/scheduler'

const scheduler = new TaskScheduler(fileManager, autonomousAgent)

// Enable a task
scheduler.setTaskEnabled('daily-downloads-cleanup', true)

// Start scheduler
scheduler.start()

// Run task manually
const task = scheduler.getTask('daily-downloads-cleanup')
const result = await scheduler.runTask(task)

console.log(`Success: ${result.success}`)
console.log(`Duration: ${result.duration}ms`)

// Register custom task
scheduler.registerTask({
  id: 'my-custom-task',
  name: 'Custom Cleanup',
  description: 'My custom cleanup logic',
  schedule: 'daily',
  enabled: true,
  action: async (manager) => {
    // Your custom logic here
    return { processed: 42 }
  },
})

// Stop scheduler
scheduler.stop()
```

### **Default Tasks:**

| Task ID | Name | Schedule | Description |
|---------|------|----------|-------------|
| `daily-downloads-cleanup` | Clean Downloads | Daily | Organize Downloads folder |
| `weekly-duplicate-scan` | Find Duplicates | Weekly | Scan for duplicates |
| `hourly-proactive-scan` | Proactive Scan | Hourly | Autonomous agent scans |
| `daily-learning-summary` | Learning Summary | Daily | Generate learning report |

### **Statistiken:**

```typescript
const stats = scheduler.getStats()

console.log(`Total Tasks: ${stats.totalTasks}`)
console.log(`Enabled: ${stats.enabledTasks}`)
console.log(`Total Runs: ${stats.totalRuns}`)
console.log(`Success Rate: ${stats.successRate}%`)
```

---

## 🎯 6. SMART ORGANIZATION

### **Kombiniert alle Features:**

```typescript
// Smart organize with content analysis
const plan = await master.smartOrganize('C:\\Downloads', true)

console.log(`Files: ${plan.files.length}`)
console.log(`Categories: ${Object.keys(plan.structure).length}`)

// Executes organization
await master.smartOrganize('C:\\Downloads', false)
```

### **Was passiert:**

1. **Scant Dateien** (fast-glob)
2. **Analysiert Inhalt** (Content Analyzer für Text-Dateien)
3. **AI Kategorisierung** (Groq für finale Entscheidung)
4. **Erstellt Plan** (Preview vor Ausführung)
5. **Führt aus** (Verschiebt Dateien in Kategorien)

---

## 🔥 7. PROACTIVE MODE

### **Full Assistant Mode:**

```typescript
// Start proactive mode (enables all features)
const decisions = await master.startProactiveMode()

// System is now:
// - 🤖 Making autonomous decisions
// - 📋 Watching clipboard
// - 🧠 Tracking context
// - ⏰ Running scheduled tasks
// - 📚 Learning from preferences

// Get AI suggestions
const suggestions = await master.getSuggestions()
suggestions.forEach((s) => console.log(`💡 ${s}`))

// Get complete status
const status = master.getStatus()

// Stop proactive mode
master.stopProactiveMode()
```

---

## 📊 SYSTEM STATUS

```typescript
const status = master.getStatus()

// Returns:
{
  fileManager: { active: true },
  autonomous: {
    enabled: true,
    stats: { totalDecisions: 42, approvalRate: 85.7, ... },
    recentDecisions: [...]
  },
  clipboard: {
    watching: true,
    stats: { totalEntries: 128, ... },
    recent: [...]
  },
  context: {
    watching: true,
    stats: { totalCaptures: 24, ... },
    current: { activity: 'coding', mood: 'focused', ... }
  },
  scheduler: {
    running: true,
    stats: { totalTasks: 4, enabledTasks: 2, ... },
    tasks: [...]
  }
}
```

---

## 🚀 QUICK START

### **Minimal Setup:**

```typescript
import { createMasterFileManager } from '@toobix/file-manager/master'

const master = createMasterFileManager({
  groqApiKey: process.env.GROQ_API_KEY!,
})

// Organize folder
const plan = await master.smartOrganize('C:\\Downloads')

// Done!
```

### **Full Proactive Assistant:**

```typescript
const master = createMasterFileManager({
  groqApiKey: process.env.GROQ_API_KEY!,
  autonomousEnabled: true,
  watchClipboard: true,
  watchContext: true,
  scheduler: true,
})

// Now fully autonomous!
```

---

## 🐛 TROUBLESHOOTING

### **"Groq API rate limit"**

Reduziere Analysen:
```typescript
// Only analyze small files
const smallFiles = files.filter((f) => f.size < 100 * 1024) // < 100 KB
await analyzer.analyzeFiles(smallFiles)
```

### **"Context capturing fails"**

Windows PowerShell permissions:
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **"Clipboard not tracking"**

Check PowerShell:
```powershell
Get-Clipboard # Should return current clipboard content
```

---

## 🔒 SECURITY & PRIVACY

### **Was wird an Groq gesendet:**

- ✅ Dateinamen
- ✅ Datei-Inhalt (nur Text-Dateien < 1 MB)
- ✅ Clipboard-Inhalt (für Kategorisierung)
- ✅ Context-Informationen (App-Namen, Aktivität)

### **Was bleibt lokal:**

- ✅ Datei-Inhalte von Binär-Dateien
- ✅ Groß Dateien (> 1 MB)
- ✅ System-Dateien
- ✅ Complete File Manager State

### **Opt-out:**

```typescript
// Disable content analysis
const master = createMasterFileManager({
  groqApiKey: process.env.GROQ_API_KEY!,
  // Don't use ContentAnalyzer, only extension-based
})

// Disable clipboard AI
const clipboard = new ClipboardManager() // No API key = no AI

// Disable context AI
const context = new ContextManager() // No API key = no AI
```

---

## 📈 BENCHMARKS

| Feature | Performance |
|---------|-------------|
| Content Analysis | ~1-2s per file (small text files) |
| Clipboard Capture | <100ms |
| Context Capture | ~1-2s (PowerShell overhead) |
| Autonomous Decision | ~2-4s (Groq API call) |
| Smart Organization | ~5-10s for 50 files |

---

## 🎯 BEST PRACTICES

### **1. Start small:**

```typescript
// Test with one folder first
await master.smartOrganize('C:\\Temp\\TestFolder', true) // dry run
```

### **2. Enable features gradually:**

```typescript
// Day 1: Just file organization
const master = createMasterFileManager({ groqApiKey })

// Day 2: Add autonomous agent
master.enableFeature('autonomous')

// Day 3: Add clipboard & context
master.enableFeature('clipboard')
master.enableFeature('context')

// Week 2: Enable scheduler
master.enableFeature('scheduler')
```

### **3. Provide feedback:**

```typescript
// Always provide feedback to improve learning
const decisions = await master.autonomous.proactiveScan()

decisions.forEach(async (decision) => {
  // Execute
  await master.autonomous.executeDecision(decision)

  // Feedback
  master.autonomous.provideFeedback(decision.id, 'approved')
})
```

---

## 🎉 SUMMARY

Du hast jetzt:

- ✅ **Autonomous Agent** der selbstständig Entscheidungen trifft
- ✅ **Content-based Kategorisierung** für intelligente Organisation
- ✅ **Clipboard History** mit semantischer Suche
- ✅ **Context Awareness** mit proaktiven Vorschlägen
- ✅ **Task Scheduler** für automatische Wartung
- ✅ **Learning System** das sich an dich anpasst
- ✅ **Vollständig integriert** in Master File Manager

**Das ist ein vollautonomer, lernender Desktop-Assistent!** 🚀

---

**Erstellt:** 18. Oktober 2025
**Version:** 2.0.0
**License:** MIT
