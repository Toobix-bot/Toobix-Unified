import { db } from '@toobix/core/db'
import { interactions, people } from '@toobix/core/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { z } from 'zod'

/**
 * Interaction Schema
 */
export const InteractionSchema = z.object({
  id: z.string().optional(),
  person_id: z.string(),
  kind: z.enum(['call', 'meet', 'message', 'gift', 'conflict', 'memory', 'other']),
  summary: z.string().min(1, 'Summary is required'),
  sentiment: z.enum(['positive', 'neutral', 'difficult', 'healing']),
  details: z.record(z.any()).optional(),
  love_points: z.number().optional(),
  gratitude: z.string().optional(),
  timestamp: z.date().optional(),
})

export type Interaction = z.infer<typeof InteractionSchema>

/**
 * InteractionService - Track all touchpoints with people
 */
export class InteractionService {
  /**
   * Log a new interaction
   */
  async addInteraction(data: Omit<Interaction, 'id'>): Promise<Interaction> {
    const validated = InteractionSchema.parse({
      ...data,
      id: nanoid(10),
      timestamp: data.timestamp || new Date(),
    })

    // Verify person exists
    const personExists = await db
      .select({ id: people.id })
      .from(people)
      .where(eq(people.id, validated.person_id))
      .limit(1)

    if (personExists.length === 0) {
      throw new Error(`Person with id ${validated.person_id} not found`)
    }

    await db.insert(interactions).values({
      id: validated.id!,
      person_id: validated.person_id,
      kind: validated.kind,
      summary: validated.summary,
      sentiment: validated.sentiment,
      details: validated.details ? JSON.stringify(validated.details) : null,
      love_points: validated.love_points || 0,
      gratitude: validated.gratitude,
      timestamp: validated.timestamp,
    })

    return validated as Interaction
  }

  /**
   * Get interaction by ID
   */
  async getInteraction(id: string): Promise<Interaction | null> {
    const results = await db
      .select()
      .from(interactions)
      .where(eq(interactions.id, id))
      .limit(1)

    if (results.length === 0) return null

    const i = results[0]
    return {
      id: i.id,
      person_id: i.person_id,
      kind: i.kind as any,
      summary: i.summary,
      sentiment: i.sentiment as any,
      details: i.details ? JSON.parse(i.details) : undefined,
      love_points: i.love_points || undefined,
      gratitude: i.gratitude || undefined,
      timestamp: i.timestamp,
    }
  }

  /**
   * Get interaction history for a person
   */
  async getHistory(personId: string, options?: {
    limit?: number
    kind?: string
    sentiment?: string
  }): Promise<Interaction[]> {
    let query = db
      .select()
      .from(interactions)
      .where(eq(interactions.person_id, personId))
      .orderBy(desc(interactions.timestamp))

    if (options?.kind) {
      query = query.where(and(
        eq(interactions.person_id, personId),
        eq(interactions.kind, options.kind)
      ))
    }

    if (options?.sentiment) {
      query = query.where(and(
        eq(interactions.person_id, personId),
        eq(interactions.sentiment, options.sentiment)
      ))
    }

    const results = await query.limit(options?.limit || 50)

    return results.map(i => ({
      id: i.id,
      person_id: i.person_id,
      kind: i.kind as any,
      summary: i.summary,
      sentiment: i.sentiment as any,
      details: i.details ? JSON.parse(i.details) : undefined,
      love_points: i.love_points || undefined,
      gratitude: i.gratitude || undefined,
      timestamp: i.timestamp,
    }))
  }

  /**
   * Get interaction statistics for a person
   */
  async getStats(personId: string): Promise<{
    total: number
    byKind: Record<string, number>
    bySentiment: Record<string, number>
    totalLovePoints: number
    recentInteractions: Interaction[]
  }> {
    const allInteractions = await this.getHistory(personId, { limit: 1000 })

    const byKind: Record<string, number> = {}
    const bySentiment: Record<string, number> = {}
    let totalLovePoints = 0

    for (const i of allInteractions) {
      byKind[i.kind] = (byKind[i.kind] || 0) + 1
      bySentiment[i.sentiment] = (bySentiment[i.sentiment] || 0) + 1
      totalLovePoints += i.love_points || 0
    }

    return {
      total: allInteractions.length,
      byKind,
      bySentiment,
      totalLovePoints,
      recentInteractions: allInteractions.slice(0, 5),
    }
  }

  /**
   * Get recent interactions across all people
   */
  async getRecentInteractions(limit: number = 20): Promise<Array<Interaction & { person_name: string }>> {
    const results = await db
      .select({
        interaction: interactions,
        person: people,
      })
      .from(interactions)
      .leftJoin(people, eq(interactions.person_id, people.id))
      .orderBy(desc(interactions.timestamp))
      .limit(limit)

    return results.map(r => ({
      id: r.interaction.id,
      person_id: r.interaction.person_id,
      person_name: r.person?.name || 'Unknown',
      kind: r.interaction.kind as any,
      summary: r.interaction.summary,
      sentiment: r.interaction.sentiment as any,
      details: r.interaction.details ? JSON.parse(r.interaction.details) : undefined,
      love_points: r.interaction.love_points || undefined,
      gratitude: r.interaction.gratitude || undefined,
      timestamp: r.interaction.timestamp,
    }))
  }
}
