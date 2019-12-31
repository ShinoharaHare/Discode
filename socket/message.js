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

            const message = await Message.create({
                author: socket.user.id,
                channel: msg.channel,
                content: msg.content,
                attachments: attachments,
                code: code
            });

            io.to(message.channel).emit('message', {
                id: message.id,
                channel: message.channel,
                author: message.author,
                content: message.content,
                attachments: attachments,
                code: code
            });
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