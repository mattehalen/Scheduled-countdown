const path = require('path');

const FileOperation = require('./file-operations');

const ADMIN_SETTINGS_JSON_FILENAME        = path.join(__dirname + '../../public/admin-settings.json');
const ADMIN_SETTINGS_BACKUP_JSON_FILEPATH = path.join(__dirname + '../../public/admin-settings-backup.json');


// This variable stores the latest/current state.
let content = null;


async function get() {
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
    for (const [day, value] of entries) {
        if (day === n) {
            return value;
        }
    }
}

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
    getWeekDay,
    createBackup,
    LoadFromBackup,
    FILEPATH: {
        ADMIN_SETTINGS_JSON_FILENAME,
        ADMIN_SETTINGS_BACKUP_JSON_FILEPATH
    }
}