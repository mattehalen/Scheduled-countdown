module.exports = {
    registerSocketListeners: function () {
        require('./admin');
        require('./users');
        require('./ipsettings');
        require('./foh');
    }
}