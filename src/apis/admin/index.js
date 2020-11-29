const router = require('express').Router();

const AdminService = require('./service');
const AdminSettings = require('./../../services/admin-settings');
const FileOperation = require('./../../services/file-operations');
const WebSocketService = require('./../../websocket/websocket-service');


router.get('/', async function (req, res) {
    const adminSettings = await AdminSettings.get();
    try {
        res.render('admin', {
            title: 'Scheduled-CountDown',
            now: "now",
            schedule: adminSettings.schedule,
            dayOfWeek: adminSettings.dayOfWeek,
            timeSettings: adminSettings.timeSettings,
            offsetTime: adminSettings.timeSettings.offsetTime
        });
    } catch (error) {
        console.log(error);
    }
});

router.post('/submit', async function (req, res) {
    try {
        const adminSettings = await AdminSettings.get();
        for (let i = 0; i < adminSettings.schedule.length; i++) {
            adminSettings.schedule[i].title = JSON.parse(JSON.stringify(req.body[`title${i}`]))
            adminSettings.schedule[i].startTime = JSON.parse(JSON.stringify(req.body[`startTime${i}`]))
            adminSettings.schedule[i].cueLength = JSON.parse(JSON.stringify(req.body[`cueLength${i}`]))
            adminSettings.schedule[i].cueBool = JSON.parse(JSON.stringify(req.body[`cueBool${i}`]))
            adminSettings.schedule[i].fiveBool = JSON.parse(JSON.stringify(req.body[`fiveBool${i}`]))
        }

        adminSettings.schedule.sort(function (a, b) {
            return a.startTime.localeCompare(b.startTime);
        });

        await AdminSettings.write(adminSettings);
    } catch (error) {
        console.log(error);
    }
    res.redirect("/admin");
})

router.post('/submitSettings', async function (req, res) {
    try {
        const adminSettings = await AdminSettings.get();
        const entries = Object.entries(adminSettings.timeSettings)
        var i = 0;
        for (const [title, value] of entries) {
            console.log(`${title} ${value}`)
            var first_string = JSON.parse(JSON.stringify(req.body[`value${i}`]));
            var isNumber = parseInt(first_string, 10);

            if (isNumber >= 0) {
                adminSettings.timeSettings[`${title}`] = isNumber;
            } else {
                adminSettings.timeSettings[`${title}`] = first_string;
            }
            i++;
        }
        console.log("---------- '/admin/submitSettings");
        console.log(adminSettings.timeSettings);
        await AdminSettings.write(adminSettings);
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
        const adminSettings = await AdminSettings.get();
        const data = JSON.parse(JSON.stringify(req.body));
        const entries = Object.entries(data)

        for (const [title, value] of entries) {
            adminSettings.dayOfWeek[`${title}`] = parseInt(value, 10);
        }
        await AdminSettings.write(adminSettings);
    } catch (error) {
        console.log(error);
    }

    res.redirect("/admin");
})

module.exports = router;