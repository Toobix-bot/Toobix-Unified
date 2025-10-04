import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'

// Test database setup
let testDb: Database

beforeAll(() => {
  // Create in-memory test database
  testDb = new Database(':memory:')
  
  console.log('🧪 Test database initialized')
})

afterAll(() => {
  // Close database connection
  testDb?.close()
  
  console.log('🧹 Test database cleaned up')
})

beforeEach(() => {
  // Reset database before each test
  // Run migrations or recreate tables
})

afterEach(() => {
  // Clean up after each test
})

// Export test utilities
export { testDb }
