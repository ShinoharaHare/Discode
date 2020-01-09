global.onlineUsers = new Proxy({}, {
    get(target, name) {
        target[name] = target[name] || new Set();
        return target[name];
    }
});

global.userStatus = new Proxy({}, {
    get(target, name) {
        return target[name] || 'offline';
    }
});

global.sockets = {};
