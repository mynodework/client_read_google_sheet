var google = require("googleapis");
var config = require('./config.json');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(config.CLIENT_ID, config.CLIENT_SECRET, config.REDIRECT_URL);
var _ = require('lodash');

oauth2Client.setCredentials({
    access_token: config.access_token,
    token_type: config.token_type,
    expiry_date: config.expiry_date,
    refresh_token: config.refresh_token
}, (err) => { console.log(err) });
var pages = ["Category Tree!A1:C37", "List of concerns!A1:E10", "International Shop !A1:N24", "US - Canada Shop !A1:N24", "European Shop!A1:N24", "Swiss Shop!A1:M24", "UK Shop!A1:M24"]
var data = [];

function listMajors(auth, pages, callback) {
    var range = pages.splice(0, 1)[0];
    var sheets = google.sheets('v4');
    sheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: config.fileid,
        range: range,
    }, function(err, response) {
        if (err) {
            // console.log('The API returned an error: ' + err);
            callback(err, [])
            return;
        }
        var rows = response.values;
        if (rows.length == 0) {
            console.log('No data found.');
        } else {
            data.push(rows)
        }
        if (pages.length) {
            listMajors(auth, pages, callback)
        } else {
            callback(null, data)
        }
    });
}

function searchByProductName(name, callback) {
    listMajors(oauth2Client, pages, function(err, listArray) {
        if (!err) {
            var list = [];
            if (listArray) {
                _.forEach(listArray, (val, key) => {
                    _.forEach(val, (val1, key1) => {
                        if (val1[1]) {
                            if (val1[1].match(new RegExp(name, 'gi'))) {
                                var keyData = {};
                                for (var i = 0; i < val1.length; i++) {
                                    var keyName = val[0][i]
                                    keyData[keyName] = val1[i]
                                }
                                list.push(keyData)
                            }
                        }
                    })
                    if (key == listArray.length - 1) {
                    	var final_result = {
                            result_found: list.length,
                            result: list
                        }
                        callback(null, final_result)
                        return false
                    }
                })
            }
        } else {
            callback(err, [])
        }
    })
}

// searchByProductName("Moisturizing", function(err, data) {
//     if (err) {
//         console.log(err)
//         process.exit(0)
//     }
//     console.log(data)
// })

searchByProductId('640149082067', function(err, data) {
    if (err) {
        console.log(err)
        process.exit(0)
    }
    console.log(data)
})

function searchByProductId(id, callback) {
    listMajors(oauth2Client, pages, function(err, listArray) {
        if (!err) {
            var list = [];
            if (listArray.length) {
                _.forEach(listArray, (val, key) => {
                    _.forEach(val, (val1, key1) => {
                        if (val1[0]) {
                            if (val1[0] == id) {
                                var keyData = {};
                                for (var i = 0; i < val1.length; i++) {
                                    var keyName = val[0][i]
                                    keyData[keyName] = val1[i]
                                }
                                list.push(keyData)
                            }
                        }
                    })
                    if (key == listArray.length - 1) {	
                        var final_result = {
                            result_found: list.length,
                            result: list
                        }
                        callback(null, final_result)
                        return false
                    }
                })
            } else {
                callback(null, [])
            }
        } else {
            callback(err, [])
        }
    })
}