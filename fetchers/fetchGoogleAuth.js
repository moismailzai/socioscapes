/**
 * This function requests authorization for the Google APIs.
 *
 * See http://developers.google.com/api-client-library/javascript/reference/referencedocs.
 *
 * @function getGoogleAuth
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
