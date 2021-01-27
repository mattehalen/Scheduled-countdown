const WebSocketService = require('../websocket/websocket-service');
const USERS_SETTINGS  = require("../services/users-settings"); 
const EVENTS = {
    GET_USERS: 'GET_USERS',
    ADD_USER:    "addUser"
};


// ---------- Socket Listeners ----------

WebSocketService.onEvent(EVENTS.GET_USERS, (messageEvent) => {
    const message = messageEvent.getMessage();
    //console.log(message);
});

WebSocketService.onEvent(EVENTS.ADD_USER, async (messageEvent) => {
    const message   = messageEvent.getMessage();
    const users     = await USERS_SETTINGS.get()
    console.log(users.userName);
    let data = {name:message}
    users.userName.push(data)
    console.log(users.userName);

    console.log("----------> src/websocket-listeners/users.js");
    console.log(message);
});

