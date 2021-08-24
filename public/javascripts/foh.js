"use strict";
const KEYS = {
  'GET_CURRENTTIME': 'currentTime',
  'GET_CURRENTTIMEMS': 'currentTimeMs',
  "COUNTDOWN": "countDown",
  "CUE_COUNTDOWN":"cueCountDown",
  "SETTINGS": 'settings',
  "MIDI":"midi",
  "FOHURL":         "fohUrl",
  "RELOAD": "reload"
};

WebSocketService.onEvent(KEYS.GET_CURRENTTIME, (message) => {
  document.getElementById("nowTopRow").textContent = message;
  document.getElementById("now").textContent = message;
})

WebSocketService.onEvent(KEYS.GET_CURRENTTIMEMS, (message) => {
  //console.log('Message from server: ', message);
})

WebSocketService.onEvent(KEYS.COUNTDOWN, (message) => {
  //console.log(message);
  if (message.bool) {
    document.getElementById("title").textContent = message.title
    document.getElementById("start").textContent = message.time

    document.getElementById("centerNowText").style.display = "none";
    document.getElementById("titleContentBox").style.display = "block";

    if (message.countDownTimeInMS < ((3*-60000))) {
      document.body.style.backgroundColor = "#2b2b2b";
    }
    if (message.countDownTimeInMS > ((3*-60000))) {
      document.body.style.backgroundColor = message.colors.countDownColor;
    }
    if (message.countDownTimeInMS > 0) {
      document.body.style.backgroundColor = message.colors.countUpColor;
    }

  }else{
    document.getElementById("centerNowText").style.display = "block";
    document.getElementById("titleContentBox").style.display = "none";
    document.body.style.backgroundColor = "#2b2b2b";

  }
    // AUTO Shrink text
    var textLength = $('#title').text().length;
    if (textLength < 13) {
      $('#title').css('font-size', '10vw');
    } else if (textLength > 13 && textLength < 19) {
      $('#title').css('font-size', '8vw');
    } else if (textLength > 18) {
      $('#title').css('font-size', '7vw');
    }
})

WebSocketService.onEvent(KEYS.CUE_COUNTDOWN, (message) => {
  if (message.bool) {
    document.getElementById("cueTime").textContent = "Cue: " + message.time;

    if (message.cueCountDownTimeInMS < ((3*-60000))) {
      //document.body.style.backgroundColor = "#2b2b2b";
      document.getElementById("cueTime").style.backgroundColor = "#3b3b3b";
    }
    if (message.cueCountDownTimeInMS > ((3*-60000))) {
      document.getElementById("cueTime").style.backgroundColor = message.colors.countDownColor;
    }
    if (message.cueCountDownTimeInMS > 0) {
      document.getElementById("cueTime").style.backgroundColor = message.colors.countUpColor;
    }
    
  }else{
    document.getElementById("cueTime").style.backgroundColor = "#3b3b3b";
    document.getElementById("cueTime").textContent = "";
  }
})

WebSocketService.onEvent(KEYS.MIDI, (message) => {
  if (typeof(message) == "string") {
    document.getElementById("timeCode").textContent = message;
    
  }else{
    document.getElementById("timeCode").textContent = "";
  }
})
WebSocketService.onEvent(KEYS.FOHURL, (message) => {
  $('body').prepend('<div class="blink d-flex align-items-center justify-content-center"><H1>' + message.text + '</H1></div>');
  console.log(message.text);

  sleep(message.time).then(() => {
    $(".blink").remove();
  });
})
WebSocketService.onEvent(KEYS.RELOAD, (message) => {
  console.log("-+-+-+-+-+-+-+-+-+-+-+-+");
  console.log("Reload from socket")
  location.reload();
})

//--------------------------------------------------
// var nowText = document.getElementById("now");
// var nowTopRow = document.getElementById("nowTopRow");
// var timeCode = document.getElementById("timeCode");
// var cueTimeText = document.getElementById("cueTime");
// var titleText = document.getElementById("title");
// var startText = document.getElementById("start");
// //--------------------------------------------------
// var offsetTimeInit = 0;
// //--------------------------------------------------
// var sendMin_To_countDownBoole = 0;
// var startTitleHolder = "";
// var countDownTimeInMS = "";
//--------------------------------------------------
// var playButton = document.querySelector('#play');
// playButton.hidden = false;
//--------------------------------------------------
// function hideNowClock() {
//   document.getElementById("centerNowText").style.display = "none";
//   document.getElementById("titleContentBox").style.display = "block";
// }
// function ShowNowClock() {
//   document.getElementById("centerNowText").style.display = "block";
//   document.getElementById("titleContentBox").style.display = "none";
// }
// //--------------------------------------------------
// function startPlayback() {
//   return document.querySelector('.countDownSound').play();
// }
//--------------------------------------------------
// socket.on("centerTextContent", function(data) {
//   nowText.textContent = data.newCurrentTime,
//     nowTopRow.textContent = data.newCurrentTime,
//     titleText.textContent = data.startTitleHolder,
//     startText.textContent = data.countDownString,
//     countDownTimeInMS = data.countDownTimeInMS,
//     offsetTimeInit = data.offsetTimeInit
//
//
//   // Audio Alarms
//   //--------------------------------------------------
//   var timeBuffer = 1 * 1000
//   var sixMinuteMs = (6 * 1000 * 60);
//   var fiveMinuteMs = (5 * 1000 * 60);
//   var fourMinuteMs = (4 * 1000 * 60);
//   var threeMinuteMs = (3 * 1000 * 60);
//   var twoMinuteMs = (2 * 1000 * 60);
//   var oneMinuteMs = (1 * 1000 * 60);
//   countDownTimeInMS += offsetTimeInit
//
//   if (data.showNowClock === true) {
//     ShowNowClock();
//     document.body.style.backgroundColor = "#2b2b2b";
//   } else {
//     hideNowClock();
//     //Change BG color
//     if (countDownTimeInMS < threeMinuteMs) {
//       document.body.style.backgroundColor = "darkred";
//     }
//     if (countDownTimeInMS < 0) {
//       document.body.style.backgroundColor = "darkgreen";
//     }
//   }
//
//   //  6larm
//   if (countDownTimeInMS > sixMinuteMs && countDownTimeInMS < (sixMinuteMs + timeBuffer)) {
//   //if (countDownTimeInMS < sixMinuteMs && countDownTimeInMS > fiveMinuteMs) {
//     document.getElementById('musiclong6').play();
//   }
//   // 5min Alarm
//   if (countDownTimeInMS > fiveMinuteMs && countDownTimeInMS < (fiveMinuteMs + timeBuffer)) {
//   //if (countDownTimeInMS < fiveMinuteMs && countDownTimeInMS > fourMinuteMs) {
//     document.getElementById('music5').play();
//   }
//   // 4min Alarm
//   if (countDownTimeInMS > fourMinuteMs && countDownTimeInMS < (fourMinuteMs + timeBuffer)) {
//   //if (countDownTimeInMS < fourMinuteMs && countDownTimeInMS > threeMinuteMs) {
//     document.getElementById('musiclong4').play();
//   }
//   // 3min Alarm
//   if (countDownTimeInMS > threeMinuteMs && countDownTimeInMS < (threeMinuteMs + timeBuffer)) {
//   //if (countDownTimeInMS < threeMinuteMs && countDownTimeInMS > twoMinuteMs) {
//     document.getElementById('music3').play();
//   }
//   // 2min Alarm
//   if (countDownTimeInMS > twoMinuteMs && countDownTimeInMS < (twoMinuteMs + timeBuffer)) {
//   //if (countDownTimeInMS < twoMinuteMs && countDownTimeInMS > oneMinuteMs) {
//     document.getElementById('musiclong2').play();
//   }
//   // 1min Alarm
//   if (countDownTimeInMS > oneMinuteMs && countDownTimeInMS < (oneMinuteMs + timeBuffer)) {
//   //if (countDownTimeInMS < oneMinuteMs && countDownTimeInMS > 0) {
//     document.getElementById('music1').play();
//   }
//   // 0min Alarm
//   if (countDownTimeInMS > 0 && countDownTimeInMS < (0 + timeBuffer)) {
//   //if (countDownTimeInMS < 0) {
//   }
//   //--------------------------------------------------
//
//
// });
// socket.on("getCueTimeString_From_Socket", function(data) {
//   cueTimeText.textContent = data.string;
//   var newCurrentTimeInMs  = data.newCurrentTimeInMs;
//   var cueBoolHolder       = data.cueBoolHolder;
//
//   if (newCurrentTimeInMs<0 && newCurrentTimeInMs>(-1000*60*2) && cueBoolHolder==1){
//       $(".fiveMinute").css("background-color", "darkred");
//   }
//   else {
//       $(".fiveMinute").css("background-color", "#3b3b3b");
//     //document.getElementsByClassName("fiveMinute").style.backgroundColor = "#2b2b2b";
//   }
// });
// sendSocketMessage("getTimeCode");
// socket.on("sendTimeCode", function(data) {
//   timeCode.textContent = data.smpteString
//   //console.log(data.smpteString);
//
// });
// socket.on("alertText_fohUrl",function(data){
//   $('body').prepend('<div class="blink d-flex align-items-center justify-content-center"><H1>'+data.text+'</H1></div>');
//   console.log(data.text);
//
//   sleep(10000).then(() => {
//     $( ".blink" ).remove();
//     });
//
//
//
// });

// function getTimeCodeLoop() {
//   sendSocketMessage("getTimeCode");
//   setTimeout(getTimeCodeLoop, 100);
// };
// getTimeCodeLoop()
