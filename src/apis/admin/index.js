const router = require('express').Router();
const AdminService = require('./service');
const AdminSettings = require('./../../services/admin-settings');
const FileOperation = require('./../../services/file-operations');
const WebSocketService = require('./../../websocket/websocket-service');
const TimeArraySorting = require("./../../websocket-listeners/SC-module/lib/TimeArraySorting")
const MIDI = require("./../../websocket-listeners/SC-module/lib/midi")


router.get('/', async function (req, res) {
    const db_times = await AdminSettings.get();
    const db_settings = await AdminSettings.getDbSettings();
    const midi_id = await MIDI.midi_interface_IDs();
    console.log(midi_id);

    try {
        res.render('admin', {
            title: 'Scheduled-CountDown',
            now: "now",
            schedule: db_times.schedule,
            dayOfWeek: db_settings.dayOfWeek,
            timeSettings: db_settings.timeSettings,
            offsetTime: db_settings.timeSettings.offsetTime,
            settings: db_settings,
            midi_interface_ID: midi_id
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

        console.log(db_settings);
        console.log("---------- '/admin/submitSettings");
        await AdminSettings.writeDbSettings(db_settings);
    } catch (error) {
        console.log(error);
    }
})

router.post('/loadDefault', async function (req, res) {
    try {
        console.log("++--++--++--++--++ loadDefault ++--++--++--++--++");
        await AdminSettings.LoadFromBackup();
    } catch (error) {
        console.log(error);
    }

    res.redirect("/admin");
})

router.post('/writeToDefault', async function (req, res) {
    try {
        console.log("++++++++++ - writeToDefault -------------------------------------");
        console.log('Body-', req.body);

        const adminSettings = await AdminSettings.get();
        const adminSettingsBackup = await FileOperation.readFromFile(AdminSettings.FILEPATH.ADMIN_SETTINGS_BACKUP_JSON_FILEPATH);

        for (let i = 0; i < adminSettings.schedule.length; i++) {
            adminSettingsBackup.schedule[i].title = JSON.parse(JSON.stringify(req.body[`title${i}`]))
            adminSettingsBackup.schedule[i].startTime = JSON.parse(JSON.stringify(req.body[`startTime${i}`]))
            adminSettingsBackup.schedule[i].cueLength = JSON.parse(JSON.stringify(req.body[`cueLength${i}`]))
            adminSettingsBackup.schedule[i].cueBool = JSON.parse(JSON.stringify(req.body[`cueBool${i}`]))
            adminSettingsBackup.schedule[i].fiveBool = JSON.parse(JSON.stringify(req.body[`fiveBool${i}`]))
        }

        adminSettingsBackup.schedule.sort(function (a, b) {
            return a.startTime.localeCompare(b.startTime);
        });

        await AdminSettings.write(adminSettingsBackup);
    } catch (error) {
        console.log(error);
    }
    res.redirect("/admin");
})

router.post('/addNewRowDefault', async function (req, res) {
    console.log("addNewRowDefault knappen funkar");
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
    console.log("deleteButton knappen funkar");
    try {
        const adminSettings = await AdminSettings.get();
        const listIndex = req.body.listIndex;
        console.log(listIndex);

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
        const adminSettings = await AdminSettings.get();
        adminSettings.timeSettings.offsetTime += 1;
        await AdminSettings.write(adminSettings);

    } catch (error) {
        console.log(error);
    }

    res.redirect("/admin");
});

router.post('/offsetMinus', async function (req, res) {
    try {
        const adminSettings = await AdminSettings.get();
        adminSettings.timeSettings.offsetTime -= 1;
        await AdminSettings.write(adminSettings);

    } catch (error) {
        console.log(error);
    }

    res.redirect("/admin");
});

router.post('/offsetReset', async function (req, res) {
    try {
        const adminSettings = await AdminSettings.get();
        adminSettings.timeSettings.offsetTime = 0;
        await AdminSettings.write(adminSettings);

    } catch (error) {
        console.log(error);
    }

    res.redirect("/admin");
});

router.post('/setLoopbackip', async function (req, res) {
    try {
        console.log("----------------------------------------------------------- setLoopbackip:-----------------------------------------------------------");
        const adminSettings = await AdminSettings.get();
        console.log("mycustomip:" + adminSettings.ipsettings.ipadress);
        adminSettings.ipsettings.ipadress = "127.0.0.1";
        await AdminSettings.write(adminSettings);
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
        await AdminSettings.writeDbSettings(db_settings);
    } catch (error) {
        console.log(error);
    }

    res.redirect("/admin");
})

module.exports = router;