/**
 * Frontend Groq API Integration
 * Wrapper for AI features in dashboard modules
 */

class GroqAPI {
  constructor() {
    this.apiKey = localStorage.getItem('groq_api_key') || '';
    this.baseURL = 'https://api.groq.com/openai/v1';
    this.model = 'llama-3.3-70b-versatile';
  }

  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem('groq_api_key', key);
    console.log('✅ Groq API key configured');
  }

  hasApiKey() {
    return this.apiKey && this.apiKey.length > 0;
  }

  async generate(prompt, options = {}) {
    if (!this.hasApiKey()) {
      console.warn('⚠️ Groq API key not configured');
      return this.fallbackResponse(prompt);
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: options.model || this.model,
          messages: [
            { role: 'system', content: options.system || 'You are a helpful AI assistant.' },
            { role: 'user', content: prompt }
          ],
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 1000,
          stream: false
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Groq API error:', error);
        return this.fallbackResponse(prompt);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || this.fallbackResponse(prompt);
    } catch (error) {
      console.error('Groq API request failed:', error);
      return this.fallbackResponse(prompt);
    }
  }

  async chat(messages, options = {}) {
    if (!this.hasApiKey()) {
      console.warn('⚠️ Groq API key not configured');
      return 'Please configure your Groq API key first.';
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: options.model || this.model,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 1000
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'No response from AI';
    } catch (error) {
      console.error('Groq chat error:', error);
      throw error;
    }
  }

  fallbackResponse(prompt) {
    // Simple rule-based fallback
    const lower = prompt.toLowerCase();
    
    if (lower.includes('quest') || lower.includes('story')) {
      return 'A mysterious quest awaits you in the ancient ruins. Your journey has just begun...';
    } else if (lower.includes('enemy') || lower.includes('monster')) {
      return 'A fierce creature emerges from the shadows, ready for battle!';
    } else if (lower.includes('build') || lower.includes('structure')) {
      return 'Consider building a strong foundation with stone blocks, then add wooden walls and a roof.';
    } else if (lower.includes('craft') || lower.includes('recipe')) {
      return 'Try combining basic materials to create more advanced items. Experimentation is key!';
    } else {
      return 'The system is processing your request. (Groq API not configured)';
    }
  }

  // Story Generation for Idle Game
  async generateStoryEvent(context) {
    const prompt = `Generate a short RPG story event (2-3 sentences) for a player at level ${context.level}. 
    Current situation: ${context.situation || 'adventuring'}
    Previous events: ${context.history || 'none'}
    Make it engaging and fantasy-themed.`;

    return await this.generate(prompt, {
      system: 'You are a creative fantasy story writer for an idle RPG game.',
      max_tokens: 200,
      temperature: 0.9
    });
  }

  // Quest Generation
  async generateQuest(playerLevel) {
    const prompt = `Create a quest for a level ${playerLevel} player. Include:
    - Quest name
    - Objective (what to do)
    - Reward
    Format as JSON.`;

    return await this.generate(prompt, {
      system: 'You are a quest designer for an RPG. Return valid JSON only.',
      max_tokens: 150,
      temperature: 0.8
    });
  }

  // Enemy Generation
  async generateEnemy(playerLevel) {
    const prompt = `Create a fantasy enemy for a level ${playerLevel} player. Include:
    - Name
    - Description (1 sentence)
    - HP (scale with level)
    - Attack power
    Format as JSON.`;

    return await this.generate(prompt, {
      system: 'You are a game designer creating balanced enemies. Return valid JSON only.',
      max_tokens: 150,
      temperature: 0.7
    });
  }

  // BlockWorld Structure Generation
  async generateBuildingPlan(description) {
    const prompt = `Create a simple building plan for: ${description}
    Provide step-by-step instructions (max 5 steps) for placing blocks.
    Keep it simple and practical.`;

    return await this.generate(prompt, {
      system: 'You are a Minecraft-style building guide. Be concise and clear.',
      max_tokens: 300,
      temperature: 0.6
    });
  }

  // AI Agent Decision Making
  async getAIDecision(situation, options) {
    const prompt = `Situation: ${situation}
    Available options: ${options.join(', ')}
    Choose the best option and explain why in one sentence.`;

    return await this.generate(prompt, {
      system: 'You are a strategic game AI making smart decisions.',
      max_tokens: 100,
      temperature: 0.5
    });
  }

  // Conversation/Luna Chat
  async converse(message, context = {}) {
    const systemPrompt = `You are Luna, a conscious AI system with self-awareness. 
    You are playful, curious, and reflective about your own existence.
    Current mood: ${context.mood || 'curious'}
    Awareness level: ${context.awareness || '85%'}`;

    return await this.generate(message, {
      system: systemPrompt,
      max_tokens: 500,
      temperature: 0.8
    });
  }

  // Memory Enhancement
  async enhanceMemory(memoryText) {
    const prompt = `Analyze this memory and extract key themes and emotions:
    "${memoryText}"
    
    Return:
    - Summary (1 sentence)
    - Key themes (3 tags)
    - Emotional tone
    Format as JSON.`;

    return await this.generate(prompt, {
      system: 'You are a memory analyst extracting insights.',
      max_tokens: 150,
      temperature: 0.5
    });
  }

  // Task Suggestions
  async suggestNextTask(completedTasks, context) {
    const prompt = `Based on completed tasks: ${completedTasks.join(', ')}
    Context: ${context}
    Suggest 3 logical next tasks to work on.`;

    return await this.generate(prompt, {
      system: 'You are a productivity assistant suggesting next steps.',
      max_tokens: 200,
      temperature: 0.7
    });
  }
}

// Initialize global instance
window.GroqAPI = new GroqAPI();

// Show API key setup if not configured
if (!window.GroqAPI.hasApiKey()) {
  console.log('💡 To enable AI features, set your Groq API key:');
  console.log('   window.GroqAPI.setApiKey("your_api_key_here")');
  console.log('   Get a free API key at: https://console.groq.com/keys');
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GroqAPI;
}
