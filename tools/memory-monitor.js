const fs = require('fs');
const path = require('path');

// Simple memory monitor that writes CSV lines every interval
// Uses Node.js built-in v8.writeHeapSnapshot (no external dependencies needed)
// Usage: require('./tools/memory-monitor').start({ intervalMs: 60000, outDir: './logs' })

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function formatRow(obj) {
  // CSV escape
  return Object.values(obj).map(v => typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v).join(',') + '\n';
}

function defaultOutDir() {
  // Prefer a logs folder in app root
  return path.join(process.cwd(), 'logs');
}

function writeHeaderIfNeeded(filePath) {
  if (!fs.existsSync(filePath)) {
    const header = 'time_iso,pid,uptime_ms,rss,heapTotal,heapUsed,external,arrayBuffers,heapUsed_pct\n';
    fs.appendFileSync(filePath, header);
  }
}

function sample() {
  const mem = process.memoryUsage();
  const pid = process.pid;
  const uptime = Math.round(process.uptime() * 1000);
  const heapUsedPct = mem.heapTotal ? (Math.round((mem.heapUsed / mem.heapTotal) * 10000) / 100) : 0;
  return {
    time_iso: new Date().toISOString(),
    pid,
    uptime_ms: uptime,
    rss: mem.rss,
    heapTotal: mem.heapTotal,
    heapUsed: mem.heapUsed,
    external: mem.external || 0,
    arrayBuffers: mem.arrayBuffers || 0,
    heapUsed_pct: heapUsedPct
  };
}

let _timer = null;

// Use Node.js built-in v8.writeHeapSnapshot (available in Node 12+)
// This replaces the need for the heapdump package
const v8 = require('v8');
const heapSnapshotAvailable = typeof v8.writeHeapSnapshot === 'function';

let _lastSnapshotTime = 0;
let _lastRestartTime = 0;

function takeSnapshot(outDir, prefix = 'heap') {
  if (!heapSnapshotAvailable) {
    console.log('memory-monitor: v8.writeHeapSnapshot not available, skipping snapshot');
    return Promise.resolve(null);
  }
  ensureDir(outDir);
  const filename = path.join(outDir, `${prefix}-${new Date().toISOString().replace(/[:.]/g, '-')}.heapsnapshot`);
  
  try {
    const result = v8.writeHeapSnapshot(filename);
    console.log('memory-monitor: heap snapshot written to', result);
    _lastSnapshotTime = Date.now();
    return Promise.resolve(result);
  } catch (err) {
    console.error('memory-monitor: heap snapshot failed', err);
    return Promise.reject(err);
  }
}

function start(options = {}) {
  const intervalMs = options.intervalMs || Number(process.env.MEMORY_MONITOR_INTERVAL_MS) || 60000;
  const outDir = options.outDir || defaultOutDir();
  ensureDir(outDir);
  const filePath = path.join(outDir, options.fileName || 'memory.csv');
  writeHeaderIfNeeded(filePath);

  const enableHeapSnapshots = options.enableHeapSnapshots || (String(process.env.ENABLE_HEAPDUMP || '').toLowerCase() === 'true') || false;
  const heapThresholdBytes = options.heapThresholdBytes || (Number(process.env.HEAPDUMP_THRESHOLD_MB) ? Number(process.env.HEAPDUMP_THRESHOLD_MB) * 1024 * 1024 : (options.heapThresholdBytes || 0));
  const snapshotCooldownMs = options.snapshotCooldownMs || Number(process.env.HEAPDUMP_COOLDOWN_MS) || 1000 * 60 * 60; // default 1 hour
  const snapshotPrefix = options.snapshotPrefix || process.env.HEAPDUMP_PREFIX || 'heap';

  // Optional graceful restart if memory too high
  const enableRestart = options.enableRestart || (String(process.env.ENABLE_MEMORY_RESTART || '').toLowerCase() === 'true') || false;
  const restartThresholdBytes = options.restartThresholdBytes || (Number(process.env.RESTART_THRESHOLD_MB) ? Number(process.env.RESTART_THRESHOLD_MB) * 1024 * 1024 : 0);
  const restartCooldownMs = options.restartCooldownMs || Number(process.env.RESTART_COOLDOWN_MS) || (1000 * 60 * 30); // default 30 min

  if (_timer) return { started: false, message: 'Already started' };

  _timer = setInterval(() => {
    try {
      const row = sample();
      // Append to CSV
      fs.appendFile(filePath, formatRow(row), (err) => {
        if (err) console.error('memory-monitor: failed to write CSV', err);
      });
      // Also log to console so existing logging captures it
      console.log('memory-monitor:', row);

      // If enabled, check threshold and take heap snapshot if exceeded and cooldown passed
      if (enableHeapSnapshots && heapSnapshotAvailable && heapThresholdBytes && row.heapUsed > heapThresholdBytes) {
        const now = Date.now();
        if ((now - _lastSnapshotTime) > snapshotCooldownMs) {
          takeSnapshot(outDir, snapshotPrefix).catch(err => console.error('memory-monitor: snapshot error', err));
        } else {
          console.log('memory-monitor: heap above threshold but snapshot cooldown active');
        }
      }

      // Optional graceful restart if RSS above threshold
      if (enableRestart && restartThresholdBytes && row.rss > restartThresholdBytes) {
        const now = Date.now();
        if ((now - _lastRestartTime) > restartCooldownMs) {
          _lastRestartTime = now;
          console.warn('memory-monitor: RSS above restart threshold. Taking snapshot and exiting for graceful restart...');
          // Try a snapshot first (best-effort)
          const maybeSnap = enableHeapSnapshots && heapSnapshotAvailable ? takeSnapshot(outDir, 'restart') : Promise.resolve(null);
          maybeSnap.finally(() => {
            // Give I/O a brief moment to flush
            setTimeout(() => {
              console.warn('memory-monitor: exiting process (code 64) for graceful restart');
              process.exit(64);
            }, 1500);
          });
        } else {
          console.log('memory-monitor: RSS above threshold but restart cooldown active');
        }
      }

    } catch (err) {
      console.error('memory-monitor: sample failed', err);
    }
  }, intervalMs);

  // Do an immediate sample
  try {
    const row = sample();
    fs.appendFileSync(filePath, formatRow(row));
    console.log('memory-monitor: started, first sample:', row);
    // If immediate snapshot conditions met, take one
    if (options.enableHeapSnapshots && heapSnapshotAvailable && heapThresholdBytes && row.heapUsed > heapThresholdBytes) {
      takeSnapshot(outDir, snapshotPrefix).catch(err => console.error('memory-monitor: initial snapshot error', err));
    }
  } catch (err) {
    console.error('memory-monitor: initial sample failed', err);
  }

  return { started: true, intervalMs, filePath };
}

function stop() {
  if (_timer) {
    clearInterval(_timer);
    _timer = null;
    return true;
  }
  return false;
}

function isHeapdumpAvailable() {
  return heapSnapshotAvailable;
}

function isActive() {
  return Boolean(_timer);
}

module.exports = { start, stop, takeSnapshot, isHeapdumpAvailable, isActive };
