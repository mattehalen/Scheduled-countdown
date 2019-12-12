"use strict";

var myLocalip = document.getElementById("myLocalip").textContent;
var myLocalipAndPort = myLocalip+":3000"
console.log(myLocalipAndPort);



var nowText = document.getElementById("now");
var nowTopRow = document.getElementById("nowTopRow");
var titleText = document.getElementById("title");
var startText = document.getElementById("start");
var fiveMinuteText = document.getElementById("5minute");
var cueTimeText = document.getElementById("cueTime");
var offsetTime = document.getElementById("offsetTime");
var offsetTimeInit = 0;
var myArray = "";
var scheduledTimesArrayGlobal = [];
var scheduledTimesArray = [];
var offsetTimejson = [];
//--------------------------------------------------
// - Variables & Booleans
//--------------------------------------------------
var countDown = 7; // how many minutes before
countDown = countDown *60000; // convert to Ms
var countUp = 5; // how many minutes after
countUp = countUp *60000; // convert to M
var offsetTime = 0;

var startTimeAt     = "";
var startTimeArray  = [""];
var startTitleArray = [""];
var startTimeIndex  = 0;

var cueStartTimeAt  = "";
var cueStartTimeInMs = "";
var cueStartTimeOffset = "";
var cueTimeInMs = 0;
var cueLengthArray = [""];
var cueLengthArrayIndex = 0;
var cueLengthInMs = 0;

var nowInMs = 0;
var startTimeInMs = 0;

var displayTimeBool = false;
var positiveDiffTimeBoole = false;
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


//--------------------------------------------------
// - getScheduledTimes
//--------------------------------------------------
function getscheduledTimes(){
  const request = async () => {
      const response = await fetch('/scheduledTimes.json');
      const json = await response.json();
      scheduledTimesArray = json;

      var i;
      var a;
      var b;
      var c;
      startTimeArray  = [];
      startTitleArray = [];
      cueLengthArray  = [];

      for (i = 0; i < scheduledTimesArray.profiles.length; i++) {
        a = scheduledTimesArray.profiles[i].title;
        startTitleArray.push(a);
        b = scheduledTimesArray.profiles[i].startTime;
        startTimeArray.push(b);
        c = scheduledTimesArray.profiles[i].cueLength;
        cueLengthArray.push(c);
      }
      console.log("cueLengthArray: from getscheduledTimes");
      console.log(cueLengthArray);
  }

  request();
};
getscheduledTimes();
//--------------------------------------------------

//--------------------------------------------------
// - getOffsetTime
//--------------------------------------------------
function getOffsetTime(){
  const request = async () => {
      const response = await fetch('/variables.json');
      const json = await response.json();
      offsetTimejson = json;
      //console.log("Get offsetTime: "+offsetTimejson.offsetTime);
      offsetTimeInit = offsetTimejson.offsetTime;

  }

  request();
};
getOffsetTime();
//--------------------------------------------------

//--------------------------------------------------
//- timeArray
//--------------------------------------------------
function timeArray() {
  //--------------------------------------------------
  if (nowInMs > (startTimeInMs - countDown) && nowInMs < (startTimeInMs + countUp)) {
    var countDownTimeInMS = startTimeInMs - nowInMs;
    //console.log(countDownTimeInMS);
    //console.log(5*1000*60);
    //titleText.textContent = startTitleArray[startTimeIndex-1];
    titleText.textContent = startTitleTextFromnewArrayIndex;


    // Audio Alarms
    //--------------------------------------------------
    var timeBuffer    = 1*1000
    var sixMinuteMs  = (6*1000*60);
    var fiveMinuteMs  = (5*1000*60);
    var fourMinuteMs  = (4*1000*60);
    var threeMinuteMs = (3*1000*60);
    var twoMinuteMs   = (2*1000*60);
    var oneMinuteMs   = (1*1000*60);

    //  6larm
    if (countDownTimeInMS > sixMinuteMs && countDownTimeInMS < (sixMinuteMs + timeBuffer)) {
      document.getElementById('musiclong6').play();
    }
    // 5min Alarm
    if (countDownTimeInMS > fiveMinuteMs && countDownTimeInMS < (fiveMinuteMs + timeBuffer)) {
      document.getElementById('music5').play();

      if (sendMin_To_countDownBoole != 5){
        sendMin_To_countDownBoole = 5;
        socket.emit("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});

      };
    }
    // 4min Alarm
    if (countDownTimeInMS > fourMinuteMs && countDownTimeInMS < (fourMinuteMs + timeBuffer)) {
      document.getElementById('musiclong4').play();

      if (sendMin_To_countDownBoole != 4){
        sendMin_To_countDownBoole = 4;
        socket.emit("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});
      };
    }
    // 3min Alarm
    if (countDownTimeInMS > threeMinuteMs && countDownTimeInMS < (threeMinuteMs + timeBuffer)) {
      document.getElementById('music3').play();

      if (sendMin_To_countDownBoole != 3){
        sendMin_To_countDownBoole = 3;
        socket.emit("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});

      };
    }
    // 2min Alarm
    if (countDownTimeInMS > twoMinuteMs && countDownTimeInMS < (twoMinuteMs + timeBuffer)) {
      document.getElementById('musiclong2').play();

      if (sendMin_To_countDownBoole != 2){
        sendMin_To_countDownBoole = 2;
        socket.emit("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});

      };
    }
    // 1min Alarm
    if (countDownTimeInMS > oneMinuteMs && countDownTimeInMS < (oneMinuteMs + timeBuffer)) {
      document.getElementById('music1').play();

      if (sendMin_To_countDownBoole != 1){
        sendMin_To_countDownBoole = 1;
        socket.emit("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});

      };
    }
    //--------------------------------------------------
    hideNowClock();
    //console.log("sendMin_To_countDownBoole: "+sendMin_To_countDownBoole);

  } else {
        new ShowNowClock();
        sendMin_To_countDownBoole = 0;



        if (startTimeIndex  >= startTimeArray.length) {
          startTimeIndex    = 0;
        }

        startTimeArray[startTimeIndex];
        startTimeAt = startTimeArray[startTimeIndex];
        startTimeIndex++;

        startText.textContent = ("");
        titleText.textContent = ("");
      }

  setTimeout(timeArray, setTimeoutTime);
}
//--------------------------------------------------

// //--------------------------------------------------
// //- cueTimeArray
// //--------------------------------------------------
// function cueTimeArray() {
//   //--------------------------------------------------
//   if (nowInMs > (cueStartTimeInMs - countDown) && nowInMs < (cueStartTimeInMs + countUp)) {
//     var countDownCueTimeInMS = cueStartTimeInMs - nowInMs;
//     //cueTimeText.textContent = s;
//   } else {
//         if (cueLengthArrayIndex  >= cueLengthArray.length) {
//           cueLengthArrayIndex    = 0;
//         }
//
//         cueLengthArray[cueLengthArrayIndex];
//         cueStartTimeAt = cueLengthArray[cueLengthArrayIndex];
//         cueLengthArrayIndex++;
//       }
//
//       //console.log(cueStartTimeInMs);
//   cueTimeText.textContent =cueStartTimeAt +" | "+ new Date();
//   setTimeout(cueTimeArray, setTimeoutTime);
// }
// //--------------------------------------------------



//--------------------------------------------------
//- CurrentTime
//--------------------------------------------------
function nowClock() {
  //console.log("hello");
  var d = new Date();
  nowInMs = d.getTime();
  var s = "";
  s += (10 > d.getHours  () ? "0": "") + d.getHours  () + ":";
  s += (10 > d.getMinutes() ? "0": "") + d.getMinutes() + ":";
  s += (10 > d.getSeconds() ? "0": "") + d.getSeconds();

  nowText.textContent = s;
  nowTopRow.textContent = s;
  setTimeout(nowClock, setTimeoutTime - d.getTime() % 1000 + 20);
  return d;

}
//--------------------------------------------------




//--------------------------------------------------
//- 5minute CountDown
//--------------------------------------------------
function fiveMinuteCountDown () {
  // console.log("startTimeInMs: "+ startTimeInMs);
  // console.log(nowInMs > (startTimeInMs - fiveMinuteInMs) && nowInMs < (startTimeInMs));
  if (nowInMs > (startTimeInMs - fiveMinuteInMs) && nowInMs < (startTimeInMs)) {
    fiveMinuteString = fiveMinuteFromMsToTime +1 + " min to show";
    fiveMinuteText.textContent = fiveMinuteString;

  } else {
    fiveMinuteText.textContent = ""
  }
  setTimeout(fiveMinuteCountDown, setTimeoutTime);
}
//--------------------------------------------------


// Format String from H:M:S to HH:MM:SS
function pad(n, z) {
  z = z || 2;
  return ('00' + n).slice(-z);
}

function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  if (displayTimeBool === true) {
    if (positiveDiffTimeBoole === true) {
      startText.textContent = ('' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs));
    } else {
      startText.textContent = ('-' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs));
    }
  }
  fiveMinuteFromMsToTime = mins;

  return hrs + ':' + mins + ':' + secs + '.' + ms;
}

function msToCueTime(s) {
  console.log("msToCueTime");
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;
  var mathias = 0;

  if (displayTimeBool === true) {
    if (positiveDiffTimeBoole === true) {
      cueTimeText.textContent = ('' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs));
      console.log(mathias);
    } else {
      cueTimeText.textContent = ('-' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs));
      console.log(mathias);
    }
  }
  //fiveMinuteFromMsToTime = mins;

  return hrs + ':' + mins + ':' + secs + '.' + ms;
}

//--------------------------------------------------
//- Convert Cue String to ms
//--------------------------------------------------
function timeStringToMs(t){
  var r = Number(t.split(':')[0])*(60*60000)+Number(t.split(':')[1])*(60000)+Number(t.split(':')[2])*(1000);
return r;

}
//--------------------------------------------------


//--------------------------------------------------
//- CueStartTime
//--------------------------------------------------
function cueStartTime() {

  cueLengthInMs = timeStringToMs(cueLengthTextHolder);
  cueStartTimeInMs = startTimeInMs - cueLengthInMs;
  var cueStartCountDown = cueStartTimeInMs - nowInMs;
  var cueStartTimeAt = new Date(cueStartTimeInMs);


  var d = new Date();
  var dd = new Date(cueStartTimeInMs);

  var dInMs = d.getTime();
  var ddInMs =dd.getTime();
  //ddInMs = ddInMs+(offsetTimeInit*60000)
  var s = "";


  // Use subtrack time depending on now(d) vs start(dd) time
  //if (dd > d) {
  if (ddInMs > dInMs) {

    //s = dd - d + 1000;
    s = ddInMs - dInMs + 1000;
    //s = s + (offsetTimeInit*60000)
    //msToCueTime(s);
    positiveDiffTimeBoole = false;
    console.log(msToCueTime(s));
  } else {
    //s = d - dd;
    s = dInMs - ddInMs;
    //  s = s + (offsetTimeInit*60000)
    //msToTime(s);
    positiveDiffTimeBoole = true;
    console.log(msToCueTime(s));
  }



  var msg = "";

msg += "startTimeInMs: "+startTimeInMs +"\n";
msg += "startTimeInMs: "+startTimeInMs +"\n";
msg += "cueLengthInMs: "+cueLengthInMs +"\n";
msg += "cueStartTimeAt: "+cueStartTimeAt +"\n";
msg += "s: "+s;
  //console.log("startTimeInMs: "+startTimeInMs+" | "+ "cueLengthInMs: "+cueLengthInMs+" | "+ "cueStartTimeInMs: "+cueStartTimeInMs);
  //console.log(msg);



  // cueStartTimeOffset = timeStringToMs(cueLengthArray[startTimeIndex - 1]);
  // var cueStartTimeWithOffset = cueStartTimeInMs - cueStartTimeOffset;
  // var cueStartCountDown = cueStartTimeWithOffset - nowInMs;
  //
  // var ddd = new Date(cueStartTimeAt);
  //
  // var s = "";
  // s += (10 > ddd.getHours() ? "0" : "") + ddd.getHours() + ":";
  // s += (10 > ddd.getMinutes() ? "0" : "") + ddd.getMinutes() + ":";
  // s += (10 > ddd.getSeconds() ? "0" : "") + ddd.getSeconds();
  //
  // if (nowInMs > (cueStartTimeAt - countDown) && nowInMs < (cueStartTimeAt + countUp)) {
  //   console.log("okej det kanske funkar?");
  //   // cueTimeText.textContent = s;
  // } else {
  //   // cueTimeText.textContent = "OutSide";
  // }

  setTimeout(cueStartTime, setTimeoutTime);
  //return dd;

}
//--------------------------------------------------

function startTime() {
  //console.log("startTimeInMs from startTime: " + startTimeInMs);
  //console.log(startTimeAt + ":" + offsetTimeInit + ":" + (startTimeAt+offsetTimeInit));

  //
  //OLD--------------------------------------------------
  var d = new Date();
  var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${startTimeTextHolder}`);
  //var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${startTimeAt}`);
  startTimeInMs = dd.getTime();
  startTimeInMs = startTimeInMs + (offsetTimeInit*60000);

  var dInMs = d.getTime();
  var ddInMs =dd.getTime();
  ddInMs = ddInMs+(offsetTimeInit*60000)
  var s = "";


  // Use subtrack time depending on now(d) vs start(dd) time
  //if (dd > d) {
  if (ddInMs > dInMs) {
    //s = dd - d + 1000;
    s = ddInMs - dInMs + 1000;
    //s = s + (offsetTimeInit*60000)
    msToTime(s);
    positiveDiffTimeBoole = false;
  } else {
    //s = d - dd;
    s = dInMs - ddInMs;
    //  s = s + (offsetTimeInit*60000)
    msToTime(s);
    positiveDiffTimeBoole = true;
  }


  if (nowInMs > (startTimeInMs - countDown) && nowInMs < (startTimeInMs + countUp)) {
    displayTimeBool = true;
  } else {
    displayTimeBool = false;
  }

  setTimeout(startTime, setTimeoutTime - d.getTime() % 1000 + 20);

}

function addOffsetTime() {
  offsetTimeInit = offsetTimeInit +1;
  document.getElementById("offsetTime").textContent = offsetTimeInit;
}

function subOffsetTime() {
  offsetTimeInit = offsetTimeInit -1;
  document.getElementById("offsetTime").textContent = offsetTimeInit;
}

function hideAdmin() {
  document.getElementById("adminPage").style.display = "none";
}
function showAdmin() {
  document.getElementById("adminPage").style.display = "block";
}

function hideNowClock() {
  document.getElementById("centerNowText").style.display = "none";
  document.getElementById("titleContentBox").style.display = "block";
}
function ShowNowClock() {
  document.getElementById("centerNowText").style.display = "block";
  document.getElementById("titleContentBox").style.display = "none";
}

function toggleMainContentBox() {

  if (!$('#mainContentBox').is(':visible')) {
    document.getElementById("mainContentBox").style.display = "block";
    document.getElementById("adminContentBox").style.display = "none";
  } else {
    document.getElementById("mainContentBox").style.display = "none";
    document.getElementById("adminContentBox").style.display = "block";
  }
}


//--------------------------------------------------
// Auto Open Fullscreen
//--------------------------------------------------
var elem = document.documentElement;
function openFullscreen() {

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
    elem.webkitRequestFullscreen();
  }
}
//--------------------------------------------------


function newTimeArraySorting(){
//--------------------------------------------------
//---Get next title / StartTime / cueLength
//--------------------------------------------------
    sleep(500).then(() => {
      if (newArrayIndex < scheduledTimesArray.profiles.length) {
        var time = scheduledTimesArray.profiles[newArrayIndex].startTime
        var timInMs = 0;

        var d = new Date();
        var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${time}`);
        //console.log(nowInMs > dd.getTime());

        if (nowInMs > dd.getTime()) {
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






nowClock();
startTime();
timeArray();
//cueTimeArray();
fiveMinuteCountDown();
cueStartTime();




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


var socket = io.connect(myLocalipAndPort);

//---------- My sockets NOT IN USE???
socket.on("updateDB_From_Socket", function(data) {
  console.log("updateDB_From_Socket: Hello Here i am");
  startTitleArray = data.startTitleArray;
  startTimeArray  = data.startTimeArray;
  cueLengthArray  = data.cueLengthArray;

  startTimeInMs = 0;
  startTimeAt = null;
  startTimeIndex = 0;

  startPlayback();

});


socket.on("updateOffsetTime_From_Socket", function(data) {
  console.log("updateOffsetTime_From_Socket: "+data.offsetTime);
  offsetTimeInit = data.offsetTime
});
//--------------------------------------------------

     socket.on('user disconnected', function (data) {
        $("#"+data.username).remove();
     });

//--------------------------------------------------
var playButton = document.querySelector('#play');
playButton.hidden = false;

function startPlayback() {
  return document.querySelector('.countDownSound').play();
  playButton.hidden = true;
}

//console.log('Attempting to play automatically...');
startPlayback().then(function() {
  //console.log('The play() Promise fulfilled! Rock on!');
}).catch(function(error) {
  //console.log('The play() Promise rejected!');
  //console.log('Use the Play button instead.');
  console.log(error);
  // The user interaction requirement is met if
  // playback is triggered via a click event.
  playButton.addEventListener('click', startPlayback);
});

// BUTTON PUSH
$("#play").on('click', function () {
  playButton.hidden = true;
});
