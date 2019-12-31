const jwt = require('jsonwebtoken');

const config = require('../../common/config');
const router = require('express').Router();
const { User } = require('../../common/models');
const error = require('../../common/error');

const expires = 60 * 60 * 24 * 30;

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            throw error.UserNotFoundError;
        }

        if (user.hash != req.body.hash) {
            throw error.PasswordIncorrectError;
        }

        const token = generateToken(user);

        res = res.status(200);
        res = res.cookie('token', token, { expires: new Date(Date.now() + 1000 * expires) });
        res.json({ success: true, msg: '登入成功', token: token });

    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err instanceof Error ? error.UnknownError : err
        });
    }
});

router.post('/register', async (req, res) => {
    try {
        const user = await User.create({
            username: req.body.username,
            hash: req.body.hash,
        });

        const token = generateToken(user);
        res = res.status(200);
        res = res.cookie('token', token, { expires: new Date(Date.now() + 1000 * expires) });
        res.json({ success: true, msg: '註冊成功', token: token });
    } catch (err) {
        console.log(err);

        var obj = {
            success: false,
        }

        switch (err.code) {
            case 11000:
                obj.error = error.UsernameDuplicateError;
                break;

            default:
                obj.error = error.UnknownError;
        }

        res.json(obj);
    }
});


function generateToken(user) {
    const payload = {
        id: user.id,
        username: user.username,
    };

    return jwt.sign(payload, config.secret, { expiresIn: expires });
}



module.exports = {
    path: 'member',
    router: router
};