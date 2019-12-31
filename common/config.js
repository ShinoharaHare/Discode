const process = require('process');

console.log(process.env.MONGOLAB_URI);

const config = {
    mongodbUrl: 'mongodb://localhost:27017/discode' || process.env.MONGOLAB_URI,
    port: 80,
    secret: '5ff567bdd7dfae2792c8ad5d5f10d6418804dfbb8ff8b03ebcdd2b7381e9bc7f',
};

module.exports = config;