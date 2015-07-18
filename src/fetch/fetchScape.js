// TODO fetchScape(argument) calls isValidUrl(argument); if true, retrieves and converts json file at url; else checks isValidName(argument); if true, checks for window[name] and returns it, else returns false
var isValidName = require('../core/isValidName.js'),
    isValidUrl = require('../core/isValidUrl.js');
module.exports = function fetchScape(name, url, callback) {
    name = isValidName(name) ? name:false;
    callback = typeof callback === 'function' ? callback:function(result) { return result; };
    if (name) {
        isValidUrl(url, function (result) {
            if (result) {
                // change
                doStuff(url, function (scape) {
                    callback(scape);
                });
            } else if (!url) {
                if (window[name] && window[name].meta && window[name].meta.type === 'scapeJson') {
                    callback(window[name]);
                }
            } else {
                callback(false);
            }

        });
    } else {
        callback(false);
    }
};