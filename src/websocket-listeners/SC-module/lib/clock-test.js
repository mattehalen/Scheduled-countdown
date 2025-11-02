const serverClock = require('./server-clock');
const io = require('socket.io-client');

// Test 1: Server Clock functionality
function testServerClock() {
    console.log('\n=== Testing Server Clock ===');
    
    // Test getCurrentTime
    const formattedTime = serverClock.getCurrentTime();
    console.log('1. getCurrentTime():', formattedTime);
    
    // Test getCurrentTimeMs
    const timeMs = serverClock.getCurrentTimeMs();
    console.log('2. getCurrentTimeMs():', timeMs);
    
    // Test state management
    console.log('3. Current State:', serverClock._currentState);
    
    return formattedTime && timeMs;
}

// Test 2: WebSocket functionality
async function testWebSocket() {
    console.log('\n=== Testing WebSocket Connection ===');
    
    return new Promise((resolve) => {
        console.log('Attempting to connect to WebSocket...');
        
        const socket = io('http://localhost:3000', {
            transports: ['polling', 'websocket']
        });
        
        socket.on('connect', () => {
            console.log('1. Socket.IO connected successfully');
            console.log('Socket ID:', socket.id);
        });
        
        socket.on('state_update', (data) => {
            console.log('2. Received state update:', data);
            socket.disconnect();
            resolve(true);
        });
        
        socket.on('connect_error', (error) => {
            console.log('Connect Error:', error.message);
            console.log('Error details:', error);
            resolve(false);
        });
        
        socket.on('error', (error) => {
            console.log('General Socket Error:', error);
        });
        
        // Set a timeout in case we don't receive any message
        setTimeout(() => {
            console.log('No message received within 5 seconds');
            socket.disconnect();
            resolve(false);
        }, 5000);
    });
}

// Run all tests
async function runTests() {
    try {
        console.log('\nStarting Clock System Tests...');
        
        // Test 1: Server Clock
        const clockResult = testServerClock();
        console.log('Server Clock Test:', clockResult ? 'PASSED' : 'FAILED');
        
        // Test 2: WebSocket
        const wsResult = await testWebSocket();
        console.log('WebSocket Test:', wsResult ? 'PASSED' : 'FAILED');
        
    } catch (error) {
        console.error('Test failed with error:', error);
    }
}

// Export the test functions
module.exports = {
    runTests,
    testServerClock,
    testWebSocket
};