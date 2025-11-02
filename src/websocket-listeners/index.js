
const ClockService = require('./clock-service');

module.exports = {
    registerSocketListeners: function (wss) {
        // Initialize clock service first since other services may depend on it
        ClockService.registerClock(wss);

        require("./SC-module");
        require('./admin');
        require('./users');
        require('./ipsettings');
        require('./foh');
        require('./alert');
        require('./APN-notification');
    }
}
