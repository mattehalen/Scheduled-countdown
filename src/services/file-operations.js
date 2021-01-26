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
    try {
        let content = JSON.stringify(data, null, 4);
        await fs.writeFile(filePath, content);
    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    readFromFile,
    writeToFile
}