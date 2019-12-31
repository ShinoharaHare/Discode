const fs = require('fs');
const { google } = require('googleapis');


// Load client secrets from a local file.
const content = fs.readFileSync('credentials.json');
// Authorize a client with credentials, then call the Google Drive API.
const credentials = JSON.parse(content);
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
const token = fs.readFileSync('token.json')
oAuth2Client.setCredentials(JSON.parse(token));


async function upload() {
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    
    const meta = {
        'parents': ['1uQ28CIHeYW1TMjedb8arcm03wUDNlCwE'],
        'name': '190564239dd0fa259d6794a4df719899.png'
    };

    const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream('D:/Projects/專題/Discode-Back-End/content/icon/190564239dd0fa259d6794a4df719899.png')
    };

    var response = await drive.files.create({
        resource: meta,
        media: media,
        fields: 'id'
    });

    response = await drive.files.get({
        fileId: response.data.id,
        fields: 'webContentLink'
    });
    
    return response.data.webContentLink;
}

console.log(fs.createReadStream('D:/Projects/專題/Discode-Back-End/content/icon/190564239dd0fa259d6794a4df719899.png'))