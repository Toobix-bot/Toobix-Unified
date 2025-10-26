'use client'

import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'

interface XPGainEffectProps {
  amount: number
  onComplete?: () => void
}

export function XPGainEffect({ amount, onComplete }: XPGainEffectProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Fade in
    setTimeout(() => setIsVisible(true), 10)

    // Auto hide after animation
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onComplete?.()
      }, 500)
    }, 2000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${
        isVisible
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-50'
      }`}
    >
      <div className="relative">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-yellow-400/30 blur-3xl rounded-full animate-pulse" />

        {/* Main Card */}
        <div className="relative bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl px-8 py-6 shadow-2xl border-4 border-yellow-300 animate-bounceIn">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-spin-slow">
              <Zap className="w-10 h-10 text-white" fill="white" />
            </div>
            <div>
              <div className="text-sm font-bold text-yellow-100 uppercase tracking-wider">
                XP Gewonnen!
              </div>
              <div className="text-4xl font-black text-white">
                +{amount}
              </div>
            </div>
          </div>
        </div>

        {/* Particle Effects */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-300 rounded-full animate-particle-burst"
              style={{
                animationDelay: `${i * 0.1}s`,
                transform: `rotate(${i * 45}deg)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
