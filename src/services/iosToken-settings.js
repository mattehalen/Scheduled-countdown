const electron = require('electron');
const path = require('path');
const fs = require('fs');
const FileOperation = require('./file-operations');

const userDataPath = (electron.app || electron.remote.app).getPath('userData');
let filepath = "db=FilePath";
let currentState, currentState_dbSettings;



// This variable stores the latest/current state.
let content = null;
async function getFilepath(file) {
    var myPath = "";
    try {
        var self = this;
        var filname = file
        myPath = path.join(userDataPath, filname + ".json");

    } catch (err) {
        console.log(err);
    }
    return myPath
}
async function get() {
    filepath = await getFilepath("db-ios-tokens");
    currentState = await FileOperation.readFromFile(filepath);
    if (!currentState) {
        filepath = await getFilepath("db-ios-tokens");
        currentState = await FileOperation.readFromFile(filepath);
    }

    return currentState;
}
async function write(data) {
    currentState = data;
    filepath = await getFilepath("db-ios-tokens");
    await FileOperation.writeToFile(filepath, currentState);
}







module.exports = {
    get,
    write,
}
