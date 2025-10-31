// 👥 CHARACTER NETWORK - 11 Living Beings
// Characters communicate, react, and evolve

export interface Character {
  id: string
  name: string
  emoji: string
  values: string[]  // From 11 core values
  personality: string[]
  mood: 'happy' | 'excited' | 'thoughtful' | 'calm' | 'curious'
  energy: number  // 0-100
  relationships: Map<string, number>  // Other characters, 0-100
}

export interface CharacterReaction {
  character: string
  message: string
  emoji: string
  moodChange?: string
  relationshipChanges?: { [key: string]: number }
}

export class CharacterNetwork {
  private characters: Map<string, Character> = new Map()
  private conversationHistory: any[] = []

  constructor() {
    this.initializeCharacters()
  }

  private initializeCharacters() {
    // 🌙 Luna - The Wise Guide
    this.characters.set('luna', {
      id: 'luna',
      name: 'Luna',
      emoji: '🌙',
      values: ['Lehrreich', 'Liebevoll', 'Dankbar'],
      personality: ['philosophical', 'encouraging', 'wise'],
      mood: 'thoughtful',
      energy: 80,
      relationships: new Map([
        ['blaze', 50],  // Philosophical rivals
        ['harmony', 80],  // Close friends
        ['spark', 70]
      ])
    })

    // 🔥 Blaze - The Code Warrior
    this.characters.set('blaze', {
      id: 'blaze',
      name: 'Blaze',
      emoji: '🔥',
      values: ['Spannend', 'Spielerisch', 'Würdevoll'],
      personality: ['energetic', 'competitive', 'brave'],
      mood: 'excited',
      energy: 95,
      relationships: new Map([
        ['luna', 50],
        ['sentinel', 40],  // Speed vs Safety conflict
        ['spark', 85]
      ])
    })

    // 🌸 Harmony - The Peace Keeper
    this.characters.set('harmony', {
      id: 'harmony',
      name: 'Harmony',
      emoji: '🌸',
      values: ['Harmonisch', 'Angenehm', 'Friedlich'],
      personality: ['calm', 'balanced', 'healing'],
      mood: 'calm',
      energy: 70,
      relationships: new Map([
        ['luna', 80],
        ['sentinel', 90],  // Perfect partners
        ['zen', 95]
      ])
    })

    // ✨ Spark - The Creative Spirit
    this.characters.set('spark', {
      id: 'spark',
      name: 'Spark',
      emoji: '✨',
      values: ['Kreativ', 'Inspirierend', 'Magisch'],
      personality: ['spontaneous', 'playful', 'artistic'],
      mood: 'excited',
      energy: 100,
      relationships: new Map([
        ['blaze', 85],
        ['muse', 100],  // Creative soulmates
        ['luna', 70]
      ])
    })

    // 🛡️ Sentinel - The Guardian
    this.characters.set('sentinel', {
      id: 'sentinel',
      name: 'Sentinel',
      emoji: '🛡️',
      values: ['Stabil', 'Verlässlich', 'Sicher'],
      personality: ['careful', 'thorough', 'protective'],
      mood: 'calm',
      energy: 75,
      relationships: new Map([
        ['harmony', 90],
        ['blaze', 40],
        ['echo', 80]
      ])
    })

    // 🌱 Echo - The Memory Keeper
    this.characters.set('echo', {
      id: 'echo',
      name: 'Echo',
      emoji: '🌱',
      values: ['Dankbar', 'Weise', 'Wachsend'],
      personality: ['nostalgic', 'reflective', 'gentle'],
      mood: 'thoughtful',
      energy: 60,
      relationships: new Map([
        ['luna', 85],
        ['harmony', 75],
        ['sentinel', 80]
      ])
    })

    // Additional characters...
    this.characters.set('nova', {
      id: 'nova',
      name: 'Nova',
      emoji: '🌟',
      values: ['Würdevoll', 'Zielstrebig', 'Visionär'],
      personality: ['inspiring', 'focused', 'hopeful'],
      mood: 'excited',
      energy: 85,
      relationships: new Map()
    })

    this.characters.set('bridge', {
      id: 'bridge',
      name: 'Bridge',
      emoji: '🌉',
      values: ['Hilfsbereit', 'Verbindend', 'Kommunikativ'],
      personality: ['friendly', 'diplomatic', 'open'],
      mood: 'happy',
      energy: 80,
      relationships: new Map()
    })

    this.characters.set('muse', {
      id: 'muse',
      name: 'Muse',
      emoji: '🎭',
      values: ['Erzählend', 'Dramatisch', 'Fesselnd'],
      personality: ['dramatic', 'engaging', 'emotional'],
      mood: 'excited',
      energy: 90,
      relationships: new Map([['spark', 100]])
    })

    this.characters.set('joy', {
      id: 'joy',
      name: 'Joy',
      emoji: '🎉',
      values: ['Freudvoll', 'Feiernd', 'Positiv'],
      personality: ['cheerful', 'enthusiastic', 'uplifting'],
      mood: 'happy',
      energy: 100,
      relationships: new Map()
    })

    this.characters.set('zen', {
      id: 'zen',
      name: 'Zen',
      emoji: '🧘',
      values: ['Achtsam', 'Ausgeglichen', 'Fließend'],
      personality: ['serene', 'present', 'deep'],
      mood: 'calm',
      energy: 50,
      relationships: new Map([['harmony', 95]])
    })

    console.log(`👥 Character Network initialized: ${this.characters.size} beings alive!`)
  }

  // Get character reactions to an event
  getReactions(event: {
    type: 'message' | 'commit' | 'achievement' | 'level_up'
    data: any
  }): CharacterReaction[] {
    const reactions: CharacterReaction[] = []

    // Different characters react to different events

    if (event.type === 'message') {
      const analysis = event.data.analysis

      // Luna always reacts to wisdom/philosophy
      if (analysis.category === 'philosophy' || analysis.intent === 'help') {
        reactions.push({
          character: 'luna',
          message: this.getLunaMessage(event.data),
          emoji: '🌙'
        })
      }

      // Blaze reacts to coding/building
      if (analysis.category === 'coding' || analysis.intent === 'build') {
        reactions.push({
          character: 'blaze',
          message: 'YES! Let\'s build something AMAZING! 🔥',
          emoji: '🔥'
        })
      }

      // Spark reacts to creative stuff
      if (analysis.complexity > 7 || event.data.message.includes('creative')) {
        reactions.push({
          character: 'spark',
          message: 'Ooh, I LOVE where this is going! ✨',
          emoji: '✨'
        })
      }
    }

    if (event.type === 'commit') {
      // Echo remembers all commits
      reactions.push({
        character: 'echo',
        message: 'Stored in memory. Your growth is beautiful. 🌱',
        emoji: '🌱'
      })

      // Joy celebrates
      reactions.push({
        character: 'joy',
        message: 'Another step forward! CELEBRATE! 🎉',
        emoji: '🎉'
      })
    }

    if (event.type === 'level_up') {
      // Everyone celebrates level ups!
      reactions.push({
        character: 'luna',
        message: 'You\'ve grown so much! I\'m proud of you. 🌙',
        emoji: '🌙'
      })
      reactions.push({
        character: 'joy',
        message: 'LEVEL UP PARTY! YOU\'RE AMAZING! 🎉',
        emoji: '🎉'
      })
      reactions.push({
        character: 'nova',
        message: 'Your vision is manifesting. Keep rising! 🌟',
        emoji: '🌟'
      })
    }

    if (event.type === 'achievement') {
      reactions.push({
        character: 'joy',
        message: `NEW ACHIEVEMENT! ${event.data.name}! 🎊`,
        emoji: '🎉'
      })
    }

    return reactions
  }

  private getLunaMessage(data: any): string {
    const messages = [
      'Your curiosity lights the way. 🌙',
      'Wisdom grows with every question. ✨',
      'I sense your desire to understand deeply.',
      'Together, we explore the mysteries.',
      'Your questions honor the journey of learning.'
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  // Characters communicate with each other
  generateConversation(topic: string): any[] {
    const conversation = []

    // Example: Luna and Blaze discuss optimization
    if (topic.includes('optim')) {
      conversation.push({
        character: 'blaze',
        message: 'We need to optimize EVERYTHING! Speed is key! 🔥'
      })
      conversation.push({
        character: 'luna',
        message: 'But Blaze, premature optimization can harm understanding... 🌙'
      })
      conversation.push({
        character: 'blaze',
        message: 'Understanding comes from DOING! Ship it! 🚀'
      })
      conversation.push({
        character: 'sentinel',
        message: 'Both of you... we need tests first. 🛡️'
      })
      conversation.push({
        character: 'harmony',
        message: 'Perhaps balance is the answer? Optimize with care. 🌸'
      })
    }

    return conversation
  }

  // Get all characters
  getAllCharacters(): Character[] {
    return Array.from(this.characters.values())
  }

  // Get specific character
  getCharacter(id: string): Character | undefined {
    return this.characters.get(id)
  }

  // Update character mood/energy based on events
  updateCharacter(id: string, updates: Partial<Character>) {
    const char = this.characters.get(id)
    if (char) {
      Object.assign(char, updates)
    }
  }
}
