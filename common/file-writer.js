const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const { Readable } = require('stream');
const { google } = require('googleapis');


// Load client secrets from a local file.
const content = fs.readFileSync('credentials.json');
// Authorize a client with credentials, then call the Google Drive API.
const credentials = JSON.parse(content);
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
const token = fs.readFileSync('token.json')
oAuth2Client.setCredentials(JSON.parse(token));


// Discode (1uQ28CIHeYW1TMjedb8arcm03wUDNlCwE)
// avatar (1Py-zILz2SPPBszmR2W3ZBXD4hyQB9h5e)
// icon (1kd-hQ__aXRF1NocvEnH5AFbp96MQbgcH)
// channel (1XOjcvG-fAVbvezKcHTQMW-5hFGatgok8)

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

async function upload(file) {
    const name = /^file\..+$/.test(file.name) ? file.md5 + path.extname(file.name) : file.name;

    const drive = google.drive({ version: 'v3', auth: oAuth2Client });

    const meta = {
        'parents': ['1uQ28CIHeYW1TMjedb8arcm03wUDNlCwE'],
        'name': name
    };

    const media = {
        mimeType: file.type,
        body: new Readable({
            read() {
                this.push(file.data);
                this.push(null);
            }
        })
    };

    var response = await drive.files.create({
        resource: meta,
        media: media,
        fields: 'webContentLink'
    });

    return response.data.webContentLink;
}


module.exports = {
    write,
    upload
}