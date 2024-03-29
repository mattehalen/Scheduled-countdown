//console.log("---------- countDown.js");
const Clock             = require("./clock.js");
const DB                = require('./../../../services/admin-settings');

const TimeArraySorting  = require('./TimeArraySorting');
let _offsetTime         = 0;

const setTimeoutTime = 150;
let countDownBool;
let cueCountDownBool;
let offsetTime_bool = true;

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}
function timeStringToMs(t) {
    if (t > 5) {
        var r = Number(t.split(':')[0]) * (60 * 60000) + Number(t.split(':')[1]) * (60000) + Number(t.split(':')[2]) * (1000);
    } else {
        t = t + ":00"
        var r = Number(t.split(':')[0]) * (60 * 60000) + Number(t.split(':')[1]) * (60000) + Number(t.split(':')[2]) * (1000);
    }
    return r;

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
  try{
    const adminSettings     = await DB.getDbSettings();
    let timeArraySorting    = await TimeArraySorting.Sorting();
    let timeArraySorting_title = await timeArraySorting[0];
    let timeArraySorting_startTime = await timeArraySorting[1];
    let timeArraySorting_fiveBool    = await timeArraySorting[4];
    let colors = adminSettings.Color;


    if (timeArraySorting[0] === false) {
      return "CountDown STOPED due to > "+timeArraySorting[1]
    }

    const OffsetTime  = (adminSettings.timeSettings.offsetTime) *(60000);
    // console.log("---------- >>> countDown.js -> OffsetTime = " + OffsetTime)
    const CountUp     = (adminSettings.timeSettings.countUp)    *(60000);
    const CountDown   = (adminSettings.timeSettings.countDown)  *(60000);
    var time = "";
    var now = await Clock.CurrentTimeInMs();
    var startTime = StartTimeInMs(timeArraySorting_startTime);

    startTime += (OffsetTime);
    var countDownTimeInMS = now - startTime;

    if (now > startTime) {
        time = now - (startTime)
        time = (msToTime(time))
    } else {
        time = (startTime+1000) - now
        time = "-" + (msToTime(time))
    }

    //-----
    if (now > (startTime-CountDown) &&  now < (startTime+CountUp)) {
      countDownBool=true;
    }else{countDownBool=false}

    if (time == "-aN:aN:aN"){
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

    var now = await Clock.CurrentTimeInMs();
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
