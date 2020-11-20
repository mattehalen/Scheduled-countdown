"use strict";

var myLocalip = document.getElementById("myLocalip").textContent;
var myLocalipAndPort = myLocalip
console.log(myLocalipAndPort);
var socket = io.connect(myLocalipAndPort);
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

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
  // nowTopRow.textContent = data.newCurrentTime,
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

});
socket.on("alertText_watchUrl",function(data){
  $('body').prepend('<div class="blink d-flex align-items-center justify-content-center"><H1>'+data.text+'</H1></div>');
  console.log(data.text);

  sleep(10000).then(() => {
    $( ".blink" ).remove();
    });



});
