/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 * This method tests the "URLiness" of a given string. It expects a string that fits the pattern
 * "protocol://my.valid.url/my.file" and supports the http, https, ftp, and ftps protocols.
 *
 * @function isValidUrl
 * @memberof! socioscapes
 * @param {string} url - This should be a valid http, https, ftp, or ftps URL and follow the
 * "protocol://my.valid.url/my.file" pattern.
 * @param [callback] - If the url passes validation, this optional callback can be used to do a server-side check for a
 * resource at that location (allowing you to bypass javascript CORS restrictions).
 * @returns {Boolean}
 */
function isValidUrl(url) {
    var callback = newDispatcherCallback(arguments),
        isValid = false;
    if (url) {
            if (typeof url === 'string' && /^(http|HTTP|https|HTTPS|ftp|FTP|ftps|FTPS):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/.test(url)) {
                isValid = true;
            } else {
                //console.log('Sorry, that is not a valid url. Currently, socioscapes supports the HTTP(S) and FTP(S) protocols. Valid URLS must begin with the protocol name followed by an address (eg. "ftp://socioscapes.com/myScape.json", "https://socioscapes.com/myScape.json").');
            }
    }
    callback(isValid);
    return isValid;
}
module.exports = isValidUrl;