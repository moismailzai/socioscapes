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
 * @return {Object} geom - An object with .features, .url, and .id members. This can be used to populate myLayer.geom.
 */
function fetchWfs(url) {
    var callback = newDispatcherCallback(arguments),
        xobj = new XMLHttpRequest(),
        geom;
    xobj.overrideMimeType("application/json"); // From http://codepen.io/KryptoniteDove/blog/load-json-file-locally-using-pure-javascript
    xobj.open('GET', url, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") { // todo jshin error about == instead of === but when I change to === function does not behave as expected
            geom = {};
            geom.features = xobj.responseText;
            geom.url = url;
            callback(geom);
            return geom;
        }
    };
    xobj.send(null);
}
module.exports = fetchWfs;