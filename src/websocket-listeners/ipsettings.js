const WebSocketService = require('../websocket/websocket-service');

// ---------- Socket Listeners ----------

WebSocketService.onEvent('start', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('sendDB_To_Socket', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('updatebutton_To_Socket', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('sortingButton_To_Socket', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('send_addNewRow_To_Socket', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('reloadFiveMinCountDown', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('force5MinCountDownCase', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('writeToScheduledTimesjson', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('send_Delete_Button_To_Socket', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('sendChosenIp_To_Socket', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});