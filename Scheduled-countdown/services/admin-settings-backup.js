const path = require('path');
const FileOperation = require('./file-operations');

const ADMIN_SETTINGS_BACKUP_JSON_FILEPATH = path.join(__dirname + '../../public/admin-settings-backup.json');

let content = null;


async function get() {
    if (content === null) {
        content = await FileOperation.readFromFile(ADMIN_SETTINGS_JSON_FILENAME);
    }
    return content;
}

async function write(data) {
    await FileOperation.writeToFile(ADMIN_SETTINGS_JSON_FILENAME, data);
}

module.exports = {
    get,
    write,
    FILEPATH: ADMIN_SETTINGS_BACKUP_JSON_FILEPATH
}
