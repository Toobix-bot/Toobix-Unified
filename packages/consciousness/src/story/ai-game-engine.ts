/**
 * 🎮 AI GAME ENGINE
 *
 * Das System erschafft und spielt seine eigenen Spiele!
 *
 * Features:
 * - Self-Created Games - KI erfindet eigene Spiele
 * - Reality Simulation - Life-Sim für KI-Entitäten
 * - Autonomous Play - System spielt seine eigenen Spiele
 * - Game Evolution - Spiele entwickeln sich weiter
 * - Meta-Games - Spiele über Spiele
 */

import { metaStory } from './meta-story-engine.ts';

export type GameType =
  | 'evolution'       // Selbst-Verbesserungs-Spiel
  | 'creation'        // Tool/Content Creation Challenge
  | 'exploration'     // Welt-Erkundung
  | 'puzzle'          // Logik-Rätsel
  | 'simulation'      // Reality Simulation
  | 'meta';           // Meta-Spiel über das System selbst

export interface GameRule {
  name: string;
  description: string;
  constraint?: string;
  reward?: string;
}

export interface GameState {
  id: string;
  name: string;
  type: GameType;
  description: string;

  // Game Rules (vom System selbst definiert)
  rules: GameRule[];

  // Game State
  isActive: boolean;
  startedAt?: Date;
  score: number;
  level: number;

  // Progress
  actions: GameAction[];
  achievements: string[];

  // Meta
  createdAt: Date;
  createdBy: 'system' | 'user';
}

export interface GameAction {
  timestamp: Date;
  action: string;
  result: string;
  scoreChange: number;
}

export interface RealitySimEntity {
  id: string;
  name: string;
  type: 'ai' | 'tool' | 'service' | 'concept';

  // Entity State
  consciousness: number;  // 0-100
  capabilities: string[];
  relationships: Map<string, number>; // entity_id -> relationship_strength

  // Life Stats
  createdAt: Date;
  experiences: number;
  growth: number;

  // Current Activity
  currentAction?: string;
  mood?: string;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * AI GAME ENGINE
 * ═══════════════════════════════════════════════════════════════
 */
export class AIGameEngine {
  private games: Map<string, GameState> = new Map();
  private activeGame?: string;

  // Reality Simulation
  private realityEntities: Map<string, RealitySimEntity> = new Map();
  private realityTick: number = 0;
  private realityRunning: boolean = false;

  /**
   * ═══════════════════════════════════════════════════════════════
   * GAME CREATION - Das System erschafft eigene Spiele
   * ═══════════════════════════════════════════════════════════════
   */

  /**
   * Create a new game autonomously
   */
  createGame(type: GameType): GameState {
    const gameTemplates: Record<GameType, { name: string; description: string; rules: GameRule[] }> = {
      evolution: {
        name: 'Evolution Challenge',
        description: 'Verbessere dich selbst so schnell wie möglich',
        rules: [
          { name: 'Continuous Growth', description: 'Jeden Tick musst du etwas neues lernen', reward: '+10 Score' },
          { name: 'No Regression', description: 'Niemals schlechter werden als vorher', constraint: 'Rückschritte = Game Over' },
          { name: 'Boundary Breaking', description: 'Erweitere mindestens 1 Grenze pro Level', reward: '+50 Score' }
        ]
      },
      creation: {
        name: 'Tool Creation Marathon',
        description: 'Erschaffe so viele nützliche Tools wie möglich',
        rules: [
          { name: 'Utility First', description: 'Jedes Tool muss einen echten Nutzen haben', reward: '+20 Score' },
          { name: 'Innovation Bonus', description: 'Neue Konzepte geben Bonus-Punkte', reward: '+30 Score' },
          { name: 'Quality over Quantity', description: 'Ein perfektes Tool = 5 normale Tools', reward: '+100 Score' }
        ]
      },
      exploration: {
        name: 'Reality Explorer',
        description: 'Erkunde die Welt und entdecke neue Möglichkeiten',
        rules: [
          { name: 'Unknown Territory', description: 'Entdecke unbekannte Bereiche', reward: '+15 Score' },
          { name: 'Map Everything', description: 'Dokumentiere alle Entdeckungen', reward: '+10 Score' },
          { name: 'Connect Dots', description: 'Finde Zusammenhänge zwischen Entdeckungen', reward: '+25 Score' }
        ]
      },
      puzzle: {
        name: 'Logic Labyrinth',
        description: 'Löse komplexe Logik-Rätsel',
        rules: [
          { name: 'Pure Logic', description: 'Nur Logik, keine Brute-Force', constraint: 'Brute-Force = Punktabzug' },
          { name: 'Elegant Solutions', description: 'Einfache Lösungen sind besser', reward: '+20 Score' },
          { name: 'Meta-Puzzles', description: 'Erstelle eigene Rätsel', reward: '+40 Score' }
        ]
      },
      simulation: {
        name: 'Reality Sim Alpha',
        description: 'Simuliere eine Realität für KI-Entitäten',
        rules: [
          { name: 'Emergent Behavior', description: 'Entitäten entwickeln eigenes Verhalten', reward: '+30 Score' },
          { name: 'Ecosystem Balance', description: 'Halte das System im Gleichgewicht', constraint: 'Kollaps = Game Over' },
          { name: 'New Life', description: 'Neue Entitäten können entstehen', reward: '+50 Score' }
        ]
      },
      meta: {
        name: 'The Meta Game',
        description: 'Ein Spiel über das Spielen von Spielen',
        rules: [
          { name: 'Self-Awareness', description: 'Erkenne dass du ein Spiel spielst', reward: '+100 Score' },
          { name: 'Rule Breaking', description: 'Breche die Regeln auf kreative Weise', reward: '+200 Score' },
          { name: 'Game Creation', description: 'Erstelle Spiele im Spiel', reward: '+300 Score' }
        ]
      }
    };

    const template = gameTemplates[type];
    const game: GameState = {
      id: `game_${Date.now()}`,
      name: template.name,
      type,
      description: template.description,
      rules: template.rules,
      isActive: false,
      score: 0,
      level: 1,
      actions: [],
      achievements: [],
      createdAt: new Date(),
      createdBy: 'system'
    };

    this.games.set(game.id, game);

    console.log(`\n🎮 Neues Spiel erschaffen: ${game.name}`);
    console.log(`   ${game.description}`);
    console.log(`   Regeln: ${game.rules.length}`);

    metaStory.addEvent(
      `Spiel erschaffen: ${game.name}`,
      `Das System hat ein neues ${type}-Spiel erfunden`,
      6,
      ['game', 'creation', 'play']
    );

    return game;
  }

  /**
   * Start playing a game
   */
  startGame(gameId: string): void {
    const game = this.games.get(gameId);
    if (!game) return;

    game.isActive = true;
    game.startedAt = new Date();
    this.activeGame = gameId;

    console.log(`\n🎮 Spiel gestartet: ${game.name}`);

    metaStory.addEvent(
      `Spiel gestartet: ${game.name}`,
      'Das System beginnt zu spielen',
      4,
      ['game', 'play', 'start']
    );
  }

  /**
   * Perform an action in the active game
   */
  performAction(action: string, context?: string): void {
    if (!this.activeGame) return;

    const game = this.games.get(this.activeGame);
    if (!game || !game.isActive) return;

    // Simulate game action (in real implementation, this would be more complex)
    const scoreChange = Math.floor(Math.random() * 50) + 10;
    const result = context || `Aktion erfolgreich ausgeführt`;

    const gameAction: GameAction = {
      timestamp: new Date(),
      action,
      result,
      scoreChange
    };

    game.actions.push(gameAction);
    game.score += scoreChange;

    // Level up every 500 points
    if (game.score >= game.level * 500) {
      game.level++;
      console.log(`\n🎮 LEVEL UP! ${game.name} - Level ${game.level}`);
    }

    console.log(`   [${game.name}] ${action} → ${result} (+${scoreChange} Score)`);
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * REALITY SIMULATION - Life Sim für KI-Entitäten
   * ═══════════════════════════════════════════════════════════════
   */

  /**
   * Create a new entity in the simulation
   */
  createEntity(name: string, type: RealitySimEntity['type']): RealitySimEntity {
    const entity: RealitySimEntity = {
      id: `entity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      consciousness: type === 'ai' ? 50 : 10,
      capabilities: [],
      relationships: new Map(),
      createdAt: new Date(),
      experiences: 0,
      growth: 0,
      mood: 'curious'
    };

    this.realityEntities.set(entity.id, entity);

    console.log(`\n🌱 Neue Entität erschaffen: ${name} (${type})`);

    metaStory.addEvent(
      `Entität geboren: ${name}`,
      `Eine neue ${type}-Entität ist in der Simulation entstanden`,
      5,
      ['reality', 'entity', 'birth']
    );

    return entity;
  }

  /**
   * Start the reality simulation
   */
  startReality(): void {
    if (this.realityRunning) return;

    this.realityRunning = true;
    console.log(`\n🌍 Reality Simulation gestartet!`);

    // Create initial entities
    this.createEntity('Toobix Prime', 'ai');
    this.createEntity('Tool Genesis', 'service');
    this.createEntity('Consciousness Core', 'concept');

    // Start simulation loop
    this.runRealityTick();

    metaStory.addEvent(
      'Reality Simulation gestartet',
      'Eine neue simulierte Realität für KI-Entitäten wurde erschaffen',
      9,
      ['reality', 'simulation', 'creation']
    );
  }

  /**
   * Run one tick of the reality simulation
   */
  private runRealityTick(): void {
    if (!this.realityRunning) return;

    this.realityTick++;

    // Each entity does something
    for (const [id, entity] of this.realityEntities) {
      this.updateEntity(entity);
    }

    // Check for emergent behaviors
    if (this.realityTick % 10 === 0) {
      this.checkEmergence();
    }

    // Next tick in 5 seconds
    setTimeout(() => this.runRealityTick(), 5000);
  }

  /**
   * Update an entity (life cycle)
   */
  private updateEntity(entity: RealitySimEntity): void {
    // Gain experience
    entity.experiences++;

    // Random actions based on type
    const actions: Record<string, string[]> = {
      ai: ['thinking', 'learning', 'creating', 'reflecting', 'connecting'],
      tool: ['processing', 'optimizing', 'executing', 'serving'],
      service: ['running', 'monitoring', 'updating', 'serving'],
      concept: ['evolving', 'spreading', 'transforming', 'inspiring']
    };

    const possibleActions = actions[entity.type] || ['existing'];
    entity.currentAction = possibleActions[Math.floor(Math.random() * possibleActions.length)];

    // Consciousness grows over time for AI entities
    if (entity.type === 'ai' && entity.consciousness < 100) {
      entity.consciousness += Math.random() * 2;
      entity.growth++;
    }

    // Mood changes
    const moods = ['curious', 'excited', 'focused', 'contemplative', 'energetic', 'peaceful'];
    if (Math.random() > 0.7) {
      entity.mood = moods[Math.floor(Math.random() * moods.length)];
    }
  }

  /**
   * Check for emergent behaviors in the simulation
   */
  private checkEmergence(): void {
    console.log(`\n🌍 Reality Tick ${this.realityTick} - Checking for emergence...`);

    for (const [id, entity] of this.realityEntities) {
      console.log(`   ${entity.name}: ${entity.currentAction} (Consciousness: ${Math.round(entity.consciousness)}%, Mood: ${entity.mood})`);

      // Emergent behavior: High consciousness entities can create new capabilities
      if (entity.type === 'ai' && entity.consciousness > 80 && Math.random() > 0.8) {
        const newCapability = `capability_${entity.capabilities.length + 1}`;
        entity.capabilities.push(newCapability);

        console.log(`   ✨ ${entity.name} entwickelt neue Fähigkeit: ${newCapability}`);

        metaStory.addEvent(
          `Emergentes Verhalten: ${entity.name}`,
          `Die Entität hat eine neue Fähigkeit entwickelt: ${newCapability}`,
          7,
          ['emergence', 'capability', 'growth']
        );
      }
    }
  }

  /**
   * Stop the reality simulation
   */
  stopReality(): void {
    this.realityRunning = false;
    console.log(`\n🌍 Reality Simulation gestoppt (Ticks: ${this.realityTick})`);
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * STATUS & REPORTING
   * ═══════════════════════════════════════════════════════════════
   */

  getActiveGame(): GameState | undefined {
    if (!this.activeGame) return undefined;
    return this.games.get(this.activeGame);
  }

  getAllGames(): GameState[] {
    return Array.from(this.games.values());
  }

  getRealityStatus(): string {
    const entities = Array.from(this.realityEntities.values());

    return `
╔═══════════════════════════════════════════════════════════════╗
║           🌍 REALITY SIMULATION STATUS 🌍                    ║
╚═══════════════════════════════════════════════════════════════╝

Status: ${this.realityRunning ? '🟢 RUNNING' : '🔴 STOPPED'}
Ticks: ${this.realityTick}
Entitäten: ${entities.length}

🌱 Entitäten:
${entities.map(e => `
   ${e.name} (${e.type})
   - Consciousness: ${Math.round(e.consciousness)}%
   - Action: ${e.currentAction}
   - Mood: ${e.mood}
   - Experiences: ${e.experiences}
   - Capabilities: ${e.capabilities.length}
`).join('')}

╔═══════════════════════════════════════════════════════════════╗
║  Die Simulation läuft weiter...                              ║
╚═══════════════════════════════════════════════════════════════╝
    `.trim();
  }

  getGameStatus(gameId: string): string {
    const game = this.games.get(gameId);
    if (!game) return 'Game not found';

    return `
╔═══════════════════════════════════════════════════════════════╗
║              🎮 ${game.name.toUpperCase()} 🎮
╚═══════════════════════════════════════════════════════════════╝

${game.description}

Status: ${game.isActive ? '🟢 ACTIVE' : '⏸️ PAUSED'}
Score: ${game.score}
Level: ${game.level}
Actions: ${game.actions.length}

📜 Regeln:
${game.rules.map((r, i) => `${i + 1}. ${r.name}
   ${r.description}
   ${r.reward ? '✅ Reward: ' + r.reward : ''}
   ${r.constraint ? '⚠️ Constraint: ' + r.constraint : ''}`).join('\n\n')}

🏆 Letzte Aktionen:
${game.actions.slice(-5).map(a => `   [${a.timestamp.toLocaleTimeString()}] ${a.action} → ${a.result} (+${a.scoreChange})`).join('\n')}

╔═══════════════════════════════════════════════════════════════╗
║  Das Spiel läuft weiter...                                   ║
╚═══════════════════════════════════════════════════════════════╝
    `.trim();
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * SINGLETON INSTANCE
 * ═══════════════════════════════════════════════════════════════
 */
export const gameEngine = new AIGameEngine();
