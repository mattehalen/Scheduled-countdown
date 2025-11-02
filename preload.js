const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    // IPC APIs
    getGithubRevision: () => ipcRenderer.invoke('get_github_revision'),
    getPort: () => ipcRenderer.invoke('get_port'),
    getAutoStart: () => ipcRenderer.invoke('getAutoStart'),
    saveIP: (data) => ipcRenderer.invoke('saveIP', data),
    loopbackIP: (data) => ipcRenderer.invoke('loopbackIP', data),
    startServer: () => ipcRenderer.invoke('start_server'),
    stopServer: () => ipcRenderer.invoke('stop_server'),
    openAdmin: (data) => ipcRenderer.invoke('open_admin', data),
    openRoot: (data) => ipcRenderer.invoke('open_root', data),
    setAutoStart: (data) => ipcRenderer.invoke('AutoStart', data),
    openLog: () => ipcRenderer.invoke('openLog'),
    
    // System utilities (delegated to main process)
    getNetworkIPs: () => ipcRenderer.invoke('get_network_ips'),

    // Package info (delegated to main process)
    getPackageInfo: () => ipcRenderer.invoke('get_package_info')
  }
);