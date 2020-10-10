var startTimeArray = [];
var startTitleArray = [];
var cueLengthArray = [];
var cueBoolArray  = [];
var fiveBoolArray = [];
var offsetTimejson = [];
var offsetTimeInit = [];
var nowTopRow = document.getElementById("nowTopRow");
var cueTimeText = document.getElementById("cueTime");
var timeCode = document.getElementById("timeCode");
var myIpArrayBool = 0;
var toggleMainPreview = false;

var myLocalip = document.getElementById("myLocalip").textContent;
var myLocalipAndPort = myLocalip
console.log(myLocalipAndPort);

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
var offsetTime = document.getElementById("offsetTime");


//--------------------------------------------------
function deleteIndexInScheduledTimes(index) {
  const request = async () => {
    const response = await fetch('/scheduledTimes.json');
    const json = await response.json();
    scheduledTimesArray = json;
    console.log("deleteIndexInScheduledTimes");
    console.log(scheduledTimesArray.profiles[index]);
    scheduledTimesArray.profiles.splice(index, 1);

    //----------------------------------------
    var i;
    var a;
    var b;
    var c;
    var d;
    var e;
    startTimeArray  = [];
    startTitleArray = [];
    cueLengthArray  = [];
    cueBoolArray    = [];
    fiveBoolArray   = [];
    for (i = 0; i < scheduledTimesArray.profiles.length; i++) {
      a = scheduledTimesArray.profiles[i].title;
      startTitleArray.push(a);
      b = scheduledTimesArray.profiles[i].startTime;
      startTimeArray.push(b);
      c = scheduledTimesArray.profiles[i].cueLength;
      cueLengthArray.push(c);
      d = scheduledTimesArray.profiles[i].cueBool;
      cueBoolArray.push(d);
      e = scheduledTimesArray.profiles[i].fiveBool;
      fiveBoolArray.push(e);

    }
    //----------------------------------------
    console.log("here i am");
    sendDB_To_Socket_On_Delete();
  }

  request();
};
function getOffsetTime() {
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

function getscheduledTimes() {
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
    var d;
    var e;
    startTimeArray = [];
    startTitleArray = [];
    cueLengthArray = [];
    cueBoolArray  = [];
    fiveBoolArray   = [];
    for (i = 0; i < scheduledTimesArray.profiles.length; i++) {
      a = scheduledTimesArray.profiles[i].title;
      startTitleArray.push(a);
      b = scheduledTimesArray.profiles[i].startTime;
      startTimeArray.push(b);
      c = scheduledTimesArray.profiles[i].cueLength;
      cueLengthArray.push(c);
      d = scheduledTimesArray.profiles[i].cueBool;
      cueBoolArray.push(d);
      e = scheduledTimesArray.profiles[i].fiveBool;
      fiveBoolArray.push(e);
      //----------------------------------------
    }
  }

  request();
};
getscheduledTimes();
//--------------------------------------------------




//--------------------------------------------------
var socket = io.connect(myLocalipAndPort);
socket.emit("start", {});
socket.emit("getTimeCode",{});

//sendDB_To_Socket
sleep(1000).then(() => {
  socket.emit("sendDB_To_Socket", {
    startTitleArray: startTitleArray,
    startTimeArray: startTimeArray,
    cueLengthArray: cueLengthArray,
    cueBoolArray: cueBoolArray,
    fiveBoolArray: fiveBoolArray

  });
});
//--------------------------------------------------
//--------------------------------------------------
socket.on("sendDB_TO_Admin", function(data) {
  startTimeArray  = data.socketDBArray.startTimeArray;
  startTitleArray = data.socketDBArray.startTitleArray;
  cueLengthArray  = data.socketDBArray.cueLengthArray;
  cueBoolArray    = data.socketDBArray.cueBoolArray;
  fiveBoolArray   = data.socketDBArray.fiveBoolArray
});
socket.on("updatebutton_From_Socket", function(data) {
  updateScheduledTimesArray();
})
socket.on("updateDB_From_Socket", function(data) {
  //console.log("updateDB_From_Socket: ");
  startTimeArray  = data.startTimeArray;
  startTitleArray = data.startTitleArray;
  cueLengthArray  = data.cueLengthArray;
  cueBoolArray    = data.cueBoolArray;
  fiveBoolArray   = data.fiveBoolArray;
  sleep(100).then(() => {
    printArraysToElements();
  });
});
socket.on("pushGetscheduledTimes", function(data) {
  console.log("pushGetscheduledTimes: ");
  getscheduledTimes();

  sleep(100).then(() => {
    printArraysToElements();
  });

});
socket.on("sortingButton_From_Socket", function(data) {
  console.log("knapp funkar");

  updateScheduledTimesArray();
  sleep(750).then(() => {
    //sortscheduledTimes();
    // window.location.reload(true)

    sleep(1000).then(() => {
      //document.location.reload();
    });

  });

})
socket.on("updateOffsetTime_From_Socket", function(data) {
  console.log("updateOffsetTime_From_Socket");
  console.log(data);
  offsetTimeInit = data.offsetTime;
  $("#offsetTime").html(offsetTimeInit);
});
socket.on("getCueTimeString_From_Socket", function(data) {
  cueTimeText.textContent = data.string;
});
socket.on("changesOnScheduledTimes", function(data) {
  console.log("changesOnScheduledTimes");
  alert("Changes to ScheduledTimes.json has been made. Please update browser to se them");
});
socket.on("centerTextContent", function(data) {
  nowTopRow.textContent = data.newCurrentTime
});
socket.on("sendIpArrayToAdminPage", function(data){
  // console.log("sendIpArrayToAdminPage");
  // console.log(data.myIpArray);

  var select = document.getElementById("selectNumber");
  var options = data.myIpArray;

  if (myIpArrayBool != 1) {
    for(var i = 0; i < options.length; i++) {
        var opt = options[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
        myIpArrayBool =1;
    }
  }


});
socket.on("send_Delete_Button_from_Socket", function(data) {
  console.log(data);
  listIndex = data.listIndex
  console.log("send_Delete_Button_from_Socket: listIndex= " + listIndex);

  document.getElementById(listIndex).remove();
  deleteIndexInScheduledTimes(listIndex);
  sleep(1000).then(() => {
    // window.location.reload(true)
  });
});
socket.on("sendTimeCode",function(data){
  timeCode.textContent = data.smpteString
  //console.log(data.smpteString);

});
//--------------------------------------------------
$("#updateScheduledTimesArray").on('click', function() {
  socket.emit("updatebutton_To_Socket", {})
});
$("#sorting").on('click', function() {
  socket.emit("sortingButton_To_Socket", {})
});
$("#offsetPlus").on('click', function() {
  offsetTimeInit += 1;
  socket.emit('updateOffsetTimePlus', {
    offsetTime: offsetTimeInit
  });
});
$("#offsetMinus").on('click', function() {
  offsetTimeInit -= 1;
  //$("#offsetTime").html(offsetTimeInit);
  socket.emit('updateOffsetTimeMinus', {
    offsetTime: offsetTimeInit
  });
});
$("#offsetReset").on('click', function() {
  offsetTimeInit = 0;
  //$("#offsetTime").html(offsetTimeInit);
  socket.emit('updateOffsetTimeReset', {
    offsetTime: offsetTimeInit
  });
});
$("#loadDefaultArray").on('click', function() {
  console.log("loadDefaultArray");
  socket.emit('loadDefaultToSocket', {
    message: "loadDefaultToSocket: Sent"
  });

  sleep(250).then(() => {
    // window.location.reload(true)
  });

});
$("#writeDefaultArray").on('click', function() {
  console.log("writeDefaultArray");

  getElementsToArrays();

  sleep(100).then(() => {
    console.log("AFTER SLEEP: " + startTitleArray);
    socket.emit('writeDefaultToSocket', {
      startTitleArray: startTitleArray,
      startTimeArray: startTimeArray,
      cueLengthArray: cueLengthArray,
      cueBoolArray: cueBoolArray,
      fiveBoolArray: fiveBoolArray
    });

  });

});
$("#addNewRow").on('click', function() {
  console.log("addNewRow");
  socket.emit("send_addNewRow_To_Socket", {})

  sleep(1500).then(() => {
    //sortscheduledTimes();
    // window.location.reload(true)
  });
});
$(":input").keypress(function (e) {
    if (e.which == 13) {
      socket.emit("sortingButton_To_Socket", {})
        alert('enter key is pressed and list is updated');
    }
});

//-- New Buttons for Reseting 5min CountDown
$("#reloadFiveMinCountDown").on("click",function (e) {
    socket.emit("reloadFiveMinCountDown", {
    });
});
$("#one").on("click",function (e) {
    socket.emit("force5MinCountDownCase", {
      case:1
    });
});
$("#two").on("click",function (e) {
    socket.emit("force5MinCountDownCase", {
      case:2
    });
});
$("#three").on("click",function (e) {
    socket.emit("force5MinCountDownCase", {
      case:3
    });
});
$("#four").on("click",function (e) {
    socket.emit("force5MinCountDownCase", {
      case:4
    });
});
$("#five").on("click",function (e) {
    socket.emit("force5MinCountDownCase", {
      case:5
    });
});
$("#alpha").on("click",function (e) {
    socket.emit("force5MinCountDownCase", {
      case:0
    });
});
//--------------------------------------------------
function updateScheduledTimesArray() {
  console.log("updateScheduledTimesArray");
  console.log(fiveBoolArray);
  for (let i = 0; i < startTitleArray.length; i++) {
    startTitleArray[i] = $("#title" + i).val()
  }
  for (let i = 0; i < startTimeArray.length; i++) {
    startTimeArray[i] = $("#startTime" + i).val()
  }
  for (let i = 0; i < cueLengthArray.length; i++) {
    cueLengthArray[i] = $("#cueLength" + i).val()
  }
  for (let i = 0; i < cueBoolArray.length; i++) {
    cueBoolArray[i] = $("#cueBool" + i).val()
  }
  for (let i = 0; i < fiveBoolArray.length; i++) {
    fiveBoolArray[i] = $("#fiveBool" + i).val()
    console.log(fiveBoolArray[i]);
  }
  console.log("------------------------------> socket emit writeToScheduledTimesjson = "+fiveBoolArray);
  socket.emit("writeToScheduledTimesjson", {
    startTitleArray: startTitleArray,
    startTimeArray: startTimeArray,
    cueLengthArray: cueLengthArray,
    cueBoolArray: cueBoolArray,
    fiveBoolArray: fiveBoolArray
  });
  socket.emit('updateScheduledTimesArray', {
    startTitleArray: startTitleArray,
    startTimeArray: startTimeArray,
    cueLengthArray: cueLengthArray,
    cueBoolArray: cueBoolArray,
    fiveBoolArray: fiveBoolArray
  });

  sleep(1000).then(() => {
    getscheduledTimes();
  });
};
function delete_button_click(listIndex) {
  socket.emit("send_Delete_Button_To_Socket", {
    listIndex: listIndex
  });
};
function printArraysToElements() {
  console.log("printArraysToElements");
  console.log(startTitleArray);
  for (let i = 0; i < startTitleArray.length; i++) {
    document.getElementById("title" + i).value = startTitleArray[i]
  };
  for (let i = 0; i < startTimeArray.length; i++) {
    document.getElementById("startTime" + i).value = startTimeArray[i]
  };
  for (let i = 0; i < cueLengthArray.length; i++) {
    document.getElementById("cueLength" + i).value = cueLengthArray[i]
  };

  for (let i = 0; i < cueBoolArray.length; i++) {
    document.getElementById("cueBool" + i).value = cueBoolArray[i]
  };
  for (let i = 0; i < fiveBoolArray.length; i++) {
    document.getElementById("fiveBool" + i).value = fiveBoolArray[i]
  };


};
function getElementsToArrays() {
  console.log("getElementsToArrays()");
  for (let i = 0; i < startTitleArray.length; i++) {
    startTitleArray[i] = $("#title" + i).val()
  }
  for (let i = 0; i < startTimeArray.length; i++) {
    startTimeArray[i] = $("#startTime" + i).val()
  }
  for (let i = 0; i < cueLengthArray.length; i++) {
    cueLengthArray[i] = $("#cueLength" + i).val()
  }

  for (let i = 0; i < cueBoolArray.length; i++) {
    cueBoolArray[i] = $("#cueBool" + i).val()
  }
  for (let i = 0; i < fiveBoolArray.length; i++) {
    fiveBoolArray[i] = $("#fiveBool" + i).val()
  }


  console.log(startTimeArray);
};
function sendDB_To_Socket_On_Delete() {
  console.log("sendDB_To_Socket_On_Delete")

  socket.emit("writeToScheduledTimesjson", {
    startTitleArray: startTitleArray,
    startTimeArray: startTimeArray,
    cueLengthArray: cueLengthArray,
    cueBoolArray: cueBoolArray,
    fiveBoolArray: fiveBoolArray
  });
  socket.emit('updateScheduledTimesArray', {
    startTitleArray: startTitleArray,
    startTimeArray: startTimeArray,
    cueLengthArray: cueLengthArray,
    cueBoolArray: cueBoolArray,
    fiveBoolArray: fiveBoolArray
  });

};
function saveMyIpTo_myipjson(myChosenIp){
  var e = document.getElementById("selectNumber");
  var strUser = e.options[e.selectedIndex].value;
  console.log("---------------------: "+strUser);

  socket.emit("sendChosenIp_To_Socket",{myChosenIp:strUser})
};
function setLoopbackip(){


}
function getTimeCodeLoop(){
  socket.emit("getTimeCode",{});
  setTimeout(getTimeCodeLoop,100);
};
getTimeCodeLoop()

function iframePreviewFullscreen(){
  console.log(toggleMainPreview);

  if (toggleMainPreview === false) {
  document.getElementById("mainPreview").style.position = "absolute";
  document.getElementById("mainPreview").style.width = "99.9%";
  document.getElementById("mainPreview").style.height = "91.5%";
  document.getElementById("mainPreview").style.left = "0";
  document.getElementById("mainPreview").style.top = "0";
  document.getElementById("mainPreview").style.zIndex = "1";

  document.getElementById("mainPreviewTitle").style.position = "absolute";
  document.getElementById("mainPreviewTitle").style.top = "0";
  document.getElementById("mainPreviewTitle").style.left = "0";
  document.getElementById("mainPreviewTitle").style.zIndex = "2";

  toggleMainPreview = true;
  return
}
if (toggleMainPreview === true) {
  document.getElementById("mainPreview").style.position = null;
  document.getElementById("mainPreview").style.width = null;
  document.getElementById("mainPreview").style.height = null;
  document.getElementById("mainPreview").style.left = null;
  document.getElementById("mainPreview").style.top = null;

  document.getElementById("mainPreviewTitle").style.position = null;
  document.getElementById("mainPreviewTitle").style.top = null;
  toggleMainPreview = false;
  return
}

};
//--------------------------------
