#!/usr/bin/env node
/**
 * Test script to verify heap snapshot functionality
 * Run: node test-heap-snapshot.js
 */

const memoryMonitor = require('./tools/memory-monitor');

console.log('Testing heap snapshot functionality...\n');

// Check if heap snapshots are available
console.log('✓ Heap snapshot available:', memoryMonitor.isHeapdumpAvailable());

// Test taking a snapshot
console.log('\nTaking test heap snapshot...');
memoryMonitor.takeSnapshot('./logs', 'test-manual')
  .then(filepath => {
    console.log('✓ Success! Snapshot saved to:', filepath);
    console.log('\nYou can load this file in Chrome DevTools:');
    console.log('  1. Open Chrome DevTools (F12)');
    console.log('  2. Go to Memory tab');
    console.log('  3. Click "Load" and select the .heapsnapshot file');
    process.exit(0);
  })
  .catch(err => {
    console.error('✗ Error:', err.message);
    process.exit(1);
  });
