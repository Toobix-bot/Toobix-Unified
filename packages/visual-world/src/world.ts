#!/usr/bin/env bun
// Visual World - Main Entry Point
// The complete living universe experience

import { GameStateManager } from '@toobix/story-idle'
import { Luna } from '@toobix/story-idle'
import { LunaScenes, AnimationController, SceneBuilder } from './ascii/animated-scenes'
import { soundSystem } from './ascii/sound-system'
import { SVGSceneGenerator } from './svg/scene-generator'
import { LiveStreamServer, createHTTPServer } from './stream/live-server'

export class VisualWorld {
  private gameState: GameStateManager
  private luna: Luna
  private animator: AnimationController
  private svgGenerator: SVGSceneGenerator
  private streamServer?: LiveStreamServer
  private httpServer?: any

  constructor() {
    this.gameState = new GameStateManager()
    this.luna = new Luna(this.gameState)
    this.animator = new AnimationController()
    this.svgGenerator = new SVGSceneGenerator()

    console.log('🌟 Visual World initialized!')
  }

  // Start the complete experience
  async start(): Promise<void> {
    console.clear()

    // Welcome animation
    console.log('\n')
    await this.animator.playScene('awaken')

    console.log('\n')
    await this.luna.speak('Welcome to the Visual World, Creator!')
    await this.luna.speak('I can now show you our realm in beautiful ways...')

    console.log('\n')
    console.log('🎨 What would you like to see?')
    console.log('')
    console.log('  1. 🌙 Watch Luna meditate (Terminal Animation)')
    console.log('  2. 🖼️  Generate SVG scene (Save beautiful image)')
    console.log('  3. 🌐 Open 3D World (Browser visualization)')
    console.log('  4. 🎮 Start Live Stream (Real-time updates)')
    console.log('  5. ✨ See everything! (Full experience)')
    console.log('')

    // For now, auto-start full experience
    await this.fullExperience()
  }

  private async fullExperience(): Promise<void> {
    console.log('\n🌟 Starting full visual experience!\n')

    // 1. Terminal animation
    console.log('1️⃣ Terminal Animation...')
    await this.showTerminalAnimation()

    // 2. Generate SVG
    console.log('\n2️⃣ Generating SVG scene...')
    await this.generateSVGScene()

    // 3. Start servers
    console.log('\n3️⃣ Starting live servers...')
    await this.startServers()

    // 4. Show instructions
    this.showInstructions()
  }

  private async showTerminalAnimation(): Promise<void> {
    await soundSystem.play('peaceful')
    await this.animator.playScene('meditate')

    console.log('\n✅ Animation complete!\n')
  }

  private async generateSVGScene(): Promise<void> {
    const state = this.gameState.getState()
    const lunaState = this.luna.getState()

    const sceneData = {
      luna: {
        mood: lunaState.mood,
        relationship: this.gameState.getCharacter('luna')?.relationship || 25,
        level: 1
      },
      player: {
        name: state.player.name,
        level: state.player.level,
        xp: state.player.xp,
        xpToNext: state.player.xpToNextLevel
      },
      stats: state.stats,
      quest: {
        name: 'The Great Optimization',
        progress: 1,
        total: 5
      },
      weather: 'sunny' as const,
      time: 'day' as const
    }

    const svg = this.svgGenerator.generateScene(sceneData)

    // Save to file
    const filename = `scene-${Date.now()}`
    await Bun.write(`./visual-scenes/${filename}.svg`, svg)

    console.log(`✅ SVG Scene saved: ./visual-scenes/${filename}.svg`)
    console.log('   You can open it in a browser!')
  }

  private async startServers(): Promise<void> {
    // Start WebSocket server for live updates
    this.streamServer = new LiveStreamServer(3338)

    // Start HTTP server for web interface
    this.httpServer = createHTTPServer(3339)

    await soundSystem.play('success')
    console.log('✅ Servers started!')
  }

  private showInstructions(): void {
    console.log('\n')
    console.log('╔════════════════════════════════════════════════════════════╗')
    console.log('║  🎮 VISUAL WORLD IS LIVE!                                 ║')
    console.log('╠════════════════════════════════════════════════════════════╣')
    console.log('║                                                            ║')
    console.log('║  🌐 Open in browser:                                      ║')
    console.log('║     http://localhost:3339/open-world                      ║')
    console.log('║                                                            ║')
    console.log('║  📊 Game State API:                                       ║')
    console.log('║     http://localhost:3339/game-state                      ║')
    console.log('║                                                            ║')
    console.log('║  🔌 WebSocket (live updates):                             ║')
    console.log('║     ws://localhost:3338                                    ║')
    console.log('║                                                            ║')
    console.log('║  🖼️  SVG Scenes:                                          ║')
    console.log('║     ./visual-scenes/                                       ║')
    console.log('║                                                            ║')
    console.log('╠════════════════════════════════════════════════════════════╣')
    console.log('║  💡 TIP: Open the browser window and keep it visible     ║')
    console.log('║      while you code. It updates automatically!            ║')
    console.log('╚════════════════════════════════════════════════════════════╝')
    console.log('\n')

    // Luna speaks
    this.luna.speak('The visual realm awaits! Open the browser and watch our world come alive... 🌙✨')
  }

  // Quick demos
  async demoAnimation(): Promise<void> {
    console.clear()
    console.log('🎭 Animation Demo\n')

    console.log('Luna meditating...')
    await this.animator.playScene('meditate')

    await new Promise(r => setTimeout(r, 1000))

    console.log('\nLuna happy!')
    await this.animator.playScene('happy')

    await new Promise(r => setTimeout(r, 1000))

    console.log('\nLevel up!')
    await this.animator.playScene('levelUp')
  }

  async demoSound(): Promise<void> {
    console.clear()
    console.log('🔊 Sound Demo\n')

    console.log('Playing: Level Up')
    await soundSystem.play('level-up')
    await new Promise(r => setTimeout(r, 2000))

    console.log('Playing: Achievement')
    await soundSystem.play('achievement')
    await new Promise(r => setTimeout(r, 2000))

    console.log('Playing: Luna Speaks')
    await soundSystem.play('luna-speaks')
    await new Promise(r => setTimeout(r, 2000))

    console.log('Playing: Epic!')
    await soundSystem.play('epic')
  }

  stop(): void {
    if (this.streamServer) {
      this.streamServer.stop()
    }
    if (this.httpServer) {
      this.httpServer.stop()
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  const world = new VisualWorld()

  switch (command) {
    case 'animation':
    case 'anim':
      await world.demoAnimation()
      break

    case 'sound':
      await world.demoSound()
      break

    case 'svg':
      await world['generateSVGScene']()
      break

    default:
      await world.start()
  }
}

// Auto-run
if (import.meta.main) {
  main().catch(console.error)
}
