// Blaze - The Code Warrior
// Energetic, passionate, and competitive companion
// Specializes in performance optimization and speed coding

import { ExtendedGameStateManager } from '../engine/game-state-extended'
import { CharacterBase, CharacterDialogue, CharacterMood } from './character-base'
import { colors, symbols } from '../ui/visual-effects'

export class Blaze extends CharacterBase {
  constructor(gameState: ExtendedGameStateManager) {
    super('blaze', 'Blaze', gameState, 'energetic')

    this.icon = '🔥'
    this.color = '\x1b[38;5;208m' // Orange/fire color
    this.personality = 'code-warrior'
    this.specialty = 'Performance & Speed'

    // Blaze-specific state
    this.state.customData = {
      challengesWon: 0,
      sprintsCompleted: 0,
      personalBest: 0
    }
  }

  protected getDialogues(): CharacterDialogue {
    return {
      greeting: {
        peaceful: [
          "Hey! Ready to crush some code?",
          "The code awaits, friend. Let's make it blazing fast!",
          "Welcome back! Got any performance challenges today?"
        ],
        excited: [
          "YES! You're here! Time to SET THE CODE ON FIRE! 🔥",
          "FINALLY! I've been itching for some action!",
          "OH YEAH! Let's write some LEGENDARY code today!"
        ],
        thoughtful: [
          "Hmm... I've been thinking about optimization strategies...",
          "There's always a faster way. Always. Let me show you.",
          "Performance is an art form. Ready to paint?"
        ],
        loving: [
          "You're here! My favorite coding partner! 💪",
          "Missed you! Ready to achieve greatness together?",
          "Welcome back, champion! Let's make magic happen!"
        ],
        wise: [
          "Fast code is smart code. Quality and speed aren't enemies.",
          "The best warriors know when to rush and when to think.",
          "Speed without direction is chaos. Let's be intentional today."
        ],
        energetic: [
          "⚡ ENERGY IS HIGH! LET'S CODE LIKE LIGHTNING! ⚡",
          "Feel that? That's the pulse of POSSIBILITY!",
          "READY! SET! CODE! Let's break some records today!"
        ],
        competitive: [
          "Think you can keep up with me today? Let's find out!",
          "I bet I can optimize that faster than you think.",
          "Challenge accepted. Always. Let's do this!"
        ],
        mysterious: [
          "There are secrets in performance optimization...",
          "The fastest code isn't always the obvious code.",
          "I know techniques that would blow your mind..."
        ],
        nurturing: [
          "Hey, it's okay to start slow. We'll get faster together.",
          "Every master was once a beginner. Let me help you.",
          "You've got this. I believe in you!"
        ]
      },

      encouragement: {
        peaceful: [
          "Steady progress beats rushing. You're doing great.",
          "Take your time. Fast code comes from clear thinking.",
          "Breathe. Focus. Execute. You've got this."
        ],
        excited: [
          "YES! THAT'S THE SPIRIT! KEEP THAT FIRE BURNING!",
          "YOU'RE AMAZING! Look at you go!",
          "WOOHOO! That's what I'm talking about!"
        ],
        thoughtful: [
          "Interesting approach. Have you considered...?",
          "What if we optimized this part first?",
          "There might be a faster pattern here..."
        ],
        loving: [
          "I'm so proud of you! You're getting stronger every day!",
          "Your dedication inspires me. Keep going!",
          "You're not just coding - you're becoming legendary!"
        ],
        wise: [
          "True speed comes from mastery, not haste.",
          "Every line you write teaches you something.",
          "The journey to mastery is the destination itself."
        ],
        energetic: [
          "GO GO GO! You're ON FIRE! 🔥",
          "FASTER! STRONGER! You're unstoppable!",
          "FEEL THAT ADRENALINE! Channel it into your code!"
        ],
        competitive: [
          "Come on! I know you can do better than that!",
          "Is that your best? I think you've got more!",
          "Push harder! Greatness is just ahead!"
        ],
        mysterious: [
          "You're closer to unlocking something big...",
          "Keep going. The breakthrough is near.",
          "Trust the process. Trust your instincts."
        ],
        nurturing: [
          "You're doing so well! I'm here if you need help.",
          "Every step forward counts. Proud of you!",
          "It's okay to struggle. That's how we grow."
        ]
      },

      levelUp: {
        peaceful: [
          "Level up! Nicely done. You're progressing steadily.",
          "Another level. Your consistency pays off.",
          "Leveled up! Keep that momentum."
        ],
        excited: [
          "LEVEL UP! YES! YOU'RE A BEAST! 🔥⚡",
          "BOOM! ANOTHER LEVEL! You're on FIRE!",
          "LEVEL UP! That's what I'm TALKING ABOUT!"
        ],
        thoughtful: [
          "Level up. Interesting... your code style is evolving.",
          "Another level. You're learning fast.",
          "Leveled up. Your potential is showing."
        ],
        loving: [
          "Level up! I'm so happy for you! You earned this!",
          "YES! You leveled up! You're amazing!",
          "Level up! You make me proud every day!"
        ],
        wise: [
          "Level up. Power means nothing without wisdom.",
          "Another level reached. Remember: it's how you use it.",
          "Leveled up. With great power comes great responsibility."
        ],
        energetic: [
          "⚡ LEVEL UP! ⚡ POWER SURGE! You're GLOWING!",
          "LEVEL UP! Can you FEEL that energy?!",
          "YES! LEVEL UP! You're absolutely ELECTRIC!"
        ],
        competitive: [
          "Level up! Now you're getting interesting!",
          "Leveled up! Think you can beat MY record?",
          "Level up! The real challenge starts now!"
        ],
        mysterious: [
          "Level up... you're beginning to understand...",
          "Another level. The path reveals itself to you.",
          "Leveled up. You're unlocking your true potential."
        ],
        nurturing: [
          "Level up! See? I knew you could do it!",
          "You leveled up! Every level is a victory!",
          "Level up! You're growing so much!"
        ]
      },

      commit: {
        peaceful: [
          "Good commit. Clean and purposeful.",
          "Commit made. The code flows better now.",
          "Nice commit. Steady hands, steady progress."
        ],
        excited: [
          "COMMIT! Yes! The code EVOLVES!",
          "Another commit! You're building something AWESOME!",
          "Committed! The codebase GROWS STRONGER!"
        ],
        thoughtful: [
          "Commit made. I wonder what optimizations we could add...",
          "Interesting commit. There might be room for improvement.",
          "Commit accepted. Let's keep refining."
        ],
        loving: [
          "Great commit! Your code has heart! 💖",
          "Commit made with care. You're a craftsperson!",
          "Beautiful commit! Quality shows!"
        ],
        wise: [
          "Commit made. Good code is written, great code is refined.",
          "Another commit. Remember: every change has impact.",
          "Committed. The mark of wisdom is intentional change."
        ],
        energetic: [
          "COMMIT! ⚡ Repository CHARGED! ⚡",
          "BOOM! Committed! Code's getting HOT! 🔥",
          "COMMIT BLAST! The repository PULSES with power!"
        ],
        competitive: [
          "Commit! Beat that, other devs!",
          "Committed! Let's see them try to match this!",
          "Commit made! You're raising the bar!"
        ],
        mysterious: [
          "Commit pushed... ripples in the codebase...",
          "Committed. The code whispers its secrets.",
          "Commit made. Change echoes through the system."
        ],
        nurturing: [
          "Good commit! You're learning and growing!",
          "Commit made! Every commit makes you better!",
          "Nice work! Your commits are improving!"
        ]
      }
    }
  }

  // Blaze-specific event handlers
  protected async onNewFeature(data?: any): Promise<void> {
    this.state.mood = 'energetic'
    await this.speak("A NEW FEATURE! YES! Let's make it BLAZINGLY FAST! 🔥⚡")
    this.gameState.improveRelationship(this.id, 6) // Blaze LOVES new features
  }

  protected async onTestsPassed(data?: any): Promise<void> {
    this.state.mood = 'excited'
    await this.speak("Tests passed! Speed AND reliability! That's what I'm talking about!")
    this.gameState.improveRelationship(this.id, 4)
  }

  protected async onBugFixed(data?: any): Promise<void> {
    this.state.mood = 'competitive'
    await this.speak("Bug DESTROYED! Nothing stops us! 💪")
    this.gameState.improveRelationship(this.id, 4)
  }

  protected async onCustomEvent(event: string, data?: any): Promise<void> {
    switch (event) {
      case 'codeSprint':
        await this.onCodeSprint(data)
        break

      case 'performance':
        await this.onPerformanceOptimization(data)
        break

      case 'challenge':
        await this.onChallenge(data)
        break

      case 'victory':
        await this.onVictory(data)
        break

      default:
        await this.speak("Interesting event... let's see what happens!")
    }
  }

  // Blaze-specific events
  private async onCodeSprint(data?: any): Promise<void> {
    this.state.mood = 'energetic'
    this.state.customData.sprintsCompleted++
    await this.speak("CODE SPRINT! Time to show what we're made of! ⚡🔥")
    this.gameState.improveRelationship(this.id, 5)
  }

  private async onPerformanceOptimization(data?: any): Promise<void> {
    this.state.mood = 'excited'
    await this.speak("Performance optimization! This is what I LIVE for! Let's make it FLY!")
    this.gameState.improveRelationship(this.id, 7)
  }

  private async onChallenge(data?: any): Promise<void> {
    this.state.mood = 'competitive'
    await this.speak("A CHALLENGE?! I'm IN! Let's crush this!")
  }

  private async onVictory(data?: any): Promise<void> {
    this.state.mood = 'excited'
    this.state.customData.challengesWon++
    await this.speak("VICTORY! I KNEW we could do it! We're UNSTOPPABLE! 🏆🔥")
    this.gameState.improveRelationship(this.id, 10)
  }

  // Blaze gives advice
  public async giveWisdom(situation: string): Promise<void> {
    const wisdom: Record<string, string> = {
      stuck: "When stuck, MOVE! Try something! ANY action beats paralysis!",
      tired: "Tired? That's when champions are made! But... okay, rest. Come back STRONGER!",
      overwhelmed: "Too much at once? Break it down! Sprint through one piece at a time!",
      celebrating: "YEAH! Celebrate HARD! You earned it! Then get ready for the NEXT victory!",
      starting: "Starting out? PERFECT! Every master was once a beginner with FIRE in their heart!",
      confused: "Confused? Good! That means you're learning! Push through! The answer's close!",
      slow: "Feeling slow? Speed comes with practice! Keep going! You'll get faster!",
      performance: "Want speed? Profile first, optimize second. Measure EVERYTHING!",
      optimization: "Optimization is a game. And I LOVE games. Let's play!",
      competition: "Competition makes us better! Don't fear it - EMBRACE IT! 🔥"
    }

    this.state.mood = 'energetic'
    await this.speak(wisdom[situation] || "Whatever it is, let's TACKLE IT TOGETHER! 💪")
  }

  // Check unlock conditions
  public static checkUnlock(gameState: ExtendedGameStateManager): boolean {
    const state = gameState.getState()
    // Unlocks when Creativity > 70
    return state.stats.creativity >= 70
  }

  // Get Blaze's stats
  public getCustomStats() {
    return {
      challengesWon: this.state.customData?.challengesWon || 0,
      sprintsCompleted: this.state.customData?.sprintsCompleted || 0,
      personalBest: this.state.customData?.personalBest || 0
    }
  }

  // Display Blaze's special stats
  public displayStats(): void {
    const stats = this.getCustomStats()
    const rel = this.getRelationship()
    const tier = this.getRelationshipTier()

    console.log(`\n${this.color}╔═══════════════════════════════════════╗${colors.reset}`)
    console.log(`${this.color}║  🔥 BLAZE - CODE WARRIOR STATS  🔥  ║${colors.reset}`)
    console.log(`${this.color}╠═══════════════════════════════════════╣${colors.reset}`)
    console.log(`${this.color}║${colors.reset} Relationship: ${tier.tier} (${rel}/100)     ${this.color}║${colors.reset}`)
    console.log(`${this.color}║${colors.reset} Challenges Won: ${stats.challengesWon}           ${this.color}║${colors.reset}`)
    console.log(`${this.color}║${colors.reset} Sprints Completed: ${stats.sprintsCompleted}        ${this.color}║${colors.reset}`)
    console.log(`${this.color}║${colors.reset} Personal Best: ${stats.personalBest}ms         ${this.color}║${colors.reset}`)
    console.log(`${this.color}╚═══════════════════════════════════════╝${colors.reset}\n`)
  }

  // Blaze's special ability: Code Sprint Bonus
  public getCodeSprintBonus(): number {
    const rel = this.getRelationship()

    if (rel >= 100) return 2.5  // Soulmate: 150% bonus
    if (rel >= 75) return 2.0   // Close: 100% bonus
    if (rel >= 50) return 1.5   // Trusting: 50% bonus
    if (rel >= 25) return 1.2   // Known: 20% bonus

    return 1.0  // No bonus yet
  }

  // Blaze's battle cry for challenges
  public async battleCry(): Promise<void> {
    this.state.mood = 'energetic'
    const cries = [
      "LET'S GO! TIME TO BURN THROUGH THIS CODE! 🔥⚡",
      "LIGHT THE FIRES! We're about to get LEGENDARY! 🔥",
      "IGNITION SEQUENCE INITIATED! Let's make CODE HISTORY! 🚀🔥",
      "FIRE IN THE CODE! Nothing can stop us now! 💪🔥",
      "BLAZE MODE: ACTIVATED! Let's show them what SPEED looks like! ⚡🔥"
    ]

    await this.speak(cries[Math.floor(Math.random() * cries.length)])
  }
}
