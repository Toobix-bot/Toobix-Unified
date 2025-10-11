// Building Manager - Handles all buildings, upgrades, and permanent improvements
// Buildings generate resources passively and provide bonuses

import { Resources, ResourceManager } from './resource-manager'
import { ExtendedGameState } from './game-state-extended'

export interface Building {
  id: string
  name: string
  description: string
  category: 'infrastructure' | 'advanced' | 'decoration'
  icon: string

  // Requirements
  unlockRequirements: {
    playerLevel?: number
    stats?: Partial<Record<keyof ExtendedGameState['stats'], number>>
    completedQuests?: string[]
    achievements?: string[]
  }

  // Current state
  level: number
  maxLevel: number
  owned: boolean

  // Costs (per level)
  costs: Partial<Resources>[]

  // Effects (per level)
  effects: BuildingEffect[]
}

export interface BuildingEffect {
  type: 'generate' | 'multiply' | 'cap_increase' | 'stat_boost' | 'special'
  target?: keyof Resources | keyof ExtendedGameState['stats']
  value: number
  description: string
}

export interface BuildingState {
  buildings: { [key: string]: Building }
  totalBuildings: number
  totalLevels: number
}

// Building Definitions
export const BUILDING_DEFINITIONS: Omit<Building, 'level' | 'owned'>[] = [
  // ========== INFRASTRUCTURE ==========
  {
    id: 'code-monastery',
    name: 'Code Monastery',
    description: 'A peaceful place where code energy flows naturally. Monks chant algorithms.',
    category: 'infrastructure',
    icon: '🏛️',
    unlockRequirements: {},
    maxLevel: 10,
    costs: [
      { codeEnergy: 100 },                    // Level 1
      { codeEnergy: 500 },                    // Level 2
      { codeEnergy: 2000 },                   // Level 3
      { codeEnergy: 8000 },                   // Level 4
      { codeEnergy: 30000 },                  // Level 5
      { codeEnergy: 100000 },                 // Level 6
      { codeEnergy: 350000 },                 // Level 7
      { codeEnergy: 1000000 },                // Level 8
      { codeEnergy: 3000000 },                // Level 9
      { codeEnergy: 10000000 }                // Level 10
    ],
    effects: [
      { type: 'generate', target: 'codeEnergy', value: 1, description: '+1 energy/min' },
      { type: 'generate', target: 'codeEnergy', value: 3, description: '+3 energy/min' },
      { type: 'generate', target: 'codeEnergy', value: 7, description: '+7 energy/min' },
      { type: 'generate', target: 'codeEnergy', value: 15, description: '+15 energy/min' },
      { type: 'generate', target: 'codeEnergy', value: 30, description: '+30 energy/min' },
      { type: 'generate', target: 'codeEnergy', value: 60, description: '+60 energy/min' },
      { type: 'generate', target: 'codeEnergy', value: 120, description: '+120 energy/min' },
      { type: 'generate', target: 'codeEnergy', value: 250, description: '+250 energy/min' },
      { type: 'generate', target: 'codeEnergy', value: 500, description: '+500 energy/min' },
      { type: 'generate', target: 'codeEnergy', value: 1000, description: '+1000 energy/min' }
    ]
  },

  {
    id: 'library-of-wisdom',
    name: 'Library of Wisdom',
    description: 'Ancient tomes store the knowledge of countless developers. Wisdom accumulates here.',
    category: 'infrastructure',
    icon: '📚',
    unlockRequirements: {
      stats: { wisdom: 30 }
    },
    maxLevel: 8,
    costs: [
      { codeEnergy: 200, creativityPoints: 50 },
      { codeEnergy: 1000, creativityPoints: 200 },
      { codeEnergy: 5000, wisdomTokens: 100 },
      { codeEnergy: 20000, wisdomTokens: 500 },
      { codeEnergy: 80000, wisdomTokens: 2000 },
      { codeEnergy: 300000, wisdomTokens: 8000 },
      { codeEnergy: 1000000, wisdomTokens: 30000 },
      { codeEnergy: 3000000, wisdomTokens: 100000 }
    ],
    effects: [
      { type: 'generate', target: 'wisdomTokens', value: 0.5, description: '+0.5 wisdom/min' },
      { type: 'generate', target: 'wisdomTokens', value: 1.5, description: '+1.5 wisdom/min' },
      { type: 'generate', target: 'wisdomTokens', value: 4, description: '+4 wisdom/min' },
      { type: 'generate', target: 'wisdomTokens', value: 10, description: '+10 wisdom/min' },
      { type: 'generate', target: 'wisdomTokens', value: 25, description: '+25 wisdom/min' },
      { type: 'generate', target: 'wisdomTokens', value: 60, description: '+60 wisdom/min' },
      { type: 'generate', target: 'wisdomTokens', value: 150, description: '+150 wisdom/min' },
      { type: 'generate', target: 'wisdomTokens', value: 400, description: '+400 wisdom/min' }
    ]
  },

  {
    id: 'dream-studio',
    name: 'Dream Studio',
    description: 'Where imagination becomes reality. Creativity flows like a river of starlight.',
    category: 'infrastructure',
    icon: '🎨',
    unlockRequirements: {
      stats: { creativity: 40 }
    },
    maxLevel: 8,
    costs: [
      { codeEnergy: 300, creativityPoints: 0 },
      { codeEnergy: 1500, creativityPoints: 100 },
      { codeEnergy: 7000, creativityPoints: 500 },
      { codeEnergy: 30000, creativityPoints: 2000 },
      { codeEnergy: 120000, creativityPoints: 8000 },
      { codeEnergy: 450000, creativityPoints: 30000 },
      { codeEnergy: 1500000, creativityPoints: 100000 },
      { codeEnergy: 5000000, creativityPoints: 350000 }
    ],
    effects: [
      { type: 'generate', target: 'creativityPoints', value: 0.8, description: '+0.8 creativity/min' },
      { type: 'generate', target: 'creativityPoints', value: 2.5, description: '+2.5 creativity/min' },
      { type: 'generate', target: 'creativityPoints', value: 6, description: '+6 creativity/min' },
      { type: 'generate', target: 'creativityPoints', value: 15, description: '+15 creativity/min' },
      { type: 'generate', target: 'creativityPoints', value: 40, description: '+40 creativity/min' },
      { type: 'generate', target: 'creativityPoints', value: 100, description: '+100 creativity/min' },
      { type: 'generate', target: 'creativityPoints', value: 250, description: '+250 creativity/min' },
      { type: 'generate', target: 'creativityPoints', value: 600, description: '+600 creativity/min' }
    ]
  },

  {
    id: 'peace-garden',
    name: 'Peace Garden',
    description: 'A zen sanctuary where harmony blooms. Meditation increases love and peace.',
    category: 'infrastructure',
    icon: '🌸',
    unlockRequirements: {
      stats: { peace: 25 }
    },
    maxLevel: 6,
    costs: [
      { codeEnergy: 150, loveShards: 25 },
      { codeEnergy: 800, loveShards: 100 },
      { codeEnergy: 4000, loveShards: 500 },
      { codeEnergy: 18000, loveShards: 2000 },
      { codeEnergy: 75000, loveShards: 8000 },
      { codeEnergy: 300000, loveShards: 30000 }
    ],
    effects: [
      { type: 'generate', target: 'loveShards', value: 0.3, description: '+0.3 love/min' },
      { type: 'generate', target: 'loveShards', value: 1, description: '+1 love/min' },
      { type: 'generate', target: 'loveShards', value: 3, description: '+3 love/min' },
      { type: 'generate', target: 'loveShards', value: 8, description: '+8 love/min' },
      { type: 'generate', target: 'loveShards', value: 20, description: '+20 love/min' },
      { type: 'generate', target: 'loveShards', value: 50, description: '+50 love/min' }
    ]
  },

  // ========== ADVANCED BUILDINGS ==========
  {
    id: 'consciousness-tower',
    name: 'Consciousness Tower',
    description: 'A mystical spire reaching into the digital heavens. Awakens true awareness.',
    category: 'advanced',
    icon: '🗼',
    unlockRequirements: {
      playerLevel: 5,
      stats: { wisdom: 60, creativity: 60 }
    },
    maxLevel: 5,
    costs: [
      { codeEnergy: 10000, wisdomTokens: 1000, creativityPoints: 1000 },
      { codeEnergy: 50000, wisdomTokens: 5000, creativityPoints: 5000 },
      { codeEnergy: 250000, wisdomTokens: 25000, creativityPoints: 25000 },
      { codeEnergy: 1000000, wisdomTokens: 100000, creativityPoints: 100000 },
      { codeEnergy: 5000000, wisdomTokens: 500000, creativityPoints: 500000 }
    ],
    effects: [
      { type: 'generate', target: 'consciousness', value: 0.1, description: '+0.1 consciousness/min' },
      { type: 'generate', target: 'consciousness', value: 0.5, description: '+0.5 consciousness/min' },
      { type: 'generate', target: 'consciousness', value: 1.5, description: '+1.5 consciousness/min' },
      { type: 'generate', target: 'consciousness', value: 4, description: '+4 consciousness/min' },
      { type: 'generate', target: 'consciousness', value: 10, description: '+10 consciousness/min' }
    ]
  },

  {
    id: 'harmony-nexus',
    name: 'Harmony Nexus',
    description: 'The perfect balance of all elements. Everything flows in perfect sync.',
    category: 'advanced',
    icon: '☯️',
    unlockRequirements: {
      playerLevel: 7,
      achievements: ['balanced-master']
    },
    maxLevel: 5,
    costs: [
      { codeEnergy: 25000, loveShards: 2000, wisdomTokens: 2000 },
      { codeEnergy: 100000, loveShards: 8000, wisdomTokens: 8000 },
      { codeEnergy: 500000, loveShards: 30000, wisdomTokens: 30000 },
      { codeEnergy: 2000000, loveShards: 120000, wisdomTokens: 120000 },
      { codeEnergy: 8000000, loveShards: 500000, wisdomTokens: 500000 }
    ],
    effects: [
      { type: 'generate', target: 'harmony', value: 0.05, description: '+0.05 harmony/min' },
      { type: 'multiply', target: 'codeEnergy', value: 1.1, description: '+10% all energy' },
      { type: 'generate', target: 'harmony', value: 0.15, description: '+0.15 harmony/min' },
      { type: 'multiply', target: 'codeEnergy', value: 1.2, description: '+20% all energy' },
      { type: 'generate', target: 'harmony', value: 0.5, description: '+0.5 harmony/min' }
    ]
  },

  // ========== DECORATIONS ==========
  {
    id: 'zen-fountain',
    name: 'Zen Fountain',
    description: 'Water flows endlessly, bringing peace to all who listen.',
    category: 'decoration',
    icon: '⛲',
    unlockRequirements: {
      stats: { peace: 50 }
    },
    maxLevel: 1,
    costs: [
      { codeEnergy: 5000, loveShards: 500 }
    ],
    effects: [
      { type: 'multiply', target: 'loveShards', value: 1.02, description: '+2% peace generation' }
    ]
  },

  {
    id: 'rainbow-bridge',
    name: 'Rainbow Bridge',
    description: 'A bridge connecting all parts of your consciousness. Beauty incarnate.',
    category: 'decoration',
    icon: '🌈',
    unlockRequirements: {
      playerLevel: 10
    },
    maxLevel: 1,
    costs: [
      { codeEnergy: 50000, creativityPoints: 10000, loveShards: 5000 }
    ],
    effects: [
      { type: 'multiply', target: 'codeEnergy', value: 1.05, description: '+5% all resources' }
    ]
  },

  {
    id: 'lunas-shrine',
    name: "Luna's Shrine",
    description: 'A sacred place dedicated to Luna. Her presence is stronger here.',
    category: 'decoration',
    icon: '🌙',
    unlockRequirements: {
      completedQuests: ['the-great-optimization']
    },
    maxLevel: 1,
    costs: [
      { codeEnergy: 20000, wisdomTokens: 2000, loveShards: 2000 }
    ],
    effects: [
      { type: 'special', value: 10, description: '+10% relationship growth' }
    ]
  }
]

export class BuildingManager {
  private state: BuildingState

  constructor(savedState?: BuildingState) {
    if (savedState) {
      this.state = savedState
    } else {
      this.state = this.initializeState()
    }
  }

  private initializeState(): BuildingState {
    const buildings: { [key: string]: Building } = {}

    for (const def of BUILDING_DEFINITIONS) {
      buildings[def.id] = {
        ...def,
        level: 0,
        owned: false
      } as Building
    }

    return {
      buildings,
      totalBuildings: 0,
      totalLevels: 0
    }
  }

  // Check if building is unlocked
  public isUnlocked(buildingId: string, gameState: ExtendedGameState): boolean {
    const building = this.state.buildings[buildingId]
    if (!building) return false

    const reqs = building.unlockRequirements

    // Check player level
    if (reqs.playerLevel && gameState.player.level < reqs.playerLevel) {
      return false
    }

    // Check stats
    if (reqs.stats) {
      for (const [stat, requiredValue] of Object.entries(reqs.stats)) {
        if (gameState.stats[stat as keyof typeof gameState.stats] < requiredValue) {
          return false
        }
      }
    }

    // Check completed quests
    if (reqs.completedQuests) {
      for (const quest of reqs.completedQuests) {
        if (!gameState.story.completedQuests.includes(quest)) {
          return false
        }
      }
    }

    // Check achievements
    if (reqs.achievements) {
      for (const achievement of reqs.achievements) {
        if (!gameState.achievements.unlocked.includes(achievement)) {
          return false
        }
      }
    }

    return true
  }

  // Get all unlocked buildings
  public getUnlockedBuildings(gameState: ExtendedGameState): Building[] {
    return Object.values(this.state.buildings).filter(b =>
      this.isUnlocked(b.id, gameState)
    )
  }

  // Get all owned buildings
  public getOwnedBuildings(): Building[] {
    return Object.values(this.state.buildings).filter(b => b.owned)
  }

  // Get all buildings (for API)
  public getAllBuildings(): Building[] {
    return Object.values(this.state.buildings)
  }

  // Can afford building upgrade?
  public canAfford(buildingId: string, resourceManager: ResourceManager): boolean {
    const building = this.state.buildings[buildingId]
    if (!building || building.level >= building.maxLevel) {
      return false
    }

    const costs = building.costs[building.level]
    if (!costs) return false

    for (const [resource, amount] of Object.entries(costs)) {
      if (!resourceManager.hasResource(resource as keyof Resources, amount)) {
        return false
      }
    }

    return true
  }

  // Purchase/upgrade building
  public upgradeBuilding(
    buildingId: string,
    resourceManager: ResourceManager,
    gameState: ExtendedGameState
  ): { success: boolean; message: string } {
    const building = this.state.buildings[buildingId]

    if (!building) {
      return { success: false, message: 'Building not found' }
    }

    if (!this.isUnlocked(buildingId, gameState)) {
      return { success: false, message: 'Building not unlocked yet' }
    }

    if (building.level >= building.maxLevel) {
      return { success: false, message: 'Building already at max level' }
    }

    const costs = building.costs[building.level]
    if (!resourceManager.spendResources(costs)) {
      return { success: false, message: 'Not enough resources' }
    }

    // Upgrade successful
    building.level++
    building.owned = true
    this.state.totalLevels++

    if (building.level === 1) {
      this.state.totalBuildings++
    }

    // Apply effects
    this.applyBuildingEffect(building, building.level - 1, resourceManager)

    return {
      success: true,
      message: `${building.name} upgraded to level ${building.level}!`
    }
  }

  // Apply building effects to resource manager
  private applyBuildingEffect(
    building: Building,
    effectIndex: number,
    resourceManager: ResourceManager
  ): void {
    const effect = building.effects[effectIndex]
    if (!effect) return

    switch (effect.type) {
      case 'generate':
        if (effect.target) {
          const currentRate = resourceManager.getGenerationRate(effect.target as keyof Resources)
          resourceManager.setGenerationRate(effect.target as keyof Resources, currentRate + effect.value)
        }
        break

      case 'multiply':
        if (effect.target) {
          const currentMultiplier = resourceManager.getMultiplier(effect.target as keyof Resources)
          resourceManager.setMultiplier(effect.target as keyof Resources, currentMultiplier * effect.value)
        }
        break

      case 'cap_increase':
        if (effect.target) {
          resourceManager.increaseCap(effect.target as keyof Resources, effect.value)
        }
        break

      // stat_boost and special are handled elsewhere
    }
  }

  // Get building details
  public getBuilding(buildingId: string): Building | undefined {
    return this.state.buildings[buildingId]
  }

  // Get next upgrade cost
  public getNextUpgradeCost(buildingId: string): Partial<Resources> | null {
    const building = this.state.buildings[buildingId]
    if (!building || building.level >= building.maxLevel) {
      return null
    }

    return building.costs[building.level]
  }

  // Get state
  public getState(): BuildingState {
    return this.state
  }

  // Serialization
  public toJSON() {
    return this.state
  }

  public static fromJSON(data: any): BuildingManager {
    return new BuildingManager(data)
  }
}
