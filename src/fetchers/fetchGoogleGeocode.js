/*jslint node: true */
/*global socioscapes, module, google, require, geocode, maps*/
'use strict';
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
module.exports = function fetchGoogleGeocode(address) {
    var geocoder = new google.maps.Geocoder(),
        geocode = {};
    geocoder.geocode({'address': address}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            geocode.lat = results[0].geometry.location.lat();
            geocode.long = results[0].geometry.location.lng();
            return geocode;
        }
        alert('Error: Google Geocoder was unable to locate ' + address);
    });
};