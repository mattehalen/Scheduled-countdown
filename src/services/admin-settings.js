const electron = require('electron');
const path = require('path');
const fs = require('fs');
const FileOperation = require('./file-operations');

const userDataPath = (electron.app || electron.remote.app).getPath('userData');
let filepath = "db=FilePath";
let filepath_dbSettings = "db=filepath_dbSettings";
let currentState, currentState_dbSettings;

const ADMIN_SETTINGS_JSON_FILENAME = path.join(__dirname, "");
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


/* async function get() {
    if (content === null) {
        content = await FileOperation.readFromFile(ADMIN_SETTINGS_JSON_FILENAME);
    }
    return content;
}

async function write(data) {
    await FileOperation.writeToFile(ADMIN_SETTINGS_JSON_FILENAME, data);
    content = data;
}

async function getWeekDay() {
    let data = await get();
    var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var date = new Date();
    var n = weekdays[date.getDay()];

    const entries = Object.entries(data.dayOfWeek)
    for (let [day, value] of entries) {
        if (day === n) {
          if (value===0){
            value = false;
          }else if(value === 1){
            value = true;
          }
            return value;
        }
    }
}
 */
async function createBackup() {
    await FileOperation.writeToFile(ADMIN_SETTINGS_BACKUP_JSON_FILEPATH, content || {});
}

async function LoadFromBackup() {
    let data = await FileOperation.readFromFile(ADMIN_SETTINGS_BACKUP_JSON_FILEPATH);
    await write(data);
}

module.exports = {
    get,
    write,
    getDbSettings,
    writeDbSettings,
    getWeekDay,
    createBackup,
    LoadFromBackup,
    FILEPATH: {
        ADMIN_SETTINGS_JSON_FILENAME,
        ADMIN_SETTINGS_BACKUP_JSON_FILEPATH
    }
}
