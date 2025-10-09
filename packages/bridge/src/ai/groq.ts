/**
 * Groq AI Service
 * Structured wrapper around Groq SDK with attribution metadata.
 */

import Groq from 'groq-sdk'

export type GenerationClassification = 'factual' | 'simulation' | 'fiction' | 'unspecified'

export interface GenerationOptions {
  model?: string
  temperature?: number
  max_tokens?: number
  top_p?: number
  system?: string
  context?: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
  classification?: GenerationClassification
  notes?: string
}

export interface GenerationParameters {
  temperature: number
  max_tokens: number
  top_p?: number
}

export interface GenerationMetadata {
  prompt: string
  system?: string
  model: string
  parameters: GenerationParameters
  timestamp: string
  classification: GenerationClassification
  source: {
    provider: 'groq' | 'fallback'
    type: 'chat.completion'
  }
  usage?: {
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
  }
  notes?: string
  warnings?: string[]
  error?: string
  context?: Array<{ role: string; content: string }>
}

export interface GenerationResult {
  ok: boolean
  text: string
  metadata: GenerationMetadata
}

export class GroqService {
  private client: Groq

  constructor(apiKey: string) {
    this.client = new Groq({ apiKey })
  }

  async generate(
    prompt: string,
    options: GenerationOptions | GenerationOptions['context'] | undefined = {}
  ): Promise<GenerationResult> {
    const timestamp = new Date().toISOString()
    const defaultModel = 'llama-3.3-70b-versatile'
    const preparedOptions: GenerationOptions =
      Array.isArray(options) ? { context: this.asContext(options) } : options || {}

    const model = preparedOptions.model || defaultModel
    const parameters: GenerationParameters = {
      temperature:
        typeof preparedOptions.temperature === 'number' ? preparedOptions.temperature : 0.7,
      max_tokens:
        typeof preparedOptions.max_tokens === 'number' ? preparedOptions.max_tokens : 1000,
      top_p: preparedOptions.top_p
    }

    const classification = preparedOptions.classification || 'unspecified'
    const systemContent = preparedOptions.system
    const contextMessages = preparedOptions.context || []
    const messages = [
      ...(systemContent ? [{ role: 'system' as const, content: systemContent }] : []),
      ...contextMessages,
      { role: 'user' as const, content: prompt }
    ]

    const baseMetadata: GenerationMetadata = {
      prompt,
      system: systemContent,
      model,
      parameters,
      timestamp,
      classification,
      source: { provider: 'groq', type: 'chat.completion' },
      notes: preparedOptions.notes,
      context: contextMessages
    }

    if (!this.client.apiKey || this.client.apiKey === '') {
      const message = 'AI generation unavailable (Groq API key not configured)'
      const metadata: GenerationMetadata = {
        ...baseMetadata,
        source: { provider: 'fallback', type: 'chat.completion' },
        warnings: ['Missing Groq API key; returned fallback response'],
        error: 'missing_api_key'
      }
      return {
        ok: false,
        text: message,
        metadata
      }
    }

    try {
      const completion = await this.client.chat.completions.create({
        model,
        messages,
        temperature: parameters.temperature,
        max_tokens: parameters.max_tokens,
        top_p: parameters.top_p
      })

      const choice = completion.choices[0]
      const text = choice?.message?.content?.trim()

      if (!text) {
        const metadata: GenerationMetadata = {
          ...baseMetadata,
          warnings: ['Groq returned an empty response'],
          error: 'empty_response'
        }
        return {
          ok: false,
          text: '(empty response from AI)',
          metadata
        }
      }

      const usage = completion.usage || {}
      const metadata: GenerationMetadata = {
        ...baseMetadata,
        usage: {
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens
        }
      }

      return {
        ok: true,
        text,
        metadata
      }
    } catch (error: any) {
      console.error('Groq generation error:', error)

      const metadata: GenerationMetadata = {
        ...baseMetadata,
        error: error?.message || 'Unknown error'
      }

      if (error?.status === 401) {
        metadata.warnings = ['Invalid Groq API key']
        return {
          ok: false,
          text: 'AI unavailable: Invalid API key',
          metadata
        }
      } else if (error?.status === 429) {
        metadata.warnings = ['Rate limit exceeded']
        return {
          ok: false,
          text: 'AI unavailable: Rate limit exceeded',
          metadata
        }
      } else if (error?.status === 503) {
        metadata.warnings = ['Groq service temporarily unavailable']
        return {
          ok: false,
          text: 'AI unavailable: Service temporarily unavailable',
          metadata
        }
      }

      return {
        ok: false,
        text: `AI error: ${error?.message || 'Unknown error'}`,
        metadata
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

  async chat(messages: any[], options: GenerationOptions = {}): Promise<GenerationResult> {
    const timestamp = new Date().toISOString()
    const model = options.model || 'llama-3.3-70b-versatile'
    const parameters: GenerationParameters = {
      temperature: typeof options.temperature === 'number' ? options.temperature : 0.7,
      max_tokens: typeof options.max_tokens === 'number' ? options.max_tokens : 1000,
      top_p: options.top_p
    }

    try {
      const completion = await this.client.chat.completions.create({
        model,
        messages,
        temperature: parameters.temperature,
        max_tokens: parameters.max_tokens,
        top_p: parameters.top_p
      })

      const text = completion.choices[0]?.message?.content?.trim()
      const usage = completion.usage || {}

      if (!text) {
        return {
          ok: false,
          text: '(empty response from AI)',
          metadata: {
            prompt: '(multi-message conversation)',
            model,
            parameters,
            timestamp,
            classification: options.classification || 'unspecified',
            source: { provider: 'groq', type: 'chat.completion' },
            context: messages,
            warnings: ['Groq chat returned empty response']
          }
        }
      }

      return {
        ok: true,
        text,
        metadata: {
          prompt: '(multi-message conversation)',
          model,
          parameters,
          timestamp,
          classification: options.classification || 'unspecified',
          source: { provider: 'groq', type: 'chat.completion' },
          context: messages,
          usage: {
            promptTokens: usage.prompt_tokens,
            completionTokens: usage.completion_tokens,
            totalTokens: usage.total_tokens
          }
        }
      }
    } catch (error: any) {
      console.error('Groq chat error:', error)
      return {
        ok: false,
        text: `AI error: ${error?.message || 'Unknown error'}`,
        metadata: {
          prompt: '(multi-message conversation)',
          model,
          parameters,
          timestamp,
          classification: options.classification || 'unspecified',
          source: { provider: 'groq', type: 'chat.completion' },
          context: messages,
          error: error?.message || 'Unknown error'
        }
      }
    }
  }

  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i)
      hash |= 0
    }
    return hash
  }

  private asContext(
    context: GenerationOptions['context'] | string[]
  ): GenerationOptions['context'] {
    if (!Array.isArray(context)) {
      return context || []
    }

    if (context.length === 0) {
      return []
    }

    const isStringArray = context.every(item => typeof item === 'string')
    if (isStringArray) {
      return (context as string[]).map(content => ({ role: 'user', content }))
    }

    return context as GenerationOptions['context']
  }
}

