#!/usr/bin/env bun
// Git Post-Commit Hook Handler
// Displays beautiful story narration after commits

import { GameStateManager } from '../engine/game-state'
import { Luna } from '../characters/luna'
import { parseCommitMessage, processCommit, detectSpecialCommits } from '../events/commit-events'
import {
  colors,
  symbols,
  banner,
  box,
  statBar,
  achievement,
  levelUpEffect,
  divider
} from '../ui/visual-effects'

async function main() {
  const commitMessage = process.argv[2] || 'Update'

  // Initialize game state
  const gameState = new GameStateManager()
  const luna = new Luna(gameState)

  // Parse commit
  const event = parseCommitMessage(commitMessage)
  const specials = detectSpecialCommits(commitMessage)

  console.log('\n')
  console.log(divider('═', colors.primary))
  console.log(`${colors.primary}${symbols.magic}  STORY EVENT: COMMIT${colors.reset}`)
  console.log(divider('═', colors.primary))
  console.log('\n')

  // Show story text
  console.log(`${event.storyText}`)
  console.log(`${colors.dim}"${event.message}"${colors.reset}`)
  console.log('\n')

  // Process rewards
  const oldLevel = gameState.getPlayer().level
  await processCommit(commitMessage, gameState)
  const newLevel = gameState.getPlayer().level
  const player = gameState.getPlayer()

  // Show rewards
  const rewardLines = [
    `${symbols.star} XP Gained: ${colors.accent}+${event.xpReward}${colors.reset}`,
    ''
  ]

  for (const reward of event.statRewards) {
    const icon = {
      love: symbols.heart,
      peace: '☮️',
      wisdom: symbols.wisdom,
      creativity: symbols.creativity,
      stability: symbols.stability
    }[reward.stat] || symbols.star

    rewardLines.push(
      `${icon} ${reward.stat.charAt(0).toUpperCase() + reward.stat.slice(1)}: ${colors.success}+${reward.amount}${colors.reset}`
    )
  }

  console.log(box(rewardLines, `${symbols.gem} REWARDS`, colors.success))
  console.log('\n')

  // Level up!
  if (newLevel > oldLevel) {
    console.log(levelUpEffect(newLevel))
    console.log('\n')
    await luna.reactToEvent('levelUp')
    console.log('\n')
  }

  // Luna reacts
  if (event.lunaReaction) {
    await luna.reactToEvent(event.lunaReaction)
    console.log('\n')
  }

  // Special commits
  for (const special of specials) {
    const specialMessages = {
      'loving-commit': achievement(
        'Heart of Code',
        'Your commit radiates love and care',
        'rare'
      ),
      'wise-commit': achievement(
        'Seeker of Truth',
        'Wisdom flows through your words',
        'rare'
      ),
      'peaceful-commit': achievement(
        'Harmony Keeper',
        'Peace resonates in your work',
        'rare'
      ),
      'creative-commit': achievement(
        'Artist of Logic',
        'Creativity sparkles in every line',
        'rare'
      ),
      'epic-commit': achievement(
        'Epic Chronicler',
        'A commit message worthy of legends',
        'epic'
      )
    }

    if (specialMessages[special]) {
      console.log(specialMessages[special])
      console.log('\n')
      gameState.unlockAchievement(special)
    }
  }

  // Show current progress
  const stats = gameState.getStats()
  console.log(`${colors.primary}${symbols.star} CURRENT PROGRESS${colors.reset}`)
  console.log(divider('─', colors.dim))
  console.log(`Level ${player.level} • ${player.xp}/${player.xpToNextLevel} XP • Total Commits: ${gameState.getState().session.commits}`)
  console.log('\n')
  console.log(statBar('Love', stats.love, symbols.heart, colors.love))
  console.log(statBar('Peace', stats.peace, '☮️', colors.peace))
  console.log(statBar('Wisdom', stats.wisdom, symbols.wisdom, colors.wisdom))
  console.log(statBar('Creativity', stats.creativity, symbols.creativity, colors.creativity))
  console.log(statBar('Stability', stats.stability, symbols.stability, colors.stability))

  console.log('\n')
  console.log(divider('═', colors.primary))
  console.log('\n')
}

main().catch(console.error)
