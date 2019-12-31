module.exports = {
    onlineUsers: new Proxy({}, {
        get(target, name) {
            target[name] = target[name] || new Set();
            return target[name];
        }
    }),
    userStatus: new Proxy({}, {
        get(target, name) {
            return target[name] || 'offline';
        }
    }),
    sockets: {}
}