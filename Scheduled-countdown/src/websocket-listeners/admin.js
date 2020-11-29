const WebSocketService = require('../websocket/websocket-service');

const EVENTS = {
    GET_ADMIN_DATA : 'GET_ADMIN_DATA',
    GET_SETTINGS   : 'GET_SETTINGS'
};


// --- Socket Listeners ---

WebSocketService.onEvent(EVENTS.GET_ADMIN_DATA, (messageEvent) => {
    console.log('Inside admin listener - ', messageEvent.getMessage());
});

WebSocketService.onEvent(EVENTS.GET_SETTINGS, (messageEvent) => {
    console.log('Inside admin listener - ', messageEvent.getMessage());
});
