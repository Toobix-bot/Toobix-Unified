import { useEffect, useState } from 'react'
import { Activity, Zap, Heart, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-consciousness to-luna bg-clip-text text-transparent">
          Dashboard
        </h1>
        <div className="text-right">
          <div className="text-3xl font-bold">{formatTime(currentTime)}</div>
          <div className="text-white/60 text-sm">{formatDate(currentTime)}</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Activity className="w-8 h-8" />}
          label="Tasks Today"
          value="0"
          color="consciousness"
        />
        <StatCard
          icon={<Zap className="w-8 h-8" />}
          label="Energy Level"
          value="80%"
          color="flow"
        />
        <StatCard
          icon={<Heart className="w-8 h-8" />}
          label="Flow Time"
          value="0m"
          color="alert"
        />
        <StatCard
          icon={<TrendingUp className="w-8 h-8" />}
          label="Growth"
          value="+12%"
          color="luna"
        />
      </div>

      {/* Quick Actions */}
      <div className="glass p-6">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary">⌨️ Command Palette (Alt+Space)</button>
          <button className="btn-secondary">💬 Talk to Luna</button>
          <button className="btn-secondary">🎯 Start Focus Session</button>
          <button className="btn-secondary">➕ Add Task</button>
          <button className="btn-secondary">🧘 Meditate</button>
        </div>
      </div>

      {/* Today's Insights */}
      <div className="glass p-6">
        <h2 className="text-2xl font-bold mb-4">Today's Insights</h2>
        <p className="text-white/70 text-lg">
          🌟 You're off to a great start! The Eternal Daemon is running and all systems are ready.
        </p>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  color: 'consciousness' | 'flow' | 'alert' | 'luna'
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    consciousness: 'text-consciousness',
    flow: 'text-flow',
    alert: 'text-alert',
    luna: 'text-luna',
  }

  return (
    <div className="glass p-6 hover:scale-105 transition-transform duration-300">
      <div className={`${colorClasses[color]} mb-3`}>{icon}</div>
      <div className="text-white/60 text-sm mb-1">{label}</div>
      <div className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</div>
    </div>
  )
}
