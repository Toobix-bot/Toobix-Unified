import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { Request, Response, NextFunction } from 'express'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-CHANGE-IN-PRODUCTION'
const JWT_EXPIRES_IN = '7d'

export interface AuthUser {
  id: string
  email: string
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userId?: string
      user?: AuthUser
    }
  }
}

/**
 * Generate JWT token for user
 */
export function generateToken(userId: string, email: string): string {
  return jwt.sign(
    { id: userId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

/**
 * Verify JWT token and extract payload
 */
export function verifyToken(token: string): AuthUser {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    return decoded
  } catch (err) {
    throw new Error('Invalid or expired token')
  }
}

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Compare plain password with hashed password
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

/**
 * Express middleware to require authentication
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      res.status(401).json({ error: 'No authorization header provided' })
      return
    }
    
    // Format: "Bearer <token>"
    const token = authHeader.replace('Bearer ', '')
    
    if (!token) {
      res.status(401).json({ error: 'No token provided' })
      return
    }
    
    // Verify token
    const user = verifyToken(token)
    
    // Attach user to request
    req.userId = user.id
    req.user = user
    
    next()
  } catch (err) {
    res.status(403).json({ 
      error: 'Invalid or expired token',
      message: err instanceof Error ? err.message : 'Unknown error'
    })
  }
}

/**
 * Optional auth - continues even if no token provided
 * Useful for routes that work for both authenticated and anonymous users
 */
export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const user = verifyToken(token)
      req.userId = user.id
      req.user = user
    }
    
    next()
  } catch (err) {
    // Silent fail - continue without auth
    next()
  }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
