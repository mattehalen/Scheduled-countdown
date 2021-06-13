const {app} = require('electron')
const path = require('path')
var appDir = path.dirname(require.main.filename);

const fs = require('fs');
const iOSTokens = require("../src/services/iosToken-settings");


const settings_assetPath = path.join(appDir, "src/websocket-listeners/SC-module/lib/db/", "db-settings.json")
const times_assetPath = path.join(appDir, "src/websocket-listeners/SC-module/lib/db/", "db-times.json")
const db_path = app.getPath('userData');
const db_settings_filname = "db-settings"
const db_times_filname = "db-times"
const db_settings_path = path.join(db_path, db_settings_filname + ".json");
const db_times_path = path.join(db_path, db_times_filname + ".json");
const db_backup_path = path.join(db_path, "backup");
const db_users_path = path.join(db_path, "users.json");
const db_autoStart_path = path.join(db_path, "autoStart.json");
const github_revision_path = path.join(appDir, "github.json");
const db_github_revision_path = path.join(db_path, "github.json");
const db_ios_token_path = path.join(db_path, "db-ios-tokens.json");

//---------------------------------------------
//CREATE FILES --------------------------------
//---------------------------------------------
console.log("--------------------------------------------------------------------------------------------");
console.log(db_backup_path);
console.log("--------------------------------------------------------------------------------------------");
if (!app.isPackaged) {
  const revision = require('child_process')
    .execSync('git rev-parse HEAD')
    .toString().trim()
    .slice(0, 6)

  if (fs.existsSync(github_revision_path)) {
    console.log("github_revision_path file exist");
  } else {
    console.log("github_revision_path does not exist");

    function callback(err) {
      if (err) throw err;
      console.log('github_revision_path was created');
    }
    //fs.mkdir(db_users_path,callback);
  }
  let git_revision = {
    "revision": revision
  }
  let data = JSON.stringify(git_revision, null, 4);
  fs.writeFileSync(github_revision_path, data);
  //fs.copyFile(times_assetPath, db_times_path ,callback);
}
if (fs.existsSync(db_settings_path)) {
  console.log("db_settings_path file exist");
} else {
  console.log("db_settings_path does not exist");

  function callback(err) {
    if (err) throw err;
    console.log('db_settings.json was copied');
  }
  fs.copyFile(settings_assetPath, db_settings_path, callback);
}
if (fs.existsSync(db_times_path)) {
  console.log("db_times_path file exist");
} else {
  console.log("db_times_path does not exist");

  function callback(err) {
    if (err) throw err;
    console.log('db_times.json was copied');
  }
  fs.copyFile(times_assetPath, db_times_path, callback);
}
if (fs.existsSync(db_backup_path)) {
  console.log("db_backup_path file exist");
} else {
  console.log("db_backup_path does not exist");

  function callback(err) {
    if (err) throw err;
    console.log('db_backup_path was created');
  }
  fs.mkdir(db_backup_path, callback);
  //fs.copyFile(times_assetPath, db_times_path ,callback);
}
if (fs.existsSync(db_users_path)) {
  console.log("db_users_path file exist");
} else {
  console.log("db_users_path does not exist");

  function callback(err) {
    if (err) throw err;
    console.log('db_users_path was created');
  }
  //fs.mkdir(db_users_path,callback);
  let userName = {
    "userName": []
  }
  let data = JSON.stringify(userName, null, 4);
  fs.writeFileSync(db_users_path, data);
  //fs.copyFile(times_assetPath, db_times_path ,callback);
}
if (fs.existsSync(db_autoStart_path)) {
  console.log("db_autoStart_path file exist");
} else {
  console.log("db_autoStart_path does not exist");

  function callback(err) {
    if (err) throw err;
    console.log('db_autoStart_path was created');
  }
  //fs.mkdir(db_users_path,callback);
  let autoStart = {
    "autoStart": false
  }
  let data = JSON.stringify(autoStart, null, 4);
  fs.writeFileSync(db_autoStart_path, data);
  //fs.copyFile(times_assetPath, db_times_path ,callback);
}
if (fs.existsSync(db_github_revision_path)) {
  console.log("db_github_revision_path file exist");
} else {
  console.log("db_github_revision_path does not exist");

  function callback(err) {
    if (err) throw err;
    console.log('github.json.json was copied');
  }
  fs.copyFile(github_revision_path, db_github_revision_path, callback);
}
if (fs.existsSync(db_ios_token_path)) {
  console.log("db_ios_token_path file exist");
} else {
  console.log("db_ios_token_path does not exist");

  function callback(err) {
    if (err) throw err;
    console.log('db_ios_token_path was created');
  }
  //fs.mkdir(db_users_path,callback);
  let jsonDATA = 
  {
    "iosTokens": [
      {
        "token": "00000000000",
        "deviceName": "testDeviceName",
        "deviceModel": "deviceModel iPhone xxx"
      }
    ]

  }
  let data = JSON.stringify(jsonDATA, null, 4);
  fs.writeFileSync(db_ios_token_path, data);
  //fs.copyFile(times_assetPath, db_times_path ,callback);
}
//---------------------------------------------