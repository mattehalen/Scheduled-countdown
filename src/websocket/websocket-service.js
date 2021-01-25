const WebSocketServer = require('./websocket-server');
// const WebSocketInstance = require('./instance');

var websocketInstance = null;

module.exports = {
    start: (httpServer) => {
        console.log("----------> ./websocket/websocket-service -> start");
        if (!websocketInstance) {
            websocketInstance = new WebSocketServer(httpServer);
            console.log("----------> ./websocket/websocket-service -> start -> inside IF");
        }
    },

    stop: () => {
        console.log("----------> ./websocket/websocket-service -> stop");
        if (websocketInstance) {
            websocketInstance.stopServer();
            websocketInstance = null;
            console.log("----------> ./websocket/websocket-service -> stop -> inside IF");

        }
    },

    onEvent: (key, callback) => {
        WebSocketServer.onEvent(key, callback);
    },

    broadcastToAll: (key, data = {}) => {
        if (websocketInstance) {
            websocketInstance.broadcastToAll(key, data);
        }
    },

    EVENTS: {
        'MYKEY': 'MYKEY',
        'MYKEY2': 'MYKEY2'
    }
}
