const jsonFiles               = require('./jsonFiles');
const path 										= require('path')
const fs 											= require('fs');
let filepath = "db-settings=FilePath";
//const filepath = './SC-module/db/db-settings.json';

async function getFilepath(){
  var myPath = "";

    try {
      var self = this;
      var filname = "db-settings"
      myPath = path.join(__dirname,"db", filname + ".json");
      //
      // if (fs.existsSync(myPath)) {
      //   console.log("scheduleSettings_path file exist");
      //   });
      //
      //
      // } else {
      //   console.log("scheduleSettings_path does not exist");
      //   // var data = {
      //   //   "schedule": [{
      //   //     title: "First row added",
      //   //     startTime: "12:00",
      //   //     cueLength: "00:01:00",
      //   //     cueBool: false,
      //   //     fiveBool: false
      //   //   }]
      //   // };
      //   //
      //   // fs.writeFile(scheduleSettings_path, JSON.stringify(data, null, 4), function(err) {
      //   //   if (err) throw err;
      //   //   console.log('Saved!');
      //   // });
      // }
    } catch (err) {
      console.log(err);
    }
  return myPath
}

let currentState;

async function get() {
  if (!currentState) {
    filepath = await getFilepath();
    currentState = await jsonFiles.read(filepath);
  }

  return currentState;
}
async function write(data) {
  currentState = data;
  filepath = await getFilepath();
  await jsonFiles.write(filepath, currentState);
}
module.exports = {
  get,
  write,
};
