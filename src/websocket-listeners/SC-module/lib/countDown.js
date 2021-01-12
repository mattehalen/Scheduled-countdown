//console.log("---------- countDown.js");
const Clock             = require("./clock.js");
const DB                = require('./DB');
const DB_SETTINGS       = require('./db-settings');
const TimeArraySorting  = require('./TimeArraySorting');
let _offsetTime         =0;

const setTimeoutTime = 150;
let countDownBool;
let cueCountDownBool;

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
    const adminSettings     = await DB_SETTINGS.get();
    let timeArraySorting    = await TimeArraySorting.Sorting();
    let timeArraySorting_title = await timeArraySorting[0];
    let timeArraySorting_startTime = await timeArraySorting[1];


    if (timeArraySorting[0] === false) {
      return "CountDown STOPED due to > "+timeArraySorting[1]
    }

    const OffsetTime  = (adminSettings.timeSettings.offsetTime) *(60000);
    // system.on("offsetTime",function(data){
    //   _offsetTime = data;
    // });
    const CountUp     = (adminSettings.timeSettings.countUp)    *(60000);
    const CountDown   = (adminSettings.timeSettings.countDown)  *(60000);
    var time = "";
    var now = await Clock.CurrentTimeInMs();
    var startTime = StartTimeInMs(timeArraySorting_startTime);
    startTime += (_offsetTime*60000);
    var countDownTimeInMS = now - startTime;

    if (now > startTime) {
        time = now - startTime
        time = (msToTime(time))
    } else {
        time = startTime - now
        time = "-" + (msToTime(time))
    }

    //-----
    if (now > (startTime-CountDown) &&  now < (startTime+CountUp)) {
      countDownBool=true;
    }else{countDownBool=false}

    return {
      title:timeArraySorting_title,
      time:time,
      bool:countDownBool,
      CountUp:CountUp,
      CountDown:CountDown,
      countDownTimeInMS:countDownTimeInMS
    };


  }
  catch(error){
    console.log(error);
  }
    return false
}

async function CueCountDown() {
  try{
    const adminSettings             = await DB_SETTINGS.get();
    let timeArraySorting            = await TimeArraySorting.Sorting();
    let timeArraySorting_startTime  = await timeArraySorting[1];
    let timeArraySorting_cueLength  = await timeArraySorting[2];
    var cueLength = timeArraySorting_cueLength;

    if (timeArraySorting[0] === false) {
      return "CountDown STOPED due to > "+timeArraySorting[1]
    }

    //--------------------------------------------------
    if (cueLength.length > 5) {
        cueLength = timeStringToMs(cueLength);
    } else {

        cueLength = cueLength + ":00"
        cueLength = timeStringToMs(cueLength);
    }
    //--------------------------------------------------
    // system.on("offsetTime",function(data){
    //   _offsetTime = data;
    // });
    let timeArraySorting_cueBool    = await timeArraySorting[3];
    let OffsetTime          = (adminSettings.timeSettings.offsetTime) *(60000);
    const CountUp           = adminSettings.timeSettings.countUp      *(60000);
    const CountDown         = adminSettings.timeSettings.countDown    *(60000);
    var startTime           = StartTimeInMs(timeArraySorting_startTime);
    var cueStarTime = (startTime - cueLength);
    cueStarTime += (_offsetTime*60000);
    var now = await Clock.CurrentTimeInMs();
    var cueCountDownTimeInMS = now - cueStarTime;
    var time = "";

    if (now > cueStarTime) {
        time = now - cueStarTime
        time = (msToTime(time))
    } else {
        time = cueStarTime - now
        time = "-" + (msToTime(time))
    }

    if (now > (cueStarTime-CountDown) &&  now < (cueStarTime+CountUp)) {
      cueCountDownBool=true;
    }else{cueCountDownBool=false}

    var textString = "";
    if (now > (cueStarTime - CountDown) && now < (cueStarTime + (1000 * 60 * 2)) && timeArraySorting_cueBool == 1) {
        textString = "CUE - " + startTitleHolder + ": " + time
    } else {
        textString = ""
    }

  }
  catch(error){
    console.log(error);
  }

  return {
    time:time,
    bool:cueCountDownBool,
    cueCountDownTimeInMS:cueCountDownTimeInMS
  };
}

module.exports = {
  CountDown,
  CueCountDown
}