#!/bin/bash

# Toobix API Server - Daemon Status Script

echo "📊 Toobix API Daemon Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if PID file exists
if [ ! -f "./daemon.pid" ]; then
    echo "Status: ❌ Not running (no PID file)"
    exit 1
fi

PID=$(cat ./daemon.pid)

# Check if process is running
if ! ps -p $PID > /dev/null 2>&1; then
    echo "Status: ❌ Not running (stale PID: $PID)"
    echo "⚠️  Removing stale PID file..."
    rm -f ./daemon.pid
    exit 1
fi

# Get process info
echo "Status: ✅ Running"
echo "PID: $PID"
echo ""

# Show process details
ps -p $PID -o pid,ppid,user,%cpu,%mem,vsz,rss,etime,command | tail -n +2

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Query health endpoint
echo ""
echo "Health Check:"
if command -v curl &> /dev/null; then
    curl -s http://localhost:3000/health | head -20
    echo ""
else
    echo "⚠️  curl not found, skipping health check"
fi
