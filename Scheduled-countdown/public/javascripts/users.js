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
var setTimeoutTime = 150;
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

socket.emit("user", {user: user});
socket.emit("getTimeCode",{});

socket.on("sendTimeCode",function(data){
  timeCode.textContent = data.smpteString,
  timeCodeMs = data.smpteMs
  //console.log(timeCodeMs);

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
    if (timeCodeMs > (timeCodeArrayMs+5000)){
      $(rowString).hide(2500);
    }else {
      $(rowString).show(2500);
    }

    if (timeCodeMs > (timeCodeArrayMs-5000)){
      $(centeredOverlay).fadeIn(500);
      $(centeredOverlay).animate({
        width: "0%"
      }, 5000);
    }else {
      $(centeredOverlay).fadeOut(10);
      $(centeredOverlay).animate({
        width: "100%"
      }, 0);
    }


  }

  setTimeout(cueTimeCountDown, setTimeoutTime);
};
cueTimeCountDown();
