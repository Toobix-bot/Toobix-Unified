#!/usr/bin/env bun
// Minimal test server
const server = Bun.serve({
  port: 3003,
  fetch(req) {
    return new Response(JSON.stringify({ status: 'ok', time: new Date().toISOString() }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
})

console.log('✅ Test server running on http://localhost:3003')
