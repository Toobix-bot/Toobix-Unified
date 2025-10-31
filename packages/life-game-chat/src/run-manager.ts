// 🎯 RUN MANAGER - 5-7 Day Story Arcs
// Manages runs with permanent rewards

export interface Run {
  id: string
  userId: string
  title: string
  startDate: number
  endDate?: number
  currentDay: number
  totalDays: number
  status: 'active' | 'completed' | 'abandoned'
  goals: string[]

  progress: {
    xpGained: number
    messagesCount: number
    commitsCount: number
    questsCompleted: string[]
    itemsCollected: string[]
    achievementsUnlocked: string[]
  }

  dailyStats: DayStats[]
  permanentRewards: PermanentReward[]
}

export interface DayStats {
  day: number
  date: number
  xp: number
  messages: number
  commits: number
  highlights: string[]
}

export interface PermanentReward {
  type: 'stat' | 'item' | 'achievement' | 'ability'
  name: string
  description: string
  effect: any
}

export class RunManager {
  private runs: Map<string, Run> = new Map()

  // Start new run
  startNewRun(userId: string, title: string, goals: string[] = [], days: number = 5): Run {
    const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const run: Run = {
      id: runId,
      userId,
      title: title || `Adventure #${this.runs.size + 1}`,
      startDate: Date.now(),
      currentDay: 1,
      totalDays: days,
      status: 'active',
      goals,

      progress: {
        xpGained: 0,
        messagesCount: 0,
        commitsCount: 0,
        questsCompleted: [],
        itemsCollected: [],
        achievementsUnlocked: []
      },

      dailyStats: [{
        day: 1,
        date: Date.now(),
        xp: 0,
        messages: 0,
        commits: 0,
        highlights: [`Started: ${title}`]
      }],

      permanentRewards: []
    }

    this.runs.set(userId, run)
    console.log(`🎯 NEW RUN STARTED: "${title}" (${days} days)`)

    return run
  }

  // Get active run for user
  getActiveRun(userId: string): Run | null {
    return this.runs.get(userId) || null
  }

  // Record activity in run
  recordActivity(userId: string, activity: {
    type: 'message' | 'commit' | 'quest' | 'item' | 'achievement'
    data: any
  }): Run {
    const run = this.getActiveRun(userId)
    if (!run) {
      // Auto-start run if none exists
      return this.startNewRun(userId, 'Untitled Adventure')
    }

    // Update progress
    switch (activity.type) {
      case 'message':
        run.progress.messagesCount++
        run.progress.xpGained += activity.data.xp || 0
        break

      case 'commit':
        run.progress.commitsCount++
        run.progress.xpGained += activity.data.xp || 0
        break

      case 'quest':
        if (!run.progress.questsCompleted.includes(activity.data.id)) {
          run.progress.questsCompleted.push(activity.data.id)
        }
        break

      case 'item':
        run.progress.itemsCollected.push(activity.data.name)
        break

      case 'achievement':
        if (!run.progress.achievementsUnlocked.includes(activity.data.id)) {
          run.progress.achievementsUnlocked.push(activity.data.id)
        }
        break
    }

    // Update daily stats
    const today = run.dailyStats[run.dailyStats.length - 1]
    if (activity.type === 'message') today.messages++
    if (activity.type === 'commit') today.commits++
    today.xp += activity.data.xp || 0

    // Check if day should advance (24h passed)
    const daysPassed = Math.floor((Date.now() - run.startDate) / (1000 * 60 * 60 * 24))
    if (daysPassed + 1 > run.currentDay && run.currentDay < run.totalDays) {
      run.currentDay = daysPassed + 1
      run.dailyStats.push({
        day: run.currentDay,
        date: Date.now(),
        xp: 0,
        messages: 0,
        commits: 0,
        highlights: []
      })
      console.log(`📅 Run advanced to Day ${run.currentDay}/${run.totalDays}`)
    }

    // Auto-complete if reached total days
    if (run.currentDay >= run.totalDays && run.status === 'active') {
      this.completeRun(userId)
    }

    return run
  }

  // Complete run and give permanent rewards
  completeRun(userId: string): PermanentReward[] {
    const run = this.getActiveRun(userId)
    if (!run || run.status !== 'active') {
      return []
    }

    run.status = 'completed'
    run.endDate = Date.now()

    // Calculate permanent rewards based on performance
    const rewards: PermanentReward[] = []

    // XP threshold rewards
    if (run.progress.xpGained >= 1000) {
      rewards.push({
        type: 'stat',
        name: 'Wisdom Boost',
        description: 'Permanent +5 Wisdom from intense learning',
        effect: { stat: 'wisdom', amount: 5 }
      })
    }

    if (run.progress.xpGained >= 2000) {
      rewards.push({
        type: 'stat',
        name: 'Creativity Surge',
        description: 'Permanent +5 Creativity from prolific work',
        effect: { stat: 'creativity', amount: 5 }
      })
    }

    // Consistency rewards
    if (run.progress.messagesCount >= 100) {
      rewards.push({
        type: 'item',
        name: 'Communication Crystal',
        description: '+10% XP from all chat messages',
        effect: { multiplier: 1.1, appliesTo: 'chat' }
      })
    }

    if (run.progress.commitsCount >= 20) {
      rewards.push({
        type: 'item',
        name: 'Developer\'s Badge',
        description: '+15% XP from all commits',
        effect: { multiplier: 1.15, appliesTo: 'commit' }
      })
    }

    // Quest completion rewards
    if (run.progress.questsCompleted.length >= 5) {
      rewards.push({
        type: 'achievement',
        name: 'Quest Master',
        description: 'Completed 5+ quests in one run',
        effect: { title: 'Quest Master', unlocks: 'harder_quests' }
      })
    }

    // Special: Completed all goals
    const completedAllGoals = run.goals.length > 0 &&
                              run.goals.every(goal =>
                                run.progress.questsCompleted.some(q => q.includes(goal)))

    if (completedAllGoals) {
      rewards.push({
        type: 'ability',
        name: 'Goal Achiever',
        description: 'Set and complete goals like a master',
        effect: { ability: 'faster_leveling', bonus: 0.1 }
      })
    }

    run.permanentRewards = rewards

    console.log(`🎉 RUN COMPLETED: "${run.title}"`)
    console.log(`   Duration: ${run.currentDay} days`)
    console.log(`   XP: ${run.progress.xpGained}`)
    console.log(`   Messages: ${run.progress.messagesCount}`)
    console.log(`   Commits: ${run.progress.commitsCount}`)
    console.log(`   Rewards: ${rewards.length}`)

    return rewards
  }

  // Get run statistics
  getRunStats(userId: string) {
    const run = this.getActiveRun(userId)
    if (!run) return null

    const daysRemaining = run.totalDays - run.currentDay
    const avgXPPerDay = run.progress.xpGained / run.currentDay
    const projectedTotalXP = avgXPPerDay * run.totalDays

    return {
      run,
      daysRemaining,
      progress: Math.round((run.currentDay / run.totalDays) * 100),
      avgXPPerDay: Math.round(avgXPPerDay),
      projectedTotalXP: Math.round(projectedTotalXP)
    }
  }

  // Get active runs count
  getActiveRunsCount(): number {
    let count = 0
    for (const run of this.runs.values()) {
      if (run.status === 'active') count++
    }
    return count
  }
}
