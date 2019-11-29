var express = require('express');
var router = express.Router();
const fs = require('fs');
//var scheduledTimes = require('../scheduledTimes.json');
var scheduledTimes = require('../public/scheduledTimes.json');
var scheduledTimesBackup = require('../public/scheduledTimes-backup.json');
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));



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
    // increase customer order count by 1
    //customer.profiles[0].title = JSON.stringify(req.body.title0);
    customer.profiles[0].title = JSON.parse(JSON.stringify(req.body.title0));
    customer.profiles[1].title = JSON.parse(JSON.stringify(req.body.title1));
    customer.profiles[2].title = JSON.parse(JSON.stringify(req.body.title2));
    customer.profiles[3].title = JSON.parse(JSON.stringify(req.body.title3));
    customer.profiles[4].title = JSON.parse(JSON.stringify(req.body.title4));
    customer.profiles[5].title = JSON.parse(JSON.stringify(req.body.title5));
    customer.profiles[6].title = JSON.parse(JSON.stringify(req.body.title6));
    customer.profiles[7].title = JSON.parse(JSON.stringify(req.body.title7));
    customer.profiles[8].title = JSON.parse(JSON.stringify(req.body.title8));
    customer.profiles[9].title = JSON.parse(JSON.stringify(req.body.title9));

    customer.profiles[0].startTime = JSON.parse(JSON.stringify(req.body.startTime0));
    customer.profiles[1].startTime = JSON.parse(JSON.stringify(req.body.startTime1));
    customer.profiles[2].startTime = JSON.parse(JSON.stringify(req.body.startTime2));
    customer.profiles[3].startTime = JSON.parse(JSON.stringify(req.body.startTime3));
    customer.profiles[4].startTime = JSON.parse(JSON.stringify(req.body.startTime4));
    customer.profiles[5].startTime = JSON.parse(JSON.stringify(req.body.startTime5));
    customer.profiles[6].startTime = JSON.parse(JSON.stringify(req.body.startTime6));
    customer.profiles[7].startTime = JSON.parse(JSON.stringify(req.body.startTime7));
    customer.profiles[8].startTime = JSON.parse(JSON.stringify(req.body.startTime8));
    customer.profiles[9].startTime = JSON.parse(JSON.stringify(req.body.startTime9));

    console.log(JSON.stringify(customer, null, 4));


fs.writeFile('./public/scheduledTimes.json', JSON.stringify(customer, null,4), (err) => {
        if (err) console.log('Error writing file:', err)
    })
})
  console.log("submit knappen funkar");
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

















//-------------------------------------------------------------------------
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express 2',now: "s"});
});
router.get('/test', function(req, res, next) {
  res.render('test', { title: 'Express 2',now: "s"});
});
//-------------------------------------------------------------------------

router.get('/admin', function(req, res, next) {


  res.render('admin', {
    title: 'Express 2',
    now: "now",
    scheduledTimes : scheduledTimes.profiles,
  });

});

module.exports = router;
