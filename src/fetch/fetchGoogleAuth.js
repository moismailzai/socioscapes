/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 * This function requests authorization to use a Google API, and if received, loads that API client. For more information
 * on Google APIs, see {@link http://developers.google.com/api-client-library/javascript/reference/referencedocs}.
 *
 * @function fetchGoogleAuth
 * @memberof! socioscapes
 * @param {Object} config - An object with configuration options for Google APIs.
 * @param {Object} config.auth - Configuration options for the auth request (eg. .client_id, .scope, .immediate)
 * @param {Object} config.client.name - The name of the Google API client to load.
 * @param {Object} config.client.version - The version of the Google API client to load.
 * @param {Function} callback - This is an optional callback that returns the result of the client load.
 * @return this {Object}
 */
function fetchGoogleAuth(config) {
    var callback = newDispatcherCallback(arguments);
    gapi.auth.authorize(config.auth, function (token) {
        if (token && token.access_token) {
            gapi.client.load(config.client.value, config.client.version, function (result) {
                callback(result);
                return result;
            });
        }
    });
}
module.exports = fetchGoogleAuth;