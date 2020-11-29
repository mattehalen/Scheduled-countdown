const WebSocketService = require('../websocket/websocket-service');

const EVENTS = {
    GET_USER_DATA : 'GET_USER_DATA'
};


// --- Socket Listeners ---

WebSocketService.onEvent(EVENTS.GET_USER_DATA, (messageEvent) => {
    console.log('Inside user listener - ', messageEvent.getMessage());
});
