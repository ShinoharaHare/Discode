const { User, Channel } = require('../common/models');
const { onlineUsers, sockets } = require('../common/globals');

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
            for (let id in onlineUsers) {
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
                    for (let id in sockets) {
                        await joinRoom(sockets[id], channel);
                        sockets[id].emit('newChannel', channel);
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

                    await joinRoom(sockets[user.id], channel);

                    sockets[user.id].emit('newChannel', {
                        id: channel.id,
                        name: channel.name,
                        icon: channel.icon,
                        public: channel.public,
                        members: channel.members
                    });
                }
            } catch (err) {
                console.log(err);
            }
        });

    });
};


async function joinRoom(socket, channel) {
    if (socket && channel) {
        onlineUsers[channel.id].add(socket.user.id);
        await socket.join(channel.id);
        socket.broadcast.emit('newMember', {
            channel: channel.id,
            member: { id: socket.user.id }
        });
    }
}

async function leaveRoom(socket, channel) {
    if (socket && channel) {
        onlineUsers[channel.id].delete(socket.user.id);
        await socket.leave(channel.id);
        if (channel.public) {
            socket.server.emit('removeMember', {
                channel: channel.id,
                member: { id: socket.user.id }
            });
        }
    }
}