var apn = require('apn');
var SC = require('../websocket-listeners/SC-module/service');
const path = require('path')
const AuthKey_Path = path.join(__dirname, "AuthKey_WX4QX4S55M.p8")

var options = {
  token: {
    key: AuthKey_Path,
    keyId: "WX4QX4S55M",
    teamId: "F8993Q6N82"
  },
  production: false
};
var apnProvider = new apn.Provider(options);
let deviceToken = "8E4780F45837A4158A50A0C9DECA763FEAE730A32075C3EE514A4B6801E7E7A2"
//-- iPhone Mathias = 04ED2C021A346AB3DA6F162146A16A1A994102801B35BC17DF84F8870485AD3F
function sendNotification(minutes) {
  var messageString = minutes + "min to next number!"
  var note = new apn.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 60; // Expires 1 min from now.
  note.badge = 0;
  note.sound = "ping.aiff";
  note.alert = messageString;
  // note.payload = {
  //   'messageFrom': 'John Appleseed'
  // };
  note.topic = "com.Scheduled-countdown";
  apnProvider.send(note, deviceToken).then((result) => {
    // see documentation for an explanation of result
    console.log("->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->");
    console.log(result);
    console.log(result.failed);
    console.log("->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->");
  });
}


async function checkCountDown(){
  let dly = 2000
  let countdown = await SC.countDown()
  let ms   = countdown.countDownTimeInMS
  let sec   = ms/1000

  if (countdown.bool) {

    if (sec > (-5*60-1) && sec < (-5*60) ) {
      
      setTimeout(() => { console.log("========================= 5"); }, dly);
      sendNotification(5);
    }
    if (sec > (-4*60-1) && sec < (-4*60) ) {
      setTimeout(() => { console.log("========================= 4"); }, dly);
      sendNotification(4);
    }
    if (sec > (-3*60-1) && sec < (-3*60) ) {
      setTimeout(() => { console.log("========================= 3"); }, dly);
      sendNotification(3);
    }
    if (sec > (-2*60-1) && sec < (-2*60) ) {
      setTimeout(() => { console.log("========================= 2"); }, dly);
      sendNotification(2);
    }
    if (sec > (-1*60-1) && sec < (-1*60) ) {
      setTimeout(() => { console.log("========================= 1"); }, dly);
      sendNotification(1);
    }
  }
  setTimeout(checkCountDown,(1000*1));
}
checkCountDown(checkCountDown)

module.exports = {
  sendNotification
}