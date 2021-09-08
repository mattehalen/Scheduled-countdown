// "use strict";
const KEYS = {
  'GET_CURRENTTIME': 'currentTime',
  'GET_CURRENTTIMEMS': 'currentTimeMs',
  "COUNTDOWN": "countDown",
  "SETTINGS": 'settings',
  "STARTURL":       "startUrl",
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

    // Audio Alarms
    //--------------------------------------------------
    if (message.countDownTimeInMS > ((6*-60000)) && message.countDownTimeInMS < ((6*-60000)+500) ) {
      document.getElementById('musiclong6').play();
    }
    if (message.countDownTimeInMS > ((5*-60000)) && message.countDownTimeInMS < ((5*-60000)+500) ) {
      document.getElementById('music5').play();
    }
    if (message.countDownTimeInMS > ((4*-60000)) && message.countDownTimeInMS < ((4*-60000)+500) ) {
      document.getElementById('musiclong4').play();
    }
    if (message.countDownTimeInMS > ((3*-60000)) && message.countDownTimeInMS < ((3*-60000)+500) ) {
      document.getElementById('music3').play();
    }
    if (message.countDownTimeInMS > ((2*-60000)) && message.countDownTimeInMS < ((2*-60000)+500) ) {
      document.getElementById('musiclong2').play();
    }
    if (message.countDownTimeInMS > ((1*-60000)) && message.countDownTimeInMS < ((1*-60000)+500) ) {
      document.getElementById('music1').play();
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

  sleep(message.time).then(() => {
    $(".blink").remove();
  });
})
WebSocketService.onEvent(KEYS.RELOAD, (message) => {
  console.log("-+-+-+-+-+-+-+-+-+-+-+-+");
  console.log("Reload from socket")
  location.reload();
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

//auto reload page once a day
setInterval(function(){
  location.reload();
  }, 1000*60*60*24);
  