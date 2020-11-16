"use strict";

var myLocalip = document.getElementById("myLocalip").textContent;
//var myLocalipAndPort = myLocalip + ":3000"
var myLocalipAndPort = myLocalip
console.log(myLocalipAndPort);
var countDownTime = "";

var socket = io.connect(myLocalipAndPort);
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

socket.on("sendMin_To_countDown", function(data) {
  //console.log("sendMin_To_countDown: "+data.countDownTime);
  //console.log(data.countDownTime.countDownTime);
  //countDownTime = data.countDownTime.countDownTime
  countDownTime = data.countDownTime
  //document.getElementById("fiveMinString").textContent = countDownTime+" min to show";

  showObjects();

});
socket.on("alertText_countdownUrl",function(data){
  $('body').prepend('<div class="blink d-flex align-items-center justify-content-center"><H1>'+data.text+'</H1></div>');
  console.log(data.text);

  sleep(5000).then(() => {
    $( ".blink" ).remove();
    });



});
function showObjects(){
console.log(countDownTime);
switch (countDownTime) {
  case 0:
  document.body.style.backgroundColor = "rgba(43, 43, 43, 0)";
  document.getElementById("fiveMin").style.display = "none";
  document.getElementById("foureMin").style.display = "none";
  document.getElementById("threeMin").style.display = "none";
  document.getElementById("twoMin").style.display = "none";
  document.getElementById("oneMin").style.display = "none";
  //document.getElementById("fiveMinString").style.display = "inline";
    break;
  case 1:
  document.body.style.backgroundColor = "rgba(43, 43, 43, 1)";
  document.getElementById("fiveMin").style.display = "none";
  document.getElementById("foureMin").style.display = "none";
  document.getElementById("threeMin").style.display = "none";
  document.getElementById("twoMin").style.display = "none";
  document.getElementById("oneMin").style.display = "inline";
  //document.getElementById("fiveMinString").style.display = "none";
    break;
  case 2:
  document.body.style.backgroundColor = "rgba(43, 43, 43, 1)";
  document.getElementById("fiveMin").style.display = "none";
  document.getElementById("foureMin").style.display = "none";
  document.getElementById("threeMin").style.display = "none";
  document.getElementById("twoMin").style.display = "inline";
  document.getElementById("oneMin").style.display = "none";
  //document.getElementById("fiveMinString").style.display = "none";
    break;
  case 3:
  document.body.style.backgroundColor = "rgba(43, 43, 43, 1)";
  document.getElementById("fiveMin").style.display = "none";
  document.getElementById("foureMin").style.display = "none";
  document.getElementById("threeMin").style.display = "inline";
  document.getElementById("twoMin").style.display = "none";
  document.getElementById("oneMin").style.display = "none";
  //document.getElementById("fiveMinString").style.display = "none";
    break;
  case 4:
  document.body.style.backgroundColor = "rgba(43, 43, 43, 1)";
  document.getElementById("fiveMin").style.display = "none";
  document.getElementById("foureMin").style.display = "inline";
  document.getElementById("threeMin").style.display = "none";
  document.getElementById("twoMin").style.display = "none";
  document.getElementById("oneMin").style.display = "none";
  //document.getElementById("fiveMinString").style.display = "none";
    break;
  case 5:
  document.body.style.backgroundColor = "rgba(43, 43, 43, 1)";
  document.getElementById("fiveMin").style.display = "inline";
  document.getElementById("foureMin").style.display = "none";
  document.getElementById("threeMin").style.display = "none";
  document.getElementById("twoMin").style.display = "none";
  document.getElementById("oneMin").style.display = "none";
  //document.getElementById("fiveMinString").style.display = "none";
    break;
  };
}
