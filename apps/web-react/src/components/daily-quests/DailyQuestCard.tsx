'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Calendar, Flame, Trophy, Sparkles, CheckCircle2, Gift } from 'lucide-react'
import { useDailyQuest } from '@/lib/daily-quests/useDailyQuest'
import { QuestDialog } from '@/components/story/QuestDialog'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface DailyQuestCardProps {
  onComplete?: () => void
}

export function DailyQuestCard({ onComplete }: DailyQuestCardProps) {
  const { dailyQuest, isCompleted, streak, totalCompleted, streakBonus, markCompleted } = useDailyQuest()
  const [showQuestDialog, setShowQuestDialog] = useState(false)

  const handleQuestClick = () => {
    if (!isCompleted && dailyQuest) {
      setShowQuestDialog(true)
    }
  }

  const handleQuestChoice = (choiceId: string) => {
    markCompleted()
    setShowQuestDialog(false)
    onComplete?.()
  }

  if (!dailyQuest) {
    return null
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          className={`relative overflow-hidden border-2 transition-all cursor-pointer ${
            isCompleted
              ? 'bg-green-950/50 border-green-500/50 opacity-75'
              : 'bg-gradient-to-br from-amber-950/80 to-orange-950/80 border-amber-500 hover:border-amber-400 hover:scale-[1.02] hover-glow'
          }`}
          onClick={handleQuestClick}
        >
          {/* Animated background gradient */}
          {!isCompleted && (
            <div className="absolute inset-0 opacity-20 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 blur-2xl"></div>
            </div>
          )}

          {/* Daily Quest Badge */}
          <div className="absolute top-4 right-4 z-10">
            <Badge variant="secondary" className="bg-amber-500 text-amber-950 font-bold border-0 shadow-lg">
              <Calendar className="w-3 h-3 mr-1" />
              DAILY
            </Badge>
          </div>

          <CardHeader className="relative">
            <CardTitle className="text-white flex items-center gap-2 pr-24">
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <span className="text-green-400">Abgeschlossen!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
                  Tägliche Quest
                </>
              )}
            </CardTitle>
            <CardDescription className="text-amber-200">
              {isCompleted ? 'Komm morgen wieder für eine neue Quest!' : 'Schließe heute deine tägliche Quest ab!'}
            </CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-4">
            {/* Quest Info */}
            {!isCompleted && (
              <div className="p-4 bg-black/30 rounded-lg border border-amber-500/30">
                <h4 className="text-lg font-semibold text-white mb-2">{dailyQuest.title.replace('⭐ DAILY QUEST: ', '')}</h4>
                <p className="text-sm text-amber-100/80 line-clamp-2">{dailyQuest.description.split('\n')[0]}</p>
              </div>
            )}

            {/* Rewards */}
            <div className="grid grid-cols-2 gap-3">
              {/* XP Bonus */}
              <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-amber-300 font-semibold">BONUS</span>
                </div>
                <div className="text-2xl font-bold text-amber-400">2x XP</div>
              </div>

              {/* Streak Bonus */}
              <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-orange-300 font-semibold">STREAK</span>
                </div>
                <div className="text-2xl font-bold text-orange-400">{streak} Tage</div>
              </div>
            </div>

            {/* Streak Bonus XP */}
            {streakBonus > 0 && (
              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-purple-300 font-semibold">Streak Bonus</span>
                  </div>
                  <span className="text-xl font-bold text-purple-400">+{streakBonus} XP</span>
                </div>
              </div>
            )}

            {/* Total Completed */}
            <div className="flex items-center justify-between text-sm pt-2 border-t border-amber-500/20">
              <span className="text-amber-200/60">Insgesamt abgeschlossen:</span>
              <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-300">
                {totalCompleted}
              </Badge>
            </div>

            {/* Action Button */}
            {!isCompleted && (
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-lg"
                onClick={handleQuestClick}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Quest starten
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quest Dialog */}
      {dailyQuest && (
        <QuestDialog
          quest={dailyQuest}
          isOpen={showQuestDialog}
          onClose={() => setShowQuestDialog(false)}
          onChoose={handleQuestChoice}
        />
      )}
    </>
  )
}
