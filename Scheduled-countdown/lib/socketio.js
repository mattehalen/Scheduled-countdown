//--------------------------------------------------
//---------- Strings and times in ms ----------
// What do i need to get to get everything to work?
// -[X] nowClock in String and in ms
// -[] startTime from String to ms
// -[] cueStartTime in string and ms
// -[] cueLength from string to ms
//--------------------------------------------------



var scheduledTimes = require('../public/scheduledTimes.json');
var scheduledTimesBackup = require('../public/scheduledTimes-backup.json');
const fs = require('fs');
var startTitleArray = [];
var startTimeArray = [];
var cueLengthArray  = [];
var offsetTimeInit = [];
var ip = require("ip");
// const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

//--from Script.js
var offsetTimeInit  = 0;
var myArray         = "";
var scheduledTimesArrayGlobal = [];
var scheduledTimesArray       = [];
var scheduledTimesArraylength = 0;
var offsetTimejson            = [];
//--------------------------------------------------
// - Variables & Booleans
//--------------------------------------------------
var countDown             = 7; // how many minutes before
countDown                 = countDown *60000; // convert to Ms
var countUp               = 5; // how many minutes after
countUp                   = countUp *60000; // convert to M
var offsetTime            = 0;

var startTimeAt           = "";
var startTimeArray        = [""];
var startTitleArray       = [""];
var startTimeIndex        = 0;

var cueStartTimeAt        = "";
var cueStartTimeInMs      = "";
var cueStartTimeOffset    = "";
var cueTimeInMs           = 0;
var cueLengthArray        = [""];
var cueLengthArrayIndex   = 0;
var cueLengthInMs         = 0;

var nowInMs = 0;
var startTimeInMs = 0;

var displayTimeBool = false;
var positiveDiffTimeBoole = false;

var displayCueTimeBool = false;
var positiveDiffCueTimeBoole = false;

var sendMin_To_countDownBoole = 0;

var fiveMinuteString = "";
var fiveMinuteInMs = 5 *60000;
var fiveMinuteFromMsToTime = 0;

var setTimeoutTime = 150;
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
var newArrayIndex = 0;
var startTitleTextFromnewArrayIndex = "";
var startTitleHolder = "";
var startTimeTextHolder = "";
var cueLengthTextHolder = "";

var serverNewDate = "";
var serverNowInMs = "";

// New text
var centerTextContent = "";




//--------------------------------------------------
//-----getscheduledTimes
//--------------------------------------------------
function getscheduledTimes(){
  const fs = require('fs')
  function jsonReader(filePath, cb) {
      fs.readFile(filePath, (err, fileData) => {
          if (err) {
              return cb && cb(err)
          }
          try {
              const object = JSON.parse(fileData)
              return cb && cb(null, object)
          } catch(err) {
              return cb && cb(err)
          }
      })
  }

  jsonReader('./public/scheduledTimes.json', (err, customer) => {
    if (err) {
        console.log('Error reading file:',err)
        return
    }
    scheduledTimesArray = customer;
    scheduledTimesArraylength = customer.profiles.length;

    for(let i=0; i < customer.profiles.length; i++) {startTitleArray[i] = customer.profiles[i].title}
    for(let i=0; i < customer.profiles.length; i++) {startTimeArray[i] = customer.profiles[i].startTime}
    for(let i=0; i < customer.profiles.length; i++) {cueLengthArray[i] = customer.profiles[i].cueLength};

  // fs.writeFile('./public/scheduledTimes.json', JSON.stringify(customer, null,4), (err) => {
  //       if (err) console.log('Error writing file:', err)
  //   })
  })
};
getscheduledTimes();
//--------------------------------------------------
//--------------------------------------------------
//-----updateScheduledTimesjson
//--------------------------------------------------
function updateScheduledTimesjson(){
  console.log("startTitleArray: "+startTitleArray);
  const fs = require('fs')
  function jsonReader(filePath, cb) {
      fs.readFile(filePath, (err, fileData) => {
          if (err) {
              return cb && cb(err)
          }
          try {
              const object = JSON.parse(fileData)
              return cb && cb(null, object)
          } catch(err) {
              return cb && cb(err)
          }
      })
  }

  jsonReader('./public/scheduledTimes.json', (err, customer) => {
    if (err) {
      console.log('Error reading file:', err)
      return
    }

    if (customer.profiles.length > startTitleArray.length) {
      console.log("-------------------------------------------------------------");
      var a = customer.profiles.length - 1;
      customer.profiles.splice(a, 1);
      console.log("startTitleArray.length: " + a);
      console.log(customer.profiles);

      for (let i = 0; i < customer.profiles.length; i++) {
        customer.profiles[i].title = startTitleArray[i]
      }
      for (let i = 0; i < customer.profiles.length; i++) {
        customer.profiles[i].startTime = startTimeArray[i]
      }
      for (let i = 0; i < customer.profiles.length; i++) {
        customer.profiles[i].cueLength = cueLengthArray[i]
      };


    } else {
      for (let i = 0; i < customer.profiles.length; i++) {
        customer.profiles[i].title = startTitleArray[i]
      }
      for (let i = 0; i < customer.profiles.length; i++) {
        customer.profiles[i].startTime = startTimeArray[i]
      }
      for (let i = 0; i < customer.profiles.length; i++) {
        customer.profiles[i].cueLength = cueLengthArray[i]
      };
    }

    customer.profiles.sort(function(a, b) {
      return a.startTime.localeCompare(b.startTime);
    });

    fs.writeFile('./public/scheduledTimes.json', JSON.stringify(customer, null, 4), (err) => {
      if (err) console.log('Error writing file:', err)
    })
  })
};
//--------------------------------------------------
//--------------------------------------------------
//-----offsetPlus button press
//--------------------------------------------------
function updateOffsetTimePlusjson(){
  const fs = require('fs')
  function jsonReader(filePath, cb) {
      fs.readFile(filePath, (err, fileData) => {
          if (err) {
              return cb && cb(err)
          }
          try {
              const object = JSON.parse(fileData)
              return cb && cb(null, object)
          } catch(err) {
              return cb && cb(err)
          }
      })
  }
  jsonReader('./public/variables.json', (err, variables) => {
    if (err) {
        console.log('Error reading file:',err)
        return
    }

    variables.offsetTime += 1;
    // console.log("updateOffsetTimejson: ");
    // console.log(variables);

  fs.writeFile('./public/variables.json', JSON.stringify(variables, null,4), (err) => {
        if (err) console.log('Error writing file:', err)
    })
  })

};
//--------------------------------------------------
//--------------------------------------------------
//-----offsetMinus button press
//--------------------------------------------------
function updateOffsetTimeMinusjson(){
  const fs = require('fs')
  function jsonReader(filePath, cb) {
      fs.readFile(filePath, (err, fileData) => {
          if (err) {
              return cb && cb(err)
          }
          try {
              const object = JSON.parse(fileData)
              return cb && cb(null, object)
          } catch(err) {
              return cb && cb(err)
          }
      })
  }
  jsonReader('./public/variables.json', (err, variables) => {
    if (err) {
        console.log('Error reading file:',err)
        return
    }

    variables.offsetTime -= 1;
    // console.log("updateOffsetTimejson: ");
    // console.log(variables);

  fs.writeFile('./public/variables.json', JSON.stringify(variables, null,4), (err) => {
        if (err) console.log('Error writing file:', err)
    })
  })

};
//--------------------------------------------------
//--------------------------------------------------
//-----offsetReset button press
//--------------------------------------------------
function updateOffsetTimeResetjson(){
  const fs = require('fs')
  function jsonReader(filePath, cb) {
      fs.readFile(filePath, (err, fileData) => {
          if (err) {
              return cb && cb(err)
          }
          try {
              const object = JSON.parse(fileData)
              return cb && cb(null, object)
          } catch(err) {
              return cb && cb(err)
          }
      })
  }
  jsonReader('./public/variables.json', (err, variables) => {
    if (err) {
        console.log('Error reading file:',err)
        return
    }

    variables.offsetTime = 0;
    // console.log("updateOffsetTimejson: ");
    // console.log(variables);

  fs.writeFile('./public/variables.json', JSON.stringify(variables, null,4), (err) => {
        if (err) console.log('Error writing file:', err)
    })
  })

};
//--------------------------------------------------
//loadDefaultjson();
function loadDefaultjson(){
  getscheduledTimes();
  const fs = require('fs')
  fs.writeFile('./public/scheduledTimes.json', JSON.stringify(scheduledTimesBackup, null, 4), (err) => {
      if (err) throw err;
  });
};
//--------------------------------------------------
//loadDefaultjson();
function writeDefaultjson(){
  //console.log("startTitleArray: "+startTitleArray);
  const fs = require('fs')
  function jsonReader(filePath, cb) {
      fs.readFile(filePath, (err, fileData) => {
          if (err) {
              return cb && cb(err)
          }
          try {
              const object = JSON.parse(fileData)
              return cb && cb(null, object)
          } catch(err) {
              return cb && cb(err)
          }
      })
  }

  jsonReader('./public/scheduledTimes.json', (err, customer) => {
    if (err) {
        console.log('Error reading file:',err)
        return
    }

    //console.log("startTitleArray: "+ startTitleArray);
  fs.writeFile('./public/scheduledTimes-backup.json', JSON.stringify(customer, null,4), (err) => {
        if (err) console.log('Error writing file:', err)
    })
  })
  };
//--------------------------------------------------


//--------------------------------------------------
//-----getOffsetTimejson button press
//--------------------------------------------------
function getOffsetTimejson(){
  var a
  const fs = require('fs')
  function jsonReader(filePath, cb) {
      fs.readFile(filePath, (err, fileData) => {
          if (err) {
              return cb && cb(err)
          }
          try {
              const object = JSON.parse(fileData)
              return cb && cb(null, object)
          } catch(err) {
              return cb && cb(err)
          }
      })
  }
  jsonReader('./public/variables.json', (err, variables) => {
    if (err) {
        console.log('Error reading file:',err)
        return
    }
    //console.log("updateOffsetTimejson: fdsafdsafdsafas ");
    offsetTimejson = variables.offsetTime;
    console.log("offsetTimejson: "+offsetTimejson);

  // fs.writeFile('./public/variables.json', JSON.stringify(variables, null,4), (err) => {
  //       if (err) console.log('Error writing file:', err)
  //   })
  })
  return
 };
getOffsetTimejson();
//--------------------------------------------------


//--------------------------------------------------
//-----addNewRowDefault button press
//--------------------------------------------------
function addNewRowDefault(){
  console.log("addNewRowDefault knappen funkar");
  var addString = "";

  fs.readFile("./public/scheduledTimes.json", function (err, data) {
    var json = JSON.parse(data);
    var feed = {title: "New row added", startTime: "12:00", cueLength: "00:01:10"};

    json.profiles.push(feed);
      console.log("addNewRowDefault: "+JSON.stringify(json, null, 4));
    json.profiles.sort(function(a, b) {
      return a.startTime.localeCompare(b.startTime);
    });
    addString = JSON.stringify(json, null, 4);
    console.log("addNewRowDefault: "+JSON.stringify(json, null, 4));

    });

    sleep(1000).then(() => {
      fs.writeFile('./public/scheduledTimes.json', addString , (err) => {
          if (err) throw err;
      });
    });
};
//-------------------------------------------------------------------------




/* @description: This file contains server side socket.io code.
 * Using socketio with nodejs

 * Emit and receive events.

* @author: http://programmerblog.net

*/
var socket_io = require('socket.io');
var io       = socket_io();
var socketio = {};
socketio.io  = io;
var users = [];

 io.on('connection', function(socket){
    console.log('A user connected');

    // My sockets
    //--------------------------------------------------
    socket.on("start", function(data){
      io.emit("updatingDB");
    });

    socket.on("sendDB_To_Socket", function (data) {
      console.log("sendDB_To_Socket:"+ JSON.stringify(data) )
      io.emit("sendDB_TO_Main", {socketDBArray:data});
      io.emit("sendDB_TO_Admin", {socketDBArray:data});
    });
    //--------------------------------------------------
    socket.on("writeToScheduledTimesjson", function (data){
        console.log("writeToScheduledTimesjson");
      startTitleArray = data.startTitleArray;
      startTimeArray  = data.startTimeArray;
      cueLengthArray  = data.cueLengthArray;
      updateScheduledTimesjson();

    });
    //--------------------------------------------------
    socket.on("updateScheduledTimesArray", function(data){
      console.log("updateScheduledTimesArray: " + data.startTimeArray);
      io.emit("updateDB_From_Socket",{
        startTitleArray: startTitleArray,
        startTimeArray: startTimeArray,
        cueLengthArray: cueLengthArray
      });
    });
    //--------------------------------------------------
    socket.on("updateOffsetTimePlus", function(data){
      console.log("updateOffsetTime: " + data.offsetTime);
      offsetTimeInit = data.offsetTime;
      console.log(offsetTimeInit);
      updateOffsetTimePlusjson();
      io.emit("updateOffsetTime_From_Socket",{offsetTime: offsetTimeInit});
    });
    //--------------------------------------------------
    socket.on("updateOffsetTimeMinus", function(data){
      console.log("updateOffsetTimeMinus: " + data.offsetTime);
      offsetTimeInit = data.offsetTime;
      console.log(offsetTimeInit);
      updateOffsetTimeMinusjson();
      io.emit("updateOffsetTime_From_Socket",{offsetTime: offsetTimeInit});
    });
    //--------------------------------------------------
    socket.on("updateOffsetTimeReset", function(data){
      console.log("updateOffsetTimeReset: " + data.offsetTime);
      offsetTimeInit = data.offsetTime;
      console.log(offsetTimeInit);
      updateOffsetTimeResetjson();
      io.emit("updateOffsetTime_From_Socket",{offsetTime: offsetTimeInit});
    });
    //--------------------------------------------------
    socket.on("loadDefaultToSocket", function(data){
      console.log("loadDefaultToSocket: " + data.message);
      loadDefaultjson();

      sleep(10).then(() => {
        io.emit("pushGetscheduledTimes",{offsetTime: offsetTimeInit});
        io.emit("loadDefault_From_Socket",{offsetTime: offsetTimeInit});
        });

    });
    //--------------------------------------------------
    socket.on("writeDefaultToSocket", function(data){
      console.log("writeDefaultToSocket: " + data.startTimeArray);

       startTimeArray   = data.startTimeArray;
       startTitleArray  = data.startTitleArray;
       cueLengthArray   = data.cueLengthArray;

      writeDefaultjson();
    });
    //--------------------------------------------------
    socket.on("fiveMinPageLoad_To_Socket", function (data){
        console.log("fiveMinPageLoad_To_Socket: "+data);
        console.log(data.countDownTime);
        io.emit("sendMin_To_countDown",{
           countDownTime: data
         });
    });
    socket.on("fiveMinPageStart", function (data){

    });

    socket.on("updatebutton_To_Socket", function(data){
      io.emit("updatebutton_From_Socket",{})
    })

    socket.on("sortingButton_To_Socket",function(data){
      io.emit("sortingButton_From_Socket",{})
    })

    socket.on("send_Delete_Button_To_Socket",function(data){
      listIndex = data.listIndex
      console.log("send_Delete_Button_To_Socket: listIndex= "+listIndex);
      io.emit("send_Delete_Button_from_Socket",{
        listIndex: listIndex
      })
    })

    socket.on("send_addNewRow_To_Socket",function(data){
      console.log("send_addNewRow_To_Socket:");
      addNewRowDefault();
    })

 });

//--------------------------------------------------
//----Can i delete this?
//--------------------------------------------------
 function pad(n, z) {
   z = z || 2;
   return ('00' + n).slice(-z);
 }
//--------------------------------------------------
 function msToTime(s) {
   var ms = s % 1000;
   s = (s - ms) / 1000;
   var secs = s % 60;
   s = (s - secs) / 60;
   var mins = s % 60;
   var hrs = (s - mins) / 60;

   if (displayTimeBool === true) {
     if (positiveDiffTimeBoole === true) {
       var text = ('' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs));
       console.log("msToTime:"+ text);
       //startText.textContent = ('' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs));
     } else {
       var text = ('-' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs));
       console.log(text);
       //startText.textContent = ('-' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs));
     }
   }
   fiveMinuteFromMsToTime = mins;

   return hrs + ':' + mins + ':' + secs + '.' + ms;
 }
//--------------------------------------------------
 //--------------------------------------------------
 //- CurrentTime
 //--------------------------------------------------
 var setTimeoutTime = 150;
 function nowClock() {
   //console.log("hello");
   var d = new Date();
   nowInMs = d.getTime();
   var s = "";
   s += (10 > d.getHours  () ? "0": "") + d.getHours  () + ":";
   s += (10 > d.getMinutes() ? "0": "") + d.getMinutes() + ":";
   s += (10 > d.getSeconds() ? "0": "") + d.getSeconds();

   // nowText.textContent = s;
   // nowTopRow.textContent = s;
   //console.log("nowClock: "+s);
   io.emit("nowClock",{
     nowClock: s,
     serverNewDate: d,
     serverNowInMs:nowInMs
   });
   //setTimeout(nowClock, setTimeoutTime - d.getTime() % 1000 + 20);
   setTimeout(nowClock, setTimeoutTime);
   return s;
 }
 nowClock();
 //--------------------------------------------------
 //--------------------------------------------------
 //- startTime
 //--------------------------------------------------
 function startTime() {
   //OLD--------------------------------------------------
   var d = new Date();
   //var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${startTimeTextHolder}`);

   var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${startTimeArray}`);
   var  startTimeInMs = dd.getTime();
        startTimeInMs = startTimeInMs + (offsetTimeInit*60000);

   var dInMs = d.getTime();
   var ddInMs =dd.getTime();
   ddInMs = ddInMs+(offsetTimeInit*60000)
   var s = "";

   if (ddInMs > dInMs) {
     s = ddInMs - dInMs + 1000;
     msToTime(s);
     positiveDiffTimeBoole = false;
   } else {
     s = dInMs - ddInMs;
     msToTime(s);
     positiveDiffTimeBoole = true;
   }

   if (nowInMs > (startTimeInMs - countDown) && nowInMs < (startTimeInMs + countUp)) {
     displayTimeBool = true;
   } else {
     displayTimeBool = false;
   }


   io.emit("startTime",{
     startTimeInMs: startTimeInMs,
     serverNewDate: d,
     serverNowInMs: nowInMs,
   });

   setTimeout(startTime, setTimeoutTime - d.getTime() % 1000 + 20);

 }
 startTime();
 //--------------------------------------------------

 function newTimeArraySorting(){
 //--------------------------------------------------
 //---Get next title / StartTime / cueLength
 //--------------------------------------------------
     sleep(500).then(() => {
        if (newArrayIndex < scheduledTimesArraylength) {
          var time = scheduledTimesArray.profiles[newArrayIndex].startTime
          var timInMs = 0;

         var d = new Date();
         var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${time}`);

         if (nowInMs > (dd.getTime()+countUp)) {
           newArrayIndex++;
         } else {
           startTitleHolder = scheduledTimesArray.profiles[newArrayIndex].title;
           startTimeTextHolder = scheduledTimesArray.profiles[newArrayIndex].startTime;
           cueLengthTextHolder = scheduledTimesArray.profiles[newArrayIndex].cueLength;

           //console.log("startTitleHolder: " + startTitleHolder + " | " + "startTimeTextHolder: " + startTimeTextHolder + " | " + "cueLengthTextHolder: " + cueLengthTextHolder);
         }
        };
     });
 //--------------------------------------------------
   setTimeout(newTimeArraySorting, setTimeoutTime);
 };
 newTimeArraySorting();
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
function newOffsetTime(){
  var offsetTime = offsetTimejson;
  if (typeof offsetTime === "number") {
    offsetTime = offsetTimejson;
  }else {
    offsetTime = 0;
  }
  offsetTime *=1000*60
  return offsetTime
};
newOffsetTime();

function newCurrentTime(){
  var d = new Date();
  var dInMs= d.getTime()

  var s = "";
    s += (10 > d.getHours  () ? "0": "") + d.getHours  () + ":";
    s += (10 > d.getMinutes() ? "0": "") + d.getMinutes() + ":";
    s += (10 > d.getSeconds() ? "0": "") + d.getSeconds();

  return s
};
function newCurrentTimeInMs(){
  var d = new Date();
  var dInMs= d.getTime()

  return dInMs
};

function newStartTimeInMs(time){
  //console.log(newOffsetTime());
  var d = new Date();
  var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${time}`);
  var ddInMs = dd.getTime()

  return ddInMs
};
function newStartTime(time){
  var d = new Date();
  var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${time}`);
  var ddInMs = dd.getTime()

  var s = "";
    s += (10 > dd.getHours  () ? "0": "") + dd.getHours  () + ":";
    s += (10 > dd.getMinutes() ? "0": "") + dd.getMinutes() + ":";
    s += (10 > dd.getSeconds() ? "0": "") + dd.getSeconds();

  return s

  return ddInMs
};


function newCountDown(){
  var time = "";
  var offsetTime = newOffsetTime();
  var now = newCurrentTimeInMs();
  var startTime = newStartTimeInMs(startTimeTextHolder);
      startTime += offsetTime;

  if ( now > startTime) {
    time = now-startTime
    time = (msToTime(time))
  }else {
    time = startTime-now
    time = "-"+(msToTime(time))
  }

  setTimeout(newCountDown, 250);
  return time
};
newCountDown();

function timeStringToMs(t){
  if (t > 5 ){
    var r = Number(t.split(':')[0])*(60*60000)+Number(t.split(':')[1])*(60000)+Number(t.split(':')[2])*(1000);
  }else{
    t = t+":00"
    var r = Number(t.split(':')[0])*(60*60000)+Number(t.split(':')[1])*(60000)+Number(t.split(':')[2])*(1000);
  }
return r;

  }
function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
  }
function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }

function sendCenterText(){
  var countDownString = newCountDown();
  var now = newCurrentTimeInMs();
  var start = newStartTimeInMs(startTimeTextHolder);
  var offset = newOffsetTime();

  if (
    now > ((start+offset) - countDown) &&
    now < ((start+offset) + countUp)
        ) {
    var showNowClock = false;
  }else {
    var showNowClock = true;
  }
  //console.log(newStartTimeInMs(startTimeTextHolder)-newCurrentTimeInMs(),);
  io.emit("centerTextContent",{
    countDownString: countDownString,
    countDownTimeInMS:newStartTimeInMs(startTimeTextHolder)-newCurrentTimeInMs(),
    showNowClock:showNowClock,
    newCurrentTime: newCurrentTime(),
    startTitleHolder:startTitleHolder,
    offsetTimeInit:newOffsetTime()
  });
  setTimeout(sendCenterText, 200);
};
sendCenterText();


module.exports = socketio;
