"use strict";
const KEYS = {
  'GET_CURRENTTIME': 'currentTime',
  'GET_CURRENTTIMEMS': 'currentTimeMs',
  "COUNTDOWN": "countDown",
  "CUE_COUNTDOWN":"cueCountDown",
  "SETTINGS": 'settings',
  "MIDI":"midi",
  "ADMINURL": 'adminUrl'
};

WebSocketService.onEvent(KEYS.GET_CURRENTTIME, (message) => {
  document.getElementById("nowTopRow").textContent = message;
})

WebSocketService.onEvent(KEYS.GET_CURRENTTIMEMS, (message) => {
  //console.log('Message from server: ', message);
})

WebSocketService.onEvent(KEYS.COUNTDOWN, (message) => {
  document.getElementById("start").textContent = message.time;
  document.getElementById("offsetTime_display").textContent = message.offsetTime+" min";
  document.getElementById("offsetTime_display").value = message.offsetTime+" min";
  document.getElementById("checkbox_autoReset").checked = message.offsetTime_bool;

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
    
    if (message.countDownTimeInMS >= message.CountUp-500) {
      if (message.offsetTime_bool) {
        console.log("------------- checkbox_autoReset ------------------");
        offsetReset();
      }
      
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
      document.getElementById("cueTime").style.backgroundColor =  message.colors.countDownColor;
    }
    if (message.cueCountDownTimeInMS > 0) {
      document.getElementById("cueTime").style.backgroundColor =  message.colors.countUpColor;
    }
    
  }else{
    document.getElementById("cueTime").style.backgroundColor = "#3b3b3b";
    document.getElementById("cueTime").textContent = "";
  }
})

WebSocketService.onEvent(KEYS.MIDI, (message) => {


  if (typeof(message) == "string") {
    document.getElementById("timeCode").textContent = message;
    
  }else{
    document.getElementById("timeCode").textContent = "";
  }
  
})
WebSocketService.onEvent(KEYS.ADMINURL, (message) => {
  $('body').prepend('<div class="blink d-flex align-items-center justify-content-center"><H1>' + message.text + '</H1></div>');
  console.log(message.text);

  sleep(message.time).then(() => {
    $(".blink").remove();
  });
})

$("#createBackup").on('click', function () {
  console.log("createBackup button pushed");
  var title = $( "#createBackup_input").val();
  console.log(title);

  sendSocketMessage("createBackup", title);
  location.reload();
});
$("#overwriteBackup").on('click', function () {
  console.log("overwriteBackup button pushed");
  var title = $( "#listBackups option:selected" ).text();
  console.log(title);
  sendSocketMessage("overwriteBackup", title);
  location.reload();
});
$("#loadBackup").on('click', function () {
  console.log("loadBackup button pushed");
  var title = $( "#listBackups option:selected" ).text();
  console.log(title);
  sendSocketMessage("loadBackup", title);
  location.reload();
});
$("#deleteBackup").on('click', function () {
  console.log("deleteBackup button pushed");
  var title = $( "#listBackups option:selected" ).text();
  console.log(title);
  sendSocketMessage("deleteBackup", title);
  location.reload();
});
$("#checkbox_autoReset").on('click', function () {
  console.log("checkbox_autoReset button pushed");
  var data = document.getElementById("checkbox_autoReset").checked
  console.log(data);
  sendSocketMessage("checkbox_autoReset", data);
  // location.reload();
});
$("#addUser_button").on('click', function () {
  console.log("addUser_button pushed");
  var data = document.getElementById("user_name").value
  console.log(data);
  sendSocketMessage("addUser", data);
  location.reload();
});
$("#deleteUser_button").on('click', function () {
  console.log("deleteUser_button pushed");
  var data = document.getElementById("deleteuser_select").value
  console.log(data);
  sendSocketMessage("deleteUser", data);
  location.reload();
});




function alertButton() {
  var text = $("#alertText").val();
  var time = $("#alertTime").val()  *1000;

  console.log("alertButton presed");
  console.log(time);

  if ($("#startUrl").val() == 1) {
    sendSocketMessage("startUrl", {
      text: text,
      time: time
    });
  }
  if ($("#adminUrl").val() == 1) {
    sendSocketMessage("adminUrl", {
      text: text,
      time: time
    });
  }
  if ($("#fohUrl").val() == 1) {
    sendSocketMessage("fohUrl", {
      text: text,
      time: time
    });
  }
  if ($("#stageUrl").val() == 1) {
    sendSocketMessage("stageUrl", {
      text: text,
      time: time
    });
  }
  if ($("#watchUrl").val() == 1) {
    sendSocketMessage("watchUrl", {
      text: text,
      time: time
    });
  }
  if ($("#countdownUrl").val() == 1) {
    sendSocketMessage("countdownUrl", {
      text: text,
      time: time
    });
  }
  if ($("#allUsersUrl").val() == 1) {
    sendSocketMessage("allUsersUrl", {
      text: text,
      time: time
    });
  }
};
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
};
function offsetReset() {
  $(document).ready(function () {
    console.log("offsetReset");
    var path = "/admin/offsetReset";
    console.log(path);
    var form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', path);
    // form.style.display = 'hidden';
    form.name = "offsetReset";
    form.text = "offsetReset";
    // Create an input element for Full Name
    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "offsetReset");
    input.value = "offsetReset";
    form.append(input);
    document.body.appendChild(form)
    form.submit();
  });
};




















$(":input").keypress(function (e) {
  if (e.which == 13) {
    sendSocketMessage("sortingButton_To_Socket")
    sendSocketMessage("reload")
    // alert('enter key is pressed and list is updated');
  }
});

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


//--------------------------------
