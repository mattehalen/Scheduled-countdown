const router = require('express').Router();
const UserService = require('./service');

router.get('/', (req, res) => {
    res.render('users');
});


module.exports = router;