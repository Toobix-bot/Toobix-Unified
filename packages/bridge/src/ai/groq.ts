/**
 * Groq AI Service
 * Wrapper for Groq SDK with embeddings and generation
 */

import Groq from 'groq-sdk'

export class GroqService {
  private client: Groq

  constructor(apiKey: string) {
    this.client = new Groq({ apiKey })
  }

  async generate(prompt: string, options: any = {}): Promise<string> {
    try {
      // Validate API key
      if (!this.client.apiKey || this.client.apiKey === '') {
        console.warn('Groq API key not configured, returning fallback response')
        return 'AI generation unavailable (API key not configured)'
      }

      const completion = await this.client.chat.completions.create({
        model: options.model || 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000
      })

      const text = completion.choices[0]?.message?.content
      if (!text) {
        console.warn('Groq returned empty response')
        return '(empty response from AI)'
      }

      return text
    } catch (error: any) {
      console.error('Groq generation error:', error)
      
      // Return user-friendly error message instead of throwing
      if (error.status === 401) {
        return 'AI unavailable: Invalid API key'
      } else if (error.status === 429) {
        return 'AI unavailable: Rate limit exceeded'
      } else if (error.status === 503) {
        return 'AI unavailable: Service temporarily unavailable'
      } else {
        return `AI error: ${error.message || 'Unknown error'}`
      }
    }
  }

  async embed(text: string): Promise<number[]> {
    // Groq doesn't have native embeddings yet, use simple hash-based approach
    // TODO: Replace with proper embedding model (Ollama or external service)
    
    const hash = this.simpleHash(text)
    const embedding: number[] = []
    
    for (let i = 0; i < 384; i++) {
      embedding.push(Math.sin(hash + i) * 0.5 + 0.5)
    }
    
    return embedding
  }

  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i)
      hash |= 0
    }
    return hash
  }

  async chat(messages: any[], options: any = {}): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: options.model || 'llama-3.3-70b-versatile',
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000
      })

      return completion.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('Groq chat error:', error)
      throw error
    }
  }
}
