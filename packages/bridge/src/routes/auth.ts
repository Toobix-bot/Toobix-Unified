import { Router } from 'express'
import { 
  generateToken, 
  hashPassword, 
  comparePassword,
  validatePassword,
  validateEmail 
} from '../middleware/auth'
import { authLimiter } from '../middleware/rateLimit'
import { db } from '@toobix/core/db'
import { users } from '@toobix/core/db/schema'
import { eq } from 'drizzle-orm'

const router = Router()

// Apply rate limiting to all auth routes
router.use(authLimiter)

/**
 * POST /auth/register
 * Register new user
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      })
    }
    
    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      })
    }
    
    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        error: 'Weak password',
        details: passwordValidation.errors 
      })
    }
    
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)
    
    if (existingUser.length > 0) {
      return res.status(409).json({ 
        error: 'User already exists' 
      })
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password)
    
    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || email.split('@')[0]
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name
      })
    
    // Generate JWT token
    const token = generateToken(newUser.id, newUser.email)
    
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      },
      token
    })
    
  } catch (err) {
    console.error('Registration error:', err)
    res.status(500).json({ 
      error: 'Internal server error',
      message: err instanceof Error ? err.message : 'Unknown error'
    })
  }
})

/**
 * POST /auth/login
 * Login existing user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      })
    }
    
    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      })
    }
    
    // Check password
    const isValid = await comparePassword(password, user.password)
    
    if (!isValid) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      })
    }
    
    // Generate JWT token
    const token = generateToken(user.id, user.email)
    
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    })
    
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ 
      error: 'Internal server error',
      message: err instanceof Error ? err.message : 'Unknown error'
    })
  }
})

/**
 * GET /auth/me
 * Get current user (requires authentication)
 */
router.get('/me', requireAuth, async (req, res) => {
  try {
    const userId = req.userId!
    
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      })
    }
    
    res.json({ user })
    
  } catch (err) {
    console.error('Get user error:', err)
    res.status(500).json({ 
      error: 'Internal server error',
      message: err instanceof Error ? err.message : 'Unknown error'
    })
  }
})

/**
 * POST /auth/logout
 * Logout user (client-side token deletion)
 */
router.post('/logout', (req, res) => {
  // JWT is stateless, so logout is handled client-side
  // In production, you might want to implement token blacklisting
  res.json({ 
    message: 'Logout successful',
    note: 'Please delete the token on client side'
  })
})

export default router
