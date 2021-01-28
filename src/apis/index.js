var express = require('express');
var router = express.Router();

const AdminSettings   = require('./../services/admin-settings');
const USERS_SETTINGS  = require("./../services/users-settings"); 



//-------------------------------------------------------------------------
// Initial Page
//-------------------------------------------------------------------------
router.get('/', async function (req, res) {
  res.render('index', {
    title: 'Scheduled-CountDown',
    now: "s"
  });
});

//-------------------------------------------------------------------------
// Stage Page
//-------------------------------------------------------------------------
router.get('/stage', async function (req, res) {
  res.render('stage', {
    title: 'Scheduled-CountDown',
    now: "s"
  });
});

//-------------------------------------------------------------------------
// FOH Page
//-------------------------------------------------------------------------
router.get('/foh', async function (req, res) {
  res.render('foh', {
    title: 'Scheduled-CountDown',
    now: "s"
  });
});

//-------------------------------------------------------------------------
// Countdown Page
//-------------------------------------------------------------------------
router.get('/Countdown', async function (req, res) {
  let adminSettingsData = await AdminSettings.getDbSettings();
  res.render('Countdown', {
    title: 'Countdown',
    now: "now",
    offsetTime: adminSettingsData.timeSettings.offsetTime
  });
});

router.get('/watch', async function (req, res) {
  res.render('watch', {
    title: 'Scheduled-CountDown',
    now: "s"
  });
});

router.get('/users/:userID', async function (req, res) {
  const db_settings   = await AdminSettings.getDbSettings();
  const users = await USERS_SETTINGS.get()
  var name = req.originalUrl.split('/users/')[1];
  let cuelist;

  users.userName.forEach(function (arrayItem) {
    // console.log(arrayItem.name);
    if (arrayItem.name.toLowerCase() === name.toLowerCase()) {
      console.log(arrayItem.name);
      console.log(arrayItem.cues);
      res.render('users', {
        title: 'Scheduled-CountDown',
        now: "s",
        name: name,
        cuelist: arrayItem.cues,
        settings: db_settings
      });
    }
  });
});



module.exports = router;
