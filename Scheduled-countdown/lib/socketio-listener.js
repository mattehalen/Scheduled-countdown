const fs = require('fs');

const Utilities = require('./../services/utilties');
const FileOperation = require('./../services/file-operations');
const AdminSettings = require('./../services/admin-settings');
const ADMIN_SETTINGS_JSON_FILE = AdminSettings.FILEPATH.ADMIN_SETTINGS_JSON_FILENAME;


// This is th socket for server
let io = null;


var startTimeArray = [""];
var startTitleHolder = "";
var startTitleArray = [""];
var startTimeTextHolder = "";
var cueLengthArray = [""];
var cueLengthTextHolder = "";
var offsetTimeInit = [];
//--- newly added BOOLS
var cueBoolArray = [""];
var cueBoolHolder = "";

var fiveBoolArray = [""];
var fiveBoolHolder = [""];
var sendMin_To_countDownBoole = 100;
//--------------------------------------------------
var scheduleBool;
//--------------------------------------------------

//--from Script.js
var offsetTimeInit = 0;
var offsetTimejson = [];
//--------------------------------------------------
var countDown = 7;
countDown = countDown * 60000;
var countUp = 2;
countUp = countUp * 60000;

var nowInMs = 0;
var setTimeoutTime = 150;
var newArrayIndex = 0;




//-------------------------------------------------------------------------
// MIDI
//-------------------------------------------------------------------------
var smpteString;
var smpteMs;
var midi_ProgramChange;
var midi_Channel;
var midiTriggerCountDownCounter = 0;

function mtcTOString() {
    var JZZ = require('jzz');
    var port = JZZ().openMidiIn(1);
    var smpte = JZZ.SMPTE();
    var midi = JZZ.MIDI();
    // console.log(midi);
    midi

    port.connect(function (msg) {
        smpte.read(msg);
        smpteString = smpte.toString();
        smpteMs = timeStringToMs(smpteString);
        if (msg.toString().includes("Program Change")) {
            midi_Channel = msg[0] - 191;
            midi_ProgramChange = msg[1];
            midiTriggerCountDown();
        }

    });
};

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



function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            return cb && cb(err)
        }
        try {
            const object = JSON.parse(fileData)
            return cb && cb(null, object)
        } catch (err) {
            return cb && cb(err)
        }
    })
}

//Uppdaterad
async function updateScheduledTimesjson() {
    const adminSettings = await AdminSettings.get();

    if (adminSettings.schedule.length > startTitleArray.length) {
        var a = adminSettings.schedule.length - 1;
        adminSettings.schedule.splice(a, 1);
    }

    for (let i = 0; i < adminSettings.schedule.length; i++) {
        adminSettings.schedule[i].title = startTitleArray[i]
        adminSettings.schedule[i].startTime = startTimeArray[i]
        adminSettings.schedule[i].cueLength = cueLengthArray[i]
        adminSettings.schedule[i].cueBool = cueBoolArray[i]
        adminSettings.schedule[i].fiveBool = fiveBoolArray[i]
    }

    adminSettings.schedule.sort(function (a, b) {
        return a.startTime.localeCompare(b.startTime);
    });
    await AdminSettings.write(adminSettings);
}

//Uppdaterad
async function updateOffsetTimePlusjson() {
    try {
        const adminSettings = await scheduledTimes.get();
        adminSettings.timeSettings.offsetTime += 1;
        await scheduledTimes.write(adminSettings);

    } catch (error) {
        console.log(error);
    }
}

async function updateOffsetTimeMinusjson() {
    try {
        const adminSettings = await scheduledTimes.get();
        adminSettings.timeSettings.offsetTime -= 1;
        await scheduledTimes.write(adminSettings);

    } catch (error) {
        console.log(error);
    }
}

async function updateOffsetTimeResetjson() {
    try {
        const adminSettings = await scheduledTimes.get();
        adminSettings.timeSettings.offsetTime = 0;
        await scheduledTimes.write(adminSettings);

    } catch (error) {
        console.log(error);
    }
}


function getOffsetTimejson() {
    AdminSettings.get()
        .then(adminSettingsData => {
            offsetTimejson = adminSettingsData.timeSettings.offsetTime;
        })
        .catch(error => {
            console.log('Error reading file:', err)
        })
}

//Uppdaterad
function addNewRowDefault() {
    console.log("addNewRowDefault knappen funkar");
    var addString = "";

    fs.readFile(ADMIN_SETTINGS_JSON_FILE, function (err, data) {
        var json = JSON.parse(data);
        var feed = {
            title: "New row added",
            startTime: "12:00",
            cueLength: "00:01:10"
        };

        json.schedule.push(feed);
        console.log("addNewRowDefault: " + JSON.stringify(json, null, 4));
        json.schedule.sort(function (a, b) {
            return a.startTime.localeCompare(b.startTime);
        });
        addString = JSON.stringify(json, null, 4);
        console.log("addNewRowDefault: " + JSON.stringify(json, null, 4));

    });

    Utilities.sleep(1000).then(() => {
        fs.writeFile(ADMIN_SETTINGS_JSON_FILE, addString, (err) => {
            if (err) throw err;
        });
    });
}

//Uppdaterad
function getscheduledTimes() {
    console.log("--------------------> Socket getscheduledTimes <--------------------  " + newCurrentTime());
    AdminSettings.get()
        .then(adminSettings => {
            for (let i = 0; i < adminSettings.schedule.length; i++) {
                startTitleArray[i] = adminSettings.schedule[i].title
                startTimeArray[i] = adminSettings.schedule[i].startTime
                cueLengthArray[i] = adminSettings.schedule[i].cueLength
                cueBoolArray[i] = adminSettings.schedule[i].cueBool
                fiveBoolArray[i] = adminSettings.schedule[i].fiveBool
            }
        })
        .catch(error => {
            console.log('Error reading file:', err)
        })
}




//--------------------------------------------------
//- CurrentTime
//--------------------------------------------------
//Uppdaterad
async function newTimeArraySorting() {
    const adminSettings = await AdminSettings.get();
    const scheduledTimes = adminSettings.schedule;

    var useMIDI_ProgramChange = adminSettings.timeSettings.useMIDI_ProgramChange;

    const data = await AdminSettings.getWeekDay();
    if (data === 0) {
        scheduleBool = false;
    } else {
        scheduleBool = true
    }

    if (newArrayIndex < scheduledTimes.length && useMIDI_ProgramChange === 0 && scheduleBool) {
        // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        var time = scheduledTimes[newArrayIndex].startTime

        var d = new Date();
        var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${time}`);

        // console.log("nowInMs = "+nowInMs);
        // console.log((dd.getTime() + newOffsetTime()) + countUp);
        // console.log(nowInMs > ((dd.getTime() + newOffsetTime()) + countUp));
        // console.log("-----------------------------------------------------------");
        if (nowInMs > ((dd.getTime() + newOffsetTime()) + countUp)) {
            newArrayIndex++;
        } else {
            startTitleHolder = scheduledTimes[newArrayIndex].title;
            startTimeTextHolder = scheduledTimes[newArrayIndex].startTime;
            cueLengthTextHolder = scheduledTimes[newArrayIndex].cueLength;

            cueBoolHolder = scheduledTimes[newArrayIndex].cueBool;
            fiveBoolHolder = scheduledTimes[newArrayIndex].fiveBool;
            // console.log("startTimeTextHolder = "+startTimeTextHolder);
        }

        if (newArrayIndex === scheduledTimes.length) {
            newArrayIndex = 0;
        }
    };

    //--------------------------------------------------
    setTimeout(newTimeArraySorting, setTimeoutTime);
}

function newOffsetTime() {
    var offsetTime = offsetTimejson;
    if (typeof offsetTime === "number") {
        offsetTime = offsetTimejson;
    } else {
        offsetTime = 0;
    }
    offsetTime *= 1000 * 60
    return offsetTime
}
newOffsetTime();

function newCurrentTime() {
    const date = new Date();
    nowInMs = date.getTime();

    var time = "";
    time += (10 > date.getHours() ? "0" : "") + date.getHours() + ":";
    time += (10 > date.getMinutes() ? "0" : "") + date.getMinutes() + ":";
    time += (10 > date.getSeconds() ? "0" : "") + date.getSeconds();

    return time;
}

function newCurrentTimeInMs() {
    var date = new Date();
    var dInMs = date.getTime()

    return dInMs
}

function newStartTimeInMs(time) {
    //console.log(newOffsetTime());
    var d = new Date();
    var dd = new Date(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${time}`);
    var ddInMs = dd.getTime()

    return ddInMs
}

function newCountDown() {
    var time = "";
    var offsetTime = newOffsetTime();
    var now = newCurrentTimeInMs();
    var startTime = newStartTimeInMs(startTimeTextHolder);
    startTime += offsetTime;
    //console.log("newCountDown = " + msToTime(startTime)+" - "+startTimeTextHolder);

    if (now > startTime) {
        time = now - startTime
        time = (msToTime(time))
    } else {
        time = startTime - now
        time = "-" + (msToTime(time))
    }

    //--------------------------------------------------
    var timeBuffer = 1 * 1000
    var sixMinuteMs = (6 * 1000 * 60);
    var fiveMinuteMs = (5 * 1000 * 60);
    var fourMinuteMs = (4 * 1000 * 60);
    var threeMinuteMs = (3 * 1000 * 60);
    var twoMinuteMs = (2 * 1000 * 60);
    var oneMinuteMs = (1 * 1000 * 60);
    var countDownTimeInMS = startTime - now;
    //console.log((msToTime(startTime - now)));

    //console.log(countDownTimeInMS);
    if (fiveBoolHolder == 1) {
        //  6larm
        if (countDownTimeInMS > sixMinuteMs && countDownTimeInMS < (sixMinuteMs + timeBuffer)) {
            //if (countDownTimeInMS < sixMinuteMs && countDownTimeInMS > fiveMinuteMs) {
        }
        // 5min Alarm
        //if (countDownTimeInMS > fiveMinuteMs && countDownTimeInMS < (fiveMinuteMs + timeBuffer)) {
        if (countDownTimeInMS < fiveMinuteMs && countDownTimeInMS > fourMinuteMs) {
            if (sendMin_To_countDownBoole != 5) {
                sendMin_To_countDownBoole = 5;
                io.emit("sendMin_To_countDown", {
                    countDownTime: 5
                });
            };
        }
        // 4min Alarm
        //if (countDownTimeInMS > fourMinuteMs && countDownTimeInMS < (fourMinuteMs + timeBuffer)) {
        if (countDownTimeInMS < fourMinuteMs && countDownTimeInMS > threeMinuteMs) {
            if (sendMin_To_countDownBoole != 4) {
                sendMin_To_countDownBoole = 4;
                io.emit("sendMin_To_countDown", {
                    countDownTime: 4
                });
            };
        }
        // 3min Alarm
        //if (countDownTimeInMS > threeMinuteMs && countDownTimeInMS < (threeMinuteMs + timeBuffer)) {
        if (countDownTimeInMS < threeMinuteMs && countDownTimeInMS > twoMinuteMs) {
            if (sendMin_To_countDownBoole != 3) {
                sendMin_To_countDownBoole = 3;
                io.emit("sendMin_To_countDown", {
                    countDownTime: 3
                });
            };
        }
        // 2min Alarm
        //if (countDownTimeInMS > twoMinuteMs && countDownTimeInMS < (twoMinuteMs + timeBuffer)) {
        if (countDownTimeInMS < twoMinuteMs && countDownTimeInMS > oneMinuteMs) {
            if (sendMin_To_countDownBoole != 2) {
                sendMin_To_countDownBoole = 2;
                io.emit("sendMin_To_countDown", {
                    countDownTime: 2
                });
            };
        }
        // 1min Alarm
        //if (countDownTimeInMS > oneMinuteMs && countDownTimeInMS < (oneMinuteMs + timeBuffer)) {
        if (countDownTimeInMS < oneMinuteMs && countDownTimeInMS > 0) {
            if (sendMin_To_countDownBoole != 1) {
                sendMin_To_countDownBoole = 1;
                io.emit("sendMin_To_countDown", {
                    countDownTime: 1
                });
            };
        }
        // 0min Alarm
        //if (countDownTimeInMS > 0 && countDownTimeInMS < (0 + timeBuffer)) {
        if (countDownTimeInMS < 0 || countDownTimeInMS > fiveMinuteMs) {
            if (sendMin_To_countDownBoole != 0) {
                sendMin_To_countDownBoole = 0;
                io.emit("sendMin_To_countDown", {
                    countDownTime: 0
                });
            };
        }
    }


    if (fiveBoolHolder == 0) {
        if (sendMin_To_countDownBoole != 0) {
            sendMin_To_countDownBoole = 0;
            io.emit("sendMin_To_countDown", {
                countDownTime: 0
            });
        };
    };
    //--------------------------------------------------




    // io.emit("sendMin_To_countDown", {
    //   countDownTime: now - startTime
    // });


    setTimeout(newCountDown, setTimeoutTime);
    return time
}

function newCueCountDown() {
    var cueLength = cueLengthTextHolder;
    //--------------------------------------------------
    if (cueLength.length > 5) {
        cueLength = timeStringToMs(cueLength);
    } else {
        cueLength = cueLength + ":00"
        cueLength = timeStringToMs(cueLength);
    }
    //--------------------------------------------------
    var offsetTime = newOffsetTime();
    var startTime = newStartTimeInMs(startTimeTextHolder);
    var cueStarTime = (startTime - cueLength)
    cueStarTime += offsetTime
    var now = newCurrentTimeInMs();

    if (now > cueStarTime) {
        time = now - cueStarTime
        time = (msToTime(time))
    } else {
        time = cueStarTime - now
        time = "-" + (msToTime(time))
    }
    //--------------------------------------------------
    var textString = "";
    if (now > (cueStarTime - countDown) && now < (cueStarTime + (1000 * 60 * 2)) && cueBoolHolder == 1) {
        textString = "CUE - " + startTitleHolder + ": " + time
    } else {
        textString = ""
    }

    io.emit("getCueTimeString_From_Socket", {
        string: textString,
        newCurrentTimeInMs: cueStarTime - now,
        cueBoolHolder: cueBoolHolder
    });



    setTimeout(newCueCountDown, setTimeoutTime);
}

function timeStringToMs(t) {
    if (t > 5) {
        var r = Number(t.split(':')[0]) * (60 * 60000) + Number(t.split(':')[1]) * (60000) + Number(t.split(':')[2]) * (1000);
    } else {
        t = t + ":00"
        var r = Number(t.split(':')[0]) * (60 * 60000) + Number(t.split(':')[1]) * (60000) + Number(t.split(':')[2]) * (1000);
    }
    return r;

}

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}

function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
}

function sendCenterText() {
    var countDownString = newCountDown();
    var now = newCurrentTimeInMs();
    var offset = newOffsetTime();
    var start = newStartTimeInMs(startTimeTextHolder) + offset;


    // autoResetOffsetTime
    //--------------------------------------------------
    if (now > (start + countUp) && now < (start + countUp + 500)) {
        console.log("autoResetOffsetTime");
        autoResetOffsetTime();
    };
    //--------------------------------------------------

    if (
        now > ((start) - countDown) &&
        now < ((start) + countUp)
    ) {
        var showNowClock = false;
    } else {
        var showNowClock = true;
    }
    //console.log(newStartTimeInMs(startTimeTextHolder)-newCurrentTimeInMs(),);
    // console.log("countDownString = "+countDownString);
    io.emit("centerTextContent", {
        countDownString: countDownString,
        countDownTimeInMS: newStartTimeInMs(startTimeTextHolder) - newCurrentTimeInMs(),
        showNowClock: showNowClock,
        newCurrentTime: newCurrentTime(),
        startTitleHolder: startTitleHolder,
        offsetTimeInit: newOffsetTime()
    });
    setTimeout(sendCenterText, setTimeoutTime);
};

function autoResetOffsetTime() {
    Utilities.sleep(1 * 6000).then(() => {
        console.log("autoResetOffsetTime");
        offsetTimeInit = 0;

        if (offsetTimeInit !== undefined) {
            updateOffsetTimeResetjson();
            io.emit("updateOffsetTime_From_Socket", {
                offsetTime: offsetTimeInit
            });
        } else {
            console.log("offsetTimeInit = undefined - autoResetOffsetTime -" + newCurrentTime());
        }

    });



}

function resetsetTimeout() {

    //---------
    Utilities.sleep(1000 * 60 * 60).then(() => {
        console.log("----------> resetsetTimeout() <----------   " + newCurrentTime());
        fs.writeFile('./autoRestartServer.json', JSON.stringify("adminSettings", null, 4), (err) => {
            if (err) console.log('Error writing file:', err)
        })

    });



    //setTimeout(resetsetTimeout,(1000*60*5))
}

function checkIfUserExist(user) {
    console.log("checkIfUserExist + user  = " + user);
    const path = './public/CueLists/' + user + '.json'

    fs.access(path, fs.F_OK, (err) => {
        if (err) {
            fs.writeFile(path, JSON.stringify("adminSettings", null, 4), (err) => {
                if (err) console.log('Error writing file:', err)
            })
            //console.error(err)
            return
        }
        console.log("--------------------> .json file exist from user = " + user);
        FileOperation.readFromFile(path)
            .then(cueList => {
                cueList.cues.sort(function (a, b) {
                    return a.timecode.localeCompare(b.timecode);
                });
                //-- sort
                io.emit("cueListFromSocket", {
                    cueList: cueList.cues
                });
            })
            .catch(error => {
                console.log('Error reading file:', error)
            })

    })
}

function addNewCueRowToUser(user) {
    console.log("addNewCueRowToUser + user  = " + user);
    const path = './public/CueLists/' + user + '.json'
    var copyPath = './public/CueLists/AddNewCueRow.json'
    var copyjson = {};
    console.log("copyPath = " + copyPath);

    //----- AddNewCueRow
    FileOperation.readFromFile(copyPath)
        .then(cueList => {
            copyjson = cueList;
        })
        .catch(error => {
            console.log('Error reading file:', error)
        })
    //----- UserCueList

    Utilities.sleep(250).then(() => {
        jsonReader(path, (err, cueList) => {
            if (err) {
                console.log('Error reading file:', err)
                return
            }

            cueList.cues.push(copyjson);
            console.log(cueList.cues);

            //-- sort
            cueList.cues.sort(function (a, b) {
                return a.timecode.localeCompare(b.timecode);
            });
            console.log(cueList.cues);

            Utilities.sleep(250).then(() => {
                fs.writeFile(path, JSON.stringify(cueList, null, 4), (err) => {
                    if (err) console.log('Error writing file:', err)
                })
            })

        })
    });
}

function deleteCueRowFromUser(user, listIndex) {
    console.log("deleteCueRowFromUser + user  = " + user);
    console.log("deleteCueRowFromUser + user  = " + listIndex);
    const path = './public/CueLists/' + user + '.json'

    jsonReader(path, (err, cueList) => {
        if (err) {
            console.log('Error reading file:', err)
            return
        }
        console.log(cueList.cues);
        cueList.cues.splice(listIndex, 1);
        console.log(cueList.cues);

        Utilities.sleep(250).then(() => {
            fs.writeFile(path, JSON.stringify(cueList, null, 4), (err) => {
                if (err) console.log('Error writing file:', err)
            })

        })
    })

}

function deleteRowFromSchedule(listIndex) {
    console.log("deleteRowFromSchedule + user  = " + listIndex);

    jsonReader(ADMIN_SETTINGS_JSON_FILE, (err, adminSettings) => {
        if (err) {
            console.log('Error reading file:', err)
            return
        }
        console.log(adminSettings.schedule);
        adminSettings.schedule.splice(listIndex, 1);
        console.log(adminSettings.schedule);

        Utilities.sleep(250).then(() => {
            fs.writeFile(ADMIN_SETTINGS_JSON_FILE, JSON.stringify(adminSettings, null, 4), (err) => {
                if (err) console.log('Error writing file:', err)
            })

        })
    })

}
//----- Promise





//---------- Socket Listeners - END ------------
function user(data) {
    checkIfUserExist(data.user);
}

function reload() {
    console.log("+-+-+-+--+--+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+- Socket Reload +-+-+-+--+--+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-" + newCurrentTime());
    newArrayIndex = 0;
    startTimeTextHolder = "";
}

function getTimeCode() {
    io.emit("sendTimeCode", {
        smpteString: smpteString,
        smpteMs: smpteMs,
        midi_ProgramChange: midi_ProgramChange,
        midi_Channel: midi_Channel
    });
    //mtcTOString();
}

function writeToScheduledTimesjson(data) {
    console.log("--------------------> writeToScheduledTimesjson <--------------------");
    startTitleArray = data.startTitleArray;
    startTimeArray = data.startTimeArray;
    cueLengthArray = data.cueLengthArray;
    cueBoolArray = data.cueBoolArray;
    fiveBoolArray = data.fiveBoolArray;

    // console.log(fiveBoolArray);
    updateScheduledTimesjson();
}

// function updateScheduledTimesArray(data) {
//   console.log("--------------------> updateScheduledTimesArray <--------------------");
//   io.emit("updateDB_From_Socket", {
//     startTitleArray: startTitleArray,
//     startTimeArray: startTimeArray,
//     cueLengthArray: cueLengthArray,
//     cueBoolArray: cueBoolArray,
//     fiveBoolArray: fiveBoolArray
//   });
// }

function updateOffsetTimePlus(data) {
    console.log("updateOffsetTime: " + data.offsetTime);
    offsetTimeInit = data.offsetTime;
    console.log(offsetTimeInit);
    updateOffsetTimePlusjson();
    io.emit("updateOffsetTime_From_Socket", {
        offsetTime: offsetTimeInit
    });
}

function updateOffsetTimeMinus(data) {
    console.log("updateOffsetTimeMinus: " + data.offsetTime);
    offsetTimeInit = data.offsetTime;
    console.log(offsetTimeInit);
    updateOffsetTimeMinusjson();
    io.emit("updateOffsetTime_From_Socket", {
        offsetTime: offsetTimeInit
    });
}

function updateOffsetTimeReset(data) {
    console.log("updateOffsetTimeReset: " + data.offsetTime);
    offsetTimeInit = data.offsetTime;
    console.log(offsetTimeInit);
    updateOffsetTimeResetjson();
    io.emit("updateOffsetTime_From_Socket", {
        offsetTime: offsetTimeInit
    });
}

// function loadDefaultToSocket(data) {
//   console.log("loadDefaultToSocket: " + data.message);
//   loadDefaultjson();
//
//   Utilities.sleep(10).then(() => {
//     io.emit("pushGetscheduledTimes", {
//       offsetTime: offsetTimeInit
//     });
//     io.emit("loadDefault_From_Socket", {
//       offsetTime: offsetTimeInit
//     });
//   });
// }

// function writeDefaultToSocket(data) {
//   console.log("writeDefaultToSocket: " + data.startTimeArray);
//
//   startTimeArray = data.startTimeArray;
//   startTitleArray = data.startTitleArray;
//   cueLengthArray = data.cueLengthArray;
//   cueBoolArray = data.cueBoolArray;
//   fiveBoolArray = data.fiveBoolArray;
//
//   writeDefaultjson();
// }

function fiveMinPageLoad_To_Socket(data) {
    // console.log(data.countDownTime);
    io.emit("sendMin_To_countDown", {
        countDownTime: data
    });
}

function fiveMinPageStart() {
    // TODO
}

function updatebutton_To_Socket() {
    io.emit("updatebutton_From_Socket", {})
}

function sortingButton_To_Socket() {
    io.emit("sortingButton_From_Socket", {})
}

function send_Delete_Button_To_Socket(data) {
    deleteRowFromSchedule(data.listIndex);
    // listIndex = data.listIndex
    // console.log("send_Delete_Button_To_Socket: listIndex= " + listIndex);
    // io.emit("send_Delete_Button_from_Socket", {
    //   listIndex: listIndex
    // })
}

function send_Delete_CueButton_To_Socket(data) {
    console.log("send_Delete_CueButton_To_Socket: listIndex= " + data.listIndex);
    deleteCueRowFromUser(data.user, data.listIndex);
}

function send_addNewRow_To_Socket() {
    console.log("send_addNewRow_To_Socket:");
    addNewRowDefault();
}

function sendChosenIp_To_Socket(data) {
    console.log("sendChosenIp_To_Socket:-------------------------------- ", data.myChosenIp);
    jsonReader(ADMIN_SETTINGS_JSON_FILE, (err, adminSettings) => {
        if (err) {
            console.log('Error reading file:', err)
            return
        }
        console.log("sendChosenIp_To_Socket: adminSettings");
        console.log(adminSettings.ipsettings.ipadress);
        adminSettings.ipsettings.ipadress = data.myChosenIp;


        fs.writeFile(ADMIN_SETTINGS_JSON_FILE, JSON.stringify(adminSettings, null, 4), (err) => {
            if (err) console.log('Error writing file:', err)
        })
    })
}

function reloadFiveMinCountDown() {
    console.log("reloadFiveMinCountDown");
    fiveBoolHolder = 1;
    sendMin_To_countDownBoole = 100;
    newCountDown();
}

function force5MinCountDownCase(data) {
    console.log("force5MinCountDownCase");
    console.log(data.case);
    io.emit("sendMin_To_countDown", {
        countDownTime: data.case
    });
}

function AddNewCueRow(data) {
    console.log("AddNewCueRow");
    addNewCueRowToUser(data.user);
}

function startUrl(data) {
    console.log("startUrl = " + data.text);
    io.emit("alertText_startUrl", {
        text: data.text
    })
}

function adminUrl(data) {
    console.log("adminUrl = " + data.text);
    io.emit("alertText_adminUrl", {
        text: data.text
    })
}

function fohUrl(data) {
    console.log("fohUrl = " + data.text);
    io.emit("alertText_fohUrl", {
        text: data.text
    })
}

function stageUrl(data) {
    console.log("stageUrl = " + data.text);
    io.emit("alertText_stageUrl", {
        text: data.text
    })
}

function watchUrl(data) {
    console.log("watchUrl = " + data.text);
    io.emit("alertText_watchUrl", {
        text: data.text
    })
}

function countdownUrl(data) {
    console.log("countdownUrl = " + data.text);
    io.emit("alertText_countdownUrl", {
        text: data.text
    })
}

function allUsersUrl(data) {
    console.log("allUsersUrl = " + data.text);
    io.emit("alertText_allUsersUrl", {
        text: data.text
    })
}
//---------- Socket Listeners - END ------------



module.exports = {
    setSocket: function (socket) {
        io = socket;
        this.start();
    },
    start: function () {
        mtcTOString();
        getOffsetTimejson();
        getscheduledTimes();
        newTimeArraySorting();
        newCountDown();
        newCueCountDown();
        sendCenterText();
        resetsetTimeout();
    },
    EVENTS: {
        user,
        reload,
        getTimeCode,
        writeToScheduledTimesjson,
        // updateScheduledTimesArray,
        updateOffsetTimePlus,
        updateOffsetTimeMinus,
        updateOffsetTimeReset,
        // loadDefaultToSocket,
        // writeDefaultToSocket,
        fiveMinPageLoad_To_Socket,
        fiveMinPageStart,
        updatebutton_To_Socket,
        sortingButton_To_Socket,
        // sortingButton_From_Socket,
        send_Delete_Button_To_Socket,
        send_Delete_CueButton_To_Socket,
        send_addNewRow_To_Socket,
        // sendIpArrayToAdminPage,
        sendChosenIp_To_Socket,
        reloadFiveMinCountDown,
        AddNewCueRow,
        startUrl,
        adminUrl,
        fohUrl,
        stageUrl,
        watchUrl,
        countdownUrl,
        allUsersUrl
    }
}