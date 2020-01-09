const { Message } = require('../common/models');
const fileWriter = require('../common/file-writer');
const runCode = require('../common/code-handler');


module.exports = (io) => {
    io.on('connection', async (socket) => {
        socket.on('message', async (msg) => {
            var attachments, code;

            switch (msg.type) {
                case 'attachment':
                    attachments = await resolveAttachments(msg);
                    break;
                case 'code':
                    code = await resolveCode(msg);
                    break;
            }

            const messageDoc = await Message.create({
                author: socket.user.id,
                channel: msg.channel,
                content: msg.content,
                attachments: attachments,
                code: code
            });

            const message = {
                id: messageDoc.id,
                channel: messageDoc.channel,
                author: messageDoc.author,
                content: messageDoc.content,
                attachments: attachments,
                code: code
            };

            socket.emit('message', Object.assign(message, { nonce: msg.nonce }));
            io.to(messageDoc.channel).emit('message', message);
        });

    });
};

async function resolveAttachments(msg) {
    var attachments = {
        images: [],
        files: []
    };
    for (let file of msg.files) {
        const src = await fileWriter.upload(file);

        if (file.type.includes('image')) {
            attachments.images.push({
                src: src,
                name: file.name,
                size: file.size
            });
        } else {
            attachments.files.push({
                src: src,
                name: file.name,
                size: file.size
            });
        }
    }

    return attachments;
}


async function resolveCode(msg) {
    var code = {
        language: msg.code.language,
        content: msg.code.content,
        stdin: msg.code.stdin,
        stdout: '',
        stderr: ''
    };

    var result = await runCode(code.language, code.content, code.stdin);

    code.stdout = result.stdout;
    code.stderr = result.stderr;

    return code;
}