const WebSocketService = require('../websocket/websocket-service');

// ---------- Socket Listeners ----------

WebSocketService.onEvent('getTimeCode', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});
