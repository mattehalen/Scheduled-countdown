const WebSocketService = require('../websocket/websocket-service');

const EVENTS = {
    GET_TIME_CODE: 'getTimeCode'
};


// ---------- Socket Listeners ----------

WebSocketService.onEvent(EVENTS.GET_TIME_CODE, (messageEvent) => {
    const key     = messageEvent.getKey();
    const message = messageEvent.getMessage();

    //console.log(message);

    // To send data back to UI client.
    // messageEvent.sendToClient('key', 'some-data');

    // To broadcast message to all UI clients.
    // messageEvent.broadcastToAll('key', 'some-data');

    // To broadcast message to all UI clients.
    // WebSocketService.broadcastToAll('key', 'some-data');
});

