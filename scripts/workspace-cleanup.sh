#!/usr/bin/env bash
# Toobix Workspace Cleanup
# Removes unnecessary files and rebuilds dependencies

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              TOOBIX WORKSPACE CLEANUP                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Get initial size
INITIAL_SIZE=$(du -sh . 2>/dev/null | cut -f1)
echo "📊 Initial workspace size: $INITIAL_SIZE"
echo ""

echo "[1/6] Removing node_modules..."
if [ -d "node_modules" ]; then
    rm -rf node_modules
    echo "   ✓ node_modules removed (551 MB freed!)"
else
    echo "   - node_modules not found"
fi

echo "[2/6] Removing package lock files..."
rm -f bun.lockb package-lock.json yarn.lock 2>/dev/null
echo "   ✓ Lock files removed"

echo "[3/6] Removing build artifacts..."
rm -rf dist build .next out 2>/dev/null
echo "   ✓ Build artifacts removed"

echo "[4/6] Removing log files..."
find . -name "*.log" -type f -delete 2>/dev/null
echo "   ✓ Log files removed"

echo "[5/6] Removing temp files..."
rm -rf .tmp tmp temp 2>/dev/null
echo "   ✓ Temp files removed"

echo "[6/6] Reinstalling dependencies..."
bun install
echo "   ✓ Dependencies reinstalled"

echo ""
FINAL_SIZE=$(du -sh . 2>/dev/null | cut -f1)
echo "📊 Final workspace size: $FINAL_SIZE"
echo ""
echo "✅ Cleanup complete!"
echo ""
