const WebSocketService = require('../websocket/websocket-service');

const EVENTS = {
    GET_ADMIN_DATA: 'GET_ADMIN_DATA',
    GET_SETTINGS: 'GET_SETTINGS'
};


// ---------- Socket Listeners ----------

WebSocketService.onEvent('start', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('sortingButton_To_Socket', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('reload', (messageEvent) => {
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

WebSocketService.onEvent('sendChosenIp_To_Socket', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('startUrl', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('adminUrl', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('fohUrl', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('stageUrl', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('watchUrl', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('countdownUrl', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});

WebSocketService.onEvent('allUsersUrl', (messageEvent) => {
    const message = messageEvent.getMessage();
    console.log(message);
});
