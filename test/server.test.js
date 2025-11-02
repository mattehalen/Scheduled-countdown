const mocha = require('mocha');
const { describe, it, before, after } = mocha;
const chai = require('chai');
const { expect } = chai;
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const TestServer = require('./test-server');

// Create test data directory
const testDataDir = path.join(__dirname, 'test-data');
if (!fs.existsSync(testDataDir)) {
    fs.mkdirSync(testDataDir, { recursive: true });
}

let server;

describe('Server Tests', () => {
    const TEST_PORT = 3000;

    before(async () => {
        server = new TestServer();
    });

    after(async () => {
        try {
            await server.stop();
            if (fs.existsSync(testDataDir)) {
                fs.rmSync(testDataDir, { recursive: true, force: true });
            }
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    });

    it('should start the server successfully', async () => {
        await server.start(TEST_PORT);
        try {
            const response = await axios.get(`http://localhost:${TEST_PORT}/`);
            expect(response.status).to.equal(200);
            expect(response.data).to.equal('Test server running');
        } catch (error) {
            throw new Error(`Failed to connect to server: ${error.message}`);
        }
    });

    it('should stop the server successfully', async () => {
        await server.stop();
        try {
            await axios.get(`http://localhost:${TEST_PORT}/`);
            throw new Error('Server still running');
        } catch (error) {
            expect(error.code).to.equal('ECONNREFUSED');
        }
    });

    it('should handle multiple start/stop cycles', async () => {
        // First cycle
        await server.start(TEST_PORT);
        let response = await axios.get(`http://localhost:${TEST_PORT}/`);
        expect(response.status).to.equal(200);
        await server.stop();

        // Second cycle
        await server.start(TEST_PORT);
        response = await axios.get(`http://localhost:${TEST_PORT}/`);
        expect(response.status).to.equal(200);
        await server.stop();

        try {
            await axios.get(`http://localhost:${TEST_PORT}/`);
            throw new Error('Server still running');
        } catch (error) {
            expect(error.code).to.equal('ECONNREFUSED');
        }
    });
});