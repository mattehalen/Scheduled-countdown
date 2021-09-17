var express = require('express');
var router = express.Router();

const AdminSettings   = require('./../services/admin-settings');
const USERS_SETTINGS  = require("./../services/users-settings"); 
const WebSocketService = require('./../websocket/websocket-service');
const SCModule = require("../websocket-listeners/SC-module/service");




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
router.get('/Countdown/getCountDown', async function (req, res) {
  let adminSettingsData = await AdminSettings.getDbSettings();
  const CountDown = await SCModule.countDown()
  // console.log(CountDown)

  res.json(CountDown)
});

// router.get('/watch', async function (req, res) {
//   res.render('watch', {
//     title: 'Scheduled-CountDown',
//     now: "s"
//   });
// });

router.get('/users/:userID', async function (req, res) {
  const db_settings   = await AdminSettings.getDbSettings();
  const users = await USERS_SETTINGS.get()
  var name = req.originalUrl.split('/users/')[1];
  let cuelist;

  if(users.userName){
    users.userName.forEach(function (arrayItem) {
      console.log(arrayItem.name);
      if (arrayItem.name.toLowerCase() === name.toLowerCase()) {

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
  }
  if(!users.userName){
    console.log("THIS THIS PRINT BEFORE THE CRASH !!!!")

  }


});
router.post('/users/submit/:userID', async function (req, res) {
  var name = req.originalUrl.split('/users/submit/')[1];
  console.log("----------> = "+name);


  try {
    const users = await USERS_SETTINGS.get()
    const data = JSON.parse(JSON.stringify(req.body));
    console.log(data);
    const newCueListArray=[];

  //---------- the - 1 here in T is for the added SelectedCuelist in the form that dosnt need to be in the loop
    var t = (Object.keys(data).length - 1) / 2;
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


        const indexPos = arrayItem.cuelist.findIndex(({
          cuelistName
        }) => cuelistName === data.SelectedCuelist);

        // console.log(indexPos);
        // console.log(arrayItem.cuelist[indexPos].cues);
        // console.log(newCueListArray);

        newCueListArray.sort(function (a, b) {
          return a.timecode.localeCompare(b.timecode);
        });


        arrayItem.cuelist[indexPos].cues = newCueListArray;
        await USERS_SETTINGS.write(users)
      }
    });
    
  } catch (error) {
    console.log(error);
  }
  res.redirect('back');
});

router.post('/users/selectedsuelist/:userID', async function (req, res) {
  var name = req.originalUrl.split('/users/selectedsuelist/')[1];
  console.log("----------> = "+name);
  try {
    const users = await USERS_SETTINGS.get()
    const data = JSON.parse(JSON.stringify(req.body));
    console.log(data)


    users.userName.forEach(async function (arrayItem) {
      if (arrayItem.name.toLowerCase() === name.toLowerCase()) {
        console.log("Inside forEach")
        console.log(arrayItem)
        // console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-")
        // console.log(arrayItem.cuelist[0])
        // console.log("-----------------------------------------------")
        // console.log(arrayItem.cuelist[data.selectedsuelist])
        // console.log(arrayItem.cuelist[data.selectedsuelist].cuelistName)
        let cuelistName = arrayItem.cuelist[data.selectedsuelist].cuelistName
        let selectedCueList = arrayItem.selectedCueList

        console.log(arrayItem.selectedCueList)
        arrayItem.selectedCueList = cuelistName
        console.log(arrayItem.selectedCueList)


        // const indexPos = arrayItem.cuelist.findIndex(({
        //   cuelistName
        // }) => cuelistName === data.SelectedCuelist);

        // console.log(indexPos);
        // console.log(arrayItem.cuelist[indexPos].cues);
        // console.log(newCueListArray);

        // newCueListArray.sort(function (a, b) {
        //   return a.timecode.localeCompare(b.timecode);
        // });


        // arrayItem.cuelist[indexPos].cues = newCueListArray;
        // await USERS_SETTINGS.write(users)
      }
    });
    
  } catch (error) {
    console.log(error);
  }
});


const EVENTS = {
  ADDNEWCUEROW:                     "AddNewCueRow",
  SEND_DELETE_CUEBUTTON_TO_SOCKET:  "send_Delete_CueButton_To_Socket",
  SELECTEDCUELIST:                  "selectedCueList",
  ADDNEWCUELIST:                    "addNewCuelist",
  LOADCUELIST:                      "loadCuelist",
  OVERWRITECUELIST:                 "overwriteCuelist",
  DELETECUELIST:                    "deleteCuelist",
  ADDNEWCUEFROMEXCEL:               "AddNewCueFromExcel"
};
WebSocketService.onEvent(EVENTS.ADDNEWCUEROW, async (messageEvent) => {
  const key     = messageEvent.getKey();
  const message = messageEvent.getMessage();
  const users = await USERS_SETTINGS.get()
  var name = message.user;
  var selectedCuelist = message.selectedCuelist
  var data = { title: 'Added Cue', timecode: '10:00:00' };

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
WebSocketService.onEvent(EVENTS.ADDNEWCUEFROMEXCEL, async (messageEvent) => {

console.log("---------->>> ADDNEWCUEFROMEXCEL ")
  const key     = messageEvent.getKey();
  const message = messageEvent.getMessage();
  const users = await USERS_SETTINGS.get()
  var name = message.user;
  var selectedCuelist = message.selectedCuelist
  var data = message.excelItems

  try {
    users.userName.forEach(async function (arrayItem) {
    
      if (arrayItem.name.toLowerCase() === name.toLowerCase()) {
        console.log("---------->>>  "+ selectedCuelist);
        const foundCuelist = arrayItem.cuelist.find(({cuelistName}) => cuelistName === selectedCuelist);
        console.log(foundCuelist);
        data.forEach(async function (excelItem){
          console.log("---------->>>>");
          console.log(excelItem[0]);
          var title = excelItem[0]
          var pushData = { title: title, timecode: '10:00:00' };
          foundCuelist.cues.push(pushData);
        })
        // foundCuelist.cues.push(data);
        console.log(foundCuelist);
        console.log(foundCuelist.cues);
      //   foundCuelist.cues.sort(function (a, b) {
      //     return a.timecode.localeCompare(b.timecode);
      // });
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
        const indexPos = arrayItem.cuelist.findIndex(({
          cuelistName
        }) => cuelistName === message.selectedCuelist);
        console.log("----------> > > CUE DELETE Button");
        //console.log(indexPos);
        console.log(arrayItem.cuelist);
        console.log(arrayItem.cuelist[indexPos]);

        arrayItem.cuelist[indexPos].cues.splice(listIndex,1);
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

        if (arrayItem.cuelist.some(e => e.cuelistName === message.newCuelistName)) {
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
// LOADCUELIST
WebSocketService.onEvent(EVENTS.LOADCUELIST, async (messageEvent) => {
  const key     = messageEvent.getKey();
  const message = messageEvent.getMessage();
  const users = await USERS_SETTINGS.get()
  var name = message.user;
  var cuelistDropdown_input = message.cuelistDropdown_input
  console.log("---------- > > > "+cuelistDropdown_input);

  try {
    users.userName.forEach(async function (arrayItem) {
    
      if (arrayItem.name.toLowerCase() === name.toLowerCase()) {

        arrayItem.selectedCueList = cuelistDropdown_input;
        await USERS_SETTINGS.write(users);
      }
    });
  } catch (error) {
      console.log(error);
  }
});
// OVERWRITECUELIST
WebSocketService.onEvent(EVENTS.DELETECUELIST, async (messageEvent) => {
  const key = messageEvent.getKey();
  const message = messageEvent.getMessage();
  const users = await USERS_SETTINGS.get()
  var name = message.user;
  var cuelistDropdown_input = message.cuelistDropdown_input;

  console.log(message);

  try {
    users.userName.forEach(async function (arrayItem) {

      if (arrayItem.name.toLowerCase() === name.toLowerCase()) {

        // console.log("---------->>> DELETECUELIST  " + cuelistDropdown_input);
        // console.log(arrayItem.cuelist.findIndex(({cuelistName}) => cuelistName === message.cuelistDropdown_input));
        const indexPos = arrayItem.cuelist.findIndex(({
          cuelistName
        }) => cuelistName === message.cuelistDropdown_input);

        if (arrayItem.cuelist.some(e => e.cuelistName === cuelistDropdown_input)) {
          if (message.selectedCuelist === cuelistDropdown_input) {

            arrayItem.cuelist.splice(indexPos, 1)
            arrayItem.selectedCueList = arrayItem.cuelist[0].cuelistName;

          } else {
            arrayItem.cuelist.splice(indexPos, 1)
          }
        }

        arrayItem.cuelist.sort(function (a, b) {
          return a.cuelistName.localeCompare(b.cuelistName);
        });

        await USERS_SETTINGS.write(users);

      }
    });
  } catch (error) {
    console.log(error);
  }
});



//-------------------------------------------------------------------------
// Celebration Page
//-------------------------------------------------------------------------
router.get('/celebration', async function (req, res) {
  res.render('celebration', {
    title: 'Scheduled-CountDown'
  });
});
router.post('/celebrationList/submit', function (req, res) {
  console.log("----------> celebrationList/submit");
  console.log(req.body);
  let tableNr = req.body.tableNr;
  let name = req.body.name;
  let reason = req.body.reason;
  let years = req.body.years;
  let info = req.body.info;
  console.log(tableNr);
  console.log(name);
  console.log(reason);
  console.log(years);
  console.log(info);

  try {
    
  } catch (error) {
    console.log(error);
  }
  res.redirect('back');
});


module.exports = router;