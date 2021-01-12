
const CLOCK       = require('./lib/clock');
const DB          = require('./lib/db');
const DB_SETTINGS = require('./lib/db-settings');
const COUNTDOWN   = require("./lib/countDown");

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
    settings
}
