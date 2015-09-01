/*jslint node: true */
/*global module, require, google*/
'use strict';
/**
 * This method asynchronously fetches geometry from a Web Feature Service server. It expects GeoJson and returns the
 * queried url, the id parameter, and the fetched features.
 *
 * @function fetchWfs
 * @memberof! socioscapes
 * @return {Object} geom - An object with .features, .url, and .id members. This can be used to populate myLayer.geom.
 */
function fetchWfs(that, url) {
    var newCallback = fetchWfs.prototype.newCallback;
    //
    var callback = newCallback(arguments),
        xobj = new XMLHttpRequest(),
        geom;
    xobj.overrideMimeType("application/json"); // From http://codepen.io/KryptoniteDove/blog/load-json-file-locally-using-pure-javascript
    xobj.open('GET', url, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState === 4 && xobj.status === 200) {
            geom = {};
            geom.geoJson = JSON.parse(xobj.responseText);
            geom.meta = {};
            geom.meta.crs = geom.geoJson.crs.properties.name;
            geom.meta.totalFeatures = parseInt(geom.geoJson.totalFeatures);
            geom.meta.type = 'geoJson';
            geom.meta.source = 'Web Feature Service';
            geom.meta.wfsQueryString = url;
            callback(geom);
        }
    };
    xobj.send(null);
    return that;
}
module.exports = fetchWfs;