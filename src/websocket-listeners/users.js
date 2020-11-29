const WebSocketService = require('../websocket/websocket-service');

const EVENTS = {
    GET_USER_DATA: 'GET_USER_DATA'
};


// ---------- Socket Listeners ----------

WebSocketService.onEvent('AddNewCueRow', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('send_Delete_CueButton_To_Socket', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('user', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

