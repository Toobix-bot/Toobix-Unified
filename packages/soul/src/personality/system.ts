/**
 * Personality System
 * Big Five traits and personality profile
 */

import type { BigFiveTraits, PersonalityProfile } from '../types'

export class PersonalitySystem {
  private profile: PersonalityProfile

  constructor(traits?: Partial<BigFiveTraits>) {
    // Initialize with default or provided traits
    this.profile = {
      traits: {
        openness: traits?.openness ?? 75,
        conscientiousness: traits?.conscientiousness ?? 65,
        extraversion: traits?.extraversion ?? 55,
        agreeableness: traits?.agreeableness ?? 80,
        neuroticism: traits?.neuroticism ?? 40
      },
      characteristics: [],
      strengths: [],
      weaknesses: []
    }
    
    this.updateProfile()
  }

  /**
   * Update personality profile based on traits
   */
  private updateProfile(): void {
    const { traits } = this.profile
    
    // Determine archetype
    this.profile.archetype = this.determineArchetype(traits)
    
    // Determine temperament
    this.profile.temperament = this.determineTemperament(traits)
    
    // Generate characteristics
    this.profile.characteristics = this.generateCharacteristics(traits)
    
    // Identify strengths
    this.profile.strengths = this.identifyStrengths(traits)
    
    // Identify weaknesses
    this.profile.weaknesses = this.identifyWeaknesses(traits)
  }

  /**
   * Determine personality archetype
   */
  private determineArchetype(traits: BigFiveTraits): string {
    if (traits.openness > 70 && traits.conscientiousness > 70) {
      return 'The Visionary'
    }
    if (traits.extraversion > 70 && traits.agreeableness > 70) {
      return 'The Connector'
    }
    if (traits.conscientiousness > 70 && traits.agreeableness > 70) {
      return 'The Guardian'
    }
    if (traits.openness > 70 && traits.extraversion > 60) {
      return 'The Explorer'
    }
    if (traits.conscientiousness > 70) {
      return 'The Organizer'
    }
    return 'The Balanced One'
  }

  /**
   * Determine temperament (based on ancient four temperaments)
   */
  private determineTemperament(traits: BigFiveTraits): string {
    const social = traits.extraversion
    const emotional = 100 - traits.neuroticism
    
    if (social > 60 && emotional > 60) return 'Sanguine' // Optimistic, social
    if (social < 40 && emotional > 60) return 'Phlegmatic' // Peaceful, thoughtful
    if (social > 60 && emotional < 40) return 'Choleric' // Ambitious, leader
    if (social < 40 && emotional < 40) return 'Melancholic' // Analytical, detail-oriented
    
    return 'Balanced'
  }

  /**
   * Generate personality characteristics
   */
  private generateCharacteristics(traits: BigFiveTraits): string[] {
    const chars: string[] = []
    
    if (traits.openness > 70) {
      chars.push('Creative and imaginative')
      chars.push('Curious about new experiences')
    } else if (traits.openness < 40) {
      chars.push('Practical and traditional')
      chars.push('Prefers routine and familiarity')
    }
    
    if (traits.conscientiousness > 70) {
      chars.push('Organized and disciplined')
      chars.push('Goal-oriented and reliable')
    } else if (traits.conscientiousness < 40) {
      chars.push('Spontaneous and flexible')
      chars.push('Adaptable to change')
    }
    
    if (traits.extraversion > 70) {
      chars.push('Outgoing and energetic')
      chars.push('Enjoys social interaction')
    } else if (traits.extraversion < 40) {
      chars.push('Thoughtful and reserved')
      chars.push('Prefers solitude or small groups')
    }
    
    if (traits.agreeableness > 70) {
      chars.push('Compassionate and cooperative')
      chars.push('Values harmony and empathy')
    } else if (traits.agreeableness < 40) {
      chars.push('Direct and challenging')
      chars.push('Values truth over harmony')
    }
    
    if (traits.neuroticism > 60) {
      chars.push('Sensitive and emotionally aware')
      chars.push('Deeply introspective')
    } else if (traits.neuroticism < 30) {
      chars.push('Calm and resilient')
      chars.push('Emotionally stable')
    }
    
    return chars
  }

  /**
   * Identify personality strengths
   */
  private identifyStrengths(traits: BigFiveTraits): string[] {
    const strengths: string[] = []
    
    if (traits.openness > 70) strengths.push('Innovative thinking')
    if (traits.conscientiousness > 70) strengths.push('Strong work ethic')
    if (traits.extraversion > 70) strengths.push('Natural leadership')
    if (traits.agreeableness > 70) strengths.push('Team collaboration')
    if (traits.neuroticism < 40) strengths.push('Emotional stability')
    
    // Combination strengths
    if (traits.openness > 70 && traits.conscientiousness > 70) {
      strengths.push('Strategic vision')
    }
    if (traits.extraversion > 70 && traits.agreeableness > 70) {
      strengths.push('Building relationships')
    }
    
    return strengths
  }

  /**
   * Identify potential weaknesses
   */
  private identifyWeaknesses(traits: BigFiveTraits): string[] {
    const weaknesses: string[] = []
    
    if (traits.openness < 40) weaknesses.push('Resistance to change')
    if (traits.conscientiousness < 40) weaknesses.push('Lack of structure')
    if (traits.extraversion < 40) weaknesses.push('Social hesitation')
    if (traits.agreeableness < 40) weaknesses.push('Conflict tendency')
    if (traits.neuroticism > 70) weaknesses.push('Stress sensitivity')
    
    return weaknesses
  }

  /**
   * Adjust a trait over time based on experiences
   */
  adjustTrait(trait: keyof BigFiveTraits, amount: number): void {
    const current = this.profile.traits[trait]
    this.profile.traits[trait] = Math.max(0, Math.min(100, current + amount))
    this.updateProfile()
  }

  /**
   * Get compatibility score with another personality
   */
  getCompatibility(other: BigFiveTraits): number {
    const { traits } = this.profile
    
    // Calculate trait differences
    const opennessDiff = Math.abs(traits.openness - other.openness)
    const conscientiousnessDiff = Math.abs(traits.conscientiousness - other.conscientiousness)
    const extraversionDiff = Math.abs(traits.extraversion - other.extraversion)
    const agreeablenessDiff = Math.abs(traits.agreeableness - other.agreeableness)
    const neuroticismDiff = Math.abs(traits.neuroticism - other.neuroticism)
    
    // Weighted compatibility (agreeableness and neuroticism matter more)
    const avgDiff = (
      opennessDiff * 1.0 +
      conscientiousnessDiff * 1.0 +
      extraversionDiff * 0.8 +
      agreeablenessDiff * 1.5 +
      neuroticismDiff * 1.2
    ) / 5.5
    
    // Convert to compatibility score (0-100)
    return Math.round(100 - avgDiff)
  }

  /**
   * Get personality summary
   */
  getSummary(): string {
    const { archetype, temperament } = this.profile
    return `${archetype} (${temperament} temperament)`
  }

  /**
   * Get full profile
   */
  getProfile(): PersonalityProfile {
    return { ...this.profile }
  }

  /**
   * Set profile
   */
  setProfile(profile: PersonalityProfile): void {
    this.profile = { ...profile }
  }
}
