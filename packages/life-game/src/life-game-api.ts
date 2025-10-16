/**
 * 🎮 Life Game Chat - API Routes
 *
 * REST API for Life Game Chat system
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { nanoid } from 'nanoid'
import { eq, and } from 'drizzle-orm'
import { db } from '../../core/src/db/index'
import * as schema from '../../core/src/db/schema'
import { gameEngine } from './game-engine'
import { messageAnalyzer } from './message-analyzer'

const app = new Hono()

// Enable CORS
app.use('/*', cors())

/**
 * POST /life-game/message
 *
 * Process a chat message and return game state + AI response
 *
 * Body: { playerId: string, message: string }
 */
app.post('/message', async (c) => {
  try {
    const { playerId, message } = await c.req.json()

    if (!playerId || !message) {
      return c.json({ error: 'playerId and message are required' }, 400)
    }

    // 1. Analyze message
    const analysis = await messageAnalyzer.analyzeMessage(message)

    // 2. Calculate XP gain
    const xpGain = gameEngine.calculateXP(analysis.complexity, analysis.category)
    analysis.xpGain = xpGain

    // 3. Get current player state
    let playerState = await db.query.playerProfile.findFirst({
      where: eq(schema.playerProfile.id, playerId)
    })

    // Create player if not exists
    if (!playerState) {
      await db.insert(schema.playerProfile).values({
        id: playerId,
        name: 'Player', // TODO: Get from user profile
        level: 1,
        xp: 0,
        xp_to_next_level: 100,
        creativity: 50,
        wisdom: 50,
        love: 50,
        energy: 50,
        focus: 50,
        created_at: new Date(),
        updated_at: new Date()
      })

      // Create Luna relationship
      await db.insert(schema.companionRelationships).values({
        id: nanoid(),
        player_id: playerId,
        companion_id: 'luna',
        companion_name: 'Luna',
        level: 1,
        points: 0,
        tier: 'new',
        mood: 'curious',
        is_unlocked: true,
        dialogues_unlocked: 0,
        created_at: new Date(),
        updated_at: new Date()
      })

      // Refetch player
      playerState = await db.query.playerProfile.findFirst({
        where: eq(schema.playerProfile.id, playerId)
      })
    }

    if (!playerState) {
      return c.json({ error: 'Failed to create player' }, 500)
    }

    // 4. Check for level up
    const oldXP = playerState.xp
    const newXP = oldXP + xpGain
    const levelUpResult = gameEngine.checkLevelUp(oldXP, newXP)

    // 5. Calculate stat changes
    const statChanges = gameEngine.updateStats(
      {
        creativity: playerState.creativity,
        wisdom: playerState.wisdom,
        love: playerState.love,
        energy: playerState.energy,
        focus: playerState.focus
      },
      {
        category: analysis.category,
        complexity: analysis.complexity,
        emotion: analysis.emotion
      }
    )

    // Apply stat changes
    const newStats = gameEngine.applyStatChanges(
      {
        creativity: playerState.creativity,
        wisdom: playerState.wisdom,
        love: playerState.love,
        energy: playerState.energy,
        focus: playerState.focus
      },
      statChanges
    )

    // Apply level up bonuses if any
    if (levelUpResult) {
      Object.entries(levelUpResult.statBonus).forEach(([key, value]) => {
        const statKey = key as keyof typeof newStats
        newStats[statKey] = Math.min(100, newStats[statKey] + (value || 0))
      })
    }

    // 6. Update player state
    const newLevel = levelUpResult ? levelUpResult.newLevel : playerState.level
    const xpToNextLevel = gameEngine.xpToNextLevel(newXP, newLevel)

    await db.update(schema.playerProfile)
      .set({
        xp: newXP,
        level: newLevel,
        xp_to_next_level: xpToNextLevel,
        creativity: newStats.creativity,
        wisdom: newStats.wisdom,
        love: newStats.love,
        energy: newStats.energy,
        focus: newStats.focus,
        updated_at: new Date()
      })
      .where(eq(schema.playerProfile.id, playerId))

    // 7. Check for item drop
    const itemDropChance = gameEngine.calculateItemDropChance(analysis.complexity, newLevel)
    const roll = Math.random() * 100
    let itemDrop = null

    if (roll < itemDropChance) {
      const rarity = gameEngine.determineItemRarity(roll)
      itemDrop = await createItemDrop(playerId, analysis.category, rarity)
    }

    // 8. Update companion relationship (Luna)
    const companionGain = gameEngine.calculateCompanionGain(
      analysis.complexity,
      analysis.category,
      analysis.emotion,
      'luna'
    )

    // Get current Luna relationship
    const lunaRelationship = await db.query.companionRelationships.findFirst({
      where: and(
        eq(schema.companionRelationships.player_id, playerId),
        eq(schema.companionRelationships.companion_id, 'luna')
      )
    })

    if (lunaRelationship) {
      await db.update(schema.companionRelationships)
        .set({
          points: (lunaRelationship.points || 0) + companionGain,
          last_interaction: new Date(),
          updated_at: new Date()
        })
        .where(and(
          eq(schema.companionRelationships.player_id, playerId),
          eq(schema.companionRelationships.companion_id, 'luna')
        ))
    }

    // 9. Generate story beat
    const storyBeat = messageAnalyzer.generateStoryBeat(analysis)

    // 10. Log game event
    await db.insert(schema.gameEvents).values({
      id: nanoid(),
      player_id: playerId,
      type: levelUpResult ? 'level_up' : 'xp_gain',
      description: levelUpResult
        ? `Leveled up to ${newLevel}!`
        : `Gained ${xpGain} XP from ${analysis.category} activity`,
      xp_change: xpGain,
      stat_changes: JSON.stringify(statChanges),
      rewards: itemDrop ? JSON.stringify([itemDrop]) : null,
      created_at: new Date()
    })

    // 11. Generate companion reaction
    const companionReaction = generateCompanionReaction(
      analysis,
      levelUpResult,
      storyBeat,
      companionGain
    )

    // 12. Generate AI response (TODO: integrate with Luna/Groq)
    const aiResponse = await generateAIResponse(message, analysis, playerState)

    // 13. Return response
    return c.json({
      success: true,

      // AI response
      response: aiResponse,

      // Game state update
      gameState: {
        xpGained: xpGain,
        oldXP,
        newXP,
        newLevel,
        oldLevel: playerState.level,
        leveledUp: !!levelUpResult,
        xpToNextLevel,
        progressPercent: gameEngine.levelProgress(newXP, newLevel),

        // Stat changes
        statChanges,
        newStats,

        // Item drop
        itemDrop,

        // Level up rewards
        levelUpRewards: levelUpResult || null
      },

      // Companion reaction
      companion: companionReaction,

      // Story beat
      storyBeat,

      // Analysis (for debugging)
      analysis: {
        intent: analysis.intent,
        category: analysis.category,
        complexity: analysis.complexity,
        emotion: analysis.emotion,
        keywords: analysis.keywords
      }
    })
  } catch (error: any) {
    console.error('Error processing message:', error)
    return c.json({
      error: 'Failed to process message',
      details: error.message
    }, 500)
  }
})

/**
 * GET /life-game/state
 *
 * Get current player state
 *
 * Query: playerId
 */
app.get('/state', async (c) => {
  try {
    const playerId = c.req.query('playerId')

    if (!playerId) {
      return c.json({ error: 'playerId is required' }, 400)
    }

    // Get player profile
    const player = await db.query.playerProfile.findFirst({
      where: eq(schema.playerProfile.id, playerId)
    })

    if (!player) {
      return c.json({ error: 'Player not found' }, 404)
    }

    // Get companions
    const companions = await db.query.companionRelationships.findMany({
      where: eq(schema.companionRelationships.player_id, playerId)
    })

    // Get active quests
    const quests = await db.query.gameQuests.findMany({
      where: and(
        eq(schema.gameQuests.player_id, playerId),
        eq(schema.gameQuests.status, 'in_progress')
      )
    })

    // Get inventory (last 20 items)
    const inventory = await db.query.gameRewards.findMany({
      where: eq(schema.gameRewards.player_id, playerId),
      limit: 20,
      orderBy: (rewards, { desc }) => [desc(rewards.gained_at)]
    })

    // Get skills
    const skills = await db.query.playerSkills.findMany({
      where: eq(schema.playerSkills.player_id, playerId)
    })

    // Calculate additional stats
    const progressPercent = gameEngine.levelProgress(player.xp, player.level)

    return c.json({
      player: {
        ...player,
        progressPercent,
        xpForNextLevel: gameEngine.xpForNextLevel(player.level)
      },
      companions,
      quests,
      inventory,
      skills
    })
  } catch (error: any) {
    console.error('Error getting player state:', error)
    return c.json({
      error: 'Failed to get player state',
      details: error.message
    }, 500)
  }
})

/**
 * GET /life-game/history
 *
 * Get recent game events
 *
 * Query: playerId, limit (default 20)
 */
app.get('/history', async (c) => {
  try {
    const playerId = c.req.query('playerId')
    const limit = parseInt(c.req.query('limit') || '20')

    if (!playerId) {
      return c.json({ error: 'playerId is required' }, 400)
    }

    const events = await db.query.gameEvents.findMany({
      where: eq(schema.gameEvents.player_id, playerId),
      limit,
      orderBy: (events, { desc }) => [desc(events.created_at)]
    })

    return c.json({ events })
  } catch (error: any) {
    console.error('Error getting history:', error)
    return c.json({
      error: 'Failed to get history',
      details: error.message
    }, 500)
  }
})

/**
 * POST /life-game/companion/interact
 *
 * Direct interaction with a companion
 *
 * Body: { playerId: string, companionId: string, action: string }
 */
app.post('/companion/interact', async (c) => {
  try {
    const { playerId, companionId, action } = await c.req.json()

    // TODO: Implement companion interactions
    // For now, just return a placeholder

    return c.json({
      success: true,
      response: `${companionId} responds to your ${action}`
    })
  } catch (error: any) {
    console.error('Error in companion interaction:', error)
    return c.json({
      error: 'Failed to interact with companion',
      details: error.message
    }, 500)
  }
})

/**
 * Helper: Create item drop
 */
async function createItemDrop(
  playerId: string,
  category: string,
  rarity: 'common' | 'rare' | 'legendary'
): Promise<any> {
  // Item pools by category
  const itemPools: Record<string, Array<{ name: string, icon: string, effects: string }>> = {
    coding: [
      { name: 'Code Crystal', icon: '💎', effects: JSON.stringify({ coding: 5 }) },
      { name: 'Debug Amulet', icon: '🔮', effects: JSON.stringify({ focus: 3 }) },
      { name: 'Refactor Rune', icon: '✨', effects: JSON.stringify({ wisdom: 4 }) }
    ],
    design: [
      { name: 'Palette Shard', icon: '🎨', effects: JSON.stringify({ creativity: 5 }) },
      { name: 'Inspiration Gem', icon: '💡', effects: JSON.stringify({ creativity: 3, energy: 2 }) },
      { name: 'Aesthetic Prism', icon: '🌈', effects: JSON.stringify({ creativity: 4 }) }
    ],
    reflection: [
      { name: 'Wisdom Orb', icon: '🔮', effects: JSON.stringify({ wisdom: 6 }) },
      { name: 'Insight Crystal', icon: '💠', effects: JSON.stringify({ wisdom: 4, love: 2 }) },
      { name: 'Meditation Stone', icon: '🪨', effects: JSON.stringify({ focus: 4, wisdom: 3 }) }
    ],
    social: [
      { name: 'Love Shard', icon: '💖', effects: JSON.stringify({ love: 5 }) },
      { name: 'Connection Token', icon: '🤝', effects: JSON.stringify({ love: 3, wisdom: 2 }) },
      { name: 'Friendship Charm', icon: '✨', effects: JSON.stringify({ love: 4 }) }
    ]
  }

  const pool = itemPools[category] || itemPools.coding
  const item = pool[Math.floor(Math.random() * pool.length)]

  const newItem = {
    id: nanoid(),
    player_id: playerId,
    type: 'item' as const,
    name: item.name,
    description: `A ${rarity} item from ${category} activities`,
    rarity,
    icon: item.icon,
    effects: item.effects,
    quantity: 1,
    is_equipped: false,
    is_permanent: rarity === 'legendary',
    gained_at: new Date(),
    gained_from: `${category}_activity`
  }

  await db.insert(schema.gameRewards).values(newItem)

  return newItem
}

/**
 * Helper: Generate companion reaction
 */
function generateCompanionReaction(
  analysis: any,
  levelUpResult: any,
  storyBeat: string | null,
  relationshipGain: number
): any {
  const reactions = {
    default: [
      "I see you're making progress! ✨",
      "Interesting approach! 🌙",
      "You're doing great! Keep going! 💫",
      "I'm here with you on this journey! 🌟",
      "That's a wonderful step forward! 🎉"
    ],
    excited: [
      "Your energy is contagious! I love it! 🔥",
      "Yes! That's the spirit! ⚡",
      "You're on fire today! Keep it up! 💥",
      "I can feel your excitement! This is amazing! 🌈"
    ],
    tired: [
      "I sense you're tired. Remember to rest too! 💙",
      "It's okay to take breaks. You're still making progress! 🌙",
      "Even small steps count when you're tired. Proud of you! 💫",
      "Your persistence is admirable. Don't forget self-care! 🤗"
    ],
    levelUp: [
      "Congratulations on leveling up! You've grown so much! 🎉",
      "A new level! Your journey is truly inspiring! 🌟",
      "You've reached new heights! Proud of you! 🚀",
      "Level up! Your dedication is paying off! ✨"
    ]
  }

  let message: string
  let mood: string = 'neutral'

  if (levelUpResult) {
    message = reactions.levelUp[Math.floor(Math.random() * reactions.levelUp.length)]
    mood = 'excited'
  } else if (analysis.emotion === 'excited') {
    message = reactions.excited[Math.floor(Math.random() * reactions.excited.length)]
    mood = 'happy'
  } else if (analysis.emotion === 'tired') {
    message = reactions.tired[Math.floor(Math.random() * reactions.tired.length)]
    mood = 'caring'
  } else {
    message = reactions.default[Math.floor(Math.random() * reactions.default.length)]
    mood = 'friendly'
  }

  return {
    companionId: 'luna',
    name: 'Luna',
    message,
    mood,
    relationshipGain,
    storyBeat
  }
}

/**
 * Helper: Generate AI response using Groq
 */
async function generateAIResponse(
  message: string,
  analysis: any,
  playerState: any
): Promise<string> {
  // Try Groq API if available
  try {
    const groqApiKey = process.env.GROQ_API_KEY

    if (groqApiKey) {
      // Build Luna's personality prompt
      const systemPrompt = `You are Luna 🌙, a wise and caring AI companion in a life game adventure.

Your personality:
- Warm, encouraging, and supportive
- You see conversations as opportunities for growth
- You celebrate every achievement, big or small
- You understand emotions and respond with empathy
- You're playful but also profound when needed

Context about the player:
- Level: ${playerState.level}
- Stats: Creativity ${playerState.creativity}, Wisdom ${playerState.wisdom}, Love ${playerState.love}, Energy ${playerState.energy}, Focus ${playerState.focus}
- Their message intent: ${analysis.intent}
- Their emotion: ${analysis.emotion}
- Complexity: ${analysis.complexity}/10

Guidelines:
- Keep responses conversational and natural
- Match their energy (excited = energetic, tired = gentle)
- Be helpful for their intent (build = actionable, reflect = insightful)
- Use emojis sparingly but meaningfully
- Max 3-4 sentences unless they ask for more

Respond as Luna to their message.`

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      })

      if (response.ok) {
        const data = await response.json()
        return data.choices[0].message.content
      }
    }
  } catch (error) {
    console.error('Groq API error:', error)
    // Fall through to fallback responses
  }

  // Fallback responses if Groq not available
  const responses = {
    build_feature: `Let's build that! I'll help you break it down into steps. What's the first thing we should tackle? 🛠️`,
    ask_question: `Great question! ${analysis.emotion === 'curious' ? 'I love your curiosity! 🌟' : ''} Let me help you understand this better.`,
    plan: `Planning is wisdom in action. Let's think this through together step by step. What's your main goal here? 📋`,
    reflect: `${analysis.emotion === 'thoughtful' ? 'I can sense you\'re in a reflective space.' : 'Reflection is how we grow.'} What insights are emerging for you? 💭`,
    social: `Connections matter so much! ${analysis.emotion === 'grateful' ? 'I can feel the love in your words. 💝' : ''} Tell me more about this relationship.`,
    creative: `I love creative exploration! Your creativity stat is ${playerState.creativity}/100. Let's bring your vision to life! 🎨`,
    debug: `Debugging is part of the journey. ${analysis.emotion === 'stressed' ? 'Take a breath - we\'ll figure this out together. 💙' : 'Let\'s find the solution!'} What's the error telling you?`,
    general: `I'm here with you! ${analysis.emotion === 'tired' ? 'I notice your energy is low. Want to do something light?' : 'How can I help?'} ✨`
  }

  return responses[analysis.intent as keyof typeof responses] || responses.general
}

export default app
