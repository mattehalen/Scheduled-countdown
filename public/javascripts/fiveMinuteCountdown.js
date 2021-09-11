// "use strict";
// const KEYS = {
//   "COUNTDOWN":      "countDown",
//   "COUNTDOWNURL":       "countdownUrl",
// };

// WebSocketService.onEvent(KEYS.COUNTDOWN, (message) => {
//   //console.log('Message from server: ', message);

//   if (message.bool) {

//     if (message.countDownTimeInMS > ((5 * -60000)) && message.countDownTimeInMS < 0) {
//       document.getElementById("countDown").textContent = msToTime(message.countDownTimeInMS - 60000);
//       document.getElementById("countDown").style.display = "inline";
//       document.body.style.backgroundColor = "rgba(43, 43, 43, 1)";
//     }
//     else{
//       document.body.style.backgroundColor = "rgba(43, 43, 43, 0)";
//       document.getElementById("countDown").style.display = "none";
//     }

//   } else {
//     document.body.style.backgroundColor = "rgba(43, 43, 43, 0)";
//     document.getElementById("countDown").style.display = "none";
//   }

// })
// WebSocketService.onEvent(KEYS.COUNTDOWNURL, (message) => {
//   $('body').prepend('<div class="blink d-flex align-items-center justify-content-center"><H1>' + message.text + '</H1></div>');
//   console.log(message.text);

//   sleep(message.time).then(() => {
//     $(".blink").remove();
//   });
// })
function msToTime(s) {
  s = s * -1
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;
  //return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
  return (mins);
}

function pad(n, z) {
  z = z || 2;
  return ('00' + n).slice(-z);
}


setInterval(function () {
  $.get(
    "http://192.168.100.1:3000/countdown/getCountDown",
    function (message) {
      //  console.log(message)
      //  console.log(message.fiveBool != 0)

      if (message.bool && message.fiveBool != 0) {
        // if (true) {


        if (message.countDownTimeInMS > ((5 * -60000)) && message.countDownTimeInMS < 0) {
        // if (true) {
          displayTrue()
          document.getElementById("countDown").innerText = msToTime(message.countDownTimeInMS - 60000)
        } else {
          displayFalse()
          document.body.style.backgroundColor = "rgba(0, 0, 0, 0)";
        }

      } else {
        displayFalse()
        document.body.style.backgroundColor = "rgba(0, 0, 0, 0)";
      }
    }
  );

}, 1000);

setInterval(function(){
location.reload();
}, 1000*60*60*24);


function displayTrue(){
  // document.getElementById("countDown").innerText = msToTime(message.countDownTimeInMS - 60000)
  document.getElementById("countDown").style.color = "rgba(255, 255, 255, 1)"
  document.getElementById("text").style.color = "rgba(255, 255, 255, 1)"
  document.body.style.backgroundColor = "rgba(0, 0, 0, 1)";
}
function displayFalse(){
            // document.getElementById("countDown").innerText = msToTime(message.countDownTimeInMS - 60000)
          document.getElementById("countDown").style.color = "rgba(255, 255, 255, 0)"
          document.getElementById("text").style.color = "rgba(255, 255, 255, 0)"
          document.body.style.backgroundColor = "rgba(0, 0, 0, 0)";
}