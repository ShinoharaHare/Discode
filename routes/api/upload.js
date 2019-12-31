const router = require('express').Router();

const { auth } = require('../../common/middlewares');
const fileWriter = require('../../common/file-writer');

router.use(auth);

router.post('/:item', async (req, res) => {
    try {
        var location;
        switch (req.params.item) {
            case 'avatar':
                location = 'avatar';
                break;
            case 'icon':
                location = 'icon';
                break;
        }

        const src = fileWriter.upload(req.files.file);

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