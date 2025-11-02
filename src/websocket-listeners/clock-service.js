const serverClock = require('./SC-module/lib/server-clock');

module.exports = {
    registerClock: function(io) {
        // Initialize Socket.IO for the ServerClock
        serverClock.constructor.initializeIo(io);
        
        // Handle new Socket.IO connections
        io.on('connection', (socket) => {
            console.log('Client connected to clock service');
            
            socket.on('disconnect', () => {
                console.log('Client disconnected from clock service');
            });
        });

        // Cleanup on process exit
        process.on('SIGINT', () => {
            console.log('Stopping clock service...');
            ServerClock.stop();
            process.exit();
        });
    }
};