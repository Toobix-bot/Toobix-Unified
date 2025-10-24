// Toobix Desktop Preload
const { contextBridge, ipcRenderer } = require('electron')

// Expose File Manager API
contextBridge.exposeInMainWorld('fileManager', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  scanDirectory: (path) => ipcRenderer.invoke('scan-directory', path),
  organizeDirectory: (path) => ipcRenderer.invoke('organize-directory', path),
  executePlan: (path, plan) => ipcRenderer.invoke('execute-plan', path, plan),
  findDuplicates: (path) => ipcRenderer.invoke('find-duplicates', path),
  lunaCommand: (command) => ipcRenderer.invoke('luna-command', command),
  startProgram: (name) => ipcRenderer.invoke('start-program', name),
  stopProgram: (name) => ipcRenderer.invoke('stop-program', name),
  closeDistractions: () => ipcRenderer.invoke('close-distractions'),
})

// Expose Toobix info
contextBridge.exposeInMainWorld('ToobixDesktop', {
  version: '0.1.0'
})

// Focus Luna input on global shortcut
ipcRenderer.on('focus-luna-input', () => {
  const input = document.getElementById('luna-command')
  if (input) input.focus()
})

