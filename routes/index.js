const path = require('path');

const router = require('express').Router();

const { loginRequired } = require('../common/middlewares');

router.get('/', loginRequired, (req, res) => {
    res.sendFile(path.join(__dirname, '../public'));
});

router.get('/member', (req, res) => {
    res.sendFile(path.join(__dirname, '../public'));
});


module.exports = router;