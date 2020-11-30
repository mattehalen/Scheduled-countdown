const WebSocketService = require('../websocket/websocket-service');

const EVENTS = {
    GET_USERS: 'GET_USERS'
};


// ---------- Socket Listeners ----------

WebSocketService.onEvent(EVENTS.GET_USERS, (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

