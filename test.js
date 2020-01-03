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


async function test() {
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    const response = await drive.files.create({
        resource: {
            name: 'Discode',
            mimeType: 'application/vnd.google-apps.folder'
        }
    })
    console.log(response);
}


test();