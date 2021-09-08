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

//auto reload page once a day
setInterval(function(){
  location.reload();
  }, 1000*60*60*24);
  