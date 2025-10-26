'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Achievement, AchievementCategory, RARITY_COLORS, RARITY_NAMES, ACHIEVEMENTS } from '@/lib/achievements/achievement-types'
import { useAchievements } from '@/lib/achievements/useAchievements'
import { Lock, Trophy, Sparkles } from 'lucide-react'

export function AchievementPanel() {
  const { allAchievements, unlockedAchievements, completionPercentage } = useAchievements()

  const isUnlocked = (achievementId: string) => {
    return unlockedAchievements.some(a => a.id === achievementId)
  }

  const getAchievementsByCategory = (category: AchievementCategory) => {
    return allAchievements.filter(a => a.category === category)
  }

  const categories: { key: AchievementCategory; label: string; icon: string }[] = [
    { key: 'exploration', label: 'Erkundung', icon: '🗺️' },
    { key: 'story', label: 'Geschichte', icon: '📖' },
    { key: 'progression', label: 'Fortschritt', icon: '⭐' },
    { key: 'wisdom', label: 'Weisheit', icon: '🧙' },
    { key: 'social', label: 'Sozial', icon: '👥' },
    { key: 'hidden', label: 'Versteckt', icon: '❓' }
  ]

  const renderAchievement = (achievement: Achievement) => {
    const unlocked = isUnlocked(achievement.id)
    const rarityColor = RARITY_COLORS[achievement.rarity]
    const rarityName = RARITY_NAMES[achievement.rarity]

    // Don't show hidden achievements if not unlocked
    if (achievement.hidden && !unlocked) {
      return (
        <div
          key={achievement.id}
          className="p-4 rounded-lg border-2 border-dashed border-slate-700 bg-slate-900/50 opacity-50"
        >
          <div className="flex items-center gap-3">
            <div className="text-4xl opacity-30">
              <Lock className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-500">???</h4>
              <p className="text-sm text-slate-600">Verstecktes Achievement</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        key={achievement.id}
        className={`p-4 rounded-lg border-2 transition-all ${
          unlocked
            ? 'border-2 bg-gradient-to-br from-slate-800 to-slate-900 hover:scale-105 cursor-pointer'
            : 'border-slate-700/50 bg-slate-900/30 opacity-60'
        }`}
        style={unlocked ? { borderColor: rarityColor } : {}}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`text-4xl ${unlocked ? '' : 'opacity-30 grayscale'}`}>
            {achievement.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className={`font-semibold ${unlocked ? 'text-white' : 'text-slate-500'}`}>
                {achievement.name}
              </h4>
              {unlocked && (
                <Trophy className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              )}
            </div>

            <p className={`text-sm mb-2 ${unlocked ? 'text-slate-300' : 'text-slate-600'}`}>
              {achievement.description}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              <Badge
                variant="outline"
                className="text-xs"
                style={unlocked ? {
                  backgroundColor: `${rarityColor}20`,
                  borderColor: rarityColor,
                  color: rarityColor
                } : {}}
              >
                {rarityName}
              </Badge>

              {achievement.reward.xp && (
                <Badge variant="outline" className="text-xs bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
                  +{achievement.reward.xp} XP
                </Badge>
              )}

              {achievement.reward.title && (
                <Badge variant="outline" className="text-xs bg-blue-500/10 border-blue-500/30 text-blue-400">
                  👑 {achievement.reward.title}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-slate-900/80 border-purple-500/30 backdrop-blur-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Achievements
            </CardTitle>
            <CardDescription className="text-slate-400">
              {unlockedAchievements.length} / {ACHIEVEMENTS.length} freigeschaltet
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{completionPercentage}%</div>
            <div className="text-xs text-slate-400">Fortschritt</div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="mt-4">
          <Progress value={completionPercentage} className="h-3 bg-slate-800" />
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6 bg-slate-800/50">
            <TabsTrigger value="all" className="text-xs">
              🏆 Alle
            </TabsTrigger>
            {categories.map(cat => (
              <TabsTrigger key={cat.key} value={cat.key} className="text-xs">
                {cat.icon}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* All Achievements */}
          <TabsContent value="all" className="space-y-3 max-h-[600px] overflow-y-auto">
            {allAchievements
              .filter(a => !a.hidden || isUnlocked(a.id))
              .map(achievement => renderAchievement(achievement))}
          </TabsContent>

          {/* Category Tabs */}
          {categories.map(cat => (
            <TabsContent key={cat.key} value={cat.key} className="space-y-3 max-h-[600px] overflow-y-auto">
              {getAchievementsByCategory(cat.key).length > 0 ? (
                getAchievementsByCategory(cat.key).map(achievement => renderAchievement(achievement))
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Keine Achievements in dieser Kategorie</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
