//const Clock             = require('/websocket-clock/clock');

module.exports = {
    registerSocketListeners: function () {
        require('./websocket-clock/clock');
        require('./websocket-clock/countDown');
        require('./admin');
        require('./users');
        require('./ipsettings');
        require('./foh');
    }
}
