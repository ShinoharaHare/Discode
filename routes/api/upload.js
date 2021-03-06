const router = require('express').Router();
const { auth } = require('../../common/middlewares');
const fileWriter = require('../../common/file-writer');

router.use(auth);

router.post('/', async (req, res) => {
    try {
        const src = await fileWriter.upload(req.files.file);
        console.log(src);

        res.json({
            success: true,
            data: { src: src }
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
    path: 'upload',
    router: router
};