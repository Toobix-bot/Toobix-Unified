/**
 * Program Management
 * Start, stop, and manage Windows applications
 */

import { exec, spawn } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface Program {
  name: string
  path?: string
  processName?: string
  running?: boolean
  pid?: number
}

/**
 * Common programs registry
 */
export const COMMON_PROGRAMS: Record<string, Program> = {
  vscode: {
    name: 'Visual Studio Code',
    path: 'code',
    processName: 'Code.exe',
  },
  chrome: {
    name: 'Google Chrome',
    path: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    processName: 'chrome.exe',
  },
  notepad: {
    name: 'Notepad',
    path: 'notepad',
    processName: 'notepad.exe',
  },
  explorer: {
    name: 'File Explorer',
    path: 'explorer',
    processName: 'explorer.exe',
  },
  discord: {
    name: 'Discord',
    path: '%LOCALAPPDATA%\\Discord\\Update.exe --processStart Discord.exe',
    processName: 'Discord.exe',
  },
}

/**
 * Check if program is running
 */
export async function isProgramRunning(processName: string): Promise<boolean> {
  try {
    const { stdout } = await execAsync(`tasklist /FI "IMAGENAME eq ${processName}"`)
    return stdout.toLowerCase().includes(processName.toLowerCase())
  } catch (error) {
    return false
  }
}

/**
 * Start a program
 */
export async function startProgram(program: Program | string, args: string[] = []): Promise<void> {
  const prog = typeof program === 'string' ? COMMON_PROGRAMS[program] : program

  if (!prog || !prog.path) {
    throw new Error('Program not found or path not specified')
  }

  console.log(`🚀 Starting ${prog.name}...`)

  return new Promise((resolve, reject) => {
    const child = spawn(prog.path!, args, {
      detached: true,
      stdio: 'ignore',
      shell: true,
    })

    child.on('error', (error) => {
      console.error(`❌ Failed to start ${prog.name}:`, error)
      reject(error)
    })

    child.unref()
    console.log(`✅ Started ${prog.name}`)
    resolve()
  })
}

/**
 * Stop a program
 */
export async function stopProgram(program: Program | string, force: boolean = false): Promise<void> {
  const prog = typeof program === 'string' ? COMMON_PROGRAMS[program] : program

  if (!prog || !prog.processName) {
    throw new Error('Program not found or process name not specified')
  }

  console.log(`🛑 Stopping ${prog.name}...`)

  try {
    const command = force
      ? `taskkill /F /IM "${prog.processName}"`
      : `taskkill /IM "${prog.processName}"`

    await execAsync(command)
    console.log(`✅ Stopped ${prog.name}`)
  } catch (error) {
    console.error(`❌ Failed to stop ${prog.name}:`, error)
    throw error
  }
}

/**
 * Get list of running programs
 */
export async function getRunningPrograms(): Promise<Program[]> {
  const programs: Program[] = []

  for (const [key, program] of Object.entries(COMMON_PROGRAMS)) {
    if (program.processName) {
      const running = await isProgramRunning(program.processName)
      programs.push({
        ...program,
        running,
      })
    }
  }

  return programs
}

/**
 * Open file with default program
 */
export async function openFile(path: string): Promise<void> {
  console.log(`📂 Opening: ${path}`)

  try {
    await execAsync(`start "" "${path}"`)
    console.log(`✅ Opened ${path}`)
  } catch (error) {
    console.error(`❌ Failed to open ${path}:`, error)
    throw error
  }
}

/**
 * Open folder in Explorer
 */
export async function openFolder(path: string): Promise<void> {
  console.log(`📁 Opening folder: ${path}`)

  try {
    await execAsync(`explorer "${path}"`)
    console.log(`✅ Opened folder ${path}`)
  } catch (error) {
    console.error(`❌ Failed to open folder ${path}:`, error)
    throw error
  }
}

/**
 * Batch operations: Close all distractions
 */
export async function closeDistractions(): Promise<void> {
  console.log(`🧘 Closing distracting apps...`)

  const distractions = ['discord', 'chrome'] // Add more as needed

  for (const app of distractions) {
    try {
      const program = COMMON_PROGRAMS[app]
      const running = program.processName ? await isProgramRunning(program.processName) : false

      if (running) {
        await stopProgram(program)
      }
    } catch (error) {
      console.warn(`⚠️  Could not close ${app}`)
    }
  }

  console.log(`✅ Distractions closed - Focus mode activated!`)
}

/**
 * Batch operations: Open coding environment
 */
export async function openCodingEnvironment(projectPath?: string): Promise<void> {
  console.log(`💻 Opening coding environment...`)

  try {
    // Start VS Code
    if (projectPath) {
      await startProgram('vscode', [projectPath])
    } else {
      await startProgram('vscode')
    }

    // Start browser (localhost)
    await startProgram('chrome', ['http://localhost:3000'])

    console.log(`✅ Coding environment ready!`)
  } catch (error) {
    console.error(`❌ Failed to open coding environment:`, error)
  }
}
