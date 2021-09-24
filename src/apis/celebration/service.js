const electron = require('electron');
const path = require('path');
const fs = require('fs');
const FileOperation = require('../../services/file-operations');

const userDataPath = (electron.app || electron.remote.app).getPath('userData');
let filepath = "db=FilePath";


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
    try {
        filepath = await getFilepath("DailyCelebrationList");
        currentState = await FileOperation.readFromFile(filepath);
        if (!currentState) {
            filepath = await getFilepath("DailyCelebrationList");
            currentState = await FileOperation.readFromFile(filepath);
        }
    
        return currentState;
    } catch (error) {
        console.log(error);
    }


}
async function write(data) {
    currentState = data;
    filepath = await getFilepath("DailyCelebrationList");
    await FileOperation.writeToFile(filepath, currentState);
}


module.exports = {
    get,
    write
}
