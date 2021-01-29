// Modules to control application life and create native browser window
const {app, BrowserWindow,ipcMain}    = require('electron')
const path                    = require('path')
const fs 											= require('fs');
var RPC                       = require('electron-rpc/server')
const AdminSettings           = require("./src/services/admin-settings");

const Store                   = require('./lib/store.js');
//const express                 = require('./index.js');
const { loopback }            = require('ip');

const settings_assetPath      = path.join(__dirname,"src/websocket-listeners/SC-module/lib/db/","db-settings.json")
const times_assetPath         = path.join(__dirname,"src/websocket-listeners/SC-module/lib/db/","db-times.json")
const db_path                 = app.getPath('userData');
const db_settings_filname     = "db-settings"
const db_times_filname        = "db-times"
const db_settings_path        = path.join(db_path, db_settings_filname + ".json");
const db_times_path           = path.join(db_path, db_times_filname + ".json");
const db_backup_path          = path.join(db_path, "backup");
const db_users_path           = path.join(db_path, "users.json");
console.log("----------------------------------------------");
console.log(db_backup_path);
console.log("----------------------------------------------");

// Check if db_settings.json exist in DB folder. If not Copy from ./SC-module/lib/db
if (fs.existsSync(db_settings_path)) {
  console.log("db_settings_path file exist");
} else {
  console.log("db_settings_path does not exist");
  function callback(err) {
    if (err) throw err;
    console.log('db_settings.json was copied');
  }
  fs.copyFile(settings_assetPath, db_settings_path ,callback);
}

if (fs.existsSync(db_times_path)) {
  console.log("db_times_path file exist");
} else {
  console.log("db_times_path does not exist");
  function callback(err) {
    if (err) throw err;
    console.log('db_times.json was copied');
  }
  fs.copyFile(times_assetPath, db_times_path ,callback);
}

if (fs.existsSync(db_backup_path)) {
  console.log("db_backup_path file exist");
} else {
  console.log("db_backup_path does not exist");
  function callback(err) {
    if (err) throw err;
    console.log('db_backup_path was created');
  }
  fs.mkdir(db_backup_path,callback);
  //fs.copyFile(times_assetPath, db_times_path ,callback);
}

if (fs.existsSync(db_users_path)) {
  console.log("db_users_path file exist");
} else {
  console.log("db_users_path does not exist");
  function callback(err) {
    if (err) throw err;
    console.log('db_users_path was created');
  }
  //fs.mkdir(db_users_path,callback);
  let userName =
  {
    "userName": 
    [
    ]
  }
let data = JSON.stringify(userName, null, 4);
  fs.writeFileSync(db_users_path, data);
  //fs.copyFile(times_assetPath, db_times_path ,callback);
}




function createWindow () {
  // Create the browser window.
  
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
  }
  })
  var rpc = new RPC();
  rpc.configure(mainWindow.webContents);
  
  rpc.on('saveIP', async function(req, cb) {
    const db_settings = await AdminSettings.getDbSettings();
    console.log("----------> saveIP from MAIN window");
    console.log(db_settings.ipsettings);
	});

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// First instantiate the class



ipcMain.on('saveIP', async (event, data) => {
  const db_settings = await AdminSettings.getDbSettings();
  console.log("--------------------> ipcMain -> saveIP");
  db_settings.ipsettings.ipadress = data.ipadress;
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
const express                 = require('./index.js');
ipcMain.on('start_server', async (event, data) => {
  console.log("----------> start_server");
  
  express.start();
})
const Server = require('./src/server');
ipcMain.on('stop_server', async (event, data) => {
  console.log("----------> ./main.js -> ipcMain.on stop_server");
  console.log("----------> stop_server");
  Server.stopServer();
})