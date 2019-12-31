const router = require('express').Router();
const fs = require('fs');
const path = require('path');

const { Channel } = require('../../common/models');

router.post('/createPublicChannel', async (req, res) => {
    try {
        var channel = await Channel.create({
            name: req.body.name,
            icon: req.body.icon,
            public: true
        });

        fs.mkdirSync(path.join(__dirname, '../..', `/content/channel/${channel.id}`));
        res.json(channel);

    } catch (err) {
        console.log(err);
    }
});

router.post('/removeChannel', async (req, res) => {
    try {
        var channel = await Channel.findByIdAndDelete(req.body.id);
        res.json(channel);
    } catch (err) {

    }
});

router.get('/channels', async (req, res) => {
    try {
        var channels = await Channel.find();
        res.json(channels);
    } catch (err) {
        console.log(err);
    }
});

module.exports = {
    path: 'manager',
    router: router
};