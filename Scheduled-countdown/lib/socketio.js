// var scheduledTimes = require('../public/scheduledTimes.json');
var scheduledTimesBackup = require('../public/scheduledTimes-backup.json');
var myip = require('../public/myip.json');
//var ip = require("ip");
const fs = require('fs');
var startTimeArray = [""];
var startTitleHolder = "";
var startTitleArray = [""];
var startTimeTextHolder = "";
var cueLengthArray = [""];
var cueLengthTextHolder = "";
var offsetTimeInit = [];
//--- newly added BOOLS
var cueBoolArray = [""];
var cueBoolHolder = "";

var fiveBoolArray = [""];
var fiveBoolHolder = [""];
var sendMin_To_countDownBoole = 100;

//--------------------------------------------------
//--from Script.js
var offsetTimeInit = 0;
var scheduledTimesArray = [];
var scheduledTimesArraylength = 0;
var offsetTimejson = [];
//--------------------------------------------------
var countDown = 7; // how many minutes before
countDown = countDown * 60000; // convert to Ms
var countUp = 2; // how many minutes after
countUp = countUp * 60000; // convert to M
var offsetTime = 0;

var nowInMs = 0;
var setTimeoutTime = 150;
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
var newArrayIndex = 0;

var serverNewDate = "";
var serverNowInMs = "";

var centerTextContent = "";
var myIpArray = "";
var getNetworkIPs = (function() {
  var ignoreRE = /^(127\.0\.0\.1|::1|fe80(:1)?::1(%.*)?)$/i;

  var exec = require('child_process').exec;
  var cached;
  var command;
  var filterRE;

  switch (process.platform) {
    case 'win32':
      //case 'win64': // TODO: test
      command = 'ipconfig';
      filterRE = /\bIPv[46][^:\r\n]+:\s*([^\s]+)/g;
      break;
    case 'darwin':
      command = 'ifconfig';
      filterRE = /\binet\s+([^\s]+)/g;
      // filterRE = /\binet6\s+([^\s]+)/g; // IPv6
      break;
    default:
      command = 'ifconfig';
      filterRE = /\binet\b[^:]+:\s*([^\s]+)/g;
      // filterRE = /\binet6[^:]+:\s*([^\s]+)/g; // IPv6
      break;
  }

  return function(callback, bypassCache) {
    if (cached && !bypassCache) {
      callback(null, cached);
      return;
    }
    // system call
    exec(command, function(error, stdout, sterr) {
      cached = [];
      var ip;
      var matches = stdout.match(filterRE) || [];
      //if (!error) {
      for (var i = 0; i < matches.length; i++) {
        ip = matches[i].replace(filterRE, '$1')
        if (!ignoreRE.test(ip)) {
          cached.push(ip);
        }
      }
      //}
      callback(error, cached);
    });
  };
})();
getNetworkIPs(function(error, ip) {
  myIpArray = ip
  console.log("Log All ips from Socket", myIpArray);

  if (error) {
    console.log('error:', error);
  }
}, false);

// MIDI

var smpteString;
var smpteMs;

function mtcTOString() {
  var JZZ = require('jzz');
  var port = JZZ().openMidiIn(1);
  var smpte = JZZ.SMPTE();
  console.log(JZZ.info());
  port
    .connect(function(msg) {
      smpte.read(msg);
      smpteString = smpte.toString();
      smpteMs     = timeStringToMs(smpteString);
    });
};
mtcTOString();
//-------------------------------------------------------------------------
function jsonReader(filePath, cb) {
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      return cb && cb(err)
    }
    try {
      const object = JSON.parse(fileData)
      return cb && cb(null, object)
    } catch (err) {
      return cb && cb(err)
    }
  })
}

function updateScheduledTimesjson() {
  jsonReader('./public/scheduledTimes.json', (err, customer) => {
    if (err) {
      console.log('Error reading file:', err)
      return
    }

    if (customer.profiles.length > startTitleArray.length) {
      var a = customer.profiles.length - 1;
      customer.profiles.splice(a, 1);

      for (let i = 0; i < customer.profiles.length; i++) {
        customer.profiles[i].title = startTitleArray[i]
      }
      for (let i = 0; i < customer.profiles.length; i++) {
        customer.profiles[i].startTime = startTimeArray[i]
      }
      for (let i = 0; i < customer.profiles.length; i++) {
        customer.profiles[i].cueLength = cueLengthArray[i]
      }
      for (let i = 0; i < customer.profiles.length; i++) {
        customer.profiles[i].cueBool = cueBoolArray[i]
      }
      for (let i = 0; i < customer.profiles.length; i++) {
        customer.profiles[i].fiveBool = fiveBoolArray[i]
      }

    } else {

      for (let i = 0; i < customer.profiles.length; i++) {
        customer.profiles[i].title = startTitleArray[i]
      }
      for (let i = 0; i < customer.profiles.length; i++) {
        customer.profiles[i].startTime = startTimeArray[i]
      }
      for (let i = 0; i < customer.profiles.length; i++) {
        customer.profiles[i].cueLength = cueLengthArray[i]
      }
      for (let i = 0; i < customer.profiles.length; i++) {
        customer.profiles[i].cueBool = cueBoolArray[i]
      }
      for (let i = 0; i < customer.profiles.length; i++) {
        customer.profiles[i].fiveBool = fiveBoolArray[i]
      };

    };

    customer.profiles.sort(function(a, b) {
      return a.startTime.localeCompare(b.startTime);
    });

    fs.writeFile('./public/scheduledTimes.json', JSON.stringify(customer, null, 4), (err) => {
      if (err) console.log('Error writing file:', err)
    })
  })
};

function updateOffsetTimePlusjson() {


  jsonReader('./public/variables.json', (err, variables) => {
    if (err) {
      console.log('Error reading file:', err)
      return
    }

    variables.offsetTime += 1;
    // console.log("updateOffsetTimejson: ");
    // console.log(variables);

    fs.writeFile('./public/variables.json', JSON.stringify(variables, null, 4), (err) => {
      if (err) console.log('Error writing file:', err)
    })
  })


};
function updateOffsetTimeMinusjson() {


  jsonReader('./public/variables.json', (err, variables) => {
    if (err) {
      console.log('Error reading file:', err)
      return
    }

    variables.offsetTime -= 1;
    // console.log("updateOffsetTimejson: ");
    // console.log(variables);

    fs.writeFile('./public/variables.json', JSON.stringify(variables, null, 4), (err) => {
      if (err) console.log('Error writing file:', err)
    })
  })

};
function updateOffsetTimeResetjson() {


  jsonReader('./public/variables.json', (err, variables) => {
    if (err) {
      console.log('Error reading file:', err)
      return
    }

    variables.offsetTime = 0;
    // console.log("updateOffsetTimejson: ");
    // console.log(variables);
    sleep(1000).then(() => {
      fs.writeFile('./public/variables.json', JSON.stringify(variables, null, 4), (err) => {
        if (err) console.log('Error writing file:', err)
      })
    });

  })

};

function loadDefaultjson() {
  getscheduledTimes();

  fs.writeFile('./public/scheduledTimes.json', JSON.stringify(scheduledTimesBackup, null, 4), (err) => {
    if (err) throw err;
  });
};
function writeDefaultjson() {
  jsonReader('./public/scheduledTimes.json', (err, customer) => {
    if (err) {
      console.log('Error reading file:', err)
      return
    }
    fs.writeFile('./public/scheduledTimes-backup.json', JSON.stringify(customer, null, 4), (err) => {
      if (err) console.log('Error writing file:', err)
    })
  })
};

function getOffsetTimejson() {
  jsonReader('./public/variables.json', (err, variables) => {
    if (err) {
      console.log('Error reading file:', err)
      return
    }
    offsetTimejson = variables.offsetTime;
  })
  return
};

function addNewRowDefault() {
  console.log("addNewRowDefault knappen funkar");
  var addString = "";

  fs.readFile("./public/scheduledTimes.json", function(err, data) {
    var json = JSON.parse(data);
    var feed = {
      title: "New row added",
      startTime: "12:00",
      cueLength: "00:01:10"
    };

    json.profiles.push(feed);
    console.log("addNewRowDefault: " + JSON.stringify(json, null, 4));
    json.profiles.sort(function(a, b) {
      return a.startTime.localeCompare(b.startTime);
    });
    addString = JSON.stringify(json, null, 4);
    console.log("addNewRowDefault: " + JSON.stringify(json, null, 4));

  });

  sleep(1000).then(() => {
    fs.writeFile('./public/scheduledTimes.json', addString, (err) => {
      if (err) throw err;
    });
  });
};
getOffsetTimejson();

function getscheduledTimes() {


  console.log("--------------------> Socket getscheduledTimes <--------------------  "+newCurrentTime());
  jsonReader('./public/scheduledTimes.json', (err, customer) => {
    if (err) {
      console.log('Error reading file:', err)
      return
    }
    scheduledTimesArray = customer;
    scheduledTimesArraylength = customer.profiles.length;

    for (let i = 0; i < customer.profiles.length; i++) {
      startTitleArray[i] = customer.profiles[i].title
    }
    for (let i = 0; i < customer.profiles.length; i++) {
      startTimeArray[i] = customer.profiles[i].startTime
    }
    for (let i = 0; i < customer.profiles.length; i++) {
      cueLengthArray[i] = customer.profiles[i].cueLength
    }
    for (let i = 0; i < customer.profiles.length; i++) {
      cueBoolArray[i] = customer.profiles[i].cueBool
    }
    for (let i = 0; i < customer.profiles.length; i++) {
      fiveBoolArray[i] = customer.profiles[i].fiveBool
    }

  })
};
getscheduledTimes();

//-------------------------------------------------------------------------

var socket_io = require('socket.io');
var io = socket_io();
var socketio = {};
socketio.io = io;
var users = [];

io.on('connection', function(socket) {

  console.log('A user connected = '+socket.handshake.address);

  // My sockets
  //--------------------------------------------------
  socket.on("start", function(data) {
    io.emit("updatingDB");
  });
  socket.on("user", function(data) {
    checkIfUserExist(data.user);

  });

  socket.on("getTimeCode", function(data) {
    io.emit("sendTimeCode", {
      smpteString: smpteString,
      smpteMs: smpteMs
    });
    //mtcTOString();
  });

  socket.on("sendDB_To_Socket", function(data) {
    //console.log("sendDB_To_Socket:"+ JSON.stringify(data) )
    io.emit("sendDB_TO_Main", {
      socketDBArray: data
    });
    io.emit("sendDB_TO_Admin", {
      socketDBArray: data
    });
  });
  //--------------------------------------------------
  socket.on("writeToScheduledTimesjson", function(data) {
    console.log("--------------------> writeToScheduledTimesjson <--------------------");
    startTitleArray = data.startTitleArray;
    startTimeArray = data.startTimeArray;
    cueLengthArray = data.cueLengthArray;
    cueBoolArray = data.cueBoolArray;
    fiveBoolArray = data.fiveBoolArray;

    // console.log(fiveBoolArray);

    updateScheduledTimesjson();

  });
  //--------------------------------------------------
  socket.on("updateScheduledTimesArray", function(data) {
    console.log("--------------------> updateScheduledTimesArray <--------------------");
    io.emit("updateDB_From_Socket", {
      startTitleArray: startTitleArray,
      startTimeArray: startTimeArray,
      cueLengthArray: cueLengthArray,
      cueBoolArray: cueBoolArray,
      fiveBoolArray: fiveBoolArray
    });
  });
  //--------------------------------------------------
  socket.on("updateOffsetTimePlus", function(data) {
    console.log("updateOffsetTime: " + data.offsetTime);
    offsetTimeInit = data.offsetTime;
    console.log(offsetTimeInit);
    updateOffsetTimePlusjson();
    io.emit("updateOffsetTime_From_Socket", {
      offsetTime: offsetTimeInit
    });
  });
  //--------------------------------------------------
  socket.on("updateOffsetTimeMinus", function(data) {
    console.log("updateOffsetTimeMinus: " + data.offsetTime);
    offsetTimeInit = data.offsetTime;
    console.log(offsetTimeInit);
    updateOffsetTimeMinusjson();
    io.emit("updateOffsetTime_From_Socket", {
      offsetTime: offsetTimeInit
    });
  });
  //--------------------------------------------------
  socket.on("updateOffsetTimeReset", function(data) {
    console.log("updateOffsetTimeReset: " + data.offsetTime);
    offsetTimeInit = data.offsetTime;
    console.log(offsetTimeInit);
    updateOffsetTimeResetjson();
    io.emit("updateOffsetTime_From_Socket", {
      offsetTime: offsetTimeInit
    });
  });
  //--------------------------------------------------
  socket.on("loadDefaultToSocket", function(data) {
    console.log("loadDefaultToSocket: " + data.message);
    loadDefaultjson();

    sleep(10).then(() => {
      io.emit("pushGetscheduledTimes", {
        offsetTime: offsetTimeInit
      });
      io.emit("loadDefault_From_Socket", {
        offsetTime: offsetTimeInit
      });
    });

  });
  //--------------------------------------------------
  socket.on("writeDefaultToSocket", function(data) {
    console.log("writeDefaultToSocket: " + data.startTimeArray);

    startTimeArray = data.startTimeArray;
    startTitleArray = data.startTitleArray;
    cueLengthArray = data.cueLengthArray;
    cueBoolArray = data.cueBoolArray;
    fiveBoolArray = data.fiveBoolArray;

    writeDefaultjson();
  });
  //--------------------------------------------------
  socket.on("fiveMinPageLoad_To_Socket", function(data) {
    // console.log(data.countDownTime);
    io.emit("sendMin_To_countDown", {
      countDownTime: data
    });
  });
  socket.on("fiveMinPageStart", function(data) {

  });

  socket.on("updatebutton_To_Socket", function(data) {
    io.emit("updatebutton_From_Socket", {})
  })

  socket.on("sortingButton_To_Socket", function(data) {
    io.emit("sortingButton_From_Socket", {})
  })

  socket.on("send_Delete_Button_To_Socket", function(data) {
    listIndex = data.listIndex
    console.log("send_Delete_Button_To_Socket: listIndex= " + listIndex);
    io.emit("send_Delete_Button_from_Socket", {
      listIndex: listIndex
    })
  })

  socket.on("send_addNewRow_To_Socket", function(data) {
    console.log("send_addNewRow_To_Socket:");
    addNewRowDefault();
  })

  io.emit("sendIpArrayToAdminPage", {
    myIpArray: myIpArray
  })
  //--------------------------------------------------
  socket.on("sendChosenIp_To_Socket", function(data) {
    console.log("sendChosenIp_To_Socket:-------------------------------- ", data.myChosenIp);

    //----------



    jsonReader('./public/myip.json', (err, customer) => {
      if (err) {
        console.log('Error reading file:', err)
        return
      }
      console.log("sendChosenIp_To_Socket: Customer");
      console.log(customer.myIp);
      customer.myIp = data.myChosenIp;


      fs.writeFile('./public/myip.json', JSON.stringify(customer, null, 4), (err) => {
        if (err) console.log('Error writing file:', err)
      })
    })



  })
  //--------------------------------------------------
  socket.on("reloadFiveMinCountDown", function(data) {
    console.log("reloadFiveMinCountDown");
    fiveBoolHolder=1;
    sendMin_To_countDownBoole=100;
    newCountDown();
    // io.emit("sendMin_To_countDown", {
    //   countDownTime: 0
    // });
  })
  socket.on("force5MinCountDownCase", function(data) {
    console.log("force5MinCountDownCase");
    //newCountDown();
    console.log(data.case);
    io.emit("sendMin_To_countDown", {
      countDownTime: data.case
    });
  })


});

//--------------------------------------------------
//- CurrentTime
//--------------------------------------------------

function newTimeArraySorting() {
  //--------------------------------------------------
  //---Get next title / StartTime / cueLength
  //--------------------------------------------------
  sleep(500).then(() => {
    if (newArrayIndex < scheduledTimesArraylength) {
      var time = scheduledTimesArray.profiles[newArrayIndex].startTime
      var timInMs = 0;

      var d = new Date();
      var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${time}`);

      if (nowInMs > ((dd.getTime() + newOffsetTime()) + countUp)) {
        newArrayIndex++;
      } else {
        startTitleHolder = scheduledTimesArray.profiles[newArrayIndex].title;
        startTimeTextHolder = scheduledTimesArray.profiles[newArrayIndex].startTime;
        cueLengthTextHolder = scheduledTimesArray.profiles[newArrayIndex].cueLength;

        cueBoolHolder = scheduledTimesArray.profiles[newArrayIndex].cueBool;
        fiveBoolHolder = scheduledTimesArray.profiles[newArrayIndex].fiveBool;

      }
    };
  });
  //--------------------------------------------------
  setTimeout(newTimeArraySorting, setTimeoutTime);
};
newTimeArraySorting();

function newOffsetTime() {
  var offsetTime = offsetTimejson;
  if (typeof offsetTime === "number") {
    offsetTime = offsetTimejson;
  } else {
    offsetTime = 0;
  }
  offsetTime *= 1000 * 60
  return offsetTime
};
newOffsetTime();

function newCurrentTime() {
  var d = new Date();
  var dInMs = d.getTime()
  nowInMs = d.getTime();
  var s = "";
  s += (10 > d.getHours() ? "0" : "") + d.getHours() + ":";
  s += (10 > d.getMinutes() ? "0" : "") + d.getMinutes() + ":";
  s += (10 > d.getSeconds() ? "0" : "") + d.getSeconds();

  return s
};

function newCurrentTimeInMs() {
  var d = new Date();
  var dInMs = d.getTime()

  return dInMs
};

function newStartTimeInMs(time) {
  //console.log(newOffsetTime());
  var d = new Date();
  var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${time}`);
  var ddInMs = dd.getTime()

  return ddInMs
};

function newStartTime(time) {
  var d = new Date();
  var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${time}`);
  var ddInMs = dd.getTime()

  var s = "";
  s += (10 > dd.getHours() ? "0" : "") + dd.getHours() + ":";
  s += (10 > dd.getMinutes() ? "0" : "") + dd.getMinutes() + ":";
  s += (10 > dd.getSeconds() ? "0" : "") + dd.getSeconds();

  return s

  return ddInMs
};

function newCountDown() {
  var time = "";
  var offsetTime = newOffsetTime();
  var now = newCurrentTimeInMs();
  var startTime = newStartTimeInMs(startTimeTextHolder);
  startTime += offsetTime;

  if (now > startTime) {
    time = now - startTime
    time = (msToTime(time))
  } else {
    time = startTime - now
    time = "-" + (msToTime(time))
  }

  //--------------------------------------------------
  var timeBuffer = 1 * 1000
  var sixMinuteMs = (6 * 1000 * 60);
  var fiveMinuteMs = (5 * 1000 * 60);
  var fourMinuteMs = (4 * 1000 * 60);
  var threeMinuteMs = (3 * 1000 * 60);
  var twoMinuteMs = (2 * 1000 * 60);
  var oneMinuteMs = (1 * 1000 * 60);
  var countDownTimeInMS = startTime - now;
  //console.log((msToTime(startTime - now)));

  //console.log(countDownTimeInMS);
  if (fiveBoolHolder==1) {
    //  6larm
    if (countDownTimeInMS > sixMinuteMs && countDownTimeInMS < (sixMinuteMs + timeBuffer)) {
      //if (countDownTimeInMS < sixMinuteMs && countDownTimeInMS > fiveMinuteMs) {
    }
    // 5min Alarm
    //if (countDownTimeInMS > fiveMinuteMs && countDownTimeInMS < (fiveMinuteMs + timeBuffer)) {
    if (countDownTimeInMS < fiveMinuteMs && countDownTimeInMS > fourMinuteMs) {
      if (sendMin_To_countDownBoole != 5) {
        sendMin_To_countDownBoole = 5;
        io.emit("sendMin_To_countDown", {
          countDownTime: 5
        });
      };
    }
    // 4min Alarm
    //if (countDownTimeInMS > fourMinuteMs && countDownTimeInMS < (fourMinuteMs + timeBuffer)) {
    if (countDownTimeInMS < fourMinuteMs && countDownTimeInMS > threeMinuteMs) {
      if (sendMin_To_countDownBoole != 4) {
        sendMin_To_countDownBoole = 4;
      io.emit("sendMin_To_countDown", {
        countDownTime: 4
      });
      };
    }
    // 3min Alarm
    //if (countDownTimeInMS > threeMinuteMs && countDownTimeInMS < (threeMinuteMs + timeBuffer)) {
    if (countDownTimeInMS < threeMinuteMs && countDownTimeInMS > twoMinuteMs) {
      if (sendMin_To_countDownBoole != 3) {
        sendMin_To_countDownBoole = 3;
      io.emit("sendMin_To_countDown", {
        countDownTime: 3
      });
    };
    }
    // 2min Alarm
    //if (countDownTimeInMS > twoMinuteMs && countDownTimeInMS < (twoMinuteMs + timeBuffer)) {
    if (countDownTimeInMS < twoMinuteMs && countDownTimeInMS > oneMinuteMs) {
      if (sendMin_To_countDownBoole != 2) {
        sendMin_To_countDownBoole = 2;
      io.emit("sendMin_To_countDown", {
        countDownTime: 2
      });
    };
    }
    // 1min Alarm
    //if (countDownTimeInMS > oneMinuteMs && countDownTimeInMS < (oneMinuteMs + timeBuffer)) {
    if (countDownTimeInMS < oneMinuteMs && countDownTimeInMS > 0) {
      if (sendMin_To_countDownBoole != 1) {
        sendMin_To_countDownBoole = 1;
      io.emit("sendMin_To_countDown", {
        countDownTime: 1
      });
    };
    }
    // 0min Alarm
    //if (countDownTimeInMS > 0 && countDownTimeInMS < (0 + timeBuffer)) {
    if (countDownTimeInMS < 0 || countDownTimeInMS > fiveMinuteMs) {
      if (sendMin_To_countDownBoole != 0) {
        sendMin_To_countDownBoole = 0;
      io.emit("sendMin_To_countDown", {
        countDownTime: 0
      });
    };
    }
  }


  if (fiveBoolHolder==0) {
    if (sendMin_To_countDownBoole != 0) {
      sendMin_To_countDownBoole = 0;
    io.emit("sendMin_To_countDown", {
      countDownTime: 0
    });
  };
  };
  //--------------------------------------------------




  // io.emit("sendMin_To_countDown", {
  //   countDownTime: now - startTime
  // });


  setTimeout(newCountDown, setTimeoutTime);
  return time
};
newCountDown();

function newCueCountDown() {
  var cueLength = cueLengthTextHolder;
  var cueBool = cueBoolHolder;
  //--------------------------------------------------
  if (cueLength.length > 5) {
    cueLength = timeStringToMs(cueLength);
  } else {
    cueLength = cueLength + ":00"
    cueLength = timeStringToMs(cueLength);
  }
  //--------------------------------------------------
  var offsetTime = newOffsetTime();
  var startTime = newStartTimeInMs(startTimeTextHolder);
  var cueStarTime = (startTime - cueLength)
  cueStarTime += offsetTime
  var now = newCurrentTimeInMs();
  var cueCountDownInMs;

  if (now > cueStarTime) {
    cueCountDownInMs = now - cueStarTime
    time = now - cueStarTime
    time = (msToTime(time))
  } else {
    cueCountDownInMs = cueStarTime - now
    time = cueStarTime - now
    time = "-" + (msToTime(time))
  }
  //--------------------------------------------------
  var textString = "";
  if (now > (cueStarTime - countDown) && now < (cueStarTime + (1000 * 60 * 2)) && cueBoolHolder == 1) {
    textString = "CUE - " + startTitleHolder + ": " + time
  } else {
    textString = ""
  }

  io.emit("getCueTimeString_From_Socket", {
    string: textString,
    newCurrentTimeInMs: cueStarTime - now,
    cueBoolHolder: cueBoolHolder
  });



  setTimeout(newCueCountDown, setTimeoutTime);
};
newCueCountDown();

function timeStringToMs(t) {
  if (t > 5) {
    var r = Number(t.split(':')[0]) * (60 * 60000) + Number(t.split(':')[1]) * (60000) + Number(t.split(':')[2]) * (1000);
  } else {
    t = t + ":00"
    var r = Number(t.split(':')[0]) * (60 * 60000) + Number(t.split(':')[1]) * (60000) + Number(t.split(':')[2]) * (1000);
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

function sendCenterText() {
  var countDownString = newCountDown();
  var now = newCurrentTimeInMs();
  var offset = newOffsetTime();
  var start = newStartTimeInMs(startTimeTextHolder) + offset;

  // autoResetOffsetTime
  //--------------------------------------------------
  if (now > (start + countUp) && now < (start + countUp + 500)) {
    console.log("autoResetOffsetTime");
    autoResetOffsetTime();
  };
  //--------------------------------------------------

  if (
    // now > ((start+offset) - countDown) &&
    // now < ((start+offset) + countUp)
    now > ((start) - countDown) &&
    now < ((start) + countUp)
  ) {
    var showNowClock = false;
  } else {
    var showNowClock = true;
  }
  //console.log(newStartTimeInMs(startTimeTextHolder)-newCurrentTimeInMs(),);
  io.emit("centerTextContent", {
    countDownString: countDownString,
    countDownTimeInMS: newStartTimeInMs(startTimeTextHolder) - newCurrentTimeInMs(),
    showNowClock: showNowClock,
    newCurrentTime: newCurrentTime(),
    startTitleHolder: startTitleHolder,
    offsetTimeInit: newOffsetTime()
  });
  setTimeout(sendCenterText, setTimeoutTime);
};
sendCenterText();

function autoResetOffsetTime() {
  sleep(1 * 6000).then(() => {
    console.log("autoResetOffsetTime");
    offsetTimeInit = 0;

    if (offsetTimeInit !== undefined){
      updateOffsetTimeResetjson();
      io.emit("updateOffsetTime_From_Socket", {
        offsetTime: offsetTimeInit
      });
    }else{console.log("offsetTimeInit = undefined - autoResetOffsetTime -"+ newCurrentTime());}

  });



};

function resetsetTimeout(){

  //---------
  sleep(1000*60*60).then(() => {
    console.log("----------> resetsetTimeout() <----------   "+newCurrentTime());
    fs.writeFile('./autoRestartServer.json', JSON.stringify("customer", null, 4), (err) => {
      if (err) console.log('Error writing file:', err)
    })


    // clearTimeout(newTimeArraySorting);
    // clearTimeout(newCountDown);
    // clearTimeout(newCueCountDown);
    // clearTimeout(sendCenterText);
  });
    //---------
    // newTimeArraySorting();
    // newCountDown();
    // newCueCountDown();
    // sendCenterText();
    //---------


  //setTimeout(resetsetTimeout,(1000*60*5))
};
resetsetTimeout();

function checkIfUserExist(user){
  console.log("checkIfUserExist + user  = " + user);
  const path = './public/CueLists/'+user+'.json'

  fs.access(path, fs.F_OK, (err) => {
    if (err) {
      fs.writeFile(path, JSON.stringify("customer", null, 4), (err) => {
        if (err) console.log('Error writing file:', err)
      })
      //console.error(err)
      return
    }
    console.log("FILE DO EXIST !!!!!");
    jsonReader(path, (err, cueList) => {
      if (err) {
        console.log('Error reading file:', err)
        return
      }
      console.log(cueList);
      io.emit("cueListFromSocket", {
        cueList: cueList
      });
    })





  })
};


module.exports = socketio;
