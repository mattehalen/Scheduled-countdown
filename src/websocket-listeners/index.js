
module.exports = {
    registerSocketListeners: function () {
        //require('./websocket-clock/server');
        require("./SC-module");
        //require('./websocket-clock/clock');
        //require('./websocket-clock/countDown');
        require('./admin');
        require('./users');
        require('./ipsettings');
        require('./foh');
    }
}
