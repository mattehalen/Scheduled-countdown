const express = require('express');
const path = require('path');
const router = express.Router();
const memoryMonitor = require('../../tools/memory-monitor');

// POST /admin/api/heap/snapshot
// Trigger an immediate heap snapshot
router.post('/heap/snapshot', async (req, res) => {
  try {
    const outDir = './logs';  // Same as memory-monitor default
    const prefix = (req.query && req.query.prefix) || process.env.HEAPDUMP_PREFIX || 'heap';
    const snapshot = await memoryMonitor.takeSnapshot(outDir, prefix);
    res.json({ 
      success: true, 
      message: 'Heap snapshot triggered',
      snapshot: snapshot ? path.basename(snapshot) : null
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Failed to take heap snapshot',
      details: err.stack
    });
  }
});

// GET /admin/api/heap/status
// Get current memory usage and monitor status
router.get('/heap/status', (req, res) => {
  const usage = process.memoryUsage();
  res.json({
    success: true,
    memory: {
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      rss: usage.rss,
      heapUsedPercent: Math.round((usage.heapUsed / usage.heapTotal) * 100)
    },
    heapdumpAvailable: memoryMonitor.isHeapdumpAvailable(),
    monitorActive: memoryMonitor.isActive()
  });
});

module.exports = router;