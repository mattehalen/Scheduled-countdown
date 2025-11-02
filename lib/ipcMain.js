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
ipcMain.handle('saveIP', async (event, data) => {
    try {
        const db_settings = await AdminSettings.getDbSettings();
        console.log("--------------------> ipcMain -> saveIP");
        db_settings.ipsettings.port = data.port;
        await AdminSettings.writeDbSettings(db_settings);
        return { success: true };
    } catch (error) {
        console.error('Error in saveIP:', error);
        return { success: false, error: error.message };
    }
})

ipcMain.handle('loopbackIP', async (event, data) => {
    try {
        const db_settings = await AdminSettings.getDbSettings();
        console.log("--------------------> ipcMain -> loopbackIP");
        db_settings.ipsettings.ipadress = data.ipadress;
        db_settings.ipsettings.port = data.port;
        await AdminSettings.writeDbSettings(db_settings);
        return { success: true };
    } catch (error) {
        console.error('Error in loopbackIP:', error);
        return { success: false, error: error.message };
    }
})
  const express = require('../index.js');
  ipcMain.handle('start_server', async () => {
    try {
        console.log("----------> start_server handler called");
        const result = await express.start();
        console.log("Start server result:", result);
        return result;
    } catch (error) {
        console.error('Error starting server:', error);
        return { success: false, error: error.message || "Failed to start server" };
    }
  })

  const Server = require('../src/server');
  ipcMain.handle('stop_server', async () => {
    try {
        console.log("----------> stop_server");
        Server.stopServer();
        return { success: true };
    } catch (error) {
        console.error('Error stopping server:', error);
        return { success: false, error: error.message };
    }
  })

  ipcMain.handle('open_admin', async (event, data) => {
    try {
        const link = "http://localhost:" + data.port + "/admin";
        console.log("--------------------> ipcMain -> open_admin " + link);
        await require("electron").shell.openExternal(link);
        return { success: true };
    } catch (error) {
        console.error('Error opening admin:', error);
        return { success: false, error: error.message };
    }
  })

  ipcMain.handle('open_root', async (event, data) => {
    try {
        const link = "http://localhost:" + data.port + "/";
        console.log("--------------------> ipcMain -> open_root " + link);
        await require("electron").shell.openExternal(link);
        return { success: true };
    } catch (error) {
        console.error('Error opening root:', error);
        return { success: false, error: error.message };
    }
  })
  ipcMain.handle('AutoStart', async (event, data) => {
    try {
        const db_autoStart = await AutoStartSettings.get();
        console.log(data);
        await AutoStartSettings.write(data);
        return { success: true };
    } catch (error) {
        console.error('Error in AutoStart:', error);
        return { success: false, error: error.message };
    }
  })

  ipcMain.handle('getAutoStart', async () => {
    try {
        const settings = await AutoStartSettings.get();
        return settings;
    } catch (error) {
        console.error('Error in getAutoStart:', error);
        return { success: false, error: error.message };
    }
  })

  ipcMain.handle('get_github_revision', async () => {
    try {
        const data = JSON.parse(fs.readFileSync(github_revision_path, 'utf-8'))
        return data.revision;
    } catch (error) {
        console.error('Error in get_github_revision:', error);
        return { success: false, error: error.message };
    }
  })

  ipcMain.handle('get_port', async () => {
    try {
        const data = await AdminSettings.getDbSettings()
        return data.ipsettings.port;
    } catch (error) {
        console.error('Error in get_port:', error);
        return { success: false, error: error.message };
    }
  })

    ipcMain.handle('get_package_info', async () => {
        try {
            const pkgPath = path.join(__dirname, '..', 'package.json');
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
            return { name: pkg.name, version: pkg.version };
        } catch (error) {
            console.error('Error reading package.json:', error);
            return { success: false, error: error.message };
        }
    })

    ipcMain.handle('get_network_ips', async () => {
        try {
            const { execSync } = require('child_process');
            const ignoreRE = /^(127\.0\.0\.1|::1|fe80(:1)?::1(%.*)?)$/i;
            let command, filterRE;
            switch (process.platform) {
                case 'win32':
                    command = 'ipconfig';
                    filterRE = /\bIPv[46][^:\r\n]+:\s*([^\s]+)/g;
                    break;
                case 'darwin':
                    command = 'ifconfig';
                    filterRE = /\binet\s+([^\s]+)/g;
                    break;
                default:
                    command = 'ifconfig';
                    filterRE = /\binet\b[^:]+:\s*([^\s]+)/g;
                    break;
            }
            const stdout = execSync(command).toString();
            const matches = stdout.match(filterRE) || [];
            const ips = [];
            for (const match of matches) {
                const ip = match.replace(filterRE, '$1');
                if (!ignoreRE.test(ip)) ips.push(ip);
            }
            return ips;
        } catch (error) {
            console.error('Error getting network IPs in main:', error);
            return [];
        }
    })