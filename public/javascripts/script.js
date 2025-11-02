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
// Smooth/animated countdown rendering
// We'll interpolate countdown using the ms value from the server (countDownTimeInMS)
// and animate via requestAnimationFrame for smooth visuals.
let countdownAnim = {
  running: false,
  startMs: 0, // ms remaining at last server update
  timestamp: 0, // performance.now() when last server update arrived
  rafId: null,
  title: '',
  colors: { countDownColor: '#FF0000', countUpColor: '#00FF00' },
  bool: false
};

function pad(n, z) {
  z = z || 2;
  return ('00' + n).slice(-z);
}

function msToTime(s) {
  const sign = s < 0 ? '-' : '';
  s = Math.abs(Math.round(s));
  const ms = s % 1000;
  s = (s - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;
  const hrs = (s - mins) / 60;
  return sign + pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}

function renderCountdown(nowMs) {
  const elapsed = performance.now() - countdownAnim.timestamp;
  const remaining = countdownAnim.startMs - elapsed;

  // Update DOM
  document.getElementById('title').textContent = countdownAnim.title || '';
  document.getElementById('start').textContent = msToTime(remaining);

  if (countdownAnim.startMs < (3 * -60000)) {
    document.body.style.backgroundColor = '#2b2b2b';
  } else if (remaining > 0) {
    document.body.style.backgroundColor = countdownAnim.colors.countUpColor;
  } else {
    document.body.style.backgroundColor = countdownAnim.colors.countDownColor;
  }

  // Auto-shrink title text
  var textLength = $('#title').text().length;
  if (textLength <= 14) {
    $('#title').css('font-size', '10vw');
  } else if (textLength > 14 && textLength < 19) {
    $('#title').css('font-size', '8vw');
  } else if (textLength > 18) {
    $('#title').css('font-size', '7vw');
  }

  if (countdownAnim.running) {
    countdownAnim.rafId = requestAnimationFrame(renderCountdown);
  }
}

WebSocketService.onEvent(KEYS.COUNTDOWN, (message) => {
  // message.countDownTimeInMS expected (ms remaining, can be negative)
  if (message && message.bool) {
    countdownAnim.bool = true;
    countdownAnim.startMs = (typeof message.countDownTimeInMS === 'number') ? message.countDownTimeInMS : 0;
    countdownAnim.timestamp = performance.now();
    countdownAnim.title = message.title || '';
    countdownAnim.colors = message.colors || countdownAnim.colors;

    // Switch view
    document.getElementById('centerNowText').style.display = 'none';
    document.getElementById('titleContentBox').style.display = 'block';

    if (!countdownAnim.running) {
      countdownAnim.running = true;
      countdownAnim.rafId = requestAnimationFrame(renderCountdown);
    }

    // Audio triggers should be based on transitions — still use existing logic but
    // derive from the numeric ms value to avoid missed triggers. Keep existing checks
    // but use the ms value.
    const ms = countdownAnim.startMs;
    if (ms > ((6 * -60000)) && ms < ((6 * -60000) + 500)) {
      document.getElementById('musiclong6').play();
    }
    if (ms > ((5 * -60000)) && ms < ((5 * -60000) + 500)) {
      document.getElementById('music5').play();
    }
    if (ms > ((4 * -60000)) && ms < ((4 * -60000) + 500)) {
      document.getElementById('musiclong4').play();
    }
    if (ms > ((3 * -60000)) && ms < ((3 * -60000) + 500)) {
      document.getElementById('music3').play();
    }
    if (ms > ((2 * -60000)) && ms < ((2 * -60000) + 500)) {
      document.getElementById('musiclong2').play();
    }
    if (ms > ((1 * -60000)) && ms < ((1 * -60000) + 500)) {
      document.getElementById('music1').play();
    }

  } else {
    // Stop animation and show Now
    countdownAnim.bool = false;
    countdownAnim.running = false;
    if (countdownAnim.rafId) {
      cancelAnimationFrame(countdownAnim.rafId);
      countdownAnim.rafId = null;
    }
    document.getElementById('centerNowText').style.display = 'block';
    document.getElementById('titleContentBox').style.display = 'none';
    document.body.style.backgroundColor = '#2b2b2b';
  }
});
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
  