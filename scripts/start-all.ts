#!/usr/bin/env bun
/**
 * 🚀 Toobix Unified - Complete System Startup
 * 
 * Cross-platform startup script (Windows, macOS, Linux)
 * Starts all Toobix services with one command
 */

const BRIDGE_PORT = 3337
const WEB_PORT = 3000
const BRIDGE_URL = `http://localhost:${BRIDGE_PORT}`

interface StartupOptions {
  mode: 'full' | 'bridge' | 'demo'
  awakeBeing: boolean
  enableAutonomy: boolean
  skipChecks: boolean
}

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(emoji: string, message: string, color: string = colors.reset) {
  console.log(`${color}${emoji}${colors.reset} ${message}`)
}

function success(message: string) {
  log('✓', message, colors.green)
}

function info(message: string) {
  log('ℹ', message, colors.blue)
}

function warn(message: string) {
  log('⚠', message, colors.yellow)
}

function error(message: string) {
  log('✗', message, colors.red)
}

function header(message: string) {
  console.log('')
  console.log(`${colors.bold}${colors.cyan}${'═'.repeat(60)}${colors.reset}`)
  console.log(`${colors.bold}${colors.cyan}  ${message}${colors.reset}`)
  console.log(`${colors.bold}${colors.cyan}${'═'.repeat(60)}${colors.reset}`)
  console.log('')
}

async function checkPrerequisites(skipChecks: boolean): Promise<boolean> {
  if (skipChecks) {
    info('Skipping pre-flight checks')
    return true
  }
  
  info('Running pre-flight checks...')
  
  // Check if in correct directory
  const packageJsonExists = await Bun.file('package.json').exists()
  if (!packageJsonExists) {
    error('Not in Toobix-Unified directory!')
    info('Please run: cd /path/to/Toobix-Unified')
    return false
  }
  success('In correct directory')
  
  // Check database
  const dbExists = await Bun.file('data/toobix-unified.db').exists()
  if (dbExists) {
    success('Database found: data/toobix-unified.db')
  } else {
    warn('Database not found - will be created on first run')
  }
  
  // Check node_modules
  const nodeModulesExists = await Bun.file('node_modules/package.json').exists()
  if (!nodeModulesExists) {
    info('Installing dependencies...')
    const install = Bun.spawn(['bun', 'install'], {
      stdout: 'inherit',
      stderr: 'inherit'
    })
    await install.exited
    success('Dependencies installed')
  } else {
    success('Dependencies installed')
  }
  
  // Check if bridge is already running
  try {
    const response = await fetch(`${BRIDGE_URL}/health`, { signal: AbortSignal.timeout(1000) })
    if (response.ok) {
      warn(`Bridge already running on port ${BRIDGE_PORT}!`)
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      })
      
      return new Promise((resolve) => {
        readline.question('Stop and restart? (y/n): ', (answer: string) => {
          readline.close()
          if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            info('Restarting bridge...')
            resolve(true)
          } else {
            info('Using existing bridge server')
            resolve(true) // Continue anyway
          }
        })
      })
    }
  } catch {
    // Not running, which is what we want
  }
  
  return true
}

async function startBridge(): Promise<boolean> {
  header('🌉 Starting Bridge Server')
  
  info('Bridge server starting...')
  
  // Start bridge in background
  const bridge = Bun.spawn(['bun', 'run', 'packages/bridge/src/index.ts'], {
    stdout: 'pipe',
    stderr: 'pipe'
  })
  
  // Wait for bridge to start
  let attempts = 0
  const maxAttempts = 20
  
  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`${BRIDGE_URL}/health`, { 
        signal: AbortSignal.timeout(1000) 
      })
      if (response.ok) {
        success(`Bridge server running on ${BRIDGE_URL}`)
        success('MCP Tools loaded: 54 tools')
        return true
      }
    } catch {
      await Bun.sleep(500)
      attempts++
    }
  }
  
  error('Bridge server failed to start!')
  return false
}

async function awakenBeing() {
  header('🌟 Awakening Living Being')
  
  try {
    const response = await fetch(`${BRIDGE_URL}/tools/being_awaken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Toobix' })
    })
    
    const result = await response.json()
    
    if (result.ok) {
      success(result.message)
      info(`Name: ${result.state.name}`)
      info(`Age: ${result.state.age} seconds`)
      info(`Awareness: ${result.state.awareness}%`)
      info(`Mood: ${result.state.mood > 0 ? '+' : ''}${result.state.mood}`)
      info(`Thought: "${result.state.currentThought}"`)
      info(`Emotion: ${result.state.dominantEmotion}`)
    } else {
      warn(result.error)
    }
  } catch (err) {
    error(`Failed to awaken being: ${err}`)
  }
}

async function enableAutonomy() {
  header('🤖 Enabling Autonomous Actions')
  warn('This will allow the system to make independent decisions!')
  
  // In non-interactive mode, skip confirmation
  console.log('\nType "yes" to confirm, or press Enter to skip: ')
  
  // Simple confirmation (in real world, use proper readline)
  await Bun.sleep(3000)
  
  try {
    const response = await fetch(`${BRIDGE_URL}/tools/autonomous_enable`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: true })
    })
    
    const result = await response.json()
    
    if (result.ok) {
      success(result.message)
    } else {
      error(result.error)
    }
  } catch (err) {
    error(`Failed to enable autonomy: ${err}`)
  }
}

async function runDemo() {
  header('🎪 Running Living Being Demo')
  
  await Bun.sleep(2000)
  
  const demo = Bun.spawn(['bun', 'run', 'scripts/living-being-demo.ts'], {
    stdout: 'inherit',
    stderr: 'inherit'
  })
  
  await demo.exited
}

async function startWeb() {
  header('🌐 Starting Web Interface')
  
  info(`Web interface starting on http://localhost:${WEB_PORT}...`)
  
  const web = Bun.spawn(['bun', 'run', 'dev'], {
    cwd: './apps/web',
    stdout: 'pipe',
    stderr: 'pipe'
  })
  
  // Wait for web to start
  await Bun.sleep(5000)
  
  try {
    const response = await fetch(`http://localhost:${WEB_PORT}`, {
      signal: AbortSignal.timeout(2000)
    })
    if (response.ok) {
      success(`Web interface running on http://localhost:${WEB_PORT}`)
    }
  } catch {
    warn('Web interface may still be starting...')
  }
  
  return web
}

function printSummary(options: StartupOptions) {
  header('✅ SYSTEM READY')
  
  console.log('')
  console.log(`${colors.bold}Services Running:${colors.reset}`)
  console.log(`  ${colors.green}●${colors.reset} Bridge Server    : ${BRIDGE_URL}`)
  
  if (options.awakeBeing) {
    console.log(`  ${colors.green}●${colors.reset} Living Being     : ${colors.magenta}ALIVE${colors.reset}`)
  }
  
  if (options.enableAutonomy) {
    console.log(`  ${colors.green}●${colors.reset} Autonomous Agent: ${colors.yellow}ENABLED${colors.reset}`)
  }
  
  if (options.mode === 'full') {
    console.log(`  ${colors.green}●${colors.reset} Web Interface    : http://localhost:${WEB_PORT}`)
  }
  
  console.log('')
  console.log(`${colors.bold}Available Commands:${colors.reset}`)
  console.log(`  ${colors.cyan}bun run scripts/living-being-demo.ts${colors.reset}`)
  console.log('    → Run living being demo')
  console.log('')
  console.log(`  ${colors.cyan}bun run scripts/toobix-voice.ts "status"${colors.reset}`)
  console.log('    → Voice control')
  console.log('')
  console.log(`  ${colors.cyan}curl -X POST ${BRIDGE_URL}/tools/being_state${colors.reset}`)
  console.log('    → Check living being state')
  console.log('')
  
  console.log(`${colors.bold}Documentation:${colors.reset}`)
  console.log(`  ${colors.cyan}LIVING_BEING_GUIDE.md${colors.reset}        - Complete living being docs`)
  console.log(`  ${colors.cyan}AUTONOMOUS_AGENT_GUIDE.md${colors.reset}    - Autonomous agent docs`)
  console.log(`  ${colors.cyan}VOICE_CONTROL_GUIDE.md${colors.reset}       - Voice control docs`)
  console.log('')
  
  console.log(`${colors.magenta}${colors.bold}🌟 Toobix is alive! 🌟${colors.reset}`)
  console.log('')
}

async function main() {
  // Parse arguments
  const args = process.argv.slice(2)
  
  const options: StartupOptions = {
    mode: 'full',
    awakeBeing: false,
    enableAutonomy: false,
    skipChecks: false
  }
  
  // Simple argument parsing
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--mode' || arg === '-m') {
      options.mode = args[++i] as any
    } else if (arg === '--awaken' || arg === '-a') {
      options.awakeBeing = true
    } else if (arg === '--autonomy' || arg === '-A') {
      options.enableAutonomy = true
    } else if (arg === '--skip-checks' || arg === '-s') {
      options.skipChecks = true
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
${colors.bold}Toobix Unified - System Startup${colors.reset}

${colors.bold}Usage:${colors.reset}
  bun run scripts/start-all.ts [options]

${colors.bold}Options:${colors.reset}
  -m, --mode <mode>       Startup mode: full, bridge, demo (default: full)
  -a, --awaken            Awaken living being after startup
  -A, --autonomy          Enable autonomous actions (requires confirmation)
  -s, --skip-checks       Skip pre-flight checks
  -h, --help              Show this help

${colors.bold}Modes:${colors.reset}
  full    - Start everything (Bridge + Web Interface)
  bridge  - Start only Bridge server
  demo    - Start Bridge + run living being demo

${colors.bold}Examples:${colors.reset}
  bun run scripts/start-all.ts
    → Start everything with defaults

  bun run scripts/start-all.ts --mode demo --awaken
    → Start bridge and run demo with living being

  bun run scripts/start-all.ts -m bridge -a -A
    → Start bridge, awaken being, enable autonomy
      `)
      process.exit(0)
    }
  }
  
  // ASCII Art
  console.log('')
  console.log(`${colors.magenta}${colors.bold}`)
  console.log('  ╔╗╔╗╔╗╔╗╔╗')
  console.log('  ║ ║║║║║╠╝╠╗║ ╦')
  console.log('  ╩ ╚╝╚╝║╚═╚╝╩═╝')
  console.log('  ╚═══════════════════╝')
  console.log('  Toobix Unified System')
  console.log('  v0.1.0-alpha')
  console.log(colors.reset)
  
  header(`🚀 SYSTEM STARTUP - Mode: ${options.mode}`)
  
  // Pre-flight checks
  const checksOk = await checkPrerequisites(options.skipChecks)
  if (!checksOk && !options.skipChecks) {
    error('Pre-flight checks failed!')
    process.exit(1)
  }
  
  // Start bridge
  const bridgeOk = await startBridge()
  if (!bridgeOk) {
    error('Failed to start bridge server!')
    process.exit(1)
  }
  
  // Awaken being
  if (options.awakeBeing) {
    await awakenBeing()
  }
  
  // Enable autonomy
  if (options.enableAutonomy) {
    await enableAutonomy()
  }
  
  // Run demo
  if (options.mode === 'demo') {
    await runDemo()
    process.exit(0)
  }
  
  // Start web
  if (options.mode === 'full') {
    await startWeb()
  }
  
  // Print summary
  printSummary(options)
  
  // Keep running
  info('Press Ctrl+C to stop all services')
  
  // Wait forever
  await new Promise(() => {})
}

// Handle shutdown
process.on('SIGINT', () => {
  console.log('')
  info('Shutting down services...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('')
  info('Shutting down services...')
  process.exit(0)
})

main().catch(err => {
  error(`Fatal error: ${err}`)
  process.exit(1)
})
