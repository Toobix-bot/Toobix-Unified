# 🤝 Contributing to Toobix-Unified

**Thank you for considering contributing to Toobix!** 🎉

## 🌟 Before You Start - Read the Philosophy

**Toobix-Unified is not a typical open source project.**

It is a **philosophical exploration** and **lifelong work** by Michael Horn, created to provide **value for all people and life**, not to make money.

**Please read [VISION.md](./VISION.md) first** to understand:
- 💝 **Impact over Profit** - We build for meaning
- 🌐 **Open Sandbox Philosophy** - Fork it, make it yours
- 🎯 **Quality over Quantity** - Slow and good beats fast
- 💝 **80/10/10 Rule** - Transparent funding allocation
- 🚀 **Version Philosophy** - Never finished, always growing

**If these values resonate with you, welcome! Let's build something meaningful together.**

---

## 🚀 Quick Start for Contributors

```bash
# 1. Fork & clone
git clone https://github.com/YOUR_USERNAME/Toobix-Unified.git
cd Toobix-Unified

# 2. Install dependencies
bun install

# 3. Setup environment
cp .env.example .env
# Add your GROQ_API_KEY to .env

# 4. Run migrations
bun run migrate

# 5. Start development
bun run dev
```

---

## 📋 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch naming convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/changes
- `chore/` - Build/tooling updates

### 2. Make Changes

- Write clear, concise code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Type check
bun run check-types

# Run tests
bun test

# Build to ensure no errors
bun run build
```

### 4. Commit Your Changes

We use **Conventional Commits**:

```bash
git commit -m "feat: add new soul emotion tracking"
git commit -m "fix: resolve memory search crash"
git commit -m "docs: update README with new features"
```

**Commit types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style (formatting, no logic change)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Tooling/config changes

### 5. Push & Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then open a PR on GitHub with:
- Clear title and description
- Reference related issues (#123)
- Screenshots/GIFs for UI changes
- Test results

---

## 🏗️ Project Structure

```
Toobix-Unified/
├── apps/
│   └── web/              # Frontend (vanilla JS + HTML)
├── packages/
│   ├── bridge/           # MCP Server + API Gateway
│   ├── core/             # Database layer (Drizzle ORM)
│   ├── soul/             # Emotional/personality system
│   ├── people/           # Contacts & relationships
│   ├── story/            # Narrative engine
│   └── memory/           # RAG knowledge base
├── scripts/              # CLI tools & utilities
└── data/                 # SQLite database
```

---

## 🎨 Code Style

- **TypeScript** for all backend code
- **ESM** imports (`import` not `require`)
- **Async/await** over callbacks
- **Named exports** preferred
- **Descriptive variable names** (no single letters except loops)

**Example:**
```typescript
// ✅ Good
export async function searchMemories(query: string, limit: number = 5) {
  const results = await db.select().from(memories).where(...)
  return results
}

// ❌ Bad
export const sm = async (q, l = 5) => {
  const r = await db.select().from(m).where(...)
  return r
}
```

---

## 🧪 Testing

We use **Bun's built-in test runner**:

```typescript
// Example test
import { describe, it, expect } from 'bun:test'
import { SoulService } from './soul/service'

describe('SoulService', () => {
  it('should initialize with default emotions', () => {
    const soul = new SoulService()
    const state = soul.getState()
    expect(state.emotions.joy).toBeDefined()
  })
})
```

Run tests:
```bash
bun test                 # All tests
bun test --watch         # Watch mode
bun test soul.test.ts    # Specific file
```

---

## 📝 Documentation

- Update **README.md** for user-facing changes
- Update **AI_CONTEXT.md** for AI assistant integrations
- Add **JSDoc comments** for complex functions
- Create **ADRs** (Architecture Decision Records) for big changes

**Example JSDoc:**
```typescript
/**
 * Search memories using vector similarity
 * @param query - Search query text
 * @param limit - Max number of results (default: 5)
 * @returns Array of matching memory chunks with scores
 */
export async function searchMemories(query: string, limit: number = 5) {
  // ...
}
```

---

## 🐛 Reporting Bugs

Open an [issue](https://github.com/Toobix-bot/Toobix-Unified/issues/new) with:

1. **Clear title** - "Bug: Memory search crashes on empty query"
2. **Description** - What happened vs what should happen
3. **Steps to reproduce**
   ```
   1. Go to '...'
   2. Click on '...'
   3. See error
   ```
4. **Environment**
   - OS: Windows 11 / macOS 14 / Ubuntu 22.04
   - Bun version: 1.1.38
   - Node version (if applicable): 20.x
5. **Screenshots/Logs** - If relevant
6. **Possible fix** - If you have ideas

---

## 💡 Feature Requests

Open an [issue](https://github.com/Toobix-bot/Toobix-Unified/issues/new) with:

1. **Clear title** - "Feature: Export soul state as JSON"
2. **Problem** - What pain point does this solve?
3. **Proposed solution** - How would it work?
4. **Alternatives** - Other ways to solve this?
5. **Additional context** - Screenshots, examples, etc.

---

## 🔒 Security

Found a security vulnerability? **Do NOT open a public issue.**

Email: security@toobix.dev (or create a private security advisory on GitHub)

---

## 📦 Package-Specific Guidelines

### `packages/bridge/`
- All MCP tools must follow JSON-RPC 2.0 spec
- Add tool registration in `src/index.ts`
- Update tool count in health check
- Test via REST `/rpc/{toolName}` endpoint

### `packages/soul/`
- Keep emotions in range [-100, 100]
- All state changes must be logged
- Use `processEvent()` for external updates

### `packages/story/`
- Choices must affect relationships/phase
- Events must have timestamps
- Use `applyOption()` to advance narrative

### `packages/memory/`
- Embeddings are optional (planned feature)
- All chunks must have source metadata
- Search should handle empty queries gracefully

---

## 🎯 Good First Issues

Look for issues tagged with:
- `good first issue` - Easy for newcomers
- `help wanted` - Community help needed
- `documentation` - Docs improvements

---

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

**Examples of behavior that contributes to a positive environment:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior:**
- Trolling, insulting/derogatory comments, personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Instances of abusive behavior may be reported to the project team. All complaints will be reviewed and investigated promptly and fairly.

---

## 📞 Need Help?

- **Discussions:** [GitHub Discussions](https://github.com/Toobix-bot/Toobix-Unified/discussions)
- **Issues:** [GitHub Issues](https://github.com/Toobix-bot/Toobix-Unified/issues)
- **Docs:** Check [AI_COLLABORATION.md](./AI_COLLABORATION.md) and [SYSTEM_STRUKTUR.md](./SYSTEM_STRUKTUR.md)

---

**Thank you for contributing! 🎉**

Your contributions make Toobix better for everyone. Whether it's code, docs, bug reports, or feature ideas — we appreciate your help! ❤️
