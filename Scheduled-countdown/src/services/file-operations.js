const fs = require('fs').promises;

async function readFromFile(filePath) {
    let content = (await fs.readFile(filePath)).toString();
    try {
        content = JSON.parse(content);
    } catch (error) {
    }
    return content;
}

async function writeToFile(filePath, data) {
    let content = JSON.stringify(data, null, 4);
    await fs.writeFile(filePath, content);
}

module.exports = {
    readFromFile,
    writeToFile
}