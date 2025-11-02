const UtilityService = require('./src/services/utility-service');
UtilityService.loadEnvironmentConfiguration();

const Server = require('./src/server');
console.log("---------------> ./index.js");
// Start lightweight memory monitor in development/test runs. Collects overnight
// memory usage data and can take heap snapshots using Node.js built-in v8 module.
// Configuration via environment variables (see tools/memory-monitor.js for details).
try {
    const memoryMonitor = require('./tools/memory-monitor');
    const enableHeap = String(process.env.ENABLE_HEAPDUMP || '').toLowerCase() === 'true';
    const heapThresholdMB = process.env.HEAPDUMP_THRESHOLD_MB ? Number(process.env.HEAPDUMP_THRESHOLD_MB) : undefined;
    const monitorOpts = {
        intervalMs: Number(process.env.MEMORY_MONITOR_INTERVAL_MS) || 60000,
        enableHeapSnapshots: enableHeap,
        heapThresholdBytes: heapThresholdMB ? heapThresholdMB * 1024 * 1024 : undefined,
        snapshotCooldownMs: process.env.HEAPDUMP_COOLDOWN_MS ? Number(process.env.HEAPDUMP_COOLDOWN_MS) : undefined,
        snapshotPrefix: process.env.HEAPDUMP_PREFIX,
        enableRestart: String(process.env.ENABLE_MEMORY_RESTART || '').toLowerCase() === 'true',
        restartThresholdBytes: process.env.RESTART_THRESHOLD_MB ? Number(process.env.RESTART_THRESHOLD_MB) * 1024 * 1024 : undefined,
        restartCooldownMs: process.env.RESTART_COOLDOWN_MS ? Number(process.env.RESTART_COOLDOWN_MS) : undefined
    };
    const monitorInfo = memoryMonitor.start(monitorOpts);
    console.log('Memory monitor:', monitorInfo);
    if (enableHeap) console.log('Heap snapshotting ENABLED (threshold MB):', heapThresholdMB || 'not-set');
} catch (err) {
    console.log('Memory monitor not started:', err && err.message ? err.message : err);
}

async function start() {
    try {
        await Server.startServer();
        await Server.startSocket();
        return { success: true };
    } catch (error) {
        console.log('Error caught: ', error && error.message ? error.message : '');
        if (error && error.stack) {
            console.log('Error stack : ', error.stack);
        }

        if(error.message === "Listen method has been called more than once without closing.") {
            return { success: false, error: "Server is already running" };
        }
        
        return { success: false, error: error.message || "Unknown error occurred" };
    }

}

module.exports = {
    start
}