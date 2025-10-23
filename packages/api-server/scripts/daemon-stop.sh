#!/bin/bash

# Toobix API Server - Stop Daemon Script

set -e

echo "🛑 Stopping Toobix API Daemon..."

# Check if PID file exists
if [ ! -f "./daemon.pid" ]; then
    echo "⚠️  No PID file found. Daemon may not be running."
    exit 1
fi

PID=$(cat ./daemon.pid)

# Check if process is running
if ! ps -p $PID > /dev/null 2>&1; then
    echo "⚠️  Process not found (PID: $PID)"
    echo "Removing stale PID file..."
    rm -f ./daemon.pid
    exit 1
fi

# Send SIGTERM for graceful shutdown
echo "Sending SIGTERM to PID $PID..."
kill -TERM $PID

# Wait for process to stop
echo "Waiting for graceful shutdown..."
for i in {1..30}; do
    if ! ps -p $PID > /dev/null 2>&1; then
        echo "✅ Daemon stopped successfully"
        rm -f ./daemon.pid
        exit 0
    fi
    sleep 1
done

# Force kill if still running
echo "⚠️  Daemon did not stop gracefully. Forcing kill..."
kill -KILL $PID
rm -f ./daemon.pid
echo "✅ Daemon killed"
