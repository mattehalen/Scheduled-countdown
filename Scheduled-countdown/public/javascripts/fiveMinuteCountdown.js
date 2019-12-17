"use strict";

var myLocalip = document.getElementById("myLocalip").textContent;
var myLocalipAndPort = myLocalip+":3000"
console.log(myLocalipAndPort);
var countDownTime = "";

var socket = io.connect(myLocalipAndPort);
socket.on("sendMin_To_countDown", function(data) {
  console.log("sendMin_To_countDown: "+data.countDownTime);
  console.log(data.countDownTime.countDownTime);
  countDownTime = data.countDownTime.countDownTime

  //document.getElementById("fiveMinString").textContent = countDownTime+" min to show";

  showObjects();

});

function showObjects(){
console.log(countDownTime);
switch (countDownTime) {
  case 0:
  document.getElementById("fiveMin").style.display = "none";
  document.getElementById("foureMin").style.display = "none";
  document.getElementById("threeMin").style.display = "none";
  document.getElementById("twoMin").style.display = "none";
  document.getElementById("oneMin").style.display = "none";
  //document.getElementById("fiveMinString").style.display = "flex";
    break;
  case 1:
  document.getElementById("fiveMin").style.display = "none";
  document.getElementById("foureMin").style.display = "none";
  document.getElementById("threeMin").style.display = "none";
  document.getElementById("twoMin").style.display = "none";
  document.getElementById("oneMin").style.display = "flex";
  //document.getElementById("fiveMinString").style.display = "none";
    break;
  case 2:
  document.getElementById("fiveMin").style.display = "none";
  document.getElementById("foureMin").style.display = "none";
  document.getElementById("threeMin").style.display = "none";
  document.getElementById("twoMin").style.display = "flex";
  document.getElementById("oneMin").style.display = "none";
  //document.getElementById("fiveMinString").style.display = "none";
    break;
  case 3:
  document.getElementById("fiveMin").style.display = "none";
  document.getElementById("foureMin").style.display = "none";
  document.getElementById("threeMin").style.display = "flex";
  document.getElementById("twoMin").style.display = "none";
  document.getElementById("oneMin").style.display = "none";
  //document.getElementById("fiveMinString").style.display = "none";
    break;
  case 4:
  document.getElementById("fiveMin").style.display = "none";
  document.getElementById("foureMin").style.display = "flex";
  document.getElementById("threeMin").style.display = "none";
  document.getElementById("twoMin").style.display = "none";
  document.getElementById("oneMin").style.display = "none";
  //document.getElementById("fiveMinString").style.display = "none";
    break;
  case 5:
  document.getElementById("fiveMin").style.display = "flex";
  document.getElementById("foureMin").style.display = "none";
  document.getElementById("threeMin").style.display = "none";
  document.getElementById("twoMin").style.display = "none";
  document.getElementById("oneMin").style.display = "none";
  //document.getElementById("fiveMinString").style.display = "none";
    break;
  };
}
