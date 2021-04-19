var express = require('express');
var router = express.Router();

const AdminSettings   = require('./../services/admin-settings');
const USERS_SETTINGS  = require("./../services/users-settings"); 
const WebSocketService = require('./../websocket/websocket-service');




//-------------------------------------------------------------------------
// Initial Page
//-------------------------------------------------------------------------
router.get('/', async function (req, res) {
  res.render('index', {
    title: 'Scheduled-CountDown',
    now: "s"
  });
});

//-------------------------------------------------------------------------
// Stage Page
//-------------------------------------------------------------------------
router.get('/stage', async function (req, res) {
  res.render('stage', {
    title: 'Scheduled-CountDown',
    now: "s"
  });
});

//-------------------------------------------------------------------------
// FOH Page
//-------------------------------------------------------------------------
router.get('/foh', async function (req, res) {
  res.render('foh', {
    title: 'Scheduled-CountDown',
    now: "s"
  });
});

//-------------------------------------------------------------------------
// Countdown Page
//-------------------------------------------------------------------------
router.get('/Countdown', async function (req, res) {
  let adminSettingsData = await AdminSettings.getDbSettings();
  res.render('Countdown', {
    title: 'Countdown',
    now: "now",
    offsetTime: adminSettingsData.timeSettings.offsetTime
  });
});

router.get('/watch', async function (req, res) {
  res.render('watch', {
    title: 'Scheduled-CountDown',
    now: "s"
  });
});

router.get('/users/:userID', async function (req, res) {
  const db_settings   = await AdminSettings.getDbSettings();
  const users = await USERS_SETTINGS.get()
  var name = req.originalUrl.split('/users/')[1];
  let cuelist;

  users.userName.forEach(function (arrayItem) {
    // console.log(arrayItem.name);
    if (arrayItem.name.toLowerCase() === name.toLowerCase()) {
      // console.log(arrayItem.name);
      // console.log(arrayItem.cues);
      //console.log(arrayItem.cuelist.findIndex(({cuelistName}) => cuelistName === arrayItem.selectedCueList));
      res.render('users', {
        title: 'Scheduled-CountDown',
        now: "s",
        name: name,
        cuelist: arrayItem.cuelist,
        cues: arrayItem.cues,
        selectedCueList:arrayItem.selectedCueList,
        selectedCueListIndex:arrayItem.cuelist.findIndex(({cuelistName}) => cuelistName === arrayItem.selectedCueList),
        settings: db_settings
      });
    }
  });
});
router.post('/users/submit/:userID', async function (req, res) {
  var name = req.originalUrl.split('/users/submit/')[1];
  console.log("----------> = "+name);

  try {
    const users = await USERS_SETTINGS.get()
    const data = JSON.parse(JSON.stringify(req.body));
    const newCueListArray=[];

    var t = Object.keys(data).length / 2;
    for(var x=0; x < t ; x++){
      const title = data[`title${x}`];
      const timecode = data[`timeCode${x}`]
      newCueListArray.push({
        title,
        timecode
      })
    }
    console.log(newCueListArray);

    users.userName.forEach(async function (arrayItem) {
      if (arrayItem.name.toLowerCase() === name.toLowerCase()) {
        console.log(arrayItem.cues);
        arrayItem.cues = newCueListArray;
        await USERS_SETTINGS.write(users)
      }
    });
    
  } catch (error) {
    console.log(error);
  }
  res.redirect('back');
});


const EVENTS = {
  ADDNEWCUEROW:                     "AddNewCueRow",
  SEND_DELETE_CUEBUTTON_TO_SOCKET:  "send_Delete_CueButton_To_Socket",
  SELECTEDCUELIST:                  "selectedCueList",
  ADDNEWCUELIST:                    "addNewCuelist",
  LOADCUELIST:                      "loadCuelist",
  OVERWRITECUELIST:                 "overwriteCuelist",
  DELETECUELIST:                    "deleteCuelist"
};
WebSocketService.onEvent(EVENTS.ADDNEWCUEROW, async (messageEvent) => {
  const key     = messageEvent.getKey();
  const message = messageEvent.getMessage();
  const users = await USERS_SETTINGS.get()
  var name = message.user;
  var selectedCuelist = message.selectedCuelist
  var data = { title: 'Added Cue', timecode: '00:00:11' };

  try {
    users.userName.forEach(async function (arrayItem) {
    
      if (arrayItem.name.toLowerCase() === name.toLowerCase()) {
        console.log("---------->>>  "+ selectedCuelist);
        const foundCuelist = arrayItem.cuelist.find(({cuelistName}) => cuelistName === selectedCuelist);
        foundCuelist.cues.push(data);
        foundCuelist.cues.sort(function (a, b) {
          return a.timecode.localeCompare(b.timecode);
      });
        await USERS_SETTINGS.write(users);
      }
    });
  } catch (error) {
      console.log(error);
  }
});
WebSocketService.onEvent(EVENTS.SEND_DELETE_CUEBUTTON_TO_SOCKET, async (messageEvent) => {
  const key     = messageEvent.getKey();
  const message = messageEvent.getMessage();
  const users = await USERS_SETTINGS.get()
  var name = message.user;
  var listIndex = message.listIndex;

  try {
    users.userName.forEach(async function (arrayItem) {
      if (arrayItem.name.toLowerCase() === name.toLowerCase()) {
        arrayItem.cues.splice(listIndex,1);
        await USERS_SETTINGS.write(users);
      }
    });
  } catch (error) {
      console.log(error);
  }
});
WebSocketService.onEvent(EVENTS.SELECTEDCUELIST, async (messageEvent) => {
  const key     = messageEvent.getKey();
  const message = messageEvent.getMessage();
  const users = await USERS_SETTINGS.get()
  var name = message.user;
  var selectedCuelist = message.selectedCuelist

  try {
    users.userName.forEach(async function (arrayItem) {
    
      if (arrayItem.name.toLowerCase() === name.toLowerCase()) {
        console.log("---------->>>  "+ selectedCuelist);
        console.log(arrayItem.selectedCueList);
        arrayItem.selectedCueList = selectedCuelist;
        console.log("after");
        console.log(arrayItem.selectedCueList);
        await USERS_SETTINGS.write(users);
      }
    });
  } catch (error) {
      console.log(error);
  }
});
//--------------------------------------------------
WebSocketService.onEvent(EVENTS.ADDNEWCUELIST, async (messageEvent) => {
  const key = messageEvent.getKey();
  const message = messageEvent.getMessage();
  const users = await USERS_SETTINGS.get()
  var name = message.user;
  var selectedCuelist = message.selectedCuelist;
  var data = {
    title: 'Added Cue',
    timecode: '00:00:11'
  };

  console.log(message);

  try {
    users.userName.forEach(async function (arrayItem) {

      if (arrayItem.name.toLowerCase() === name.toLowerCase()) {

        console.log("---------->>> ADDNEWCUELIST  " + selectedCuelist);
        console.log(arrayItem.cuelist);
        console.log("----------> > > TEST THIS VALUE");

        if (arrayItem.cuelist.some(e => e.cuelistName === 'Cuelist')) {
        } else {
          arrayItem.cuelist.push({
            "cuelistName": message.newCuelistName,
            "cues": [data]
          })
          arrayItem.cuelist.sort(function (a, b) {
            return a.cuelistName.localeCompare(b.cuelistName);
          });

        }

        await USERS_SETTINGS.write(users);

      }
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;