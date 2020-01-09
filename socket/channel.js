const { User, Channel, Message } = require('../common/models');

module.exports = (io) => {
    io.on('connection', async (socket) => {

        const channels = await Channel.find({
            $or: [
                { public: true },
                { 'members.id': socket.user.id }
            ]
        });

        for (let channel of channels) {
            joinRoom(socket, channel);
        }

        socket.on('disconnect', async () => {
            for (let id in global.onlineUsers) {
                const channel = await Channel.findById(id);
                leaveRoom(socket, channel);
            }
        });

        socket.on('createChannel', async (data) => {
            try {
                const doc = await Channel.create({
                    name: data.name,
                    icon: data.icon,
                    public: data.public,
                    members: data.public ? [] : [{ id: socket.user.id }]
                });

                var channel = {
                    id: doc.id,
                    name: doc.name,
                    icon: doc.icon,
                    public: doc.public,
                    members: doc.members
                };

                if (channel.public) {
                    for (let id in global.sockets) {
                        await joinRoom(global.sockets[id], channel);
                        global.sockets[id].emit('newChannel', channel);
                    }
                } else {
                    await joinRoom(socket, channel);
                    socket.emit('newChannel', channel);
                }

            } catch (err) {
                console.log(err);
            }
        });

        socket.on('invite', async (data) => {
            try {
                const channelDoc = await Channel.findById(data.channel);
                const user = await User.findOne({ username: data.username });

                if (channelDoc.members.every((x) => x.id != user.id)) {
                    channelDoc.members.push({ id: user.id });
                    const channel = await channelDoc.save();

                    const MessageDocs = await Message.find({ channel: channelDoc.id }).limit(50);
                    const messages = [];
                    for (let message of MessageDocs) {
                        messages.push({
                            id: message.id,
                            channel: message.channel,
                            author: message.author,
                            content: message.content,
                            attachments: message.attachments,
                            code: message.code
                        });
                    }

                    await global.sockets[user.id].emit('newChannel', {
                        id: channel.id,
                        name: channel.name,
                        icon: channel.icon,
                        public: channel.public,
                        members: channel.members,
                        messages, messages
                    });

                    await new Promise(resolve => setTimeout(resolve, 500));
                    joinRoom(global.sockets[user.id], channel);
                }
            } catch (err) {
                console.log(err);
            }
        });

    });
};


async function joinRoom(socket, channel) {
    if (socket && channel) {
        global.onlineUsers[channel.id].add(socket.user.id);
        await socket.join(channel.id);
        socket.broadcast.to(channel.id).emit('newMember', {
            channel: channel.id,
            member: { id: socket.user.id }
        });
    }
}

async function leaveRoom(socket, channel) {
    if (socket && channel) {
        global.onlineUsers[channel.id].delete(socket.user.id);
        await socket.leave(channel.id);
        if (channel.public) {
            socket.server.to(channel.id).emit('removeMember', {
                channel: channel.id,
                member: { id: socket.user.id }
            });
        }
    }
}