const jwt = require('jsonwebtoken');

const { User } = require('./models');

const config = require('./config');
const error = require('./error');

async function auth(req, res, next) {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, config.secret);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        console.log(err);
        var obj = {
            success: false,
        }
        res = res.status(403);
        switch (err.message) {
            case 'jwt must be provided':
                obj.error = error.TokenNotProvidedError;
                break;
            case 'invalid token':
            case 'Cast to ObjectId failed for value "111" at path "_id" for model "User"':
                obj.error = error.TokenNotValidError;
                break;
            case 'jwt expired':
                obj.error = error.TokenExpiredError;
                break;
        }

        res.json(obj);
    }
}

async function loginRequired(req, res, next) {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, config.secret);
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error();
        }
        next();
    } catch (err) {
        res.redirect('/member');
    }
}

module.exports = {
    auth,
    loginRequired
};