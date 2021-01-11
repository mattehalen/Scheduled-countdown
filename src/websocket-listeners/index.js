const WebSocketService  = require('./../websocket/websocket-service');
const CLOCK             = require('./SC-module/sc-clock');

const setTimeoutTime = 1000;





function currentTime() {
  // io.emit('currentTime',CLOCK.currentTime());
  countDown();
  console.log(CLOCK.currentTime());
    setTimeout(currentTime,setTimeoutTime);
}
currentTime();

async function countDown(){
  const countDown = await CLOCK.countDown();
  console.log(countDown);
  // io.emit('countDown',{
  //   title: countDown.title,
  //   start: countDown.time,
  //   bool: countDown.bool,
  //   CountUp: countDown.CountUp,
  //   CountDown:countDown.CountDown,
  //   countDownTimeInMS:countDown.countDownTimeInMS
  // });
}


module.exports = {
    registerSocketListeners: function () {
        //require('./websocket-clock/server');
        //require("./SC-module/sc-clock");
        // require('./websocket-clock/clock');
        // require('./websocket-clock/countDown');
        require('./admin');
        require('./users');
        require('./ipsettings');
        require('./foh');
    }
}
