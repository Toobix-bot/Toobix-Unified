'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, ChevronRight, Heart, Brain, Sword, Book, Leaf } from 'lucide-react'

export interface QuestChoice {
  id: string
  text: string
  effects: {
    stat?: 'mut' | 'weisheit' | 'bewusstsein' | 'frieden' | 'liebe'
    value: number
    xp?: number
    description?: string
  }
}

export interface Quest {
  id: string
  title: string
  description: string
  longDescription?: string
  theme: string
  choices: QuestChoice[]
  npcName?: string
  npcAvatar?: string
}

interface QuestDialogProps {
  quest: Quest
  onChoose: (choiceId: string) => void
  isLoading?: boolean
}

const statIcons = {
  mut: { icon: Sword, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  weisheit: { icon: Book, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
  bewusstsein: { icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' },
  frieden: { icon: Leaf, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
  liebe: { icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/20', border: 'border-pink-500/30' }
}

export function QuestDialog({ quest, onChoose, isLoading = false }: QuestDialogProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)

  const handleChoose = (choiceId: string) => {
    setSelectedChoice(choiceId)
    setTimeout(() => {
      onChoose(choiceId)
      setSelectedChoice(null)
    }, 500)
  }

  return (
    <Card className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900/95 to-purple-900/95 border-purple-500/30 shadow-2xl backdrop-blur-lg">
      <CardHeader className="space-y-4">
        {/* Quest Badge */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            {quest.theme}
          </Badge>
          {quest.npcName && (
            <Badge variant="outline" className="text-slate-300 border-slate-600">
              {quest.npcAvatar && <span className="text-2xl mr-2">{quest.npcAvatar}</span>}
              {quest.npcName}
            </Badge>
          )}
        </div>

        {/* Quest Title */}
        <CardTitle className="text-3xl text-white">
          {quest.title}
        </CardTitle>

        {/* Quest Description */}
        <CardDescription className="text-lg text-slate-300">
          {quest.description}
        </CardDescription>

        {/* Long Description (if exists) */}
        {quest.longDescription && (
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <p className="text-slate-300 leading-relaxed italic">
              "{quest.longDescription}"
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-lg text-purple-200 font-medium">
            Was tust du?
          </p>
        </div>

        {/* Choice Cards */}
        <div className="space-y-3">
          {quest.choices.map((choice) => {
            const isSelected = selectedChoice === choice.id
            const statInfo = choice.effects.stat ? statIcons[choice.effects.stat] : null
            const StatIcon = statInfo?.icon

            return (
              <Card
                key={choice.id}
                className={`
                  cursor-pointer transition-all duration-300
                  ${isSelected
                    ? 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-500/50 scale-105'
                    : 'bg-slate-800/70 border-slate-700/50 hover:bg-slate-800 hover:border-purple-500/30 hover:scale-102'
                  }
                `}
                onClick={() => !isLoading && handleChoose(choice.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className={`text-lg font-medium mb-2 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {choice.text}
                      </p>
                      {choice.effects.description && (
                        <p className={`text-sm mb-3 ${isSelected ? 'text-purple-100' : 'text-slate-400'}`}>
                          {choice.effects.description}
                        </p>
                      )}

                      {/* Effects Display */}
                      <div className="flex flex-wrap gap-2">
                        {statInfo && StatIcon && (
                          <Badge
                            variant="secondary"
                            className={`${statInfo.bg} ${statInfo.border} border`}
                          >
                            <StatIcon className={`w-3 h-3 mr-1 ${statInfo.color}`} />
                            <span className={statInfo.color}>
                              {choice.effects.stat} {choice.effects.value > 0 ? '+' : ''}{choice.effects.value}
                            </span>
                          </Badge>
                        )}
                        {choice.effects.xp && (
                          <Badge variant="secondary" className="bg-yellow-500/20 border-yellow-500/30 border">
                            <Sparkles className="w-3 h-3 mr-1 text-yellow-400" />
                            <span className="text-yellow-400">+{choice.effects.xp} XP</span>
                          </Badge>
                        )}
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-6 h-6 transition-transform ${
                        isSelected ? 'text-white translate-x-1' : 'text-slate-500'
                      }`}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-300">Deine Wahl wird verarbeitet...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Example Quest Data for Testing
export const exampleQuest: Quest = {
  id: 'stimme-im-kopf',
  title: 'Die Stimme im Kopf',
  description: 'Du hörst eine Stimme in deinem Inneren. Sie ist mal laut, mal leise. Manchmal fühlt sie sich fremd an, manchmal wie ein Teil von dir.',
  longDescription: 'Die Stimme flüstert: "Folge mir. Ich zeige dir den Weg." Aber welcher Weg? Und wer spricht da überhaupt?',
  theme: 'Identität & Selbst',
  npcName: 'Die innere Stimme',
  npcAvatar: '👁️',
  choices: [
    {
      id: 'folgen',
      text: 'Der Stimme folgen',
      effects: {
        stat: 'mut',
        value: 1,
        xp: 25,
        description: 'Du entscheidest dich, der Stimme zu vertrauen, auch wenn du nicht weißt wohin sie dich führt.'
      }
    },
    {
      id: 'ignorieren',
      text: 'Die Stimme ignorieren',
      effects: {
        stat: 'frieden',
        value: 1,
        xp: 20,
        description: 'Du konzentrierst dich auf die Stille und findest inneren Frieden.'
      }
    },
    {
      id: 'fragen',
      text: 'Die Stimme fragen: "Wer bist du?"',
      effects: {
        stat: 'bewusstsein',
        value: 2,
        xp: 30,
        description: 'Du stellst die entscheidende Frage und beginnst, tiefer zu verstehen.'
      }
    },
    {
      id: 'verstehen',
      text: 'Erkennen, dass die Stimme Teil von dir ist',
      effects: {
        stat: 'weisheit',
        value: 2,
        xp: 35,
        description: 'Eine tiefe Einsicht durchströmt dich: Die Stimme warst immer du selbst.'
      }
    }
  ]
}
