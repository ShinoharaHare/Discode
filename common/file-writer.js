const fs = require('fs');
const path = require('path');
const md5 = require('md5');


function write(file, location) {
    const hash = file.md5 || md5(file.data);
    const id = hash + path.extname(file.name);
    var dir = path.resolve(`content/${location}`);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(`${dir}/${id}`, file.data);
    return id;
}

module.exports = {
    write
}