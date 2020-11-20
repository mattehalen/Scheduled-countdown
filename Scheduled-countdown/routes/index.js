var express = require('express');
var router = express.Router();
const fs = require('fs').promises;
// var scheduledTimesJson = require('../public/scheduledTimes.json');
// var scheduledTimesJsonBackup = require('../public/scheduledTimes-backup.json');
var adminSettings = require('../public/admin-settings.json');
var adminSettingsBackup = require('../public/admin-settings-backup.json');
// console.log("----------> adminSettings");
// console.log(adminSettings.ipsettings.ipadress);
var myipjson = adminSettings.ipsettings.ipadress;
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
var myIpArray= [];
var myLocalip = myipjson+":3000";

//--------------------------------------------------

const scheduledTimes = require('../lib/adminSettings');
const scheduledTimesBackup = require('../lib/adminSettingsBackup');
const submitUserData = require('../lib/submitUserData');


//--------------------------------------------------f
var getNetworkIPs = (function () {
    var ignoreRE = /^(127\.0\.0\.1|::1|fe80(:1)?::1(%.*)?)$/i;

    var exec = require('child_process').exec;
    var cached;
    var command;
    var filterRE;

    switch (process.platform) {
    case 'win32':
    //case 'win64': // TODO: test
        command = 'ipconfig';
        filterRE = /\bIPv[46][^:\r\n]+:\s*([^\s]+)/g;
        break;
    case 'darwin':
        command = 'ifconfig';
        filterRE = /\binet\s+([^\s]+)/g;
        // filterRE = /\binet6\s+([^\s]+)/g; // IPv6
        break;
    default:
        command = 'ifconfig';
        filterRE = /\binet\b[^:]+:\s*([^\s]+)/g;
        // filterRE = /\binet6[^:]+:\s*([^\s]+)/g; // IPv6
        break;
    }

    return function (callback, bypassCache) {
        if (cached && !bypassCache) {
            callback(null, cached);
            return;
        }
        // system call
        exec(command, function (error, stdout, sterr) {
            cached = [];
            var ip;
            var matches = stdout.match(filterRE) || [];
            //if (!error) {
            for (var i = 0; i < matches.length; i++) {
                ip = matches[i].replace(filterRE, '$1')
                if (!ignoreRE.test(ip)) {
                    cached.push(ip);
                }
            }
            //}
            callback(error, cached);
        });
    };
})();
getNetworkIPs(function (error, ip) {
myIpArray = ip
// console.log("myIpArray: "+myIpArray);

if (error) {
    console.log('error:', error);
}
}, false);
//--------------------------------------------------
console.log("index.js -> myipjson");
console.log(myipjson);

//-------------------------------------------------------------------------
//-------------------------------------------------------------------------
async function readJsonFile(filename){
  const data = await fs.readFile(filename)
  return JSON.parse(data);
}

router.post('/admin/submit', async function(req, res){
  try{
    const adminSettings = await scheduledTimes.get();
    for (let i = 0; i < adminSettings.schedule.length; i++) {
      adminSettings.schedule[i].title = JSON.parse(JSON.stringify(req.body[`title${i}`]))
    }
    for (let i = 0; i < adminSettings.schedule.length; i++) {
      adminSettings.schedule[i].startTime = JSON.parse(JSON.stringify(req.body[`startTime${i}`]))
    }
    for (let i = 0; i < adminSettings.schedule.length; i++) {
      adminSettings.schedule[i].cueLength = JSON.parse(JSON.stringify(req.body[`cueLength${i}`]))
    }
    for (let i = 0; i < adminSettings.schedule.length; i++) {
      adminSettings.schedule[i].cueBool = JSON.parse(JSON.stringify(req.body[`cueBool${i}`]))
    }
    for (let i = 0; i < adminSettings.schedule.length; i++) {
      adminSettings.schedule[i].fiveBool = JSON.parse(JSON.stringify(req.body[`fiveBool${i}`]))
    }

    adminSettings.schedule.sort(function(a, b) {
      return a.startTime.localeCompare(b.startTime);
    });

    await scheduledTimes.write(adminSettings);
  }
  catch(error){
    console.log(error);
  }
  res.redirect("/admin");

})
router.post('/admin/submitSettings', async function(req, res){
  try{
    const adminSettings = await scheduledTimes.get();
    const entries = Object.entries(adminSettings.timeSettings)
    var i=0;
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
    await scheduledTimes.write(adminSettings);
  }
  catch(error){
    console.log(error);
  }
  sleep(50).then(() => {
    res.redirect("/admin");
  })

})
router.post('/admin/loadDefault', async function(req, res){
  try{
    console.log("++--++--++--++--++ loadDefault ++--++--++--++--++");
    const adminSettingsBackup = await scheduledTimesBackup.get();
    await scheduledTimes.write(adminSettingsBackup);

    // const adminSettings = await scheduledTimes.get();
    // await scheduledTimesBackup.write(adminSettings);
  }
  catch(error){
    console.log(error);
  }
  res.redirect("/admin");
})
router.post('/admin/writeToDefault', async function(req, res){
  try{
    console.log("++++++++++ - - - - - -------------------------------------");
    console.log(req.body);

    const adminSettingsBackup = await scheduledTimesBackup.get();
    for (let i = 0; i < adminSettings.schedule.length; i++) {
      adminSettingsBackup.schedule[i].title = JSON.parse(JSON.stringify(req.body[`title${i}`]))
    }
    for (let i = 0; i < adminSettings.schedule.length; i++) {
      adminSettingsBackup.schedule[i].startTime = JSON.parse(JSON.stringify(req.body[`startTime${i}`]))
    }
    for (let i = 0; i < adminSettings.schedule.length; i++) {
      adminSettingsBackup.schedule[i].cueLength = JSON.parse(JSON.stringify(req.body[`cueLength${i}`]))
    }
    for (let i = 0; i < adminSettings.schedule.length; i++) {
      adminSettingsBackup.schedule[i].cueBool = JSON.parse(JSON.stringify(req.body[`cueBool${i}`]))
    }
    for (let i = 0; i < adminSettings.schedule.length; i++) {
      adminSettingsBackup.schedule[i].fiveBool = JSON.parse(JSON.stringify(req.body[`fiveBool${i}`]))
    }

    adminSettingsBackup.schedule.sort(function(a, b) {
      return a.startTime.localeCompare(b.startTime);
    });

    await scheduledTimesBackup.write(adminSettingsBackup);
  }
  catch(error){
    console.log(error);
  }
  res.redirect("/admin");
})
router.post('/admin/addNewRowDefault', async function(req, res){
  console.log("addNewRowDefault knappen funkar");
  try{
    var addString = "";
    const adminSettings = await scheduledTimes.get();
    var feed = {title: "New row added", startTime: "12:00", cueLength: "00:01:10"};

    adminSettings.schedule.push(feed);
    addString = JSON.stringify(adminSettings, null, 4);

    adminSettings.schedule.sort(function(a, b) {
      return a.startTime.localeCompare(b.startTime);
    });
    await scheduledTimes.write(adminSettings);
  }
  catch(error){
    console.log(error);
  }

  res.redirect("/admin");
});
router.post('/admin/deleteButton', async function(req, res){
  console.log("deleteButton knappen funkar");
  try{
    var addString = "";
    const adminSettings = await scheduledTimes.get();
    console.log(adminSettings);
    console.log(req.body.listIndex);
    var listIndex = req.body.listIndex;
    adminSettings.schedule.splice(listIndex, 1);
    console.log(adminSettings);
    await scheduledTimes.write(adminSettings);
  }
  catch(error){
    console.log(error);
  }

  res.redirect("/admin");
});
router.post('/admin/offsetPlus', async function(req, res){
  try{
    const adminSettings = await scheduledTimes.get();
    adminSettings.timeSettings.offsetTime += 1;
    await scheduledTimes.write(adminSettings);

  }
  catch(error){
    console.log(error);
  }

  res.redirect("/admin");
});
router.post('/admin/offsetMinus', async function(req, res){
  try{
    const adminSettings = await scheduledTimes.get();
    adminSettings.timeSettings.offsetTime -= 1;
    await scheduledTimes.write(adminSettings);

  }
  catch(error){
    console.log(error);
  }

  res.redirect("/admin");
});
router.post('/admin/offsetReset', async function(req, res){
  try{
    const adminSettings = await scheduledTimes.get();
    adminSettings.timeSettings.offsetTime = 0;
    await scheduledTimes.write(adminSettings);

  }
  catch(error){
    console.log(error);
  }

  res.redirect("/admin");
});
router.post('/admin/setLoopbackip', async function(req, res){
  try{
    console.log("----------------------------------------------------------- setLoopbackip:-----------------------------------------------------------");
    const adminSettings = await scheduledTimes.get();
    console.log("mycustomip:"+adminSettings.ipsettings.ipadress);
    adminSettings.ipsettings.ipadress = "127.0.0.1";
    await scheduledTimes.write(adminSettings);
  }catch(error){
    console.log(error);
  }
  res.redirect("/admin");
});
router.post('/admin/dayOfWeek', async function(req, res){
  try{
    req.app.io.sockets.emit('reload', {});
    console.log("------------------------------------------ dayOfWeek ---------------------------------------------");
    // console.log(req.body);
    const adminSettings = await scheduledTimes.get();
    const data = JSON.parse(JSON.stringify(req.body));
    const entries = Object.entries(data)
    // console.log(entries);

    for (const [title, value] of entries) {
      // console.log(`${title} ${value}`)
      adminSettings.dayOfWeek[`${title}`] = parseInt(value, 10);

    }
    // console.log(adminSettings.dayOfWeek);

    await scheduledTimes.write(adminSettings);
  }
  catch(error){
    console.log(error);
  }

  res.redirect("/admin");

})
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Scheduled-CountDown',
    now: "s",
    myLocalip: myLocalip
  });
});
router.get('/watch', function(req, res, next) {
  res.render('watch', {
    title: 'Scheduled-CountDown',
    now: "s",
    myLocalip: myLocalip
  });
});
router.get('/ipsettings', function(req, res, next) {
  res.render('ipsettings', {
    title: 'Scheduled-CountDown - IP Settings',
    now: "now",
    // scheduledTimesJson : scheduledTimesJson.profiles,
      offsetTime: adminSettings.timeSettings.offsetTime,
    myLocalip: myLocalip
  });
});
//-------------------------------------------------------------------------
router.get('/stage', function(req, res, next) {
  res.render('stage', {
    title: 'Scheduled-CountDown',
    now: "s",
    myLocalip: myLocalip
  });
});
router.get('/foh', function(req, res, next) {
  res.render('foh', {
    title: 'Scheduled-CountDown',
    now: "s",
    myLocalip: myLocalip
  });
});
router.get('/admin', async function(req, res) {
  const adminSettings = await scheduledTimes.get();
  try{
    res.render('admin', {
      title: 'Scheduled-CountDown',
      now: "now",
      // scheduledTimesJson : scheduledTimesJson.profiles,
      schedule: adminSettings.schedule,
      dayOfWeek: adminSettings.dayOfWeek,
      timeSettings: adminSettings.timeSettings,
      offsetTime: adminSettings.timeSettings.offsetTime,
      myLocalip: myLocalip
    });
  }
  catch(error){
    console.log(error);
  }

});
router.get('/new-admin', function(req, res, next) {
  res.render('new-admin', {
    title: 'Admin @ Scheduled-CountDown',
    now: "now",
    schedule: adminSettings.schedule,
    timeSettings: adminSettings.timeSettings,
    offsetTime: adminSettings.timeSettings.offsetTime,
    myLocalip: myLocalip
  });
});
router.get('/Countdown', function(req, res, next) {
  res.render('Countdown', {
    title: 'Countdown',
    now: "now",
    // scheduledTimesJson : scheduledTimesJson.profiles,
      offsetTime: adminSettings.timeSettings.offsetTime,
    myLocalip: myLocalip
  });
});
router.get('/slideshow_1', function(req, res, next) {
  res.render('slideshow_1', {
    title: 'Scheduled-CountDown',
    now: "now",
    // scheduledTimesJson : scheduledTimesJson.profiles,
    offsetTime: adminSettings.timeSettings.offsetTime,
    myLocalip: myLocalip
  });
});
//-------------------------------------------------------------------------
router.get('/mathias', function(req, res, next) {
  var path = '../public/CueLists/mathias.json'
  var myCueList = require(path);

  myCueList.cues.sort(function(a, b) {
    return a.timecode.localeCompare(b.timecode);
  });

  var name = req.originalUrl.split('/')[1];
  console.log("index.js = "+ name);
  res.render('users', {
    title: 'Scheduled-CountDown',
    now: "s",
    myLocalip: myLocalip,
    myCueList: myCueList.cues,
    name: name
  });
});
router.post('/submitmathias', async function(req, res){
  var backURL=req.header('Referer') || '/';
  var user = "mathias";
  const userCueList = await submitUserData.get(user);
  try{
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
    userCueList.cues.sort(function(a, b) {
      return a.timecode.localeCompare(b.timecode);
    });
    console.log(userCueList);

    await submitUserData.write(user,userCueList);

  }
  catch(error){
    console.log(error);
  }

     res.redirect(backURL)


  });









module.exports = router;
