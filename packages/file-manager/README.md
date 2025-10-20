# 🗂️ @toobix/file-manager

AI-powered file organization with Groq integration for Toobix-Unified.

## ✨ Features

- 🧠 **AI Categorization** - Uses Groq LLM (Llama 3.3 70B) to intelligently categorize files
- 📂 **Smart Organization** - Creates logical folder structures automatically
- 🔍 **Dry Run Mode** - Preview changes before executing
- 👀 **File Watching** - Monitor directories for new files
- ⚡ **Fast Scanning** - Uses fast-glob for efficient file discovery
- 🎯 **Fallback Logic** - Extension-based categorization if AI fails

## 📦 Installation

```bash
cd packages/file-manager
bun install
```

## 🚀 Quick Start

### 1. Set Groq API Key

```powershell
# Windows PowerShell
$env:GROQ_API_KEY="your-groq-api-key-here"
```

### 2. Run Demo (Dry Run)

```bash
# Preview organization (no files moved)
bun run src/demo.ts "C:\path\to\messy\folder"
```

### 3. Execute Organization

```bash
# Actually move files
bun run src/demo.ts "C:\path\to\messy\folder" --execute
```

## 💡 Usage in Code

```typescript
import { createFileManager } from '@toobix/file-manager'

const fileManager = createFileManager({
  groqApiKey: process.env.GROQ_API_KEY!,
  model: 'llama-3.3-70b-versatile', // optional
  autoOrganize: false, // optional
  watchMode: false, // optional
})

// Organize directory (dry run)
const plan = await fileManager.organizeDirectory('C:\\Downloads', true)

// Execute plan
await fileManager.executePlan('C:\\Downloads', plan, false)
```

## 🎯 API Reference

### `AIFileManager`

#### `scanDirectory(path, pattern?)`
Scans directory and returns file information.

```typescript
const files = await fileManager.scanDirectory('C:\\Downloads')
// Returns: FileInfo[]
```

#### `categorizeFiles(files)`
Uses Groq AI to categorize files intelligently.

```typescript
const categorized = await fileManager.categorizeFiles(files)
// Each file gets category, subcategory, confidence
```

#### `createOrganizationPlan(path, files)`
Creates an organization plan (preview).

```typescript
const plan = await fileManager.createOrganizationPlan('C:\\Downloads', files)
console.log(plan.structure) // { "Images": [...], "Documents": [...] }
```

#### `executePlan(basePath, plan, dryRun?)`
Executes organization plan (moves files).

```typescript
// Dry run (preview)
await fileManager.executePlan('C:\\Downloads', plan, true)

// Execute for real
await fileManager.executePlan('C:\\Downloads', plan, false)
```

#### `organizeDirectory(path, dryRun?)`
All-in-one: Scan, Categorize, Organize.

```typescript
const plan = await fileManager.organizeDirectory('C:\\Downloads', true)
```

#### `startWatching(path)` / `stopWatching()`
Watch directory for new files.

```typescript
fileManager.startWatching('C:\\Downloads')
// ... later
fileManager.stopWatching()
```

## 📊 Example Output

```
🚀 Starting organization process...
📂 Scanning directory: C:\Downloads
✅ Found 47 files
🧠 Categorizing 47 files with Groq...
✅ Categorization complete!
📋 Creating organization plan...

📊 Organization Plan (ID: x7k3f9s2)
Organized 47 files into 5 categories:
Documents: 12 files
Images: 18 files
Videos: 8 files
Code: 6 files
Archives: 3 files

Categories created:
  📁 Documents: 12 files
  📁 Images: 18 files
  📁 Videos: 8 files
  📁 Code: 6 files
  📁 Archives: 3 files

🔍 [DRY RUN] Executing organization plan...
   report.pdf → Documents/
   screenshot.png → Images/
   video.mp4 → Videos/
   script.js → Code/
   backup.zip → Archives/
   ...

🔍 This was a dry run. Use executePlan(path, plan, false) to actually move files.
```

## 🎨 Integration with Toobix

### Luna Voice Commands

```typescript
// In Luna Chat
luna.command('organize my downloads')
→ fileManager.organizeDirectory('C:\\Downloads', true)

luna.command('clean up desktop')
→ fileManager.organizeDirectory('C:\\Users\\...\\Desktop', false)
```

### Desktop App Integration

```typescript
// In Electron main.js
ipcMain.handle('organize-folder', async (event, path) => {
  const fileManager = createFileManager({ groqApiKey: process.env.GROQ_API_KEY! })
  return await fileManager.organizeDirectory(path, true)
})

// In React component
const organizeFo lder = async (path: string) => {
  const plan = await window.electron.invoke('organize-folder', path)
  setOrganizationPlan(plan)
}
```

## 🔧 Configuration

```typescript
interface FileManagerConfig {
  groqApiKey: string           // Required: Your Groq API key
  model?: string               // Optional: Default 'llama-3.3-70b-versatile'
  autoOrganize?: boolean       // Optional: Auto-organize new files
  watchMode?: boolean          // Optional: Enable file watching
}
```

## 🛡️ Safety Features

- ✅ **Dry Run First** - Always preview before moving files
- ✅ **Fallback Categorization** - Works even if Groq API fails
- ✅ **Ignore System Folders** - Skips node_modules, .git, etc.
- ✅ **Error Handling** - Continues on individual file errors
- ✅ **Undo Support** - Organization plans can be reversed (TODO)

## 📝 TODO

- [ ] Undo functionality (restore original structure)
- [ ] Content-based categorization (read file contents)
- [ ] Image analysis (using vision models)
- [ ] Custom category rules
- [ ] Duplicate detection
- [ ] Large file handling
- [ ] Network drive support
- [ ] Integration with Luna autonomous agent

## 🐛 Troubleshooting

### "GROQ_API_KEY not set"
```powershell
$env:GROQ_API_KEY="your-key-here"
```

### "Directory does not exist"
Make sure path is absolute and exists.

### Groq API fails
Falls back to extension-based categorization automatically.

## 📜 License

MIT - Part of Toobix-Unified

---

**Made with ❤️ and 🤖 by Toobix**

[Back to Toobix-Unified](../../README.md)
