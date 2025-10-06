#!/usr/bin/env bun
/**
 * STORY-IDLE GAME API SERVER - Simple game state with Moment Philosophy
 * Port: 3004
 */

import { serve } from 'bun'

console.log(' Story-Idle API starting...')
console.log(' MOMENT: Every game state is born, exists, and dies in THIS moment\n')

const server = serve({
  port: 3004,
  fetch(req) {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
    
    if (req.method === 'OPTIONS') return new Response(null, { headers })
    
    return Response.json({ 
      status: 'ok', 
      service: 'Story-Idle API',
      philosophy: 'Geburt, Gegenwart und Tod entspringen aus DIESEM Moment'
    }, { headers })
  }
})

console.log(` Story-Idle API running on port ${server.port}`)
