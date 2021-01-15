console.log("---------- MIDI ----------");
var JZZ = require('jzz');

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
var smpte_String;

function mtcTOString(midi_interface_ID) {
  //console.log(midi_interface_ID);

  if (typeof (midi_interface_ID) == 'number') {

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

async function midi_interface_IDs() {
  let midi_inputs = JZZ.info().inputs;
  let midi_input_obj = {};

  for (const [key, value] of Object.entries(midi_inputs)) {
    midi_input_obj[(midi_inputs[key].name)] = key;
  }

  return midi_input_obj

}

//-------------------------------------------------------------------------
module.exports = {
  mtcTOString,
  midi_interface_IDs
}

// [
//   {
//     id: 'MA',
//     name: 'MA',
//     manufacturer: 'unknown',
//     version: '1.0',
//     engine: 'node'
//   },
//     id: 'Reaper',
//     name: 'Reaper',
//     manufacturer: 'unknown',
//     version: '1.0',
//     engine: 'node'
//   }
// ]