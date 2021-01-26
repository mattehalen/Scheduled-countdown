const jsonFiles               = require('./jsonFiles');
const path 										= require('path')
const fs 											= require('fs');
let filepath = "db-settings=FilePath";

async function getFilepath(){
  var myPath = "";

    try {
      var self = this;
      var filname = "db-settings"
      myPath = path.join(__dirname,"db", filname + ".json");
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
