"use strict";

const KEYS = {
  'GET_CURRENTTIME': 'currentTime',
  'GET_CURRENTTIMEMS': 'currentTimeMs',
  "COUNTDOWN": "countDown",
  "CUE_COUNTDOWN": "cueCountDown",
  "SETTINGS": 'settings',
  "MIDI": "midi",
  "ADMINURL": 'adminUrl'
};
WebSocketService.onEvent(KEYS.GET_CURRENTTIME, (message) => {
  document.getElementById("nowTopRow").textContent = message;
})

WebSocketService.onEvent(KEYS.MIDI, (message) => {
  // console.log(message);
  // console.log(timeStringToMs(message));
  cueTimeCountDown(timeStringToMs(message));
  // $("#timecodeMs").text(timeStringToMs(message));


  if (typeof (message) == "string") {
    document.getElementById("timeCode").textContent = message;

  } else {
    document.getElementById("timeCode").textContent = "";
  }

})





var user = document.getElementById("user").textContent;
var timeCodeBool = true;
var cuelistHideBool = true;

$("#AddNewCueRow").on('click', function () {
  sendSocketMessage("AddNewCueRow", {
    user: user
  });
    document.location.reload(true)
});
$("#ToggleTC").on('click', function () {
  if (timeCodeBool == true) {
    timeCodeBool = false;
    return;
  };
  if (timeCodeBool == false) {
    timeCodeBool = true;
    $("#ToggleTC").html("TimeCode is ON")
    return;
  };

});
$("#ResetTC").on('click', function () {
  cueTimeCountDown(1000);
  if (cuelistHideBool == true) {
    cuelistHideBool = false;
    return
  }
  if (cuelistHideBool == false) {
    cuelistHideBool = true;
    return
  }
});

function captureTCButton(listIndex) {
  console.log("captureTCButton with listIndex = " + listIndex);
  var string = "#timeCode" + listIndex
  $(string).val(msToTime(timeCodeMs))
};

function delete_button_click(listIndex) {
  console.log("delete_button_click");
  sendSocketMessage("send_Delete_CueButton_To_Socket", {
    listIndex: listIndex,
    user: user
  });
  document.location.reload(true)
};

sendSocketMessage("user", {
  user: user

});
sendSocketMessage("getTimeCode", {});

function timeStringToMs(t) {
  if (t > 5) {
    var r = Number(t.split(':')[0]) * (60 * 60000) + Number(t.split(':')[1]) * (60000) + Number(t.split(':')[2]) * (1000);
  } else {
    t = t + ":00"
    var r = Number(t.split(':')[0]) * (60 * 60000) + Number(t.split(':')[1]) * (60000) + Number(t.split(':')[2]) * (1000);
  }
  return r;

}

function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;
  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}

function pad(n, z) {
  z = z || 2;
  return ('00' + n).slice(-z);
}


var newArrayIndex = 0;
var currentArrayIndex;
var hideTime = 500;
var overlayTime = 5000;
var fadeTime = 750;

function cueTimeCountDown(timeCodeMs) {
  let cueListLength = $('[id^=timecodeMs]').length;
  for (let i = 0; i < cueListLength; i++) {
    var time = "";
    var idString = "#timecodeMs" + i;
    var rowString = "#cueListRow" + i;
    var centeredOverlay = "#centeredOverlay" + i;
    var timeCodeArrayMs = timeStringToMs($("#timeCode" + i).val());
    //----------
    if (timeCodeMs >= timeCodeArrayMs) {
      time = timeCodeMs - timeCodeArrayMs
      time = (msToTime(time))
    } else {

      time = timeCodeArrayMs - timeCodeMs
      time = "-" + (msToTime(time))
    }
    $(idString).text(time)
    //----------
    if (timeCodeBool == true) {
      if (timeCodeMs > (timeCodeArrayMs + hideTime) && cuelistHideBool == true) {
        $(rowString).hide(fadeTime);
      } else {
        $(rowString).show(1500);
      }
      if (cuelistHideBool == false) {
        $(rowString).show(fadeTime);
      }



    }

    if (timeCodeMs > (timeCodeArrayMs - overlayTime)) {
      $(centeredOverlay).fadeIn(fadeTime);
      $(centeredOverlay).animate({
        width: "0%"
      }, overlayTime - 1000);
    } else {
      $(centeredOverlay).fadeOut(fadeTime);
      $(centeredOverlay).animate({
        width: "100%"
      }, 0);
    }
  }
}