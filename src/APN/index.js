var apn = require('apn');

var options = {
  token: {
    key: "src/APN/AuthKey_WX4QX4S55M.p8",
    keyId: "WX4QX4S55M",
    teamId: "F8993Q6N82"
  },
  production: false
};
var apnProvider = new apn.Provider(options);
let deviceToken = "04ED2C021A346AB3DA6F162146A16A1A994102801B35BC17DF84F8870485AD3F"
//-- iPhone Mathias = 04ED2C021A346AB3DA6F162146A16A1A994102801B35BC17DF84F8870485AD3F

var note = new apn.Notification();
note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
note.badge = 3;
note.sound = "ping.aiff";
note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
note.payload = {'messageFrom': 'John Appleseed'};
note.topic = "<your-app-bundle-id>";

apnProvider.send(note, deviceToken).then( (result) => {
  // see documentation for an explanation of result
  console.log("->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->");
  console.log(result);
  console.log("->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->");
});
