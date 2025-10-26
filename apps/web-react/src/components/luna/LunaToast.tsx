'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface LunaToastProps {
  message: string
  onClose: () => void
  duration?: number
}

export function LunaToast({ message, onClose, duration = 6000 }: LunaToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Fade in
    setTimeout(() => setIsVisible(true), 10)

    // Auto dismiss
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  return (
    <div
      className={`fixed top-6 right-6 z-50 max-w-md transition-all duration-300 ${
        isVisible && !isLeaving
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-8'
      }`}
    >
      <div className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-lg border border-purple-500/40 rounded-2xl shadow-2xl p-5 animate-slideInRight">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl animate-pulse">
              🌙
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Luna</h4>
              <p className="text-xs text-purple-200/60">AI Companion</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-purple-300/60 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <div className="text-sm text-purple-100 leading-relaxed pl-13">
          {message}
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1 bg-purple-950/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 animate-shrink"
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      </div>
    </div>
  )
}
