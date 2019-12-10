var express = require('express');
var router = express.Router();
const fs = require('fs');
//var scheduledTimes = require('../scheduledTimes.json');
var scheduledTimes = require('../public/scheduledTimes.json');
var scheduledTimesBackup = require('../public/scheduledTimes-backup.json');
var variables = require('../public/variables.json');
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
//console.log(variables.offsetTime);

var ip = require("ip");
var myLocalip = ip.address();
console.log("index.js: "+ myLocalip+":3000");

  //--------------------------------------------------
  // - Knappar på adminPage ./public/scheduledTimes.json
  //--------------------------------------------------
  router.post('/admin/submit', function(req, res, next){
  //---------- Denna funkar att skriva över med men fattas array from admin
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
    jsonReader('./public/scheduledTimes.json', (err, customer) => {
      if (err) {
          console.log('Error reading file:',err)
          return
      }

      for(let i=0; i < customer.profiles.length; i++) {customer.profiles[i].title = JSON.parse(JSON.stringify(req.body[`title${i}`]))}
      for(let i=0; i < customer.profiles.length; i++) {customer.profiles[i].startTime = JSON.parse(JSON.stringify(req.body[`startTime${i}`]))}
      for(let i=0; i < customer.profiles.length; i++) {customer.profiles[i].cueLength = JSON.parse(JSON.stringify(req.body[`cueLength${i}`]))}



  fs.writeFile('./public/scheduledTimes.json', JSON.stringify(customer, null,4), (err) => {
          if (err) console.log('Error writing file:', err)
      })
   })
    res.redirect("/admin");
  });
  //--------------------------------------------------






//--------------------------------------------------
//-----loadDefault button press
//--------------------------------------------------
router.post('/admin/loadDefault', function(req, res, next){
  console.log("loadDefault knappen funkar");
  fs.writeFile('./public/scheduledTimes.json', JSON.stringify(scheduledTimesBackup, null, 4), (err) => {
      if (err) throw err;
  });
  res.redirect("/admin");
});
//-------------------------------------------------------------------------

//--------------------------------------------------
//-----writeToDefault button press
//--------------------------------------------------
router.post('/admin/writeToDefault', function(req, res, next){
  console.log("writeToDefault knappen funkar");
  fs.writeFile('./public/scheduledTimes-backup.json', JSON.stringify(scheduledTimes, null, 4), (err) => {
      if (err) throw err;
  });
  res.redirect("/admin");
});
//-------------------------------------------------------------------------

//--------------------------------------------------
//-----addNewRowDefault button press
//--------------------------------------------------
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
//-------------------------------------------------------------------------



//--------------------------------------------------
//-----offsetPlus button press
//--------------------------------------------------
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
  jsonReader('./public/variables.json', (err, variables2) => {
    if (err) {
        console.log('Error reading file:',err)
        return
    }

    variables.offsetTime += 1;

  fs.writeFile('./public/variables.json', JSON.stringify(variables, null,4), (err) => {
        if (err) console.log('Error writing file:', err)
    })
  })

  res.redirect("/admin");
});
//-------------------------------------------------------------------------

//--------------------------------------------------
//-----offsetMinus button press
//--------------------------------------------------
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
  jsonReader('./public/variables.json', (err, variables2) => {
    if (err) {
        console.log('Error reading file:',err)
        return
    }

    variables.offsetTime -= 1;

  fs.writeFile('./public/variables.json', JSON.stringify(variables, null,4), (err) => {
        if (err) console.log('Error writing file:', err)
    })
  })

  res.redirect("/admin");
});
//-------------------------------------------------------------------------














//-------------------------------------------------------------------------
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Scheduled-CountDown',
    now: "s",
    myLocalip: myLocalip
  });
});
//-------------------------------------------------------------------------

router.get('/admin', function(req, res, next) {
  res.render('admin', {
    title: 'Scheduled-CountDown',
    now: "now",
    scheduledTimes : scheduledTimes.profiles,
    offsetTime: variables.offsetTime,
    myLocalip: myLocalip
  });
});

router.get('/Countdown', function(req, res, next) {
  res.render('Countdown', {
    title: 'Countdown',
    now: "now",
    scheduledTimes : scheduledTimes.profiles,
    offsetTime: variables.offsetTime,
    myLocalip: myLocalip
  });
});

router.get('/slideshow_1', function(req, res, next) {
  res.render('slideshow_1', {
    title: 'Scheduled-CountDown',
    now: "now",
    scheduledTimes : scheduledTimes.profiles,
    offsetTime: variables.offsetTime,
    myLocalip: myLocalip
  });
});

module.exports = router;
