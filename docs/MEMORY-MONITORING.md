# Memory Monitoring & Heap Snapshots

## Overview
The application includes built-in memory monitoring and heap snapshot capabilities using **Node.js native v8 module** (no external dependencies required).

## Problem Solved
Originally tried to use the `heapdump` npm package, but it requires Visual Studio Build Tools to compile native C++ modules. Instead, we use Node.js's built-in `v8.writeHeapSnapshot()` which is available in Node.js 12+ and requires no compilation.

## Features

### 1. Automatic Memory Logging
- Records memory usage (RSS, heap, etc.) to `./logs/memory.csv` every 60 seconds (configurable)
- Includes timestamp, PID, uptime, and detailed memory metrics

### 2. Heap Snapshots
- Automatic snapshots when heap usage exceeds threshold
- Manual snapshots via admin UI (`/admin` → Memory tab)
- Manual snapshots via API: `POST /admin/api/heap/snapshot`
- Files saved to `./logs/` as `.heapsnapshot` files

### 3. Graceful Restart (Optional)
- Automatically restart if RSS exceeds threshold
- Takes snapshot before restart
- Process exits with code 64 (for process manager to restart)

## Environment Variables

```bash
# Memory monitoring
MEMORY_MONITOR_INTERVAL_MS=60000      # Sample interval (default: 60s)

# Heap snapshots
ENABLE_HEAPDUMP=true                  # Enable automatic heap snapshots
HEAPDUMP_THRESHOLD_MB=200             # Snapshot when heapUsed > 200MB
HEAPDUMP_COOLDOWN_MS=3600000          # Cooldown between auto-snapshots (default: 1h)
HEAPDUMP_PREFIX=heap                  # Filename prefix for snapshots

# Graceful restart
ENABLE_MEMORY_RESTART=true            # Enable automatic restart
RESTART_THRESHOLD_MB=600              # Restart when RSS > 600MB
RESTART_COOLDOWN_MS=1800000           # Cooldown between restarts (default: 30min)
```

## Usage Examples

### Start with monitoring enabled:
```powershell
$env:ENABLE_HEAPDUMP = 'true'
$env:HEAPDUMP_THRESHOLD_MB = '200'
npm run electron
```

### Take a manual snapshot:
```powershell
node test-heap-snapshot.js
```

### Analyze memory logs:
```powershell
py tools\memory-analyze.py
# Creates: logs\memory-analysis.png
```

### View snapshots in Chrome DevTools:
1. Open Chrome DevTools (F12)
2. Go to **Memory** tab
3. Click **Load** button
4. Select a `.heapsnapshot` file from `logs/`
5. Analyze heap usage, retained objects, etc.

## Admin UI
Visit `/admin` and click the **Memory** tab to:
- View live memory usage
- See heap usage percentage with color-coded progress bar
- Take manual heap snapshots
- Monitor status and thresholds

## No Installation Required
✓ Uses Node.js built-in `v8` module  
✓ No native compilation needed  
✓ Works on all platforms (Windows, Mac, Linux)  
✓ Compatible with Node.js 12+

## Troubleshooting

**Snapshot button disabled?**  
Check that Node.js version is 12 or higher:
```powershell
node --version
```

**Memory CSV not being created?**  
The monitor starts automatically. Check console output for:
```
Memory monitor: { started: true, intervalMs: 60000, filePath: '...' }
```

**Want to change snapshot location?**  
Edit `tools/memory-monitor.js` → `defaultOutDir()` function
