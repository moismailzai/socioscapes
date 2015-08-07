/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 * This method asynchronously fetches geometry from a Web Feature Service server. It expects GeoJson and returns the
 * queried url, the id parameter, and the fetched features.
 *
 * @function fetchWfs
 * @memberof! socioscapes
 * @param {Object} config - An object with configuration options for the Web Feature Service fetchScapeObject.
 * @param {String} config.url - The Web Feature Service query url.
 * @param {String} config.id - The id property (these values are matched to the values of a corresponding data column).
 * @param {Object} callback - This is a mandatory callback that returns the results of the asynchronous fetchScapeObject.
 * @return {Object} geom - An object with .features, .url, and .id members. This can be used to populate myLayer.geom.
 */
function fetchWfs(url) {
    var callback = newDispatcherCallback(arguments),
        _xobj = new XMLHttpRequest(),
        geom;
    _xobj.overrideMimeType("application/json"); // From http://codepen.io/KryptoniteDove/blog/load-json-file-locally-using-pure-javascript
    _xobj.open('GET', url, true);
    _xobj.onreadystatechange = function () {
        if (_xobj.readyState == 4 && _xobj.status == "200") {
            geom = {};
            geom.features = _xobj.responseText;
            geom.url = url;
            callback(geom);
            return geom;
        }
    };
    _xobj.send(null);
}
module.exports = fetchWfs;