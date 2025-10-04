# 🧪 Testing Setup Guide

**Status:** ✅ Vitest config files created  
**Next:** Install dependencies and run first tests

---

## 📦 Installation (Morgen - 5. Oktober)

### Step 1: Install Vitest
```powershell
cd c:\Toobix-Unified\packages\core
bun add -D vitest @vitest/ui @vitest/coverage-v8
```

### Step 2: Install Testing Utilities
```powershell
bun add -D @types/bun
```

### Step 3: Update package.json Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest watch"
  }
}
```

---

## 🚀 Running Tests

### Run All Tests
```powershell
cd packages\core
bun test
```

### Run with UI (Interactive)
```powershell
bun test:ui
```

### Run Once (No Watch)
```powershell
bun test:run
```

### Generate Coverage Report
```powershell
bun test:coverage
```

---

## 📁 File Structure

```
packages/core/
├── vitest.config.ts       ✅ Created - Test configuration
├── tests/
│   ├── setup.ts          ✅ Created - Test setup/teardown
│   └── example.test.ts   ✅ Created - Example test suite
├── src/
│   └── [source files]
└── package.json          ⏳ Next - Add test scripts
```

---

## ✅ Files Created

### 1. vitest.config.ts
**Purpose:** Configure Vitest test runner

**Features:**
- Global test APIs (describe, it, expect)
- Node environment
- Setup files
- Coverage thresholds (80%)
- Coverage reporters (text, html, json, lcov)
- Path aliases

### 2. tests/setup.ts
**Purpose:** Test database and global setup

**Features:**
- In-memory SQLite database
- beforeAll/afterAll hooks
- Database cleanup
- Test utilities export

### 3. tests/example.test.ts
**Purpose:** Example test suite to verify setup

**Features:**
- Basic math tests
- String operations
- Array operations
- Demonstrates testing patterns

---

## 🎯 Next Steps (Tomorrow Morning)

### 1. Install Dependencies (10 minutes)
```powershell
cd c:\Toobix-Unified\packages\core
bun add -D vitest @vitest/ui @vitest/coverage-v8
```

### 2. Run Example Tests (5 minutes)
```powershell
bun test
```

**Expected Output:**
```
✓ tests/example.test.ts (8 tests) 12ms
  ✓ Example Test Suite
    ✓ Basic Math
      ✓ should add two numbers
      ✓ should subtract numbers
    ✓ String Operations
      ✓ should concatenate strings
      ✓ should check string length
    ✓ Array Operations
      ✓ should find element in array
      ✓ should map array

Test Files  1 passed (1)
Tests  8 passed (8)
Duration  123ms
```

### 3. Write First Real Test (30 minutes)

Create `packages/core/tests/memory.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'

describe('Memory System', () => {
  it('should store a memory', async () => {
    // TODO: Implement
  })
  
  it('should search memories', async () => {
    // TODO: Implement
  })
})
```

---

## 📊 Coverage Goals

### Week 1 Target (Oct 11)
- [ ] Memory System: 80%
- [ ] Story Engine: 50%
- [ ] Love Engine: 50%
- **Total: 30%**

### Week 2 Target (Oct 18)
- [ ] All Core Systems: 80%
- **Total: 80%**

### Week 3 Target (Oct 25)
- [ ] Integration Tests: 50%
- [ ] E2E Tests: Basic flows
- **Total: 85%**

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'vitest'"
**Solution:**
```powershell
bun install
```

### Issue: "Database file not found"
**Solution:** Tests use in-memory DB (`:memory:`), no file needed

### Issue: "Coverage threshold not met"
**Solution:** Write more tests or adjust thresholds in `vitest.config.ts`

---

## 📚 Resources

- **Vitest Docs:** https://vitest.dev
- **Testing Best Practices:** https://testingjavascript.com
- **Example Tests:** See `tests/example.test.ts`

---

## ✅ Checklist for Tomorrow

Morning (9am-12pm):
- [ ] Install Vitest dependencies (10min)
- [ ] Run example tests (5min)
- [ ] Update package.json scripts (5min)
- [ ] Write first Memory System test (30min)
- [ ] Run tests and verify (10min)
- [ ] Push to GitHub (5min)

Afternoon (1pm-5pm):
- [ ] Write Story Engine tests (2h)
- [ ] Write Love Engine tests (1h)
- [ ] Generate coverage report (15min)
- [ ] Document progress (15min)

---

**Ready to go!** 🚀 All config files in place, just need to install and run.

**Next:** [ACTION_PLAN_3_MONTHS.md](./ACTION_PLAN_3_MONTHS.md) - Week 2 Tasks
