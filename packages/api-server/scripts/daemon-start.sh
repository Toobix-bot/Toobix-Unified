#!/bin/bash

# Toobix API Server - Start Daemon Script

set -e

echo "🚀 Starting Toobix API Daemon..."

# Create logs directory if it doesn't exist
mkdir -p ./logs

# Check if daemon is already running
if [ -f "./daemon.pid" ]; then
    PID=$(cat ./daemon.pid)
    if ps -p $PID > /dev/null 2>&1; then
        echo "⚠️  Daemon already running (PID: $PID)"
        exit 1
    else
        echo "Removing stale PID file..."
        rm -f ./daemon.pid
    fi
fi

# Start the daemon
bun run src/daemon.ts >> ./logs/daemon.log 2>&1 &
DAEMON_PID=$!

echo "✅ Daemon started (PID: $DAEMON_PID)"
echo "   Logs: ./logs/daemon.log"
echo "   PID file: ./daemon.pid"
echo ""
echo "To monitor: tail -f ./logs/daemon.log"
echo "To stop: ./scripts/daemon-stop.sh"
