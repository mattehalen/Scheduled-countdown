const SocketListeners = require('./socketio-listener');
const Utilities = require('./../services/utility-service');

//-------------------------------------------------------------------------
// Socket Code here
//-------------------------------------------------------------------------
var socket_io = require('socket.io');
var io = socket_io();
SocketListeners.setSocket(io);

io.on('connection', async function (socket) {
  console.log('A user connected = ' + socket.handshake.address);

  socket.on("start", function () {
    // Blank
  });

  // Registering all Socket Event listeners here.
  Object.keys(SocketListeners.EVENTS).forEach(key => {
    socket.on(key, SocketListeners.EVENTS[key]);
  });

  io.emit("alertText_startUrl_stop", {})
  io.emit("alertText_adminUrl_stop", {})
  io.emit("alertText_fohUrl_stop", {})
  io.emit("alertText_stageUrl_stop", {})
  io.emit("alertText_watchUrl_stop", {})
  io.emit("alertText_countdownUrl_stop", {})
  io.emit("alertText_allUsersUrl_stop", {})
})
//-------------------------------------------------------------------------

module.exports = {
  io: io,
  setSocket: function (io) {
    io = io;
  }
};