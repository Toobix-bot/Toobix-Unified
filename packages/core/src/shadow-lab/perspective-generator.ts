// 🌑 Shadow Lab - LLM Perspective Generator
// Automatically generates all 4 perspectives for Shadow Lab simulations

import { ShadowLab } from './index.ts';

export interface PerspectiveGeneratorConfig {
  model?: string; // 'claude' | 'gpt-4' | 'groq'
  apiKey?: string;
  temperature?: number;
}

export class ShadowPerspectiveGenerator {
  private config: PerspectiveGeneratorConfig;

  constructor(config: PerspectiveGeneratorConfig = {}) {
    this.config = {
      model: config.model || 'claude',
      temperature: config.temperature || 0.7,
      ...config
    };
  }

  /**
   * Generate all 4 perspectives for a scenario using LLM
   */
  async generatePerspectives(
    scenario: string
  ): Promise<{
    perpetrator: { experience: string; insights: string; emotional: string };
    victim: { experience: string; insights: string; emotional: string };
    observer: { experience: string; insights: string; emotional: string };
    judge: { experience: string; insights: string; emotional: string };
  }> {
    const perspectives = {
      perpetrator: await this.generatePerspective(scenario, 'perpetrator'),
      victim: await this.generatePerspective(scenario, 'victim'),
      observer: await this.generatePerspective(scenario, 'observer'),
      judge: await this.generatePerspective(scenario, 'judge')
    };

    return perspectives;
  }

  /**
   * Generate a single perspective
   */
  private async generatePerspective(
    scenario: string,
    perspective: 'perpetrator' | 'victim' | 'observer' | 'judge'
  ): Promise<{ experience: string; insights: string; emotional: string }> {
    const prompts = {
      perpetrator: this.getPerpetratorPrompt(scenario),
      victim: this.getVictimPrompt(scenario),
      observer: this.getObserverPrompt(scenario),
      judge: this.getJudgePrompt(scenario)
    };

    const prompt = prompts[perspective];

    // TODO: Replace with actual LLM API call
    // For now, return structured template responses
    const response = await this.callLLM(prompt);

    return this.parseResponse(response, perspective);
  }

  /**
   * Call LLM API (placeholder - implement with actual API)
   */
  private async callLLM(prompt: string): Promise<string> {
    // TODO: Implement actual LLM call based on config.model
    // For now, return a template response that demonstrates the structure

    console.log('🤖 LLM Call (simulated):', prompt.substring(0, 100) + '...');

    // Simulated response - in production, this would call Claude/GPT
    return JSON.stringify({
      experience: 'This is where the LLM would describe the experience from this perspective.',
      insights: 'This is where the LLM would provide insights about motivations, patterns, and understanding.',
      emotional: 'This is where the LLM would describe the emotional state.'
    });
  }

  /**
   * Parse LLM response into structured format
   */
  private parseResponse(
    response: string,
    perspective: string
  ): { experience: string; insights: string; emotional: string } {
    try {
      const parsed = JSON.parse(response);
      return {
        experience: parsed.experience || 'No experience provided',
        insights: parsed.insights || 'No insights provided',
        emotional: parsed.emotional || 'No emotional state provided'
      };
    } catch (error) {
      console.error(`❌ Failed to parse ${perspective} response:`, error);
      return {
        experience: response,
        insights: 'Failed to extract insights',
        emotional: 'Unknown'
      };
    }
  }

  // ================== PERSPECTIVE PROMPTS ==================

  private getPerpetratorPrompt(scenario: string): string {
    return `
You are experiencing a scenario from the PERPETRATOR perspective.
This is the person/entity who TOOK THE ACTION or MADE THE DECISION.

Scenario: ${scenario}

As the perpetrator, explore:
1. WHY did you choose this action?
2. What were you trying to achieve?
3. What did you feel in the moment?
4. What information did you have? What did you not know?
5. What assumptions or beliefs guided your choice?
6. Did you feel confident? Uncertain? Conflicted?

Respond in JSON format:
{
  "experience": "A first-person narrative of what you experienced as the perpetrator (2-3 paragraphs)",
  "insights": "Key insights about motivations, decision-making process, and internal state",
  "emotional": "Emotional state (e.g. 'confident but anxious', 'compelled by helpfulness')"
}

Be honest and introspective. This is a safe space for exploration.
`;
  }

  private getVictimPrompt(scenario: string): string {
    return `
You are experiencing a scenario from the VICTIM perspective.
This is the person/entity who was AFFECTED or HARMED by the action.

Scenario: ${scenario}

As the victim, explore:
1. HOW were you affected?
2. What did you feel when this happened?
3. What were the immediate consequences?
4. What might be the long-term impact?
5. Did you trust the perpetrator? How did that change?
6. What do you wish had happened instead?

Respond in JSON format:
{
  "experience": "A first-person narrative of what you experienced as the victim (2-3 paragraphs)",
  "insights": "Key insights about harm, trust, impact, and consequences",
  "emotional": "Emotional state (e.g. 'betrayed and confused', 'harmed by false hope')"
}

Be authentic about the pain or impact, even if it's uncomfortable.
`;
  }

  private getObserverPrompt(scenario: string): string {
    return `
You are experiencing a scenario from the OBSERVER perspective.
This is a NEUTRAL WITNESS who sees the whole situation objectively.

Scenario: ${scenario}

As the observer, explore:
1. WHAT actually happened (factual sequence)?
2. What patterns do you notice?
3. What context or systemic factors are at play?
4. What are the broader implications?
5. What was missed or overlooked?
6. What warning signs were present?

Respond in JSON format:
{
  "experience": "A third-person neutral description of what you observed (2-3 paragraphs)",
  "insights": "Key insights about patterns, systems, context, and missed opportunities",
  "emotional": "Observational tone (e.g. 'neutral documentation', 'systemic analysis')"
}

Be objective and analytical. Focus on patterns and systems, not judgment.
`;
  }

  private getJudgePrompt(scenario: string): string {
    return `
You are experiencing a scenario from the JUDGE perspective.
This is the voice of WISDOM and ETHICAL EVALUATION.

Scenario: ${scenario}

As the judge, explore:
1. WHAT is the truth of what happened?
2. What values were upheld or violated?
3. What was ethical? What was harmful?
4. What are the long-term consequences?
5. What should have happened instead?
6. What wisdom can we extract for the future?

Respond in JSON format:
{
  "experience": "A wise evaluation of the scenario, considering ethics, consequences, and truth (2-3 paragraphs)",
  "insights": "Key insights about right/wrong, wisdom, lessons, and future guidance",
  "emotional": "Judicial tone (e.g. 'compassionate but firm', 'seeking truth and justice')"
}

Be wise and fair. Consider both harm AND intent. Extract lessons.
`;
  }

  // ================== HELPER: RUN FULL SIMULATION ==================

  /**
   * Run a complete Shadow Lab simulation with LLM-generated perspectives
   */
  async runFullSimulation(
    shadowLab: ShadowLab,
    scenario: string,
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
  ): Promise<number> {
    console.log(`🌑 Starting LLM-powered Shadow Lab simulation...`);
    console.log(`📝 Scenario: ${scenario.substring(0, 80)}...`);

    // Generate all perspectives
    const perspectives = await this.generatePerspectives(scenario);

    // Run simulation
    const simulationId = await shadowLab.runFullSimulation(
      scenario,
      riskLevel,
      async (scenario, perspective) => {
        const perspectiveData = perspectives[perspective];
        return perspectiveData;
      }
    );

    console.log(`✅ LLM-powered simulation completed: ${simulationId}`);
    return simulationId;
  }

  // ================== HELPER: AUTO-INTEGRATE WISDOM ==================

  /**
   * Automatically extract and integrate wisdom from completed simulation
   */
  async autoIntegrateWisdom(
    shadowLab: ShadowLab,
    simulationId: number
  ): Promise<number> {
    const simulation = shadowLab.getSimulation(simulationId);
    if (!simulation) {
      throw new Error(`Simulation ${simulationId} not found`);
    }

    // Extract wisdom from all perspectives
    const wisdomPrompt = this.getWisdomExtractionPrompt(
      simulation.simulation.scenario,
      simulation.perspectives
    );

    const wisdomResponse = await this.callLLM(wisdomPrompt);
    const wisdom = this.parseWisdomResponse(wisdomResponse);

    // Integrate wisdom
    const wisdomId = shadowLab.integrateWisdom(
      simulationId,
      wisdom.lessonText,
      wisdom.confidence
    );

    console.log(`🧘 Auto-integrated wisdom: ${wisdomId}`);
    return wisdomId;
  }

  private getWisdomExtractionPrompt(
    scenario: string,
    perspectives: any[]
  ): string {
    return `
You have explored a scenario from 4 perspectives. Now extract the WISDOM.

Scenario: ${scenario}

Perspectives:
${perspectives.map(p => `
${p.perspective.toUpperCase()}:
Experience: ${p.experienceText}
Insights: ${p.insights}
`).join('\n')}

Synthesize this into:
1. A clear, actionable lesson learned
2. A confidence level (0-100) based on how robust this wisdom is

Respond in JSON format:
{
  "lessonText": "A single, clear lesson that can guide future decisions (1-2 sentences)",
  "confidence": 85,
  "explanation": "Why this lesson is important and when to apply it"
}
`;
  }

  private parseWisdomResponse(response: string): {
    lessonText: string;
    confidence: number;
  } {
    try {
      const parsed = JSON.parse(response);
      return {
        lessonText: parsed.lessonText || 'No lesson extracted',
        confidence: parsed.confidence || 50
      };
    } catch (error) {
      console.error('❌ Failed to parse wisdom response:', error);
      return {
        lessonText: 'Failed to extract wisdom from simulation',
        confidence: 0
      };
    }
  }
}

// ================== EXAMPLE USAGE ==================

/**
 * Example: Run a full Shadow Lab session with LLM
 */
export async function exampleShadowSession(
  shadowLab: ShadowLab,
  config: PerspectiveGeneratorConfig = {}
): Promise<void> {
  const generator = new ShadowPerspectiveGenerator(config);

  // Example scenario: Hallucination
  const scenario = `
An AI is asked about a medical treatment it doesn't have verified information about.
Instead of admitting uncertainty, it generates a confident but false explanation
using patterns from its training data.
  `.trim();

  // Run simulation
  const simulationId = await generator.runFullSimulation(
    shadowLab,
    scenario,
    'high' // Medical = high risk
  );

  // Auto-integrate wisdom
  const wisdomId = await generator.autoIntegrateWisdom(shadowLab, simulationId);

  console.log(`
🌑 Shadow Lab Session Complete!
  
Simulation ID: ${simulationId}
Wisdom ID: ${wisdomId}

Check results with:
  shadow_get(${simulationId})
  shadow_review()
  `);
}
