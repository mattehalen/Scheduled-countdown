const router = require('express').Router();
const AdminService = require('./service');
const AdminSettings = require('./../../services/admin-settings');
const FileOperation = require('./../../services/file-operations');
const WebSocketService = require('./../../websocket/websocket-service');
const TimeArraySorting = require("./../../websocket-listeners/SC-module/lib/TimeArraySorting")
const MIDI = require("./../../websocket-listeners/SC-module/lib/midi")
const offset = require("./../../websocket-listeners/SC-module/lib/countDown")
const USERS_SETTINGS  = require("../../services/users-settings"); 



router.get('/', async function (req, res) {
    const db_times      = await AdminSettings.get();
    const db_settings   = await AdminSettings.getDbSettings();
    const midi_id       = await MIDI.midi_interface_IDs();
    const users         = await  USERS_SETTINGS.get();
    let listBackups     = await AdminSettings.getList();
    if (!listBackups || listBackups == 0) {
        listBackups = ["No Files Saved"]
    }
    try {
        res.render('admin', {
            title: 'Scheduled-CountDown',
            now: "now",
            schedule: db_times.schedule,
            dayOfWeek: db_settings.dayOfWeek,
            timeSettings: db_settings.timeSettings,
            offsetTime: db_settings.timeSettings.offsetTime,
            settings: db_settings,
            midi_interface_ID: midi_id,
            listBackups:listBackups,
            users:users.userName,
            port:db_settings.ipsettings.port
        });
    } catch (error) {
        console.log(error);
    }
});
router.post('/submit', async function (req, res) {
    try {
        const db_times = await AdminSettings.get();
        const db_settings = await AdminSettings.getDbSettings();
        for (let i = 0; i < db_times.schedule.length; i++) {
            db_times.schedule[i].title = JSON.parse(JSON.stringify(req.body[`title${i}`]))
            db_times.schedule[i].startTime = JSON.parse(JSON.stringify(req.body[`startTime${i}`]))
            db_times.schedule[i].cueLength = JSON.parse(JSON.stringify(req.body[`cueLength${i}`]))
            db_times.schedule[i].cueBool = JSON.parse(JSON.stringify(req.body[`cueBool${i}`]))
            db_times.schedule[i].fiveBool = JSON.parse(JSON.stringify(req.body[`fiveBool${i}`]))
        }

        db_times.schedule.sort(function (a, b) {
            return a.startTime.localeCompare(b.startTime);
        });

        await AdminSettings.write(db_times);
        TimeArraySorting.reset_newArrayIndex();
    } catch (error) {
        console.log(error);
    }
    res.redirect("/admin");
})
router.post('/submitSettings', async function (req, res) {
    try {
        const db_times = await AdminSettings.get();
        const db_settings = await AdminSettings.getDbSettings();
        const data = JSON.parse(JSON.stringify(req.body));
        const entries = Object.entries(data)

        for (const [title, value] of entries) {
            if (title.startsWith("timeSettings")) {
                var key = title.replace("timeSettings ", "");

                var first_string = JSON.parse(JSON.stringify(value));
                var isNumber = parseInt(first_string, 10);

                if (isNumber >= 0) {
                    db_settings.timeSettings[key] = isNumber;
                } else {
                    db_settings.timeSettings[key] = first_string;
                }
            }

            if (title.startsWith("Color")) {
                var key = title.replace("Color ", "");

                var first_string = JSON.parse(JSON.stringify(value));
                var isNumber = parseInt(first_string, 10);

                if (isNumber >= 0) {
                    db_settings.Color[key] = isNumber;
                } else {
                    db_settings.Color[key] = first_string;
                }
            }

            if (title.startsWith("MIDI")) {
                var key = title.replace("MIDI ", "");

                var first_string = JSON.parse(JSON.stringify(value));
                var isNumber = parseInt(first_string, 10);

                if (isNumber >= 0) {
                    db_settings.MIDI[key] = isNumber;
                } else {
                    db_settings.MIDI[key] = first_string;
                }

            }

            if (title.startsWith("ARTNET")) {
                var key = title.replace("ARTNET ", "");
                var first_string = JSON.parse(JSON.stringify(value));
                var isNumber = parseInt(first_string, 10);

                if (isNumber >= 0) {
                    db_settings.ARTNET[key] = isNumber;
                } else {
                    db_settings.ARTNET[key] = first_string;
                }
            }
        }


        console.log("---------- '/admin/submitSettings");
        console.log(db_settings);
        await AdminSettings.writeDbSettings(db_settings);
    } catch (error) {
        console.log(error);
    }
    res.redirect("/admin");
})
router.post('/addNewRowDefault', async function (req, res) {
    try {
        const adminSettings = await AdminSettings.get();
        var feed = {
            title: "New row added",
            startTime: "12:00",
            cueLength: "00:01:10"
        };

        adminSettings.schedule.push(feed);

        adminSettings.schedule.sort(function (a, b) {
            return a.startTime.localeCompare(b.startTime);
        });
        await AdminSettings.write(adminSettings);
    } catch (error) {
        console.log(error);
    }
    res.redirect("/admin");
});
router.post('/deleteButton', async function (req, res) {
    try {
        const adminSettings = await AdminSettings.get();
        const listIndex = req.body.listIndex;

        adminSettings.schedule.splice(listIndex, 1);
        console.log(adminSettings);

        await AdminSettings.write(adminSettings);
    } catch (error) {
        console.log(error);
    }
    res.redirect("/admin");
});
router.post('/offsetPlus', async function (req, res) {
    try {
        offset.inc_Offset();

    } catch (error) {
        console.log(error);
    }

    res.redirect("/admin");
});
router.post('/offsetMinus', async function (req, res) {
    try {
        // const adminSettings = await AdminSettings.get();
        // adminSettings.timeSettings.offsetTime -= 1;
        // await AdminSettings.write(adminSettings);
        offset.dec_Offset();

    } catch (error) {
        console.log(error);
    }

    res.redirect("/admin");
});
router.post('/offsetReset', async function (req, res) {
    try {
        // const adminSettings = await AdminSettings.get();
        // adminSettings.timeSettings.offsetTime = 0;
        // await AdminSettings.write(adminSettings);
        offset.reset_Offset();

    } catch (error) {
        console.log(error);
    }

    res.redirect("/admin");
});
router.post('/dayOfWeek', async function (req, res) {
    try {
        WebSocketService.broadcastToAll('reload');
        console.log("------------------------------------------ dayOfWeek ---------------------------------------------");
        const db_times = await AdminSettings.get();
        const db_settings = await AdminSettings.getDbSettings();
        const data = JSON.parse(JSON.stringify(req.body));
        const entries = Object.entries(data)

        for (const [title, value] of entries) {
            db_settings.dayOfWeek[`${title}`] = parseInt(value, 10);
        }
        console.log(db_settings);
        await AdminSettings.writeDbSettings(db_settings);
    } catch (error) {
        console.log(error);
    }

    res.redirect("/admin");
})






const EVENTS = {
    CREATEBACKUP:       'createBackup',
    LOADBACKUP:         "loadBackup",
    DELETEBACKUP:       "deleteBackup",
    OVERWRITEBACKUP:    "overwriteBackup",
    CHECKBOX_AUTORESET: "checkbox_autoReset",
    FORCERELOAD:        "forceReload"
};
WebSocketService.onEvent(EVENTS.CREATEBACKUP, async (messageEvent) => {
    const key     = messageEvent.getKey();
    const message = messageEvent.getMessage();

    try {
        const db_times = await AdminSettings.get();
        await AdminSettings.createBackup(db_times,message);
        TimeArraySorting.reset_newArrayIndex();
    } catch (error) {
        console.log(error);
    }


    // // To send data back to UI client.
    // messageEvent.sendToClient('key', 'some-data');

    // // To broadcast message to all UI clients.
    // messageEvent.broadcastToAll('key', 'some-data');

    // // To broadcast message to all UI clients.
    // WebSocketService.broadcastToAll('key', 'some-data');
});
WebSocketService.onEvent(EVENTS.OVERWRITEBACKUP, async (messageEvent) => {
    const key     = messageEvent.getKey();
    const message = messageEvent.getMessage();
    console.log("-----> WebSocketService -> OVERWRITEBACKUP");
    console.log(message);

    try {
        const db_times = await AdminSettings.get();
        await AdminSettings.overwriteBackup(db_times,message);
        TimeArraySorting.reset_newArrayIndex();
    } catch (error) {
        console.log(error);
    }
});
WebSocketService.onEvent(EVENTS.LOADBACKUP, async (messageEvent) => {
    const key     = messageEvent.getKey();
    const message = messageEvent.getMessage();

    try {
        await AdminSettings.LoadFromBackup(message);
        TimeArraySorting.reset_newArrayIndex();
    } catch (error) {
        console.log(error);
    }


    // // To send data back to UI client.
    // messageEvent.sendToClient('key', 'some-data');

    // // To broadcast message to all UI clients.
    // messageEvent.broadcastToAll('key', 'some-data');

    // // To broadcast message to all UI clients.
    // WebSocketService.broadcastToAll('key', 'some-data');
});
WebSocketService.onEvent(EVENTS.DELETEBACKUP, async (messageEvent) => {
    const key     = messageEvent.getKey();
    const message = messageEvent.getMessage();

    try {
        await AdminSettings.DeleteBackup(message);
        TimeArraySorting.reset_newArrayIndex();
    } catch (error) {
        console.log(error);
    }


    // // To send data back to UI client.
    // messageEvent.sendToClient('key', 'some-data');

    // // To broadcast message to all UI clients.
    // messageEvent.broadcastToAll('key', 'some-data');

    // // To broadcast message to all UI clients.
    // WebSocketService.broadcastToAll('key', 'some-data');
});
WebSocketService.onEvent(EVENTS.CHECKBOX_AUTORESET, async (messageEvent) => {
    const key     = messageEvent.getKey();
    const message = messageEvent.getMessage();
    console.log("WebSocketService -> CHECKBOX_AUTORESET");

    offset.setOffsetTime_bool(message);


    // // To send data back to UI client.
    // messageEvent.sendToClient('key', 'some-data');

    // // To broadcast message to all UI clients.
    // messageEvent.broadcastToAll('key', 'some-data');

    // // To broadcast message to all UI clients.
    // WebSocketService.broadcastToAll('key', 'some-data');
});
WebSocketService.onEvent(EVENTS.FORCERELOAD, async (messageEvent) => {
    const key     = messageEvent.getKey();
    const message = messageEvent.getMessage();
    console.log("WebSocketService -> FORCERELOAD");
    WebSocketService.broadcastToAll('reload');
});



module.exports = router;