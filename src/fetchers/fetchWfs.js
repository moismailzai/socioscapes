/*jslint node: true */
/*global socioscapes, module, google, require*/
'use strict';
/**
 * This METHOD asynchronously fetches geometry from a Web Feature Service server. It expects GeoJson geometry and
 * returns the queried url, the id parameter, and the fetched GeoJson features.
 *
 * @function fetchWfs
 * @memberof! socioscapes
 * @param {Object} config - An object with configuration options for the Web Feature Service fetch.
 * @param {String} config.url - The Web Feature Service query url.
 * @param {String} config.id - The id property (these values are matched to the values of a corresponding data column).
 * @param {Object} callback - This is a mandatory callback that returns the results of the asynchronous fetch.
 * @return {Object} geom - An object with .features, .url, and .id members. This can be used to populate myLayer.geom.
 */
module.exports = function fetchWfs(config, callback) {
    var _xobj = new XMLHttpRequest(),
        _url = config.url,
        _id = config.id,
        geom;
    callback = (typeof callback === 'function') ? callback : function () { };
    _xobj.overrideMimeType("application/json"); // From http://codepen.io/KryptoniteDove/blog/load-json-file-locally-using-pure-javascript
    _xobj.open('GET', _url, true);
    _xobj.onreadystatechange = function () {
        if (_xobj.readyState === 4 && _xobj.status === "200") {
            geom = {};
            geom.features = _xobj.responseText;
            geom.url = _url;
            geom.id = _id;
            callback(geom, true);
        }
    };
    _xobj.send(null);
};