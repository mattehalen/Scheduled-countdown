// "use strict";
const KEYS = {
  'GET_CURRENTTIME': 'currentTime',
  'GET_CURRENTTIMEMS': 'currentTimeMs',
  "COUNTDOWN": "countDown",
  "SETTINGS": 'settings',
  "STARTURL":       "startUrl",
  "RELOAD": "reload"
};

// Dedupe: only update the visible time if it actually changed
let _lastNowText = '';
WebSocketService.onEvent(KEYS.GET_CURRENTTIME, (message) => {
  if (message !== _lastNowText) {
    _lastNowText = message;
    document.getElementById("nowTopRow").textContent = message;
    document.getElementById("now").textContent = message;
  }
});
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
  bool: false,
  titleChanged: false
};

// Track last displayed value to avoid unnecessary DOM writes
let _lastDisplayedSecond = null; // when animating locally
let _lastDisplayedString = '';
let _lastTitle = '';

// Edge-triggered audio: track last crossing and enablement
let _prevCountDownMs = null;
let _audioEnabled = false;
const _audioPlayed = {
  m6: false,
  m5: false,
  m4: false,
  m3: false,
  m2: false,
  m1: false
};

function resetAudioState() {
  _prevCountDownMs = null;
  for (const k in _audioPlayed) _audioPlayed[k] = false;
}

function tryPlay(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const p = el.play();
  if (p && typeof p.catch === 'function') {
    p.catch(() => {/* ignore autoplay errors */});
  }
}

// Detect crossings of thresholds and play once per event
function maybeTriggerAudio(prevMs, currMs) {
  if (!_audioEnabled) return;
  if (typeof prevMs !== 'number' || typeof currMs !== 'number') return;

  const T = {
    m6: -6 * 60000,
    m5: -5 * 60000,
    m4: -4 * 60000,
    m3: -3 * 60000,
    m2: -2 * 60000,
    m1: -1 * 60000
  };

  // crossing helper: from <= threshold to > threshold
  const crossed = (th) => prevMs <= th && currMs > th;

  if (!_audioPlayed.m6 && crossed(T.m6)) { _audioPlayed.m6 = true; tryPlay('musiclong6'); }
  if (!_audioPlayed.m5 && crossed(T.m5)) { _audioPlayed.m5 = true; tryPlay('music5'); }
  if (!_audioPlayed.m4 && crossed(T.m4)) { _audioPlayed.m4 = true; tryPlay('musiclong4'); }
  if (!_audioPlayed.m3 && crossed(T.m3)) { _audioPlayed.m3 = true; tryPlay('music3'); }
  if (!_audioPlayed.m2 && crossed(T.m2)) { _audioPlayed.m2 = true; tryPlay('musiclong2'); }
  if (!_audioPlayed.m1 && crossed(T.m1)) { _audioPlayed.m1 = true; tryPlay('music1'); }
}

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

  // Update title only when it changes (prevents layout thrash)
  if (_lastTitle !== countdownAnim.title) {
    _lastTitle = countdownAnim.title || '';
    document.getElementById('title').textContent = _lastTitle;

    // Auto-shrink title text (only when title changes)
    var textLength = _lastTitle.length;
    if (textLength <= 14) {
      $('#title').css('font-size', '10vw');
    } else if (textLength > 14 && textLength < 19) {
      $('#title').css('font-size', '8vw');
    } else if (textLength > 18) {
      $('#title').css('font-size', '7vw');
    }
  }

  // Local animation path: Only update countdown text when whole second changes
  const displaySeconds = Math.floor(remaining / 1000);
  if (displaySeconds !== _lastDisplayedSecond) {
    _lastDisplayedSecond = displaySeconds;
    document.getElementById('start').textContent = msToTime(displaySeconds * 1000);
  }

  // Only flip background color when it changes (reduces flicker/repaints)
  let nextBg;
  if (countdownAnim.startMs < (3 * -60000)) {
    nextBg = '#2b2b2b';
  } else if (remaining > 0) {
    nextBg = countdownAnim.colors.countUpColor;
  } else {
    nextBg = countdownAnim.colors.countDownColor;
  }
  if (document.body._lastBgColor !== nextBg) {
    document.body.style.backgroundColor = nextBg;
    document.body._lastBgColor = nextBg;
  }

  if (countdownAnim.running) {
    countdownAnim.rafId = requestAnimationFrame(renderCountdown);
  }
}

WebSocketService.onEvent(KEYS.COUNTDOWN, (message) => {
  // message.countDownTimeInMS expected (ms remaining, can be negative)
  if (message && message.bool) {
    countdownAnim.bool = true;
    const incomingMs = (typeof message.countDownTimeInMS === 'number') ? message.countDownTimeInMS : 0;
    countdownAnim.title = message.title || '';
    countdownAnim.colors = message.colors || countdownAnim.colors;

    // Switch view
    document.getElementById('centerNowText').style.display = 'none';
    document.getElementById('titleContentBox').style.display = 'block';

    // SERVER-AUTHORITATIVE RENDERING: display exactly what server sent (no local ticking)
    // Update title only when changed
    if (_lastTitle !== countdownAnim.title) {
      _lastTitle = countdownAnim.title;
      document.getElementById('title').textContent = _lastTitle;
      const textLength = _lastTitle.length;
      if (textLength <= 14) {
        $('#title').css('font-size', '10vw');
      } else if (textLength > 14 && textLength < 19) {
        $('#title').css('font-size', '8vw');
      } else if (textLength > 18) {
        $('#title').css('font-size', '7vw');
      }
    }

    // Update countdown string from server directly
    const serverString = message.time || msToTime(incomingMs);
    if (serverString !== _lastDisplayedString) {
      _lastDisplayedString = serverString;
      document.getElementById('start').textContent = serverString;
    }

    // Edge-triggered audio on threshold crossings
    maybeTriggerAudio(_prevCountDownMs, incomingMs);
    _prevCountDownMs = incomingMs;

    // Background color changes based on sign/thresholds
    let nextBg;
    if (incomingMs < (3 * -60000)) {
      nextBg = '#2b2b2b';
    } else if (incomingMs > 0) {
      nextBg = countdownAnim.colors.countUpColor;
    } else {
      nextBg = countdownAnim.colors.countDownColor;
    }
    if (document.body._lastBgColor !== nextBg) {
      document.body.style.backgroundColor = nextBg;
      document.body._lastBgColor = nextBg;
    }

    // Ensure no local animation continues when server drives UI
    if (countdownAnim.running && countdownAnim.rafId) {
      cancelAnimationFrame(countdownAnim.rafId);
      countdownAnim.running = false;
      countdownAnim.rafId = null;
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
    _lastDisplayedSecond = null;
    _lastDisplayedString = '';
    _lastTitle = '';
    resetAudioState();
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
   _audioEnabled = true;
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
  