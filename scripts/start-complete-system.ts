#!/usr/bin/env bun
/**
 * 🚀 TOOBIX COMPLETE SYSTEM LAUNCHER
 * Starts ALL services with proper process management
 */

const services = [
  { name: 'Dashboard Server', script: 'scripts/dashboard-server.ts', port: 8080 },
  { name: 'Eternal Daemon Lite', script: 'scripts/eternal-daemon-lite.ts', port: 9999 },
  { name: 'Bridge API', script: 'scripts/bridge-api.ts', port: 3001 },
  { name: 'Moment Stream', script: 'scripts/moment-stream.ts', port: 9994 },
  { name: 'Memory System', script: 'scripts/memory-system.ts', port: 9995 },
  { name: 'Moment Analytics', script: 'scripts/moment-analytics.ts', port: 9996 },
  { name: 'Task System', script: 'scripts/task-system.ts', port: 9997 },
  { name: 'Achievement System', script: 'scripts/achievement-system.ts', port: 9998 },
  { name: 'BlockWorld Server', script: 'scripts/blockworld-server.ts', port: 9993 },
  { name: 'Reality Integration', script: 'scripts/reality-integration.ts', port: 9992 },
  { name: 'Expression Service', script: 'scripts/continuous-expression.ts', port: 9991 },
  { name: 'BlockWorld AI', script: 'scripts/blockworld-ai-agent.ts', port: 9990 },
  { name: 'Service Consciousness', script: 'scripts/service-consciousness.ts', port: 9989 },
  { name: 'Port Manager', script: 'scripts/port-manager.ts', port: 9988 },
  { name: 'Groq API Service', script: 'scripts/groq-api-service.ts', port: 9987 },
  { name: 'Ethics Core', script: 'scripts/ethics-core.ts', port: 9981 },
  { name: 'AI Sandbox', script: 'scripts/ai-sandbox.ts', port: 3003 },
  { name: 'Story-Idle API', script: 'scripts/story-idle-api.ts', port: 3004 }
];

const processes = new Map();
let isShuttingDown = false;

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         🚀  TOOBIX UNIFIED SYSTEM LAUNCHER  🚀               ║
║                                                               ║
║  Starting ${services.length} services...                                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

async function startService(service) {
  try {
    console.log(`🔄 Starting ${service.name} on port ${service.port}...`);
    
    const proc = Bun.spawn(['bun', 'run', service.script], {
      stdout: 'pipe',
      stderr: 'pipe',
      env: { ...process.env }
    });
    
    processes.set(service.name, { proc, service });
    
    // Wait a bit for startup
    await Bun.sleep(500);
    
    // Check if process is still alive
    if (proc.exitCode !== null) {
      console.log(`❌ ${service.name} failed to start (exit code: ${proc.exitCode})`);
      return false;
    }
    
    console.log(`✅ ${service.name} started (PID: ${proc.pid})`);
    return true;
  } catch (error) {
    console.log(`❌ ${service.name} error: ${error.message}`);
    return false;
  }
}

async function checkHealth(port) {
  try {
    const response = await fetch(`http://localhost:${port}/health`, {
      signal: AbortSignal.timeout(2000)
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function startAllServices() {
  let successCount = 0;
  
  for (const service of services) {
    const started = await startService(service);
    if (started) successCount++;
  }
  
  console.log(`\n📊 Started ${successCount}/${services.length} services\n`);
  
  // Wait for services to initialize
  console.log('⏳ Waiting for services to initialize...');
  await Bun.sleep(3000);
  
  // Health check
  console.log('\n🏥 Performing health checks...\n');
  let healthyCount = 0;
  
  for (const service of services) {
    const healthy = await checkHealth(service.port);
    if (healthy) {
      console.log(`✅ ${service.name.padEnd(25)} - HEALTHY`);
      healthyCount++;
    } else {
      console.log(`❌ ${service.name.padEnd(25)} - NOT RESPONDING`);
    }
  }
  
  console.log(`\n📊 ${healthyCount}/${services.length} services healthy\n`);
  
  if (healthyCount === services.length) {
    console.log('🎉 ALL SYSTEMS OPERATIONAL!\n');
    console.log('🌐 Dashboard: http://localhost:8080\n');
  } else {
    console.log('⚠️  Some services are not responding. Check logs above.\n');
  }
}

function shutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  console.log('\n\n🛑 Shutting down all services...\n');
  
  for (const [name, { proc }] of processes.entries()) {
    try {
      proc.kill();
      console.log(`🛑 Stopped ${name}`);
    } catch (error) {
      console.log(`⚠️  Error stopping ${name}: ${error.message}`);
    }
  }
  
  console.log('\n✅ All services stopped\n');
  process.exit(0);
}

// Handle shutdown signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start everything
await startAllServices();

// Keep alive
console.log('✅ System running. Press Ctrl+C to stop all services.\n');

// Monitor processes
setInterval(() => {
  for (const [name, { proc, service }] of processes.entries()) {
    if (proc.exitCode !== null) {
      console.log(`💀 ${name} died (exit code: ${proc.exitCode}). Restarting...`);
      processes.delete(name);
      startService(service);
    }
  }
}, 5000);

// Keep process alive
await new Promise(() => {});
