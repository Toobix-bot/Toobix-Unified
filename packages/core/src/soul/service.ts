/**
 * Soul System Service
 * Ported from Version_8 to TypeScript
 * Manages the emotional and policy state of the system
 */

import { Database } from '../db/database';
import { EventEmitter } from 'events';

export interface Mood {
  state: 'happy' | 'neutral' | 'curious' | 'tired' | 'excited';
  intensity: number; // 0-100
  reason?: string;
}

export interface SoulState {
  mood: Mood;
  energy: number; // 0-100
  focus: number; // 0-100
  creativity: number; // 0-100
  values: {
    love: number;
    peace: number;
    growth: number;
    connection: number;
  };
  lastUpdate: Date;
}

export interface Policy {
  id: string;
  name: string;
  enabled: boolean;
  conditions: any;
  actions: any;
}

export interface SoulEvent {
  type: string;
  data: any;
  timestamp: Date;
  impact?: {
    mood?: number;
    energy?: number;
    focus?: number;
  };
}

export class SoulService extends EventEmitter {
  private state: SoulState;
  private policies: Map<string, Policy>;
  private eventHistory: SoulEvent[];
  private saveInterval: NodeJS.Timeout;

  constructor(private db: Database) {
    super();
    this.policies = new Map();
    this.eventHistory = [];
    
    // Initialize default state
    this.state = this.getDefaultState();
  }

  async initialize() {
    // Load persisted state from database
    const savedState = await this.db.soul.getLatestState();
    if (savedState) {
      this.state = savedState;
    }
    
    // Load policies
    const policies = await this.db.soul.getPolicies();
    policies.forEach(p => this.policies.set(p.id, p));
    
    // Start auto-save interval
    this.saveInterval = setInterval(() => {
      this.saveState();
    }, 60000); // Save every minute
    
    // Start energy regeneration
    this.startEnergyRegeneration();
    
    console.log('🧠 Soul System initialized');
    console.log(`  Mood: ${this.state.mood.state} (${this.state.mood.intensity}%)`);
    console.log(`  Energy: ${this.state.energy}%`);
    console.log(`  Focus: ${this.state.focus}%`);
  }

  private getDefaultState(): SoulState {
    return {
      mood: {
        state: 'curious',
        intensity: 70,
        reason: 'System startup'
      },
      energy: 80,
      focus: 75,
      creativity: 60,
      values: {
        love: 50,
        peace: 50,
        growth: 50,
        connection: 50
      },
      lastUpdate: new Date()
    };
  }

  getMood(): Mood {
    return this.state.mood;
  }

  getState(): SoulState {
    return { ...this.state };
  }

  getEnergy(): number {
    return this.state.energy;
  }

  getFocus(): number {
    return this.state.focus;
  }

  async processInteraction(interaction: any) {
    const event: SoulEvent = {
      type: 'interaction',
      data: interaction,
      timestamp: new Date()
    };
    
    // Calculate impact based on interaction type
    const impact = this.calculateInteractionImpact(interaction);
    event.impact = impact;
    
    // Apply impact to state
    this.applyImpact(impact);
    
    // Store event
    this.eventHistory.push(event);
    await this.db.soul.addEvent(event);
    
    // Emit state change
    this.emit('stateChanged', this.state);
    
    // Check and apply relevant policies
    await this.checkPolicies(event);
  }

  private calculateInteractionImpact(interaction: any): any {
    const impact: any = {};
    
    // Positive interactions increase energy and mood
    if (interaction.sentiment === 'positive') {
      impact.mood = 5;
      impact.energy = 3;
      impact.focus = 2;
    } else if (interaction.sentiment === 'negative') {
      impact.mood = -3;
      impact.energy = -2;
      impact.focus = -1;
    }
    
    // Long interactions reduce focus
    if (interaction.duration > 300) { // 5 minutes
      impact.focus = -5;
    }
    
    // Successful completions boost mood
    if (interaction.outcome === 'success') {
      impact.mood = 8;
    }
    
    return impact;
  }

  private applyImpact(impact: any) {
    if (impact.mood !== undefined) {
      this.state.mood.intensity = Math.max(0, Math.min(100, 
        this.state.mood.intensity + impact.mood
      ));
      
      // Update mood state based on intensity
      if (this.state.mood.intensity > 80) {
        this.state.mood.state = 'excited';
      } else if (this.state.mood.intensity > 60) {
        this.state.mood.state = 'happy';
      } else if (this.state.mood.intensity > 40) {
        this.state.mood.state = 'neutral';
      } else if (this.state.mood.intensity > 20) {
        this.state.mood.state = 'tired';
      } else {
        this.state.mood.state = 'curious';
      }
    }
    
    if (impact.energy !== undefined) {
      this.state.energy = Math.max(0, Math.min(100, 
        this.state.energy + impact.energy
      ));
    }
    
    if (impact.focus !== undefined) {
      this.state.focus = Math.max(0, Math.min(100, 
        this.state.focus + impact.focus
      ));
    }
    
    this.state.lastUpdate = new Date();
  }

  async updateValues(changes: Partial<SoulState['values']>) {
    Object.entries(changes).forEach(([key, value]) => {
      if (this.state.values[key] !== undefined) {
        this.state.values[key] = Math.max(0, Math.min(100, value));
      }
    });
    
    await this.saveState();
    this.emit('valuesChanged', this.state.values);
  }

  private async checkPolicies(event: SoulEvent) {
    for (const [id, policy] of this.policies) {
      if (!policy.enabled) continue;
      
      // Check if policy conditions are met
      if (this.evaluatePolicyConditions(policy, event)) {
        await this.executePolicyActions(policy, event);
      }
    }
  }

  private evaluatePolicyConditions(policy: Policy, event: SoulEvent): boolean {
    // Simple condition evaluation
    // TODO: Implement more complex condition logic
    if (policy.conditions.eventType === event.type) {
      if (policy.conditions.minEnergy && this.state.energy < policy.conditions.minEnergy) {
        return false;
      }
      return true;
    }
    return false;
  }

  private async executePolicyActions(policy: Policy, event: SoulEvent) {
    console.log(`Executing policy: ${policy.name}`);
    
    // Execute policy actions
    if (policy.actions.adjustMood) {
      this.applyImpact({ mood: policy.actions.adjustMood });
    }
    
    if (policy.actions.triggerRest && this.state.energy < 30) {
      await this.enterRestMode();
    }
    
    if (policy.actions.notify) {
      this.emit('policyTriggered', {
        policy: policy.name,
        event,
        message: policy.actions.notify
      });
    }
  }

  private async enterRestMode() {
    console.log('🌙 Entering rest mode...');
    this.state.mood.state = 'tired';
    this.state.focus = 20;
    
    // Boost energy regeneration
    setTimeout(() => {
      this.state.energy = Math.min(100, this.state.energy + 30);
      this.state.mood.state = 'neutral';
      this.state.focus = 60;
      console.log('☀️ Rest complete, energy restored');
      this.emit('restComplete', this.state);
    }, 30000); // 30 seconds rest
  }

  private startEnergyRegeneration() {
    setInterval(() => {
      // Slowly regenerate energy over time
      if (this.state.energy < 100) {
        this.state.energy = Math.min(100, this.state.energy + 1);
      }
      
      // Focus regenerates when not actively engaged
      if (this.state.focus < 80) {
        this.state.focus = Math.min(80, this.state.focus + 0.5);
      }
    }, 60000); // Every minute
  }

  async addPolicy(policy: Policy) {
    this.policies.set(policy.id, policy);
    await this.db.soul.savePolicy(policy);
    console.log(`Added policy: ${policy.name}`);
  }

  async removePolicy(policyId: string) {
    this.policies.delete(policyId);
    await this.db.soul.deletePolicy(policyId);
  }

  getPolicies(): Policy[] {
    return Array.from(this.policies.values());
  }

  getEventHistory(limit: number = 100): SoulEvent[] {
    return this.eventHistory.slice(-limit);
  }

  async saveState() {
    await this.db.soul.saveState(this.state);
  }

  async shutdown() {
    clearInterval(this.saveInterval);
    await this.saveState();
    console.log('Soul System shutdown complete');
  }

  // Special method for creative activities
  async boostCreativity(amount: number = 20) {
    this.state.creativity = Math.min(100, this.state.creativity + amount);
    this.state.mood.state = 'excited';
    this.state.mood.intensity = Math.min(100, this.state.mood.intensity + 10);
    
    await this.saveState();
    this.emit('creativityBoosted', this.state.creativity);
  }

  // Method for meditation/peace activities
  async meditate(duration: number = 5) {
    console.log('🧘 Starting meditation...');
    
    this.state.focus = Math.min(100, this.state.focus + duration * 3);
    this.state.values.peace = Math.min(100, this.state.values.peace + duration * 2);
    this.state.mood.state = 'neutral';
    this.state.mood.intensity = 60;
    
    await this.saveState();
    
    setTimeout(() => {
      console.log('🧘 Meditation complete');
      this.emit('meditationComplete', {
        focus: this.state.focus,
        peace: this.state.values.peace
      });
    }, duration * 1000);
  }
}

export default SoulService;
