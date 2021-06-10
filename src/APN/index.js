var apn = require('apn');
const iOSTokens = require("../services/iosToken-settings");
var SC = require('../websocket-listeners/SC-module/service');

const path = require('path')
const AuthKey_Path = path.join(__dirname, "AuthKey_WX4QX4S55M.p8")

var options = {
  token: {
    key: AuthKey_Path,
    keyId: "WX4QX4S55M",
    teamId: "F8993Q6N82"
  },
  production: true
};
var apnProvider = new apn.Provider(options);
let deviceToken = "D33AFD1B8CEEC2FF471FD7844E2A32D5199325235BA3E6AC7C852D85417555D3"
//-- iPhone Mathias = 04ED2C021A346AB3DA6F162146A16A1A994102801B35BC17DF84F8870485AD3F
async function sendNotification(minutes,message) {
  let deviceTokens = await getStoredTokens()
  var messageString = minutes + " " + message
  var note = new apn.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 60; // Expires 1 min from now.
  note.badge = 0;
  note.sound = "ping.aiff";
  note.alert = messageString;
  // note.payload = {
  //   'messageFrom': 'John Appleseed'
  // };
  note.topic = "com.Scheduled-countdown";
  apnProvider.send(note, deviceTokens).then((result) => {
    // see documentation for an explanation of result
    console.log("->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->");
    console.log("--->>> sendNotification")
    console.log(result);
    //console.log(result.failed);
    console.log("->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->");
  });
}

async function getStoredTokens(){
  let DATA = await iOSTokens.get()
  var result = [];

  for (i = 0; i < DATA.iosTokens.length; i++) {
    result.push(DATA.iosTokens[i].token);
  }
  console.log("//////////////////////////////////////////");
  // console.log(DATA.iosTokens);
  console.log(result);
  console.log("//////////////////////////////////////////");
  return result
}
//getStoredTokens()

async function checkCountDown(){
  let dly = 2000
  let countdown = await SC.countDown()

  let ms   = countdown.countDownTimeInMS
  let sec   = ms/1000

  if (countdown.bool) {

    if (sec > (-5*60-1) && sec < (-5*60) ) {
      
      setTimeout(() => { console.log("========================= 5"); }, dly);
      sendNotification(5,"min to " + countdown.title);
    }
    if (sec > (-4*60-1) && sec < (-4*60) ) {
      setTimeout(() => { console.log("========================= 4"); }, dly);
      sendNotification(4,"min to " + countdown.title);
    }
    if (sec > (-3*60-1) && sec < (-3*60) ) {
      setTimeout(() => { console.log("========================= 3"); }, dly);
      sendNotification(3,"min to " + countdown.title);
    }
    if (sec > (-2*60-1) && sec < (-2*60) ) {
      setTimeout(() => { console.log("========================= 2"); }, dly);
      sendNotification(2,"min to " + countdown.title);
    }
    if (sec > (-1*60-1) && sec < (-1*60) ) {
      setTimeout(() => { console.log("========================= 1"); }, dly);
      sendNotification(1,"min to " + countdown.title);
    }
  }
  setTimeout(checkCountDown,(1000*1));
}
checkCountDown(checkCountDown)

module.exports = {
  sendNotification
}