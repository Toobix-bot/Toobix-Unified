# 🔐 Authentication Setup Guide

**Status:** ✅ All auth files created  
**Next:** Install dependencies and integrate into Bridge

---

## 📦 Files Created

```
packages/bridge/src/
├── middleware/
│   ├── auth.ts          ✅ JWT + Password handling
│   └── rateLimit.ts     ✅ Rate limiting configs
└── routes/
    └── auth.ts          ✅ Register/Login/Me endpoints
```

---

## 🚀 Installation Steps (Monday, Oct 7)

### Step 1: Install Dependencies (10 minutes)
```powershell
cd c:\Toobix-Unified\packages\bridge
bun add jsonwebtoken bcryptjs express-rate-limit
bun add -D @types/jsonwebtoken @types/bcryptjs
```

### Step 2: Add Users Table to Schema (15 minutes)

Edit `packages/core/src/db/schema.ts`:
```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$onUpdateFn(() => new Date())
})
```

### Step 3: Generate Migration (5 minutes)
```powershell
cd c:\Toobix-Unified\packages\core
bun run drizzle-kit generate:sqlite
bun run migrate
```

### Step 4: Update Bridge Index (20 minutes)

Edit `packages/bridge/src/index.ts`:
```typescript
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import { requireAuth, optionalAuth } from './middleware/auth'
import { apiLimiter } from './middleware/rateLimit'

const app = express()
const PORT = process.env.BRIDGE_PORT || 3337

// Middleware
app.use(cors())
app.use(express.json())

// Auth routes (no auth required)
app.use('/auth', authRoutes)

// Protected routes (require auth)
app.post('/mcp', requireAuth, apiLimiter, async (req, res) => {
  const userId = req.userId // Available from auth middleware
  // ... existing MCP logic
})

// Public stats (optional auth)
app.get('/stats', optionalAuth, async (req, res) => {
  const userId = req.userId // Undefined if not authenticated
  // ... existing stats logic
})

app.listen(PORT, () => {
  console.log(`🔐 Auth-enabled Bridge running on port ${PORT}`)
})
```

### Step 5: Add Environment Variables (5 minutes)

Create/update `.env` in `packages/bridge/`:
```env
# Existing
GROQ_API_KEY=gsk_...
DATABASE_PATH=../../data/toobix-unified.db
BRIDGE_PORT=3337

# New - Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ADMIN_API_KEY=your-admin-api-key-for-bypassing-rate-limits
```

⚠️ **Security:** Generate secure secrets:
```powershell
# Generate JWT_SECRET (random 64-char string)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or use online generator: https://randomkeygen.com/
```

---

## 🧪 Testing Authentication (30 minutes)

### Test 1: Register New User
```powershell
curl http://localhost:3337/auth/register `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"SecurePass123","name":"Test User"}'
```

**Expected Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "clxxx...",
    "email": "test@example.com",
    "name": "Test User"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Test 2: Login
```powershell
curl http://localhost:3337/auth/login `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"SecurePass123"}'
```

### Test 3: Get Current User
```powershell
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." # From register/login

curl http://localhost:3337/auth/me `
  -Headers @{"Authorization"="Bearer $token"}
```

### Test 4: Protected MCP Endpoint
```powershell
curl http://localhost:3337/mcp `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{"Authorization"="Bearer $token"} `
  -Body '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

### Test 5: Rate Limiting
```powershell
# Try to register 6 times in 15 minutes (should fail on 6th)
1..6 | ForEach-Object {
  curl http://localhost:3337/auth/register `
    -Method POST `
    -ContentType "application/json" `
    -Body "{`"email`":`"test$_@example.com`",`"password`":`"SecurePass123`"}"
}

# Expected on 6th request:
# {
#   "error": "Too many requests",
#   "message": "You have exceeded the rate limit. Please try again later.",
#   "retryAfter": 897
# }
```

---

## 🔧 Frontend Integration (Optional for now)

### Update Frontend to use Auth

```typescript
// apps/web-react/src/lib/auth.ts
export async function register(email: string, password: string, name: string) {
  const res = await fetch('http://localhost:3337/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  })
  
  const data = await res.json()
  
  if (!res.ok) {
    throw new Error(data.error || 'Registration failed')
  }
  
  // Store token
  localStorage.setItem('token', data.token)
  localStorage.setItem('user', JSON.stringify(data.user))
  
  return data
}

export async function login(email: string, password: string) {
  const res = await fetch('http://localhost:3337/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  
  const data = await res.json()
  
  if (!res.ok) {
    throw new Error(data.error || 'Login failed')
  }
  
  localStorage.setItem('token', data.token)
  localStorage.setItem('user', JSON.stringify(data.user))
  
  return data
}

export function getToken(): string | null {
  return localStorage.getItem('token')
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// Update MCP calls to include token
export async function callMCP(toolName: string, args: any) {
  const token = getToken()
  
  const res = await fetch('http://localhost:3337/mcp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: { name: toolName, arguments: args },
      id: 1
    })
  })
  
  return res.json()
}
```

---

## 📊 Authentication Features

### ✅ Implemented
- [x] JWT token generation (7-day expiry)
- [x] Password hashing (bcrypt, 10 rounds)
- [x] Password strength validation
- [x] Email format validation
- [x] Rate limiting (5 auth requests per 15 min)
- [x] API rate limiting (60 requests per minute)
- [x] Protected routes (`requireAuth` middleware)
- [x] Optional auth (`optionalAuth` middleware)
- [x] User registration
- [x] User login
- [x] Get current user
- [x] Logout (client-side)

### 🔄 Coming Soon (Week 2)
- [ ] Password reset flow
- [ ] Email verification
- [ ] Refresh tokens
- [ ] Token blacklisting
- [ ] OAuth (Google, GitHub)
- [ ] 2FA (TOTP)
- [ ] Session management
- [ ] Admin roles

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'jsonwebtoken'"
**Solution:** Run `bun install` in `packages/bridge`

### Error: "Database table 'users' does not exist"
**Solution:** Run migrations: `bun run migrate` in `packages/core`

### Error: "JWT_SECRET is not defined"
**Solution:** Add `JWT_SECRET` to `.env` file

### Error: "Too many requests"
**Solution:** Wait 15 minutes or use different IP

---

## 📚 Security Best Practices

### ✅ DO
- Use strong JWT secrets (64+ chars)
- Hash passwords with bcrypt (10+ rounds)
- Validate all inputs
- Use HTTPS in production
- Rotate secrets regularly
- Log authentication attempts
- Implement rate limiting
- Use secure cookies for tokens

### ❌ DON'T
- Store passwords in plain text
- Use weak JWT secrets
- Expose secrets in code
- Skip input validation
- Allow unlimited login attempts
- Store tokens in localStorage (XSS risk - use httpOnly cookies)
- Use same secret for dev/prod

---

## ✅ Checklist for Monday

Morning (9am-12pm):
- [ ] Install auth dependencies (10min)
- [ ] Add users table schema (15min)
- [ ] Generate & run migration (5min)
- [ ] Update bridge index (20min)
- [ ] Add environment variables (5min)
- [ ] Test registration (10min)
- [ ] Test login (5min)
- [ ] Test protected routes (10min)

Afternoon (1pm-3pm):
- [ ] Write auth tests (1h)
- [ ] Test rate limiting (30min)
- [ ] Update documentation (30min)

---

**Status:** 🟢 Ready to implement!  
**Next:** Follow steps in order, test each component

**Related:**
- [ACTION_PLAN_3_MONTHS.md](./ACTION_PLAN_3_MONTHS.md) - Full roadmap
- [PRIORITY_QUICK_REFERENCE.md](./PRIORITY_QUICK_REFERENCE.md) - Daily priorities
- [CRITICAL_REVIEW_REPORT.md](./CRITICAL_REVIEW_REPORT.md) - Why auth is P0
