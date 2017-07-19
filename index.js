let google = require("googleapis");
let config = require('./config.json');
let _ = require("lodash");
let auth = require('./auth.js')

let pages = ["Category Tree!A1:C37", "List of concerns!A1:E10", "International Shop !A1:N24", "US - Canada Shop !A1:N24", "European Shop!A1:N24", "Swiss Shop!A1:M24", "UK Shop!A1:M24"]
let data = [];

let readExcelSheet = (auth, pages, callback) => {
    let range = pages.splice(0, 1)[0];
    let sheets = google.sheets('v4');
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
        let rows = response.values;
        if (rows.length == 0) {
            console.log('No data found.');
        } else {
            data.push(rows)
        }
        if (pages.length) {
            readExcelSheet(auth, pages, callback)
        } else {
            callback(null, data)
        }
    });
}

let searchByProductName = (name, callback) => {
    auth.auth(function(oauth2Client) {
        readExcelSheet(oauth2Client, pages, function(err, listArray) {
            if (!err) {
                let list = [];
                if (listArray) {
                    _.forEach(listArray, (val, key) => {
                        _.forEach(val, (val1, key1) => {
                            if (val1[1]) {
                                if (val1[1].match(new RegExp(name, 'gi'))) {
                                    let keyData = {};
                                    _.forEach(val1, (val2, key2) => {
                                        let keyName = val[0][key2]
                                        keyData[keyName] = val1[key2]
                                    })
                                    list.push(keyData)
                                }
                            }
                        })
                        if (key == listArray.length - 1) {
                            let final_result = {
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
    })
}



let searchByProductId = (id, callback) => {
    auth.auth(function(oauth2Client) {
        readExcelSheet(oauth2Client, pages, function(err, listArray) {
            if (!err) {
                let list = [];
                if (listArray.length) {
                    _.forEach(listArray, (val, key) => {
                        _.forEach(val, (val1, key1) => {
                            if (val1[0]) {
                                if (val1[0] == id) {
                                    let keyData = {};
                                    _.forEach(val1, (val2, key2) => {
                                        let keyName = val[0][key2]
                                        keyData[keyName] = val1[key2]
                                    })
                                    list.push(keyData)
                                }
                            }
                        })
                        if (key == listArray.length - 1) {
                            let final_result = {
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
    })
}

// searchByProductName("Moisturizing", function(err, data) {
//     if (err) {
//         console.log(err)
//         process.exit(0)
//     }
//     console.log(data)
// })

searchByProductId('7640149082067', function(err, data) {
    if (err) {
        console.log(err)
        process.exit(0)
    }
    console.log(data)
})