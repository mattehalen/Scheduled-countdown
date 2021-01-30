// "use strict";
const KEYS = {
  "COUNTDOWN":      "countDown",
  "COUNTDOWNURL":       "countdownUrl",
};

WebSocketService.onEvent(KEYS.COUNTDOWN, (message) => {
  //console.log('Message from server: ', message);
  
  if (message.bool) {

    if (message.countDownTimeInMS > ((5 * -60000)) && message.countDownTimeInMS < 0) {
      document.getElementById("countDown").textContent = msToTime(message.countDownTimeInMS - 60000);
      document.getElementById("countDown").style.display = "inline";
      document.body.style.backgroundColor = "rgba(43, 43, 43, 1)";
    }
    else{
      document.body.style.backgroundColor = "rgba(43, 43, 43, 0)";
      document.getElementById("countDown").style.display = "none";
    }

  } else {
    document.body.style.backgroundColor = "rgba(43, 43, 43, 0)";
    document.getElementById("countDown").style.display = "none";
  }

})
WebSocketService.onEvent(KEYS.COUNTDOWNURL, (message) => {
  $('body').prepend('<div class="blink d-flex align-items-center justify-content-center"><H1>' + message.text + '</H1></div>');
  console.log(message.text);

  sleep(message.time).then(() => {
    $(".blink").remove();
  });
})
function msToTime(s) {
  s = s*-1
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;
  //return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
  return (mins)+" min to show";
}
function pad(n, z) {
  z = z || 2;
  return ('00' + n).slice(-z);
}




// var countDownTime = "";


// // socket.on("sendMin_To_countDown", function(data) {
// //   //console.log("sendMin_To_countDown: "+data.countDownTime);
// //   //console.log(data.countDownTime.countDownTime);
// //   //countDownTime = data.countDownTime.countDownTime
// //   countDownTime = data.countDownTime
// //   //document.getElementById("fiveMinString").textContent = countDownTime+" min to show";

// //   showObjects();

// // });
// // socket.on("alertText_countdownUrl",function(data){
// //   $('body').prepend('<div class="blink d-flex align-items-center justify-content-center"><H1>'+data.text+'</H1></div>');
// //   console.log(data.text);

// //   sleep(10000).then(() => {
// //     $( ".blink" ).remove();
// //     });



// // });
// // function showObjects(){
// // console.log(countDownTime);
// // switch (countDownTime) {
// //   case 0:
// //   document.body.style.backgroundColor = "rgba(43, 43, 43, 0)";
// //   document.getElementById("fiveMin").style.display = "none";
// //   document.getElementById("foureMin").style.display = "none";
// //   document.getElementById("threeMin").style.display = "none";
// //   document.getElementById("twoMin").style.display = "none";
// //   document.getElementById("oneMin").style.display = "none";
// //   //document.getElementById("fiveMinString").style.display = "inline";
// //     break;
// //   case 1:
// //   document.body.style.backgroundColor = "rgba(43, 43, 43, 1)";
// //   document.getElementById("fiveMin").style.display = "none";
// //   document.getElementById("foureMin").style.display = "none";
// //   document.getElementById("threeMin").style.display = "none";
// //   document.getElementById("twoMin").style.display = "none";
// //   document.getElementById("oneMin").style.display = "inline";
// //   //document.getElementById("fiveMinString").style.display = "none";
// //     break;
// //   case 2:
// //   document.body.style.backgroundColor = "rgba(43, 43, 43, 1)";
// //   document.getElementById("fiveMin").style.display = "none";
// //   document.getElementById("foureMin").style.display = "none";
// //   document.getElementById("threeMin").style.display = "none";
// //   document.getElementById("twoMin").style.display = "inline";
// //   document.getElementById("oneMin").style.display = "none";
// //   //document.getElementById("fiveMinString").style.display = "none";
// //     break;
// //   case 3:
// //   document.body.style.backgroundColor = "rgba(43, 43, 43, 1)";
// //   document.getElementById("fiveMin").style.display = "none";
// //   document.getElementById("foureMin").style.display = "none";
// //   document.getElementById("threeMin").style.display = "inline";
// //   document.getElementById("twoMin").style.display = "none";
// //   document.getElementById("oneMin").style.display = "none";
// //   //document.getElementById("fiveMinString").style.display = "none";
// //     break;
// //   case 4:
// //   document.body.style.backgroundColor = "rgba(43, 43, 43, 1)";
// //   document.getElementById("fiveMin").style.display = "none";
// //   document.getElementById("foureMin").style.display = "inline";
// //   document.getElementById("threeMin").style.display = "none";
// //   document.getElementById("twoMin").style.display = "none";
// //   document.getElementById("oneMin").style.display = "none";
// //   //document.getElementById("fiveMinString").style.display = "none";
// //     break;
// //   case 5:
// //   document.body.style.backgroundColor = "rgba(43, 43, 43, 1)";
// //   document.getElementById("fiveMin").style.display = "inline";
// //   document.getElementById("foureMin").style.display = "none";
// //   document.getElementById("threeMin").style.display = "none";
// //   document.getElementById("twoMin").style.display = "none";
// //   document.getElementById("oneMin").style.display = "none";
// //   //document.getElementById("fiveMinString").style.display = "none";
// //     break;
// //   };
// // }
