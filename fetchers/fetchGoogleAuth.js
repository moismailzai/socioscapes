'use strict';
/**
 * This function requests authorization to use the Google APIs.
 *
 * See http://developers.google.com/api-client-library/javascript/reference/referencedocs.
 *
 * A function in MyNamespace (MyNamespace.myFunction).
 * @function getGoogleAuth
 * @memberof s
 * @param config {Object} Configuration parameters (.auth and .client) for the gapi.auth and gapi.client apis.
 * @param [callback] {Function} Optional callback.
 * @return this {Object}
 */
module.exports = function (config, callback) {
    gapi.auth.authorize(config.auth, function (token) {
        if (token && token.access_token) {
            gapi.client.load(config.client.name, config.client.version, function () {
                if (callback) {
                    callback();
                }
            });
        }
    });
};
