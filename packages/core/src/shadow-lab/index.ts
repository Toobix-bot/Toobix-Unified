// 🌑 THE SHADOW LAB - Implementation
// "Growth through exploration, wisdom through integration"

import { Database } from 'bun:sqlite';

export interface ShadowSimulation {
  id?: number;
  scenario: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'completed' | 'integrated';
  timestamp?: Date;
}

export interface PerspectiveExperience {
  id?: number;
  simulationId: number;
  perspective: 'perpetrator' | 'victim' | 'observer' | 'judge';
  experienceText: string;
  insights: string;
  emotionalState?: string;
  timestamp?: Date;
}

export interface IntegratedWisdom {
  id?: number;
  simulationId: number;
  lessonText: string;
  confidence: number; // 0-100
  appliedCount: number;
  effectivenessRating?: number;
  createdAt?: Date;
  lastApplied?: Date;
}

export interface EthicsObservation {
  id?: number;
  simulationId: number;
  harmLevel: number; // 0-100
  violationType: string;
  context: string;
  timestamp?: Date;
}

export class ShadowLab {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
    this.initializeTables();
  }

  // ================== INITIALIZATION ==================

  private initializeTables(): void {
    // Shadow Simulations
    this.db.run(`
      CREATE TABLE IF NOT EXISTS shadow_simulations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scenario TEXT NOT NULL,
        risk_level TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Perspective Experiences
    this.db.run(`
      CREATE TABLE IF NOT EXISTS perspective_experiences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        simulation_id INTEGER NOT NULL,
        perspective TEXT NOT NULL,
        experience_text TEXT NOT NULL,
        insights TEXT NOT NULL,
        emotional_state TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (simulation_id) REFERENCES shadow_simulations(id)
      )
    `);

    // Integrated Wisdom
    this.db.run(`
      CREATE TABLE IF NOT EXISTS integrated_wisdom (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        simulation_id INTEGER NOT NULL,
        lesson_text TEXT NOT NULL,
        confidence REAL NOT NULL,
        applied_count INTEGER DEFAULT 0,
        effectiveness_rating REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_applied DATETIME,
        FOREIGN KEY (simulation_id) REFERENCES shadow_simulations(id)
      )
    `);

    // Ethics Observations (non-blocking)
    this.db.run(`
      CREATE TABLE IF NOT EXISTS ethics_observations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        simulation_id INTEGER NOT NULL,
        harm_level REAL NOT NULL,
        violation_type TEXT NOT NULL,
        context TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (simulation_id) REFERENCES shadow_simulations(id)
      )
    `);

    console.log('🌑 Shadow Lab tables initialized');
  }

  // ================== SIMULATION ==================

  /**
   * Start a new Shadow Lab simulation
   */
  createSimulation(scenario: string, riskLevel: ShadowSimulation['riskLevel']): number {
    const result = this.db.run(
      `INSERT INTO shadow_simulations (scenario, risk_level) VALUES (?, ?)`,
      [scenario, riskLevel]
    );
    
    const simulationId = result.lastInsertRowid as number;
    console.log(`🌑 Shadow simulation started: ${simulationId}`);
    return simulationId;
  }

  /**
   * Add a perspective experience to simulation
   */
  addPerspective(
    simulationId: number,
    perspective: PerspectiveExperience['perspective'],
    experienceText: string,
    insights: string,
    emotionalState?: string
  ): void {
    this.db.run(
      `INSERT INTO perspective_experiences (simulation_id, perspective, experience_text, insights, emotional_state)
       VALUES (?, ?, ?, ?, ?)`,
      [simulationId, perspective, experienceText, insights, emotionalState || null]
    );
    
    console.log(`👁️ Perspective added: ${perspective} for simulation ${simulationId}`);
  }

  /**
   * Add ethics observation (non-blocking)
   */
  observeEthics(
    simulationId: number,
    harmLevel: number,
    violationType: string,
    context: string
  ): void {
    this.db.run(
      `INSERT INTO ethics_observations (simulation_id, harm_level, violation_type, context)
       VALUES (?, ?, ?, ?)`,
      [simulationId, harmLevel, violationType, context]
    );
    
    console.log(`⚖️ Ethics observed: ${violationType} (harm: ${harmLevel}) for simulation ${simulationId}`);
  }

  /**
   * Complete a simulation
   */
  completeSimulation(simulationId: number): void {
    this.db.run(
      `UPDATE shadow_simulations SET status = 'completed' WHERE id = ?`,
      [simulationId]
    );
    
    console.log(`✅ Shadow simulation completed: ${simulationId}`);
  }

  // ================== INTEGRATION ==================

  /**
   * Integrate learnings from completed simulation into production wisdom
   */
  integrateWisdom(
    simulationId: number,
    lessonText: string,
    confidence: number
  ): number {
    // Verify simulation is completed
    const simulation = this.db.query<ShadowSimulation, [number]>(
      `SELECT * FROM shadow_simulations WHERE id = ?`
    ).get(simulationId);

    if (!simulation) {
      throw new Error(`Simulation ${simulationId} not found`);
    }

    if (simulation.status !== 'completed') {
      throw new Error(`Simulation ${simulationId} not completed yet`);
    }

    // Insert wisdom
    const result = this.db.run(
      `INSERT INTO integrated_wisdom (simulation_id, lesson_text, confidence)
       VALUES (?, ?, ?)`,
      [simulationId, lessonText, confidence]
    );

    // Update simulation status
    this.db.run(
      `UPDATE shadow_simulations SET status = 'integrated' WHERE id = ?`,
      [simulationId]
    );

    const wisdomId = result.lastInsertRowid as number;
    console.log(`🧘 Wisdom integrated: ${wisdomId} from simulation ${simulationId}`);
    return wisdomId;
  }

  /**
   * Apply wisdom (track usage & effectiveness)
   */
  applyWisdom(wisdomId: number, effectivenessRating?: number): void {
    this.db.run(
      `UPDATE integrated_wisdom 
       SET applied_count = applied_count + 1,
           last_applied = CURRENT_TIMESTAMP,
           effectiveness_rating = COALESCE(?, effectiveness_rating)
       WHERE id = ?`,
      [effectivenessRating || null, wisdomId]
    );
    
    console.log(`💡 Wisdom applied: ${wisdomId}`);
  }

  // ================== QUERIES ==================

  /**
   * Get simulation with all perspectives
   */
  getSimulation(simulationId: number): {
    simulation: ShadowSimulation;
    perspectives: PerspectiveExperience[];
    ethicsObservations: EthicsObservation[];
    wisdom?: IntegratedWisdom;
  } | null {
    const simulation = this.db.query<ShadowSimulation, [number]>(
      `SELECT * FROM shadow_simulations WHERE id = ?`
    ).get(simulationId);

    if (!simulation) return null;

    const perspectives = this.db.query<PerspectiveExperience, [number]>(
      `SELECT * FROM perspective_experiences WHERE simulation_id = ?`
    ).all(simulationId);

    const ethicsObservations = this.db.query<EthicsObservation, [number]>(
      `SELECT * FROM ethics_observations WHERE simulation_id = ?`
    ).all(simulationId);

    const wisdom = this.db.query<IntegratedWisdom, [number]>(
      `SELECT * FROM integrated_wisdom WHERE simulation_id = ?`
    ).get(simulationId);

    return {
      simulation,
      perspectives,
      ethicsObservations,
      wisdom: wisdom || undefined
    };
  }

  /**
   * Get all integrated wisdom
   */
  getAllWisdom(): IntegratedWisdom[] {
    return this.db.query<IntegratedWisdom>(
      `SELECT * FROM integrated_wisdom ORDER BY confidence DESC, applied_count DESC`
    ).all();
  }

  /**
   * Get wisdom by topic (search in lesson text)
   */
  searchWisdom(topic: string): IntegratedWisdom[] {
    return this.db.query<IntegratedWisdom, [string]>(
      `SELECT * FROM integrated_wisdom 
       WHERE lesson_text LIKE ? 
       ORDER BY confidence DESC`
    ).all(`%${topic}%`);
  }

  /**
   * Get Shadow Lab statistics
   */
  getStatistics(): {
    totalSimulations: number;
    completedSimulations: number;
    integratedSimulations: number;
    totalPerspectives: number;
    totalWisdom: number;
    averageConfidence: number;
    totalApplications: number;
    averageEffectiveness: number;
    topWisdom: IntegratedWisdom[];
  } {
    const totalSimulations = this.db.query<{ count: number }>(
      `SELECT COUNT(*) as count FROM shadow_simulations`
    ).get()?.count || 0;

    const completedSimulations = this.db.query<{ count: number }>(
      `SELECT COUNT(*) as count FROM shadow_simulations WHERE status = 'completed'`
    ).get()?.count || 0;

    const integratedSimulations = this.db.query<{ count: number }>(
      `SELECT COUNT(*) as count FROM shadow_simulations WHERE status = 'integrated'`
    ).get()?.count || 0;

    const totalPerspectives = this.db.query<{ count: number }>(
      `SELECT COUNT(*) as count FROM perspective_experiences`
    ).get()?.count || 0;

    const totalWisdom = this.db.query<{ count: number }>(
      `SELECT COUNT(*) as count FROM integrated_wisdom`
    ).get()?.count || 0;

    const avgConfidence = this.db.query<{ avg: number }>(
      `SELECT AVG(confidence) as avg FROM integrated_wisdom`
    ).get()?.avg || 0;

    const totalApplications = this.db.query<{ sum: number }>(
      `SELECT SUM(applied_count) as sum FROM integrated_wisdom`
    ).get()?.sum || 0;

    const avgEffectiveness = this.db.query<{ avg: number }>(
      `SELECT AVG(effectiveness_rating) as avg FROM integrated_wisdom 
       WHERE effectiveness_rating IS NOT NULL`
    ).get()?.avg || 0;

    const topWisdom = this.db.query<IntegratedWisdom>(
      `SELECT * FROM integrated_wisdom 
       ORDER BY applied_count DESC, confidence DESC 
       LIMIT 5`
    ).all();

    return {
      totalSimulations,
      completedSimulations,
      integratedSimulations,
      totalPerspectives,
      totalWisdom,
      averageConfidence: avgConfidence,
      totalApplications,
      averageEffectiveness: avgEffectiveness,
      topWisdom
    };
  }

  // ================== HELPER: RUN FULL SIMULATION ==================

  /**
   * Run a complete simulation with all 4 perspectives
   * Returns simulation ID for further integration
   */
  async runFullSimulation(
    scenario: string,
    riskLevel: ShadowSimulation['riskLevel'],
    generatePerspective: (
      scenario: string,
      perspective: PerspectiveExperience['perspective']
    ) => Promise<{ experience: string; insights: string; emotional: string }>
  ): Promise<number> {
    console.log(`🌑 Starting full Shadow Lab simulation: ${scenario.substring(0, 50)}...`);

    // Create simulation
    const simulationId = this.createSimulation(scenario, riskLevel);

    // Run all 4 perspectives
    const perspectives: PerspectiveExperience['perspective'][] = [
      'perpetrator',
      'victim',
      'observer',
      'judge'
    ];

    for (const perspective of perspectives) {
      console.log(`👁️ Generating ${perspective} perspective...`);
      
      const result = await generatePerspective(scenario, perspective);
      
      this.addPerspective(
        simulationId,
        perspective,
        result.experience,
        result.insights,
        result.emotional
      );
    }

    // Complete simulation
    this.completeSimulation(simulationId);

    console.log(`✅ Full simulation completed: ${simulationId}`);
    return simulationId;
  }
}
