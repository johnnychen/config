var request = require('request');
var current = require('../package.json');
var notifier = require('node-notifier');
var semver = require('semver');


function checkVersion(success, fail) {

    request("http://gitlab.alibaba-inc.com/form/tnpm-fms/raw/master/version.json", function (err, response, body) {
        if (!err) {
            var latest = JSON.parse(body);
            // 当前版本 < 最新版本
            if (semver.lt(current.version, latest.version)) {
                fail && fail(latest.message);
                // 当前版本 >= 最新版本
            } else {
                success && success();
            }
        } else {
            console.log(err);
        }
    });
}

module.exports = {
    check: function (callback) {
        checkVersion(callback, function (message) {
            console.log(message);
        })
    },
    checkAndNotify: function (callback) {
        checkVersion(callback, function (message) {
            console.log(message);
            notifier.notify({
                'title': 'FMS npm 更新',
                'message': message, //TODO ...
                sound: true, // Only Notification Center or Windows Toasters
                wait: true
            });
        })
    }
};