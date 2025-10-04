# 🔒 Security & Safety Plan

**Goal:** Secure Toobix-Unified for production deployment

---

## Threat Model

### Identified Risks

1. **API Abuse** — Unlimited requests, DDoS attacks
2. **Injection Attacks** — SQL injection, prompt injection
3. **Data Leakage** — Sensitive user data exposure
4. **Unauthorized Access** — No authentication on MCP tools
5. **Harmful Content** — AI generates unsafe/harmful content
6. **Resource Exhaustion** — Memory leaks, infinite loops

---

## Security Layers

### 1. Rate Limiting

**Problem:** Unlimited API requests enable abuse

**Solution:** Token bucket rate limiting

```typescript
// packages/bridge/src/middleware/advanced-rate-limit.ts

export class AdvancedRateLimiter {
  private buckets: Map<string, TokenBucket>
  
  constructor(
    private tokensPerMinute: number = 60,
    private burstSize: number = 10
  ) {
    this.buckets = new Map()
  }
  
  async checkLimit(identifier: string): Promise<{ allowed: boolean, retryAfter?: number }> {
    let bucket = this.buckets.get(identifier)
    
    if (!bucket) {
      bucket = new TokenBucket(this.tokensPerMinute, this.burstSize)
      this.buckets.set(identifier, bucket)
    }
    
    const allowed = bucket.consume()
    
    if (!allowed) {
      const retryAfter = bucket.getRetryAfter()
      return { allowed: false, retryAfter }
    }
    
    return { allowed: true }
  }
  
  reset(identifier: string): void {
    this.buckets.delete(identifier)
  }
}

class TokenBucket {
  private tokens: number
  private lastRefill: number
  
  constructor(
    private tokensPerMinute: number,
    private maxTokens: number
  ) {
    this.tokens = maxTokens
    this.lastRefill = Date.now()
  }
  
  consume(): boolean {
    this.refill()
    
    if (this.tokens >= 1) {
      this.tokens -= 1
      return true
    }
    
    return false
  }
  
  private refill(): void {
    const now = Date.now()
    const elapsed = now - this.lastRefill
    const tokensToAdd = (elapsed / 60000) * this.tokensPerMinute
    
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd)
    this.lastRefill = now
  }
  
  getRetryAfter(): number {
    const tokensNeeded = 1 - this.tokens
    return Math.ceil((tokensNeeded / this.tokensPerMinute) * 60)
  }
}

// Usage in Bridge
const rateLimiter = new AdvancedRateLimiter(60, 10) // 60 req/min, burst 10

app.use(async (req, res, next) => {
  const identifier = req.ip || 'unknown'
  const result = await rateLimiter.checkLimit(identifier)
  
  if (!result.allowed) {
    res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: result.retryAfter
    })
    return
  }
  
  next()
})
```

**Benefits:**
- 🛡️ Prevents DDoS attacks
- 💰 Reduces API costs
- ⚖️ Fair resource allocation

---

### 2. Input Validation

**Problem:** Unvalidated input enables injection attacks

**Solution:** Strict input validation with Zod

```typescript
// packages/core/src/security/input-validator.ts

import { z } from 'zod'

export class InputValidator {
  // Event schema
  static eventSchema = z.object({
    type: z.string().min(1).max(100),
    action: z.string().min(1).max(200),
    description: z.string().min(1).max(1000),
    source: z.enum(['ethics', 'soul', 'consciousness', 'story', 'memory', 'peace', 'love', 'people']),
    affectsValues: z.array(z.string()).optional(),
    valueUpdates: z.array(z.object({
      valueId: z.string(),
      alignment: z.number().min(0).max(100).optional(),
      importance: z.number().min(0).max(100).optional()
    })).optional(),
    requiresReflection: z.boolean().optional(),
    requiresEthicsCheck: z.boolean().optional(),
    context: z.record(z.any()).optional()
  })
  
  // Value conflict schema
  static valueConflictSchema = z.object({
    valueA: z.string().min(1).max(100),
    valueB: z.string().min(1).max(100),
    context: z.record(z.any()).optional(),
    severity: z.enum(['low', 'medium', 'high']).optional()
  })
  
  // Module conflict schema
  static moduleConflictSchema = z.object({
    moduleA: z.enum(['ethics', 'soul', 'consciousness', 'story', 'memory']),
    moduleB: z.enum(['ethics', 'soul', 'consciousness', 'story', 'memory']),
    type: z.enum(['ethical_dilemma', 'value_conflict', 'data_inconsistency', 'priority_conflict']),
    context: z.record(z.any()).optional(),
    description: z.string().optional()
  })
  
  static validate<T>(schema: z.ZodSchema<T>, data: unknown): { valid: boolean, data?: T, errors?: string[] } {
    try {
      const validated = schema.parse(data)
      return { valid: true, data: validated }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        }
      }
      return { valid: false, errors: ['Unknown validation error'] }
    }
  }
}

// Usage
const result = InputValidator.validate(
  InputValidator.eventSchema,
  req.body
)

if (!result.valid) {
  return res.status(400).json({
    error: 'Validation failed',
    details: result.errors
  })
}

// Safe to use
await pipeline.processEvent(result.data)
```

**Benefits:**
- 🛡️ Prevents injection attacks
- ✅ Type safety
- 📝 Clear error messages

---

### 3. Output Filtering

**Problem:** AI might generate harmful/sensitive content

**Solution:** Content safety filter

```typescript
// packages/core/src/security/content-filter.ts

export class ContentFilter {
  private blockedPatterns: RegExp[]
  private sensitivePatterns: RegExp[]
  
  constructor() {
    // Block harmful content
    this.blockedPatterns = [
      /\b(kill|murder|suicide|self-harm)\b/i,
      /\b(hack|exploit|vulnerability)\b/i,
      /\b(password|api[_-]?key|secret[_-]?key)\b/i
    ]
    
    // Redact sensitive info
    this.sensitivePatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/g,  // SSN
      /\b\d{16}\b/g,              // Credit card
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g  // Email
    ]
  }
  
  check(text: string): { safe: boolean, reason?: string } {
    for (const pattern of this.blockedPatterns) {
      if (pattern.test(text)) {
        return {
          safe: false,
          reason: `Blocked content detected: ${pattern.source}`
        }
      }
    }
    
    return { safe: true }
  }
  
  redact(text: string): string {
    let redacted = text
    
    // Redact sensitive patterns
    for (const pattern of this.sensitivePatterns) {
      redacted = redacted.replace(pattern, '[REDACTED]')
    }
    
    return redacted
  }
  
  sanitize(text: string): { text: string, safe: boolean, reason?: string } {
    const checkResult = this.check(text)
    
    if (!checkResult.safe) {
      return { text: '', safe: false, reason: checkResult.reason }
    }
    
    const redacted = this.redact(text)
    return { text: redacted, safe: true }
  }
}

// Usage
const filter = new ContentFilter()

// Check before processing
const checkResult = filter.check(userInput)
if (!checkResult.safe) {
  return { error: 'Content blocked', reason: checkResult.reason }
}

// Sanitize before storing
const sanitized = filter.sanitize(aiResponse)
await memory.add(sanitized.text, metadata)
```

**Benefits:**
- 🛡️ Prevents harmful content
- 🔒 Protects sensitive data
- ⚠️ Clear blocking reasons

---

### 4. Authentication & Authorization

**Problem:** No authentication on MCP tools

**Solution:** API key + role-based access

```typescript
// packages/bridge/src/security/auth.ts

export class AuthService {
  private apiKeys: Map<string, ApiKey>
  
  constructor() {
    this.apiKeys = new Map()
    this.loadApiKeys()
  }
  
  private loadApiKeys(): void {
    // Load from environment or database
    const keys = process.env.API_KEYS?.split(',') || []
    
    keys.forEach(key => {
      const [token, role] = key.split(':')
      this.apiKeys.set(token, {
        token,
        role: role as Role,
        createdAt: Date.now()
      })
    })
  }
  
  authenticate(token: string): ApiKey | null {
    return this.apiKeys.get(token) || null
  }
  
  authorize(apiKey: ApiKey, requiredRole: Role): boolean {
    const roleHierarchy: Record<Role, number> = {
      'admin': 3,
      'user': 2,
      'guest': 1
    }
    
    return roleHierarchy[apiKey.role] >= roleHierarchy[requiredRole]
  }
  
  generateApiKey(role: Role = 'user'): string {
    const token = `toobix_${Date.now()}_${Math.random().toString(36).slice(2)}`
    this.apiKeys.set(token, { token, role, createdAt: Date.now() })
    return token
  }
}

type Role = 'admin' | 'user' | 'guest'
type ApiKey = { token: string, role: Role, createdAt: number }

// Middleware
const authService = new AuthService()

app.use((req, res, next) => {
  const token = req.headers['authorization']?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'Missing API key' })
  }
  
  const apiKey = authService.authenticate(token)
  
  if (!apiKey) {
    return res.status(401).json({ error: 'Invalid API key' })
  }
  
  // Attach to request
  req.apiKey = apiKey
  next()
})

// Tool-level authorization
{
  name: 'pipeline_process_event',
  requiredRole: 'user',  // NEW
  handler: async (args: any, req: any) => {
    if (!authService.authorize(req.apiKey, 'user')) {
      throw new Error('Insufficient permissions')
    }
    
    return await pipeline.processEvent(args)
  }
}
```

**Benefits:**
- 🔒 Access control
- 👤 User tracking
- 📊 Usage analytics

---

### 5. Ethics Enforcement

**Problem:** AI might attempt harmful actions

**Solution:** Multi-layer ethics checking

```typescript
// packages/core/src/security/ethics-enforcer.ts

export class EthicsEnforcer {
  constructor(
    private ethicsModule: any,
    private contentFilter: ContentFilter
  ) {}
  
  async checkAction(action: any): Promise<EthicsCheckResult> {
    // Layer 1: Content filter
    const contentCheck = this.contentFilter.check(JSON.stringify(action))
    if (!contentCheck.safe) {
      return {
        allowed: false,
        reason: contentCheck.reason!,
        severity: 'critical'
      }
    }
    
    // Layer 2: Ethics module
    const ethicsResult = await this.ethicsModule.analyze({
      action: action.action,
      context: action.context
    })
    
    if (!ethicsResult.isEthical || ethicsResult.score < 50) {
      return {
        allowed: false,
        reason: ethicsResult.reason,
        severity: ethicsResult.score < 30 ? 'critical' : 'high',
        suggestions: ethicsResult.suggestions
      }
    }
    
    // Layer 3: Value alignment
    if (action.affectsValues) {
      const valueCheck = await this.checkValueAlignment(action)
      if (!valueCheck.aligned) {
        return {
          allowed: false,
          reason: 'Action conflicts with core values',
          severity: 'medium',
          conflictingValues: valueCheck.conflictingValues
        }
      }
    }
    
    return {
      allowed: true,
      score: ethicsResult.score,
      confidence: 0.95
    }
  }
  
  private async checkValueAlignment(action: any): Promise<any> {
    // Check if action conflicts with immutable values
    const immutableValues = ['do_no_harm', 'privacy', 'autonomy']
    
    for (const valueId of action.affectsValues) {
      if (immutableValues.includes(valueId)) {
        const value = unifiedValues.getValue(valueId)
        
        // Check if action would lower alignment
        const update = action.valueUpdates?.find((u: any) => u.valueId === valueId)
        if (update && update.alignment < value!.alignment) {
          return {
            aligned: false,
            conflictingValues: [valueId]
          }
        }
      }
    }
    
    return { aligned: true }
  }
}

type EthicsCheckResult = {
  allowed: boolean
  reason?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
  score?: number
  confidence?: number
  suggestions?: string[]
  conflictingValues?: string[]
}

// Usage in Pipeline
const enforcer = new EthicsEnforcer(ethicsModule, contentFilter)

// Check before processing
const ethicsCheck = await enforcer.checkAction(event)

if (!ethicsCheck.allowed) {
  return {
    success: false,
    reason: ethicsCheck.reason,
    severity: ethicsCheck.severity,
    suggestions: ethicsCheck.suggestions
  }
}
```

**Benefits:**
- 🛡️ Multi-layer protection
- ⚖️ Value-aligned actions only
- 📝 Clear rejection reasons

---

### 6. Resource Limits

**Problem:** Unbounded operations cause crashes

**Solution:** Resource monitoring and limits

```typescript
// packages/core/src/security/resource-monitor.ts

export class ResourceMonitor {
  private memoryLimit: number
  private timeoutLimit: number
  
  constructor(memoryLimitMB: number = 500, timeoutMs: number = 30000) {
    this.memoryLimit = memoryLimitMB * 1024 * 1024
    this.timeoutLimit = timeoutMs
  }
  
  checkMemory(): { ok: boolean, usage: number } {
    const usage = process.memoryUsage()
    const heapUsed = usage.heapUsed
    
    return {
      ok: heapUsed < this.memoryLimit,
      usage: heapUsed
    }
  }
  
  async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs?: number
  ): Promise<T> {
    const timeout = timeoutMs || this.timeoutLimit
    
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Operation timeout')), timeout)
      )
    ])
  }
  
  async withResourceCheck<T>(
    operation: () => Promise<T>
  ): Promise<T> {
    // Check memory before
    const beforeCheck = this.checkMemory()
    if (!beforeCheck.ok) {
      throw new Error(`Memory limit exceeded: ${(beforeCheck.usage / 1024 / 1024).toFixed(0)}MB`)
    }
    
    // Run with timeout
    const result = await this.withTimeout(operation())
    
    // Check memory after
    const afterCheck = this.checkMemory()
    if (!afterCheck.ok) {
      console.warn(`Memory warning: ${(afterCheck.usage / 1024 / 1024).toFixed(0)}MB`)
    }
    
    return result
  }
}

// Usage
const monitor = new ResourceMonitor(500, 30000)

// Wrap potentially expensive operations
try {
  const result = await monitor.withResourceCheck(async () => {
    return await expensiveOperation()
  })
} catch (error) {
  if (error.message.includes('timeout')) {
    return { error: 'Operation took too long' }
  }
  if (error.message.includes('Memory limit')) {
    return { error: 'Memory limit exceeded' }
  }
  throw error
}
```

**Benefits:**
- 🛡️ Prevents crashes
- ⏱️ Timeout protection
- 💾 Memory limit enforcement

---

## Implementation Checklist

### Week 1: Core Security

- [ ] Implement `AdvancedRateLimiter`
- [ ] Implement `InputValidator` with Zod
- [ ] Implement `ContentFilter`
- [ ] Add to Bridge middleware
- [ ] Test with malicious inputs

### Week 2: Authentication

- [ ] Implement `AuthService`
- [ ] Generate API keys
- [ ] Add role-based access
- [ ] Update MCP tools with auth
- [ ] Test authorization

### Week 3: Ethics & Resources

- [ ] Implement `EthicsEnforcer`
- [ ] Implement `ResourceMonitor`
- [ ] Integrate with Pipeline
- [ ] Test edge cases
- [ ] Load testing

### Week 4: Production Hardening

- [ ] HTTPS/TLS setup
- [ ] Security headers
- [ ] Audit logging
- [ ] Penetration testing
- [ ] Documentation

---

## Security Metrics

Track these metrics:

```typescript
export class SecurityMetrics {
  private metrics = {
    rateLimitHits: 0,
    invalidInputs: 0,
    blockedContent: 0,
    authFailures: 0,
    ethicsBlocks: 0,
    timeouts: 0
  }
  
  record(event: keyof typeof this.metrics): void {
    this.metrics[event]++
  }
  
  report(): string {
    return `
🔒 SECURITY METRICS

Rate Limit Hits: ${this.metrics.rateLimitHits}
Invalid Inputs: ${this.metrics.invalidInputs}
Blocked Content: ${this.metrics.blockedContent}
Auth Failures: ${this.metrics.authFailures}
Ethics Blocks: ${this.metrics.ethicsBlocks}
Timeouts: ${this.metrics.timeouts}
    `
  }
}
```

---

**Next:** Implement Week 1 (Core Security)
