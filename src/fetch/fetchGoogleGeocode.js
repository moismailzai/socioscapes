/*jslint node: true */
/*global module, require, google, geocode, maps, GeocoderStatus*/
'use strict';
var newCallback = require('./../construct/newCallback.js');
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
    var callback = newCallback(arguments),
        geocoder = new google.maps.Geocoder(),
        geocode = {};
    geocoder.geocode({'address': address}, function (result, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            geocode.lat = result[0].geometry.location.lat();
            geocode.lng = result[0].geometry.location.lng();
            geocode.raw = result;
            callback(geocode);
        } else {
            console.log('Error: Google Geocoder was unable to locate ' + address);
        }
    });
    return this;
}
module.exports = fetchGoogleGeocode;