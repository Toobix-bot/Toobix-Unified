#!/usr/bin/env bun
/**
 * 🌉 Bridge API Server
 * Simple API bridge for frontend-backend communication
 */

const PORT = 3001;

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };
    
    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }
    
    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ 
        status: 'healthy',
        service: 'bridge-api',
        port: PORT,
        timestamp: new Date().toISOString()
      }), { headers });
    }
    
    // Status endpoint
    if (url.pathname === '/status') {
      return new Response(JSON.stringify({ 
        status: 'running',
        service: 'bridge-api',
        version: '1.0.0',
        uptime: process.uptime(),
        endpoints: ['/health', '/status', '/proxy']
      }), { headers });
    }
    
    // Proxy endpoint - forward requests to other services
    if (url.pathname === '/proxy') {
      const targetUrl = url.searchParams.get('url');
      if (!targetUrl) {
        return new Response(JSON.stringify({ error: 'Missing url parameter' }), { 
          status: 400, 
          headers 
        });
      }
      
      try {
        const response = await fetch(targetUrl);
        const data = await response.text();
        return new Response(data, { 
          status: response.status,
          headers: {
            ...headers,
            'Content-Type': response.headers.get('Content-Type') || 'application/json'
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Proxy request failed',
          message: error.message 
        }), { 
          status: 502, 
          headers 
        });
      }
    }
    
    return new Response(JSON.stringify({ 
      error: 'Not found',
      path: url.pathname 
    }), { 
      status: 404, 
      headers 
    });
  }
});

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              🌉  BRIDGE API SERVER  🌉                       ║
║                                                               ║
║  Running on: http://localhost:${PORT}                           ║
║                                                               ║
║  Endpoints:                                                  ║
║    GET  /health  - Health check                             ║
║    GET  /status  - Service status                           ║
║    GET  /proxy?url=... - Proxy requests                     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

console.log('✅ Bridge API ready\n');
