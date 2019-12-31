const path = require('path');
const fs = require('fs');

const router = require('express').Router();

const routers = fs.readdirSync(path.join(__dirname, 'api')).map((v) => require(`./api/${v}`));

router.get('/', (req, res) => {
    res.render('list', {
        base: 'api',
        list: routers.map((r) => r.path)
    });
});

routers.map((r) => router.use(`/${r.path}`, r.router));

module.exports = router;