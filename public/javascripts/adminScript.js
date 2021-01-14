"use strict";
const KEYS = {
  'GET_CURRENTTIME': 'currentTime',
  'GET_CURRENTTIMEMS': 'currentTimeMs',
  "COUNTDOWN": "countDown",
  "CUE_COUNTDOWN":"cueCountDown",
  "SETTINGS": 'settings',
  "MIDI":"midi"
};

WebSocketService.onEvent(KEYS.GET_CURRENTTIME, (message) => {
  document.getElementById("nowTopRow").textContent = message;
})

WebSocketService.onEvent(KEYS.GET_CURRENTTIMEMS, (message) => {
  //console.log('Message from server: ', message);
})

WebSocketService.onEvent(KEYS.COUNTDOWN, (message) => {
  document.getElementById("start").textContent = message.time;
  if (message.bool) {

    if (message.countDownTimeInMS < ((3*-60000))) {
      //document.body.style.backgroundColor = "#2b2b2b";
    }
    if (message.countDownTimeInMS > ((3*-60000))) {
      //document.body.style.backgroundColor = "darkred";
    }
    if (message.countDownTimeInMS > 0) {
      //document.body.style.backgroundColor = "darkgreen";
    }

  }else{
    //document.body.style.backgroundColor = "#2b2b2b";
  }
})

WebSocketService.onEvent(KEYS.CUE_COUNTDOWN, (message) => {
 
  if (message.bool) {
    document.getElementById("cueTime").textContent = "Cue: " + message.time;

    if (message.cueCountDownTimeInMS < ((3*-60000))) {
      //document.body.style.backgroundColor = "#2b2b2b";
      document.getElementById("cueTime").style.backgroundColor = "#3b3b3b";
    }
    if (message.cueCountDownTimeInMS > ((3*-60000))) {
      document.getElementById("cueTime").style.backgroundColor = "darkred";
    }
    if (message.cueCountDownTimeInMS > 0) {
      document.getElementById("cueTime").style.backgroundColor =  "darkgreen";
    }
    
  }else{
    document.getElementById("cueTime").style.backgroundColor = "#3b3b3b";
    document.getElementById("cueTime").textContent = "";
  }
})

WebSocketService.onEvent(KEYS.MIDI, (message) => {


  if (typeof(message) == "string") {
    console.log("this is a string");
    document.getElementById("timeCode").textContent = message;
    
  }else{
    document.getElementById("timeCode").textContent = "";
  }
  
})






















var startTimeArray = [];
var startTitleArray = [];
var cueLengthArray = [];
var cueBoolArray = [];
var fiveBoolArray = [];
var offsetTimejson = [];
var offsetTimeInit = [];
var nowTopRow = document.getElementById("nowTopRow");
var cueTimeText = document.getElementById("cueTime");
var timeCode = document.getElementById("timeCode");
var startText = document.getElementById("start");
var offsetTime = document.getElementById("offsetTime");

var toggleMainPreview = false;



//--------------------------------------------------
// - getOffsetTime
//--------------------------------------------------
async function getOffsetTime() {
  const json = await getAdminSettingsJson();
  offsetTimeInit = json.timeSettings.offsetTime;
  console.log("Get offsetTime: " + json.timeSettings.offsetTime);
}
getOffsetTime();
//--------------------------------------------------


//--------------------------------------------------
// sendSocketMessage("start");
// sendSocketMessage("getTimeCode");

//sendDB_To_Socket
// sleep(1000).then(() => {
  sendSocketMessage("sendDB_To_Socket", {
    startTitleArray: startTitleArray,
    startTimeArray: startTimeArray,
    cueLengthArray: cueLengthArray,
    cueBoolArray: cueBoolArray,
    fiveBoolArray: fiveBoolArray

  });
// });
//--------------------------------------------------
//--------------------------------------------------
socket.on("sendDB_TO_Admin", function (data) {
  startTimeArray = data.socketDBArray.startTimeArray;
  startTitleArray = data.socketDBArray.startTitleArray;
  cueLengthArray = data.socketDBArray.cueLengthArray;
  cueBoolArray = data.socketDBArray.cueBoolArray;
  fiveBoolArray = data.socketDBArray.fiveBoolArray
});
// socket.on("updatebutton_From_Socket", function(data) {
//   console.log("updatebutton_From_Socket - DISABELED");
//   // updateScheduledTimesArray();
// })
socket.on("updateDB_From_Socket", function (data) {
  //console.log("updateDB_From_Socket: ");
  startTimeArray = data.startTimeArray;
  startTitleArray = data.startTitleArray;
  cueLengthArray = data.cueLengthArray;
  cueBoolArray = data.cueBoolArray;
  fiveBoolArray = data.fiveBoolArray;
  sleep(100).then(() => {
    printArraysToElements();
  });
});
socket.on("pushGetscheduledTimes", function () {
  console.log("pushGetscheduledTimes: ");
  getscheduledTimes();

  sleep(100).then(() => {
    printArraysToElements();
  });

});
// socket.on("sortingButton_From_Socket", function(data) {
//   console.log("+++++++++++ sortingButton_From_Socket");
//
//   updateScheduledTimesArray();
//   sleep(750).then(() => {
//     //sortscheduledTimes();
//     // window.location.reload(true)
//
//     sleep(1000).then(() => {
//       //document.location.reload();
//     });
//
//   });
//
// })
socket.on("updateOffsetTime_From_Socket", function (data) {
  console.log("updateOffsetTime_From_Socket");
  console.log(data);
  offsetTimeInit = data.offsetTime;
  $("#offsetTime").html(offsetTimeInit);
});
socket.on("getCueTimeString_From_Socket", function (data) {
  cueTimeText.textContent = data.string;
});
socket.on("changesOnScheduledTimes", function () {
  console.log("changesOnScheduledTimes");
  alert("Changes to ScheduledTimes.json has been made. Please update browser to se them");
});
socket.on("centerTextContent", function (data) {
  nowTopRow.textContent = data.newCurrentTime,
    startText.textContent = data.countDownString
});
socket.on("sendIpArrayToAdminPage", function (data) {
  // console.log("sendIpArrayToAdminPage");
});
socket.on("sendTimeCode", function (data) {
  timeCode.textContent = data.smpteString
  //console.log(data.smpteString);
});

socket.on("alertText_adminUrl", function (data) {
  $('body').prepend('<div class="blink d-flex align-items-center justify-content-center"><H1>' + data.text + '</H1></div>');
  console.log(data.text);

  sleep(10000).then(() => {
    $(".blink").remove();
  });
});

//--------------------------------------------------
// $("#updateScheduledTimesArray").on('click', function() {
//   sendSocketMessage("updatebutton_To_Socket")
// });

$("#sorting").on('click', function () {
  sendSocketMessage("sortingButton_To_Socket")
});

$("#offsetPlus").on('click', function () {
  var path = "/admin/offsetPlus";
  console.log(path);
  var form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', path);
  form.style.display = 'hidden';
  document.body.appendChild(form)
  form.submit();

  // offsetTimeInit += 1;
  // sendSocketMessage("updateOffsetTimePlus", {
  //   offsetTime: offsetTimeInit
  // });
});

$("#offsetMinus").on('click', function () {
  var path = "/admin/offsetMinus";
  console.log(path);
  var form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', path);
  form.style.display = 'hidden';
  document.body.appendChild(form)
  form.submit();
});

$("#offsetReset").on('click', function () {
  var path = "/admin/offsetReset";
  console.log(path);
  var form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', path);
  form.style.display = 'hidden';
  document.body.appendChild(form)
  form.submit();
});

$("#adminsubmit").on('click', function () {
  var path = "/admin/submit";
  console.log(path);
  sendSocketMessage("reload")

  var form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', path);
  form.style.display = 'hidden';
  document.body.appendChild(form)
  form.submit();
});


$("#loadDefaultArray").on('click', function () {
  console.log("loadDefaultArray");
  var path = "/admin/loadDefault";
  console.log(path);
  sendSocketMessage("reload")

  sleep(1000).then(() => {

    var form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', path);
    form.style.display = 'hidden';
    document.body.appendChild(form)
    form.submit();
  });
});

$("#writeDefaultArray").on('click', function () {
  console.log("writeDefaultArray");
  var path = "/admin/writeToDefault";
  console.log(path);
  sendSocketMessage("reload");

  var form = document.getElementById('formTable');
  form.submit();

  // var form = document.createElement('form');
  // form.setAttribute('method', 'post');
  // form.setAttribute('action', path);
  // form.style.display = 'hidden';
  // document.body.appendChild(form)
  // form.submit();
});

$("#addNewRow").on('click', function () {
  console.log("addNewRow");
  var path = "/admin/addNewRowDefault";
  console.log(path);
  var form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', path);
  form.style.display = 'hidden';
  document.body.appendChild(form)
  form.submit();
});

$("#dayOfWeekSubmit").on('click', function () {
  console.log("dayOfWeekSubmit");
  var path = "/admin/dayOfWeek";
  console.log(path);
  sendSocketMessage("reload")
  var form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', path);
  form.style.display = 'hidden';
  document.body.appendChild(form)
  form.submit();
});

$(":input").keypress(function (e) {
  if (e.which == 13) {
    sendSocketMessage("sortingButton_To_Socket")
    sendSocketMessage("reload")
    // alert('enter key is pressed and list is updated');
  }
});

//-- New Buttons for Reseting 5min CountDown
$("#reloadFiveMinCountDown").on("click", function () {
  sendSocketMessage("reloadFiveMinCountDown");
});

$("#one").on("click", function () {
  sendSocketMessage("force5MinCountDownCase", {
    case: 1
  });
});

$("#two").on("click", function () {
  sendSocketMessage("force5MinCountDownCase", {
    case: 2
  });
});

$("#three").on("click", function () {
  sendSocketMessage("force5MinCountDownCase", {
    case: 3
  });
});

$("#four").on("click", function () {
  sendSocketMessage("force5MinCountDownCase", {
    case: 4
  });
});

$("#five").on("click", function () {
  sendSocketMessage("force5MinCountDownCase", {
    case: 5
  });
});

$("#alpha").on("click", function () {
  sendSocketMessage("force5MinCountDownCase", {
    case: 0
  });
});

//--------------------------------------------------
// function updateScheduledTimesArray() {
//   console.log("updateScheduledTimesArray");
//   console.log(fiveBoolArray);
//   for (let i = 0; i < startTitleArray.length; i++) {
//     startTitleArray[i] = $("#title" + i).val()
//   }
//   for (let i = 0; i < startTimeArray.length; i++) {
//     startTimeArray[i] = $("#startTime" + i).val()
//   }
//   for (let i = 0; i < cueLengthArray.length; i++) {
//     cueLengthArray[i] = $("#cueLength" + i).val()
//   }
//   for (let i = 0; i < cueBoolArray.length; i++) {
//     cueBoolArray[i] = $("#cueBool" + i).val()
//   }
//   for (let i = 0; i < fiveBoolArray.length; i++) {
//     fiveBoolArray[i] = $("#fiveBool" + i).val()
//     console.log(fiveBoolArray[i]);
//   }
//   console.log("------------------------------> socket emit writeToScheduledTimesjson = "+fiveBoolArray);
//   sendSocketMessage("writeToScheduledTimesjson", {
//     startTitleArray: startTitleArray,
//     startTimeArray: startTimeArray,
//     cueLengthArray: cueLengthArray,
//     cueBoolArray: cueBoolArray,
//     fiveBoolArray: fiveBoolArray
//   });
//   sendSocketMessage("updateScheduledTimesArray", {
//     startTitleArray: startTitleArray,
//     startTimeArray: startTimeArray,
//     cueLengthArray: cueLengthArray,
//     cueBoolArray: cueBoolArray,
//     fiveBoolArray: fiveBoolArray
//   });
//
//   sleep(1000).then(() => {
//     getscheduledTimes();
//   });
// };

function delete_button_click(listIndex) {

  $(document).ready(function () {
    console.log("deleteButton");
    var path = "/admin/deleteButton";
    console.log(path);


    var form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', path);
    // form.style.display = 'hidden';
    form.name = listIndex;
    form.text = listIndex;

    // Create an input element for Full Name
    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "listIndex");
    input.value = listIndex;


    form.append(input);

    document.body.appendChild(form)

    form.submit();

  });

  // sendSocketMessage("send_Delete_Button_To_Socket", {
  //   listIndex: listIndex
  // });

  // sleep(500).then(() => {
  //   document.location.reload();
  // });
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

  sendSocketMessage("writeToScheduledTimesjson", {
    startTitleArray: startTitleArray,
    startTimeArray: startTimeArray,
    cueLengthArray: cueLengthArray,
    cueBoolArray: cueBoolArray,
    fiveBoolArray: fiveBoolArray
  });
  sendSocketMessage("updateScheduledTimesArray", {
    startTitleArray: startTitleArray,
    startTimeArray: startTimeArray,
    cueLengthArray: cueLengthArray,
    cueBoolArray: cueBoolArray,
    fiveBoolArray: fiveBoolArray
  });

};

function saveMyIpTo_myipjson() {
  var e = document.getElementById("selectNumber");
  var strUser = e.options[e.selectedIndex].value;
  console.log("---------------------: " + strUser);

  sendSocketMessage("sendChosenIp_To_Socket", {
    myChosenIp: strUser
  })
};


function getTimeCodeLoop() {
  //sendSocketMessage("getTimeCode");
  setTimeout(getTimeCodeLoop, 100);
};
getTimeCodeLoop()

function iframePreviewFullscreen() {
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

function alertButton() {
  var text = $("#alertText").val();

  if ($("#startUrl").val() == 1) {
    sendSocketMessage("startUrl", {
      text: text
    });
  }
  if ($("#adminUrl").val() == 1) {
    sendSocketMessage("adminUrl", {
      text: text
    });
  }
  if ($("#fohUrl").val() == 1) {
    sendSocketMessage("fohUrl", {
      text: text
    });
  }
  if ($("#stageUrl").val() == 1) {
    sendSocketMessage("stageUrl", {
      text: text
    });
  }
  if ($("#watchUrl").val() == 1) {
    sendSocketMessage("watchUrl", {
      text: text
    });
  }
  if ($("#countdownUrl").val() == 1) {
    sendSocketMessage("countdownUrl", {
      text: text
    });
  }
  if ($("#allUsersUrl").val() == 1) {
    sendSocketMessage("allUsersUrl", {
      text: text
    });
  }
};
//--------------------------------
