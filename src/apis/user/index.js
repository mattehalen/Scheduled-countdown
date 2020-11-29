const router = require('express').Router();

const UserService = require('./service');
const WebSocketService = require('./../../websocket/websocket-service');

router.get('/', (req, res) => {
    res.render('users');
});


module.exports = router;