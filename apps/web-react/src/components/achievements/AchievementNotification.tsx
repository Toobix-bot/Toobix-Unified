'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Achievement, RARITY_COLORS, RARITY_NAMES } from '@/lib/achievements/achievement-types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Sparkles } from 'lucide-react'
import { useSound } from '@/lib/sounds/useSound'
import { useEffect } from 'react'
import { ConfettiEffect } from '@/components/effects/ParticleEffect'

interface AchievementNotificationProps {
  achievement: Achievement | null
  onDismiss: () => void
}

export function AchievementNotification({ achievement, onDismiss }: AchievementNotificationProps) {
  const { play: playSuccess } = useSound('success')
  const { play: playLevelUp } = useSound('level-up')

  useEffect(() => {
    if (achievement) {
      // Play sound based on rarity
      if (achievement.rarity === 'legendary' || achievement.rarity === 'epic') {
        playLevelUp()
      } else {
        playSuccess()
      }
    }
  }, [achievement, playSuccess, playLevelUp])

  if (!achievement) return null

  const rarityColor = RARITY_COLORS[achievement.rarity]
  const rarityName = RARITY_NAMES[achievement.rarity]

  return (
    <>
      {/* Confetti for rare+ achievements */}
      {(achievement.rarity === 'rare' || achievement.rarity === 'epic' || achievement.rarity === 'legendary') && (
        <ConfettiEffect trigger={true} />
      )}

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] max-w-md w-full px-4"
        >
          <Card
            className="relative overflow-hidden shadow-2xl animate-glow"
            style={{
              borderColor: rarityColor,
              borderWidth: '2px',
              background: `linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.9) 100%)`
            }}
          >
            {/* Animated background glow */}
            <div
              className="absolute inset-0 opacity-20 animate-pulse"
              style={{
                background: `radial-gradient(circle at center, ${rarityColor} 0%, transparent 70%)`
              }}
            />

            <CardContent className="relative p-6">
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-white/60 hover:text-white hover:bg-white/10"
                onClick={onDismiss}
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Header */}
              <div className="text-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-6xl mb-3 inline-block"
                >
                  {achievement.icon}
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                  Achievement Unlocked!
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                </h3>

                <Badge
                  variant="secondary"
                  className="text-sm font-semibold"
                  style={{
                    backgroundColor: `${rarityColor}40`,
                    borderColor: rarityColor,
                    color: rarityColor
                  }}
                >
                  {rarityName}
                </Badge>
              </div>

              {/* Achievement details */}
              <div className="text-center mb-4">
                <h4 className="text-xl font-bold text-white mb-2">
                  {achievement.name}
                </h4>
                <p className="text-sm text-gray-300">
                  {achievement.description}
                </p>
              </div>

              {/* Rewards */}
              {achievement.reward && (
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-xs text-gray-400 mb-2 text-center font-semibold uppercase tracking-wide">
                    Belohnungen
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {achievement.reward.xp && (
                      <Badge variant="outline" className="bg-yellow-500/20 border-yellow-500/50 text-yellow-300">
                        ⚡ +{achievement.reward.xp} XP
                      </Badge>
                    )}
                    {achievement.reward.stat && achievement.reward.statValue && (
                      <Badge variant="outline" className="bg-purple-500/20 border-purple-500/50 text-purple-300">
                        📊 +{achievement.reward.statValue} {achievement.reward.stat}
                      </Badge>
                    )}
                    {achievement.reward.title && (
                      <Badge variant="outline" className="bg-blue-500/20 border-blue-500/50 text-blue-300">
                        👑 Titel: {achievement.reward.title}
                      </Badge>
                    )}
                    {achievement.reward.badge && (
                      <Badge variant="outline" className="bg-green-500/20 border-green-500/50 text-green-300">
                        🏅 Badge: {achievement.reward.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Footer hint */}
              <div className="mt-4 text-center text-xs text-gray-500">
                Drücke X oder warte 5 Sekunden
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
