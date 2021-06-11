const WebSocketService = require('../websocket/websocket-service');
const iOSTokens = require("../services/iosToken-settings")
const APN = require('../APN');

const EVENTS = {
    TESTPUSH: "testPush",
    DEVICETOKEN: "deviceToken"
};

WebSocketService.onEvent(EVENTS.TESTPUSH, async (messageEvent) => {
    const key = messageEvent.getKey();
    const message = messageEvent.getMessage();

    console.log("TESTPUSH is pressed = " + message);
    APN.sendNotification("","This is a Push Notification test");
});
WebSocketService.onEvent(EVENTS.DEVICETOKEN, async (messageEvent) => {
    const key = messageEvent.getKey();
    const message = messageEvent.getMessage();
    message.token = message.token.replace(")", "");
    message.token = message.token.replace("(", "");
    message.token = message.token.replace("#", "");
    // console.log(message);
    // console.log(message.token);
    // console.log(message.deviceName);

    let DATA = await iOSTokens.get()

    let isUnic = true
    let testString = message.token
    for (i = 0; i < DATA.iosTokens.length; i++) {
        //console.log(DATA.iosTokens[i].token);

        if (DATA.iosTokens[i].token === testString) {
            console.log("found duplicate");
            isUnic = false
        }

    }

    if (isUnic) {
        console.log("No duplicate where found. Token will be save in db-ios-tokens");
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
    }

});