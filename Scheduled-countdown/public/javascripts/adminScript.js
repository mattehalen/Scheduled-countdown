var startTimeArray = [];
var startTitleArray = [];
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

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
      startTimeArray = [];
      startTitleArray = [];
      for (i = 0; i < scheduledTimesArray.profiles.length; i++) {
        a = scheduledTimesArray.profiles[i].title;
        startTitleArray.push(a);
        b = scheduledTimesArray.profiles[i].startTime;
        startTimeArray.push(b);
//----------------------------------------
      }
  }

  request();
};
getscheduledTimes();
//--------------------------------------------------















//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------

var socket = io.connect('http://localhost:3000');
console.log("adminSocketScript Loaded");
//---------- My sockets
socket.emit("start", { });

sleep(1000).then(() => {
  //console.log(startTitleArray);
  //console.log(startTimeArray);
  socket.emit("sendDB_To_Socket", {"startTitleArray": startTitleArray,"startTimeArray":startTimeArray});
  });


$("#updateScheduledTimesArray").on('click', function () {
  console.log("updateScheduledTimesArray");

  //console.log("startTitleArray before: "+startTitleArray);
  for(let i=0; i < startTitleArray.length; i++) {startTitleArray[i] = $("#title"+i).val()}
  for(let i=0; i < startTimeArray.length; i++) {startTimeArray[i] = $("#startTime"+i).val()}
  //console.log("startTitleArray after: "+startTitleArray + startTimeArray);
  socket.emit("writeToScheduledTimesjson",{startTitleArray: startTitleArray, startTimeArray: startTimeArray});
  socket.emit('updateScheduledTimesArray',{startTitleArray: startTitleArray, startTimeArray: startTimeArray});
});
//--------------------------------------------------











    // var username = Math.random().toString(36).substr(2,8);
    // socket.emit('join', { username: username });
    //
    // socket.on('user joined', function (data) {
    //     $(".js-userjoined").html(data.username + ' Joined chat room');
    //      $.each(data.users, function(index, user) {
    //          $(".js-usersinchat").append('<span id ='+user+'>  <strong>'+user+'</strong></span>');
    //      });
    //  });

     socket.on('user disconnected', function (data) {
        //$("#"+data.username).remove();
     });

    // //an event emitted from server
    // socket.on('chat message', function (data) {
    //     var string = '<div class="row message-bubble"><p class="text-muted">' + data.username+'</p><p>'+data.message+'</p></div>';
    //     $('#messages').append(string);
    //
    // });
    // $(function () {
    //     var timeout;
    //     function timeoutFunction() {
    //         typing = false;
    //         socket.emit("typing", { message: '', username: '' });
    //     }
    //    $("#sendmessage").on('click', function () {
    //      var message = $("#txtmessage").val();
    //      $("#txtmessage").val('');
    //      $('.typing').html("");
    //      socket.emit('new_message', { message: message, username: username });
    //    });
    //
    //
    // socket.on('typing', function (data) {
    //    if (data.username && data.message) {
    //         $('.typing').html("User: " + data.username+' '+ data.message);
    //   } else {
    //        $('.typing').html("");
    //    }

   // });
      //  $('#txtmessage').keyup(function () {
      //      console.log('typing');
      //      typing = true;
      //      socket.emit('typing', { message: 'typing...', username: username});
      //     clearTimeout(timeout);
      //     timeout = setTimeout(timeoutFunction, 2000);
      // });

 //});

var typing = false;
var timeout = undefined;
function timeoutFunction(){
  typing = false;
  socket.emit(noLongerTypingMessage);
}
function onKeyDownNotEnter(){
  if(typing == false) {
    typing = true
    socket.emit();
    timeout = setTimeout(timeoutFunction, 5000);
  } else {
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 5000);
  }
}
