import { useEffect, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import Sidebar from './components/Sidebar'
import CommandPalette from './components/CommandPalette'
import Dashboard from './components/Dashboard'
import LunaChat from './components/LunaChat'
import ServicesPage from './components/ServicesPage'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)

  useEffect(() => {
    // Listen for global shortcut event from Rust backend
    const unlisten = listen('focus-command-palette', () => {
      setIsPaletteOpen(true)
    })

    // Listen for navigation events from system tray
    const unlistenNav = listen<string>('navigate-to', (event) => {
      setCurrentPage(event.payload)
    })

    return () => {
      unlisten.then(fn => fn())
      unlistenNav.then(fn => fn())
    }
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'luna':
        return <LunaChat />
      case 'services':
        return <ServicesPage />
      case 'work':
        return <div className="p-8"><h1 className="text-3xl font-bold">💼 Work Module</h1><p className="text-white/60 mt-4">Coming soon...</p></div>
      case 'health':
        return <div className="p-8"><h1 className="text-3xl font-bold">💪 Health Module</h1><p className="text-white/60 mt-4">Coming soon...</p></div>
      case 'people':
        return <div className="p-8"><h1 className="text-3xl font-bold">👥 People Module</h1><p className="text-white/60 mt-4">Coming soon...</p></div>
      case 'finance':
        return <div className="p-8"><h1 className="text-3xl font-bold">💰 Finance Module</h1><p className="text-white/60 mt-4">Coming soon...</p></div>
      case 'dreamscape':
        return <div className="p-8"><h1 className="text-3xl font-bold">🌙 Dreamscape</h1><p className="text-white/60 mt-4">Coming soon...</p></div>
      case 'stories':
        return <div className="p-8"><h1 className="text-3xl font-bold">📖 Stories</h1><p className="text-white/60 mt-4">Coming soon...</p></div>
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onNavigate={setCurrentPage}
      />
    </div>
  )
}

export default App
