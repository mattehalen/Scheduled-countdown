const clockTest = require('./clock-test');

console.log('Starting clock system tests...');
clockTest.runTests().catch(console.error);