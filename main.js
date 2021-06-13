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
var RPC = require('electron-rpc/server')
const AdminSettings = require("./src/services/admin-settings");

console.log("////////////////////////////////////////////////////////////////////////////////////////////")
console.log("--------------------------------------------------------------------------------------------")
console.log("------------------>>> This is Scheduled-Countdown's logging start point <<<-----------------")
console.log("--------------------------------------------------------------------------------------------")
console.log("////////////////////////////////////////////////////////////////////////////////////////////")

require("./lib/createFolders")
require("./lib/ipcMain")

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
//CREATE MENU ---------------------------------
//---------------------------------------------
const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [{
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services'
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? {
        role: 'close'
      } : {
        role: 'quit'
      }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [{
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      ...(isMac ? [{
          role: 'pasteAndMatchStyle'
        },
        {
          role: 'delete'
        },
        {
          role: 'selectAll'
        },
        {
          type: 'separator'
        },
        {
          label: 'Speech',
          submenu: [{
              role: 'startSpeaking'
            },
            {
              role: 'stopSpeaking'
            }
          ]
        }
      ] : [{
          role: 'delete'
        },
        {
          type: 'separator'
        },
        {
          role: 'selectAll'
        }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [{
        role: 'reload'
      },
      {
        role: 'forceReload'
      },
      {
        role: 'toggleDevTools'
      },
      {
        type: 'separator'
      },
      {
        role: 'resetZoom'
      },
      {
        role: 'zoomIn'
      },
      {
        role: 'zoomOut'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [{
        role: 'minimize'
      },
      {
        role: 'zoom'
      },
      ...(isMac ? [{
          type: 'separator'
        },
        {
          role: 'front'
        },
        {
          type: 'separator'
        },
        {
          role: 'window'
        }
      ] : [{
          role: 'close'
        },

      ])
    ]
  },
  {
    role: 'help',
    submenu: [{
      label: 'How to',
      click: async () => {
        const {
          shell
        } = require('electron')
        await shell.openExternal('https://github.com/mattehalen/Scheduled-countdown/wiki/How-to')
      }
    }]
  },
  {
    label: 'Re-open',
    submenu: [{
      label: "Re-open Main Window",
      click: async () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      }
    }]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)