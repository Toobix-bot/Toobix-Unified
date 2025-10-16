/**
 * 🎮 Life Game Chat - Server
 *
 * Starts the Life Game API server
 */

import { serve } from 'bun'
import app from './life-game-api'

const PORT = 3350

console.log('🎮 Starting Life Game Chat API Server...')
console.log('')

serve({
  port: PORT,
  fetch: app.fetch,
  development: true,
})

console.log('✅ Life Game Chat API running!')
console.log(`📍 URL: http://localhost:${PORT}`)
console.log('')
console.log('Available endpoints:')
console.log(`  POST http://localhost:${PORT}/message`)
console.log(`  GET  http://localhost:${PORT}/state?playerId=xxx`)
console.log(`  GET  http://localhost:${PORT}/history?playerId=xxx`)
console.log(`  POST http://localhost:${PORT}/companion/interact`)
console.log('')
console.log('Press Ctrl+C to stop')
