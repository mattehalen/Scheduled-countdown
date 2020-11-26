var express = require('express');
var router = express.Router();

const Utilities = require('./../services/utilties');
const AdminSettings = require('./../services/admin-settings');
const submitUserData = require('../lib/submitUserData');

// var scheduledTimesJson = require('../public/scheduledTimes.json');

var myIpArray = [];

//--------------------------------------------------
Utilities.getNetworkIPs(function (error, ip) {
  if (error) {
    console.log('error:', error);
  }
  myIpArray = ip
}, false);
//--------------------------------------------------


async function getLocalIP() {
  let IPAddress = (await AdminSettings.get()).ipsettings.ipadress;
  return IPAddress + ":3000";
}

//-------------------------------------------------------------------------
router.get('/', async function (req, res) {
  const adminSettingsData = await AdminSettings.get();
  res.render('index', {
    title: 'Scheduled-CountDown',
    now: "s",
    myLocalip: await getLocalIP()
  });
});
router.get('/watch', async function (req, res) {
  const adminSettingsData = await AdminSettings.get();
  res.render('watch', {
    title: 'Scheduled-CountDown',
    now: "s",
    myLocalip: await getLocalIP()
  });
});
router.get('/ipsettings', async function (req, res) {
  let adminSettingsData = await AdminSettings.get();
  res.render('ipsettings', {
    title: 'Scheduled-CountDown - IP Settings',
    now: "now",
    // scheduledTimesJson : scheduledTimesJson.profiles,
    offsetTime: adminSettingsData.timeSettings.offsetTime,
    myLocalip: await getLocalIP()
  });
});
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
router.get('/stage', async function (req, res) {
  let adminSettingsData = await AdminSettings.get();
  res.render('stage', {
    title: 'Scheduled-CountDown',
    now: "s",
    myLocalip: await getLocalIP()
  });
});
router.get('/foh', async function (req, res) {
  let adminSettingsData = await AdminSettings.get();
  res.render('foh', {
    title: 'Scheduled-CountDown',
    now: "s",
    myLocalip: await getLocalIP()
  });
});
router.get('/new-admin', async function (req, res) {
  let adminSettingsData = await AdminSettings.get();
  res.render('new-admin', {
    title: 'Admin @ Scheduled-CountDown',
    now: "now",
    schedule: adminSettingsData.schedule,
    timeSettings: adminSettingsData.timeSettings,
    offsetTime: adminSettingsData.timeSettings.offsetTime,
    myLocalip: await getLocalIP()
  });
});
router.get('/Countdown', async function (req, res) {
  let adminSettingsData = await AdminSettings.get();
  res.render('Countdown', {
    title: 'Countdown',
    now: "now",
    // scheduledTimesJson : scheduledTimesJson.profiles,
    offsetTime: adminSettingsData.timeSettings.offsetTime,
    myLocalip: await getLocalIP()
  });
});
router.get('/slideshow_1', async function (req, res) {
  let adminSettingsData = await AdminSettings.get();
  res.render('slideshow_1', {
    title: 'Scheduled-CountDown',
    now: "now",
    // scheduledTimesJson : scheduledTimesJson.profiles,
    offsetTime: adminSettingsData.timeSettings.offsetTime,
    myLocalip: await getLocalIP()
  });
});
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
router.get('/mathias', async function (req, res) {
  let adminSettingsData = await AdminSettings.get();

  var path = '../public/CueLists/mathias.json'
  var myCueList = require(path);

  myCueList.cues.sort(function (a, b) {
    return a.timecode.localeCompare(b.timecode);
  });

  var name = req.originalUrl.split('/')[1];
  console.log("index.js = " + name);
  res.render('users', {
    title: 'Scheduled-CountDown',
    now: "s",
    myLocalip: await getLocalIP(),
    myCueList: myCueList.cues,
    name: name
  });
});

router.post('/submitmathias', async function (req, res) {
  var backURL = req.header('Referer') || '/';
  var user = "mathias";
  const userCueList = await submitUserData.get(user);
  try {
    // console.log("----------------------------------------> submitmathias <----------");
    // console.log(userCueList);
    // console.log(userCueList.cues.length);
    // console.log(userCueList.cues[0].title);
    // console.log(JSON.parse(JSON.stringify(req.body)));

    for (let i = 0; i < userCueList.cues.length; i++) {
      userCueList.cues[i].title = JSON.parse(JSON.stringify(req.body[`title${i}`]))
      console.log(userCueList.cues[i].title);
    }
    for (let i = 0; i < userCueList.cues.length; i++) {
      userCueList.cues[i].timecode = JSON.parse(JSON.stringify(req.body[`timeCode${i}`]))
      console.log(userCueList.cues[i].timecode);
    }
    userCueList.cues.sort(function (a, b) {
      return a.timecode.localeCompare(b.timecode);
    });
    console.log(userCueList);

    await submitUserData.write(user, userCueList);

  } catch (error) {
    console.log(error);
  }

  res.redirect(backURL)
});
//-------------------------------------------------------------------------


module.exports = router;