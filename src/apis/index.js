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
      res.render('users', {
        title: 'Scheduled-CountDown',
        now: "s",
        name: name,
        cuelist: arrayItem.cues,
        settings: db_settings
      });
    }
  });
});
router.post('/users/submit/:userID', async function (req, res) {
  // console.log("User Save button presed");
  // console.log(req.body);
  var name = req.originalUrl.split('/users/submit/')[1];
  console.log("----------> = "+name);
  


  try {
    const db_times = await AdminSettings.get();
    const db_settings = await AdminSettings.getDbSettings();
    const users = await USERS_SETTINGS.get()
    const data = JSON.parse(JSON.stringify(req.body));
    const entries = Object.entries(data)
    const tempArray = [];
    const newCueListArray=[];
    // console.log(typeof(data));

    // for (const [title, value] of entries) {
    //   tempArray.push(value)
    // }
    // tempArray.forEach(element => {
    //   let a_obj = {title : tempArray [0],timecode : tempArray[1]};
    //   newCueListArray.push(a_obj);
    //   tempArray.splice(0, 2); 
    // });
    // console.log(newCueListArray);


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
      // console.log(arrayItem.name);
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
  ADDNEWCUEROW:       'AddNewCueRow'
};
WebSocketService.onEvent(EVENTS.ADDNEWCUEROW, async (messageEvent) => {
  const key     = messageEvent.getKey();
  const message = messageEvent.getMessage();
  const users = await USERS_SETTINGS.get()
  var name = message.user;
  var data = { title: 'Added Cue', timecode: '00:00:11' };

  try {
    users.userName.forEach(async function (arrayItem) {
      if (arrayItem.name.toLowerCase() === name.toLowerCase()) {
        arrayItem.cues.push(data);

        arrayItem.cues.sort(function (a, b) {
          return a.timecode.localeCompare(b.timecode);
      });


        await USERS_SETTINGS.write(users);
        
      }
    });
  } catch (error) {
      console.log(error);
  }


  // // To send data back to UI client.
  // messageEvent.sendToClient('key', 'some-data');

  // // To broadcast message to all UI clients.
  // messageEvent.broadcastToAll('key', 'some-data');

  // // To broadcast message to all UI clients.
  // WebSocketService.broadcastToAll('key', 'some-data');
});




module.exports = router;
