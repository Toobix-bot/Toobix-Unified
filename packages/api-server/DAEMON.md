# 🔄 Eternal Daemon - Process Manager

The Toobix API Server includes an eternal daemon that keeps the server running indefinitely with automatic restart on crashes.

## Features

- ✅ Automatic restart on crashes
- ✅ Crash detection and rate limiting
- ✅ Graceful shutdown handling
- ✅ Process statistics tracking
- ✅ PID file management
- ✅ Signal handling (SIGTERM, SIGINT, SIGHUP)
- ✅ Configurable restart policies
- ✅ Systemd integration
- ✅ Production-ready logging

## Quick Start

### Development Mode

```bash
# Start the server directly (no auto-restart)
bun run dev

# Start with daemon (auto-restart enabled)
bun run daemon
```

### Production Mode

```bash
# Start daemon in background
bun run daemon:start

# Check daemon status
bun run daemon:status

# Restart daemon
bun run daemon:restart

# Stop daemon
bun run daemon:stop
```

## Configuration

The daemon accepts the following configuration options:

```typescript
{
  serverPath: string          // Path to server.ts (default: './src/server.ts')
  maxRestarts: number         // Maximum number of restarts (default: Infinity)
  restartDelay: number        // Delay between restarts in ms (default: 1000)
  crashThreshold: number      // Number of crashes before giving up (default: 5)
  crashWindow: number         // Time window for crash detection in ms (default: 60000)
  logFile: string            // Path to log file (default: './logs/daemon.log')
  pidFile: string            // Path to PID file (default: './daemon.pid')
}
```

## Systemd Integration

For production deployments using systemd:

### 1. Install the service file

```bash
# Copy the service file
sudo cp toobix-api.service /etc/systemd/system/

# Edit paths to match your installation
sudo nano /etc/systemd/system/toobix-api.service

# Reload systemd
sudo systemctl daemon-reload
```

### 2. Manage the service

```bash
# Start the service
sudo systemctl start toobix-api

# Enable auto-start on boot
sudo systemctl enable toobix-api

# Check status
sudo systemctl status toobix-api

# View logs
sudo journalctl -u toobix-api -f

# Restart
sudo systemctl restart toobix-api

# Stop
sudo systemctl stop toobix-api
```

## Graceful Shutdown

The daemon and server both support graceful shutdown:

1. **SIGTERM** - Graceful shutdown (default systemd stop signal)
   - Server waits for active requests to complete (2s timeout)
   - Logs final statistics
   - Exits cleanly

2. **SIGINT** - Graceful shutdown (Ctrl+C)
   - Same as SIGTERM

3. **SIGHUP** - Reload
   - Restarts the server without stopping the daemon

## Crash Handling

The daemon implements intelligent crash handling:

- **Crash Detection**: If the server exits with non-zero code
- **Automatic Restart**: Server is automatically restarted after `restartDelay`
- **Crash Rate Limiting**: If more than `crashThreshold` crashes occur within `crashWindow`, daemon stops
- **Statistics**: Tracks total crashes, restarts, and uptime

### Example Scenarios

**Scenario 1: Single crash**
- Server crashes
- Daemon detects crash
- Waits 1 second (restartDelay)
- Restarts server
- Continues normally

**Scenario 2: Repeated crashes (crash loop)**
- Server crashes 5 times in 60 seconds
- Daemon detects crash loop
- Stops attempting restarts
- Logs fatal error
- Exits with code 1
- Systemd can then attempt its own restart (if configured)

## Monitoring

### Health Endpoint

```bash
curl http://localhost:3000/health
```

Returns:
```json
{
  "status": "ok",
  "timestamp": "2025-10-23T...",
  "service": "api-server",
  "uptime": 1234.56,
  "memory": { ... },
  "errors": {
    "total": 0,
    "lastHour": 0,
    "lastMinute": 0
  },
  "requests": { ... }
}
```

### Daemon Statistics

The daemon logs statistics every 5 minutes:

```
📊 Daemon Stats: {
  uptime: "3600s",
  restarts: 0,
  crashes: 0,
  status: "running"
}
```

### Log Files

- **Daemon logs**: `./logs/daemon.log`
- **Server logs**: Integrated into daemon logs
- **Systemd logs**: `sudo journalctl -u toobix-api -f`

## Troubleshooting

### Daemon won't start

1. Check if already running:
   ```bash
   bun run daemon:status
   ```

2. Check for stale PID file:
   ```bash
   cat daemon.pid
   ps -p <PID>  # Check if process exists
   rm daemon.pid  # Remove if stale
   ```

3. Check logs:
   ```bash
   tail -f ./logs/daemon.log
   ```

### Server keeps crashing

1. Check crash count:
   ```bash
   bun run daemon:status
   ```

2. View daemon logs for crash details:
   ```bash
   tail -100 ./logs/daemon.log
   ```

3. Adjust crash threshold if needed:
   - Edit `src/daemon.ts`
   - Increase `crashThreshold` or `crashWindow`

### Graceful shutdown not working

1. Check if server handles SIGTERM:
   ```bash
   # Should log "Received SIGTERM, starting graceful shutdown..."
   ```

2. Ensure timeout is sufficient:
   - Server waits 2 seconds for active requests
   - Daemon waits 5 seconds for server to stop
   - Systemd waits 30 seconds (TimeoutStopSec)

## Best Practices

### Development

- Use `bun run dev` for quick iterations
- Use `bun run daemon` to test crash recovery
- Monitor logs in separate terminal: `tail -f ./logs/daemon.log`

### Production

- Use systemd for production deployments
- Set appropriate resource limits in service file
- Configure log rotation (logrotate)
- Monitor with external tools (Prometheus, Grafana)
- Set up alerts for high crash rates
- Use process supervisors like systemd rather than running daemon directly

### Security

- Run as non-root user (see service file)
- Enable security hardening options in systemd
- Restrict filesystem access (ReadWritePaths)
- Set resource limits (MemoryLimit, CPUQuota)
- Keep logs in secure location
- Rotate PID and log files regularly

## Architecture

```
┌─────────────────────────────────────────┐
│           Systemd (Optional)            │
│  - Auto-start on boot                   │
│  - Service management                   │
│  - Log collection                       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│        Eternal Daemon Process           │
│  - Crash detection                      │
│  - Auto-restart logic                   │
│  - Signal handling                      │
│  - Statistics tracking                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         API Server Process              │
│  - HTTP endpoints                       │
│  - Error handling                       │
│  - Rate limiting                        │
│  - Metrics collection                   │
│  - Graceful shutdown                    │
└─────────────────────────────────────────┘
```

## Migration from Direct Execution

If currently running the server directly:

### Before (no auto-restart)
```bash
bun run src/server.ts
```

### After (with daemon)
```bash
# Development
bun run daemon

# Production
bun run daemon:start
```

The daemon provides the same functionality plus automatic restart and crash recovery.
