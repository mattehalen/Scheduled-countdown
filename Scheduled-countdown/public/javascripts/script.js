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
var offsetTimejson = [];
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
      startTimeArray = [];
      startTitleArray = [];
      for (i = 0; i < scheduledTimesArray.profiles.length; i++) {
        a = scheduledTimesArray.profiles[i].title;
        startTitleArray.push(a);
        b = scheduledTimesArray.profiles[i].startTime;
        startTimeArray.push(b);
      }
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
    titleText.textContent = startTitleArray[startTimeIndex-1];
    hideNowClock();
    console.log("här är jag nu:"+ startTimeInMs);
  } else {
    new ShowNowClock();

    if (startTimeIndex >= startTimeArray.length) {
      startTimeIndex = 0;
    }

    startTimeArray[startTimeIndex];
    startTimeAt = startTimeArray[startTimeIndex];
    startTimeIndex ++;

    startText.textContent = ("");
    titleText.textContent = ("");
    console.log("startTimeAt: "+ startTimeAt);
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
      startText.textContent = ('+' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs));
    } else {
      startText.textContent = ('-' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs));
    }
  }
  fiveMinuteFromMsToTime = mins;

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
function cueStartTime(){
  var d = new Date();
  var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${startTimeAt}`);
  cueStartTimeInMs = dd.getTime();

  var cueStartTimeOffset = timeStringToMs(cueArray[startTimeIndex-1]);
  cueStartTimeInMs = cueStartTimeInMs + (offsetTimeInit*60000) + cueStartTimeOffset;
  cueStartTimeAt = new Date(cueStartTimeInMs);
  var cueMS = cueStartTimeAt.getTime();
  var s = "";

  if (nowInMs > (cueStartTimeAt - countDown) && nowInMs < (cueStartTimeAt + countUp)){
  }

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

nowClock();
startTime();
timeArray();
fiveMinuteCountDown();




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


var socket = io.connect('http://localhost:3000');
//---------- My sockets
socket.on("sendDB_TO_Main", function(data){
  //console.log("sendDB_TO_Main:" + JSON.stringify(data));
  console.log("sendDB_TO_Main:" + JSON.stringify(data.socketDBArray.startTitleArray));
  console.log("sendDB_TO_Main:" + JSON.stringify(data.socketDBArray.startTimeArray));
  console.log("sendDB_TO_Main:" + data.socketDBArray.startTimeArray);
   startTitleArray = data.socketDBArray.startTitleArray;
   startTimeArray = data.socketDBArray.startTimeArray;
   startTimeIndex = 0;
   displayTimeBool = false;
   startTimeInMs = 0;
   ShowNowClock();
  // displayTimeBool = true;
  // timeArray();
  // startTime();
});

//--------------------------------------------------










    //
    // var username = Math.random().toString(36).substr(2,8);
    // socket.emit('join', { username: username });
    //
    // socket.on('user joined', function (data) {
    //     $(".js-userjoined").html(data.username + ' Joined chat room');
    //      $.each(data.users, function(index, user) {
    //          $(".js-usersinchat").append('<span id ='+user+'>  <strong>'+user+'</strong></span>');
    //      });
    //  });

     socket.on('user disconnected', function (data) {
        $("#"+data.username).remove();
     });

    //an event emitted from server
    // socket.on('chat message', function (data) {
    //     var string = '<div class="row message-bubble"><p class="text-muted">' + data.username+'</p><p>'+data.message+'</p></div>';
    //     $('#messages').append(string);
    //
    // });
    $(function () {
        var timeout;
        function timeoutFunction() {
            typing = false;
            socket.emit("typing", { message: '', username: '' });
        }
       // $("#sendmessage").on('click', function () {
       //   var message = $("#txtmessage").val();
       //   $("#txtmessage").val('');
       //   $('.typing').html("");
       //   socket.emit('new_message', { message: message, username: username });
       // });
       //----
       // $("scheduledTimesSubmit").on('click', function () {
       //   console.log("den fukar");
       //   //var message = $("#txtmessage").val();
       //   //$("#txtmessage").val('');
       //   //$('.typing').html("");
       //   //socket.emit('new_message', { message: message, username: username });
       // });


   //  socket.on('typing', function (data) {
   //     if (data.username && data.message) {
   //          $('.typing').html("User: " + data.username+' '+ data.message);
   //    } else {
   //         $('.typing').html("");
   //     }
   //
   // });
      //  $('#txtmessage').keyup(function () {
      //      console.log('typing');
      //      typing = true;
      //      socket.emit('typing', { message: 'typing...', username: username});
      //     clearTimeout(timeout);
      //     timeout = setTimeout(timeoutFunction, 2000);
      // });

 });

var typing = false;
var timeout = undefined;
function timeoutFunction(){
  typing = false;
  socket.emit(noLongerTypingMessage);
}
function onKeyDownNotEnter(){
  if(typing == false) {
    typing = true
    socket.emit();
    timeout = setTimeout(timeoutFunction, 5000);
  } else {
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 5000);
  }
}
