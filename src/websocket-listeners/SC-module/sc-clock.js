
const CLOCK       = require('../SC-module/lib/clock');
const DB          = require('../SC-module/lib/db');
const DB_SETTINGS = require('../SC-module/lib/db-settings');
const COUNTDOWN   = require("../SC-module/lib/countDown");

function currentTime(){
  return CLOCK.CurrentTime();
};
function currentTimeMs(){
  return CLOCK.CurrentTimeInMs();
};
async function countDown() {
  let data = await COUNTDOWN.CountDown();
  return data
}
async function cueCountDown() {
  let data = await COUNTDOWN.CueCountDown();
  return data
}
async function settings() {
  let data = await DB_SETTINGS.get();
  return data
}

module.exports = {
  currentTime,
  currentTimeMs,
  countDown,
  cueCountDown,
  settings,
};
