/*jslint node: true */
/*global module, require*/
'use strict';
import newCallback from './../construct/newCallback.js';

/**
 * This internal method asynchronously fetches geometry from a Web Feature Service server. It expects geoJson and
 * returns the queried url, the id parameter, and the fetched features.
 *
 * If successful, callsback with fetch results.
 *
 * @function fetchWfs
 * @memberof socioscapes
 * @param {Object} scapeObject - The {@link ScapeObject} within which the query results will be stored.
 * @param {string} url - A valid wfs url that returns geoJson FeatureCollection.
 * @return {Object} scapeObject - The {@link ScapeObject} within which the query results will be stored.
 */
export default function fetchWfs(scapeObject, url) {
    let callback = newCallback(arguments),
        xobj = new XMLHttpRequest(),
        geom;
    xobj.overrideMimeType('application/json');
    xobj.open('GET', url, true);
    xobj.onreadystatechange = function() {
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
    return scapeObject;
}
