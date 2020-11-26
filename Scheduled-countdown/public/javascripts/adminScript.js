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
var myIpArrayBool = 0;
var toggleMainPreview = false;

var offsetTime = document.getElementById("offsetTime");

//--------------------------------------------------
function getOffsetTime() {
  const request = async () => {
    const response = await fetch('/admin-settings.json');
    const json = await response.json();
    offsetTimejson = json;
    //console.log("Get offsetTime: "+offsetTimejson.offsetTime);
    offsetTimeInit = offsetTimejson.timeSettings.offsetTime;
  }

  request();
};
getOffsetTime();

//--------------------------------------------------
socket.emit("start", {});
socket.emit("getTimeCode", {});

//sendDB_To_Socket
// sleep(1000).then(() => {
//   socket.emit("sendDB_To_Socket", {
//     startTitleArray: startTitleArray,
//     startTimeArray: startTimeArray,
//     cueLengthArray: cueLengthArray,
//     cueBoolArray: cueBoolArray,
//     fiveBoolArray: fiveBoolArray
//
//   });
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
//   socket.emit("updatebutton_To_Socket", {})
// });

$("#sorting").on('click', function () {
  socket.emit("sortingButton_To_Socket", {})
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
  // socket.emit('updateOffsetTimePlus', {
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
  socket.emit("reload", {})

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
  socket.emit("reload", {})

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
  socket.emit("reload", {});

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
  socket.emit("reload", {})
  var form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', path);
  form.style.display = 'hidden';
  document.body.appendChild(form)
  form.submit();
});

$(":input").keypress(function (e) {
  if (e.which == 13) {
    socket.emit("sortingButton_To_Socket", {})
    socket.emit("reload", {})
    // alert('enter key is pressed and list is updated');
  }
});

//-- New Buttons for Reseting 5min CountDown
$("#reloadFiveMinCountDown").on("click", function () {
  socket.emit("reloadFiveMinCountDown", {});
});

$("#one").on("click", function () {
  socket.emit("force5MinCountDownCase", {
    case: 1
  });
});

$("#two").on("click", function () {
  socket.emit("force5MinCountDownCase", {
    case: 2
  });
});

$("#three").on("click", function () {
  socket.emit("force5MinCountDownCase", {
    case: 3
  });
});

$("#four").on("click", function () {
  socket.emit("force5MinCountDownCase", {
    case: 4
  });
});

$("#five").on("click", function () {
  socket.emit("force5MinCountDownCase", {
    case: 5
  });
});

$("#alpha").on("click", function () {
  socket.emit("force5MinCountDownCase", {
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
//   socket.emit("writeToScheduledTimesjson", {
//     startTitleArray: startTitleArray,
//     startTimeArray: startTimeArray,
//     cueLengthArray: cueLengthArray,
//     cueBoolArray: cueBoolArray,
//     fiveBoolArray: fiveBoolArray
//   });
//   socket.emit('updateScheduledTimesArray', {
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

  // socket.emit("send_Delete_Button_To_Socket", {
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

function saveMyIpTo_myipjson() {
  var e = document.getElementById("selectNumber");
  var strUser = e.options[e.selectedIndex].value;
  console.log("---------------------: " + strUser);

  socket.emit("sendChosenIp_To_Socket", {
    myChosenIp: strUser
  })
};


function getTimeCodeLoop() {
  socket.emit("getTimeCode", {});
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
    socket.emit("startUrl", {
      text: text
    });
  }
  if ($("#adminUrl").val() == 1) {
    socket.emit("adminUrl", {
      text: text
    });
  }
  if ($("#fohUrl").val() == 1) {
    socket.emit("fohUrl", {
      text: text
    });
  }
  if ($("#stageUrl").val() == 1) {
    socket.emit("stageUrl", {
      text: text
    });
  }
  if ($("#watchUrl").val() == 1) {
    socket.emit("watchUrl", {
      text: text
    });
  }
  if ($("#countdownUrl").val() == 1) {
    socket.emit("countdownUrl", {
      text: text
    });
  }
  if ($("#allUsersUrl").val() == 1) {
    socket.emit("allUsersUrl", {
      text: text
    });
  }







};
//--------------------------------