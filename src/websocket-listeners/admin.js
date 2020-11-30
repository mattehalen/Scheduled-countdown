const WebSocketService = require('../websocket/websocket-service');

const EVENTS = {
    GET_ADMIN_DATA: 'GET_ADMIN_DATA'
};


// ---------- Socket Listeners ----------

WebSocketService.onEvent(EVENTS.GET_ADMIN_DATA, (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

