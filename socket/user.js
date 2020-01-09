module.exports = (io) => {
    io.on('connection', (socket) => {
        global.userStatus[socket.user.id] = 'online';
        global.sockets[socket.user.id] = socket;

        socket.broadcast.emit('changeStatus', {
            id: socket.user.id,
            status: global.userStatus[socket.user.id]
        });

        socket.on('disconnect', () => {
            delete global.userStatus[socket.user.id];
            io.emit('changeStatus', {
                id: socket.user.id,
                status: 'offline'
            });
        });

        socket.on('changeStatus', (status) => {
            global.userStatus[socket.user.id] = status;

            io.emit('changeStatus', {
                id: socket.user.id,
                status: status
            });
        });
    });
};