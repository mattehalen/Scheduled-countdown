const http = require('http');
const express = require('express');

class TestServer {
    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.server = http.createServer(this.app);
        
        // Add a test endpoint
        this.app.get('/', (req, res) => {
            res.status(200).send('Test server running');
        });
    }

    async start(port = 3000) {
        return new Promise((resolve, reject) => {
            try {
                this.server = this.server.listen(port, () => {
                    console.log(`Test server listening on port ${port}`);
                    resolve();
                });
            } catch (error) {
                console.error('Error starting server:', error);
                reject(error);
            }
        });
    }

    async stop() {
        return new Promise((resolve, reject) => {
            if (!this.server) {
                return resolve();
            }

            try {
                this.server.close((err) => {
                    if (err) {
                        console.error('Error closing server:', err);
                        return reject(err);
                    }
                    console.log('Server stopped successfully');
                    resolve();
                });

                // Force close any remaining connections
                setTimeout(() => {
                    if (this.server) {
                        this.server.emit('close');
                        resolve();
                    }
                }, 1000);
            } catch (error) {
                console.error('Error in stop:', error);
                reject(error);
            }
        });
    }
}

module.exports = TestServer;