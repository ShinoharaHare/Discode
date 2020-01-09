const router = require('express').Router();

const { auth } = require('../../common/middlewares');
const { User } = require('../../common/models');
const error = require('../../common/error');

router.get('/', auth, (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                id: req.user.id,
                username: req.user.username,
                nickname: req.user.nickname,
                avatar: req.user.avatar,
                message: req.user.message
            }
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err instanceof Error ? error.UnknownError : err
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            throw error.UserNotFoundError;
        }

        res.json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                nickname: user.nickname,
                avatar: user.avatar,
                message: user.message,
                status: global.userStatus[user.id]
            }
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err instanceof Error ? error.UnknownError : err
        });
    }
});

router.post('/edit', auth, async (req, res) => {
    try {
        Object.assign(req.user, {
            nickname: req.body.nickname,
            avatar: req.body.avatar,
            message: req.body.message
        });

        const user = await req.user.save();

        res.json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                nickname: user.nickname,
                avatar: user.avatar
            }
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err instanceof Error ? error.UnknownError : err
        });
    }
});

router.post('/edit/:item', auth, async (req, res) => {
    try {
        switch (req.params.item) {
            case 'password':
                if (req.body.currentHash != req.user.hash) {
                    throw error.PasswordIncorrectError;
                }
                req.user.hash = req.body.hash;
                break
            case 'avatar':
                req.user.avatar = req.body.avatar;
                break;
            case 'nickname':
                req.user.nickname = req.body.nickname;
                break;
            case 'message':
                req.user.message = req.body.message;
                break;
        }

        const user = await req.user.save();

        res.json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                nickname: user.nickname,
                avatar: user.avatar,
                message: user.message
            }
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err instanceof Error ? error.UnknownError : err
        });
    }
});

module.exports = {
    path: 'user',
    router: router
};