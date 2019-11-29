"use strict";
var nowText = document.getElementById("now");
var nowTopRow = document.getElementById("nowTopRow");
var titleText = document.getElementById("title");
var startText = document.getElementById("start");
var fiveMinuteText = document.getElementById("5minute");
var cueTimeText = document.getElementById("cueTime");
var offsetTime = document.getElementById("offsetTime");
var offsetTimeInit = 0;
var myArray = "";
var scheduledTimesArray = [];

//var scheduledTimes = require('../scheduledTimes.json');








//--------------------------------------------------
// - Variables & Booleans
//--------------------------------------------------
var countDown = 7; // how many minutes before
countDown = countDown *60000; // convert to Ms
var countUp = 5; // how many minutes after
countUp = countUp *60000; // convert to M
var offsetTime = 0;

var startTimeAt = "";
var startTimeArray = [""];
var startTitleArray = [""];
var startTimeIndex = 0;

var cueStartTimeAt = "";
var cueStartTimeInMs = "";
var cueTimeInMs = 0;
var cueArray = [""];
var cueArrayIndex = 0;

var nowInMs = 0;
var startTimeInMs = 0;

var displayTimeBool = false;
var positiveDiffTimeBoole = false;

var fiveMinuteString = "";
var fiveMinuteInMs = 5 *60000;
var fiveMinuteFromMsToTime = 0;

var setTimeoutTime = 150;

// //--------------------------------------------------
// var monArray = ["18:30:00", "19:00:00", "19:35:00", "19:55:00", "20:25:00", "20:55:00", "21:25:00", "21:55:00", "22:15:00"];
// var tusArray = ["18:30:00", "19:00:00", "19:35:00", "19:55:00", "20:25:00", "20:55:00", "21:25:00", "21:55:00", "22:15:00"];
// var wenArray = ["18:30:00", "19:00:00", "19:35:00", "19:55:00", "20:25:00", "20:55:00", "21:25:00", "21:55:00", "22:15:00"];
// var thuArray = ["18:30:00", "19:00:00", "19:35:00", "19:55:00", "20:25:00", "20:55:00", "21:25:00", "21:55:00", "22:15:00"];
// var friArray = ["18:30:00", "19:00:00", "19:35:00", "19:55:00", "20:25:00", "20:55:00", "21:25:00", "21:55:00", "22:15:00"];
// var satArray = ["16:30:00", "02:00:00", "03:00:00", "04:00:00", "05:00:00", "06:00:00", "07:00:00", "08:00:00", "09:00:00", "10:00:00"];
// var sunArray = ["01:30:00", "02:10:00", "02:20:00", "19:55:00", "20:25:00", "20:55:00", "21:25:00", "21:55:00", "22:15:00"];
// //--------------------------------------------------
// var monTitleArray = ["Come Alive", "Adele", "Pillowtalk", "West Side", "Grygoriy", "Celebration", " AC/DC", "Igor", "Pinball POP!"];
// var tusTitleArray = ["Come Alive", "Adele", "Pillowtalk", "West Side", "Grygoriy", "Celebration", " AC/DC", "Igor", "Pinball POP!"];
// var wenTitleArray = ["Come Alive", "Adele", "Pillowtalk", "West Side", "Grygoriy", "Celebration", " AC/DC", "Igor", "Pinball POP!"];
// var thuTitleArray = ["Come Alive", "Adele", "Pillowtalk", "West Side", "Grygoriy", "Celebration", " AC/DC", "Igor", "Pinball POP!"];
// var friTitleArray = ["Come Alive", "Adele", "Pillowtalk", "West Side", "Grygoriy", "Celebration", " AC/DC", "Igor", "Pinball POP!"];
// var satTitleArray = ["Number 1", "Number 2", "Number 3", "Number 4", "Number 5", "Number 6", " Number 7", "Number 8", "Number 9", "Number 10"];
// var sunTitleArray = ["Come Alive", "Adele", "Pillowtalk", "West Side", "Grygoriy", "Celebration", " AC/DC", "Igor", "Pinball POP!"];
// //--------------------------------------------------
// var monCueArray = ["Come Alive", "Adele", "Pillowtalk", "West Side", "Grygoriy", "Celebration", " AC/DC", "Igor", "Pinball POP!"];
// var tusCueArray = ["Come Alive", "Adele", "Pillowtalk", "West Side", "Grygoriy", "Celebration", " AC/DC", "Igor", "Pinball POP!"];
// var wenCueArray = ["Come Alive", "Adele", "Pillowtalk", "West Side", "Grygoriy", "Celebration", " AC/DC", "Igor", "Pinball POP!"];
// var thuCueArray = ["Come Alive", "Adele", "Pillowtalk", "West Side", "Grygoriy", "Celebration", " AC/DC", "Igor", "Pinball POP!"];
// var friCueArray = ["Come Alive", "Adele", "Pillowtalk", "West Side", "Grygoriy", "Celebration", " AC/DC", "Igor", "Pinball POP!"];
// var satCueArray = ["Number 1", "Number 2", "Number 3", "Number 4", "Number 5", "Number 6", " Number 7", "Number 8", "Number 9", "Number 10"];
// var sunCueArray = ["Come Alive", "Adele", "Pillowtalk", "West Side", "Grygoriy", "Celebration", " AC/DC", "Igor", "Pinball POP!"];

//--------------------------------------------------
// - getscheduledTimes
//--------------------------------------------------
function getscheduledTimes(){
  const request = async () => {
      const response = await fetch('/scheduledTimes.json');
      const json = await response.json();
      scheduledTimesArray = json;
      //console.log(scheduledTimesArray.profiles[0].title);
      //console.log(scheduledTimesArray.profiles.length  + "the length of the array");

      var i;
      var a;
      var b;
      startTimeArray = [];
      startTitleArray = [];
      for (i = 0; i < scheduledTimesArray.profiles.length; i++) {
        a = scheduledTimesArray.profiles[i].title;
        startTitleArray.push(a);
        b = scheduledTimesArray.profiles[i].startTime;
        startTimeArray.push(b);
        //console.log(a);
        //console.log(b);
        //console.log(startTimeArray);
      }
  }

  request();
};
getscheduledTimes();
//--------------------------------------------------





//--------------------------------------------------
//- timeArray
//--------------------------------------------------
function timeArray() {
  var day = "";
  //console.log(startTimeArray)


  //--------------------------------------------------
  // switch (new Date().getDay()) {
  //   case 0:
  //     day = "Sunday";
  //     startTimeArray = sunArray;
  //     startTitleArray = sunTitleArray;
  //     cueArray = sunCueArray;
  //     break;
  //   case 1:
  //     day = "Monday";
  //     startTimeArray = monArray;
  //     startTitleArray = monTitleArray;
  //     cueArray = monCueArray;
  //     break;
  //   case 2:
  //     day = "Tuesday";
  //     startTimeArray = tusArray;
  //     startTitleArray = tusTitleArray;
  //     cueArray = tusCueArray;
  //     break;
  //   case 3:
  //     day = "Wednesday";
  //     startTimeArray = wenArray;
  //     startTitleArray = wenTitleArray;
  //     cueArray = wenCueArray;
  //     break;
  //   case 4:
  //     day = "Thursday";
  //     startTimeArray = thuArray;
  //     startTitleArray = thuTitleArray;
  //     cueArray = thuCueArray;
  //     break;
  //   case 5:
  //     day = "Friday";
  //     startTimeArray = friArray;
  //     startTitleArray = friTitleArray;
  //     cueArray = friCueArray;
  //     break;
  //   case 6:
  //     day = "Saturday";
  //     startTimeArray = satArray;
  //     startTitleArray = satTitleArray;
  //     cueArray = satCueArray;
  // }
  //--------------------------------------------------

//console.log("nowInMs = " + new Date(nowInMs) + " - " + startTimeInMs)
  if (nowInMs > (startTimeInMs - countDown) && nowInMs < (startTimeInMs + countUp)) {
    titleText.textContent = startTitleArray[startTimeIndex-1];
    //console.log(startTitleArray[startTimeIndex-1]);
    hideNowClock();
  } else {
    new ShowNowClock();

    if (startTimeIndex >= startTimeArray.length) {
      startTimeIndex = 0;
    //console.log(startTimeIndex + " - " + startTimeArray.length)
    }

    startTimeArray[startTimeIndex];
    startTimeAt = startTimeArray[startTimeIndex];
    startTimeIndex ++;


    startText.textContent = ("");
    titleText.textContent = ("");

    //console.log(startTimeAt + " " +startTimeIndex + " - " + startTitleArray);

  }
  setTimeout(timeArray, setTimeoutTime);
}
//--------------------------------------------------


//--------------------------------------------------
//- CurrentTime
//--------------------------------------------------
function nowClock() {
  var d = new Date();
  nowInMs = d.getTime();
  var s = "";
  s += (10 > d.getHours  () ? "0": "") + d.getHours  () + ":";
  s += (10 > d.getMinutes() ? "0": "") + d.getMinutes() + ":";
  s += (10 > d.getSeconds() ? "0": "") + d.getSeconds();
  //$('#now').html(s);
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
  //console.log("THis one works" + nowInMs +" - "+ startTimeInMs)
  if (nowInMs > (startTimeInMs - fiveMinuteInMs) && nowInMs < (startTimeInMs)) {
    fiveMinuteString = fiveMinuteFromMsToTime +1 + " min to show";
    fiveMinuteText.textContent = fiveMinuteString;
    //console.log("5 Minute CountDown" + " - " + fiveMinuteFromMsToTime);
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
      startText.textContent = ('+' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs));
      //$('#start').html('+' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs));
    } else {
      startText.textContent = ('-' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs));
      //$('#start').html('-' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs));
    }
  }
  fiveMinuteFromMsToTime = mins;

  return hrs + ':' + mins + ':' + secs + '.' + ms;
}

//--------------------------------------------------
//- Convert Cue String to ms
//--------------------------------------------------
function timeStringToMs(t){
  //var t = "00:50:00";
  var r = Number(t.split(':')[0])*(60*60000)+Number(t.split(':')[1])*(60000)+Number(t.split(':')[2])*(1000);
return r;

}
//console.log(timeStringToMs)
//--------------------------------------------------


//--------------------------------------------------
//- CueStartTime
//--------------------------------------------------
function cueStartTime(){
  var d = new Date();
  var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${startTimeAt}`);
  cueStartTimeInMs = dd.getTime();

  var cueStartTimeOffset = timeStringToMs(cueArray[startTimeIndex-1]);
  cueStartTimeInMs = cueStartTimeInMs + (offsetTimeInit*60000) + cueStartTimeOffset;
  cueStartTimeAt = new Date(cueStartTimeInMs);
  var cueMS = cueStartTimeAt.getTime();
  var s = "";

  //if (nowInMs > (startTimeInMs - countDown) && nowInMs < (startTimeInMs + countUp))
  if (nowInMs > (cueStartTimeAt - countDown) && nowInMs < (cueStartTimeAt + countUp)){
    //console.log(nowClock()>cueStartTimeAt)

  }

  //console.log(cueStartTimeAt)
  //console.log(dd + " - " + new Date(cueStartTimeInMs))
  setTimeout(cueStartTime, setTimeoutTime);
  return dd;

}

function startTime() {
  var d = new Date();
  var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${startTimeAt}`);
  startTimeInMs = dd.getTime();
  startTimeInMs = startTimeInMs + (offsetTimeInit*60000);
  var s = "";


  // Use subtrack time depending on now(d) vs start(dd) time
  if (dd > d) {
    s = dd - d + 1000;
    s = s + (offsetTimeInit*60000)
    msToTime(s);
    positiveDiffTimeBoole = false;
  } else {
    s = d - dd;
    s = s + (offsetTimeInit*60000)
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

  //console.log(offsetTimeInit);
}
function subOffsetTime() {
  offsetTimeInit = offsetTimeInit -1;
  document.getElementById("offsetTime").textContent = offsetTimeInit;

  //console.log(offsetTimeInit);

}

function hideAdmin() {
  document.getElementById("adminPage").style.display = "none";
}
function showAdmin() {
  document.getElementById("adminPage").style.display = "block";
}

function hideNowClock() {
  document.getElementById("centerNowText").style.display = "none";
  //document.getElementById("5minute").style.display = "block";
  document.getElementById("titleContentBox").style.display = "block";

}
function ShowNowClock() {
  document.getElementById("centerNowText").style.display = "block";
  //document.getElementById("5minute").style.display = "none";
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


nowClock();
startTime();
timeArray();
fiveMinuteCountDown();
