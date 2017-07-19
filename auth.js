var google = require("googleapis");
var config = require('./config.json');

module.exports = {
    auth: (callback) => {
        let OAuth2 = google.auth.OAuth2;
        let oauth2Client = new OAuth2(config.CLIENT_ID, config.CLIENT_SECRET, config.REDIRECT_URL);
        oauth2Client.setCredentials({
            access_token: config.access_token,
            token_type: config.token_type,
            expiry_date: config.expiry_date,
            refresh_token: config.refresh_token
        }, (err) => { console.log(err) });
        callback(oauth2Client)
    }
};