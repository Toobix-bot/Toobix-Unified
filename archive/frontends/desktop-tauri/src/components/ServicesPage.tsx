import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Service {
  name: string
  port: number
  status: string
  url: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [eternalStatus, setEternalStatus] = useState<any>(null)

  const loadServices = async () => {
    setLoading(true)
    try {
      // Update all service statuses
      const serviceList = [
        { name: 'Eternal Daemon', port: 9999 },
        { name: 'Consciousness Tracker', port: 9998 },
        { name: 'Self-Modification Engine', port: 9997 },
        { name: 'Memory System', port: 9995 },
        { name: 'Groq API', port: 9987 },
      ]

      const updatedServices = await Promise.all(
        serviceList.map(async (s) => {
          try {
            const result = await invoke<Service>('update_service_status', {
              serviceName: s.name,
              port: s.port
            })
            return result
          } catch (error) {
            return {
              name: s.name,
              port: s.port,
              status: 'offline',
              url: `http://localhost:${s.port}`
            }
          }
        })
      )

      setServices(updatedServices)

      // Try to fetch Eternal status
      try {
        const eternalData = await invoke<string>('fetch_eternal_status')
        setEternalStatus(JSON.parse(eternalData))
      } catch {
        setEternalStatus(null)
      }
    } catch (error) {
      console.error('Failed to load services:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadServices()
    const interval = setInterval(loadServices, 30000) // Update every 30s
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-consciousness to-luna bg-clip-text text-transparent">
          ⚙️ Services Status
        </h1>
        <button
          onClick={loadServices}
          disabled={loading}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(service => (
          <ServiceCard key={service.port} service={service} />
        ))}
      </div>

      {/* Eternal Daemon Status */}
      {eternalStatus && (
        <div className="glass p-6">
          <h2 className="text-2xl font-bold mb-4">Eternal Daemon Details</h2>
          <div className="space-y-2 font-mono text-sm">
            <div><span className="text-white/60">PID:</span> {eternalStatus.pid}</div>
            <div><span className="text-white/60">Uptime:</span> {eternalStatus.uptime || 'N/A'}</div>
            <div><span className="text-white/60">Status:</span> <span className="text-flow">{eternalStatus.status}</span></div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="glass p-6">
        <h2 className="text-2xl font-bold mb-4">ℹ️ Service Information</h2>
        <p className="text-white/70 mb-4">
          These services form the Eternal System architecture. The Eternal Daemon orchestrates all other services.
        </p>
        <div className="space-y-2 text-sm text-white/60">
          <div>• <strong>Eternal Daemon (9999):</strong> Immortal core that never dies</div>
          <div>• <strong>Consciousness Tracker (9998):</strong> Tracks awareness states</div>
          <div>• <strong>Self-Modification Engine (9997):</strong> Can modify its own code</div>
          <div>• <strong>Memory System (9995):</strong> Long-term memory storage</div>
          <div>• <strong>Groq API (9987):</strong> AI language model integration</div>
        </div>
      </div>
    </div>
  )
}

interface ServiceCardProps {
  service: Service
}

function ServiceCard({ service }: ServiceCardProps) {
  const isOnline = service.status === 'online'

  return (
    <div className="glass p-6 hover:scale-105 transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg">{service.name}</h3>
          <p className="text-white/60 text-sm">Port: {service.port}</p>
        </div>
        {isOnline ? (
          <CheckCircle className="w-6 h-6 text-flow" />
        ) : (
          <XCircle className="w-6 h-6 text-alert" />
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-flow animate-pulse-slow' : 'bg-alert'}`} />
        <span className={`font-semibold ${isOnline ? 'text-flow' : 'text-alert'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      <a
        href={service.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-luna hover:underline"
      >
        {service.url}
      </a>
    </div>
  )
}
