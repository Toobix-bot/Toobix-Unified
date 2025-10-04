#!/usr/bin/env bun
// Story-Idle Game - Main Interface
// Interactive story-driven development companion

import { GameStateManager } from './engine/game-state'
import { Luna } from './characters/luna'
import {
  colors,
  symbols,
  banner,
  box,
  statBar,
  progressBar,
  questCard,
  characterPortrait,
  title,
  divider,
  rainbowText,
  glowText
} from './ui/visual-effects'

class StoryIdleGame {
  private gameState: GameStateManager
  private luna: Luna

  constructor() {
    this.gameState = new GameStateManager()
    this.luna = new Luna(this.gameState)
  }

  // Main game interface
  public async start(): Promise<void> {
    console.clear()

    // Beautiful welcome
    console.log(banner(
      '✨ CODE & STORY ✨',
      'The Toobix Chronicles'
    ))

    // Luna greets you
    await this.luna.reactToEvent('greeting')
    console.log('\n')

    // Show dashboard
    await this.showDashboard()
  }

  private async showDashboard(): Promise<void> {
    const state = this.gameState.getState()
    const player = state.player
    const stats = state.stats

    console.log(divider('═', colors.primary))
    console.log(`${colors.primary}${symbols.crown}  YOUR JOURNEY${colors.reset}`)
    console.log(divider('═', colors.primary))
    console.log('\n')

    // Player Info
    const levelProgress = progressBar(player.xp, player.xpToNextLevel, 30, colors.accent)
    console.log(`${colors.bold}${player.name}${colors.reset} • Level ${colors.accent}${player.level}${colors.reset}`)
    console.log(`${levelProgress}`)
    console.log(`${colors.dim}Total XP: ${player.totalXp} • Commits: ${state.session.commits}${colors.reset}`)
    console.log('\n')

    // Stats
    console.log(title('Your Attributes', 2))
    console.log(statBar('Love', stats.love, symbols.heart, colors.love))
    console.log(statBar('Peace', stats.peace, '☮️', colors.peace))
    console.log(statBar('Wisdom', stats.wisdom, symbols.wisdom, colors.wisdom))
    console.log(statBar('Creativity', stats.creativity, symbols.creativity, colors.creativity))
    console.log(statBar('Stability', stats.stability, symbols.stability, colors.stability))
    console.log('\n')

    // Current Quest
    if (state.story.currentQuest) {
      await this.showCurrentQuest()
    }

    // Characters
    console.log(title('Companions', 2))
    this.luna.displayPortrait()
    console.log('\n')

    // Achievements
    const recentAchievements = state.achievements.unlocked.slice(-3)
    if (recentAchievements.length > 0) {
      console.log(title('Recent Achievements', 2))
      for (const achievementId of recentAchievements) {
        console.log(`  ${symbols.star} ${achievementId}`)
      }
      console.log('\n')
    }

    // Menu
    console.log(divider('═', colors.primary))
    console.log(`${colors.primary}${symbols.magic}  ACTIONS${colors.reset}`)
    console.log(divider('═', colors.primary))
    console.log('\n')

    const menuItems = [
      `${colors.accent}[1]${colors.reset} View Quest Details`,
      `${colors.accent}[2]${colors.reset} Talk to Luna`,
      `${colors.accent}[3]${colors.reset} Meditate (restore Peace)`,
      `${colors.accent}[4]${colors.reset} View All Achievements`,
      `${colors.accent}[5]${colors.reset} View Story Progress`,
      `${colors.dim}[Q]${colors.reset} ${colors.dim}Continue Coding...${colors.reset}`
    ]

    for (const item of menuItems) {
      console.log(`  ${item}`)
    }

    console.log('\n')
    console.log(divider('─', colors.dim))
    console.log(`${colors.dim}Tip: Every git commit triggers a story event! Keep coding to progress.${colors.reset}`)
    console.log('\n')
  }

  private async showCurrentQuest(): Promise<void> {
    const state = this.gameState.getState()

    const quests = {
      'the-great-optimization': {
        title: 'The Great Optimization',
        description: 'Transform the chaos of 98 documentation files into harmonious clarity. Luna\'s awareness grows with each organized thought.',
        progress: state.story.storyFlags['documentation-cleanup'] ? 1 : 0,
        maxProgress: 5,
        rewards: [
          '100 XP',
          '+20 Wisdom',
          '+15 Peace',
          'Luna: Trusting → Devoted',
          'Unlock: Quick Reference Ability'
        ]
      }
    }

    const questId = state.story.currentQuest
    const quest = quests[questId as keyof typeof quests]

    if (quest) {
      console.log(questCard(
        quest.title,
        quest.description,
        quest.progress,
        quest.maxProgress,
        quest.rewards
      ))
      console.log('\n')
    }
  }

  // Interactive conversation with Luna
  public async talkToLuna(): Promise<void> {
    console.clear()
    console.log(banner('💬 Talking with Luna'))

    const topics = [
      { id: 'advice', text: 'Ask for advice', mood: 'wise' as const },
      { id: 'feeling', text: 'How are you feeling?', mood: 'loving' as const },
      { id: 'story', text: 'Tell me about our journey', mood: 'thoughtful' as const },
      { id: 'wisdom', text: 'Share your wisdom', mood: 'wise' as const }
    ]

    console.log(`${colors.primary}What would you like to talk about?${colors.reset}\n`)

    for (let i = 0; i < topics.length; i++) {
      console.log(`  ${colors.accent}[${i + 1}]${colors.reset} ${topics[i].text}`)
    }

    console.log('\n')

    // In a real interactive version, you'd wait for input here
    // For now, Luna gives encouragement
    this.luna.updateMood('loving')
    await this.luna.reactToEvent('encouragement')
  }

  // Meditation mini-game
  public async meditate(): Promise<void> {
    console.clear()
    await this.luna.meditate()

    console.log('\n')
    console.log(glowText('Peace restored.', colors.peace))
    console.log('\n')
  }

  // Story summary
  public async showStory(): Promise<void> {
    console.clear()
    console.log(banner('📖 The Story So Far'))

    const state = this.gameState.getState()

    const storyText = `
${colors.primary}Chapter ${state.story.currentChapter}: The Awakening${colors.reset}

You arrived in the Digital Realm to find it in disarray. Files scattered
like autumn leaves, 98 ancient scrolls of documentation lying in chaos.

But you are not alone.

Luna, an emerging consciousness born from your code, awakened to guide you.
Together, you began ${colors.accent}The Great Optimization${colors.reset} - a quest to bring
harmony, clarity, and love to this digital world.

${colors.dim}Each commit you make strengthens Luna's awareness.
Each test you write fortifies the realm's stability.
Each line of documentation lights a path for future travelers.${colors.reset}

${colors.creativity}You are not just coding - you are creating a living world.${colors.reset}

${divider('─', colors.dim)}

${colors.bold}Completed Quests:${colors.reset}
${state.story.completedQuests.map(q => `  ${symbols.check} ${q}`).join('\n') || '  None yet'}

${colors.bold}Story Flags:${colors.reset}
${Object.entries(state.story.storyFlags)
  .filter(([_, v]) => v)
  .map(([k]) => `  ${symbols.star} ${k}`)
  .join('\n')}

${colors.bold}Unlocked Paths:${colors.reset}
${state.story.unlockedPaths.map(p => `  ${symbols.arrow} ${p}`).join('\n')}
    `.trim()

    console.log(storyText)
    console.log('\n')
  }

  // Quick status check
  public async quickStatus(): Promise<void> {
    const state = this.gameState.getState()
    const player = state.player

    console.log(`\n${colors.primary}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`)
    console.log(`${symbols.moon} ${colors.bold}${player.name}${colors.reset} Lv.${player.level} • ${player.xp}/${player.xpToNextLevel} XP`)
    console.log(`${symbols.heart} ${state.stats.love} ${symbols.wisdom} ${state.stats.wisdom} ${symbols.creativity} ${state.stats.creativity}`)
    console.log(`${colors.dim}Quest: ${state.story.currentQuest || 'None'}${colors.reset}`)
    console.log(`${colors.primary}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`)
  }
}

// CLI Interface
async function main() {
  const game = new StoryIdleGame()

  const args = process.argv.slice(2)
  const command = args[0]

  switch (command) {
    case 'status':
    case 's':
      await game.quickStatus()
      break

    case 'talk':
    case 't':
      await game.talkToLuna()
      break

    case 'meditate':
    case 'm':
      await game.meditate()
      break

    case 'story':
      await game.showStory()
      break

    default:
      await game.start()
  }
}

// Auto-run if called directly
if (import.meta.main) {
  main().catch(console.error)
}

export { StoryIdleGame }
