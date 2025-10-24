'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, X } from 'lucide-react'

interface IdleReward {
  icon: string
  text: string
  value: number | string
}

interface IdleRewardsModalProps {
  isOpen: boolean
  onClose: () => void
  idleTime: string
  rewards: IdleReward[]
  welcomeMessage: string
}

export function IdleRewardsModal({
  isOpen,
  onClose,
  idleTime,
  rewards,
  welcomeMessage
}: IdleRewardsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="max-w-lg w-full bg-gradient-to-br from-purple-900/95 to-pink-900/95 border-purple-500/30 shadow-2xl">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="text-center mb-4">
            <div className="text-6xl mb-4 animate-bounce">🌙</div>
            <CardTitle className="text-3xl text-white mb-2">
              {welcomeMessage}
            </CardTitle>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              {idleTime} Abwesend
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Rewards List */}
          {rewards.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white text-center mb-4">
                📦 Idle Belohnungen
              </h3>

              <div className="grid gap-3">
                {rewards.map((reward, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/10 rounded-lg border border-white/20 flex items-center justify-between transform transition-all hover:scale-105 animate-in slide-in-from-bottom duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{reward.icon}</span>
                      <span className="text-white font-medium">{reward.text}</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-400/30 text-lg px-3 py-1">
                      {reward.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flavor Text */}
          <div className="p-4 bg-purple-950/50 rounded-lg border border-purple-500/30">
            <p className="text-purple-200 text-center italic">
              "Während du weg warst, hat die Welt sich weitergedreht. Dein BlockBot AI Agent hat fleißig Ressourcen gesammelt, und deine innere Ruhe ist gewachsen."
            </p>
          </div>

          {/* Continue Button */}
          <Button
            size="lg"
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg shadow-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Weiter spielen
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
