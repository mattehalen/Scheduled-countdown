//console.log("---------- TimeArraySorting.js");
const Clock             = require("./clock.js");
//const DB                = require('./db');
const DB                = require('./../../../services/admin-settings');
//const DB_SETTINGS       = require('./db-settings');
const setTimeoutTime = 150;
let newArrayIndex = 0;
let scheduleBool;
var title,startTime;

async function Sorting(){
  try{
    //console.log("----------> TimeArraySorting -> Sorting()");

    const adminSettings = await DB.get();
    const SETTINGS      = await DB.getDbSettings()
    const scheduledTimes = adminSettings.schedule;
    const useMIDI_ProgramChange = SETTINGS.MIDI.useMIDI_ProgramChange;
    const WeekDays    = await DB.getWeekDay();
    const OffsetTime  = SETTINGS.timeSettings.offsetTime    *60000;
    const CountUp     = SETTINGS.timeSettings.countUp       *60000;

    if(useMIDI_ProgramChange != 0 ){
      console.log("[TimeArraySorting] -> useMIDI_ProgramChange = TRUE(1)");
      return [false,"useMIDI_ProgramChange = "+useMIDI_ProgramChange]
    }
    if(WeekDays === false ){
      //console.log("[TimeArraySorting] -> WeekDays = FALSE(0)");
      return [false,"WeekDays = "+WeekDays]
    }

    if (newArrayIndex < scheduledTimes.length && useMIDI_ProgramChange === 0 && WeekDays) {
      var time = scheduledTimes[newArrayIndex].startTime
      var d = new Date();
      var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${time}`);

      // console.log(Clock.CurrentTimeInMs());
      // console.log(d);
      // console.log(dd);
      // console.log(new Date((dd.getTime() + OffsetTime) + CountUp));
      // console.log(OffsetTime);
      // console.log(CountUp);
      // console.log(Clock.CurrentTimeInMs() > ((dd.getTime() + OffsetTime) + CountUp));
      // console.log(newArrayIndex);
      // console.log(time);
      if (Clock.CurrentTimeInMs() > ((dd.getTime() + OffsetTime) + CountUp)) {
          newArrayIndex++;
      } else {
        //console.log(scheduledTimes[newArrayIndex].title);
          return [
            scheduledTimes[newArrayIndex].title,
            scheduledTimes[newArrayIndex].startTime,
            scheduledTimes[newArrayIndex].cueLength,
            scheduledTimes[newArrayIndex].cueBool,
            scheduledTimes[newArrayIndex].fiveBool
          ]
      }

      if (newArrayIndex === scheduledTimes.length) {
          newArrayIndex = 0;
      }
    }

  }
  catch(error){
    console.log("./src/websocket-clock/TimeArraySorting.js -> sorting()");
    console.log(error);
  }
  return [null,null,null,null,null]
}

function reset_newArrayIndex(){
  newArrayIndex = 0;
}

function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;
  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}
function pad(n, z) {
  z = z || 2;
  return ('00' + n).slice(-z);
}

module.exports = {
  Sorting,
  reset_newArrayIndex
}
