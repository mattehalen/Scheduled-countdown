const mocha = require('mocha');
const { describe, it, before, after } = mocha;
const { expect } = require('chai');
const WebSocket = require('ws');
const ServerClock = require('../src/websocket-listeners/SC-module/lib/server-clock');
const ClientClock = require('../src/websocket-listeners/SC-module/lib/client-clock');

describe('Clock Tests', () => {
    let wss;
    let clientWs;
    let clientClock;
    const TEST_PORT = 8081;

    before((done) => {
        // Create WebSocket server
        wss = new WebSocket.Server({ port: TEST_PORT });
        
        // Add WebSocket connection handler
        wss.on('connection', (ws) => {
            ServerClock.addClient(ws);
        });

        // Create client WebSocket
        clientWs = new WebSocket(`ws://localhost:${TEST_PORT}`);
        
        clientWs.on('open', () => {
            clientClock = new ClientClock(clientWs);
            done();
        });
    });

    after(function(done) {
        this.timeout(10000); // Increase timeout for cleanup
        ServerClock.stop();
        if (clientClock) {
            clientClock.stop();
        }
        
        // Force close any remaining connections
        wss.clients.forEach(client => {
            client.terminate();
        });
        
        wss.close(() => {
            setTimeout(done, 1000); // Give some time for cleanup
        });
    });

    it('should start server clock and receive updates', (done) => {
        let updateReceived = false;
        
        clientClock.onUpdate((formattedTime, timeMs) => {
            if (!updateReceived) {
                updateReceived = true;
                expect(formattedTime).to.match(/^\d{2}:\d{2}:\d{2}$/);
                expect(timeMs).to.be.a('number');
                done();
            }
        });

        ServerClock.start();
    });

    it('should synchronize time between server and client', (done) => {
        const serverTime = ServerClock.getCurrentTimeMs();
        const clientTime = clientClock.getCurrentTimeMs();
        
        // Allow for small time difference (up to 100ms)
        expect(Math.abs(serverTime - clientTime)).to.be.below(100);
        done();
    });

    it('should handle time offset adjustments', (done) => {
        const offset = 5000; // 5 seconds
        ServerClock.setOffset(offset);

        setTimeout(() => {
            const serverTime = ServerClock.getCurrentTimeMs();
            const clientTime = clientClock.getCurrentTimeMs();
            
            // Check if offset was applied (allow for small difference)
            expect(Math.abs((serverTime - Date.now()) - offset)).to.be.below(100);
            expect(Math.abs((clientTime - Date.now()) - offset)).to.be.below(100);
            
            done();
        }, 1000);
    });
});