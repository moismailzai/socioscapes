/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 * This method executes a Google Geocoder query for 'address' and returns the results in an object.
 *
 * Make sure you obtain Google auth and load the GAPI client first.
 *
 * @function fetchGoogleGeocode
 * @memberof! socioscapes
 * @param {String} address - The address around which the map around (eg. 'Toronto, Canada').
 * @return {Object} geocode - An object with latitude and longitude coordinates.
 */
function fetchGoogleGeocode(address) {
    var callback = newDispatcherCallback(arguments),
        geocoder = new google.maps.Geocoder(),
        geocode = {};
    geocoder.geocode({'address': address}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            geocode.lat = results[0].geometry.location.lat();
            geocode.long = results[0].geometry.location.lng();
            callback(geocode);
            return geocode;
        }
        alert('Error: Google Geocoder was unable to locate ' + address);
    });
}
module.exports = fetchGoogleGeocode;