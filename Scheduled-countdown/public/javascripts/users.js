"use strict";

var myLocalip = document.getElementById("myLocalip").textContent;
var user = document.getElementById("user").textContent;
var myLocalipAndPort = myLocalip
console.log(myLocalipAndPort);
var socket = io.connect(myLocalipAndPort);
//--------------------------------------------------
var nowText = document.getElementById("now");
var nowTopRow = document.getElementById("nowTopRow");
var titleText = document.getElementById("title");
var startText = document.getElementById("start");
var timeCode = document.getElementById("timeCode");
var timeCodeMs;
var timeCodeArray = [""];
var timeCodeBool = true;
var cuelistHideBool = true;
var setTimeoutTime = 150;
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

//--------------------------------------------------
var offsetTimeInit = 0;
//--------------------------------------------------
var sendMin_To_countDownBoole = 0;
var startTitleHolder = "";
var countDownTimeInMS = "";
//--------------------------------------------------

//--------------------------------------------------

//--------------------------------------------------

//--------------------------------------------------

$("#AddNewCueRow").on('click', function() {
  socket.emit("AddNewCueRow",{user: user});

  sleep(1000).then(() => {
      document.location.reload(true)
  });

});
$("#ToggleTC").on('click', function() {
  if (timeCodeBool==true){
    timeCodeBool=false;
    return;
  };
  if (timeCodeBool==false){
    timeCodeBool=true;
    $("#ToggleTC").html("TimeCode is ON")
    return;
  };

});
$("#ResetTC").on('click', function() {
  timeCodeMs = 1000;
  if (cuelistHideBool==true) {
    cuelistHideBool=false;
    return
  }
  if (cuelistHideBool==false) {
    cuelistHideBool=true;
    return
  }
});
function captureTCButton(listIndex) {
  console.log("captureTCButton with listIndex = "+listIndex);
  var string = "#timeCode"+listIndex
  $(string).val(msToTime(timeCodeMs))
};
function delete_button_click(listIndex) {
  console.log("delete_button_click");
  socket.emit("send_Delete_CueButton_To_Socket", {
    listIndex: listIndex,
    user: user
  });
};

socket.on("centerTextContent", function(data){
  nowTopRow.textContent = data.newCurrentTime,
  countDownTimeInMS     = data.countDownTimeInMS,
  offsetTimeInit        = data.offsetTimeInit


        // Audio Alarms
        //--------------------------------------------------
        var timeBuffer    = 1*1000
        var sixMinuteMs  = (6*1000*60);
        var fiveMinuteMs  = (5*1000*60);
        var fourMinuteMs  = (4*1000*60);
        var threeMinuteMs = (3*1000*60);
        var twoMinuteMs   = (2*1000*60);
        var oneMinuteMs   = (1*1000*60);
        countDownTimeInMS += offsetTimeInit

        //--------------------------------------------------


});
socket.on("cueListFromSocket", function(data){
  timeCodeArray = data.cueList,
  console.log(timeCodeArray);
});

socket.emit("user", {
  user: user

});
socket.emit("getTimeCode",{});
socket.on("sendTimeCode",function(data){
    timeCode.textContent = data.smpteString,
    timeCodeMs = data.smpteMs
  });


function getTimeCodeLoop(){
  $("#timecodeMs").text(timeCodeMs);
  socket.emit("getTimeCode",{});
  setTimeout(getTimeCodeLoop,100);
};
getTimeCodeLoop()


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


var newArrayIndex = 0;
var currentArrayIndex;
function cueTimeCountDown(){
  for (let i = 0; i < timeCodeArray.length; i++) {
    var time = "";
    var idString = "#timecodeMs" + i;
    var rowString = "#cueListRow" + i;
    var centeredOverlay = "#centeredOverlay" + i;
    var timeCodeArrayMs = timeStringToMs(timeCodeArray[i].timecode);
    //----------
    if (timeCodeMs > timeCodeArrayMs) {
      time = timeCodeMs - timeCodeArrayMs
      time = (msToTime(time))
    } else {
      time = timeCodeArrayMs - timeCodeMs
      time = "-" + (msToTime(time))
    }
    $(idString).text(time)
    //----------
    if (timeCodeBool==true){
      if (timeCodeMs > (timeCodeArrayMs+4000) && cuelistHideBool == true){
        $(rowString).hide(1500);
      }else {
        $(rowString).show(1500);
      }
      if (cuelistHideBool==false) {
        $(rowString).show(1500);
      }

      if (timeCodeMs > (timeCodeArrayMs-5000)){
        $(centeredOverlay).fadeIn(500);
        $(centeredOverlay).animate({
          width: "0%"
        }, 4000);
      }else {
        $(centeredOverlay).fadeOut(10);
        $(centeredOverlay).animate({
          width: "100%"
        }, 0);
      }
    }
  }


  if (newArrayIndex < timeCodeArray.length){
    if (timeCodeMs > timeStringToMs(timeCodeArray[newArrayIndex].timecode)){
    newArrayIndex++;
    currentArrayIndex = newArrayIndex - 1;
  }else{
    time = timeStringToMs(timeCodeArray[newArrayIndex].timecode) - timeCodeMs
    time = "-" + (msToTime(time))

    $("#nextCountdown").text(time)
    $("#nextTitle").text(timeCodeArray[newArrayIndex].title)
    //---
    if (newArrayIndex < 1){
      $("#currentCountdown").text("")
      $("#currentTitle").text("")
    }else{
      time = timeCodeMs - timeStringToMs(timeCodeArray[currentArrayIndex].timecode)
      time = (msToTime(time))

      $("#currentCountdown").text(time)
      $("#currentTitle").text(timeCodeArray[currentArrayIndex].title)

    }

  }
  }
  setTimeout(cueTimeCountDown, setTimeoutTime);
};
cueTimeCountDown();
