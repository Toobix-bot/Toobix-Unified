/**
 * 🧠 Life Game Chat - Message Analyzer
 *
 * Analyzes user messages to extract:
 * - Intent (what does the user want?)
 * - Complexity (how complex is the task?)
 * - Category (coding, design, reflection, etc.)
 * - Emotion (how does the user feel?)
 */

export interface MessageAnalysis {
  // Input
  text: string
  timestamp: string

  // Analysis
  intent: string           // 'build_feature', 'ask_question', 'reflect', 'plan', 'social', 'creative'
  complexity: number       // 1-10
  category: string         // 'coding', 'design', 'planning', 'reflection', 'social', 'creative', 'learning'
  emotion: string          // 'excited', 'tired', 'focused', 'curious', 'neutral', 'stressed'

  // Context
  contextNeeded: boolean
  keywords: string[]

  // Game implications (calculated by GameEngine)
  xpGain?: number
  statChanges?: Record<string, number>
  questProgress?: Array<{ questId: string, progress: number }>
  skillGains?: Array<{ skill: string, xp: number }>
  itemDropChance?: number
  storyBeat?: string | null
  companionReaction?: string
}

export class MessageAnalyzer {
  /**
   * Analyze a user message
   */
  async analyzeMessage(text: string): Promise<MessageAnalysis> {
    const normalizedText = text.toLowerCase()

    // Basic metrics
    const wordCount = text.trim().split(/\s+/).length
    const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim()).length
    const hasCodeBlock = text.includes('```') || text.includes('`')
    const hasQuestion = text.includes('?')
    const hasLinks = /https?:\/\//.test(text)

    // Detect intent
    const intent = this.detectIntent(normalizedText, hasQuestion)

    // Detect category
    const category = this.detectCategory(normalizedText, hasCodeBlock)

    // Detect emotion
    const emotion = this.detectEmotion(normalizedText)

    // Calculate complexity (1-10)
    const complexity = this.calculateComplexity({
      wordCount,
      sentenceCount,
      hasCodeBlock,
      hasLinks,
      intent,
      category
    })

    // Extract keywords
    const keywords = this.extractKeywords(normalizedText)

    // Check if context is needed
    const contextNeeded = this.needsContext(normalizedText, intent)

    return {
      text,
      timestamp: new Date().toISOString(),
      intent,
      complexity,
      category,
      emotion,
      contextNeeded,
      keywords,
      // Game implications will be filled by GameEngine
      xpGain: 0,
      statChanges: {},
      questProgress: [],
      skillGains: [],
      itemDropChance: 0,
      storyBeat: null,
      companionReaction: ''
    }
  }

  /**
   * Detect user intent from message
   */
  private detectIntent(text: string, hasQuestion: boolean): string {
    // Build/Create patterns
    if (this.matchesPatterns(text, [
      'build', 'create', 'implement', 'develop', 'make', 'write code',
      'add feature', 'construct', 'code'
    ])) {
      return 'build_feature'
    }

    // Question patterns
    if (hasQuestion || this.matchesPatterns(text, [
      'how to', 'what is', 'why', 'can you explain', 'help me understand',
      'what does', 'how do', 'tell me about'
    ])) {
      return 'ask_question'
    }

    // Planning patterns
    if (this.matchesPatterns(text, [
      'plan', 'design', 'architect', 'strategy', 'roadmap', 'organize',
      'structure', 'approach', 'outline'
    ])) {
      return 'plan'
    }

    // Reflection patterns
    if (this.matchesPatterns(text, [
      'think', 'reflect', 'realize', 'understand', 'learn', 'insight',
      'meditate', 'contemplate', 'consider', 'ponder'
    ])) {
      return 'reflect'
    }

    // Social patterns
    if (this.matchesPatterns(text, [
      'friend', 'family', 'relationship', 'connect', 'talk to', 'meet',
      'call', 'message', 'person', 'people'
    ])) {
      return 'social'
    }

    // Creative patterns
    if (this.matchesPatterns(text, [
      'design', 'art', 'creative', 'imagine', 'visualize', 'draw',
      'sketch', 'ui', 'ux', 'style', 'aesthetic'
    ])) {
      return 'creative'
    }

    // Debug/Fix patterns
    if (this.matchesPatterns(text, [
      'bug', 'fix', 'error', 'issue', 'problem', 'debug', 'broken',
      'not working', 'fails'
    ])) {
      return 'debug'
    }

    // Default
    return 'general'
  }

  /**
   * Detect message category
   */
  private detectCategory(text: string, hasCodeBlock: boolean): string {
    // Coding indicators
    const codingKeywords = [
      'function', 'class', 'variable', 'typescript', 'javascript', 'code',
      'api', 'database', 'query', 'component', 'module', 'package',
      'npm', 'bun', 'node', 'react', 'algorithm'
    ]
    if (hasCodeBlock || this.matchesPatterns(text, codingKeywords)) {
      return 'coding'
    }

    // Design indicators
    const designKeywords = [
      'design', 'ui', 'ux', 'layout', 'style', 'css', 'tailwind',
      'color', 'font', 'visual', 'aesthetic', 'mockup', 'wireframe'
    ]
    if (this.matchesPatterns(text, designKeywords)) {
      return 'design'
    }

    // Planning indicators
    const planningKeywords = [
      'plan', 'roadmap', 'strategy', 'architecture', 'structure',
      'organize', 'priority', 'goal', 'milestone', 'phase'
    ]
    if (this.matchesPatterns(text, planningKeywords)) {
      return 'planning'
    }

    // Reflection indicators
    const reflectionKeywords = [
      'think', 'reflect', 'learn', 'understand', 'realize', 'insight',
      'why', 'meaning', 'purpose', 'philosophy', 'wisdom'
    ]
    if (this.matchesPatterns(text, reflectionKeywords)) {
      return 'reflection'
    }

    // Social indicators
    const socialKeywords = [
      'friend', 'family', 'person', 'people', 'relationship', 'connect',
      'talk', 'meet', 'call', 'community', 'team'
    ]
    if (this.matchesPatterns(text, socialKeywords)) {
      return 'social'
    }

    // Creative indicators
    const creativeKeywords = [
      'creative', 'art', 'imagine', 'visualize', 'idea', 'concept',
      'brainstorm', 'innovation', 'invention'
    ]
    if (this.matchesPatterns(text, creativeKeywords)) {
      return 'creative'
    }

    // Learning indicators
    const learningKeywords = [
      'learn', 'study', 'research', 'explore', 'discover', 'tutorial',
      'guide', 'documentation', 'example', 'teach'
    ]
    if (this.matchesPatterns(text, learningKeywords)) {
      return 'learning'
    }

    return 'general'
  }

  /**
   * Detect user emotion from message
   */
  private detectEmotion(text: string): string {
    // Tired/Low energy
    if (this.matchesPatterns(text, [
      'tired', 'exhausted', 'low energy', 'sleepy', 'drained', 'worn out',
      'fatigue', 'weary'
    ])) {
      return 'tired'
    }

    // Excited/High energy
    if (this.matchesPatterns(text, [
      'excited', 'amazing', 'awesome', 'great', 'fantastic', 'love it',
      'can\'t wait', 'pumped', 'hyped', '!', 'wow'
    ]) || (text.match(/!/g) || []).length >= 2) {
      return 'excited'
    }

    // Stressed/Overwhelmed
    if (this.matchesPatterns(text, [
      'stressed', 'overwhelmed', 'anxious', 'worried', 'pressure',
      'too much', 'can\'t handle', 'struggling'
    ])) {
      return 'stressed'
    }

    // Curious/Interested
    if (this.matchesPatterns(text, [
      'curious', 'interesting', 'wonder', 'how does', 'why does',
      'fascinated', 'intrigued'
    ])) {
      return 'curious'
    }

    // Focused/Determined
    if (this.matchesPatterns(text, [
      'focused', 'determined', 'let\'s do', 'ready', 'concentrate',
      'dive in', 'get started'
    ])) {
      return 'focused'
    }

    // Confused
    if (this.matchesPatterns(text, [
      'confused', 'don\'t understand', 'unclear', 'lost', 'complicated',
      'difficult', 'hard to grasp'
    ])) {
      return 'confused'
    }

    // Grateful
    if (this.matchesPatterns(text, [
      'thank', 'thanks', 'grateful', 'appreciate', 'gratitude'
    ])) {
      return 'grateful'
    }

    return 'neutral'
  }

  /**
   * Calculate message complexity (1-10)
   */
  private calculateComplexity(factors: {
    wordCount: number
    sentenceCount: number
    hasCodeBlock: boolean
    hasLinks: boolean
    intent: string
    category: string
  }): number {
    let complexity = 1

    // Word count contribution (up to +4)
    if (factors.wordCount > 100) complexity += 4
    else if (factors.wordCount > 50) complexity += 3
    else if (factors.wordCount > 20) complexity += 2
    else if (factors.wordCount > 10) complexity += 1

    // Sentence count contribution (up to +2)
    if (factors.sentenceCount > 5) complexity += 2
    else if (factors.sentenceCount > 2) complexity += 1

    // Code block bonus (+2)
    if (factors.hasCodeBlock) complexity += 2

    // Links bonus (+1)
    if (factors.hasLinks) complexity += 1

    // Intent modifiers
    if (factors.intent === 'build_feature') complexity += 2
    if (factors.intent === 'plan') complexity += 1
    if (factors.intent === 'reflect') complexity += 1

    // Category modifiers
    if (factors.category === 'coding') complexity += 1

    // Clamp to 1-10
    return Math.max(1, Math.min(10, complexity))
  }

  /**
   * Extract important keywords from message
   */
  private extractKeywords(text: string): string[] {
    // Remove common words
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
      'could', 'can', 'may', 'might', 'must', 'i', 'you', 'he', 'she', 'it',
      'we', 'they', 'this', 'that', 'these', 'those'
    ])

    const words = text
      .split(/\s+/)
      .map(w => w.replace(/[^a-z0-9]/gi, '').toLowerCase())
      .filter(w => w.length > 3 && !stopWords.has(w))

    // Count frequency
    const frequency: Record<string, number> = {}
    words.forEach(w => {
      frequency[w] = (frequency[w] || 0) + 1
    })

    // Return top 10 keywords by frequency
    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word)
  }

  /**
   * Check if message needs additional context
   */
  private needsContext(text: string, intent: string): boolean {
    // Questions often need context
    if (intent === 'ask_question') return true

    // Vague references
    if (this.matchesPatterns(text, [
      'this', 'that', 'it', 'above', 'previous', 'earlier', 'before'
    ])) {
      return true
    }

    // Very short messages might need context
    if (text.trim().split(/\s+/).length < 5) {
      return true
    }

    return false
  }

  /**
   * Helper: Check if text matches any pattern
   */
  private matchesPatterns(text: string, patterns: string[]): boolean {
    return patterns.some(pattern => {
      // Check if pattern exists as whole word or phrase
      const regex = new RegExp(`\\b${pattern}\\b`, 'i')
      return regex.test(text)
    })
  }

  /**
   * Generate a story beat based on analysis
   *
   * Story beats are narrative moments triggered by user actions
   */
  generateStoryBeat(analysis: MessageAnalysis): string | null {
    const { complexity, category, emotion, intent } = analysis

    // High complexity coding = "Flow state"
    if (complexity >= 8 && category === 'coding' && emotion === 'focused') {
      return 'flow_state'
    }

    // Reflection + high complexity = "Breakthrough"
    if (category === 'reflection' && complexity >= 7) {
      return 'breakthrough'
    }

    // Excited + creative = "Inspiration"
    if (emotion === 'excited' && category === 'creative') {
      return 'inspiration'
    }

    // Tired + pushing through = "Perseverance"
    if (emotion === 'tired' && complexity >= 5) {
      return 'perseverance'
    }

    // Planning + complexity = "Strategic thinking"
    if (intent === 'plan' && complexity >= 6) {
      return 'strategic_thinking'
    }

    // Social + love = "Connection"
    if (category === 'social') {
      return 'connection'
    }

    // No special story beat
    return null
  }
}

// Export singleton instance
export const messageAnalyzer = new MessageAnalyzer()
