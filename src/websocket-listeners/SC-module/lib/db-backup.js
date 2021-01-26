const electron                = require('electron');
const jsonFiles               = require('./jsonFiles');
const path 										= require('path')
const fs 											= require('fs');

let filepath = "db=FilePath";
let filepath_dbSettings = "db=filepath_dbSettings";
let currentState,currentState_dbSettings;
const userDataPath = (electron.app || electron.remote.app).getPath('userData');

async function getFilepath(file){
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
  filepath = await getFilepath("db-times");
  currentState = await jsonFiles.read(filepath);
  if (!currentState) {
    filepath = await getFilepath("db-times");
    currentState = await jsonFiles.read(filepath);
  }

  return currentState;
}
async function write(data) {
  currentState = data;
  filepath = await getFilepath("db-times");
  await jsonFiles.write(filepath, currentState);
}
async function getDbSettings() {
  if (!currentState_dbSettings) {
    filepath_dbSettings = await getFilepath("db-settings");
    currentState_dbSettings = await jsonFiles.read(filepath_dbSettings);
  }

  return currentState_dbSettings;
}
async function getWeekDay() {
  //console.log("----------> getWeekDay <----------");
    let data = await getDbSettings();
    //console.log(data);
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

module.exports = {
  get,
  write,
  getWeekDay,
};
