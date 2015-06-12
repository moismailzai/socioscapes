/**
 * This METHOD asonchronously fetches geometry from a WFS feature server. It expects GeoJson geometry and stores the
 * result in this.data.geoJson and can optionally return it in a callback.
 *
 * @function fetchWfsGeoJson
 * @param queryString {String} The query (as an escaped CQL string).
 * @param [queryBaseUrl] {String} A valid WFS feature server URL. If an URL is not provided, defaults to
 *                                this.data.wfsUrl.
 * @param [callback] {Object} An optional callback.
 * @return this {Object}
 */

// From http://codepen.io/KryptoniteDove/blog/load-json-file-locally-using-pure-javascript
module.exports = function (config, callback) {
    var _xobj = new XMLHttpRequest(),
        _url = config.url,
        _id = config.id;
    _xobj.overrideMimeType("application/json");
    _xobj.open('GET', _url, true);
    _xobj.onreadystatechange = function () {
        if (_xobj.readyState == 4 && _xobj.status == "200") {
            geom = {};
            geom.features = _xobj.responseText;
            geom.url = _url;
            geom.id = _id;
            callback(geom, true);
        }
    };
    _xobj.send(null);
};