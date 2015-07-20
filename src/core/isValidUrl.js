/**
 * This method tests the "URLiness" of a given string. It expects a string that fits the pattern
 * "protocol://my.valid.url/my.file" and supports the http, https, ftp, and ftps protocols. CORS prevents javascript
 * from fetching a resource that does not exist on the same domain, however, once-validated the url may be tested if a
 * callback is provided (presumably the callback would utilize a server-side script to test the url). If a callback is
 * not provided, isValidUrl returns its validation results as a boolean, otherwise it returns the results of the
 * callback. Since socioscapes methods and objects expect isValidUrl to return a boolean, you should ensure that your
 * callback returns one (non-boolean results are ignored).
 *
 * @function isValidUrl
 * @memberof! socioscapes
 * @param {string} url - This should be a valid http, https, ftp, or ftps URL and follow the
 * "protocol://my.valid.url/my.file" pattern.
 * @param [callback] - If the url passes validation, this optional callback can be used to do a server-side check for a
 * resource at that location (allowing you to bypass javascript CORS restrictions).
 * @returns {Boolean}
 */
module.exports = function isValidUrl(url) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? callback:function(result) { return result; };
    // Regex taken almost verbatim from TLindig @ http://stackoverflow.com/a/18593669/4612922
    var isValid;
    if (typeof url === 'string' && /^(http|HTTP|https|HTTPS|ftp|FTP|ftps|FTPS):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/.test(url)) {
        isValid = true;
        if (callback) {
            callback(url, function(urlExists) {
                if (typeof urlExists === 'boolean') {
                    isValid = urlExists;
                } else {
                    console.log('Sorry, the callback did not produce a valid (boolean) result.');
                }
            });
        }
    } else {
        isValid = false;
        console.log('Sorry, that is not a valid url. Currently, socioscapes supports the HTTP(S) and FTP(S) protocols. Valid URLS must begin with the protocol name followed by an address (eg. "ftp://socioscapes.com/myScape.json", "https://socioscapes.com/myScape.json").');
    }
    callback(isValid);
};