#!/bin/bash

# Toobix API Server - Restart Daemon Script

set -e

echo "🔄 Restarting Toobix API Daemon..."

# Stop the daemon
if [ -f "./daemon.pid" ]; then
    echo "Stopping current daemon..."
    ./scripts/daemon-stop.sh
    sleep 2
fi

# Start the daemon
echo "Starting daemon..."
./scripts/daemon-start.sh
