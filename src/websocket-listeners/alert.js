const WebSocketService = require('../websocket/websocket-service');
const EVENTS = {
    STARTURL:       "startUrl",
    ADMINURL:       "adminUrl",
    FOHURL:         "fohUrl",
    STAGEURL:       "stageUrl",
    WATCHURL:       "watchUrl",
    COUNTDOWNURL:   "countdownUrl",
    ALLUSERSURL:    "allUsersUrl"
};

WebSocketService.onEvent(EVENTS.STARTURL, async (messageEvent) => {
    const key     = messageEvent.getKey();
    const message = messageEvent.getMessage();
    console.log("STARTURL is pressed = "+message);
    

    // // To send data back to UI client.
    // messageEvent.sendToClient('key', 'some-data');

    // // To broadcast message to all UI clients.
    messageEvent.broadcastToAll('startUrl', message);

    // // To broadcast message to all UI clients.
    // WebSocketService.broadcastToAll('key', 'some-data');
});
WebSocketService.onEvent(EVENTS.ADMINURL, async (messageEvent) => {
    const key     = messageEvent.getKey();
    const message = messageEvent.getMessage();
    console.log("ADMINURL is pressed = "+message);
    

    // // To send data back to UI client.
    // messageEvent.sendToClient('key', 'some-data');

    // // To broadcast message to all UI clients.
    messageEvent.broadcastToAll('adminUrl', message);

    // // To broadcast message to all UI clients.
    // WebSocketService.broadcastToAll('key', 'some-data');
});
WebSocketService.onEvent(EVENTS.FOHURL, async (messageEvent) => {
    const key     = messageEvent.getKey();
    const message = messageEvent.getMessage();
    console.log("STARTURL is pressed = "+message);
    

    // // To send data back to UI client.
    // messageEvent.sendToClient('key', 'some-data');

    // // To broadcast message to all UI clients.
    messageEvent.broadcastToAll('fohUrl', message);

    // // To broadcast message to all UI clients.
    // WebSocketService.broadcastToAll('key', 'some-data');
});
WebSocketService.onEvent(EVENTS.STAGEURL, async (messageEvent) => {
    const key     = messageEvent.getKey();
    const message = messageEvent.getMessage();
    console.log("ADMINURL is pressed = "+message);
    

    // // To send data back to UI client.
    // messageEvent.sendToClient('key', 'some-data');

    // // To broadcast message to all UI clients.
    messageEvent.broadcastToAll('stageUrl', message);

    // // To broadcast message to all UI clients.
    // WebSocketService.broadcastToAll('key', 'some-data');
});
WebSocketService.onEvent(EVENTS.WATCHURL, async (messageEvent) => {
    const key     = messageEvent.getKey();
    const message = messageEvent.getMessage();
    console.log("WATCHURL is pressed = "+message);
    

    // // To send data back to UI client.
    // messageEvent.sendToClient('key', 'some-data');

    // // To broadcast message to all UI clients.
    messageEvent.broadcastToAll('watchUrl', message);

    // // To broadcast message to all UI clients.
    // WebSocketService.broadcastToAll('key', 'some-data');
});
WebSocketService.onEvent(EVENTS.COUNTDOWNURL, async (messageEvent) => {
    const key     = messageEvent.getKey();
    const message = messageEvent.getMessage();
    console.log("COUNTDOWNURL is pressed = "+message);
    

    // // To send data back to UI client.
    // messageEvent.sendToClient('key', 'some-data');

    // // To broadcast message to all UI clients.
    messageEvent.broadcastToAll('countdownUrl', message);

    // // To broadcast message to all UI clients.
    // WebSocketService.broadcastToAll('key', 'some-data');
});
WebSocketService.onEvent(EVENTS.ALLUSERSURL, async (messageEvent) => {
    const key     = messageEvent.getKey();
    const message = messageEvent.getMessage();
    console.log("ADMINURL is pressed = "+message);
    

    // // To send data back to UI client.
    // messageEvent.sendToClient('key', 'some-data');

    // // To broadcast message to all UI clients.
    messageEvent.broadcastToAll('allUsersUrl', message);

    // // To broadcast message to all UI clients.
    // WebSocketService.broadcastToAll('key', 'some-data');
});