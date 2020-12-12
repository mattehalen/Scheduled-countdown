console.log("------ Clock");
const WebSocketService = require('../websocket/websocket-service');


function CurrentTime() {
    const date = new Date();
    //nowInMs = date.getTime();

    var time = "";
    time += (10 > date.getHours() ? "0" : "") + date.getHours() + ":";
    time += (10 > date.getMinutes() ? "0" : "") + date.getMinutes() + ":";
    time += (10 > date.getSeconds() ? "0" : "") + date.getSeconds();

    return time;
}
function looper(){
  console.log(CurrentTime());
  // To broadcast message to all UI clients.
  WebSocketService.broadcastToAll('CurrentTime', CurrentTime() ) ;
  setTimeout(looper, 1000);
}
looper();

module.exports = {
  CurrentTime: CurrentTime()
}
