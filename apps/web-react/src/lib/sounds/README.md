# 🔊 Toobix Sound System

Procedural audio system using Web Audio API for real-time sound generation.

## Features

- ✨ **Procedural Generation**: All sounds generated in real-time (no audio files needed)
- 🎚️ **Volume Control**: Master volume with localStorage persistence
- 🔇 **Mute Toggle**: Global mute with settings persistence
- 🎵 **Multiple Sound Types**: Hover, Click, Success, Quest Complete, Level Up, etc.
- ⚡ **Performance**: Lightweight, no asset loading required
- 🌐 **Browser Support**: Uses Web Audio API with graceful fallback

## Usage

### React Hook (Recommended)

```tsx
import { useSound } from '@/lib/sounds/useSound'

function MyComponent() {
  const { play: playClick } = useSound('click')

  return (
    <button onClick={playClick}>
      Click me!
    </button>
  )
}
```

### Direct Sound Manager

```tsx
import { soundManager } from '@/lib/sounds/sound-manager'

// Play procedural sounds
soundManager.playClickSound()
soundManager.playQuestCompleteSound()
soundManager.playSuccessSound()

// Control volume
soundManager.setVolume(0.7) // 0.0 - 1.0
soundManager.setMuted(true)
```

## Available Sound Effects

| Sound Effect | Use Case | Hook |
|--------------|----------|------|
| `hover` | Button/card hover | `useSound('hover')` |
| `click` | Button clicks | `useSound('click')` |
| `success` | Successful actions | `useSound('success')` |
| `quest-complete` | Quest completion | `useSound('quest-complete')` |
| `level-up` | Level up events | `useSound('level-up')` |
| `notification` | Notifications | `useSound('notification')` |
| `page-transition` | Page changes | `useSound('page-transition')` |
| `sparkle` | Particle effects | `useSound('sparkle')` |

## Sound Settings Component

Use the `SoundSettings` component in your settings page:

```tsx
import { SoundSettings } from '@/components/settings/SoundSettings'

export default function SettingsPage() {
  return (
    <div>
      <h1>Settings</h1>
      <SoundSettings />
    </div>
  )
}
```

## Technical Details

### Procedural Sound Generation

All sounds are generated using Web Audio API oscillators with:
- **Frequencies**: Musical notes (C, E, G, etc.)
- **Oscillator Types**: Sine, Square, Triangle waves
- **Envelopes**: Attack/Decay/Sustain/Release (ADSR)
- **Volume Control**: Individual and master volume

### Browser Compatibility

- ✅ Chrome/Edge 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ⚠️ Graceful fallback if Web Audio API not supported

### Performance

- **No HTTP Requests**: All sounds generated client-side
- **Minimal Memory**: No audio buffers to load
- **CPU Efficient**: Oscillators are hardware-accelerated
- **60fps Compatible**: Non-blocking sound generation

## Examples

### Quest Completion Sound

```tsx
const { play: playQuestComplete } = useSound('quest-complete')

const handleQuestChoice = async () => {
  await submitChoice()
  playQuestComplete() // 🎉 Celebratory arpeggio
}
```

### Hover Effects

```tsx
import { useHoverSound } from '@/lib/sounds/useSound'

function Card() {
  const { onMouseEnter } = useHoverSound()

  return (
    <div onMouseEnter={onMouseEnter}>
      Hover me!
    </div>
  )
}
```

### Settings Integration

```tsx
import { useSoundSettings } from '@/lib/sounds/useSound'

function VolumeControl() {
  const { volume, setVolume, isMuted, toggleMute } = useSoundSettings()

  return (
    <div>
      <input
        type="range"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
      />
      <button onClick={toggleMute}>
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  )
}
```

## Future Enhancements

- [ ] Spatial audio (3D positioning)
- [ ] Audio file support (for custom sounds)
- [ ] Sound themes (lo-fi, chiptune, orchestral)
- [ ] Background music system
- [ ] Dynamic mixing based on context
