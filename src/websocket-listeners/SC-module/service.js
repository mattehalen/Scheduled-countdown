
const CLOCK       = require('./lib/clock');
const DB          = require('./lib/db');
const DB_SETTINGS = require('./lib/db-settings');
const COUNTDOWN   = require("./lib/countDown");
const MIDI        = require("./lib/midi");

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
async function midi(midi_interface_ID) {
  //console.log(midi_interface);
  let data = await MIDI.mtcTOString(midi_interface_ID);
  return data
}

module.exports = {
    currentTime,
    currentTimeMs,
    countDown,
    cueCountDown,
    settings,
    midi
}
