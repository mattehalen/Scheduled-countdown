const WebSocketService = require('../websocket/websocket-service');
const USERS_SETTINGS  = require("../services/users-settings"); 
const EVENTS = {
    GET_USERS:      'GET_USERS',
    ADD_USER:       "addUser",
    DELETE_USER:    "deleteUser"
};


// ---------- Socket Listeners ----------

WebSocketService.onEvent(EVENTS.GET_USERS, (messageEvent) => {
    const message = messageEvent.getMessage();
});

WebSocketService.onEvent(EVENTS.ADD_USER, async (messageEvent) => {
    const message   = messageEvent.getMessage();
    const users     = await USERS_SETTINGS.get();
    const cuelistName = "My first Cuelist"

    let data = {
        name:message,
        selectedCueList: cuelistName,
        cuelist: [
            {
                cuelistName: cuelistName,
                cues: [
                    {
                        title: "Your First Cue",
                        timecode: "10:00:00"
                    }
                ]
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

WebSocketService.onEvent(EVENTS.DELETE_USER, async (messageEvent) => {
    const name      = messageEvent.getMessage();
    const users     = await USERS_SETTINGS.get()
    let deleteIndex;
    let index=0;

    try {
        users.userName.forEach(async function (arrayItem) {
          if (arrayItem.name.toLowerCase() === name.toLowerCase()) {
            deleteIndex = index;
          }
          index++;
        });

        users.userName.splice(deleteIndex,1);
        await USERS_SETTINGS.write(users);
      } catch (error) {
          console.log(error);
      }


});