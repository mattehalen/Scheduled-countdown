var express = require('express');
var router = express.Router();
const fs = require('fs');
var scheduledTimes = require('../public/scheduledTimes.json');
var scheduledTimesBackup = require('../public/scheduledTimes-backup.json');
var adminSettings = require('../public/admin-settings.json');
console.log("----------> adminSettings");
console.log(adminSettings.ipsettings.ipadress);
var myipjson = adminSettings.ipsettings.ipadress;
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
var myIpArray= [];
var myLocalip = myipjson+":3000";
//--------------------------------------------------


//--------------------------------------------------
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
function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            return cb && cb(err)
        }
        try {
            const object = JSON.parse(fileData)
            return cb && cb(null, object)
        } catch(err) {
            return cb && cb(err)
        }
    })
}
router.post('/admin/submit', function(req, res, next){
    const fs = require('fs')
    function jsonReader(filePath, cb) {
        fs.readFile(filePath, (err, fileData) => {
            if (err) {
                return cb && cb(err)
            }
            try {
                const object = JSON.parse(fileData)
                return cb && cb(null, object)
            } catch(err) {
                return cb && cb(err)
            }
        })
    }
  //   jsonReader('./public/scheduledTimes.json', (err, customer) => {
  //     if (err) {
  //         console.log('Error reading file:',err)
  //         return
  //     }
  //
  //     for(let i=0; i < customer.profiles.length; i++) {customer.profiles[i].title = JSON.parse(JSON.stringify(req.body[`title${i}`]))}
  //     for(let i=0; i < customer.profiles.length; i++) {customer.profiles[i].startTime = JSON.parse(JSON.stringify(req.body[`startTime${i}`]))}
  //     for(let i=0; i < customer.profiles.length; i++) {customer.profiles[i].cueLength = JSON.parse(JSON.stringify(req.body[`cueLength${i}`]))}
  //
  //
  //
  // fs.writeFile('./public/scheduledTimes.json', JSON.stringify(customer, null,4), (err) => {
  //         if (err) console.log('Error writing file:', err)
  //     })
  //  })
    jsonReader('./public/admin-settings.json', (err, adminSettings) => {
     if (err) {
       console.log('Error reading file:', err)
       return
     }

     // console.log(adminSettings.schedule);
     // console.log(adminSettings.schedule.length);
     // console.log(adminSettings.schedule[0].title);
     // console.log(JSON.parse(JSON.stringify(req.body)));

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


     sleep(100).then(() => {
       fs.writeFile('./public/admin-settings.json', JSON.stringify(adminSettings, null, 4), (err) => {
         if (err) console.log('Error writing file:', err)
       })
        sleep(100).then(() => {
             res.redirect("/admin");
       });
     });
   })

  });

router.post('/admin/submitSettings', function(req, res, next) {
    jsonReader('./public/admin-settings.json', (err, settings) => {
      if (err) {
        console.log('Error reading file:', err)
        return
      }

      // console.log(settings.timeSettings);
      // console.log(Object.keys(settings.timeSettings).length);
      // console.log(Object.keys(settings.timeSettings)[0]);
      // console.log(JSON.parse(JSON.stringify(req.body)));
      var array = [];
      var object = {};
      for (let i = 0; i < Object.keys(settings.timeSettings).length; i++) {
        var key = Object.keys(settings.timeSettings);
        var first_string = JSON.parse(JSON.stringify(req.body[`value${i}`]));
        var isNumber = parseInt(first_string, 10);
        //
        // console.log(first_string);
        // console.log(settings.timeSettings[0]);


        // if (isNumber >= 0) {
        //   settings.timeSettings[`${key}`] = isNumber;
        // } else {
        //   settings.timeSettings[`${key}`] = first_string;
        // }


      }
      //console.log(settings.timeSettings);

      const entries = Object.entries(settings.timeSettings)
      var i=0;
      for (const [title, value] of entries) {
        console.log(`${title} ${value}`)
        var first_string = JSON.parse(JSON.stringify(req.body[`value${i}`]));
        var isNumber = parseInt(first_string, 10);

        if (isNumber >= 0) {
          settings.timeSettings[`${title}`] = isNumber;
        } else {
          settings.timeSettings[`${title}`] = first_string;
        }
        i++;
      }
      console.log(settings.timeSettings);






      sleep(1000).then(() => {
        fs.writeFile('./public/admin-settings.json', JSON.stringify(settings, null, 4), (err) => {
          if (err) console.log('Error writing file:', err)
        })
      });
    })
    res.redirect("/admin");
  });
router.post('/admin/submitSchedule', function(req, res, next) {
    jsonReader('./public/admin-settings.json', (err, settings) => {
      if (err) {
        console.log('Error reading file:', err)
        return
      }

      console.log(settings.schedule);
      console.log(settings.schedule.length);
      console.log(settings.schedule[0].title);
      console.log(JSON.parse(JSON.stringify(req.body)));

      for (let i = 0; i < settings.schedule.length; i++) {
        settings.schedule[i].title = JSON.parse(JSON.stringify(req.body[`title${i}`]))
      }
      for (let i = 0; i < settings.schedule.length; i++) {
        settings.schedule[i].startTime = JSON.parse(JSON.stringify(req.body[`startTime${i}`]))
      }
      for (let i = 0; i < settings.schedule.length; i++) {
        settings.schedule[i].cueLength = JSON.parse(JSON.stringify(req.body[`cueLength${i}`]))
      }

      sleep(1000).then(() => {
        fs.writeFile('./public/admin-settings.json', JSON.stringify(settings, null, 4), (err) => {
          if (err) console.log('Error writing file:', err)
        })
      });
    })
    res.redirect("/admin");
  });
router.post('/admin/loadDefault', function(req, res, next){
  console.log("loadDefault knappen funkar");
  fs.writeFile('./public/scheduledTimes.json', JSON.stringify(scheduledTimesBackup, null, 4), (err) => {
      if (err) throw err;
  });
  res.redirect("/admin");
});
router.post('/admin/writeToDefault', function(req, res, next){
  console.log("writeToDefault knappen funkar");
  fs.writeFile('./public/scheduledTimes-backup.json', JSON.stringify(scheduledTimes, null, 4), (err) => {
      if (err) throw err;
  });
  res.redirect("/admin");
});
router.post('/admin/addNewRowDefault', function(req, res, next){
  console.log("addNewRowDefault knappen funkar");
  var addString = "";

  fs.readFile("./public/scheduledTimes.json", function (err, data) {
    var json = JSON.parse(data);
    var feed = {title: "New row added", startTime: "12:00", cueLength: "00:01:10"};

    json.profiles.push(feed);
    addString = JSON.stringify(json, null, 4);

    });

    sleep(1000).then(() => {
      fs.writeFile('./public/scheduledTimes.json', addString , (err) => {
          if (err) throw err;
      });
    });

  res.redirect("/admin");
});
router.post('/admin/offsetPlus', function(req, res, next){
  const fs = require('fs')
  function jsonReader(filePath, cb) {
      fs.readFile(filePath, (err, fileData) => {
          if (err) {
              return cb && cb(err)
          }
          try {
              const object = JSON.parse(fileData)
              return cb && cb(null, object)
          } catch(err) {
              return cb && cb(err)
          }
      })
  }
  jsonReader('./public/admin-settings.json', (err, settings) => {
    if (err) {
        console.log('Error reading file:',err)
        return
    }

    settings.timeSettings.offsetTime += 1;

  fs.writeFile('./public/admin-settings.json', JSON.stringify(settings, null,4), (err) => {
        if (err) console.log('Error writing file:', err)
    })
  })

  res.redirect("/admin");
});
router.post('/admin/offsetMinus', function(req, res, next){
  const fs = require('fs')
  function jsonReader(filePath, cb) {
      fs.readFile(filePath, (err, fileData) => {
          if (err) {
              return cb && cb(err)
          }
          try {
              const object = JSON.parse(fileData)
              return cb && cb(null, object)
          } catch(err) {
              return cb && cb(err)
          }
      })
  }
  jsonReader('./public/admin-settings.json', (err, settings) => {
    if (err) {
        console.log('Error reading file:',err)
        return
    }

    settings.timeSettings.offsetTime -= 1;

  fs.writeFile('./public/admin-settings.json', JSON.stringify(settings, null,4), (err) => {
        if (err) console.log('Error writing file:', err)
    })
  })

  res.redirect("/admin");
});
router.post('/admin/setLoopbackip', function(req, res, next){
  console.log("setLoopbackip:-----------------------------------------------------------");
  const fs = require('fs')
  function jsonReader(filePath, cb) {
      fs.readFile(filePath, (err, fileData) => {
          if (err) {
              return cb && cb(err)
          }
          try {
              const object = JSON.parse(fileData)
              return cb && cb(null, object)
          } catch(err) {
              return cb && cb(err)
          }
      })
  }
  jsonReader('./public/admin-settings.json', (err, mycustomip) => {
    if (err) {
        console.log('Error reading file:',err)
        return
    }
    console.log("mycustomip:"+mycustomip.ipsettings.ipadress);

    mycustomip.ipsettings.ipadress = "127.0.0.1";

  fs.writeFile('./public/admin-settings.json', JSON.stringify(mycustomip, null,4), (err) => {
        if (err) console.log('Error writing file:', err)
    })
  })

  res.redirect("/admin");
});
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
    scheduledTimes : scheduledTimes.profiles,
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
router.get('/admin', function(req, res, next) {
  res.render('admin', {
    title: 'Scheduled-CountDown',
    now: "now",
    scheduledTimes : scheduledTimes.profiles,
    schedule: adminSettings.schedule,
    timeSettings: adminSettings.timeSettings,
    offsetTime: adminSettings.timeSettings.offsetTime,
    myLocalip: myLocalip
  });
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
    scheduledTimes : scheduledTimes.profiles,
      offsetTime: adminSettings.timeSettings.offsetTime,
    myLocalip: myLocalip
  });
});
router.get('/slideshow_1', function(req, res, next) {
  res.render('slideshow_1', {
    title: 'Scheduled-CountDown',
    now: "now",
    scheduledTimes : scheduledTimes.profiles,
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
router.post('/submitmathias', function(req, res, next){
  var path = './public/CueLists/mathias.json'
    jsonReader(path, (err, settings) => {
     if (err) {
       console.log('Error reading file:', err)
       return
     }
     console.log(settings);
     console.log(settings.cues.length);
     console.log(settings.cues[0].title);
     console.log(JSON.parse(JSON.stringify(req.body)));

     for (let i = 0; i < settings.cues.length; i++) {
       settings.cues[i].title = JSON.parse(JSON.stringify(req.body[`title${i}`]))
       console.log(settings.cues[i].title);
     }
     for (let i = 0; i < settings.cues.length; i++) {
       settings.cues[i].timecode = JSON.parse(JSON.stringify(req.body[`timeCode${i}`]))
       console.log(settings.cues[i].timecode);
     }

     settings.cues.sort(function(a, b) {
       return a.timecode.localeCompare(b.timecode);
     });

     sleep(1000)
     .then(() => {fs.writeFile(path, JSON.stringify(settings, null, 4), (err) => {
         if (err) console.log('Error writing file:', err)
       })})
     .then();
   })
   sleep(1200)
   .then(() => {res.redirect("/mathias")})

  });

module.exports = router;
