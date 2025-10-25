'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { soundManager } from '@/lib/sounds/sound-manager'
import { Volume2, VolumeX, Volume1 } from 'lucide-react'

export function SoundSettings() {
  const [volume, setVolume] = useState(soundManager.getVolume())
  const [isMuted, setIsMuted] = useState(soundManager.isSoundMuted())

  useEffect(() => {
    // Load initial settings
    setVolume(soundManager.getVolume())
    setIsMuted(soundManager.isSoundMuted())
  }, [])

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    soundManager.setVolume(newVolume)

    // Play test sound
    soundManager.playClickSound()
  }

  const toggleMute = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    soundManager.setMuted(newMuted)
  }

  const testSound = (soundType: 'hover' | 'click' | 'success' | 'quest-complete') => {
    switch (soundType) {
      case 'hover':
        soundManager.playHoverSound()
        break
      case 'click':
        soundManager.playClickSound()
        break
      case 'success':
        soundManager.playSuccessSound()
        break
      case 'quest-complete':
        soundManager.playQuestCompleteSound()
        break
    }
  }

  const volumeIcon = isMuted ? VolumeX : volume > 0.5 ? Volume2 : Volume1

  return (
    <Card className="bg-slate-900/80 border-purple-500/30 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          {volumeIcon({ className: 'w-6 h-6 text-purple-400' })}
          Sound Settings
        </CardTitle>
        <CardDescription className="text-slate-400">
          Manage audio and sound effects
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Mute Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium mb-1">Mute All Sounds</h3>
            <p className="text-sm text-slate-400">Disable all sound effects</p>
          </div>
          <Button
            variant={isMuted ? 'destructive' : 'secondary'}
            onClick={toggleMute}
            className="gap-2"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {isMuted ? 'Unmute' : 'Mute'}
          </Button>
        </div>

        {/* Volume Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Master Volume</h3>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">
              {Math.round(volume * 100)}%
            </Badge>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            disabled={isMuted}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isMuted
                ? '#334155'
                : `linear-gradient(to right, #a855f7 0%, #a855f7 ${volume * 100}%, #334155 ${volume * 100}%, #334155 100%)`
            }}
          />
        </div>

        {/* Quick Volume Presets */}
        <div>
          <h3 className="text-white font-medium mb-3">Quick Presets</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Off', value: 0 },
              { label: 'Low', value: 0.3 },
              { label: 'Med', value: 0.6 },
              { label: 'High', value: 1.0 }
            ].map((preset) => (
              <Button
                key={preset.label}
                variant={Math.abs(volume - preset.value) < 0.05 ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleVolumeChange(preset.value)}
                disabled={isMuted}
                className="text-sm"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Test Sounds */}
        <div>
          <h3 className="text-white font-medium mb-3">Test Sound Effects</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => testSound('hover')}
              disabled={isMuted}
              className="text-slate-300 border-slate-600 hover:bg-slate-800"
            >
              🎵 Hover
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => testSound('click')}
              disabled={isMuted}
              className="text-slate-300 border-slate-600 hover:bg-slate-800"
            >
              🔊 Click
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => testSound('success')}
              disabled={isMuted}
              className="text-slate-300 border-slate-600 hover:bg-slate-800"
            >
              ✨ Success
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => testSound('quest-complete')}
              disabled={isMuted}
              className="text-slate-300 border-slate-600 hover:bg-slate-800"
            >
              🎉 Quest Complete
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
          <p className="text-sm text-purple-200">
            💡 <strong>Procedural Audio:</strong> All sound effects are generated in real-time using Web Audio API.
            No audio files needed!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
