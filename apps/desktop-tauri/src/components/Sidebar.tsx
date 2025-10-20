import { Home, MessageCircle, Briefcase, Heart, Users, DollarSign, Settings, Moon, Book } from 'lucide-react'

interface Props {
  currentPage: string
  onNavigate: (page: string) => void
}

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'luna', icon: MessageCircle, label: 'Luna Chat' },
  { id: 'work', icon: Briefcase, label: 'Work' },
  { id: 'health', icon: Heart, label: 'Health' },
  { id: 'people', icon: Users, label: 'People' },
  { id: 'finance', icon: DollarSign, label: 'Finance' },
  { id: 'dreamscape', icon: Moon, label: 'Dreams' },
  { id: 'stories', icon: Book, label: 'Stories' },
  { id: 'services', icon: Settings, label: 'Services' },
]

export default function Sidebar({ currentPage, onNavigate }: Props) {
  return (
    <div className="w-20 hover:w-64 transition-all duration-300 glass border-r border-white/10 flex flex-col items-center py-6 gap-4 group">
      {menuItems.map(item => {
        const Icon = item.icon
        const isActive = currentPage === item.id

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              w-12 h-12 flex items-center gap-4 rounded-xl transition-all duration-300
              group-hover:w-56 group-hover:justify-start group-hover:px-4
              ${isActive
                ? 'bg-gradient-to-r from-consciousness to-luna shadow-lg scale-105'
                : 'bg-white/5 hover:bg-white/10 hover:scale-110'
              }
            `}
          >
            <Icon className="w-6 h-6 shrink-0" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medium">
              {item.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
