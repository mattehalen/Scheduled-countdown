console.log("YES ");
//--------------------------------------------------
// - getscheduledTimes
//--------------------------------------------------
function getscheduledTimes(){
  const request = async () => {
      const response = await fetch('/scheduledTimes.json');
      const json = await response.json();
      scheduledTimesArray = json;
      console.log(scheduledTimesArray.profiles[0].title);
      //console.log(scheduledTimesArray.profiles.length  + "the length of the array");
      //scheduledTimesArray.profiles[0].title = "TEST"

      console.log(scheduledTimesArray.profiles[0].title);



//----------------------------------------
      var i;
      var a;
      var b;
      startTimeArray = [];
      startTitleArray = [];
      // for (i = 0; i < scheduledTimesArray.profiles.length; i++) {
      //   a = scheduledTimesArray.profiles[i].title;
      //   startTitleArray.push(a);
      //   b = scheduledTimesArray.profiles[i].startTime;
      //   startTimeArray.push(b);
//----------------------------------------
      //}
  }

  request();
};
//getscheduledTimes();
//--------------------------------------------------
