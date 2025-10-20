/**
 * IPC Handlers for File Manager
 * Connects Electron frontend to File Manager backend
 */

const { ipcMain, dialog } = require('electron')
const path = require('path')

// Import file manager (will be loaded dynamically)
let fileManager = null
let AIFileManager = null

async function initFileManager() {
  if (!fileManager) {
    try {
      // Dynamic import of ES module
      const module = await import('../../packages/file-manager/src/index.ts')
      AIFileManager = module.AIFileManager

      const groqApiKey = process.env.GROQ_API_KEY
      if (!groqApiKey) {
        console.error('❌ GROQ_API_KEY not set')
        throw new Error('GROQ_API_KEY environment variable not set')
      }

      fileManager = new AIFileManager({
        groqApiKey,
        model: 'llama-3.3-70b-versatile',
      })

      console.log('✅ File Manager initialized')
    } catch (error) {
      console.error('❌ Failed to initialize File Manager:', error)
      throw error
    }
  }
  return fileManager
}

/**
 * Setup IPC handlers
 */
function setupFileManagerIPC() {
  // Select folder dialog
  ipcMain.handle('select-folder', async (event) => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    })

    if (result.canceled) {
      return null
    }

    return result.filePaths[0]
  })

  // Scan directory
  ipcMain.handle('scan-directory', async (event, dirPath) => {
    try {
      const manager = await initFileManager()
      const files = await manager.scanDirectory(dirPath)
      return { success: true, files }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  // Organize directory (dry run)
  ipcMain.handle('organize-directory', async (event, dirPath) => {
    try {
      const manager = await initFileManager()
      const plan = await manager.organizeDirectory(dirPath, true)
      return { success: true, plan }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  // Execute plan
  ipcMain.handle('execute-plan', async (event, dirPath, plan) => {
    try {
      const manager = await initFileManager()
      await manager.executePlan(dirPath, plan, false)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  // Find duplicates
  ipcMain.handle('find-duplicates', async (event, dirPath) => {
    try {
      const manager = await initFileManager()
      const files = await manager.scanDirectory(dirPath)

      // Import duplicates module
      const duplicatesModule = await import('../../packages/file-manager/src/features/duplicates.ts')
      const duplicates = duplicatesModule.findDuplicates(files)

      return { success: true, duplicates }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  // Luna command
  ipcMain.handle('luna-command', async (event, command) => {
    try {
      const manager = await initFileManager()

      // Import Luna commands
      const lunaModule = await import('../../packages/file-manager/src/luna-commands.ts')
      const response = await lunaModule.processLunaCommand(command, manager)

      return { success: true, response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  // Program management
  ipcMain.handle('start-program', async (event, programName) => {
    try {
      const programsModule = await import('../../packages/file-manager/src/features/programs.ts')
      await programsModule.startProgram(programName)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('stop-program', async (event, programName) => {
    try {
      const programsModule = await import('../../packages/file-manager/src/features/programs.ts')
      await programsModule.stopProgram(programName)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('close-distractions', async (event) => {
    try {
      const programsModule = await import('../../packages/file-manager/src/features/programs.ts')
      await programsModule.closeDistractions()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  console.log('✅ File Manager IPC handlers registered')
}

module.exports = { setupFileManagerIPC }
