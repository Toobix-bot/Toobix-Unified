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
      const completion = await this.client.chat.completions.create({
        model: options.model || 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000
      })

      return completion.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('Groq generation error:', error)
      throw error
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
