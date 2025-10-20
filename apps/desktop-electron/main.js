let electronModule
try { electronModule = require('electron') } catch (e) {
  try { electronModule = require('node:electron') } catch {}
}
if (!electronModule) {
  console.error('Failed to load electron module. Ensure Electron is installed and used to run this app (electron .).')
  process.exit(1)
}
const { app, BrowserWindow, Tray, Menu, nativeImage, globalShortcut } = electronModule
const path = require('path')
const { setupFileManagerIPC } = require('./file-manager-ipc.js')

let mainWindow = null
let tray = null

function getDashboardPath() {
  // Load the COMMAND PALETTE interface (Life OS!)
  const html = path.resolve(__dirname, 'command-palette.html')
  return 'file://' + html
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#0a0e1a',
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadURL(getDashboardPath())

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createTray() {
  const iconPath = path.resolve(__dirname, 'tray.png')
  let icon
  try { icon = nativeImage.createFromPath(iconPath) } catch { icon = undefined }
  tray = new Tray(icon || nativeImage.createEmpty())
  const menu = Menu.buildFromTemplate([
    { label: 'Öffnen', click: () => { if (!mainWindow) createWindow(); else mainWindow.show() } },
    { type: 'separator' },
    { label: 'Beenden', click: () => app.quit() }
  ])
  tray.setToolTip('Toobix Desktop')
  tray.setContextMenu(menu)
  tray.on('click', () => { if (!mainWindow) createWindow(); else mainWindow.show() })
}

const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
  app.whenReady().then(() => {
    createWindow()
    createTray()

    // Setup File Manager IPC handlers
    setupFileManagerIPC()

    // Register global shortcut: Alt+Space for quick Luna command
    globalShortcut.register('Alt+Space', () => {
      if (mainWindow) {
        mainWindow.show()
        mainWindow.focus()
        mainWindow.webContents.send('focus-luna-input')
      } else {
        createWindow()
      }
    })

    console.log('✅ Toobix Desktop ready!')
  })

  app.on('window-all-closed', () => {
    // Keep tray app alive on macOS, quit elsewhere
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('activate', () => {
    if (mainWindow === null) createWindow()
  })
}
