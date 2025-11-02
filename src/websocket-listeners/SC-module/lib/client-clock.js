class ClientClock {
    constructor(websocket) {
        this._ws = websocket;
        this._onUpdateCallbacks = new Set();
        this._setupWebSocket();
    }

    // Register callback for state updates
    onUpdate(callback) {
        this._onUpdateCallbacks.add(callback);
        return () => this._onUpdateCallbacks.delete(callback);
    }

    // Start receiving updates (no-op as we just receive)
    start() {
        // Nothing to do - server pushes updates
    }

    // Stop receiving updates (no-op as we just receive)
    stop() {
        // Nothing to do - WebSocket handles cleanup
    }

    // Set up WebSocket message handlers
    _setupWebSocket() {
        this._ws.addEventListener('message', (event) => {
            try {
                const data = JSON.parse(event.data);
                
                switch (data.type) {
                    case 'clock_update':
                        this._handleClockUpdate(data);
                        break;
                    case 'timesync':
                    case 'timesync_response':
                        this._handleTimeSync(data);
                        break;
                }
            } catch (error) {
                console.error('Error handling server message:', error);
            }
        });
    }

    // Handle clock update from server
    _handleClockUpdate(data) {
        const serverTime = data.time;
        const localTime = Date.now();
        
        // Notify callbacks
        this._onUpdateCallbacks.forEach(callback => {
            try {
                callback(data.formatted, serverTime);
            } catch (error) {
                console.error('Error in clock update callback:', error);
            }
        });
    }

    // Handle time sync response from server
    _handleTimeSync(data) {
        const now = Date.now();
        const serverTime = data.serverTime;
        
        // Calculate clock drift
        this._clockDrift = serverTime - now;
        this._lastSync = now;

        // Initial sync complete
        this._notifyUpdate();
    }

    // Request time sync from server
    _requestTimeSync() {
        if (this._ws.readyState === WebSocket.OPEN) {
            this._ws.send(JSON.stringify({
                type: 'timesync_request',
                clientTime: Date.now()
            }));
        }
    }

    // Notify all callbacks of time update
    _notifyUpdate() {
        const time = this.getCurrentTimeMs();
        const formatted = this.getFormattedTime();
        
        this._onUpdateCallbacks.forEach(callback => {
            try {
                callback(formatted, time);
            } catch (error) {
                console.error('Error in clock update callback:', error);
            }
        });
    }
}

// Export the class
module.exports = ClientClock;