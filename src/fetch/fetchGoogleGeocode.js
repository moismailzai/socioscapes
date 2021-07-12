/*jslint node: true */
/*global module, require, google*/
'use strict';
import newCallback from './../construct/newCallback.js';

/**
 * This internal method executes a Google Geocoder query for 'address' and returns the results in an object. Make sure
 * you obtain Google auth and load the GAPI client first.
 *
 * @function fetchGoogleGeocode
 * @memberof socioscapes
 * @param {String} address - The address around which the map around (eg. 'Toronto, Canada').
 * @return {Object} geocode - An object with latitude and longitude coordinates.
 */
export default function fetchGoogleGeocode(address) {
    let callback = newCallback(arguments),
        geocoder = new google.maps.Geocoder(),
        geocode = {},
        defaultLatLng = {lat: 49.2486050497781, lng: -123.107850477883};
    try {
        geocoder.geocode({'address': address}, function(result, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                geocode.lat = result[0].geometry.location.lat();
                geocode.lng = result[0].geometry.location.lng();
                geocode.raw = result;
                callback(geocode);
            } else {
                console.log(
                    'Error: Google Geocoder was unable to locate ' + address + ', falling back to Vancouver as a default.');
                callback(defaultLatLng);
            }
        });
    } catch {
        console.log('could not initialize Google Geocoder, falling back to Vancouver as a default.');
        callback(defaultLatLng);
    }
}
