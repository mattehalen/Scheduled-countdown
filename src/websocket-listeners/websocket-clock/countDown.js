console.log("---------- countDown.js");
const Clock             = require("./clock.js");
const AdminSettings     = require('../../services/admin-settings');
const TimeArraySorting  = require('./TimeArraySorting');

const setTimeoutTime = 150;

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
    //console.log(newOffsetTime());
    var d = new Date();
    var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${time}`);
    var ddInMs = dd.getTime()

    return ddInMs
}

async function CountDown() {
  try{
    const adminSettings     = await AdminSettings.get();
    let timeArraySorting    = await TimeArraySorting.Sorting();
    let timeArraySorting_startTime = await timeArraySorting[1];

    const OffsetTime  = (adminSettings.timeSettings.offsetTime)*(1000 * 60);
    const CountUp     = adminSettings.timeSettings.countUp;
    const CountDown     = adminSettings.timeSettings.countDown;
    var time = "";
    var now = await Clock.CurrentTimeInMs();
    var startTime = StartTimeInMs(timeArraySorting_startTime);
    startTime += OffsetTime;

    if (now > startTime) {
        time = now - startTime
        time = (msToTime(time))
    } else {
        time = startTime - now
        time = "-" + (msToTime(time))
    }

    return time;

  }
  catch(error){
    console.log(error);
  }
    setTimeout(CountDown, setTimeoutTime);

}
//CountDown();

async function CueCountDown() {
  try{
    const adminSettings             = await AdminSettings.get();
    let timeArraySorting            = await TimeArraySorting.Sorting();
    let timeArraySorting_startTime  = await timeArraySorting[1];
    let timeArraySorting_cueLength  = await timeArraySorting[2];
    var cueLength = timeArraySorting_cueLength;
    //--------------------------------------------------
    if (cueLength.length > 5) {
        cueLength = timeStringToMs(cueLength);
    } else {

        cueLength = cueLength + ":00"
        cueLength = timeStringToMs(cueLength);
    }
    //--------------------------------------------------
    let timeArraySorting_cueBool    = await timeArraySorting[3];
    let OffsetTime          = (adminSettings.timeSettings.offsetTime)*(1000 * 60);
    const CountUp           = adminSettings.timeSettings.countUp;
    const CountDown         = adminSettings.timeSettings.countDown;
    var startTime           = StartTimeInMs(timeArraySorting_startTime);
    var cueStarTime = (startTime - cueLength);
    cueStarTime += OffsetTime
    var now = await Clock.CurrentTimeInMs();
    var time = "";

    if (now > cueStarTime) {
        time = now - cueStarTime
        time = (msToTime(time))
    } else {
        time = cueStarTime - now
        time = "-" + (msToTime(time))
    }

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

  setTimeout(CueCountDown, setTimeoutTime);
  return time
}
CueCountDown();

module.exports = {
  CountDown,
  CueCountDown
}
