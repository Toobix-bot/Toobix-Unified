#!/usr/bin/env node
/**
 * Cross-platform startup script for Toobix-Unified
 * Works on Windows, macOS, and Linux
 */

import { spawn } from 'child_process'
import { platform } from 'os'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

console.log('🚀 Starting Toobix-Unified...\n')

// Service definitions
const services = [
  {
    name: 'Bridge (MCP)',
    command: 'bun',
    args: ['run', 'packages/bridge/src/index.ts'],
    port: 3337,
    color: '\x1b[36m' // Cyan
  },
  {
    name: 'API Server',
    command: 'bun',
    args: ['run', 'scripts/api-server.ts'],
    port: 3001,
    color: '\x1b[33m' // Yellow
  },
  {
    name: 'Diary API',
    command: 'bun',
    args: ['run', 'scripts/luna-chatbot.ts'],
    port: 3002,
    color: '\x1b[35m' // Magenta
  },
  {
    name: 'Web Frontend',
    command: platform() === 'win32' ? 'python' : 'python3',
    args: ['-m', 'http.server', '3000'],
    cwd: join(rootDir, 'apps', 'web'),
    port: 3000,
    color: '\x1b[32m' // Green
  }
]

const reset = '\x1b[0m'
const processes = []

// Load environment variables
try {
  const { config } = await import('dotenv')
  config({ path: join(rootDir, '.env') })
} catch (err) {
  console.warn('⚠️  .env file not found - using defaults')
}

// Start services
for (const service of services) {
  const proc = spawn(service.command, service.args, {
    cwd: service.cwd || rootDir,
    stdio: 'pipe',
    shell: true,
    env: { ...process.env }
  })

  processes.push({ service, proc })

  console.log(`${service.color}▶ ${service.name}${reset} starting on port ${service.port}...`)

  proc.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(Boolean)
    lines.forEach(line => {
      console.log(`${service.color}[${service.name}]${reset} ${line}`)
    })
  })

  proc.stderr.on('data', (data) => {
    const lines = data.toString().split('\n').filter(Boolean)
    lines.forEach(line => {
      if (!line.includes('ExperimentalWarning')) { // Hide Node.js warnings
        console.error(`${service.color}[${service.name}]${reset} ${line}`)
      }
    })
  })

  proc.on('exit', (code) => {
    if (code !== 0) {
      console.error(`${service.color}[${service.name}]${reset} ❌ Exited with code ${code}`)
    }
  })
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down services...')
  processes.forEach(({ service, proc }) => {
    console.log(`  Stopping ${service.name}...`)
    proc.kill('SIGTERM')
  })
  setTimeout(() => process.exit(0), 2000)
})

// Status summary after 5 seconds
setTimeout(() => {
  console.log('\n' + '='.repeat(60))
  console.log('✅ Toobix-Unified is running!')
  console.log('='.repeat(60))
  console.log('📍 Services:')
  services.forEach(s => {
    console.log(`   ${s.color}●${reset} ${s.name.padEnd(20)} http://localhost:${s.port}`)
  })
  console.log('\n💡 Press Ctrl+C to stop all services\n')
}, 5000)

// Keep process alive
process.stdin.resume()
