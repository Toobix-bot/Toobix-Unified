import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'

interface Command {
  id: string
  icon: string
  title: string
  description: string
  action: () => void
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onNavigate: (page: string) => void
}

export default function CommandPalette({ isOpen, onClose, onNavigate }: Props) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: Command[] = [
    {
      id: 'dashboard',
      icon: '🏠',
      title: 'Dashboard',
      description: 'Go to dashboard',
      action: () => { onNavigate('dashboard'); onClose() }
    },
    {
      id: 'luna',
      icon: '🌙',
      title: 'Talk to Luna',
      description: 'Open Luna chat',
      action: () => { onNavigate('luna'); onClose() }
    },
    {
      id: 'work',
      icon: '💼',
      title: 'Work & Tasks',
      description: 'View your tasks and projects',
      action: () => { onNavigate('work'); onClose() }
    },
    {
      id: 'health',
      icon: '💪',
      title: 'Health & Energy',
      description: 'Track energy and flow sessions',
      action: () => { onNavigate('health'); onClose() }
    },
    {
      id: 'people',
      icon: '👥',
      title: 'People',
      description: 'Manage your relationships',
      action: () => { onNavigate('people'); onClose() }
    },
    {
      id: 'finance',
      icon: '💰',
      title: 'Finance',
      description: 'Budget and transactions',
      action: () => { onNavigate('finance'); onClose() }
    },
    {
      id: 'services',
      icon: '⚙️',
      title: 'Services Status',
      description: 'View system services',
      action: () => { onNavigate('services'); onClose() }
    },
    {
      id: 'dreamscape',
      icon: '🌙',
      title: 'Dreamscape',
      description: 'Dream canvas and journal',
      action: () => { onNavigate('dreamscape'); onClose() }
    },
    {
      id: 'stories',
      icon: '📖',
      title: 'Stories',
      description: 'Your story library',
      action: () => { onNavigate('stories'); onClose() }
    },
  ]

  const filteredCommands = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black/50 backdrop-blur-sm animate-slide-in"
      onClick={onClose}
    >
      <div
        className="glass w-[600px] max-h-[500px] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <Search className="w-5 h-5 text-white/40" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0) }}
            placeholder="🔍 Type a command or ask Luna..."
            className="flex-1 bg-transparent text-white text-lg outline-none placeholder-white/40"
          />
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-[400px] p-2">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-white/40">
              No commands found
            </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <button
                key={cmd.id}
                onClick={() => cmd.action()}
                className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition-all ${
                  index === selectedIndex
                    ? 'bg-consciousness/20 border border-consciousness/50 translate-x-1'
                    : 'hover:bg-white/5'
                }`}
              >
                <span className="text-2xl">{cmd.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-white">{cmd.title}</div>
                  <div className="text-sm text-white/50">{cmd.description}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
