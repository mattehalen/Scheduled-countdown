// ---------------------------------------------
// 5-Minute Countdown (client)
// ---------------------------------------------
// Shows overlay only when: bool truthy, fiveBool != 0, and -5min < t < 0
// Optimized to avoid redundant DOM writes and align to clock seconds

// Constants
var FIVE_MIN_MS = 5 * 60000;           // window size (-5:00 .. 0)
var DISPLAY_OFFSET_MS = 60000;         // subtract 1 minute for display (legacy behavior)
var REQUEST_TIMEOUT_MS = 900;          // abort HTTP if it takes too long

// Convert milliseconds difference to minute value (positive minutes)
function msToTime(ms) {
  // Incoming value is negative in countdown window
  ms = ms * -1;
  var mins = Math.floor((ms / (1000 * 60)) % 60);
  return mins; // UI only displays minutes
}


// Cache DOM references
var countDownEl = document.getElementById("countDown");
var textEl = document.getElementById("text");

// Minimal state to avoid redundant DOM work
var _visible = null;
var _lastMinutes = null;

function setVisible(show) {
  if (_visible === show) return;
  if (show) {
    if (countDownEl) countDownEl.style.color = "rgba(255, 255, 255, 1)";
    if (textEl) textEl.style.color = "rgba(255, 255, 255, 1)";
    document.body.style.backgroundColor = "rgba(0, 0, 0, 1)";
  } else {
    if (countDownEl) countDownEl.style.color = "rgba(255, 255, 255, 0)";
    if (textEl) textEl.style.color = "rgba(255, 255, 255, 0)";
    document.body.style.backgroundColor = "rgba(0, 0, 0, 0)";
  }
  _visible = show;
}

function updateDisplay(minutes) {
  if (countDownEl && _lastMinutes !== minutes) {
    countDownEl.innerText = minutes;
    _lastMinutes = minutes;
  }
}

function shouldShow(message) {
  if (!message) return false;
  // Keep loose checks to match server types: bool may be truthy; fiveBool may be "1" or 1
  if (!message.bool) return false;
  if (message.fiveBool == 0) return false;
  if (typeof message.countDownTimeInMS !== "number") return false;
  var t = message.countDownTimeInMS;
  return t < 0 && t > -FIVE_MIN_MS;
}

// Simple fetch with timeout and abort, avoids piling up requests
var _inflight;
function fetchJson(url) {
  if (_inflight) {
    _inflight.abort();
    _inflight = null;
  }
  var controller = new AbortController();
  _inflight = controller;
  var timer = setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS);
  return fetch(url, { signal: controller.signal })
    .then(function (r) { clearTimeout(timer); return r.ok ? r.json() : Promise.reject(new Error(r.statusText)); })
    .finally(function () { if (_inflight === controller) _inflight = null; });
}

function tick() {
  fetchJson('/Countdown/getCountDown')
    .then(function (message) {
      if (shouldShow(message)) {
        setVisible(true);
        var minutes = msToTime(message.countDownTimeInMS - DISPLAY_OFFSET_MS);
        updateDisplay(minutes);
      } else {
        setVisible(false);
      }
    })
    .catch(function () {
      // On errors, hide UI gracefully
      setVisible(false);
    })
    .finally(function () {
      // Align next run to the second boundary
      var delay = 1000 - (Date.now() % 1000);
      setTimeout(tick, delay);
    });
}

// Start polling aligned to the next second
tick();

setInterval(function(){
location.reload();
}, 1000*60*60*24);


// Backward-compatible helpers retained (in case other code calls them)
function displayTrue() { setVisible(true); }
function displayFalse() { setVisible(false); }

// Ensure initial state is hidden until data says otherwise
try { displayFalse(); } catch (e) { /* ignore */ }