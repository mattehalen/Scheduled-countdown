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
//--------------------------------------------------
var offsetTimeInit = 0;
//--------------------------------------------------
var sendMin_To_countDownBoole = 0;
var startTitleHolder = "";
var countDownTimeInMS = "";
//--------------------------------------------------

//--------------------------------------------------
function hideNowClock() {
  document.getElementById("centerNowText").style.display = "none";
  document.getElementById("titleContentBox").style.display = "block";
}
function ShowNowClock() {
  document.getElementById("centerNowText").style.display = "block";
  document.getElementById("titleContentBox").style.display = "none";
}
//--------------------------------------------------

//--------------------------------------------------
socket.on("centerTextContent", function(data){
  nowText.textContent   = data.newCurrentTime,
  nowTopRow.textContent = data.newCurrentTime,
  titleText.textContent = data.startTitleHolder,
  startText.textContent = data.countDownString,
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

        if (data.showNowClock === true) {
          ShowNowClock();
          document.body.style.backgroundColor = "#2b2b2b";
        }else{
          hideNowClock();
          //Change BG color
          if (countDownTimeInMS < threeMinuteMs){
            document.body.style.backgroundColor = "darkred";
          }
          if (countDownTimeInMS < 0){
            document.body.style.backgroundColor = "darkgreen";
          }
        }

        //  6larm
        if (countDownTimeInMS > sixMinuteMs && countDownTimeInMS < (sixMinuteMs + timeBuffer)) {
        //if (countDownTimeInMS < sixMinuteMs && countDownTimeInMS > fiveMinuteMs) {
          document.getElementById('musiclong6').play();
        }
        // 5min Alarm
        if (countDownTimeInMS > fiveMinuteMs && countDownTimeInMS < (fiveMinuteMs + timeBuffer)) {
        //if (countDownTimeInMS < fiveMinuteMs && countDownTimeInMS > fourMinuteMs) {
          document.getElementById('music5').play();

          // if (sendMin_To_countDownBoole != 5){
          //   sendMin_To_countDownBoole = 5;
          //   socket.emit("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});
          //
          // };
        }
        // 4min Alarm
        if (countDownTimeInMS > fourMinuteMs && countDownTimeInMS < (fourMinuteMs + timeBuffer)) {
        //if (countDownTimeInMS < fourMinuteMs && countDownTimeInMS > threeMinuteMs) {
          document.getElementById('musiclong4').play();

          // if (sendMin_To_countDownBoole != 4){
          //   sendMin_To_countDownBoole = 4;
          //   socket.emit("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});
          // };
        }
        // 3min Alarm
        if (countDownTimeInMS > threeMinuteMs && countDownTimeInMS < (threeMinuteMs + timeBuffer)) {
        //if (countDownTimeInMS < threeMinuteMs && countDownTimeInMS > twoMinuteMs) {
          document.getElementById('music3').play();
          // if (sendMin_To_countDownBoole != 3){
          //   sendMin_To_countDownBoole = 3;
          //   socket.emit("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});
          //
          // };
        }
        // 2min Alarm
        if (countDownTimeInMS > twoMinuteMs && countDownTimeInMS < (twoMinuteMs + timeBuffer)) {
        //if (countDownTimeInMS < twoMinuteMs && countDownTimeInMS > oneMinuteMs) {
          document.getElementById('musiclong2').play();

          // if (sendMin_To_countDownBoole != 2){
          //   sendMin_To_countDownBoole = 2;
          //   socket.emit("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});
          //
          // };
        }
        // 1min Alarm
        if (countDownTimeInMS > oneMinuteMs && countDownTimeInMS < (oneMinuteMs + timeBuffer)) {
        //if (countDownTimeInMS < oneMinuteMs && countDownTimeInMS > 0) {
          document.getElementById('music1').play();

          // if (sendMin_To_countDownBoole != 1){
          //   sendMin_To_countDownBoole = 1;
          //   socket.emit("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});
          //
          // };
        }
        // 0min Alarm
        if (countDownTimeInMS > 0 && countDownTimeInMS < (0 + timeBuffer)) {;
        //if (countDownTimeInMS < 0) {;
          // if (sendMin_To_countDownBoole != 0){
          //   sendMin_To_countDownBoole = 0;
          //   socket.emit("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});
          //
          // };
        }
        //--------------------------------------------------


});
socket.emit("user", {user: user});
