module.exports = {
    registerSocketListeners: function () {
        require('./users');
        require('./admin');
    }
}