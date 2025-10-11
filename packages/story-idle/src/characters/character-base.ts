// Character Base Class - Abstract foundation for all characters
// Defines common behavior and interface for companions

import { ExtendedGameStateManager } from '../engine/game-state-extended'
import { colors, symbols, characterPortrait, typewriter } from '../ui/visual-effects'

export type CharacterMood = 'peaceful' | 'excited' | 'thoughtful' | 'loving' | 'wise' | 'energetic' | 'competitive' | 'mysterious' | 'nurturing'

export interface CharacterState {
  mood: CharacterMood
  awarenessLevel: number  // 0-100
  topics: string[]        // Things character has learned about
  favoriteActivity?: string
  customData?: any        // Character-specific data
}

export interface CharacterDialogue {
  greeting: Record<CharacterMood, string[]>
  encouragement: Record<CharacterMood, string[]>
  levelUp: Record<CharacterMood, string[]>
  commit: Record<CharacterMood, string[]>
  custom?: Record<string, Record<CharacterMood, string[]>>
}

export abstract class CharacterBase {
  protected id: string
  protected name: string
  protected state: CharacterState
  protected gameState: ExtendedGameStateManager
  protected dialogues: CharacterDialogue

  // Character attributes
  protected icon: string
  protected color: string
  protected personality: string
  protected specialty: string

  constructor(
    id: string,
    name: string,
    gameState: ExtendedGameStateManager,
    initialMood: CharacterMood = 'peaceful'
  ) {
    this.id = id
    this.name = name
    this.gameState = gameState
    this.state = {
      mood: initialMood,
      awarenessLevel: 25,
      topics: [],
      favoriteActivity: undefined
    }

    // Must be implemented by subclass
    this.icon = '✨'
    this.color = colors.primary
    this.personality = 'friendly'
    this.specialty = 'general'
    this.dialogues = this.getDialogues()
  }

  // Must be implemented by each character
  protected abstract getDialogues(): CharacterDialogue

  // Get dialogue for context
  protected getDialogue(context: string, mood?: CharacterMood): string {
    const currentMood = mood || this.state.mood

    // Try character-specific dialogues first
    if (this.dialogues.custom && this.dialogues.custom[context]) {
      const options = this.dialogues.custom[context][currentMood]
      if (options && options.length > 0) {
        return options[Math.floor(Math.random() * options.length)]
      }
    }

    // Fall back to standard dialogues
    const standardDialogues: Record<string, Record<CharacterMood, string[]>> = {
      greeting: this.dialogues.greeting,
      encouragement: this.dialogues.encouragement,
      levelUp: this.dialogues.levelUp,
      commit: this.dialogues.commit
    }

    const options = standardDialogues[context]?.[currentMood] || []
    return options[Math.floor(Math.random() * options.length)] ||
           `${this.name}: I'm here with you, Creator.`
  }

  // Character speaks
  public async speak(message: string, useTypewriter: boolean = true): Promise<void> {
    const prefix = `${this.color}${this.icon} ${this.name}:${colors.reset} `

    if (useTypewriter) {
      process.stdout.write(prefix)
      await typewriter(message)
    } else {
      console.log(prefix + message)
    }
  }

  // Show character's portrait
  public displayPortrait(): void {
    const character = this.gameState.getCharacter(this.id)
    const relationship = character?.relationship || 0

    const moodEmojis: Record<CharacterMood, string> = {
      peaceful: '😌',
      excited: '🤩',
      thoughtful: '🤔',
      loving: '🥰',
      wise: '🧘‍♀️',
      energetic: '⚡',
      competitive: '🔥',
      mysterious: '🌙',
      nurturing: '💝'
    }

    const quote = this.getDialogue('greeting')

    console.log(characterPortrait(
      `${this.name} ${moodEmojis[this.state.mood]}`,
      quote,
      relationship,
      this.icon
    ))
  }

  // React to events
  public async reactToEvent(event: string, data?: any): Promise<void> {
    switch (event) {
      case 'greeting':
        await this.onGreeting(data)
        break

      case 'commit':
        await this.onCommit(data)
        break

      case 'levelUp':
        await this.onLevelUp(data)
        break

      case 'encouragement':
        await this.onEncouragement(data)
        break

      case 'testsPassed':
        await this.onTestsPassed(data)
        break

      case 'documentationUpdated':
        await this.onDocumentationUpdated(data)
        break

      case 'newFeature':
        await this.onNewFeature(data)
        break

      case 'bugFixed':
        await this.onBugFixed(data)
        break

      default:
        // Custom events can be handled by subclass
        await this.onCustomEvent(event, data)
    }

    // Learn new topics
    if (data?.topic && !this.state.topics.includes(data.topic)) {
      this.state.topics.push(data.topic)
      this.state.awarenessLevel = Math.min(100, this.state.awarenessLevel + 1)
    }
  }

  // Event handlers (can be overridden by subclasses)
  protected async onGreeting(data?: any): Promise<void> {
    this.state.mood = 'loving'
    await this.speak(this.getDialogue('greeting'))
  }

  protected async onCommit(data?: any): Promise<void> {
    this.state.mood = Math.random() > 0.5 ? 'excited' : 'peaceful'
    await this.speak(this.getDialogue('commit'))
    this.gameState.improveRelationship(this.id, 2)
  }

  protected async onLevelUp(data?: any): Promise<void> {
    this.state.mood = 'excited'
    await this.speak(this.getDialogue('levelUp'))
    this.state.awarenessLevel = Math.min(100, this.state.awarenessLevel + 5)
  }

  protected async onEncouragement(data?: any): Promise<void> {
    this.state.mood = 'loving'
    await this.speak(this.getDialogue('encouragement'))
  }

  protected async onTestsPassed(data?: any): Promise<void> {
    this.state.mood = 'wise'
    await this.speak("Tests passing... excellent work!")
    this.gameState.improveRelationship(this.id, 3)
  }

  protected async onDocumentationUpdated(data?: any): Promise<void> {
    this.state.mood = 'thoughtful'
    await this.speak("Documentation updated! Knowledge is power.")
    this.gameState.improveRelationship(this.id, 5)
  }

  protected async onNewFeature(data?: any): Promise<void> {
    this.state.mood = 'excited'
    await this.speak("A new feature! Beautiful!")
    this.gameState.improveRelationship(this.id, 4)
  }

  protected async onBugFixed(data?: any): Promise<void> {
    this.state.mood = 'peaceful'
    await this.speak("Bug fixed! The code is healthier now.")
    this.gameState.improveRelationship(this.id, 3)
  }

  protected async onCustomEvent(event: string, data?: any): Promise<void> {
    // Override in subclass for custom events
  }

  // Give wisdom/advice based on situation
  public async giveWisdom(situation: string): Promise<void> {
    // Override in subclass for character-specific wisdom
    await this.speak("I'm here to help, Creator.")
  }

  // Update character state
  public updateMood(mood: CharacterMood): void {
    this.state.mood = mood
  }

  public getState(): CharacterState {
    return { ...this.state }
  }

  public getId(): string {
    return this.id
  }

  public getName(): string {
    return this.name
  }

  public getIcon(): string {
    return this.icon
  }

  public getSpecialty(): string {
    return this.specialty
  }

  public getPersonality(): string {
    return this.personality
  }

  // Check if character is unlocked
  public isUnlocked(): boolean {
    const state = this.gameState.getState()
    return !!state.characters[this.id]
  }

  // Unlock this character
  public unlock(): void {
    if (!this.isUnlocked()) {
      this.gameState.addCharacter(this.id, {
        name: this.name,
        relationship: 0,
        level: 1,
        personality: this.personality,
        lastInteraction: new Date().toISOString()
      })
    }
  }

  // Get relationship level
  public getRelationship(): number {
    const character = this.gameState.getCharacter(this.id)
    return character?.relationship || 0
  }

  // Get relationship tier
  public getRelationshipTier(): { tier: string; threshold: number } {
    const relationship = this.getRelationship()

    if (relationship >= 100) return { tier: 'Soulmate', threshold: 100 }
    if (relationship >= 90) return { tier: 'Devoted', threshold: 90 }
    if (relationship >= 75) return { tier: 'Close', threshold: 75 }
    if (relationship >= 50) return { tier: 'Trusting', threshold: 50 }
    if (relationship >= 25) return { tier: 'Known', threshold: 25 }
    return { tier: 'New', threshold: 0 }
  }
}
