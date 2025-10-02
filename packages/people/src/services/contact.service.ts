import { db } from '@toobix/core/db'
import { people, interactions } from '@toobix/core/db/schema'
import { eq, desc, like, or, and, isNull } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { z } from 'zod'

/**
 * Contact/Person Schema
 */
export const ContactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  relation: z.enum(['family', 'friend', 'colleague', 'mentor', 'partner', 'other']),
  avatar: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
})

export type Contact = z.infer<typeof ContactSchema>

/**
 * ContactService - Manage people/contacts in Toobix
 */
export class ContactService {
  /**
   * Create a new contact
   */
  async createContact(data: Omit<Contact, 'id'>): Promise<Contact> {
    const validated = ContactSchema.parse({ ...data, id: nanoid(10) })
    
    await db.insert(people).values({
      id: validated.id!,
      name: validated.name,
      relation: validated.relation,
      avatar: validated.avatar,
      notes: validated.notes || '',
      tags: validated.tags ? JSON.stringify(validated.tags) : null,
      metadata: validated.metadata ? JSON.stringify(validated.metadata) : null,
    })

    return validated as Contact
  }

  /**
   * Get contact by ID
   */
  async getContact(id: string): Promise<Contact | null> {
    const results = await db
      .select()
      .from(people)
      .where(and(eq(people.id, id), isNull(people.deleted_at)))
      .limit(1)

    if (results.length === 0) return null

    const person = results[0]
    return {
      id: person.id,
      name: person.name,
      relation: person.relation as any,
      avatar: person.avatar || undefined,
      notes: person.notes || undefined,
      tags: person.tags ? JSON.parse(person.tags) : undefined,
      metadata: person.metadata ? JSON.parse(person.metadata) : undefined,
    }
  }

  /**
   * Update contact
   */
  async updateContact(id: string, data: Partial<Omit<Contact, 'id'>>): Promise<Contact | null> {
    const existing = await this.getContact(id)
    if (!existing) return null

    const updated = { ...existing, ...data }
    const validated = ContactSchema.parse(updated)

    await db.update(people)
      .set({
        name: validated.name,
        relation: validated.relation,
        avatar: validated.avatar,
        notes: validated.notes || '',
        tags: validated.tags ? JSON.stringify(validated.tags) : null,
        metadata: validated.metadata ? JSON.stringify(validated.metadata) : null,
        updated_at: new Date(),
      })
      .where(eq(people.id, id))

    return validated
  }

  /**
   * Delete contact (soft delete)
   */
  async deleteContact(id: string): Promise<boolean> {
    const result = await db.update(people)
      .set({ deleted_at: new Date() })
      .where(eq(people.id, id))

    return result.changes > 0
  }

  /**
   * Search contacts by name, tags, or notes
   */
  async searchContacts(query: string): Promise<Contact[]> {
    const results = await db
      .select()
      .from(people)
      .where(
        and(
          or(
            like(people.name, `%${query}%`),
            like(people.notes, `%${query}%`),
            like(people.tags, `%${query}%`)
          ),
          isNull(people.deleted_at)
        )
      )
      .orderBy(desc(people.created_at))
      .limit(20)

    return results.map(p => ({
      id: p.id,
      name: p.name,
      relation: p.relation as any,
      avatar: p.avatar || undefined,
      notes: p.notes || undefined,
      tags: p.tags ? JSON.parse(p.tags) : undefined,
      metadata: p.metadata ? JSON.parse(p.metadata) : undefined,
    }))
  }

  /**
   * List all contacts with optional filter
   */
  async listContacts(options?: {
    relation?: string
    limit?: number
    offset?: number
  }): Promise<Contact[]> {
    let query = db
      .select()
      .from(people)
      .where(isNull(people.deleted_at))
      .orderBy(desc(people.created_at))

    if (options?.relation) {
      query = query.where(and(eq(people.relation, options.relation), isNull(people.deleted_at)))
    }

    const results = await query
      .limit(options?.limit || 50)
      .offset(options?.offset || 0)

    return results.map(p => ({
      id: p.id,
      name: p.name,
      relation: p.relation as any,
      avatar: p.avatar || undefined,
      notes: p.notes || undefined,
      tags: p.tags ? JSON.parse(p.tags) : undefined,
      metadata: p.metadata ? JSON.parse(p.metadata) : undefined,
    }))
  }

  /**
   * Get contact stats
   */
  async getContactStats(id: string): Promise<{
    totalInteractions: number
    lastInteraction: Date | null
    sentimentBreakdown: Record<string, number>
  }> {
    const interactionResults = await db
      .select()
      .from(interactions)
      .where(eq(interactions.person_id, id))
      .orderBy(desc(interactions.timestamp))

    const sentimentBreakdown: Record<string, number> = {}
    for (const i of interactionResults) {
      sentimentBreakdown[i.sentiment] = (sentimentBreakdown[i.sentiment] || 0) + 1
    }

    return {
      totalInteractions: interactionResults.length,
      lastInteraction: interactionResults[0]?.timestamp || null,
      sentimentBreakdown,
    }
  }
}
