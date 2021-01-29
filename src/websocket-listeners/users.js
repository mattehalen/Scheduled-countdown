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

    let data = {
        name:message,
        cues:[
            {
                title: "Your First Cue",
                timecode: "00:01:00"
            }
        ]
    }
    users.userName.push(data)
    
    function removeDuplicates(originalArray, prop) {
        var newArray = [];
        var lookupObject  = {};
   
        for(var i in originalArray) {
           lookupObject[originalArray[i][prop]] = originalArray[i];
        }
   
        for(i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
         return newArray;
    }
    var uniqueArray = removeDuplicates(users.userName, "name");
    users.userName = uniqueArray;

    USERS_SETTINGS.write(users);
});

