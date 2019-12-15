var startTimeArray  = [];
var startTitleArray = [];
var cueLengthArray  = [];
var offsetTimejson  = [];
var offsetTimeInit  = [];
var scheduledTimesArrayGlobal = [];
var scheduledTimesArrayBuffer     = [];
var nowTopRow = document.getElementById("nowTopRow");
var setTimeoutTime = 150;

var myLocalip = document.getElementById("myLocalip").textContent;
var myLocalipAndPort = myLocalip+":3000"
console.log(myLocalipAndPort);

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
var offsetTime = document.getElementById("offsetTime");


//--------------------------------------------------
// - getscheduledTimes
//--------------------------------------------------
function getscheduledTimes(){
  const request = async () => {
      const response = await fetch('/scheduledTimes.json');
      const json = await response.json();
      scheduledTimesArray = json;
      //console.log(scheduledTimesArray.profiles[0].title);
//----------------------------------------
      var i;
      var a;
      var b;
      var c;
      startTimeArray = [];
      startTitleArray = [];
      cueLengthArray  = [];
      for (i = 0; i < scheduledTimesArray.profiles.length; i++) {
        a = scheduledTimesArray.profiles[i].title;
        startTitleArray.push(a);
        b = scheduledTimesArray.profiles[i].startTime;
        startTimeArray.push(b);
        c = scheduledTimesArray.profiles[i].cueLength;
        cueLengthArray.push(c);
//----------------------------------------
      }
  }

  request();
};
getscheduledTimes();
//--------------------------------------------------

//--------------------------------------------------
// - deleteIndexInScheduledTimes
//--------------------------------------------------
function deleteIndexInScheduledTimes(){
  const request = async () => {
      const response = await fetch('/scheduledTimes.json');
      const json = await response.json();
      scheduledTimesArray = json;
      console.log("deleteIndexInScheduledTimes");
      console.log(scheduledTimesArray.profiles[0]);
      scheduledTimesArray.profiles.splice(0, 1);

//----------------------------------------
      var i;
      var a;
      var b;
      var c;
      startTimeArray = [];
      startTitleArray = [];
      cueLengthArray  = [];
      for (i = 0; i < scheduledTimesArray.profiles.length; i++) {
        a = scheduledTimesArray.profiles[i].title;
        startTitleArray.push(a);
        b = scheduledTimesArray.profiles[i].startTime;
        startTimeArray.push(b);
        c = scheduledTimesArray.profiles[i].cueLength;
        cueLengthArray.push(c);
      }
      //----------------------------------------
      console.log("here i am");
      sendDB_To_Socket_On_Delete();
  }

  request();
};
//deleteIndexInScheduledTimes();
//--------------------------------------------------

//--------------------------------------------------
// - getOffsetTime
//--------------------------------------------------
function getOffsetTime(){
  const request = async () => {
      const response = await fetch('/variables.json');
      const json = await response.json();
      offsetTimejson = json;
      //console.log("Get offsetTime: "+offsetTimejson.offsetTime);
      offsetTimeInit = offsetTimejson.offsetTime;
  }

  request();
};
getOffsetTime();
//--------------------------------------------------

//--------------------------------------------------
// - sortscheduledTimes
//--------------------------------------------------
function sortscheduledTimes(){
  const request = async () => {
      const response = await fetch('/scheduledTimes.json');
      const json = await response.json();
      scheduledTimesArray = json;
      console.log("Before Sorting");
      console.log(scheduledTimesArray.profiles);

//--------------------------------------------------
      sleep(100).then(() => {
        console.log("Sleep");
        scheduledTimesArray.profiles.sort(function (a, b)
          {
            return a.startTime.localeCompare(b.startTime);
          });
          scheduledTimesArrayBuffer = scheduledTimesArray;
          console.log(scheduledTimesArrayBuffer.profiles[0].title);

          for(let i=0; i < startTitleArray.length; i++)   {startTitleArray[i] = scheduledTimesArrayBuffer.profiles[i].title};
          for(let i=0; i < startTimeArray.length; i++)   {startTimeArray[i] = scheduledTimesArrayBuffer.profiles[i].startTime};
          for(let i=0; i < cueLengthArray.length; i++)   {cueLengthArray[i] = scheduledTimesArrayBuffer.profiles[i].cueLength};
          //cueLengthArray

          sleep(100).then(() => {
            console.log("sleep inside of SLEEP");
            printArraysToElements();
            socket.emit("writeToScheduledTimesjson",{
              startTitleArray: startTitleArray,
              startTimeArray: startTimeArray,
              cueLengthArray: cueLengthArray
            });
          });
        });
//--------------------------------------------------
  }
  request();
};
 //sortscheduledTimes();
//--------------------------------------------------











//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//- CurrentTime
//--------------------------------------------------
function nowClock() {
  //console.log("hello");
  var d = new Date();
  nowInMs = d.getTime();
  var s = "";
  s += (10 > d.getHours  () ? "0": "") + d.getHours  () + ":";
  s += (10 > d.getMinutes() ? "0": "") + d.getMinutes() + ":";
  s += (10 > d.getSeconds() ? "0": "") + d.getSeconds();

  //nowText.textContent = s;
  nowTopRow.textContent = s;
  setTimeout(nowClock, setTimeoutTime - d.getTime() % 1000 + 20);
  return d;

}
nowClock();
//--------------------------------------------------




















//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
// iP 192.168.100.85
var socket = io.connect(myLocalipAndPort);
console.log("adminSocketScript Loaded");
//---------- My sockets
socket.emit("start", { });

sleep(1000).then(() => {
  //console.log(startTitleArray);
  //console.log(startTimeArray);
  socket.emit("sendDB_To_Socket", {
    startTitleArray: startTitleArray,
    startTimeArray: startTimeArray,
    cueLengthArray: cueLengthArray
  });
  });
//--------------------------------------------------




//---------- I think i can delete this
//--------------------------------------------------
socket.on("sendDB_TO_Admin", function (data){
  startTimeArray  = data.socketDBArray.startTimeArray;
  startTitleArray = data.socketDBArray.startTitleArray;
  cueLengthArray  = data.socketDBArray.cueLengthArray;
});
//--------------------------------------------------
function updateScheduledTimesArray(){
  console.log("updateScheduledTimesArray");
  for(let i=0; i < startTitleArray.length; i++) {startTitleArray[i] = $("#title"+i).val()}
  for(let i=0; i < startTimeArray.length; i++) {startTimeArray[i] = $("#startTime"+i).val()}
  for(let i=0; i < cueLengthArray.length; i++) {cueLengthArray[i] = $("#cueLength"+i).val()}

  console.log(cueLengthArray);
  //console.log("startTitleArray after: "+startTitleArray + startTimeArray);
   socket.emit("writeToScheduledTimesjson",{
     startTitleArray: startTitleArray,
     startTimeArray: startTimeArray,
     cueLengthArray: cueLengthArray
   });
   socket.emit('updateScheduledTimesArray',{
     startTitleArray: startTitleArray,
     startTimeArray: startTimeArray,
     cueLengthArray: cueLengthArray
   });

   sleep(1000).then(() => {
     getscheduledTimes();
   });
};
$("#updateScheduledTimesArray").on('click', function () {
socket.emit("updatebutton_To_Socket",{})
});
socket.on("updatebutton_From_Socket", function(data){
  updateScheduledTimesArray();
})
//--------------------------------------------------
socket.on("updateDB_From_Socket", function(data) {
  //console.log("updateDB_From_Socket: ");
  startTimeArray  = data.startTimeArray;
  startTitleArray = data.startTitleArray;
  cueLengthArray  = data.cueLengthArray;
  sleep(100).then(() => {
    printArraysToElements();
  });
});
//--------------------------------------------------
//pushGetscheduledTimes
socket.on("pushGetscheduledTimes", function(data) {
  console.log("pushGetscheduledTimes: ");
  getscheduledTimes();

  sleep(100).then(() => {
    printArraysToElements();
  });

});


$("#sorting").on('click', function() {
  socket.emit("sortingButton_To_Socket",{})

});
socket.on("sortingButton_From_Socket", function(data){
  console.log("knapp funkar");

  updateScheduledTimesArray();
  sleep(750).then(() => {
    sortscheduledTimes();

    sleep(1000).then(() => {
      //document.location.reload();
    });

  });

})

//--------------------------------------------------
// Button offsetPlus
$("#offsetPlus").on('click', function() {
  offsetTimeInit += 1;
  socket.emit('updateOffsetTimePlus', {
    offsetTime: offsetTimeInit
  });
});
//--------------------------------------------------
// Button offsetMinus
$("#offsetMinus").on('click', function() {
  offsetTimeInit -= 1;
  //$("#offsetTime").html(offsetTimeInit);
  socket.emit('updateOffsetTimeMinus', {
    offsetTime: offsetTimeInit
  });
});
//offsetReset
$("#offsetReset").on('click', function() {
  offsetTimeInit = 0;
  //$("#offsetTime").html(offsetTimeInit);
  socket.emit('updateOffsetTimeReset', {
    offsetTime: offsetTimeInit
  });
});
//--------------------------------------------------
//---------- loadDefault
$("#loadDefaultArray").on('click', function() {
  console.log("loadDefaultArray");
  socket.emit('loadDefaultToSocket', {
    message: "loadDefaultToSocket: Sent"
  });
});
//--------------------------------------------------
//---------- writeDefaultArray
$("#writeDefaultArray").on('click', function() {
  console.log("writeDefaultArray");

  getElementsToArrays();

  sleep(100).then(() => {
    console.log("AFTER SLEEP: " + startTitleArray);
    socket.emit('writeDefaultToSocket', {
      startTitleArray: startTitleArray,
      startTimeArray: startTimeArray,
      cueLengthArray: cueLengthArray
    });

  });

});
//--------------------------------------------------
//--------------------------------------------------
//updateOffsetTime_From_Socket
socket.on("updateOffsetTime_From_Socket", function (data){
  console.log("updateOffsetTime_From_Socket");
  console.log(data);
  offsetTimeInit = data.offsetTime;
  $("#offsetTime").html(offsetTimeInit);
});
//--------------------------------------------------

function delete_button_click(listIndex){
      alert(listIndex);
      document.getElementById(listIndex).remove();
      deleteIndexInScheduledTimes();
  };
function printArraysToElements(){
  console.log("printArraysToElements");
     for(let i=0; i < startTitleArray.length; i++)   {document.getElementById("title"+i).value = startTitleArray[i]};
     for(let i=0; i < startTimeArray.length; i++)   {document.getElementById("startTime"+i).value = startTimeArray[i]};
     for(let i=0; i < cueLengthArray.length; i++)   {document.getElementById("cueLength"+i).value = cueLengthArray[i]};


};
function getElementsToArrays(){
  console.log("getElementsToArrays()");
  for(let i=0; i < startTitleArray.length; i++) {startTitleArray[i] = $("#title"+i).val()}
  for(let i=0; i < startTimeArray.length; i++) {startTimeArray[i] = $("#startTime"+i).val()}
  for(let i=0; i < cueLengthArray.length; i++) {cueLengthArray[i] = $("#cueLength"+i).val()}
  console.log(startTimeArray);
};
function sendDB_To_Socket_On_Delete(){
  console.log("sendDB_To_Socket_On_Delete")

  socket.emit("writeToScheduledTimesjson",{
    startTitleArray: startTitleArray,
    startTimeArray: startTimeArray,
    cueLengthArray: cueLengthArray
  });
  socket.emit('updateScheduledTimesArray',{
    startTitleArray: startTitleArray,
    startTimeArray: startTimeArray,
    cueLengthArray: cueLengthArray
  });

};

     socket.on('user disconnected', function (data) {
     });
