var express = require('express');
var router = express.Router();

const AdminSettings = require('./../services/admin-settings');


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

//-------------------------------------------------------------------------
// Slideshow Page
//-------------------------------------------------------------------------
router.get('/slideshow', async function (req, res) {
  let adminSettingsData = await AdminSettings.getDbSettings();
  res.render('slideshow', {
    title: 'Scheduled-CountDown',
    now: "now",
    offsetTime: adminSettingsData.timeSettings.offsetTime
  });
});


module.exports = router;
