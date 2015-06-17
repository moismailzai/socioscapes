'use strict';
/**
 * This METHOD executes a Google Geocoder query for 'address' and appends the results to the calling object's
 * .geo_cache.lat and .geo_cache.long members.
 *
 * Make sure you obtain a google auth token and load the appropriate client first.
 *
 * @function getLatLong
 * @param address {String}
 * @param [callback] {Function} Optional callback.
 * @return this {Object}
 */
module.exports = function (address) {

    var geocoder = new google.maps.Geocoder(),
        geoCodedAddress = {};

    geocoder.geocode({'address': address}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            geoCoded.lat = results[0].geometry.location.lat();
            geoCoded.long = results[0].geometry.location.lng();
            return geoCodedAddress;
        } else {
            alert('Error: Google Geocoder was unable to locate ' + address);
        }
    });
};