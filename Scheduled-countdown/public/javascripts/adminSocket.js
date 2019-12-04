
var socket = io.connect('http://localhost:3000');
console.log("adminSocketScript Loaded");
//---------- My sockets
socket.emit("start", { username: username });
socket.emit("sendDB_To_Socket")

socket.on("updatingDB",function (data){
  $('#now').html("This is great");
});

$("#scheduledTimesSubmit").on('click', function () {
  console.log("FUNKAR hahah");
  //$('#now').html("This is great");
  var message = "Message from Button AdminPage";
  //$("#txtmessage").val('');
  //$('.typing').html("");
  socket.emit('message_from_Adminpage', { message: message});
});

$("#updateScheduledTimesArray").on('click', function () {
  console.log("updateScheduledTimesArray");
  var message = "updateScheduledTimesArray";
  socket.emit('updateScheduledTimesArray', { message: message});
});

//#updateScheduledTimesArray
//#scheduledTimesSubmit
//--------------------------------------------------











    var username = Math.random().toString(36).substr(2,8);
    socket.emit('join', { username: username });

    socket.on('user joined', function (data) {
        $(".js-userjoined").html(data.username + ' Joined chat room');
         $.each(data.users, function(index, user) {
             $(".js-usersinchat").append('<span id ='+user+'>  <strong>'+user+'</strong></span>');
         });
     });

     socket.on('user disconnected', function (data) {
        $("#"+data.username).remove();
     });

    //an event emitted from server
    socket.on('chat message', function (data) {
        var string = '<div class="row message-bubble"><p class="text-muted">' + data.username+'</p><p>'+data.message+'</p></div>';
        $('#messages').append(string);

    });
    $(function () {
        var timeout;
        function timeoutFunction() {
            typing = false;
            socket.emit("typing", { message: '', username: '' });
        }
       $("#sendmessage").on('click', function () {
         var message = $("#txtmessage").val();
         $("#txtmessage").val('');
         $('.typing').html("");
         socket.emit('new_message', { message: message, username: username });
       });


    socket.on('typing', function (data) {
       if (data.username && data.message) {
            $('.typing').html("User: " + data.username+' '+ data.message);
      } else {
           $('.typing').html("");
       }

   });
       $('#txtmessage').keyup(function () {
           console.log('typing');
           typing = true;
           socket.emit('typing', { message: 'typing...', username: username});
          clearTimeout(timeout);
          timeout = setTimeout(timeoutFunction, 2000);
      });

 });

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
