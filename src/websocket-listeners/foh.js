const WebSocketService = require('../websocket/websocket-service');

const EVENTS = {
    GET_FOH_DATA: 'GET_FOH_DATA'
};


// ---------- Socket Listeners ----------

WebSocketService.onEvent(EVENTS.GET_FOH_DATA, (messageEvent) => {
    const message = messageEvent.getMessage();
    //console.log(message);
});
