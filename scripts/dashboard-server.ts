#!/usr/bin/env bun
/**
 * 🌐 Toobix Dashboard Web Server
 * Simple static file server for the modular dashboard
 */

const PORT = 8888;

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;
    
    // Default to index
    if (path === '/') {
      path = '/modular-dashboard.html';
    }
    
    // Security: prevent directory traversal
    if (path.includes('..')) {
      return new Response('Forbidden', { status: 403 });
    }
    
    // Serve files from apps/web
    const filePath = `apps/web${path}`;
    
    try {
      const file = Bun.file(filePath);
      const exists = await file.exists();
      
      if (!exists) {
        return new Response('Not Found', { status: 404 });
      }
      
      // Determine content type
      let contentType = 'text/plain';
      if (path.endsWith('.html')) contentType = 'text/html';
      else if (path.endsWith('.css')) contentType = 'text/css';
      else if (path.endsWith('.js')) contentType = 'application/javascript';
      else if (path.endsWith('.json')) contentType = 'application/json';
      else if (path.endsWith('.png')) contentType = 'image/png';
      else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) contentType = 'image/jpeg';
      else if (path.endsWith('.svg')) contentType = 'image/svg+xml';
      else if (path.endsWith('.ico')) contentType = 'image/x-icon';
      
      return new Response(file, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        }
      });
      
    } catch (error) {
      console.error('Error serving file:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
});

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║           🌐  TOOBIX DASHBOARD SERVER  🌐                    ║
║                                                               ║
║  Dashboard läuft auf:                                        ║
║  http://localhost:${PORT}                                         ║
║                                                               ║
║  📂 Serving files from: apps/web/                            ║
║  🎯 Main dashboard: /modular-dashboard.html                  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

console.log('✅ Server ready. Press Ctrl+C to stop.\n');
