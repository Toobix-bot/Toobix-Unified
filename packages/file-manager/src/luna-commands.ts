/**
 * Luna Voice Commands for File Management
 * Natural language file operations
 */

import { createFileManager, type AIFileManager } from './index'
import { findDuplicates, deleteDuplicates } from './features/duplicates'
import {
  startProgram,
  stopProgram,
  closeDistractions,
  openCodingEnvironment,
  openFolder,
  openFile,
  COMMON_PROGRAMS,
} from './features/programs'

export interface LunaCommand {
  pattern: RegExp
  action: (match: RegExpMatchArray, manager: AIFileManager) => Promise<string>
  description: string
  examples: string[]
}

/**
 * Luna File Management Commands
 */
export const LUNA_FILE_COMMANDS: LunaCommand[] = [
  // Organize commands
  {
    pattern: /organize (?:my )?(.+)/i,
    action: async (match, manager) => {
      const folder = expandPath(match[1])
      const plan = await manager.organizeDirectory(folder, true)

      return `📊 I found ${plan.files.length} files that can be organized into ${Object.keys(plan.structure).length} categories. Say "execute plan" to proceed!`
    },
    description: 'Organize a folder',
    examples: ['organize my downloads', 'organize desktop', 'organize C:\\Documents'],
  },

  // Clean commands
  {
    pattern: /clean(?:\s+up)? (?:my )?(.+)/i,
    action: async (match, manager) => {
      const folder = expandPath(match[1])
      const files = await manager.scanDirectory(folder)
      const duplicates = findDuplicates(files)

      if (duplicates.length === 0) {
        return `✨ Your ${match[1]} is already clean! No duplicates found.`
      }

      const totalWasted = duplicates.reduce((sum, g) => sum + g.wastedSpace, 0)
      return `🧹 Found ${duplicates.length} duplicate groups wasting ${formatBytes(totalWasted)}. Say "delete duplicates" to clean up!`
    },
    description: 'Find and clean duplicates',
    examples: ['clean my downloads', 'clean up desktop'],
  },

  // Find commands
  {
    pattern: /find (?:all )?(.+?) (?:in|on) (?:my )?(.+)/i,
    action: async (match, manager) => {
      const searchTerm = match[1]
      const folder = expandPath(match[2])

      const files = await manager.scanDirectory(folder, `**/*${searchTerm}*`)
      return `🔍 Found ${files.length} files matching "${searchTerm}"`
    },
    description: 'Find files by name',
    examples: ['find images in downloads', 'find all pdfs on desktop'],
  },

  // Program commands
  {
    pattern: /(?:open|start) (.+)/i,
    action: async (match) => {
      const programName = match[1].toLowerCase().replace(/\s+/g, '')

      if (COMMON_PROGRAMS[programName]) {
        await startProgram(programName)
        return `🚀 Started ${COMMON_PROGRAMS[programName].name}!`
      }

      return `❌ I don't know how to start "${match[1]}". Try: vscode, chrome, discord`
    },
    description: 'Start a program',
    examples: ['open vscode', 'start chrome', 'open discord'],
  },

  {
    pattern: /(?:close|stop) (.+)/i,
    action: async (match) => {
      const programName = match[1].toLowerCase().replace(/\s+/g, '')

      if (COMMON_PROGRAMS[programName]) {
        await stopProgram(programName)
        return `🛑 Stopped ${COMMON_PROGRAMS[programName].name}!`
      }

      return `❌ I don't know how to stop "${match[1]}"`
    },
    description: 'Stop a program',
    examples: ['close chrome', 'stop discord'],
  },

  // Focus mode
  {
    pattern: /(?:focus mode|close distractions|i need focus)/i,
    action: async () => {
      await closeDistractions()
      return `🧘 Focus mode activated! Closed all distracting apps.`
    },
    description: 'Close distracting apps',
    examples: ['focus mode', 'close distractions', 'i need focus'],
  },

  // Coding environment
  {
    pattern: /(?:start|open) coding(?: environment)?/i,
    action: async () => {
      await openCodingEnvironment()
      return `💻 Coding environment ready! Opened VS Code and browser.`
    },
    description: 'Open coding setup',
    examples: ['start coding', 'open coding environment'],
  },

  // Open folder
  {
    pattern: /(?:open|show)(?: folder| directory)? (.+)/i,
    action: async (match) => {
      const folder = expandPath(match[1])
      await openFolder(folder)
      return `📁 Opened ${match[1]} in Explorer`
    },
    description: 'Open folder in Explorer',
    examples: ['open downloads', 'show desktop', 'open C:\\Projects'],
  },
]

/**
 * Process Luna command
 */
export async function processLunaCommand(
  command: string,
  manager: AIFileManager
): Promise<string> {
  const normalizedCommand = command.trim().toLowerCase()

  for (const cmd of LUNA_FILE_COMMANDS) {
    const match = normalizedCommand.match(cmd.pattern)
    if (match) {
      try {
        return await cmd.action(match, manager)
      } catch (error) {
        return `❌ Error: ${(error as Error).message}`
      }
    }
  }

  return `❓ I don't understand "${command}". Try: ${LUNA_FILE_COMMANDS.slice(0, 3)
    .map((c) => c.examples[0])
    .join(', ')}`
}

/**
 * Expand common path shortcuts
 */
function expandPath(path: string): string {
  const shortcuts: Record<string, string> = {
    downloads: process.env.USERPROFILE + '\\Downloads',
    desktop: process.env.USERPROFILE + '\\Desktop',
    documents: process.env.USERPROFILE + '\\Documents',
    pictures: process.env.USERPROFILE + '\\Pictures',
    videos: process.env.USERPROFILE + '\\Videos',
  }

  const normalized = path.toLowerCase().replace(/^(my|the)\s+/, '')
  return shortcuts[normalized] || path
}

/**
 * Format bytes to human-readable
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
}

/**
 * Get Luna help message
 */
export function getLunaHelp(): string {
  return `
🌙 Luna File Management Commands:

${LUNA_FILE_COMMANDS.map(
  (cmd) => `
📌 ${cmd.description}
   Examples: ${cmd.examples.join(', ')}
`
).join('\n')}

Say something like "organize my downloads" to get started!
`
}
