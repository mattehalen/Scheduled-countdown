const {
    app,
    ipcMain
  } = require('electron')
const fs = require('fs');
const path = require('path')
const AdminSettings = require("../src/services/admin-settings");
const AutoStartSettings = require("../src/services/autostart-settings");
const github_revision_path = path.join(__dirname, "github.json");

//---------------------------------------------
//ipcMain--------------------------------------
//---------------------------------------------
ipcMain.on('saveIP', async (event, data) => {
    const db_settings = await AdminSettings.getDbSettings();
    console.log("--------------------> ipcMain -> saveIP");
    //db_settings.ipsettings.ipadress = data.ipadress;
    db_settings.ipsettings.port = data.port;
  
    await AdminSettings.writeDbSettings(db_settings);
  })
  ipcMain.on('loopbackIP', async (event, data) => {
    const db_settings = await AdminSettings.getDbSettings();
    console.log("--------------------> ipcMain -> loopbackIP");
    db_settings.ipsettings.ipadress = data.ipadress;
    db_settings.ipsettings.port = data.port;
  
    await AdminSettings.writeDbSettings(db_settings);
  
  })
  const express = require('../index.js');
  ipcMain.on('start_server', async (event, data) => {
    console.log("----------> start_server");
    express.start();
  })
  const Server = require('../src/server');
  ipcMain.on('stop_server', async (event, data) => {
    console.log("----------> ./main.js -> ipcMain.on stop_server");
    console.log("----------> stop_server");
    Server.stopServer();
  })
  ipcMain.on('open_admin', async (event, data) => {
    const link = "http://localhost:" + data.port + "/admin"
    console.log("--------------------> ipcMain -> open_admin " + link);
    require("electron").shell.openExternal(link);
  
  })
  ipcMain.on('open_root', async (event, data) => {
    const link = "http://localhost:" + data.port + "/"
    console.log("--------------------> ipcMain -> open_root " + link);
    require("electron").shell.openExternal(link);
  })
  ipcMain.on('AutoStart', async (event, data) => {
    const db_autoStart = await AutoStartSettings.get();
    //console.log(db_autoStart);
    console.log(data);
    await AutoStartSettings.write(data);
  })
  ipcMain.on('getAutoStart', async (event, arg) => {
    //console.log(arg) // prints "ping"
    event.returnValue = await AutoStartSettings.get();
  })
  ipcMain.on('get_github_revision', async (event, arg) => {
    try {
      const data = JSON.parse(fs.readFileSync(github_revision_path, 'utf-8'))
      //console.log(data.revision)
      event.returnValue = data.revision;
    } catch (err) {
      console.error(err)
    }
  })
  ipcMain.on('get_port', async (event, arg) => {
    try {
      const data = await AdminSettings.getDbSettings()
      //console.log(data.ipsettings.port)
      event.returnValue = data.ipsettings.port;
    } catch (err) {
      console.error(err)
    }
  })
  ipcMain.on('openLog', async (event, data) => {
    console.log("main -> openLog");
      const path = log.transports.file.findLogPath();
      require("electron").shell.openPath(path);
  })