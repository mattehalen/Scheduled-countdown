// "use strict";
const KEYS = {
  'GET_CURRENTTIME': 'currentTime',
  'GET_CURRENTTIMEMS': 'currentTimeMs',
  "COUNTDOWN": "countDown",
  "SETTINGS": 'settings',
  "STARTURL":       "startUrl",
};

WebSocketService.onEvent(KEYS.GET_CURRENTTIME, (message) => {
  document.getElementById("nowTopRow").textContent = message;
  document.getElementById("now").textContent = message;
})

WebSocketService.onEvent(KEYS.GET_CURRENTTIMEMS, (message) => {
  //console.log('Message from server: ', message);
})

WebSocketService.onEvent(KEYS.COUNTDOWN, (message) => {
  //console.log('Message from server: ', message);
  
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
  if (textLength <= 14) {
    $('#title').css('font-size', '10vw');
  } else if (textLength > 14 && textLength < 19) {
    $('#title').css('font-size', '8vw');
  } else if (textLength > 18) {
    $('#title').css('font-size', '7vw');
  }

})

WebSocketService.onEvent(KEYS.SETTINGS, (message) => {
  //console.log('Message from server: ', message);
})
WebSocketService.onEvent(KEYS.STARTURL, (message) => {
  $('body').prepend('<div class="blink d-flex align-items-center justify-content-center"><H1>' + message.text + '</H1></div>');
  console.log(message.text);

  sleep(10000).then(() => {
    $(".blink").remove();
  });
})

function timeStringToMs(t) {
    if (t > 5) {
        var r = Number(t.split(':')[0]) * (60 * 60000) + Number(t.split(':')[1]) * (60000) + Number(t.split(':')[2]) * (1000);
    } else {
        t = t + ":00"
        var r = Number(t.split(':')[0]) * (60 * 60000) + Number(t.split(':')[1]) * (60000) + Number(t.split(':')[2]) * (1000);
    }
    return r;

}

 var playButton = document.querySelector('#play');
 playButton.hidden = false;
// //--------------------------------------------------
 function startPlayback() {
   return document.querySelector('.countDownSound').play();
 }
 startPlayback().then(function () {
   //console.log('The play() Promise fulfilled! Rock on!');
 }).catch(function (error) {
   //console.log('The play() Promise rejected!');
   //console.log('Use the Play button instead.');
   console.log(error);
   // The user interaction requirement is met if
   // playback is triggered via a click event.
   playButton.addEventListener('click', startPlayback);
 });
 $("#play").on('click', function () {
   playButton.hidden = true;
 });
//--------------------------------------------------






//_____ OLD STUFF _____
// console.log("is this one in use");
// socket.on("reload",function () {
//   console.log("1234567890+1234567890123456789");
// })
// console.log(socket);
//
// //--------------------------------------------------
// var nowText = document.getElementById("now");
// var nowTopRow = document.getElementById("nowTopRow");
// var titleText = document.getElementById("title");
// var startText = document.getElementById("start");
// //--------------------------------------------------
// var offsetTimeInit = 0;
// //--------------------------------------------------
// var sendMin_To_countDownBoole = 0;
// var startTitleHolder = "";
// var countDownTimeInMS = "";
// //--------------------------------------------------
// var playButton = document.querySelector('#play');
// playButton.hidden = false;
// //--------------------------------------------------
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
// startPlayback().then(function() {
//   //console.log('The play() Promise fulfilled! Rock on!');
// }).catch(function(error) {
//   //console.log('The play() Promise rejected!');
//   //console.log('Use the Play button instead.');
//   console.log(error);
//   // The user interaction requirement is met if
//   // playback is triggered via a click event.
//   playButton.addEventListener('click', startPlayback);
// });
// $("#play").on('click', function () {
//   playButton.hidden = true;
// });
//
// //--------------------------------------------------
// socket.on("centerTextContent", function(data){
//   nowText.textContent   = data.newCurrentTime,
//   nowTopRow.textContent = data.newCurrentTime,
//   titleText.textContent = data.startTitleHolder,
//   startText.textContent = data.countDownString,
//   countDownTimeInMS     = data.countDownTimeInMS,
//   offsetTimeInit        = data.offsetTimeInit
//
//
//         // Audio Alarms
//         //--------------------------------------------------
//         var timeBuffer    = 1*1000
//         var sixMinuteMs  = (6*1000*60);
//         var fiveMinuteMs  = (5*1000*60);
//         var fourMinuteMs  = (4*1000*60);
//         var threeMinuteMs = (3*1000*60);
//         var twoMinuteMs   = (2*1000*60);
//         var oneMinuteMs   = (1*1000*60);
//         countDownTimeInMS += offsetTimeInit
//
//         if (data.showNowClock === true) {
//           ShowNowClock();
//           document.body.style.backgroundColor = "#2b2b2b";
//         }else{
//           hideNowClock();
//           //Change BG color
//           if (countDownTimeInMS < threeMinuteMs){
//             document.body.style.backgroundColor = "darkred";
//           }
//           if (countDownTimeInMS < 0){
//             document.body.style.backgroundColor = "darkgreen";
//           }
//         }
//
//         //  6larm
//         if (countDownTimeInMS > sixMinuteMs && countDownTimeInMS < (sixMinuteMs + timeBuffer)) {
//         //if (countDownTimeInMS < sixMinuteMs && countDownTimeInMS > fiveMinuteMs) {
//           document.getElementById('musiclong6').play();
//         }
//         // 5min Alarm
//         if (countDownTimeInMS > fiveMinuteMs && countDownTimeInMS < (fiveMinuteMs + timeBuffer)) {
//         //if (countDownTimeInMS < fiveMinuteMs && countDownTimeInMS > fourMinuteMs) {
//           document.getElementById('music5').play();
//
//           // if (sendMin_To_countDownBoole != 5){
//           //   sendMin_To_countDownBoole = 5;
//           //   sendSocketMessage("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});
//           //
//           // };
//         }
//         // 4min Alarm
//         if (countDownTimeInMS > fourMinuteMs && countDownTimeInMS < (fourMinuteMs + timeBuffer)) {
//         //if (countDownTimeInMS < fourMinuteMs && countDownTimeInMS > threeMinuteMs) {
//           document.getElementById('musiclong4').play();
//
//           // if (sendMin_To_countDownBoole != 4){
//           //   sendMin_To_countDownBoole = 4;
//           //   sendSocketMessage("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});
//           // };
//         }
//         // 3min Alarm
//         if (countDownTimeInMS > threeMinuteMs && countDownTimeInMS < (threeMinuteMs + timeBuffer)) {
//         //if (countDownTimeInMS < threeMinuteMs && countDownTimeInMS > twoMinuteMs) {
//           document.getElementById('music3').play();
//           // if (sendMin_To_countDownBoole != 3){
//           //   sendMin_To_countDownBoole = 3;
//           //   sendSocketMessage("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});
//           //
//           // };
//         }
//         // 2min Alarm
//         if (countDownTimeInMS > twoMinuteMs && countDownTimeInMS < (twoMinuteMs + timeBuffer)) {
//         //if (countDownTimeInMS < twoMinuteMs && countDownTimeInMS > oneMinuteMs) {
//           document.getElementById('musiclong2').play();
//
//           // if (sendMin_To_countDownBoole != 2){
//           //   sendMin_To_countDownBoole = 2;
//           //   sendSocketMessage("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});
//           //
//           // };
//         }
//         // 1min Alarm
//         if (countDownTimeInMS > oneMinuteMs && countDownTimeInMS < (oneMinuteMs + timeBuffer)) {
//         //if (countDownTimeInMS < oneMinuteMs && countDownTimeInMS > 0) {
//           document.getElementById('music1').play();
//
//           // if (sendMin_To_countDownBoole != 1){
//           //   sendMin_To_countDownBoole = 1;
//           //   sendSocketMessage("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});
//           //
//           // };
//         }
//         // 0min Alarm
//         if (countDownTimeInMS > 0 && countDownTimeInMS < (0 + timeBuffer)) {;
//         //if (countDownTimeInMS < 0) {;
//           // if (sendMin_To_countDownBoole != 0){
//           //   sendMin_To_countDownBoole = 0;
//           //   sendSocketMessage("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});
//           //
//           // };
//         }
//         //--------------------------------------------------
//
//
// });
// socket.on("alertText_startUrl",function(data){
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
