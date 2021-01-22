const electron = require('electron');
const path = require('path');
const fs = require('fs');
const FileOperation = require('./file-operations');

const userDataPath = (electron.app || electron.remote.app).getPath('userData');
let filepath = "db=FilePath";
let filepath_dbSettings = "db=filepath_dbSettings";
let filepath_backup = "db=filepath_backup";
let currentState, currentState_dbSettings;

const ADMIN_SETTINGS_JSON_FILENAME = path.join(__dirname, "");
const DB_TIMES_FILEPATH = path.join(userDataPath, "db-times" + ".json");
const ADMIN_SETTINGS_BACKUP_JSON_FILEPATH = path.join(__dirname, '../../public/admin-settings-backup.json');


// This variable stores the latest/current state.
let content = null;
async function getFilepath(file) {
    var myPath = "";
    try {
        var self = this;
        var filname = file
        myPath = path.join(userDataPath, filname + ".json");
        // console.log("db -> getFilepath -> configdir_get");
        // console.log(myPath);

    } catch (err) {
        console.log(err);
    }
    return myPath
}
async function get() {
    filepath = await getFilepath("db-times");
    currentState = await FileOperation.readFromFile(filepath);
    if (!currentState) {
        filepath = await getFilepath("db-times");
        currentState = await FileOperation.readFromFile(filepath);
    }

    return currentState;
}
async function write(data) {
    currentState = data;
    filepath = await getFilepath("db-times");
    await FileOperation.writeToFile(filepath, currentState);
}
async function getDbSettings() {
    if (!currentState_dbSettings) {
        filepath_dbSettings     = await getFilepath("db-settings");
        currentState_dbSettings = await FileOperation.readFromFile(filepath_dbSettings);
    }

    return currentState_dbSettings;
}
async function writeDbSettings(data) {
    currentState = data;
    filepath = await getFilepath("db-settings");
    await FileOperation.writeToFile(filepath, currentState);
}
async function getWeekDay() {
    let data = await getDbSettings();
    var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var date = new Date();
    var n = weekdays[date.getDay()];

    const entries = Object.entries(data.dayOfWeek)
    for (let [day, value] of entries) {
        if (day === n) {
            if (value === 0) {
                value = false;
            } else if (value === 1) {
                value = true;
            }
            return value;
        }
    }
}
async function createBackup(data,title) {
    var d = new Date();
    var date = d.toLocaleDateString();
    var string = date + " - " + title
    let backupState = data;
    let folder = path.join(userDataPath,"backup");
    let filename = path.join(folder, string + ".json");

    await FileOperation.writeToFile(filename, backupState); 
}
async function overwriteBackup(data,title) {
    var d = new Date();
    var date = d.toLocaleDateString();
    let backupState = data;
    let folder = path.join(userDataPath,"backup");
    let filename = path.join(folder, title);

    await FileOperation.writeToFile(filename, backupState);
}

const listBackups = () => {
    return new Promise((resolve,reject) => {
        try {
            const folder = path.join(userDataPath,"backup");

            fs.readdir(folder, (err, files) => {
                console.log(files);
                resolve(files)
              });
            
        } catch (error) {
            
        }
    })
}
const getList = async () =>{
    try {
        const files = await listBackups();
        return files
    } catch (error) {
        console.log(error);
    }
}

async function LoadFromBackup(file) {
    let folder = path.join(userDataPath,"backup",file);

    if (fs.existsSync(folder)) {
        backupData = await FileOperation.readFromFile(folder);
        write(backupData);
    } else {
        fs.mkdir(folder, {
            recursive: true
        }, (err) => {
            if (err) throw err;
        });
        console.log("NO FILES INSIDE OF FOLDER");
        // backupData = await FileOperation.readFromFile(folder);
        // write(backupData);
    }
}
async function DeleteBackup(file) {
    let folder = path.join(userDataPath,"backup",file);

    fs.unlink(folder, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('File deleted!');
    }); 
}

module.exports = {
    get,
    write,
    getDbSettings,
    writeDbSettings,
    getWeekDay,
    createBackup,
    overwriteBackup,
    getList,
    LoadFromBackup,
    DeleteBackup,
    FILEPATH: {
        ADMIN_SETTINGS_JSON_FILENAME,
        ADMIN_SETTINGS_BACKUP_JSON_FILEPATH,
        DB_TIMES_FILEPATH
    }
}
