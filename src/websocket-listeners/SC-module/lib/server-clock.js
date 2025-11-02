const socketio = require('socket.io');

class ServerClock {
    static instance = null;
    static io = null;

    static getInstance() {
        if (!ServerClock.instance) {
            ServerClock.instance = new ServerClock();
        }
        return ServerClock.instance;
    }

    static initializeIo(io) {
        console.log('Initializing Socket.IO for ServerClock');
        ServerClock.io = io;
    }

    constructor() {
        this._timeoutId = null;
        this._currentState = {
            currentTime: '',        // HH:MM:SS
            countdownTime: '',      // HH:MM:SS or -HH:MM:SS
            isCountingDown: false,
            nextEvent: '',
            timeToNextEvent: ''
        };

        // Start broadcasting time updates
        this.start();
    }

    // Get formatted current time
    getCurrentTime() {
        const date = new Date();
        return [
            String(date.getHours()).padStart(2, '0'),
            String(date.getMinutes()).padStart(2, '0'),
            String(date.getSeconds()).padStart(2, '0')
        ].join(':');
    }

    // Get current time in milliseconds
    getCurrentTimeMs() {
        return Date.now();
    }

    // Add a new WebSocket client
    addClient(ws) {
        this._clients.add(ws);
        
        // Send initial state
        this._sendStateToClient(ws);

        // Remove client when they disconnect
        ws.on('close', () => {
            this._clients.delete(ws);
        });
    }

    // Start broadcasting time updates
    start() {
        if (this._timeoutId) return;

        const updateAndBroadcast = () => {
            // Update current state
            const nowMs = Date.now();
            this._currentState.currentTime = this.getCurrentTime();
            this._currentState.currentTimeMs = nowMs;
            
            // Calculate countdown time and other states
            this._updateCountdownState();
            
            // Broadcast to all connected clients
            this._broadcastState();

            // Schedule next update for precisely at the next second
            const now = new Date();
            const delay = 1000 - now.getMilliseconds();
            this._timeoutId = setTimeout(updateAndBroadcast, delay);
        };

        updateAndBroadcast();
    }

    // Stop broadcasting time updates
    stop() {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            this._timeoutId = null;
        }
    }

    // Update countdown state based on scheduled times
    async _updateCountdownState() {
        try {
            const TimeArraySorting = require('./TimeArraySorting');
            const result = await TimeArraySorting.Sorting();
            
            if (result && result[0] && result[1]) {
                const [title, startTime, cueLength, cueBool, fiveBool] = result;
                const now = new Date();
                const eventTime = new Date(`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${startTime}`);
                const timeDiff = eventTime.getTime() - now.getTime();
                
                this._currentState.nextEvent = title;
                this._currentState.countdownTime = this._formatCountdownTime(timeDiff);
                this._currentState.countDownTimeInMS = timeDiff;
                this._currentState.isCountingDown = true;
                this._currentState.timeToNextEvent = startTime;
            } else {
                this._currentState.countdownTime = '00:00:00';
                this._currentState.countDownTimeInMS = 0;
                this._currentState.isCountingDown = false;
                this._currentState.nextEvent = 'No upcoming events';
                this._currentState.timeToNextEvent = '--:--:--';
            }
        } catch (error) {
            console.error('Error updating countdown state:', error);
        }
    }

    // Broadcast current state to all clients
    _broadcastState() {
        if (ServerClock.io) {
            // Measure interval since last broadcast
            const now = Date.now();
            const intervalMs = this._lastBroadcast ? (now - this._lastBroadcast) : 0;
            this._lastBroadcast = now;

            // Log the state along with the measured interval
            console.log('Broadcasting state:', this._currentState, `intervalMs=${intervalMs}`);
            ServerClock.io.emit('state_update', this._currentState);
        } else {
            console.log('Warning: Socket.IO not initialized');
        }
    }

    _formatCountdownTime(ms) {
        let sign = ms < 0 ? '-' : '';
        ms = Math.abs(ms);
        
        // Convert to hours, minutes, seconds
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor(ms / (1000 * 60 * 60));
        
        // Format with padding
        return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Export singleton instance
const serverClock = new ServerClock();
module.exports = serverClock;