// Memory Management UI
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if we're on the memory tab
  const memoryTab = document.getElementById('memory');
  if (!memoryTab) return;

  const elements = {
    heapUsageBar: document.getElementById('heapUsageBar'),
    heapUsageText: document.getElementById('heapUsageText'),
    heapDetails: document.getElementById('heapDetails'),
    rssValue: document.getElementById('rssValue'),
    monitorStatus: document.getElementById('monitorStatus'),
    takeSnapshot: document.getElementById('takeSnapshot'),
    refreshMemoryStatus: document.getElementById('refreshMemoryStatus'),
    snapshotResult: document.getElementById('snapshotResult'),
    snapshotList: document.getElementById('snapshotList')
  };

  // Format bytes to human readable
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  // Update UI with memory status
  const updateMemoryStatus = async () => {
    try {
      const response = await fetch('/admin/api/heap/status');
      const data = await response.json();
      
      if (data.success) {
        const { memory, heapdumpAvailable, monitorActive } = data;
        const usedPercent = memory.heapUsedPercent;
        
        // Update progress bar
        elements.heapUsageBar.style.width = `${usedPercent}%`;
        elements.heapUsageText.textContent = `${usedPercent}%`;
        
        // Color the progress bar based on usage
        const barClass = usedPercent > 85 ? 'bg-danger' : 
                        usedPercent > 70 ? 'bg-warning' : 'bg-info';
        elements.heapUsageBar.className = `progress-bar ${barClass}`;
        
        // Update details
        elements.heapDetails.textContent = 
          `${formatBytes(memory.heapUsed)} / ${formatBytes(memory.heapTotal)}`;
        elements.rssValue.textContent = formatBytes(memory.rss);
        
        // Update monitor status
        elements.monitorStatus.textContent = monitorActive 
          ? '✓ Memory monitor active'
          : '❌ Memory monitor not running';
        
        // Enable/disable snapshot button
        elements.takeSnapshot.disabled = !heapdumpAvailable;
        if (!heapdumpAvailable) {
          elements.takeSnapshot.title = 'Heap dumps not available (heapdump module not installed)';
        }
      }
    } catch (err) {
      console.error('Failed to fetch memory status:', err);
      elements.monitorStatus.textContent = '❌ Failed to fetch memory status';
    }
  };

  // Take a heap snapshot
  const takeSnapshot = async () => {
    elements.takeSnapshot.disabled = true;
    elements.snapshotResult.textContent = 'Taking snapshot...';
    
    try {
      const response = await fetch('/admin/api/heap/snapshot', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        elements.snapshotResult.textContent = 
          `✓ Snapshot taken: ${data.snapshot || 'unknown'}`;
      } else {
        elements.snapshotResult.textContent = 
          `❌ Failed: ${data.error || 'unknown error'}`;
      }
    } catch (err) {
      console.error('Failed to take snapshot:', err);
      elements.snapshotResult.textContent = '❌ Failed to take snapshot';
    } finally {
      elements.takeSnapshot.disabled = false;
    }
  };

  // Wire up event handlers
  elements.takeSnapshot.addEventListener('click', takeSnapshot);
  elements.refreshMemoryStatus.addEventListener('click', updateMemoryStatus);

  // Update status initially and every 30s
  updateMemoryStatus();
  setInterval(updateMemoryStatus, 30000);
});