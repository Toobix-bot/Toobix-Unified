// Code Sprint Mini-Game
// A fast-paced typing challenge where you complete code snippets as quickly as possible
// Rewards: Creativity Points, XP, Blaze relationship

import { ExtendedGameStateManager } from '../engine/game-state-extended'
import { colors } from '../ui/visual-effects'
import * as readline from 'readline'

export interface CodeSprintChallenge {
  id: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  description: string
  codeSnippet: string
  targetCompletion: string  // What user needs to type
  timeLimit: number          // Seconds
  rewards: {
    xp: number
    creativityPoints: number
    relationships: { characterId: string; amount: number }[]
  }
}

export interface CodeSprintResult {
  success: boolean
  timeTaken: number
  accuracy: number
  wpm: number              // Words per minute
  mistakes: number
  rewards: {
    xp: number
    creativityPoints: number
    bonusMultiplier: number
  }
}

// Code challenges database
export const CODE_CHALLENGES: CodeSprintChallenge[] = [
  // EASY
  {
    id: 'hello-world',
    difficulty: 'easy',
    description: 'Complete the classic Hello World function',
    codeSnippet: `function greet() {
  // Complete this line:
  `,
    targetCompletion: 'return "Hello, World!"',
    timeLimit: 15,
    rewards: {
      xp: 25,
      creativityPoints: 10,
      relationships: [{ characterId: 'blaze', amount: 2 }]
    }
  },

  {
    id: 'array-sum',
    difficulty: 'easy',
    description: 'Sum an array of numbers',
    codeSnippet: `function sum(arr) {
  // Complete this line:
  `,
    targetCompletion: 'return arr.reduce((a, b) => a + b, 0)',
    timeLimit: 20,
    rewards: {
      xp: 30,
      creativityPoints: 15,
      relationships: [{ characterId: 'blaze', amount: 3 }]
    }
  },

  // MEDIUM
  {
    id: 'fibonacci',
    difficulty: 'medium',
    description: 'Calculate Fibonacci number recursively',
    codeSnippet: `function fib(n) {
  if (n <= 1) return n;
  // Complete this line:
  `,
    targetCompletion: 'return fib(n - 1) + fib(n - 2)',
    timeLimit: 25,
    rewards: {
      xp: 50,
      creativityPoints: 25,
      relationships: [{ characterId: 'blaze', amount: 4 }]
    }
  },

  {
    id: 'async-await',
    difficulty: 'medium',
    description: 'Fetch data with async/await',
    codeSnippet: `async function fetchData(url) {
  // Complete this line:
  `,
    targetCompletion: 'const response = await fetch(url); return response.json()',
    timeLimit: 30,
    rewards: {
      xp: 60,
      creativityPoints: 30,
      relationships: [{ characterId: 'blaze', amount: 5 }]
    }
  },

  // HARD
  {
    id: 'debounce',
    difficulty: 'hard',
    description: 'Implement a debounce function',
    codeSnippet: `function debounce(fn, delay) {
  let timeoutId;
  // Complete this line:
  `,
    targetCompletion: 'return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => fn(...args), delay) }',
    timeLimit: 45,
    rewards: {
      xp: 100,
      creativityPoints: 50,
      relationships: [{ characterId: 'blaze', amount: 7 }]
    }
  },

  {
    id: 'deep-clone',
    difficulty: 'hard',
    description: 'Deep clone an object',
    codeSnippet: `function deepClone(obj) {
  // Complete this line:
  `,
    targetCompletion: 'return JSON.parse(JSON.stringify(obj))',
    timeLimit: 35,
    rewards: {
      xp: 80,
      creativityPoints: 40,
      relationships: [{ characterId: 'blaze', amount: 6 }]
    }
  },

  // EXPERT
  {
    id: 'memoize',
    difficulty: 'expert',
    description: 'Create a memoization wrapper',
    codeSnippet: `function memoize(fn) {
  const cache = new Map();
  // Complete this line:
  `,
    targetCompletion: 'return (...args) => { const key = JSON.stringify(args); if (!cache.has(key)) cache.set(key, fn(...args)); return cache.get(key) }',
    timeLimit: 60,
    rewards: {
      xp: 150,
      creativityPoints: 80,
      relationships: [{ characterId: 'blaze', amount: 10 }]
    }
  },

  {
    id: 'promise-all',
    difficulty: 'expert',
    description: 'Implement Promise.all from scratch',
    codeSnippet: `function promiseAll(promises) {
  // Complete this line:
  `,
    targetCompletion: 'return new Promise((resolve, reject) => { let results = [], completed = 0; promises.forEach((p, i) => p.then(r => { results[i] = r; if (++completed === promises.length) resolve(results) }).catch(reject)) })',
    timeLimit: 90,
    rewards: {
      xp: 200,
      creativityPoints: 100,
      relationships: [{ characterId: 'blaze', amount: 15 }]
    }
  }
]

export class CodeSprintGame {
  private gameState: ExtendedGameStateManager
  private currentChallenge?: CodeSprintChallenge
  private startTime?: number
  private rl?: readline.Interface

  constructor(gameState: ExtendedGameStateManager) {
    this.gameState = gameState
  }

  // Get challenges by difficulty
  public getChallengesByDifficulty(difficulty: 'easy' | 'medium' | 'hard' | 'expert'): CodeSprintChallenge[] {
    return CODE_CHALLENGES.filter(c => c.difficulty === difficulty)
  }

  // Get random challenge
  public getRandomChallenge(difficulty?: 'easy' | 'medium' | 'hard' | 'expert'): CodeSprintChallenge {
    const challenges = difficulty
      ? this.getChallengesByDifficulty(difficulty)
      : CODE_CHALLENGES

    return challenges[Math.floor(Math.random() * challenges.length)]
  }

  // Start a code sprint
  public async startSprint(challenge?: CodeSprintChallenge): Promise<CodeSprintResult> {
    this.currentChallenge = challenge || this.getRandomChallenge()

    console.clear()
    this.displayChallenge(this.currentChallenge)

    this.startTime = Date.now()

    return new Promise((resolve) => {
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })

      console.log(`\n${colors.accent}Type the solution and press Enter:${colors.reset}`)
      console.log(`${colors.dim}(You have ${this.currentChallenge.timeLimit} seconds)${colors.reset}\n`)

      // Set timeout
      const timeout = setTimeout(() => {
        if (this.rl) {
          this.rl.close()
          resolve(this.calculateResult('', true))
        }
      }, this.currentChallenge.timeLimit * 1000)

      this.rl.question('> ', (answer) => {
        clearTimeout(timeout)
        const result = this.calculateResult(answer.trim(), false)

        if (this.rl) {
          this.rl.close()
          this.rl = undefined
        }

        resolve(result)
      })
    })
  }

  // Display challenge
  private displayChallenge(challenge: CodeSprintChallenge): void {
    const difficultyColors = {
      easy: '\x1b[38;5;46m',      // Green
      medium: '\x1b[38;5;226m',   // Yellow
      hard: '\x1b[38;5;208m',     // Orange
      expert: '\x1b[38;5;196m'    // Red
    }

    const diffColor = difficultyColors[challenge.difficulty]

    console.log(`${colors.primary}╔═══════════════════════════════════════════════════╗${colors.reset}`)
    console.log(`${colors.primary}║      🏃 CODE SPRINT CHALLENGE 🏃                 ║${colors.reset}`)
    console.log(`${colors.primary}╚═══════════════════════════════════════════════════╝${colors.reset}\n`)

    console.log(`${diffColor}■ Difficulty:${colors.reset} ${challenge.difficulty.toUpperCase()}`)
    console.log(`${colors.accent}■ Challenge:${colors.reset} ${challenge.description}`)
    console.log(`${colors.dim}■ Time Limit:${colors.reset} ${challenge.timeLimit} seconds\n`)

    console.log(`${colors.wisdom}Code:${colors.reset}`)
    console.log(`${colors.dim}${challenge.codeSnippet}${colors.reset}`)
  }

  // Calculate result
  private calculateResult(userInput: string, timedOut: boolean): CodeSprintResult {
    if (!this.currentChallenge || !this.startTime) {
      throw new Error('No active challenge')
    }

    const timeTaken = (Date.now() - this.startTime) / 1000
    const target = this.currentChallenge.targetCompletion
    const challenge = this.currentChallenge

    // Calculate accuracy
    const accuracy = this.calculateAccuracy(userInput, target)
    const mistakes = this.countMistakes(userInput, target)

    // Calculate WPM (words per minute)
    const words = userInput.split(/\s+/).length
    const wpm = Math.round((words / timeTaken) * 60)

    // Determine success
    const success = !timedOut && accuracy >= 90 // 90% accuracy required

    // Calculate rewards
    let xpReward = challenge.rewards.xp
    let creativityReward = challenge.rewards.creativityPoints
    let bonusMultiplier = 1.0

    if (success) {
      // Time bonus
      const timeRatio = timeTaken / challenge.timeLimit
      if (timeRatio < 0.5) {
        bonusMultiplier = 2.0  // Completed in < 50% of time
      } else if (timeRatio < 0.75) {
        bonusMultiplier = 1.5  // Completed in < 75% of time
      }

      // Accuracy bonus
      if (accuracy === 100) {
        bonusMultiplier += 0.5
      }

      // Apply Blaze's bonus if available
      const blaze = this.gameState.getCharacter('blaze')
      if (blaze) {
        // Assume Blaze provides a bonus method (would need to import Blaze class)
        // For now, calculate based on relationship
        const blazeRelationship = blaze.relationship || 0
        const blazeBonus = 1 + (blazeRelationship / 100) * 0.5  // Up to +50%
        bonusMultiplier *= blazeBonus
      }

      xpReward = Math.floor(xpReward * bonusMultiplier)
      creativityReward = Math.floor(creativityReward * bonusMultiplier)

      // Award rewards
      this.gameState.addXP(xpReward)
      this.gameState.getResourceManager().addResource('creativityPoints', creativityReward)

      // Improve relationships
      for (const rel of challenge.rewards.relationships) {
        this.gameState.improveRelationship(rel.characterId, rel.amount)
      }
    }

    return {
      success,
      timeTaken,
      accuracy,
      wpm,
      mistakes,
      rewards: {
        xp: xpReward,
        creativityPoints: creativityReward,
        bonusMultiplier
      }
    }
  }

  // Calculate accuracy (Levenshtein distance based)
  private calculateAccuracy(input: string, target: string): number {
    if (input === target) return 100

    const distance = this.levenshteinDistance(input, target)
    const maxLength = Math.max(input.length, target.length)

    if (maxLength === 0) return 100

    const accuracy = ((maxLength - distance) / maxLength) * 100
    return Math.max(0, Math.min(100, accuracy))
  }

  // Count mistakes
  private countMistakes(input: string, target: string): number {
    return this.levenshteinDistance(input, target)
  }

  // Levenshtein distance (edit distance)
  private levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length
    const n = str2.length
    const dp: number[][] = []

    for (let i = 0; i <= m; i++) {
      dp[i] = []
      dp[i][0] = i
    }

    for (let j = 0; j <= n; j++) {
      dp[0][j] = j
    }

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1]
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,      // Deletion
            dp[i][j - 1] + 1,      // Insertion
            dp[i - 1][j - 1] + 1   // Substitution
          )
        }
      }
    }

    return dp[m][n]
  }

  // Display result
  public displayResult(result: CodeSprintResult): void {
    console.log('\n')
    console.log(`${colors.primary}╔═══════════════════════════════════════════════════╗${colors.reset}`)

    if (result.success) {
      console.log(`${colors.primary}║          ✅ CHALLENGE COMPLETE! ✅               ║${colors.reset}`)
    } else {
      console.log(`${colors.primary}║          ❌ CHALLENGE FAILED ❌                  ║${colors.reset}`)
    }

    console.log(`${colors.primary}╚═══════════════════════════════════════════════════╝${colors.reset}\n`)

    console.log(`${colors.accent}⏱️  Time:${colors.reset} ${result.timeTaken.toFixed(2)}s`)
    console.log(`${colors.accent}🎯 Accuracy:${colors.reset} ${result.accuracy.toFixed(1)}%`)
    console.log(`${colors.accent}⚡ Speed:${colors.reset} ${result.wpm} WPM`)
    console.log(`${colors.accent}❌ Mistakes:${colors.reset} ${result.mistakes}`)

    if (result.success) {
      console.log(`\n${colors.creativity}📊 REWARDS:${colors.reset}`)
      console.log(`  ${colors.accent}+${result.rewards.xp} XP${colors.reset}`)
      console.log(`  ${colors.creativity}+${result.rewards.creativityPoints} Creativity Points${colors.reset}`)

      if (result.rewards.bonusMultiplier > 1) {
        console.log(`  ${colors.love}🌟 Bonus: ${result.rewards.bonusMultiplier.toFixed(1)}x${colors.reset}`)
      }
    }

    console.log('\n')
  }
}
