const WebSocketService = require('../websocket/websocket-service');

const EVENTS = {
    GET_IPSETTINGS: 'GET_IPSETTINGS'
};


// ---------- Socket Listeners ----------

WebSocketService.onEvent(EVENTS.GET_IPSETTINGS, (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

