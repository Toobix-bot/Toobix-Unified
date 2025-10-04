/**
 * 🛡️ Input Validation - Zod schemas for all MCP tools
 * 
 * Type-safe validation for all API inputs
 */

import { z } from 'zod'

/**
 * Common field schemas
 */
export const commonSchemas = {
  id: z.string().min(1).max(100),
  text: z.string().min(1).max(10000),
  query: z.string().min(1).max(500),
  limit: z.number().int().min(1).max(100).default(10),
  metadata: z.record(z.any()).optional(),
  timestamp: z.number().int().positive().optional()
}

/**
 * Memory tool schemas
 */
export const memorySchemas = {
  search: z.object({
    query: commonSchemas.query,
    limit: commonSchemas.limit.optional(),
    metadata: commonSchemas.metadata
  }),
  
  add: z.object({
    text: commonSchemas.text,
    metadata: commonSchemas.metadata
  }),
  
  get: z.object({
    id: commonSchemas.id
  }),
  
  update: z.object({
    id: commonSchemas.id,
    text: commonSchemas.text,
    metadata: commonSchemas.metadata
  }),
  
  delete: z.object({
    id: commonSchemas.id
  })
}

/**
 * Module contracts schemas
 */
export const contractsSchemas = {
  resolveConflict: z.object({
    moduleA: z.enum(['ethics', 'soul', 'consciousness', 'story', 'memory']),
    moduleB: z.enum(['ethics', 'soul', 'consciousness', 'story', 'memory']),
    type: z.enum(['ethical_dilemma', 'value_conflict', 'data_inconsistency', 'priority_conflict']),
    context: z.record(z.any()).optional(),
    description: z.string().max(500).optional()
  })
}

/**
 * Values schemas
 */
export const valuesSchemas = {
  getState: z.object({
    limit: z.number().int().min(1).max(13).optional()
  }),
  
  resolveConflict: z.object({
    valueA: z.string().min(1).max(50),
    valueB: z.string().min(1).max(50),
    context: z.record(z.any()).optional(),
    severity: z.enum(['low', 'medium', 'high']).default('medium')
  })
}

/**
 * Pipeline schemas
 */
export const pipelineSchemas = {
  processEvent: z.object({
    id: z.string().optional(),
    type: z.string().min(1).max(50),
    source: z.enum(['user', 'system', 'consciousness', 'story', 'external']),
    action: z.string().min(1).max(100),
    description: z.string().min(1).max(500),
    metadata: z.record(z.any()).optional(),
    timestamp: commonSchemas.timestamp
  })
}

/**
 * Soul schemas
 */
export const soulSchemas = {
  state: z.object({}),
  
  event: z.object({
    type: z.enum(['joy', 'sadness', 'fear', 'anger', 'surprise', 'disgust', 'love', 'pride']),
    intensity: z.number().min(0).max(1),
    description: z.string().max(500).optional(),
    metadata: commonSchemas.metadata
  })
}

/**
 * Story schemas
 */
export const storySchemas = {
  state: z.object({}),
  
  choose: z.object({
    optionId: commonSchemas.id
  }),
  
  events: z.object({
    limit: commonSchemas.limit.optional(),
    personId: commonSchemas.id.optional()
  })
}

/**
 * AI generation schemas
 */
export const aiSchemas = {
  generate: z.object({
    prompt: z.string().min(1).max(2000),
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().int().min(1).max(4000).optional(),
    model: z.string().optional()
  })
}

/**
 * Validate input with schema
 */
export function validateInput<T>(schema: z.ZodType<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: string[]
} {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      }
    }
    return {
      success: false,
      errors: ['Invalid input format']
    }
  }
}

/**
 * Safe parse with default value
 */
export function validateInputOrDefault<T>(
  schema: z.ZodType<T>,
  data: unknown,
  defaultValue: T
): T {
  const result = validateInput(schema, data)
  return result.success ? result.data! : defaultValue
}

/**
 * Validate request size
 */
export function validateRequestSize(data: any, maxSizeBytes: number = 1024 * 100): boolean {
  const size = JSON.stringify(data).length
  return size <= maxSizeBytes
}

/**
 * Sanitize string input (prevent injection)
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim()
}

/**
 * All schemas combined
 */
export const allSchemas = {
  memory: memorySchemas,
  contracts: contractsSchemas,
  values: valuesSchemas,
  pipeline: pipelineSchemas,
  soul: soulSchemas,
  story: storySchemas,
  ai: aiSchemas
}
