const { userStatus, sockets } = require('../common/globals');

module.exports = (io) => {
    io.on('connection', (socket) => {
        userStatus[socket.user.id] = 'online';
        sockets[socket.user.id] = socket;

        socket.broadcast.emit('changeStatus', {
            id: socket.user.id,
            status: userStatus[socket.user.id]
        });

        socket.on('disconnect', () => {
            delete userStatus[socket.user.id];
            io.emit('changeStatus', {
                id: socket.user.id,
                status: 'offline'
            });
        });

        socket.on('changeStatus', (status) => {
            userStatus[socket.user.id] = status;

            io.emit('changeStatus', {
                id: socket.user.id,
                status: status
            });
        });
    });
};