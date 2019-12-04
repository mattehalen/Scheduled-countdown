var scheduledTimes = require('../public/scheduledTimes.json');
const fs = require('fs');
var startTitleArray = [];
var startTimeArray = [];

function updateScheduledTimesjson(){
  console.log("startTitleArray: "+startTitleArray);
  const fs = require('fs')
  function jsonReader(filePath, cb) {
      fs.readFile(filePath, (err, fileData) => {
          if (err) {
              return cb && cb(err)
          }
          try {
              const object = JSON.parse(fileData)
              return cb && cb(null, object)
          } catch(err) {
              return cb && cb(err)
          }
      })
  }

  jsonReader('./public/scheduledTimes.json', (err, customer) => {
    if (err) {
        console.log('Error reading file:',err)
        return
    }

    for(let i=0; i < customer.profiles.length; i++) {customer.profiles[i].title = startTitleArray[i]}
    for(let i=0; i < customer.profiles.length; i++) {customer.profiles[i].startTime = startTimeArray[i]}

  fs.writeFile('./public/scheduledTimes.json', JSON.stringify(customer, null,4), (err) => {
        if (err) console.log('Error writing file:', err)
    })
  })





};





/* @description: This file contains server side socket.io code.
 * Using socketio with nodejs

 * Emit and receive events.

* @author: http://programmerblog.net

*/
var socket_io = require('socket.io');
var io       = socket_io();
var socketio = {};
socketio.io  = io;
var users = [];

 io.on('connection', function(socket){
    console.log('A user connected');

    // My sockets
    //--------------------------------------------------
    socket.on("start", function(data){
      io.emit("updatingDB");
    });

    socket.on("sendDB_To_Socket", function (data) {
      console.log("sendDB_To_Socket:"+ JSON.stringify(data) )
      io.emit("sendDB_TO_Main", {"socketDBArray":data});
    });

    socket.on("writeToScheduledTimesjson", function (data){
        console.log("writeToScheduledTimesjson");
      //console.log(data.startTitleArray);
      startTitleArray = data.startTitleArray;
      startTimeArray = data.startTimeArray;
      updateScheduledTimesjson();

    });
    socket.on("message_from_Adminpage", function(data){
      console.log("message_from_Adminpage");
      io.emit("adminPage_TO_mainPage",{"meddelande": "Detta är från adminPage"})
    });

    socket.on("updateScheduledTimesArray", function(data){
      console.log("updateScheduledTimesArray to main page");
      io.emit("updateDB_From_Socket",{"meddelande": "Detta är från adminPage"})
    });
    //--------------------------------------------------



    socket.on('join', function (user){
       socket.username = user.username;
       users.push(socket.username);
       io.emit('user joined', { 'username': user.username, users:users });
    });

    socket.on('typing', function (msg) {
        io.emit('typing', { 'message': msg.message, 'username': msg.username });
    });

    socket.on('new_message', function (msg) {
         io.emit('chat message', { 'message': msg.message, 'username': msg.username });
    });


    socket.on('disconnect', function(){
        console.log('user disconnected');
        users.splice(users.indexOf(socket.username), 1);
      io.emit('user disconnected', { 'username': socket.username });
    });
 });

module.exports = socketio;
