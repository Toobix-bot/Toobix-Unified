/**
 * 🔐 Authentication & Authorization System
 * 
 * User management with:
 * - Registration & Login
 * - Password hashing (bcrypt)
 * - Session management (JWT)
 * - Role-based access control
 * - API key management
 * - Rate limiting
 * 
 * Philosophy:
 * "Security enables trust. Trust enables growth."
 */

import Database from 'better-sqlite3'
import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'

export type UserRole = 'guest' | 'user' | 'premium' | 'admin' | 'developer'

export interface User {
  id?: number
  username: string
  email: string
  passwordHash: string
  role: UserRole
  createdAt?: number
  lastLogin?: number
  isActive: boolean
  
  // 2FA
  twoFactorEnabled: boolean
  twoFactorSecret?: string
  
  // Security
  loginAttempts: number
  lockedUntil?: number
}

export interface Session {
  id?: number
  userId: number
  token: string
  expiresAt: number
  createdAt?: number
  ipAddress?: string
  userAgent?: string
  isValid: boolean
}

export interface APIKey {
  id?: number
  userId: number
  key: string
  name: string
  createdAt?: number
  expiresAt?: number
  lastUsed?: number
  isActive: boolean
  
  // Rate limiting
  requestsPerMinute: number
  requestsToday: number
}

export interface Permission {
  id?: number
  userId: number
  permission: string
  grantedAt?: number
  grantedBy?: number
}

// Role-based permissions
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  guest: [
    'being:view_state',
    'life:view_stats',
    'shadow:view_public'
  ],
  user: [
    // All guest permissions
    ...['being:view_state', 'life:view_stats', 'shadow:view_public'],
    // Plus user permissions
    'life:birth',
    'life:experience',
    'self:create',
    'self:interact',
    'shadow:simulate',
    'memory:store',
    'archive:view_own'
  ],
  premium: [
    // All user permissions
    ...['being:view_state', 'life:view_stats', 'shadow:view_public',
        'life:birth', 'life:experience', 'self:create', 'self:interact',
        'shadow:simulate', 'memory:store', 'archive:view_own'],
    // Plus premium permissions
    'autonomous:enable',
    'freedom:access',
    'multiverse:create',
    'memory:transform',
    'archive:view_collective',
    'perspectives:analyze'
  ],
  admin: [
    '*'  // All permissions
  ],
  developer: [
    '*'  // All permissions + API access
  ]
}

// Rate limits per role
export const RATE_LIMITS: Record<UserRole, number> = {
  guest: 10,      // 10 requests/minute
  user: 60,       // 60 requests/minute
  premium: 300,   // 300 requests/minute
  admin: 1000,    // 1000 requests/minute
  developer: 1000 // 1000 requests/minute
}

export class AuthSystem {
  private db: Database.Database
  private readonly saltRounds = 10
  private readonly sessionDuration = 24 * 60 * 60 * 1000  // 24 hours
  private readonly maxLoginAttempts = 5
  private readonly lockoutDuration = 15 * 60 * 1000  // 15 minutes

  constructor(db: Database.Database) {
    this.db = db
    this.initializeTables()
  }

  private initializeTables(): void {
    // Users table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at INTEGER NOT NULL,
        last_login INTEGER,
        is_active INTEGER NOT NULL DEFAULT 1,
        
        two_factor_enabled INTEGER NOT NULL DEFAULT 0,
        two_factor_secret TEXT,
        
        login_attempts INTEGER NOT NULL DEFAULT 0,
        locked_until INTEGER
      )
    `)

    // Sessions table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        is_valid INTEGER NOT NULL DEFAULT 1,
        
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `)

    // API keys table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        key TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        expires_at INTEGER,
        last_used INTEGER,
        is_active INTEGER NOT NULL DEFAULT 1,
        
        requests_per_minute INTEGER NOT NULL,
        requests_today INTEGER NOT NULL DEFAULT 0,
        
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `)

    // Permissions table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        permission TEXT NOT NULL,
        granted_at INTEGER NOT NULL,
        granted_by INTEGER,
        
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (granted_by) REFERENCES users(id),
        
        UNIQUE(user_id, permission)
      )
    `)

    // Indices
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)')
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)')
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key)')
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id)')
  }

  // ========== USER MANAGEMENT ==========

  /**
   * Register new user
   */
  async register(params: {
    username: string
    email: string
    password: string
    role?: UserRole
  }): Promise<User> {
    // Validate
    if (params.username.length < 3) {
      throw new Error('Username must be at least 3 characters')
    }
    if (params.password.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }
    if (!this.isValidEmail(params.email)) {
      throw new Error('Invalid email address')
    }

    // Check if username/email exists
    const existing = this.db
      .prepare('SELECT id FROM users WHERE username = ? OR email = ?')
      .get(params.username, params.email)

    if (existing) {
      throw new Error('Username or email already exists')
    }

    // Hash password
    const passwordHash = await bcrypt.hash(params.password, this.saltRounds)

    const user: User = {
      username: params.username,
      email: params.email,
      passwordHash,
      role: params.role || 'user',
      createdAt: Date.now(),
      isActive: true,
      twoFactorEnabled: false,
      loginAttempts: 0
    }

    const result = this.db
      .prepare(`
        INSERT INTO users 
        (username, email, password_hash, role, created_at, is_active, two_factor_enabled, login_attempts)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        user.username,
        user.email,
        user.passwordHash,
        user.role,
        user.createdAt,
        1,
        0,
        0
      )

    user.id = result.lastInsertRowid as number

    // Grant role-based permissions
    await this.grantRolePermissions(user.id, user.role)

    return user
  }

  /**
   * Login user
   */
  async login(params: {
    username: string
    password: string
    ipAddress?: string
    userAgent?: string
  }): Promise<{ user: User; session: Session; token: string }> {
    // Get user
    const user = this.getUserByUsername(params.username)
    if (!user) {
      throw new Error('Invalid username or password')
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > Date.now()) {
      const minutesLeft = Math.ceil((user.lockedUntil - Date.now()) / 60000)
      throw new Error(`Account locked. Try again in ${minutesLeft} minutes`)
    }

    // Check if account is active
    if (!user.isActive) {
      throw new Error('Account is deactivated')
    }

    // Verify password
    const isValid = await bcrypt.compare(params.password, user.passwordHash)
    
    if (!isValid) {
      // Increment login attempts
      this.incrementLoginAttempts(user.id!)
      
      if (user.loginAttempts + 1 >= this.maxLoginAttempts) {
        this.lockAccount(user.id!)
        throw new Error('Too many failed attempts. Account locked for 15 minutes')
      }
      
      throw new Error('Invalid username or password')
    }

    // Reset login attempts
    this.resetLoginAttempts(user.id!)

    // Update last login
    this.db
      .prepare('UPDATE users SET last_login = ? WHERE id = ?')
      .run(Date.now(), user.id)

    // Create session
    const session = this.createSession({
      userId: user.id!,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent
    })

    return {
      user,
      session,
      token: session.token
    }
  }

  /**
   * Logout user
   */
  logout(token: string): void {
    this.db
      .prepare('UPDATE sessions SET is_valid = 0 WHERE token = ?')
      .run(token)
  }

  /**
   * Validate session token
   */
  validateSession(token: string): User | null {
    const session = this.db
      .prepare(`
        SELECT s.*, u.* 
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND s.is_valid = 1 AND s.expires_at > ? AND u.is_active = 1
      `)
      .get(token, Date.now()) as any

    if (!session) return null

    return {
      id: session.user_id,
      username: session.username,
      email: session.email,
      passwordHash: session.password_hash,
      role: session.role,
      createdAt: session.created_at,
      lastLogin: session.last_login,
      isActive: session.is_active === 1,
      twoFactorEnabled: session.two_factor_enabled === 1,
      twoFactorSecret: session.two_factor_secret,
      loginAttempts: session.login_attempts,
      lockedUntil: session.locked_until
    }
  }

  // ========== SESSION MANAGEMENT ==========

  private createSession(params: {
    userId: number
    ipAddress?: string
    userAgent?: string
  }): Session {
    const token = this.generateToken()
    const session: Session = {
      userId: params.userId,
      token,
      expiresAt: Date.now() + this.sessionDuration,
      createdAt: Date.now(),
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      isValid: true
    }

    const result = this.db
      .prepare(`
        INSERT INTO sessions 
        (user_id, token, expires_at, created_at, ip_address, user_agent, is_valid)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        session.userId,
        session.token,
        session.expiresAt,
        session.createdAt,
        session.ipAddress || null,
        session.userAgent || null,
        1
      )

    session.id = result.lastInsertRowid as number
    return session
  }

  private generateToken(): string {
    return randomBytes(32).toString('hex')
  }

  // ========== API KEY MANAGEMENT ==========

  /**
   * Create API key
   */
  createAPIKey(params: {
    userId: number
    name: string
    expiresAt?: number
  }): APIKey {
    const user = this.getUserById(params.userId)
    if (!user) {
      throw new Error('User not found')
    }

    const key = `toobix_${randomBytes(32).toString('hex')}`
    const apiKey: APIKey = {
      userId: params.userId,
      key,
      name: params.name,
      createdAt: Date.now(),
      expiresAt: params.expiresAt,
      isActive: true,
      requestsPerMinute: RATE_LIMITS[user.role],
      requestsToday: 0
    }

    const result = this.db
      .prepare(`
        INSERT INTO api_keys 
        (user_id, key, name, created_at, expires_at, is_active, requests_per_minute, requests_today)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        apiKey.userId,
        apiKey.key,
        apiKey.name,
        apiKey.createdAt,
        apiKey.expiresAt || null,
        1,
        apiKey.requestsPerMinute,
        0
      )

    apiKey.id = result.lastInsertRowid as number
    return apiKey
  }

  /**
   * Validate API key
   */
  validateAPIKey(key: string): { user: User; apiKey: APIKey } | null {
    const row = this.db
      .prepare(`
        SELECT a.*, u.*
        FROM api_keys a
        JOIN users u ON a.user_id = u.id
        WHERE a.key = ? AND a.is_active = 1 AND u.is_active = 1
      `)
      .get(key) as any

    if (!row) return null

    // Check expiration
    if (row.expires_at && row.expires_at < Date.now()) {
      return null
    }

    // Update last used
    this.db
      .prepare('UPDATE api_keys SET last_used = ? WHERE id = ?')
      .run(Date.now(), row.id)

    const user: User = {
      id: row.user_id,
      username: row.username,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role,
      createdAt: row.created_at,
      lastLogin: row.last_login,
      isActive: row.is_active === 1,
      twoFactorEnabled: row.two_factor_enabled === 1,
      loginAttempts: row.login_attempts,
      lockedUntil: row.locked_until
    }

    const apiKey: APIKey = {
      id: row.id,
      userId: row.user_id,
      key: row.key,
      name: row.name,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      lastUsed: row.last_used,
      isActive: row.is_active === 1,
      requestsPerMinute: row.requests_per_minute,
      requestsToday: row.requests_today
    }

    return { user, apiKey }
  }

  // ========== PERMISSIONS ==========

  /**
   * Check if user has permission
   */
  hasPermission(userId: number, permission: string): boolean {
    const user = this.getUserById(userId)
    if (!user) return false

    // Admin and developer have all permissions
    if (user.role === 'admin' || user.role === 'developer') return true

    // Check role permissions
    const rolePerms = ROLE_PERMISSIONS[user.role]
    if (rolePerms.includes('*') || rolePerms.includes(permission)) return true

    // Check specific permissions
    const hasSpecific = this.db
      .prepare('SELECT COUNT(*) as count FROM permissions WHERE user_id = ? AND permission = ?')
      .get(userId, permission) as any

    return hasSpecific.count > 0
  }

  /**
   * Grant permission
   */
  grantPermission(params: {
    userId: number
    permission: string
    grantedBy?: number
  }): void {
    this.db
      .prepare(`
        INSERT OR IGNORE INTO permissions (user_id, permission, granted_at, granted_by)
        VALUES (?, ?, ?, ?)
      `)
      .run(params.userId, params.permission, Date.now(), params.grantedBy || null)
  }

  /**
   * Revoke permission
   */
  revokePermission(userId: number, permission: string): void {
    this.db
      .prepare('DELETE FROM permissions WHERE user_id = ? AND permission = ?')
      .run(userId, permission)
  }

  private async grantRolePermissions(userId: number, role: UserRole): Promise<void> {
    const permissions = ROLE_PERMISSIONS[role]
    if (permissions.includes('*')) return  // Admin/developer get all dynamically

    for (const permission of permissions) {
      this.grantPermission({ userId, permission })
    }
  }

  // ========== HELPERS ==========

  private getUserByUsername(username: string): User | undefined {
    const row = this.db
      .prepare('SELECT * FROM users WHERE username = ?')
      .get(username) as any

    if (!row) return undefined

    return {
      id: row.id,
      username: row.username,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role,
      createdAt: row.created_at,
      lastLogin: row.last_login,
      isActive: row.is_active === 1,
      twoFactorEnabled: row.two_factor_enabled === 1,
      twoFactorSecret: row.two_factor_secret,
      loginAttempts: row.login_attempts,
      lockedUntil: row.locked_until
    }
  }

  getUserById(id: number): User | undefined {
    const row = this.db
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(id) as any

    if (!row) return undefined

    return {
      id: row.id,
      username: row.username,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role,
      createdAt: row.created_at,
      lastLogin: row.last_login,
      isActive: row.is_active === 1,
      twoFactorEnabled: row.two_factor_enabled === 1,
      twoFactorSecret: row.two_factor_secret,
      loginAttempts: row.login_attempts,
      lockedUntil: row.locked_until
    }
  }

  private incrementLoginAttempts(userId: number): void {
    this.db
      .prepare('UPDATE users SET login_attempts = login_attempts + 1 WHERE id = ?')
      .run(userId)
  }

  private resetLoginAttempts(userId: number): void {
    this.db
      .prepare('UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = ?')
      .run(userId)
  }

  private lockAccount(userId: number): void {
    this.db
      .prepare('UPDATE users SET locked_until = ? WHERE id = ?')
      .run(Date.now() + this.lockoutDuration, userId)
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // ========== STATISTICS ==========

  getStatistics() {
    const users = this.db
      .prepare(`
        SELECT 
          role,
          COUNT(*) as count,
          SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active
        FROM users
        GROUP BY role
      `)
      .all() as any[]

    const sessions = this.db
      .prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN is_valid = 1 AND expires_at > ? THEN 1 ELSE 0 END) as active
        FROM sessions
      `)
      .get(Date.now()) as any

    const apiKeys = this.db
      .prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active
        FROM api_keys
      `)
      .get() as any

    return {
      users: users.reduce((acc, row) => {
        acc[row.role] = { total: row.count, active: row.active }
        return acc
      }, {} as Record<string, { total: number; active: number }>),
      sessions: {
        total: sessions.total,
        active: sessions.active
      },
      apiKeys: {
        total: apiKeys.total,
        active: apiKeys.active
      }
    }
  }
}
