// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu
} = require('electron')
app.disableHardwareAcceleration()
app.commandLine.appendSwitch('trace-warnings')

//----------------------------------------------------------------------
const log = require('electron-log');
console.log = log.log;

// var log = console.log;
// console.log = function() {
//     log.apply(console, arguments);
//     // Print the stack trace
//     console.trace();
// };
//----------------------------------------------------------------------

const isMac = process.platform === 'darwin'

const path = require('path')
const fs = require('fs');
var RPC = require('electron-rpc/server')
const AdminSettings = require("./src/services/admin-settings");
const AutoStartSettings = require("./src/services/autostart-settings");

console.log("////////////////////////////////////////////////////////////////////////////////////////////")
console.log("--------------------------------------------------------------------------------------------")
console.log("------------------>>> This is Scheduled-Countdown's logging start point <<<-----------------")
console.log("--------------------------------------------------------------------------------------------")
console.log("////////////////////////////////////////////////////////////////////////////////////////////")

require("./lib/createFolders")
const github_revision_path = path.join(__dirname, "github.json");
//---------------------------------------------
//CREATE WINDOW--------------------------------
//---------------------------------------------
function createWindow() {
  // Create the browser window.

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  var rpc = new RPC();
  rpc.configure(mainWindow.webContents);

  rpc.on('saveIP', async function (req, cb) {
    const db_settings = await AdminSettings.getDbSettings();
    console.log("----------> saveIP from MAIN window");
    console.log(db_settings.ipsettings);
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
}
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
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
const express = require('./index.js');
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

//---------------------------------------------
//CREATE MENU ---------------------------------
//---------------------------------------------
const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' },

      ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'How to',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://github.com/mattehalen/Scheduled-countdown/wiki/How-to')
        }
      }
    ]
  },
  {
    label: 'Re-open',
    submenu: [
      { label: "Re-open Main Window",
      click: async () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
      }
    }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)