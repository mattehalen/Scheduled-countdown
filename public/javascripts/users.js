"use strict";
let timeCodeMs;

const KEYS = {
  'GET_CURRENTTIME': 'currentTime',
  'GET_CURRENTTIMEMS': 'currentTimeMs',
  "COUNTDOWN": "countDown",
  "CUE_COUNTDOWN": "cueCountDown",
  "SETTINGS": 'settings',
  "MIDI": "midi",
  "ALLUSERSURL": 'allUsersUrl'
};
WebSocketService.onEvent(KEYS.GET_CURRENTTIME, (message) => {
  document.getElementById("nowTopRow").textContent = message;
})

WebSocketService.onEvent(KEYS.MIDI, (message) => {
  timeCodeMs = timeStringToMs(message);
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
WebSocketService.onEvent(KEYS.ALLUSERSURL, (message) => {
  $('body').prepend('<div class="blink d-flex align-items-center justify-content-center"><H1>' + message.text + '</H1></div>');
  console.log(message.text);

  sleep(message.time).then(() => {
    $(".blink").remove();
  });
})





var user = document.getElementById("user").textContent;
var timeCodeBool = true;
var cuelistHideBool = false;
var fullscreenToggle = false

$("#AddNewCueRow").on('click', function () {
  var selectedCuelist = $( "#SelectedCuelist" ).val();
  console.log(selectedCuelist);
  sendSocketMessage("AddNewCueRow", {
    user: user,
    selectedCuelist:selectedCuelist
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
$("#SelectedCuelistButton").on('click', function () {
  var selectedCuelist = $( "#SelectedCuelist" ).val();
  console.log(selectedCuelist);
  sendSocketMessage("selectedCueList", {
    user: user,
    selectedCuelist:selectedCuelist
  });
    document.location.reload(true)
});
$("#SelectedCuelist").change(function () {
  var selectedCuelist = $( "#SelectedCuelist" ).val();
  console.log(selectedCuelist);
  sendSocketMessage("selectedCueList", {
    user: user,
    selectedCuelist:selectedCuelist
  });
    document.location.reload(true)
})

$("#user").on('click', function () {
  console.log("TOGGLE FULLSCREEN");
  
  if(fullscreenToggle){
    console.log("toggle true");
    fullscreenToggle = false
    hideForFullScreen()
  }else{
    console.log("toggle false");
    fullscreenToggle = true
    showForFullScreen()
  }
});

function hideForFullScreen(){
  $(".form-row").hide()
  $(".btn-dark").hide()
  $(".userCueList").removeClass("normalCueList")
}
function showForFullScreen(){
  $(".form-row").show()
  $(".btn-dark").show()
  $(".userCueList").addClass( "normalCueList" );
}


//--------------------------------------------------
$("#addNewCuelist").on('click', function () {
  var selectedCuelist = $( "#SelectedCuelist" ).val();
  var newCuelistName = $( "#createCuelist_input" ).val();
  sendSocketMessage("addNewCuelist", {
    user: user,
    selectedCuelist:selectedCuelist,
    newCuelistName:newCuelistName
  });
    document.location.reload(true)
});
$("#loadCuelist").on('click', function () {
  var selectedCuelist = $( "#SelectedCuelist" ).val();
  var newCuelistName = $( "#createCuelist_input" ).val();
  var cuelistDropdown_input = $( "#cuelistDropdown_input" ).val();
  sendSocketMessage("loadCuelist", {
    user: user,
    selectedCuelist:selectedCuelist,
    newCuelistName:newCuelistName,
    cuelistDropdown_input:cuelistDropdown_input
  })
  document.location.reload(true)
});
$("#overwriteCuelist").on('click', function () {
  var selectedCuelist = $( "#SelectedCuelist" ).val();
  var newCuelistName = $( "#createCuelist_input" ).val();
  var cuelistDropdown_input = $( "#cuelistDropdown_input" ).val();
  sendSocketMessage("overwriteCuelist", {
    user: user,
    selectedCuelist:selectedCuelist,
    newCuelistName:newCuelistName,
    cuelistDropdown_input:cuelistDropdown_input
  })
  document.location.reload(true)
});
$("#deleteCuelist").on('click', function () {
  var selectedCuelist = $( "#SelectedCuelist" ).val();
  var cuelistDropdown_input = $( "#cuelistDropdown_input" ).val();
  sendSocketMessage("deleteCuelist", {
    user: user,
    selectedCuelist:selectedCuelist,
    cuelistDropdown_input:cuelistDropdown_input
  })
  document.location.reload(true)
});
//--------------------------------------------------


function captureTCButton(listIndex) {
  console.log(timeCodeMs);
  console.log("captureTCButton with listIndex = " + listIndex);
  var string = "#timeCode" + listIndex
  $(string).val(msToTime(timeCodeMs))
};

function delete_button_click(listIndex) {
  var selectedCuelist = $( "#SelectedCuelist" ).val();
  console.log("delete_button_click");
  sendSocketMessage("send_Delete_CueButton_To_Socket", {
    listIndex: listIndex,
    selectedCuelist:selectedCuelist,
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
var hideTime = 5000;
var overlayTime = 5*1000;
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
      if (timeCodeMs > (timeCodeArrayMs)) {
        $(rowString).css( "color", "red" );
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


// exel import
function dropHandler(ev) {
  var selectedCuelist = $( "#SelectedCuelist" ).val();

  console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
  console.log(ev.dataTransfer.files);
  readXlsxFile(ev.dataTransfer.files[0])
  .then(function(rows) {
    console.log(rows);
    sendSocketMessage("AddNewCueFromExcel", {
      user: user,
      selectedCuelist:selectedCuelist,
      excelItems:rows
    });
  })
  .then(    document.location.reload(true)
  )
}
function dragOverHandler(ev) {
  console.log('File(s) in drop zone');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}



function markAsChecked(listIndex){
  console.log("markAsChecked");
  console.log(listIndex.parentElement.id);
  $(listIndex.parentElement).css( "background-color", "green" );
}