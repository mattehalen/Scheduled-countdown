console.log("---------- TimeArraySorting.js");
const Clock   = require("./clock.js");
const AdminSettings  = require('./../services/admin-settings');
const setTimeoutTime = 150;
let newArrayIndex = 0;
let scheduleBool;
var title,startTime;

async function Sorting(){
  try{
    const adminSettings = await AdminSettings.get();
    const scheduledTimes = adminSettings.schedule;
    const useMIDI_ProgramChange = adminSettings.timeSettings.useMIDI_ProgramChange;
    const WeekDays    = await AdminSettings.getWeekDay();
    const OffsetTime  = adminSettings.timeSettings.offsetTime;
    const CountUp     = adminSettings.timeSettings.countUp;

    if (newArrayIndex < scheduledTimes.length && useMIDI_ProgramChange === 0 && WeekDays) {

      var time = scheduledTimes[newArrayIndex].startTime
      var d = new Date();
      var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${time}`);
      if (Clock.CurrentTimeInMs > ((dd.getTime() + OffsetTime) + CountUp)) {
          newArrayIndex++;
      } else {
          // [title -> startTime -> cueLength -> cueBool -> fiveBool]
          // const a = TimeArraySorting.ArraySorting();
          // a.then(function(data){
          //     console.log(data[]);
          // })
          //startTime = scheduledTimes[newArrayIndex].startTime;
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
    console.log("./src/websocket-clock/TimeArraySorting.js");
    console.log(error);
  }
}

module.exports = {
  Sorting
}
