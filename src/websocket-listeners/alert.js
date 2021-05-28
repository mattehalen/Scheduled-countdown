const WebSocketService = require('../websocket/websocket-service');
const iOSTokens         = require("../services/iosToken-settings")
const APN = require('../APN');

const EVENTS = {
    STARTURL:       "startUrl",
    ADMINURL:       "adminUrl",
    FOHURL:         "fohUrl",
    STAGEURL:       "stageUrl",
    WATCHURL:       "watchUrl",
    COUNTDOWNURL:   "countdownUrl",
    ALLUSERSURL:    "allUsersUrl",
    TESTPUSH:       "testPush",
    DEVICETOKEN:    "deviceToken"
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





WebSocketService.onEvent(EVENTS.TESTPUSH, async (messageEvent) => {
    const key     = messageEvent.getKey();
    const message = messageEvent.getMessage();

    console.log("TESTPUSH is pressed = "+message);
    APN.sendNotification(1);
});
WebSocketService.onEvent(EVENTS.DEVICETOKEN, async (messageEvent) => {
    const key     = messageEvent.getKey();
    const message = messageEvent.getMessage();
    console.log(message);
    console.log(message.token);
    console.log(message.deviceName);

    let DATA = await iOSTokens.get()
    var feed = {
        token: message.token,
        deviceName: message.deviceName,
        deviceModel: message.deviceModel
    };
    DATA.iosTokens.push(feed);
    DATA.iosTokens.sort(function (a, b) {
        return a.token.localeCompare(b.token);
    });
    await iOSTokens.write(DATA);
});