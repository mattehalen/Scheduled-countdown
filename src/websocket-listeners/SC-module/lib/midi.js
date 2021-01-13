console.log("---------- MIDI ----------");
var smpte_String;

function mtcTOString(midi_interface_ID) {
  //console.log(midi_interface_ID);

  if (typeof (midi_interface_ID) == 'number') {

    var JZZ = require('jzz');
    var port = JZZ().openMidiIn(midi_interface_ID);
    var smpte = JZZ.SMPTE();
    var midi = JZZ.MIDI();
    //console.log(JZZ.info());
    port
      .connect(function (msg) {
        smpte.read(msg);
        smpteString = smpte.toString();
        smpte_String = smpteString;
        // console.log(smpteString);
        smpteMs = timeStringToMs(smpteString);

        if (msg.toString().includes("Program Change")) {
          midi_Channel = msg[0] - 191;
          midi_ProgramChange = msg[1];
          midiTriggerCountDown();
        }

      });
    return smpte_String

  }



};
mtcTOString();

async function midiTriggerCountDown() {
  const adminSettingsData = await AdminSettings.get();
  const useMIDI_ProgramChange = adminSettingsData.timeSettings.useMIDI_ProgramChange;
  const scheduledTimes = adminSettingsData.schedule

  var offsetTime = newOffsetTime();
  var startTime = newCurrentTimeInMs() + countDown;
  startTime += offsetTime;

  var d = new Date(newCurrentTimeInMs() + countDown);
  var s = "";
  s += (10 > d.getHours() ? "0" : "") + d.getHours() + ":";
  s += (10 > d.getMinutes() ? "0" : "") + d.getMinutes() + ":";
  s += (10 > d.getSeconds() ? "0" : "") + d.getSeconds();

  if (midiTriggerCountDownCounter === 0 && useMIDI_ProgramChange != 0) {
    midiTriggerCountDownCounter++;
    startTimeTextHolder = s;
    startTitleHolder = scheduledTimes[midi_ProgramChange].title;
  }

  if (midi_ProgramChange === 127 && useMIDI_ProgramChange != 0) {
    var d = new Date(newCurrentTimeInMs() - countUp);
    var s = "";
    s += (10 > d.getHours() ? "0" : "") + d.getHours() + ":";
    s += (10 > d.getMinutes() ? "0" : "") + d.getMinutes() + ":";
    s += (10 > d.getSeconds() ? "0" : "") + d.getSeconds();

    startTimeTextHolder = s;
    midiTriggerCountDownCounter = 0;
    console.log("d efter  = " + d);
  };
}


//-------------------------------------------------------------------------
module.exports = {
  mtcTOString
}