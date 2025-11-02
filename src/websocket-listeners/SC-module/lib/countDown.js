const serverClock = require("./server-clock");
const DB = require('./../../../services/admin-settings');
const TimeArraySorting = require('./TimeArraySorting');

let _offsetTime = 0;
const setTimeoutTime = 150;
let countDownBool;
let cueCountDownBool;
let offsetTime_bool = true;

// Convert milliseconds to HH:MM:SS format
function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}

// Convert time string to milliseconds
function timeStringToMs(t) {
    // Add seconds if not provided
    if (!t.includes(':')) {
        t += ':00';
    }
    
    const parts = t.split(':');
    return (
        Number(parts[0]) * 3600000 + // hours to ms
        Number(parts[1]) * 60000 +   // minutes to ms
        (parts[2] ? Number(parts[2]) * 1000 : 0) // seconds to ms (if provided)
    );

}
function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
}
function StartTimeInMs(time) {
    var d = new Date();
    var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${time}`);
    var ddInMs = dd.getTime()

    return ddInMs
}

async function CountDown() {
    try {
        const adminSettings = await DB.getDbSettings();
        let timeArraySorting = await TimeArraySorting.Sorting();
        let timeArraySorting_title = await timeArraySorting[0];
        let timeArraySorting_startTime = await timeArraySorting[1];
        let timeArraySorting_fiveBool = await timeArraySorting[4];
        let colors = adminSettings.Color;

        if (timeArraySorting[0] === false) {
            return "CountDown STOPPED due to > " + timeArraySorting[1];
        }

        // Get time settings in milliseconds
        const OffsetTime = adminSettings.timeSettings.offsetTime * 60000;  // minutes to ms
        const CountUp = adminSettings.timeSettings.countUp * 60000;       // minutes to ms
        const CountDown = adminSettings.timeSettings.countDown * 60000;   // minutes to ms

        // Get current time from synchronized server clock
        const now = serverClock.getCurrentTimeMs();
        const startTime = StartTimeInMs(timeArraySorting_startTime) + OffsetTime;
        const countDownTimeInMS = now - startTime;

        // Calculate display time
        let time;
        if (now > startTime) {
            // Count up
            time = msToTime(now - startTime);
        } else {
            // Count down
            time = "-" + msToTime((startTime + 1000) - now);
        }

        // Check if we're in the countdown period
        countDownBool = now > (startTime - CountDown) && now < (startTime + CountUp);

        // Handle invalid time
        if (time === "-aN:aN:aN") {
            time = "No more entries today";
        }


    return {
      title:timeArraySorting_title,
      time:time,
      offsetTime:OffsetTime / (60000),
      offsetTime_bool:offsetTime_bool,
      bool:countDownBool,
      fiveBool:timeArraySorting_fiveBool,
      CountUp:CountUp,
      CountDown:CountDown,
      countDownTimeInMS:countDownTimeInMS,
      colors: colors
    };


  }
  catch(error){
    console.log(error);
  }
    return false
}

async function CueCountDown() {
  const adminSettings             = await DB.getDbSettings();
  let colors = adminSettings.Color;
  try{
    let timeArraySorting            = await TimeArraySorting.Sorting();
    let timeArraySorting_startTime  = await timeArraySorting[1];
    let timeArraySorting_cueLength  = await timeArraySorting[2];
    var cueLength = timeArraySorting_cueLength;
    let colors = adminSettings.Color;

    if (timeArraySorting[0] === false) {
      return "CountDown STOPED due to > "+timeArraySorting[1]
    }

    //--------------------------------------------------
    if (cueLength) {
      if (cueLength.length > 5) {
        cueLength = timeStringToMs(cueLength);
    } else {

        cueLength = cueLength + ":00"
        cueLength = timeStringToMs(cueLength);
    }
    }
   
    //--------------------------------------------------
    let timeArraySorting_cueBool    = await timeArraySorting[3];
    let OffsetTime          = (adminSettings.timeSettings.offsetTime) *(60000);
    const CountUp           = adminSettings.timeSettings.cueCountUp      *(60000);
    const CountDown         = adminSettings.timeSettings.cueCountDown    *(60000);
    var startTime           = StartTimeInMs(timeArraySorting_startTime);
    var cueStarTime = (startTime - cueLength);
    cueStarTime += (OffsetTime);

    var now = serverClock.getCurrentTimeMs();
    var cueCountDownTimeInMS = now - cueStarTime;
    var time = "";

    if (now > cueStarTime) {
        time = now - cueStarTime
        time = (msToTime(time))
    } else {
        time = (cueStarTime+1000) - now
        time = "-" + (msToTime(time))
    }

    if (now > (cueStarTime-CountDown) &&  now < (cueStarTime+CountUp) && timeArraySorting_cueBool == 1) {
      cueCountDownBool=true;
    }else{cueCountDownBool=false}

  }
  catch(error){
    console.log(error);
  }
 
  return {
    time:time,
    bool:cueCountDownBool,
    cueCountDownTimeInMS:cueCountDownTimeInMS,
    colors: colors
  };
}

async function inc_Offset(){
  const adminSettings   = await DB.getDbSettings();
  try{
    adminSettings.timeSettings.offsetTime ++
    console.log(adminSettings)
    await DB.writeDbSettings(adminSettings)
    await TimeArraySorting.reset_newArrayIndex()

  }
  catch(error){
    console.log(error);
  }

}
async function dec_Offset(){
  const adminSettings   = await DB.getDbSettings();
  try{
    adminSettings.timeSettings.offsetTime --
    console.log(adminSettings)
    await DB.writeDbSettings(adminSettings)
    await TimeArraySorting.reset_newArrayIndex()

  }
  catch(error){
    console.log(error);
  }
}
async function reset_Offset(){
  const adminSettings   = await DB.getDbSettings();
  try{
    adminSettings.timeSettings.offsetTime = 0
    console.log(adminSettings)
    await DB.writeDbSettings(adminSettings)
    await TimeArraySorting.reset_newArrayIndex()

  }
  catch(error){
    console.log(error);
  }
}
function setOffsetTime_bool(data){
  console.log("----------> setOffsetTime_bool <---------");
  offsetTime_bool = data;
}

module.exports = {
  CountDown,
  CueCountDown,
  inc_Offset,
  dec_Offset,
  reset_Offset,
  setOffsetTime_bool
}
