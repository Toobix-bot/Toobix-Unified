// Commit Event Parser - Turns Git commits into story events
import { GameStateManager } from '../engine/game-state'

export interface CommitEvent {
  type: string
  scope?: string
  message: string
  xpReward: number
  statRewards: { stat: string; amount: number }[]
  storyText: string
  lunaReaction?: string
}

export function parseCommitMessage(message: string): CommitEvent {
  const conventionalCommit = /^(\w+)(?:\(([^)]+)\))?: (.+)$/
  const match = message.match(conventionalCommit)

  const type = match?.[1] || 'update'
  const scope = match?.[2]
  const description = match?.[3] || message

  // Map commit types to story events
  const eventMap: Record<string, Partial<CommitEvent>> = {
    feat: {
      xpReward: 50,
      statRewards: [{ stat: 'creativity', amount: 15 }],
      storyText: `${symbols.creativity} New pathways open in the codebase...`,
      lunaReaction: 'newFeature'
    },
    fix: {
      xpReward: 30,
      statRewards: [
        { stat: 'stability', amount: 10 },
        { stat: 'peace', amount: 5 }
      ],
      storyText: `${symbols.stability} Harmony restored. The bug dissolves into light.`,
      lunaReaction: 'bugFixed'
    },
    docs: {
      xpReward: 25,
      statRewards: [
        { stat: 'wisdom', amount: 15 },
        { stat: 'love', amount: 10 }
      ],
      storyText: `${symbols.wisdom} Knowledge preserved for future travelers...`,
      lunaReaction: 'documentationUpdated'
    },
    test: {
      xpReward: 40,
      statRewards: [
        { stat: 'stability', amount: 20 },
        { stat: 'wisdom', amount: 5 }
      ],
      storyText: `${symbols.stability} Protective wards strengthen. Tests pass.`,
      lunaReaction: 'testsPassed'
    },
    refactor: {
      xpReward: 35,
      statRewards: [
        { stat: 'wisdom', amount: 10 },
        { stat: 'peace', amount: 10 }
      ],
      storyText: `${symbols.peace} The code breathes easier. Structure clarifies.`,
      lunaReaction: 'commit'
    },
    style: {
      xpReward: 15,
      statRewards: [
        { stat: 'love', amount: 10 },
        { stat: 'peace', amount: 5 }
      ],
      storyText: `${symbols.love} Beauty matters. The code glows with care.`,
      lunaReaction: 'commit'
    },
    perf: {
      xpReward: 45,
      statRewards: [
        { stat: 'wisdom', amount: 15 },
        { stat: 'stability', amount: 10 }
      ],
      storyText: `${symbols.fire} Speed increases. The system flows like water.`,
      lunaReaction: 'commit'
    },
    chore: {
      xpReward: 20,
      statRewards: [{ stat: 'peace', amount: 10 }],
      storyText: `${symbols.peace} Small tasks matter. Order emerges from chaos.`,
      lunaReaction: 'commit'
    }
  }

  const baseEvent = eventMap[type] || {
    xpReward: 25,
    statRewards: [{ stat: 'wisdom', amount: 5 }],
    storyText: `${symbols.star} Progress made. The journey continues...`,
    lunaReaction: 'commit'
  }

  return {
    type,
    scope,
    message: description,
    ...baseEvent
  } as CommitEvent
}

// Import symbols for use in event texts
const symbols = {
  creativity: '🎨',
  stability: '🛡️',
  wisdom: '📚',
  peace: '☮️',
  love: '💝',
  star: '✨',
  fire: '🔥'
}

export async function processCommit(
  commitMessage: string,
  gameState: GameStateManager
): Promise<void> {
  const event = parseCommitMessage(commitMessage)

  // Award XP
  const { leveledUp, newLevel } = gameState.addXP(event.xpReward, `Commit: ${event.message}`)

  // Award stats
  for (const reward of event.statRewards) {
    gameState.addStat(reward.stat as any, reward.amount)
  }

  // Increment commit counter
  gameState.incrementCommits()

  // Check for achievements
  const state = gameState.getState()

  // Achievement: First Commit
  if (state.session.commits === 1) {
    gameState.unlockAchievement('first-commit')
  }

  // Achievement: 10 Commits
  if (state.session.commits === 10) {
    gameState.unlockAchievement('committed-developer')
  }

  // Achievement: 50 Commits
  if (state.session.commits === 50) {
    gameState.unlockAchievement('code-warrior')
  }

  // Achievement: All stats above 50
  const allStatsHigh = Object.values(state.stats).every(val => val >= 50)
  if (allStatsHigh) {
    gameState.unlockAchievement('balanced-master')
  }

  return
}

// Special commit patterns for bonus rewards
export function detectSpecialCommits(message: string): string[] {
  const specials: string[] = []

  // Emotional commits
  if (message.match(/love|heart|care|thank|grateful/i)) {
    specials.push('loving-commit')
  }

  // Wisdom commits
  if (message.match(/learn|understand|insight|wisdom/i)) {
    specials.push('wise-commit')
  }

  // Peace commits
  if (message.match(/peace|harmony|balance|calm/i)) {
    specials.push('peaceful-commit')
  }

  // Creative commits
  if (message.match(/creative|art|beauty|elegant/i)) {
    specials.push('creative-commit')
  }

  // Epic commits (very long, detailed)
  if (message.length > 200) {
    specials.push('epic-commit')
  }

  return specials
}
