'use client'

import { useEffect, useCallback, useRef } from 'react'
import { soundManager, SoundEffect } from './sound-manager'

interface UseSoundOptions {
  volume?: number
  playbackRate?: number
  enabled?: boolean
}

interface UseSoundReturn {
  play: () => void
  isPlaying: boolean
}

/**
 * React Hook for playing sound effects
 *
 * @example
 * const { play: playClick } = useSound('click')
 * <button onClick={playClick}>Click me</button>
 */
export function useSound(soundName: SoundEffect, options: UseSoundOptions = {}): UseSoundReturn {
  const isPlayingRef = useRef(false)
  const enabled = options.enabled !== false

  useEffect(() => {
    // Resume audio context on first interaction
    const resumeAudio = async () => {
      await soundManager.resume()
    }

    if (enabled) {
      document.addEventListener('click', resumeAudio, { once: true })
      return () => document.removeEventListener('click', resumeAudio)
    }
  }, [enabled])

  const play = useCallback(() => {
    if (!enabled) return

    isPlayingRef.current = true

    // Use procedural sounds
    switch (soundName) {
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
      case 'level-up':
        soundManager.playLevelUpSound()
        break
      case 'notification':
        soundManager.playNotificationSound()
        break
      case 'page-transition':
        soundManager.playPageTransitionSound()
        break
      case 'sparkle':
        soundManager.playSparkleSound()
        break
      default:
        soundManager.playClickSound()
    }

    // Reset playing state after short delay
    setTimeout(() => {
      isPlayingRef.current = false
    }, 100)
  }, [soundName, enabled])

  return {
    play,
    isPlaying: isPlayingRef.current
  }
}

/**
 * Hook for hover sound effects
 * Automatically plays on mouseEnter
 */
export function useHoverSound(enabled: boolean = true) {
  const { play } = useSound('hover', { enabled })

  const onMouseEnter = useCallback(() => {
    if (enabled) {
      play()
    }
  }, [play, enabled])

  return { onMouseEnter }
}

/**
 * Hook for click sound effects
 * Automatically plays on click
 */
export function useClickSound(enabled: boolean = true) {
  const { play } = useSound('click', { enabled })

  const onClick = useCallback((e?: React.MouseEvent) => {
    if (enabled) {
      play()
    }
  }, [play, enabled])

  return { onClick }
}

/**
 * Hook for managing global sound settings
 */
export function useSoundSettings() {
  const setVolume = useCallback((volume: number) => {
    soundManager.setVolume(volume)
  }, [])

  const setMuted = useCallback((muted: boolean) => {
    soundManager.setMuted(muted)
  }, [])

  const toggleMute = useCallback(() => {
    soundManager.setMuted(!soundManager.isSoundMuted())
  }, [])

  return {
    volume: soundManager.getVolume(),
    isMuted: soundManager.isSoundMuted(),
    setVolume,
    setMuted,
    toggleMute
  }
}
