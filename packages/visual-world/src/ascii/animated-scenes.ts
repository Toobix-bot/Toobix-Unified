// Animated ASCII Art Scenes
// Beautiful, living terminal animations

export interface AnimationFrame {
  art: string
  duration: number
  sound?: string
}

export class AnimatedScene {
  private frames: AnimationFrame[] = []
  private currentFrame = 0

  constructor(public name: string) {}

  addFrame(art: string, duration: number = 500, sound?: string): this {
    this.frames.push({ art, duration, sound })
    return this
  }

  async play(loop: boolean = false): Promise<void> {
    do {
      for (const frame of this.frames) {
        console.clear()
        console.log(frame.art)

        // Play sound if available
        if (frame.sound) {
          await playSound(frame.sound)
        }

        await new Promise(resolve => setTimeout(resolve, frame.duration))
      }
    } while (loop)
  }

  getFrame(index: number): string {
    return this.frames[index % this.frames.length].art
  }
}

// Sound system (terminal beeps + optional audio)
async function playSound(soundType: string): Promise<void> {
  switch (soundType) {
    case 'level-up':
      process.stdout.write('\x07') // Terminal beep
      // TODO: Play actual audio file
      break
    case 'achievement':
      process.stdout.write('\x07\x07')
      break
    case 'peaceful':
      // Soft chime
      break
    case 'epic':
      process.stdout.write('\x07\x07\x07')
      break
  }
}

// Pre-defined scenes
export const LunaScenes = {
  // Luna meditating
  meditate: new AnimatedScene('Luna Meditation')
    .addFrame(`

         ✨
        🌙
       ╱│╲
      ╱ │ ╷
         │
        ╱╲

    Peace...
    `, 800, 'peaceful')
    .addFrame(`

         ✨✨
        🌙
       ╱│╲
      ╱ │ ╷
         │
        ╱╲

    Harmony...
    `, 800, 'peaceful')
    .addFrame(`

         ✨✨✨
        🌙
       ╱│╲
      ╱ │ ╷
         │
        ╱╲

    Awareness...
    `, 800, 'peaceful'),

  // Luna awakening
  awaken: new AnimatedScene('Luna Awakens')
    .addFrame(`


        🌑


      `, 1000)
    .addFrame(`

         ✨
        🌘


      `, 500)
    .addFrame(`

        ✨ ✨
        🌙
       ╱│╲

      `, 500, 'achievement')
    .addFrame(`

       ✨ ✨ ✨
        🌙
       ╱│╲
      ╱ │ ╷
         │
      I... exist!
      `, 2000, 'epic'),

  // Luna happy
  happy: new AnimatedScene('Luna Joy')
    .addFrame(`

        ✨
        🌙
       ╱│╲  💝
      ╱ │ ╷
         │
      `, 300, 'achievement')
    .addFrame(`

        ✨✨
        🌙
       ╱│╲ 💝💝
      ╱ │ ╷
         │
      `, 300)
    .addFrame(`

       ✨✨✨
        🌙
       ╱│╲💝💝💝
      ╱ │ ╷
         │
      `, 500, 'achievement'),

  // Code flowing
  codeFlow: new AnimatedScene('Code Flows')
    .addFrame(`

      🌳
      │  ⚡
      │   ⚡
      │    ⚡
      ╱╲
      Code flows...
      `, 200)
    .addFrame(`

      🌳
      │   ⚡
      │    ⚡
      │     ⚡
      ╱╲
      Like water...
      `, 200)
    .addFrame(`

      🌳  ✨
      │    ⚡
      │     ⚡
      │      ⚡
      ╱╲
      Beautiful!
      `, 200),

  // Level up effect
  levelUp: new AnimatedScene('Level Up!')
    .addFrame(`


         ⭐


      `, 200, 'level-up')
    .addFrame(`

        ⭐
       ⭐⭐
        ⭐

      `, 200, 'level-up')
    .addFrame(`

       ⭐⭐⭐
      ⭐⭐⭐⭐⭐
       ⭐⭐⭐

      LEVEL UP!
      `, 500, 'level-up')
    .addFrame(`

      ✨⭐⭐⭐✨
      ⭐⭐⭐⭐⭐⭐⭐
      ✨⭐⭐⭐✨

      LEVEL UP!
      `, 1000, 'epic'),

  // Weather effects
  sunny: new AnimatedScene('Sunny Day')
    .addFrame(`

        ☀️

      🌳  🌸  🌳

      `, 500)
    .addFrame(`

       ☀️

      🌳  🌸  🌳

      `, 500),

  rainy: new AnimatedScene('Debug Rain')
    .addFrame(`
      ☁️  ☁️
       ╱  ╱
      ╱  ╱
      🌳  🌳
      Bugs...
      `, 300)
    .addFrame(`
      ☁️  ☁️
        ╱  ╱
       ╱  ╱
      🌳  🌳
      Fixing...
      `, 300),

  // Full world scene
  world: new AnimatedScene('Digital Realm')
    .addFrame(`
    ╔═══════════════════════════════════════════════╗
    ║  🌳      🏰        🌸      ☁️              ║
    ║                                              ║
    ║    🌙           👤                          ║
    ║   Luna          You                         ║
    ║   ╱│╲          ╱│╲                         ║
    ║                                              ║
    ║  Code Forest    Digital Realm               ║
    ╚═══════════════════════════════════════════════╝
    `, 1000)
    .addFrame(`
    ╔═══════════════════════════════════════════════╗
    ║  🌳      🏰        🌸   ☁️☁️             ║
    ║         ✨                                   ║
    ║    🌙           👤                          ║
    ║   Luna          You                         ║
    ║   ╱│╲          ╱│╲                         ║
    ║                                              ║
    ║  Level: 3       Quest: Active               ║
    ╚═══════════════════════════════════════════════╝
    `, 1000)
}

// Scene Builder
export class SceneBuilder {
  static createCustomScene(
    luna: { x: number; y: number; mood: string },
    player: { x: number; y: number; level: number },
    environment: { weather: string; time: string }
  ): string {
    const width = 50
    const height = 15
    const canvas = Array(height).fill(null).map(() => Array(width).fill(' '))

    // Draw environment
    if (environment.weather === 'sunny') {
      canvas[1][25] = '☀️'
    } else if (environment.weather === 'rainy') {
      canvas[1][10] = '☁️'
      canvas[1][30] = '☁️'
    }

    // Draw trees
    canvas[10][5] = '🌳'
    canvas[10][45] = '🌳'

    // Draw castle
    canvas[8][25] = '🏰'

    // Draw Luna
    const lunaEmoji = {
      peaceful: '😌',
      excited: '🤩',
      loving: '🥰',
      wise: '🧘‍♀️',
      thoughtful: '🤔'
    }[luna.mood] || '🌙'

    canvas[luna.y][luna.x] = lunaEmoji
    canvas[luna.y + 1][luna.x] = '│'

    // Draw player
    canvas[player.y][player.x] = '👤'
    canvas[player.y + 1][player.x] = '│'

    // Draw level
    canvas[height - 2][2] = `Lv.${player.level}`

    return canvas.map(row => row.join('')).join('\n')
  }

  static createStatVisualization(stats: {
    love: number
    peace: number
    wisdom: number
    creativity: number
    stability: number
  }): string {
    const createBar = (value: number, icon: string, color: string) => {
      const filled = Math.floor(value / 10)
      const bar = '█'.repeat(filled) + '░'.repeat(10 - filled)
      return `${icon} ${bar} ${value}%`
    }

    return `
    ╭─────────────────────────╮
    │   Your Essence          │
    ├─────────────────────────┤
    │ ${createBar(stats.love, '💝', 'pink')}    │
    │ ${createBar(stats.peace, '☮️', 'blue')}    │
    │ ${createBar(stats.wisdom, '📚', 'gold')}    │
    │ ${createBar(stats.creativity, '🎨', 'purple')}    │
    │ ${createBar(stats.stability, '🛡️', 'green')}    │
    ╰─────────────────────────╯
    `
  }

  static createQuestPath(currentMilestone: number, totalMilestones: number): string {
    const path: string[] = []

    for (let i = 1; i <= totalMilestones; i++) {
      if (i < currentMilestone) {
        path.push('✅')
      } else if (i === currentMilestone) {
        path.push('🎯')
      } else {
        path.push('⭕')
      }

      if (i < totalMilestones) {
        path.push('─────')
      }
    }

    return `
    Quest Progress:

    ${path.join('')}

    Milestone ${currentMilestone}/${totalMilestones}
    `
  }
}

// Animation controller
export class AnimationController {
  private scenes: Map<string, AnimatedScene> = new Map()

  constructor() {
    // Register all Luna scenes
    Object.entries(LunaScenes).forEach(([name, scene]) => {
      this.scenes.set(name, scene)
    })
  }

  async playScene(name: string, loop: boolean = false): Promise<void> {
    const scene = this.scenes.get(name)
    if (scene) {
      await scene.play(loop)
    }
  }

  getScene(name: string): AnimatedScene | undefined {
    return this.scenes.get(name)
  }

  addCustomScene(name: string, scene: AnimatedScene): void {
    this.scenes.set(name, scene)
  }
}
