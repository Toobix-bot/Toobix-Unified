'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Sparkles, TrendingUp, Star, Zap } from 'lucide-react'
import { useSound } from '@/lib/sounds/useSound'
import { useEffect } from 'react'
import { ConfettiEffect } from '@/components/effects/ParticleEffect'

interface LevelUpData {
  oldLevel: number
  newLevel: number
  xpGained: number
  statIncreases: {
    stat: string
    amount: number
    icon: string
  }[]
  unlockedFeatures?: string[]
}

interface LevelUpModalProps {
  isOpen: boolean
  onClose: () => void
  levelUpData: LevelUpData
}

export function LevelUpModal({ isOpen, onClose, levelUpData }: LevelUpModalProps) {
  const { play: playLevelUp } = useSound('level-up')

  useEffect(() => {
    if (isOpen) {
      playLevelUp()
    }
  }, [isOpen, playLevelUp])

  if (!isOpen) return null

  return (
    <>
      {/* Confetti Effect */}
      <ConfettiEffect trigger={isOpen} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateY: 180 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="relative overflow-hidden shadow-2xl border-4 border-yellow-500 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                {/* Animated background glow */}
                <div className="absolute inset-0 opacity-30 animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 via-orange-500 to-purple-500 blur-3xl"></div>
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                      initial={{
                        x: Math.random() * 100 + '%',
                        y: '100%',
                        opacity: 0
                      }}
                      animate={{
                        y: '-20%',
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                    />
                  ))}
                </div>

                <CardContent className="relative p-10">
                  {/* Close button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 text-white/60 hover:text-white hover:bg-white/10"
                    onClick={onClose}
                  >
                    <X className="w-5 h-5" />
                  </Button>

                  {/* Header */}
                  <div className="text-center mb-8">
                    {/* Animated Level Badge */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="inline-block mb-6"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500 blur-xl animate-pulse"></div>
                        <div className="relative text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-yellow-500 to-orange-600">
                          {levelUpData.newLevel}
                        </div>
                      </div>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3"
                    >
                      <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                      LEVEL UP!
                      <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl text-yellow-200"
                    >
                      Du hast Level {levelUpData.newLevel} erreicht!
                    </motion.p>
                  </div>

                  {/* XP Gained */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-8"
                  >
                    <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
                      <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-yellow-300">
                          <Zap className="w-6 h-6" />
                          +{levelUpData.xpGained} XP
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Stat Increases */}
                  {levelUpData.statIncreases.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mb-8"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        Stat-Erhöhungen
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {levelUpData.statIncreases.map((stat, index) => (
                          <motion.div
                            key={stat.stat}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                          >
                            <Card className="bg-slate-800/50 border-green-500/30 hover:border-green-500/60 transition-colors">
                              <CardContent className="p-3">
                                <div className="text-center">
                                  <div className="text-2xl mb-1">{stat.icon}</div>
                                  <div className="text-xs text-slate-400 mb-1 capitalize">{stat.stat}</div>
                                  <div className="text-xl font-bold text-green-400">
                                    +{stat.amount}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Unlocked Features */}
                  {levelUpData.unlockedFeatures && levelUpData.unlockedFeatures.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="mb-8"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-purple-400" />
                        Neue Features freigeschaltet
                      </h3>
                      <div className="space-y-2">
                        {levelUpData.unlockedFeatures.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 + index * 0.1 }}
                          >
                            <Badge
                              variant="outline"
                              className="w-full justify-start py-2 px-4 bg-purple-500/20 border-purple-400/50 text-purple-200"
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              {feature}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Continue Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="text-center"
                  >
                    <Button
                      size="lg"
                      onClick={onClose}
                      className="text-xl px-12 py-6 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold shadow-2xl"
                    >
                      Weiter
                    </Button>
                    <p className="text-xs text-slate-500 mt-4">
                      Drücke Enter oder klicke außerhalb um fortzufahren
                    </p>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
