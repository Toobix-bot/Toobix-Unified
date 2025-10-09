// Minimal preload for future IPC/use. For now, nothing exposed.
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('ToobixDesktop', {
  version: '0.1.0'
})

